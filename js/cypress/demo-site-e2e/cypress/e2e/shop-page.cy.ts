// =============================================================================
// SHOP PAGE — Category & Brand Filters (~40-50 DOM changes)
// =============================================================================
describe('Shop Page — Category & Brand Filters', () => {
  beforeEach(() => {
    cy.visit('/shop')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should click through all product category filters', () => {
    const categories = ['Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Dining room', 'Storage', 'Outdoor', 'Accessories']
    categories.forEach(cat => {
      cy.window().then(win => {
        const links = Array.from(win.document.querySelectorAll('.shop-sidebar .accordion-body a.menu-link'))
        const match = links.find(a => a.textContent?.trim() === cat && (a as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      })
      cy.wait(400)
    })
  })

  it('should interact with color filter swatches', () => {
    cy.get('button').contains('Color').click({ force: true })
    cy.wait(300)

    cy.get('.swatch-color a, .color-list a').then($swatches => {
      const count = Math.min($swatches.length, 8)
      for (let i = 0; i < count; i++) {
        cy.wrap($swatches.eq(i)).click({ force: true })
        cy.wait(300)
      }
    })
  })

  it('should interact with brands filter list items', () => {
    const brandNames = ['Ikea', 'Lazyboy', 'Ember', 'Mullberry', 'Taggo', 'Grounded', 'Earthen']
    brandNames.forEach(brand => {
      cy.window().then(win => {
        const items = Array.from(win.document.querySelectorAll('.shop-sidebar .multi-select__item'))
        const match = items.find(li => li.textContent?.includes(brand) && (li as HTMLElement).offsetWidth > 0)
        if (match) (match as HTMLElement).click()
      })
      cy.wait(300)
    })
  })
})

// =============================================================================
// SHOP PAGE — Sorting & Grid View (~30-40 DOM changes)
// =============================================================================
describe('Shop Page — Sorting & Grid View', () => {
  beforeEach(() => {
    cy.visit('/shop')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should change the sort order multiple times', () => {
    cy.get('select.shop-acs__select').then($select => {
      if ($select.length) {
        const sortValues = ['1', '2', '3', '4', '5', '6', '7', '8']
        sortValues.forEach(val => {
          cy.wrap($select).select(val)
          cy.wait(400)
        })
      }
    })
  })

  it('should switch between grid view columns', () => {
    cy.get('button').filter(':visible').contains('2').first().click()
    cy.wait(400)
    cy.scrollDownBy(400)
    cy.scrollDownBy(400)

    cy.get('button').filter(':visible').contains('3').first().click()
    cy.wait(400)
    cy.scrollDownBy(400)

    cy.get('button').filter(':visible').contains('4').first().click()
    cy.wait(400)
    cy.scrollDownBy(400)
  })

  it('should interact with the price range filter', () => {
    cy.get('button').contains('Price').click({ force: true })
    cy.wait(300)

    cy.get('input[type="range"]').then($sliders => {
      if ($sliders.length >= 2) {
        cy.wrap($sliders.eq(0)).invoke('val', 200).trigger('input').trigger('change')
        cy.wait(400)
        cy.wrap($sliders.eq(1)).invoke('val', 800).trigger('input').trigger('change')
        cy.wait(400)
      }
    })
  })
})

// =============================================================================
// SHOP PAGE — Product Browsing (~20-30 DOM changes)
// =============================================================================
describe('Shop Page — Product Browsing', () => {
  beforeEach(() => {
    cy.visit('/shop')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should click Add to Wishlist on multiple products', () => {
    cy.get('button').contains('Add To Wishlist').then($btns => {
      const count = Math.min($btns.length, 4)
      for (let i = 0; i < count; i++) {
        cy.wrap($btns.eq(i)).click({ force: true })
        cy.wait(300)
      }
    })
  })

  it('should click into product detail pages and navigate back', () => {
    cy.get('a[href*="/product/"]').then($links => {
      const visited = new Set<string>()
      const hrefs: string[] = []
      $links.each((_, el) => {
        const href = el.getAttribute('href')
        if (href && !visited.has(href) && hrefs.length < 4) {
          visited.add(href)
          hrefs.push(href)
        }
      })
      hrefs.forEach(href => {
        cy.visit(href)
        cy.wait(500)
        cy.scrollDownBy(300)
        cy.go('back')
        cy.wait(500)
      })
    })
  })

  it('should scroll through the entire product list', () => {
    cy.scrollDownBy(300)
    cy.scrollDownBy(300)
    cy.scrollDownBy(300)
    cy.scrollDownBy(300)
    cy.scrollDownBy(300)
    cy.scrollToBottom()
    cy.wait(300)
    cy.window().then(win => win.scrollTo(0, 0))
    cy.wait(300)
  })
})
