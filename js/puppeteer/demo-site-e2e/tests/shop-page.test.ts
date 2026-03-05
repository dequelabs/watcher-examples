import { page, setTestMeta } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, scrollToTop, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/shop-page.test.ts'

// =============================================================================
// SHOP PAGE — Category & Brand Filters
// =============================================================================
describe('Shop Page — Category & Brand Filters', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through all product category filters', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Category & Brand Filters', 'should click through all product category filters')
    const categories = ['Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Dining room', 'Storage', 'Outdoor', 'Accessories']
    for (const cat of categories) {
      await page.evaluate((catName) => {
        const links = Array.from(document.querySelectorAll('.shop-sidebar .accordion-body a.menu-link'))
        const match = links.find(a => a.textContent?.trim() === catName && (a as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      }, cat)
      await wait(400)
    }
  })

  it('should interact with color filter swatches', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Category & Brand Filters', 'should interact with color filter swatches')
    const colorBtn = await page.$('button:has-text("Color")')
    if (colorBtn) {
      await colorBtn.click()
      await wait(300)
    }

    const colorSwatches = await page.$$('.swatch-color a, .color-list a')
    for (let i = 0; i < Math.min(colorSwatches.length, 8); i++) {
      await colorSwatches[i].click()
      await wait(300)
    }
  })

  it('should interact with brands filter list items', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Category & Brand Filters', 'should interact with brands filter list items')
    const brandNames = ['Ikea', 'Lazyboy', 'Ember', 'Mullberry', 'Taggo', 'Grounded', 'Earthen']
    for (const brand of brandNames) {
      await page.evaluate((name) => {
        const items = Array.from(document.querySelectorAll('.shop-sidebar .multi-select__item'))
        const match = items.find(li => li.textContent?.includes(name) && (li as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      }, brand)
      await wait(300)
    }
  })
})

// =============================================================================
// SHOP PAGE — Sorting & Grid View
// =============================================================================
describe('Shop Page — Sorting & Grid View', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should change the sort order multiple times', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Sorting & Grid View', 'should change the sort order multiple times')
    const sortDropdown = await page.$('select.shop-acs__select')
    if (sortDropdown) {
      const sortValues = ['1', '2', '3', '4', '5', '6', '7', '8']
      for (const val of sortValues) {
        await page.select('select.shop-acs__select', val)
        await wait(400)
      }
    }
  })

  it('should switch between grid view columns', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Sorting & Grid View', 'should switch between grid view columns')
    const grid2 = await page.$('button:has-text("2")')
    if (grid2) { await grid2.click(); await wait(400) }
    await scrollDown(400)
    await scrollDown(400)

    const grid3 = await page.$('button:has-text("3")')
    if (grid3) { await grid3.click(); await wait(400) }
    await scrollDown(400)

    const grid4 = await page.$('button:has-text("4")')
    if (grid4) { await grid4.click(); await wait(400) }
    await scrollDown(400)
  })

  it('should interact with the price range filter', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Sorting & Grid View', 'should interact with the price range filter')
    const priceBtn = await page.$('button:has-text("Price")')
    if (priceBtn) {
      await priceBtn.click()
      await wait(300)
    }

    const sliders = await page.$$('input[type="range"]')
    if (sliders.length >= 2) {
      await sliders[0].click()
      await wait(200)
      await page.evaluate((el: HTMLInputElement) => { el.value = '200'; el.dispatchEvent(new Event('input', { bubbles: true })) }, sliders[0] as unknown as HTMLInputElement)
      await wait(400)
      await sliders[1].click()
      await wait(200)
      await page.evaluate((el: HTMLInputElement) => { el.value = '800'; el.dispatchEvent(new Event('input', { bubbles: true })) }, sliders[1] as unknown as HTMLInputElement)
      await wait(400)
    }
  })
})

// =============================================================================
// SHOP PAGE — Product Browsing
// =============================================================================
describe('Shop Page — Product Browsing', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click Add to Wishlist on multiple products', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Product Browsing', 'should click Add to Wishlist on multiple products')
    const wishlistBtns = await page.$$('button:has-text("Add To Wishlist")')
    for (let i = 0; i < Math.min(wishlistBtns.length, 4); i++) {
      await wishlistBtns[i].click()
      await wait(300)
    }
  })

  it('should click into product detail pages and navigate back', async () => {
    setTestMeta(TEST_FILE, 'Shop Page — Product Browsing', 'should click into product detail pages and navigate back')
    const productLinks = await page.$$('a[href*="/product/"]')
    const visited = new Set<string>()
    const linksToVisit: string[] = []

    for (const link of productLinks) {
      const href = await link.evaluate(el => el.getAttribute('href'))
      if (href && !visited.has(href)) {
        visited.add(href)
        linksToVisit.push(href)
      }
      if (linksToVisit.length >= 4) break
    }

    for (const href of linksToVisit) {
      await page.goto(`${BASE_URL}${href}`)
      await wait(500)
      await scrollDown(300)
      await page.goBack()
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
