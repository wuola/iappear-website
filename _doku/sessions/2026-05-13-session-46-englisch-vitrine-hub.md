# Session 46 — Englisch: Vitrine-Hub komplett (Teil 1)

**Datum:** 2026-05-13
**Branch:** `claude/en-vitrine-hub`
**Ziel:** UX-Lücke zwischen EN-Blog und DE-Vitrine schliessen. Vitrine-Hub auf Englisch, Datenfile bilingual, `build.py` rendert beide Grids. Die 22 Artikel-Seiten bleiben fuer Teil 1 DE — die EN-Cards verlinken mit `hreflang="de"` + sichtbarem &bdquo;(in German)&ldquo;.

## Warum Teil 1 + Teil 2

Vitrine ist 1 Hub + 22 Artikel = 23 Seiten. Zu viel fuer eine ruhige Session. Aufgeteilt:
- **Teil 1 (diese Session)**: Hub. Schliesst sofort die UX-Luecke (EN-Showcase-Link landet auf EN-Hub, Blog-CTA von dort fliesst weiter), bringt SEO-Mehrwert (englischer Hub mit englischen Card-Texten ist crawlbar).
- **Teil 2 (spaeter)**: 22 Artikel-Seiten uebersetzen. Sobald `en/vitrine/{slug}.html` existieren, kann `build.py render_grid` einen Per-Item-`lang`-Schalter im Link-Prefix bekommen.

## Was passiert ist

### `vitrine.js` bilingual umgebaut
Vorher: flach `{titel, text, bild, link}`. Nachher pro Eintrag:
```js
{
  bild: "assets/images/vitrine/asked.png",
  link: "vitrine/askd-magazin-portrait-marilena-tumler.html",
  de: { titel: "...", text: "..." },
  en: { titel: "...", text: "..." }
}
```
- 22 Eintraege jeweils mit DE+EN-Paar.
- Fallback-Renderer in `vitrine.js` selbst (Notnagel falls build.py vergessen wird) liest jetzt `document.documentElement.lang` aus und rendert die richtige Sprache.

### `build.py` erweitert
- `parse_vitrine_js` versteht das nested-Schema via Stack-Counter (eckige/geschweifte Klammer-Tiefe, weil der naive `re.findall(r"\{([^{}]*?)\}")` aus dem Original an verschachtelten Klammern scheitert).
- `LANG_CFG = {"de": {...}, "en": {...}}` haelt CTA-Label, Pfad-Prefix (`""` fuer DE, `"../"` fuer EN) und `hreflang_attr` (leer fuer DE, ` hreflang="de"` fuer EN-Cards die auf DE-Artikel zeigen).
- `render_grid(items, lang)` mit Sprach-Parameter.
- `render_for(items, html_path, lang)` rendert in eine HTML-Datei, ueberspringt sauber wenn sie nicht existiert.
- `main()` rendert in `vitrine.html` (DE) und `en/vitrine.html` (EN).
- **DE-Output blieb 1:1 identisch** — keine Drift im Root.

### `en/vitrine.html` erstellt
- Kompletter EN-Hub: Schema, hreflang-Triple, og:locale en_GB, EN-Top-Nav + Burger, Breadcrumb Home -> Showcase, H1 "Showcase".
- Hub-Header mit Subtitle "Awards, press, articles and references" + Jumpnav-Chip "To the blog &darr;".
- `<!-- VITRINE-GRID-START / END -->` Marker (von build.py befuellt).
- `<section id="blog">` mit 4 EN-Blog-Cards + Series-Disclosure hardcoded (analog zur DE-Vitrine, aber englisch).

### DE-Vitrine patched
hreflang-Triple, `og:locale:alternate=en_GB`, `nav__lang`-Sprachschalter zwischen `nav__brand` und `nav__links`.

### 46 Showcase-Links in 19 bestehenden EN-Seiten umgestellt
Python-Inline-Script:
- 13 EN-Files auf Root-Ebene (`en/*.html`): `../vitrine.html` -> `vitrine.html` (Top-Nav + Burger).
- 6 EN-Blog-Files (`en/blog/*.html`): `../../vitrine.html` -> `../vitrine.html` (Burger + Breadcrumb + Footer).
- Total: 46 Link-Vorkommen umgestellt.

