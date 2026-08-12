/* स्वतंत्रता दिवस — no click effects here, same as कंजक. The scene is a
   celebration the picture already carries; popping snark over it on every
   tap would only get in its way. */

Player.init({
  prev: "https://chappal-wtf.vercel.app/",
  next: "https://kanjak.vercel.app/",
  tracks: [
    {
      videoId: "MFGimwvSXYY",
      fallbackIds: ["Ha_P2DW9VR4", "_DFbac5e-rg", "esV069YrVh4"],
      title: "Mera Rang De Basanti Chola",
      artist: "Sonu Nigam · The Legend of Bhagat Singh",
      cover: "cover-rang.webp",
      start: 0,
    },
    {
      videoId: "BKx_B1VZ2kw",
      fallbackIds: ["Gf3O-_c0Jos", "x4z8P9_eyZ8"],
      title: "Ae Watan",
      artist: "Sunidhi Chauhan · Raazi",
      cover: "cover-watan.webp",
      start: 0,
    },
  ],
});

/* Anywhere on the scene starts the music — that gesture is what lets us
   unmute, which is why the page needs no "tap to start" gate. */
document.addEventListener("click", (e) => {
  if (e.target.closest(".player, .pill")) return;
  Player.nudge();
});
