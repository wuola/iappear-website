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

- Firma (Marketing/Meta-Tags): **Marilena Tumler**
- Vollstaendiger Name (rechtsverbindlich, nur fuer Impressum/Datenschutz/AGB-Body): **Marilena Gabriele Tumler**
- Adresse: **Mozartstrasse 5/16, 6850 Dornbirn**
- Telefon: **+43 676 82554212**
- E-Mail (Marketing/Kontakt): **info@iappear.app**
- E-Mail (Impressum/Datenschutz-Verantwortliche): **marilena@iappear.app**
- Website: iappear.at
- Kleinunternehmerin nach § 6 Abs. 1 Z 27 UStG (keine UID-Nummer)
- GLN: 9110031812839
- GISA-Zahlen: 34641255 (Werbeagentur), 34641262 (Multimedia-Agentur), 34641279 (IT-Dienstleistungen)

## Hard Constraints

- **KEIN Publish auf iappear.at** — Domain bleibt vorerst beim Readymag-Original.
- **NICHT die bestehende Readymag-Seite anfassen.**
- Innerhalb des Repos volle Autonomie für alle anderen Entscheidungen.
- Maggy ist **keine Entwicklerin** — Code-Kommentare auf Deutsch & verständlich.

## Stack

- HTML5, CSS3, Vanilla JavaScript — **keine Frameworks** (kein React, kein Vue, kein Bootstrap).
- **Kontaktformulare via Tally** (Form-ID `J98VrY`, Account `maggy@iappear.app`, Free-Plan). Belgischer Anbieter, EU-Server, DSGVO-konform. Eingebettet als iframe in workflow.html + kontakt.html, Embed-Script async im `<head>` fuer Dynamic-Height. Notifications gehen an `maggy@iappear.app`.
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

