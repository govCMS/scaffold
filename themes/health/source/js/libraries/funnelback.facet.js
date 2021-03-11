/**
 * @file
 * Funnelback functionality.
 */

(function ($) {
  'use strict';
  Drupal.behaviors.funnelbackFacetBehavior = {
    attach: function (context, settings) {
      $('.facet', context).on('click', function () {
        // Go to the URL in the link after this.
        window.location.href = $(this).find('input').attr('redirect');
      });
    }
  };
})(jQuery);
