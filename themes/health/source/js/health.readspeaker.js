/**
 * @file
 * ReadSpeaker.
 *
 */

(function ($, Drupal, document) {

  Drupal.behaviors.healthReadspeaker = {
    attach: function (context, settings) {

      // If this is the very first time Readspeaker has been used, we need to set a readspeaker cookie so that it will
      // load correctly the first time.
      if (Cookies.get('_rspkrLoadCore') === undefined) {
        Cookies.set('_rspkrLoadCore', 1);
      }

      // Listen button handler.
      $('#health-toolbar__listen').click(function(e) {
        e.preventDefault();

        // Store the href for use later.
        var href = $(this).attr('href');

        // If ReadSpeaker was already initialised.
        if (typeof readpage === 'function') {
          // Read the page.
          readpage(href, 'health-readspeaker');
        }

        // If not, then we load the scripts.
        else {
          $('#health-readspeaker-loading').show();
          var script = document.createElement('script');
          script.type = 'text/javascript';

          // webReader.js on load handler.
          script.onload = function () {

            // When ReadSpeaker is initialised, read the page.
            ReadSpeaker.q(function() {
              $('#health-readspeaker-loading').hide();
              readpage(href, 'health-readspeaker');
            });
          };

          // Add script to the DOM.
          script.src = '//f1-oc.readspeaker.com/script/5802/webReader/webReader.js?pids=wr&amp;notools=1&amp;stattype=healthbeta';
          document.getElementsByTagName('body')[0].appendChild(script);
        }
      });
    }
  };

})(jQuery, Drupal, document);
