document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".iframe-link");
    const mainElement = document.querySelector("main");
    const container = document.querySelector(".container");
    const customScrollbar = document.getElementById("custom-scrollbar");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            const url = this.getAttribute("href");

            // Fix the original height of the main element if not already set
            if (!mainElement.style.height) {
                mainElement.style.height = `${mainElement.clientHeight}px`;
            }

            // Replace the container class with container-fluid
            if (container && !container.classList.contains("container-fluid")) {
                container.classList.replace("container", "container-fluid");
            }

            // Hide the custom scrollbar
            if (customScrollbar) {
                customScrollbar.style.display = "none";
            }

            // Check if the iframe already exists
            let iframe = mainElement.querySelector("iframe");

            if (!iframe) {
                // Create a new iframe
                iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.style.border = "none";
                iframe.style.height = mainElement.style.height; // Apply fixed height
                iframe.style.overflow = "auto"; // Enable scrollbar inside iframe
                iframe.scrolling = "auto"; // Ensure scrollability
                mainElement.innerHTML = ""; // Clear main content
                mainElement.appendChild(iframe);
            }

            iframe.src = url; // Load the URL into the iframe
        });
    });

    // Adjust iframe height on window resize (optional, to keep it responsive)
    window.addEventListener("resize", function () {
        const iframe = mainElement.querySelector("iframe");
        if (iframe) {
            iframe.style.height = mainElement.style.height;
        }
    });
});
