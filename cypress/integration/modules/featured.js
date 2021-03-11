/**
 * @file
 * Contains end-to-end tests for featured content on HSK site.
 */

const tests = (cy) => {
  const page = "/featured-items";

  describe("Featured content on sample landing page", () => {
    it("Renders correctly", () => {
      cy
        .visit(page)
        .scrollTo("bottom")
        .get(".health-band")
        .should("be.visible")
        .its("length")
        .should("be.eq", 10);
    });
  });

  describe("Featured content field overrides", () => {
    it("Featured content field overrides are applied correctly", () => {
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
          cy
          .get(".health-band")
          .each(($band, index, $bands) => {
            if (index > 4) {
              console.log(index);
              cy
                .wrap($band)
                .within(() => {
                  cy
                    .get("h2")
                    .contains("Overridden Title");
                  cy
                    .get("p")
                    .contains("Overriden summary text content.");
                  cy
                    .get("a[href='https://starwars.com']")
                    .contains("See overridden link text");
                });
            }
          })
          .then(() => {
            const percyOptions = {
              percyCSS: `time { visibility: hidden; }`
            }
            cy.percySnapshot("health_starter_kit_sample_featured_content_landing_page", percyOptions);
          });
        });

    });
  });
}

exports.tests = tests;
