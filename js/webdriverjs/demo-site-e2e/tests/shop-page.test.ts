import { browser, setTestMeta } from './setup'
import { By } from 'selenium-webdriver'
import { BASE_URL, wait, scrollDown, scrollToBottom, scrollToTop, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/shop-page.test.ts'

// =============================================================================
// SHOP PAGE — Category & Brand Filters
// =============================================================================
describe('Shop Page — Category & Brand Filters', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through all product category filters', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Category & Brand Filters', 'should click through all product category filters')

    const categories = ['Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Dining room', 'Storage', 'Outdoor', 'Accessories']
    for (const cat of categories) {
      await browser.executeScript(`
        const links = Array.from(document.querySelectorAll('.shop-sidebar .accordion-body a.menu-link'));
        const match = links.find(a => a.textContent.trim() === '${cat}' && a.offsetWidth > 0);
        if (match) match.click();
      `)
      await wait(400)
    }
  })

  it('should interact with color filter swatches', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Category & Brand Filters', 'should interact with color filter swatches')

    try {
      const colorBtn = await browser.findElement(By.xpath("//button[contains(text(),'Color')]"))
      await colorBtn.click()
      await wait(300)
    } catch { /* ignore */ }

    const colorSwatches = await browser.findElements(By.css('.swatch-color a, .color-list a'))
    for (let i = 0; i < Math.min(colorSwatches.length, 8); i++) {
      await colorSwatches[i].click()
      await wait(300)
    }
  })

  it('should interact with brands filter list items', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Category & Brand Filters', 'should interact with brands filter list items')

    const brandNames = ['Ikea', 'Lazyboy', 'Ember', 'Mullberry', 'Taggo', 'Grounded', 'Earthen']
    for (const brand of brandNames) {
      await browser.executeScript(`
        const items = Array.from(document.querySelectorAll('.shop-sidebar .multi-select__item'));
        const match = items.find(li => li.textContent.includes('${brand}') && li.offsetWidth > 0);
        if (match) match.click();
      `)
      await wait(300)
    }
  })
})

// =============================================================================
// SHOP PAGE — Sorting & Grid View
// =============================================================================
describe('Shop Page — Sorting & Grid View', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should change the sort order multiple times', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Sorting & Grid View', 'should change the sort order multiple times')

    const sortValues = ['1', '2', '3', '4', '5', '6', '7', '8']
    for (const val of sortValues) {
      await browser.executeScript(`
        const select = document.querySelector('select.shop-acs__select');
        if (select) { select.value = '${val}'; select.dispatchEvent(new Event('change', {bubbles: true})); }
      `)
      await wait(400)
    }
  })

  it('should switch between grid view columns', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Sorting & Grid View', 'should switch between grid view columns')

    const gridValues = ['2', '3', '4']
    for (const val of gridValues) {
      await browser.executeScript(`
        const btns = document.querySelectorAll('button');
        for (const btn of btns) {
          if (btn.textContent.trim() === '${val}' && btn.offsetWidth > 0) { btn.click(); break; }
        }
      `)
      await wait(400)
      await scrollDown(400)
    }
  })

  it('should interact with the price range filter', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Sorting & Grid View', 'should interact with the price range filter')

    try {
      const priceBtn = await browser.findElement(By.xpath("//button[contains(text(),'Price')]"))
      await priceBtn.click()
      await wait(300)
    } catch { /* ignore */ }

    const sliders = await browser.findElements(By.css('input[type="range"]'))
    if (sliders.length >= 2) {
      await browser.executeScript("arguments[0].value = 200; arguments[0].dispatchEvent(new Event('input', {bubbles: true}))", sliders[0])
      await wait(400)
      await browser.executeScript("arguments[0].value = 800; arguments[0].dispatchEvent(new Event('input', {bubbles: true}))", sliders[1])
      await wait(400)
    }
  })
})

// =============================================================================
// SHOP PAGE — Product Browsing
// =============================================================================
describe('Shop Page — Product Browsing', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click Add to Wishlist on multiple products', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Product Browsing', 'should click Add to Wishlist on multiple products')

    const wishlistBtns = await browser.findElements(By.xpath("//button[contains(text(),'Add To Wishlist')]"))
    for (let i = 0; i < Math.min(wishlistBtns.length, 4); i++) {
      try {
        await wishlistBtns[i].click()
        await wait(300)
      } catch { /* ignore */ }
    }
  })

  it('should click into product detail pages and navigate back', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Product Browsing', 'should click into product detail pages and navigate back')

    const hrefs: string[] = await browser.executeScript(`
      const links = Array.from(document.querySelectorAll('a[href*="/product/"]'));
      const seen = new Set();
      const result = [];
      for (const l of links) {
        const h = l.getAttribute('href');
        if (h && !seen.has(h)) { seen.add(h); result.push(h); }
        if (result.length >= 4) break;
      }
      return result;
    `)

    for (const href of hrefs) {
      await browser.get(`${BASE_URL}${href}`)
      await wait(500)
      await scrollDown(300)
      await browser.navigate().back()
      await wait(500)
    }
  })

  it('should scroll through the entire product list', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Product Browsing', 'should scroll through the entire product list')

    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollToBottom()
    await wait(300)
    await scrollToTop()
    await wait(300)
  })
})
