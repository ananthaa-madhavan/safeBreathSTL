let currentPM = "pm25";

let mapInstance = null;
let dotLayer = null;

let firebaseData = {};
let isAdmin = false; // ✅ FIX

// ===============================
// PARTICLES
// ===============================
function spawnParticles() {
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
// VALUE SELECTOR
// ===============================
function getValue(p) {
  return currentPM === "pm1"
    ? p.pm1
    : currentPM === "pm10"
    ? p.pm10
    : p.pm25;
}

// ===============================
// MAP INIT
// ===============================
function initMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  mapInstance = L.map("map", {
    center: [38.6631, -90.5771],
    zoom: 12,
    worldCopyJump: false,
    maxBoundsViscosity: 1.0
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    noWrap: true
  }).addTo(mapInstance);

  dotLayer = L.layerGroup().addTo(mapInstance);

  const bounds = L.latLngBounds(
    [38.45, -90.85],
    [38.85, -90.25]
  );

  mapInstance.setMaxBounds(bounds);

  mapInstance.on("drag", () => {
    mapInstance.panInsideBounds(bounds, { animate: false });
  });

  mapInstance.on("moveend", updateWeatherTiles);
}

// ===============================
// FIREBASE LOAD (FIXED STYLE)
// ===============================
function loadData() {
  const dataRef = firebase.database().ref("readings");

  dataRef.on("value", (snapshot) => {
    firebaseData = snapshot.val() || {};
    renderData(Object.entries(firebaseData));
  });
}

// ===============================
// RENDER
// ===============================
function renderData(entries = []) {

  dotLayer.clearLayers();

  entries.forEach(([id, p]) => {

    const v = getValue(p);

    L.circleMarker([p.lat, p.lon], {
      radius: 6,
      color: "black",
      weight: 1,
      fillColor:
        v < 20 ? "#2ecc71" :
        v < 50 ? "#f1c40f" :
        "#e74c3c",
      fillOpacity: 0.9
    }).addTo(dotLayer);

  });
}

// ===============================
// DELETE (ADMIN ONLY)
// ===============================
function deleteReading(id) {
  if (!isAdmin) return alert("Not admin");

  firebase.database().ref("readings/" + id).remove();
}

// ===============================
// PM SWITCH (FIXED)
// ===============================
function setPM(type) {
  currentPM = type;

  document.querySelectorAll(".pm-toggle button").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick").includes(type));
  });

  renderData(Object.entries(firebaseData));
}

// ===============================
// WEATHER
// ===============================
async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,uv_index,weather_code` +
    `&timezone=auto`;

  const res = await fetch(url);
  return (await res.json()).current;
}

function weatherCodeToText(code) {
  const map = {
    0: "Clear",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "Fog",
    51: "Drizzle",
    61: "Rain",
    71: "Snow",
    80: "Showers",
    95: "Storm"
  };

  return map[code] || "Unknown";
}

function getMapCenter() {
  if (!mapInstance) return null;
  const c = mapInstance.getCenter();
  return { lat: c.lat, lon: c.lng };
}

// ===============================
// TILES
// ===============================
async function updateWeatherTiles() {
  const center = getMapCenter();
  if (!center) return;

  const weather = await fetchWeather(center.lat, center.lon);

  document.getElementById("tempTile").innerText =
    Math.round(weather.temperature_2m) + "°F";

  document.getElementById("uvTile").innerText =
    weather.uv_index;

  document.getElementById("weatherTile").innerText =
    weatherCodeToText(weather.weather_code);
}

// ===============================
// START
// ===============================
window.onload = function () {
  spawnParticles();

  if (document.getElementById("map")) {
    initMap();
    loadData();
  }
};
