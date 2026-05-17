function setPM(type) {
  currentPM = type;

  // re-render map data
  renderData();

  // update button UI state
  document.querySelectorAll(".pm-toggle button").forEach(btn => {
    btn.classList.remove("active");
  });

  // set correct active button
  const activeBtn =
    document.querySelector(`.pm-toggle button[onclick="setPM('pm1')"]`) ||
    document.querySelector(`.pm-toggle button[onclick="setPM('pm25')"]`) ||
    document.querySelector(`.pm-toggle button[onclick="setPM('pm10')"]`);

  document.querySelectorAll(".pm-toggle button").forEach(btn => {
    if (btn.getAttribute("onclick") === `setPM('${type}')`) {
      btn.classList.add("active");
    }
  });
}
