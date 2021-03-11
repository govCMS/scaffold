/**
 * @file
 * Contains end-to-end tests for webforms on the HSK site.
 */

const tests = (cy) => {
  const page = "/collections/technical-specifications";

  describe("Request accessible documents", () => {
    it("request accessible documents webform works correctly", () => {
      cy
        .visit(page)
        .get("a[href='/request-accessible-format?destination=/collections/technical-specifications']")
        .click()
        .get("textarea[name='request_an_accessible_format']")
        .type("Test message")
        .get("input[name='your_email_address']")
        .type("test@health.gov.au")
        .get("input.health-report-issues-document-usability")
        .click()
        .get("h1")
        .url()
        .should('include', page)
    });
  });
}

exports.tests = tests;
