# iappear.at – Website Rebuild

## Projekt

Rebuild der Website iappear.at als statisches HTML/CSS/JS Projekt.
Hosting: GitHub Pages (wuola.github.io/iappear-website)
Ziel-Domain: iappear.at (Umleitung kommt ganz am Schluss)

## Stack

- HTML5, CSS3, Vanilla JavaScript
- Keine Frameworks, kein Build-Tool
- Animationen als fertige SVG-Snippets vorhanden

## Design

- Hintergrund: #0a0a0a (fast schwarz)
- Text: #ffffff / #e0e0e0
- Akzentfarbe: Gold/Gelb (#c9a84c oder ähnlich)
- Stil: elegant, dunkel, modern
- Referenz: aktuelle Seite auf iappear.at ansehen

## Seitenstruktur

### Startseite (index.html) – eine lange Scroll-Seite:

- Hero: Logo, Claim "Die Plattform für digitale Erlebnisse", App-Mockup, Buttons zu i.history / i.identity / i.grow
- Netzwerk-Visualisierung: verbundene Rundgang-Nodes (SVG+JS)
- Kategorien-Teaser: i.history, i.identity, i.grow
- Features-Liste
- Vitrine: Kacheln (wird regelmäßig erweitert)
- Über uns: Marilena Tumler + Maggy Haidacher

### Unterseiten:

- i-history.html (Rundgänge werden erweitert)
- i-identity.html (Rundgänge werden erweitert)
- i-grow.html (Rundgänge werden erweitert)
- leistungen.html
- user-guide.html
- kontakt.html
- faqs.html
- datenschutz.html
- agb.html
- impressum.html

## Editierbare Datenbereiche (wichtig!)

Diese Dateien sind so gebaut, dass die Nutzerin sie OHNE Code-Kenntnisse bearbeiten kann:

- `js/data/vitrine.js` → Vitrine-Kacheln auf der Startseite
- `js/data/rundgaenge.js` → Rundgänge auf i-history, i-identity, i-grow

Immer klar kommentieren: `// HIER BEARBEITEN`

## Navigation

Einheitliche Navigation auf allen Seiten (als wiederverwendbares JS-Include).
Menüpunkte: Features, Kategorien, Leistungen, Über uns, Kontakt, Vitrine, User Guide

## Aktueller Stand

- Session 0 (Setup): abgeschlossen
- Session 1 (Startseite): als nächstes
- Sessions 2-5: geplant

## Wichtige Hinweise

- Mobile Responsive von Anfang an!
- SEO Meta-Tags auf jeder Seite
- llms.txt im Root anlegen (am Ende)
- Nutzerin ist kein Developer – Kommentare im Code auf Deutsch und sehr verständlich halten
