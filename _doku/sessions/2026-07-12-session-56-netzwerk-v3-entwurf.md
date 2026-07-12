# Session 56 — Netzwerk-Visualisierung: Redesign v3 „Konstellation" (integriert + gepusht)

**Datum:** 2026-07-12
**Status: ✅ INTEGRIERT + GEPUSHT** (gleiche Session, nach Maggys lokalem Review + explizitem OK).
Ablauf: erst Entwurf als lokale Vorschau, Maggy hat über `localhost:3016` geschaut,
dann Freigabe „committen/pushen" — Integration nach dem Rezept unten.

## Anlass

Maggy findet die Netzwerk-Animation auf der Landingpage (Sektion 3, „Netzwerk Dornbirn")
„semi-professionell / selbst gebastelt". Auftrag: edler machen, lokale Vorschau.

## Diagnose (warum v2 unruhig wirkt)

1. **Gerade Linien statt Kurven** — der Kopf-Kommentar in `network.js` verspricht
   „Bezier-Kurven", gerendert werden aber `<line>`-Elemente. Die geraden Sehnen
   kreuzen die Label-Zone zwischen den Ringen → „Fadenkunst-Gewirr".
2. **Labels ohne Kontur** liegen direkt auf dem Linienfeld → schlecht lesbar.
3. **Keine Tiefe:** alle Elemente gleichgewichtig, Grafik „schwebt" ohne Bühne.

## Entwurf v3 — neue Dateien (beide untracked, bewusst nicht committet)

- `js/network-v3-preview.js` — Kopie von `network.js` mit markierten `V3:`-Blöcken:
  - **V3-KURVEN:** Kanten als Quadratic-Bezier Richtung Zentrum (Tour→Station pull 0.32,
    Verweise adaptiv 0.15–0.5 je Länge → Chord-Optik). Label-Zone wird frei.
  - **V3-BUEHNE:** hauchfeine Führungsringe (Stations-/Touren-Ring) + radialer
    Licht-Schimmer (`#nw-stage-grad`) als Hintergrund-Bühne.
  - **V3-HALO:** weicher Farb-Halo hinter Touren-Punkten (`.nw-tour-halo`), sanfter
    Dauer-Glow (`#nw-glow-soft`) auf geteilten Stationen.
  - **V3-PULSE:** SMIL-Lichtpunkte wandern auf den Kanten geteilter Stationen
    (kein rAF/JS pro Frame); bei `prefers-reduced-motion` werden keine erzeugt;
    beim Hover dimmen sie auf 15 %.
  - Interaktion, Daten, Mobile-Ellipse: 1:1 aus v2. Klassennamen unverändert →
    bestehendes CSS in `components.css` greift weiter.
- `_render-netzwerk-v3-preview.html` — Vorschau-Seite (Kopie der Landingpage-Sektion,
  lädt Original-CSS + Zusatz-Style-Block „V3-ZUSATZ-CSS"). Test-Param:
  `?hover=hist.appear` bzw. `?hover=s:Rotes Haus` simuliert Hover nach 5 s
  (für Headless-Screenshots).

## Verifiziert (Headless-Chrome-Screenshots, angeschaut)

Desktop 2×-DPR, Mobile 500 px (Portrait-Ellipse), Hover-Zustand `hist.appear`
(Harfen-Fächer + Dimmen funktioniert). Screenshots im Session-Scratchpad.
SMIL-Pulse unter `--virtual-time-budget` nur als eingefrorene Punkte sichtbar —
echte Bewegung im normalen Browser prüfen (Doppelklick auf die Vorschau-Datei).

## Integration (durchgeführt 12.07.2026, gleiche Session)

1. `js/network.js` = v3-Inhalt (Kopf-Kommentar auf v3, `V3:`-Marker im Code);
   `network.js?v=19` → `?v=20` in `index.html` + `en/index.html` (einzige Nutzer).
2. V3-CSS-Block ans Ende des Netzwerk-Blocks in `components.css`;
   `components.css?v=20260513b` → `?v=20260712a` per Python-Skript in **79 HTMLs**
   (utf-8, `newline=''`, Worktrees/`_tmp` excludiert; Diffs verifiziert minimal).
3. Verifiziert: Preview-Seite im App-Browser-Pane (18 Stationen, 10 Pulse,
   Hover-Harfe), echte `index.html` headless Ende-zu-Ende (iframe-Wrapper mit
   Instant-Scroll — Anker/`scrollIntoView` werden unter Virtual-Time vom
   `scroll-behavior:smooth` verschluckt, Lehre siehe unten). Identität geprüft
   (gh = wuola, git config = wuola). Commit + Push in dieser Session.
4. `_render-netzwerk-v3-preview.html` + `js/network-v3-preview.js` bleiben
   untracked als lokale Referenz liegen (noindex, nicht verlinkt) — können weg.
   `_tmp_v3check.html` (Test-Wrapper) ebenfalls untracked, kann gelöscht werden
   (`rm` steht auf der Rückfrage-Liste, darum liegengelassen).

## Lehren (Headless/Pane-Verifikation animierter Seiten)

- **App-Browser-Pane rendert nach dem Load keine Frames mehr** ohne echte
  User-Interaktion: `scroll-behavior:smooth`-Scrolls laufen nie los (scrollY
  bleibt 0), IntersectionObserver feuern nach programmatischem Scroll nicht,
  `computer`-Screenshots timeouten. Workaround fürs Testen: `scrollTo(...,
  behavior:'instant')` setzt die Position, aber Observer bleiben stumm —
  Reveal-Verhalten dort NICHT beurteilbar (gilt auch für unverändertes v2!).
- **Headless + `--virtual-time-budget`:** `#anchor`-Sprünge und `scrollIntoView`
  werden vom Smooth-Scroll verschluckt. Zuverlässig: Wrapper-HTML, das die Seite
  im same-origin-iframe lädt und `contentWindow.scrollTo({behavior:'instant'})`
  aufruft — dann feuern Reveal + Netzwerk-Observer normal.

## Offene Punkte

- Label-Enge oben („Oberdorfer Turm" / „Schlossguggerhaus") besteht wie in v2,
  ist durch Text-Halos aber gut lesbar. Falls stören: `labelOffsetExtra` in
  `js/data/netzwerk.js` pro Station setzen (Feld existiert schon).
- Ob die wandernden Lichtpunkte (V3-PULSE) bleiben sollen → Geschmacksfrage,
  Maggy entscheidet nach Live-Ansicht im Browser.
