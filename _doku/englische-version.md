# Englische Version – Plan & Workflow

> Stand: 2026-05-05. Noch nicht umgesetzt — diese Datei ist die Konzept-Notiz für die spätere Implementierung.

## Was schon entschieden ist

- **URL-Modell**: Verzeichnis `iappear.at/en/...` (kein Subdomain, keine eigene Domain). Geteilte Domain-Authority, GitHub-Pages-kompatibel.
- **Sprachschalter**: Manueller Toggle `DE | EN` in der Top-Nav rechts neben dem Burger. **Kein Auto-Redirect** über Browser-Sprache (verwirrt User + Crawler, keine Best-Practice).
- **SEO-Mechanik**: `hreflang`-Tags pro Seite. Google zeigt automatisch die passende Sprachversion in Suchergebnissen, je nachdem ob jemand auf google.de oder google.com sucht.
- **Scope**: **Alle ~41 Seiten** kommen auf Englisch (nicht nur Kernseiten). Inkl. Vitrine + Stadtrundgänge + Blog.
- **Übersetzungs-Workflow**: Maggy übersetzt in **separater Claude-Session**, damit Code-Session und Sprach-Session sauber getrennt bleiben.
- **Vorgehen**: **Seitenweise** — eine nach der anderen, nicht Big-Bang.

## Noch offen (vor Start klären)

1. **Reihenfolge der Seiten.** Vorschlag (nicht bestätigt):
   1. Startseite (`index.html`)
   2. Drei Kategorien: `i-history.html` / `i-dentity.html` / `i-grow.html`
   3. `features.html` (falls vorhanden) / `workflow.html` / `kontakt.html` / `faqs.html` / `user-guide.html`
   4. Stadtrundgang-Hub `stadtrundgaenge.html` + 4 Stadtseiten
   5. Vitrine-Hub + 22 Vitrine-Artikel
   6. Blog + Rechtstexte
2. **Rechtstexte** (Impressum/AGB/Datenschutz): übersetzen mit Disclaimer „Binding is the German version", oder komplett deutsch lassen mit Link-Hinweis?
3. **Tally-Formular**: Maggy muss eine zweite englische Form im Tally-Account (`maggy@iappear.app`, Free-Plan) anlegen. Form-ID dann hier nachtragen.

## Workflow

### Phase 1 — Technisches Fundament (einmalig)

1. Verzeichnis `/en/` anlegen.
2. Sprachschalter `DE | EN` in Top-Nav aller bestehenden DE-Seiten einbauen (Pfad-Mapping: `iappear.at/X.html` ↔ `iappear.at/en/X.html`).
3. `hreflang`-Tags-Pattern festlegen — pro Seite jeweils:
   ```html
   <link rel="alternate" hreflang="de" href="https://iappear.at/X.html" />
   <link rel="alternate" hreflang="en" href="https://iappear.at/en/X.html" />
   <link rel="alternate" hreflang="x-default" href="https://iappear.at/X.html" />
   ```
4. `build.py` bilingual-fähig machen:
   - Vitrine-Marker auch in `en/vitrine.html` rendern (englische Texte aus separatem Datenfeld).
   - Rundgang-Counts auch in englischen Stadtseiten injizieren.
   - Sitemap-Generator erweitert auf alle `/en/`-URLs (mit `<xhtml:link rel="alternate" hreflang="..."/>` pro URL — sauberer Standard).
5. Erste englische Template-Seite (z.B. `en/index.html`) mit Platzhalter-Texten anlegen — als Vorlage mit allen technischen Eigenschaften: `<html lang="en">`, Meta-Tags englisch, hreflang, Sprachschalter zurück nach DE, korrekte relative Pfade zu CSS/JS/Assets (zwei Ebenen `..`).
6. Datenfiles entscheiden: bekommen `vitrine.js` und `rundgaenge.js` ein `de:`/`en:`-Feld pro Eintrag, oder gibt es eine zweite Datei `vitrine-en.js`? **Empfehlung:** Felder im selben Objekt, weniger Drift-Risiko.
7. `llms.txt` zweisprachig machen (eine Datei mit beiden Sprachversionen) oder zweite `en/llms.txt` anlegen.

