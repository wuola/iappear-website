# iappear-website

Statischer Rebuild von **iappear.at** als HTML/CSS/JS-Projekt, gehostet auf GitHub Pages.

**Live-Preview:** https://wuola.github.io/iappear-website

## Worum geht's?

i.appear ist eine Plattform fuer digitale Stadttouren. Die alte Seite (Readymag) rendert per JavaScript und ist deshalb fuer Suchmaschinen und LLMs nicht lesbar. Dieses Repo baut die Seite als reines statisches HTML neu, damit der Inhalt fuer Crawler sichtbar ist und einfache Pflege moeglich wird.

## Stack

- HTML5, CSS3, Vanilla JavaScript
- Keine Frameworks, kein Build-Tool
- Hosting via GitHub Pages

## Ordnerstruktur

```
.
├── index.html              ← Startseite
├── i-history.html          ← Kategorie-Subpages
├── i-dentity.html
├── i-grow.html
├── workflow.html           ← Workflow & Leistungen
├── user-guide.html
├── kontakt.html
├── faqs.html
├── impressum.html
├── agb.html                ← Stub
├── datenschutz.html        ← Stub
│
├── css/                    ← global / layout / components / animations
├── js/
│   ├── data/
│   │   ├── vitrine.js      ← HIER BEARBEITEN: Vitrine-Kacheln
│   │   └── rundgaenge.js   ← HIER BEARBEITEN: Rundgang-Daten
│   ├── main.js
│   ├── network.js
│   └── features.js
├── assets/svg/             ← Icons, Logos, Targets ...
└── _doku/                  ← Projekt-Doku + Recon-Notizen
```

## Inhalte pflegen (ohne Code-Kenntnisse)

Zwei Dateien sind fuer die regelmaessige Pflege gedacht:

- `js/data/vitrine.js` — Kacheln in der Vitrine auf der Startseite
- `js/data/rundgaenge.js` — Rundgaenge auf den Kategorie-Seiten (i.history, i.dentity, i.grow)

Beide Dateien beginnen mit einem Kommentarblock `HIER BEARBEITEN`, der erklaert, wie neue Eintraege hinzugefuegt werden. Einfach einen bestehenden Block kopieren, Texte anpassen, speichern.

## Detaillierte Doku

Siehe `_doku/projektdoku.md` fuer Sessions, Stand der Arbeit und offene Punkte.

Recon-Notizen aus der Live-Site unter `_doku/recon/`.
