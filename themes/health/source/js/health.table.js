/**
 * @file
 * Provides custom functionality used by Content - Table paragraphs
 */
const health = health || {};

(($, Drupal) => {
  Drupal.behaviors.healthTable = {
    attach: (context, settings) => {
      // Find the footers in tables.
      $(".health-table__responsive tfoot", context).each(
        (index, element) => {
          const $element = $(element);
          let maxCols = 1;
          // Get the table.
          const $table = $element.parents("table");
          // Find all rows.
          $table.find("tr").each((delta, tableRow) => {
            const $tr = $(tableRow);
            // Find how many columns there are in this row.
            const cols = $tr.find("td, th").length;
            // If it is more than the max, store it.
            if (maxCols < cols) {
              maxCols = cols;
            }
          });
          // Add the max columns to the footer so it spans the width of the table.
          $element.find("td").attr("colspan", maxCols);
        }
      );
    }
  };
})(jQuery, Drupal);
