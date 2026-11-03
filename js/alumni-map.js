(function () {
  var mount = document.getElementById("alumni-map");
  var panel = document.getElementById("alumni-map-panel");
  if (!mount || !panel || !window.d3 || !window.topojson) return;

  // Locations inferred from LinkedIn profile locations / public affiliations
  // linked from the Alumni list. Update here when someone moves.
  var ALUMNI = [
    { name: "John Shepard", country: "United States", iso: "USA", role: "Principal, Shepard Labs", url: "https://www.linkedin.com/in/john-shepard-phd-23612414/" },
    { name: "Juan Fernando Villacrés", country: "Ecuador", iso: "ECU", role: "Assistant Professor, National Polytechnic School", url: "https://juanvillacres.github.io/" },
    { name: "Peng Wei", country: "United States", iso: "USA", role: "Assistant Professor, University of Minnesota", url: "https://www.linkedin.com/in/peng-wei-3467b0b3/" },
    { name: "Uddhav Bhattarai", country: "United States", iso: "USA", role: "Robotics Data Scientist, PNNL", url: "https://www.linkedin.com/in/uddhavbhattarai/" },
    { name: "Chen Peng", country: "China", iso: "CHN", role: "Researcher, ZJU Hangzhou Innovation Center", url: "https://www.linkedin.com/in/peng-chen-73b546129/" },
    { name: "Zhenghao Fei", country: "China", iso: "CHN", role: "Zhejiang University / Hangzhou Innovation Center", url: "https://www.linkedin.com/in/zhenghao-fei-6b786938/" },
    { name: "Hasan Seyyedhasani", country: "United States", iso: "USA", role: "Assistant Professor, Virginia Tech", url: "https://www.linkedin.com/in/hasan-seyyedhasani-ba4b5268/" },
    { name: "Adrien Durand-Petiteville", country: "Brazil", iso: "BRA", role: "Assistant Professor, Universidade Federal de Pernambuco", url: "https://www.linkedin.com/in/adrien-durand-petiteville-36b22766/" },
    { name: "Long He", country: "United States", iso: "USA", role: "Associate Professor, Penn State", url: "https://www.linkedin.com/in/long-he-45a7a952/" },
    { name: "Ashkan Zehfroosh", country: "United States", iso: "USA", role: "California Department of Consumer Affairs", url: "https://www.linkedin.com/in/ashkan-zehfroosh-66231a20a/" },
    { name: "Rajkishan Arikapudi", country: "United States", iso: "USA", role: "Postdoctoral Research Associate, UC Davis", url: "https://www.linkedin.com/in/rajkishan-arikapudi-ph-d-07198849/" },
    { name: "Kaiming Fu", country: "United States", iso: "USA", role: "Research Scientist, Meta", url: "https://www.linkedin.com/in/kmfu/" },
    { name: "Farangis Khosro Anjom", country: "Germany", iso: "DEU", role: "Data Scientist, Moyyn", url: "https://www.linkedin.com/in/farangis-kh/" },
    { name: "Natalie Pueyo Svoboda", country: "United States", iso: "USA", role: "Robotics Software Engineer, OSARO", url: "https://www.linkedin.com/in/npueyo/" },
    { name: "Ihsane Yucef Debbache", country: "United States", iso: "USA", role: "VP of Engineering, Stereolabs", url: "https://www.linkedin.com/in/ihsane/" },
    { name: "Ben Gatten", country: "United States", iso: "USA", role: "Senior Perception Engineer, Bonsai Robotics", url: "https://www.linkedin.com/in/bmgatten/" },
    { name: "Varadraj Bhat", country: "United States", iso: "USA", role: "System Development Engineer II, Amazon Robotics", url: "https://www.linkedin.com/in/varadraj-bhat/" },
    { name: "Shantanu Wadnerkar", country: "United States", iso: "USA", role: "Senior Software Engineer, Brain Corp", url: "https://www.linkedin.com/in/shantanu-wadnerkar/" },
    { name: "Boyan Cai", country: "United States", iso: "USA", role: "M.S., Electrical and Computer Engineering, UC Davis", url: "https://www.linkedin.com/in/boyan-cai/" },
    { name: "Yufei Wang", country: "United States", iso: "USA", role: "M.S., Computer Engineering, UC Davis", url: "https://www.linkedin.com/in/yufei-wang-303b9a155/" },
    { name: "Raffi (Raphael) Zack", country: "United States", iso: "USA", role: "Control Systems Engineer, DEKA", url: "https://www.linkedin.com/in/raffizack/" },
    { name: "Brian Lim", country: "United States", iso: "USA", role: "Robotics Engineer", url: "https://www.linkedin.com/in/-brian-lim-/" },
    { name: "Richinder “Richie” Rehal", country: "United States", iso: "USA", role: "Embedded Systems Engineer, LLNL", url: "https://www.linkedin.com/in/rsrehal/" },
    { name: "Garren Hendricks", country: "United Kingdom", iso: "GBR", role: "Senior Systems Engineer, DNA Electronics", url: "https://www.linkedin.com/in/garren-hendricks/" },
    { name: "Wei-jiunn (Vic) Jang", country: "United States", iso: "USA", role: "Graduate Student Researcher, Bio-Automation Lab", url: "https://www.linkedin.com/in/wei-jiunn-jang-71322233/" },
    { name: "Rayne Milner", country: "United States", iso: "USA", role: "Software Manager, OSARO", url: "https://www.linkedin.com/in/rayne-milner-70536a84/" },
    { name: "Caitlin Speliotopoulos", country: "United States", iso: "USA", role: "Administrative & operations / artist", url: "https://www.linkedin.com/in/cspeliotopoulos/" },
    { name: "Daisy Valencia", country: "United States", iso: "USA", role: "System Engineer, SyCal Engineering", url: "https://www.linkedin.com/in/daisy-valencia-18b84116a/" },
    { name: "Joshua Munic", country: "United States", iso: "USA", role: "Software Engineer, Zoox", url: "https://www.linkedin.com/in/joshua-munic-9b6438b1/" },
    { name: "Julien Hoachuck", country: "United States", iso: "USA", role: "CEO, 789 Labs", url: "https://www.linkedin.com/in/julienhoachuck/" },
    { name: "Drew Liu", country: "United States", iso: "USA", role: "Process Engineer, Applied Medical", url: "https://www.linkedin.com/in/liudrew/" },
    { name: "Randy Lewis", country: "United States", iso: "USA", role: "Founder, DragonSkin", url: "https://www.linkedin.com/in/randylewis77/" },
    { name: "Jhonnatan Ascate Silva", country: "United States", iso: "USA", role: "Technical Program Manager, Amazon Lab126", url: "https://www.linkedin.com/in/jhonnatan-ascate-silva-69394210b/" }
  ];

  var byIso = {};
  ALUMNI.forEach(function (person) {
    if (!byIso[person.iso]) {
      byIso[person.iso] = {
        iso: person.iso,
        country: person.country,
        people: []
      };
    }
    byIso[person.iso].people.push(person);
  });

  var counts = Object.keys(byIso).map(function (iso) {
    return byIso[iso].people.length;
  });
  var maxCount = Math.max.apply(null, counts);

  var width = mount.clientWidth || 640;
  var height = Math.max(280, Math.round(width * 0.48));

  var svg = d3
    .select(mount)
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("role", "img")
    .attr("aria-label", "World map of alumni locations");

  var g = svg.append("g");

  var projection = d3
    .geoNaturalEarth1()
    .fitSize([width - 8, height - 8], { type: "Sphere" });
  var path = d3.geoPath(projection);

  var color = d3
    .scaleSequential()
    .domain([0, maxCount])
    .interpolator(function (t) {
      // UC Davis blue ramp on a light gray base
      return d3.interpolateRgb("#d7dee8", "#022851")(Math.pow(t, 0.65));
    });

  function showCountry(iso) {
    var entry = byIso[iso];
    if (!entry) {
      panel.innerHTML =
        '<p class="alumni-map-empty">No alumni mapped in this country yet.</p>';
      return;
    }
    var people = entry.people
      .map(function (p) {
        return (
          "<li>" +
          '<a href="' +
          p.url +
          '" target="_blank" rel="noopener">' +
          p.name +
          "</a>" +
          '<span class="alumni-map-role">' +
          p.role +
          "</span>" +
          "</li>"
        );
      })
      .join("");
    panel.innerHTML =
      "<h4>" +
      entry.country +
      "</h4>" +
      '<p class="alumni-map-count"><strong>' +
      entry.people.length +
      "</strong> alumni</p>" +
      '<ul class="alumni-map-list">' +
      people +
      "</ul>";
  }

  function showOverview() {
    var rows = Object.keys(byIso)
      .map(function (iso) {
        return byIso[iso];
      })
      .sort(function (a, b) {
        return b.people.length - a.people.length;
      })
      .map(function (entry) {
        return (
          '<button type="button" class="alumni-map-chip" data-iso="' +
          entry.iso +
          '">' +
          entry.country +
          " · " +
          entry.people.length +
          "</button>"
        );
      })
      .join("");
    panel.innerHTML =
      "<h4>Alumni worldwide</h4>" +
      '<p class="alumni-map-count"><strong>' +
      ALUMNI.length +
      "</strong> people mapped across <strong>" +
      Object.keys(byIso).length +
      "</strong> countries</p>" +
      '<p class="meta alumni-map-note">Locations inferred from LinkedIn profiles and public affiliations. Click a country or chip to explore.</p>' +
      '<div class="alumni-map-chips">' +
      rows +
      "</div>";

    panel.querySelectorAll("[data-iso]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showCountry(btn.getAttribute("data-iso"));
        g.selectAll("path.country").classed("is-active", false);
        g.selectAll('path.country[data-iso="' + btn.getAttribute("data-iso") + '"]').classed(
          "is-active",
          true
        );
      });
    });
  }

  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(function (world) {
      var countries = topojson.feature(world, world.objects.countries).features;
      // Numeric ISO_N3 in world-atlas -> map a few names we need via id
      // world-atlas uses numeric ISO 3166-1 numeric codes as id
      var numericToIso = {
        840: "USA",
        218: "ECU",
        156: "CHN",
        76: "BRA",
        276: "DEU",
        826: "GBR"
      };

      g.append("path")
        .datum({ type: "Sphere" })
        .attr("class", "alumni-map-sphere")
        .attr("d", path);

      g.selectAll("path.country")
        .data(countries)
        .join("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("data-iso", function (d) {
          return numericToIso[d.id] || "";
        })
        .attr("fill", function (d) {
          var iso = numericToIso[d.id];
          if (!iso || !byIso[iso]) return "#edf0f3";
          return color(byIso[iso].people.length);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.4)
        .style("cursor", function (d) {
          return numericToIso[d.id] && byIso[numericToIso[d.id]] ? "pointer" : "default";
        })
        .on("mouseenter", function (event, d) {
          var iso = numericToIso[d.id];
          if (!iso || !byIso[iso]) return;
          d3.select(this).attr("stroke-width", 1.2).attr("stroke", "#022851");
        })
        .on("mouseleave", function () {
          if (!d3.select(this).classed("is-active")) {
            d3.select(this).attr("stroke-width", 0.4).attr("stroke", "#fff");
          }
        })
        .on("click", function (event, d) {
          var iso = numericToIso[d.id];
          if (!iso || !byIso[iso]) return;
          g.selectAll("path.country")
            .classed("is-active", false)
            .attr("stroke-width", 0.4)
            .attr("stroke", "#fff");
          d3.select(this)
            .classed("is-active", true)
            .attr("stroke-width", 1.4)
            .attr("stroke", "#022851");
          showCountry(iso);
        });

      showOverview();
    })
    .catch(function () {
      panel.innerHTML =
        '<p class="alumni-map-empty">Could not load the world map right now. The alumni list below is still complete.</p>';
    });
})();
