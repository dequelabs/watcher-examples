import { expect } from 'chai'
import { page } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, scrollToTop, dismissCookieBanner } from './helpers'

// =============================================================================
// TEST CASE 6: Product Detail Page — Sizes, Colors & Quantity
//
// DOM changes: ~40-50
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Product Detail Page — Sizes, Colors & Quantity', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/product/249`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click each size option', async () => {
    // Sizes are <label class="swatch js-swatch">, not buttons. Click visible ones only.
    const sizeLabels = ['XS', 'S', 'M', 'L', 'XL']
    for (const size of sizeLabels) {
      await page.evaluate((s) => {
        const labels = Array.from(document.querySelectorAll('label.swatch'))
        const match = labels.find(l => l.textContent?.trim() === s && (l as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      }, size)
      await wait(300)
    }
  })

  it('should click each color swatch', async () => {
    // Click each color option
    const colorSwatches = await page.$$('.color-list a, .product-single__swatches .swatch-color a')
    for (const swatch of colorSwatches) {
      await swatch.click()
      await wait(300)
    }
  })

  it('should increment and decrement the quantity multiple times', async () => {
    // Find the quantity input and +/- buttons
    const qtyInput = await page.$('input[type="number"]')
    expect(qtyInput).to.not.be.null

    // Click the + button several times
    const plusBtn = await page.$('button:has-text("+")')
    if (plusBtn) {
      for (let i = 0; i < 5; i++) {
        await plusBtn.click()
        await wait(200)
      }
    }

    // Click the - button several times
    const minusBtn = await page.$('button:has-text("-")')
    if (minusBtn) {
      for (let i = 0; i < 3; i++) {
        await minusBtn.click()
        await wait(200)
      }
    }

    // Directly set quantity via input
    if (qtyInput) {
      await qtyInput.fill('10')
      await wait(300)
      await qtyInput.fill('1')
      await wait(300)
    }
  })

  it.skip('should click Add to Wishlist and Share', async () => {
    // Click "Add to Wishlist"
    const wishlistBtn = await page.$('a:has-text("ADD TO WISHLIST"), button:has-text("ADD TO WISHLIST")')
    if (wishlistBtn) {
      await wishlistBtn.click()
      await wait(300)
    }

    // Click "Share"
    const shareBtn = await page.$('a:has-text("SHARE"), button:has-text("SHARE")')
    if (shareBtn) {
      await shareBtn.click()
      await wait(300)
    }
  })

  it('should click the Size Guide link', async () => {
    const sizeGuide = await page.$('a:has-text("Size Guide"), a:has-text("SIZE GUIDE")')
    if (sizeGuide) {
      await sizeGuide.click()
      await wait(500)
    }
  })
})

// =============================================================================
// TEST CASE 7: Product Detail Page — Tabs, Thumbnails & Gallery
//
// DOM changes: ~30-40
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Product Detail Page — Tabs, Thumbnails & Gallery', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/product/249`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should switch between product tabs', async () => {
    // Click "Description" tab
    const descTab = await page.$('a[href*="tab-description"], a:has-text("Description")')
    if (descTab) {
      await descTab.click()
      await wait(400)
    }
    await scrollDown(300)

    // Click "Additional Information" tab
    const addInfoTab = await page.$('a[href*="tab-additional"], a:has-text("Additional Information")')
    if (addInfoTab) {
      await addInfoTab.click()
      await wait(400)
    }
    await scrollDown(200)

    // Click "Reviews" tab
    const reviewsTab = await page.$('a[href*="tab-reviews"], a:has-text("Reviews")')
    if (reviewsTab) {
      await reviewsTab.click()
      await wait(400)
    }
    await scrollDown(200)

    // Click back to "Description"
    const descTab2 = await page.$('a[href*="tab-description"], a:has-text("Description")')
    if (descTab2) {
      await descTab2.click()
      await wait(400)
    }
  })

  it('should click through product image thumbnails', async () => {
    // Click each thumbnail image to change the main product image
    const thumbnails = await page.$$('.product-single__image--thumbnails img, .swiper-slide img')
    for (let i = 0; i < Math.min(thumbnails.length, 4); i++) {
      await thumbnails[i].click()
      await wait(400)
    }
  })

  it('should use the image gallery next arrow', async () => {
    // Click the gallery next/prev arrows
    const nextArrow = await page.$('.swiper-button-next, button[class*="next"]')
    if (nextArrow) {
      for (let i = 0; i < 3; i++) {
        await nextArrow.click()
        await wait(300)
      }
    }

    const prevArrow = await page.$('.swiper-button-prev, button[class*="prev"]')
    if (prevArrow) {
      for (let i = 0; i < 2; i++) {
        await prevArrow.click()
        await wait(300)
      }
    }
  })

  it('should use Prev/Next product navigation', async () => {
    // Click "NEXT" to go to the next product
    const nextLink = await page.$('a:has-text("NEXT")')
    if (nextLink) {
      await nextLink.click()
      await wait(600)
    }

    // Scroll through the new product page
    await scrollDown(400)
    await scrollDown(400)

    // Click "PREV" to go back
    const prevLink = await page.$('a:has-text("PREV")')
    if (prevLink) {
      await prevLink.click()
      await wait(600)
    }

    await scrollDown(300)
  })
})

// =============================================================================
// TEST CASE 8: Product Detail — Scroll & Related Products
//
// DOM changes: ~20-25
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Product Detail — Scroll & Related Products', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/product/250`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should scroll through the entire product page', async () => {
    // Scroll through the full product page in increments
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollToBottom()
    await wait(400)
    await scrollToTop()
    await wait(300)
  })

  it('should click on related product links', async () => {
    // Scroll to related products section at the bottom
    await scrollToBottom()
    await wait(500)

    // Get visible related product hrefs, then navigate to them directly
    const hrefs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/product/"]'))
      const visible = links.filter(a => (a as HTMLElement).offsetWidth > 0)
      const unique = [...new Set(visible.map(a => a.getAttribute('href')))]
      return unique.filter(h => h !== '/product/250').slice(0, 3)
    })

    for (const href of hrefs) {
      await page.goto(`https://axe-devtools-web-demo.vercel.app${href}`)
      await wait(500)
      await scrollDown(300)
      await page.goBack()
      await wait(500)
      await scrollToBottom()
    }
  })
})
