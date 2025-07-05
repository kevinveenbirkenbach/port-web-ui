// Global variables to store elements and original state
let mainElement, originalContent, originalMainStyle, container, customScrollbar, scrollbarContainer;

// Synchronize the height of the iframe to match the scroll-container or main element
function syncIframeHeight() {
    const iframe = mainElement.querySelector("iframe");
    if (iframe) {
        if (scrollbarContainer) {
            // Prefer inline height, otherwise inline max-height
            const inlineHeight = scrollbarContainer.style.height;
            const inlineMax = scrollbarContainer.style.maxHeight;
            const target = inlineHeight || inlineMax;
            if (target) {
                iframe.style.height = target;
            } else {
                iframe.style.height = mainElement.style.height;
            }
        } else {
            iframe.style.height = mainElement.style.height;
        }
    }
}

// Function to open a URL in an iframe
function openIframe(url) {
    // Hide the container (and its scroll-container) so the iframe can appear in its place
    if (scrollbarContainer) {
        scrollbarContainer.style.display = 'none';
    }

    // Hide any custom scrollbar element if present
    if (customScrollbar) {
        customScrollbar.style.display = 'none';
    }

    // Create or retrieve the iframe in the main element
    let iframe = mainElement.querySelector("iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.style.border = "none";
        iframe.style.overflow = "auto";  // Enable internal scrolling
        iframe.scrolling = "auto";
        mainElement.appendChild(iframe);
        syncIframeHeight();
    }

    // Set the iframe's source URL
    iframe.src = url;

    // Push the new URL state without reloading the page
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('iframe', url);
    window.history.pushState({ iframe: url }, '', newUrl);
}

// Function to restore the original content and show the container again
function restoreOriginal() {
    // Remove the iframe from the DOM
    const iframe = mainElement.querySelector("iframe");
    if (iframe) {
        iframe.remove();
    }

    // Show the original container
    if (scrollbarContainer) {
        scrollbarContainer.style.display = '';
    }

    // Restore any custom scrollbar
    if (customScrollbar) {
        customScrollbar.style.display = '';
    }

    // Restore the original inline style of the main element
    if (originalMainStyle !== null) {
        mainElement.setAttribute("style", originalMainStyle);
    } else {
        mainElement.removeAttribute("style");
    }

    // Update the URL to remove the iframe parameter
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("iframe");
    window.history.pushState({}, '', newUrl);
}

// Initialize event listeners after DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Cache references to elements and original state
    mainElement = document.querySelector("main");
    originalContent = mainElement.innerHTML;
    originalMainStyle = mainElement.getAttribute("style");  // may be null
    container = document.querySelector(".container");
    customScrollbar = document.getElementById("custom-scrollbar");
    scrollbarContainer = container.querySelector(".scroll-container")

    // Attach click handlers to links that should open in an iframe
    document.querySelectorAll(".iframe-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();  // prevent full page navigation
            openIframe(this.href);
            updateUrlFullWidth(true);
        });
    });

    // Clicking the header's H1 will restore the original view
    const headerH1 = document.querySelector("header h1");
    if (headerH1) {
        headerH1.style.cursor = "pointer";
        headerH1.addEventListener("click", restoreOriginal);
    }

    // On full page load, check URL parameters to auto-open an iframe
    window.addEventListener("load", function() {
        const params = new URLSearchParams(window.location.search);
        const iframeUrl = params.get('iframe');
        if (iframeUrl) {
            openIframe(iframeUrl);
        }
    });
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    const params = new URLSearchParams(window.location.search);
    const iframeUrl = params.get('iframe');

    if (iframeUrl) {
        openIframe(iframeUrl);
    } else {
        restoreOriginal();
    }
});

/**
 * Opens the current iframe URL in a new browser tab.
 */
function openIframeInNewTab() {
  const params = new URLSearchParams(window.location.search);
  const iframeUrl = params.get('iframe');
  if (iframeUrl) {
    window.open(iframeUrl, '_blank');
  } else {
    alert('No iframe is currently open.');
  }
}
// expose globally so your template’s onclick can find it
window.openIframeInNewTab = openIframeInNewTab;

// Adjust iframe height on window resize
window.addEventListener('resize', syncIframeHeight);
