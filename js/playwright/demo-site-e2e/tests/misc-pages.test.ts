import { page } from './setup'
import { BASE_URL, wait, scrollDown, scrollToBottom, scrollToTop, dismissCookieBanner } from './helpers'

// =============================================================================
// TEST CASE 9: Blog Page — Category Filters & Post Navigation
//
// DOM changes: ~20-25
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Blog Page — Category Filters & Post Navigation', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/blog`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should click through blog category filter tabs', async () => {
    // Blog filter tabs use .menu-link_us-s class — click only visible ones
    const categories = ['ALL', 'COMPANY', 'FASHION', 'STYLE', 'TRENDS', 'BEAUTY']
    for (const cat of categories) {
      await page.evaluate((catName) => {
        const links = Array.from(document.querySelectorAll('a.menu-link_us-s'))
        const match = links.find(a => a.textContent?.trim() === catName && (a as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      }, cat)
      await wait(400)
    }
  })

  it('should click on blog posts and navigate back', async () => {
    // Click "Continue Reading" links
    const readMoreLinks = await page.$$('a:has-text("Continue Reading"), a:has-text("CONTINUE READING")')
    for (let i = 0; i < Math.min(readMoreLinks.length, 3); i++) {
      const links = await page.$$('a:has-text("Continue Reading"), a:has-text("CONTINUE READING")')
      if (links[i]) {
        await links[i].click()
        await wait(500)
        await scrollDown(300)
        await scrollDown(300)
        await page.goBack()
        await wait(500)
      }
    }
  })

  it('should scroll through the blog page', async () => {
    await scrollDown(400)
    await scrollDown(400)
    await scrollDown(400)
    await scrollToBottom()
    await wait(300)
    await scrollToTop()
    await wait(300)
  })
})

// =============================================================================
// TEST CASE 10: Contact Page — Form Interaction
//
// DOM changes: ~15-20
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Contact Page — Form Interaction', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/contact`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should fill out the contact form fields', async () => {
    // Fill in Name
    const nameInput = await page.$('input[name="name"], input[placeholder*="Name" i]')
    if (nameInput) {
      await nameInput.click()
      await wait(200)
      await nameInput.fill('John Doe')
      await wait(300)
    }

    // Fill in Email
    const emailInput = await page.$('input[name="email"], input[type="email"], input[placeholder*="Email" i]')
    if (emailInput) {
      await emailInput.click()
      await wait(200)
      await emailInput.fill('john.doe@example.com')
      await wait(300)
    }

    // Fill in Message
    const messageInput = await page.$('textarea, textarea[name="message"]')
    if (messageInput) {
      await messageInput.click()
      await wait(200)
      await messageInput.fill(
        'This is a test message for the contact form. I am interested in learning more about your products and services.'
      )
      await wait(300)
    }
  })

  it('should clear and re-fill form fields to generate more DOM changes', async () => {
    const nameInput = await page.$('input[name="name"], input[placeholder*="Name" i]')
    const emailInput = await page.$('input[name="email"], input[type="email"], input[placeholder*="Email" i]')
    const messageInput = await page.$('textarea')

    // First fill
    if (nameInput) { await nameInput.fill('Jane Smith'); await wait(200) }
    if (emailInput) { await emailInput.fill('jane@test.com'); await wait(200) }
    if (messageInput) { await messageInput.fill('First draft message'); await wait(200) }

    // Clear and refill
    if (nameInput) { await nameInput.fill(''); await wait(200); await nameInput.fill('Alice Johnson'); await wait(200) }
    if (emailInput) { await emailInput.fill(''); await wait(200); await emailInput.fill('alice@example.org'); await wait(200) }
    if (messageInput) { await messageInput.fill(''); await wait(200); await messageInput.fill('Updated message with more details about accessibility testing.'); await wait(200) }
  })

  it('should scroll the contact page and interact with the map', async () => {
    await scrollDown(300)
    await scrollDown(300)
    await scrollToBottom()
    await wait(300)
    await scrollToTop()
    await wait(300)
  })
})

