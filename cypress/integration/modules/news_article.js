/**
 * @file
 * Contains end-to-end tests for News content on HSK site.
 */

 const tests = (cy) => {
  const landingPageUri = "/news/force-friday-event-guide-updated";

  describe("The sample news content page", () => {
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
        .should("be.visible")
        .percySnapshot("health_starter_kit_sample_news_article_page", percyOptions);
    });
  });
};

exports.tests = tests;
