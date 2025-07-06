function adjustScrollContainerHeight() {
  const mainEl = document.getElementById('main');
  const scrollContainer = mainEl.querySelector('.scroll-container');
  const scrollbarContainer = document.getElementById('custom-scrollbar');
  const container = mainEl.parentElement;
  
  let siblingsHeight = 0;
  Array.from(container.children).forEach(child => {
    if(child !== mainEl && child !== scrollbarContainer) {
      const style = window.getComputedStyle(child);
      const height = child.offsetHeight;
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      siblingsHeight += height + marginTop + marginBottom;
    }
  });
  
  // Calculate the available height for the scroll area
  const availableHeight = window.innerHeight - siblingsHeight;
  scrollContainer.style.height = availableHeight + 'px';
  scrollContainer.style.overflowY = 'auto';
  scrollContainer.style.overflowX = 'hidden';

  // Get the current position and height of the scroll container
  const scrollContainerRect = scrollContainer.getBoundingClientRect();

  // Set the position (top) and height of the custom scrollbar track
  scrollbarContainer.style.top = scrollContainerRect.top + 'px';
  scrollbarContainer.style.height = scrollContainerRect.height + 'px';
}

window.addEventListener('load', adjustScrollContainerHeight);
window.addEventListener('resize', adjustScrollContainerHeight);

// 2. Updates the thumb (size and position) of the custom scrollbar
function updateCustomScrollbar() {
  const scrollContainer = document.querySelector('.scroll-container');
  const thumb = document.getElementById('scroll-thumb');
  const customScrollbar = document.getElementById('custom-scrollbar');
  if (!scrollContainer || !thumb || !customScrollbar) return;
  
  const contentHeight = scrollContainer.scrollHeight;
  const containerHeight = scrollContainer.clientHeight;
  const scrollTop = scrollContainer.scrollTop;
  
  // Calculate the thumb height (minimum 20px)
  let thumbHeight = (containerHeight / contentHeight) * containerHeight;
  thumbHeight = Math.max(thumbHeight, 20);
  thumb.style.height = thumbHeight + 'px';
  
  // Calculate the thumb position
  const maxScrollTop = contentHeight - containerHeight;
  const maxThumbTop = containerHeight - thumbHeight;
  const thumbTop = maxScrollTop ? (scrollTop / maxScrollTop) * maxThumbTop : 0;
  thumb.style.top = thumbTop + 'px';
  
  // Show the scrollbar if content overflows, otherwise hide it
  customScrollbar.style.opacity = contentHeight > containerHeight ? '1' : '0';
}

// Update the thumb when the container is scrolled
const scrollContainer = document.querySelector('.scroll-container');
if (scrollContainer) {
  scrollContainer.addEventListener('scroll', updateCustomScrollbar);
}
window.addEventListener('resize', updateCustomScrollbar);
window.addEventListener('load', updateCustomScrollbar);

// 3. Interactivity: Enable drag & drop for the scroll thumb
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
  // Calculate the new thumb top position
  let newThumbTop = (scrollStartY / maxScrollTop) * maxThumbTop + deltaY;
  newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
  
  // Calculate the new scroll position based on the thumb position
  const newScrollTop = (newThumbTop / maxThumbTop) * maxScrollTop;
  scrollContainer.scrollTop = newScrollTop;
});

document.addEventListener('mouseup', function(e) {
  if (isDragging) {
    isDragging = false;
  }
});
