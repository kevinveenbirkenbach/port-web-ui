function adjustScrollContainerHeight() {
  // Elemente ermitteln
  const headerEl = document.querySelector('header');
  const navEl = document.querySelector('nav');
  const footerEl = document.querySelector('footer');
  const mainEl = document.getElementById('main');
  if (!mainEl) return;
  const scrollContainer = mainEl.querySelector('.scroll-container');
  if (!scrollContainer) return;
  
  let siblingsHeight = 0;
  
  if (headerEl) {
    const headerRect = headerEl.getBoundingClientRect();
    siblingsHeight += headerRect.height;
  }
  if (navEl) {
    const navRect = navEl.getBoundingClientRect();
    siblingsHeight += navRect.height*2;
  }
  if (footerEl) {
    const footerRect = footerEl.getBoundingClientRect();
    siblingsHeight += footerRect.height;
  }
  
  // Verfügbare Höhe berechnen: Fensterhöhe minus Höhe der Geschwister
  const availableHeight = window.innerHeight - siblingsHeight;
  
  // Setze die max-Höhe für den Scroll-Container
  scrollContainer.style.maxHeight = availableHeight + 'px';
  scrollContainer.style.overflowY = 'auto';
  scrollContainer.style.overflowX = 'hidden';
}

window.addEventListener('load', adjustScrollContainerHeight);
window.addEventListener('resize', adjustScrollContainerHeight);

// 2. Aktualisiert den Thumb (Größe und Position) der benutzerdefinierten Scrollbar
function updateCustomScrollbar() {
  const scrollContainer = document.querySelector('.scroll-container');
  const thumb = document.getElementById('scroll-thumb');
  const customScrollbar = document.getElementById('custom-scrollbar');
  if (!scrollContainer || !thumb || !customScrollbar) return;
  
  const contentHeight = scrollContainer.scrollHeight;
  const containerHeight = scrollContainer.clientHeight;
  const scrollTop = scrollContainer.scrollTop;
  
  // Berechne die Thumb-Höhe (mindestens 20px)
  let thumbHeight = (containerHeight / contentHeight) * containerHeight;
  thumbHeight = Math.max(thumbHeight, 20);
  thumb.style.height = thumbHeight + 'px';
  
  // Berechne die Position des Thumbs
  const maxScrollTop = contentHeight - containerHeight;
  const maxThumbTop = containerHeight - thumbHeight;
  const thumbTop = maxScrollTop ? (scrollTop / maxScrollTop) * maxThumbTop : 0;
  thumb.style.top = thumbTop + 'px';
  
  // Zeige die Scrollbar, falls der Inhalt überläuft, sonst ggf. ausblenden
  customScrollbar.style.opacity = contentHeight > containerHeight ? '1' : '0';
}

// Aktualisiere den Thumb bei Scrollen des Containers
const scrollContainer = document.querySelector('.scroll-container');
if (scrollContainer) {
  scrollContainer.addEventListener('scroll', updateCustomScrollbar);
}
window.addEventListener('resize', updateCustomScrollbar);
window.addEventListener('load', updateCustomScrollbar);

// 3. Interaktivität: Ermögliche Drag & Drop des Scroll-Thumbs
let isDragging = false;
let dragStartY = 0;
let scrollStartY = 0;

const thumb = document.getElementById('scroll-thumb');

if (thumb) {
  thumb.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragStartY = e.clientY;
    scrollStartY = scrollContainer.scrollTop;
    e.preventDefault();
  });
}

document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  const containerHeight = scrollContainer.clientHeight;
  const contentHeight = scrollContainer.scrollHeight;
  const thumbHeight = thumb.offsetHeight;
  
  const maxScrollTop = contentHeight - containerHeight;
  const maxThumbTop = containerHeight - thumbHeight;
  
  const deltaY = e.clientY - dragStartY;
  // Berechne neuen Thumb-Top-Wert
  let newThumbTop = (scrollStartY / maxScrollTop) * maxThumbTop + deltaY;
  newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
  
  // Berechne den neuen Scrollwert anhand der Thumb-Position
  const newScrollTop = (newThumbTop / maxThumbTop) * maxScrollTop;
  scrollContainer.scrollTop = newScrollTop;
});

document.addEventListener('mouseup', function(e) {
  if (isDragging) {
    isDragging = false;
  }
});
