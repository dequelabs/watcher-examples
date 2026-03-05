import { page, setTestMeta } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/home-page.test.ts'

// =============================================================================
// HOME PAGE — Hero & Navigation
// =============================================================================
describe('Home Page — Hero & Navigation', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should interact with the hero section and scroll through content', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Hero & Navigation', 'should interact with the hero section and scroll through content')
    const buyNow = await page.$('a:has-text("Buy Now")')
    if (buyNow) {
      await buyNow.click()
      await wait(500)
      await page.goBack()
      await wait(500)
    }
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
  })

  it('should interact with the main navigation links', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Hero & Navigation', 'should interact with the main navigation links')
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
// HOME PAGE — Category Tabs & Product Cards
// =============================================================================
describe('Home Page — Category Tabs & Product Cards', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through best-selling product category tabs', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Category Tabs & Product Cards', 'should click through best-selling product category tabs')
    await page.evaluate(() => {
      const heading = document.querySelector('h2')
      if (heading) heading.scrollIntoView({ behavior: 'smooth' })
    })
    await wait(500)

    const tabLabels = ['Kitchen', 'Storage', 'Bedroom', 'Dining Room']
    for (const label of tabLabels) {
      const tab = await page.$(`nav a:has-text("${label}"), button:has-text("${label}"), a.nav-link:has-text("${label}")`)
      if (tab) {
        await tab.click()
        await wait(400)
      }
    }
  })

  it('should click Shop Now links on category cards', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Category Tabs & Product Cards', 'should click Shop Now links on category cards')
    await scrollDown(600)

    const shopNowLinks = await page.$$('a:has-text("Shop Now"), button:has-text("Shop Now")')
    for (let i = 0; i < Math.min(shopNowLinks.length, 3); i++) {
      if (i > 0) {
        await page.goBack()
        await wait(500)
        await scrollDown(600)
      }
      const links = await page.$$('a:has-text("Shop Now"), button:has-text("Shop Now")')
      if (links[i]) {
        await links[i].click()
        await wait(500)
      }
    }
  })
})

// =============================================================================
// HOME PAGE — Footer & Newsletter
// =============================================================================
describe('Home Page — Footer & Newsletter', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should scroll to footer and interact with newsletter signup', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Footer & Newsletter', 'should scroll to footer and interact with newsletter signup')
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollToBottom()
    await wait(500)

    const emailInput = await page.$('footer input[type="email"], footer input[placeholder*="email" i], footer input[type="text"]')
    if (emailInput) {
      await emailInput.click()
      await wait(200)
      await emailInput.type('test@example.com')
      await wait(300)
    }
  })

  it('should click on footer links', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Footer & Newsletter', 'should click on footer links')
    await scrollToBottom()
    await wait(500)

    const footerLinks = await page.$$('footer a')
    for (let i = 0; i < Math.min(footerLinks.length, 5); i++) {
      const links = await page.$$('footer a')
      const href = await links[i]?.evaluate(el => el.getAttribute('href'))
      if (href && href !== '#' && !href.startsWith('http')) {
        await links[i].click()
        await wait(500)
        await page.goBack()
        await wait(500)
        await scrollToBottom()
      }
    }
  })
})
