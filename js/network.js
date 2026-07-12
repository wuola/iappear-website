/* iappear.at – network.js (v3)
   ============================================================
   Stations-Netzwerk-Visualisierung "Beispiel Dornbirn".
   Zeigt wie sich Rundgaenge Stationen teilen — geteilte Stationen
   werden automatisch groesser und mit mehrfarbigen Ringen dargestellt.

   Daten kommen aus window.IAPPEAR_NETZWERK (siehe js/data/netzwerk.js).
   Layout: Touren aussen im Ring (nach Kategorie), Stationen innen.

   Interaktion:
   - Hover/Tap auf Tour → zeigt ihre Stationen + verwandte Touren
   - Hover/Tap auf Station → zeigt ihre Touren

   Neu in v3 (Session 56, 12.07.2026 — Redesign "Konstellation",
   alle Aenderungen mit "V3:" markiert):

   1. V3-KURVEN   — Verbindungen sind echte Bezier-Kurven, die sanft
                    Richtung Zentrum schwingen (Harfen-/Chord-Optik),
                    statt gerader Linien. Dadurch wird die Zone der
                    Stations-Labels frei und das Gewirr verschwindet.
   2. V3-BUEHNE   — dezente Fuehrungsringe (Stations-Ring + Touren-Ring)
                    plus ein hauchfeiner radialer Licht-Schimmer geben
                    der Grafik eine "Buehne" (Sternkarten-/Astrolab-Idee).
   3. V3-HALO     — Touren-Punkte bekommen einen weichen Farb-Halo,
                    geteilte Stationen einen sanften Glow (statisch,
                    schwaecher als der Hover-Glow).
   4. V3-PULSE    — kleine Lichtpunkte wandern langsam entlang der
                    Kanten geteilter Stationen ("Geschichten fliessen
                    durchs Netzwerk"). Respektiert reduzierte Bewegung.

   Interaktion, Daten und Mobile-Layout (Hochkant-Ellipse) sind
   unveraendert aus v2 uebernommen. Zugehoerige V3-Styles stehen
   am Ende des Netzwerk-Blocks in css/components.css.
   ============================================================ */

