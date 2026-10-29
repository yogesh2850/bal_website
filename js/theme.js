(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var label = btn && btn.querySelector(".theme-label");

  function applyTheme(night) {
    root.classList.toggle("night", night);
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
