# Session 32 — Englisch: `i-grow.html` direkt übersetzt

**Datum:** 2026-05-08
**Branch:** `claude/en-i-grow` (frischer Branch von `origin/main`).

## Was gemacht wurde

### `en/i-grow.html` (groesste Kategorie-Seite)

Komplett auf en_GB übersetzt &mdash; alle 11 Sektionen plus auskommentierter
Partner-Block mit drin.

Sektionen:

1. Page-Header mit Story-Box und Hub-Jump-Chip zu den Schul-Rundgängen
2. Zielgruppen-3er-Grid (Lehrkräfte / Klassen / Bildungsinstitutionen)
3. Prose-Block mit drei Erklärungs-Paragraphen zu i.grow als Bildungsschiene
4. Themenfelder-3er-Grid (Medienbildung, Demokratiebildung, KI-Bildung)
5. Hintergrund-Block zum neuen Pflichtfach &ldquo;Medien und Demokratie&rdquo;
6. Auskommentierter Partner-Block (auch im EN als Kommentar mit übersetztem
   Inhalt drin &mdash; falls Maggy ihn später wieder einblendet, ist die EN-Version
   schon da)
7. Workshop-Prinzipien-4er-Grid
8. Curated-Tour-Prinzipien-4er-Grid
9. Schul-Rundgänge Dornbirn (hist.appear school edition + Buntes Dornbirn)
10. Schulprojekte Feldkirch (Zusammenwachsen + Ein Oktobertag)
11. CTA „Request a workshop or tour"

### Übersetzungs-Entscheidungen i-grow-spezifisch

- **Story-Headline** „Vom Konsumieren zum Gestalten" &rarr; `From consuming to creating`
  &mdash; behält das prägnante Wortspiel-Tempo des Originals.
- **Lead** „Medienkompetenz durch eigenes Tun" &rarr; `learning by making` &mdash;
  knapper englischer Idiom-Ausdruck.
- **Hub-Jump-Chip** „zu den Rundgängen ↓" &rarr; `jump to the tours ↓` &mdash;
  imperative, aktiv.
- **Eigennamen-Strategie**: deutsche Eigennamen bleiben, beim ersten Vorkommen
  Klammer-Übersetzung:
  - „Buntes Dornbirn" &rarr; bleibt + `(Colourful Dornbirn)`
  - „Zusammenwachsen" &rarr; bleibt + `(Growing Together)`
  - „Ein Oktobertag" &rarr; bleibt + `(One October Day)`
  - „Medien und Demokratie" &rarr; bleibt + `(Media and Democracy)`
  - „Kunst ist Klasse" &rarr; bleibt unübersetzt, nur als Programm-Name
- **Schulen**: `MS Levis`, `MS Oberau` &mdash; bleiben (Schul-Eigennamen).
- **Behörde**: `Bundesministerium für Kunst und Kultur` &rarr; `Austrian Federal
  Ministry for Arts and Culture` &mdash; explizit Austrian, weil zwei
  Schulprojekte explizit auf österreichische Förderung verweisen.
- **Bildungsbegriffe**: `Sekundarstufe I` als `lower secondary education`,
  `AHS-Oberstufe` als `upper secondary years (AHS-Oberstufe)`. `Digitale
  Grundbildung` bleibt mit Klammer `(Digital Basics)`.
- **PDF-Begleitmaterial-Links**: alle PDFs sind nur in DE verfügbar &mdash; Labels
  daher als „Teaching material (DE)" markiert. Das ist transparent ggü.
  englischsprachigen Lehrkräften.

### DE `i-grow.html`

- 3 hreflang-Tags + canonical
- `og:locale:alternate="en_GB"`
- `.nav__lang`-Block mit DE aktiv, EN &rarr; `en/i-grow.html`

### `sitemap.xml`

- en/i-grow.html neu (priority 0.85, mit hreflang-Triples)
- DE-Eintrag um hreflang-Triples erweitert

## Sub-Marken-Trio fertig

Mit dieser Session ist das Sub-Marken-Trio i.history / i.dentity / i.grow
**komplett englisch** &mdash; alle drei Kategorie-Seiten mit konsistentem Pattern,
Brand-Vokabular, Stilkonventionen.

## Nicht gemacht (bewusst)

- Cache-Bust nicht hochgezogen (reine HTML-Edits).
- `build.py` nicht gelaufen (i-grow hat keine Vitrine-Marker und keine
  Rundgang-Counts).
- Keine Übersetzungs-Liste angelegt &mdash; neuer Workflow seit Session 30.

## Offene Punkte fuer den Tag-Sweep

- **Aufräumen ganz am Schluss** (laut Maggy): Branch-Müll auf GitHub
  wegräumen (claude/loving-haibt-7012a4, claude/i-history-fresh,
  claude/en-i-dentity, claude/en-i-grow), `_fix_descriptions.py` löschen.

## Naechste Pilot-Seiten

- `features.html` (Feature-Liste)
- `workflow.html` (Tally-Form schon eingebettet, EN-Form steht aus &mdash; mit
  Maggy klären, wann sie die zweite Tally-Form anlegt)
- `kontakt.html` (gleicher Tally-Aspekt)
- `faqs.html`
- `user-guide.html`
- `ueber-uns.html`
- `stadtrundgaenge.html` + 4 Stadtseiten
- `vitrine.html` + 22 Vitrine-Artikel
- Blog
