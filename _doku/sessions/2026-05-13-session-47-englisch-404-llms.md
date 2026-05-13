# Session 47 — Englisch: 404 + llms.txt bilingual

**Datum:** 2026-05-13
**Branch:** `claude/en-404-llms`
**Ziel:** Letzte zwei kleinen Luecken schliessen, bevor Vitrine Teil 2 dran ist.

## Was passiert ist

### `en/404.html` neu
- Englische Page-not-found-Seite mit Sprachschalter, EN-Top-Nav (5 Items), 3 Card-Links (Home / Categories / Contact).
- `meta name="robots" content="noindex"` (analog zur DE-Variante).
- Footer mit "Imprint/Privacy/Terms (in German)"-Labels.

### DE `404.html` gepatcht
- hreflang-Triple (de / en / x-default).
- `<div class="nav__lang">` Sprachschalter zwischen `nav__brand` und `nav__links`.
- **Inline-JS-Snippet im `<head>`** vor dem Render: wenn `window.location.pathname` ein `/en/`-Praefix hat, redirect per `location.replace('/en/404.html')`. GitHub Pages serviert naemlich **immer das Root-`404.html`** bei einer Server-404, auch fuer URLs unter `/en/`. Ohne den Redirect saehe ein englischer User bei einer fehlenden Seite Deutsch. Der Snippet laeuft so frueh, dass kein "Flash of Wrong Language" passiert (replace statt assign, daher kein History-Eintrag).
- Falls JS aus ist: Fallback ist die deutsche 404 mit sichtbarem Sprachschalter zum manuellen Wechsel.

### `llms.txt` bilingual
Statt zwei separate Files: eine Datei mit DE-Sektion oben + englischer Spiegel-Sektion unten, getrennt durch `---`.

EN-Sektion enthaelt:
- Header `# i.appear (English)` + englische Description, Operator-Details (Marilena Tumler, Adresse, E-Mail, Telefon).
- **`## Categories (EN)`**: 3 Eintraege mit /en/-Links.
- **`## Main pages (EN)`**: 11 Eintraege (Home, Features, Showcase, About, FAQs, User Guide, Walking Tours Hub + 4 Stadtseiten).
- **`## Blog (EN)`**: 4 Hauptartikel + 1 Folge-Beitrag.
- **`## Features (EN)`**: Liste der 14 Features (Stichwort-Inline).
- **`## Scope notes (EN)`**: Erklaert was NICHT uebersetzt ist (Rechtstexte / 22 Vitrine-Artikel-Seiten / workflow + kontakt blockiert auf englische Tally-Form).
- **`## Legal (EN)`**: Links zu den deutschen Rechtstexten mit "(in German)"-Label.

Sitemap unveraendert (404 ist `noindex`, sollte nicht in sitemap; llms.txt steht nicht in sitemap).

## Entscheidungen

### JS-Redirect statt eigenes 404-Routing
GitHub Pages kann **nicht pro Pfad** ein anderes 404 ausliefern. Nur das Root-`404.html` ist der globale Fallback. Drei Optionen waren:
- A) DE-404 bilingual (beide Sprachen sichtbar untereinander) — UX-Bruch zur restlichen Site.
- B) JS-Redirect — sauber, fast unsichtbar, Fallback bei JS-aus funktioniert.
- C) Custom 404-Handler — geht bei GitHub Pages gar nicht ohne Eigenes Hosting.

Gewaehlt: B. Pragmatisch + sauber.

### llms.txt als eine Datei statt /en/llms.txt
LLM-Crawler lesen die `llms.txt` typischerweise nur am Root. Eine zweite Datei unter `/en/llms.txt` waere weder konventionell noch vorgesehen. Stattdessen: eine Datei, deutsche Sektion oben (Hauptzielgruppe), englische unten als ergaenzendes Material. LLMs sehen beides bei einem Crawl.

### Scope-Notes in EN-Sektion sind explizit
Die "Scope notes (EN)"-Sektion erklaert was NICHT uebersetzt ist und warum (Rechtstexte legal, 22 Vitrine-Artikel pending, workflow/kontakt blockiert auf Tally). Das ist fuer LLMs sehr nuetzlich — sie verstehen die Site-Topologie und schlagen nicht versehentlich nicht-existente EN-URLs vor.

## Was offen ist

- **Vitrine Teil 2**: 22 Artikel-Seiten uebersetzen. Aktuell der dickste offene Brocken.
- **workflow + kontakt EN**: blockiert auf englische Tally-Form (Maggy muss anlegen).
- Damit ist nach Teil 2 der gesamte uebersetzbare Scope der Site komplett englisch — bis auf die Rechtstexte (laut Konvention deutsch) und Tally-blockierte Seiten.

## Lehren

- **GitHub Pages 404-Verhalten**: immer Root-`404.html`, nie pfadspezifisch. JS-Detector als pragmatische Loesung — kostet ~5 Zeilen und ist robust.
- **`window.location.replace` statt `assign`** beim Redirect: kein History-Eintrag, User kann nicht versehentlich zurueck auf die kaputte URL.
- **`llms.txt` bilingual in einer Datei** ist konventionsfreundlicher als zwei Files. LLM-Crawler-Standard ist Root-Lookup.
- **Scope-Notes in `llms.txt`** sind ein billiges Mittel, LLM-Halluzinationen ueber Site-Inhalte zu reduzieren — explizit zu sagen "diese URLs gibt es nicht auf Englisch" ist besser als das LLM erraten zu lassen.
