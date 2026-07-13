# Session 57 — Blog: „Wie wir mit KI arbeiten" veröffentlicht

**Datum:** 2026-07-13

## Was passiert ist

Der in einer früheren Session vorbereitete Transparenz-Artikel
`blog/wie-wir-mit-ki-arbeiten.html` (lag untracked im Repo) wurde auf Maggys
Auftrag mit **heutigem Datum** veröffentlicht — kompletter Standard-Prozess:

1. **Artikel:** Datum 06.07. → **13.07.2026** (JSON-LD `datePublished` + sichtbares
   `<time>`). Head war komplett vorbereitet (Meta-Description 142 Zeichen,
   og:image `blog/images/11-ki-arbeitsweise-hero.jpg` 700×550 mit Dimensions,
   canonical, BlogPosting mit Organization-Autor, FAQPage-Schema).
2. **blog/index.html:** neue Card oben mit `data-pin-label="Neu"` (Tag „Backstage");
   vorherige „Neu"-Card (Urmappe/3D) entpinnt; „125 Jahre" behält „Aktuell"
   (= 2 Pins). JSON-LD `blogPost`-Eintrag ergänzt.
3. **vitrine.html:** Teaser-Card oben (Pin synchron „Neu"), älteste Card
   (Frauenspuren, 3. Mai) rausgeworfen → wieder 4 Cards.
4. **sitemap.xml:** Eintrag prio 0.7, hreflang de + x-default (DE-only).
5. **llms.txt:** Eintrag in der DE-Blog-Sektion (ASCII/ue-ae-oe wie üblich).

Verifiziert lokal über `localhost:3016` (launch.json-Server `iappear-website`):
Blog-Index-Card + Pins headless gescreenshottet und angeschaut.

## Bewusst NICHT angefasst

- `blog/dornbirn-auf-eigene-faust.html` (zweiter vorbereiteter Artikel) bleibt
  untracked liegen — Maggy: „den anderen haben wir schon" (das Thema deckt der
  live Artikel `vorarlberg-auf-eigene-faust.html` ab). Bei Bedarf später klären,
  ob er gelöscht oder umgearbeitet wird.
- Verwaiste Dateien ohne Referenz aus einer früheren Entwurfsfassung bleiben
  untracked: `blog/figures/grafik_07a_timeline.html`,
  `blog/figures/grafik_11a_ki-arbeitsweise.html`, `blog/images/07-125-jahre-hero.jpg`.
  → Aufräum-Kandidaten, Entscheidung bei Maggy.
- EN-Version: keine (neuere Artikel sind DE-only, Konvention Session 45).

## Nächste Schritte (optional)

- GSC: URL zur Indexierung einreichen (macht Maggy gelegentlich manuell).
