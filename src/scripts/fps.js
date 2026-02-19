// css
import "../Styles/fps.css";

const fpsDisplay = document.getElementById("fps-display");
const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift(); // remove timestamps older than 1 second
    }
    times.push(now); // add the current timestamp
    fps = times.length; // FPS is the number of timestamps in the last second
    fpsDisplay.textContent = fps.toFixed(0); // update the display

    refreshLoop(); // continue the loop
  });
}

refreshLoop(); // start the loop
