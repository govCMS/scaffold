/**
 * @file
 * Contains end-to-end tests for Publication content on HSK site.
 */
const { User } = require("./includes/User");

const tests = (cy) => {
  const page = "/resources/death-star-plans";

  describe("The sample Publication content page", () => {
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
          cy.percySnapshot("health_starter_kit_sample_publication_page", percyOptions);
        });
    });

    it("Order ID and Order text fields are visible based on orderable status of publication.", () => {
      const user = new User();
      const selectorOrderId = "#edit-field-h-order-id-0-value";
      const selectorOrderText = "#edit-field-h-order-text-wrapper";

      user.login("author", "author");
      const editPage = cy
        .visit(page)
        .get("#block-local-tasks-block a:contains('Edit')")
        .within(($link => {
          const editPageUrl = $link.attr("href");
          cy.visit(editPageUrl);
        }))
        .then(() => {
          cy
            .get(selectorOrderId)
            .should("be.visible")
            .get(selectorOrderText)
            .should("be.visible")
            .get("label").contains("Orderable")
            .siblings("input[type='checkbox']")
            .scrollIntoView()
            .within(($orderableCheckbox) => {
              $orderableCheckbox.click();
            })
            .then(() => {
              cy
              .get(selectorOrderId)
              .should("not.be.visible")
              .get(selectorOrderText)
              .should("not.be.visible");
            })
        });
    });
  });
}

exports.tests = tests;
