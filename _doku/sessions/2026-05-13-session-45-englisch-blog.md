# Session 45 — Englisch: Blog-Bereich komplett

**Datum:** 2026-05-13
**Branch:** `claude/en-blog`
**Ziel:** Blog-Index + 4 Hauptartikel + 1 Folge-Beitrag auf Englisch live bringen, hreflang sauber, Sprachschalter im Blog erstmals eingebaut.

## Was passiert ist

### 6 neue EN-Blog-Files unter `en/blog/`
- `index.html` — Blog-Hub mit 4 Cards + Series-Disclosure fuer Folge-Beitrag. Schema: Blog mit blogPost-Liste (`inLanguage: en-GB`).
- `was-ist-ein-digitaler-stadtrundgang.html` — Definition + 6 Praxisbeispiele aus Vorarlberg + FAQPage Schema (4 Q&A en_GB) + 2 iframe-Grafiken referenziert auf DE-Files.
- `medien-und-demokratie-pflichtfach.html` — AHS-Reform 2027/28, FAQPage Schema (6 Q&A en_GB), Lehrplan-Mapping-Tabelle, AHS/PH/BMKOES-Begriffe mit Erklaerungen in Klammern.
- `wie-entsteht-ein-igrow-projekt.html` — 5-Phasen-Workflow + 2 Schulbeispiele (Zusammenwachsen, Ein Oktobertag) + zweispaltige Was-bringt-die-Schule/Was-bringt-i.appear Card.
- `frauenspuren-dornbirn.html` — Hauptartikel, mit `<section class="article__series">` zum Folge-Beitrag.
- `frauenspuren-launch-mai-2026.html` — Folge-Beitrag, `<p class="article__parent-link">` zurueck zum Hauptartikel, `mentions`-Ref im Schema.

Alle 6 mit `<html lang="en">`, `og:locale=en_GB`, hreflang-Triple, BlogPosting/Blog/FAQPage Schema in en-GB, App-Links auf `iappear.app/en/routes/...`.

### Pfad-Logik fuer `/en/blog/` (2 Ebenen unter root)
- Stylesheets/Assets: `../../css/...`, `../../assets/...`
- Iframe-Grafiken: `../../blog/figures/grafik_*.html` (Grafiken bleiben DE)
- Hero-Bilder: `../../blog/images/04-*.jpg` (bleiben mit deutscher App-UI im Phone-Mockup)
- Cross-Links auf EN-Kategorien/Stadtseiten: `../i-history.html` (eine Ebene hoch zu `/en/`)
- Cross-Links auf DE-Seiten (workflow, kontakt, vitrine, Rechtstexte): `../../workflow.html` mit `hreflang="de"` und "(in German)"-Label

### 6 DE-Blog-Files gepatcht per Python-Inline-Script
Vorher: KEINE DE-Blog-Datei hatte einen Sprachschalter. Nach Patch: hreflang-Triple + `og:locale:alternate=en_GB` + `<div class="nav__lang">` mit DE | EN zwischen `nav__brand` und `nav__links`. Script unter Patch-Script-Pattern aus Session 44.

### sitemap.xml: 6 neue EN-Eintraege + hreflang in 6 DE-Eintraegen
Blog ist statisch, kein Marker-Block. Daher manuell erweitert (anders als Stadt-Sitemap, die build.py rendert). Pattern wie sonst: DE-Eintrag mit hreflang-Triple, gefolgt von EN-Eintrag mit gleicher Triple.

### Bestehende EN-Seiten: kein Patch noetig
Grep verifiziert: keine der 13 bestehenden EN-Seiten (vor diesem Bundle) verlinkt auf den Blog. Daher kein Burger/Top-Nav/Footer-Update noetig.

## Entscheidungen

### Slugs bleiben deutsch
EN-Artikel heissen weiter `wie-entsteht-ein-igrow-projekt.html` statt `how-an-igrow-project-works.html`. Begruendung:
- Konsistenz mit `en/stadtrundgang-dornbirn.html`-Pattern aus Session 44 (Stadt-Slugs blieben DE).
- Spaeter wird Vitrine kommen mit DE-Slugs wie `bombenabwuerfe-feldkirch.html` — gleiches Schema.
- hreflang-Mapping ist trivial (DE-Slug ↔ EN-Slug = 1:1).
- SEO-Verlust ist gering: Title, H1, Meta-Description sind alle englisch und werden hoeher gewichtet als der Slug.

### Iframe-Grafiken bleiben DE
4 interaktive Grafiken in `blog/figures/grafik_*.html` werden aus EN-Artikeln per `<iframe src="../../blog/figures/...">` referenziert. Beschriftungen bleiben deutsch.
- **Akzeptabler Trade-off**: Datenpunkte sind weitgehend selbsterklaerend (Zahlen, Timeline, Stufen-Diagramm).
- Vermeidet 4 zusaetzliche HTML-Files und Wartungs-Drift.
- Bei Bedarf spaeter englische Grafiken nachziehen.

### Hero-Bilder unangetastet
Artikel 01 + 04 zeigen App-UI im Phone-Mockup auf Deutsch. Die App selbst ist zweisprachig, also kein Inhalts-Bruch — der englische User sieht: "Auch die App gibt's auf Englisch, hier nur Beispiel". Spart das Re-Rendern per PIL.

### App-Links zu `iappear.app/en/routes/...`
Wo in DE-Artikeln auf konkrete Routen verlinkt war (`/de/routes/...`), zeigen die EN-Versionen auf die englischen Pendants. App-EN-Routes wurden in Session 44 verifiziert.

## Was offen ist

- Maggy verifiziert die 6 neuen EN-Blog-Seiten im Privat-Tab.
- Iframe-Grafik-Hoehe bei mobiler Darstellung pruefen — die `data-fit-content`-Logik aus dem DE-Blog ist im Definition-Artikel und im Medien-Demokratie-Artikel uebernommen.
- Naechste Bereiche EN: Vitrine (Hub + 22 Artikel), 404. Workflow/Kontakt blockiert auf englische Tally-Form.

## Lehren

- **Patch-Script statt 36 einzelne Edits**: 6 DE-Files x 3 Edits (hreflang, og:locale:alternate, nav__lang) = 18 Edits, alle gleich strukturiert. Python-Inline-Script erkennt anchor-Strings, rendert mit f-strings — ein Tool-Call statt 18. Pattern aus Session 44 wiederverwendet.
- **Blog-Files hatten vor Session 45 keinen Sprachschalter**, weil zur Blog-Live-Zeit (Session 39, 2026-05-11) die EN-Version noch nicht im Plan war. Jetzt nachgepflegt. Bei zukuenftigen neuen Bereichen: Sprachschalter vorsehen wenn EN spaeter dazukommen koennte.
- **iframe-Grafiken zwischen DE/EN-Trees teilen** ist OK solange Beschriftungen sprach-unabhaengig sind. Bei stark sprachhaltigen Grafiken muesste man duplizieren.
