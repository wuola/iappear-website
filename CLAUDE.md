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
- **Blog-Artikel zeigen keine Person als Autor.** Bewusste Entscheidung Session 37: kein "von <Name>" sichtbar, kein `<meta name="author">`, kein `article:author`. Im JSON-LD `BlogPosting.author` referenziert auf `https://iappear.at/#organization` (Organization-Ref) statt `Person`. Gilt fuer alle Blog-Artikel und auch zukuenftige.
- **Hero-Bilder fuer Blog-Artikel werden per PIL aus Site-Mockup-Posters komponiert.** Phone-Frame-Werte proportional zur Site-Phone-CSS skalieren — Frame-Width-Ratio ~4.5%, Phone-Corner-Ratio ~30%, Screen-Corner-Ratio ~27%. **NICHT 1:1** vom CSS uebernehmen, sonst sind Frames bei groesseren Bildern unsichtbar. Render in voller Aufloesung, dann LANCZOS-Downscale. Bei `max-width:480px` im img-style statt kleinerer JPG-Aufloesung — bewahrt Schaerfe. **Output-Format einheitlich 700&times;550 JPG → 480&times;377 angezeigt** auch bei nur 1 Phone (zentriert mit Schwarzraum statt Hochformat-Canvas — Format-Konsistenz schlaegt Whitespace-Optimierung). PIL-Skript-Pattern + Maesse in Session 37. Bei Bild-Updates: **Filename aendern** statt nur `?v=...`-Query — manche Cache-Layer (Claude-Desktop-Preview) ignorieren Query-Strings.
- **Phone-Mockup-Aspect-Ratio MUSS strikt 9:19 sein** (Phone-Outer-Width = Phone-Outer-Height &times; 9/19, also 0.474). Session 37 hatte fuer Frauenspuren-Hero v2 die Outer-Width auf 508 statt 391 gesetzt (Aspect 0.616) → Phone wirkte ei-foermig statt schlank. Bei 825 Phone-Outer-Height ist die korrekte Outer-Width = 825 &times; 9/19 = **391**, nicht 508. Frame/Corner-Ratios proportional zur korrigierten Outer-Width berechnen. Pixel-Scan als Verifikation des Renders: Aspect des Phone-Outer-Bounding-Box muss 0.473 ± 0.01 sein. Falls Source-Bild ein anderes Aspect hat als Screen: **Letterbox top/bottom (Schwarz 8-9px) statt seitliche Crop** — Maggy will den App-Screen-Inhalt komplett sichtbar (Bug-Story v2 → v3 → v4 in Session 39).
- **Browser-Headless-Screenshots fuer Hero-Grafiken: `--virtual-time-budget=Nms` ist Pflicht** bei animierten HTML-Inhalten. Brave/Chrome/Edge (Chromium): `brave.exe --headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=3000 --screenshot=<path>.png --window-size=WxH file://<html-path>`. Ohne `--virtual-time-budget` sieht man Initial-Frames mit `opacity:0` / `scaleX(0)`. Pattern in Session 39 (Artikel-02-Hero aus `grafik_02a_medienkompetenz.html`).
- **Original-Assets im Repo IMMER 1:1 nutzen, nie per Pixel-Code rekonstruieren.** Wenn ein Logo/Icon/Marken-Asset im Repo liegt (`Glob assets/**` zuerst, immer), dieses einbauen — niemals per `PIL.ImageDraw` (Bezier-Approximation, Rechtecks-Naeherung des Pfads) nachbauen. Format-Wechsel SVG → PNG via Brave-Headless-Render (SVG ueber `file://` mit `--screenshot` + LANCZOS-Downscale via Pillow) oder cairosvg, nie per Code-Rekonstruktion — klobige Strichstaerken und falsche Proportionen sind das Resultat. Lehre Session 40: beim Favicon-Bau habe ich das i.-Mark erst per Pillow approximiert, obwohl `assets/svg/logos/logo-weiss.svg` direkt verfuegbar war. Gilt analog fuer alle SVG-Logos in `assets/svg/logos/`. Pattern fuer SVG-zu-PNG-Pipeline: Render-SVG mit `<rect>` oder `<circle>` als Background-Layer + Original-Logo-Pfade als `<g transform="...">` zentriert/skaliert eingebettet → Brave-Headless rendert pixelgenau → Pillow downscaled. Favicon-Setup in Session 40 als Beispiel.
- **Branded Banner-Renders mit Schrift: HTML-Template + Browser-Headless, nicht SVG-Komposition.** Wenn ein Banner Schrift in Brand-Fonts braucht (z.B. og-image, Share-Karten): `_render-*.html` im Repo-Root mit `<link rel="stylesheet" href="css/global.css">` einbinden — TheSerif + Roboto sind dann automatisch da via `@font-face`. Layout per CSS flexbox/grid, Logo-SVGs inline einbetten, Brave-Headless mit `--window-size=WxH` rendert pixelgenau. Pattern in Session 41 (og-image-Rebuild) etabliert.
- **OG-Image-Strategie: Generic fuer Hubs, eigene fuer Content-Pages.** `assets/og-image-v2.png` ist das Site-Generic-Banner (i.appear Wordmark + Slogan + 3 Kategorien) und gilt fuer Hauptseiten, Kategorien, Hub-Seiten, Rechtstexte, EN-Seiten ohne eigenes Asset. **Content-Pages mit klarem Hauptbild** (Blog-Artikel, Vitrine-Artikel) bekommen ihr **eigenes og-image**: Blog → das Hero-Bild aus `blog/images/`, Vitrine → das Teaser-Bild aus `vitrine.js` (`bild:`-Feld). Bei `vitrine.js`-Edits den og:image-Tag im zugehoerigen HTML auch nachziehen (kein Build-Tool automatisiert das). Pflicht-Felder pro Artikel: `og:image`, `og:image:width`, `og:image:height` (absolute URL, echte Dimensions via Pillow `im.size`). Lehre Session 41: alle 58 HTMLs nutzten urspruenglich das gleiche Generic-Bild — Brand- und Wiedererkennungs-Verlust beim Social-Sharing. **Beim spaeteren Tausch eines og-image: Filename mit Versions-Suffix wechseln** (z.B. `og-image-v2.png` → `og-image-v3.png`) + alle Referenzen in HTMLs anpassen. **Nicht nur die Bytes austauschen.** Sonst greift Plattform-OG-Scraper-Cache (Microsoft Teams, Apple iMessage, Facebook, LinkedIn) und zeigt alte/kaputte Vorschau-Karte weiter — diese Caches liegen auf Drittanbieter-Servern und sind durch Maggys Private-Tab-Workflow NICHT umgehbar. Bei Cache-Diagnose immer spezifizieren WELCHER Cache (Browser / Fastly-CDN / Plattform-Scraper / Plattform-In-Client) — "alles ist gecached" reicht nicht. Lehre Session 42 (2026-05-11).
- **Iframe-Embed fuer Blog-Grafiken braucht JS-Auto-Resize.** `aspect-ratio` reicht nicht — Mobile rendert Inhalte mit anderen Proportionen. Inline-Script vor `</body>` mit `ResizeObserver` auf `iframe.contentDocument.body` setzt `iframe.style.height = scrollHeight`. Pattern in `blog/was-ist-ein-digitaler-stadtrundgang.html`.
- **Folge-Beitraege haben eigene Slugs (SEO-flexibel) und manuelle 3-Stellen-Pflege.** Pattern Session 37: Folge-Artikel als eigenstaendige HTML mit `mentions`-Reference im Schema und 4-stufiger Breadcrumb. Hauptartikel bekommt `<section class="article__series">` mit `<ol>` der Folgen vor der Tag-Wolke. Uebersichten (`blog/index.html` UND `vitrine.html`) bekommen `<details class="blog-card-series">` direkt nach der Hauptartikel-Card. CSS-Klassen `.article__series` / `.article__parent-link` / `.blog-card-series` in `components.css`. Sitemap-Priority eine Stufe unter dem Hauptartikel (0.6 statt 0.7). Bei Slug-Wahl: KEINE `<haupt-slug>-update-N.html`-Logik — eigene SEO-flexible Slugs.
- **Video-Hero fuer Blog-Artikel (statt Hero-Bild) ist erlaubt.** Pattern Session 48 (`blog/augmented-reality-ios-android.html`): ffmpeg → mp4 (1280 breit, CRF 27, `+faststart`, ggf. ohne Audio) + jpg-Poster aus einem sauberen Frame. Markup `<video class="article__hero-video" poster autoplay muted loop playsinline preload="metadata">` mit `<source mp4>` + `aria-label` + `<figcaption>`. Der Poster-Frame dient zugleich als `og:image` (Video kann kein og:image sein) — echte Dimensions angeben. 12s-Loop @1280 ≈ 0,8 MB. Assets in `blog/images/`.
- **Code im Blog als echte `<pre>`-Bloecke, nicht als Screenshots.** Pattern Session 48: Code abtippen (scharf, kopierbar, SEO-lesbar), dezente Syntax-Toene per Span-Klassen (`.c` Kommentar grau-kursiv, `.s` String gruen, `.k` Keyword/Bool amber, `.fn` Property/Funktion blau), Monospace ueber System-Stack (`ui-monospace,…`, TheSans Mono ist nicht geladen). **CSS als seiten-eigener `<style>`-Block im `<head>`**, solange nur ein Artikel die Klassen nutzt — vermeidet die Cache-Bust-Kaskade ueber alle HTMLs. `<`/`>`/`&` in Code mit Entities escapen.
- **Keine internen Setup-Details in oeffentlichen Blog-Texten.** Lehre Session 48: Maggys Roh-Text nannte unbeabsichtigt Host (Vercel), CMS (Storyblok), Deploy-Branch, Git-Konto-Check, Framework-Versionen, interne Dateipfade. Bei Roh-Texten immer darauf pruefen und generalisieren ("der Hosting-Dienst", "ein CMS", "der Build der Web-Anwendung") — oeffentliche Tool-Namen (Blender, Needle Engine, WebXR, Quick Look, USDZ, MCP) sind ok. Grep-Gegenpruefung am Ende.
- **Session-Nummer VOR Doku-Erstellung im README pruefen — nicht raten.** Bei parallelen Worktrees am gleichen Tag kann sonst die gleiche Session-Nr von 2 Claudes vergeben werden (siehe Vorfall 2026-05-08: zwei "Session 37"-Dokus aus Worktrees `heuristic-cori` und `bold-mclaren` parallel; aufgeloest in Session 38 durch Umnummerierung auf 36.5). **Workflow am Sessionstart**: `_doku/sessions/README.md` lesen → hoechste Nummer + 1 nehmen. Falls eine ".5"-Nr noetig ist (parallele Diagnose-/Read-Only-Session, die zwischen zwei Code-Sessions verortet ist): explizit als z.B. "36.5" benennen. **Worktree-Konflikt-Check**: vor neuer Doku `git worktree list` ansehen — wenn andere Worktrees aktive Branches haben, deren `_doku`-Stand fetchen (`git fetch origin` + Branches anschauen), bevor Session-Nr festgelegt wird.