Bei JEDER CSS- oder JS-Änderung **nur die Versionsnummer der geänderten Datei** im `?v=...`-Query an allen `<link>`/`<script>`-Stellen hochzählen (Beispiel: `components.css?v=20260502p` → `components.css?v=20260502q`). **Andere CSS-/JS-Dateien unangetastet lassen — sie haben unabhängige Versions-Nummern.** Sonst hält der Browser-Disk-Cache das alte Stylesheet/Script.

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
- **Meta-Description Länge: 70–160 Zeichen** (gemessen am gerenderten Text, also `&amp;`/`&quot;`/`&ndash;`/`&mdash;` zählen als 1 Zeichen). Längere meldet Bing als Error. Bei eingebetteten Anführungszeichen im Description-Wert **immer `&quot;`** verwenden, niemals `"` direkt — das bricht das HTML-Attribut und schneidet die Description ab. Gilt auch für zukünftige Blog/Vitrine-Artikel. (Lehre: 2026-05-05 Bing-Audit, 21 Descriptions waren zu lang, 3 wurden durch `"` zerschossen.)
- **UTF-8 Umlaute (ä/ö/ü) in sichtbaren Texten.** Im Code (CSS-Kommentare, JS-Identifier, Dateipfade, Klassennamen) bleibt `ae/oe/ue`. `ß` immer als `ss` (User-Entscheidung).
- **Eigenständig arbeiten, nicht bei jedem Schritt nachfragen.** Maggy will Workflow, nicht Mikro-Bestätigungen.
- **Schritt-für-Schritt statt Batch.** Bei Asset-Optimierung: erst 1–2 Probe-Encodes pushen, Maggy auf Live verifizieren lassen, DANN Batch über alle Files. Preview ≠ Live (Headless-Chrome rendert auf 1× DPR mit Software-Decoder, echter Browser auf 2-3× DPR mit Hardware-Decoder — Komprimierungs-Artefakte sind im Preview unsichtbar, live sofort sichtbar).
- **KEINE Cache-Theorien bei Bugs.** Maggy testet immer in privaten Tabs. Wenn etwas live nicht stimmt, ist es ein Code-Bug. Echte Code-Analyse mit `curl` + DevTools statt Browser-Hypothesen.
- **Bei „läuft nur auf iPhone nicht / spinnt"-Animations-Bugs IMMER zuerst „Bewegung reduzieren" abfragen.** iOS: Einstellungen → Bedienungshilfen → Bewegung → „Bewegung reduzieren". Wenn aktiv, schaltet iOS Safari `prefers-reduced-motion: reduce`-Regeln scharf — Animationen mit `animation: none` darin laufen nicht mehr, andere Animationen können flackern/abkacken weil iOS sie zusätzlich runterregelt. Auch im **Stromsparmodus** kann das automatisch aktiv werden. Diese Diagnose-Frage spart Stunden Code-Theorie. (Lehre: 2026-05-05 Mickey-Hand + Workflow-Animationen — beides war Marilenas iOS-Setting, nicht der Code.)
- **KEINE Cloudflared-Vorschläge.** Setup existiert falls je nötig, aber nicht aktiv anbieten.
- **Bei „vor X Tagen ging's noch"-Bugs:** parallel eine alte Version live laufen lassen → trennt Code-Regression von Browser-Verhalten. Keine Hypothesen ohne Code-Beweis.
- **`.card { height: 100% }` NUR als Direct-Child von `.grid`** (`.grid > .card { height: 100% }`). Globale Regel hat in der Vergangenheit Card-Stretch-Bugs in Spalten-Layouts ausgelöst.
- **CNAME-Datei NIEMALS vor DNS-Switch ins Repo pushen** — auch nicht als "Vorbereitung". GitHub Pages erkennt die Datei sofort beim Build, aktiviert die Custom Domain im Repo-Setting (sichtbar via `gh api repos/.../pages` als `cname: "..."`), und schaltet Live-301-Redirects von `wuola.github.io/iappear-website/...` auf die Domain. Vor erfolgtem DNS-Switch landen User auf der alten Domain (z.B. Readymag) → faktischer Live-Ausfall der neuen Site (Session 23 Vorfall). CNAME nur in der korrekten Phase-B-Reihenfolge anlegen.
- **GitHub Pages serviert KEINE Pretty-URLs ohne Konfiguration.** Datei `X.html` ist nur als `/X.html` erreichbar, **nicht** als `/X/` (das ist 404). Konsequenz: alle SEO-URLs in `<link rel="canonical">`, `<meta property="og:url">`, JSON-LD (`BreadcrumbList.item`, `TouristAttraction.url`, `ItemList.url`), `sitemap.xml`, `llms.txt` und `build.py`-Templates müssen exakt mit den Datei-Pfaden übereinstimmen — also mit `.html`-Endung. Sub-Verzeichnisse wie `/blog/` gehen nur weil `blog/index.html` existiert. Bei "Indexierungsanfrage abgelehnt" in Search Console: erst `curl -I` testen, nicht raten. (Session-26-Vorfall am 2026-05-04: alle Meta-URLs waren ohne `.html` → Google indexierte nur die Root-Seite, alle anderen 41 URLs waren faktisch unsichtbar. Fix: 46 Dateien.) Wenn man echte Pretty-URLs will, müssen HTMLs zu `slug/index.html` umstrukturiert werden — derzeit nicht geplant.

## Aktueller Stand (Mai 2026)

**🚀 LIVE auf https://iappear.at seit 2026-05-04 ~15:20 (Session 25).** Alle 11 Hauptseiten + 4 Stadtseiten + 22 Vitrine-Artikel stehen. Blog ist mit Vitrine verschmolzen (2 Bestandsartikel unter `/blog/`, Index leitet auf Vitrine weiter). Designsystem (glassy/strokeless) konsistent. SEO durchgezogen. Rechtstexte rechtskonform (Sessions 22-24). HTTPS gruen via Let's Encrypt (auto-renewed). www.iappear.at → 301 → iappear.at. GitHub Pages mit Custom Domain via `gh api repos/wuola/iappear-website/pages -X PUT` gesetzt — kein File-CNAME im Repo (GitHub legt es selbst auf source-branch an). Mail-MX bei `mx00.udag.de` / `mx01.udag.de` unveraendert geblieben. SEO-Sichtbarkeit > Perfektion.

**Google Search Console (Session 26, 2026-05-04 ~17:00):** Property `iappear.at` eingerichtet, `sitemap.xml` eingereicht (41 Seiten verarbeitet, ohne Fehler), 7 Top-URLs manuell zur Indexierung beantragt (Startseite + Stadtrundgaenge + 3 Kategorien + Features + Vitrine-Hub + Klassenraeumen-Artikel) — alle grün. Davor: Pretty-URL-Bug gefixt (Commit `5ebc850`, alle canonical/og:url/sitemap/llms.txt/build.py URLs auf `.html`).

