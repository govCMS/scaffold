/**
 * @file
 * Contains end-to-end tests for Global Notification content on HSK site.
 */

const tests = (cy) => {
  const page = "/";

  describe("Global notification", () => {
    it("three notifications appear on the page", () => {
      cy
        .visit(page)
        .get(".health-listing--notification .health-listing__item--notification")
        .should("have.length", 3)
    });

    it("notification dissappears when clicked", () => {
      cy
      .get(".health-notification__button")
      .first()
      .click()
      .get(".health-listing--notification .health-listing__item--notification:visible")
      .should("have.length", 2)
    });

    it("previously closed notificaiton does not appear on page reload", () => {
      cy
        .visit(page)
        .get(".health-notification__button")
        .first()
        .click()
        .reload()
        .get(".health-listing--notification .health-listing__item--notification:visible")
        .should("have.length", 2);
    });
  });
};

exports.tests = tests;
