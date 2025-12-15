/**
 * Experience Map - Dynamic Connection Lines
 * Connects map markers to experience cards with leader lines
 */

// Configuration
const experienceMapConfig = {
  lineColor: {
    korea: "#6366f1",
    japan: "#dc2626",
  },
  lineWidth: 3,
  dashArray: "8,4",
  animationDuration: "1.5s",
};

// Update connections for a specific country - Global function
function updateCountryConnections(country) {
  const panel = document.querySelector(
    `.experience-panel[data-panel="${country}"]`
  );

  if (!panel) {
    return;
  }

  if (!panel.classList.contains("active")) {
    return;
  }

  const overlay = panel.querySelector(".connection-overlay");
  if (!overlay) {
    return;
  }

  const canvas = panel.querySelector(".map-canvas");
  if (!canvas) {
    return;
  }

  // Get canvas position for coordinate calculation
  const canvasRect = canvas.getBoundingClientRect();

  // Clear existing lines and gradients
  const existingLines = overlay.querySelectorAll(".dynamic-line");
  existingLines.forEach((line) => line.remove());
  const existingDefs = overlay.querySelector("defs");
  if (existingDefs) existingDefs.remove();

  // Add gradient definitions
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  // Korea gradient
  const koreaGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );
  koreaGradient.setAttribute("id", "koreaGradient");
  koreaGradient.setAttribute("x1", "0%");
  koreaGradient.setAttribute("y1", "0%");
  koreaGradient.setAttribute("x2", "100%");
  koreaGradient.setAttribute("y2", "0%");

  const koreaStop1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "stop"
  );
  koreaStop1.setAttribute("offset", "0%");
  koreaStop1.setAttribute("style", "stop-color:#6366f1;stop-opacity:1");

  const koreaStop2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "stop"
  );
  koreaStop2.setAttribute("offset", "100%");
  koreaStop2.setAttribute("style", "stop-color:#8b5cf6;stop-opacity:1");

  koreaGradient.appendChild(koreaStop1);
  koreaGradient.appendChild(koreaStop2);

  // Japan gradient
  const japanGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );
  japanGradient.setAttribute("id", "japanGradient");
  japanGradient.setAttribute("x1", "0%");
  japanGradient.setAttribute("y1", "0%");
  japanGradient.setAttribute("x2", "100%");
  japanGradient.setAttribute("y2", "0%");

  const japanStop1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "stop"
  );
  japanStop1.setAttribute("offset", "0%");
  japanStop1.setAttribute("style", "stop-color:#dc2626;stop-opacity:1");

  const japanStop2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "stop"
  );
  japanStop2.setAttribute("offset", "100%");
  japanStop2.setAttribute("style", "stop-color:#f87171;stop-opacity:1");

  japanGradient.appendChild(japanStop1);
  japanGradient.appendChild(japanStop2);

  defs.appendChild(koreaGradient);
  defs.appendChild(japanGradient);
  overlay.appendChild(defs);

  // Get all markers and their corresponding info blocks
  const markers = panel.querySelectorAll(".location-marker");

  markers.forEach((marker, index) => {
    const location = marker.getAttribute("data-location");

    const infoBlock = panel.querySelector(
      `.info-block[data-location="${location}"]`
    );

    if (!infoBlock) {
      return;
    }

    // Get marker position (center of marker dot)
    const markerDot = marker.querySelector(".marker-dot");
    if (!markerDot) {
      return;
    }

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
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", `dynamic-line ${country}-line`);
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    // Use solid color for stroke (testing without gradient)
    const strokeColor = country === "korea" ? "#6366f1" : "#dc2626";
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("stroke-width", experienceMapConfig.lineWidth);
    line.setAttribute("stroke-dasharray", experienceMapConfig.dashArray);
    line.setAttribute("stroke-opacity", "0.8");

    // Add animation
    const animate = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animate.setAttribute("attributeName", "stroke-dashoffset");
    animate.setAttribute("from", "10");
    animate.setAttribute("to", "0");
    animate.setAttribute("dur", experienceMapConfig.animationDuration);
    animate.setAttribute("repeatCount", "indefinite");

    line.appendChild(animate);
    overlay.appendChild(line);
  });

  // Update SVG viewBox to cover entire canvas
  overlay.setAttribute("width", canvasRect.width);
  overlay.setAttribute("height", canvasRect.height);
}

// Update all connection lines - Global function
window.updateExperienceConnections = function () {
  updateCountryConnections("korea");
  updateCountryConnections("japan");
};

// Initialize when DOM is ready
function initExperienceMap() {
  window.updateExperienceConnections();

  // Update on window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(window.updateExperienceConnections, 150);
  });

  // Tab change is handled by agency.js to avoid duplicate event handlers
}

// Run init when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExperienceMap);
} else {
  initExperienceMap();
}
