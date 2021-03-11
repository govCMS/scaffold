(function ($, Drupal, window) {

  'use strict';

  // Create anchors and scroll if needed.
  Drupal.behaviors.healthAnchors = {
    attach: function (context, settings) {
      // Generate id's for all headings that don't have them so we can deep link.
      $('.region--content', context).find('h2,h3,h4,h5,h6').each(function (index, element) {
        var $element = $(this);
        if ($element.attr('id') === undefined) {
          var id = $element.text().replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
          $element.attr('id', id);
        }
        if ($('body.admin-show-anchor-helper').length) {
          $element.once('anchor-helper').on('click', function () {

            $element.append('<span class="anchor-helper">#' + $element.attr('id') + '</span>');
          });
        }
      });
      // Once it has finished adding anchors, check the url anchor fragment and scroll to that heading if needed.
      if (window.location.hash) {
        // Find hash target.
        var $a = $(window.location.hash);
        // Make hash target is on the current page.
        if (!$a.length) {
          return true;
        }
        // Scroll to hash target
        $('html, body', context).animate({scrollTop: $a.offset().top}, 'medium');
        $a.focus();
      }
    }
  };

})(jQuery, Drupal, window);
