/* कंजक — no click effects here on purpose. The scene is a puja, and popping
   snark out of it on every tap cheapens the one joke it already tells. */

Player.init({
  prev: "https://swatantratadiwas.vercel.app/",
  next: "https://gullycricket-wtf.vercel.app/",
  tracks: [
    {
      videoId: "Q0UlQ_-YyjU",
      fallbackIds: ["FQbIjhBzkUQ", "ikZp7S19-eo"],
      title: "Tanhayee",
      artist: "Sonu Nigam · Dil Chahta Hai",
      cover: "cover-tanhayee.webp",
      start: 62, // in on the hook, scored to bhai's face
    },
    {
      videoId: "ANyQiYlEkmk",
      fallbackIds: ["UIvpNrP4WQs"],
      title: "Chalo Bulawa Aaya Hai",
      artist: "Narendra Chanchal · Avtaar",
      cover: "cover-bulawa.webp",
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
