/**
 * screen.js
 * Provides fullscreen and exitFullscreen functionality:
 * - fullscreen(): hides header/footer, expands container, recalculates main height, sets ?fullscreen=1
 * - exitFullscreen(): restores header/footer, container, recalculates main height, removes parameter
 * - toggleFullscreen(): toggles based on current state
 * - updateButtonIcon(): updates a button's icon/text based on fullscreen state
 * Reacts to URL ?fullscreen=1 on page load
 * Mirrors browser fullscreen (F11) via fullscreenchange and resize events
 */

// Update the toggle button's icon/text
function updateButtonIcon() {
  const btn = document.getElementById('fullscreen-btn');
  if (!btn) return;
  if (document.fullscreenElement) {
    btn.innerHTML = '<i class="fa fa-compress"></i>';
    btn.title = 'Exit Fullscreen';
  } else {
    btn.innerHTML = '<i class="fa fa-expand"></i>';
    btn.title = 'Enter Fullscreen';
  }
}

async function fullscreen() {
  // Hide header and footer
  document.querySelectorAll('header, footer').forEach(el => el && (el.style.display = 'none'));
  // Expand container to full width
  const container = document.querySelector('.container');
  if (container && !container.classList.contains('container-fluid')) {
    container.classList.replace('container', 'container-fluid');
  }
  // Recalculate main height (guarded)
  if (typeof adjustScrollContainerHeight === 'function') {
    try { adjustScrollContainerHeight(); } catch (e) { console.warn('adjustScrollContainerHeight failed:', e); }
  }
  if (typeof updateCustomScrollbar === 'function') {
    try { updateCustomScrollbar(); } catch (e) { console.warn('updateCustomScrollbar failed:', e); }
  }
  // Update URL parameter
  const url = new URL(window.location);
  url.searchParams.set('fullscreen', '1');
  window.history.replaceState({}, '', url);
  // Update toggle button
  updateButtonIcon();
}

function exitFullscreen() {
  // Show header and footer
  document.querySelectorAll('header, footer').forEach(el => el && (el.style.display = ''));
  // Revert container to default width
  const container = document.querySelector('.container-fluid');
  if (container) container.classList.replace('container-fluid', 'container');
  // Recalculate main height (guarded)
  if (typeof adjustScrollContainerHeight === 'function') {
    try { adjustScrollContainerHeight(); } catch (e) { console.warn('adjustScrollContainerHeight failed:', e); }
  }
  if (typeof updateCustomScrollbar === 'function') {
    try { updateCustomScrollbar(); } catch (e) { console.warn('updateCustomScrollbar failed:', e); }
  }
  // Remove URL parameter
  const url = new URL(window.location);
  url.searchParams.delete('fullscreen');
  window.history.replaceState({}, '', url);
  // Update toggle button
  updateButtonIcon();
}

function toggleFullscreen() {
  if (document.fullscreenElement) exitFullscreen();
  else fullscreen();
}

// On load: check URL param and set state
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('fullscreen') === '1') fullscreen();
  else updateButtonIcon();
});

function isAnyBrowserFullscreen() {
  // Fullscreen API  
  const apiFs = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  // Browser-chrome F11 fullscreen
  const uiFs = Math.abs(window.innerHeight - screen.height) < 2;

  // PWA fullscreen
  const pwaFs = window.matchMedia('(display-mode: fullscreen)').matches;

  return apiFs || uiFs || pwaFs;
}

// 1) Fullscreen API change (for JS-driven requestFullscreen)
document.addEventListener('fullscreenchange', () => {
  if (isAnyBrowserFullscreen()) fullscreen();
  else exitFullscreen();
});

// 2) Chromium F11 fallback
window.addEventListener('resize', () => {
  if (isAnyBrowserFullscreen()) fullscreen();
  else exitFullscreen();
});

// Expose functions globally
window.fullscreen = fullscreen;
window.exitFullscreen = exitFullscreen;
window.toggleFullscreen = toggleFullscreen;
window.updateButtonIcon = updateButtonIcon;
