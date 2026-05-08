# Session 37 — Blog-Reaktivierung mit 4 neuen Artikeln + Tag-System + Hero-Mockup-Render

**Datum**: 2026-05-08 (Freitag)
**Branch**: `claude/bold-mclaren-af85be` (Worktree)
**Cache-Bust components.css**: `?v=20260506a` → `?v=20260508a`
**Status**: Lokal fertig, **noch nicht gepusht** — wartet auf Hero-Bilder fuer Artikel 02-04 + Maggy-OK.

---

Maggy hatte den Wunsch, den Blog heute zu starten — die zwei Bestandsartikel unter `/blog/` (ClaudeCowork-Drafts mit Halbwahrheiten, in Session 21 mit `noindex` versteckt) gegen 4 neue Artikel auszutauschen. Quelle: `OBSIDIAN/---i.appear---/Blogbeitraege fuer Vitrine auf Website/Neu/`. Pro Artikel ein eigener Unterordner mit `RECHERCHE.md`, `<Nr>_<Slug>_NEU.md` und teils `FINAL/<Nr>_<Slug>_FINAL.md`.

## 1. Konzept-Entscheidungen vorab

- **4 Artikel heute** (01–04 aus der Plan-Liste, andere folgen spaeter):
  - 01 "Was ist ein digitaler Stadtrundgang?" — FINAL-Version
  - 02 "Pflichtfach Medien und Demokratie ab 2027/28" — FINAL-Version
  - 03 "Wie ein i.grow-Projekt funktioniert" — NEU-Version (kein FINAL)
  - 04 "Frauenspuren Dornbirn" — final-Version
- **Datums-Faken** damit der Blog nicht aussieht als waere er heute angelegt: 15. Maerz 2026 / 8. April / 22. April / 3. Mai. Plausible Cornerstone→i.grow→i.history-Reihenfolge.
- **Quellen-Bloecke weglassen** — "Blog, kein wissenschaftlicher Artikel" (Maggy). Bleiben nur als Inline-Links, kein eigener Quellen-h2.
- **Keine Autoren-Anzeige** — "wir brauchen keine autoren". Kein "von Marilena Tumler" sichtbar, kein `<meta name="author">`, kein `article:author`. Im JSON-LD `BlogPosting.author` referenziert auf `https://iappear.at/#organization` statt Person.
- **Tag-Wolken (Variante b)** — die alten Bestandsartikel hatten kleine Tag-Wolken am Ende, die Maggy behalten will. Bei Artikel 04 (Frauenspuren) hatte der Quelltext eine 37-Hashtag-Liste — daraus 22 kuratiert.
- **`build.py` bleibt unangefasst** — Blog-Pflege noch manuell, kein Auto-Generation-Block fuer Cards.

## 2. Was alles neu/geaendert ist

### 4 neue Artikel-HTMLs

Alle `blog/<slug>.html`. Pattern wie alle Site-Seiten: Nav + Burger + Breadcrumb + Article + Footer. Plus pro Artikel:

- **JSON-LD `@graph`** mit `BreadcrumbList` + `BlogPosting`. Bei 01 + 02 zusaetzlich `FAQPage` mit den Q&A-Bloecken (Google Rich Snippets fuer "Wann tritt Medien und Demokratie in Kraft?" etc.).
- **iframe-Grafiken** bei Artikel 01 (2 Stueck) + 02 (2 Stueck). Inline-Script vor `</body>` setzt iframe-Hoehe per `ResizeObserver` auf `body.scrollHeight` — `aspect-ratio` als Initial-Fallback gegen FOUC. **Zwingend nötig**, weil iframe-Inhalte nicht linear mit der Width skalieren (Mobile-Test: 197px Vertikal-Overflow ohne JS).
- **Hero-Bild-Slot** im Article-Body als `<figure class="article__hero">`. Bei 01 mit echtem Bild, bei 02–04 vorerst `<!-- TODO -->`-Comment.
- **Tag-System siehe weiter unten.**

