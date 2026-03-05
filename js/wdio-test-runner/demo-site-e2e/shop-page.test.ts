import 'mocha'
import '@wdio/globals'
import './setup'
import { controller } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, scrollToTop, dismissCookieBanner } from './helpers'

const TEST_FILE = 'shop-page.test.ts'

// =============================================================================
// SHOP PAGE — Category & Brand Filters
// =============================================================================
describe('Shop Page — Category & Brand Filters', () => {
  beforeEach(async () => {
    await browser.url(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through all product category filters', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should click through all product category filters',
      describe_titles: ['Shop Page — Category & Brand Filters']
    })

    const categories = ['Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Dining room', 'Storage', 'Outdoor', 'Accessories']
    for (const cat of categories) {
      await browser.execute((catName: string) => {
        const links = Array.from(document.querySelectorAll('.shop-sidebar .accordion-body a.menu-link'))
        const match = links.find(a => a.textContent?.trim() === catName && (a as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      }, cat)
      await wait(400)
    }
  })

  it('should interact with color filter swatches', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with color filter swatches',
      describe_titles: ['Shop Page — Category & Brand Filters']
    })

    try {
      const colorBtn = await browser.$('button=Color')
      if (await colorBtn.isDisplayed()) {
        await colorBtn.click()
        await wait(300)
      }
    } catch { /* ignore */ }

    const colorSwatches = await browser.$$('.swatch-color a, .color-list a')
    for (let i = 0; i < Math.min(colorSwatches.length, 8); i++) {
      await colorSwatches[i].click()
      await wait(300)
    }
  })

  it('should interact with brands filter list items', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with brands filter list items',
      describe_titles: ['Shop Page — Category & Brand Filters']
    })

    const brandNames = ['Ikea', 'Lazyboy', 'Ember', 'Mullberry', 'Taggo', 'Grounded', 'Earthen']
    for (const brand of brandNames) {
      await browser.execute((name: string) => {
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
    await browser.url(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should change the sort order multiple times', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should change the sort order multiple times',
      describe_titles: ['Shop Page — Sorting & Grid View']
    })

    const sortDropdown = await browser.$('select.shop-acs__select')
    if (await sortDropdown.isDisplayed().catch(() => false)) {
      const sortValues = ['1', '2', '3', '4', '5', '6', '7', '8']
      for (const val of sortValues) {
        await sortDropdown.selectByAttribute('value', val)
        await wait(400)
      }
    }
  })

  it('should switch between grid view columns', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should switch between grid view columns',
      describe_titles: ['Shop Page — Sorting & Grid View']
    })

    try {
      const grid2 = await browser.$('button=2')
      if (await grid2.isDisplayed()) { await grid2.click(); await wait(400) }
    } catch { /* ignore */ }
    await scrollDown(400)
    await scrollDown(400)

    try {
      const grid3 = await browser.$('button=3')
      if (await grid3.isDisplayed()) { await grid3.click(); await wait(400) }
    } catch { /* ignore */ }
    await scrollDown(400)

    try {
      const grid4 = await browser.$('button=4')
      if (await grid4.isDisplayed()) { await grid4.click(); await wait(400) }
    } catch { /* ignore */ }
    await scrollDown(400)
  })

  it('should interact with the price range filter', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with the price range filter',
      describe_titles: ['Shop Page — Sorting & Grid View']
    })

    try {
      const priceBtn = await browser.$('button=Price')
      if (await priceBtn.isDisplayed()) {
        await priceBtn.click()
        await wait(300)
      }
    } catch { /* ignore */ }

    const sliders = await browser.$$('input[type="range"]')
    if (sliders.length >= 2) {
      await sliders[0].click()
      await wait(200)
      await sliders[0].setValue('200')
      await wait(400)
      await sliders[1].click()
      await wait(200)
      await sliders[1].setValue('800')
      await wait(400)
    }
  })
})

// =============================================================================
// SHOP PAGE — Product Browsing
// =============================================================================
describe('Shop Page — Product Browsing', () => {
  beforeEach(async () => {
    await browser.url(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click Add to Wishlist on multiple products', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should click Add to Wishlist on multiple products',
      describe_titles: ['Shop Page — Product Browsing']
    })

    const wishlistBtns = await browser.$$('button=Add To Wishlist')
    for (let i = 0; i < Math.min(wishlistBtns.length, 4); i++) {
      await wishlistBtns[i].click()
      await wait(300)
    }
  })

  it('should click into product detail pages and navigate back', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should click into product detail pages and navigate back',
      describe_titles: ['Shop Page — Product Browsing']
    })

    const productLinks = await browser.$$('a[href*="/product/"]')
    const visited = new Set<string>()
    const hrefs: string[] = []

    for (const link of productLinks) {
      const href = await link.getAttribute('href')
      if (href && !visited.has(href)) {
        visited.add(href)
        hrefs.push(href)
      }
      if (hrefs.length >= 4) break
    }

    for (const href of hrefs) {
      await browser.url(`${BASE_URL}${href}`)
      await wait(500)
      await scrollDown(300)
      await browser.back()
      await wait(500)
    }
  })

  it('should scroll through the entire product list', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should scroll through the entire product list',
      describe_titles: ['Shop Page — Product Browsing']
    })

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
