document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.nav-item.dropdown');
  const subMenuItems = document.querySelectorAll('.dropdown-submenu');

  function addMenuEventListeners(items, isTopLevel) {
    items.forEach(item => {
      let timeout;

      function onMouseEnter() {
        clearTimeout(timeout);
        openMenu(item, isTopLevel);
      }

      function onMouseLeave() {
        timeout = setTimeout(() => {
          closeMenu(item);
        }, 500);
      }

      // Öffnen beim Hovern
      item.addEventListener('mouseenter', onMouseEnter);

      // Verzögertes Schließen beim Verlassen
      item.addEventListener('mouseleave', onMouseLeave);

      // Öffnen und Position anpassen beim Klicken
      item.addEventListener('click', (e) => {
        e.stopPropagation(); // Verhindert das Schließen von Menüs bei Klick
        if (item.classList.contains('open')) {
          closeMenu(item);
        } else {
          openMenu(item, isTopLevel);
        }
      });
    });
  }

  function addAllMenuEventListeners() {
    const updatedMenuItems = document.querySelectorAll('.nav-item.dropdown');
    const updatedSubMenuItems = document.querySelectorAll('.dropdown-submenu');
    addMenuEventListeners(updatedMenuItems, true);
    addMenuEventListeners(updatedSubMenuItems, false);
  }

  addAllMenuEventListeners();

  // Globale Klick-Listener, um Menüs zu schließen, wenn außerhalb geklickt wird
  document.addEventListener('click', () => {
    [...menuItems, ...subMenuItems].forEach(item => closeMenu(item));
  });

  function openMenu(item, isTopLevel) {
    item.classList.add('open');
    const submenu = item.querySelector('.dropdown-menu');
    if (submenu) {
      submenu.style.display = 'block';
      submenu.style.opacity = '1';
      submenu.style.visibility = 'visible';
      adjustMenuPosition(submenu, item, isTopLevel);
    }
  }

  function closeMenu(item) {
    item.classList.remove('open');
    const submenu = item.querySelector('.dropdown-menu');
    if (submenu) {
      submenu.style.display = 'none';
      submenu.style.opacity = '0';
      submenu.style.visibility = 'hidden';
    }
  }

function isSmallScreen() {
  return window.innerWidth < 992; // Bootstrap-Breakpoint für 'lg'
}
    
function adjustMenuPosition(submenu, parent, isTopLevel) {
    const rect = submenu.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const spaceAbove = parentRect.top;
    const spaceBelow = window.innerHeight - parentRect.bottom;
    const spaceLeft = parentRect.left;
    const spaceRight = window.innerWidth - parentRect.right;

    submenu.style.top = '';
    submenu.style.bottom = '';
    submenu.style.left = '';
    submenu.style.right = '';

    if (isTopLevel) {
      if (isSmallScreen && spaceBelow < spaceAbove) {
        // Für kleine Bildschirme: Menü direkt über dem Eltern-Element öffnen
        submenu.style.top = 'auto';
        submenu.style.bottom = `${parentRect.height}px`; // Direkt über dem Eltern-Element
      } 
        // Top-Level-Menü
        else if (spaceBelow < spaceAbove) {
            submenu.style.bottom = `${window.innerHeight - parentRect.bottom - parentRect.height}px`;
            submenu.style.top = 'auto';
        } else {
            submenu.style.top = `${parentRect.height}px`;
            submenu.style.bottom = 'auto';
        }
    } else {
        // Submenü
        const prefersRight = spaceRight >= spaceLeft;
        submenu.style.left = prefersRight ? '100%' : 'auto';
        submenu.style.right = prefersRight ? 'auto' : '100%';

        // Nach oben öffnen, wenn unten kein Platz ist
        if (spaceBelow < spaceAbove) {
            submenu.style.bottom = `0`;
            submenu.style.top = `auto`;
        } else {
            submenu.style.top = `0`;
            submenu.style.bottom = '${parentRect.height}px';
        }
    }
}
});
