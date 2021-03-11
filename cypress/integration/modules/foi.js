/**
 * @file
 * Contains end-to-end tests for Collection content pages in the HSK site.
 */

const tests = (cy) => {
  const page = "/foi/holographic-disguise-matrix";

  describe("The sample FOI Request content page", () => {
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
        .scrollTo("bottom")
        .percySnapshot("health_starter_kit_sample_foi_request_page", percyOptions);
    });
  });
}

exports.tests = tests;
