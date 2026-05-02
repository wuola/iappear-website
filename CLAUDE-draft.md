# iappear.at – Website Rebuild

> **Pflege-Regel für diese Datei (wichtig für Claude Code):** Diese CLAUDE.md ist Spielregeln + Inhaltsverzeichnis, kein Tagebuch. **Zielgröße: ≤ 200 Zeilen.** Wenn du etwas änderst: **refactor, nicht append.** Session-Details, Commit-Hashes, gelöste Probleme gehören in `_doku/sessions/` (pro Session eine eigene Datei, Naming `YYYY-MM-DD-session-NN-thema.md`). Hier rein kommt nur, was *permanent* gilt: Constraints, Konventionen, aktuelle offene Punkte. Wenn du eine Lehre aus einer Session ziehst, formuliere sie als Konvention im entsprechenden Block — keine Prosa-Blöcke pro Session.

## Was ist das hier

Rebuild der Website iappear.at als statisches HTML/CSS/JS-Projekt. Hauptmotivation: das alte Readymag-Original ist client-side gerendert und für Suchmaschinen + LLMs unsichtbar. Die neue Version ist crawlbar, SEO-optimiert und kostet vergleichbar zum Readymag-Personal-Plan. Launch in Deutsch zuerst, Englisch später.

- Hosting: GitHub Pages (`wuola.github.io/iappear-website`)
- Ziel-Domain: `iappear.at` (Umleitung kommt ganz am Schluss)
- Domain-Registrar: united-domains.de (Nameserver `ns.udag.de`)
- Live-Preview: https://wuola.github.io/iappear-website/
- Lokales Repo: `C:\Users\maggy\OneDrive\Dokumente\GitHub\iappear-website`

## Firmeninfo (für Edits an kontakt.html / impressum.html)

- Firma: **Marilena Tumler e.U.**
- Adresse: **Mozartstrasse 5 | 16, 6850 Dornbirn**
- Telefon: **+43 676 82554212**
- E-Mail: **info@iappear.app**
- Website: iappear.at

## Hard Constraints

- **KEIN Publish auf iappear.at** — Domain bleibt vorerst beim Readymag-Original.
- **NICHT die bestehende Readymag-Seite anfassen.**
- Innerhalb des Repos volle Autonomie für alle anderen Entscheidungen.
- Maggy ist **keine Entwicklerin** — Code-Kommentare auf Deutsch & verständlich.

## Stack

- HTML5, CSS3, Vanilla JavaScript — **keine Frameworks** (kein React, kein Vue, kein Bootstrap).
- **Kein npm/webpack/vite** — einziges Build-Tool ist `build.py` (Vitrine-Statisierung + Rundgang-Counts).
- **Leaflet** als JS-Bibliothek für Mini-Karten + Stadtrundgang-Hub-Karte. Tiles über Carto `dark_all` (kostenlos, kein API-Key).
- **Schriften lokal selbst gehostet** unter `assets/fonts/`: Roboto Variable (Body), TheSerif (LucasFonts: HP5 Plain, HP5 PlainIT, HP6 SemiBold, HP9 Black) für Headlines. Komplette LucasFonts-Familie (HP2-HP9 + TheSans + TheSans Mono) liegt unter `C:\Users\maggy\OneDrive\Dokumente\Promo_Iappear\NEUE_FONTS_2025\Fonts i.appear\` — bei Bedarf nachladen.
- Tooling: GitHub Desktop, `gh` CLI, Obsidian (Vault `iappear-website`), Claude Code, ffmpeg (Asset-Optimierung).

## Design

- Hintergrund: `#000` / `#0a0a0a` — Text: `#ffffff` / `#e0e0e0`.
- Kategoriefarben: i.history Gold `#D3A54A`, i.dentity Blau `#769CA2`, i.grow Grün `#8E9F6A`.
- Schrift-Mapping: H1 = TheSerif HP9 Black (oder Roboto Black 900 für kurze Brand-Worte), H2/H3 = TheSerif HP6 SemiBold, Body = Roboto. Endgültiges Mix-Konzept ist mit Marilena noch offen — siehe „Was offen ist".
- Designsystem: **glassy, strokeless** — Buttons / Burger / Chips / Tags mit `--glass-*` Variablen, Inset-Shadows, Backdrop-Blur. Sektions-Trenner als Lichtstreifen via `::before`-Pseudoelement. Zentrale Glas-Variablen in `css/global.css` (`:root`-Block): `--glass-bg`, `--glass-bg-hover`, `--glass-border`, `--glass-border-hover`, `--glass-shadow-top`, `--glass-shadow-bottom`, `--glass-highlight`, `--glass-glow`, `--glass-blur`. Eine Änderung dort wirkt auf alle Glas-Komponenten.
- **Phone-Mockup: CSS-only** aus `components.css` (`.phone` + `.phone__screen`). NIEMALS fertige Mockup-Bilder verwenden. Pattern: `<div class="phone"><div class="phone__screen"><img src="...poster.jpg"/><video src="...mp4" autoplay muted loop playsinline></video></div></div>` — img + video als persistente Layer (kein `innerHTML`-Replace, das produziert leere Frames).

