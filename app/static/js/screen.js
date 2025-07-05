/**
 * screen.js
 * Provides fullscreen and exitFullscreen functionality:
 * - fullscreen(): hides header/footer, expands container, recalculates main height, sets ?fullscreen=1
 * - exitFullscreen(): restores header/footer, container, recalculates main height, removes parameter
 * - toggleFullscreen(): toggles between modes
 * Reacts to URL ?fullscreen=1 on page load
 */

function fullscreen() {
  // Hide header and footer
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (header) header.style.display = 'none';
  if (footer) footer.style.display = 'none';

  // Expand container to full width
  const container = document.querySelector('.container');
  if (container && !container.classList.contains('container-fluid')) {
    container.classList.replace('container', 'container-fluid');
  }

  // Recalculate main height
  if (typeof adjustScrollContainerHeight === 'function') {
    adjustScrollContainerHeight();
  }
  if (typeof updateCustomScrollbar === 'function') {
    updateCustomScrollbar();
  }

  // Update URL parameter
  const url = new URL(window.location);
  url.searchParams.set('fullscreen', '1');
  window.history.replaceState({}, '', url);
}

function exitFullscreen() {
  // Show header and footer
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (header) header.style.display = '';
  if (footer) footer.style.display = '';

  // Revert container to default width
  const container = document.querySelector('.container-fluid');
  if (container) {
    container.classList.replace('container-fluid', 'container');
  }

  // Recalculate main height
  if (typeof adjustScrollContainerHeight === 'function') {
    adjustScrollContainerHeight();
  }
  if (typeof updateCustomScrollbar === 'function') {
    updateCustomScrollbar();
  }

  // Remove URL parameter
  const url = new URL(window.location);
  url.searchParams.delete('fullscreen');
  window.history.replaceState({}, '', url);
}

function toggleFullscreen() {
  const header = document.querySelector('header');
  if (header && header.style.display === 'none') {
    exitFullscreen();
  } else {
    fullscreen();
  }
}

// On load, check URL param and react
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('fullscreen') === '1') {
    fullscreen();
  }
});

// Expose functions globally
window.fullscreen = fullscreen;
window.exitFullscreen = exitFullscreen;
window.toggleFullscreen = toggleFullscreen;
