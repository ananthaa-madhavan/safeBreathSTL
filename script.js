let currentPM = "pm25";

let mapInstance = null;
let dotLayer = null;
let heatLayer = null;

// ===============================
// PARTICLES (only for non-map pages)
// ===============================
function spawnParticles() {
  if (document.getElementById("map")) return;

  const colors = ["green", "yellow", "orange", "red"];

  for (let i = 0; i < 60; i++) {
    const dot = document.createElement("div");

    const color = colors[Math.floor(Math.random() * colors.length)];
    dot.className = "particle " + color;

    const size = 4 + Math.random() * 6;

    dot.style.width = size + "px";
    dot.style.height = size + "px";

    dot.style.left = Math.random() * window.innerWidth + "px";
    dot.style.top = Math.random() * window.innerHeight + "px";

    document.body.appendChild(dot);
  }
}

// ===============================
// SELECT VALUE BASED ON PM TYPE
// ===============================
function getValue(p) {
  return currentPM === "pm1" ? p.pm1 :
         currentPM === "pm10" ? p.pm10 :
         p.pm25;
}

// ===============================
// CREATE HEAT DATA
// ===============================
function buildHeatData(data) {
  return data.map(p => {
    const value = getValue(p);

    // normalize to 0–1 range
    const intensity = Math.min(value / 120, 1);

    return [p.lat, p.lon, intensity];
  });
}

// ===============================
// INIT MAP
// ===============================
function initMap() {
  if (!document.getElementById("map")) return;

  mapInstance = L.map("map").setView([38.6631, -90.5771], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapInstance);

  dotLayer = L.layerGroup().addTo(mapInstance);

  heatLayer = L.heatLayer([], {
    radius: 40,
    blur: 25,
    maxZoom: 17,
    gradient: {
      0.0: "green",
      0.4: "yellow",
      0.7: "orange",
      1.0: "red"
    }
  }).addTo(mapInstance);

  mapInstance.setMaxBounds([
    [38.45, -90.85],
    [38.85, -90.25]
  ]);
}

// ===============================
// RENDER DATA
// ===============================
function renderData() {
  if (!mapInstance) return;

  const data = [
    { lat: 38.65, lon: -90.55, pm1: 10, pm25: 30, pm10: 60 },
    { lat: 38.63, lon: -90.52, pm1: 15, pm25: 55, pm10: 90 },
    { lat: 38.60, lon: -90.50, pm1: 25, pm25: 80, pm10: 120 }
  ];

  // clear dots
  dotLayer.clearLayers();

  // update heatmap
  const heatData = buildHeatData(data);
  heatLayer.setLatLngs(heatData);

  // add dots
  data.forEach(p => {
    const value = getValue(p);

    L.circleMarker([p.lat, p.lon], {
      radius: 6,
      color: "black",
      weight: 1,
      fillColor:
        value < 20 ? "#2ecc71" :
        value < 50 ? "#f1c40f" :
        "#e74c3c",
      fillOpacity: 0.9
    }).addTo(dotLayer);
  });
}

// ===============================
// PM TOGGLE
// ===============================
function setPM(type) {
  currentPM = type;

  document.querySelectorAll(".pm-toggle button").forEach(btn => {
    btn.classList.remove("active");

    if (btn.getAttribute("data-pm") === type) {
      btn.classList.add("active");
    }
  });

  renderData();
}

// ===============================
// START
// ===============================
window.onload = function () {
  spawnParticles();

  if (document.getElementById("map")) {
    initMap();
    renderData();
  }
};
