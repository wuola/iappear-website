# Session 53 — Blog: Technik-Artikel „Von der Urmappe zur 3D-Datenvisualisierung"

**Datum:** 2026-06-23
**Commit (Artikel):** `c130509`
**Kategorie:** Technik + i.history · DE-only

Der im 125-Jahre-Artikel (Session 52) versprochene Making-of-Folgeartikel zur Siedlungswachstums-Animation. Komplett gebaut + live gestellt.

## Was gemacht

- Neuer Artikel `blog/dornbirn-stadtwachstum-3d-geodaten.html` — Making-of der Siedlungs-Animation aus oeffentlichen Geodaten.
- Inhalt aus Maggys PPTX `125 Jahre Stadtwachstum Karto.pptx` (Pfad: `OneDrive/ASSETS/Praesentationen/`) gezogen — via `pptx`-Skill `unpack.py`, Medien aus `ppt/media/`.
- Story-Bogen: Was sind Geodaten (GeoDIG/VOGIS) → 16 Zeitschnitte aus 16 Quellen → Bilderkennung (NDVI + Random Forest) → Laserscan-Hoehen (DOM−DGM) → QGIS+Blender → Live-Embed.
- Maggy als Geoinformatikerin im Body genannt (konsistent mit 125-Jahre-Artikel), kein Autor-Byline, JSON-LD author = Organization.

## Assets / Pipeline

- **Video-Hero** `08-stadtwachstum-hero.mp4`: aus 4K-Render `Siedlungsentwicklung_SLOMO_V5.mp4` (3840×2160, 12,5s, 96 MB) → ffmpeg `scale=1280` `libx264 -crf 22 -preset slow -an +faststart` → 6,1 MB. CRF gewaehlt nach 3×-Zoom-Vergleich an den duennen cyan Gebaeudekanten: CRF20=8,1 MB (quasi Quelle), CRF25=4,0 MB (sichtbar weicher), **CRF22=6,1 MB** als Balance. Poster + og-image aus dem „2009"-Frame (t=9).
- **6 Grafiken** aus PPTX → `blog/images/08-*.jpg` (JPG progressive): Negrelli-Plan 1826, Franziszeischer Kataster 1857, S/W-Luftbild, Infrarot-CIR, Blender-Wireframe-Terrain.
- **Klassifizierte Gebaeude** (`08-gebaeude-klassifiziert.jpg`): weisser Slide-BG per Whiteness-Knockout auf Dunkel freigestellt (lum>205 & niedrige Sat → dark-BG), NICHT invertiert — Footprints gluehen jetzt nach Baujahr auf Schwarz.
- **16-Zeitschnitte-Tabelle** + **Farb-Legende** als echtes HTML `<table>` mit farbigen `<i>`-Swatches (Magma-Colormap per Pixel-Sample aus der QGIS-Legende `image7`). **NDVI-Formel** als zentrierter Mono-Block. Alles in seiten-eigenem `<style>` (kein Cache-Bust ueber alle HTMLs).
- Live-Animation als `<iframe>` aus `iappear-embeds`-Repo eingebettet (gleiches Embed wie 125-Jahre-Artikel).

## Volle Verdrahtung (live, Commit `c130509`)

- `blog/index.html`: neue Card (pin „Neu") oben, 125-Jahre entpinnt + an chronologische Stelle verschoben, JSON-LD `blogPost`-Eintrag.
- `vitrine.html`: Blog-Teaser (max 4) — neue Card oben, AR-Card rausgefallen.
- `sitemap.xml`: neue URL (prio 0.7, hreflang de + x-default).
- `llms.txt`: Sub-Bullet unter dem 125-Jahre-Eintrag.
- `blog/125-jahre-dornbirn.html`: die „erzaehlen wir demnaechst in einem eigenen Beitrag"-Stelle ist jetzt der echte Forward-Link.

## Entscheidungen

- **Eigene Card statt blog-card-series-Disclosure**: Maggy wollte den Artikel fuer „Datenvisualisierung"-SEO sichtbar → eigenstaendige prominente Card; Folge-Relation nur ueber Forward-Link im Eltern-Artikel + `mentions`-Schema + `article__parent-link` + 4-stufiger Breadcrumb.
- **H1-Tausch auf Maggy-Wunsch**: „3D-Modell" → „3D-Datenvisualisierung" (SEO), inkl. Genus-Korrektur „zum"→„zur", in H1 UND JSON-LD-headline. H2 „Vom flachen Grundriss zum 3D-Modell" blieb (dort technisch korrekt).
- **Video statt Bild als Hero**: Maggy hatte 4K-Render lokal; selbst gehostet statt YouTube (sauberer Autoplay-Loop, kein Tracking, volle Design-Kontrolle).

## Lehren (als Konvention in CLAUDE.md uebernommen)

- Daten-Viz-Making-of-Blogposts: Tabellen/Legenden/Formeln als echtes HTML, Slide-Grafiken per Whiteness-Knockout auf Dunkel, Video-Hero 4K→1280 CRF22.
- Preview-Screenshot haengt an Cross-Origin-iframes (Live-Embeds erreichen nie „network idle") → Chrome-`--headless=old`-Render einer iframe-Platzhalter-Kopie ODER `preview_eval`-DOM-Checks. `fetch` im Dev-Server cached → Cache-Bust-Query + `cache:'no-store'`.

## Live-Verifikation

`curl` iappear.at: Artikel 200 (~36s nach Push), mp4 200, og 200. gh-Account = wuola bestaetigt vor Push.
