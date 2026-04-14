# iappear.at – Website Rebuild

## Projekt

Rebuild der Website iappear.at als statisches HTML/CSS/JS Projekt.
Hosting: GitHub Pages (wuola.github.io/iappear-website)
Ziel-Domain: iappear.at (Umleitung kommt ganz am Schluss)

**Hard constraints:**
- KEIN Publish auf iappear.at (Domain bleibt vorerst beim Readymag-Original)
- NICHT die bestehende Readymag-Seite anfassen
- Innerhalb des Repos volle Autonomie für alle anderen Entscheidungen

## Berechtigungen (seit 2026-04-14)

`.claude/settings.local.json` hat eine breite Allowlist — routinemaessige Operationen laufen ohne Rueckfrage: Edit/Write/Read, `git add/commit/push/diff/status/log/branch/checkout/stash/tag/fetch/pull`, `git reset --soft`, `python`, `cp/mv/mkdir/touch/ls/cd`, `cat/head/tail/wc/echo`, `gh pr/api/run/issue`, WebSearch/WebFetch.

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
- **User Guide Phone-Screenshots** (Nutzerin liefert nach): pro Schritt 1 Bild, 8 insgesamt. Ablage `assets/images/user-guide/a1.png`..`a4.png` + `b1.png`..`b4.png`. Sobald da, im Script-Block von `user-guide.html` die `img: null` Eintraege auf den Pfad setzen.
- **Netzwerk-Visualisierung Startseite** (Stand 2026-04-14, Layout "konzentrische Ringe"): Layout ist jetzt **zwei konzentrische Kreise** — Rundgaenge aussen (R=275), Stationen innen (R=130), mit **geraden Linien** dazwischen. Rundgaenge sind gruppiert nach Kategorie im Uhrzeigersinn ab 12 Uhr (history → dentity → grow). Stationen werden nach dem Schwerpunkt-Winkel ihrer verbundenen Touren sortiert und gleichmaessig um den inneren Ring verteilt — das minimiert Linienkreuzungen. Nutzerin findet's "voll geil geworden". Stations-Daten sind weiterhin Platzhalter (Marktplatz, Rotes Haus, Pfarrkirche, Mohrenbrauerei, Textilweg, Eisengasse, BORG Schoren, Hatlerstrasse, Zanzenberg, Gutle, Rappenloch, Messepark, Stadtarchiv) — echte Tour-Stations-Zuordnung muss noch nachgepflegt werden. **Stolperfalle dokumentiert:** `var`-Deklarationen muessen VOR den Funktionsaufrufen stehen die sie nutzen, sonst NaN-Koordinaten durch Hoisting ohne Wert-Init. Commits: `ba6009f` (initial live), `8e650d9` (konzentrische Ringe), `7522581` (NaN-Fix).
- **Kategorie-Buttons im Hero** (Nutzerin Vermerk: "sollte glaub ich eigentlich anders ausschauen") — aktuell falsch als `.card__badge` in den Kategorie-Karten
- **Hero-Layout** insgesamt — Nutzerin Vermerk: "da pass sowieso was mit dem layout nicht" — Feinschliff sobald alles drauf ist
- **Team-Fotos** (Marilena + Maggy) — Nutzerin reicht nach, aktuell Platzhalter mit TODO-Kommentaren
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

### Build-Schritt: Vitrine statisch
Bei Aenderungen an `js/data/vitrine.js` MUSS einmal `python build.py` laufen, sonst ist der statische Kachel-Block in `vitrine.html` veraltet. Das Build-Script liest die 22 Eintraege aus der JS-Datei und rendert sie als HTML-Block zwischen `<!-- VITRINE-GRID-START -->` / `<!-- VITRINE-GRID-END -->` rein. Warum ueberhaupt? Weil LLM-Crawler (ChatGPT/Claude/Perplexity/Common Crawl) kein JavaScript rendern — nur was direkt im HTML steht, sehen sie. Der JS-Renderer in `vitrine.js` ist nur Notnagel-Fallback. Komplette Doku: `_doku/vitrine-bearbeiten.md`.

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
