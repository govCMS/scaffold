(($, Drupal, window) => {

  Drupal.behaviors.healthPrint = {
    attach: (context, settings) => {
      $('.health-toolbar__print', context).once().each((index, element) => {
        $(element).click(function (event) {
          event.preventDefault();
          window.print();
        });
      });
    }
  };

})(jQuery, Drupal, window);
