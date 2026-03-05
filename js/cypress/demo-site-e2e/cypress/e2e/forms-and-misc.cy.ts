// =============================================================================
// LOGIN & REGISTRATION (~20 DOM changes)
// =============================================================================
describe('Login & Registration', () => {
  beforeEach(() => {
    cy.visit('/login_register')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should interact with the login form fields', () => {
    cy.get('input[name="login_email"], input[placeholder*="name" i]').first().click()
    cy.wait(200)
    cy.get('input[name="login_email"], input[placeholder*="name" i]').first().type('testuser@example.com')
    cy.wait(300)

    cy.get('input[name="login_password"], input[type="password"]').first().click()
    cy.wait(200)
    cy.get('input[name="login_password"], input[type="password"]').first().type('password123')
    cy.wait(300)

    cy.get('input[type="checkbox"]').first().click({ force: true })
    cy.wait(200)
  })

  it('should switch to the registration tab and fill fields', () => {
    cy.get('a, button, .nav-link').filter(':visible').contains('Register').first().click()
    cy.wait(400)

    cy.get('input[name="register_username"], input[placeholder*="Username" i]').first().then($input => {
      if ($input.length) {
        cy.wrap($input).type('newuser123')
        cy.wait(300)
      }
    })

    cy.get('input[name="register_email"], input[placeholder*="email" i]').first().then($input => {
      if ($input.length) {
        cy.wrap($input).type('newuser@example.com')
        cy.wait(300)
      }
    })

    cy.get('input[name="register_password"], input[type="password"]').first().then($input => {
      if ($input.length) {
        cy.wrap($input).type('securepass456')
        cy.wait(300)
      }
    })
  })
})

// =============================================================================
// CHECKOUT FLOW (~20 DOM changes)
// =============================================================================
describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/shop_checkout')
    cy.wait(500)
    cy.dismissCookieBanner()
  })

  it('should fill out the billing form', () => {
    const fields = [
      { selector: 'input[placeholder*="First" i], input[name="first_name"]', value: 'Jane' },
      { selector: 'input[placeholder*="Last" i], input[name="last_name"]', value: 'Doe' },
      { selector: 'input[placeholder*="Company" i], input[name="company"]', value: 'Acme Corp' },
      { selector: 'input[placeholder*="Street" i], input[name="street_address"]', value: '123 Main St' },
      { selector: 'input[placeholder*="City" i], input[name="city"]', value: 'Springfield' },
      { selector: 'input[placeholder*="Postcode" i], input[name="postcode"]', value: '62701' },
      { selector: 'input[placeholder*="Phone" i], input[name="phone"]', value: '555-0123' },
      { selector: 'input[placeholder*="Email" i], input[name="email"]', value: 'jane@example.com' }
    ]

    fields.forEach(({ selector, value }) => {
      cy.get(selector).first().then($input => {
        if ($input.length && $input.is(':visible')) {
          cy.wrap($input).click()
          cy.wait(100)
          cy.wrap($input).type(value)
          cy.wait(200)
        }
      })
    })
  })

  it('should interact with country dropdown and payment methods', () => {
    cy.get('select').first().then($select => {
      if ($select.length) {
        cy.wrap($select).select(2)
        cy.wait(300)
        cy.wrap($select).select(5)
        cy.wait(300)
      }
    })

    cy.scrollDownBy(400)

    cy.get('input[type="radio"]').then($radios => {
      const count = Math.min($radios.length, 4)
      for (let i = 0; i < count; i++) {
        cy.wrap($radios.eq(i)).click({ force: true })
        cy.wait(300)
      }
    })
  })
})

// =============================================================================
// CONTACT & FAQ (~15-20 DOM changes)
// =============================================================================
describe('Contact & FAQ', () => {
  it('should fill out the contact form', () => {
    cy.visit('/contact')
    cy.wait(500)
    cy.dismissCookieBanner()

    cy.get('input[name="name"], input[placeholder*="Name" i]').first().then($input => {
      if ($input.length) {
        cy.wrap($input).type('Test User')
        cy.wait(200)
      }
    })

    cy.get('input[name="email"], input[placeholder*="Email" i]').first().then($input => {
      if ($input.length) {
        cy.wrap($input).type('test@example.com')
        cy.wait(200)
      }
    })

    cy.scrollDownBy(300)
    cy.scrollDownBy(300)
  })

  it('should expand and collapse FAQ accordions', () => {
    cy.visit('/faq')
    cy.wait(500)
    cy.dismissCookieBanner()

    cy.get('.accordion-button, button.faq-accordion, .faq__item button').then($btns => {
      const count = Math.min($btns.length, 9)
      // Expand all
      for (let i = 0; i < count; i++) {
        cy.wrap($btns.eq(i)).click({ force: true })
        cy.wait(300)
      }
      // Collapse all
      for (let i = 0; i < count; i++) {
        cy.wrap($btns.eq(i)).click({ force: true })
        cy.wait(200)
      }
    })
  })

  it('should browse the about page', () => {
    cy.visit('/about')
    cy.wait(500)
    cy.dismissCookieBanner()

    cy.scrollDownBy(400)
    cy.scrollDownBy(400)
    cy.scrollDownBy(400)
    cy.scrollToBottom()
  })
})
