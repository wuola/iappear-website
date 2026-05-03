# Mini-Karten-TODOs

Stand: **2026-05-03 — abgearbeitet (Session 21).** Maggy hat alle offenen Punkte
geklaert. Datei bleibt als Audit-Trail liegen.

---

## ~~Stationen mit Default-Koordinaten~~ ✓ Maggy-OK

Drei Stationen in **hist.appear** liegen alle auf 47.414141 / 9.740922:
- "Die Wurzeln Dornbirns"
- "Vertiefung Turteltaub"
- "Vertiefung Zeitzeugen"

→ **Maggy 2026-05-03**: Koordinaten passen, ist Spezialfall. Mini-Karte ist
ohnehin nur symbolisch (echte Karte ist in der App). Renderer dedupt jetzt
identische Koordinaten — zeigt nur EIN Target statt drei perfekt
uebereinander gestapelte (`js/rundgang-map.js`).

---

## ~~Doppelte Koordinaten innerhalb desselben Rundgangs~~ ✓ Maggy-OK

**See Runde (Hard):**
- "Gedenkstein Sanierung" und "Würfelturm" — beide exakt auf 47.4943502 / 9.688513
- "Gert Hoor" existiert zweimal

→ **Maggy 2026-05-03**: Koordinaten stimmen so, ist Spezialfall.
Renderer-Dedup zeigt jetzt EIN Target.

---

## ~~Stationen weit ausserhalb des Hauptgebiets~~ ✓ behoben + Maggy-OK

~~**Frauenspuren (Dornbirn):**~~ ✓ behoben 2026-04-29 (Innenstadt-Koords gesetzt).
TODO: Storyblok auch noch updaten, sonst weicht es bei naechster Daten-Re-Sync wieder ab.

**Barockbaumeister (Au):** 6 Stationen verteilen sich extrem weit (Au, Vorarlberg, Schweiz).
→ **Maggy 2026-05-03**: bewusst so lassen — Franz Beer hat tatsaechlich in
der ganzen Bodensee-Region und Schweiz gebaut.

---

## ~~Mapping-Annahmen~~ ✓ Maggy-OK

1. **i-grow "Buntes Dornbirn"** → Storyblok-Rundgang **"Immersive Ethik"** —
   **Maggy 2026-05-03**: Mapping korrekt.
2. **i-grow "hist.appear (Schulversion)"** zeigt gleiche Koordinaten wie i-history "Hist.appear" —
   **Maggy 2026-05-03**: gewollt, wir zeigen nur die hist.appear-Stationen.

---

## Karten ohne Stationen ✓ Renderer-Sonderfall

**125 Jahre — 125 Bilder** (i-history): kein Rundgang mit Stations, sondern eine Foto-Ausstellung
→ Mini-Karte macht keinen Sinn, Platzhalter belassen.

---

## Karten mit nur 1 Station ✓ Renderer-Sonderfall

**Messepark — Der sprechende Baum** (i-dentity): nur 1 Station
→ Renderer setzt bei `stations.length === 1` festen Zoom (14, Stadtteil-Ebene).
