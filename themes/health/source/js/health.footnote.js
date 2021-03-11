const health = health || {};

(($, Drupal) => {
  /**
   * Footnotes and references.
   */
  Drupal.behaviors.healthFootnote = {
    attach: (context, settings) => {
      // Find all the footnote and reference links.
      $(".health-references__link, .health-footnotes__link", context).each(
        (index, element) => {
          const $element = $(element);
          // Add a title attribute to each link based on the full footnote/reference.
          // This is used for tippy js.
          $element.attr("title", $($element.attr("aria-describedby")).html());
        }
      );
    }
  };
})(jQuery, Drupal);
