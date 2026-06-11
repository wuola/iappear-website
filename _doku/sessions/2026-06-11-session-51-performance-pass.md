# Session 51 - Performance-Pass: Hero-Videos + Teaser-Lazy-Load + Fonts-WOFF2 + Vitrine-JPGs

**Datum**: 2026-06-11
**Ausloeser**: Maggy meldete langsames Laden, besonders der beiden Hero-Mockups auf der Startseite. Auftrag: Performance-Analyse + Umsetzung, Qualitaet darf nicht sichtbar leiden.

---

## Ausgangslage (Analyse)

- Startseite lud **~16,6 MB Video sofort beim Aufruf**: 2 Hero-Videos (8,5 MB, Hash-identisch mit `originals/` = nie optimiert) + 4 Feature-Teaser (8,2 MB, Autoplay uebersteuert `preload="metadata"`), alle konkurrierend um Bandbreite.
- Fonts als TTF/OTF (1,45 MB, ~850 KB gzipped ueber die Leitung) statt WOFF2.
- 25 Vitrine-PNGs mit 0,3-1,25 MB (PNG = falsches Format fuer Fotos), vitrine.html lud ~17 MB Bilder.
- Die "wegen Google"-Font-Entscheidung aufgeklaert: Kommentar in global.css = **Selbst-Hosting wegen DSGVO** (Google-Fonts-Urteil), nicht SEO. Bleibt unangetastet, nur Format moderner.

## Schritt 1: Hero-Videos re-encoded (`4b42f38`)

- **Vorgeschichte beachtet**: Session 17 scheiterte mit CRF 30 (Block-Artefakte) und CRF 24 ("duenne Linien haesslich") → Rollback damals. Session 18 bekam aber **CRF 20** fuer die Feature-Videos live freigegeben.
- Also: exakt das freigegebene Rezept `libx264 -crf 20 -preset slow -an -movflags +faststart` (Audio-Spuren waren tot: 192/317 kbps stumm abgespielt).
- histappear 4,4→2,1 MB, navigation 4,0→2,75 MB. **Vorab-Selbstcheck**: 3x-Zoom-Frame-Vergleich an duennen Kartenlinien + SSIM 0,995 (>0,99 = visuell transparent). Maggy live: "passen super, super schnell".
- Cache-Bust `?v=20260611a` direkt auf den mp4-URLs (DE+EN index).

## Schritt 2: Feature-Teaser Lazy-Load + ar.mp4-Schnitt (`8448e75`)

- **4 Teaser-Videos auf index/en-index**: img+poster-Layer ergaenzt (vorher KEIN poster → schwarze Phone-Screens) + IntersectionObserver-Lazy-Load als Inline-Script vor `</body>` (laedt 300px vor Viewport; seitenlokal = keine Cache-Bust-Kaskade). `data-src` statt `src`, autoplay-Attribut bleibt, play()-catch als Fallback.
- **ar.mp4-Raetsel geloest**: 60fps-Handkamera-Footage wird beim Re-Encode GROESSER als die Quelle (CRF 22 + fps=30 + scale=480: 9,1 MB; mit hqdn3d-Denoise: 6,8 MB — Quelle: 5,0 MB bei 0,95 Mbps). Die iPhone-Quelle ist schon am Optimum. **Loesung: Stream-Copy-Schnitt** von 43,7s auf 16,7s am Keyframe (durchgehend sprechender AR-Baum, Kameraposition bei 0s ≈ 16s) → 1,94 MB bei byte-identischer Qualitaet.
- **emo.mp4 bewusst Original gelassen**: laedt auf features.html nur on-demand bei Klick (features.js laedt initial nur 1 Video), haengt an keinem Page-Load.
- Cache-Bust: VBUST `20260611a` in features.js + features-en.js + Script-Tags in beiden features.html.
- **Preview-Lehre**: Headless-Preview-Tab ist `document.hidden` → IntersectionObserver feuert dort NIE und smooth-scroll laeuft nicht (rAF-Throttling). Funktional verifiziert via: Initial-Zustand (kein src gesetzt) + manueller Trigger der Lade-Logik + Netzwerk-200er. IO-Feuern selbst ist Standard-Browserverhalten.

