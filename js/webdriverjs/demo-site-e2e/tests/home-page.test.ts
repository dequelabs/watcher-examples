import { browser, setTestMeta } from './setup'
import { By } from 'selenium-webdriver'
import { BASE_URL, wait, scrollDown, scrollToBottom, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/home-page.test.ts'

// =============================================================================
// HOME PAGE — Hero & Navigation
// =============================================================================
describe('Home Page — Hero & Navigation', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should interact with the hero section and scroll through content', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Hero & Navigation', 'should interact with the hero section and scroll through content')

    try {
      const buyNow = await browser.findElement(By.xpath("//a[contains(text(),'Buy Now')]"))
      await buyNow.click()
      await wait(500)
      await browser.navigate().back()
      await wait(500)
    } catch { /* ignore */ }

    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
  })

  it('should interact with the main navigation links', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Hero & Navigation', 'should interact with the main navigation links')

    const navLabels = ['Shop', 'Blog', 'About', 'Contact']
    for (const label of navLabels) {
      const href: string | null = await browser.executeScript(`
        const links = Array.from(document.querySelectorAll('.navigation__link'));
        const match = links.find(a => a.textContent.trim() === '${label}' && a.offsetWidth > 0);
        return match ? match.href : null;
      `)
      if (href) {
        await browser.get(href)
        await wait(500)
        await browser.navigate().back()
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
    await browser.get(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through best-selling product category tabs', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Category Tabs & Product Cards', 'should click through best-selling product category tabs')

    await browser.executeScript("const h = document.querySelector('h2'); if (h) h.scrollIntoView({behavior: 'smooth'})")
    await wait(500)

    const tabLabels = ['Kitchen', 'Storage', 'Bedroom', 'Dining Room']
    for (const label of tabLabels) {
      await browser.executeScript(`
        const tabs = document.querySelectorAll('nav a, a.nav-link');
        for (const t of tabs) {
          if (t.textContent.trim() === '${label}' && t.offsetWidth > 0) { t.click(); break; }
        }
      `)
      await wait(400)
    }
  })

  it('should click Shop Now links on category cards', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Category Tabs & Product Cards', 'should click Shop Now links on category cards')

    await scrollDown(600)

    const shopNowLinks = await browser.findElements(By.xpath("//a[contains(text(),'Shop Now')] | //button[contains(text(),'Shop Now')]"))
    for (let i = 0; i < Math.min(shopNowLinks.length, 3); i++) {
      if (i > 0) {
        await browser.navigate().back()
        await wait(500)
        await scrollDown(600)
      }
      const links = await browser.findElements(By.xpath("//a[contains(text(),'Shop Now')] | //button[contains(text(),'Shop Now')]"))
      try {
        await links[i].click()
        await wait(500)
      } catch { /* ignore */ }
    }
  })
})

// =============================================================================
// HOME PAGE — Footer & Newsletter
// =============================================================================
describe('Home Page — Footer & Newsletter', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/`)
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

    try {
      const emailInput = await browser.findElement(By.css('footer input[type="email"], footer input[type="text"]'))
      await emailInput.click()
      await wait(200)
      await emailInput.sendKeys('test@example.com')
      await wait(300)
    } catch { /* ignore */ }
  })

  it('should click on footer links', async () => {
    setTestMeta(TEST_FILE, 'Home Page — Footer & Newsletter', 'should click on footer links')

    await scrollToBottom()
    await wait(500)

    const validHrefs: string[] = await browser.executeScript(`
      const links = Array.from(document.querySelectorAll('footer a'));
      return links.slice(0, 10).map(l => l.getAttribute('href')).filter(h => h && h !== '#' && !h.startsWith('http'));
    `)

    for (let i = 0; i < Math.min(validHrefs.length, 5); i++) {
      await browser.get(`${BASE_URL}${validHrefs[i]}`)
      await wait(500)
      await browser.navigate().back()
      await wait(500)
      await scrollToBottom()
    }
  })
})
