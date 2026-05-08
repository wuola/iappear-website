# Session 36 — Englisch: `user-guide.html` direkt übersetzt

**Datum:** 2026-05-08
**Branch:** `claude/en-user-guide`

## Was gemacht wurde

### `en/user-guide.html` (1015 Zeilen)

Komplett uebersetzt &mdash; die groesste Seite bisher mit zwei interaktiven
Wizard-Widgets, Mickey-Hand-Animation, 4-Schritt-Kurz-Anleitung und
Inline-Scripts mit hardcoded Deutsch-Strings.

#### Sichtbare Strings

- 4-Schritt-Kurz-Anleitung: Choose your location / Map or suitcase / Open a
  location / Experience content
- 2 Wizard-Widgets:
  - Pfad A „Tours": Step-Labels ueber JS gerendert (Choose region / tour /
    location / content)
  - Pfad B „Near me": Discover locations near you / Decide / Content / Tour
- Decision-Buttons (Pfad B Schritt 2): „View location" + „Whole tour"
- Notes-Section + Technical requirements (8 ul-Items)
- Italic-Lead: „Two ways through the app &mdash; experience a whole tour or
  find individual locations near you."

#### Inline-Scripts (2 IIFE)

Beide Scripts mit englischen Strings + `../assets/...`-Pfaden fuer Bilder.
STEPS-Arrays (4 in Pfad A, 4 in Pfad B) komplett uebersetzt &mdash; Image-
Pfade auf relativ aus /en/ angepasst, alt-Texte englisch.

`stepLbl.textContent = 'Step ' + N` (statt `'Schritt ' + N`).

#### Brand-Vokabular angewendet

- Station &rarr; location (gross/klein nach Kontext)
- Rundgang &rarr; tour
- Karte/Koffer &rarr; map/suitcase

### DE `user-guide.html`

- 3 hreflang-Tags + canonical
- `og:locale:alternate="en_GB"`
- `.nav__lang`-Block

### `sitemap.xml`

- en/user-guide.html neu (priority 0.65)
- DE-Eintrag um hreflang-Triples erweitert

## Verifiziert

preview_eval auf `/en/user-guide.html`:
- title, h1, sg-step-title, widget-Header (Tours/Near me), step-Label
  (Step 1), Decision-Buttons (View location/Whole tour) &mdash; alle korrekt
  englisch
- Image-Pfad: `../assets/images/user-guide/a1-koffer.png` &mdash; korrekt aus
  `/en/`-Verzeichnis
- Console-Errors: 0

## Stand nach Session 36

EN live: index, i-history, i-dentity, i-grow, features, ueber-uns, faqs,
user-guide &mdash; **8 Seiten**.

## Naechste Pilot-Seiten

- stadtrundgaenge.html (Hub mit Leaflet-Karte) + 4 Stadtseiten
- workflow.html / kontakt.html (Tally-Form &mdash; spaeter, sobald englische
  Tally-Form existiert)
- vitrine.html + 22 Vitrine-Artikel
- 2 Blog-Artikel
- 404.html
