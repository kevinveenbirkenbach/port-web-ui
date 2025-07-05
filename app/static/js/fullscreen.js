/**
 * Add or remove the `fullscreen=1` URL parameter.
 * @param {boolean} enabled
 */
function updateUrlFullscreen(enabled) {
  var url = new URL(window.location);
  if (enabled) url.searchParams.set('fullscreen', '1');
  else         url.searchParams.delete('fullscreen');
  window.history.replaceState({}, '', url);
}

/**
 * Enter fullscreen: hide header/footer, enable full width, recalc scroll,
 * set both URL params, update button.
 */
function enterFullscreen() {
  document.querySelectorAll('header, footer')
          .forEach(function(el){ el.style.display = 'none'; });
  setFullWidth(true);
  updateUrlFullscreen(true);

  const logo = document.getElementById('navbar_logo');
  if (logo) logo.classList.remove('d-none');

  if (typeof adjustScrollContainerHeight === 'function') adjustScrollContainerHeight();
  if (typeof updateCustomScrollbar      === 'function') updateCustomScrollbar();
}

/**
 * Exit fullscreen: show header/footer, disable full width, recalc scroll,
 * clear both URL params, update button.
 */
function exitFullscreen() {
  document.querySelectorAll('header, footer')
          .forEach(function(el){ el.style.display = ''; });
  setFullWidth(false);
  updateUrlFullscreen(false);

  const logo = document.getElementById('navbar_logo');
  if (logo) logo.classList.add('d-none');

  if (typeof adjustScrollContainerHeight === 'function') adjustScrollContainerHeight();
  if (typeof updateCustomScrollbar      === 'function') updateCustomScrollbar();
  if (typeof syncIframeHeight           === 'function') syncIframeHeight();
}

/**
 * Toggle between enter and exit fullscreen.
 */
function toggleFullscreen() {
  const params = new URLSearchParams(window.location.search);
  const isFull = params.get('fullscreen') === '1';

  if (isFull) exitFullscreen();
  else        enterFullscreen();
}

/**
 * Read `fullscreen` flag from URL on load.
 * @returns {boolean}
 */
function initFullscreenFromUrl() {
  return new URLSearchParams(window.location.search).get('fullscreen') === '1';
}

// On page load: apply fullwidth & fullscreen flags
window.addEventListener('DOMContentLoaded', function() {
  // first fullwidth
  var wasFullWidth = initFullWidthFromUrl();
  setFullWidth(wasFullWidth);

  // now fullscreen
  if (initFullscreenFromUrl()) {
    enterFullscreen();
  }
});

// Mirror native F11/fullscreen API events
document.addEventListener('fullscreenchange', function() {
  if (document.fullscreenElement) enterFullscreen();
  else                            exitFullscreen();
});
window.addEventListener('resize', function() {
  var isUiFs = Math.abs(window.innerHeight - screen.height) < 2;
  if (isUiFs) enterFullscreen();
  else         exitFullscreen();
});

// Expose globally
window.fullscreen       = enterFullscreen;
window.exitFullscreen   = exitFullscreen;
window.toggleFullscreen = toggleFullscreen;
