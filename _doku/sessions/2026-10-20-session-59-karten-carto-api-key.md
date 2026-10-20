# Session 59 — Karten kaputt: CARTO verlangt API-Key (20.10.2026)

## Problem

Maggy hat auf der Website (u.a. Stadtrundgänge) Karten gesehen, auf denen nur „API KEY REQUIRED" steht.

**Ursache (per `curl` + Kachel-Bild verifiziert):** CARTO Basemaps liefert seit Ende September 2026 ohne `?key=` nur noch Platzhalter-Kacheln mit dem Schriftzug „API KEY REQUIRED / carto.com/basemaps/apikey" (HTTP 200, PNG — also kein Fehler in der Konsole). Betrifft **alle** Leaflet-Karten der Seite, weil alle `basemaps.cartocdn.com` nutzen. Neue Bedingungen: Terms-Version 29.09.2026.

CARTO-Konditionen (Stand 20.10.2026, `dashboard.basemaps.carto.com/v1/plans`):
- Key gratis, ohne Konto, nur per E-Mail anforderbar (kein API) → muss ein Mensch machen
- Kommerziell (= i.appear) gratis bis **1 Mio. Kachel-Abrufe/Monat**; darüber 500 $/Monat
- Neues URL-Schema: `basemaps.cartocdn.com/rastertiles/{stil}/{z}/{x}/{y}.png?key=…`
- Quellenangabe „© OpenStreetMap © CARTO" muss auf **jeder** Karte sichtbar sein

## Betroffene Stellen

| Wo | Karte |
|---|---|
| `stadtrundgaenge.html` + `en/stadtrundgaenge.html` | Hub-Karte (inline Leaflet) |
| `js/rundgang-map.js` | Mini-Karten auf `i-history`, `i-dentity`, `i-grow` (DE + EN) |
| Repo `iappear-embeds`: `strassennamen-dornbirn.html`, `station1_ill_karte_v8.html`, `station1_ill_karte_v10_mobile.html` | Embeds (iframe in App/CMS) |

## Umbau

- **Neu: `js/karten-key.js`** — einzige Stelle für den Key (`window.IAPPEAR_CARTO_KEY`), Helfer `iappearKachelUrl(stil)` + Pflicht-Attribution `IAPPEAR_KARTEN_ATTRIBUTION`.
- Hub-Seiten DE/EN laden `karten-key.js` nach Leaflet und nutzen die Helfer.
- `rundgang-map.js` nutzt die Helfer; **Mini-Karten zeigen jetzt die Quellenangabe** (vorher `attributionControl:false` — laut neuen CARTO-Terms nicht mehr erlaubt). Stil direkt im JS (dunkel, 9px), damit `components.css` keinen Cache-Bust auf ~80 HTMLs braucht.
- Cache-Bust: `rundgang-map.js?v=20261020a`, `karten-key.js?v=20261020a` auf den 6 Kategorie-Seiten.
- Embeds-Repo: pro Datei `var CARTO_KEY = ''` + neues URL-Schema + volle Attribution.

## Stand

- Lokal geprüft (Preview Port 3016): Hub + Mini-Karten laden die neuen Kachel-URLs inkl. Key, Attribution sichtbar, keine Konsolen-Fehler.
- **Key** (Konto `maggy@iappear.app`, von Maggy selbst angefordert, kommerziell/gratis bis 1 Mio.) steht in `js/karten-key.js`. **Referer-Sperre** auf `iappear.at`, `www.iappear.at`, `wuola.github.io` — localhost lässt CARTO nur auf einem eigenen Key zu, darum lokal leere Kacheln (normal).
- Key per `curl` mit Referer geprüft: `dark_all`, `dark_nolabels`, `light_nolabels`, `light_only_labels` liefern echte Kacheln (auch `light_only_labels`, obwohl nicht mehr in CARTOs Stil-Liste); fremder Referer → 403.

## Lehren

- Kachel-Anbieter können „still" kaputtgehen: HTTP 200 + Platzhalter-Bild, keine Konsolen-Fehler. Bei „Karte zeigt komischen Text" → eine Kachel per `curl` holen und **ansehen**.
- Lazy-Load-Mini-Karten (IntersectionObserver) starten im versteckten Claude-Browser-Pane nicht — Pane sichtbar machen, dann testen (Live verhält sich dort genauso, kein Code-Bug).