## Navigation

Einheitlich auf allen Seiten:

- **Top-Nav (5 Links)**: Stadtrundgaenge | Features | Leistungen | Ueber uns | Vitrine. Sichtbar ab 720px Viewport, darunter nur Logo + Burger.
- **Burger-Menue rechts** mit 3 Gruppen: **Die Plattform** | **Stadtrundgaenge** | **Backstage**.
- Alle Nav-Links zeigen auf **eigene HTML-Seiten** — keine `#anchor`-Links mehr.

## Repo-Struktur

```
/index.html                        Landingpage
/i-history.html i-dentity.html i-grow.html   3 Kategorie-Seiten
/workflow.html user-guide.html kontakt.html faqs.html
/impressum.html agb.html datenschutz.html
/stadtrundgaenge.html              Hub-Seite mit Leaflet-Karte
/stadtrundgang-{ort}.html          Pro Stadt eine SEO-Landingpage
/vitrine/                          22 Artikel-Seiten
/blog/                             Blog-Artikel

/js/data/vitrine.js                ← EDITABLE (Marilena pflegt hier)
/js/data/rundgaenge.js             ← EDITABLE (Marilena pflegt hier)
/js/data/rundgang-stationen.js     105 Stationen über 11 Rundgänge (Mini-Karten)
/js/features.js                    14-Feature-Liste (img+video Layer-Pattern)
/js/network.js                     Netzwerk-Visualisierung Landingpage
/js/rundgang-map.js                Renderer für Mini-Karten

/css/global.css components.css animations.css layout.css
/assets/svg/ images/ videos/ fonts/

/build.py                          Build-Script (siehe unten)
/_doku/                            Detail-Doku (siehe Verweise unten)
/.claude/settings.json             Permissions (siehe unten)
```

## Editierbare Datenbereiche

`js/data/vitrine.js` und `js/data/rundgaenge.js` sind so gebaut, dass Marilena/Maggy sie ohne Code-Kenntnisse pflegen können — beide haben oben einen markierten `HIER BEARBEITEN`-Block mit Anleitung.

**Workflow nach jeder Änderung:** `python build.py` → `git commit` → `git push`.

`build.py` macht zwei Dinge:
1. **Vitrine-Kacheln**: Liest `vitrine.js` → rendert HTML zwischen `<!-- VITRINE-GRID-START -->` / `<!-- VITRINE-GRID-END -->` in `vitrine.html`.
2. **Rundgang-Counts**: Liest `rundgaenge.js` → zählt Rundgänge pro Stadt/Kategorie → injiziert in 6 HTMLs (index, stadtrundgaenge, 4 Stadtseiten). Marker: `<!-- COUNT:slug:START/END -->`, `<!-- CHIPS:kategorie:slug:START/END -->`, `<!-- CHIPS:hub:START/END -->`.

`rundgaenge.js` braucht pro Region ein `stadt`-Feld (City-Slug). Neuen Ort: Eintrag in `IAPPEAR_STAEDTE` am Ende der Datei → `python build.py` generiert automatisch Stadtseite, Karten-Pin, Sitemap, llms.txt, alle Counts.

## Cache-Bust-Workflow

Bei JEDER CSS- oder JS-Änderung Versionsnummer im `?v=...`-Query an allen `<link>`/`<script>`-Stellen hochzählen (Beispiel: `?v=20260502m` → `?v=20260502n`). Sonst hält der Browser-Disk-Cache das alte Stylesheet/Script.

GitHub Pages serviert HTML mit `Cache-Control: max-age=600` — neuer Stand ist im normalen Tab erst nach 10 Min sichtbar, im privaten Tab sofort. **Maggy testet IMMER in privaten Tabs.**

Bei Asset-Tausch (mp4/jpg-Bytes ändern, Dateiname bleibt): Cache-Bust auch im JS-Inline-String UND im HTML-Script-Tag synchron hochziehen.

## Permissions

