/**
 * @file
 * Use to make sure selected elements have an equal height.
 */
(($, Drupal) => {
  Drupal.behaviors.healthMatchHeight = {
    attach: (context, settings) => {
      $(".health-card-list--matchheight .health-card").matchHeight();
    }
  }
})(jQuery, Drupal)
