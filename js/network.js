/* iappear.at – network.js
   Netzwerk-Visualisierung der Rundgaenge.
   Liest aus window.IAPPEAR_RUNDGAENGE (falls vorhanden), sonst Fallback-Liste.
   Positioniert Nodes auf einem Kreis, verbindet sie mit animierten Linien,
   faerbt sie nach Kategorie ein und laesst sie sanft schweben.
   Respektiert prefers-reduced-motion. */

(function () {
  const viz = document.querySelector('[data-network]');
  if (!viz) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Farben aus CSS-Variablen
  const css = getComputedStyle(document.documentElement);
  const C_HISTORY = (css.getPropertyValue('--c-history') || '#D3A54A').trim();
  const C_DENTITY = (css.getPropertyValue('--c-dentity') || '#769CA2').trim();
  const C_GROW    = (css.getPropertyValue('--c-grow')    || '#8E9F6A').trim();

  // Rundgaenge aus Daten-Datei sammeln (nur Dornbirn fuer die Viz – "Beispiel Dornbirn")
  function collectNodes() {
    const data = window.IAPPEAR_RUNDGAENGE;
    const list = [];
    if (data) {
      const pushRegion = (kat, farbe) => {
        const cat = data[kat];
        if (!cat) return;
        cat.regionen.forEach((region) => {
          if (region.name !== 'Dornbirn') return;
          region.rundgaenge.forEach((r) => {
            if (/platzhalter/i.test(r.titel)) return;
            list.push({ titel: r.titel, farbe });
          });
        });
      };
      pushRegion('history', C_HISTORY);
      pushRegion('dentity', C_DENTITY);
      pushRegion('grow',    C_GROW);
    }
    // Fallback falls Daten-Datei nicht geladen oder leer
    if (list.length === 0) {
      return [
        { titel: 'Oberdorf Entdecken',     farbe: C_DENTITY },
        { titel: 'Stadtspuren',            farbe: C_HISTORY },
        { titel: 'hist.appear',            farbe: C_HISTORY },
        { titel: '125 Jahre 125 Bilder',   farbe: C_HISTORY },
        { titel: 'Frauenspuren',           farbe: C_HISTORY },
        { titel: 'Innenstadt Erleben',     farbe: C_DENTITY },
        { titel: 'Buntes Dornbirn',        farbe: C_DENTITY },
      ];
    }
    return list;
  }

  const nodes = collectNodes();
  const svgNS = 'http://www.w3.org/2000/svg';

  function render() {
    viz.innerHTML = '';

    const W = viz.clientWidth || 400;
    const H = viz.clientHeight || 400;
    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) * 0.36;

    // SVG als Basis (Linien)
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.pointerEvents = 'none';

    // Punkte gleichmaessig auf Kreis
    const points = nodes.map((_, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    });

    // Verbindungslinien – jeder mit jedem (vollstaendig verbunden, gibt Netz-Look)
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', points[i].x);
        line.setAttribute('y1', points[i].y);
        line.setAttribute('x2', points[j].x);
        line.setAttribute('y2', points[j].y);
        line.setAttribute('stroke', 'rgba(255,255,255,0.12)');
        line.setAttribute('stroke-width', '1');
        line.classList.add('network-viz__line');
        if (!reduceMotion) {
          // Zarte Pulse-Animation per CSS-Variablen-Delay
          line.style.animationDelay = ((i + j) * 0.15) + 's';
        }
        svg.appendChild(line);
      }
    }
    viz.appendChild(svg);

    // Nodes als DIV oben drauf
    nodes.forEach((n, i) => {
      const node = document.createElement('div');
      node.className = 'network-viz__node';
      node.textContent = n.titel;
      node.style.left = (points[i].x - 46) + 'px';
      node.style.top  = (points[i].y - 46) + 'px';
      node.style.borderColor = n.farbe;
      node.style.color = n.farbe;
      if (!reduceMotion) {
        node.style.animationDelay = (i * 0.35) + 's';
        node.classList.add('is-floating');
      }
      viz.appendChild(node);
    });
  }

  render();

  // Neu zeichnen bei Resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 200);
  });
})();
