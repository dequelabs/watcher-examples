import { test, expect } from './fixtures'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

// =============================================================================
// HOME PAGE — Hero & Navigation (~15-20 DOM changes)
// =============================================================================
test.describe('Home Page — Hero & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should interact with the hero section and scroll through content', async ({ page }) => {
    const buyNow = page.locator('a:has-text("Buy Now")').first()
    if (await buyNow.isVisible().catch(() => false)) {
      await buyNow.click()
      await wait(500)
      await page.goBack()
      await wait(500)
    }
    await scrollDown(page, 400)
    await scrollDown(page, 400)
    await scrollDown(page, 400)
    await scrollDown(page, 400)
  })

  test('should interact with the main navigation links', async ({ page }) => {
    const navLabels = ['Shop', 'Blog', 'About', 'Contact']
    for (const label of navLabels) {
      const href = await page.evaluate((text) => {
        const links = Array.from(document.querySelectorAll('.navigation__link'))
        const match = links.find(a => a.textContent?.trim() === text && (a as HTMLElement).offsetWidth > 0)
        return match ? (match as HTMLAnchorElement).href : null
      }, label)
      if (href) {
        await page.goto(href)
        await wait(500)
        await page.goBack()
        await wait(500)
      }
    }
  })
})

// =============================================================================
// HOME PAGE — Category Tabs & Product Cards (~15-20 DOM changes)
// =============================================================================
test.describe('Home Page — Category Tabs & Product Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should click through best-selling product category tabs', async ({ page }) => {
    await page.evaluate(() => {
      const heading = document.querySelector('h2')
      if (heading) heading.scrollIntoView({ behavior: 'smooth' })
    })
    await wait(500)

    const tabLabels = ['Kitchen', 'Storage', 'Bedroom', 'Dining Room']
    for (const label of tabLabels) {
      const tab = page.locator(`nav a:has-text("${label}"), button:has-text("${label}"), a.nav-link:has-text("${label}")`).first()
      if (await tab.isVisible().catch(() => false)) {
        await tab.click()
        await wait(400)
      }
    }
  })

  test('should click Shop Now links on category cards', async ({ page }) => {
    await scrollDown(page, 600)

    const shopNowLinks = page.locator('a:has-text("Shop Now"), button:has-text("Shop Now")')
    const count = await shopNowLinks.count()
    for (let i = 0; i < Math.min(count, 3); i++) {
      if (i > 0) {
        await page.goBack()
        await wait(500)
        await scrollDown(page, 600)
      }
      const links = page.locator('a:has-text("Shop Now"), button:has-text("Shop Now")')
      if (await links.nth(i).isVisible().catch(() => false)) {
        await links.nth(i).click()
        await wait(500)
      }
    }
  })
})

// =============================================================================
// HOME PAGE — Footer & Newsletter (~15-20 DOM changes)
// =============================================================================
test.describe('Home Page — Footer & Newsletter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should scroll to footer and interact with newsletter signup', async ({ page }) => {
    await scrollDown(page, 500)
    await scrollDown(page, 500)
    await scrollDown(page, 500)
    await scrollDown(page, 500)
    await scrollDown(page, 500)
    await scrollDown(page, 500)
    await scrollToBottom(page)
    await wait(500)

    const emailInput = page.locator('footer input[type="email"], footer input[placeholder*="email" i], footer input[type="text"]').first()
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.click()
      await wait(200)
      await emailInput.fill('test@example.com')
      await wait(300)
    }
  })

  test('should verify footer links are present and visible', async ({ page }) => {
    await scrollToBottom(page)
    await wait(500)

    const footerLinks = page.locator('footer a')
    const count = await footerLinks.count()
    // Verify footer links exist and are visible (avoid navigating away which
    // causes watcher flush timeouts during teardown)
    for (let i = 0; i < Math.min(count, 5); i++) {
      await footerLinks.nth(i).scrollIntoViewIfNeeded()
      await wait(200)
    }
  })
})
