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
  // hide header/footer
  document.querySelectorAll('header, footer').forEach(el => el.style.display = 'none');

  // go full-width
  setFullWidth(true);
  updateUrlFullscreen(true);

  // fade in logo
  const logo = document.getElementById('navbar_logo');
  if (logo) {
    logo.classList.remove('d-none');
    // next frame → trigger transition
    requestAnimationFrame(() => {
      logo.style.opacity = '1';
    });
  }

  // recalc scrollbars
  if (typeof adjustScrollContainerHeight === 'function') adjustScrollContainerHeight();
  if (typeof updateCustomScrollbar === 'function') updateCustomScrollbar();
}


/**
 * Exit fullscreen: show header/footer, disable full width, recalc scroll,
 * clear both URL params, update button.
 */
function exitFullscreen() {
  // show header/footer
  document.querySelectorAll('header, footer').forEach(el => el.style.display = '');

  // fade out logo
  const logo = document.getElementById('navbar_logo');
  if (logo) {
    logo.style.opacity = '0';
    logo.addEventListener('transitionend', function handler(e) {
      // only once, and only for opacity
      if (e.propertyName === 'opacity') {
        logo.classList.add('d-none');
        logo.removeEventListener('transitionend', handler);
      }
    });
  }

  // reset width
  setFullWidth(false);
  updateUrlFullscreen(false);

  // recalc scrollbars
  if (typeof adjustScrollContainerHeight === 'function') adjustScrollContainerHeight();
  if (typeof updateCustomScrollbar === 'function') updateCustomScrollbar();
  if (typeof syncIframeHeight === 'function') syncIframeHeight();
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
