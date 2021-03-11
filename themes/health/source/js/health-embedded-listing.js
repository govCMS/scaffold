/**
 * @file
 * Provides custom functionality for embedded listings.
 */

/**
 * Class representing an embedded listing.
 */
class HealthEmbeddedListing {

  /**
   * Class constructor.
   *
   * @param {number} index
   *   Represents the order on the page of the embedded listing.  A value of
   *   0 represents the first embedded listing from the top of the page.
   * @param {Object} listing
   * @param {Object} jquery
   *   Instance of the jQuery class.
   * @param {Object} document
   *   Reference to the window document object.
   */
  constructor(index, listing, jquery, document) {
    this.index = index;
    this.document = document;
    this.$ = jquery

    // Process listing.
    this.$listing = this.$(listing);

    // Process exposed filters.
    const $exposedForm = this.$listing.children(".views-exposed-form");
    if ($exposedForm.length > 0) {
      this.$exposedForm =  $exposedForm;

      // Process exposed filter submit buttons.
      let $button = this.$exposedForm.find("input[type='submit']");
      $button.each((index, element) => {
        const $button = this.$(element);
        // Get button type.
        const buttonTypeRegex = new RegExp(/^edit-(submit|reset)/);
        const buttonType = $button.attr("id").match(buttonTypeRegex)[1];

        // Add submit button handler.
        $button.on("click touchstart", event => {
          event.preventDefault();
          const healthEmbeddedListingEvent = new CustomEvent(
            "healthEmbeddedListingUpdate",
            {
              detail: {
                op: buttonType,
                anchorId: this.getAnchorName(),
                listingId: this.getIndex(),
                newPageNumber: null
              }
            }
          );
          this.document.dispatchEvent(healthEmbeddedListingEvent);
        });
      });
    }
    else {
      this.$exposedForm = null;
    }

    // Process pager.
    const $pager = this.$listing.children(".health-pager");
    this.$pager = ($pager.length > 0) ? $pager : null;
    if (this.$pager !== null) {
      // Attach handler for pagination link interactions.
      this.$pager.find("a").on("click touchstart", event => {
        event.preventDefault();
        const healthEmbeddedListingEvent = new CustomEvent(
          "healthEmbeddedListingUpdate",
          {
            detail: {
              op: "pagination",
              anchorId: this.getAnchorName(),
              listingId: this.getIndex(),
              newPageNumber: this.getNewPageNumber(event.currentTarget.href)
            }
          }
        );
        this.document.dispatchEvent(healthEmbeddedListingEvent);
    });
    }
  }

  /**
   * Get the "name" attribute value of the anchor element.
   *
   * @return {string}
   *   The ID attribute of the embedded listing wrapper element.
   */
  getAnchorName() {
    return this.$listing.children("a").first().attr("name");
  }

  /**
   * Get index of embedded listing.
   *
   * @return {number}
   *   The index of the embedded listing which represents the order of the
   *   embedded listing on the page. The index value starts at 0 which
   *   represents the first embedded listing from the top of the page.
   */
  getIndex() {
    return this.index;
  }

  /**
   * Get target pagination page number.
   *
   * @param {string} url
   *   URL string.
   *
   * @return {string}
   *   Target pagination page number.
   */
  getNewPageNumber(url) {
    const urlParts = url.split("?");
    let pageNumber = "";

    // Process URL query string if it exists.
    if (urlParts.length === 2) {
      urlParts[1].split("&").forEach(item => {
        let [key, value] = item.split("=");
        if (key === "page") {
          pageNumber = value.split("%2C").slice(-1).pop();
        }
      });
    }

    return pageNumber;
  }

  /**
   * Get exposed form.
   *
   * @return {Object}
   *   Instance of jQuery object representing Embedded listing exposed filter
   *   form.
   */
  getExposedForm() {
    return this.$exposedForm;
  }

  /**
   * Get listing.
   *
   * @return {Object}
   *   Instance of jQuery object respresenting content listing component of
   *   embedded listing.
   */
  getListing() {
    return this.$listing;
  }

  /**
   * Get pager.
   *
   * @return {Object}
   *   Instance of jQuery object representing pager component of embedded
   *   listing.
   */
  getPager() {
    return this.$pager;
  }

  /**
   * Get exposed filter form values.
   *
   * @return {Object}
   *   Values of the filter form fields.
   */
  _getExposedFilterValues(op = "get") {
    const values = {};
    const $form = this.getExposedForm();
    const fieldNames = [
      "field_h_audience_target_id",
      "field_h_publication_type_target_id",
      "type"
    ];

    fieldNames.forEach(field => {
      const $field = $form.find(`[name^='${field}']`).first();
      if ($field.length > 0) {
        values[$field.attr("name")] = (op === "reset") ? "All" : $field.val();
      }
    });

    return values;
  }

