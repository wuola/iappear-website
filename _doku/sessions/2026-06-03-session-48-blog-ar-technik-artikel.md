# Session 48 - Blog: Technik-Artikel "Augmented Reality ohne App" (Video-Hero + echte Code-Bloecke)

**Datum:** 2026-06-03
**Account:** wuola (verifiziert)
**Branch:** main

## Was gemacht wurde

Neuer Blog-Artikel **`blog/augmented-reality-ios-android.html`** angelegt - ein technischer
Hinter-den-Kulissen-Beitrag darueber, wie i.appear ein 3D-Modell (der sprechende Baum) mit Audio
und Animation als Web-AR auf **iOS (Quick Look / USDZ)** und **Android (WebXR / Needle Engine)** aus
einer einzigen GLB-Datei ausspielt. Quelltext kam von Maggy als Obsidian-Markdown
(`---i.appear---/Blogbeitraege fuer Vitrine auf Website/TECHNIK/AugmentedReality Android vs. iOS.md`).

Der Artikel ist der **6. Blog-Hauptartikel** und der erste mit Kategorie **"Technik"**
(Tag-Stil `cat-tag--allgemein`, neutrales Grau). Datum 3. Juni 2026 = neuester Artikel.

### Zwei Premieren auf der Seite

1. **Video-Hero statt Hero-Bild** (erster Blog-Artikel mit Video-Hero).
   - Quelle `VIDEO FERTIG.mp4` (1920x1080, 12,2s, **kein Audio**, 24 MB) aus
     `i.appear PROMO/Videos fuer TechnikArtikel auf Blog/`.
   - ffmpeg-Komprimierung auf **1280 breit, CRF 27, faststart, kein Audio** -> **0,81 MB**
     (`blog/images/05-ar-hero.mp4`).
   - Poster + og:image: sauberer Baum-Frame (ohne Text-Overlay) bei 7,0s extrahiert ->
     `blog/images/05-ar-hero-poster.jpg` (1280x720). Video kann nicht als og:image dienen,
     darum Poster-Frame als og:image (mit echten Dimensions).
   - Markup: `<video poster autoplay muted loop playsinline preload="metadata">` mit `<source mp4>`,
     `aria-label` + `<figcaption>`. CSS-Klasse `.article__hero-video` (max-width 760, 16:9, schwarzer BG).

2. **Code als echte HTML-`<pre>`-Bloecke** (erstes Code-Block-Styling der Seite ueberhaupt).
   - Maggy lieferte 3 Code-Screenshots (`everywhere1/2/3.png`). Entscheidung im Dialog:
     **als echten HTML-Text abtippen** statt als Bilder (gestochen scharf, kopierbar, SEO-lesbar,
     loest das "nebeneinander vs. lesbar"-Problem unterschiedlicher Bild-Aspekte).
   - 3 Code-Figuren, 5 `<pre>`-Bloecke: (1) Everywhere-Action JSON, (2) zwei Python-Patch-Snippets,
     (3) zwei JS/TSX-Frontend-Snippets.
   - Dezente Syntax-Toene per Span-Klassen: `.c` Kommentar (grau-kursiv), `.s` String (gruen),
     `.k` Keyword/Bool (amber), `.fn` Property/Funktion (blau).
   - **CSS bewusst als seiten-eigener `<style>`-Block im `<head>`**, NICHT in `components.css` -
     damit kein Cache-Bust ueber ~50 Dateien noetig ist (die Klassen nutzt nur dieser Artikel).
   - Monospace ueber System-Stack (`ui-monospace, ...`), da TheSans Mono nicht als @font-face geladen.

### Infra-Details verallgemeinert (wichtige Lehre)

Maggys Rohtext nannte unbeabsichtigt internes Setup. Auf ihren Wunsch alles generalisiert
(oeffentliche Tool-Namen wie Blender/Needle Engine/WebXR/Quick Look/USDZ/MCP blieben):

| vorher (setup-spezifisch) | jetzt (allgemein) |
|---|---|
| Dateipfad `components/storyblok/NeedleAR_NoProgUsdz.tsx` | "Im Frontend ..." |
| Vercel, `staging`-Branch, Git-Konto-Identitaetspruefung | "der Hosting-Dienst baut automatisch neu" |
| Storyblok, `needle-ar`-Block, Location-Story | "ein Content-Management-System ... als Asset" |
| Next.js 16, React 19, npm-Bundle | "der Build der Web-Anwendung" |
| jsDelivr-CDN, Needle Engine 5.0.10 | "ein CDN", "dieselbe Needle-Engine-Version" |
| H2 "Verifizierter Workflow mit Claude Code" | "Der verifizierte Workflow: vom 3D-Modell zum AR-Erlebnis" |

Grep-Gegenpruefung am Ende: 0 setup-spezifische Begriffe uebrig.

### Registrierung (4 Stellen, alles manuell - kein Build-Tool automatisiert Blog)

- `blog/index.html`: neue Card oben mit Pin `data-pin-label="Neu"` + JSON-LD `blogPost`-Eintrag.
- `vitrine.html` Blog-Teaser: neue Card oben rein, **aeltester** Artikel
  (`was-ist-ein-digitaler-stadtrundgang`) raus -> bleibt bei 4 Cards (Teaser-Regel).
- `sitemap.xml`: Eintrag mit priority 0.7. **Nur `de` + `x-default` (self), KEIN `en`-Alternate**
  (EN-Version existiert noch nicht -> sonst broken hreflang).
- `llms.txt`: Eintrag in DE-Blog-Sektion (ASCII-Transliteration). EN-Sektion bewusst nicht.

### Sonstiges

- **DE-only, keine EN-Version.** Sprachschalter EN -> `../en/blog/` (Hub, kein 404), kein `hreflang=en`
  im Head. Wird nachgezogen, wenn EN-Uebersetzung kommt.
- Einleitung leicht lektoriert (Grammatik/Fluss, abgebrochener Satz), Technik-Teil weitgehend
  wortgleich uebernommen.
- Video-Unterschrift auf Wunsch linksbuendig + `line-height:1.3` (statt zentriert).
- `build.py` NICHT noetig/gelaufen: keine Datendatei (`vitrine.js`/`rundgaenge.js`) geaendert,
  und build.py fasst nur Inhalte zwischen Markern an (Blog-Teaser + meine sitemap/llms-Eintraege
  liegen ausserhalb -> waeren sicher gewesen, aber kein Lauf erforderlich).

## Lehren (-> ggf. als Konvention in CLAUDE.md)

- **Video-Hero fuer Blog-Artikel:** mp4 (1280 breit, CRF 27, faststart, ggf. ohne Audio) + jpg-Poster,
  `autoplay muted loop playsinline`, Poster-Frame dient als og:image. ~0,8 MB fuer 12s-Loop ist ok.
- **Code-Bloecke per seiten-eigenem `<style>`** statt components.css, solange nur ein Artikel sie nutzt
  -> vermeidet die Cache-Bust-Kaskade ueber alle HTMLs.
- **Keine internen Setup-Details in oeffentlichen Blog-Texten.** Bei Roh-Texten von Maggy auf
  Host/CMS/Branch/Framework/Dateipfade pruefen und generalisieren; oeffentliche Tool-Namen ok.

## Status danach

Blog hat jetzt **6 Hauptartikel** + 1 Folge-Beitrag. Preview verifiziert (Video laeuft, Code-Bloecke
rendern mit Syntax-Toenen, Konsole sauber). Committet + gepusht auf main. Video-Qualitaet auf Live
checkt Maggy im privaten Tab (Preview != Live).
