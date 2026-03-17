// smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var targetId = this.getAttribute("href");
    var target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop,
      behavior: "smooth",
    });
  });
});

// reveal wedding info blocks on scroll
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var items = document.querySelectorAll(".wedding-info.reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();

// background music (single source of truth)
(function () {
  var audio = document.getElementById("bg-music");
  var toggle = document.getElementById("music-toggle");
  if (!audio || !toggle) return;

  function setUi(isPlaying) {
    toggle.setAttribute("aria-pressed", String(!!isPlaying));
    toggle.classList.toggle("is-playing", !!isPlaying);
  }

  audio.volume = 0.8;
  audio.load();

  function play() {
    return audio.play().then(
      function () {
        setUi(true);
        return true;
      },
      function () {
        setUi(false);
        return false;
      },
    );
  }

  // Attempt to play immediately on load. If blocked, start muted and
  // automatically unmute on first user interaction.
  var pendingUnmute = false;

  window.addEventListener("load", function () {
    audio.muted = false;
    play().then(function (ok) {
      if (ok) return;
      audio.muted = true;
      play().then(function (mutedOk) {
        if (mutedOk) pendingUnmute = true;
      });
    });
  });

  function unlockAudio() {
    if (!pendingUnmute) return;
    pendingUnmute = false;
    audio.muted = false;
    play();
  }

  // Some browsers need an explicit user gesture before any audio can start.
  function gestureStart() {
    if (!audio.paused) return;
    audio.muted = false;
    play();
  }

  document.addEventListener(
    "pointerdown",
    function () {
      unlockAudio();
      gestureStart();
    },
    { once: true },
  );
  document.addEventListener(
    "keydown",
    function () {
      unlockAudio();
      gestureStart();
    },
    { once: true },
  );

  toggle.addEventListener("click", function () {
    if (audio.paused) {
      audio.muted = false;
      play();
      return;
    }
    audio.pause();
    setUi(false);
  });

  audio.addEventListener("play", function () {
    setUi(true);
  });
  audio.addEventListener("pause", function () {
    setUi(false);
  });

  setUi(false);
})();
