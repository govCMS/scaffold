const health = health || {};

(($, Drupal, window) => {
  // Modified version of smooth scrolling from toc_filter module.
  Drupal.healthTocScrollToOnClick = event => {
    const element = event.currentTarget;
    // Make sure links still has hash.
    if (!element.hash || element.hash === "#") {
      return true;
    }

    // Make sure the href is pointing to an anchor link on this page.
    const href = element.href.replace(/#[^#]*$/, "");
    const url = window.location.toString();

    if (href && url.indexOf(href) === -1) {
      return true;
    }

    // Find hash target.
    const $a = $(`[id="${element.hash.substring(1)}"]`);

    // Make hash target is on the current page.
    if (!$a.length) {
      return true;
    }

    // Scroll to hash target
    $("html, body").animate(
      {
        scrollTop: $a.offset().top
      },
      "medium"
    );
    return true;
  };

  // Triggering smooth scrolling.
  Drupal.behaviors.tocSmoothScroll = {
    attach: context => {
      health.inpagenav(".region--content");
      // Only map <a href="#..."> links
      $('a[href*="#"]', context).click(Drupal.healthTocScrollToOnClick);
    }
  };
})(jQuery, Drupal, window);
