(function ($, Drupal, window) {

  'use strict';

  // Force users to add a moderation note.
  Drupal.behaviors.adminimalMedelaLockTextFormats = {
    attach: function (context, settings) {

      /**
       * Prevent users from choosing a text format.
       *
       * @param format
       * @param fields
       */
      function lockTextFormat(format, fields) {
        for(var i=0;i<fields.length;i++) {
          $(fields[i]).val(format);
          $(fields[i]).parent().hide();
        }
      }

      // Lock down the text format authors can use.
      for (var i=0; i<drupalSettings.lockTextFormats.length; i++) {
        lockTextFormat(drupalSettings.lockTextFormats[i]['format'], [drupalSettings.lockTextFormats[i]['selector'] + ' .filter-list']);
      }
    }
  };

})(jQuery, Drupal, window);
