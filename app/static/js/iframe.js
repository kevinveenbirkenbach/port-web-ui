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

// Function to open a URL in an iframe (jQuery version mit 1500 ms Fade)
function openIframe(url) {
    enterFullscreen();

    var $container    = scrollbarContainer    ? $(scrollbarContainer)    : null;
    var $customScroll = customScrollbar       ? $(customScrollbar)       : null;
    var $main         = $(mainElement);

    // Original-Content ausblenden mit 1500 ms
    var promises = [];
    if ($container)    promises.push($container.fadeOut(1500).promise());
    if ($customScroll) promises.push($customScroll.fadeOut(1500).promise());

    $.when.apply($, promises).done(function() {
        // Iframe anlegen, falls noch nicht vorhanden
        var $iframe = $main.find('iframe');
        if ($iframe.length === 0) {
            originalMainStyle = $main.attr('style') || null;
            $iframe = $('<iframe>', {
                width: '100%',
                frameborder: 0,
                scrolling: 'auto'
            }).css({ overflow: 'auto', display: 'none' });
            $main.append($iframe);
        }

        // Quelle setzen und mit 1500 ms einblenden
        $iframe
            .attr('src', url)
            .fadeIn(1500, function() {
                syncIframeHeight();
            });

        // URL-State pushen
        var newUrl = new URL(window.location);
        newUrl.searchParams.set('iframe', url);
        window.history.pushState({ iframe: url }, '', newUrl);
    });
}

// Function to restore the original content (jQuery version mit 1500 ms Fade)
function restoreOriginal() {
    var $main   = $(mainElement);
    var $iframe = $main.find('iframe');
    var $container    = scrollbarContainer    ? $(scrollbarContainer)    : null;
    var $customScroll = customScrollbar       ? $(customScrollbar)       : null;

    if ($iframe.length) {
        // Iframe mit 1500 ms ausblenden, dann entfernen und Original einblenden
        $iframe.fadeOut(1500, function() {
            $iframe.remove();

            if ($container)    $container.fadeIn(1500);
            if ($customScroll) $customScroll.fadeIn(1500);

            // Inline-Style des main-Elements zurücksetzen
            if (originalMainStyle !== null) {
                $main.attr('style', originalMainStyle);
            } else {
                $main.removeAttr('style');
            }

            // URL-Parameter entfernen
            var newUrl = new URL(window.location);
            newUrl.searchParams.delete('iframe');
            window.history.pushState({}, '', newUrl);
        });
    }
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

    document.querySelectorAll(".js-restore").forEach(el => {
        el.style.cursor = "pointer";
        el.addEventListener("click", restoreOriginal);
    });


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
