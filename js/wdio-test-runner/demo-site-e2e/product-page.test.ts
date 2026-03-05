import 'mocha'
import '@wdio/globals'
import './setup'
import { controller } from './setup'
import { BASE_URL, wait, scrollDown, dismissCookieBanner } from './helpers'

const TEST_FILE = 'product-page.test.ts'

// =============================================================================
// PRODUCT PAGE — Size & Color Selection
// =============================================================================
describe('Product Page — Size & Color Selection', () => {
  beforeEach(async () => {
    await browser.url(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should select different product sizes', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should select different product sizes',
      describe_titles: ['Product Page — Size & Color Selection']
    })

    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    for (const size of sizes) {
      try {
        const sizeBtn = await browser.$(`.product-single__swatches button=${size}`)
        if (await sizeBtn.isDisplayed()) {
          await sizeBtn.click()
          await wait(300)
        }
      } catch { /* size not found */ }
    }
  })

  it('should interact with quantity controls', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with quantity controls',
      describe_titles: ['Product Page — Size & Color Selection']
    })

    try {
      const incrementBtn = await browser.$('button.qty-btn=+')
      if (await incrementBtn.isDisplayed()) {
        for (let i = 0; i < 5; i++) {
          await incrementBtn.click()
          await wait(200)
        }
      }
    } catch { /* ignore */ }

    try {
      const decrementBtn = await browser.$('button.qty-btn=-')
      if (await decrementBtn.isDisplayed()) {
        for (let i = 0; i < 3; i++) {
          await decrementBtn.click()
          await wait(200)
        }
      }
    } catch { /* ignore */ }
  })

  it('should click Add to Cart', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should click Add to Cart',
      describe_titles: ['Product Page — Size & Color Selection']
    })

    try {
      const addToCartBtn = await browser.$('button=ADD TO CART')
      if (await addToCartBtn.isDisplayed()) {
        await addToCartBtn.click()
        await wait(500)
      }
    } catch { /* ignore */ }
  })
})

// =============================================================================
// PRODUCT PAGE — Tabs & Gallery
// =============================================================================
describe('Product Page — Tabs & Gallery', () => {
  beforeEach(async () => {
    await browser.url(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should switch between product detail tabs', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should switch between product detail tabs',
      describe_titles: ['Product Page — Tabs & Gallery']
    })

    await scrollDown(400)

    const tabLabels = ['Description', 'Additional Information', 'Reviews']
    for (const label of tabLabels) {
      try {
        const tab = await browser.$(`a=${label}`)
        if (await tab.isDisplayed()) {
          await tab.click()
          await wait(400)
        }
      } catch { /* ignore */ }
    }
  })

  it('should interact with product image thumbnails', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should interact with product image thumbnails',
      describe_titles: ['Product Page — Tabs & Gallery']
    })

    const thumbnails = await browser.$$('.product-single__thumbnail img, .product-gallery__thumb img')
    for (let i = 0; i < Math.min(thumbnails.length, 5); i++) {
      await thumbnails[i].click()
      await wait(300)
    }
  })

  it('should navigate the image carousel', async () => {
    controller.setTestContext({
      test_file: TEST_FILE,
      test_title: 'should navigate the image carousel',
      describe_titles: ['Product Page — Tabs & Gallery']
    })

    try {
      const nextBtn = await browser.$('.slick-next')
      if (await nextBtn.isDisplayed()) {
        for (let i = 0; i < 4; i++) {
          await nextBtn.click()
          await wait(300)
        }
      }
    } catch { /* ignore */ }

    try {
      const prevBtn = await browser.$('.slick-prev')
      if (await prevBtn.isDisplayed()) {
        for (let i = 0; i < 2; i++) {
          await prevBtn.click()
          await wait(300)
        }
      }
    } catch { /* ignore */ }
  })
})
