// cypress/e2e/fullwidth.spec.js

describe('Full-width Toggle', () => {
  // test page must include your <div class="container"> wrapper
  const ROOT = '/'; 

  it('defaults to .container when no param is present', () => {
    cy.visit(ROOT);
    cy.get('.container, .container-fluid')
      .should('have.class', 'container')
      .and('not.have.class', 'container-fluid');
      
    // URL should not include `fullwidth`
    cy.url().should('not.include', 'fullwidth=');
  });

  it('initFullWidthFromUrl() picks up ?fullwidth=1 on load', () => {
    cy.visit(`${ROOT}?fullwidth=1`);
    cy.get('.container, .container-fluid')
      .should('have.class', 'container-fluid')
      .and('not.have.class', 'container');
    cy.url().should('include', 'fullwidth=1');
  });

  it('setFullWidth(true) switches to container-fluid and updates URL', () => {
    cy.visit(ROOT);

    // call your global function
    cy.window().invoke('setFullWidth', true);

    cy.get('.container, .container-fluid')
      .should('have.class', 'container-fluid')
      .and('not.have.class', 'container');

    cy.url().should('include', 'fullwidth=1');
  });

  it('setFullWidth(false) reverts to container and removes URL param', () => {
    cy.visit(`${ROOT}?fullwidth=1`);

    // now reset
    cy.window().invoke('setFullWidth', false);

    cy.get('.container, .container-fluid')
      .should('have.class', 'container')
      .and('not.have.class', 'container-fluid');

    cy.url().should('not.include', 'fullwidth=1');
  });

  it('updateUrlFullWidth() toggles the query param without changing layout', () => {
    cy.visit(ROOT);

    // manually toggle URL only
    cy.window().invoke('updateUrlFullWidth', true);
    cy.url().should('include', 'fullwidth=1');

    cy.window().invoke('updateUrlFullWidth', false);
    cy.url().should('not.include', 'fullwidth=');
  });
});
