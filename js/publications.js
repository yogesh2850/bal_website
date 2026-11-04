(function () {
  var LINK_ORDER = ["DOI", "arXiv", "Link", "PDF", "Project"];

  // Venue filter chips. First matching group wins; preprints override; else Others.
  var VENUE_GROUPS = [
    ["Compag", /Computers and Electronics in Agriculture|Compag/i],
    ["Biosystems Eng", /Biosystems Engineering|Biosystems Eng/i],
    ["RA-L", /\bRA-L\b|\(RA-?L\)|Robotics and Automation Letters/i],
    ["JFR", /Journal of Field Robotics|\bJFR\b/i],
    ["ICRA", /\bICRA\b|International Conference on Robotics and Automation/i],
    ["IROS", /\bIROS\b|Intelligent Robots and Systems/i],
    ["ASABE", /\bASABE\b|Applied Engineering in Agriculture|Transactions of the ASABE|Transactions of the American Society of Agricultural/i],
    ["CASE", /\bCASE\b|Automation Science and Engineering/i]
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ext(url) {
    return /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener"' : "";
  }

  function venueGroup(p) {
    if (p.type === "preprint" || /arxiv/i.test(p.venue)) return "Preprint";
    var hay = (p.venue || "") + " " + (p.title || "");
    for (var i = 0; i < VENUE_GROUPS.length; i++) {
      if (VENUE_GROUPS[i][1].test(hay) || VENUE_GROUPS[i][1].test(p.venue || "")) {
        return VENUE_GROUPS[i][0];
      }
    }
    return "Others";
  }

  function primaryLink(p) {
    var links = p.links || [];
    for (var i = 0; i < LINK_ORDER.length; i++) {
      for (var j = 0; j < links.length; j++) {
        if (links[j].label === LINK_ORDER[i]) return links[j].url;
      }
    }
    return links.length ? links[0].url : "";
  }

  function initPublications() {
    var list = $("pub-list");
    if (!list) return;

    var pubs = window.LAB_PUBLICATIONS || [];
    var search = $("pub-search");
    var count = $("pub-count");
    var chips = $("pub-chips");
    var yearSelect = $("pub-year");
    var venue = "All";

    var years = [];
    pubs.forEach(function (p) {
      if (p.year && years.indexOf(p.year) === -1) years.push(p.year);
    });
    years.sort(function (a, b) { return b - a; });
    yearSelect.innerHTML =
      '<option value="">All years</option>' +
      years.map(function (y) {
        return '<option value="' + y + '">' + y + "</option>";
      }).join("");

    chips.innerHTML = ["All"]
      .concat(VENUE_GROUPS.map(function (g) { return g[0]; }))
      .concat(["Preprint", "Others"])
      .map(function (v) {
        return (
          '<button class="chip" type="button" data-venue="' +
          esc(v) +
          '" aria-pressed="' +
          (v === venue) +
          '">' +
          esc(v) +
          "</button>"
        );
      })
      .join("");

    function item(p) {
      var url = primaryLink(p);
      var title = url
        ? '<a href="' + esc(url) + '"' + ext(url) + ">" + esc(p.title) + "</a>"
        : esc(p.title);
      var authors = esc(p.authors || "");
      var links = (p.links || [])
        .map(function (l) {
          return '<a href="' + esc(l.url) + '"' + ext(l.url) + ">" + esc(l.label) + "</a>";
        })
        .join("");
      var note = p.note
        ? '<span class="pub-note">' + esc(p.note) + "</span>"
        : "";
      return (
        '<li class="pub"><h3>' +
        title +
        "</h3>" +
        (authors ? '<p class="pub-authors">' + authors + "</p>" : "") +
        '<p class="pub-meta"><span class="pub-venue">' +
        esc(p.venue) +
        "</span>" +
        (links ? '<span class="pub-links">' + links + "</span>" : "") +
        note +
        "</p></li>"
      );
    }

    function render() {
      var q = (search.value || "").trim().toLowerCase();
      var shown = pubs.filter(function (p) {
        if (venue !== "All" && venueGroup(p) !== venue) return false;
        if (yearSelect.value && String(p.year) !== yearSelect.value) return false;
        if (!q) return true;
        var hay = (
          (p.title || "") +
          " " +
          (p.authors || "") +
          " " +
          (p.venue || "") +
          " " +
          p.year
        ).toLowerCase();
        return hay.indexOf(q) !== -1;
      });

      var byYear = {};
      var yearOrder = [];
      shown.forEach(function (p) {
        var y = p.year || 0;
        if (!byYear[y]) {
          byYear[y] = [];
          yearOrder.push(y);
        }
        byYear[y].push(p);
      });
      yearOrder.sort(function (a, b) { return b - a; });

      list.innerHTML =
        yearOrder
          .map(function (y) {
            return (
              '<section class="pub-year"><h2>' +
              (y || "—") +
              '</h2><ul class="pub-list">' +
              byYear[y].map(item).join("") +
              "</ul></section>"
            );
          })
          .join("") ||
        '<p class="pub-empty">No publications match your search.</p>';

      count.textContent =
        shown.length === pubs.length
          ? pubs.length + " publications"
          : shown.length + " of " + pubs.length + " publications";
    }

    search.addEventListener("input", render);
    yearSelect.addEventListener("change", render);
    chips.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      venue = btn.getAttribute("data-venue");
      Array.prototype.forEach.call(chips.children, function (c) {
        c.setAttribute("aria-pressed", c === btn ? "true" : "false");
      });
      render();
    });
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPublications);
  } else {
    initPublications();
  }
})();