  /**
   * Get exposed filter parameters.
   *
   * @return {Object}
   *   Exposed filter parameters as key-value pairs.
   */
  getExposedFilterParams() {
    let params = {};

    // Process exposed filters.
    if (this.getExposedForm() !== null) {
      params = this._getExposedFilterValues();
    }

    return params;
  }

  /**
   * Get exposed sort form values.
   *
   * @return {Object}
   *   Values of the sort form fields.
   */
  _getExposedSortValues() {
    const values = {};
    const $form = this.$exposedForm;
    values[`sort_by_${this.getIndex()}`] = $form.find("select[name='sort_by']").first().val();
    values[`sort_order_${this.getIndex()}`] = $form.find("select[name='sort_order']").first().val();

    return values;
  }

  /**
   * Get exposed sort parameters.
   *
   * @return {Object}
   *   Exposed sort parameters as key-value pairs.
   */
  getExposedSortParams() {
    let params = {};

    // Process exposed filters.
    if (this.getExposedForm() !== null && this.hasExposedSort()) {
      params = this._getExposedSortValues();
    }

    return params;
  }

  /**
   * Get parameters used to reset exposed filters in a listing.
   *
   * @return {Object}
   *   Exposed filter parameters as key-value pairs where the value is set to
   *   default (i.e. "All").
   */
  getResetFilterParams() {
    let params = {};

    // Process exposed filters.
    if (this.getExposedForm() !== null) {
      params = this._getExposedFilterValues('reset');
    }

    return params;
  }

  /**
   * Check if listing exposes filter options to site visitors.
   *
   * @return {boolean}
   *   Is true if the listing has filter options exposed to the site visitor.
   */
  hasExposedFilters() {
    let exposed = false;

    if (Object.keys(this.getExposedFilterParams()).length > 0) {
      exposed = true;
    }

    return exposed;
  }

  /**
   * Check if listing exposes sort options to site visitors.
   *
   * @return {boolean}
   *   Is true if the listing has sort options exposed to the site visitor.
   */
  hasExposedSort() {
    let exposed = false;

    if (this.getExposedForm() !== null) {
      const hasSortByField = (this.$("[id^='edit-sort-by']", this.$exposedForm).length > 0) ? true : false;
      const hasSortOrderField = (this.$("[id^='edit-sort-order']", this.$exposedForm).length > 0) ? true : false;
      if (hasSortByField || hasSortOrderField) {
        exposed = true;
      }
    }

    return exposed;
  }

  /**
   * Check if embedded listing has a pager.
   *
   * @return {boolean}
   *   true if embedded listing contains a pager, otherwise false is returned.
   */
  hasPager() {
    return (this.getPager() !== null) ? true : false;
  }

}

/**
 * Class representing all instances of embedded listings on a page.
 */
class HealthEmbeddedListings {

  /**
   * Class constructor.
   *
   * @param {Object} jquery
   *   Instance of the jQuery class.
   * @param {Object} document
   *   Reference to the window document object.
   */
  constructor(jquery, document) {
    this.document = document;
    this.$ = jquery;
    this.listings = this.processListings();
  }

  /**
   * Process embedded form listings.
   *
   * Adds embedded listings to the class.
   *
   * @return {Object[]}
   *   Instances of embedded listings on a page.
   */
  processListings() {
    const $listingList = this.$(".health-embedded-listing-wrapper");
    const listings = [];

    $listingList.each((index, item) => {
      // Make sure exposed filter forms have a unique id.
      const $item = this.$(item);
      $item.find('form').first().attr({
        id: "views-exposed-form-h-embedded-listing-embed-" + index,
        "data-drupal-selector": "views-exposed-form-h-embedded-listing-embed-" + index
      });

      let listing = new HealthEmbeddedListing(index, $item[0], this.$, this.document);
      listings.push(listing);
    });

    return listings;
  }

  /**
   * Get specific instance of HealthEmbbedListing class.
   *
   * @param {number} delta
   *   Delta of the instance to return. The first instance has a delta of "0".
   *
   * @return {Object}
   *   Instance of HealthEmbeddedListing class.
   *
   * @throws
   *   error if provided delta doesn't exist.
   */
  get(delta) {
    if (this.listings[delta]) {
      return this.listings[delta];
    }
    else {
      throw new Error("Not a valid listing delta.");
    }
  }

