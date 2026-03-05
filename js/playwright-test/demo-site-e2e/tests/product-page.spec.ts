import { test, expect } from './fixtures'
import { BASE_URL, wait, scrollDown, dismissCookieBanner } from './helpers'

// =============================================================================
// PRODUCT PAGE — Size & Color Selection (~25 DOM changes)
// =============================================================================
test.describe('Product Page — Size & Color Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should select different product sizes', async ({ page }) => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    for (const size of sizes) {
      const sizeBtn = page.locator(`.product-single__swatches button:has-text("${size}"), .size-select button:has-text("${size}")`).first()
      if (await sizeBtn.isVisible().catch(() => false)) {
        await sizeBtn.click()
        await wait(300)
      }
    }
  })

  test('should interact with color options and quantity controls', async ({ page }) => {
    // Interact with color dropdown/selector
    const colorSelect = page.locator('select.color-select, .product-single__swatches select').first()
    if (await colorSelect.isVisible().catch(() => false)) {
      const options = await colorSelect.locator('option').allTextContents()
      for (const opt of options.slice(0, 4)) {
        await colorSelect.selectOption({ label: opt.trim() })
        await wait(300)
      }
    }

    // Click quantity increment button multiple times
    const incrementBtn = page.locator('button.qty-btn:has-text("+"), .quantity-counter button:last-child').first()
    if (await incrementBtn.isVisible().catch(() => false)) {
      for (let i = 0; i < 5; i++) {
        await incrementBtn.click()
        await wait(200)
      }
    }

    // Click quantity decrement button
    const decrementBtn = page.locator('button.qty-btn:has-text("-"), .quantity-counter button:first-child').first()
    if (await decrementBtn.isVisible().catch(() => false)) {
      for (let i = 0; i < 3; i++) {
        await decrementBtn.click()
        await wait(200)
      }
    }
  })

  test('should click Add to Cart', async ({ page }) => {
    const addToCartBtn = page.locator('button:has-text("ADD TO CART"), button:has-text("Add to Cart")').first()
    if (await addToCartBtn.isVisible().catch(() => false)) {
      await addToCartBtn.click()
      await wait(500)
    }
  })
})

// =============================================================================
// PRODUCT PAGE — Tabs & Gallery (~25 DOM changes)
// =============================================================================
test.describe('Product Page — Tabs & Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner(page)
  })

  test('should switch between product detail tabs', async ({ page }) => {
    await scrollDown(page, 400)

    const tabLabels = ['Description', 'Additional Information', 'Reviews']
    for (const label of tabLabels) {
      const tab = page.locator(`a:has-text("${label}"), button:has-text("${label}"), .nav-link:has-text("${label}")`).first()
      if (await tab.isVisible().catch(() => false)) {
        await tab.click()
        await wait(400)
      }
    }
  })

  test('should interact with product image thumbnails', async ({ page }) => {
    const thumbnails = page.locator('.product-single__thumbnail img, .product-gallery__thumb img')
    const count = await thumbnails.count()
    for (let i = 0; i < Math.min(count, 5); i++) {
      await thumbnails.nth(i).click()
      await wait(300)
    }
  })

  test('should navigate the image carousel', async ({ page }) => {
    const nextBtn = page.locator('.product-single__nav .slick-next, button[aria-label="Next"]').first()
    if (await nextBtn.isVisible().catch(() => false)) {
      for (let i = 0; i < 4; i++) {
        await nextBtn.click()
        await wait(300)
      }
    }

    const prevBtn = page.locator('.product-single__nav .slick-prev, button[aria-label="Previous"]').first()
    if (await prevBtn.isVisible().catch(() => false)) {
      for (let i = 0; i < 2; i++) {
        await prevBtn.click()
        await wait(300)
      }
    }
  })
})
