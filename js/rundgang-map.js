/* Mini-Karten-Renderer fuer Rundgang-Karten auf den Kategorie-Seiten.

   Markup:
     <div class="rundgang-map"
          data-rundgang="hist-appear"
          data-kategorie="history"
          aria-hidden="true"></div>

   - data-rundgang: Slug aus js/data/rundgang-stationen.js
   - data-kategorie: history | dentity | grow (steuert Marker-Farbe)

   Karten sind nicht interaktiv (kein Zoom/Drag) — reine Visualisierung.
   Lazy-Load via IntersectionObserver, Tile-Requests starten erst beim Reinscrollen.
*/
(function(){
  if (!window.L || !window.RUNDGANG_STATIONEN) return;

  // Kategorie -> Target-Farbe (passend zu den i.history/i.dentity/i.grow Brand-Farben)
  const KATEGORIE_FARBEN = {
    history: '#D3A54A',
    dentity: '#769CA2',
    grow: '#8E9F6A'
  };

  function buildIcon(color) {
    return window.L.divIcon({
      className: 'rundgang-map__marker',
      html: '<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="8" cy="8" r="6.5" fill="none" stroke="' + color + '" stroke-width="1.5"/>' +
            '<circle cx="8" cy="8" r="2" fill="' + color + '"/>' +
            '</svg>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  }

  function initRundgangMap(container) {
    const key = container.getAttribute('data-rundgang');
    const kategorie = container.getAttribute('data-kategorie') || 'history';
    const stations = window.RUNDGANG_STATIONEN[key];
    if (!stations || !stations.length) return;

    const color = KATEGORIE_FARBEN[kategorie] || KATEGORIE_FARBEN.history;

    const mapDiv = document.createElement('div');
    mapDiv.className = 'rundgang-map__leaflet';
    container.appendChild(mapDiv);

    const map = window.L.map(mapDiv, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      tap: false
    });

    // Carto dark_all mit {r} fuer Retina (schaerfere Labels).
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '',
      subdomains: 'abcd'
    }).addTo(map);

    const bounds = window.L.latLngBounds(stations.map(function(s){ return [s.lat, s.lng]; }));
    map.fitBounds(bounds, { padding: [24, 24] });

    const icon = buildIcon(color);
    stations.forEach(function(s){
      window.L.marker([s.lat, s.lng], { icon: icon, interactive: false, keyboard: false }).addTo(map);
    });

    // invalidateSize in 2 Phasen: direkt + 300ms spaeter (loest 'weisser
    // Fleck'-Bug wenn Container beim Init noch nicht die finale Hoehe hatte).
    function rerender(){ map.invalidateSize(); map.fitBounds(bounds, { padding: [24, 24] }); }
    setTimeout(rerender, 50);
    setTimeout(rerender, 300);

    if ('ResizeObserver' in window) {
      let last = 0;
      new ResizeObserver(function(){
        const now = Date.now();
        if (now - last > 200) { last = now; rerender(); }
      }).observe(container);
    }
  }

  const containers = document.querySelectorAll('.rundgang-map[data-rundgang]');
  if (!containers.length) return;

  // Lazy-Load: erst initialisieren wenn Karte ins Viewport kommt
  if (!('IntersectionObserver' in window)) {
    containers.forEach(initRundgangMap);
    return;
  }
  const obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) {
        initRundgangMap(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '150px' });
  containers.forEach(function(el){ obs.observe(el); });
})();
