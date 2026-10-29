(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var label = btn && btn.querySelector(".theme-label");

  var heroVideo = document.querySelector(".hero-media video");
  var heroSrc = { day: "assets/ucd_cloth_fling.mp4", night: "assets/ucd_cloth_fling_night.mp4" };

  function applyTheme(night) {
    root.classList.toggle("night", night);
    if (heroVideo) {
      var want = night ? heroSrc.night : heroSrc.day;
      var cur = heroVideo.getAttribute("src") || (heroVideo.querySelector("source") || {}).getAttribute && heroVideo.querySelector("source").getAttribute("src") || "";
      if (!cur.endsWith(want)) {
        var srcEl = heroVideo.querySelector("source");
        if (srcEl) srcEl.setAttribute("src", want);
        heroVideo.setAttribute("src", want);
        heroVideo.load();
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      }
    }
    if (!btn) return;
    btn.setAttribute("aria-pressed", night ? "true" : "false");
    if (label) label.textContent = night ? "Day" : "Night";
  }

  if (btn) {
    applyTheme(localStorage.getItem("theme") === "night");
    btn.addEventListener("click", function () {
      var night = !root.classList.contains("night");
      applyTheme(night);
      localStorage.setItem("theme", night ? "night" : "day");
    });
  }
})();
