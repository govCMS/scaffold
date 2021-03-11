/**
 * @file
 * Manage cookie-based show and hide of global notifications.
 *
 * Any 'active global notification' is to be displayed atop every Drupal
 *   page,
 * as a thin, highlighting banner. If the user dismisses a banner item by
 * clicking a button, then the current version of the notification no longer
 * appears atop any page. However if any dismissed active notification gets
 * updated then the user will again be shown  the notification as a banner.
 *
 * This functionality is via cookies on the user's browser:  the javascript
 * checks for the existence of a cookie for each currently active
 *   notification. Before the javascript does that check, the notifications
 *   are all hidden. If  a cookie is found then the notification remains
 *   hidden, otherwise it is shown. A cookie (to hide the notification) is
 *   created when a user dismisses a banner.
 *
 * Garbage accumulation :
 * Global notifications may be active for some time so each cookie's
 * expiry date is far into the future (e.g. 365 days away).
 * Over time it may be that a cookie will persist for a node that was long
 *   ago
 * either updated or made inactive.
 * This can happen because the cookie is based on the
 * notification's moderation id and whenever an author edits or inactivates a
 * notification, the active notification's moderation id changes.
 * The old cookie for the notification then becomes garbage because the
 *   version of the notification to which it refers is no longer active.
 *
 * Garbage collection :
 * Garbage collection (removal of cookies no longer needed) runs on each page
 * load if the site has active global notifications.
 * The garbage collection mechanism removes any global notification cookie
 * that does not represent an edit in the current DOM.
 *
 * @see https://github.com/js-cookie/js-cookie/tree/latest#readme
 *   Documentation for the Javascript Cookie API.
 *
 * Note that if browser refuses cookies then the fallback behaviour is that
 * the banner item cannot be dismissed.
 */
(($, Drupal, navigator) => {

  Drupal.behaviors.healthGlobalNotification = {
    attach: (context) => {
      const $activeGlobalNotificationBanners = $('.view--h-global-notifications', context);
      const $activeGlobalNotifications = $('.health-notification', $activeGlobalNotificationBanners);

      if ($activeGlobalNotifications.length) {
        // active global notifications exist

        const boolCookiesEnabled = navigator.cookieEnabled;

        if (boolCookiesEnabled) {
          // User's browser can handle cookies.

          // Constant for duration of any new cookie which needs to be set.
          const DAYS_IN_YEAR = 365;

          // Common pattern for name of any cookie for this show/hide task.
          const COOKIE_PREFIX = 'health-global-notification-';

          //  Before IE 11, html5 dataset constructs are not supported.
          //  Use el.hasAttribute + el.getAttribute instead.
          const IDENTITY_ATTR = 'data-health-notification-id';

          // Begin by reading all the visible cookies into json.
          // Further steps will work with global notification cookies found.
          const jsonAllVisibleCookies = Cookies.get();

          // Initialize an array to hold all the moderation ids found in
          // 'global notification' cookies.
          let arrCookieIds = [];

          if (jsonAllVisibleCookies !== null) {
            for (let strCookieName in jsonAllVisibleCookies) {
              if (
                strCookieName.length > COOKIE_PREFIX.length &&
                strCookieName.substr(0, COOKIE_PREFIX.length) === COOKIE_PREFIX
              ) {
                arrCookieIds[arrCookieIds.length] = strCookieName.substr(COOKIE_PREFIX.length, strCookieName.length);
              }
            }
          }

          $activeGlobalNotifications.each((index, element) => {
            const $activeNotification = $(element);
            const $activeNotificationListItem = $activeNotification.parents(".health-listing__item--notification");
            const $dismissButton = $('.health-notification__button', $activeNotification);
            let valNotificationId;

            if (element.hasAttribute(IDENTITY_ATTR)) {
              valNotificationId = element.getAttribute(IDENTITY_ATTR);
            }

            if (arrCookieIds.length) {
              // Evidence of 'active' global notifications has been found, and
              // user has dismissed (hidden) at least one notification.
              // Task: Compare each active notification moderation id vs
              // the elements of the array of cookie moderation ids,
              // to decide if the notification remains hidden and
              // to identify which cookies to keep.
              if (valNotificationId !== null) {
                const valIndexCookie = arrCookieIds.indexOf(valNotificationId);

                if (valIndexCookie !== -1) {
                  // Found a cookie to hide this active notification.
                  // The cookie is not garbage. Use 'splice' to remove this
                  // array element from the ids to be discarded.
                  arrCookieIds.splice(valIndexCookie, 1);
                }
                else {
                  // No cookie for this notification, so remove its "hidden"
                  // DOM class and add a click event handler.
                  $activeNotificationListItem.removeClass('hidden');

                  // Click handling:
                  // hide the notification, set a cookie.
                  $dismissButton.on('click touchstart', function (event) {
                    const strCookieName = COOKIE_PREFIX + valNotificationId;
                    $activeNotificationListItem.fadeOut(event => {
                      $activeNotificationListItem.addClass('hidden');
                    })
                    Cookies.set(strCookieName, 0, { expires: DAYS_IN_YEAR });
                  });

                }
              }
              else {
                const NO_IDENTITY = true;
              }
            }
            else {
              // The browser has no global notification cookies so show them.
              $activeNotificationListItem.fadeOut(event => {
                $activeNotificationListItem.removeClass('hidden');
              });

              if (valNotificationId !== null) {
                // Hide the notification and set a cookie.
                $dismissButton.on('click touchstart', event => {
                  const strCookieName = COOKIE_PREFIX + valNotificationId;
                  $activeNotificationListItem.fadeOut(event => {
                    $activeNotificationListItem.removeClass('hidden');
                  });
                  Cookies.set(strCookieName, 0, { expires: DAYS_IN_YEAR });
                });
              }
              else {
                // (Fringe case) Cannot uniquely identify the notification
                // by an ID so hide the 'dismiss' button.
                $dismissButton.fadeOut(event => {
                  $activeNotificationListItem.removeClass('hidden');
                });
              }
            }
          });

          // Garbage collection:
          // All ids still in the cookie-ids array point to garbage.
          if (arrCookieIds.length) {
            // Remove each related cookie.
            arrCookieIds.forEach((entry) => {
              const strGarbageCookieName = COOKIE_PREFIX + entry;
              Cookies.remove(strGarbageCookieName);
            });
          }
        }
        else {
          // (Fringe case) There are active global notifications but
          // cookies are not enabled in the user's browser.
          // Show every active notification but hide each 'dismiss' button.
          $activeGlobalNotifications.each((index, element) => {
            const $activeNotification = $(element);
            const $activeNotificationListItem = $activeNotification.parents(".health-listing__item--notification");
            $activeNotificationListItem.removeClass('hidden');
            const $dismissButton = $('.health-notification__button', $activeNotification);
            $dismissButton.hide();
          });
        }
      }
    }
  }
})(jQuery, Drupal, navigator);
