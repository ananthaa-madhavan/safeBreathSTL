let currentPM = "pm25";

let mapInstance = null;
let dotLayer = null;
let heatLayer = null;

// ===============================
// PARTICLES (disabled on map page)
// ===============================
function spawnParticles() {
  if (document.getElementById("map")) return;
}

// ===============================
// VALUE SELECTOR
// ===============================
function getValue(p) {
  return currentPM === "pm1" ? p.pm1 :
         currentPM === "pm10" ? p.pm10 :
         p.pm25;
}

// ===============================
// MAP INIT
// ===============================
function initMap() {
  mapInstance = L.map("map").setView([38.6631, -90.5771], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapInstance);

  dotLayer = L.layerGroup().addTo(mapInstance);
  heatLayer = L.layerGroup().addTo(mapInstance);
}

// ===============================
// RENDER MAP DATA
// ===============================
function renderData() {

  const data = [
    { lat: 38.65, lon: -90.55, pm1: 10, pm25: 30, pm10: 60 },
    { lat: 38.63, lon: -90.52, pm1: 15, pm25: 55, pm10: 90 },
    { lat: 38.60, lon: -90.50, pm1: 25, pm25: 80, pm10: 120 }
  ];

  dotLayer.clearLayers();
  heatLayer.clearLayers();

  let avgPM = 0;

  data.forEach(p => {
    const v = getValue(p);
    avgPM += v;

    L.circleMarker([p.lat, p.lon], {
      radius: 6,
      color: "black",
      fillColor: v < 20 ? "#2ecc71" : v < 50 ? "#f1c40f" : "#e74c3c",
      fillOpacity: 0.9
    }).addTo(dotLayer);
  });

  avgPM = Math.round(avgPM / data.length);

  updateTiles(avgPM);
}

// ===============================
// UPDATE DASHBOARD TILES
// ===============================
function updateTiles(avgPM) {

  document.getElementById("tempTile").innerText = "72°F";
  document.getElementById("weatherTile").innerText = "Sunny";
  document.getElementById("uvTile").innerText = "5";
  document.getElementById("aqTile").innerText = avgPM;
}

// ===============================
// PM SWITCH
// ===============================
function setPM(type) {
  currentPM = type;
  renderData();
}

// ===============================
// START
// ===============================
window.onload = function () {
  if (document.getElementById("map")) {
    initMap();
    renderData();
  }
};
