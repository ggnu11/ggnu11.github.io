/**
 * Experience Map - Dynamic Connection Lines
 * Connects map markers to experience cards with leader lines
 */

(function () {
  'use strict';

  // Configuration
  const config = {
    lineColor: {
      korea: '#6366f1',
      japan: '#dc2626',
    },
    lineWidth: 2,
    dashArray: '5,5',
    animationDuration: '1s',
  };

  // Initialize when DOM is ready
  function init() {
    updateAllConnections();

    // Update on window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateAllConnections, 150);
    });

    // Update on tab change
    const tabs = document.querySelectorAll('.experience-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        // Wait for panel transition
        setTimeout(updateAllConnections, 100);
      });
    });

    // Update on scroll (for sticky positioning)
    let scrollTimer;
    window.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateAllConnections, 50);
    });
  }

  // Update all connection lines
  function updateAllConnections() {
    updateCountryConnections('korea');
    updateCountryConnections('japan');
  }

  // Update connections for a specific country
  function updateCountryConnections(country) {
    const panel = document.querySelector(
      `.experience-panel[data-panel="${country}"]`
    );
    if (!panel || !panel.classList.contains('active')) return;

    const overlay = panel.querySelector('.connection-overlay');
    if (!overlay) return;

    const canvas = panel.querySelector('.map-canvas');
    if (!canvas) return;

    // Get canvas position for coordinate calculation
    const canvasRect = canvas.getBoundingClientRect();

    // Clear existing lines
    const existingLines = overlay.querySelectorAll('.dynamic-line');
    existingLines.forEach((line) => line.remove());

    // Get all markers and their corresponding info blocks
    const markers = panel.querySelectorAll('.location-marker');

    markers.forEach((marker) => {
      const location = marker.getAttribute('data-location');
      const infoBlock = panel.querySelector(
        `.info-block[data-location="${location}"]`
      );

      if (!infoBlock) return;

      // Get marker position (center of marker dot)
      const markerDot = marker.querySelector('.marker-dot');
      if (!markerDot) return;

      const markerRect = markerDot.getBoundingClientRect();
      const infoRect = infoBlock.getBoundingClientRect();

      // Calculate coordinates relative to canvas
      const x1 = markerRect.left + markerRect.width / 2 - canvasRect.left;
      const y1 = markerRect.top + markerRect.height / 2 - canvasRect.top;

      // Connect to the edge of info block closest to marker
      let x2, y2;

      // Determine which edge of the info block is closest
      const infoLeft = infoRect.left - canvasRect.left;
      const infoRight = infoRect.right - canvasRect.left;
      const infoTop = infoRect.top - canvasRect.top;
      const infoBottom = infoRect.bottom - canvasRect.top;
      const infoCenterY = infoTop + infoRect.height / 2;

      // Connect to left edge if marker is on the left, otherwise right edge
      if (x1 < infoLeft) {
        x2 = infoLeft;
        y2 = infoCenterY;
      } else if (x1 > infoRight) {
        x2 = infoRight;
        y2 = infoCenterY;
      } else {
        // Marker is horizontally aligned with info block
        x2 = x1;
        y2 = y1 < infoTop ? infoTop : infoBottom;
      }

      // Create line element
      const line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      );
      line.setAttribute('class', `dynamic-line ${country}-line`);
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', config.lineColor[country]);
      line.setAttribute('stroke-width', config.lineWidth);
      line.setAttribute('stroke-dasharray', config.dashArray);

      // Add animation
      const animate = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      );
      animate.setAttribute('attributeName', 'stroke-dashoffset');
      animate.setAttribute('from', '10');
      animate.setAttribute('to', '0');
      animate.setAttribute('dur', config.animationDuration);
      animate.setAttribute('repeatCount', 'indefinite');

      line.appendChild(animate);
      overlay.appendChild(line);
    });

    // Update SVG viewBox to cover entire canvas
    overlay.setAttribute('width', canvasRect.width);
    overlay.setAttribute('height', canvasRect.height);
  }

  // Run init when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
