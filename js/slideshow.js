(function () {
  var slides = document.querySelectorAll(".mySlides");
  if (!slides.length) return;
  var index = 0;

  function show(n) {
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[n].style.display = "block";
  }

  show(0);
  setInterval(function () {
    index = (index + 1) % slides.length;
    show(index);
  }, 3500);
})();
