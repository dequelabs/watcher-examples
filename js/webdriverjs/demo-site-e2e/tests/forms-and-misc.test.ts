import { browser, setTestMeta } from './setup'
import { By } from 'selenium-webdriver'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/forms-and-misc.test.ts'

// =============================================================================
// LOGIN & REGISTRATION
// =============================================================================
describe('Login & Registration', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/login_register`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should interact with the login form fields', async () => {
    setTestMeta(TEST_FILE, 'Login & Registration', 'should interact with the login form fields')

    try {
      const usernameInput = await browser.findElement(By.css('input[name="login_email"]'))
      await usernameInput.click()
      await wait(200)
      await usernameInput.sendKeys('testuser@example.com')
      await wait(300)
    } catch { /* ignore */ }

    try {
      const passwordInput = await browser.findElement(By.css('input[type="password"]'))
      await passwordInput.click()
      await wait(200)
      await passwordInput.sendKeys('password123')
      await wait(300)
    } catch { /* ignore */ }

    try {
      const checkbox = await browser.findElement(By.css('input[type="checkbox"]'))
      await checkbox.click()
      await wait(200)
    } catch { /* ignore */ }
  })

  it('should switch to the registration tab and fill fields', async () => {
    setTestMeta(TEST_FILE, 'Login & Registration', 'should switch to the registration tab and fill fields')

    await browser.executeScript(`
      const tabs = document.querySelectorAll('a, button, .nav-link');
      for (const t of tabs) {
        if (t.textContent.trim() === 'Register' && t.offsetWidth > 0) { t.click(); break; }
      }
    `)
    await wait(400)

    try {
      const usernameInput = await browser.findElement(By.css('input[name="register_username"]'))
      await usernameInput.sendKeys('newuser123')
      await wait(300)
    } catch { /* ignore */ }

    try {
      const emailInput = await browser.findElement(By.css('input[name="register_email"]'))
      await emailInput.sendKeys('newuser@example.com')
      await wait(300)
    } catch { /* ignore */ }

    try {
      const passwordInput = await browser.findElement(By.css('input[name="register_password"]'))
      await passwordInput.sendKeys('securepass456')
      await wait(300)
    } catch { /* ignore */ }
  })
})

// =============================================================================
// CHECKOUT FLOW
// =============================================================================
describe('Checkout Flow', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/shop_checkout`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should fill out the billing form', async () => {
    setTestMeta(TEST_FILE, 'Checkout Flow', 'should fill out the billing form')

    const fields = [
      { selector: 'input[name="first_name"]', value: 'Jane' },
      { selector: 'input[name="last_name"]', value: 'Doe' },
      { selector: 'input[name="company"]', value: 'Acme Corp' },
      { selector: 'input[name="street_address"]', value: '123 Main St' },
      { selector: 'input[name="city"]', value: 'Springfield' },
      { selector: 'input[name="postcode"]', value: '62701' },
      { selector: 'input[name="phone"]', value: '555-0123' },
      { selector: 'input[name="email"]', value: 'jane@example.com' }
    ]

    for (const { selector, value } of fields) {
      try {
        const input = await browser.findElement(By.css(selector))
        await input.click()
        await wait(100)
        await input.sendKeys(value)
        await wait(200)
      } catch { /* ignore */ }
    }
  })

  it('should interact with country dropdown and payment methods', async () => {
    setTestMeta(TEST_FILE, 'Checkout Flow', 'should interact with country dropdown and payment methods')

    await browser.executeScript(`
      const select = document.querySelector('select');
      if (select) {
        select.selectedIndex = 2;
        select.dispatchEvent(new Event('change', {bubbles: true}));
      }
    `)
    await wait(300)

    await browser.executeScript(`
      const select = document.querySelector('select');
      if (select) {
        select.selectedIndex = 5;
        select.dispatchEvent(new Event('change', {bubbles: true}));
      }
    `)
    await wait(300)

    await scrollDown(400)

    const radios = await browser.findElements(By.css('input[type="radio"]'))
    for (let i = 0; i < Math.min(radios.length, 4); i++) {
      try {
        await radios[i].click()
        await wait(300)
      } catch { /* ignore */ }
    }
  })
})

// =============================================================================
// CONTACT & FAQ
// =============================================================================
describe('Contact & FAQ', () => {
  it('should fill out the contact form', async () => {
    setTestMeta(TEST_FILE, 'Contact & FAQ', 'should fill out the contact form')

    await browser.get(`${BASE_URL}/contact`)
    await wait(500)
    await dismissCookieBanner()

    try {
      const nameInput = await browser.findElement(By.css('input[name="name"]'))
      await nameInput.sendKeys('Test User')
      await wait(200)
    } catch { /* ignore */ }

    try {
      const emailInput = await browser.findElement(By.css('input[name="email"]'))
      await emailInput.sendKeys('test@example.com')
      await wait(200)
    } catch { /* ignore */ }

    await scrollDown(300)
    await scrollDown(300)
  })

  it('should expand and collapse FAQ accordions', async () => {
    setTestMeta(TEST_FILE, 'Contact & FAQ', 'should expand and collapse FAQ accordions')

    await browser.get(`${BASE_URL}/faq`)
    await wait(500)
    await dismissCookieBanner()

    const accordionBtns = await browser.findElements(By.css('.accordion-button'))
    const count = Math.min(accordionBtns.length, 9)
    for (let i = 0; i < count; i++) {
      try {
        await accordionBtns[i].click()
        await wait(300)
      } catch { /* ignore */ }
    }
    for (let i = 0; i < count; i++) {
      try {
        await accordionBtns[i].click()
        await wait(200)
      } catch { /* ignore */ }
    }
  })

  it('should browse the about page', async () => {
    setTestMeta(TEST_FILE, 'Contact & FAQ', 'should browse the about page')

    await browser.get(`${BASE_URL}/about`)
    await wait(500)
    await dismissCookieBanner()

    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollToBottom()
  })
})
