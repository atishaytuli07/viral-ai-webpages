/* चप्पल */

Player.init({
  prev: "https://gullycricket-wtf.vercel.app/",
  next: "https://swatantratadiwas.vercel.app/",
  tracks: [
    {
      videoId: "PmdyY38g6Rg",
      fallbackIds: ["AJG9oy2Q5tc", "oRGhqUjWF6U"],
      title: "Jamal Kudu",
      artist: "Abrar's Entry · Animal",
      cover: "cover-jamal.webp",
      start: 10, // the villain entry lands on the slow-mo walk
    },
    {
      videoId: "vs1IDdap3X4",
      fallbackIds: ["7W1cx_x80Nk", "vqKXoxlfWUg"],
      title: "Bhaag D.K. Bose",
      artist: "Ram Sampath · Delhi Belly",
      cover: "cover-dkbose.webp",
      start: 0,
    },
  ],
});

/* Tap the scene and it launches across the frame, never away from you.
   The lines run in order rather than at random, so a second tap never
   repeats the first. */
const fx = document.getElementById("fx");
const hint = document.getElementById("hint");
const LINES = [
  "ठहर जा",
  "अभी बताती हूँ तुझे",
  "आज तू गया",
  "दुखी करके रखा है",
  "निशाना",
  "आने दे तेरे पापा को",
  "रुक बेटा",
  "खतम",
];
let lineIdx = 0;

document.addEventListener("click", (e) => {
  if (e.target.closest(".player, .pill")) return;
  Player.nudge();
  hint.classList.add("is-gone"); // it has done its job

  const ch = document.createElement("img");
  ch.className = "fx-chappal";
  ch.src = "chappal.svg";
  ch.alt = "";
  ch.style.left = `${(e.clientX / innerWidth) * 100}vw`;
  ch.style.top = `${(e.clientY / innerHeight) * 100}vh`;
  const across = e.clientX < innerWidth / 2 ? 1 : -1;
  ch.style.setProperty("--dx", `${across * (38 + Math.random() * 34)}vw`);
  ch.style.setProperty("--dy", `${-(14 + Math.random() * 32)}vh`);
  ch.style.setProperty("--spin", `${across * (540 + Math.floor(Math.random() * 540))}deg`);
  fx.appendChild(ch);
  ch.addEventListener("animationend", () => ch.remove());

  const w = document.createElement("span");
  w.className = "fx-word";
  w.textContent = LINES[lineIdx++ % LINES.length];
  w.style.left = `${Math.min(74, Math.max(6, (e.clientX / innerWidth) * 100 - 4))}vw`;
  w.style.top = `${Math.min(80, Math.max(10, (e.clientY / innerHeight) * 100 - 6))}vh`;
  fx.appendChild(w);
  w.addEventListener("animationend", () => w.remove());

  document.body.classList.remove("is-jolted");
  void document.body.offsetWidth; // restart the animation
  document.body.classList.add("is-jolted");
});
