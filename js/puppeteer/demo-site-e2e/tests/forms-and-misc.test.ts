import { page, setTestMeta } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/forms-and-misc.test.ts'

// =============================================================================
// LOGIN & REGISTRATION
// =============================================================================
describe('Login & Registration', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/login_register`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should interact with the login form fields', async () => {
    setTestMeta(TEST_FILE, 'Login & Registration', 'should interact with the login form fields')
    const usernameInput = await page.$('input[name="login_email"], input[placeholder*="name" i]')
    if (usernameInput) {
      await usernameInput.click()
      await wait(200)
      await usernameInput.type('testuser@example.com')
      await wait(300)
    }

    const passwordInput = await page.$('input[name="login_password"], input[type="password"]')
    if (passwordInput) {
      await passwordInput.click()
      await wait(200)
      await passwordInput.type('password123')
      await wait(300)
    }

    const checkbox = await page.$('input[type="checkbox"]')
    if (checkbox) {
      await checkbox.click()
      await wait(200)
    }
  })

  it('should switch to the registration tab and fill fields', async () => {
    setTestMeta(TEST_FILE, 'Login & Registration', 'should switch to the registration tab and fill fields')
    const registerTab = await page.$('a:has-text("Register"), button:has-text("Register"), .nav-link:has-text("Register")')
    if (registerTab) {
      await registerTab.click()
      await wait(400)
    }

    const usernameInput = await page.$('input[name="register_username"], input[placeholder*="Username" i]')
    if (usernameInput) {
      await usernameInput.type('newuser123')
      await wait(300)
    }

    const emailInput = await page.$('input[name="register_email"], input[placeholder*="email" i]')
    if (emailInput) {
      await emailInput.type('newuser@example.com')
      await wait(300)
    }

    const passwordInput = await page.$('input[name="register_password"], input[type="password"]')
    if (passwordInput) {
      await passwordInput.type('securepass456')
      await wait(300)
    }
  })
})

// =============================================================================
// CHECKOUT FLOW
// =============================================================================
describe('Checkout Flow', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop_checkout`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should fill out the billing form', async () => {
    setTestMeta(TEST_FILE, 'Checkout Flow', 'should fill out the billing form')
    const fields = [
      { selector: 'input[placeholder*="First" i], input[name="first_name"]', value: 'Jane' },
      { selector: 'input[placeholder*="Last" i], input[name="last_name"]', value: 'Doe' },
      { selector: 'input[placeholder*="Company" i], input[name="company"]', value: 'Acme Corp' },
      { selector: 'input[placeholder*="Street" i], input[name="street_address"]', value: '123 Main St' },
      { selector: 'input[placeholder*="City" i], input[name="city"]', value: 'Springfield' },
      { selector: 'input[placeholder*="Postcode" i], input[name="postcode"]', value: '62701' },
      { selector: 'input[placeholder*="Phone" i], input[name="phone"]', value: '555-0123' },
      { selector: 'input[placeholder*="Email" i], input[name="email"]', value: 'jane@example.com' }
    ]

    for (const { selector, value } of fields) {
      const input = await page.$(selector)
      if (input) {
        await input.click()
        await wait(100)
        await input.type(value)
        await wait(200)
      }
    }
  })

  it('should interact with country dropdown and payment methods', async () => {
    setTestMeta(TEST_FILE, 'Checkout Flow', 'should interact with country dropdown and payment methods')
    const selects = await page.$$('select')
    if (selects.length > 0) {
      await page.select('select', '2')
      await wait(300)
    }

    await scrollDown(400)

    const radios = await page.$$('input[type="radio"]')
    for (let i = 0; i < Math.min(radios.length, 4); i++) {
      await radios[i].click()
      await wait(300)
    }
  })
})

// =============================================================================
// CONTACT & FAQ
// =============================================================================
describe('Contact & FAQ', () => {
  it('should fill out the contact form', async () => {
    setTestMeta(TEST_FILE, 'Contact & FAQ', 'should fill out the contact form')
    await page.goto(`${BASE_URL}/contact`)
    await wait(500)
    await dismissCookieBanner()

    const nameInput = await page.$('input[name="name"], input[placeholder*="Name" i]')
    if (nameInput) {
      await nameInput.type('Test User')
      await wait(200)
    }

    const emailInput = await page.$('input[name="email"], input[placeholder*="Email" i]')
    if (emailInput) {
      await emailInput.type('test@example.com')
      await wait(200)
    }

    await scrollDown(300)
    await scrollDown(300)
  })

  it('should expand and collapse FAQ accordions', async () => {
    setTestMeta(TEST_FILE, 'Contact & FAQ', 'should expand and collapse FAQ accordions')
    await page.goto(`${BASE_URL}/faq`)
    await wait(500)
    await dismissCookieBanner()

    const accordionBtns = await page.$$('.accordion-button, button.faq-accordion, .faq__item button')
    for (let i = 0; i < Math.min(accordionBtns.length, 9); i++) {
      await accordionBtns[i].click()
      await wait(300)
    }
    for (let i = 0; i < Math.min(accordionBtns.length, 9); i++) {
      await accordionBtns[i].click()
      await wait(200)
    }
  })

  it('should browse the about page', async () => {
    setTestMeta(TEST_FILE, 'Contact & FAQ', 'should browse the about page')
    await page.goto(`${BASE_URL}/about`)
    await wait(500)
    await dismissCookieBanner()

    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollToBottom()
  })
})
