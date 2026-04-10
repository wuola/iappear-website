/* iappear.at – network.js
   Netzwerk-Visualisierung (Grob-Platzhalter).
   Positioniert Rundgang-Nodes zufaellig in einem Kreis und zeichnet
   einfache Verbindungslinien als SVG. Feinschliff in Session 2. */

(function () {
  const viz = document.querySelector('[data-network]');
  if (!viz) return;

  const rundgaenge = [
    'Oberdorf Entdecken',
    'Stadtspuren',
    'hist.appear',
    '125 Jahre 125 Bilder',
    'Frauenspuren',
    'Innenstadt Erleben',
    'Buntes Dornbirn'
  ];

  const rect = viz.getBoundingClientRect();
  const W = viz.clientWidth || 400;
  const H = viz.clientHeight || 400;
  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.35;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.inset = '0';

  const points = rundgaenge.map((_, i) => {
    const angle = (i / rundgaenge.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  // Verbindungslinien
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if ((i + j) % 3 !== 0) continue; // nicht alle verbinden
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', points[i].x);
      line.setAttribute('y1', points[i].y);
      line.setAttribute('x2', points[j].x);
      line.setAttribute('y2', points[j].y);
      line.setAttribute('stroke', 'rgba(255,255,255,0.2)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }
  }
  viz.appendChild(svg);

  // Nodes
  rundgaenge.forEach((name, i) => {
    const node = document.createElement('div');
    node.className = 'network-viz__node';
    node.textContent = name;
    node.style.left = (points[i].x - 42) + 'px';
    node.style.top  = (points[i].y - 42) + 'px';
    viz.appendChild(node);
  });
})();
