// cypress/e2e/iframe.spec.js

describe('Iframe integration', () => {
  beforeEach(() => {
    // Visit the app’s base URL (configured in cypress.config.js)
    cy.visit('/');
  });

  it('opens the iframe when an .iframe-link is clicked', () => {
    // Find the first iframe-link on the page
    cy.get('.iframe-link').first().then($link => {
      const href = $link.prop('href');

      // Click it
      cy.wrap($link).click();

      // The URL should now include ?iframe=<encoded href>
      cy.url().should('include', 'iframe=' + encodeURIComponent(href));

      // The <body> should have the "fullscreen" class
      cy.get('body').should('have.class', 'fullscreen');

      // And the <main> should contain a visible <iframe src="<href>">
      cy.get('main iframe')
        .should('have.attr', 'src', href)
        .and('be.visible');
    });
  });

  it('restores the original content when a .js-restore element is clicked', () => {
    // First open the iframe
    cy.get('.iframe-link').first().click();

    // Then click the first .js-restore element (e.g. header or logo)
    cy.get('.js-restore').first().click();

    // The URL must no longer include the iframe parameter
    cy.url().should('not.include', 'iframe=');

    // The <body> should no longer have the "fullscreen" class
    cy.get('body').should('not.have.class', 'fullscreen');

    // And no <iframe> should remain inside <main>
    cy.get('main iframe').should('not.exist');
  });
});
