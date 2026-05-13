# Session 44 — Englisch: Stadtrundgaenge-Bereich komplett

**Datum:** 2026-05-13
**Branch:** `claude/en-stadtrundgaenge`
**Ziel:** Stadtrundgaenge-Hub + 4 Stadtseiten auf Englisch live bringen, hreflang sauber, Sprachschalter im Burger nicht mehr brüchig.

## Was passiert ist

### 5 neue EN-Seiten
- `en/stadtrundgaenge.html` — Hub mit Leaflet-Karte (5 Marker inkl. Bregenz-soon), 5 Ort-Karten, Counts statisch im HTML, Marker-Popups englisch (`tour`/`tours` Plural), EN-Top-Nav + Burger + nav__lang-Sprachschalter.
- `en/stadtrundgang-dornbirn.html` — 3 i.history + 3 i.dentity (Messepark → "Talking Tree") + 2 i.grow Cards. Chips: 3/4/3 (kleiner Inkonsistenz mit DE wurde nicht angefasst, ist Bestand).
- `en/stadtrundgang-feldkirch.html` — 2 i.grow Schulprojekte (Zusammenwachsen MS Levis, Ein Oktobertag MS Oberau).
- `en/stadtrundgang-hard.html` — See Runde mit Fiffi-Erwähnung.
- `en/stadtrundgang-au.html` — Barockbaumeister Franz Beer Tour + Route-Liste (Au, Bregenz, Konstanz, Rheinau, Bezau).

Alle 5 mit `<html lang="en">`, `og:locale=en_GB`, BreadcrumbList + TouristAttraction Schema (`availableLanguage: ["en","de"]`, `inLanguage: "en-GB"`), hreflang-Triple, Tour-Links auf `iappear.app/en/routes/...` (App-EN-Routes wurden vorher per `curl` bestätigt → 200).

### 5 DE-Schwester-Seiten gepatcht
`stadtrundgaenge.html`, `stadtrundgang-{dornbirn,feldkirch,hard,au}.html` bekommen:
- `<link rel="alternate" hreflang="de|en|x-default">` Triple
- `<meta property="og:locale:alternate" content="en_GB">`
- `<div class="nav__lang">` Sprachschalter zwischen `nav__brand` und `nav__links`
- TouristAttraction Schema: `availableLanguage: "de"` → `["de", "en"]` (Hub hat kein Schema)

### 8 bestehende EN-Seiten: Stadt-Links umgestellt
Python-Inline-Script über `en/index.html, en/i-history.html, en/i-dentity.html, en/i-grow.html, en/features.html, en/ueber-uns.html, en/faqs.html, en/user-guide.html` — Replace `../stadtrundgaenge.html` → `stadtrundgaenge.html` plus 4 Stadt-Slugs. 54 Links total umgestellt:
- en/index.html: 12 (Top-Nav + Burger + Hero-CTA + 4 City-Teaser-Cards + See-All-Map-Button)
- die 7 anderen je 6 (Top-Nav + 5 Burger-Walking-Tours)

So bleibt der User innerhalb von /en/ wenn er aus z.B. en/index.html zu einer Stadtseite navigiert.

### sitemap.xml + build.py
Sitemap manuell erweitert um 10 Einträge: Hub DE+EN (jeweils hreflang-Triple) + 4 DE-Stadtseiten mit hreflang + 4 EN-Stadtseiten mit hreflang. Total 10 neue URLs.

`build.py update_sitemap` erweitert: prüft pro Slug ob `en/stadtrundgang-{slug}.html` existiert. Wenn ja → rendert DE-Eintrag mit hreflang-Triple + EN-Eintrag mit hreflang-Triple. Wenn nein → DE-Eintrag wie zuvor. Re-run nach Edit ergab keine Sitemap-Änderung → meine manuelle Sitemap matcht jetzt 1:1 was build.py rendert. Stabil bei künftigen `python build.py`-Läufen.

### Doku
- `_doku/englische-version.md`: Status-Tabelle auf 13 Seiten erweitert, neuer Session-44-Block mit allen Detail-Entscheidungen.
- `CLAUDE.md` Stand-Block: 8 → 13 EN-Seiten, neue Konvention "EN-Stadtseiten manuell pflegen" dokumentiert.

## Entscheidungen

### EN-Stadtseiten manuell pflegen, `rundgaenge.js` einsprachig
Die Alternative wäre `rundgaenge.js` mit `de:/en:`-Feldern pro Eintrag und `build.py generate_stadtseite` bilingual. Das wäre korrekter aber Overhead für aktuell nur 4+1 Stadtseiten die sich selten ändern. Bei neuem Rundgang in einer Stadt: DE-Stadtseite + `en/stadtrundgang-*.html` händisch nachziehen.

`build.py` bleibt einsprachig (kein `generate_stadtseite_en`). Nur `update_sitemap` ist bilingual-aware — das ist no-cost weil es nur prüft ob `en/stadtrundgang-{slug}.html` existiert.

### App-Tour-Links: `iappear.app/en/routes/...`
Per `curl -sIL` getestet: `/en/routes/dornbirn/hist-appear` → 307 → `www.iappear.app/en/...` → 200. EN-Routes existieren auf der App-Seite, also EN-Stadtseiten verlinken zu den englischen Routen statt zu den deutschen.

### Counts statisch im EN-File (keine build.py-Marker)
`<!-- CHIPS:hub:START/END -->`, `<!-- CHIPS:kategorie:*:START/END -->`, `<!-- COUNT:*:START/END -->` und `<!-- MAP-MARKERS:START/END -->` sind im EN-File nicht vorhanden. Counts wie "10 walking tours & audio guides" und Map-Marker-Liste sind hartcodiert. build.py greift nie auf `en/` zu → kein Risiko, dass etwas überschrieben wird.

## Was offen ist

- Maggy verifiziert die 13 EN-Seiten im Privat-Tab (vor allem die 5 neuen). Karte sollte auf en/stadtrundgaenge.html funktionieren, Sprachschalter sauber switchen.
- Nächste Bereiche EN: Blog (6 Seiten), Vitrine (23 Seiten + Datenfile + build.py), 404. Workflow/Kontakt blockiert auf englische Tally-Form.

## Lehren (in CLAUDE.md übernommen wo permanent)

- **Pragmatischer Bilingual-Workflow**: Wenn ein Datenfile (`rundgaenge.js`) eine Handvoll Einträge hat und sich selten ändert, ist manueller doppelter HTML-Pfleg-Workflow billiger als `de:/en:`-Felder + bilingual-Generator. Marker für Counts/Chips/Map-Marker bleiben im DE-File, EN-Versionen sind statisch — build.py sieht `en/` nicht. Bei Vitrine ist die Lage anders (22 Einträge, ändert sich häufig) — dort wird `de:/en:`-Felder + build.py-Erweiterung nötig sein.
- **App-EN-Routes verifizieren bevor verlinken**: `curl -sIL` (folgt Redirects) zeigt Final-Status. Erspart Annahmen.
- **Stadt-Links in bestehenden EN-Seiten nach Neu-Lokalisierung umstellen**: Sonst klickt User aus /en/ raus über interne Tour-Links und ist im DE — Sprachschalter-UX wird brüchig.
