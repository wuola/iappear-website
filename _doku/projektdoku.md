🌐 iappear.at – Website Rebuild Projektdokumentation

Status: Setup läuft
Gestartet: März 2026
Ziel: Vollständiger Rebuild der iappear.at Website als statisches HTML/CSS/JS-Projekt mit GitHub Pages Hosting

## 🧩 Ausgangslage & Problem

Die aktuelle Website iappear.at wurde mit Readymag (Personal Plan) gebaut. Readymag nutzt Client-Side Rendering (CSR): Der Server liefert nur eine leere HTML-Hülle aus, der gesamte Content wird erst durch JavaScript im Browser zusammengebaut.

**Konsequenzen:**
- LLMs (Claude, ChatGPT etc.) können den Seiteninhalt nicht lesen
- Google-Crawler haben große Schwierigkeiten, den Content zu indexieren → SEO-Problem
- Keine Möglichkeit, Dateien (z.B. llms.txt) im Root-Verzeichnis abzulegen

**Lösung:**
Rebuild als statisches HTML/CSS/JS Projekt → Hosting auf GitHub Pages (kostenlos)

## 🗂️ Seitenstruktur (korrekt!)

**Startseite (index.html) – EINE lange Scroll-Seite mit folgenden Sektionen:**
- Hero (Logo, Claim, App-Mockup, Kategorie-Links)
- Über uns / Was macht i.appear besonders?
- Netzwerk-Visualisierung (verbundene Rundgang-Nodes)
- Kategorien (i.history, i.identity, i.grow – als Teaser)
- Features (Liste der App-Features)
- Vitrine (Kacheln – ✏️ wird regelmäßig erweitert)

**Unterseiten (je eigene HTML-Datei):**

| Seite | Datei | ✏️ Editierbar? |
|-------|-------|----------------|
| i.history | i-history.html | ✅ Rundgänge werden erweitert |
| i.identity | i-identity.html | ✅ Rundgänge werden erweitert |
| i.grow | i-grow.html | ✅ Rundgänge werden erweitert |
| Leistungen & Workflow | leistungen.html | selten |
| User Guide | user-guide.html | selten |
| Kontakt | kontakt.html | selten |
| FAQs | faqs.html | selten |
| Datenschutz | datenschutz.html | selten |
| AGB | agb.html | selten |
| Impressum | impressum.html | selten |

## ✏️ Regelmäßig zu aktualisierende Bereiche

Diese 4 Bereiche werden als einfach editierbare Datenlisten gebaut:

1. **Vitrine** (Startseite, Sektion "Vitrine") – neue Kacheln/Projekte
2. **i.history** – neue Rundgänge
3. **i.identity** – neue Rundgänge
4. **i.grow** – neue Rundgänge

**Prinzip:**

```javascript
// ✏️ NUR HIER BEARBEITEN – neue Kachel einfach hinzufügen:
const RUNDGAENGE = [
  {
    titel: "hist.appear",
    bild: "assets/images/hist-appear.jpg",
    beschreibung: "Zeitreise durch Dornbirn",
    link: "#"
  },
  // ↑ neue Einträge hier nach diesem Muster einfügen
]
```

## 🎨 Design

- **Hintergrund:** Schwarz / sehr dunkel
- **Text:** Weiß / hellgrau
- **Akzentfarbe:** Gold/Gelb (für Links, Highlights)
- **Schlüsselelement:** Netzwerk-Visualisierung mit verbundenen Rundgang-Nodes
- **Animationen:** SVG-Snippets vorhanden (von Gemini erstellt) ✅
- **Assets:** Alle Bilder, Illustrationen, Videos vorhanden ✅

## 🔧 Technischer Stack

| Element | Technologie |
|---------|-------------|
| Markup | HTML5 |
| Styling | CSS3 |
| Interaktivität | Vanilla JavaScript |
| Animationen | SVG (bestehende Snippets) |
| Netzwerk-Visualisierung | SVG + JS |
| Hosting | GitHub Pages |
| Deployment | Automatisch bei Push auf main |

## 📁 Korrekte Ordnerstruktur

```
iappear-website/
│
├── index.html              ← Startseite (lange Scroll-Seite)
├── i-history.html          ← Unterseite
├── i-identity.html         ← Unterseite
├── i-grow.html             ← Unterseite
├── leistungen.html         ← Unterseite
├── user-guide.html         ← Unterseite
├── kontakt.html            ← Unterseite
├── faqs.html               ← Unterseite
├── datenschutz.html        ← Unterseite
├── agb.html                ← Unterseite
├── impressum.html          ← Unterseite
│
├── llms.txt                ← LLM-Lesbarkeit
├── CLAUDE.md               ← Kontext für Claude Code (auto-gelesen!)
│
├── css/
│   ├── global.css          ← Farben, Typo, Reset
│   ├── components.css      ← Navigation, Cards, Buttons
│   └── animations.css      ← SVG-Animationen
│
├── js/
│   ├── data/
│   │   ├── vitrine.js      ← ✏️ Vitrine-Kacheln bearbeiten
│   │   └── rundgaenge.js   ← ✏️ Rundgänge bearbeiten
│   ├── network.js          ← Netzwerk-Visualisierung
│   └── main.js
│
└── assets/
    ├── images/
    ├── videos/
    ├── svg/                ← Animations-Snippets
    └── fonts/
```

## 📅 Session-Plan

### ✅ Session 0 (Setup)
- Obsidian Git Plugin installiert
- GitHub Desktop installiert
- GitHub Repository iappear-website angelegt
- GitHub Pages aktiviert
- Repository lokal geklont
- Claude Code-Tab mit Ordner verbunden
- CLAUDE.md angelegt

### Session 1 – Startseite
- Navigation + Footer (werden auf allen Seiten wiederverwendet)
- Hero-Bereich
- Über uns / Was macht i.appear besonders?
- Netzwerk-Visualisierung
- Features-Liste
- Vitrine (mit editierbarem Datensystem)

### Session 2 – Kategorie-Unterseiten
- i.history (mit editierbarem Rundgang-System)
- i.identity
- i.grow

### Session 3 – Weitere Unterseiten
- Leistungen & Workflow
- User Guide
- Kontakt (mit Formular)

### Session 4 – Rechtliches & Feinschliff
- FAQs, Datenschutz, AGB, Impressum
- Mobile Responsiveness
- SEO Meta-Tags

### Session 5 – Launch
- llms.txt erstellen
- Performance-Check
- Domain iappear.at auf GitHub Pages umleiten
- 🚀 Go Live!

## 🔗 Zugänge & Links

| Was | Info |
|-----|------|
| Aktuelle Website | https://iappear.at |
| Domain-Registrar | united-domains.de (Nameserver: ns.udag.de) |
| GitHub Repository | noch anzulegen |
| GitHub Pages URL | https://[username].github.io/iappear-website |

## 📝 Session-Notizen

### Session 0 – Setup (03.03.2026)
- Readymag CSR-Problem identifiziert
- Entscheidung: Rebuild als statisches HTML/CSS/JS Projekt
- GitHub Desktop installiert, Obsidian Git Plugin installiert
- Korrekte Seitenstruktur geklärt: 1 lange Startseite + 10 Unterseiten

**Weiter:** GitHub Repository anlegen → Clone → Claude Code verbinden
