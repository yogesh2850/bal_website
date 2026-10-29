(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var label = btn && btn.querySelector(".theme-label");
  var heroVideo = document.querySelector(".hero-media video");
  var heroSrc = {
    day: "assets/ucd_cloth_fling.mp4",
    night: "assets/ucd_cloth_fling_night.mp4"
  };

  function currentHeroSrc() {
    if (!heroVideo) return "";
    var srcEl = heroVideo.querySelector("source");
    return (srcEl && srcEl.getAttribute("src")) || heroVideo.getAttribute("src") || "";
  }

  function setHeroVideo(night) {
    if (!heroVideo) return;
    var want = night ? heroSrc.night : heroSrc.day;
    if (currentHeroSrc().indexOf(want) !== -1) return;
    var srcEl = heroVideo.querySelector("source");
    if (srcEl) srcEl.setAttribute("src", want);
    heroVideo.setAttribute("src", want);
    heroVideo.load();
    var play = heroVideo.play();
    if (play && play.catch) play.catch(function () {});
  }

  function applyTheme(night) {
    root.classList.toggle("night", night);
    setHeroVideo(night);
    if (!btn) return;
    btn.setAttribute("aria-pressed", night ? "true" : "false");
    if (label) label.textContent = night ? "Day" : "Night";
  }

  var night = false;
  try { night = localStorage.getItem("theme") === "night"; } catch (e) {}
  applyTheme(night);

  if (btn) {
    btn.addEventListener("click", function () {
      night = !root.classList.contains("night");
      applyTheme(night);
      try { localStorage.setItem("theme", night ? "night" : "day"); } catch (e) {}
    });
  }
})();
