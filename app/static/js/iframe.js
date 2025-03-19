// Global variables to store the original main content and style (only once)
let originalMainContent = null;
let originalMainStyle = null;

function initializeIframeSetup() {
    // Remove existing event handlers from .iframe-link elements by replacing them with clones
    const iframeLinks = document.querySelectorAll(".iframe-link");
    iframeLinks.forEach(link => {
        const newLink = link.cloneNode(true); // Clones the element without its event listeners
        link.parentNode.replaceChild(newLink, link);
    });

    // Similarly, remove event handlers from header h1 by cloning it
    const headerH1 = document.querySelector("header h1");
    if (headerH1) {
        const newHeaderH1 = headerH1.cloneNode(true);
        headerH1.parentNode.replaceChild(newHeaderH1, headerH1);
    }

    // Now, select the main element and store its original content and inline style if not already stored
    const mainElement = document.querySelector("main");
    if (originalMainContent === null) {
        originalMainContent = mainElement.innerHTML;
        originalMainStyle = mainElement.getAttribute("style");
    }

    // Get the container element and the custom scrollbar element
    const container = document.querySelector(".container");
    const customScrollbar = document.getElementById("custom-scrollbar");

    // Re-select the links (now without previous event listeners) and add new event listeners
    const newLinks = document.querySelectorAll(".iframe-link");
    newLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            const url = this.getAttribute("href");

            // Fix the original height of the main element if not already set
            if (!mainElement.style.height) {
                mainElement.style.height = `${mainElement.clientHeight}px`;
            }

            // Replace the container class with container-fluid if not already applied
            if (container && !container.classList.contains("container-fluid")) {
                container.classList.replace("container", "container-fluid");
            }

            // Hide the custom scrollbar
            if (customScrollbar) {
                customScrollbar.style.display = "none";
            }

            // Check if an iframe already exists in the main element
            let iframe = mainElement.querySelector("iframe");
            if (!iframe) {
                // Create a new iframe element
                iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.style.border = "none";
                iframe.style.height = mainElement.style.height; // Apply fixed height
                iframe.style.overflow = "auto"; // Enable internal scrollbar
                iframe.scrolling = "auto"; // Ensure scrollability

                // Clear the main content before appending the iframe
                mainElement.innerHTML = "";
                mainElement.appendChild(iframe);
            }

            // Set the URL of the iframe
            iframe.src = url;
        });
    });

    // Re-select header h1 and add its event listener to restore the original main content and style
    const newHeaderH1 = document.querySelector("header h1");
    if (newHeaderH1) {
        // Change the cursor to pointer to indicate clickability
        newHeaderH1.style.cursor = "pointer";
        newHeaderH1.addEventListener("click", function () {
            // Restore the original content of the main element (removing the iframe)
            mainElement.innerHTML = originalMainContent;

            // Restore the original inline style of the main element
            if (originalMainStyle !== null) {
                mainElement.setAttribute("style", originalMainStyle);
            } else {
                mainElement.removeAttribute("style");
            }

            // Optionally revert the container class back to "container" if needed
            if (container && container.classList.contains("container-fluid")) {
                container.classList.replace("container-fluid", "container");
            }

            // Optionally show the custom scrollbar again
            if (customScrollbar) {
                customScrollbar.style.display = "";
            }
        });
    }

    // Add a window resize event listener to adjust the iframe height (if any)
    window.addEventListener("resize", function () {
        const iframe = mainElement.querySelector("iframe");
        if (iframe) {
            iframe.style.height = mainElement.style.height;
        }
    });
}

// Example: manually trigger initialization after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    initializeIframeSetup();
});