(function () {
  'use strict';

  var container = document.querySelector('[data-network]');
  if (!container) return;

  var data = window.IAPPEAR_NETZWERK;
  if (!data || !data.touren || !data.stationen) return;

  var NS = 'http://www.w3.org/2000/svg';
  var touren = data.touren;
  var stationen, verlinkungen, sIdx;

  var MOBILE_HIDDEN_STATIONS = ['Musikschule', 'Messehochhaus'];

  var cs = getComputedStyle(document.documentElement);
  var FARBEN = {
    history: (cs.getPropertyValue('--c-history') || '#D3A54A').trim(),
    dentity: (cs.getPropertyValue('--c-dentity') || '#769CA2').trim(),
    grow:    (cs.getPropertyValue('--c-grow')    || '#8E9F6A').trim()
  };

  var tIdx = {};
  touren.forEach(function (t, i) { tIdx[t.name] = i; });

  var MQ_PORTRAIT = window.matchMedia('(max-width: 719px)');
  var W, H, CX, CY, RX_ROUTES, RY_ROUTES, RX_STATIONS, RY_STATIONS, LABEL_OFFSET;
  var tourPos, stationPos;

  /* V3-PULSE: gesammelte Kanten geteilter Stationen (Pfad + Farbe),
     auf denen spaeter Lichtpunkte wandern. Wird in render() befuellt. */
  var pulseKanten = [];
  var pulsesGestartet = false;

  applyDataFilter();
  applyGeometry();
  layoutAndRender();
  setupHover();
  setupAnimation();

  if (MQ_PORTRAIT.addEventListener) {
    MQ_PORTRAIT.addEventListener('change', function () {
      applyDataFilter();
      applyGeometry();
      pulsesGestartet = false;
      layoutAndRender();
      setupHover();
      container.classList.add('is-animating');
      container.querySelectorAll('.nw-station, .nw-tour').forEach(function (el) {
        el.classList.add('is-visible');
      });
      startPulses();
    });
  }

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

    sIdx = {};
    stationen.forEach(function (s, i) { sIdx[s.name] = i; });
  }

  function applyGeometry() {
    if (MQ_PORTRAIT.matches) {
      W = 900; H = 1300;
      CX = W / 2; CY = H / 2;
      RX_ROUTES   = 270; RY_ROUTES   = 510;
      RX_STATIONS = 160; RY_STATIONS = 320;
      LABEL_OFFSET = 38;
    } else {
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

  function applyWrappedLabel(textEl, name, x) {
    var idx = name.lastIndexOf(' ');
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

  /* V3-KURVEN: Bezier-Pfad von A nach B, Kontrollpunkt = Mittelpunkt
     Richtung Zentrum gezogen. "pull" 0..1 steuert wie stark die Kurve
     nach innen schwingt. */
  function curvePath(x1, y1, x2, y2, pull) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    var qx = mx + (CX - mx) * pull;
    var qy = my + (CY - my) * pull;
    return 'M ' + x1 + ' ' + y1 + ' Q ' + qx + ' ' + qy + ' ' + x2 + ' ' + y2;
  }

  /* V3-KURVEN: adaptiver Zug fuer Verweise (Chord-Optik) — kurze
     Verbindungen biegen nur leicht, lange schwingen tiefer ins Zentrum. */
  function adaptivePull(x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    var norm = Math.min(1, len / (RX_STATIONS + RY_STATIONS));
    return 0.15 + 0.35 * norm;
  }


  /* ================================================================
     LAYOUT-FUNKTIONEN (unveraendert aus v2)
     ================================================================ */

  function layoutTouren() {
    var pos = [];
    var order = [];
    ['history', 'dentity', 'grow'].forEach(function (kat) {
      touren.forEach(function (t, i) {
        if (t.kategorie === kat) order.push(i);
      });
    });

    var N = order.length;
    order.forEach(function (idx, slot) {
      var angle = (-90 + (slot + 0.5) * (360 / N)) * Math.PI / 180;
      var dx = Math.cos(angle), dy = Math.sin(angle);
      var dotX = CX + dx * RX_ROUTES;
      var dotY = CY + dy * RY_ROUTES;
      var labelX = dotX + dx * LABEL_OFFSET;
      var labelY = dotY + dy * LABEL_OFFSET;
      var anchor;
      if (dx > 0.15)       anchor = 'start';
      else if (dx < -0.15) anchor = 'end';
      else                 anchor = 'middle';
      pos[idx] = { x: labelX, y: labelY, dotX: dotX, dotY: dotY, anchor: anchor, angle: angle };
    });

    return pos;
  }

  function layoutStationen() {
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

    info.sort(function (a, b) { return a.angle - b.angle; });

    var N = info.length;
    var pos = [];
    info.forEach(function (item, slot) {
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
    pulseKanten = [];

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'nw-svg');

    /* --- Defs: Glow-Filter (Hover, wie v2) + weicher Dauer-Glow +
       radialer Buehnen-Schimmer (V3) --- */
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

    /* V3-HALO: schwacher Dauer-Glow fuer geteilte Stationen */
    var filterSoft = document.createElementNS(NS, 'filter');
    filterSoft.id = 'nw-glow-soft';
    filterSoft.setAttribute('x', '-80%');
    filterSoft.setAttribute('y', '-80%');
    filterSoft.setAttribute('width', '260%');
    filterSoft.setAttribute('height', '260%');
    filterSoft.innerHTML =
      '<feGaussianBlur stdDeviation="2.2" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(filterSoft);

    /* V3-BUEHNE: radialer Schimmer hinter dem Netzwerk */
    var grad = document.createElementNS(NS, 'radialGradient');
    grad.id = 'nw-stage-grad';
    grad.innerHTML =
      '<stop offset="0%"  stop-color="#ffffff" stop-opacity="0.05"/>' +
      '<stop offset="55%" stop-color="#ffffff" stop-opacity="0.018"/>' +
      '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>';
    defs.appendChild(grad);
    svg.appendChild(defs);

    /* --- V3-BUEHNE: Schimmer + Fuehrungsringe (ganz hinten) ------------- */
    var stageG = document.createElementNS(NS, 'g');
    stageG.setAttribute('class', 'nw-stage');

    var glowEl = document.createElementNS(NS, 'ellipse');
    glowEl.setAttribute('cx', CX);
    glowEl.setAttribute('cy', CY);
    glowEl.setAttribute('rx', RX_ROUTES + 60);
    glowEl.setAttribute('ry', RY_ROUTES + 60);
    glowEl.setAttribute('fill', 'url(#nw-stage-grad)');
    stageG.appendChild(glowEl);

    /* Fuehrungsringe: Stations-Ring + Touren-Ring, hauchfein */
    [[RX_STATIONS, RY_STATIONS], [RX_ROUTES, RY_ROUTES]].forEach(function (r) {
      var ring = document.createElementNS(NS, 'ellipse');
      ring.setAttribute('cx', CX);
      ring.setAttribute('cy', CY);
      ring.setAttribute('rx', r[0]);
      ring.setAttribute('ry', r[1]);
      ring.setAttribute('class', 'nw-guide');
      stageG.appendChild(ring);
    });
    svg.appendChild(stageG);

    /* --- 0) Verlinkungen (gestrichelt, dezent — jetzt als Kurven) ------- */
    var linksG = document.createElementNS(NS, 'g');
    linksG.setAttribute('class', 'nw-verlinkungen');
    verlinkungen.forEach(function (link, idx) {
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

      var kategorie = toKategorie || fromKategorie;

      /* V3-KURVEN: statt <line> ein gebogener Pfad (adaptiver Zug) */
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', curvePath(fromX, fromY, toX, toY,
        adaptivePull(fromX, fromY, toX, toY)));
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

    /* --- 1) Verbindungslinien (Tour → Station, jetzt als Kurven) -------- */
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

        /* V3-KURVEN: sanfter Schwung Richtung Zentrum — die Kurve
           weicht der Label-Zone zwischen den Ringen aus. */
        var d = curvePath(fromX, fromY, sp.x, sp.y, 0.32);
        var line = document.createElementNS(NS, 'path');
        line.setAttribute('d', d);
        line.setAttribute('class', 'nw-line');
        line.dataset.tour = tourName;
        line.dataset.station = station.name;
        line.style.stroke = FARBEN[touren[ti].kategorie];
        line.style.animationDelay = (lineIdx * 0.06) + 's';
        linesG.appendChild(line);
        lineIdx++;

        /* V3-PULSE: Kanten geteilter Stationen vormerken */
        if (station.touren.length > 1) {
          pulseKanten.push({ d: d, farbe: FARBEN[touren[ti].kategorie] });
        }
      });
    });
    svg.appendChild(linesG);

    /* --- 2) Stationen (Kreise + Labels, wie v2 + weicher Glow) ---------- */
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

      if (shared) {
        var cats = [];
        station.touren.forEach(function (tn) {
          var t = touren[tIdx[tn]];
          if (t && cats.indexOf(t.kategorie) === -1) cats.push(t.kategorie);
        });

        var ringR = r + 5;
        var circumference = 2 * Math.PI * ringR;

        if (cats.length > 1) {
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
          var ring = document.createElementNS(NS, 'circle');
          ring.setAttribute('cx', sp.x);
          ring.setAttribute('cy', sp.y);
          ring.setAttribute('r', ringR);
          ring.setAttribute('class', 'nw-ring');
          ring.style.stroke = FARBEN[cats[0]];
          g.appendChild(ring);
        }
      }

      var circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('cx', sp.x);
      circle.setAttribute('cy', sp.y);
      circle.setAttribute('r', r);
      circle.setAttribute('class', 'nw-dot');
      /* V3-HALO: geteilte Stationen leuchten dauerhaft ganz sanft */
      if (shared) circle.setAttribute('filter', 'url(#nw-glow-soft)');
      g.appendChild(circle);

      var dxL = sp.x - CX, dyL = sp.y - CY;
      var dL = Math.sqrt(dxL * dxL + dyL * dyL) || 1;
      var extra = (station.labelOffsetExtra | 0);
      var labelOffset = r + 30 + extra;
      var labelX = sp.x + (dxL / dL) * labelOffset;
      var labelY = sp.y + (dyL / dL) * labelOffset;
      var labelAnchor;
      if ((dxL / dL) > 0.08)       labelAnchor = 'start';
      else if ((dxL / dL) < -0.08) labelAnchor = 'end';
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

    /* --- 3) Tour-Labels (wie v2 + Farb-Halo hinter dem Punkt) ----------- */
    var toursG = document.createElementNS(NS, 'g');
    toursG.setAttribute('class', 'nw-tours');

    touren.forEach(function (tour, ti) {
      var tp = tourPos[ti];
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'nw-tour' + (tour.status === 'coming-soon' ? ' is-soon' : ''));
      g.dataset.tour = tour.name;

      /* V3-HALO: weicher farbiger Schein hinter dem Touren-Punkt */
      var halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', tp.dotX);
      halo.setAttribute('cy', tp.dotY || tp.y);
      halo.setAttribute('r', 20);
      halo.setAttribute('class', 'nw-tour-halo');
      halo.style.fill = FARBEN[tour.kategorie];
      g.appendChild(halo);

      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', tp.dotX);
      dot.setAttribute('cy', tp.dotY || tp.y);
      dot.setAttribute('r', 8);
      dot.setAttribute('class', 'nw-tour-dot');
      dot.style.fill = FARBEN[tour.kategorie];
      g.appendChild(dot);

      var text = document.createElementNS(NS, 'text');
      text.setAttribute('x', tp.x);
      text.setAttribute('y', tp.y);
      text.setAttribute('text-anchor', tp.anchor);
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('class', 'nw-tour-name');
      text.style.fill = FARBEN[tour.kategorie];
      applyWrappedLabel(text, tour.name, tp.x);
      g.appendChild(text);

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
     V3-PULSE: wandernde Lichtpunkte auf Kanten geteilter Stationen.
     SMIL-Animation (kein JS pro Frame). Bei "Bewegung reduzieren"
     werden gar keine Pulse erzeugt.
     ================================================================ */

  function startPulses() {
    if (pulsesGestartet) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var svg = container.querySelector('.nw-svg');
    if (!svg) return;
    pulsesGestartet = true;

    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'nw-pulses');

    pulseKanten.forEach(function (kante, i) {
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', 2.4);
      dot.setAttribute('class', 'nw-pulse');
      dot.setAttribute('fill', kante.farbe);

      var dauer = (5.5 + (i % 4) * 0.9).toFixed(1) + 's';
      var start = (i * 1.3).toFixed(1) + 's';

      /* Bewegung entlang der Kurve */
      var motion = document.createElementNS(NS, 'animateMotion');
      motion.setAttribute('dur', dauer);
      motion.setAttribute('begin', start);
      motion.setAttribute('repeatCount', 'indefinite');
      motion.setAttribute('path', kante.d);
      dot.appendChild(motion);

      /* Ein-/Ausblenden an den Enden, damit nichts "aufpoppt" */
      var fade = document.createElementNS(NS, 'animate');
      fade.setAttribute('attributeName', 'opacity');
      fade.setAttribute('values', '0;.75;.75;0');
      fade.setAttribute('keyTimes', '0;.15;.85;1');
      fade.setAttribute('dur', dauer);
      fade.setAttribute('begin', start);
      fade.setAttribute('repeatCount', 'indefinite');
      dot.setAttribute('opacity', '0');
      dot.appendChild(fade);

      g.appendChild(dot);
    });

    /* Pulse liegen ueber den Linien, aber unter Stationen/Touren */
    var stationsG = svg.querySelector('.nw-stations');
    svg.insertBefore(g, stationsG);
  }


  /* ================================================================
     HOVER / TOUCH INTERAKTION (unveraendert aus v2)
     ================================================================ */

  function setupHover() {
    var svg = container.querySelector('.nw-svg');
    var activeTouchId = null;

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

    container.addEventListener('click', function () {
      clearHover();
      activeTouchId = null;
    });

    function activateTour(g) {
      var name = g.dataset.tour;
      container.classList.add('has-hover');
      g.classList.add('is-active');

      svg.querySelectorAll('.nw-line[data-tour="' + CSS.escape(name) + '"]').forEach(function (l) {
        l.classList.add('is-active');
      });

      var stationsInTour = {};
      stationen.forEach(function (s) {
        if (s.touren.indexOf(name) < 0) return;
        stationsInTour[s.name] = true;
        var el = svg.querySelector('.nw-station[data-station="' + CSS.escape(s.name) + '"]');
        if (el) el.classList.add('is-active');

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

      svg.querySelectorAll('.nw-line[data-station="' + CSS.escape(name) + '"]').forEach(function (l) {
        l.classList.add('is-active');
        var tourEl = svg.querySelector('.nw-tour[data-tour="' + CSS.escape(l.dataset.tour) + '"]');
        if (tourEl) tourEl.classList.add('is-active');
      });

      svg.querySelectorAll('.nw-verlinkung').forEach(function (l) {
        if (l.dataset.vonStation === name || l.dataset.nachStation === name) {
          l.classList.add('is-active');
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
     SCROLL-ANIMATION (IntersectionObserver, wie v2 + Pulse-Start)
     ================================================================ */

  function setupAnimation() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          container.classList.add('is-animating');
          var delay = 1200;
          container.querySelectorAll('.nw-station').forEach(function (el, i) {
            setTimeout(function () { el.classList.add('is-visible'); }, delay + i * 80);
          });
          var tourDelay = delay + stationen.length * 80 + 200;
          container.querySelectorAll('.nw-tour').forEach(function (el, i) {
            setTimeout(function () { el.classList.add('is-visible'); }, tourDelay + i * 100);
          });
          /* V3-PULSE: Lichtpunkte starten, sobald das Netz steht */
          setTimeout(startPulses, tourDelay + touren.length * 100 + 400);
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
    /* Bei reduzierter Bewegung KEINE Pulse — bewusst. */
  }

})();
