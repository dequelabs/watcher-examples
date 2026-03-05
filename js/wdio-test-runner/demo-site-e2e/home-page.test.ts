import 'mocha'
import '@wdio/globals'
import './setup'
import { controller } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

const TEST_FILE = 'home-page.test.ts'

// =============================================================================
// HOME PAGE — Hero & Navigation
// =============================================================================
describe('Home Page — Hero & Navigation', () => {
  beforeEach(async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: null,
      describe_titles: ['Home Page — Hero & Navigation']
    })
    await browser.url(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should interact with the hero section and scroll through content', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with the hero section and scroll through content',
      describe_titles: ['Home Page — Hero & Navigation']
    })

    const buyNow = await browser.$('a=Buy Now')
    if (await buyNow.isDisplayed()) {
      await buyNow.click()
      await wait(500)
      await browser.back()
      await wait(500)
    }
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
  })

  it('should interact with the main navigation links', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with the main navigation links',
      describe_titles: ['Home Page — Hero & Navigation']
    })

    const navLabels = ['Shop', 'Blog', 'About', 'Contact']
    for (const label of navLabels) {
      const href = await browser.execute((text: string) => {
        const links = Array.from(document.querySelectorAll('.navigation__link'))
        const match = links.find(a => a.textContent?.trim() === text && (a as HTMLElement).offsetWidth > 0)
        return match ? (match as HTMLAnchorElement).href : null
      }, label)
      if (href) {
        await browser.url(href)
        await wait(500)
        await browser.back()
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
    await browser.url(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through best-selling product category tabs', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should click through best-selling product category tabs',
      describe_titles: ['Home Page — Category Tabs & Product Cards']
    })

    await browser.execute(() => {
      const heading = document.querySelector('h2')
      if (heading) heading.scrollIntoView({ behavior: 'smooth' })
    })
    await wait(500)

    const tabLabels = ['Kitchen', 'Storage', 'Bedroom', 'Dining Room']
    for (const label of tabLabels) {
      const tab = await browser.$(`nav a=${label}`)
      if (await tab.isDisplayed().catch(() => false)) {
        await tab.click()
        await wait(400)
      }
    }
  })

  it('should click Shop Now links on category cards', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should click Shop Now links on category cards',
      describe_titles: ['Home Page — Category Tabs & Product Cards']
    })

    await scrollDown(600)

    const shopNowLinks = await browser.$$('a=Shop Now')
    for (let i = 0; i < Math.min(shopNowLinks.length, 3); i++) {
      if (i > 0) {
        await browser.back()
        await wait(500)
        await scrollDown(600)
      }
      const links = await browser.$$('a=Shop Now')
      if (links[i] && await links[i].isDisplayed().catch(() => false)) {
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
    await browser.url(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should scroll to footer and interact with newsletter signup', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should scroll to footer and interact with newsletter signup',
      describe_titles: ['Home Page — Footer & Newsletter']
    })

    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollDown(500)
    await scrollToBottom()
    await wait(500)

    try {
      const emailInput = await browser.$('footer input[type="email"]')
      if (await emailInput.isDisplayed()) {
        await emailInput.click()
        await wait(200)
        await emailInput.setValue('test@example.com')
        await wait(300)
      }
    } catch {
      // No email input found
    }
  })

  it('should click on footer links', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should click on footer links',
      describe_titles: ['Home Page — Footer & Newsletter']
    })

    await scrollToBottom()
    await wait(500)

    const footerLinks = await browser.$$('footer a')
    let clicked = 0
    for (const link of footerLinks) {
      if (clicked >= 5) break
      const href = await link.getAttribute('href')
      if (href && href !== '#' && !href.startsWith('http')) {
        await link.click()
        await wait(500)
        await browser.back()
        await wait(500)
        await scrollToBottom()
        clicked++
      }
    }
  })
})