## Aktueller Stand (Mai 2026)

**🚀 LIVE auf https://iappear.at seit 2026-05-04 ~15:20 (Session 25).** Alle 11 Hauptseiten + 4 Stadtseiten + 22 Vitrine-Artikel stehen. Designsystem (glassy/strokeless) konsistent. SEO durchgezogen. Rechtstexte rechtskonform (Sessions 22-24). HTTPS gruen via Let's Encrypt (auto-renewed). www.iappear.at → 301 → iappear.at. GitHub Pages mit Custom Domain via `gh api repos/wuola/iappear-website/pages -X PUT` gesetzt — kein File-CNAME im Repo (GitHub legt es selbst auf source-branch an). Mail-MX bei `mx00.udag.de` / `mx01.udag.de` unveraendert geblieben. SEO-Sichtbarkeit > Perfektion.

**🚀 Blog LIVE seit 2026-05-11 ~08:50 (Session 39), 6 Hauptartikel seit Session 48.** 6 Hauptartikel + 1 Folge-Beitrag unter `/blog/` (Definition / Medien-und-Demokratie-Pflichtfach / i.grow-Workflow / Frauenspuren + Frauenspuren-Live-Launch-Folge / **AR-iOS-vs-Android-Technik-Artikel**, Kategorie "Technik", Session 48 — erster Video-Hero + erste echte Code-Bloecke, DE-only). Daten 15.3.–8.5.2026 (+ 3.6. fuer AR-Artikel) fuer "gewachsenen" Look. Eigener Blog-Index + Reaktivierung in `vitrine.html`. 4 interaktive Grafiken als iframes mit JS-Auto-Resize (Artikel 02 hat nur noch grafik_02b im Text, weil 02a als Hero-Screenshot rausgezogen wurde). Sitemap + llms.txt erweitert. Tag-System ueberarbeitet (keine Grossbuchstaben, Header-Tags klickbar, Tag-Wolken farbig + bis 22 Tags). Hero-Bild-Workflow per PIL etabliert. Folge-Beitrag-System mit eigenstaendigen URLs, hardcoded Pflege in 3 Stellen (Hauptartikel + Folge-Artikel + Uebersichts-Disclosures), CSS-Klassen `.article__series` / `.article__parent-link` / `.blog-card-series`. Hero-Bilder pro Artikel: 01 PIL-Phone-Mockup (2 Phones), 02 Screenshot der ICILS-Grafik, 03 Foto i.grow Feldkirch, 04 PIL-Phone-Mockup v4 (Aspect-Bug-Fix), Folge-Beitrag Eroeffnungsfoto. Status + Lehren in Sessions 37, 38, 39 (`_doku/sessions/`).