  /**
   * Get all instances of embedded listings on the page.
   *
   * @return {Object[]}
   *   List of all embedded listings present on the page.
   */
  getAll() {
    return this.listings;
  }

  /**
   * Get updated URL query parameters.
   *
   * @param {Object} event
   *   Instance of JavaScript CustomEvent class.
   *
   * @return {string}
   *   Provides URL query string representing the updated state of embedded
   *   listings in the page.
   */
  getQueryParams(event, drupalSettings) {
    let query = "";
    let filters = {};
    let sortBy = {};
    let pager = {};
    let params = {};

    // Determine if event is related to submit, reset or pagination operation.
    const operation = event.detail.op;
    // Determine which embedded listing instance triggered the event.
    const activeListingIndex = event.detail.listingId;

    const listings = this.getAll();

    // Process filters and sort options.
    listings.forEach(listing => {
      let exposedFilterParams = {};
      let exposedSortParams = {};
      let listingIndex = listing.getIndex();

      if (operation === "reset" && listing.getIndex() == activeListingIndex) {
        // Reset all exposed filters to their default values.
        if (listing.hasExposedFilters()) {
          exposedFilterParams = listing.getResetFilterParams();
        }
        if (listing.hasExposedSort()) {
          // Reset all exposed sort options to their default values.
          exposedSortParams = {
            sort_by: drupalSettings.health_embedded_listings[listingIndex].default.sort_by,
            sort_order: drupalSettings.health_embedded_listings[listingIndex].default.sort_order,
          };
        }
      }
      else {
        // Get values of exposed filters and sort options.
        if (listing.hasExposedFilters()) {
          exposedFilterParams = listing.getExposedFilterParams();
        }
        if (listing.hasExposedSort()) {
          exposedSortParams = listing.getExposedSortParams();
        }
      }

      filters = {
        ...filters,
        ...exposedFilterParams
      };
      sortBy = {
        ...sortBy,
        ...exposedSortParams
      }
    });

    // Process pagination.
    const originalUrlQueryParams = new URLSearchParams(window.location.search);

    let pages = [];
    if (originalUrlQueryParams.has("page")) {
      // Get default pagination page numbers from URL query parameters.
      pages = originalUrlQueryParams
        .get("page")
        .split(",");
    }
    else {
      // Pagination page not previously set to default to first page
      // in pagination.
      for (let i = 0; i < listings.length; i++) {
        pages.push(0);
      }
    }
    // Update pagination page number based on which pagination link was
    // clicked.
    const numericRegexPattern = new RegExp(/^-?[\d.]+(?:e-?\d+)?$/);
    if (typeof event.detail.newPageNumber !== undefined && numericRegexPattern.test(event.detail.newPageNumber)) {
      let newPageNumber = event.detail.newPageNumber;
      pages[event.detail.listingId] = newPageNumber;
    }
    // Reset pagination on any listings where the filter value has been
    // changed. This is done by comparing current filter value with that
    // in the URL query parameter.
    originalUrlQueryParams.forEach((value, key) => {
      const filterRegex = new RegExp(/.*_([0-9]*)$/);
      const sortOrderRegex = new RegExp(/^(sort_by|sort_order)/);
      const result = key.match(filterRegex);
      if (Array.isArray(result) && result.length > 1 && !sortOrderRegex.test(key)) {
        const embeddedListingIndex = result[1];
        if (filters[key] !== originalUrlQueryParams.get(key)) {
          pages[embeddedListingIndex] = 0;
        }
      }
    });
    pager = {
      page: pages.join("%2C")
    };

    // Generate URL query string.
    params = {
      ...filters,
      ...sortBy,
      ...pager
    };
    let i = 0;
    for (const key in params) {
      let separator = (i === 0) ? "?" : "&";
      query += separator + key + "=" + params[key];
      i++;
    }

    return query;
  }

}

(($, document, drupalSettings) => {

  // Process embedded listings on page ready event.
  $(() => {
    const healthEmbeddedListings = new HealthEmbeddedListings($, document, drupalSettings);
    const url = window.location.origin + window.location.pathname;
    document.addEventListener("healthEmbeddedListingUpdate", event => {
      const hash = (typeof event.detail.anchorId === "string") ? `#${event.detail.anchorId}` : ``;
      const query = healthEmbeddedListings.getQueryParams(event, drupalSettings);
      window.location.href = `${url}${query}${hash}`;
    });
  });

})(jQuery, document, drupalSettings);