## Schritt 3: Fonts → WOFF2 + Preload (`36471d4`)

- Alle 6 Schnitte mit `python -m fontTools.ttLib.woff2 compress` konvertiert: **1,45 MB → 712 KB** (Roboto-Variable 457→204 KB, TheSerif je ~126→68 KB). Kein Subsetting (Risiko Sonderzeichen vs. geringer Mehrwert).
- global.css: WOFF2 zuerst in `src`, TTF/OTF bleiben als Fallback. Pro Seite 2 Preloads (`Roboto-Variable.woff2` + `TheSerif-HP6SeBld.woff2`, `as="font" crossorigin` — Pfad muss exakt der CSS-Aufloesung entsprechen, kein Query-String).
- Massen-Edit ueber 71 HTMLs per Temp-Python-Script (Worktrees excludiert, `newline=''` gegen CRLF-Umschreibung). Cache-Bust global.css `?v=20260611a` ueberall.
- **Verifikations-Falle**: Preview-Tab zeigte TTF UND WOFF2 geladen (Disk-Cache-Artefakt des Automation-Tabs, transferSize 0). **Ground Truth**: Cold-Cache Chrome `--headless=old` mit frischem `--user-data-dir` gegen lokalen Server → Server-Log zeigt NUR die 5 WOFF2-Requests. Dieses Muster (python http.server-Log als Request-Beweis) ist wiederverwertbar.
- **PowerShell-5.1-Falle**: `Get-Content | Set-Content -Encoding utf8` zerschreibt UTF-8-Sonderzeichen (Mojibake `â€"`) + fuegt BOM ein. Fix: Original-Bytes via Bash `git show HEAD:file > file` wiederherstellen, Aenderung mit Edit-Tool machen. Fuer Massen-Edits: Python mit explizitem `encoding='utf-8', newline=''`.

## Schritt 4: Vitrine-PNGs → JPG (`2597634` Probe, `36f5c92` Batch)

- Probe kopf (1.114→162 KB) + cityx (728→157 KB) als JPG q85 progressive, Zoom-Vergleich an Zeitungstext-Kanten sauber, Maggy-Freigabe, dann Batch: **19 weitere PNGs > 300 KB** (15,2 MB → 2,7 MB). Die 4 kleinen (aufwachsen-mit-ki, award, master, master2) bewusst PNG gelassen.
- Keines der PNGs nutzte echte Transparenz (RGBA-Faelle alle voll opak — vorher geprueft, JPG-sicher).
- Referenzen: vitrine.js `bild:`, Startseiten-Teaser DE+EN, alle vitrine/*.html (og:image + Inline-Bild), Grids via build.py. og:image-Dimensionen unveraendert (gleiche Pixel). **Dateiname-Wechsel statt Query-Bust** (og-Scraper-Cache-Konvention) ergibt sich beim Formatwechsel von selbst.
- **Rotator-Detail**: vitrine-teaser.js matcht Startseiten-img-src **string-genau** gegen vitrine.js `bild:` — beide muessen synchron umgestellt werden (EN matcht wegen `../`-Prefix eh nie und faellt auf Slot-Index-Fallback).
- Alte PNGs bleiben vorerst im Repo (Rollback-Sicherheit, kein Page-Load laedt sie). Aufraeumen spaeter moeglich.

## Bilanz

- Startseite: ~16,6 MB Sofort-Video → **4,9 MB** (nur noch Hero), Teaser laden beim Scrollen.
- Fonts: ~850 KB → ~712 KB als WOFF2, mit Preload ab erster Millisekunde.
- vitrine.html: ~12,5 MB weniger Bilddaten.
- Qualitaets-Regel bestaetigt: Video-Encodes nie ohne Frame-Zoom-Vergleich + SSIM, Bilder nie ohne Text-Kanten-Check, beides VOR dem Push; finale Freigabe immer auf Live durch Maggy.
