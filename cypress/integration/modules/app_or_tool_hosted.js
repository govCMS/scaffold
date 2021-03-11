/**
 * @file
 * Contains end-to-end tests for app or tool content on HSK site.
 */

 const tests = (cy) => {
   const landingPageUri = "/resources/rebel-base-calculator/app";

  describe("The sample App or Tool - Hosted content page", () => {
    it("successfully loads", () => {
      cy.visit(landingPageUri);
    });

    it("renders correctly", () => {
      // Take a snapshot for visual diffing.
      const percyOptions = {
        percyCSS: `time { visibility: hidden; }`
      }
        cy.visit(landingPageUri);
        cy.get('.ButtonPanel_component-button-panel__3doTu button').contains('7').click();
        cy.get('.ButtonPanel_component-button-panel__3doTu button').contains('x').click();
        cy.get('.ButtonPanel_component-button-panel__3doTu button').contains('9').click();
        cy.get('.ButtonPanel_component-button-panel__3doTu button').contains('=').click();
        cy.get('.Display_component-display__T1qck div').should('contain', 63)
        .then(() => {
          cy.percySnapshot("health_starter_kit_sample_app_or_tool_content_page_hosted", percyOptions);
        });
    });
  });
}

exports.tests = tests;
