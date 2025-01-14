document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.nav-item.dropdown, .dropdown-submenu');

  menuItems.forEach(item => {
    let timeout;

    // Öffnen beim Hovern
    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      openMenu(item);
    });

    // Verzögertes Schließen beim Verlassen
    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => closeMenu(item), 500);
    });

    // Offen lassen beim Klicken
    item.addEventListener('click', (e) => {
      e.stopPropagation(); // Verhindert das Schließen von Menüs bei Klick
      if (item.classList.contains('open')) {
        closeMenu(item);
      } else {
        openMenu(item);
      }
    });
  });

  // Globale Klick-Listener, um Menüs zu schließen, wenn außerhalb geklickt wird
  document.addEventListener('click', () => {
    menuItems.forEach(item => closeMenu(item));
  });

  function openMenu(item) {
    item.classList.add('open');
    const submenu = item.querySelector('.dropdown-menu');
    if (submenu) {
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
});