**Eine Quelle der Wahrheit:** `.claude/settings.json` mit breiter Allowlist — Edit/Write/Read, Standard-Git-Befehle, `python`, `node/npm/npx`, `gh` CLI, WebSearch/WebFetch, Read auf die zwei Obsidian-Ordner, MCP Claude_Preview + Claude_in_Chrome.

`.claude/settings.local.json` ist leerer Stub (`{ "permissions": { "allow": [], "deny": [] } }`). Wenn Claude Code während einer Session Bash-Approvals reinschreibt, nach der Session wieder leeren.

**Schwester-Datei** unter `C:\Users\maggy\OneDrive\Dokumente\OBSIDIAN\.claude\settings.json` mit analoger Allowlist für Sessions, die direkt im Obsidian-Vault gestartet werden. Beide Dateien wirken erst in der **nächsten** Session.

**Pattern-Matching-Fallen:**
- `&&`-Chains: Bei `cd "..." && git status` matcht nur `Bash(cd:*)`. Lieber `cd` als eigenen Call, dann simple `git status` ohne Prefix.
- `git -C <pfad>` Prefix: matcht nicht die normalen `git ...:*`-Allowlist-Einträge. Darum ist `Bash(git -C:*)` als Pauschal-Erlaubnis drin.

**Deny-Liste (immer Rückfrage):** `git push --force/-f`, `git reset --hard`, `git checkout --` / `restore` / `clean`, `git rebase`, `git branch -D`, `git tag -d`, `rm` / `rmdir` / `del`.

**gh-Identitäts-Hook:** Maggy hat zwei GitHub-Accounts (`wuola` für i.appear, `tabulaphrasa` für ein anderes Projekt). `gh` CLI hat aber nur EINEN systemweit aktiven Account. Ein `SessionStart`-Hook in `.claude/settings.json` prüft, ob `gh` auf User `wuola` läuft, switcht sonst automatisch (`gh auth switch -u wuola`). Output beim Sessionstart: `[wuola-guard] OK: gh-Account ist wuola`.

## Konventionen & Lehren (nicht-verhandelbar)

- **Mobile responsive von Anfang an** — jede neue Seite/Komponente.
- **SEO Meta-Tags auf jeder Seite**: `title`, `description`, `og:*`, JSON-LD Schema wenn passend.
- **UTF-8 Umlaute (ä/ö/ü) in sichtbaren Texten.** Im Code (CSS-Kommentare, JS-Identifier, Dateipfade, Klassennamen) bleibt `ae/oe/ue`. `ß` immer als `ss` (User-Entscheidung).
- **Eigenständig arbeiten, nicht bei jedem Schritt nachfragen.** Maggy will Workflow, nicht Mikro-Bestätigungen.
- **Schritt-für-Schritt statt Batch.** Bei Asset-Optimierung: erst 1–2 Probe-Encodes pushen, Maggy auf Live verifizieren lassen, DANN Batch über alle Files. Preview ≠ Live (Headless-Chrome rendert auf 1× DPR mit Software-Decoder, echter Browser auf 2-3× DPR mit Hardware-Decoder — Komprimierungs-Artefakte sind im Preview unsichtbar, live sofort sichtbar).
- **KEINE Cache-Theorien bei Bugs.** Maggy testet immer in privaten Tabs. Wenn etwas live nicht stimmt, ist es ein Code-Bug. Echte Code-Analyse mit `curl` + DevTools statt Browser-Hypothesen.
- **KEINE Cloudflared-Vorschläge.** Setup existiert falls je nötig, aber nicht aktiv anbieten.
- **Bei „vor X Tagen ging's noch"-Bugs:** parallel eine alte Version live laufen lassen → trennt Code-Regression von Browser-Verhalten. Keine Hypothesen ohne Code-Beweis.
- **`.card { height: 100% }` NUR als Direct-Child von `.grid`** (`.grid > .card { height: 100% }`). Globale Regel hat in der Vergangenheit Card-Stretch-Bugs in Spalten-Layouts ausgelöst.

## Aktueller Stand (Mai 2026)

Site ist live auf https://wuola.github.io/iappear-website/. Alle 11 Hauptseiten + 4 Stadtseiten + 22 Vitrine-Artikel + Blog stehen. Designsystem (glassy/strokeless) konsistent. SEO durchgezogen. Verbleibend: Polish, einzelne Mobile-Bugs, Marilena-Abstimmungen, dann Domain-Umleitung.

## Was noch offen ist

