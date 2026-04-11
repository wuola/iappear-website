🌐 iappear.at – Website Rebuild Projektdokumentation

Status: In Arbeit (Grundgerüst steht, Inhalte gefüllt)
Gestartet: März 2026
Stand: April 2026
Ziel: Vollständiger Rebuild der iappear.at Website als statisches HTML/CSS/JS-Projekt mit GitHub Pages Hosting

## 🧩 Ausgangslage & Problem

Die aktuelle Website iappear.at wurde mit Readymag (Personal Plan) gebaut. Readymag nutzt Client-Side Rendering (CSR): Der Server liefert nur eine leere HTML-Hülle aus, der gesamte Content wird erst durch JavaScript im Browser zusammengebaut.

**Konsequenzen:**
- LLMs (Claude, ChatGPT etc.) können den Seiteninhalt nicht lesen
- Google-Crawler haben große Schwierigkeiten, den Content zu indexieren → SEO-Problem
- Keine Möglichkeit, Dateien (z.B. llms.txt) im Root-Verzeichnis abzulegen

**Lösung:**
Rebuild als statisches HTML/CSS/JS Projekt → Hosting auf GitHub Pages (kostenlos)

## 🔒 Hard Constraints

- KEIN Publish auf iappear.at — die Domain bleibt vorerst beim Readymag-Original
- Die bestehende Readymag-Seite NICHT anfassen
- Innerhalb des Repos volle Autonomie für alle anderen Entscheidungen

## 🗂️ Seitenstruktur

**Startseite (index.html) – EINE lange Scroll-Seite mit folgenden Sektionen:**
1. Navigation (fixiert)
2. Hero (Target-Icon + i.appear-Serif + Lorbeerzweige + Phones + Awards + Kategorie-Links)
3. Über uns / Netzwerk-Visualisierung
4. Kategorien (i.history, i.dentity, i.grow – Teaser mit Target-Icons + Langtext)
5. Features (14 Multimedia-Features mit Phone-Preview)
6. Vitrine (14 Kacheln – ✏️ wird regelmäßig erweitert)
7. Über uns Sektion (Bios + Kontaktformular)
8. Footer (Quicklinks + Kontakt + Partner-Logos)

**Unterseiten (je eigene HTML-Datei):**

| Seite | Datei | ✏️ Editierbar? | Status |
|-------|-------|----------------|--------|
| i.history | i-history.html | ✅ Rundgänge werden erweitert | ✅ Inhalte da |
| i.dentity | i-dentity.html | ✅ Rundgänge werden erweitert | ✅ Inhalte da |
| i.grow | i-grow.html | ✅ Rundgänge werden erweitert | ✅ Inhalte da |
| Workflow & Leistungen | workflow.html | selten | ✅ Inhalte da |
| User Guide | user-guide.html | selten | ✅ Short Guide |
| Kontakt | kontakt.html | selten | ✅ Inhalte da |
| FAQs | faqs.html | selten | ✅ 10 echte FAQs |
| Impressum | impressum.html | selten | ✅ Inhalte da |
| AGB | agb.html | selten | 🔲 Stub (Volltext folgt) |
| Datenschutz | datenschutz.html | selten | 🔲 Stub (Volltext folgt) |

## ✏️ Regelmäßig zu aktualisierende Bereiche

Diese 4 Bereiche werden als einfach editierbare Datenlisten gepflegt:

1. **Vitrine** (Startseite, Sektion "Vitrine") – `js/data/vitrine.js`
2. **i.history** Rundgänge – `js/data/rundgaenge.js` (Knoten `history`)
3. **i.dentity** Rundgänge – `js/data/rundgaenge.js` (Knoten `dentity`)
4. **i.grow** Rundgänge – `js/data/rundgaenge.js` (Knoten `grow`)

**Prinzip:**

```javascript
// HIER BEARBEITEN – neuen Eintrag einfach hinzufügen:
window.IAPPEAR_VITRINE = [
  {
    titel: "Mein neuer Eintrag",
    text: "Beschreibung hier rein.",
    link: "#"
  },
  // ↑ neue Einträge nach diesem Muster einfügen
]
```

Beide Daten-Files haben am Anfang einen kommentierten `HIER BEARBEITEN`-Block mit Anleitung.

## 🎨 Design

- **Hintergrund:** #000 / #0a0a0a
- **Text:** #ffffff / #e0e0e0
- **Kategoriefarben:**
  - i.history Gold: `#D3A54A`
  - i.dentity Blau: `#769CA2`
  - i.grow Grün: `#8E9F6A`
- **Schrift:** Roboto (Sans) + Serif-Stack
- **Animationen:** SVG-Snippets vorhanden (assets/svg/)

