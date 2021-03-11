/**
 * @file
 * Contains end-to-end tests for app or tool content on HSK site.
 */

 const tests = (cy) => {
  const landingPageUri = "/resources/rebel-base-locator";

  describe("The sample App or Tool content page", () => {
    it("successfully loads", () => {
      cy.visit(landingPageUri);
    });

    it("renders correctly", () => {
      // Take a snapshot for visual diffing.
      const percyOptions = {
        percyCSS: `time { visibility: hidden; }`
      }
      cy
        .visit(landingPageUri)
        .get(".image img")
        .each(($image, index, $images) => {
          cy
            .wrap($image)
            .scrollIntoView()
            .should("be.visible")
        })
        .then(() => {
          cy.percySnapshot("health_starter_kit_sample_app_or_tool_content_page", percyOptions);
        });
    });
  });
}

exports.tests = tests;
