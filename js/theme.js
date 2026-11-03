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

  var night = false;
  try {
    night = localStorage.getItem("theme") === "night";
  } catch (e) {}
  applyTheme(night);

  if (btn) {
    btn.addEventListener("click", function () {
      night = !root.classList.contains("night");
      applyTheme(night);
      try {
        localStorage.setItem("theme", night ? "night" : "day");
      } catch (e) {}
    });
  }
})();
