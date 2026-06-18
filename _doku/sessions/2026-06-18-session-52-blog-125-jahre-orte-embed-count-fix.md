# Session 52 - Blog "125 Jahre, 125 Orte" + Siedlungs-Embed + Frauenspuren-Count-Fix

**Datum**: 2026-06-18
**Ausloeser**: Maggy wollte einen neuen Blogartikel zum Release des sechsten Dornbirner Rundgangs (Event Di 16.6.2026 im Kulturhaus Dornbirn). Kein fertiger Text vorhanden -> Claude recherchiert + schreibt zusammen, dann Fotos, dann Seite bauen, verdrahten, pushen.

---

## Schritt 1: Recherche + Text

- **Quellen**: Obsidian `RUNDGAENGE/125 Jahre - 125 Bilder/` (CMS-Umsetzungs-Doku: 131 Stationen = 125 Bildpunkte `light` + 6 Bezirke `full` Markt/Hatlerdorf/Oberdorf/Haselstauden/Rohrbach/Schoren), Praesi-PDFs in `OneDrive/ASSETS/Praesentationen/` (die grosse `125 Jahre Praesi Marilena.pdf` war OneDrive-online-only = nicht lesbar; die kleinen gingen), die Einladung.
- **Web-Faktencheck** (Sub-Agent), wichtige Korrekturen: Stadterhebung Dornbirn **1901** (-> 2026 = 125 J.). Buergermeister **Markus Faessler mit ss** ist falsch -> offiziell **Faeßler mit ß** (SPOe, seit 4/2025); NICHT mit Julian Faessler (OeVP, ss) verwechseln. Stadtarchiv-Team: Werner Matt (Stadtarchivar), Viktor Glatz, **Harald Rhomberg** (Maggy hatte "Ruemmele" geraten - falsch). Christian Tumler ergaenzt Maggy spaeter selbst.
- **Text**: Marilena-Wir-Stimme, Vorlage = `frauenspuren-launch-mai-2026.html`. Making-of der Siedlungsanimation (Geografie/Fernerkundung/50 GB/16 Zeitschnitte) bewusst RAUS -> wird eigener Folge-Beitrag. Quell-Markdown abgelegt unter Obsidian `----WEBSITE NEU MIT HTML----/blog-setup/_posts/`.
- **Naming-Entscheidung Maggy**: Titel **"125 Jahre, 125 Orte"** (Fotos + App-Header zeigen "125 ORTE"), der Rundgang-Name im Fliesstext bleibt **"125 Jahre - 125 Bilder"** (bewusst so gelassen). Titel zuerst mit "Bilder" gebaut, dann auf "Orte" getauscht (Komma-Form nur im Titel/Headline/Breadcrumb, replace_all).

## Schritt 2: Seite gebaut (`520b6af`)

- `blog/125-jahre-dornbirn.html` nach Frauenspuren-Launch-Muster: i.history, DE-only (hreflang de + x-default), JSON-LD BlogPosting + BreadcrumbList, Meta 153 Zeichen, App-CTA `https://iappear.app/de/routes/dornbirn/125-jahre-dornbirn?view=list` (curl-verifiziert 200).
- **3 Event-Fotos** (Maggy Haidacher), aus 6000x4000 PNG auf Web-JPG q85 progressive: Marilena am Pult (quer), Gruppe (hoch), Faeßler-Eroeffnungsrede (quer). Mehrfaches Umsortieren auf Maggy-Wunsch; **final**: Hero = Marilena (quer, damit og:image Querformat fuers Teilen), Gruppe unter "Sechs Bezirke", Faeßler unter "Eroeffnungsabend". Captions mit Namen (BM Faeßler, Marilena Tumler, Maggy Haidacher, Werner Matt).
- Embed-Bildunterschrift final: "Siedlungsdarstellung rekonstruiert anhand oeffentlicher Geodaten vom Land Vorarlberg."

## Schritt 3: Siedlungs-Embed (Lehre: separates Embeds-Repo!)

