(function ($, Drupal, document) {

  'use strict';

  Drupal.behaviors.healthLazyLoad = {
    attach: function (context, settings) {
      $(document).ready(function () {
        // Lazy load callback.
        $("img[data-src]", context).on('lazyLoad_loaded', function(event, el) {
          bottomAlignImage($(el), $(el).parents('.health-image-text__image'));
        });
      });
    }
  };

})(jQuery, Drupal, document);
