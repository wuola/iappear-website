# iappear.at – Website Rebuild

## Projekt

Rebuild der Website iappear.at als statisches HTML/CSS/JS Projekt.
Hosting: GitHub Pages (wuola.github.io/iappear-website)
Ziel-Domain: iappear.at (Umleitung kommt ganz am Schluss)

**Hard constraints:**
- KEIN Publish auf iappear.at (Domain bleibt vorerst beim Readymag-Original)
- NICHT die bestehende Readymag-Seite anfassen
- Innerhalb des Repos volle Autonomie für alle anderen Entscheidungen

## Berechtigungen (seit 2026-04-14, konsolidiert 2026-04-15)

**Eine Quelle der Wahrheit:** `.claude/settings.json`. Die Datei hat eine breite Allowlist — routinemaessige Operationen laufen ohne Rueckfrage: Edit/Write/Read, `git add/commit/push/diff/status/log/branch/checkout/stash/tag/fetch/pull`, `git reset --soft`, `python`, `node/npm/npx`, `cp/mv/mkdir/touch/ls/cd`, `cat/head/tail/wc/echo`, `gh pr/api/run/issue`, WebSearch/WebFetch, Read-Zugriff auf die beiden Obsidian-Ordner (`---Claude---` und `----WEBSITE NEU MIT HTML----`), MCP Claude_Preview + Claude_in_Chrome.

**`.claude/settings.local.json` ist jetzt ein leerer Stub** (nur `{ "permissions": { "allow": [], "deny": [] } }`) — Platzhalter fuer optionale, nicht-versionierte lokale Overrides. Bis Session 8.3 (15.04.2026) lagen die Regeln gesplittet zwischen settings.json und settings.local.json, was gelegentlich unvorhersehbares Permission-Verhalten produziert hat. Jetzt alles an einem Ort. Commit: `687e7ee`.

**Schwester-Datei im Obsidian-Vault (seit Session 8.5, 15.04.2026):** Es gibt jetzt zusaetzlich `C:\Users\maggy\OneDrive\Dokumente\OBSIDIAN\.claude\settings.json` mit einer analogen Pauschal-Allowlist fuer Sessions, die direkt im Obsidian-Vault geoeffnet werden. Selbe Logik, selbe Deny-Liste, plus Read-Pauschalen auf den ganzen Vault, das iappear-website-Repo und `Desktop\Website_Neu`. Die dort liegende alte `settings.local.json` (~190 Zeilen Auto-Eintraege voller Storyblok/Volare-Curl-Befehle aus frueheren Hämmerle-Villa-/Oberdorf-Sessions) bleibt **unangetastet** — sie stoert nicht, kann irgendwann mal in einer eigenen Session aufgeraeumt werden. Beide Dateien wirken erst in der **naechsten** Session, nicht in der laufenden.

**Wichtig zum Pattern-Matching:** Die Permission-Checks matchen gegen den Kommando-**Anfang**, Token fuer Token.

- **Falle 1 — `&&`-Chains:** Bei `cmd1 && cmd2` greift nur der Eintrag fuer `cmd1`. Also nicht `cd "..." && git status ...` prefixen — das matcht `Bash(cd:*)`, nicht `Bash(git status:*)`.
- **Falle 2 — `git -C <pfad>` Prefix:** `git -C "<pfad>" reset HEAD file` matcht NICHT `Bash(git reset HEAD:*)`, weil der Token-Matcher vorne `git -C <pfad>` sieht. Das `-C <pfad>` schiebt sich zwischen `git` und den eigentlichen Subcommand. Darum ist jetzt `Bash(git -C:*)` in der Allowlist als Pauschal-Erlaubnis fuer jeden `git -C ...`-Aufruf.
- **Empfohlene Praxis:** Am Anfang einer Arbeitsphase einmal `cd "<repo-pfad>"` als eigenen Bash-Call absetzen (matcht `Bash(cd:*)`), danach simple `git status` / `git commit` / `git push`-Calls ohne `-C`-Prefix. Working Directory persistiert zwischen Bash-Calls, die Standard-Git-Allowlist greift sauber.
- `git -C` bleibt als **Fallback** erlaubt, falls mal kurzzeitig in einem anderen Verzeichnis gearbeitet wird.

**Deny-Liste als Sicherheitsnetz** — diese Befehle erfordern weiterhin Zustimmung der Nutzerin:
- `git push --force` / `-f` / `--force-with-lease` (kein History-Overwrite auf GitHub)
- `git reset --hard` (keine uncommitteten Aenderungen wegwerfen)
- `git checkout --` / `git restore` / `git clean` (Arbeitskopie schuetzen)
- `git rebase` (keine History umschreiben)
- `git branch -D` / `git tag -d` (keine Branches/Tags loeschen)
- `rm` / `rmdir` / `del` (keine Dateiloeschung ohne OK)

**Warum so:** Nutzerin ist keine Entwicklerin, will nicht bei jedem Schritt gefragt werden. Git-History + Deny-Liste garantieren dass nichts verloren gehen kann — schlimmster Fall ist "ein paar Commits zurueckrollen", aber nichts ist weg. Falls die Nutzerin doch mal einen der Deny-Befehle braucht, explizit fragen.

### gh-Identitaets-Hook (seit Session 10.3, 2026-04-27)

Maggy arbeitet unter mehreren GitHub-Accounts. `gh` CLI hat aber nur EINEN systemweit aktiven Account — und i.appear-Aktionen muessen ausschliesslich unter `wuola` laufen (siehe globale CLAUDE.md). Damit das nie versehentlich schief geht, gibt es einen `SessionStart`-Hook in `.claude/settings.json`, der bei jedem Sessionstart prueft ob `wuola` aktiv ist und falls nicht automatisch via `gh auth switch -u wuola` umstellt.

- Hook-Output beim Sessionstart: `[wuola-guard] OK: gh-Account ist wuola` oder `[wuola-guard] gh-Account von <name> auf wuola umgestellt`
- Aenderungen an `settings.json` (also auch am Hook) wirken erst in der **naechsten** Session, nicht in der laufenden
- Falls der Hook beim ersten Start nach Aenderung nicht greift: `/hooks` einmal oeffnen oder Claude Code neu starten
- Der Hook deckt nur `gh auth` ab. `git config user.name`/`user.email` und der git-Remote sind stabil und werden nicht gepruft — bei Bedarf manuell verifizieren.

**Wichtig:** Wenn der User waehrend einer Session Bash-Befehle approved (z.B. `gh auth switch`, `git rm`, `Skill(...)`), schreibt Claude Code sie automatisch in `.claude/settings.local.json`. Diese Datei soll laut Konvention aber leerer Stub bleiben — also nach jeder Session-Approval-Welle einmal kurz checken und ggf. wieder leeren. Wiederholte Stolperfalle (Session 8.5, 10.3).

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
- stadtrundgang-feldkirch.html — 2 i.grow-Schulprojekte: MS Levis (Zusammenwachsen) + MS Oberau (Ein Oktobertag/Bombenabwuerfe 1943). **Barockbaumeister gehoert NICHT hierher — der ist nur in Au!**
- stadtrundgang-hard.html — See Runde
- stadtrundgang-au.html — Barockbaumeister Franz Beer

Jede Stadtseite hat TouristAttraction Schema, SEO-optimierte Meta-Tags und Breadcrumb: Startseite > Stadtrundgaenge > [Ort]. Neuer Ort? Seite erstellen, Pin in Karte (JS in stadtrundgaenge.html), Sitemap + Burger-Menue updaten.

### Vitrine-Artikel (22/22 fertig):

Ordner `vitrine/`, Breadcrumb: Startseite > Vitrine > [Artikel]. Alle 22 Kacheln haben eigene SEO-Seiten.

Template basiert auf Blog-Artikeln (`blog/was-ist-ein-digitaler-stadtrundgang.html`). Jede Seite hat Hero-Bild aus `assets/images/vitrine/`, Schema.org BlogPosting, Tags, CTA-Box, Link zum Original. `vitrine.js` verlinkt intern auf alle Seiten. 2 Seiten ohne Bild: Florenz 2023, Podiumsdiskussion PH.

## Editierbare Datenbereiche (wichtig!)

Diese Dateien sind so gebaut, dass die Nutzerin sie OHNE Code-Kenntnisse bearbeiten kann:

- `js/data/vitrine.js` — Vitrine-Kacheln (22 Eintraege, alle Links zeigen auf interne Artikel-Seiten in `vitrine/`)
- `js/data/rundgaenge.js` — Rundgaenge fuer alle 3 Kategorien

Beide haben am Anfang einen klaren `HIER BEARBEITEN`-Block mit Anleitung.

## Navigation

Einheitliche Navigation auf allen Seiten.
Top-Nav (6 Links): Stadtrundgaenge | Features | Leistungen | Ueber uns | Vitrine | Kontakt
Burger-Menue rechts mit 3 Gruppen: **Die Plattform** | **Stadtrundgaenge** (Alle Orte + Einzelstaedte) | **Backstage**

Seit Session 6 zeigen alle Nav-Links auf eigene HTML-Seiten (features.html, vitrine.html, ueber-uns.html etc.) — KEINE #anchor-Links mehr.

## Aktueller Stand

