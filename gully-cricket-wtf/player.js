/* Shared YouTube-backed player. Identical on all three sites; each site's
   app.js supplies the tracks and calls Player.init(). */

window.Player = (function () {
  let tracks = [];
  let yt = null;
  let ready = false;
  let current = 0;
  let fallbackDepth = 0;
  let poll = null;
  let scrubbing = false;
  let started = false;

  const $ = (id) => document.getElementById(id);
  let card, seekEl;

  function fmt(s) {
    s = Math.max(0, Math.floor(s || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  function paint(t) {
    $("track-title").textContent = t.title;
    $("track-artist").textContent = t.artist;
    $("duration").textContent = "–:––";
    const link = $("yt-link");
    if (link) link.href = `https://www.youtube.com/watch?v=${t.videoId}`;
    const cover = $("cover");
    if (cover && t.cover && !cover.src.endsWith(t.cover)) cover.src = t.cover;
  }

  function load(i, autoplay) {
    current = (i + tracks.length) % tracks.length;
    fallbackDepth = 0;
    const t = tracks[current];
    paint(t);
    if (!ready) return;
    const args = { videoId: t.videoId, startSeconds: t.start || 0 };
    autoplay ? yt.loadVideoById(args) : yt.cueVideoById(args);
  }

  function startPoll() {
    stopPoll();
    poll = setInterval(() => {
      if (!ready || scrubbing) return;
      const d = yt.getDuration() || 0;
      const c = yt.getCurrentTime() || 0;
      if (d > 0) {
        const p = Math.round((c / d) * 1000);
        seekEl.value = p;
        seekEl.style.setProperty("--progress", `${p / 10}%`);
        $("elapsed").textContent = fmt(c);
        $("duration").textContent = fmt(d);
      }
    }, 400);
  }

  function stopPoll() {
    if (poll) clearInterval(poll);
    poll = null;
  }

  function onState(e) {
    const playing = e.data === YT.PlayerState.PLAYING;
    card.classList.toggle("is-playing", playing);
    playing ? startPoll() : stopPoll();
    if (e.data === YT.PlayerState.ENDED) load(current + 1, true);
  }

  /* Embed blocked or video pulled: try another upload of the same song
     before giving up and moving to the next track. */
  function onError() {
    const t = tracks[current];
    if (t.fallbackIds && fallbackDepth < t.fallbackIds.length) {
      yt.loadVideoById({
        videoId: t.fallbackIds[fallbackDepth++],
        startSeconds: t.start || 0,
      });
    } else {
      load(current + 1, true);
    }
  }

  function play() {
    if (!ready) return;
    yt.unMute();
    yt.playVideo();
    started = true;
  }

  function toggle() {
    if (!ready) return;
    yt.getPlayerState() === YT.PlayerState.PLAYING ? yt.pauseVideo() : play();
  }

  /* First interaction anywhere on the scene starts the music — that gesture
     is what lets us unmute, so the page needs no "tap to start" gate. */
  function nudge() {
    if (started) return;
    if (ready) play();
    else {
      const wait = setInterval(() => {
        if (ready) { clearInterval(wait); play(); }
      }, 150);
      started = true;
    }
  }

  function init(config) {
    tracks = config.tracks;
    card = $("player-card");
    seekEl = $("seek");
    paint(tracks[0]);

    $("play").addEventListener("click", toggle);

    /* The three scenes are one ring, so the transport arrows walk between
       pages rather than between tracks. Extra songs on a page still get heard:
       onState advances to the next one when the current track ends. */
    $("prev").addEventListener("click", () => { location.href = config.prev; });
    $("next").addEventListener("click", () => { location.href = config.next; });

    seekEl.addEventListener("input", () => {
      scrubbing = true;
      seekEl.style.setProperty("--progress", `${seekEl.value / 10}%`);
    });
    seekEl.addEventListener("change", () => {
      if (ready) yt.seekTo((seekEl.value / 1000) * (yt.getDuration() || 0), true);
      scrubbing = false;
    });

    const boot = () => {
      yt = new YT.Player("yt-player", {
        width: 200,
        height: 200,
        playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => { ready = true; yt.setVolume(100); load(0, false); },
          onStateChange: onState,
          onError: onError,
        },
      });
    };

    /* The API script may resolve either side of this file, so handle both:
       if it already fired its callback, boot now; otherwise leave the hook. */
    if (window.YT && window.YT.Player) boot();
    else window.onYouTubeIframeAPIReady = boot;
  }

  return { init, nudge };
})();
