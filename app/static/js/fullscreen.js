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
 * Starts a requestAnimationFrame loop that calls your recalc methods,
 * and stops automatically when the header’s max-height transition ends.
 */
function recalcWhileCollapsing() {
  const header = document.querySelector('header');
  if (!header) return;

  // 1) Start the RAF loop
  let rafId;
  const step = () => {
    adjustScrollContainerHeight();
    updateCustomScrollbar();
    rafId = requestAnimationFrame(step);
  };
  step();

  // 2) Listen for the end of the max-height transition
  function onEnd(e) {
    if (e.propertyName === 'max-height') {
      cancelAnimationFrame(rafId);
      header.removeEventListener('transitionend', onEnd);
    }
  }
  header.addEventListener('transitionend', onEnd);
}

function enterFullscreen() {
  document.body.classList.add('fullscreen');
  setFullWidth(true);
  updateUrlFullscreen(true);

  // fade in logo… (unchanged)
  const logo = document.getElementById('navbar_logo');
  if (logo) {
    logo.classList.remove('d-none');
    requestAnimationFrame(() => logo.style.opacity = '1');
  }

  // now recalc in lock-step with the CSS collapse animation
  recalcWhileCollapsing();
}

function exitFullscreen() {
  document.body.classList.remove('fullscreen');
  setFullWidth(false);
  updateUrlFullscreen(false);

  // fade out logo… (unchanged)
  const logo = document.getElementById('navbar_logo');
  if (logo) {
    logo.style.opacity = '0';
    logo.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'opacity') {
        logo.classList.add('d-none');
        logo.removeEventListener('transitionend', handler);
      }
    });
  }

  // recalc while header/footer expand back
  recalcWhileCollapsing();
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
