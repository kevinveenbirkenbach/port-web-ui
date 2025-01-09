document.addEventListener('DOMContentLoaded', () => {
    const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu > .dropdown-item');

    dropdownSubmenus.forEach((submenu) => {
        submenu.addEventListener('click', (event) => {
            event.preventDefault();
            const targetMenu = document.querySelector(submenu.getAttribute('data-bs-target'));
            const allSubmenus = document.querySelectorAll('.dropdown-menu.collapse');
            
            // Schließe alle anderen Submenüs
            allSubmenus.forEach((menu) => {
                if (menu !== targetMenu) {
                    menu.classList.remove('show');
                }
            });

            // Toggle des aktuellen Submenüs
            targetMenu.classList.toggle('show');
        });
    });
});
