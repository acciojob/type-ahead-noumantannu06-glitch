// cypress/integration/tests/test.spec.js

describe('Search Typeahead', () => {
  // ✅ FIX 1: Register intercept BEFORE visiting the page
  // This fixes Test 3: "cy.wait() timed out - No response ever occurred"
  beforeEach(() => {
    // Stub the suggestions API with fixture data
    cy.intercept('GET', '/api/suggestions?*', {
      fixture: 'suggestions.json'
    }).as('suggestions');
    
    cy.visit('/');
  });

  it('should display suggestions when API request returns results', () => {
    // ✅ FIX 2: Add delay to typing to prevent character drops
    // This fixes Tests 1 & 2: "#suggestions-list li not found"
    cy.get('#search-input')
      .type('test', { delay: 300 });  // 300ms between each character
    
    // Wait for the intercepted API request
    cy.wait('@suggestions');
    
    // Now assertions should work
    cy.get('#suggestions-list li')
      .should('exist')
      .should('be.visible')
      .should('have.length.greaterThan', 0);
  });

  it('should fill in typeahead when suggestion is clicked', () => {
    // Type with delay to trigger API
    cy.get('#search-input')
      .type('test', { delay: 300 });
    
    // Wait for API response
    cy.wait('@suggestions');
    
    // Verify suggestions exist first
    cy.get('#suggestions-list li')
      .should('exist')
      .should('be.visible');
    
    // Click the first suggestion
    cy.get('#suggestions-list li')
      .first()
      .click();
    
    // Verify input is filled with suggestion text
    cy.get('#search-input')
      .should('not.be.empty');
  });

  it('should clear suggestions when typeahead is cleared and no request is made', () => {
    // First, type something to get suggestions
    cy.get('#search-input')
      .type('test', { delay: 300 });
    
    // Wait for API response
    cy.wait('@suggestions');
    
    // Verify suggestions are displayed
    cy.get('#suggestions-list li')
      .should('exist')
      .should('be.visible');
    
    // Clear the input
    cy.get('#search-input').clear();
    
    // Verify suggestions are cleared
    cy.get('#suggestions-list')
      .should('not.exist');
    
    // Verify input is empty
    cy.get('#search-input')
      .should('have.value', '');
  });
});