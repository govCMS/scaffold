(($, document) => {
  $(document).ready(() => {
    $('.health-toolbar__share').once().each((index, element) => {
      const $healthToolbarShare = $(element);
      const healthToolbarShareId = `health-toolbar__share-${index}`;
      const $healthShareMenu = $healthToolbarShare.siblings(".health-share-menu");
      const healthShareMenuId = `health-share-menu-${index}`;

      $healthToolbarShare.attr("id", healthToolbarShareId);
      $healthShareMenu.attr("id", healthShareMenuId);

      health.tooltip(document.getElementById(healthToolbarShareId), {
        html: $healthShareMenu[0],
        trigger: "click",
        appendTo: $healthToolbarShare.parent('li')[0]
      });
    });

  });
})(jQuery, document);
