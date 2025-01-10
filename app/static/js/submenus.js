document.addEventListener('DOMContentLoaded', () => {
    const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu');

    dropdownSubmenus.forEach(submenu => {
        let timeout;

        // Zeige das Submenü beim Hover
        submenu.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            const menu = submenu.querySelector('.dropdown-menu');
            if (menu) {
                // Dynamische Positionierung
                const rect = menu.getBoundingClientRect();
                const viewportWidth = window.innerWidth;

                // Überprüfen, ob Platz nach rechts ist, sonst nach links öffnen
                if (rect.right > viewportWidth) {
                    menu.style.left = 'auto';
                    menu.style.right = '100%';
                } else {
                    menu.style.left = '100%';
                    menu.style.right = 'auto';
                }

                menu.style.display = 'block';
                menu.style.opacity = '1';
            }
        });

        // Verstecke das Submenü nach 0.5 Sekunden
        submenu.addEventListener('mouseleave', () => {
            const menu = submenu.querySelector('.dropdown-menu');
            if (menu) {
                timeout = setTimeout(() => {
                    menu.style.display = 'none';
                    menu.style.opacity = '0';
                }, 500); // 0.5 Sekunden Verzögerung
            }
        });
    });
});
