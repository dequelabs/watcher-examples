// =============================================================================
// HOME PAGE — Hero & Navigation (~15-20 DOM changes)
// =============================================================================
describe('Home Page — Hero & Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should interact with the hero section and scroll through content', () => {
    cy.get('a').contains('Buy Now').first().click()
    cy.wait(500)
    cy.go('back')
    cy.wait(500)
    cy.scrollDownBy(400)
    cy.scrollDownBy(400)
    cy.scrollDownBy(400)
    cy.scrollDownBy(400)
  })

  it('should interact with the main navigation links', () => {
    const navLabels = ['Shop', 'Blog', 'About', 'Contact']
    navLabels.forEach(label => {
      cy.get('.navigation__link').filter(':visible').contains(label).click()
      cy.wait(500)
      cy.go('back')
      cy.wait(500)
    })
  })
})

// =============================================================================
// HOME PAGE — Category Tabs & Product Cards (~15-20 DOM changes)
// =============================================================================
describe('Home Page — Category Tabs & Product Cards', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should click through best-selling product category tabs', () => {
    cy.get('h2').first().scrollIntoView()
    cy.wait(500)

    const tabLabels = ['Kitchen', 'Storage', 'Bedroom', 'Dining Room']
    tabLabels.forEach(label => {
      cy.get('nav a, button, a.nav-link').filter(':visible').contains(label).first().click({ force: true })
      cy.wait(400)
    })
  })

  it('should click Shop Now links on category cards', () => {
    cy.scrollDownBy(600)

    cy.get('a, button').filter(':visible').contains('Shop Now').first().click()
    cy.wait(500)
    cy.go('back')
    cy.wait(500)
    cy.scrollDownBy(600)

    cy.get('a, button').filter(':visible').contains('Shop Now').eq(1).click()
    cy.wait(500)
    cy.go('back')
    cy.wait(500)
  })
})

// =============================================================================
// HOME PAGE — Footer & Newsletter (~15-20 DOM changes)
// =============================================================================
describe('Home Page — Footer & Newsletter', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should scroll to footer and interact with newsletter signup', () => {
    cy.scrollDownBy(500)
    cy.scrollDownBy(500)
    cy.scrollDownBy(500)
    cy.scrollDownBy(500)
    cy.scrollDownBy(500)
    cy.scrollDownBy(500)
    cy.scrollToBottom()
    cy.wait(500)

    cy.get('footer').find('input[type="email"], input[type="text"]').first().then($input => {
      if ($input.length) {
        cy.wrap($input).click()
        cy.wait(200)
        cy.wrap($input).type('test@example.com')
        cy.wait(300)
      }
    })
  })

  it('should click on footer links', () => {
    cy.scrollToBottom()
    cy.wait(500)

    cy.get('footer a').then($links => {
      const validLinks: string[] = []
      $links.each((_, el) => {
        const href = el.getAttribute('href')
        if (href && href !== '#' && !href.startsWith('http') && validLinks.length < 5) {
          validLinks.push(href)
        }
      })
      validLinks.forEach(href => {
        cy.visit(href)
        cy.wait(500)
        cy.go('back')
        cy.wait(500)
        cy.scrollToBottom()
      })
    })
  })
})
