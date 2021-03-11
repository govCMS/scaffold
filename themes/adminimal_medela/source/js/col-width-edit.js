/**
 * @file
 * Custom functionality for custom column width edit options in layout paragraphs.
 */
((Drupal, $) => {

  Drupal.behaviors.adminimalMedelaColWidthEdit = {
    attach: (context, settings) => {
      const $columnWidthFields = $(".field--name-field-h-two-column-widths", context);

      $columnWidthFields.once().each((index, element) => {
        const $colWidthField = $(element);
        const $colWidthSelector = $("select[name$='[subform][field_h_two_column_widths]']", $colWidthField);
        const $colWidthCustomOptions = $colWidthField.siblings("details");

        // Hide custom col width options if custom col widths has not been
        // selected.
        if ($colWidthSelector.val() !== 'custom') {
          $colWidthCustomOptions.hide();
        }

        // Toggle display of custom col width settings based selected col width
        // option.
        $colWidthSelector.change(event => {
          const $select = $(event.target, context);
          if ($select.val() === 'custom') {
            $colWidthCustomOptions.fadeIn();
          }
          else {
            // Hide custom col width options if custom col width option is not
            // selected.
            $colWidthCustomOptions.fadeOut();
          }
        });
      });

    }
  };

})(Drupal, jQuery);