Slugs bewusst gewaehlt:
- `was-ist-ein-digitaler-stadtrundgang.html` (= alter Slug, perfekter Inhalts-Match → ueberschrieben statt neu)
- `medien-und-demokratie-pflichtfach.html`
- `wie-entsteht-ein-igrow-projekt.html`
- `frauenspuren-dornbirn.html`

### 4 Grafiken in `blog/figures/`

Standalone-HTML-Files mit eigenem CSS (Roboto-Webfont, Site-Farbvariablen). Kopiert 1:1 aus dem Obsidian-Ordner:
- `grafik_01a_zahlen.html` — 10/80/4/0/0 Zahlen-Grid mit Sub-Marken-Akzenten
- `grafik_01c_timeline.html` — Vom Papierflyer zur WebApp (4 Zeit-Stationen)
- `grafik_02a_medienkompetenz.html` — ICILS 2023, 39% vs 15% EU-Ziel
- `grafik_02b_drei-stufen.html` — Schnupper / Projektpaket / Jahresprogramm

Die `GRAFIK-STYLEGUIDE.md` im Obsidian-Ordner ist die Master-Vorlage fuer weitere Grafiken (max-width 720, Roboto Light 300, Akzentfarbe der Saeule, keine Emojis/Stock-Icons).

### `blog/index.html` von Redirect → echte Uebersicht

War seit Session 21 nur ein `<meta http-equiv="refresh">` auf vitrine.html. Jetzt richtige Uebersichts-Seite mit Header, page-header, blog-grid (4 Cards, neueste oben), Footer. Plus `Blog`-Schema-LD mit `blogPost`-Liste der 4 Artikel. URL: `https://iappear.at/blog/`.

### `vitrine.html` Blog-Sektion + Sprung-Chip wieder aktiv

Beide HTML-Comment-Bloecke aus Session 21 entfernt. Neue Cards mit den 4 Artikeln (neueste oben), in den entsprechenden Sub-Marken-Tag-Farben. Card-Tags bleiben Spans (HTML-Spec verbietet `<a>` im `<a>`-Card-Container).

### Tag-System ueberarbeitet (Maggy-Wunsch)

In `css/components.css`:
- `.cat-tag` — `text-transform: uppercase` raus, `font-size` von 0.72rem → 0.8rem, `letter-spacing` runter. Plus `a.cat-tag:hover` mit `translateY(-1px)`. Pro Sub-Marke `a.cat-tag--history:hover` etc. mit kraeftigerer Background-Farbe.
- `.article__tag` — neue Sub-Marken-Modifier `--history` / `--dentity` / `--grow` mit den jeweiligen Farben (gold/blau/gruen). `a.article__tag` mit Hover-State (Background heller + Border-Farbe).
- Neuer Helper `.cat-tag-row { display: flex; gap: 6px; flex-wrap: wrap; }` fuer Multi-Tag-Container (Artikel 01 hat 3 Sub-Marken-Tags nebeneinander statt einem "Grundlagen"-Tag).

In den HTMLs:
- Header-Tags von `<span>` zu `<a>` umgeschrieben, mit `href` auf die jeweilige Sub-Marken-Seite (`../i-history.html` etc.).
- Bei Artikel 01: 3 Sub-Marken-Tags statt einem "Grundlagen"-Tag (alle 3 Saeulen sind in dem Cornerstone-Artikel relevant).
- In den Tag-Wolken: Sub-Marken-Tags klickbar + farbig vorne, restliche Themen-Tags bleiben Spans dezent.
- Tag-Wolken erweitert: 12–14 Tags pro Artikel, **Artikel 04 mit 22 Tags** (kuratierte Auswahl aus Maggys 37-Hashtag-Liste am Ende der `04_frauenspuren_final.md`).

**Card-Tags in Vitrine + Blog-Index** bleiben absichtlich `<span>` (kein nested `<a>`). Die ganze Card ist schon `<a>` zum Artikel.

