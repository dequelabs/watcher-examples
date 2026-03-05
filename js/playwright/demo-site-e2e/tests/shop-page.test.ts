import { page } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, scrollToTop, dismissCookieBanner } from './helpers'

// =============================================================================
// TEST CASE 3: Shop Page — Category & Color Filters
//
// DOM changes: ~40-50
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Shop Page — Category & Color Filters', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through all product category filters in the sidebar', async () => {
    // Click each sidebar category filter (visible desktop sidebar only)
    const categories = ['Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Dining room', 'Storage', 'Outdoor', 'Accessories']
    for (const cat of categories) {
      const link = await page.evaluate((catName) => {
        const links = Array.from(document.querySelectorAll('.shop-sidebar .accordion-body a.menu-link'))
        const match = links.find(a => a.textContent?.trim() === catName && (a as HTMLElement).offsetWidth > 0)
        if (match) { (match as HTMLElement).click(); return true }
        return false
      }, cat)
      await wait(400)
    }
  })

  it('should interact with color filter swatches', async () => {
    // Expand Color section if collapsed
    const colorBtn = await page.$('button:has-text("Color")')
    if (colorBtn) {
      await colorBtn.click()
      await wait(300)
    }

    // Click each color swatch — they are links inside the color filter area
    const colorSwatches = await page.$$('.swatch-color a, .color-list a')
    for (let i = 0; i < Math.min(colorSwatches.length, 8); i++) {
      await colorSwatches[i].click()
      await wait(300)
    }
  })

  it('should interact with brands filter list items', async () => {
    // Click each brand in the multi-select list (these are <li> items, not checkboxes)
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
// TEST CASE 4: Shop Page — Sorting, Grid View & Price Filter
//
// DOM changes: ~30-40
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Shop Page — Sorting, Grid View & Price Filter', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should change the sort order multiple times', async () => {
    // Target the visible desktop sort dropdown specifically
    const sortDropdown = await page.$('select.shop-acs__select')
    if (sortDropdown) {
      const sortValues = ['1', '2', '3', '4', '5', '6', '7', '8']
      for (const val of sortValues) {
        await sortDropdown.selectOption(val)
        await wait(400)
      }
    }
  })

  it('should switch between grid view columns', async () => {
    // Click grid-2 button
    const grid2 = await page.$('button:has-text("2")')
    if (grid2) {
      await grid2.click()
      await wait(400)
    }

    // Scroll through products in 2-col view
    await scrollDown(400)
    await scrollDown(400)

    // Click grid-3 button
    const grid3 = await page.$('button:has-text("3")')
    if (grid3) {
      await grid3.click()
      await wait(400)
    }

    await scrollDown(400)

    // Click grid-4 button
    const grid4 = await page.$('button:has-text("4")')
    if (grid4) {
      await grid4.click()
      await wait(400)
    }

    await scrollDown(400)
  })

  it('should interact with the price range filter', async () => {
    // Expand Price section if collapsed
    const priceBtn = await page.$('button:has-text("Price")')
    if (priceBtn) {
      await priceBtn.click()
      await wait(300)
    }

    // Interact with range slider inputs
    const sliders = await page.$$('input[type="range"]')
    if (sliders.length >= 2) {
      // Adjust the min price slider
      await sliders[0].click()
      await wait(200)
      await sliders[0].fill('200')
      await wait(400)

      // Adjust the max price slider
      await sliders[1].click()
      await wait(200)
      await sliders[1].fill('800')
      await wait(400)
    }
  })
})

// =============================================================================
// TEST CASE 5: Shop Page — Product Browsing & Wishlist
//
// DOM changes: ~20-30
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Shop Page — Product Browsing & Wishlist', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click Add to Wishlist on multiple products', async () => {
    // Click wishlist buttons on products
    const wishlistBtns = await page.$$('button:has-text("Add To Wishlist")')
    for (let i = 0; i < Math.min(wishlistBtns.length, 4); i++) {
      await wishlistBtns[i].click()
      await wait(300)
    }
  })

  it('should click into product detail pages and navigate back', async () => {
    const productLinks = await page.$$('a[href*="/product/"]')
    const uniqueHrefs = new Set<string>()
    const linksToVisit: string[] = []

    for (const link of productLinks) {
      const href = await link.getAttribute('href')
      if (href && !uniqueHrefs.has(href)) {
        uniqueHrefs.add(href)
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
