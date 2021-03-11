(function ($, Drupal, window) {

  'use strict';

  // Force users to add a moderation note.
  Drupal.behaviors.adminimalMedelaModeration = {
    attach: function (context, settings) {

      var $log_input = $('#edit-revision-log-0-value', context),
        $log_wrapper = $('.form-item-revision-log-0-value', context);

      // Style the label so it is mandatory.
      $log_wrapper.find('label').addClass('form-required');

      // On form submit.
      $('form.node-form').submit(function () {
        // Check if the revision field is empty.
        if ($log_input.val() == '') {
          // Add styling to indicate it is required and focus on the field.
          $log_input.focus().addClass('error');
          // Add error message if it is not there yet.
          if ($log_wrapper.find('.form-item--error-message').length == 0) {
            $log_wrapper.append('\
              <div class="form-item--error-message">\
                <strong>Revision log message field is required.</strong>\
              </div>\
            ');
          }
          // Don't submit the form.
          return false;
        } else {
          // Submit the form.
          return true;
        }
      });
    }
  };

})(jQuery, Drupal, window);
