# Session 9 - Glassy Apple-Style + Netzwerk-Viz + Stadtrundgang-Karten

**Datum**: 2026-04-16  
**Quelle**: aus CLAUDE.md (Stand 2026-05-02), unveraendert uebernommen.

---

- Session 9 (Glassy Apple-Style + Netzwerk-Viz + Stadtrundgang-Karten, 2026-04-16):
  - **Glassy-Look (Glassmorphism)** auf allen interaktiven Elementen eingefuehrt — inspiriert vom Apple-Design der i.appear-App (Marilenas Vorlage). Effekt: halbtransparenter Hintergrund, dunkler Inner-Shadow ("eingelassenes Glas"), feine Licht-Kante oben am Stroke, Backdrop-Blur, subtiler aeusserer Glow. Gilt fuer:
    - `.btn` (alle Buttons seitenweit) in `components.css`
    - `.hub-jumpnav__chip` (Jump-Chips auf Stadtrundgang-Seiten) in `components.css`
    - `.ort-tag` (Kategorie-Tags in Ort-Karten) inline in `stadtrundgaenge.html`
  - **Zentrale CSS-Variablen** (`--glass-*`) in `css/global.css` `:root`-Block: `--glass-bg`, `--glass-border`, `--glass-shadow-top`, `--glass-shadow-bottom`, `--glass-highlight`, `--glass-glow`, `--glass-blur` + jeweilige Hover-Pendants. Aenderung an einer Stelle wirkt auf alle drei Komponenten. Ideal fuer Marilenas Feinschliff-Runden.
  - **Kategorie-Varianten** (`.btn--history/--dentity/--grow`): Stroke + Hintergrund in halbtransparenter Kategorie-Farbe, Shadow/Highlight/Blur von den zentralen Variablen.
  - **Netzwerk-Viz groessere Schriften**: Tour-Labels (aeusserer Ring) 13→20px, Station-Labels (innerer Ring) 11→13px, "coming soon" Tag 8→10px, Station-Count 9→11px. Tour-Dots r=5→8 (deutlich groesser). Label-Offset 38→48 (mehr Abstand Dot↔Label). ViewBox 1000x700→1100x780 (mehr Platz am Rand). Innerer Ring R=130→165, aeusserer R=275→290. Mitte bleibt bei 13 Platzhalter-Stationen etwas eng — loest sich mit echten Daten.
  - **Stadtrundgang-Karten auf Landingpage**: Bunte Target-Icons (gelb/blau/gruen je nach Kategorie) ersetzt durch **ein weisses Target** pro Karte. Darunter jetzt **Glassy-Chips** mit Kategorie-Name und Anzahl (z.B. "i.history · 4", "i.dentity · 3", "i.grow · 2") — konsistent mit dem Design auf den Stadtrundgang-Unterseiten.
  - **Automatische Rundgang-Counts via build.py** (`58d9a1b`): `rundgaenge.js` ist jetzt die einzige Quelle der Wahrheit fuer alle Rundgang-Zahlen. Neues `stadt`-Feld pro Region mappt auf City-Slugs (z.B. "Messepark Dornbirn" → dornbirn, "Bodenseeregion" → hard). `build.py` zaehlt pro Stadt + Kategorie und injiziert Ergebnisse in 6 HTML-Dateien via Marker-Kommentare. Drei Marker-Typen: `COUNT:slug` (Zahltext), `CHIPS:kategorie:slug` (Glassy-Chips), `CHIPS:hub` (Hub-Chips). Getestet mit Dummy-Rundgang (Feldkirch +1 history, Zahl ging korrekt von 2 auf 3 und zurueck). Workflow: `rundgaenge.js` bearbeiten → `python build.py` → committen.
  - **Automatische Stadt-Infrastruktur via build.py** (`bcc40d3`): Neuer `IAPPEAR_STAEDTE` Config-Block in `rundgaenge.js` mit Koordinaten, Anzeigename und Subtitle pro Stadt. build.py liest die Config dynamisch (statt hardcoded) und generiert bei einem neuen Ort automatisch: (a) eine neue `stadtrundgang-{slug}.html` Stadtseite mit Breadcrumbs, Schema.org, Kategorie-Sektionen und Tour-Cards aus den Rundgang-Daten, (b) einen Leaflet-Karten-Pin auf der Hub-Seite via `MAP-MARKERS`-Marker, (c) einen Sitemap-Eintrag via `STADTRUNDGANG-URLS`-Marker, (d) einen llms.txt-Eintrag via `STADTRUNDGANG-LINKS`-Marker. Bestehende Stadtseiten werden NICHT ueberschrieben. Getestet mit Dummy-Ort "Schwarzach" (angelegt, geprueft, entfernt). Ort-Cards auf der Hub-Seite bleiben manuell (schuetzt hand-geschriebene Texte).
  - **Commits**: `7894b4a` (Glassy + Netzwerk + Karten), `6dc483d` (Cache-Bust Fix), `58d9a1b` (Auto-Counts), `bcc40d3` (Auto-Staedte). Live: https://wuola.github.io/iappear-website/
