/**
 * @file
 * JavaScript behaviors for jQuery Text Counter integration.
 */

(function ($, Drupal) {

  'use strict';

  // @see https://github.com/ractoon/jQuery-Text-Counter#options
  Drupal.webform = Drupal.webform || {};
  Drupal.webform.counter = Drupal.webform.counter || {};
  Drupal.webform.counter.options = Drupal.webform.counter.options || {};

  Drupal.webform.counter.options.countContainerClass = 'text--minor';

})(jQuery, Drupal);
