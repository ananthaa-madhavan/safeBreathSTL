
function createParticle(colorClass, size) {
  const el = document.createElement("div");
  el.classList.add("particle", colorClass);

  el.style.width = size + "px";
  el.style.height = size + "px";

  el.style.top = Math.random() * window.innerHeight + "px";
  el.style.left = Math.random() * window.innerWidth + "px";

  el.style.animationDuration = (6 + Math.random() * 8) + "s";

  document.body.appendChild(el);
}

// create lots of “air data particles”
const colors = ["green", "yellow", "orange", "red"];

for (let i = 0; i < 35; i++) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 6 + Math.random() * 10; // small bubbles
  createParticle(color, size);
}
