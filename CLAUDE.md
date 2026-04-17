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
- **User Guide Phone-Screenshots** (Nutzerin liefert nach): pro Schritt 1 Bild, 8 insgesamt. Ablage `assets/images/user-guide/a1.png`..`a4.png` + `b1.png`..`b4.png`. Sobald da, im Script-Block von `user-guide.html` die `img: null` Eintraege auf den Pfad setzen.
- **Netzwerk-Visualisierung Startseite** (Stand 2026-04-17): Desktop = konzentrische Kreis-Ringe (viewBox 1100×780, R_ROUTES=290, R_STATIONS=165). Mobile seit Session 10 = hochkante Ellipse (viewBox 700×1100, RX=235/RY=440 fuer Routes, RX=125/RY=245 fuer Stations). MediaQuery-Listener rendert bei Rotation/Resize neu. Stations-Daten sind weiterhin **Platzhalter** — echte Tour-Stations-Zuordnung muss noch nachgepflegt werden, dann loest sich auch die Label-Ueberlappung in der Mitte. Nutzerin testet Mobile-Darstellung am 17.04.2026 am Handy, Feinschliff (Ellipsen-Masse, Schriftgroessen, Abstaende) moeglicherweise noch faellig.
- **Kategorie-Buttons im Hero** — seit Session 9 haben die Stadtrundgang-Karten auf der Landingpage Glassy-Chips statt bunter Targets. Die Kategorie-Karten (i.history/i.dentity/i.grow) haben ebenfalls Glassy-Buttons. Offener Punkt war `.card__badge` — pruefen ob das noch irgendwo falsch sitzt.
- **Hero-Layout** insgesamt — Nutzerin Vermerk: "da pass sowieso was mit dem layout nicht" — Feinschliff sobald alles drauf ist
- **2 fehlende Vitrine-Bilder**: Florenz 2023, Podiumsdiskussion PH Vorarlberg
- **2 Vitrine-Links Platzhalter**: "Schafferei Traumjob" + "Podiumsdiskussion PH" zeigen auf falsche Meetup-URL — Nutzerin liefert echte Links nach
- **Restliche Widgets** aus `_doku/recon/widgets/` — Stand nach Session 7.1 (2026-04-14):
  - `glow-pure-*.html` -> **eingebaut** als `.hero__glow` SVG-Layer in `index.html` Hero, CSS-Animation in `components.css` (sig-root / sig-left / sig-right mit offset-path, dash-flow auf wires, `prefers-reduced-motion` respektiert)
  - `header-anim-container-27ac988ab3.html` -> **eingebaut** als Drift-Hover auf `.hero__claim` in `components.css` (jede der 4 Zeilen driftet beim Hover leicht unterschiedlich)
  - `i-appear-kranz-v4-fc4f90a579.svg` -> **nicht nötig**, identisch zu unserer `assets/svg/logos/lorbeerkranz.svg` (laeuft schon im Hero mit rotierenden Awards)
  - `iappear-process-safe-1c5e16a08c.html` -> **nicht nötig**, unsere Version in `workflow.html` hat schon die exakten Labels aus dem Original (Idee & Konzept, Inhalte & Story, Medienproduktion, Abstimmung & Implementierung, Launch & Service)
  - `ia-guide-container-*`, `ia-guide-nav-*`, `ia-emergency-toggle-*` -> **noch nicht abgeschlossen**: User Guide ist inhaltlich fertig, aber im Original gab es eine **tippende Hand** ("Mickey-Mouse-Hand") die die Icons in der App bedient. Widgets noch NICHT loeschen, Nutzerin will das Detail nachziehen.
  - Rest (ia-icon-wrapper-*, iappear-scroll-top-container-*, menu-styles-*, iappear-logo-*.svg, network-container-*) -> eigenes sauberes Aequivalent existiert, Recon-Widgets koennen als archiviert gelten
  - (5-Schritt-Prozess fuer workflow.html — erledigt in Session 7)
  - (User Guide A+B Widgets — erledigt in Session 7, Bilder fehlen noch)
  - (Lorbeerkranz-Animation — laeuft schon)
  - (Toggle Karte/Koffer — gehoert in den User Guide; aktuell weggelassen weil ohne echte Inhalte unnoetig komplex)
- Map-Kreis-Deko auf Kategorie-Seiten
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
