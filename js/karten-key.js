/* Zentrale Einstellung fuer die Kartenkacheln (CARTO Basemaps).

   Seit Ende September 2026 liefert CARTO Kacheln nur noch mit API-Key aus —
   ohne Key erscheint auf jeder Kachel der Schriftzug "API KEY REQUIRED".
   Key gratis anfordern: https://carto.com/basemaps/apikey/
   (i.appear = kommerziell, gratis bis 1 Mio. Kachel-Abrufe pro Monat)

   Key gehoert zum CARTO-Konto maggy@iappear.app (seit 20.10.2026), Verwaltung:
   https://dashboard.basemaps.carto.com (Login per Mail-Link, kein Passwort).
   Der Key funktioniert NUR auf iappear.at, www.iappear.at und wuola.github.io
   (Referer-Sperre) — auf localhost bleiben die Kacheln darum leer, das ist normal.

   >>> Bei neuem Key HIER eintragen (zwischen die Anfuehrungszeichen): <<<
*/
window.IAPPEAR_CARTO_KEY = 'cb1_4pk0_1_2375bf984f9f4cd2e81a142c';

/* Baut die Kachel-URL fuer Leaflet. Stil z.B. 'dark_all'.
   {r} = schaerfere Kacheln auf Retina-Displays (wird von Leaflet ersetzt). */
window.iappearKachelUrl = function (stil) {
  return 'https://{s}.basemaps.cartocdn.com/rastertiles/' + stil +
         '/{z}/{x}/{y}{r}.png?key=' + encodeURIComponent(window.IAPPEAR_CARTO_KEY);
};

/* Pflicht-Hinweis laut CARTO-Bedingungen — muss auf jeder Karte sichtbar sein. */
window.IAPPEAR_KARTEN_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
