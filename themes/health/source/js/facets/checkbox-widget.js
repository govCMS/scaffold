/**
 * @file
 * Transforms links into checkboxes.
 */

(function ($) {

  'use strict';

  Drupal.facets = Drupal.facets || {};

  /**
   * Custom override of Drupal.facets.makeCheckbox from the Facets module.
   */
  Drupal.facets.makeCheckbox = function () {
    var $link = $(this);
    var active = $link.hasClass('is-active');
    var description = $link.html();
    var href = $link.attr('href');
    var id = $link.data('drupal-facet-item-id');

    var checkbox = $('<input type="checkbox" class="facetapi-checkbox au-control-input__input" id="' + id + '" />')
      .attr('id', id)
      .data($link.data())
      .data('facetsredir', href);
    var label = $('<label class="au-control-input__text" for="' + id + '">' + description + '</label>')

    checkbox.on('change.facets', function (e) {
      Drupal.facets.disableFacet($link.parents('.js-facets-checkbox-links'));
      $(this).siblings('a')[0].click();
    });

    if (active) {
      checkbox.attr('checked', true);
      label.find('.js-facet-deactivate').remove();
    }

    $link.before(checkbox).before(label).hide();

    $link.parents('.facet-item').addClass('au-control-input au-control-input--compact au-control-input--block');

  };

})(jQuery);

