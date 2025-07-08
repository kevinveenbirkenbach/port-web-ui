// cypress/e2e/container.spec.js

describe('Custom Scroll & Container Resizing', () => {
  beforeEach(() => {
    // Assumes your app is running at baseUrl, and container.js is loaded on “/”
    cy.visit('/');
  });

  it('on load, the scroll-container gets a positive height and proper overflow', () => {
    // wait for our JS to run
    cy.window().should('have.property', 'adjustScrollContainerHeight');

    // Grab the inline style of .scroll-container
    cy.get('.scroll-container')
      .should('have.attr', 'style')
      .then(style => {
        // height:<number>px must be present
        const m = style.match(/height:\s*(\d+(?:\.\d+)?)px/);
        expect(m, 'height set').to.not.be.null;
        expect(parseFloat(m[1]), 'height > 0').to.be.greaterThan(0);

        // overflow shorthand should include both hidden & auto (order-insensitive)
        expect(style).to.include('overflow:');
        expect(style).to.match(/overflow:\s*(hidden\s+auto|auto\s+hidden)/);
      });
  });

  it('on window resize, scroll-container height updates', () => {
    // record original height
    cy.get('.scroll-container')
      .invoke('css', 'height')
      .then(orig => {
        // resize to a smaller viewport
        cy.viewport(320, 480);
        cy.wait(100); // allow resize handler to fire

        cy.get('.scroll-container')
          .invoke('css', 'height')
          .then(newH => {
            expect(parseFloat(newH), 'height changed on resize').to.not.equal(parseFloat(orig));
          });
      });
  });

  context('custom scrollbar thumb', () => {
    beforeEach(() => {
      // inject tall content to force scrolling
      cy.get('.scroll-container').then($sc => {
        $sc[0].innerHTML = '<div style="height:2000px">long</div>';
      });
      // re-run scrollbar setup
      cy.window().invoke('updateCustomScrollbar');
    });

    it('shows a thumb with reasonable size & position', () => {
      cy.get('#custom-scrollbar').should('have.css', 'opacity', '1');

      cy.get('#scroll-thumb')
        .should('have.css', 'height')
        .then(h => {
          const hh = parseFloat(h);
          expect(hh).to.be.at.least(20);
          // ensure thumb is smaller than container
          cy.get('#custom-scrollbar')
            .invoke('css', 'height')
            .then(ch => {
              expect(hh).to.be.lessThan(parseFloat(ch));
            });
        });

      // scroll a bit and verify thumb.top changes
      cy.get('.scroll-container').scrollTo(0, 200);
      cy.wait(50);
      cy.get('#scroll-thumb')
        .invoke('css', 'top')
        .then(t => {
          expect(parseFloat(t)).to.be.greaterThan(0);
        });
    });

    it('hides scrollbar when content fits', () => {
      // remove overflow
      cy.get('.scroll-container').then($sc => {
        $sc[0].innerHTML = '<div style="height:10px">tiny</div>';
      });
      cy.window().invoke('updateCustomScrollbar');
      cy.get('#custom-scrollbar').should('have.css', 'opacity', '0');
    });
  });
});
