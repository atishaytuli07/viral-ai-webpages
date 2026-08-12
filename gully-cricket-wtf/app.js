/* गली क्रिकेट */

Player.init({
  prev: "https://kanjak.vercel.app/",
  next: "https://chappal-wtf.vercel.app/",
  tracks: [
    {
      // From a film about a kid and a cricket bat, so it lands on this scene
      // without needing to be clever about it.
      videoId: "GhjuKB2Kegw",
      title: "Dhoom Dhadaka",
      artist: "Kailash Kher · Chain Kulii Ki Main Kulii",
      cover: "cover-dhoom.webp",
      start: 0,
    },
    {
      // The nostalgia track: this scene is about bachpan being over, and
      // everyone already knows the words to this one.
      videoId: "HdTdcnl8ZrM",
      fallbackIds: ["CksKn3u--FA", "OGGcU9OrqxI"],
      title: "Purani Jeans",
      artist: "Ali Haider",
      cover: "cover-jeans.webp",
      start: 0,
    },
    {
      // The ironic heroic swell, for the glass.
      videoId: "LQmHKl3oNu0",
      fallbackIds: ["KtkUSgscdno", "2XxSWGe9pbk"],
      title: "Chale Chalo",
      artist: "A. R. Rahman · Lagaan",
      cover: "cover-chalechalo.webp",
      start: 0,
    },
  ],
});

/* Tap the scene: glass bloom where you hit, a camera flinch, one caption.
   The lines run in order rather than at random, so a second tap never
   repeats the first. */
const fx = document.getElementById("fx");
const hint = document.getElementById("hint");
const LINES = ["छक्का", "आंटी जी सॉरी", "भागो", "आउट नहीं था", "एक और गयी"];
let lineIdx = 0;

document.addEventListener("click", (e) => {
  if (e.target.closest(".player, .pill")) return;
  Player.nudge();
  hint.classList.add("is-gone"); // it has done its job

  const flash = document.createElement("span");
  flash.className = "fx-flash";
  flash.style.setProperty("--cx", `${(e.clientX / innerWidth) * 100}%`);
  flash.style.setProperty("--cy", `${(e.clientY / innerHeight) * 100}%`);
  fx.appendChild(flash);
  flash.addEventListener("animationend", () => flash.remove());

  const w = document.createElement("span");
  w.className = "fx-word";
  w.textContent = LINES[lineIdx++ % LINES.length];
  w.style.left = `${Math.min(74, Math.max(6, (e.clientX / innerWidth) * 100 - 4))}vw`;
  w.style.top = `${Math.min(80, Math.max(10, (e.clientY / innerHeight) * 100 - 5))}vh`;
  fx.appendChild(w);
  w.addEventListener("animationend", () => w.remove());

  document.body.classList.remove("is-jolted");
  void document.body.offsetWidth; // restart the animation
  document.body.classList.add("is-jolted");
});