## 🔧 Technischer Stack

| Element | Technologie |
|---------|-------------|
| Markup | HTML5 |
| Styling | CSS3 (global / layout / components / animations) |
| Interaktivität | Vanilla JavaScript |
| Animationen | SVG + CSS Keyframes |
| Netzwerk-Visualisierung | SVG + JS (`js/network.js`) |
| Hosting | GitHub Pages |
| Deployment | Automatisch bei Push auf main |

## 📁 Ordnerstruktur

```
iappear-website/
│
├── index.html              ← Startseite (lange Scroll-Seite)
├── i-history.html
├── i-dentity.html
├── i-grow.html
├── workflow.html
├── user-guide.html
├── kontakt.html
├── faqs.html
├── impressum.html
├── agb.html
├── datenschutz.html
│
├── CLAUDE.md               ← Kontext für Claude Code (auto-gelesen!)
│
├── css/
│   ├── global.css          ← Farben, Typo, Reset
│   ├── layout.css          ← Grids, Sektionen, Breakpoints
│   ├── components.css      ← Navigation, Cards, Buttons, Footer ...
│   └── animations.css      ← SVG-Animationen + Reveal
│
├── js/
│   ├── data/
│   │   ├── vitrine.js      ← ✏️ Vitrine-Kacheln bearbeiten
│   │   └── rundgaenge.js   ← ✏️ Rundgänge bearbeiten
│   ├── main.js
│   ├── network.js          ← Netzwerk-Visualisierung
│   └── features.js
│
├── assets/
│   ├── svg/
│   │   ├── icons/
│   │   ├── logos/
│   │   ├── targets/
│   │   ├── buttons/
│   │   └── dots/
│   └── (img/, video/, fonts/ — folgen)
│
└── _doku/
    ├── projektdoku.md
    └── recon/              ← Recon-Notizen aus iappear.at (Quelltexte)
```

## 📅 Session-Plan

### ✅ Session 0 (Setup) — abgeschlossen
- Obsidian Git Plugin installiert
- GitHub Repository iappear-website angelegt
- GitHub Pages aktiviert
- Repository lokal geklont
- Claude Code-Tab mit Ordner verbunden
- CLAUDE.md angelegt

### ✅ Session 1 — Startseite — abgeschlossen
- Navigation + Footer
- Hero (Target + i.appear + Lorbeerzweige)
- Über uns / Netzwerk-Visualisierung
- Kategorien-Sektion
- Features-Liste
- Vitrine (mit editierbarem Datensystem, 14 Einträge)
- Über uns Sektion mit Bios + Kontaktformular

### ✅ Session 2 — Kategorie-Unterseiten — abgeschlossen
- i-history (hist.appear, Stadtspuren, Frauenspuren, 125 Jahre, Barockbaumeister, See Runde)
- i-dentity (Sprechender Baum, Innenstadt erleben, Oberdorf entdecken)
- i-grow (Intro + Workshop-/Rundgang-Prinzipien + 4 Schulprojekte)

### ✅ Session 3 — Weitere Unterseiten — abgeschlossen
- Workflow (Auftakt + Leistungen + 5-Schritt-Prozess)
- User Guide (Short Guide)
- Kontakt (Texte + Adresse + Formular)

### ✅ Session 4 — Rechtliches & Feinschliff — abgeschlossen
- ✅ FAQs (10 echte FAQs)
- ✅ Impressum (echte Firmen-Daten)
- ✅ AGB Volltext (aus Live iappear.at gezogen, 13 Abschnitte + Mediationsklausel)
- ✅ Datenschutz Volltext (adsimple-Fassung 14.04.2022, 32 Sektionen)
- ✅ SEO Meta-Tags auf allen 11 Seiten (Title, Description, Canonical, OpenGraph, Twitter Card, Author, Locale)
- ✅ Mobile Responsiveness geprueft (375x812 Viewport, keine Overflows, Nav + Body ok)

### 🔲 Session 5 — Launch — noch offen
- Echte Bilder einbauen (Vitrine, Kategorien, Hero-Phones, Team-Fotos, Partner-Logos)
- Lorbeerzweig + Awards Animation einbauen
- llms.txt erstellen
- Performance-Check
- Domain iappear.at auf GitHub Pages umleiten
- 🚀 Go Live!

## 🔗 Zugänge & Links

| Was | Info |
|-----|------|
| Aktuelle Live-Website (Readymag) | https://iappear.at |
| Domain-Registrar | united-domains.de (Nameserver: ns.udag.de) |
| GitHub Repository | https://github.com/wuola/iappear-website |
| GitHub Pages URL | https://wuola.github.io/iappear-website |

## 📝 Session-Notizen

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
