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

  var NS = 'http://www.w3.org/2000/svg';
  var touren = data.touren;
  /* stationen / verlinkungen / sIdx werden in applyDataFilter() gesetzt —
     je nach Viewport (Mobile blendet Cluster-enge Stations aus). */
  var stationen, verlinkungen, sIdx;

  /* Auf Mobile zu kleine Cluster-Stations bewusst ausblenden, weil sie
     mit anderen ueberlappen und auf engem Screen nicht lesbar sind.
     Verlinkungen die zu/von diesen Stations fuehren werden auch entfernt. */
  var MOBILE_HIDDEN_STATIONS = ['Musikschule', 'Messehochhaus'];

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

  /* === Geometrie: Landscape fuer Desktop, Portrait (hochkant-Ellipse) fuer Mobile ===
     Die Ringe werden auf Mobile zu einer stehenden Ellipse gestreckt, damit die
     ganze Grafik in einen hochkanten Screen passt und Labels lesbar bleiben. */
  var MQ_PORTRAIT = window.matchMedia('(max-width: 719px)');
  var W, H, CX, CY, RX_ROUTES, RY_ROUTES, RX_STATIONS, RY_STATIONS, LABEL_OFFSET;
  var tourPos, stationPos;

  applyDataFilter();
  applyGeometry();
  layoutAndRender();
  setupHover();
  setupAnimation();

  /* Bei Media-Query-Wechsel (Rotation, Resize) neu rendern */
  if (MQ_PORTRAIT.addEventListener) {
    MQ_PORTRAIT.addEventListener('change', function () {
      applyDataFilter();
      applyGeometry();
      layoutAndRender();
      setupHover();
      /* Ohne Re-Animation direkt sichtbar machen */
      container.classList.add('is-animating');
      container.querySelectorAll('.nw-station, .nw-tour').forEach(function (el) {
        el.classList.add('is-visible');
      });
    });
  }

  /* Filtert Stationen und Verlinkungen je nach Viewport.
     Auf Mobile fallen die Stationen aus MOBILE_HIDDEN_STATIONS raus,
     plus alle Verlinkungen die zu/von diesen Stationen fuehren.
     Dadurch verteilen sich die verbleibenden Stationen automatisch
     lockerer auf dem Stations-Ring (mehr Bogenlaenge pro Station). */
  function applyDataFilter() {
    var hide = MQ_PORTRAIT.matches ? MOBILE_HIDDEN_STATIONS : [];
    var hideSet = {};
    hide.forEach(function (n) { hideSet[n] = true; });

    stationen = data.stationen.filter(function (s) {
      return !hideSet[s.name];
    });
    verlinkungen = (data.verlinkungen || []).filter(function (l) {
      return !hideSet[l.vonStation] && !hideSet[l.nachStation];
    });

    /* Stations-Name → Index Lookup neu aufbauen */
    sIdx = {};
    stationen.forEach(function (s, i) { sIdx[s.name] = i; });
  }

  function applyGeometry() {
    if (MQ_PORTRAIT.matches) {
      /* Portrait: schmale, hohe Ellipse — fuellt Mobile-Screen vertikal.
         viewBox 900x1300 gibt links/rechts ~155 Einheiten Rand-Padding,
         damit lange Labels ("Sprechender Baum" etc.) sauber reinpassen.
         Tour-Ring (RX/RY_ROUTES) bewusst weit nach aussen gesetzt damit
         die Tour-Labels sich klar vom Stations-Cluster in der Mitte
         abheben — Maggy-Wunsch nach mehr Luft (2026-04-30). */
      W = 900; H = 1300;
      CX = W / 2; CY = H / 2;
      RX_ROUTES   = 270; RY_ROUTES   = 510;
      RX_STATIONS = 160; RY_STATIONS = 320;
      LABEL_OFFSET = 38;
    } else {
      /* Landscape: Kreise. Stations-Punkte clustern enger ums Zentrum,
         dafuer ihre Labels weit nach aussen versetzt — gibt jedem Label
         mehr Bogenlaenge im aeusseren Ring und damit Lese-Raum. */
      W = 1100; H = 780;
      CX = W / 2; CY = H / 2;
      RX_ROUTES   = 310; RY_ROUTES   = 310;
      RX_STATIONS = 130; RY_STATIONS = 130;
      LABEL_OFFSET = 48;
    }
  }

  function layoutAndRender() {
    tourPos = layoutTouren();
    stationPos = layoutStationen();
    render();
  }

  /* Split Labels mit Leerzeichen in 2 Zeilen, damit lange Namen wie
     "Sprechender Baum" oder "Innenstadt Erleben" nicht ueber den Rand
     laufen. Zentriert um den urspruenglichen y-Wert (dy symmetrisch). */
  function applyWrappedLabel(textEl, name, x) {
    var idx = name.lastIndexOf(' ');
    /* Nur wrappen wenn es wirklich 2 Teile gibt und beide > 1 Zeichen sind */
    if (idx <= 0 || idx >= name.length - 1) {
      textEl.textContent = name;
      return;
    }
    var l1 = name.substring(0, idx);
    var l2 = name.substring(idx + 1);
    var t1 = document.createElementNS(NS, 'tspan');
    t1.setAttribute('x', x);
    t1.setAttribute('dy', '-0.5em');
    t1.textContent = l1;
    textEl.appendChild(t1);
    var t2 = document.createElementNS(NS, 'tspan');
    t2.setAttribute('x', x);
    t2.setAttribute('dy', '1.1em');
    t2.textContent = l2;
    textEl.appendChild(t2);
  }


  /* ================================================================
     LAYOUT-FUNKTIONEN
     ================================================================ */

  function layoutTouren() {
    var pos = [];

    /* Reihenfolge: history → dentity → grow im Uhrzeigersinn um den Ring */
    var order = [];
    ['history', 'dentity', 'grow'].forEach(function (kat) {
      touren.forEach(function (t, i) {
        if (t.kategorie === kat) order.push(i);
      });
    });

    var N = order.length;
    /* Start bei 12 Uhr (-90°), dann gleichmaessig verteilt im Uhrzeigersinn.
       Positionen auf einer Ellipse (RX/RY), Labels nach aussen versetzt. */
    order.forEach(function (idx, slot) {
      var angle = (-90 + (slot + 0.5) * (360 / N)) * Math.PI / 180;
      var dx = Math.cos(angle), dy = Math.sin(angle);
      var dotX = CX + dx * RX_ROUTES;
      var dotY = CY + dy * RY_ROUTES;
      /* Label: vom Punkt aus in Richtung (dx,dy) weiter nach aussen */
      var labelX = dotX + dx * LABEL_OFFSET;
      var labelY = dotY + dy * LABEL_OFFSET;
      /* Text-Anker je nach Winkel */
      var anchor;
      if (dx > 0.15)       anchor = 'start';
      else if (dx < -0.15) anchor = 'end';
      else                 anchor = 'middle';
      pos[idx] = { x: labelX, y: labelY, dotX: dotX, dotY: dotY, anchor: anchor, angle: angle };
    });

    return pos;
  }

  function layoutStationen() {
    /* Schwerpunkt-Winkel jeder Station bestimmen (Durchschnitt der Winkel ihrer Touren) */
    var info = stationen.map(function (s, i) {
      var sinSum = 0, cosSum = 0;
      s.touren.forEach(function (name) {
        var ti = tIdx[name];
        if (ti === undefined || !tourPos[ti]) return;
        var ang = tourPos[ti].angle;
        sinSum += Math.sin(ang);
        cosSum += Math.cos(ang);
      });
      var avg = Math.atan2(sinSum, cosSum);
      return { idx: i, angle: avg };
    });

    /* Nach Winkel sortieren und gleichmaessig um den inneren Ring verteilen.
       Dadurch bleibt der Ring sauber rund, Linien kreuzen sich minimal. */
    info.sort(function (a, b) { return a.angle - b.angle; });

    var N = info.length;
    var pos = [];
    info.forEach(function (item, slot) {
      /* Gleichmaessig verteilt — Start auch bei -90° damit es zum Routen-Ring passt */
      var angle = (-90 + (slot + 0.5) * (360 / N)) * Math.PI / 180;
      pos[item.idx] = {
        x: CX + Math.cos(angle) * RX_STATIONS,
        y: CY + Math.sin(angle) * RY_STATIONS,
        angle: angle
      };
    });

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

    /* --- 0) Verlinkungen (gestrichelt, dezent) --------------------------
       Textuelle Verweise im Stationstext: "siehe Rundgang X" oder
       "siehe Station Y". Werden als gestrichelte Linien gerendert,
       hinter den durchgezogenen Tour-Stations-Linien. */
    var linksG = document.createElementNS(NS, 'g');
    linksG.setAttribute('class', 'nw-verlinkungen');
    verlinkungen.forEach(function (link, idx) {
      /* Quelle bestimmen: vonStation ODER vonTour */
      var fromX, fromY, fromKategorie = null;
      if (link.vonStation) {
        var fromIdx = sIdx[link.vonStation];
        if (fromIdx === undefined) return;
        var fp = stationPos[fromIdx];
        if (!fp) return;
        fromX = fp.x; fromY = fp.y;
      } else if (link.vonTour) {
        var fromTi = tIdx[link.vonTour];
        if (fromTi === undefined) return;
        var fromTp = tourPos[fromTi];
        if (!fromTp) return;
        fromX = fromTp.dotX; fromY = fromTp.dotY;
        fromKategorie = touren[fromTi].kategorie;
      } else {
        return;
      }

      /* Ziel bestimmen: nachStation ODER nachTour */
      var toX, toY, toKategorie = null;
      if (link.nachStation) {
        var toSi = sIdx[link.nachStation];
        if (toSi === undefined) return;
        var tp_s = stationPos[toSi];
        if (!tp_s) return;
        toX = tp_s.x; toY = tp_s.y;
      } else if (link.nachTour) {
        var tt = tIdx[link.nachTour];
        if (tt === undefined) return;
        var tp_t = tourPos[tt];
        if (!tp_t) return;
        toX = tp_t.dotX; toY = tp_t.dotY;
        toKategorie = touren[tt].kategorie;
      } else {
        return;
      }

      /* Farbe: Tour-Farbe wenn eine Seite eine Tour ist, sonst neutral weiss */
      var kategorie = toKategorie || fromKategorie;

      var path = document.createElementNS(NS, 'line');
      path.setAttribute('x1', fromX);
      path.setAttribute('y1', fromY);
      path.setAttribute('x2', toX);
      path.setAttribute('y2', toY);
      path.setAttribute('class', 'nw-verlinkung' + (kategorie ? ' is-tour-link' : ' is-station-link'));
      if (link.vonStation)  path.dataset.vonStation = link.vonStation;
      if (link.vonTour)     path.dataset.vonTour = link.vonTour;
      if (link.nachStation) path.dataset.nachStation = link.nachStation;
      if (link.nachTour)    path.dataset.nachTour = link.nachTour;
      if (kategorie) path.style.stroke = FARBEN[kategorie];
      path.style.animationDelay = (idx * 0.08) + 's';
      linksG.appendChild(path);
    });
    svg.appendChild(linksG);

    /* --- 1) Verbindungslinien --- */
    var linesG = document.createElementNS(NS, 'g');
    linesG.setAttribute('class', 'nw-lines');
    var lineIdx = 0;

    stationen.forEach(function (station, si) {
      var sp = stationPos[si];
      station.touren.forEach(function (tourName) {
        var ti = tIdx[tourName];
        if (ti === undefined) return;
        var tp = tourPos[ti];
        var fromX = tp.dotX;
        var fromY = tp.dotY || tp.y;

        /* Gerade Linie zwischen Routen-Punkt und Stations-Punkt */
        var line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', fromX);
        line.setAttribute('y1', fromY);
        line.setAttribute('x2', sp.x);
        line.setAttribute('y2', sp.y);
        line.setAttribute('class', 'nw-line');
        line.dataset.tour = tourName;
        line.dataset.station = station.name;
        line.style.stroke = FARBEN[touren[ti].kategorie];
        line.style.animationDelay = (lineIdx * 0.06) + 's';
        linesG.appendChild(line);
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

      /* Stations-Name — radial nach AUSSEN versetzt. Optional kann
         pro Station ein `labelOffsetExtra` (in der Daten-Datei) gesetzt
         werden, um einzelne Labels weiter vom Punkt wegzurücken,
         falls sie sonst mit Nachbarn kollidieren. */
      var dxL = sp.x - CX, dyL = sp.y - CY;
      var dL = Math.sqrt(dxL * dxL + dyL * dyL) || 1;
      var extra = (station.labelOffsetExtra | 0);
      var labelOffset = r + 30 + extra;
      var labelX = sp.x + (dxL / dL) * labelOffset;
      var labelY = sp.y + (dyL / dL) * labelOffset;
      /* Text-Anker je nach Aussenseiten-Richtung (Label "haengt" am Anker) */
      var labelAnchor;
      if ((dxL / dL) > 0.25)       labelAnchor = 'start';
      else if ((dxL / dL) < -0.25) labelAnchor = 'end';
      else                         labelAnchor = 'middle';

      var text = document.createElementNS(NS, 'text');
      text.setAttribute('x', labelX);
      text.setAttribute('y', labelY);
      text.setAttribute('class', 'nw-station-name' + (shared ? ' is-shared' : ''));
      text.style.textAnchor = labelAnchor;
      text.style.dominantBaseline = 'middle';
      applyWrappedLabel(text, station.name, labelX);
      g.appendChild(text);

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
      dot.setAttribute('r', 8);
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
      applyWrappedLabel(text, tour.name, tp.x);
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

      /* Stationen dieser Tour sammeln */
      var stationsInTour = {};
      stationen.forEach(function (s) {
        if (s.touren.indexOf(name) < 0) return;
        stationsInTour[s.name] = true;
        var el = svg.querySelector('.nw-station[data-station="' + CSS.escape(s.name) + '"]');
        if (el) el.classList.add('is-active');

        /* Verwandte Touren an geteilten Stationen dezent hervorheben */
        if (s.touren.length > 1) {
          s.touren.forEach(function (related) {
            if (related !== name) {
              var rel = svg.querySelector('.nw-tour[data-tour="' + CSS.escape(related) + '"]');
              if (rel) rel.classList.add('is-related');
              svg.querySelectorAll('.nw-line[data-tour="' + CSS.escape(related) + '"][data-station="' + CSS.escape(s.name) + '"]').forEach(function (l) {
                l.classList.add('is-related');
              });
            }
          });
        }
      });

      /* Gestrichelte Verlinkungen aktivieren wenn:
         - die Tour Quelle (vonTour) oder Ziel (nachTour) ist
         - die Quell- oder Ziel-Station zu dieser Tour gehoert */
      svg.querySelectorAll('.nw-verlinkung').forEach(function (l) {
        var rel = false;
        if (l.dataset.vonTour === name)  rel = true;
        if (l.dataset.nachTour === name) rel = true;
        if (l.dataset.vonStation && stationsInTour[l.dataset.vonStation])   rel = true;
        if (l.dataset.nachStation && stationsInTour[l.dataset.nachStation]) rel = true;
        if (rel) l.classList.add('is-active');
      });
    }

    function activateStation(g) {
      var name = g.dataset.station;
      container.classList.add('has-hover');
      g.classList.add('is-active');

      /* Alle Linien zu dieser Station hervorheben */
      svg.querySelectorAll('.nw-line[data-station="' + CSS.escape(name) + '"]').forEach(function (l) {
        l.classList.add('is-active');
        var tourEl = svg.querySelector('.nw-tour[data-tour="' + CSS.escape(l.dataset.tour) + '"]');
        if (tourEl) tourEl.classList.add('is-active');
      });

      /* Gestrichelte Verlinkungen aktivieren wenn diese Station Quelle oder Ziel ist */
      svg.querySelectorAll('.nw-verlinkung').forEach(function (l) {
        if (l.dataset.vonStation === name || l.dataset.nachStation === name) {
          l.classList.add('is-active');
          /* Verbundene Tour ggf. mit-aktivieren */
          if (l.dataset.vonTour) {
            var fEl = svg.querySelector('.nw-tour[data-tour="' + CSS.escape(l.dataset.vonTour) + '"]');
            if (fEl) fEl.classList.add('is-related');
          }
          if (l.dataset.nachTour) {
            var tEl = svg.querySelector('.nw-tour[data-tour="' + CSS.escape(l.dataset.nachTour) + '"]');
            if (tEl) tEl.classList.add('is-related');
          }
        }
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
