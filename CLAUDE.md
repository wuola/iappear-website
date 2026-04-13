# iappear.at – Website Rebuild

## Projekt

Rebuild der Website iappear.at als statisches HTML/CSS/JS Projekt.
Hosting: GitHub Pages (wuola.github.io/iappear-website)
Ziel-Domain: iappear.at (Umleitung kommt ganz am Schluss)

**Hard constraints:**
- KEIN Publish auf iappear.at (Domain bleibt vorerst beim Readymag-Original)
- NICHT die bestehende Readymag-Seite anfassen
- Innerhalb des Repos volle Autonomie für alle anderen Entscheidungen

## Stack

- HTML5, CSS3, Vanilla JavaScript
- Keine Frameworks, kein Build-Tool
- Animationen als fertige SVG-Snippets vorhanden (assets/svg/)

## Design

- Hintergrund: #000 / #0a0a0a
- Text: #ffffff / #e0e0e0
- Kategoriefarben: i.history Gold (#D3A54A), i.dentity Blau (#769CA2), i.grow Gruen (#8E9F6A)
- Schrift: Roboto (Sans) + Serif-Stack (TheSerif-aehnlich)
- Stil: elegant, dunkel, modern
- Referenz: aktuelle Seite auf iappear.at

## Seitenstruktur

### Startseite (index.html) – eine lange Scroll-Seite:

1. Navigation (fixiert, CAPS)
2. Hero: Target-Icon + "i.appear" Serif gross + "digital city tours" + Lorbeerzweige links/rechts + Phone-Mockups + Awards + Kategorie-Links rechts
3. Ueber uns / Netzwerk: Geschichten-Intro + Netzwerk-Visualisierung der Rundgaenge (quadratische Kacheln)
4. Kategorien: 3 Spalten i.history / i.dentity / i.grow mit Target-Icons + Langtext
5. Features: 14 Multimedia-Features als Liste mit Phone-Preview
6. Vitrine: 14 Kacheln mit Auszeichnungen, Pressebeitraegen etc.
7. Ueber uns Sektion: Bios Marilena Tumler + Maggy Haidacher + Kontaktformular
8. Footer: 3-Spalten Quicklinks + Kontakt-Block + Partner-Logos + Copyright

### Unterseiten:

- i-history.html — Zeitreisen (Dornbirn, Au, Hard, ...)
- i-dentity.html — Regionale Identitaet (Dornbirn, weitere Regionen)
- i-grow.html — Medienbildung (Workshop-/Rundgang-Prinzipien + Schulprojekte + Demokratie/KI-Vision)
- workflow.html — Auftakt + Leistungen + 5-Schritt-Prozess
- user-guide.html — Short Guide
- kontakt.html — Texte + Adresse + Formular
- faqs.html — 10 echte FAQs in 4 Kategorien (mit FAQPage Schema)
- impressum.html — Firmen-Daten
- agb.html — Stub (juristischer Volltext fehlt noch)
- datenschutz.html — Stub (DSGVO-Volltext fehlt noch)

### Stadtrundgaenge (SEO Landing Pages, Hub-Modell):

- stadtrundgaenge.html — Hub-Seite mit Leaflet-Karte + Ort-Karten (alle Standorte)
- stadtrundgang-dornbirn.html — 10+ Touren, alle 3 Kategorien
- stadtrundgang-feldkirch.html — Barockbaumeister + 2 Schulprojekte
- stadtrundgang-hard.html — See Runde
- stadtrundgang-au.html — Barockbaumeister Franz Beer

Jede Stadtseite hat TouristAttraction Schema, SEO-optimierte Meta-Tags und Breadcrumb: Startseite > Stadtrundgaenge > [Ort]. Neuer Ort? Seite erstellen, Pin in Karte (JS in stadtrundgaenge.html), Sitemap + Burger-Menue updaten.

## Editierbare Datenbereiche (wichtig!)

Diese Dateien sind so gebaut, dass die Nutzerin sie OHNE Code-Kenntnisse bearbeiten kann:

- `js/data/vitrine.js` — Vitrine-Kacheln auf der Startseite (14 Eintraege)
- `js/data/rundgaenge.js` — Rundgaenge fuer alle 3 Kategorien

Beide haben am Anfang einen klaren `HIER BEARBEITEN`-Block mit Anleitung.

## Navigation

Einheitliche Navigation auf allen Seiten.
Menuepunkte: Features, Kategorien, Leistungen, Ueber uns, Kontakt, Vitrine, User Guide
Burger-Menue rechts mit 3 Gruppen: **Die Plattform** | **Stadtrundgaenge** (Alle Orte + Einzelstaedte) | **Backstage**

## Aktueller Stand

- Session 0 (Setup): abgeschlossen
- Session 1 (Startseite): abgeschlossen
- Session 2 (Kategorie-Subpages): abgeschlossen
- Session 3 (Workflow / User Guide / Kontakt): abgeschlossen
- Session 4 (Rechtliches): teilweise (Impressum + FAQs fertig, AGB + Datenschutz noch Stub)
- Session 4.5 (Recon-Sync mit Readymag-Editor, 2026-04-10):
  - Komplette Recon aller 11 Readymag-Pages in `_doku/recon/readymag-editor-*.md`
  - workflow.html, user-guide.html, impressum.html, i-dentity.html mit Recon-Texten gesynced
  - i-history.html, i-grow.html, kontakt.html bereits passend (verifiziert)
  - vitrine.js: 14 -> **22 Eintraege** in korrekter Reihenfolge
  - features.js: 14 Features mit Original-Subtiteln & -Texten aus Recon
  - index.html Burger-Menue: **Plattform / Backstage** Struktur (nur dort)
  - Methoden-Dok unter `_doku/recon/README.md` — Anleitung fuer kuenftige Sessions, wie man Readymag-Editor anzapft
- Session 5 (Launch): noch nicht begonnen
- Session 5.5 (SEO + Stadtrundgaenge-Hub, 2026-04-13):
  - **SEO-Offensive**: Keyword-Enrichment aller Seiten (Stadtrundgang, Audioguide, Dornbirn, Vorarlberg)
  - **i-grow.html massiv erweitert**: Demokratiebildung, KI-Bildung, Medienkompetenz, Pflichtfach, Partner
  - **i-dentity.html verdichtet**: von 394 auf 600+ Woerter
  - **FAQPage Schema** auf faqs.html (Google Rich Snippets)
  - **Stadtrundgaenge Hub-Modell**: stadtrundgaenge.html mit Leaflet-Karte + 4 Stadtseiten (Dornbirn, Feldkirch, Hard, Au)
  - **Burger-Menue** auf allen Seiten um Stadtrundgaenge-Gruppe erweitert (3 Gruppen: Plattform / Stadtrundgaenge / Backstage)
  - Sitemap + llms.txt aktualisiert, Footer-Link auf Hub statt nur Dornbirn

- Session 4.6 (Polish-Pass, 2026-04-10):
  - Burger-Menue Plattform/Backstage **auf allen 11 Seiten** ausgerollt
  - Netzwerk-Viz neu gebaut nach Original-Koordinaten aus `_doku/recon/widgets/network-container-afa4fcac0b.html` (8s Linien-Animation -> 7 Knoten faden ein, IntersectionObserver)
  - Hero-Logo: Serif-Text durch echtes `assets/svg/logos/logo-lang-weiss.svg` ersetzt
  - Roboto Variable Font selbst gehostet (`assets/fonts/`), Google-Fonts-Link aus allen 9 HTMLs raus -> DSGVO + schneller
  - Mobile-Feinschliff: Breakpoints 540/720/960/1080, Hero stapelt sauber, Features/Vitrine/Team responsive
  - Favicon (`assets/favicon.png`) auf allen 11 Seiten verlinkt
- Session 4.7 (Asset-Integration, 2026-04-10):
  - **Vitrine** komplett mit Bildern: 20/22 Kacheln haben `assets/images/vitrine/*.png` (2 fehlen: Florenz 2023, Podiumsdiskussion PH Vorarlberg)
  - **Feature-Videos** eingebunden: 13 mp4s in `assets/videos/features/`, `js/features.js` injiziert beim Hover/Klick automatisch das passende Video in den Phone-Mockup (autoplay/loop/muted/playsinline)
  - **Partner-Logos**: 14 SVGs aus `assets/svg/partner/` als echte `<img>`-Tags im Footer, schwarze Logos werden mit `filter: brightness(0) invert(1)` weiss gemacht
  - **Lorbeerkranz** als statisches SVG (`assets/svg/logos/lorbeerkranz.svg`) hinter den Hero-Phones platziert
  - **Kategorie-Badges**: i-history/i-dentity/i-grow Buttons aus `assets/svg/buttons/` (Layout muss noch ueberarbeitet werden, siehe offen)
  - **Cache-Bust** `?v=2` auf alle JS-Dateien in index.html (Browser-Cache-Falle bei `js/data/vitrine.js`)
  - **67 Readymag-Widgets** extrahiert in `_doku/recon/widgets/`, bisher nur `network-container` verwendet — Rest siehe "Was noch offen ist"
- Session 4.8 (Merge & GitHub Pages Test, 2026-04-10):
  - Ersten kompletten Stand auf `main` gemerged & gepushed
  - Live-Test-Link: https://wuola.github.io/iappear-website/ (Nutzerin kann jetzt vom Handy testen)

### Was noch offen ist
- **Kategorie-Buttons im Hero** (Nutzerin Vermerk: "sollte glaub ich eigentlich anders ausschauen") — aktuell falsch als `.card__badge` in den Kategorie-Karten
- **Hero-Layout** insgesamt — Nutzerin Vermerk: "da pass sowieso was mit dem layout nicht" — Feinschliff sobald alles drauf ist
- **Team-Fotos** (Marilena + Maggy) — Nutzerin reicht nach, aktuell Platzhalter mit TODO-Kommentaren
- **2 fehlende Vitrine-Bilder**: Florenz 2023, Podiumsdiskussion PH Vorarlberg
- AGB & Datenschutz Volltexte (siehe `_doku/recon/readymag-editor-legal-toc.md`)
- **Yellow Widgets** noch nicht eingebaut (siehe `_doku/recon/widgets/INDEX.md`):
  - `ia-guide-container-*.html` -> User Guide Slider mit Bild/Video-Rotation
  - `iappear-process-safe-1c5e16a08c.html` -> 5-Schritt-Prozess SVG fuer workflow.html
  - `glow-pure-*.html` -> Glow-Effekt fuer i-dentity
  - `ia-emergency-toggle-*.html` -> Toggle-Widget fuer i-history
  - `header-anim-container-27ac988ab3.html` -> Startseite Header-Animation
  - `i-appear-kranz-v4-fc4f90a579.svg` -> animierter Lorbeerkranz (Alternative zum statischen)
- Awards-Animation auf dem Lorbeerkranz
- Map-Kreis-Deko auf Kategorie-Seiten
- Domain-Umleitung (ganz am Schluss)

### Phone-Mockup-Konvention (wichtig fuer Feature-Sektion + Hero!)
Ueberall wo ein Smartphone+Screen gezeigt werden soll (Hero, Features, Kategorie-Seiten), wird der **CSS-only Mockup** aus `components.css` verwendet — KEINE fertigen Mockup-Bilder!

```html
<div class="phone">
  <div class="phone__screen">
    <video src="assets/videos/feature-XYZ.mp4" autoplay muted loop playsinline></video>
  </div>
</div>
```

Der Screen-Bereich hat `overflow: hidden` + `border-radius`, ein eingebettetes `<video>` oder `<img>` wird automatisch via `object-fit: cover` voll gefuellt. Der Mockup hat eine Notch und feste Aspect-Ratio 9/19. Hintergrund: Auf Readymag wurden die Phone+Screen Sachen als Workaround gebaut weil es keine guten Mockups gab — wir machen das jetzt sauber per CSS.

### Wichtig fuer Recon/Readymag-Arbeit
Wenn du nochmal Inhalte aus dem Readymag-Editor holen musst, lies **zuerst** `_doku/recon/README.md`. Dort steht: welche Tools, welche Stolperfallen (900-Zeichen-Limit, Content-Filter, @font-face-Rauschen), die Standard-Snippets und welche Page welche Editor-URL hat.

## Wichtige Hinweise

- Mobile Responsive von Anfang an!
- SEO Meta-Tags auf jeder Seite
- HTML-Files nutzen ASCII-Konvention (ae/oe/ue/ss statt ae/oe/ue/ss) — bestehender Stil im Repo
- Nutzerin ist kein Developer — Kommentare im Code auf Deutsch und sehr verstaendlich halten
- Eigenstaendig arbeiten, nicht bei jedem Schritt nachfragen
