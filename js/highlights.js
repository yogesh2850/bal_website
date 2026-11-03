(function () {
  var HIGHLIGHTS = [
    {
      title: "Tree-level yield mapping for nut trees harvested with shake-catch harvesters",
      venue: "Biosystems Engineering 2026",
      url: "project-almond.html",
      poster: "assets/almond-yield-card.jpg",
      video: "assets/almond-yield.mp4"
    },
    {
      title: "Fast scheduling and trajectory planning for multi-arm robotic fruit harvesters",
      venue: "IEEE RA-L 2026",
      url: "project-tree-fruit.html",
      poster: "assets/tree-fruit-card.jpg",
      video: "assets/multiarm.mp4"
    },
    {
      title: "FRAIL-bots: fragile-crop harvest-aiding mobile robots",
      venue: "USDA-NIFA · Field robotics",
      url: "project-frailbots.html",
      poster: "assets/frailbots-card.jpg",
      video: "assets/frailbot-row-following.mp4"
    },
    {
      title: "Grapebot: table-grape harvest transport in the vineyard",
      venue: "UC Davis · Field demo",
      url: "project-grapebot.html",
      poster: "assets/grapebot.jpg",
      video: "assets/grapebot.mp4"
    },
    {
      title: "Co-robotic orchard harvest platforms that raise picker throughput",
      venue: "Computers and Electronics in Agriculture",
      url: "project-orchard-platform.html",
      poster: "assets/orchard-platform.jpg"
    },
    {
      title: "Automated strawberry orienting and capping",
      venue: "UC Davis · Machine vision",
      url: "project-strawberry.html",
      poster: "assets/strawberry-card.jpg"
    },
    {
      title: "Precision yield estimation in manual strawberry harvesting with instrumented carts",
      venue: "Computers and Electronics in Agriculture 2026",
      url: "https://doi.org/10.1016/j.compag.2025.111302",
      poster: "assets/carrito.jpg"
    }
  ];

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var el = document.getElementById("home-highlights");
  if (!el) return;

  var track = el.querySelector(".roller-track");
  if (!track) return;

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(url);
  }

  track.innerHTML = HIGHLIGHTS.map(function (h) {
    var media = h.video
      ? '<video muted loop playsinline preload="none" poster="' + esc(h.poster) + '" src="' + esc(h.video) + '" aria-label="' + esc(h.title) + '"></video>'
      : '<img src="' + esc(h.poster) + '" alt="">';
    var ext = isExternal(h.url) ? ' target="_blank" rel="noopener"' : "";
    return (
      '<a class="highlight" href="' + esc(h.url) + '"' + ext + ">" +
        media +
        '<div class="highlight-body">' +
          '<span class="highlight-venue">' + esc(h.venue) + "</span>" +
          "<h3>" + esc(h.title) + "</h3>" +
        "</div>" +
      "</a>"
    );
  }).join("");

  function initRoller(speed) {
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;

    var section = el.closest(".home-highlights");
    var setWidth = 0;
    var pos = 0;
    var last = 0;
    var hover = false;
    var holdUntil = 0;
    var looping = false;

    function measure() {
      var gap = 16;
      var room = el.clientWidth;
      var need = 0;
      originals.forEach(function (card) {
        need += card.offsetWidth + gap;
      });
      // If everything fits, pin as a static row.
      if (need - gap <= room + 1) {
        el.classList.add("is-static");
        looping = false;
        track.style.transform = "";
        while (track.children.length > originals.length) {
          track.removeChild(track.lastChild);
        }
        if (section) {
          var controls = section.querySelector(".roller-controls");
          if (controls) controls.hidden = true;
        }
        return;
      }

      el.classList.remove("is-static");
      if (section) {
        var ctrls = section.querySelector(".roller-controls");
        if (ctrls) ctrls.hidden = false;
      }

      // Duplicate the set once for a seamless loop.
      while (track.children.length > originals.length) {
        track.removeChild(track.lastChild);
      }
      originals.forEach(function (card) {
        track.appendChild(card.cloneNode(true));
      });
      setWidth = 0;
      Array.prototype.slice.call(track.children, 0, originals.length).forEach(function (card) {
        setWidth += card.offsetWidth + gap;
      });
      looping = setWidth > 0;
      pos = el.scrollLeft || 0;
    }

    function inView() {
      var r = el.getBoundingClientRect();
      return r.bottom > 80 && r.top < window.innerHeight - 40;
    }

    function tick(now) {
      requestAnimationFrame(tick);
      if (!looping || reduceMotion) return;
      if (!last) {
        last = now;
        return;
      }
      var dt = Math.min(64, now - last);
      last = now;
      if (inView() && !hover && now > holdUntil && !document.hidden) {
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
        pos += (speed * dt) / 1000;
        if (pos >= setWidth) pos -= setWidth;
        el.scrollLeft = pos;
      }
    }

    el.addEventListener("mouseenter", function () {
      hover = true;
      Array.prototype.forEach.call(el.querySelectorAll("video"), function (v) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      });
    });
    el.addEventListener("mouseleave", function () {
      hover = false;
      Array.prototype.forEach.call(el.querySelectorAll("video"), function (v) {
        v.pause();
      });
    });

    Array.prototype.forEach.call(
      section ? section.querySelectorAll("[data-roll]") : [],
      function (btn) {
        btn.addEventListener("click", function () {
          var dir = Number(btn.getAttribute("data-roll"));
          var first = track.children[0];
          if (!first) return;
          var step = first.offsetWidth + 16;
          holdUntil = performance.now() + 1600;
          if (looping && dir < 0 && el.scrollLeft < step) el.scrollLeft += setWidth;
          if (looping && dir > 0 && el.scrollLeft > setWidth - step) el.scrollLeft -= setWidth;
          el.scrollBy({
            left: dir * step,
            behavior: reduceMotion ? "auto" : "smooth"
          });
          pos = el.scrollLeft + dir * step;
        });
      }
    );

    window.addEventListener("resize", function () {
      measure();
    });

    measure();
    requestAnimationFrame(tick);
  }

  initRoller(32);
})();
