(function () {
  var mount = document.getElementById("alumni-map");
  var panel = document.getElementById("alumni-map-panel");
  if (!mount || !panel || !window.d3 || !window.topojson) return;

  // Locations inferred from LinkedIn / public affiliations.
  // region + lat/lng power the zoomed country view.
  var ALUMNI = [
    { name: "Tianyang Liao", country: "United States", iso: "USA", region: "Davis, CA", lat: 38.54, lng: -121.74, role: "M.Sc., UC Davis", url: "https://www.linkedin.com/in/tianyang-liao-b74783319/" },
    { name: "Dennis Sadowski", country: "United States", iso: "USA", region: "Davis, CA", lat: 38.54, lng: -121.74, role: "Development Engineer, BAE, UC Davis", url: "https://www.bftv.ucdavis.edu/people/dennis-sadowski" },
    { name: "John Shepard", country: "United States", iso: "USA", region: "Bay Area, CA", lat: 37.87, lng: -122.27, role: "Principal, Shepard Labs", url: "https://www.linkedin.com/in/john-shepard-phd-23612414/" },
    { name: "Juan Fernando Villacrés", country: "Ecuador", iso: "ECU", region: "Quito", lat: -0.18, lng: -78.47, role: "Assistant Professor, National Polytechnic School", url: "https://juanvillacres.github.io/" },
    { name: "Peng Wei", country: "United States", iso: "USA", region: "Minneapolis–Saint Paul, MN", lat: 44.97, lng: -93.26, role: "Assistant Professor, University of Minnesota", url: "https://www.linkedin.com/in/peng-wei-3467b0b3/" },
    { name: "Uddhav Bhattarai", country: "United States", iso: "USA", region: "Richland, WA", lat: 46.29, lng: -119.28, role: "Robotics Data Scientist, PNNL", url: "https://www.linkedin.com/in/uddhavbhattarai/" },
    { name: "Chen Peng", country: "China", iso: "CHN", region: "Hangzhou", lat: 30.27, lng: 120.15, role: "Researcher, ZJU Hangzhou Innovation Center", url: "https://www.linkedin.com/in/peng-chen-73b546129/" },
    { name: "Zhenghao Fei", country: "China", iso: "CHN", region: "Hangzhou", lat: 30.27, lng: 120.15, role: "Zhejiang University / Hangzhou Innovation Center", url: "https://www.linkedin.com/in/zhenghao-fei-6b786938/" },
    { name: "Hasan Seyyedhasani", country: "United States", iso: "USA", region: "Blacksburg, VA", lat: 37.23, lng: -80.41, role: "Assistant Professor, Virginia Tech", url: "https://www.linkedin.com/in/hasan-seyyedhasani-ba4b5268/" },
    { name: "Adrien Durand-Petiteville", country: "Brazil", iso: "BRA", region: "Recife", lat: -8.05, lng: -34.88, role: "Assistant Professor, Universidade Federal de Pernambuco", url: "https://www.linkedin.com/in/adrien-durand-petiteville-36b22766/" },
    { name: "Long He", country: "United States", iso: "USA", region: "State College, PA", lat: 40.79, lng: -77.86, role: "Associate Professor, Penn State", url: "https://www.linkedin.com/in/long-he-45a7a952/" },
    { name: "Ashkan Zehfroosh", country: "United States", iso: "USA", region: "Sacramento, CA", lat: 38.58, lng: -121.49, role: "California Department of Consumer Affairs", url: "https://www.linkedin.com/in/ashkan-zehfroosh-66231a20a/" },
    { name: "Rajkishan Arikapudi", country: "United States", iso: "USA", region: "Davis, CA", lat: 38.54, lng: -121.74, role: "Postdoctoral Research Associate, UC Davis", url: "https://www.linkedin.com/in/rajkishan-arikapudi-ph-d-07198849/" },
    { name: "Kaiming Fu", country: "United States", iso: "USA", region: "Menlo Park, CA", lat: 37.48, lng: -122.15, role: "Research Scientist, Meta", url: "https://www.linkedin.com/in/kmfu/" },
    { name: "Farangis Khosro Anjom", country: "Germany", iso: "DEU", region: "Berlin", lat: 52.52, lng: 13.405, role: "Data Scientist, Moyyn", url: "https://www.linkedin.com/in/farangis-kh/" },
    { name: "Natalie Pueyo Svoboda", country: "United States", iso: "USA", region: "San Francisco, CA", lat: 37.77, lng: -122.42, role: "Robotics Software Engineer, OSARO", url: "https://www.linkedin.com/in/npueyo/" },
    { name: "Ihsane Yucef Debbache", country: "United States", iso: "USA", region: "San Francisco, CA", lat: 37.78, lng: -122.4, role: "VP of Engineering, Stereolabs", url: "https://www.linkedin.com/in/ihsane/" },
    { name: "Ben Gatten", country: "United States", iso: "USA", region: "San Jose, CA", lat: 37.34, lng: -121.89, role: "Senior Perception Engineer, Bonsai Robotics", url: "https://www.linkedin.com/in/bmgatten/" },
    { name: "Varadraj Bhat", country: "United States", iso: "USA", region: "Greater Boston, MA", lat: 42.27, lng: -71.61, role: "System Development Engineer II, Amazon Robotics", url: "https://www.linkedin.com/in/varadraj-bhat/" },
    { name: "Shantanu Wadnerkar", country: "United States", iso: "USA", region: "San Diego, CA", lat: 32.88, lng: -117.16, role: "Senior Software Engineer, Brain Corp", url: "https://www.linkedin.com/in/shantanu-wadnerkar/" },
    { name: "Boyan Cai", country: "United States", iso: "USA", region: "Davis, CA", lat: 38.54, lng: -121.74, role: "M.S., Electrical and Computer Engineering, UC Davis", url: "https://www.linkedin.com/in/boyan-cai/" },
    { name: "Yufei Wang", country: "United States", iso: "USA", region: "Davis, CA", lat: 38.54, lng: -121.74, role: "M.S., Computer Engineering, UC Davis", url: "https://www.linkedin.com/in/yufei-wang-303b9a155/" },
    { name: "Raffi (Raphael) Zack", country: "United States", iso: "USA", region: "Manchester, NH", lat: 42.99, lng: -71.46, role: "Control Systems Engineer, DEKA", url: "https://www.linkedin.com/in/raffizack/" },
    { name: "Brian Lim", country: "United States", iso: "USA", region: "Bay Area, CA", lat: 37.44, lng: -122.14, role: "Robotics Engineer", url: "https://www.linkedin.com/in/-brian-lim-/" },
    { name: "Richinder “Richie” Rehal", country: "United States", iso: "USA", region: "Livermore, CA", lat: 37.69, lng: -121.77, role: "Embedded Systems Engineer, LLNL", url: "https://www.linkedin.com/in/rsrehal/" },
    { name: "Garren Hendricks", country: "United Kingdom", iso: "GBR", region: "London", lat: 51.51, lng: -0.13, role: "Senior Systems Engineer, DNA Electronics", url: "https://www.linkedin.com/in/garren-hendricks/" },
    { name: "Wei-jiunn (Vic) Jang", country: "United States", iso: "USA", region: "Davis, CA", lat: 38.54, lng: -121.74, role: "Graduate Student Researcher, Bio-Automation Lab", url: "https://www.linkedin.com/in/wei-jiunn-jang-71322233/" },
    { name: "Rayne Milner", country: "United States", iso: "USA", region: "San Francisco, CA", lat: 37.76, lng: -122.43, role: "Software Manager, OSARO", url: "https://www.linkedin.com/in/rayne-milner-70536a84/" },
    { name: "Caitlin Speliotopoulos", country: "United States", iso: "USA", region: "Davis, CA", lat: 38.55, lng: -121.73, role: "Administrative & operations / artist", url: "https://www.linkedin.com/in/cspeliotopoulos/" },
    { name: "Daisy Valencia", country: "United States", iso: "USA", region: "Sacramento, CA", lat: 38.58, lng: -121.49, role: "System Engineer, SyCal Engineering", url: "https://www.linkedin.com/in/daisy-valencia-18b84116a/" },
    { name: "Joshua Munic", country: "United States", iso: "USA", region: "Foster City, CA", lat: 37.56, lng: -122.27, role: "Software Engineer, Zoox", url: "https://www.linkedin.com/in/joshua-munic-9b6438b1/" },
    { name: "Julien Hoachuck", country: "United States", iso: "USA", region: "Bay Area, CA", lat: 37.48, lng: -122.18, role: "CEO, 789 Labs", url: "https://www.linkedin.com/in/julienhoachuck/" },
    { name: "Drew Liu", country: "United States", iso: "USA", region: "Orange County, CA", lat: 33.64, lng: -117.6, role: "Process Engineer, Applied Medical", url: "https://www.linkedin.com/in/liudrew/" },
    { name: "Randy Lewis", country: "United States", iso: "USA", region: "San Diego, CA", lat: 32.72, lng: -117.16, role: "Founder, DragonSkin", url: "https://www.linkedin.com/in/randylewis77/" },
    { name: "Jhonnatan Ascate Silva", country: "United States", iso: "USA", region: "Sunnyvale, CA", lat: 37.39, lng: -122.03, role: "Technical Program Manager, Amazon Lab126", url: "https://www.linkedin.com/in/jhonnatan-ascate-silva-69394210b/" }
  ];

  var numericToIso = {
    840: "USA",
    218: "ECU",
    156: "CHN",
    76: "BRA",
    276: "DEU",
    826: "GBR"
  };

  var byIso = {};
  ALUMNI.forEach(function (person, index) {
    person.id = "alum-" + index;
    if (!byIso[person.iso]) {
      byIso[person.iso] = {
        iso: person.iso,
        country: person.country,
        people: []
      };
    }
    byIso[person.iso].people.push(person);
  });

  // Spread people who share the same coordinates so pins do not stack perfectly.
  Object.keys(byIso).forEach(function (iso) {
    var groups = {};
    byIso[iso].people.forEach(function (p) {
      var key = p.lat.toFixed(3) + "," + p.lng.toFixed(3);
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      if (group.length < 2) return;
      group.forEach(function (p, i) {
        var angle = (Math.PI * 2 * i) / group.length;
        var radius = 0.12 + 0.04 * Math.floor(i / 6);
        p.plotLat = p.lat + Math.cos(angle) * radius;
        p.plotLng = p.lng + Math.sin(angle) * radius;
      });
    });
  });

  var counts = Object.keys(byIso).map(function (iso) {
    return byIso[iso].people.length;
  });
  var maxCount = Math.max.apply(null, counts);

  var width = mount.clientWidth || 640;
  var height = Math.max(320, Math.round(width * 0.55));

  var svg = d3
    .select(mount)
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("role", "img")
    .attr("aria-label", "Interactive map of alumni locations");

  var g = svg.append("g");
  var countriesLayer = g.append("g").attr("class", "countries-layer");
  var statesLayer = g.append("g").attr("class", "states-layer");
  var pointsLayer = g.append("g").attr("class", "points-layer");

  var projection = d3
    .geoNaturalEarth1()
    .fitSize([width - 8, height - 8], { type: "Sphere" });
  var path = d3.geoPath(projection);

  var worldProjection = {
    scale: projection.scale(),
    translate: projection.translate().slice()
  };

  var color = d3
    .scaleSequential()
    .domain([0, maxCount])
    .interpolator(function (t) {
      return d3.interpolateRgb("#d7dee8", "#022851")(Math.pow(t, 0.65));
    });

  var activeIso = null;
  var activePersonId = null;
  var countryFeatures = [];
  var countryByIso = {};
  var usStates = null;
  var tooltip = d3
    .select(mount)
    .append("div")
    .attr("class", "alumni-map-tooltip")
    .style("opacity", 0);

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setProjection(next, duration) {
    var from = {
      scale: projection.scale(),
      translate: projection.translate().slice()
    };
    var interpScale = d3.interpolateNumber(from.scale, next.scale);
    var interpTx = d3.interpolateNumber(from.translate[0], next.translate[0]);
    var interpTy = d3.interpolateNumber(from.translate[1], next.translate[1]);

    return svg
      .transition()
      .duration(duration || 750)
      .ease(d3.easeCubicInOut)
      .tween("zoom", function () {
        return function (t) {
          projection.scale(interpScale(t)).translate([interpTx(t), interpTy(t)]);
          countriesLayer.selectAll("path.country").attr("d", path);
          statesLayer.selectAll("path.state").attr("d", path);
          redrawPoints(false);
        };
      });
  }

  function fitToFeature(feature, pad) {
    var p = pad || 28;
    var probe = d3.geoNaturalEarth1().fitExtent(
      [
        [p, p],
        [width - p, height - p]
      ],
      feature
    );
    return {
      scale: probe.scale(),
      translate: probe.translate().slice()
    };
  }

  function redrawPoints(animate) {
    var people = activeIso && byIso[activeIso] ? byIso[activeIso].people : [];
    var sel = pointsLayer.selectAll("g.alum-point").data(people, function (d) {
      return d.id;
    });

    sel.exit().remove();

    var enter = sel
      .enter()
      .append("g")
      .attr("class", "alum-point")
      .attr("data-id", function (d) {
        return d.id;
      })
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html("<strong>" + esc(d.name) + "</strong><br>" + esc(d.region));
        positionTooltip(event);
      })
      .on("mousemove", positionTooltip)
      .on("mouseleave", function () {
        tooltip.style("opacity", 0);
      })
      .on("click", function (event, d) {
        event.stopPropagation();
        selectPerson(d.id, true);
      });

    enter.append("circle").attr("class", "alum-point-halo").attr("r", 9);
    enter.append("circle").attr("class", "alum-point-dot").attr("r", 4.5);

    var merged = enter.merge(sel);
    merged.classed("is-active", function (d) {
      return d.id === activePersonId;
    });

    merged.each(function (d) {
      var xy = projection([d.plotLng != null ? d.plotLng : d.lng, d.plotLat != null ? d.plotLat : d.lat]);
      if (!xy) return;
      if (animate) {
        d3.select(this)
          .transition()
          .duration(450)
          .attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");
      } else {
        d3.select(this).attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");
      }
    });
  }

  function positionTooltip(event) {
    var bounds = mount.getBoundingClientRect();
    var x = event.clientX - bounds.left + 12;
    var y = event.clientY - bounds.top + 12;
    tooltip.style("left", x + "px").style("top", y + "px");
  }

  function clearActiveCountries() {
    countriesLayer
      .selectAll("path.country")
      .classed("is-active", false)
      .attr("stroke-width", 0.4)
      .attr("stroke", "#fff");
  }

  function selectPerson(id, scrollPanel) {
    activePersonId = id;
    redrawPoints(false);
    panel.querySelectorAll(".alumni-map-list li").forEach(function (li) {
      var on = li.getAttribute("data-id") === id;
      li.classList.toggle("is-active", on);
      if (on && scrollPanel) {
        li.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  }

  function showOverview() {
    activeIso = null;
    activePersonId = null;
    statesLayer.selectAll("*").remove();
    pointsLayer.selectAll("*").remove();
    clearActiveCountries();
    countriesLayer
      .selectAll("path.country")
      .attr("opacity", 1)
      .style("pointer-events", null);

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
          esc(entry.country) +
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
      '<div class="alumni-map-scroll">' +
      '<p class="meta alumni-map-note">Click a country to zoom in and see each person by region.</p>' +
      '<div class="alumni-map-chips">' +
      rows +
      "</div></div>";

    panel.querySelectorAll("[data-iso]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        enterCountry(btn.getAttribute("data-iso"));
      });
    });
  }

  function showCountryPanel(iso) {
    var entry = byIso[iso];
    if (!entry) return;

    var people = entry.people
      .slice()
      .sort(function (a, b) {
        return a.region.localeCompare(b.region) || a.name.localeCompare(b.name);
      })
      .map(function (p) {
        return (
          '<li data-id="' +
          p.id +
          '">' +
          '<a href="' +
          esc(p.url) +
          '" target="_blank" rel="noopener">' +
          esc(p.name) +
          "</a>" +
          '<span class="alumni-map-region">' +
          esc(p.region) +
          "</span>" +
          '<span class="alumni-map-role">' +
          esc(p.role) +
          "</span>" +
          "</li>"
        );
      })
      .join("");

    panel.innerHTML =
      '<button type="button" class="alumni-map-back" id="alumni-map-back">← All countries</button>' +
      "<h4>" +
      esc(entry.country) +
      "</h4>" +
      '<p class="alumni-map-count"><strong>' +
      entry.people.length +
      "</strong> alumni · click a pin or name</p>" +
      '<div class="alumni-map-scroll"><ul class="alumni-map-list">' +
      people +
      "</ul></div>";

    document.getElementById("alumni-map-back").addEventListener("click", function () {
      leaveCountry();
    });

    panel.querySelectorAll(".alumni-map-list li").forEach(function (li) {
      li.addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        selectPerson(li.getAttribute("data-id"), false);
      });
      li.querySelector("a").addEventListener("mouseenter", function () {
        selectPerson(li.getAttribute("data-id"), false);
      });
    });
  }

  function enterCountry(iso) {
    var entry = byIso[iso];
    var feature = countryByIso[iso];
    if (!entry || !feature) return;

    activeIso = iso;
    activePersonId = null;
    showCountryPanel(iso);

    clearActiveCountries();
    countriesLayer
      .selectAll("path.country")
      .attr("opacity", function (d) {
        return numericToIso[d.id] === iso ? 1 : 0.18;
      })
      .style("pointer-events", function (d) {
        return numericToIso[d.id] === iso ? "all" : "none";
      });

    countriesLayer
      .selectAll('path.country[data-iso="' + iso + '"]')
      .classed("is-active", true)
      .attr("stroke-width", 1.4)
      .attr("stroke", "#022851");

    var target = fitToFeature(feature, iso === "USA" ? 18 : 36);
    setProjection(target, 800).on("end", function () {
      redrawPoints(true);
    });

    if (iso === "USA") {
      ensureUsStates().then(function () {
        if (activeIso !== "USA" || !usStates) return;
        statesLayer
          .selectAll("path.state")
          .data(usStates)
          .join("path")
          .attr("class", "state")
          .attr("fill", "none")
          .attr("stroke", "rgba(2,40,81,0.28)")
          .attr("stroke-width", 0.6)
          .attr("d", path)
          .attr("pointer-events", "none");
      });
    } else {
      statesLayer.selectAll("*").remove();
    }
  }

  function leaveCountry() {
    activeIso = null;
    activePersonId = null;
    statesLayer.selectAll("*").remove();
    pointsLayer.selectAll("*").remove();
    tooltip.style("opacity", 0);
    setProjection(worldProjection, 750);
    countriesLayer
      .selectAll("path.country")
      .attr("opacity", 1)
      .style("pointer-events", null);
    clearActiveCountries();
    showOverview();
  }

  function ensureUsStates() {
    if (usStates) return Promise.resolve(usStates);
    return d3
      .json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then(function (us) {
        usStates = topojson.feature(us, us.objects.states).features;
        return usStates;
      })
      .catch(function () {
        usStates = [];
        return usStates;
      });
  }

  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(function (world) {
      countryFeatures = topojson.feature(world, world.objects.countries).features;
      countryFeatures.forEach(function (f) {
        var iso = numericToIso[f.id];
        if (iso) countryByIso[iso] = f;
      });

      countriesLayer
        .append("path")
        .datum({ type: "Sphere" })
        .attr("class", "alumni-map-sphere")
        .attr("d", path);

      countriesLayer
        .selectAll("path.country")
        .data(countryFeatures)
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
          if (activeIso) return;
          var iso = numericToIso[d.id];
          if (!iso || !byIso[iso]) return;
          d3.select(this).attr("stroke-width", 1.2).attr("stroke", "#022851");
        })
        .on("mouseleave", function () {
          if (activeIso) return;
          if (!d3.select(this).classed("is-active")) {
            d3.select(this).attr("stroke-width", 0.4).attr("stroke", "#fff");
          }
        })
        .on("click", function (event, d) {
          var iso = numericToIso[d.id];
          if (!iso || !byIso[iso]) return;
          if (activeIso === iso) return;
          enterCountry(iso);
        });

      showOverview();
    })
    .catch(function () {
      panel.innerHTML =
        '<p class="alumni-map-empty">Could not load the world map right now. The alumni list below is still complete.</p>';
    });
})();
