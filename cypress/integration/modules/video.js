/**
 * @file
 * Contains end-to-end tests for Video content on HSK site.
 */

 const tests = (cy) => {
  const page = "/resources/rise-darth-vader";

  describe("The sample video content page", () => {
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
        .get(".health-video__preview__link img")
        .should("be.visible")
        .percySnapshot("health_starter_kit_sample_video_page", percyOptions);
    });
  });
}

exports.tests = tests;
