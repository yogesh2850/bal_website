(function () {
  var container = document.querySelector(".slideshow-container");
  if (!container) return;

  var slides = container.querySelectorAll(".mySlides");
  if (!slides.length) return;

  var index = 0;
  var timer = null;
  var intervalMs = 4500;

  function show(n) {
    index = ((n % slides.length) + slides.length) % slides.length;
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      slides[i].classList.remove("is-active");
    }
    var active = slides[index];
    active.style.display = "block";
    // retrigger fade so the change is visible
    active.classList.remove("fade");
    void active.offsetWidth;
    active.classList.add("fade");
    active.classList.add("is-active");
  }

  function go(delta) {
    show(index + delta);
    start();
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(index + 1);
    }, intervalMs);
  }

  function stop() {
    if (timer != null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  container.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;
    var btn = target.closest(".slide-nav");
    if (!btn || !container.contains(btn)) return;
    event.preventDefault();
    event.stopPropagation();
    if (btn.classList.contains("prev")) go(-1);
    else if (btn.classList.contains("next")) go(1);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") go(-1);
    else if (event.key === "ArrowRight") go(1);
  });

  container.addEventListener("mouseenter", stop);
  container.addEventListener("mouseleave", start);

  show(0);
  start();
})();