**Google Search Console (Session 26, 2026-05-04 ~17:00):** Property `iappear.at` eingerichtet, `sitemap.xml` eingereicht (41 Seiten verarbeitet, ohne Fehler), 7 Top-URLs manuell zur Indexierung beantragt (Startseite + Stadtrundgaenge + 3 Kategorien + Features + Vitrine-Hub + Klassenraeumen-Artikel) — alle grün. Davor: Pretty-URL-Bug gefixt (Commit `5ebc850`, alle canonical/og:url/sitemap/llms.txt/build.py URLs auf `.html`). **Stand 2026-05-08 (Session 36.5):** 8 indexiert / 43 nicht — davon 39 sind Pretty-URL-Geister aus Google-Discovery-Queue VOR dem Session-26-Fix (`/agb/`, `/datenschutz/`, `/features/`, `/kontakt/`, `/stadtrundgaenge/`, `/stadtrundgang-au/` etc.). Code-Audit verifiziert: 0 Pretty-URL-Quellen mehr im Live-Code (Sitemap, llms.txt, canonical, og:url, internal links, build.py alle sauber). **Keine Aktion nötig** — schmilzt in 2-8 Wochen weg, parallel wachsen die `.html`-URLs in den Index. Bei künftigen "X nicht indexiert"-Schrecksekunden: erstmal Stichprobe der URLs anschauen, dann Code-Audit-Greppattern aus Session 36.5 wiederholen, statt zu raten.