### Cache-Bust components.css

`?v=20260506a` → `?v=20260508a` in **56 Files** per Python-Skript (`for f in glob('**/*.html'): replace`).

### sitemap.xml + llms.txt

- `sitemap.xml`: Die 2 alten auskommentierten Blog-URLs durch 5 neue ersetzt (Blog-Index + 4 Artikel). Keine `xhtml:link hreflang` — Blog-Artikel haben (noch) keine englischen Versionen.
- `llms.txt`: Neue Sektion `## Blog (Hintergrund & Geschichten)` mit 5 Eintraegen.

## 3. Hero-Bild Artikel 01 — der "Phone-Mockup-Render"-Ansatz

Maggy hat 2 Test-Bilder mitgegeben (Screenshots aus Browser), beide visuell unbefriedigend (zu klein, zu unscharf, kein Phone-Mockup). Die Site hat aber CSS-Phone-Mockups mit den Posters `assets/videos/hero/{navigation,histappear}.jpg` (466×948 / 468×950 px). Loesung: Bild mit **Pillow** komponieren — 2 Phone-Frames in der Site-Optik nebeneinander, mit den hires Site-Posters als Screen-Inhalt.

### Site-Phone-CSS-Werte (`css/components.css` Zeile ~474)
```
.phone {
  width: clamp(110px, 16vw, 140px);
  aspect-ratio: 9/19;
  border-radius: 36px; padding: 5px;
  background: linear-gradient(145deg, #1a1a1a 0%, #050505 50%, #1a1a1a 100%);
  box-shadow: 0 0 0 1px rgba(255,255,255,.08), inset 0 0 0 1px rgba(255,255,255,.12), ...;
}
.phone__screen { border-radius: 30px; }
```

Ratios bei 110px Phone-Width: Frame 5px = **4.5%**, Phone-Corner 36 = **30%**, Screen-Corner 30 = **27%**.

### Lehre 1: Frame proportional, NICHT 1:1

Erster Versuch mit `FRAME_T=5` bei 466er Screen-Breite — Frame visuell unsichtbar. Maggy: "ich seh garkein mockup sondern nur die poster selbst". **Fix**: alle Werte proportional auf den groesseren Render skalieren.
- `FRAME_T = 21` (466 × 4.5%)
- `CORNER_PHONE = 152` (508 × 30%)
- `CORNER_SCREEN = 127` (466 × 27%)

### Lehre 2: Render in voller Aufloesung, dann downscale

PIL-Composition auf 1400×1100 Canvas (Native-Poster-Aufloesung), dann finaler Resize auf 700×550 mit `LANCZOS`. Ergibt scharfe Edges + Antialiasing der Frame-Linien.

### Lehre 3: img-Style `max-width` statt Bild kleiner rendern

Maggy wollte das Hero "um ein Drittel kleiner". Loesung war NICHT, das JPG noch kleiner zu rendern (haette Schaerfe gekostet) — sondern im inline `style="max-width:480px"` zu setzen. Bei 700px nativ und 480px gerendert wird das Bild leicht runterskaliert = max-scharf.

### Render-Vorlage

`blog/_hero-render-01.html` ist die erste Version (CSS-only, ohne PIL — wurde durch das PIL-Skript ersetzt). Bleibt als Vorlage liegen, falls man fuer 02-04 andere Phone-Kompositionen braucht. Die produktive Render-Funktion ist im Python-Inline-Skript der Bash-Aufrufe (siehe Commit-Historie).

### Cache-Falle bei JPG-Updates

`?v=...` im img-Src-Query-Parameter half nicht — Maggys Claude-Desktop-Preview-Tool hat das alte Bild trotzdem angezeigt. Loesung: **Filename komplett aendern** (`hero.jpg` → `hero-v2.jpg` → `hero-v3.jpg`). Alte Versionen bleiben untracked im `blog/images/`-Ordner (Maggy soll spaeter haendisch loeschen, `Remove-Item` ist auf der Deny-Liste).

