/* iappear.at – network.js
   ============================================================
   Netzwerk-Visualisierung "Beispiel Dornbirn" auf der Startseite.
   Das Layout (Box-Positionen + Verbindungslinien) ist direkt aus
   dem Original-Readymag-Widget uebernommen — siehe
   _doku/recon/widgets/network-container-afa4fcac0b.html
   ------------------------------------------------------------
   Die 7 Knoten-Inhalte (Titel, Farbe, optional Bild) werden aus
   der zentralen Daten-Datei window.IAPPEAR_NETWORK gelesen
   (siehe js/data/rundgaenge.js). Falls die Daten fehlen, gibt es
   eine Fallback-Liste hier unten.
   ============================================================ */

(function () {
  const viz = document.querySelector('[data-network]');
  if (!viz) return;

  // Fixe Positionen aus dem Original-Widget (SVG-viewBox 1000x900)
  // Box-Index 0..6, mit Groesse und Position als Prozentwerte
  const POSITIONS = [
    { x: 90,  y: 90,  w: 120, h: 120 }, // 0: oben links (gross)
    { x: 410, y: 60,  w: 80,  h: 80  }, // 1: oben mitte (klein)
    { x: 690, y: 240, w: 120, h: 120 }, // 2: rechts oben (gross)
    { x: 90,  y: 490, w: 120, h: 120 }, // 3: mitte links (gross)
    { x: 360, y: 560, w: 80,  h: 80  }, // 4: mitte (klein) — Center "Beispiel Dornbirn"
    { x: 540, y: 740, w: 120, h: 120 }, // 5: unten (gross)
    { x: 860, y: 610, w: 80,  h: 80  }, // 6: rechts unten (klein)
  ];

  // Verbindungslinien aus dem Original (Linien-Endpunkte als Pixel)
  const LINES = [
    [150, 150, 450, 100],
    [150, 150, 750, 300],
    [150, 150, 400, 600],
    [450, 100, 750, 300],
    [750, 300, 150, 550],
    [750, 300, 600, 800],
    [750, 300, 900, 650],
    [400, 600, 600, 800],
    [600, 800, 900, 650],
  ];

  // Farben aus den CSS-Variablen
  const css = getComputedStyle(document.documentElement);
  const C_HISTORY = (css.getPropertyValue('--c-history') || '#D3A54A').trim();
  const C_DENTITY = (css.getPropertyValue('--c-dentity') || '#769CA2').trim();
  const C_GROW    = (css.getPropertyValue('--c-grow')    || '#8E9F6A').trim();

  // Fallback-Knoten falls keine Daten geladen wurden.
  // Index 4 ist das Zentrum "Beispiel Dornbirn".
  // Die Bilder landen in assets/images/rundgaenge/ - wenn eine Datei noch
  // nicht existiert, zeigt die Box einfach den Titel auf schwarzem Grund.
  const IMG = 'assets/images/rundgaenge/';
  const FALLBACK = [
    { titel: 'Stadtspuren',          farbe: C_HISTORY, status: 'live',   bild: IMG + 'stadtspuren.jpg' },
    { titel: 'Oberdorf Entdecken',   farbe: C_DENTITY, status: 'live',   bild: IMG + 'oberdorf.jpg'    },
    { titel: 'hist.appear',          farbe: C_HISTORY, status: 'live',   bild: IMG + 'hist-appear.jpg' },
    { titel: '125 Jahre 125 Bilder', farbe: C_HISTORY, status: 'live',   bild: IMG + '125-jahre.jpg'   },
    { titel: 'Beispiel<br>Dornbirn', farbe: '#fff',    status: 'center'                                 },
    { titel: 'Innenstadt Erleben',   farbe: C_DENTITY, status: 'live',   bild: IMG + 'innenstadt.jpg'  },
    { titel: 'Frauenspuren',         farbe: C_HISTORY, status: 'soon',   bild: IMG + 'frauenspuren.jpg'},
  ];

  const nodes = (Array.isArray(window.IAPPEAR_NETWORK) && window.IAPPEAR_NETWORK.length === 7)
    ? window.IAPPEAR_NETWORK
    : FALLBACK;

  // ----- SVG mit Linien rendern -----
  const svgNS = 'http://www.w3.org/2000/svg';
  viz.innerHTML = '';
  viz.classList.add('network-viz');

  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 1000 900');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('class', 'network-viz__svg');

  LINES.forEach(([x1, y1, x2, y2]) => {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'network-viz__line');
    svg.appendChild(line);
  });

  viz.appendChild(svg);

  // ----- Knoten als HTML-Overlay positioniert -----
  POSITIONS.forEach((p, i) => {
    const n = nodes[i] || { titel: '', farbe: '#fff', status: '' };
    const node = document.createElement('div');
    node.className = 'network-viz__node' + (n.status === 'center' ? ' is-center' : '');
    if (n.status === 'soon') node.classList.add('is-soon');

    // Position als Prozent vom viewBox-Rahmen (1000x900)
    node.style.left   = (p.x / 1000 * 100) + '%';
    node.style.top    = (p.y / 900  * 100) + '%';
    node.style.width  = (p.w / 1000 * 100) + '%';
    node.style.height = (p.h / 900  * 100) + '%';
    node.style.borderColor = n.farbe;

    if (n.bild) {
      // Bild als <img loading="lazy"> einsetzen. Falls die Datei nicht
      // existiert (z.B. Platzhalter), faellt sie einfach aus dem DOM.
      const img = document.createElement('img');
      img.src = n.bild;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.className = 'network-viz__node-bg';
      img.onerror = () => img.remove();
      node.appendChild(img);
      node.classList.add('has-image');
    }

    const label = document.createElement('span');
    label.className = 'network-viz__node-label';
    // Titel darf <br> enthalten (fuer das Zentrum "Beispiel Dornbirn")
    label.innerHTML = (n.titel || '').replace(/[^\w\säöüÄÖÜß<>/.\-]/g, c => c);
    node.appendChild(label);

    if (n.status === 'soon') {
      const tag = document.createElement('small');
      tag.className = 'network-viz__node-tag';
      tag.textContent = 'coming soon';
      node.appendChild(tag);
    }

    viz.appendChild(node);
  });

  // ----- Linien-Animation per IntersectionObserver -----
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          viz.classList.add('is-animating');
          obs.unobserve(viz);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(viz);
  } else {
    viz.classList.add('is-animating');
  }
})();