- **Hero-Videos starten erst beim 2. Page-Load (Mobile)** — auf Maggys Standard-Mobile-Browser. Auf Chrome Mobile spielt es. Akzeptiert-offen, Bisect bisher nur bis 27.04. zurück. Code-Stand: `poster` + `preload="metadata"` sind drin, gibt im Bug-Fall wenigstens das Standbild.
- **Cache-Bust Burger-Menü auf alle 44 HTMLs ausrollen** — Polish ist nur in `index.html` (`?v=20260502f`). Per Python regex-replace auf alle HTMLs hochziehen.
- **Phone-Mockup-Notch (Dynamic Island)** verdeckt Content im Video-Bereich. Marilena-Entscheidung: Notch weg / kleiner / Content beschneiden.
- **Typografie-Konzept mit Marilena** — Mix-Konzept (Serif Subtitle, Sans Brand) vs. einheitlich? Auf 3 Kategorie-Seiten provisorisch Roboto Black 900 für h1.
- **User Guide Detail-Anpassungen** — Logik + Bilder stimmen, Detail-Pass laut Maggy noch offen.
- **Netzwerk-Visualisierung Layout** — Marilena-Abstimmung ob 18 Stations + 19 Verlinkungen so passen oder einzelne raus / Labels via `labelOffsetExtra` größer. Mobile-Geometrie (RX/RY_STATIONS = 125/260) ggf. nachziehen.
- **Hero-Layout Feinschliff** — Maggy: „da passt sowieso was mit dem Layout nicht".
- **Color-Contrast-Review** — Maggy schickt Screenshots (aus reinem HTML kein Kontrast bewertbar).
- **Mini-Karten Daten-Auffälligkeiten** — siehe `_doku/karten-todos.md` (3 Default-Koordinaten in hist.appear, Doppelpunkte in See Runde, Barockbaumeister-Bounds, Mapping-Annahmen i.grow). Stations-Master-Daten liegen im Obsidian-Vault unter `Koordinaten_alle_Stationen.md`.
- **Englische Version** — eigene spätere Phase.
- **Domain-Umleitung iappear.at → GitHub Pages** — ganz am Schluss.

## Versionen & Rollback

- **Aktuell auf main**: Kompakte Startseite + eigene Unterseiten (Umstellung: Commit `376e30e`).
- **Alte Lange-Scroll-Version**: Git-Tag `vor-experiment` (Commit `5c7fab7`).
- **Backup-Branch**: `experiment/startseite-neu` — NICHT löschen.

Rollback wäre `git reset --hard vor-experiment` + `--force` push — beides auf der Deny-Liste, also nur mit explizitem Maggy-OK.

## Weitere Doku

- `@_doku/sessions/README.md` — Inhaltsverzeichnis aller Session-Logs. **Pro Session eine eigene Datei** in `_doku/sessions/`, Naming `YYYY-MM-DD-session-NN-thema.md`. **Niemals an alte Session-Dateien anhängen** — neue Session = neue Datei. Bei jeder neuen Datei einen Eintrag oben in `README.md` ergänzen.
- `@_doku/recon/README.md` — Methodik fürs Anzapfen des Readymag-Editors (Tools, Stolperfallen, Snippets, Editor-URLs).
- `@_doku/fonts.md` — Schriften-Setup (LucasFonts-Familie, wie Marilena Schnitte ändert).
- `@_doku/karten-todos.md` — Mini-Karten-Daten-Auffälligkeiten.
- `@_doku/vitrine-bearbeiten.md` — Marilena-Anleitung für `vitrine.js`-Edits.
- `@_doku/_archiv/` — historische Dokus (alte CLAUDE.md, alte projektdoku.md), als Backup nicht aktiv.

**Außerhalb des Repos** (im Obsidian-Vault `C:\Users\maggy\OneDrive\Dokumente\OBSIDIAN\---i.appear---\`):

- `Stylesheet für Claude.md` — Marilenas Stylesheet-Referenz (in Arbeit, wird laufend ergänzt). **Aktiv.**
- `Koordinaten_alle_Stationen.md` — Master-Quelle für Stations-Koordinaten (105 Stationen über 11 Rundgänge), genutzt für Mini-Karten + Netzwerk-Visualisierung. **Aktiv.**
- `----WEBSITE NEU MIT HTML----/Masterplan.md` und eine ältere `CLAUDE.md` im Vault — **veraltet** (Stand bis ~Mai 2026), bleiben als Sicherheits-Backup liegen aber werden NICHT mehr gepflegt. Bei Widerspruch zu *dieser* Datei gilt *diese*. Wenn eine Claude-Code-Session direkt im Vault gestartet wird, am Anfang darauf hinweisen, dass die aktive Doku im Repo liegt.