## 4. Was offen ist

- **Hero-Bilder fuer Artikel 02, 03, 04** — Maggy waehlt Quell-Material aus, dann ca. 5 Min Aufwand pro Artikel mit dem PIL-Skript-Pattern.
- **Alter Slug `blog/medienbildung-vorarlberg-schueler-gestalten-stadtrundgaenge.html`** — verwaist im Repo (nicht verlinkt, `noindex`, aus sitemap+llms raus). Wartet auf Maggy-Entscheidung: haendisch loeschen oder mit neuem Artikel ueberschreiben.
- **Alte Hero-Versuche** — `blog/images/01-stadtrundgang-hero.jpg` (1056×685, Test-Bild) und `01-stadtrundgang-hero-v2.jpg` (700×540, ohne Frames). Untracked, Maggy loescht haendisch.
- **Push** — alles lokal. Erst nach Hero-Bild-Komplettierung pushen (Maggy: "erst pushen wenn alles sitzt").

## 5. Erweiterungen nach erstem Commit (a335762 + ea158b7)

Nach dem ersten "Blog reaktiviert"-Commit hat Maggy zwei zusaetzliche Anliegen gehabt:

### "Alle Artikel"-Link auch oben

Die Article-Header in allen 4 Artikeln haben jetzt einen kleinen `&larr; Alle Artikel`-Link ueber dem Cat-Tag, dezent mit `font-size: .9rem` und `class="muted"`. Identisch zum bestehenden Link unten im Artikel.

### Folge-Beitrag-System (kein JS, hardcoded)

Maggy zeigte Screenshots von einem anderen Blog mit `<details>`-basierten Folge-Beitrags-Listen unter Hauptbeitraegen. Pattern uebernommen, hardcoded gepflegt (kein zentrales Datenfile).

**Datenmodell:** Folge-Beitrage haben **eigene Slugs** (SEO-flexibel, NICHT `<haupt-slug>-update-N.html`). Im JSON-LD des Folge-Artikels: `"mentions": { "@id": "<haupt-url>" }`. Im Hauptartikel-Schema bleibt der Folge-Beitrag erstmal aussen vor (kein `hasPart`); das kann spaeter ergaenzt werden, wenn mehr Folgen kommen.

**3 Stellen pro Folge-Beitrag pflegen** (manuell):
1. **Hauptartikel-HTML** — `<section class="article__series">` mit `<ol>` der Folgen, vor der Tag-Wolke
2. **Folge-Artikel-HTML** — eigenstaendige Seite mit `<p class="article__parent-link">&#x21A9; Folge-Beitrag zu: <a>...</a></p>` direkt im Body-Top, plus 4-stufige Breadcrumb (`Startseite / Vitrine / Hauptartikel / Folge-Titel`)
3. **Uebersichten** — `<details class="blog-card-series">` mit `<summary>` und `<ol>` direkt nach der Hauptartikel-Card in `blog/index.html` UND `vitrine.html` (Spiegel-Pflege, weil zwei Uebersichten existieren)

Plus: `sitemap.xml`-Eintrag (eigene URL, `priority: 0.6` einen Schritt unter dem Hauptartikel) und `llms.txt`-Eintrag (eingerueckt unter dem Hauptartikel).

**CSS-Klassen** (in `components.css` ergaenzt):
- `.article__series` — Block am Ende des Hauptartikels mit `<h3>` + `<ol>` + `<time>` + `<a>`. Border-Top, `<time>` als 110px breite Spalte links.
- `.article__parent-link` — Hinweis-Block oben im Folge-Artikel. Linke Akzent-Border in muted, gelblicher Hintergrund (4% white).
- `.blog-card-series` — `<details>` mit benutzerdefiniertem Marker (`::before` mit `\25B6`, rotiert beim Open-State). Eingerueckt mit `padding: 0 var(--sp-3)`. Negativer top-margin um naeher unter die Card zu rutschen.