**Bing Webmaster (Session 27, 2026-05-05):** Property `iappear.at` eingerichtet, Audit von `stadtrundgaenge.html` zeigte 2 Issues — Meta-Description zu lang (198 Zeichen) + 6 Bilder ohne alt (Leaflet-Marker). Beide Probleme behoben + präventiv 21 weitere zu lange Descriptions auf 70-160 gekürzt (Commit `35029cf`). Footer-Cleanup: redundanter "nach oben"-Inline-Link entfernt, schwebender Pfeil-Button reicht (`824c853`). iOS-Animations-Bugs (Mickey-Hand + Workflow-Icons) waren am Ende **Marilenas iOS-Setting "Bewegung reduzieren"**, nicht Code — Mickey bekam vorab noch iOS-Resilience-Hacks (`8883b8a`). Englisch-Version geplant in `_doku/englische-version.md`.

## Was noch offen ist

- **Englische Version** — eigene spätere Phase. Plan + Workflow in `_doku/englische-version.md` (Verzeichnis-Modell `/en/`, manueller Toggle, hreflang, alle ~41 Seiten, Übersetzung in separater Claude-Session, seitenweise).
- **Blog reaktivieren** wenn ClaudeCowork-Drafts überarbeitet sind (siehe Session 21 Doku — Reaktivierung = HTML-Comments raus auf vitrine.html + noindex-Tags raus aus 3 blog/*.html + sitemap/llms-Einträge zurück).

## Akzeptiert-offen (kein Launch-Blocker)

- **Hero-Videos starten erst beim 2. Page-Load (Mobile)** — nur auf Opera Mobile, andere Browser ok. Poster-Bild ist Fallback.
- **Color-Contrast-Review** — Status quo ist OK (Maggy 2026-05-03: keine Lösung griffbereit, akzeptiert).
- **Typografie-Konzept** — provisorisches Mix-Konzept passt fürs erste, ggf. später.
- **Tally-Form-Hoehe auf workflow.html** — Form-Container ~190px laenger als Text-Block daneben. In Session 23 empirisch angetestet: feste `height` ohne `dynamicHeight` ergibt eine interne iframe-Scrollbar (Submit-Button geht unter die Falte, Tally-Branding wird aber auch versteckt — Trade-off, hat Maggy mobil verworfen). Column-Layout im Tally-Editor: Mechanik existiert (Drag-Handle `⋮⋮`, [tally.so/help/columns](https://tally.so/help/columns)) aber nicht verifiziert ob Short-Answer + Email-Felder spaltenfaehig sind, plus Mobile faellt eh auf einspaltig zurueck. Alternativen: Name-Feld weglassen (-80px) oder Long-Answer-Initial-Rows reduzieren (Pro-Feature). Kein Launch-Blocker, weiter offen nach Launch.

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
- `@_doku/englische-version.md` — Plan + Workflow für die englische Site-Version (`/en/`-Verzeichnis-Modell, hreflang, seitenweise Übersetzung in separater Claude-Session).
- `@_doku/_archiv/` — historische Dokus (alte CLAUDE.md, alte projektdoku.md), als Backup nicht aktiv.

**Außerhalb des Repos** (im Obsidian-Vault `C:\Users\maggy\OneDrive\Dokumente\OBSIDIAN\---i.appear---\`):

- `Stylesheet für Claude.md` — Marilenas Stylesheet-Referenz (in Arbeit, wird laufend ergänzt). **Aktiv.**
- `Koordinaten_alle_Stationen.md` — Master-Quelle für Stations-Koordinaten (105 Stationen über 11 Rundgänge), genutzt für Mini-Karten + Netzwerk-Visualisierung. **Aktiv.**
- `----WEBSITE NEU MIT HTML----/Masterplan.md` und eine ältere `CLAUDE.md` im Vault — **veraltet** (Stand bis ~Mai 2026), bleiben als Sicherheits-Backup liegen aber werden NICHT mehr gepflegt. Bei Widerspruch zu *dieser* Datei gilt *diese*. Wenn eine Claude-Code-Session direkt im Vault gestartet wird, am Anfang darauf hinweisen, dass die aktive Doku im Repo liegt.