### Phase 2 — Pro Seite (Loop)

1. Claude-Code (diese Session): kopiert DE-Seite ins `/en/`-Verzeichnis als Rohgerüst (HTML-Struktur, Klassen, Bilder/Videos = identisch).
2. Claude-Code: extrahiert alle übersetzbaren Strings in eine simple Markdown-Liste, z.B.:
   ```markdown
   ## index.html – Übersetzungs-Liste

   - [ ] **title**: i.appear – Digitale Stadtrundgänge & Audioguides in Vorarlberg
   - [ ] **meta-description**: i.appear – digitale Stadtrundgänge ...
   - [ ] **H1**: Die Plattform für digitale Erlebnisse
   - [ ] **Hero-Subline**: ...
   ```
3. Maggy: nimmt diese Liste mit in die **Übersetzungs-Claude-Session**, lässt übersetzen, prüft den Tonfall.
4. Maggy bringt fertige englische Texte zurück (Liste ausgefüllt).
5. Claude-Code: setzt Texte in die englische Seite ein, prüft Layout (z.B. längere englische Sätze brechen nicht das Design), pusht.
6. Sitemap + llms.txt + hreflang in DE-Version updaten.

## Was nicht übersetzt wird

Marken- und Eigennamen bleiben unverändert:

- `i.appear` (Brandname)
- `i.history` / `i.dentity` / `i.grow` (Sub-Marken)
- `Marilena Tumler` / `Marilena Gabriele Tumler`
- Ortsnamen: `Dornbirn`, `Feldkirch`, `Hard`, `Au`, `Bregenzerwald`, `Vorarlberg`, `Bodensee`
- Adresse: `Mozartstrasse 5/16, 6850 Dornbirn`
- E-Mails / Telefon
- GISA-Zahlen, GLN

Übersetzungs-Vokabular (vorläufig, in Übersetzungs-Session präzisieren):

- „Stadtrundgang" → `city tour` (oder `walking tour`?)
- „Audioguide" → `audio guide`
- „Vitrine" → `showcase`
- „Rundgang" → `tour`
- „Station" → `stop` (oder `point of interest`)
- „Erlebnis" / „Regionale Identität" → `experience` / `regional identity`

## Performance-Notiz

Browser lädt pro Besuch **nur eine Seite**. Englische Seiten sind extra HTML-Dateien im Repo, aber CSS/JS/Bilder/Videos/Fonts sind **geteilt**. Sprachwechsel ist genauso schnell wie ein normaler Seitenklick — Browser-Cache trägt CSS+Fonts schon.

GitHub-Pages-Build wird minimal länger (~2-3 Sek), egal in der Praxis.

## Risiken / zu beachten

- **Doppelte Pflege**: Jede zukünftige Text-Änderung muss in beiden Sprachen erfolgen. Sonst entsteht Drift. Konvention für CLAUDE.md aufnehmen wenn Phase 1 durch ist.
- **JSON-LD Schema**: pro Sprache eigene `description`-Felder. Wir müssen beim Vorbereiten der DE→EN-Templates dran denken.
- **`og:locale`**: auf englischer Seite `en_US` (oder `en_GB`?), auf deutscher `de_AT`.
- **Sitemap**: zwei Ansätze möglich — eine `sitemap.xml` mit hreflang-Annotationen pro URL, oder zwei separate (`sitemap.xml` + `sitemap-en.xml`) plus Sitemap-Index. Erste Variante ist Google-Standard, zweite ist einfacher zu pflegen. Entscheidung in Phase 1.
- **Search Console**: nach Live-Gang die englische Sitemap (oder neuen Index) extra einreichen, sonst dauert die Indexierung.
- **Tally-Form**: zweite Form auf Englisch ist Pflicht, sonst springt User auf englischer Kontakt-Seite mitten in deutsches Formular.

## Quellen / Best Practices

- [Google: Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google: hreflang-Tags](https://developers.google.com/search/docs/specialty/international/localized-versions)
