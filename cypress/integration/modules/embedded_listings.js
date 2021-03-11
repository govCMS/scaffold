/**
 * @file
 * Contains end-to-end tests for embedded listings on HSK site.
 */

 const tests = (cy) => {
  const targetPageUri = "/star-wars";

  describe("Embedded listings", () => {
    it("visible on page", () => {
      cy
        .visit(targetPageUri)
        .get(".health-embedded-listing-wrapper")
        .should("be.visible")
        .its("length")
        .should("be.eq", 2);
    });

    it("Embedded listings contain the correct items", () => {
      cy.visit(targetPageUri);
      cy
        .get(".health-embedded-listing-wrapper")
        .eq(0)
        .within(() => {
          cy
            .get("h3")
            .eq(0)
            .contains("A-wing");
          cy
            .get("h3")
            .eq(1)
            .contains("Code of the Sith");
          cy
            .get("h3")
            .eq(2)
            .contains("Death Star Plans");
          cy
            .get("nav.health-pager")
            .eq(0)
            .should("be.visible")
            .within(() => {
              cy
                .get(".pager__item")
                .its("length")
                .should("be.eq", 4);
            })
        });
      cy
        .get(".health-embedded-listing-wrapper")
        .eq(1)
        .within(() => {
          cy
            .get("h3")
            .eq(0)
            .contains("A-wing");
          cy
            .get("h3")
            .eq(1)
            .contains("Code of the Sith");
          cy
            .get("h3")
            .eq(2)
            .contains("Death Star Plans");
          cy
            .get("nav.health-pager")
            .eq(0)
            .should("be.visible")
            .within(() => {
              cy
                .get(".pager__item")
                .its("length")
                .should("be.eq", 4);
            });
        });
    });
  });
};

exports.tests = tests;
