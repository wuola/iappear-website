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
- i-dentity.html — Regionale Erlebnisse (Dornbirn, weitere Regionen)
- i-grow.html — Medienbildung (Workshop-/Rundgang-Prinzipien + Schulprojekte)
- workflow.html — Auftakt + Leistungen + 5-Schritt-Prozess
- user-guide.html — Short Guide
- kontakt.html — Texte + Adresse + Formular
- faqs.html — 10 echte FAQs in 4 Kategorien
- impressum.html — Firmen-Daten
- agb.html — Stub (juristischer Volltext fehlt noch)
- datenschutz.html — Stub (DSGVO-Volltext fehlt noch)

## Editierbare Datenbereiche (wichtig!)

Diese Dateien sind so gebaut, dass die Nutzerin sie OHNE Code-Kenntnisse bearbeiten kann:

- `js/data/vitrine.js` — Vitrine-Kacheln auf der Startseite (14 Eintraege)
- `js/data/rundgaenge.js` — Rundgaenge fuer alle 3 Kategorien

Beide haben am Anfang einen klaren `HIER BEARBEITEN`-Block mit Anleitung.

## Navigation

Einheitliche Navigation auf allen Seiten.
Menuepunkte: Features, Kategorien, Leistungen, Ueber uns, Kontakt, Vitrine, User Guide
Burger-Menue rechts mit allen Links.

## Aktueller Stand

- Session 0 (Setup): abgeschlossen
- Session 1 (Startseite): abgeschlossen
- Session 2 (Kategorie-Subpages): abgeschlossen
- Session 3 (Workflow / User Guide / Kontakt): abgeschlossen
- Session 4 (Rechtliches): teilweise (Impressum + FAQs fertig, AGB + Datenschutz noch Stub)
- Session 5 (Launch): noch nicht begonnen

### Was noch offen ist
- AGB & Datenschutz Volltexte (sehr lang, juristisch)
- Echte Bilder ueberall (Vitrine, Kategorien, Hero-Phones, Team-Fotos, Partner-Logos)
- Lorbeerzweig-SVG-Animation (Platzhalter)
- Awards-Animation
- Map-Kreis-Deko auf Kategorie-Seiten
- Feature-Beschreibungstexte (generisch, koennen praezisiert werden)
- llms.txt
- Mobile-Feinschliff
- Domain-Umleitung (ganz am Schluss)

## Wichtige Hinweise

- Mobile Responsive von Anfang an!
- SEO Meta-Tags auf jeder Seite
- HTML-Files nutzen ASCII-Konvention (ae/oe/ue/ss statt ae/oe/ue/ss) — bestehender Stil im Repo
- Nutzerin ist kein Developer — Kommentare im Code auf Deutsch und sehr verstaendlich halten
- Eigenstaendig arbeiten, nicht bei jedem Schritt nachfragen
