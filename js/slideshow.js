(function () {
  var slides = document.querySelectorAll(".mySlides");
  if (!slides.length) return;
  var index = 0;
  var timer = null;
  var intervalMs = 3500;

  function show(n) {
    index = (n + slides.length) % slides.length;
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[index].style.display = "block";
  }

  function next() {
    show(index + 1);
  }

  function prev() {
    show(index - 1);
  }

  function start() {
    stop();
    timer = setInterval(next, intervalMs);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function go(delta) {
    show(index + delta);
    start();
  }

  var prevBtn = document.querySelector(".slide-nav.prev");
  var nextBtn = document.querySelector(".slide-nav.next");
  if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

  show(0);
  start();
})();
