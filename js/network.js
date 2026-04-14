/* iappear.at – network.js (v2)
   ============================================================
   Stations-Netzwerk-Visualisierung "Beispiel Dornbirn".
   Zeigt wie sich Rundgaenge Stationen teilen — geteilte Stationen
   werden automatisch groesser und mit mehrfarbigen Ringen dargestellt.

   Daten kommen aus window.IAPPEAR_NETZWERK (siehe js/data/netzwerk.js).
   Layout: Touren links/rechts/unten (nach Kategorie), Stationen in der Mitte.
   Verbindungslinien als Bezier-Kurven, farbig nach Kategorie.

   Interaktion:
   - Hover/Tap auf Tour → zeigt ihre Stationen + verwandte Touren
   - Hover/Tap auf Station → zeigt ihre Touren
   ============================================================ */

(function () {
  'use strict';

  var container = document.querySelector('[data-network]');
  if (!container) return;

  var data = window.IAPPEAR_NETZWERK;
  if (!data || !data.touren || !data.stationen) return;

  /* === Konstanten === */
  var W = 1000, H = 700;
  var NS = 'http://www.w3.org/2000/svg';
  var touren = data.touren;
  var stationen = data.stationen;

  /* Farben aus CSS-Variablen */
  var cs = getComputedStyle(document.documentElement);
  var FARBEN = {
    history: (cs.getPropertyValue('--c-history') || '#D3A54A').trim(),
    dentity: (cs.getPropertyValue('--c-dentity') || '#769CA2').trim(),
    grow:    (cs.getPropertyValue('--c-grow')    || '#8E9F6A').trim()
  };

  /* Tour-Name → Index Lookup */
  var tIdx = {};
  touren.forEach(function (t, i) { tIdx[t.name] = i; });

  /* === Layout berechnen === */
  var tourPos = layoutTouren();
  var stationPos = layoutStationen();

  /* === Rendern === */
  render();

  /* === Interaktion + Animation === */
  setupHover();
  setupAnimation();


  /* ================================================================
     LAYOUT-FUNKTIONEN
     ================================================================ */

  function layoutTouren() {
    var pos = [];
    var groups = { history: [], dentity: [], grow: [] };
    touren.forEach(function (t, i) { groups[t.kategorie].push(i); });

    /* i.history — linke Spalte */
    var h = groups.history;
    var hSpace = Math.min(120, 380 / Math.max(h.length - 1, 1));
    var hStart = (H * 0.65 - (h.length - 1) * hSpace) / 2 + 40;
    h.forEach(function (i, n) {
      pos[i] = { x: 10, y: hStart + n * hSpace, dotX: 160, anchor: 'start' };
    });

    /* i.dentity — rechte Spalte */
    var d = groups.dentity;
    var dSpace = Math.min(120, 380 / Math.max(d.length - 1, 1));
    var dStart = (H * 0.65 - (d.length - 1) * dSpace) / 2 + 40;
    d.forEach(function (i, n) {
      pos[i] = { x: 990, y: dStart + n * dSpace, dotX: 840, anchor: 'end' };
    });

    /* i.grow — untere Reihe */
    var g = groups.grow;
    var gSpace = Math.min(220, 320 / Math.max(g.length - 1, 1));
    var gStart = W / 2 - ((g.length - 1) * gSpace) / 2;
    g.forEach(function (i, n) {
      pos[i] = { x: gStart + n * gSpace, y: H - 20, dotX: gStart + n * gSpace, dotY: H - 80, anchor: 'middle' };
    });

    return pos;
  }

  function layoutStationen() {
    /* Schritt 1: Schwerpunkt der verbundenen Touren berechnen */
    var pos = stationen.map(function (s) {
      var cx = 0, cy = 0, n = 0;
      s.touren.forEach(function (name) {
        var i = tIdx[name];
        if (i !== undefined && tourPos[i]) {
          cx += tourPos[i].dotX;
          cy += (tourPos[i].dotY || tourPos[i].y);
          n++;
        }
      });
      if (n > 0) { cx /= n; cy /= n; }
      /* Zum Zentrum ziehen, damit Stationen nicht am Rand kleben */
      cx = W / 2 + (cx - W / 2) * 0.45;
      cy = H * 0.42 + (cy - H * 0.42) * 0.45;
      return { x: cx, y: cy };
    });

    /* Schritt 2: Abstossung — Stationen duerfen sich nicht ueberlagern */
    for (var iter = 0; iter < 120; iter++) {
      for (var i = 0; i < pos.length; i++) {
        for (var j = i + 1; j < pos.length; j++) {
          var dx = pos[j].x - pos[i].x;
          var dy = pos[j].y - pos[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var minD = 72;
          if (dist < minD) {
            var push = (minD - dist) * 0.25;
            var nx = dx / dist, ny = dy / dist;
            pos[i].x -= nx * push;
            pos[i].y -= ny * push;
            pos[j].x += nx * push;
            pos[j].y += ny * push;
          }
        }
        /* Innerhalb des sichtbaren Bereichs halten */
        pos[i].x = Math.max(230, Math.min(770, pos[i].x));
        pos[i].y = Math.max(55, Math.min(555, pos[i].y));
      }
    }

    return pos;
  }


  /* ================================================================
     RENDER-FUNKTION
     ================================================================ */

  function render() {
    container.innerHTML = '';
    container.classList.add('network-viz');

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'nw-svg');

    /* --- Defs: Glow-Filter --- */
    var defs = document.createElementNS(NS, 'defs');
    var filter = document.createElementNS(NS, 'filter');
    filter.id = 'nw-glow';
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    filter.innerHTML =
      '<feGaussianBlur stdDeviation="4" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(filter);
    svg.appendChild(defs);

    /* --- 1) Verbindungslinien --- */
    var linesG = document.createElementNS(NS, 'g');
    linesG.setAttribute('class', 'nw-lines');
    var lineIdx = 0;

    stationen.forEach(function (station, si) {
      var sp = stationPos[si];
      station.touren.forEach(function (tourName, li) {
        var ti = tIdx[tourName];
        if (ti === undefined) return;
        var tp = tourPos[ti];
        var fromX = tp.dotX;
        var fromY = tp.dotY || tp.y;
        /* Kurven leicht variieren damit sich Linien nicht ueberlagern */
        var curve = ((li % 2 === 0) ? 1 : -1) * (0.06 + li * 0.025);

        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', bezier(fromX, fromY, sp.x, sp.y, curve));
        path.setAttribute('class', 'nw-line');
        path.dataset.tour = tourName;
        path.dataset.station = station.name;
        path.style.stroke = FARBEN[touren[ti].kategorie];
        path.style.animationDelay = (lineIdx * 0.06) + 's';
        linesG.appendChild(path);
        lineIdx++;
      });
    });
    svg.appendChild(linesG);

    /* --- 2) Stationen (Kreise + Labels) --- */
    var stationsG = document.createElementNS(NS, 'g');
    stationsG.setAttribute('class', 'nw-stations');

    stationen.forEach(function (station, si) {
      var sp = stationPos[si];
      var count = station.touren.length;
      var shared = count > 1;
      var r = shared ? 4 + count * 2.5 : 5;

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'nw-station' + (shared ? ' is-shared' : ''));
      g.dataset.station = station.name;

      /* Farbige Aussenringe fuer geteilte Stationen */
      if (shared) {
        var cats = [];
        station.touren.forEach(function (tn) {
          var t = touren[tIdx[tn]];
          if (t && cats.indexOf(t.kategorie) === -1) cats.push(t.kategorie);
        });

        var ringR = r + 5;
        var circumference = 2 * Math.PI * ringR;

        if (cats.length > 1) {
          /* Mehrfarbig: Ring-Segmente pro Kategorie */
          var segLen = circumference / cats.length;
          cats.forEach(function (kat, ki) {
            var ring = document.createElementNS(NS, 'circle');
            ring.setAttribute('cx', sp.x);
            ring.setAttribute('cy', sp.y);
            ring.setAttribute('r', ringR);
            ring.setAttribute('class', 'nw-ring');
            ring.style.stroke = FARBEN[kat];
            ring.style.strokeDasharray = segLen + ' ' + (circumference - segLen);
            ring.style.strokeDashoffset = '' + (-ki * segLen);
            g.appendChild(ring);
          });
        } else {
          /* Einfarbig */
          var ring = document.createElementNS(NS, 'circle');
          ring.setAttribute('cx', sp.x);
          ring.setAttribute('cy', sp.y);
          ring.setAttribute('r', ringR);
          ring.setAttribute('class', 'nw-ring');
          ring.style.stroke = FARBEN[cats[0]];
          g.appendChild(ring);
        }
      }

      /* Haupt-Kreis */
      var circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('cx', sp.x);
      circle.setAttribute('cy', sp.y);
      circle.setAttribute('r', r);
      circle.setAttribute('class', 'nw-dot');
      g.appendChild(circle);

      /* Stations-Name */
      var text = document.createElementNS(NS, 'text');
      text.setAttribute('x', sp.x);
      text.setAttribute('y', sp.y - r - 8);
      text.setAttribute('class', 'nw-station-name' + (shared ? ' is-shared' : ''));
      text.textContent = station.name;
      g.appendChild(text);

      /* Anzahl Rundgaenge (sichtbar nur bei Hover) */
      if (shared) {
        var countLabel = document.createElementNS(NS, 'text');
        countLabel.setAttribute('x', sp.x);
        countLabel.setAttribute('y', sp.y + r + 16);
        countLabel.setAttribute('class', 'nw-station-count');
        countLabel.textContent = count + ' Rundgaenge';
        g.appendChild(countLabel);
      }

      stationsG.appendChild(g);
    });
    svg.appendChild(stationsG);

    /* --- 3) Tour-Labels --- */
    var toursG = document.createElementNS(NS, 'g');
    toursG.setAttribute('class', 'nw-tours');

    touren.forEach(function (tour, ti) {
      var tp = tourPos[ti];
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'nw-tour' + (tour.status === 'coming-soon' ? ' is-soon' : ''));
      g.dataset.tour = tour.name;

      /* Verbindungs-Punkt (Kreis, von dem die Linien ausgehen) */
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', tp.dotX);
      dot.setAttribute('cy', tp.dotY || tp.y);
      dot.setAttribute('r', 5);
      dot.setAttribute('class', 'nw-tour-dot');
      dot.style.fill = FARBEN[tour.kategorie];
      g.appendChild(dot);

      /* Tour-Name */
      var text = document.createElementNS(NS, 'text');
      text.setAttribute('x', tp.x);
      text.setAttribute('y', tp.y);
      text.setAttribute('text-anchor', tp.anchor);
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('class', 'nw-tour-name');
      text.style.fill = FARBEN[tour.kategorie];
      text.textContent = tour.name;
      g.appendChild(text);

      /* "coming soon" Tag */
      if (tour.status === 'coming-soon') {
        var tag = document.createElementNS(NS, 'text');
        tag.setAttribute('x', tp.x);
        tag.setAttribute('y', (tp.dotY || tp.y) + 18);
        tag.setAttribute('text-anchor', tp.anchor);
        tag.setAttribute('class', 'nw-tour-tag');
        tag.textContent = 'coming soon';
        g.appendChild(tag);
      }

      toursG.appendChild(g);
    });
    svg.appendChild(toursG);

    container.appendChild(svg);
  }


  /* ================================================================
     HILFSFUNKTIONEN
     ================================================================ */

  /* Bezier-Kurve zwischen zwei Punkten. curve steuert die Kruemmung. */
  function bezier(x1, y1, x2, y2, curve) {
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var cx = mx + (-dy) * curve;
    var cy = my + dx * curve;
    return 'M' + x1 + ',' + y1 + ' Q' + cx + ',' + cy + ' ' + x2 + ',' + y2;
  }


  /* ================================================================
     HOVER / TOUCH INTERAKTION
     ================================================================ */

  function setupHover() {
    var svg = container.querySelector('.nw-svg');
    var activeTouchId = null;

    /* --- Tour Hover/Touch --- */
    svg.querySelectorAll('.nw-tour').forEach(function (g) {
      g.style.cursor = 'pointer';
      g.addEventListener('mouseenter', function () { activateTour(g); });
      g.addEventListener('mouseleave', clearHover);
      g.addEventListener('click', function (e) {
        e.stopPropagation();
        if (activeTouchId === g.dataset.tour) {
          clearHover();
          activeTouchId = null;
        } else {
          clearHover();
          activateTour(g);
          activeTouchId = g.dataset.tour;
        }
      });
    });

    /* --- Station Hover/Touch --- */
    svg.querySelectorAll('.nw-station').forEach(function (g) {
      g.style.cursor = 'pointer';
      g.addEventListener('mouseenter', function () { activateStation(g); });
      g.addEventListener('mouseleave', clearHover);
      g.addEventListener('click', function (e) {
        e.stopPropagation();
        if (activeTouchId === 's:' + g.dataset.station) {
          clearHover();
          activeTouchId = null;
        } else {
          clearHover();
          activateStation(g);
          activeTouchId = 's:' + g.dataset.station;
        }
      });
    });

    /* Klick irgendwo anders → Hover aufheben */
    container.addEventListener('click', function () {
      clearHover();
      activeTouchId = null;
    });

    function activateTour(g) {
      var name = g.dataset.tour;
      container.classList.add('has-hover');
      g.classList.add('is-active');

      /* Zugehoerige Linien hervorheben */
      svg.querySelectorAll('.nw-line[data-tour="' + CSS.escape(name) + '"]').forEach(function (l) {
        l.classList.add('is-active');
      });

      /* Zugehoerige Stationen finden und hervorheben */
      stationen.forEach(function (s) {
        if (s.touren.indexOf(name) < 0) return;
        var el = svg.querySelector('.nw-station[data-station="' + CSS.escape(s.name) + '"]');
        if (el) el.classList.add('is-active');

        /* Verwandte Touren an geteilten Stationen dezent hervorheben */
        if (s.touren.length > 1) {
          s.touren.forEach(function (related) {
            if (related !== name) {
              var rel = svg.querySelector('.nw-tour[data-tour="' + CSS.escape(related) + '"]');
              if (rel) rel.classList.add('is-related');
              /* Deren Linien zu dieser Station auch zeigen */
              svg.querySelectorAll('.nw-line[data-tour="' + CSS.escape(related) + '"][data-station="' + CSS.escape(s.name) + '"]').forEach(function (l) {
                l.classList.add('is-related');
              });
            }
          });
        }
      });
    }

    function activateStation(g) {
      var name = g.dataset.station;
      container.classList.add('has-hover');
      g.classList.add('is-active');

      /* Alle Linien zu dieser Station hervorheben */
      svg.querySelectorAll('.nw-line[data-station="' + CSS.escape(name) + '"]').forEach(function (l) {
        l.classList.add('is-active');
        /* Zugehoerige Tour auch hervorheben */
        var tourEl = svg.querySelector('.nw-tour[data-tour="' + CSS.escape(l.dataset.tour) + '"]');
        if (tourEl) tourEl.classList.add('is-active');
      });
    }

    function clearHover() {
      container.classList.remove('has-hover');
      svg.querySelectorAll('.is-active, .is-related').forEach(function (el) {
        el.classList.remove('is-active', 'is-related');
      });
    }
  }


  /* ================================================================
     SCROLL-ANIMATION (IntersectionObserver)
     ================================================================ */

  function setupAnimation() {
    /* Bei reduzierter Bewegung: alles sofort sichtbar */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          container.classList.add('is-animating');
          /* Stationen mit Verzoegerung einblenden */
          var delay = 1200;
          container.querySelectorAll('.nw-station').forEach(function (el, i) {
            setTimeout(function () { el.classList.add('is-visible'); }, delay + i * 80);
          });
          /* Tour-Labels etwas spaeter */
          var tourDelay = delay + stationen.length * 80 + 200;
          container.querySelectorAll('.nw-tour').forEach(function (el, i) {
            setTimeout(function () { el.classList.add('is-visible'); }, tourDelay + i * 100);
          });
          observer.unobserve(container);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(container);
  }

  function showAll() {
    container.classList.add('is-animating');
    container.querySelectorAll('.nw-station, .nw-tour').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

})();
