import { browser, setTestMeta } from './setup'
import { By } from 'selenium-webdriver'
import { BASE_URL, wait, scrollDown, dismissCookieBanner } from './helpers'

const TEST_FILE = 'tests/product-page.test.ts'

// =============================================================================
// PRODUCT PAGE — Size & Color Selection
// =============================================================================
describe('Product Page — Size & Color Selection', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should select different product sizes', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Size & Color Selection', 'should select different product sizes')

    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    for (const size of sizes) {
      await browser.executeScript(`
        const btns = document.querySelectorAll('.product-single__swatches button, .size-select button');
        for (const btn of btns) {
          if (btn.textContent.trim() === '${size}' && btn.offsetWidth > 0) { btn.click(); break; }
        }
      `)
      await wait(300)
    }
  })

  it('should interact with quantity controls', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Size & Color Selection', 'should interact with quantity controls')

    // Increment
    for (let i = 0; i < 5; i++) {
      await browser.executeScript(`
        const btns = document.querySelectorAll('button.qty-btn, .quantity-counter button');
        for (const btn of btns) {
          if (btn.textContent.trim() === '+' && btn.offsetWidth > 0) { btn.click(); break; }
        }
      `)
      await wait(200)
    }

    // Decrement
    for (let i = 0; i < 3; i++) {
      await browser.executeScript(`
        const btns = document.querySelectorAll('button.qty-btn, .quantity-counter button');
        for (const btn of btns) {
          if (btn.textContent.trim() === '-' && btn.offsetWidth > 0) { btn.click(); break; }
        }
      `)
      await wait(200)
    }
  })

  it('should click Add to Cart', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Size & Color Selection', 'should click Add to Cart')

    await browser.executeScript(`
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent.trim().match(/add to cart/i) && btn.offsetWidth > 0) { btn.click(); break; }
      }
    `)
    await wait(500)
  })
})

// =============================================================================
// PRODUCT PAGE — Tabs & Gallery
// =============================================================================
describe('Product Page — Tabs & Gallery', () => {
  beforeEach(async () => {
    await browser.get(`${BASE_URL}/product/1`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should switch between product detail tabs', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Tabs & Gallery', 'should switch between product detail tabs')

    await scrollDown(400)

    const tabLabels = ['Description', 'Additional Information', 'Reviews']
    for (const label of tabLabels) {
      await browser.executeScript(`
        const els = document.querySelectorAll('a, button, .nav-link');
        for (const el of els) {
          if (el.textContent.trim() === '${label}' && el.offsetWidth > 0) { el.click(); break; }
        }
      `)
      await wait(400)
    }
  })

  it('should interact with product image thumbnails', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Tabs & Gallery', 'should interact with product image thumbnails')

    const thumbnails = await browser.findElements(By.css('.product-single__thumbnail img, .product-gallery__thumb img'))
    for (let i = 0; i < Math.min(thumbnails.length, 5); i++) {
      try {
        await thumbnails[i].click()
        await wait(300)
      } catch { /* ignore */ }
    }
  })

  it('should navigate the image carousel', async () => {
    setTestMeta(TEST_FILE, 'Product Page — Tabs & Gallery', 'should navigate the image carousel')

    try {
      const nextBtn = await browser.findElement(By.css('.slick-next'))
      for (let i = 0; i < 4; i++) {
        await nextBtn.click()
        await wait(300)
      }
    } catch { /* ignore */ }

    try {
      const prevBtn = await browser.findElement(By.css('.slick-prev'))
      for (let i = 0; i < 2; i++) {
        await prevBtn.click()
        await wait(300)
      }
    } catch { /* ignore */ }
  })
})
