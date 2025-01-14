document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.nav-item.dropdown');
  const subMenuItems = document.querySelectorAll('.dropdown-submenu');

  function addMenuEventListeners(items, isTopLevel) {
    items.forEach(item => {
      let timeout;

      // Öffnen beim Hovern
      item.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        openMenu(item, isTopLevel);
      });

      // Verzögertes Schließen beim Verlassen
      item.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => closeMenu(item), 500);
      });

      // Öffnen und Position anpassen beim Klicken
      item.addEventListener('click', (e) => {
        e.preventDefault(); // Verhindert die Standardaktion
        e.stopPropagation(); // Verhindert das Schließen von Menüs bei Klick
        if (item.classList.contains('open')) {
          closeMenu(item);
        } else {
          openMenu(item, isTopLevel);
        }
      });
    });
  }

  addMenuEventListeners(menuItems, true);
  addMenuEventListeners(subMenuItems, false);

  // Globale Klick-Listener, um Menüs zu schließen, wenn außerhalb geklickt wird
  document.addEventListener('click', () => {
    [...menuItems, ...subMenuItems].forEach(item => closeMenu(item));
  });

  function openMenu(item, isTopLevel) {
    item.classList.add('open');
    const submenu = item.querySelector('.dropdown-menu');
    if (submenu) {
      adjustMenuPosition(submenu, item, isTopLevel);
      submenu.style.display = 'block';
      submenu.style.opacity = '1';
      submenu.style.visibility = 'visible';
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

  function adjustMenuPosition(submenu, parent, isTopLevel) {
    const rect = submenu.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // Platzberechnung
    const spaceAbove = parentRect.top;
    const spaceBelow = window.innerHeight - parentRect.bottom;
    const spaceLeft = parentRect.left;
    const spaceRight = window.innerWidth - parentRect.right;

    // Standardpositionierung
    submenu.style.top = '';
    submenu.style.bottom = '';
    submenu.style.left = '';
    submenu.style.right = '';

    if (isTopLevel) {
      // Top-Level-Menüs öffnen nur nach oben oder unten
      if (spaceBelow < rect.height && spaceAbove > rect.height) {
        submenu.style.bottom = `${window.innerHeight - parentRect.bottom}px`;
        submenu.style.top = 'auto';
      } else {
        submenu.style.top = `${parentRect.height}px`;
        submenu.style.bottom = 'auto';
      }
    } else {
      // Submenüs öffnen in die Richtung mit mehr Platz
      const prefersRight = spaceRight >= spaceLeft;
      submenu.style.left = prefersRight ? '100%' : 'auto';
      submenu.style.right = prefersRight ? 'auto' : '100%';

      // Öffnen nach oben, wenn unten kein Platz ist
      if (spaceBelow < rect.height && spaceAbove > rect.height) {
        submenu.style.top = 'auto';
        submenu.style.bottom = `${parentRect.bottom - parentRect.top - rect.height}px`; // Höhe des Submenüs wird berücksichtigt
      } else {
        submenu.style.top = '0';
        submenu.style.bottom = 'auto';
      }
    }
  }
});