**Bing Webmaster (Session 27, 2026-05-05):** Property `iappear.at` eingerichtet, Audit von `stadtrundgaenge.html` zeigte 2 Issues — Meta-Description zu lang (198 Zeichen) + 6 Bilder ohne alt (Leaflet-Marker). Beide Probleme behoben + präventiv 21 weitere zu lange Descriptions auf 70-160 gekürzt (Commit `35029cf`). Footer-Cleanup: redundanter "nach oben"-Inline-Link entfernt, schwebender Pfeil-Button reicht (`824c853`). iOS-Animations-Bugs (Mickey-Hand + Workflow-Icons) waren am Ende **Marilenas iOS-Setting "Bewegung reduzieren"**, nicht Code — Mickey bekam vorab noch iOS-Resilience-Hacks (`8883b8a`). Englisch-Version geplant in `_doku/englische-version.md`.

## Was noch offen ist

- **Englische Version** — **gut im Schwung (Sessions 28–36 + 44 + 45 + 46 + 47, 21 EN-Seiten live).** Komplett übersetzt: `en/index.html`, drei Kategorien (`i-history`, `i-dentity`, `i-grow`), `en/features.html` (+ `js/features-en.js`), `en/ueber-uns.html`, `en/faqs.html` (FAQPage Schema), `en/user-guide.html` (Wizards + Mickey-Hand), `en/stadtrundgaenge.html` Hub (Leaflet-Karte) + 4 EN-Stadtseiten (dornbirn, feldkirch, hard, au), `en/blog/` Index + 4 Hauptartikel + 1 Folge-Beitrag, `en/vitrine.html` Hub (Teil 1 — die 22 Artikel-Seiten folgen in Teil 2), **`en/404.html`**. British English (en_GB), Brand-Vokabular final, Sprachschalter + hreflang in DE-Schwester-Seiten, sitemap mit hreflang-Annotationen pro URL — `build.py update_sitemap` rendert ab Session 44 automatisch DE+EN-Stadt-URLs wenn `en/stadtrundgang-{slug}.html` existiert. **`llms.txt` ist bilingual** (eine Datei, DE-Sektion oben + EN-Spiegelsektion unten, ab Session 47). **Workflow seit Session 30**: Claude übersetzt direkt in derselben Session. **Branch-Strategie seit Session 31**: pro EN-Bereich ein frischer Branch von `origin/main`, Pattern `claude/en-<bereich>`. **Konvention Session 44**: EN-Stadtseiten werden manuell gepflegt — `rundgaenge.js` bleibt einsprachig. **Konvention Session 45**: EN-Blog-Artikel behalten die deutschen Slugs; iframe-Grafiken in `blog/figures/` bleiben DE; Hero-Bilder mit App-UI im Phone-Mockup bleiben unverändert. **Konvention Session 46**: `vitrine.js` ist bilingual (nested `de: {titel, text}` + `en: {titel, text}` + gemeinsame `bild`/`link`); `build.py` rendert beide Grids — DE in `vitrine.html`, EN in `en/vitrine.html`. EN-Vitrine-Kacheln verlinken aktuell mit `hreflang="de"` + sichtbarem &bdquo;(in German)&ldquo; auf die DE-Artikel, bis Teil 2 die englischen Artikel-Seiten bringt. **Konvention Session 47**: GitHub Pages serviert immer Root-`404.html` bei Server-404 — der JS-Snippet im DE-404 checkt `window.location.pathname` auf `/en/` und leitet ggf. auf `en/404.html`. Noch offen: **22 Vitrine-Artikel-Seiten** (Teil 2) und **Tally-Form-Seiten** (workflow + kontakt — blockiert auf englische Tally-Form von Maggy). Status + Workflow + offene Items in `_doku/englische-version.md`.

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
- `@_doku/englische-version.md` — Plan + Workflow + Stand der englischen Site-Version (`/en/`-Verzeichnis-Modell, hreflang, Brand-Vokabular en_GB, Branch-Pattern `claude/en-<seite>`, Status-Tabelle aller EN-Seiten).
- `@_doku/_archiv/` — historische Dokus (alte CLAUDE.md, alte projektdoku.md), als Backup nicht aktiv.

**Außerhalb des Repos** (im Obsidian-Vault `C:\Users\maggy\OneDrive\Dokumente\OBSIDIAN\---i.appear---\`):

- `Stylesheet für Claude.md` — Marilenas Stylesheet-Referenz (in Arbeit, wird laufend ergänzt). **Aktiv.**
- `Koordinaten_alle_Stationen.md` — Master-Quelle für Stations-Koordinaten (105 Stationen über 11 Rundgänge), genutzt für Mini-Karten + Netzwerk-Visualisierung. **Aktiv.**
- `----WEBSITE NEU MIT HTML----/Masterplan.md` und eine ältere `CLAUDE.md` im Vault — **veraltet** (Stand bis ~Mai 2026), bleiben als Sicherheits-Backup liegen aber werden NICHT mehr gepflegt. Bei Widerspruch zu *dieser* Datei gilt *diese*. Wenn eine Claude-Code-Session direkt im Vault gestartet wird, am Anfang darauf hinweisen, dass die aktive Doku im Repo liegt.
