import 'mocha'
import '@wdio/globals'
import './setup'
import { controller } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

const TEST_FILE = 'forms-and-misc.test.ts'

// =============================================================================
// LOGIN & REGISTRATION
// =============================================================================
describe('Login & Registration', () => {
  beforeEach(async () => {
    await browser.url(`${BASE_URL}/login_register`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should interact with the login form fields', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with the login form fields',
      describe_titles: ['Login & Registration']
    })

    try {
      const usernameInput = await browser.$('input[name="login_email"]')
      if (await usernameInput.isDisplayed()) {
        await usernameInput.click()
        await wait(200)
        await usernameInput.setValue('testuser@example.com')
        await wait(300)
      }
    } catch { /* ignore */ }

    try {
      const passwordInput = await browser.$('input[type="password"]')
      if (await passwordInput.isDisplayed()) {
        await passwordInput.click()
        await wait(200)
        await passwordInput.setValue('password123')
        await wait(300)
      }
    } catch { /* ignore */ }

    try {
      const checkbox = await browser.$('input[type="checkbox"]')
      if (await checkbox.isDisplayed()) {
        await checkbox.click()
        await wait(200)
      }
    } catch { /* ignore */ }
  })

  it('should switch to the registration tab and fill fields', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should switch to the registration tab and fill fields',
      describe_titles: ['Login & Registration']
    })

    try {
      const registerTab = await browser.$('a=Register')
      if (await registerTab.isDisplayed()) {
        await registerTab.click()
        await wait(400)
      }
    } catch { /* ignore */ }

    try {
      const usernameInput = await browser.$('input[name="register_username"]')
      if (await usernameInput.isDisplayed()) {
        await usernameInput.setValue('newuser123')
        await wait(300)
      }
    } catch { /* ignore */ }

    try {
      const emailInput = await browser.$('input[name="register_email"]')
      if (await emailInput.isDisplayed()) {
        await emailInput.setValue('newuser@example.com')
        await wait(300)
      }
    } catch { /* ignore */ }

    try {
      const passwordInput = await browser.$('input[name="register_password"]')
      if (await passwordInput.isDisplayed()) {
        await passwordInput.setValue('securepass456')
        await wait(300)
      }
    } catch { /* ignore */ }
  })
})

// =============================================================================
// CHECKOUT FLOW
// =============================================================================
describe('Checkout Flow', () => {
  beforeEach(async () => {
    await browser.url(`${BASE_URL}/shop_checkout`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should fill out the billing form', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should fill out the billing form',
      describe_titles: ['Checkout Flow']
    })

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
        const input = await browser.$(selector)
        if (await input.isDisplayed()) {
          await input.click()
          await wait(100)
          await input.setValue(value)
          await wait(200)
        }
      } catch { /* ignore */ }
    }
  })

  it('should interact with country dropdown and payment methods', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with country dropdown and payment methods',
      describe_titles: ['Checkout Flow']
    })

    try {
      const countrySelect = await browser.$('select')
      if (await countrySelect.isDisplayed()) {
        await countrySelect.selectByIndex(2)
        await wait(300)
        await countrySelect.selectByIndex(5)
        await wait(300)
      }
    } catch { /* ignore */ }

    await scrollDown(400)

    const radios = await browser.$$('input[type="radio"]')
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
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should fill out the contact form',
      describe_titles: ['Contact & FAQ']
    })

    await browser.url(`${BASE_URL}/contact`)
    await wait(500)
    await dismissCookieBanner()

    try {
      const nameInput = await browser.$('input[name="name"]')
      if (await nameInput.isDisplayed()) {
        await nameInput.setValue('Test User')
        await wait(200)
      }
    } catch { /* ignore */ }

    try {
      const emailInput = await browser.$('input[name="email"]')
      if (await emailInput.isDisplayed()) {
        await emailInput.setValue('test@example.com')
        await wait(200)
      }
    } catch { /* ignore */ }

    await scrollDown(300)
    await scrollDown(300)
  })

  it('should expand and collapse FAQ accordions', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should expand and collapse FAQ accordions',
      describe_titles: ['Contact & FAQ']
    })

    await browser.url(`${BASE_URL}/faq`)
    await wait(500)
    await dismissCookieBanner()

    const accordionBtns = await browser.$$('.accordion-button')
    const count = Math.min(accordionBtns.length, 9)
    for (let i = 0; i < count; i++) {
      await accordionBtns[i].click()
      await wait(300)
    }
    for (let i = 0; i < count; i++) {
      await accordionBtns[i].click()
      await wait(200)
    }
  })

  it('should browse the about page', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should browse the about page',
      describe_titles: ['Contact & FAQ']
    })

    await browser.url(`${BASE_URL}/about`)
    await wait(500)
    await dismissCookieBanner()

    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollToBottom()
  })
})
