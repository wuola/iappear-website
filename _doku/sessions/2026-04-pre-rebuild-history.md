# Pre-Rebuild-Notizen (Sessions 0-5.5, Maerz-April 2026)

**Quelle**: extrahiert aus dem `Session-Notizen`-Block der archivierten `_doku/projektdoku.md` (Stand April 2026, vor dem CLAUDE.md-Refactor am 2026-05-02).

**Wichtig**: Diese Notizen verwenden eine aeltere Session-Nummerierung (z.B. 'Session 4.5 - Widgets + Animationen'), die nicht 1:1 zu den Sessions in der spaeteren CLAUDE.md passt. Die Inhalte sind als historischer Kontext zu verstehen - die kanonischen Session-Logs sind die anderen Einzeldateien in diesem Ordner.

---

### Session 0 — Setup (03.03.2026)
- Readymag CSR-Problem identifiziert
- Entscheidung: Rebuild als statisches HTML/CSS/JS Projekt
- GitHub Desktop installiert, Obsidian Git Plugin installiert
- Korrekte Seitenstruktur geklärt: 1 lange Startseite + 10 Unterseiten

### Sessions 1-3 — Inhalte (April 2026)
- Recon-Phase: Live iappear.at via Chrome-Extension besucht, Texte aller Sektionen und Subpages über `get_page_text` extrahiert
- Recon-Notizen unter `_doku/recon/startseite-notes.md` und `_doku/recon/unterseiten-notes.md`
- Startseite vom alten Grob-Bau auf Recon-Inhalte umgestellt (Hero, Kategorien, Netzwerk-Nodes, Vitrine, Über uns, Footer)
- Alle Subpages mit echten Texten aus der Live-Site gefüllt
- Daten-Files (vitrine.js, rundgaenge.js) mit echten Inhalten befüllt + klar kommentiert für nicht-technische Pflege

### Session 5.5 — Professional Polish (11.04.2026)
- **Rundgang-Deep-Links**: Live iappear.app Routes aus dem Next.js-State der App extrahiert (10 Routen gefunden). Alle "Zum Rundgang" Buttons auf i-history / i-dentity / i-grow auf die echten `iappear.app/de/routes/{region}/{slug}?view=list` URLs umgestellt (hist.appear, Stadtspuren, Barockbaumeister, See Runde, Sprechender Baum, Buntes Dornbirn, Zusammenwachsen, Ein Oktobertag)
- **404.html**: eigene Fehlerseite im i.appear-Design mit 3 Quicklinks (Startseite, Kategorien, Kontakt). Von GitHub Pages automatisch als 404 geserved
- **OG-Image**: 1200x630 SVG+PNG (52KB) mit Logo, Target, Claim und 3 Kategorie-Dots. PNG erzeugt per Canvas-Renderer im Browser. `og:image`-Meta auf allen 11 Seiten auf das neue Asset + Twitter-Card auf `summary_large_image`
- **Schema.org JSON-LD** auf `index.html`: Organization + WebSite + LocalBusiness mit Adresse, Telefon, Mail. BreadcrumbList-JSON-LD auf allen Subpages
- **Visuelle Breadcrumbs** auf allen Subpages (`<nav class="breadcrumb">` mit "Startseite / Aktuelle Seite"), darunter die page-header. CSS in `components.css`
- **Back-to-top-Button Polish**: Unicode `&uarr;` durch rundes Floating-Button-Design mit SVG-Arrow-Icon ersetzt. Faded ein/aus beim Scrollen (`.is-visible` Class, bereits in `main.js` gesetzt)
- **Print-Stylesheet**: `@media print` in `animations.css`. Schwarz auf weiss, Navigation/Footer/Animationen ausgeblendet, URLs hinter externen Links ausgeschrieben, details offen dargestellt (fuer AGB/Datenschutz-Ausdruck)

**NICHT angefasst** (auf Entscheidung der Nutzerin): Kontaktformular-Funktionalitaet, Hero-Phone-Videos, Team-Fotos, Landing-Page-Dramaturgie, "Keine App/Tracking"-Claim-Positionierung, Farben/Kontraste (Marilenas Design). Besprechung 2026-04-13.

