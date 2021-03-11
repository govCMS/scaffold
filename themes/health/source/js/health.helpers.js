"use strict";

/**
 * Add a margin top to an image to push it down to the bottom of its parent div.
 *
 * @param img
 *   jQuery image element
 * @param parent
 *   jQuery parent element
 */
function bottomAlignImage(img, parent) {
  // Make the images flush with the bottom of the div.
  // Clear the current margin top, otherwise it will add.
  img.css('margin-top', '');
  // Work out the height of the parent then subtract the image height.
  img.css('margin-top', parent.height() - img.height());
}