- Ich hatte zuerst eine **falsche** HTML eingebaut (Timeline `index_dark.html` aus dem Obsidian-Ordner), weil ich die richtige Siedlungsgrafik nicht fand und sie substituiert statt nachzufragen -> Maggy zurecht veraergert. **Lehre: bei "die HTML zu X" nach dem Pfad FRAGEN, nicht ersetzen.**
- Richtige Datei lag im **separaten Repo `iappear-embeds`** (`github.com/wuola/iappear-embeds`, GitHub Pages aktiv). `dornbirn-wachstum/` = MapLibre-WebGL-Animation "Dornbirn waechst 1826-2025" (~14.500 Gebaeude nach Baujahr, + 2 GeoJSON ~5 MB).
- **Eingebunden per iframe auf die Live-URL** `https://wuola.github.io/iappear-embeds/dornbirn-wachstum/` - kein 5-MB-GeoJSON ins Website-Repo, Widget bleibt zentral gepflegt. Cross-Origin = ResizeObserver-Autohoehe geht nicht, daher feste Hoehe.
- **Layout**: Embed schaltet bei <=760px iframe-Breite aufs gestapelte (mobile) Layout. In der schmalen Textspalte war das immer aktiv -> Legende/Play unter der Falte. Fix: figure **breakout auf `width:min(1120px,94vw)` + `left:50%;translateX(-50%)`** -> Desktop >760px = Overlay-Layout (Legende/Play sichtbar), Mobile bleibt gestapelt. Headless-Screenshot timeoutet an der WebGL-Karte (Tool-Limit), funktional via Breite/DOM verifiziert.

## Schritt 4: Verdrahtung "wie immer" (`76a5d6b`)

(Lehre Kommunikation: nach dem ersten Push hatte ich nur die Artikel-Datei hochgeladen und mit dem Wort **"verdrahten"** + Rueckfrage Verwirrung gestiftet. Maggy: einfach **komplett wie immer** auf die Seite stellen, ohne Dev-Jargon, ohne Rueckfrage.)

- `blog/index.html`: neue Card pinned **"Neu"**, vorher "Neu" (Aufwachsen) entpinnt + in die Liste geschoben, JSON-LD `blogPost` ergaenzt.
- `vitrine.html`: Blog-Teaser (max 4) - 125-Orte oben "Neu", aeltester (`wie-entsteht`) raus, Pin synchron zu /blog/.
- `sitemap.xml`: URL ergaenzt (prio 0.7, hreflang de/x-default), als valides XML geprueft.
- `llms.txt`: Eintrag in DE-Blog-Sektion. **Alle 4 Edits liegen ausserhalb der build.py-Marker** -> beim spaeteren build.py-Lauf nicht ueberschrieben.

## Schritt 5: Frauenspuren-Count-Fix (`b773cc0`)

- Maggy meldete (Screenshot): Dornbirn-Stadtseite zeigt **"i.history . 3"**, soll **4** sein.
- Ursache: in `rundgaenge.js` stand **Frauenspuren noch auf `status: "coming-soon"`** - obwohl live seit Mai 2026. `build.py` zaehlt `titel` minus `coming-soon` (Zeile ~332). 4 Titel - 1 soon = 3.
- Fix: Frauenspuren -> `status: "aktiv"` + veralteten "(Coming soon)"-Kurztext entstaubt. `build.py` neu -> Dornbirn **i.history 3->4**, gesamt **10->11**; regeneriert Counts/Chips in index.html, stadtrundgaenge.html (Hub + Karte), stadtrundgang-dornbirn.html + llms.txt-Stadt-Count.

## Commits

- `520b6af` Artikel + 3 Fotos
- `76a5d6b` Verdrahtung (Index-Card, Vitrine-Teaser, Sitemap, llms)
- `b773cc0` Frauenspuren aktiv -> i.history 3->4
- (+ dieser Doku-Commit)

## Offen / Notizen

- **Folge-Beitrag "Making-of Siedlungsanimation"** (Geodaten -> 3D) noch offen - im Artikel als Cliffhanger angekuendigt, spaeter via `mentions` verlinken.
- **EN-Version** des Artikels nicht gemacht (DE-only, wie aufwachsen-mit-ki / AR-Artikel).
- **2 verwaiste lokale Dateien** untracked, NICHT im Repo, nicht verlinkt: `blog/figures/grafik_07a_timeline.html` (falsches erstes Embed) + `blog/images/07-125-jahre-hero.jpg` (alter Weitwinkel-Hero). Loeschen per `rm`/`del` vom Deny-Guard blockiert -> liegen rum, Maggy kann sie im Explorer entfernen.
- **Lehre Embeds**: interaktive Daten-Viz-Widgets liegen im Repo `iappear-embeds` (GitHub Pages) und werden per iframe auf die Live-URL eingebunden, nicht ins Website-Repo kopiert.
