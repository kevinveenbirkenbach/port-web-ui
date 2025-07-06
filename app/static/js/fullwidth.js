/**
 * Toggles the .container class between .container and .container-fluid.
 * @param {boolean} enabled – true = full width, false = normal.
 */
function setFullWidth(enabled) {
  var el = document.querySelector('.container, .container-fluid');
  if (!el) return;
  if (enabled) {
    el.classList.replace('container', 'container-fluid');
    updateUrlFullWidth(true);
  } else {
    el.classList.replace('container-fluid', 'container');
    updateUrlFullWidth(false);
  }
}


/**
 * Reads the URL parameter `fullwidth` and applies full width if it's set.
 * @returns {boolean} – current full‐width state
 */
function initFullWidthFromUrl() {
  var isFull = new URLSearchParams(window.location.search).get('fullwidth') === '1';
  setFullWidth(isFull);
  return isFull;
}

/**
 * Adds or removes the `fullwidth=1` URL parameter.
 * @param {boolean} enabled
 */
function updateUrlFullWidth(enabled) {
  var url = new URL(window.location);
  if (enabled) url.searchParams.set('fullwidth', '1');
  else        url.searchParams.delete('fullwidth');
  window.history.replaceState({}, '', url);
}

// Expose globally
window.setFullWidth         = setFullWidth;
window.initFullWidthFromUrl = initFullWidthFromUrl;
window.updateUrlFullWidth   = updateUrlFullWidth;
