# Session 26 — SEO-Fix: Pretty-URLs auf .html umgestellt

**Datum**: 2026-05-04 (Montag, ~16:00-17:30, direkt im Anschluss an Session 25 Launch)
**Commits**: `5ebc850` (SEO-Fix, 46 files)

---

Direkt nach dem Live-Gang (Session 25) hat Maggy mit Google Search Console begonnen: Property `iappear.at` schon eingerichtet, Sitemap eingereicht (zeigt 41 Seiten verarbeitet, ohne Fehler), Startseite per "Indexierung beantragen" durchgekriegt — grünes Häkchen. Beim Versuch dasselbe für `https://iappear.at/stadtrundgaenge/` zu machen kam aber **"Indexierungsanfrage abgelehnt"**.

Diagnose mit `curl -I`: alle "Pretty-URLs" (ohne `.html`-Endung) sind 404. Nur `https://iappear.at/X.html` gibt 200 zurueck. Das war ein latentes Problem das schon seit Session 5.5 (SEO-Setup, 2026-04-13) im Code stand, aber erst nach dem DNS-Switch fuer Google sichtbar wurde.

## Was kaputt war

GitHub Pages serviert **ohne Jekyll/Konfiguration** nur echte Datei-Pfade. `stadtrundgaenge.html` ist erreichbar als `/stadtrundgaenge.html`, aber **nicht** als `/stadtrundgaenge/`. Letzteres ist 404.

Aber genau diese 404-URLs standen ueberall in den SEO-Meta-Tags:

| Stelle | Anzahl betroffen |
|---|---|
| `<link rel="canonical">` in HTMLs | 41 Dateien |
| `<meta property="og:url">` in HTMLs | 41 Dateien |
| JSON-LD `BreadcrumbList` items | ~15 Dateien |
| JSON-LD `TouristAttraction.url` | 4 Stadtseiten |
| JSON-LD `ItemList` (stadtrundgaenge.html) | 5 Items |
| `sitemap.xml` (hand-codete URLs) | 14 Eintraege |
| `llms.txt` (Hauptseiten + Stadt-Links) | ~10 Eintraege |
| `build.py` Templating-Code | 6 Stellen |

Konsequenz: Google las die Sitemap → fand 41 URLs → versuchte zu crawlen → bekam ueberall 404 → konnte nichts indexieren ausser der Root `/` (die geht ueber `index.html`-Auto-Loading). Maggys "Indexierungsanfrage abgelehnt" war dasselbe Problem aus User-Sicht.

## Fix

**Ein Mass-Fix-Script `_seo_url_fix.py`** (temporaer im Root, nicht commited) hat alle relevanten Dateien per Regex durchgegangen:

- Generisches Pattern: `https://iappear.at/<slug>/` → `https://iappear.at/<slug>.html` (matcht alle Slugs, auch verschachtelte wie `/vitrine/ars-electronica-2021/`)
- Spezialfall `/blog/` als Hub bleibt (hat eigenes `blog/index.html`, ist nicht 404)
- Spezialfall Umlaut-URLs: `/stadtrundgänge/` → `/stadtrundgaenge.html` (per explicit string-replace)

**`build.py` separat per Edit-Tool gefixt** weil dort `{slug}` als f-string-Platzhalter steht, nicht regex-tauglich. 6 Stellen: canonical, og:url, BreadcrumbList, TouristAttraction url, sitemap-Eintrag, llms.txt-Eintrag.

**Bonus: Bregenz-Item aus `stadtrundgaenge.html` JSON-LD entfernt.** Bregenz ist `soon`, Stadtseite existiert noch nicht — die URL `https://iappear.at/stadtrundgang-bregenz/` (auch nicht `.html`) waere ein 404 in Strukturdaten. Wenn Bregenz spaeter live geht: handisch wieder eintragen oder `build.py` erweitern.

**Verifikation:**
- Lokal: `grep` nach `iappear.at/X/`-Pretty-URLs in allen 46 Dateien → 0 Treffer
- Live (nach Push): curl auf 5 Stichproben (`stadtrundgaenge.html`, `i-history.html`, `vitrine.html`, `vitrine/ars-electronica-2021.html`, `stadtrundgang-dornbirn.html`) — canonical + og:url alle korrekt mit `.html`
- Live: `sitemap.xml` 43 URLs, alle mit `.html` (ausser Root)
- Live: `llms.txt` Stadt-Links alle mit `.html`

## Search Console nach dem Fix

Maggy hat im Anschluss manuelle Indexierungs-Anfragen fuer 7 Top-URLs gestellt — alle grun durchgegangen ✅:
- `stadtrundgaenge.html` (war vorher abgelehnt!)
- `i-history.html`, `i-dentity.html`, `i-grow.html`
- `features.html`, `vitrine.html`
- `vitrine/iappear-in-den-klassenraeumen.html`

Den Rest crawlt Google automatisch ueber die Sitemap in den naechsten 1-4 Wochen.

**UI-Falle in Search Console:** Die Sitemap-Liste zeigt rot **"Konnte nicht abgerufen werden"** trotz erfolgreicher Verarbeitung. Im Detail (auf den Sitemap-Eintrag klicken) steht "ohne Fehler verarbeitet, 41 Seiten". Der erste Abruf-Versuch ist offenbar fehlgeschlagen, der zweite hat geklappt — die Liste zeigt aber den Status des ersten. Ignorieren.

**Auto-Vervollstaendigung im URL-Pruefen-Feld** schlaegt aus History die alten falschen URLs vor (z.B. `https://iappear.at/stadtrundgaenge/` ohne `.html`). Beim Pruefen unbedingt komplett neu tippen, NICHT klicken.

## Lehren

- **GitHub Pages serviert keine Pretty-URLs ohne Konfiguration.** Datei `X.html` ist nur als `/X.html` erreichbar, nicht als `/X/`. Sub-Verzeichnisse `Y/` brauchen eigene `Y/index.html`. Konsequenz fuer alle SEO-relevanten URLs (canonical, og:url, sitemap, llms.txt, JSON-LD): muessen exakt mit Datei-Pfaden uebereinstimmen.
- **Pretty-URLs sehen schoener aus, sind aber Tech-Debt.** Wenn man die wirklich will, muss man HTML-Dateien zu `slug/index.html` umstrukturieren (nicht jetzt, eventuell spaeter).
- **Pre-Launch-Test mit `wuola.github.io/iappear-website/X.html` hat das nicht aufgedeckt** weil Sitemap-URLs auf `iappear.at` zeigten (Domain noch nicht live). Erst nach DNS-Switch konnte Google die Sitemap echt crawlen.
- **Bei "Indexierungsanfrage abgelehnt": curl-Test BEVOR Browser-Hypothesen.** Das Problem ist immer reproduzierbar mit `curl -I` — direkt sichtbar als 404.
