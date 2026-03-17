// smooth scroll for the "Scroll Down" button
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

// background music (autoplay if allowed, toggle pause/resume)
(function () {
  var audio = document.getElementById("bg-music");
  var toggle = document.getElementById("music-toggle");
  if (!audio || !toggle) return;

  function setUi(isPlaying) {
    toggle.setAttribute("aria-pressed", String(!!isPlaying));
    toggle.classList.toggle("is-playing", !!isPlaying);
  }

  async function tryPlay() {
    try {
      await audio.play();
      setUi(true);
      return true;
    } catch (e) {
      setUi(false);
      return false;
    }
  }

  // Attempt to autoplay on load (may be blocked by browser policy)
  window.addEventListener("load", function () {
    tryPlay();
  });

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    if (audio.paused) {
      tryPlay();
    } else {
      audio.pause();
      setUi(false);
    }
  });

  audio.addEventListener("play", function () {
    setUi(true);
  });
  audio.addEventListener("pause", function () {
    setUi(false);
  });

  setUi(false);
})();
