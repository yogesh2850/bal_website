(function () {
  var video = document.querySelector(".hero-video");
  var btn = document.querySelector(".hero-toggle");
  if (!video || !btn) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function sync() {
    btn.classList.toggle("is-paused", video.paused);
    btn.setAttribute(
      "aria-label",
      video.paused ? "Play background video" : "Pause background video"
    );
  }

  btn.addEventListener("click", function () {
    if (video.paused) {
      var p = video.play();
      if (p && p.catch) p.catch(sync);
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);

  if (reduceMotion) {
    video.pause();
  } else {
    var play = video.play();
    if (play && play.catch) play.catch(sync);
  }
  sync();

  var bar = document.querySelector(".hero-progress span");
  if (bar) {
    requestAnimationFrame(function step() {
      if (video.duration) {
        bar.style.transform =
          "scaleX(" + (video.currentTime / video.duration).toFixed(4) + ")";
      }
      requestAnimationFrame(step);
    });
  }

  // Parallax / interactive shift of the background with pointer.
  var hero = document.querySelector(".hero");
  if (!hero || reduceMotion) return;

  var targetX = 0;
  var targetY = 0;
  var curX = 0;
  var curY = 0;
  var maxShift = 18;

  hero.addEventListener(
    "pointermove",
    function (event) {
      var r = hero.getBoundingClientRect();
      var nx = (event.clientX - r.left) / r.width - 0.5;
      var ny = (event.clientY - r.top) / r.height - 0.5;
      targetX = -nx * maxShift;
      targetY = -ny * maxShift;
    },
    { passive: true }
  );

  hero.addEventListener("pointerleave", function () {
    targetX = 0;
    targetY = 0;
  });

  requestAnimationFrame(function tick() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    video.style.transform =
      "translate3d(" + curX.toFixed(2) + "px," + curY.toFixed(2) + "px,0) scale(1.08)";
    requestAnimationFrame(tick);
  });
})();
