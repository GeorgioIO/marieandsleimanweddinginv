// Minimal IntersectionObserver for scroll animations
function initScrollAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var items = document.querySelectorAll(".animate-section");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  items.forEach(function (el) { observer.observe(el); });
}

// Loading Screen Logic
(function() {
  var loader = document.getElementById("loading-screen");
  if (!loader) {
    initScrollAnimations();
    return;
  }
  
  function finishLoading() {
    loader.classList.add("hidden");
    document.body.classList.remove("loading");
    setTimeout(initScrollAnimations, 100); 
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(finishLoading, 400);
  } else {
    setTimeout(finishLoading, 2800);
  }
})();

// Background music toggle logic
(function () {
  var audio = document.getElementById("bg-music");
  var toggle = document.getElementById("music-toggle");
  if (!audio || !toggle) return;

  function setUi(isPlaying) {
    if (isPlaying) {
      toggle.classList.add("is-playing");
    } else {
      toggle.classList.remove("is-playing");
    }
  }


  audio.volume = 0.5;

  function tryPlay() {
    var promise = audio.play();
    if (promise !== undefined) {
      promise.then(function() {
        setUi(true);
      }).catch(function() {
        setUi(false);
      });
    }
  }

  // Auto-play attempt on load
  window.addEventListener("load", function() {
    tryPlay();
  });

  // Toggle on click
  toggle.addEventListener("click", function() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", function() { setUi(true); });
  audio.addEventListener("pause", function() { setUi(false); });

  // Resume playback on first interaction if autoplay was blocked
  var enableAudioInteraction = function() {
    if (audio.paused && !toggle.classList.contains("user-paused")) {
      tryPlay();
    }
    document.removeEventListener("pointerdown", enableAudioInteraction);
    document.removeEventListener("keydown", enableAudioInteraction);
  };

  document.addEventListener("pointerdown", enableAudioInteraction, { once: true });
  document.addEventListener("keydown", enableAudioInteraction, { once: true });

  // Mark if user intentionally paused
  toggle.addEventListener("click", function() {
    if (audio.paused) {
      toggle.classList.add("user-paused");
    } else {
      toggle.classList.remove("user-paused");
    }
  });
})();

