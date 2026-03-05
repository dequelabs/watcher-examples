// =============================================================================
// PRODUCT PAGE — Size & Color Selection (~25 DOM changes)
// =============================================================================
describe('Product Page — Size & Color Selection', () => {
  beforeEach(() => {
    cy.visit('/product/1')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should select different product sizes', () => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    sizes.forEach(size => {
      cy.get('.product-single__swatches button, .size-select button').filter(':visible').contains(size).first().then($btn => {
        if ($btn.length) {
          cy.wrap($btn).click({ force: true })
          cy.wait(300)
        }
      })
    })
  })

  it('should interact with color options and quantity controls', () => {
    // Color dropdown
    cy.get('select.color-select, .product-single__swatches select').then($select => {
      if ($select.length) {
        cy.wrap($select.first()).select(1)
        cy.wait(300)
        cy.wrap($select.first()).select(2)
        cy.wait(300)
      }
    })

    // Quantity increment
    cy.get('button').filter(':visible').contains('+').first().then($btn => {
      if ($btn.length) {
        for (let i = 0; i < 5; i++) {
          cy.wrap($btn).click()
          cy.wait(200)
        }
      }
    })

    // Quantity decrement
    cy.get('button').filter(':visible').contains('-').first().then($btn => {
      if ($btn.length) {
        for (let i = 0; i < 3; i++) {
          cy.wrap($btn).click()
          cy.wait(200)
        }
      }
    })
  })

  it('should click Add to Cart', () => {
    cy.get('button').filter(':visible').contains(/add to cart/i).first().click()
    cy.wait(500)
  })
})

// =============================================================================
// PRODUCT PAGE — Tabs & Gallery (~25 DOM changes)
// =============================================================================
describe('Product Page — Tabs & Gallery', () => {
  beforeEach(() => {
    cy.visit('/product/1')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should switch between product detail tabs', () => {
    cy.scrollDownBy(400)

    const tabLabels = ['Description', 'Additional Information', 'Reviews']
    tabLabels.forEach(label => {
      cy.get('a, button, .nav-link').filter(':visible').contains(label).first().click({ force: true })
      cy.wait(400)
    })
  })

  it('should interact with product image thumbnails', () => {
    cy.get('.product-single__thumbnail img, .product-gallery__thumb img').then($thumbs => {
      const count = Math.min($thumbs.length, 5)
      for (let i = 0; i < count; i++) {
        cy.wrap($thumbs.eq(i)).click({ force: true })
        cy.wait(300)
      }
    })
  })

  it('should navigate the image carousel', () => {
    cy.get('.product-single__nav .slick-next, button[aria-label="Next"]').then($btn => {
      if ($btn.length) {
        for (let i = 0; i < 4; i++) {
          cy.wrap($btn.first()).click({ force: true })
          cy.wait(300)
        }
      }
    })

    cy.get('.product-single__nav .slick-prev, button[aria-label="Previous"]').then($btn => {
      if ($btn.length) {
        for (let i = 0; i < 2; i++) {
          cy.wrap($btn.first()).click({ force: true })
          cy.wait(300)
        }
      }
    })
  })
})
