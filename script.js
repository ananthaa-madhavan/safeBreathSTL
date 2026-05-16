
// center on St. Louis County
const map = L.map('map').setView([38.6270, -90.1994], 10);

// base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// fake sensor data for now
let data = [
  { lat: 38.65, lon: -90.55, pm25: 30 },
  { lat: 38.63, lon: -90.52, pm25: 55 },
  { lat: 38.60, lon: -90.50, pm25: 80 }
];

let mode = "pm25";

function setMode(m) {
  mode = m;
  render();
}

function getColor(val) {
  return val < 20 ? "#2ecc71"
       : val < 50 ? "#f1c40f"
       : "#e74c3c";
}

let markers = [];

function render() {
  // remove old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  data.forEach(p => {
    const val = p[mode];

    const marker = L.circleMarker([p.lat, p.lon], {
      radius: 5,
      color: "black",
      weight: 1,
      fillColor: getColor(val),
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindPopup(`
      <b>PM Value:</b> ${val}<br>
      <b>Type:</b> ${mode}
    `);

    markers.push(marker);
  });
}

render();
