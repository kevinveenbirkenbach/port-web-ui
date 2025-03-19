document.addEventListener("DOMContentLoaded", function () {
    // Select the main element and store its original content and inline style
    const mainElement = document.querySelector("main");
    const originalContent = mainElement.innerHTML;
    const originalMainStyle = mainElement.getAttribute("style"); // might be null if no inline style exists

    // Get all links that should open in an iframe
    const links = document.querySelectorAll(".iframe-link");

    // Get the container element and the custom scrollbar element
    const container = document.querySelector(".container");
    const customScrollbar = document.getElementById("custom-scrollbar");

    // Add click event listener to each iframe link
    links.forEach(link => {
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

    // Add click event listener to header h1 to restore the original main content and style
    const headerH1 = document.querySelector("header h1");
    if (headerH1) {
        headerH1.addEventListener("click", function () {
            // Restore the original content of the main element (removing the iframe)
            mainElement.innerHTML = originalContent;

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
            adjustScrollContainerHeight()
        });
    }

    // Adjust iframe height on window resize (optional, to keep it responsive)
    window.addEventListener("resize", function () {
        const iframe = mainElement.querySelector("iframe");
        if (iframe) {
            iframe.style.height = mainElement.style.height;
        }
    });
});
