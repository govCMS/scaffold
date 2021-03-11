/**
 * @file
 * Contains end-to-end tests for Collection content pages in the HSK site.
 */

const tests = (cy) => {
  const page = "/collections/technical-specifications";

  describe("The sample Collection content page", () => {
    it("successfully loads", () => {
      cy.visit(page);
    });

    it("renders correctly", () => {
      // Take a snapshot for visual diffing.
      const percyOptions = {
        percyCSS: `time { visibility: hidden; }`
      }
      cy
        .visit(page)
        .get(".image img")
        .each(($image, index, $images) => {
          cy
            .wrap($image)
            .scrollIntoView()
            .should("be.visible")
        })
        .then(() => {
          cy.percySnapshot("health_starter_kit_sample_collection_page", percyOptions);
        });
    });
  });
}

exports.tests = tests;
