import { test, expect } from './fixtures'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

// =============================================================================
// LOGIN & REGISTRATION (~20 DOM changes)
// =============================================================================
test.describe('Login & Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login_register`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should interact with the login form fields', async ({ page }) => {
    const usernameInput = page.locator('input[name="login_email"], input[placeholder*="name" i]').first()
    if (await usernameInput.isVisible().catch(() => false)) {
      await usernameInput.click()
      await wait(200)
      await usernameInput.fill('testuser@example.com')
      await wait(300)
    }

    const passwordInput = page.locator('input[name="login_password"], input[type="password"]').first()
    if (await passwordInput.isVisible().catch(() => false)) {
      await passwordInput.click()
      await wait(200)
      await passwordInput.fill('password123')
      await wait(300)
    }

    const rememberMe = page.locator('input[type="checkbox"]').first()
    if (await rememberMe.isVisible().catch(() => false)) {
      await rememberMe.click()
      await wait(200)
    }
  })

  test('should switch to the registration tab and fill fields', async ({ page }) => {
    const registerTab = page.locator('a:has-text("Register"), button:has-text("Register"), .nav-link:has-text("Register")').first()
    if (await registerTab.isVisible().catch(() => false)) {
      await registerTab.click()
      await wait(400)
    }

    const usernameInput = page.locator('input[name="register_username"], input[placeholder*="Username" i]').first()
    if (await usernameInput.isVisible().catch(() => false)) {
      await usernameInput.fill('newuser123')
      await wait(300)
    }

    const emailInput = page.locator('input[name="register_email"], input[placeholder*="email" i]').nth(0)
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('newuser@example.com')
      await wait(300)
    }

    const passwordInput = page.locator('input[name="register_password"], input[type="password"]').first()
    if (await passwordInput.isVisible().catch(() => false)) {
      await passwordInput.fill('securepass456')
      await wait(300)
    }
  })
})

// =============================================================================
// CHECKOUT FLOW (~20 DOM changes)
// =============================================================================
test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/shop_checkout`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should fill out the billing form', async ({ page }) => {
    const fields: Array<{ selector: string; value: string }> = [
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
      const input = page.locator(selector).first()
      if (await input.isVisible().catch(() => false)) {
        await input.click()
        await wait(100)
        await input.fill(value)
        await wait(200)
      }
    }
  })

  test('should interact with country dropdown and payment methods', async ({ page }) => {
    const countrySelect = page.locator('select[name="country"], select').first()
    if (await countrySelect.isVisible().catch(() => false)) {
      await countrySelect.selectOption({ index: 2 })
      await wait(300)
      await countrySelect.selectOption({ index: 5 })
      await wait(300)
    }

    await scrollDown(page, 400)

    const paymentRadios = page.locator('input[type="radio"][name*="payment"], input[type="radio"]')
    const radioCount = await paymentRadios.count()
    for (let i = 0; i < Math.min(radioCount, 4); i++) {
      await paymentRadios.nth(i).click()
      await wait(300)
    }
  })
})

// =============================================================================
// CONTACT & FAQ (~15-20 DOM changes)
// =============================================================================
test.describe('Contact & FAQ', () => {
  test('should fill out the contact form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    await wait(500)
    await dismissCookieBanner(page)

    const nameInput = page.locator('input[name="name"], input[placeholder*="Name" i]').first()
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('Test User')
      await wait(200)
    }

    const emailInput = page.locator('input[name="email"], input[placeholder*="Email" i]').first()
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('test@example.com')
      await wait(200)
    }

    await scrollDown(page, 300)
    await scrollDown(page, 300)
  })

  test('should expand and collapse FAQ accordions', async ({ page }) => {
    await page.goto(`${BASE_URL}/faq`)
    await wait(500)
    await dismissCookieBanner(page)

    const accordionBtns = page.locator('.accordion-button, button.faq-accordion, .faq__item button')
    const count = await accordionBtns.count()
    for (let i = 0; i < Math.min(count, 9); i++) {
      await accordionBtns.nth(i).click()
      await wait(300)
    }

    // Collapse them all again
    for (let i = 0; i < Math.min(count, 9); i++) {
      await accordionBtns.nth(i).click()
      await wait(200)
    }
  })

  test('should browse the about page', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`)
    await wait(500)
    await dismissCookieBanner(page)

    await scrollDown(page, 400)
    await scrollDown(page, 400)
    await scrollDown(page, 400)
    await scrollToBottom(page)
  })
})
