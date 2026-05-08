# Session 34 — Englisch: `ueber-uns.html` direkt übersetzt

**Datum:** 2026-05-08
**Branch:** `claude/en-ueber-uns`

## Was gemacht wurde

### `en/ueber-uns.html`

Komplette englische Version der Über-uns-Seite:

- Title, Description, og:*, twitter:*
- H1 „About us", Subtitle „The team behind i.appear"
- Marilena-Bio (2 Paragraphen) — Eyebrow „Managing director, editorial lead, UX/UI design and content creation"
- Maggy-Bio (2 Paragraphen) — Eyebrow „3D, Interactive Systems, Web and AR"
- CTA „Want to work with us?" + „Get in touch &rarr;"
- Section „Partners and funders" — Universität Wien wird zu „University of Vienna" als Partner-Logo-Alt-Text + Subline „Developed as part of a master's thesis at the University of Vienna."
- Stadt Dornbirn → City of Dornbirn (Partner-Logo-Alt-Text), parallel für Feldkirch.

### Drive-by Bug-Fix in DE `ueber-uns.html`

JSON-LD `BreadcrumbList` hatte `"item": "https://iappear.at/über-uns/"` — alte
Pretty-URL-Variante mit Umlaut, die laut Konvention seit Session 26
(`5ebc850`) nicht mehr existiert (GitHub Pages serviert keine Pretty-URLs).
Korrigiert auf `"item": "https://iappear.at/ueber-uns.html"`.

### DE `ueber-uns.html`

- 3 hreflang-Tags + canonical
- `og:locale:alternate="en_GB"`
- `.nav__lang`-Block

### `sitemap.xml`

- en/ueber-uns.html neu (priority 0.65)
- DE-Eintrag um hreflang-Triples erweitert

## Stand nach Session 34

EN live: `index`, `i-history`, `i-dentity`, `i-grow`, `features`, `ueber-uns`
&mdash; **6 Seiten**.

## Naechste Pilot-Seiten

- `faqs.html` (FAQ-Liste)
- `user-guide.html` (User Guide mit Mickey-Hand-Animation)
- `stadtrundgaenge.html` + 4 Stadtseiten
- Tally-Form-Seiten (workflow, kontakt) — sobald englische Tally-Form existiert
- `vitrine.html` + 22 Vitrine-Artikel
- Blog
