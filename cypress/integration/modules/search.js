/**
 * @file
 * Contains end-to-end tests for HSK site search.
 */

const tests = (cy) => {
  const targetPageUri = "/star-wars";
  const searchResultsPageUri = "/search";
  const searchFieldSelector = "#views-exposed-form-h-site-search-search-page input[name=search_api_fulltext]";
  const searchButtonSelector = "#views-exposed-form-h-site-search-search-page input[type=submit]";
  const searchResultsSelector = ".health-listing li";
  const searchTerms = "star";

  describe("Site search", () => {
    it("Search form is visible on page", () => {
      cy
        .visit(targetPageUri)
        .get("#views-exposed-form-h-site-search-search-page")
        .should("be.visible");
    });

    /**
     * @todo Search result tests have been disabled due to bug
     * @see https://trello.com/c/xc7Sq82u/327-search-result-e2e-tests-are-failing
     */
    // it("Search using valid search term returns a list of results", () => {
    //   cy
    //     .visit(targetPageUri)
    //     .get("#views-exposed-form-h-site-search-search-page")
    //     .should("be.visible")
    //     .get(searchFieldSelector)
    //     .type(searchTerms)
    //     .get(searchButtonSelector)
    //     .click()
    //     .get(searchResultsSelector)
    //     .its("length")
    //     .should("be.gt", 0);
    // });
  });
};

exports.tests = tests;
