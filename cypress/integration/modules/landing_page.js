/**
 * @file
 * Contains end-to-end tests for landing page content on HSK site.
 */

 const tests = (cy) => {
  const landingPageUri = "/star-wars-trilogy";

  describe("The sample landing page content page", () => {
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
        .scrollTo("bottom")
        .get(".image img")
        .each(($image, index, $images) => {
          cy
            .wrap($image)
            .scrollIntoView()
            .should("be.visible")
        })
        .then(() => {
          cy.percySnapshot("health_starter_kit_sample_landing_page", percyOptions);
        });
    });
  });
};

exports.tests = tests;
