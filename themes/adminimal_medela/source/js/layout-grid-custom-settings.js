((Drupal, $) => {

  Drupal.behaviors.adminimalMedelaLayoutGridCustomSettings = {
    attach: (context, settings) => {
      const $itemsPerRowFields = $(".field--name-field-h-items-per-row", context);

      $itemsPerRowFields.once().each((index, element) => {
        const $itemsPerRowField = $(element);
        const $itemsPerRowSelector = $("select[name$='[subform][field_h_items_per_row]']", $itemsPerRowField);
        const $itemsPerRowOptions = $itemsPerRowField.siblings("details");

        // Hide custom col width options if custom col widths has not been
        // selected.
        if ($itemsPerRowSelector.val() !== 'custom') {
          $itemsPerRowOptions.hide();
        }

        // Toggle display of custom col width settings based selected col width
        // option.
        $itemsPerRowSelector.change(event => {
          const $select = $(event.target, context);
          if ($select.val() === 'custom') {
            $itemsPerRowOptions.fadeIn();
          }
          else {
            // Hide custom col width options if custom col width option is not
            // selected.
            $itemsPerRowOptions.fadeOut();
          }
        });
      });

    }
  };

})(Drupal, jQuery);