**Demo-Folge-Beitrag**: `blog/frauenspuren-launch-mai-2026.html` mit echtem Maggy-Text aus Eroeffnung am 5.5.2026 (Stadtarchiv Dornbirn), Hero-Foto vom Eroeffnungsabend (1400&times;949 JPG, optimiert mit Pillow von 5419&times;3673 PNG). 12 Tags, 4 H2-Sektionen, Datum 8.5.2026.

**Cache-Bust components.css**: `?v=20260508a` → `?v=20260508b` in 55 Files (selber Pattern wie das erste Cache-Bust-Skript).

### Frauenspuren-Hauptartikel-Hero v2 + figcaption-Pattern (nach Commit 910f342)

**figcaption** im Folge-Artikel: Foto der Eroeffnung hat jetzt Bildunterschrift `Marilena Tumler, Roswitha Fessler, Lisa Althaus` als `<figcaption>` mit inline-Style (`text-align:center;color:var(--c-text-muted);font-size:.85rem;margin-top:var(--sp-2);font-style:italic`). Kein eigenes CSS noetig — inline reicht fuer einzelne Captions. Plus alt-Text auf die echten Namen aktualisiert.

**Frauenspuren-Hauptartikel-Hero v2** (Iteration nach Maggy-Feedback): Erste Version war 1 Phone Hochformat-zentriert (550&times;700, Canvas 1100&times;1400) — Maggy fand das Bild "schaut komisch aus", weil deutlich anderes Bild-Format als Artikel 01. **Lehre**: Hero-Bilder im Blog brauchen **gleiches Output-Format** (700&times;550 JPG → 480&times;377 angezeigt) auch wenn Inhalt nur 1 Phone ist. Format-Konsistenz schlaegt Whitespace-Optimierung. Konsequenz: 1 Phone zentriert auf gleichem Canvas wie Artikel 01 (1400&times;1100), Phone-Maesse identisch zu Artikel 01 (Screen 466&times;783, Frame 21, Phone outer 508&times;825). Schwarzraum links/rechts vom einzelnen Phone ist OK. `04-frauenspuren-hero-v2.jpg` (700&times;550, 36 KB), `max-width:480` im img-Style. **Alte v1 (`04-frauenspuren-hero.jpg`) ist untracked**, Maggy loescht haendisch in naechster Session.

## 6. Quick-Stats Session 37

- 4 neue Artikel-HTMLs + 1 Folge-Beitrag = **5 neue Blog-Posts**
- 4 Grafiken in `blog/figures/` kopiert
- 2 Hero-Bilder (Artikel 01 PIL-komponiert 700&times;550 mit Site-Phone-Look, Folge-Beitrag 1400&times;949 Eroeffnungsfoto)
- 1 Render-Vorlage `blog/_hero-render-01.html`
- 1 grosser CSS-Refactor (cat-tag + article-tag-System)
- 1 neues Folge-Beitrag-System (3 CSS-Klassen, hardcoded gepflegt)
- 2 Cache-Busts hintereinander (56 Files je Lauf)
- 5 HTMLs Autoren-Cleanup
- vitrine.html Blog-Sektion reaktiviert + Folge-Beitrag-Disclosure
- blog/index.html neu (war Redirect) + Folge-Beitrag-Disclosure
- sitemap.xml + llms.txt zwei Mal erweitert (Hauptartikel + Folge)
- "Alle Artikel"-Link oben in allen Artikeln + Folge-Beitrag
- Verifikation Mobile + Desktop fuer alle Artikel via DOM-Eval
- Cleanup-Commit fuer alten Blog-Slug + 2 Hero-Versuche (per Maggy via PowerShell ausgefuehrt)
- 3 Commits insgesamt: a335762 (Reaktivierung) + ea158b7 (Cleanup) + N+1 (Folge-Beitrag-System)
