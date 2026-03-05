import { expect } from 'chai'
import { page } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

// =============================================================================
// TEST CASE 1: Home Page — Hero, Navigation & Category Tabs
//
// DOM changes: ~30-40
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Home Page — Hero, Navigation & Category Tabs', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should interact with the hero section and scroll through content', async () => {
    // Click the "Buy Now" hero link
    const buyNow = await page.$('a:has-text("Buy Now")')
    expect(buyNow).to.not.be.null
    await buyNow!.click()
    await wait(500)

    // Navigate back to home
    await page.goBack()
    await wait(500)

    // Scroll down through the page in increments to trigger DOM changes
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
  })

  it('should click through the best-selling product category tabs', async () => {
    // Scroll down to the "Best Selling Products" tab section
    await page.evaluate(() => {
      const heading = document.querySelector('h2')
      if (heading) heading.scrollIntoView({ behavior: 'smooth' })
    })
    await wait(500)

    // Click each category tab: Kitchen, Storage, Bedroom, Dining Room
    const tabLabels = ['Kitchen', 'Storage', 'Bedroom', 'Dining Room']
    for (const label of tabLabels) {
      const tab = await page.$(`nav a:has-text("${label}"), button:has-text("${label}"), a.nav-link:has-text("${label}")`)
      if (tab) {
        await tab.click()
        await wait(400)
      }
    }
  })

  it('should click the Shop Now links on category cards', async () => {
    // Scroll down to category cards
    await scrollDown(600)

    // Click the first "Shop Now" category link
    const shopNowLinks = await page.$$('a:has-text("Shop Now"), button:has-text("Shop Now")')
    for (let i = 0; i < Math.min(shopNowLinks.length, 3); i++) {
      if (i > 0) {
        // Go back for subsequent clicks
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

  it('should interact with the main navigation links', async () => {
    // Click only visible desktop nav links via page.evaluate to avoid hidden mobile duplicates
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
// TEST CASE 2: Home Page — Footer & Newsletter
//
// DOM changes: ~15-20
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Home Page — Footer & Newsletter', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should scroll to the footer and interact with newsletter signup', async () => {
    // Scroll all the way down through the page
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollToBottom()
    await wait(500)

    // Interact with newsletter email input
    const emailInput = await page.$('footer input[type="email"], footer input[placeholder*="email" i], footer input[type="text"]')
    if (emailInput) {
      await emailInput.click()
      await wait(200)
      await emailInput.fill('test@example.com')
      await wait(300)
    }
  })

  it('should click on footer links', async () => {
    await scrollToBottom()
    await wait(500)

    const footerLinks = await page.$$('footer a')
    // Click up to 5 footer links, navigating back each time
    for (let i = 0; i < Math.min(footerLinks.length, 5); i++) {
      const links = await page.$$('footer a')
      const href = await links[i]?.getAttribute('href')
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
