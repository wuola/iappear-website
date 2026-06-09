# Session 49 - Vitrine-Kachel "i.grow im OeAD-Netzwerk" (Blog-Crosspost, S/W-Thumbnail-Render)

**Datum:** 2026-06-09
**Account:** wuola (verifiziert: gh aktiv = wuola, git config = wuola)
**Branch:** main

## Was gemacht wurde

Aus dem letzten Blog-Artikel (`blog/aufwachsen-mit-ki.html`, OeAD-Netzwerk, Session-davor-Commit `2f5a33e`)
eine **Vitrine-Grid-Kachel** gebaut - also einen 23. Eintrag in `js/data/vitrine.js`, der im
Pressespiegel-/Auszeichnungs-Grid auftaucht. Die OeAD-Listung ist inhaltlich eine Anerkennung und
passt damit ins Grid.

### Konvention: Vitrine-Kachel darf direkt auf einen Blog-Artikel verlinken

Bisher zeigten alle 22 Kacheln auf eigene `vitrine/X.html`-Artikelseiten. Diese neue Kachel zeigt
stattdessen direkt auf den **Blog-Artikel** (`link: "blog/aufwachsen-mit-ki.html"`). Bewusste
Entscheidung: **keine Duplikat-Artikelseite** anlegen (vermeidet doppelten Content), der Blog-Artikel
ist die kanonische Quelle. `build.py` setzt fuer die EN-Version automatisch `../` davor
(`../blog/aufwachsen-mit-ki.html`). Weil es noch **keine EN-Variante** des Artikels gibt, verlinkt die
EN-Kachel ueber die bestehende LANG_CFG-Mechanik (Session 46) auf den DE-Artikel mit `hreflang="de"`
+ CTA "read article (in German)". Kein Sonderfall im Code noetig.

Card-Texte (DE + EN) sind im `de:{}` / `en:{}`-Schema. Anfuehrungszeichen im Text als **einfache** `'...'`
(doppelte `"` wuerden den JS-String brechen) - Workshop-Name `'Aufwachsen mit KI'`.

### Position: ans Ende des Grids

Erst oben als neuestes Item eingefuegt, dann auf Maggys Wunsch **ans Ende** verschoben (nach
"Podiumsdiskussion PH Vorarlberg"). Verifiziert via Preview-DOM: 23 Cards, Index 22 (= letzte),
`cardBeforeLast = "Podiumsdiskussion PH Vorarlberg"`.

## Thumbnail: eigener Render statt Crop

Die Grid-Thumbs sind **quadratisch** (`.vitrine-card__thumb` `aspect-ratio:1/1`, `object-fit:cover`),
das Blog-Hero ist 700x550 (Querformat). Statt zu croppen/letterboxen: ein eigenes **quadratisches
Render-Template** gebaut (`_render-vitrine-aufwachsen*.html`, gitignored), Brand-Look aus dem
Hero-Template uebernommen (TheSerif-Headline via `global.css`-@font-face, i.-Mark-SVG, Chips).

**Render-Pipeline (Lehre, Windows):** Brave-Headless ist beim Screenshot reproduzierbar gecrasht
(Network-/GPU-Process, exit -1073741819). **Chrome mit `--headless=old`** lief sauber:
`chrome --headless=old --disable-gpu --disable-software-rasterizer --disable-dev-shm-usage --no-sandbox
--force-device-scale-factor=2 --screenshot=OUT --window-size=600,600 file://...` -> 1200x1200, dann
Pillow LANCZOS -> 1080x1080. (Bei `--headless=new` schreibt der Screenshot auf dieser Maschine nicht.)

### Drei Iterationen bis zum finalen Look

1. **Farbe** (gruene i.grow-Akzente, dunkler BG) - schoen, aber die anderen Grid-Thumbs sind S/W.
2. **Graustufen** (Pillow `convert('L')`) - dunkler BG, weisse Schrift. Kein CSS-`grayscale()`-Filter
   im Repo verifiziert (Grep ueber `css/`: nur `backdrop-filter`), d.h. die bestehenden Thumbs sind
   **echte S/W-Quelldateien** -> Entsaettigen ist der richtige Weg.
3. **Invertiert-Test** (`ImageOps.invert` der Graustufen) - weisser BG, schwarze Schrift. Maggy gefiel
   der Raster-Invert nicht: sichtbarer **Strich** (mein `.hc-streak`-Lichtband, invertiert = dunkle
   Linie) + grauer Schimmer (mein Glow-Verlauf).

**Final: reine S/W-Variante frisch gerendert** (`_render-vitrine-aufwachsen-bw.html`) - Light-Theme:
weisser BG, **kein** Glow/Streak, nur Schwarz+Weiss (BAUSTEIN-Plakette schwarz/weiss, Headline schwarz,
Chips weiss mit 1.5px schwarzer Kontur, i.-Mark schwarz). Loest beide Maggy-Punkte (Strich weg,
kein Grau) und fuegt sich beim weiss-grundigen Presse-Look ein. -> `assets/images/vitrine/aufwachsen-mit-ki.png`
(1080x1080, 158 KB).

**Lehre:** "in S/W machen" auf einer Marken-Grafik mit Glow/Streak-Elementen besser **neu im
Light-Theme rendern** als das Farb-Raster zu invertieren - Invert macht aus dunklen Deko-Elementen
graue/dunkle Artefakte. Render-Template ist die saubere Quelle.

## Drumherum

- **`.gitignore`**: `_scratch-*` ergaenzt (rohe Render-Zwischen-PNGs). `_render-*.html` war schon drin.
- **`python build.py`**: rendert DE- (`vitrine.html`) + EN-Grid (`en/vitrine.html`), jetzt **23 Kacheln**.
- **Kein Cache-Bust noetig**: Thumbnail ist neu (erster Push dieses Dateinamens), und das statische
  Grid steht direkt im HTML - der `vitrine.js`-JS-Fallback greift nur bei leerem Grid.
- **`preview_screenshot` haengt** auf der glas-/`backdrop-blur`-lastigen Vitrine-Seite zuverlaessig im
  Capture (Timeout 30s) - kein Code-Bug. Verifikation lief stattdessen ueber `preview_eval` (DOM-Position,
  Bild-Load) + direktes Anschauen des gerenderten PNG.

## Geaenderte/neue Dateien

- `js/data/vitrine.js` - 23. Eintrag (am Ende), DE+EN, Link auf Blog-Artikel
- `vitrine.html`, `en/vitrine.html` - via build.py neu generiertes Grid
- `assets/images/vitrine/aufwachsen-mit-ki.png` - **neu**, S/W-Thumbnail 1080x1080
- `.gitignore` - `_scratch-*`
- `_render-vitrine-aufwachsen.html` / `-bw.html`, `_scratch-*` - lokal, gitignored (nicht im Repo)
