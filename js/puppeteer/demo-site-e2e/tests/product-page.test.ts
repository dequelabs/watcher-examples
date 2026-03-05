import { page, setTestMeta } from './setup'
import { BASE_URL, wait, scrollDown, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/product-page.test.ts'

// =============================================================================
// PRODUCT PAGE — Size & Color Selection
// =============================================================================
describe('Product Page — Size & Color Selection', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should select different product sizes', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Size & Color Selection', 'should select different product sizes')
    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    for (const size of sizes) {
      const sizeBtn = await page.$(`.product-single__swatches button:has-text("${size}"), .size-select button:has-text("${size}")`)
      if (sizeBtn) {
        await sizeBtn.click()
        await wait(300)
      }
    }
  })

  it('should interact with quantity controls', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Size & Color Selection', 'should interact with quantity controls')
    const incrementBtn = await page.$('button.qty-btn:has-text("+"), .quantity-counter button:last-child')
    if (incrementBtn) {
      for (let i = 0; i < 5; i++) {
        await incrementBtn.click()
        await wait(200)
      }
    }

    const decrementBtn = await page.$('button.qty-btn:has-text("-"), .quantity-counter button:first-child')
    if (decrementBtn) {
      for (let i = 0; i < 3; i++) {
        await decrementBtn.click()
        await wait(200)
      }
    }
  })

  it('should click Add to Cart', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Size & Color Selection', 'should click Add to Cart')
    const addToCartBtn = await page.$('button:has-text("ADD TO CART"), button:has-text("Add to Cart")')
    if (addToCartBtn) {
      await addToCartBtn.click()
      await wait(500)
    }
  })
})

// =============================================================================
// PRODUCT PAGE — Tabs & Gallery
// =============================================================================
describe('Product Page — Tabs & Gallery', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should switch between product detail tabs', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Tabs & Gallery', 'should switch between product detail tabs')
    await scrollDown(400)

    const tabLabels = ['Description', 'Additional Information', 'Reviews']
    for (const label of tabLabels) {
      const tab = await page.$(`a:has-text("${label}"), button:has-text("${label}"), .nav-link:has-text("${label}")`)
      if (tab) {
        await tab.click()
        await wait(400)
      }
    }
  })

  it('should interact with product image thumbnails', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Tabs & Gallery', 'should interact with product image thumbnails')
    const thumbnails = await page.$$('.product-single__thumbnail img, .product-gallery__thumb img')
    for (let i = 0; i < Math.min(thumbnails.length, 5); i++) {
      await thumbnails[i].click()
      await wait(300)
    }
  })

  it('should navigate the image carousel', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Tabs & Gallery', 'should navigate the image carousel')
    const nextBtn = await page.$('.product-single__nav .slick-next, button[aria-label="Next"]')
    if (nextBtn) {
      for (let i = 0; i < 4; i++) {
        await nextBtn.click()
        await wait(300)
      }
    }

    const prevBtn = await page.$('.product-single__nav .slick-prev, button[aria-label="Previous"]')
    if (prevBtn) {
      for (let i = 0; i < 2; i++) {
        await prevBtn.click()
        await wait(300)
      }
    }
  })
})