### 6 EN-Blog Schema-Breadcrumbs aktualisiert
BreadcrumbList Schema-URL fuer "Showcase" von `https://iappear.at/vitrine.html` (DE) auf `https://iappear.at/en/vitrine.html` umgestellt.

### Sitemap
DE-Vitrine bekommt hreflang-Triple, EN-Vitrine neu eingetragen (priority 0.65 vs DE 0.7).

## Entscheidungen

### `vitrine.js` nested statt flach mit Suffix
Alternativen waren:
- A) flache Suffix-Keys: `titel_de`, `titel_en`, `text_de`, `text_en`
- B) nested: `de: {titel, text}`, `en: {titel, text}`

Gewaehlt: B. Saubereres Datenmodell, besser fuer evtl. zukuenftige Sprachen, build.py-Erweiterung ist ueberschaubar (~30 Zeilen). Marilena bearbeitet die deutschen oder englischen Strings unabhaengig.

### EN-Cards mit `hreflang="de"` + sichtbarem "(in German)"
Die EN-Hub-Kacheln zeigen auf die DE-Artikel-Seiten (weil EN-Artikel-Seiten noch nicht existieren). Der User muss klar erkennen, dass der Klick in einer anderen Sprache landet. Loesung:
- `<a hreflang="de">` als Browser-/SEO-Hinweis.
- CTA-Label statt &bdquo;&ndash; read article &ndash;&ldquo; → &bdquo;&ndash; read article (in German) &ndash;&ldquo;.

In Teil 2 wird der Hinweis entfernt und `link` per `lang`-Schalter im `LANG_CFG` auf den EN-Artikel-Pfad gemapped.

### `build.py` macht beide Sprachen in einem Lauf
Statt zwei separate Befehle (`python build.py de`, `python build.py en`) macht ein `python build.py`-Lauf beides. Vermeidet Drift-Risiko und Marilena muss keinen Sprach-Parameter merken.

## Verifikation per Preview

- Hub `en/vitrine.html` rendert 22 Kacheln mit englischen Titeln + Texten, &bdquo;(in German)&ldquo;-CTA, Bild-Pfad `../assets/...`, Link-Pfad `../vitrine/...`.
- Sprachschalter funktioniert in beiden Richtungen (DE-Vitrine <-> EN-Vitrine).
- Showcase-Link aus EN-Blog landet auf EN-Vitrine (nicht mehr auf DE-Vitrine).

## Was offen ist

- **Teil 2**: 22 Vitrine-Artikel-Seiten uebersetzen, dann `LANG_CFG["en"]["prefix"]` von `"../"` auf eine sprachspezifische Link-Map umstellen.
- DE-Artikel-Seiten haben weiterhin keinen Sprachschalter (Konsequenz: vom DE-Vitrine-Artikel zurueck zu EN ist nur per Browser-Back oder Top-Nav-Showcase moeglich). Wird in Teil 2 obsolet.

## Lehren

- **Bilinguale Datenfiles mit nested Subkeys** sind bei wenigen Sprachen (2-3) sauberer als flache Suffix-Keys. Erfordert minimalen Parser-Aufwand (Stack-Counter statt Regex), wenn man Standard-JSON-aehnliche Strukturen aufbaut.
- **Teil 1/Teil 2-Split** bei grossen Bereichen ist effektiv: Hub bringt sofort die UX-Luecke weg + SEO-Mehrwert. Artikel kommen wenn Zeit ist, ohne dass die Site halb-gebrochen wirkt.
- **Wenn EN-Card auf DE-Artikel zeigt**: `hreflang="de"` UND sichtbarer Hinweis im CTA. Beide brauchen — `hreflang` allein ist unsichtbar fuer den User.
- **Build-Tool fuer DE bleibt 1:1 stabil**, wenn die DE-Sprach-CFG dieselben Strings wie der alte Hardcoded-Renderer erzeugt. Schoener Side-Effect: kein DE-Diff im Commit.