### Session 5 — Pre-Launch-Polish (11.04.2026)
Umfasst noch KEIN Go-Live — weitere inhaltliche Aenderungen kommen noch.
- `sitemap.xml` im Repo-Root angelegt (11 URLs, priorisiert: Startseite 1.0, Kategorien 0.9, ...)
- `llms.txt` auf llmstxt.org-Format umgebaut (h1 + Blockquote-Summary, Links pro Abschnitt)
- Vorarlberg- und Dornbirn-Wort-SVGs in der Startseite-Network-Section unter der Netzwerk-Viz platziert (`.network-caption`)
- Vitrine-Bilder werden jetzt als `<img loading="lazy" decoding="async">` gerendert statt als CSS-background. Spart Bandbreite bei Erstladen (Vitrine ist weit unten auf der Startseite)
- Partner-Logos und weitere `<img>`-Tags auf `index.html` mit `loading="lazy"` und `decoding="async"` versehen (ausser Hero-Logo, Feature-Icons, Kategorie-Badges — die laden sofort)
- Team-Fotos bleiben bewusst ausgeblendet (Marilenas aktuelles Foto ist nicht das finale, Maggys fehlt noch)

### Session 4.5 — Widgets + Animationen (11.04.2026)
- Lorbeerkranz als Inline-SVG in `index.html` (vorher `<img>`, damit CSS die Pfade nicht erreicht hat). Pfade haben `pathLength="1000"` und werden mit `stroke-dasharray`/`stroke-dashoffset` via CSS-`@keyframes laurel-draw` gezeichnet (5s, gestartet per IntersectionObserver auf `.hero__stage`).
- Rotierende Awards mittig im Kranz (`.hero__awards-rotator`): 3 Items (Smart City Dornbirn 2022, Innovation Call Vorarlberg 2025, Digitale Innovationen im Tourismus 2025), 18s Zyklus mit staggered animation-delay.
- Hero-Claim ("Die Plattform fuer digitale Erlebnisse") in 4 Zeilen-`<span>`s gesplittet, pro Zeile leicht unterschiedlicher Hover-Drift (Port aus `_doku/recon/widgets/header-anim-container-27ac988ab3.html`).
- Hero-Layout: `hero__stage` ist jetzt nur Kranz + Awards (aspect-ratio 822/686, max-width 420px). Die Phones liegen als eigener Block darunter — vorher waren sie im Stage und haben den Kranz unsichtbar hochgezogen.
- FAQ-Akkordeon gepolisht (Port aus `widget-69a99be150.html`): Uppercase-Summary, Plus-Icon (rotiert zu X beim Oeffnen), Border-Bottom als Trennlinie, smooth slide-down.
- User-Guide interaktive Demo (Port aus `ia-guide-container-*.html`): Toggle Rundgaenge/Naehe, 4 Schritte, Phone-Mockup + Prev/Next. JS inline in `user-guide.html`, CSS in `components.css`.
- Zwei neue SVGs im Repo (aus Recon): `assets/svg/logos/vorarlberg-wort.svg`, `assets/svg/logos/dornbirn-wort.svg` (noch nicht eingebaut, stehen fuer Session 5 bereit).

### Session 4 — Rechtliches & SEO (11.04.2026)
- AGB: Text per JavaScript aus Live iappear.at/agb/ gezogen (DOM-positionierte Spans), als JSON heruntergeladen, mit Python in 13 nummerierte Abschnitte + Mediationsklausel geparst, ASCII-konvertiert und in `agb.html` eingesetzt
- Datenschutz: Text ueber manuellen Copy/Paste der Nutzerin (Chrome blockte den Auto-Download); adsimple-Fassung 14.04.2022 mit 32 Sektionen nach ASCII konvertiert und in `datenschutz.html` eingesetzt
- SEO: Python-Patch fuegt auf allen 11 HTML-Seiten einen einheitlichen Head-Block ein: `description`, `author`, `canonical`, Open-Graph (title/description/url/type/site_name/locale/image) und Twitter Card
- Mobile Check: Preview-Server auf 375x812, keine horizontalen Overflows, AGB+Datenschutz+Startseite saubere Darstellung