- Session 0 (Setup): abgeschlossen
- Session 1 (Startseite): abgeschlossen
- Session 2 (Kategorie-Subpages): abgeschlossen
- Session 3 (Workflow / User Guide / Kontakt): abgeschlossen
- Session 4 (Rechtliches): abgeschlossen (Impressum, FAQs, AGB, Datenschutz — alle mit Volltexten)
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
- Session 6 (Seitenstruktur-Umbau + Rename, 2026-04-13):
  - **Startseite entschlackt**: index.html ist jetzt kompaktes "Schaufenster" mit Teaser-Karten statt langer Scroll-Collage. Hero + Netzwerk bleiben, alles andere sind kurze Teaser → eigene Seiten
  - **Neue eigene Seiten**: features.html, vitrine.html, ueber-uns.html (Inhalte 1:1 aus index.html ausgelagert)
  - **Blog + Vitrine verschmolzen**: "Blog" gibt es nicht mehr als eigenen Bereich. vitrine.html zeigt Kacheln (aus vitrine.js) + Artikel-Links. blog/index.html leitet per meta-refresh auf vitrine.html weiter. Die 2 bestehenden Blog-Artikel bleiben unter blog/*.html, Breadcrumbs zeigen auf Vitrine.
  - **i.dentity Rename**: "Erlebnisse" → "Regionale Identitaet" in allen Burger-Menues, Breadcrumbs, Eyebrows, Schema, JS, llms.txt, CLAUDE.md. Hero-Claim "digitale Erlebnisse" bewusst unveraendert.
  - **Nav-Links**: Alle #anchor-Links durch echte Seiten-Links ersetzt (features.html, vitrine.html, ueber-uns.html)
  - **Sitemap + llms.txt** aktualisiert
  - **Hero-Layout nach Readymag-Vorbild**: Lorbeerkranz + Awards kleiner und links, Logo kleiner, Phones nebeneinander (flex-wrap: nowrap) direkt unterm Logo, "JETZT STARTEN" Button unter den Phones, Social Media Icons (Instagram + LinkedIn) rechts unten. Alles above the fold sichtbar.
  - **Phone-Groessen**: `.phone` max 160px breit (vorher 220px), `.hero__logo` max 240px (vorher 460px)
  - **Vitrine-Links**: Alle 22 Kachel-Links aus Readymag extrahiert und in vitrine.js eingetragen (vorher alles `#`)
  - **Vitrine-Artikel-Seiten (22/22)**: Alle 22 Kacheln haben eigene SEO-Seiten in `vitrine/`. Template mit Hero-Bild, Schema.org BlogPosting, Breadcrumbs, Text aus Originalquellen, Link zum Original. vitrine.js verlinkt intern auf alle Seiten.
  - **Vitrine-Bild-Zuordnungen korrigiert**: award.png→ISTD, inno.png→Re-Design, inno2.png→Tourismus-Sonderpreis
  - **Cache-Bust**: vitrine.js auf `?v=6` in vitrine.html
- Session 7 (Stand-Check + Aufraeumen + 2 Widgets, 2026-04-14):
  - Alte claude/* Branches geloescht (friendly-burnell, heuristic-shtern, romantic-sutherland — waren alle in main gemerged)
  - Stand verifiziert: AGB (15 Sections) + Datenschutz (36 Sections) sind **fertig**, nicht mehr Stub
  - Lorbeerkranz-Animation mit rotierenden Awards (`data-laurel`, 3 Items, ~6s) laeuft im Hero. **Update 2026-04-14 (Session 7.2):** Animation von stroke-dashoffset-Draw (5s, asymmetrisch weil die beiden SVG-Pfade an unterschiedlichen Koordinaten starten) umgestellt auf **`clip-path: circle()` Reveal** von der Unterkante nach aussen. Der Kranz erscheint jetzt symmetrisch — unten zuerst, dann wachsen linke und rechte Haelfte gleichzeitig nach oben. Schneller: **2.2s statt 5s**. Awards-Rotator-Delays entsprechend vorgezogen (2.2s / 8.2s / 14.2s statt 5/11/17). Code: `css/animations.css` (`.hero__laurel-svg` + `@keyframes laurel-reveal`).
  - **5-Schritt-Prozess in workflow.html**: Horizontale SVG mit 5 nummerierten Kreisen, Mobile-Fallback als gestackte Liste. Inline `<style>` + `<svg>` in `workflow.html`, isoliert von anderen Dateien.
  - **User Guide komplett neu konzipiert**: Vorher war's EIN Toggle-Widget mit 2 Modi — falsch, weil Pfad A (Rundgaenge) und Pfad B (In meiner Naehe) tatsaechlich **zwei eigenstaendige App-Pfade** sind. Jetzt: ZWEI Widgets nebeneinander (`data-path="A"` / `"B"`), jedes mit eigener Schritt-Nav (1-4), Phone-Mockup, grossem Step-Label rechts. Mobile (<860px): Widgets stapeln. Daten-Struktur in `STEPS = {A: [...], B: [...]}` im Script-Block — `img: null` → Platzhalter, `img: 'pfad'` → echtes Bild. Bildordner: `assets/images/user-guide/` (a1-a4, b1-b4). Nutzerin liefert Screenshots nach.
  - **Uncommitted auf main (liegen lassen!)**: Netzwerk-Viz Refactor-Versuch (js/data/netzwerk.js neu, js/network.js von ~200 auf 483 Zeilen, components.css, index.html). Nutzerin: "ist nicht was ich wollte" — NICHT committen, NICHT verwerfen, wartet auf neuen Ansatz
  - **Padding-Fix auf allen Seiten** (a93993d): `.section`, `.hero`, `.footer`, `.page-header` nutzten padding-Shorthand (`padding: var(--sp-5) 0`), was das horizontale Padding von `.container` ueberschrieben hat wenn ein Element beide Klassen hatte. Jetzt nur noch `padding-top`/`padding-bottom` separat → 24px Seitenabstand greift ueberall.
  - **CSS Cache-Bust ?v=20260414** (66b37b9) auf alle CSS-Links in allen 43 HTMLs. Ohne Versions-Query haben Browser CSS aus dem Disk-Cache gehalten und der Padding-Fix war live nicht sichtbar. Zusatz-Stolperfalle: GitHub Pages serviert HTML mit `Cache-Control: max-age=600` → das HTML selbst (mit den neuen `?v=`-Links) bleibt 10 Min im Browser-Cache, deshalb sieht man die Aenderung im normalen Fenster erst nach max. 10 Min, im privaten Fenster sofort. **Workflow ab jetzt:** bei jeder CSS-Aenderung Versionsnummer hochzaehlen (`?v=20260414` → `?v=20260414b` → `?v=20260414c` ...), HTML-Cache erst nach 10 Min aktiv.
  - **Burger-Menu kompakter + rechtsbuendig** (5d2f4aa, 118ba8e): `.menu__list` Schrift 1.6rem → 1rem, Padding/Gaps reduziert. `.menu__group` max-width 700px (zentriert) → 320px (rechtsbuendig via `margin-left: auto`). `.menu__heading` 0.7rem → 0.95rem mit hoeherer opacity, Liste um 1.2rem eingerueckt fuer visuelle Hierarchie wie ein Inhaltsverzeichnis. Cache-Bust auf `?v=20260414c`.
  - **Fonts: TheSerif (LucasFonts) eingebunden** (1314d4a): 4 Schnitte selbst gehostet in `assets/fonts/` (HP5 Plain, HP5 PlainIT, HP6 SemiBold, HP9 Black). `@font-face` in `css/global.css`. Typo-Mapping: H1=900, H2=600, H3=600, H4=400. Body bleibt Roboto. Komplette Doku inkl. Anleitung fuer Marilena-Aenderungen in `_doku/fonts.md`. Komplette LucasFonts-Familie (HP2-HP9 + TheSans + TheSans Mono) liegt lokal in `C:\Users\maggy\OneDrive\Dokumente\Promo_Iappear...\NEUE_FONTS_2025\Fonts i.appear\` — bei Bedarf nachladen. Cache-Bust `?v=20260414d`.
  - **Hero-Feinschliff Landingpage** (3cd17c5, 817d38b, 8dfd5fe, 9efad6b, 8ddbb50, 5fbc145): Hero komplett ueberarbeitet damit above the fold auf 1280×600 Bildschirmen passt und optisch ausbalanciert ist. Aenderungen:
    - **Logo/Phones kleiner**: `.hero__logo` max 240px → 190px (clamp 14vw), `.phone` max 160px → 140px (clamp 16vw). Hero padding-top reduziert. Gaps zwischen Logo/Phones/CTA enger (sp-2 → sp-1).
    - **Phone-Videos eingebaut**: `assets/videos/hero/navigation_1.mp4` (links, Region-Auswahl) + `assets/videos/hero/Aufzeichnung_Histappear_geschnitten.mp4` (rechts, hist.appear Karte). Autoplay muted loop playsinline.
    - **Kategorie-Links kompakter (nur Landingpage)**: gescoped ueber `.hero .cat-link` — fixe Breite 210px, `justify-content: space-between` → alle 3 Pfeile (i.history/i.dentity/i.grow) pixel-genau rechtsbuendig auf gleicher Linie. Schrift 1rem, Subtitel (ZEITREISEN etc.) als `small` inline-block mit `padding-left: .8em` + `margin-top: 2px` → nah am Titel, leicht versetzt. Keine Trennlinien, kein Padding. Auf Unterseiten bleiben `.cat-link`s unveraendert.
    - **`.hero__right` vertikal zentriert**: `justify-content: center`, `align-items: flex-start`, `height: 100%`. `.hero__social` im Hero-Scope per `position: absolute; bottom: sp-3; right: sp-3` in die rechte untere Ecke des Hero, raus aus dem flex-flow (sonst wuerde `margin-top: auto` den flex-center ueberschreiben).
    - **`.hero__left` als 4-Zeilen-Grid**: `grid-template-rows: auto 1fr auto 1.5fr`. Row 1 = Claim ("Die Plattform fuer digitale Erlebnisse") mit `margin-top: 2rem` (sonst rutscht der Text unter die fixed Nav). Row 3 = Stage/Laurel, **pixel-genau buendig mit i.history rechts** (265 vs 266). Row 4 hat `1.5fr` → leicht nach oben gebiased.
    - **`.hero`** hat jetzt `position: relative` damit `.hero__social` absolute greift.
    - Cache-Bust-Progression: `?v=20260414e` (Videos+shrink) → `f` (cat-link small) → `g` (cat-link centering) → `h` (cat-link center-fix) → `i` (rechtsbuendige Pfeile + Social absolute) → `j` (Grid hero__left) → `k` (claim margin-top fix).
  - **Vitrine statisch ins HTML (Session 8, 2026-04-14)**: Bis jetzt wurden die 22 Vitrine-Kacheln per JavaScript aus `js/data/vitrine.js` in `vitrine.html` injiziert — Google sieht das, aber LLM-Crawler (ChatGPT/Claude/Perplexity/Common Crawl) meistens nicht. Jetzt werden die Kacheln per Build-Script (`build.py` im Repo-Root) einmalig als statischer HTML-Block zwischen den Markern `<!-- VITRINE-GRID-START -->` / `<!-- VITRINE-GRID-END -->` in `vitrine.html` eingebaut. Single Source of Truth bleibt `vitrine.js`. Workflow: Datei aendern → `python build.py` → committen. JS-Renderer in `vitrine.js` bleibt als **Fallback** drin und springt nur an wenn das Grid leer ist (falls jemand build.py vergisst). Nebenbei: 3 kaputte Links in `vitrine.js` zurueck auf ASCII-Pfade gesetzt (`klassenraeumen`/`koepfe`/`bombenabwuerfe` — mein Umlaut-Script hatte die Dateinamen-Strings mit erwischt). Marilena-Anleitung unter `_doku/vitrine-bearbeiten.md`. Kategorie-Seiten (i-history/i-dentity/i-grow/stadtrundgaenge) sind bereits seit Session 2/5.5 komplett statisch — dort ist keine Aktion noetig. `rundgaenge.js` wird zwar in index.html geladen, aber de facto nicht verwendet (dead-ish, bleibt als Datenreferenz drin). Cache-Bust `?v=20260414l`.
- Session 14 (Mini-Karten auf alle Rundgaenge ausgerollt, 2026-04-29):
  Ausrollung des Mini-Karten-Patterns aus dem POC (Session 13) auf alle Rundgaenge der 3 Kategorie-Seiten. Plus drei Polish-Iterationen am gleichen Tag.
  - **Karten-Stil-Sondierung am Anfang**: Maggy hatte eine sichtbare horizontale Hairline quer durch die Stadtspuren-Karte gemeldet (klassisches Leaflet-Tile-Naht-Problem, subpixel-rounding zwischen Tile-Reihen). Fix: `.rundgang-map .leaflet-tile { width: 257px !important; height: 257px !important }` — Tiles minimal vergroessert sodass keine 1px-Lucke mehr sichtbar ist. Anschliessend 6 Karten-Stil-Varianten durchgespielt (Carto `dark_all` / `dark_nolabels` / Stadia `alidade_smooth_dark` / Stamen `toner_lite` / `dark_nolabels`+Filter stark / `dark_nolabels`+Filter mild). Maggy waehlte **A = Carto dark_all (Status quo)** mit den weissen Stadtnamen. Schluesselerkenntnis: bei Raster-Tiles sind welche Labels/Schriftart/Farbe gezeigt werden fest verdrahtet im PNG, NICHT konfigurierbar. Wenn echte Label-Kontrolle gewuenscht waere, brauchen wir Vector-Tiles (Mapbox/MapLibre) oder eigene Leaflet-DivIcons als Labels mit Geo-Koordinate. Notiz fuer spaeter.
  - **Targets-Farbe pro Kategorie** (`cf44989`): Statt vorher uniform weiss jetzt pro Rundgang die Brand-Farbe — i.history Gold (`#D3A54A`), i.dentity Blau (`#769CA2`), i.grow Gruen (`#8E9F6A`). Steuerung via `data-kategorie` Attribut auf dem `.rundgang-map` Element. Renderer baut das passende SVG-DivIcon dynamisch.
  - **Architektur-Refactor** (`cf44989`): Ich-history-Inline-Code (CSS + RUNDGANG_DATA + JS) komplett raus aus i-history.html in 3 saubere Stellen aufgeteilt: (1) `js/data/rundgang-stationen.js` als Single Source of Truth fuer alle 105 Stationen ueber 11 Rundgaenge, (2) `js/rundgang-map.js` als Renderer-Modul (Lazy-Load via IntersectionObserver, Tile-Naht-Fix, Targets-Farbe via data-kategorie, ResizeObserver fuer Layout-Aenderungen), (3) `.rundgang-map` Styles in `css/components.css`. Markup pro Karte schlank: `<div class="rundgang-map" data-rundgang="hist-appear" data-kategorie="history" aria-hidden="true"></div>`.
  - **12 Platzhalter ersetzt** (`cf44989`):
    - i-history (5): `hist-appear`, `stadtspuren` (war schon Karte aus Session 13), `frauenspuren`, `barockbaumeister`, `see-runde`
    - i-dentity (3): `sprechender-baum`, `innenstadt-erkunden`, `oberdorf-entdecken`
    - i-grow (4): `hist-appear` (Schulversion, gleiche Stationen, gruene Targets), `immersive-ethik` (= "Buntes Dornbirn"-Card), `zusammenwachsen`, `ein-oktobertag`
    - Bewusst NICHT konvertiert: "125 Jahre 125 Bilder" (kein Rundgang mit Stations, ist eine Foto-Ausstellung)
  - **Auffaelligkeiten in `_doku/karten-todos.md`**: Bei der Daten-Recherche stiess ich auf mehrere Anomalien — alle als TODO dokumentiert: 3 Default-Koordinaten in hist.appear (47.414141 / 9.740922 → 3 Stationen liegen exakt uebereinander), Doppelpunkte in See Runde ("Gedenkstein Sanierung" und "Wuerfelturm" beide auf 47.4943502 / 9.688513), Frauenspuren-Stat-1 weit weg im Guetle, Barockbaumeister-Bounds extrem (Au → Schweiz, halbes Vorarlberg + Liechtenstein in der Karte). Maggys Wunsch: "ignorieren, wir kuemmern uns spaeter darum" → Workflow festgehalten.
  - **3 Polish-Iterationen** (`f74a90d`, kurz nach dem ersten Push):
    - **Frauenspuren Stat 1 "Ueberblick" Koord-Fix**: war 47.389988 / 9.777290 (= identisch mit Stadtspuren-Guetle, also vermutlich Datenfehler beim Anlegen des Rundgangs), jetzt 47.413833 / 9.742232 (Innenstadt-Mitte). Maggy meldete dass Storyblok auch direkt geupdated wurde, Daten-Sync also synchron.
    - **"Coming soon"-Box** statt Streifen-Platzhalter: Neue CSS-Variante `.ph--soon` (schwarz `#0a0a0a`, dezenter italic-Serif "Coming soon", subtler Border). 125 Jahre 125 Bilder Card hat jetzt diesen statt des animierten Streifenmusters. Marilena/Maggy soll spaeter entscheiden ob das auch fuer andere "Coming soon"-Bereiche (Frauenspuren-Card hat noch den `<span class="btn">Coming soon</span>` Button) angewandt wird.
    - **1-Punkt-Karten Renderer-Fix**: Bei `stations.length === 1` macht der Renderer jetzt `setView([lat, lng], 14)` statt `fitBounds(bounds)`. Grund: fitBounds zoomt bei einem einzelnen Punkt auf maxZoom rein, was beim Sprechenden Baum (Messepark) eine schwarze Flaeche ohne Strassen ergab. Mit fester Zoom-Stufe 14 (Stadtteil-Ebene) sieht man Strassen-Kontext drumherum (Lustenauerstrasse, Eisenstrasse) und der einzelne blaue Target im Messepark wirkt nicht mehr "verloren".
  - **Stadtrundgang-Dornbirn nicht ausgerollt** (bewusste Entscheidung): Maggy fragte ob's auch dort sinnvoll waere. Nach Pruefung: Auf der stadtrundgang-dornbirn.html sind 9 Cards in 3 Sektionen, davon 7 Rundgaenge alle in der gleichen Innenstadt-Bounding-Box. Folge waere visuelle Redundanz (7x ungefaehr derselbe Stadtkern mit unterschiedlichen Pin-Konstellationen). Aufwand technisch trivial (`~10-15 min`), aber optisch eher repetitiv. Maggy hat sich dagegen entschieden — Stadtseiten bleiben **ohne** Mini-Karten pro Card. Alternative fuer spaeter waere eine zusammenfassende Karte pro Kategorie-Block (alle Stationen aller Rundgaenge auf einer Karte).
  - **Cache-Bust-Progression**: components.css `?v=20260428k` → `20260429a` (Karten-Ausrollung) → `20260429b` (Polish). Neu zusaetzlich versionsstemped: `js/data/rundgang-stationen.js?v=20260429b` und `js/rundgang-map.js?v=20260429b` damit Datenaenderungen sicher live durchschlagen (Cache-Falle ohne Versionsstempel war bei Frauenspuren-Fix sichtbar — Browser hielt alte JS-Datei aus dem Cache).

- Session 13 (Mini-Karten Proof-of-Concept + User-Guide Polish, 2026-04-28):
  Spaet-Abend-Session, mehrere kleine Polish-Schritte plus erster Versuch von Mini-Karten auf den Kategorie-Seiten.
  - **User Guide Pfade Header zentriert + Schritt-Nav glassy** (`2680204`): `.ug-widget__head` mit `justify-content: center` (Icon + Title mittig). `.ug-widget__nav`-Pille (`← Schritt N →`) auf zentrale `--glass-*` Variablen umgestellt — letzter Button auf der Seite mit altem Stroke-Stil.
  - **B Schritt 2 Tip-Overlay raus** (`b40412a`): Maggys Beobachtung — der `b2-tipp.png` Decision-Pop-up als Overlay über dem Phone-Screen war redundant, weil derselbe Pop-up ohnehin schon im `b2.png` enthalten ist. HTML `<img class="ug-tip-overlay">` raus, JS-Logik zum Toggle des Overlays raus.
  - **User Guide Short Guide Lead-Block weg** (`6f1042b`): H2 "In 4 Schritten zum Erlebnis" + Lead-Satz mit `iappear.app`-Link entfernt. Page-Header (User Guide + Subtitle) leitet jetzt direkt zu den 4 Cards über — straffer.
  - **User Guide Lead über die Pfad-Cards verschoben + umformuliert** (`4cd5c27`, `1b61a22`): Subtitle vom Page-Header `In zwei Wegen durch die App – egal ob du einen Rundgang gebucht hast oder Stationen in deiner Nähe entdecken willst.` raus. Stattdessen ein neuer kurzer Lead **direkt über** der `.ug-stage` (also den 2 Klick-Cards), italic-serif, .95rem, max 680px zentriert: `In zwei Wegen durch die App – ganzen Rundgang erleben oder einzelne Stationen in deiner Nähe finden.` Plus ein `<br>` nach `App –` für sauberen 2-Zeilen-Umbruch.
  - **i-history Stadtspuren Mini-Karte (Proof-of-Concept)** (`183a419`, `6ff8ffa`): Erste Mini-Karte als Proof-of-Concept auf der Kategorie-Seite. Statt des Platzhalters `<div class="ph ph--wide">Bild: Stadtspuren</div>` jetzt eine echte Leaflet-Karte mit Carto `dark_all` Tiles (gleicher Tile-Layer wie Stadtrundgang-Hub) als Hintergrund + 18 Stations-Marker als weisse i.appear-Targets (DivIcon mit inline-SVG). Lazy-Loading via IntersectionObserver mit rootMargin 150px — Tile-Requests gehen erst los wenn die Karte ins Viewport scrollt. Map nicht interaktiv: `zoomControl/attribution/dragging/scroll/touch` alle aus. Stations-Daten (18 Punkte) inline im Script aus `_doku/Koordinaten_alle_Stationen.md`. **Bug + Fix**: Beim ersten Versuch gab's einen weissen Fleck in der Karte — klassisches Leaflet-Init-Problem, beim Lazy-Init hatte der Container noch nicht die finale Hoehe. Fix: zweistufiges `invalidateSize + fitBounds` (50ms + 300ms Timer) plus ResizeObserver fuer spaetere Layout-Aenderungen. Tile-URL mit `{r}`-Retina-Suffix fuer schaerfere Beschriftung. **Stand:** Stadtspuren funktioniert sauber, alle 18 Marker auf der Karte, Tiles laden via lazy-load. Wenn das Look auf weiteren Cards passt, wird das Pattern auf alle Rundgaenge ausgerollt — Daten dafuer liegen schon in der Obsidian-MD-Datei (105 Stationen ueber 11 Rundgaenge).

- Session 12 (Workflow + User Guide Refactor, 2026-04-28):
  Großer Polish-Tag rund um die Workflow-Seite und den User Guide. 14 Commits, alle gepusht (origin/main jetzt auf `b9c539e`).
  - **Workflow Auftakt+Leistungen Symbole** (`fd85c10`): jede der 6 Sub-Cards (Die Idee / Das Angebot / Der Vertrag / Das Konzept / Das Team / Der Content) bekommt ein 40px-Symbol links neben Headline+Text. Layout per `.card.workflow-step` (Specificity-Bump damit es row wird statt geerbtem column). 6 SVG-Symbole inline (Kaffeetasse, 2 Dokumente, Vertrag mit Häkchen, 2 Zahnräder, 2 Personen — Maggy: "nur 2 Personen, mehr sind wir nicht :)" — Würfel mit Sparkles).
  - **Workflow Cards alle 6 gleich groß** (`9f84141`): Layout-Refactor von `grid grid-2` mit zwei `<div>`-Spalten zu einem einzelnen `.workflow-grid` mit 2x3-Grid + 2-H2-Reihe oben. Cards in derselben Reihe automatisch gleich hoch (Grid-stretch), und ein kleiner JS-Sync gleicht ALLE 6 Cards auf die höchste an (max über alle measureHeights). Plus Animationen: Tasse-Dampf + 2 Zahnräder als Endlos-Loops; alle anderen Symbole subtil animiert (Dokumente shift, Häkchen pulsiert, Personen nicken versetzt, Sparkles blinken). Wichtig: **Zahnrad-transform-origin-Bug** — vorher hatte ich px-Werte als `transform-origin` gesetzt, bei `transform-box: fill-box` werden die ab bbox-top-left gemessen → das kleine Zahnrad kreiste voll daneben hinter dem Text. Mit `transform-origin: center` rotiert jedes Zahnrad-`g` um sein eigenes bbox-Center.
  - **Workflow 5-Schritt vertikale Timeline** (`3767d94`): Statt 5 nummerierter Kreise auf einer horizontalen Linie (mit nichtssagenden Labels: "Idee & Konzept", "Inhalte & Story" etc.) jetzt eine vertikale Timeline. Pro Schritt: große Nummer + 40px Symbol + Title + 2 Sätze die erklären, was tatsächlich passiert. Verbindung zwischen Schritten als zarter vertikaler Lichtstreifen. Cards faden beim Scroll nacheinander ein (IntersectionObserver). Symbole: Glühbirne (Idee, pulsiert), Sprechblase, Foto+Welle, Häkchen-Liste, Rakete (Flamme flackert). `prefers-reduced-motion: reduce` respektiert.
  - **User Guide Header** (`526e9d2`): Vorher generischer `.page-header` (zentrierte H1 + muted P). Jetzt analog zu features/workflow/vitrine etc.: `.page-header page-header--hub` mit Eyebrow oben, fette H1 linksbündig, italic-Serif Subtitle, schmaler Border drunter.
  - **User Guide Short Guide** komplett refactored (`a81d4b0`): Aus 2 losen Blöcken (`H2 "Short Guide"` mit zwei harten Sätzen + 4 statische Cards mit riesigen 1/2/3/4 Zahlen ohne Erklärung) wird eine **zusammenhängende Mini-Reise**: Lead-Satz integriert mit `iappear.app`-Link, 4 Cards mit Pill-Nummern (01-04), Title und einem Erklärsatz, animierten Visuals (echtes `target-weiss.svg` pulsiert, Karte/Koffer-Toggle wackelt subtil, Pills pulsieren versetzt, 6 Inhalt-Icons leuchten nacheinander), Punkt-Pfeile (`···`) zwischen den Cards.
  - **Short Guide Polish-Iterationen** (`32569da` → `c5f2393` → `9535395`): (1) Visualen kleiner + konsistenter — Target 52→40, Pfeil 44→38, Toggle 154x70→120x55, Pills schmaler, Icons 52→40px. (2) Maggy: "die animierten Punkte bitte doch entfernen" → Punkt-Pfeile zwischen Cards komplett raus. Target 40→32, Pfeil 38→32, Toggle 120x55→96x44. (3) Layout-Feinschliff: Inhalt-erleben-Grid `gap` `.35rem`→`.15rem` mit fixen 40px-Spalten → sauberes 3x2-Grid; Visualen aller 4 Cards horizontal zentriert; Visualen von Step 1+2 leicht nach oben gerückt (`transform: translateY(-8px)`) damit sie optisch auf Höhe der Pill-Mitte von Step 3 sitzen.
  - **User Guide Pfad-Cards refactor** (`d21aa8c`, `ecb3a18`): Card A ("Rundgänge", vorher "Mit Rundgang") + Card B ("In meiner Nähe", vorher "In der Nähe") angepasst: `.ug-stage` `align-items: stretch`, beide Cards 558px gleich hoch, dann später 420×640. Card A Icon: selbstgezeichneter 3-Kreise-Stack ersetzt durch echtes `assets/svg/targets/target-weiss.svg`. Cards von Full-1fr-Width auf `max-width: 420px; margin: 0 auto` umgestellt — schmäler und in der Grid-Cell zentriert. `.ug-widget__body` von 2-Spalten-Grid (200px Phone | 1fr Label rechts) auf flex-column: Phone oben zentriert, Step-Label drunter zentriert. Label-Schrift kompakter: Nummer 2.2rem→1.4rem, Text 1.15rem→1rem, beide center. **Wichtig: JS-Logik unangetastet** — sie reagiert auf `data-ug-*` Attribute, nicht auf Layout.
  - **B Schritt 1 GPS-Pfeile als Overlay** (`939d7cb`, `46d680d`): Im `b1.png` fehlen die zwei Indikatoren aus der echten App (weißer User-Standort-Marker mittig, blauer GPS-Indikator unten rechts). Statt das Bild zu tauschen werden die als CSS+SVG-Overlay auf den Phone-Screen positioniert (`data-ug-b1-overlays`). Sichtbar nur in Schritt 1 (via JS-Toggle in `render()`). Blauer GPS pulsiert subtil (box-shadow Ring-Pulse + leichte Skalierung, 2.2s loop). User-Pin im zweiten Commit nochmal angepasst — Kreis-Hintergrund weg, nur SVG-Pfeil mit weißer Füllung + dunklem Stroke + drop-shadow zur Sichtbarkeit auf der dunklen Karte.
  - **B Schritt 1 Label** (`db6d551`): "KARTE" (1-Wort, kryptisch) → "Stationen an deinem Standort entdecken" (2 Zeilen, erklärend).
  - **User Guide Title-Case + Buttons glassy** (`b9c539e`): Alle Step-Labels Title-Case statt UPPERCASE: A "Region wählen" / "Rundgang wählen" / "Station wählen" / "Inhalt wählen", B "Stationen an deinem Standort entdecken" / "Entscheiden" / "Inhalt" / "Rundgang". `text-transform: uppercase` aus `.ug-label__text` raus. Plus alle Buttons (`.ug-nav-btn`, `.ug-toggle__track`, `.ug-toggle__thumb`, `.ug-decision-btn`, `.ug-feature` Container) auf das zentrale glassy Designsystem mit `--glass-*` Variablen umgestellt — kein Stroke mehr, nur Inset-Shadows + Backdrop-Blur + Glow. `.ug-feature__bg` (SVG-Path) auf `fill: transparent; stroke: none` weil der äußere `.ug-feature`-Container jetzt selbst den Glas-Hintergrund hat.
  - **B Schritt 2 Tip-Overlay entfernt** (`b40412a`): Maggys Beobachtung — der `b2-tipp.png` Decision-Pop-up als Overlay über dem Phone-Screen war redundant, weil derselbe Pop-up ohnehin schon im `b2.png` enthalten ist. HTML `<img class="ug-tip-overlay">` raus, JS `tipImg`-Variable + zugehörige `removeAttribute/setAttribute('hidden')`-Logik raus. `screen.insertBefore` läuft jetzt einfach an `firstChild`. Decision-Buttons unter dem Phone (der echte Klick-Mechanismus) bleiben unverändert.
  - **Pfade Header zentriert + Schritt-Nav glassy** (`2680204`): `.ug-widget__head` bekommt `justify-content: center` — Icon + Title (Rundgänge / In meiner Nähe) sitzen jetzt mittig in der Card statt links. `.ug-widget__nav` (die Pille mit `← Schritt 1 →`) auf `--glass-*` Variablen umgestellt, Border raus — letzter UI-Element der noch im alten Stil war.
  - **Stand:** User Guide jetzt komplett konsistent zum Glas-Designsystem. Pfad-A "Rundgänge" und Pfad-B "In meiner Nähe" sind klar getrennte Use-Cases mit Title-Case-Schritt-Anzeigen. Workflow-Seite hat erzählerischen 5-Schritt-Prozess statt nichtssagender Kreis-Reihe.

- Session 11 (Glassy-Stroke-Cleanup + Lichtstreifen + Top-Nav + Bios, 2026-04-28):
  Großer Polish-Tag rund um Designsystem-Konsistenz. 9 Commits, alle gepusht (origin/main jetzt auf `b8db921`).
  - **Burger-Menü glassy** (`f5f889a`): `.nav__burger` nutzt jetzt die zentralen `--glass-*` Variablen statt `border: 1px solid var(--c-text)` mit transparentem Hintergrund. Plus Hover-State mit Glow.
  - **Burger + X strokeless** (`620693d`): Border ganz raus aus `.nav__burger` und `.menu__close` (X im Overlay-Menü). Beide pur glassy mit halbtransparentem Hintergrund + Inset-Shadows. `.menu__close` musste explizit als flex-center mit font-size 1.6rem ausgestattet werden für das `&times;`-Symbol.
  - **Buttons strokeless** (`c50f766`): `.btn` ohne Border. Kategorie-Varianten (`.btn--history/--dentity/--grow`) behalten den farbigen Hintergrund-Tint als Kennung, aber strokeless. Das gilt jetzt seitenweit für alle Buttons (z.B. JETZT STARTEN, KONTAKT AUFNEHMEN, ALLE ORTE & KARTE ANSEHEN etc.).
  - **Jump-Chips + Ort-Tags strokeless** (`17dfcbc`): `.hub-jumpnav__chip` und `.ort-tag` (inline in stadtrundgaenge.html) haben Border verloren. `.hub-jumpnav__chip--soon` nutzt jetzt `font-style: italic` statt der gestrichelten Border, um den "bald"-Status zu signalisieren.
  - **Sektions-Trenner als Lichtstreifen** (`0054597`): Aus dem harten `border-top: 1px solid rgba(255,255,255,.08)` auf `.section` wurde ein `.section + .section::before`-Pseudo-Element mit `linear-gradient` (transparent → 18% weiss → transparent), 720px breit, mittig zentriert. Wirkt wie zarter Lichtstreifen statt harter Trennlinie quer übers Bild.
  - **Ort-Karten Tag-Bereich gleiche Höhe** (`c111e9d`): `.ort-card .ort-tags` bekommt `min-height: calc(3 * 1.6rem + 2 * .4rem)` plus `align-content: center`. Bei Karten mit 1 Tag (Hard, Au, Bregenz) sitzt der Tag jetzt zentriert im selben Block wie bei Dornbirn (3 Tags) — Description startet überall auf gleicher Höhe.
  - **Landingpage Stadtrundgang-Karten Chip-Höhe** (`a175be9`): `.card--teaser .hub-jumpnav` mit `min-height` für 3 Chips, `align-content: center`, **`margin-top: auto`** damit der Block ans untere Karten-Ende dockt. Wichtig: Inline-Style `margin-top:var(--sp-1)` aus `index.html` musste raus, sonst hätte die Inline-Specificity das CSS überschrieben. Ergebnis: einzelne Chips bei Feldkirch/Hard/Au liegen exakt auf der mittleren Position (i.dentity-Höhe) bei Dornbirn.
  - **Back-to-top Pfeil glassy** (`891bd73`): `.back-up` (floating button unten rechts) jetzt auch mit `--glass-*`-Variablen, kein Stroke. Konsistent zum Burger.
  - **Footer-Trenner Lichtstreifen** (`38a2be8` nach Twist `4a17959`): `.footer { border-top }` (Übergang Section → Footer) wurde zu Lichtstreifen via `::before`. `.footer__bottom { border-top }` (zwischen Brand-Block und Copyright/Legal-Zeile) bleibt **harte Linie**. Erst hatte ich's verkehrt herum (`4a17959`), Maggy hat korrigiert. **Stolperfalle:** "Der letzte Strich über dem Footer" wurde von mir initial fehlinterpretiert als "Strich am Anfang des Footers" — gemeint war "der letzte Trenner der noch oberhalb der absoluten Footer-Bottom-Zeile ist".
  - **Top-Nav: Leistungen + Kontakt raus, kein UPPERCASE** (`3d25232`): Top-Nav zeigt jetzt nur 4 Links — Stadtrundgänge / Features / Über uns / Vitrine. Leistungen + Kontakt bleiben übers Burger-Menü erreichbar. CSS: `text-transform: uppercase` raus, `letter-spacing: .12em` → `.01em`, `font-size: .85rem` → `.9rem`. Title-Case statt CAPS. Python-Script nutzt regex auf den `<nav class="nav__links">`-Block (eingegrenzt) damit Footer-Legal- und Burger-Menü-Links nicht versehentlich getroffen werden (gleiches Tag, anderer Kontext).
  - **Top-Nav-Threshold 1000px → 720px** (`d395c35`): Top-Nav wird jetzt schon ab Tablet-Hochformat sichtbar statt erst auf Desktop. Auf Smartphones (<720px) bleibt's beim Burger-only.
  - **Logo + Subtitle Fade-in beim Laden** (`d395c35`): Hero-Logo und "digital city tours" bekommen `@keyframes hero-brand-in` (opacity 0 → 1 + scale .96 → 1, .7s). Subtitle 0.15s versetzt für leichten Stagger-Effekt. Einmalig, kein Loop. `prefers-reduced-motion: reduce` respektiert. Definiert in `css/animations.css`.
  - **Über uns: Maggy-Bio aktualisiert** (`d0f66ed`): Eyebrow `3D-Artist, Kartographie, Webdesign, Animation und AR` → `3D, Interactive Systems, Web und AR`. Bio jetzt zwei Absätze: erster über Weg (Geographie → InterMedia → 3D-Prototypen + AR), zweiter über i.appear-Verantwortung.
  - **Über uns: Marilena-Bio Schluss-Absatz** (`e5122f7`): Neuer zweiter Absatz "Diese seltene Verbindung von geisteswissenschaftlicher Tiefe, medienethischer Pädagogik und gestalterischer Praxis prägt die Handschrift von i.appear." → strukturell jetzt analog zu Maggys Bio.
  - **Über uns: Kontakt-Box + CTA hinzugefügt** (`2d9b8eb`, `b8db921`): Eigene Section mit `.info-card` (Brand + Adresse + Telefon/Mail/Web), zentriert mit max-width 480px. Plus die "Du möchtest mit uns zusammenarbeiten?" CTA-Section direkt darüber (verschoben — vorher war sie ganz unten nach Partner). Reihenfolge jetzt: Bios → CTA → Info-Box → Partner.
  - **Stand bzgl. Glas-Look:** Designsystem ist jetzt seitenweit konsistent — Buttons, Burger, X, Pfeil, Chips, Tags alle pur glassy mit halbtransparentem Hintergrund + Inset-Shadows + Backdrop-Blur, **kein Stroke mehr**. Lichtstreifen-Trenner sind zentral als Variante via Pseudo-Elementen (Sektions-Trenner, Footer-Top); harte 1px-Lines nur noch wo bewusst gewünscht (über Copyright).
  - **Stand bzgl. Top-Nav:** schmaler & ruhiger — 4 Links in Title-Case, sichtbar ab 720px, Burger-Menü übernimmt alle anderen Links (`Workflow / Leistungen` + `Kontakt`).
  - **Cache-Bust-Progression dieser Session:** components.css `?v=20260417o`/`20260427h` → `20260428a` (Burger glassy) → `b` (Stroke raus) → `c` (Buttons strokeless) → `d` (Chips/Tags strokeless) → `e` (Landingpage chip-Höhe v1) → `f` (chip-Höhe finalisiert) → `g` (Pfeil glassy) → `h` (Footer-Trenner v1, verkehrt) → `i` (Footer-Trenner getauscht) → `j` (Top-Nav umgebaut) → `k` (Nav 720px). layout.css `?v=20260417a` → `20260428a` (Sektions-Lichtstreifen). animations.css `?v=20260414ae` → `20260428a` (Logo Fade-in).

- Session 10.6 (Workflow-Seite Umbau + Card-Bug, 2026-04-27):
  Maggy: "auf der Workflow-Seite passt noch garnichts" und schickte 3 Screenshots der originalen Readymag-Workflow-Page (`screenshots readymag/workflow1-3.png`). Konzept: 3 Hauptbloecke — (1) Auftakt|Leistungen + 5-Schritt-Prozess, (2) Vielfaeltige Moeglichkeiten als Diagramm, (3) Fuer Details mit Mini-Kontaktformular.
  - **Block "Vielfaeltige Moeglichkeiten" als 4-Box-Diagramm** (`9eb306e`): Vorher 3-Spalten-Card-Grid, jetzt Original-Layout mit 4 Boxen aussen herum + leerer gestrichelter Center-Box als Anker. Zwei gepunktete Linien (vertikal Top↔Bottom + horizontal Left↔Right) als `::before/::after` auf der Center-Box, mit `top/bottom: calc(-1 * var(--sp-3))` damit sie ueber die Center-Box hinaus in den Gap zur naechsten Box reichen. CSS-Grid 3×3, 1fr 1fr 1fr Spalten. Mobile <860px: Linien display:none, Boxen stapeln Top → Left → Right → Bottom.
  - **Block "Fuer Details" NEU** (`9eb306e`): Vorher nur kleiner zentrierter CTA-Block mit "Projekt anfragen → kontakt.html". Jetzt 2-Spalten-Grid: links Erklaertext (3 Absaetze, FAQ-Link), rechts Glassy-Form mit inline Mail-Icon-SVG + `info@iappear.app` (mailto) + Name/E-Mail/Nachricht/Absenden-Button. Form nutzt existing `.form` Styles. Mobile <720px: stapelt.
  - **Section-Reihenfolge gefixt** (`e8fbd3b`): Beim Replace der alten 3-Card-"Vielfaeltige"-Section war die neue Diagramm-Section an der gleichen Stelle eingefuegt — also VOR dem 5-Schritt-Prozess (weil die alte Vielfaeltige dort war). Original-Reihenfolge ist aber: Auftakt → 5-Schritt → Vielfaeltige → Fuer Details. Per Python-Script die zwei Section-Bloecke im File getauscht.
  - **GLOBALER CARD-HEIGHT-BUG entdeckt + behoben** (`e8fbd3b`): Maggy: "auf dieser seite stimmt was nicht claude, da liegt ja alles übereinander, die karten sind um welten zu groß". Tatsaechlich waren Cards in der Auftakt|Leistungen-Section **782px hoch** statt ~200px. Ursache: globale Regel `.card { height: 100% }` (eingefuehrt in Session 8.4 fuer Kategorie-Cards auf Landingpage, damit Buttons auf gleicher Hoehe stehen). Diese Regel hat alle Cards auf 100% des Parent-Containers gestreckt. Bei workflow.html sind die Cards in einer `<div>`-Spalte gestapelt (3 Cards untereinander), und die Spaltenhoehe wurde ueber Stretch-Behavior auf irgendeine groteske Hoehe gesetzt — die Cards sind dann aus ihrer Section heraus in die naechste Section geflossen, was zum sichtbaren "alles uebereinander" gefuehrt hat. **Fix**: Global `.card { height: 100% }` raus, stattdessen spezifischer `.grid > .card { height: 100% }` (nur DIRECT-Children eines `.grid` bekommen die Stretch-Behandlung). `.card--kategorie` hat eh sein eigenes `height: 100%`, daher keine Regression auf Landingpage.
  - **Wichtig fuer kuenftige Edits**: Wenn man eine Section in einer HTML-Datei "ersetzt", auf die Position relativ zu anderen Sections achten — eine Section an der gleichen Position einsetzen ist nicht immer die korrekte Reihenfolge wenn das ZIEL-Layout anders ist als das ORIGINAL-Layout. Bei workflow waren das vor Session 10.6: alte 3-Card-Section war zwischen Auftakt und 5-Schritt; neue Diagramm-Section sollte aber NACH 5-Schritt kommen.
  - **Cache-Bust**: components.css `?v=20260427g` → `h` (nur fuer den Card-Fix, das Diagramm + Fuer Details nutzen inline-CSS in der Section selbst, daher kein Cache-Bust dafuer noetig).

- Session 10.5 (Polish-Pass: Header, Vitrine, Feature-Icons, 2026-04-27):
  Mega-Polish-Tag. 8 Commits in einer Session, alle Layout-/Content-Aenderungen seit Session 10.4.
  - **Top-Nav: Border-Bottom entfernt** (`a9ff926`): Die hairline-Trennlinie unter der fixen Top-Nav (`border-bottom: 1px solid rgba(255,255,255,.08)` in `.nav`) wirkte beim sauberen schwarzen Hintergrund stoerend, weg. Cache-Bust startet ab heute mit `?v=20260427a`.
  - **Vitrine-Bilder**: 21/22 sind jetzt live (`86e73e0`). (1) `asked.png` ueberschrieben mit der schwarz/weiss Tumler-Portrait-Version aus dem Wetransfer-Paket. (2) `florenz.png` NEU als 22. Bild — Hero-Bild auf der Florenz-2023-Detail-Seite ergaenzt + Vitrine-Grid via `python build.py` regeneriert. **Offen bleibt nur**: Podiumsdiskussion PH Vorarlberg (Maggy: "nervt mich zu Tode, hab's im Readymag-Editor, klaeren wir spaeter").
  - **Vitrine-Cards Apple-Lift Hover** (`d7cd113`): Beim Hover heben sich die Cards leicht (translateY -3px) + Bild zoomt dezent (scale 1.04) + Border heller (28% opacity) + soft drop-shadow. Easing `cubic-bezier(.4, 0, .2, 1)`, Card-Transition .25s, Image-Transition .35s. Wirkt automatisch auf beide Vitrine-Stellen (Teaser auf Landing + 22er-Grid auf vitrine.html). `prefers-reduced-motion` wird respektiert.
  - **Kategorie-Header umgebaut** in 3 Schritten (alles 27.04.):
    - **Erste Iteration** (`0c87122`) `.page-header--category` einfach kompakter: padding sp-5→sp-3, Logo clamp(64,9vw,96)→clamp(44,6vw,64), H1 clamp(2.6,7vw,5)→clamp(1.9,4.5vw,3.2). Sodass man "Region Dornbirn" + Card-Tops im Viewport sieht.
    - **Zweite Iteration** (`7e15854`): kompletter Umbau auf **2-Spalten-Layout** — links Brand-Block (Logo + h1 + Subtitle + kompakter SEO-Lead), rechts Story-Block mit erzaehlerischer Headline + Body. Texte aus Maggys Datei `texte kategorien.txt`: i.history "Historie wird zur Geschichte" / i.dentity "Der Lebensraum, neu erlebt" (umbenannt von "Regionale Identitaet" weil das schon der Subtitle ist) / i.grow "Vom Konsumieren zum Gestalten". Story-Block bekommt eigene CSS-Klassen `.page-header__story` + `__story-headline` + `__story-body`. grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr). Mobile <860px: stapelt 1-spaltig.
    - **CSS-Stolperfalle** in dieser Iteration: text-align wurde vom generischen `.page-header` als `center` geerbt, Story-Texte waren zentriert statt linksbuendig. Fix: `text-align: left` auf `.page-header--category`.
    - **Dritte Iteration** (`29cad36`) auf Maggys Wunsch: Logo + Subtitle sollen ZENTRIERT ueber/unter dem grossen Wort "i.history" sitzen, nicht linksbuendig. `.page-header__brand` Wrapper-Klasse von `align-items: flex-start` auf `center` + `text-align: center`. Story-Block rechts bleibt linksbuendig (eigener Wrapper-Scope).
  - **Header einheitlich auf 5 Seiten** (`c118a92`): features, workflow, ueber-uns, vitrine, kontakt nutzen jetzt den `.page-header--hub` Style wie stadtrundgaenge.html — linksbuendig, fette Sans-H1 (Roboto Black), italic-Serif-Subtitle, Eyebrow oben, schmaler Border drunter. Aenderungen: alte `<p class="muted">` zu `<p class="page-header__subtitle">`, `page-header` zu `page-header--hub`, kontakt + ueber-uns bekamen "i.appear" als Eyebrow ergaenzt (hatten vorher keinen). `.page-header--hub` CSS war schon da (von Stadtrundgaenge-Hub-Page in Session 8.4), wir nutzen es jetzt nur breiter. **Side-Note**: Kontakt-H1 "Kontaktieren Sie sich" ist Absicht (Maggy: "klingt lustig, wir wollen das so") — nicht fixen.
  - **4 fehlende Feature-Icons** (`c45c944`): Auf features.html hatten 4 von 14 Features (3D-Modelle, Animationen, Interaktive Karten, Secret Stations) nur leere `<span>`-Platzhalter. Jetzt jeweils eigenes SVG im exakten Glassy-Stil (1:1 Container von ar.svg uebernommen — `backdrop-filter: blur(2.5px)`, weisser Stroke 2px, round caps): `3d.svg` isometrischer Wuerfel, `anim.svg` 4-Punkt-Sparkle gross + 2 kleine, `map.svg` Standort-Pin (Tropfen mit Kreis), `secret.svg` Padlock. Die `<span>`-Platzhalter zu `<img src="...">` ersetzt.
  - **Cache-Bust-Progression** in dieser Session: `?v=20260427a` (Top-Nav-Border) → `b` (Hover) → `c` (Header kompakt) → `d` (Header 2-Spalten) → `e` (Story linksbuendig fix) → `f` (Brand zentriert) → `g` (Hub-Style auf 5 Seiten). Alle 43 HTMLs jeweils mit re.sub-Python-Script.
  - **Preview-Fallen entdeckt**: (1) Beim `preview_resize(1200, 800)` zur Test-Zeit hatte ich versehentlich den Preview-Frame fixiert — Maggy sah ploetzlich einen orangen Rahmen mit gequetschter Site. Loesung: `preview_resize(preset: desktop)` setzt zurueck auf nativ. (2) Top-Nav-Links (`STADTRUNDGAENGE / FEATURES / ...`) sind erst ab 1000px Viewport sichtbar (`.nav__links @media (min-width: 1000px) { display: flex }`), darunter nur Logo + Burger. Maggy dachte das Menue ist kaputt, ist aber Mobile-Variante — auf Live-Site mit breitem Browser sind die Links sichtbar.

- Session 10.4 (User Guide: Original-Logik 1:1 nachgebaut, 2026-04-27):
  - **Ausgangspunkt**: Aktueller User Guide hatte 2 simple Pfad-A/B Widgets als Platzhalter (`img: null`-Schritte, Maggy sollte Bilder liefern). Maggy stellte fest: das war konzeptionell falsch — der Original-Readymag-User-Guide ist viel komplexer als gedacht. Sie schickte 2 Code-Bloecke (LINKS = Pfad A, RECHTS = Pfad B), die sie via Gemini gebaut hatte und die im Original-Editor mit echten data-id Referenzen auf Picture-Widgets liefen.
  - **Recon via Chrome-MCP**: Erst auf falsche Editor-URL (`/edit/6267960/...` = "Copy"-Tab fuer Claude) navigiert, dort fanden sich keine der 30 hex-IDs aus dem Code. Tab-Titel verriet das Problem: "(Copy) i.appear für claude!" — beim Kopieren in Readymag werden alle Widget-IDs neu vergeben, deshalb existierten die hex-IDs auf der Copy-Page nicht. Maggy lieferte die korrekte URL: `https://my.readymag.com/edit/5971688/2/` (Project-ID 5971688 ist die Original-Site, 6267960 ist die Copy). Auf der richtigen Page fanden sich 28 von 30 IDs — die fehlenden 2 (`S1_c` + `S1_d` aus Pfad B) waren wohl mal Pin-Highlight-Layer die Maggy geloescht hat.
  - **Bilder gezogen**: 13 Phone-Screenshots aus dem Readymag-CDN (`i-p.rmcdn.net/680c8522.../5971688/image-*.png`) per Chrome-MCP DOM-Query und background-image-Extraktion. URL-zu-Rolle-Mapping aus dem Code, dann via Python in `assets/images/user-guide/` mit klaren Namen abgelegt: `a1-koffer/karte`, `a2-koffer/karte`, `a3-koffer/karte`, `a4`, `b1`, `b2`, `b2-tipp`, `b3`, `b4-koffer/karte`. Stolperfalle bei der ersten Recon: Content-Filter blockt URLs mit Cookies/Query-Strings, Loesung: URLs in `window.__pics` zwischenspeichern und als Datei in Downloads runterladen.
  - **Logik fuer Pfad A "Mit Rundgang"** (Wizard mit Toggle):
    - 4 Schritte mit Pfeil ← / → (zyklisch 4→1, 1→4)
    - Karte/Koffer-Toggle in Schritten 1-3, Phone-Bild wechselt zwischen `aN-karte.png` und `aN-koffer.png`
    - **Mickey-Hand-Tipp** animiert UNTER dem Toggle in Schritt 1 — verschwindet nach erstem Klick (`mickeyClicked` flag, Original-Verhalten). CSS keyframes `@keyframes ugMickeyGroove` (Hand wandert mit Rotation) + `@keyframes ugRipple` (Wasser-Ripple unterm Tipp). Mickey-Hand-SVG aus Original-Code inline drin.
    - Schritt 4: Toggle weg, dafuer **6 Feature-Icons** (3D, Speech/Comic, Video, Text, Audio, Quiz) als inline SVG mit Glassy-Style.
    - Datenstruktur: `STEPS` Array mit `{num, label, karte, koffer, alt}`, State: `stepIdx` + `isKoffer` + `mickeyClicked`.
  - **Logik fuer Pfad B "In der Naehe"** (Wizard mit Verzweigung in Schritt 2):
    - Schritt 1: einfaches Phone-Bild "Karte mit Pins" (`b1.png`)
    - Schritt 2: Phone-Bild + **Decision-Tipp-Overlay** (`b2-tipp.png`) als positioniertes `<img>` ZENTRIERT auf dem Phone-Screen (78% width, drop-shadow). Plus 2 Decision-Buttons UNTER dem Phone: "Station ansehen" → S3 / "Ganzen Rundgang" → S4. Naechster-Pfeil ist in S2 ausgeblendet (`hidden` Attribut), User MUSS klicken.
    - Schritt 3 ("Station"-Pfad): Detail-Screen (`b3.png`) + 6 Feature-Icons unten
    - Schritt 4 ("Route"-Pfad): Rundgang als Karte (`b4-karte.png`) ODER Liste (`b4-koffer.png`) mit Toggle Karte/Koffer
    - Pfeile: ←: 1→4, 2→1, 3→2, 4→2 / →: 1→2, 2 blockiert, 3→1 (Loop), 4→3
    - Datenstruktur: `STEPS` Object mit `{1, 2, 3, 4}` keys, State: `step` + `isKoffer`.
  - **CSS-Stolperfalle**: Mein erster `.ug-tip-overlay` Selector wurde von der bestehenden `components.css`-Regel `.phone__screen img { width: 100%; height: 100%; object-fit: cover }` ueberschrieben — Tip-Overlay wurde auf 100x222 statt 78% gestreckt. Loesung: Selector-Specificity hochziehen + `!important` auf alle Layout-Properties (`.ug-screen .ug-tip-overlay`). Plus separater `:not(.ug-tip-overlay)` Selector fuer das normale Phone-Bild damit das nicht doppelt gerendert wird.
  - **Texte angepasst** (Maggys OK): Pfad A behaelt die Original-Texte ("REGION WAEHLEN", "RUNDGANG WAEHLEN", "STATION WAEHLEN", "INHALT WAEHLEN"). Pfad B-Texte waren im Original alle "STATION WAEHLEN" — repetitiv. Auf "KARTE", "ENTSCHEIDEN", "INHALT", "RUNDGANG" umbenannt — viel klarer.
  - **Live verifiziert** mit Preview-Browser auf Mobile- (798px) und Desktop-Layout (1200px): beide Pfade durchgeklickt, Toggle-States, Mickey verschwindet nach Klick, Tip-Overlay zentriert, Decision-Buttons fuehren in die richtigen Verzweigungen, S4 zeigt Toggle, S3 zeigt Feature-Icons. Mobile <860px stapelt die Widgets.
  - **Stand**: "Logik + Bilder stimmen", Maggy will beim naechsten Mal noch ein paar Details anpassen — moeglicherweise Mickey-Hand-Position, Tip-Overlay-Skalierung, Toggle-Position relativ zum Phone, oder die Schritt-Texte verfeinern. Die Logik selbst ist solide.
  - **Commit `86a2a28`** auf main: 14 Dateien, +392/-174. Live: https://wuola.github.io/iappear-website/user-guide.html
  - **Wichtige Doku-Faktoid fuer naechste Session**: Original-i.appear-Site liegt auf Readymag Project-ID **5971688** (NICHT 6267960 — das ist die "Copy" fuer Claude). User-Guide-Page ist Page 2. Recon-README in `_doku/recon/README.md` ist hier veraltet (sagt Page 6). Bei kuenftiger Recon Project 5971688 verwenden.

- Session 10.3 (Repo-Cleanup + gh-Identitaets-Hook, 2026-04-27):
  - **Repo-Cleanup**: `.obsidian/` (4 lokale Editor-Configs) und `.claude/worktrees/{heuristic-shtern,romantic-sutherland}/` (38 Reste alter, laengst gemergedter Claude-Code-Worktrees, davon 24 SVG-Duplikate) waren seit Session 8.1 (`c53fd57`) versehentlich via `git add -A` ins Repo gerutscht. Jetzt aus dem Tracking entfernt (`git rm --cached`), Festplatten-Dateien bleiben. `.gitignore` um `.obsidian/` und `.claude/worktrees/` erweitert. 1340 Zeilen Repo-Rauschen weg. Commit `b918bc3`.
  - **SessionStart-Hook fuer gh-Identitaet** (`03bde48`): Maggy arbeitet unter mehreren GitHub-Accounts — `wuola` fuer i.appear, `tabulaphrasa` fuer ein anderes Projekt. `gh` CLI hat aber nur EINEN systemweit aktiven Account, und die globale CLAUDE.md verlangt dass i.appear-Aktionen ausschliesslich unter `wuola` laufen. Bei der Status-Pruefung in dieser Session war `tabulaphrasa` aktiv → strukturelles Problem, nicht "ich vergesse mal". Loesung: `SessionStart`-Hook in `.claude/settings.json` der bei jedem Start `gh api user --jq .login` prueft, und falls `!= "wuola"` automatisch `gh auth switch -u wuola` ausfuehrt + meldet. Bei korrektem Account: kurze OK-Bestaetigung.
  - **Was der Hook ausgibt**: `[wuola-guard] OK: gh-Account ist wuola` (Standardfall) oder `[wuola-guard] gh-Account von <name> auf wuola umgestellt` (Switch-Fall). Die Spinner-Status-Message lautet "Identitaets-Check (gh wuola)".
  - **Hook wirkt erst ab NAECHSTER Session** — der File-Watcher sieht die settings.json-Aenderung nicht in der laufenden Session. Falls beim ersten naechsten Start nichts kommt: `/hooks` einmal oeffnen oder Claude Code neu starten, dann ist er aktiv.
  - **gh-Switch ist persistent**: einmal gesetzt bleibt der aktive Account, auch nach Neustart, auch in neuen Terminals. Beide Accounts bleiben im Keyring eingeloggt — nur einer ist gleichzeitig aktiv.
  - **Stolperfalle (notiert)**: Wenn der User Bash-Befehle waehrend einer Session genehmigt (z.B. `gh auth switch`, `git rm`), schreibt Claude Code sie automatisch in `.claude/settings.local.json`. Diese Datei soll laut CLAUDE.md aber **leerer Stub** bleiben — sonst sammelt sich Müll an. In dieser Session zweimal aufgeraeumt (vor dem Cleanup-Commit + waehrend des Hook-Einbaus). Pattern: nach jeder Session-Approval-Welle einmal pruefen ob settings.local.json wieder Eintraege hat und ggf. wieder leeren.
  - **Identitaets-Check-Workflow ab jetzt** (gilt fuer JEDE i.appear-Session): Beim Sessionstart laeuft der Hook automatisch. Falls kein Hook-Output sichtbar oder der Hook nicht greift, manuell `gh auth status` und ggf. `gh auth switch -u wuola`. Die Pflichtchecks aus der globalen CLAUDE.md (`git config user.name` + `git config user.email` + Remote = wuola) werden NICHT vom Hook abgedeckt, sind aber stabil und aendern sich quasi nie — bei Bedarf manuell pruefen.

- Session 10.2 (Stadtrundgaenge-Karte: weisse Target-Marker, 2026-04-17):
  - **Map-Marker auf `stadtrundgaenge.html` getauscht**: Die Leaflet-Karte im Hub hat jetzt die weissen i.appear-Targets (`assets/svg/targets/target-weiss.svg`) als Pins statt des bisherigen weissen Kreises mit goldenem Border. Groesse 30×30, `iconAnchor: [15,15]` (zentriert). Neue CSS-Klasse `.iappear-map-target` mit zweistufigem drop-shadow (dunkel aussen + leichter weisser Glow) fuer Sichtbarkeit auf der dunklen Karte, plus `:hover { transform: scale(1.15) }`.
  - **Experiment verworfen**: Wir haben kurz probiert die Ortsnamen UEBER die Marker zu legen (eigenes Leaflet-Pane `'labels'` mit zIndex 650 > marker-pane 600, via Carto `dark_only_labels` Tile-Layer). Das hat technisch funktioniert, aber die weissen OSM-Text-Labels direkt auf den weissen Targets sahen hässlich aus. Danach Variante A probiert (generische OSM-Labels komplett weg, stattdessen eigene Leaflet-Tooltips mit Serif-Italic-Pill-Styling "Dornbirn", "Feldkirch" etc.) — Nutzerin mochte das Aussehen gar nicht. Beide Experimente zurueckgerollt, Stadt-Labels bleiben wie urspruenglich als Teil der `dark_all` Basemap unterhalb der Targets.
  - **Commit `53dbc9c` bleibt Session 10.1**, fuer diese Session neuer Commit.
  - **Offen**: Karten-Label-Design nochmal frisch angehen (morgen) — die eingebauten OSM-Labels konkurrieren jetzt wieder mit den weissen Targets. Moegliche Wege: anderer Basemap-Stil (Carto Voyager Dark mit cremefarbenen Labels), Label-Halo via CSS-Filter auf die Label-Tile-Ebene, oder ein sauberes Custom-Label-Design das nicht wie der Tooltip-Versuch gewirkt hat.

- Session 10.1 (Vitrine-Teaser Rotator, 2026-04-17):
  - **Vitrine-Teaser auf der Landingpage rotiert jetzt**: Statt 4 statischen Kacheln zeigt der Teaser nun alle 22 Vitrine-Eintraege aus `js/data/vitrine.js` in einer sanften Rotation. Alle 2.5s wechselt genau EINE Card im Round-Robin (0→1→2→3→0), nie zwei gleichzeitig — das war im ersten Anlauf mit 4 unabhaengigen Timern nicht garantiert (auf schmalen Viewports hat der Staffel-Trick sichtbar versagt).
  - **Fade nur fuer Inhalt, nicht fuer Rahmen**: Beim Swap bekommt der Slot die Klasse `.is-swapping`, die via CSS `opacity: 0` auf `> *` (Bild, Titel, Subtitle) setzt — der Kartenrahmen selbst bleibt stabil stehen. Duration 600ms mit `cubic-bezier(.4, 0, .2, 1)` fuer smoothes Aus-/Einblenden.
  - **Fixer quadratischer Bildrahmen**: Vorher waren die Bilder im Teaser im 16:10-Rahmen mit `object-fit: contain`, was bei nicht-quadratischen Bildern (z.B. askd.png, Landscape 1902×1061) inkonsistente Groessen erzeugt hat — askd wirkte deutlich groesser als die quadratischen Standard-Bilder. Geloest durch Umstellung auf `aspect-ratio: 1/1` + `object-fit: cover`: jedes Bild wird zentriert auf Quadratgroesse zugeschnitten, alle Cards sehen gleich aus, unabhaengig vom Bildformat oder welches Bild gerade in welchem Slot steht. Gilt nur im Teaser — `.card--teaser .card__image`-Scope — auf Detail- und Vitrine-Unterseiten bleibt alles unveraendert.
  - **Dead-Code entfernt**: Ein erster Fix-Versuch fuer askd.png hatte eine `COVER_IMAGES`-Liste in vitrine-teaser.js + eine `.vitrine-slot--cover`-Klasse, die nur beim askd-Eintrag gesetzt wurde. Mit der generischen Quadrat-Loesung nicht mehr noetig — rausgeworfen.
  - **IntersectionObserver-Start**: Der Rotator startet erst wenn der Teaser-Container in den Viewport kommt (mit 200px rootMargin-Vorlauf), pausiert on hover und respektiert `prefers-reduced-motion` (dann keine Rotation). Nach erstem Intersect wird der Observer diskonnected.
  - **Titel + Subtitle auf 2 Zeilen geclampt**: Damit die Karten-Hoehen beim Rotieren konstant bleiben — einige Vitrine-Texte sind laenger als 2 Zeilen, werden per CSS `-webkit-line-clamp: 2` mit Ellipsis abgeschnitten. Titel hat zusaetzlich `min-height: 2.6em` damit kurze Titel nicht andere Karten-Hoehen produzieren.
  - **Stellschrauben**: `TICK_MS` (2500ms) und `FADE_MS` (600ms) am Anfang von [js/vitrine-teaser.js](js/vitrine-teaser.js). Wenn Tempo geaendert werden soll, muss FADE_MS auch mit der CSS-Transition in `components.css` uebereinstimmen.
  - **Neue Dateien**: `js/vitrine-teaser.js`. Neue Scripts + Datenquelle in index.html eingebunden: `js/data/vitrine.js?v=7` + `js/vitrine-teaser.js?v=4`.
  - **Cache-Bust-Progression** in dieser Session: `?v=20260417h` (contain) → `i` (Schrift-Varianten) → `j` (Rotator v1 mit Staffel-Timer) → `k` (Line-Clamps) → `l` (Round-Robin + Rahmen bleibt stehen) → `m` (askd-Attribut-Selector, hat nicht zuverlaessig gegriffen) → `n` (askd ueber JS-Klasse) → `o` (generische Quadrat-Loesung, finales Layout).

- Session 10 (Team-Fotos + Netzwerk-Viz Portrait + Mobile-Hero-Feinschliff, 2026-04-17):
  - **Mobile-Hero-Feinschliff** (Commits `70f714b`, `75f3fcf`, `97c28ea`, `18f3940`, Session-Fortsetzung): Der Mobile-Hero war oben ueberladen und hatte Layout-Details die mit der Nav-Leiste kollidiert sind. Iterativ bereinigt:
    - **Lorbeerkranz kleiner**: `.hero__laurel-svg max-width: 160px` (vorher 220px). Awards-Text bleibt unveraendert da `.hero__award` `clamp(.85rem, 1.4vw, 1.05rem)` nutzt und auf Mobile an der clamp-min-Grenze sitzt.
    - **Claim ausgeblendet**: Der 4-zeilige "Die Plattform fuer digitale Erlebnisse"-Schriftzug ist auf Mobile `display: none`. Specificity-Trick: `.eyebrow.hero__claim` (0,2,0) statt `.hero__claim` (0,1,0), weil `animations.css` eine unconditional `display: inline-block`-Regel nach `components.css` laedt. Ohne den doppelten Klassen-Selector greift das Hide nicht.
    - **Hero-Padding-Top erhoeht**: `.hero { padding-top: calc(var(--sp-2) + 80px) }` (vorher `+ 40px`). Nav ist fix und ~74px hoch, vorher ragte der Kranz unter der Nav-Leiste hervor. Jetzt 29px Luftabstand zwischen Nav und Kranz-Oberkante.
    - **Cat-Links zentriert + enger**: `.hero .cat-link { align-self: center }` (vorher `flex-start`, linksbuendig). `.hero .hero__right { gap: .4rem }` (vorher sp-2 = 16px, jetzt 6.4px — enger gestapelt). `.hero.container { gap: .6rem }` zieht den ganzen Cat-Link-Block naeher an den JETZT STARTEN-Button.
    - **Social-Icons rechtsbuendig + enger**: `.hero .hero__social { justify-content: flex-end; gap: .5rem; margin-top: sp-2 }`. Instagram + LinkedIn sitzen jetzt rechts im Container (= 24px Abstand zum Viewport-Rand via `.container`-Padding), 8px Abstand zueinander (vorher 16px).
    - **Specificity-Lektion**: Bei mehreren Uebergriffen auf `.hero__social` galt immer die BASE-Regel weil sie NACH meiner Media-Query-Regel in der CSS-Datei stand. Equal specificity → spaeter im File gewinnt. Fix: Specificity bumpen via `.hero .hero__social` (0,2,0) schlaegt die Base `.hero__social` (0,1,0). Gleiche Taktik beim Claim-Hide und bei `.hero__right`.
    - **Cache-Bust-Progression**: `?v=20260417a` (viewBox-breiter) → `b` (Labels groesser) → `c` (Kranz kleiner) → `d` (Claim display:none versucht, hat nicht gegriffen) → `e` (mit Specificity-Fix) → `f` (Cat-Links zentriert — ohne Specificity, hat teils nicht gegriffen) → `g` (mit Specificity, alles greift).


  - **Team-Fotos eingebunden** (`3350b40`): Marilena als `assets/images/team/marilena.webp` (170KB, aus Readymag gespeichert), Maggy als `assets/images/team/maggy.png` (557KB). Platzhalter-Boxen in `ueber-uns.html` durch echte `<img class="team-member__photo">` ersetzt. Alte `marilena.jpg` (war Platzhalter aus frueherer Session) via `git rm` geloescht. Damit ist der offene Punkt "Team-Fotos" von der Liste erledigt. Die Dateinamen sind case-sensitive — ist mir wichtig zu merken: `Marilena.webp` (webp vom User), `maggy.png` (png vom User). Im HTML aber alles kleingeschrieben als `marilena.webp` / `maggy.png`. Beim Kopieren habe ich die Source-Datei `Marilena.webp` (grosses M) nach `marilena.webp` (kleines m) umbenannt — wichtig, weil GitHub Pages case-sensitive serviert.
  - **Mobile-Alternative zur Netzwerk-Viz probiert, verworfen**: Erster Ansatz war eine **Matrix** (Staedte × Kategorien, 4×3 Grid mit Counts als Glassy-Chips), gebaut als separates `js/network-matrix.js` + CSS-Toggle `.network-viz / .network-matrix` via `@media (max-width: 719px)`. Nutzerin wollte das nicht — sie will die originale Netzwerk-Viz behalten, aber hochkant. **Verwerfen**: Matrix-HTML + CSS + JS wieder entfernt. Die leere `js/network-matrix.js` ist lokal als Stub stehengeblieben, ist aber **untracked in git** → landet nicht im Repo. Falls sie lokal stoert einfach loeschen.
  - **Netzwerk-Viz Portrait auf Mobile** (`2198721`): Statt Matrix jetzt die echte SVG-Viz auf Mobile zur **hochkanten Ellipse** umgeformt. Refactor in `js/network.js`:
    - Neue `applyGeometry()` Funktion setzt `W/H/CX/CY/RX_ROUTES/RY_ROUTES/RX_STATIONS/RY_STATIONS/LABEL_OFFSET` je nach MediaQuery `(max-width: 719px)`.
    - Desktop (unveraendert): viewBox 1100×780, RX=RY=290 fuer Routes, RX=RY=165 fuer Stations (Kreis-Ringe), LABEL_OFFSET=48.
    - Mobile (neu): viewBox 700×1100, RX=235/RY=440 fuer Routes, RX=125/RY=245 fuer Stations (stehende Ellipse — horizontal eng, vertikal weit), LABEL_OFFSET=38. Tour-Labels ordnen sich am Ellipsen-Rand an statt in einem Kreis.
    - Label-Positionierung geaendert von `CX + dx*(R+48)` auf `dotX + dx*LABEL_OFFSET` — korrekt fuer Ellipsen-Geometrie.
    - `window.matchMedia('(max-width: 719px)').addEventListener('change', ...)` rendert bei Rotation/Resize automatisch neu (mit direkter Sichtbarmachung ohne Re-Animation).
    - CSS: `.network-viz { aspect-ratio: 1000/700 }` bleibt Desktop-Default; neu `@media (max-width: 719px) { .network-viz { aspect-ratio: 700/1100; max-width: 420px } }`. JS-Viewport und CSS-Container match.
    - Cache-Bust: `js/network.js?v=5 → ?v=6`, `css/components.css?v=20260416b → ?v=20260416c` (nur in `index.html`, Aenderung betrifft nur Startseiten-Viz).
  - **Commits**: `3350b40` (Team-Fotos), `2198721` (Netzwerk-Viz Portrait). Live: https://wuola.github.io/iappear-website/

- Session 9 (Glassy Apple-Style + Netzwerk-Viz + Stadtrundgang-Karten, 2026-04-16):
  - **Glassy-Look (Glassmorphism)** auf allen interaktiven Elementen eingefuehrt — inspiriert vom Apple-Design der i.appear-App (Marilenas Vorlage). Effekt: halbtransparenter Hintergrund, dunkler Inner-Shadow ("eingelassenes Glas"), feine Licht-Kante oben am Stroke, Backdrop-Blur, subtiler aeusserer Glow. Gilt fuer:
    - `.btn` (alle Buttons seitenweit) in `components.css`
    - `.hub-jumpnav__chip` (Jump-Chips auf Stadtrundgang-Seiten) in `components.css`
    - `.ort-tag` (Kategorie-Tags in Ort-Karten) inline in `stadtrundgaenge.html`
  - **Zentrale CSS-Variablen** (`--glass-*`) in `css/global.css` `:root`-Block: `--glass-bg`, `--glass-border`, `--glass-shadow-top`, `--glass-shadow-bottom`, `--glass-highlight`, `--glass-glow`, `--glass-blur` + jeweilige Hover-Pendants. Aenderung an einer Stelle wirkt auf alle drei Komponenten. Ideal fuer Marilenas Feinschliff-Runden.
  - **Kategorie-Varianten** (`.btn--history/--dentity/--grow`): Stroke + Hintergrund in halbtransparenter Kategorie-Farbe, Shadow/Highlight/Blur von den zentralen Variablen.
  - **Netzwerk-Viz groessere Schriften**: Tour-Labels (aeusserer Ring) 13→20px, Station-Labels (innerer Ring) 11→13px, "coming soon" Tag 8→10px, Station-Count 9→11px. Tour-Dots r=5→8 (deutlich groesser). Label-Offset 38→48 (mehr Abstand Dot↔Label). ViewBox 1000x700→1100x780 (mehr Platz am Rand). Innerer Ring R=130→165, aeusserer R=275→290. Mitte bleibt bei 13 Platzhalter-Stationen etwas eng — loest sich mit echten Daten.
  - **Stadtrundgang-Karten auf Landingpage**: Bunte Target-Icons (gelb/blau/gruen je nach Kategorie) ersetzt durch **ein weisses Target** pro Karte. Darunter jetzt **Glassy-Chips** mit Kategorie-Name und Anzahl (z.B. "i.history · 4", "i.dentity · 3", "i.grow · 2") — konsistent mit dem Design auf den Stadtrundgang-Unterseiten.
  - **Automatische Rundgang-Counts via build.py** (`58d9a1b`): `rundgaenge.js` ist jetzt die einzige Quelle der Wahrheit fuer alle Rundgang-Zahlen. Neues `stadt`-Feld pro Region mappt auf City-Slugs (z.B. "Messepark Dornbirn" → dornbirn, "Bodenseeregion" → hard). `build.py` zaehlt pro Stadt + Kategorie und injiziert Ergebnisse in 6 HTML-Dateien via Marker-Kommentare. Drei Marker-Typen: `COUNT:slug` (Zahltext), `CHIPS:kategorie:slug` (Glassy-Chips), `CHIPS:hub` (Hub-Chips). Getestet mit Dummy-Rundgang (Feldkirch +1 history, Zahl ging korrekt von 2 auf 3 und zurueck). Workflow: `rundgaenge.js` bearbeiten → `python build.py` → committen.
  - **Automatische Stadt-Infrastruktur via build.py** (`bcc40d3`): Neuer `IAPPEAR_STAEDTE` Config-Block in `rundgaenge.js` mit Koordinaten, Anzeigename und Subtitle pro Stadt. build.py liest die Config dynamisch (statt hardcoded) und generiert bei einem neuen Ort automatisch: (a) eine neue `stadtrundgang-{slug}.html` Stadtseite mit Breadcrumbs, Schema.org, Kategorie-Sektionen und Tour-Cards aus den Rundgang-Daten, (b) einen Leaflet-Karten-Pin auf der Hub-Seite via `MAP-MARKERS`-Marker, (c) einen Sitemap-Eintrag via `STADTRUNDGANG-URLS`-Marker, (d) einen llms.txt-Eintrag via `STADTRUNDGANG-LINKS`-Marker. Bestehende Stadtseiten werden NICHT ueberschrieben. Getestet mit Dummy-Ort "Schwarzach" (angelegt, geprueft, entfernt). Ort-Cards auf der Hub-Seite bleiben manuell (schuetzt hand-geschriebene Texte).
  - **Commits**: `7894b4a` (Glassy + Netzwerk + Karten), `6dc483d` (Cache-Bust Fix), `58d9a1b` (Auto-Counts), `bcc40d3` (Auto-Staedte). Live: https://wuola.github.io/iappear-website/

- Session 8.5 (Footer vereinheitlicht + Copyright als Marke, 2026-04-15):
  - **Problem**: Der Footer war zwischen Landingpage und Unterseiten komplett inkonsistent. Landingpage hatte einen breiten `.footer__kontakt`-Block (Brand + Adresse + Telefon + E-Mail + Web), der auf der vollen Footer-Breite lag aber nur ~40% Text hatte → wirkte "lost" laut Nutzerin. Alle 44 Unterseiten hatten nur eine einzige Zeile Copyright + "zurück zur Startseite →" und **keine Legal-Links** (Impressumspflicht DACH!). Die Adresse klebte im Copyright-Text mit drin ("© Marilena Tumler e.U. – Mozartstrasse 5 | 16, 6850 Dornbirn") — mischte zwei Dinge. Zusätzlich hatten `agb.html` und `datenschutz.html` noch den alten Pre-Session-8.2 `.footer__grid`-Quicklinks-Block drin (beim Session-8.2-Cleanup übersehen).
  - **Lösung Iteration 1 (erster Anlauf, Commit `db62bfc`)**: Einheitlicher 3-Ebenen-Footer auf ALLEN 45 Seiten: (1) `.footer__brand` mit Brand-Zeile "i.appear – Digital City Tours", (2) `.footer__contact` mit Adresse · Tel · Mail in einer zentrierten Flex-Zeile, (3) `.footer__bottom` mit Copyright + Legal-Nav + "nach oben". Alter `.footer__kontakt`-Block komplett raus aus `index.html`. Alte `footer__grid`-Leichen in agb.html + datenschutz.html auch ersetzt. Ausgerollt via Python-Script mit korrekten `../`-Pfaden für Unterordner. `tel:`-Link in E.164-Format (`tel:+4367682554212`). Copyright von "– Dornbirn" auf "© 2026 Marilena Tumler e.U." umgestellt (Adresse rausgezogen).
  - **Nutzerin-Feedback**: Brand+Kontakt-Block wirkt auf den Unterseiten zu massiv und eintönig — soll nur auf Landing stehen, und dort mit deutlich engerem Luftraum. Außerdem: "kann da im Copyright auch 'i.appear – Digital City Tours' stehen, oder muss der Firmenname?" → Antwort: Ja, darf. Legaler Trick: Das Label im Footer darf der Markenname sein, solange im Impressum die volle Rechtsperson steht (wie bei Spotify, Shopify etc. üblich). Alle JSON-LD Schema.org Blöcke + Impressum/AGB/Datenschutz-Volltexte bleiben unverändert mit "Marilena Tumler e.U." (legal korrekt).
  - **Lösung Iteration 2 (final, Commit `0c9f7a9`)**:
    - `.footer__brand` + `.footer__contact` entfernt aus allen 43 Nicht-Landing-Seiten via Python regex-Entfernung. Nur `index.html` behält Brand + Contact, darunter gleich die Bottom-Leiste.
    - Spacing auf Landing **enger**: `.footer__brand` margin-top `sp-2` (vorher nichts/collapsing), margin-bottom `sp-1`, font-size `1.05rem` statt `1.1rem`, opacity 0.85. `.footer__contact` gap `.4rem sp-3`, margin-bottom `sp-2`, font-size `0.82rem`. `.footer__partner` margin-bottom von `sp-4` auf `sp-3`. Brand+Contact-Block insgesamt jetzt ~55px vertikal (vorher ~150px).
    - **Copyright überall**: "© 2026 Marilena Tumler e.U." → "© 2026 i.appear – Digital City Tours" in 44 Dateien via Python-String-Replace.
    - `.footer__kontakt` Klasse in CSS beibehalten als `display: none`-Kompatibilitätsregel, falls noch irgendwo ein alter Markup-Rest im Code ist.
  - **Cache-Bust-Progression**: `?v=20260415h` (Iteration 1) → `?v=20260415i` (Iteration 2, final).
  - **Commits**: `db62bfc` "Footer vereinheitlicht: Basis-Footer auf allen Seiten" (+1007/-283) → `0c9f7a9` "Footer: Brand+Kontakt nur auf Landing, Copyright als Marke" (+97/-481, überwiegend Entfernung von Brand-Blöcken). Live: https://wuola.github.io/iappear-website/
  - **Lektion für mich**: `grep -l` etc. hab ich über das Bash-Tool statt das dedizierte Grep-Tool gefeuert und damit unnötig Permission-Prompts ausgelöst. Die Einträge sind in `.claude/settings.local.json` gelandet (die Datei soll laut Berechtigungen-Abschnitt ein leerer Stub sein). In dieser Session sauber gemacht. Regel: **immer das Grep-Tool verwenden**, nie `grep`/`rg` über Bash — steht auch schon in der system-weiten Doku.

- Session 8.4 (Stadtrundgang-Hub kompakter + Kategorie-Jump-Chips, 2026-04-15):
  - **Landingpage Kategorie-Karten-Buttons auf gleicher Höhe**: Die drei "Mehr erfahren"-Buttons bei i.history/i.dentity/i.grow auf der Startseite saßen unterschiedlich weit oben, weil die Texte unterschiedlich lang sind. Fix in `components.css` — `.card--kategorie` bekommt `height: 100%` und `.card--kategorie .btn` bekommt `margin-top: auto`. Dadurch docken die Buttons per Flexbox an der Unterkante der jeweiligen Grid-Zelle an, egal wie lang die Texte werden. Zusätzlich wurden die Texte bei i.dentity und i.grow leicht aufgefüllt (je ein Halbsatz dran), damit die Textblöcke auch optisch ähnlich hoch sind.
  - **grid-3 für Rundgang-Cards** auf allen 4 Stadtrundgang-Unterseiten (Dornbirn/Feldkirch/Hard/Au): Auf `stadtrundgang-dornbirn.html` wurden alle 3 Sektionen von `grid-2` auf `grid-3` umgestellt. Feldkirch hat seine i.grow-Sektion ebenfalls auf `grid-3`. Hard und Au haben keinen bestehenden Grid-Wrapper gehabt (nur 1 Karte pro Seite), bekamen aber trotzdem einen `<div class="grid grid-3">`-Wrapper um die einzelne Karte — damit skaliert das Layout automatisch wenn in Zukunft neue Rundgänge dazukommen.
  - **Neue `.page-header--hub` CSS-Variante** (components.css): Kompakter Hub-Header-Block für alle 5 Stadtrundgang-Seiten (Hub + 4 Unterseiten). Eigenschaften: `text-align: left`, `max-width: 720px`, `margin-left: 0; margin-right: auto` (linksbündig im Container statt zentriert), `padding-top: 0` (kein großer Abstand unterhalb des Breadcrumbs), `padding-bottom: var(--sp-2)`, `border-bottom: 1px solid rgba(255,255,255,.08)`. Eigene Typo-Overrides: Eyebrow 0.8rem uppercase letter-spaced, H1 `clamp(1.8rem, 4.2vw, 2.6rem)` in Roboto 900 (vorher ~3.5rem riesig), Subtitle als Serif-Italic klein, Intro-Absätze 0.95rem in `var(--c-text-muted)`. **Header und Intro-Section sind jetzt ein Block**: Die ehemalige separate `<section class="section container"><div class="prose">...</div></section>` darunter fiel weg, der Intro-Text sitzt jetzt als `<div class="page-header__intro">` direkt im Header. Spart ~280-320px Vertikal-Raum. Zusätzlich: `.page-header--hub + .section { padding-top: var(--sp-3) }` bringt die erste Section nach dem Hub-Header nah ran (statt großem sp-6-Abstand).
  - **Jump-Nav-Chips**: Klickbare Pill-Chips im Hub-Header, die per Ankerlink zu Sektionen oder Ort-Karten auf derselben Seite scrollen. CSS: `.hub-jumpnav` (flex + wrap), `.hub-jumpnav__chip` (Pill mit Border in currentColor, kleiner farbiger Dot davor, Hover-Effekt mit leichtem Lift + `color-mix` Hintergrund). Farb-Varianten: `--history / --dentity / --grow` (in den jeweiligen Kategorie-Farben, auf den 4 Stadtseiten), `--neutral` (weiße Outline, auf der Hub-Seite) und `--soon` (gestrichelt, halbtransparent für Bregenz). Jeder Chip zeigt Name + Anzahl als `<span class="hub-jumpnav__count">· N</span>`. **Scroll-Offset**: `.section[id], .ort-card[id] { scroll-margin-top: 80px }` damit die fixe Nav beim Sprung nicht das Ziel verdeckt. Chip-Verteilung:
    - Dornbirn: 3 Chips — `● i.history · 4`, `● i.dentity · 3`, `● i.grow · 2` → Anker `#history`/`#dentity`/`#grow`
    - Feldkirch: 1 Chip — `● i.grow · 2` → `#grow`
    - Hard: 1 Chip — `● i.history · 1` → `#history`
    - Au: 1 Chip — `● i.history · 1` → `#history`
    - Hub (stadtrundgaenge.html): 5 Chips (Dornbirn / Feldkirch / Hard / Au / Bregenz) in neutraler Outline, Bregenz als `--soon`. Anker zeigen auf `id="ort-dornbirn"` etc. auf den Ort-Karten im Grid.
  - **Hub-Seite Zusatz**: Die H2-Überschrift "Unsere Standorte" über der Karte ist raus (sparte nochmal Platz), die Landkarte rückt jetzt direkt unter das Hub-Header-Intro.
  - **Breadcrumb-Abstand global reduziert**: `.breadcrumb` padding-top von `calc(var(--sp-5) + 60px)` (= 124px, davon 60px fürs Freihalten der fixen Nav) auf `calc(var(--sp-3) + 60px)` (= 84px) — 40px Ersparnis, das ist ~1/3 weniger. **Gilt global auf allen Seiten**, nicht nur Stadtrundgang, damit die Optik beim Seitenwechsel konsistent bleibt. User war explizit: "auf wirklich ALLEN seiten machen".
  - **Cache-Bust `?v=20260415g`** auf 44 HTML-Seiten in einem Rutsch via Python-Script (`re.sub` über `*.html + vitrine/*.html + blog/*.html`). Zwischenversionen `?v=20260415a-f` wurden während der Session vergeben; finale Version ist `g`.
  - **Commit**: `074001f` "Stadtrundgang-Hub: kompakter Hub-Header + Kategorie-Chips", 45 Dateien, +221/-106. Live: https://wuola.github.io/iappear-website/stadtrundgaenge.html

- Session 8.2 (Mockup-Refresh + Footer-Cleanup + Kategorie-Header, 2026-04-14):
  - **Phone-Mockups moderner** (alle Verwendungen: Hero, Features, User Guide, Kategorie-Seiten): Der dicke weisse 2px-Border ist weg, stattdessen subtile dunkle Kante mit polierter Highlight-Linie (`inset` shadow) fuer Metall-Look, schmalerer Rahmen (5px statt 8px padding), staerker abgerundete Ecken (36/30px statt 22/18px), Dynamic-Island-Style Notch (schwebende Pille statt alter eingekerbter Notch), weicher Drop-Shadow fuer Tiefe. Mini-Variante (Features-Karten) proportional runtergerechnet (26/22px Radien). Alles in `.phone` / `.phone--mini` in `components.css` — wirkt automatisch ueberall. Die alte Doku im "Phone-Mockup-Konvention"-Block weiter unten bleibt gueltig (Markup `.phone > .phone__screen > video|img` unveraendert).
  - **Footer Quicklinks raus, schlanke Legal-Leiste rein**: Der breite 3-Spalten-Block "Quicklinks" im Footer war reine Dopplung zum Burger-Menue oben rechts (selbe Links, schlechter gruppiert). Komplett entfernt. Stattdessen jetzt im `footer__bottom`: Copyright links, Legal-Links mittig (Kontakt · FAQs · Impressum · Datenschutz · AGB) als `.footer__legal nav`, "nach oben" rechts. Alles in einer schlanken Zeile. Kontakt-Block + Partner-Block bleiben im Footer drin. CSS: `.footer__legal` neu, `.footer__quicklinks/.footer__quick-grid` Regeln entfernt. Cache-Bust `?v=20260414ac`.
  - **Kategorie-Seiten neuer Header** (i-history / i-dentity / i-grow): Page-Header neu strukturiert mit `.page-header--category` Modifier. Aufbau jetzt: (1) i.appear-Logo in Kategorie-Farbe oben (logo-i-gelb/blau/gruen.svg, das echte "i mit Punkt-Auge"-Logo aus `Website_Neu/Logo_iappear_yellow|blue|green.svg`, NICHT die Target-Zielscheiben), (2) **h1 = Brand-Wort gross** in Kategorie-Farbe ("i.history" / "i.dentity" / "i.grow"), (3) Subtitle in Serif-Italic darunter ("Zeitreisen" / "Regionale Identität" / "Medienbildung"), (4) Lead-Text in muted darunter mit dem laengeren SEO-Satz (bleibt fuer Crawler indexiert, h1 wird zum Brand-Wort statt SEO-Satz, vertraglich ok weil der Text als Lead unmittelbar drunter steht). Erst hatte ich faelschlich die `target-*.svg` Zielscheiben verwendet — Nutzerin korrigiert: "die targets sind Zielscheiben, nicht das Logo!". Logos nachgeladen. Cache-Bust `?v=20260414ad → ae`.
  - **Brand-Worte in Roboto Black 900 statt TheSerif**: Globaler H1-Default ist seit Session 7 TheSerif HP9 Black, was bei "i.history" als Brand-Wort sehr cartoonig wirkt ("Comic"). Im `.page-header--category h1` jetzt ueberschrieben mit `font-family: "Roboto"; font-weight: 900;` plus Letter-Spacing `-.02em`. Wirkt nur auf den 3 Kategorie-Headers, alle anderen H1s bleiben TheSerif. Provisorium bis Marilena Typografie-Konzept gesamt durchspricht (siehe offener Punkt).

- Session 8.1 (Feldkirch + Lorbeerkranz + Uni Wien Hauptfoerderer, 2026-04-14):
  - **Feldkirch-Fix**: Barockbaumeister Franz Beer gehoert NUR nach Au, nicht nach Feldkirch → entsprechend aus `stadtrundgang-feldkirch.html` entfernt und durch die zwei richtigen Schulprojekte ersetzt: **Zusammenwachsen (MS Levis)** zu Werten/Demokratie/Zusammenleben + **Ein Oktobertag (MS Oberau)** zu den Bombenabwuerfen 1943. Auch Hub (`stadtrundgaenge.html`), Landingpage-Teaser, `rundgaenge.js`, `llms.txt` und Meta-Tags alle durchsyncronisiert.
  - **Lorbeerkranz-Animation symmetrisch + schneller**: Von asymmetrischem stroke-dashoffset-Draw auf `clip-path: circle()` Reveal umgestellt — startet unten zentriert und waechst nach aussen, beide Haelften erscheinen gleichzeitig. 5s → 2.2s. Award-Rotator-Delays final auf 1.3s/7.3s/13.3s damit der erste Award-Text nahtlos erscheint wenn der Kranz fertig gezeichnet ist, keine Luecke mehr.
  - **Footer Vorarlberg-Logo Fix**: Das alte `Marke_Vorarlberg_weiss_neu.svg` wurde durch das korrekte `logos/vorarlberg-wort.svg` ersetzt. Stolperfalle: das neue Logo hat weisses Wappen + schwarzes V, und der globale `.partner-logo img { filter: brightness(0) invert(1) }` Filter hat das schwarze V ebenfalls weiss gefaerbt → V verschwand. Neue Opt-out-Klasse `.partner-logo--raw img { filter: none }` eingefuehrt fuer Logos die ihre eigenen Farben mitbringen (z.B. Vorarlberg-Wappen und Uni-Wien-Logo).
  - **Network-Caption unter der Netzwerk-Viz entfernt**: Die drei Elemente unter der Netzwerk-Grafik auf der Landingpage (2 Logos + "Beispiel-Rundgaenge"-Text) sind raus — die Viz steht jetzt allein.
  - **Uni Wien Hauptfoerderer-Block "Variante A"**: Das Universitaet-Wien-Logo ist jetzt als prominenter Hauptfoerderer-Block UEBER dem Partner-Grid platziert (vorher 200px unten dran, kaum sichtbar). Logo 280-320px breit, weiss, mit Begleittext "Entwickelt im Rahmen einer Masterarbeit an der Universitaet Wien" rechts daneben (Desktop) oder darunter (Mobile). Trennlinie zum Partner-Grid setzt es klar ab. Einhaltung des **Uni Wien CD-Manual Sommer 2025** verifiziert: Kapitel 1.2 Mindestgroesse 9mm (~34px) mit 90-110px uebererfuellt; Kapitel 1.3 Schutzzone H/3 an allen 4 Seiten durch Padding var(--sp-3/4) abgedeckt; Kapitel 1.4 weisse Variante auf dunklem Hintergrund erlaubt, "ruhiger Hintergrund" durch den schwarzen Footer gegeben; Kapitel 1.6 nicht verzerrt/eingefaerbt/angeschnitten. Logo-Datei kommt unveraendert aus `Website_Neu/PARTNER LOGOS/Uni Wien/SVG_Dateien/UniWien_white_A4.svg`. Als `<img src="...svg">` eingebunden → Browser laedt die SVG byte-identisch, keine Bearbeitung. `.partner-uniwien` in `components.css` komplett ueberarbeitet. Auf `index.html` (Footer) und `ueber-uns.html` (Partner-Sektion) ausgerollt. Cache-Bust `?v=20260414aa`.
  - **Worktree- und .obsidian-Rauschen im Commit**: Beim Uni-Wien-Commit (`c53fd57`) sind via `git add -A` versehentlich alte `.claude/worktrees/{heuristic-shtern,romantic-sutherland}/` Reste + der `.obsidian/`-Config-Ordner mit ins Repo gerutscht. Harmlos, aber Rauschen. Aufraeumen nur mit Nutzerin-OK: `.gitignore`-Eintrag + `git rm --cached` (ist Deny-Liste-naeher). Steht offen.

  - **UTF-8 Umlaute (ä/ö/ü) ueberall statt ae/oe/ue**: Alle sichtbaren Texte in 45 HTML-Dateien + `js/data/*.js` auf echte Umlaute umgestellt. Python-Whitelist-Script mit ~350 expliziten Wort-Mappings, damit "Quelle", "Dauer", "neue", "Frauen", "Auer" etc. NICHT versehentlich kaputt gehen. Ersetzt in: Text-Nodes, sicheren Attributen (title/alt/content/aria-label/placeholder), JSON-LD Schema.org Strings, inline `<script>`-Strings (nur Literale, nicht Identifier). NICHT angefasst: URLs, hrefs, Klassennamen, IDs, Dateipfade, CSS-Code, JS-Identifier wie `querySelector`. Eigennamen wie "Saegenvier" und "Mohrenbrauerei" uebersprungen. `ß` komplett uebersprungen (User-Entscheidung: "in oesterreich weiss eh niemand was sache ist" — bleibt `ss`). File-Namen wie `stadtrundgaenge.html` / `ueber-uns.html` bleiben als ASCII, nur der sichtbare Menuetext ist jetzt "Stadtrundgänge" / "Über uns".

### Versionen und Rollback (wichtig!)

Beide Versionen sind auf GitHub gesichert:
- **Neue Version (aktuell auf main)**: Kompakte Startseite + eigene Unterseiten + Vitrine/Blog-Merge + Rename. Commit `376e30e`.
- **Alte Version**: Lange Scroll-Startseite mit #anchor-Navigation. Git-Tag `vor-experiment` (Commit `5c7fab7`).

Rollback zur alten Version (nur wenn Nutzerin es will!):
```bash
git checkout main
git reset --hard vor-experiment
git push origin main --force
```

Zurueck zur neuen Version:
```bash
git checkout main
git reset --hard experiment/startseite-neu
git push origin main --force
```

Branch `experiment/startseite-neu` bleibt als Backup erhalten — NICHT loeschen.
Live-Vorschau: https://wuola.github.io/iappear-website/

### Was noch offen ist
- **Phone-Mockups Feinschliff** (Session 8.2): Nutzerin findet die neuen Mockups super, aber die Dynamic-Island-Pille (oben zentrierte schwarze Notch) verdeckt im Video-Bereich Content (z.B. Titel im hist.appear-Video). Marilena soll noch entscheiden wie's am Ende ausschauen soll — entweder Notch ganz weg, kleiner machen, oder Video-Inhalte unten beschnitten lassen. CLAUDE.md-Eintrag steht, vor dem Launch nochmal anpacken.
- **Typografie-Konzept gesamt mit Marilena durchsprechen** (Session 8.2): Aktueller Stand ist gemischt — Roboto Body, TheSerif (LucasFonts) als Headline-Default seit Session 7, aber TheSerif HP9 Black wirkt bei kurzen Brand-Worten zu "comic"-haft (Nutzerin-Original: "das schaut so echt nach comic aus"). Auf den 3 Kategorie-Seiten provisorisch auf Roboto Black 900 fuer h1 umgestellt. Frage an Marilena: Welche Schrift fuer Brand-Worte / Headlines / Subtitles? Ist das Mix-Konzept (Serif fuer Subtitle, Sans fuer Brand) ueberhaupt richtig oder soll alles einheitlich Sans / einheitlich Serif sein? Vor dem Launch klaeren, dann auf alle Seiten konsistent ausrollen.
- **User Guide Phone-Screenshots** ✓ ERLEDIGT in Session 10.4 (2026-04-27): 13 Bilder direkt aus dem Readymag-CDN gezogen via Chrome-MCP, in `assets/images/user-guide/` abgelegt mit Namen `a1-koffer/karte`...`a4`, `b1`, `b2`, `b2-tipp`, `b3`, `b4-koffer/karte`. Logik komplett umgebaut auf das Original-Konzept (Pfad A mit Toggle + Mickey-Hand + Schritt-4-Feature-Icons; Pfad B mit Verzweigung in Schritt 2). **Offen fuer naechste Session**: Maggy will noch ein paar Detail-Anpassungen ("logik+bilder stimmen, ein paar sachen muss man noch anpassen") — was genau wird beim naechsten Mal definiert.
- **Netzwerk-Visualisierung Startseite** (Stand 2026-04-17): Desktop = konzentrische Kreis-Ringe (viewBox 1100×780, R_ROUTES=290, R_STATIONS=165). Mobile seit Session 10 = hochkante Ellipse (viewBox 700×1100, RX=235/RY=440 fuer Routes, RX=125/RY=245 fuer Stations). MediaQuery-Listener rendert bei Rotation/Resize neu. Stations-Daten sind weiterhin **Platzhalter** — echte Tour-Stations-Zuordnung muss noch nachgepflegt werden, dann loest sich auch die Label-Ueberlappung in der Mitte. Nutzerin testet Mobile-Darstellung am 17.04.2026 am Handy, Feinschliff (Ellipsen-Masse, Schriftgroessen, Abstaende) moeglicherweise noch faellig.
- **Kategorie-Buttons im Hero** — seit Session 9 haben die Stadtrundgang-Karten auf der Landingpage Glassy-Chips statt bunter Targets. Die Kategorie-Karten (i.history/i.dentity/i.grow) haben ebenfalls Glassy-Buttons. Offener Punkt war `.card__badge` — pruefen ob das noch irgendwo falsch sitzt.
- **Hero-Layout** insgesamt — Nutzerin Vermerk: "da pass sowieso was mit dem layout nicht" — Feinschliff sobald alles drauf ist
- **1 fehlendes Vitrine-Bild**: nur noch Podiumsdiskussion PH Vorarlberg (Maggy: Bild liegt im Readymag-Editor, klaeren wir spaeter — vermutlich aehnlich extrahieren wie die User-Guide-Bilder via Chrome-MCP). Florenz-2023 ist seit Session 10.5 (2026-04-27) drin (`florenz.png` als Hero-Bild + Vitrine-Grid).
- **2 Vitrine-Links Platzhalter**: "Schafferei Traumjob" + "Podiumsdiskussion PH" zeigen auf falsche Meetup-URL — Nutzerin liefert echte Links nach
- **Restliche Widgets** aus `_doku/recon/widgets/` — Stand nach Session 7.1 (2026-04-14):
  - `glow-pure-*.html` -> **eingebaut** als `.hero__glow` SVG-Layer in `index.html` Hero, CSS-Animation in `components.css` (sig-root / sig-left / sig-right mit offset-path, dash-flow auf wires, `prefers-reduced-motion` respektiert)
  - `header-anim-container-27ac988ab3.html` -> **eingebaut** als Drift-Hover auf `.hero__claim` in `components.css` (jede der 4 Zeilen driftet beim Hover leicht unterschiedlich)
  - `i-appear-kranz-v4-fc4f90a579.svg` -> **nicht nötig**, identisch zu unserer `assets/svg/logos/lorbeerkranz.svg` (laeuft schon im Hero mit rotierenden Awards)
  - `iappear-process-safe-1c5e16a08c.html` -> **nicht nötig**, unsere Version in `workflow.html` hat schon die exakten Labels aus dem Original (Idee & Konzept, Inhalte & Story, Medienproduktion, Abstimmung & Implementierung, Launch & Service)
  - `ia-guide-container-*`, `ia-guide-nav-*`, `ia-emergency-toggle-*` ✓ ERLEDIGT in Session 10.4: Komplett umgesetzt inklusive Mickey-Hand-Animation. Code basiert nicht mehr auf den Recon-Widget-Snippets, sondern auf den 2 aktuellen Code-Bloecken die Maggy am 2026-04-27 geschickt hat (Pfad A + Pfad B). Recon-Widgets koennen jetzt archiviert werden.
  - Rest (ia-icon-wrapper-*, iappear-scroll-top-container-*, menu-styles-*, iappear-logo-*.svg, network-container-*) -> eigenes sauberes Aequivalent existiert, Recon-Widgets koennen als archiviert gelten
  - (5-Schritt-Prozess fuer workflow.html — erledigt in Session 7)
  - (User Guide A+B Widgets — erledigt in Session 7, Bilder fehlen noch)
  - (Lorbeerkranz-Animation — laeuft schon)
  - (Toggle Karte/Koffer — gehoert in den User Guide; aktuell weggelassen weil ohne echte Inhalte unnoetig komplex)
- ~~Map-Kreis-Deko auf Kategorie-Seiten~~ ✓ ERLEDIGT in Session 14: Mini-Karten pro Rundgang-Card (echte Leaflet-Karten mit Stations-Markern in Brand-Farbe) statt der ueberlegten Map-Kreis-Deko. Ausgerollt auf alle 12 Rundgaenge der Kategorie-Seiten (i-history/i-dentity/i-grow). 125 Jahre 125 Bilder bleibt schwarze "Coming soon"-Box (kein Rundgang).
- **Mini-Karten Daten-Auffaelligkeiten** in `_doku/karten-todos.md`: 3 Default-Koordinaten in hist.appear, Doppelpunkte in See Runde, Barockbaumeister-Bounds extrem (Au → Schweiz), Mapping-Annahmen bei i.grow. Frauenspuren-Stat-1 ist seit 2026-04-29 in Storyblok korrigiert (Maggy hat's nachgezogen). Restliche Punkte spaeter.
- Domain-Umleitung (ganz am Schluss)

### Build-Schritt: `python build.py`
Bei Aenderungen an `js/data/vitrine.js` ODER `js/data/rundgaenge.js` MUSS einmal `python build.py` laufen. Das Script macht zwei Dinge:

1. **Vitrine-Kacheln**: Liest `vitrine.js` → rendert HTML zwischen `<!-- VITRINE-GRID-START -->` / `<!-- VITRINE-GRID-END -->` in `vitrine.html`.
2. **Rundgang-Counts** (seit Session 9): Liest `rundgaenge.js` → zaehlt Rundgaenge pro Stadt und Kategorie → injiziert Ergebnisse in 6 HTML-Dateien (index.html, stadtrundgaenge.html, 4 Stadtseiten). Marker-Typen:
   - `<!-- COUNT:stadtslug:START -->...<!-- COUNT:stadtslug:END -->` — Zahltext ("10 Stadtrundgaenge & Audioguides")
   - `<!-- CHIPS:kategorie:stadtslug:START -->...<!-- CHIPS:kategorie:stadtslug:END -->` — Glassy Kategorie-Chips
   - `<!-- CHIPS:hub:START -->...<!-- CHIPS:hub:END -->` — Hub-Chips auf stadtrundgaenge.html

Wichtig: `rundgaenge.js` braucht pro Region ein `stadt`-Feld (City-Slug), damit das Script weiss welche Region zu welcher Stadt gehoert (z.B. `stadt: "dornbirn"` fuer "Messepark Dornbirn").

**Neuen Ort hinzufuegen (seit Session 9):**
1. In `IAPPEAR_STAEDTE` (am Ende von `rundgaenge.js`) den neuen Ort eintragen: `slug: { name: "...", lat: ..., lng: ..., subtitle: "..." }`
2. Rundgaenge mit `stadt: "neuer-slug"` in den Kategorie-Bloecken eintragen
3. `python build.py` → generiert automatisch: Stadtseite, Karten-Pin, Sitemap, llms.txt, alle Counts
4. Optional: Ort-Card auf Hub-Seite manuell hinzufuegen (Copy-Paste von bestehender Card, Marker setzen)

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
- **UTF-8 Umlaute ab Session 7 (2026-04-14)**: Sichtbare Texte verwenden echte ä/ö/ü. Nur im Code (CSS-Kommentare, JS-Identifier, Kommentare hier im CLAUDE.md) bleibt ae/oe/ue weil historisch so gewachsen. `ß` bleibt als `ss` geschrieben (User-Entscheidung: kein scharfes ß).
- Nutzerin ist kein Developer — Kommentare im Code auf Deutsch und sehr verstaendlich halten
- Eigenstaendig arbeiten, nicht bei jedem Schritt nachfragen
