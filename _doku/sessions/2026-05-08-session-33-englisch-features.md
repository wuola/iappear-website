# Session 33 — Englisch: `features.html` direkt übersetzt

**Datum:** 2026-05-08
**Branch:** `claude/en-features` (frischer Branch von `origin/main`).

## Was gemacht wurde

### `en/features.html`

Komplette englische Version. Statische HTML-Strings übersetzt:

- Title, Description, og:*, twitter:*
- Eyebrow: „Multimedia content for digital walking tours and audio guides"
- H1: „Features"
- Subtitle: „14 building blocks that bring our walking tours to life"
- Feature-Liste-Labels (14 Items):
  - 3D models, Augmented Reality, 360 video in VR, Animations,
    Interactive maps, Audio guide, Historical images, Quiz feature,
    Witness interviews, Videos, Secret Stations, Emotional stories,
    Living photos, Before-and-after views
- CTA Lead: „Want these features in your own walking tour?"
- CTA Button: „Get in touch &rarr;"

### `js/features-en.js` (neue Datei)

Englische Schwester zu `js/features.js`. Identische Struktur, alle 14
Feature-Beschreibungen (title, sub, text) auf en_GB übersetzt. Asset-Pfade
auf `../assets/...` (englische Seite liegt unter `/en/`).

Wichtige Übersetzungs-Entscheidungen:

- `Massanfertigungen oder frei nach Wunsch` → `Made to measure or freely designed`
- `Sie brauchen es sich nicht vorstellen.` → `You don't need to imagine it.`
- `Mitten im Geschehen` → `Right in the middle of it`
- `Bewegte Fotos` → `Living photos`
- `Vorher-Nachher-Ansichten` → `Before-and-after views`
- `Zeitzeug:innen-Interviews` → `Contemporary witness interviews` (in JS),
  `Witness interviews` (in HTML-Liste, kürzer fürs Layout)
- `Harry-Potter-Effekt` → `The Harry Potter effect` (Pop-Kultur-Referenz bleibt)

### Architektur-Entscheidung: zwei JS-Dateien statt bilingualer einer

`js/features.js` (DE) bleibt unverändert. `js/features-en.js` ist eine Kopie
mit englischen Strings + angepassten Asset-Pfaden. Tradeoff: Doppelpflege bei
Feature-Liste-Änderungen, dafür kein Änderungsrisiko an der DE-Live-Seite und
keine Logic-Änderungen in der Code-Basis.

Wenn künftig Drift entsteht: Bilinguale Variante mit `<html lang>`-Detection
einführen, beide Dateien zusammenführen.

### DE `features.html`

- 3 hreflang-Tags + canonical
- `og:locale:alternate="en_GB"`
- `.nav__lang`-Block

### `sitemap.xml`

- en/features.html neu (priority 0.75)
- DE-Eintrag um hreflang-Triples erweitert

## Verifiziert

Über preview_eval:
- `document.title` → korrekt englisch
- `[data-feature-desc] h3` → „3D models" (englisch geladen)
- `[data-feature-desc] .eyebrow` → „Made to measure or freely designed"
- `[data-feature-desc] p` → englischer Beschreibungstext
- `[data-feature-list] li:first-child` → „3D models"

Console-Errors: 0.

## Nicht gemacht (bewusst)

- Cache-Bust für DE features.js nicht hochgezogen (DE-Datei unverändert).
- `js/features-en.js` mit eigenem Cache-Bust `?v=20260508a` versehen (ist ja
  brandneu, hat Erstausgabe-Versionen-Stempel).

## Stand nach Session 33

EN live: `index`, `i-history`, `i-dentity`, `i-grow`, `features` &mdash; **5 Seiten**.

## Naechste Pilot-Seiten

- `ueber-uns.html` (über uns — keine Form, einfach Story-Seite)
- `faqs.html` (FAQ-Liste)
- `user-guide.html` (User Guide)
- Stadtrundgang-Hub + 4 Stadtseiten
- Tally-Form-Seiten (workflow, kontakt) — später, sobald Maggy englische
  Tally-Form anlegt
- Vitrine-Hub + 22 Vitrine-Artikel
- Blog
