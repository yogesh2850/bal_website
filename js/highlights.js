(function () {
  var HIGHLIGHTS = [
    {
      kind: "Paper",
      venue: "Biosystems Engineering 2027",
      title: "Tree-level yield mapping for nut trees harvested with shake-catch harvesters, Part II: Uncertainty estimation and tree identification",
      url: "https://doi.org/10.1016/j.biosystemseng.2026.104605"
    },
    {
      kind: "Paper",
      venue: "Biosystems Engineering 2026",
      title: "Tree-level yield mapping for nut trees harvested with shake-catch harvesters – Part I: Yield monitoring and volume flow deconvolution",
      url: "https://doi.org/10.1016/j.biosystemseng.2026.104591"
    },
    {
      kind: "Paper",
      venue: "Computers and Electronics in Agriculture 2026",
      title: "Precision yield estimation and mapping in manual strawberry harvesting with instrumented picking carts",
      url: "https://doi.org/10.1016/j.compag.2025.111302"
    },
    {
      kind: "Paper",
      venue: "Biosystems Engineering 2026",
      title: "Data-driven worker activity recognition and efficiency estimation in manual fruit harvesting",
      url: "https://doi.org/10.1016/j.biosystemseng.2025.104326"
    },
    {
      kind: "Paper",
      venue: "IEEE RA-L 2026",
      title: "Fast scheduling and trajectory planning for robotic fruit harvesters with multiple Cartesian arms",
      url: "https://doi.org/10.1109/lra.2025.3643283"
    },
    {
      kind: "Paper",
      venue: "Computers and Electronics in Agriculture 2025",
      title: "Vision-based navigation of unmanned aerial vehicles in orchards: An imitation learning approach",
      url: "https://doi.org/10.1016/j.compag.2025.110802"
    },
    {
      kind: "Paper",
      venue: "IEEE RA-L 2025",
      title: "Efficient and safe trajectory planning for autonomous agricultural vehicle headland turning in cluttered orchards",
      url: "https://doi.org/10.1109/LRA.2025.3534056"
    },
    {
      kind: "Grant",
      venue: "Almond Board of California · through 7/31/26",
      title: "Almond Yield Monitoring at a Single-tree Resolution",
      url: "research.html"
    },
    {
      kind: "Grant",
      venue: "CDFA · through 12/31/25",
      title: "Development of Precision Yield Monitor for Almond and Pistachio",
      url: "project-almond.html"
    },
    {
      kind: "Grant",
      venue: "USDA-NIFA, National Robotics Initiative",
      title: "Tree Fruit Harvesting with Arrays of Vision-Guided Linear Robot Arms",
      url: "project-tree-fruit.html"
    },
    {
      kind: "Grant",
      venue: "USDA-NIFA (AFRI)",
      title: "Mechanical Mass-Harvesting of Tree Fruits using Innovative Multi-level Fruit Capture Systems",
      url: "research.html"
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
    var ext = isExternal(h.url) ? ' target="_blank" rel="noopener"' : "";
    return (
      '<a class="highlight highlight-text" href="' + esc(h.url) + '"' + ext + ">" +
        '<div class="highlight-body">' +
          '<span class="highlight-kind">' + esc(h.kind) + "</span>" +
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
      if (need - gap <= room + 1) {
        el.classList.add("is-static");
        looping = false;
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

    el.addEventListener("mouseenter", function () { hover = true; });
    el.addEventListener("mouseleave", function () { hover = false; });

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

    window.addEventListener("resize", measure);
    measure();
    requestAnimationFrame(tick);
  }

  initRoller(28);
})();
