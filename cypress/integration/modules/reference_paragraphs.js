/**
 * @file
 * Contains end-to-end tests for referenced content on HSK site.
 */

const tests = (cy) => {
  const page = "/reference-paragraphs";

  describe("The sample content page containing reference paragraphs", () => {
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
          cy.percySnapshot("health_starter_kit_sample_reference_paragraphs", percyOptions);
        });
    });
  });
};

exports.tests = tests;
