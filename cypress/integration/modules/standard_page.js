/**
 * @file
 * Contains end-to-end tests for Standard Page content on HSK site.
 */

const tests = (cy) => {
  const landingPageUri = "/star-wars";

  describe("The sample Standard Page content page", () => {
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
        .get(".image img")
        .each(($image, index, $images) => {
          cy
            .wrap($image)
            .scrollIntoView()
            .should("be.visible")
        })
        .then(() => {
          cy.percySnapshot("health_starter_kit_sample_standard_page", percyOptions);
        });
    });
  });

  describe("Table of cotents widget", () => {
    it("renders correctly", () => {
      cy
        .visit("/table-contents")
        .get("nav.au-inpage-nav-links li")
        .should("have.length", 3)
        .each(($link, index) => {
          const text = [
            "Description",
            "History",
            "Behind the scenes"
          ];
          cy.get($link)
            .should("be.visible")
            .should("contain", text[index]);
        });
    });
  });
};

exports.tests = tests;