// =============================================================================
// TEST CASE 11: About Page — Scrolling
//
// DOM changes: ~10-15
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('About Page — Scrolling', () => {
  beforeEach(async () => {
    await page.goto(`${BASE_URL}/about`)
    await wait(500)
    await dismissCookieBanner()
  })

  it('should scroll through the entire about page', async () => {
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollDown(300)
    await scrollToBottom()
    await wait(400)
    await scrollToTop()
    await wait(300)
  })
})

// =============================================================================
// TEST CASE 12: Multi-Product Interaction — Visit Several Products
//
// DOM changes: ~40-50
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Multi-Product Interaction — Visit Several Products', () => {
  const productIds = [249, 250, 251, 252, 253, 254, 255, 256]

  it('should visit each product page and interact with size and quantity', async () => {
    for (const id of productIds) {
      await page.goto(`${BASE_URL}/product/${id}`)
      await wait(400)

      // Click a size option (M) — sizes are <label class="swatch">
      await page.evaluate(() => {
        const labels = Array.from(document.querySelectorAll('label.swatch'))
        const match = labels.find(l => l.textContent?.trim() === 'M' && (l as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      })
      await wait(200)

      // Increment quantity
      const plusBtn = await page.$('button:has-text("+")')
      if (plusBtn) {
        await plusBtn.click()
        await wait(200)
      }

      // Scroll down
      await scrollDown(400)

      // Click a tab
      const reviewsTab = await page.$('a[href*="tab-reviews"], a:has-text("Reviews")')
      if (reviewsTab) {
        await reviewsTab.click()
        await wait(300)
      }
    }
  })
})

// =============================================================================
// TEST CASE 13: Cross-Site Navigation — Full Journey
//
// DOM changes: ~25-35
// Comment out this describe block to skip these interactions.
// =============================================================================
describe('Cross-Site Navigation — Full Journey', () => {
  it('should navigate through the entire site like a real user', async () => {
    // Start at home
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await dismissCookieBanner()
    await scrollDown(500)
    await scrollDown(500)

    // Go to Shop via nav
    await page.goto(`${BASE_URL}/shop`)
    await wait(500)
    await scrollDown(300)

    // Navigate directly to a product (avoids hidden duplicate links)
    await page.goto(`${BASE_URL}/product/252`)
    await wait(500)

    // Select a size and color — sizes are <label class="swatch">
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label.swatch'))
      const match = labels.find(l => l.textContent?.trim() === 'L' && (l as HTMLElement).offsetWidth > 0)
      if (match) (match as HTMLElement).click()
    })
    await wait(200)

    const colorSwatches = await page.$$('.color-list a, .swatch-color a')
    if (colorSwatches.length > 0) {
      await colorSwatches[0].click()
      await wait(200)
    }

    // Scroll to tabs, click Additional Information
    await scrollDown(400)
    const addInfoTab = await page.$('a[href*="tab-additional"], a:has-text("Additional Information")')
    if (addInfoTab) { await addInfoTab.click(); await wait(400) }

    // Navigate to Blog
    await page.goto(`${BASE_URL}/blog`)
    await wait(500)
    await scrollDown(400)
    await scrollDown(400)

    // Navigate to About
    await page.goto(`${BASE_URL}/about`)
    await wait(500)
    await scrollDown(300)
    await scrollDown(300)

    // Navigate to Contact and fill form
    await page.goto(`${BASE_URL}/contact`)
    await wait(500)
    const nameInput = await page.$('input[name="name"], input[placeholder*="Name" i]')
    if (nameInput) { await nameInput.fill('Test User'); await wait(200) }
    const emailInput = await page.$('input[name="email"], input[type="email"], input[placeholder*="Email" i]')
    if (emailInput) { await emailInput.fill('test@demo.com'); await wait(200) }
    await scrollDown(300)

    // Return home
    await page.goto(`${BASE_URL}/`)
    await wait(500)
    await scrollDown(400)
  })
})
