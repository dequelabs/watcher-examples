import { test, expect } from './fixtures'
import { BASE_URL, wait, scrollDown, scrollToBottom, scrollToTop, dismissCookieBanner } from './helpers'

// =============================================================================
// SHOP PAGE — Category & Brand Filters (~40-50 DOM changes)
// =============================================================================
test.describe('Shop Page — Category & Brand Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should click through all product category filters', async ({ page }) => {
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

  test('should interact with color filter swatches', async ({ page }) => {
    const colorBtn = page.locator('button:has-text("Color")').first()
    if (await colorBtn.isVisible().catch(() => false)) {
      await colorBtn.click()
      await wait(300)
    }

    const colorSwatches = page.locator('.swatch-color a, .color-list a')
    const count = await colorSwatches.count()
    for (let i = 0; i < Math.min(count, 8); i++) {
      await colorSwatches.nth(i).click()
      await wait(300)
    }
  })

  test('should interact with brands filter list items', async ({ page }) => {
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
// SHOP PAGE — Sorting & Grid View (~30-40 DOM changes)
// =============================================================================
test.describe('Shop Page — Sorting & Grid View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should change the sort order multiple times', async ({ page }) => {
    const sortDropdown = page.locator('select.shop-acs__select').first()
    if (await sortDropdown.isVisible().catch(() => false)) {
      const sortValues = ['1', '2', '3', '4', '5', '6', '7', '8']
      for (const val of sortValues) {
        await sortDropdown.selectOption(val)
        await wait(400)
      }
    }
  })

  test('should switch between grid view columns', async ({ page }) => {
    const grid2 = page.locator('button:has-text("2")').first()
    if (await grid2.isVisible().catch(() => false)) {
      await grid2.click()
      await wait(400)
    }
    await scrollDown(page, 400)
    await scrollDown(page, 400)

    const grid3 = page.locator('button:has-text("3")').first()
    if (await grid3.isVisible().catch(() => false)) {
      await grid3.click()
      await wait(400)
    }
    await scrollDown(page, 400)

    const grid4 = page.locator('button:has-text("4")').first()
    if (await grid4.isVisible().catch(() => false)) {
      await grid4.click()
      await wait(400)
    }
    await scrollDown(page, 400)
  })

  test('should interact with the price range filter', async ({ page }) => {
    const priceBtn = page.locator('button:has-text("Price")').first()
    if (await priceBtn.isVisible().catch(() => false)) {
      await priceBtn.click()
      await wait(300)
    }

    const sliders = page.locator('input[type="range"]')
    const count = await sliders.count()
    if (count >= 2) {
      await sliders.nth(0).click()
      await wait(200)
      await sliders.nth(0).fill('200')
      await wait(400)
      await sliders.nth(1).click()
      await wait(200)
      await sliders.nth(1).fill('800')
      await wait(400)
    }
  })
})

// =============================================================================
// SHOP PAGE — Product Browsing (~20-30 DOM changes)
// =============================================================================
test.describe('Shop Page — Product Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should click Add to Wishlist on multiple products', async ({ page }) => {
    const wishlistBtns = page.locator('button:has-text("Add To Wishlist")')
    const count = await wishlistBtns.count()
    for (let i = 0; i < Math.min(count, 4); i++) {
      await wishlistBtns.nth(i).click()
      await wait(300)
    }
  })

  test('should click into product detail pages and navigate back', async ({ page }) => {
    const productLinks = page.locator('a[href*="/product/"]')
    const count = await productLinks.count()
    const visited = new Set<string>()

    for (let i = 0; i < count && visited.size < 4; i++) {
      const href = await productLinks.nth(i).getAttribute('href')
      if (href && !visited.has(href)) {
        visited.add(href)
        await page.goto(`${BASE_URL}${href}`)
        await wait(500)
        await scrollDown(page, 300)
        await page.goBack()
        await wait(500)
      }
    }
  })

  test('should scroll through the entire product list', async ({ page }) => {
    await scrollDown(page, 300)
    await scrollDown(page, 300)
    await scrollDown(page, 300)
    await scrollDown(page, 300)
    await scrollDown(page, 300)
    await scrollToBottom(page)
    await wait(300)
    await scrollToTop(page)
    await wait(300)
  })
})
