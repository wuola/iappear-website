# Englische Version – Plan & Workflow

> Stand: 2026-05-06. **Pilot-Seite `index.html` komplett übersetzt** (Sessions 28 + 29).
> Diese Datei ist Konzept + lebender Status. Aktueller Stand am Ende der Datei.

## Festgelegte Konventionen für die ganze EN-Site

- **British English** (`en_GB`) ist die Sprachvariante. Schreibweisen: `Honour`, `colour`, `centre`, `recognise`, `realise`. Konsequent durchziehen — auch bei künftigen Übersetzungs-Sessions Marilena/Maggy.
- **Stilkonvention**: Sub-Marken-Sublines (`Travel through time`, `Regional identity`, `Media literacy`) in **sentence case**. Top-Nav-Items und Section-Headlines (`Walking Tours`, `Showcase`, `Three categories, one goal`) in **Title Case**.
- **Brand-Vokabular** (final, in `_doku/uebersetzung-index.md` voll dokumentiert): Stadtrundgang → walking tour, Audioguide → audio guide, Vitrine → Showcase, Bodensee → Lake Constance.
- **Cache-Bust gilt nur für CSS/JS-Änderungen.** Reine HTML-Übersetzungs-Edits brauchen keinen Bust.
- **Pro Seite eigene Übersetzungs-Liste** in `_doku/uebersetzung-<seitenname>.md` (Pattern siehe `_doku/uebersetzung-index.md` für `index.html`).

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

**Workflow seit Session 30 (2026-05-08):** Claude erledigt Roh-Gerüst + Übersetzung **direkt in derselben Session**. Keine separate Übersetzungs-Claude-Session mehr — die hat sich als unnötig zerstückelnd erwiesen. Maggy gibt freie Entscheidung beim Tonfall, mit klaren Constraints (Eigennamen + Ortsnamen bleiben, Brand-Vokabular siehe unten, en_GB).

1. Claude kopiert DE-Seite ins `/en/`-Verzeichnis als Rohgerüst — HTML-Struktur, Klassen, Bilder/Videos identisch. Alle Asset-Pfade auf `../...`. Top-Nav-Items, Burger-Menü und Footer direkt englisch übernehmen (final aus Session 29). Seitenspezifische Strings (Hero-Story, Card-Bodies, Section-Headlines, CTA, Meta) bekommen `[EN] `-Prefix.
2. Claude übersetzt **direkt** alle `[EN] `-Marker (en_GB, Brand-Vokabular siehe unten, Stilreferenz `en/index.html`).
3. Claude ergänzt in der DE-Schwester-Seite die `hreflang`-Triples + `og:locale:alternate` + `.nav__lang`-Sprachschalter.
4. Claude erweitert `sitemap.xml`: neuer EN-Eintrag mit hreflang-Annotationen, DE-Eintrag um hreflang-Triples ergänzt.
5. Claude committet + pusht + macht PR + mergt — alles in einem Schwung.
6. Maggy verifiziert im Privat-Tab.

**Optional**: Übersetzungs-Liste `_doku/uebersetzung-<seite>.md` als Audit-Trail anlegen, falls die Seite besonders viele Strings hat oder Maggy nochmal nachprüfen will. Für die meisten Seiten reicht direkt im HTML übersetzen.

## Was nicht übersetzt wird

Marken- und Eigennamen bleiben unverändert:

- `i.appear` (Brandname)
- `i.history` / `i.dentity` / `i.grow` (Sub-Marken)
- `Marilena Tumler` / `Marilena Gabriele Tumler`
- Ortsnamen: `Dornbirn`, `Feldkirch`, `Hard`, `Au`, `Bregenzerwald`, `Vorarlberg`, `Bodensee`
- Adresse: `Mozartstrasse 5/16, 6850 Dornbirn`
- E-Mails / Telefon
- GISA-Zahlen, GLN

## Brand-Vokabular (final, aus Session 29)

| DE | EN (final) |
|---|---|
| Stadtrundgang | walking tour |
| Audioguide | audio guide |
| Rundgang | tour |
| Station | location |
| Vitrine | Showcase |
| Erlebnis | experience |
| Regionale Identität | regional identity |
| Zeitreise | Travel through time |
| Medienbildung | Media literacy |
| Geschichten erzählen | storytelling |
| Schüler:innen | students |
| Bodensee | Lake Constance |

**Stilkonventionen:**

- **British English (en_GB)**: `colour`, `honour`, `recognise`, `theatre`, `centre`. `og:locale="en_GB"`, JSON-LD `inLanguage="en-GB"`.
- **Sub-Marken-Sublines** (i.history etc.) sind **sentence case**: `Travel through time`, `Regional identity`, `Media literacy`.
- **Top-Nav und Section-Headlines** sind **Title Case**: `Walking Tours`, `Showcase`, `About`, `A Network of Digital Walking Tours`.
- **Tonfall**: locker, „you"-Anrede, konkret. Stilreferenz: `en/index.html`.
- **Meta-Description**: 70–160 Zeichen. Bei eingebetteten Anführungszeichen **immer `&quot;`** verwenden, nie `"` direkt.

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

---

## Aktueller Stand (Stand 2026-05-08, Sessions 28 + 29 + 30)

### Erledigt

**Sessions 28+29 (2026-05-06): Phase 1 + Pilot Startseite**

- ✅ `/en/`-Verzeichnis angelegt
- ✅ Sprachschalter `.nav__lang` (glassy Pill, DE | EN) in `css/components.css` definiert
- ✅ Sprachschalter + hreflang-Tags in DE `index.html` eingebaut
- ✅ `en/index.html` als Pilot-Rohgerüst erstellt (Session 28: lang=en, hreflang-Triple, alle Pfade angepasst, `[EN]`-Marker)
- ✅ **`en/index.html` komplett übersetzt** (Session 29: alle 115 `[EN]`-Marker raus, British English, `og:locale=en_GB`, JSON-LD `inLanguage=en-GB`)
- ✅ Sitemap mit hreflang-xhtml-Annotationen für Startseite (DE + EN)
- ✅ Cache-Bust components.css auf alle 45 HTML-Dateien synchron hochgezogen
- ✅ Übersetzungs-Liste `_doku/uebersetzung-index.md` (Template/Referenz für nächste Seiten)
- ✅ Brand-Vokabular final festgelegt (siehe Konventionen-Block oben)
- ✅ **Konvention**: untranslated Strings im EN-File tragen Prefix `[EN] `
- ✅ **Konvention**: Top-Nav + Burger auf EN-Seiten zeigen auf DE-URLs, solange die EN-Version fehlt
- ✅ **Konvention**: Rechtstexte bleiben deutsch, Footer-Links labeln „(in German)" + `hreflang="de"`

**Session 30 (2026-05-08): Workflow-Wechsel + i-history**

- ✅ Cloud-Branch-Reparatur: Sessions 28+29 lagen 2 Tage isoliert auf `claude/continue-website-PUZIa` — via PR #8 in main gemergt
- ✅ **Workflow-Wechsel**: Übersetzung macht Claude direkt in derselben Session (statt separater Übersetzungs-Claude-Session)
- ✅ `en/i-history.html` Roh-Gerüst + komplett übersetzt
- ✅ DE `i-history.html` mit hreflang + Sprachschalter
- ✅ Sitemap erweitert um en/i-history

**Sessions 31–36 (2026-05-08, Folgewelle gleichen Tag):**

- ✅ **Session 31** [PR #12]: `en/i-dentity.html` (Kategorie-Seite Kultur/Tourismus)
- ✅ **Session 32** [PR #13]: `en/i-grow.html` (Kategorie-Seite Bildung, größte mit 11 Sektionen) — Sub-Marken-Trio fertig
- ✅ **Session 33** [PR #14]: `en/features.html` + neue `js/features-en.js` (14 Feature-Beschreibungen englisch, separate Datei statt bilingualer Lösung)
- ✅ **Session 34** [PR #15]: `en/ueber-uns.html` (Team-Bios) + drive-by Pretty-URL-Bug-Fix in DE (`/über-uns/` → `/ueber-uns.html`)
- ✅ **Session 35** [PR #16]: `en/faqs.html` (FAQPage Schema mit 7 Q&A in en_GB → Google Rich Snippets)
- ✅ **Session 36** [PR #17]: `en/user-guide.html` (1015 Zeilen mit 2 Wizard-Widgets, Mickey-Hand-Animation, 2 Inline-IIFE-Scripts englisch)

### Stand 2026-05-08 (Tag-Ende)

**8 Seiten komplett englisch live:**

| EN-Seite | Live | Notizen |
|---|---|---|
| `en/index.html` | ✅ | Sessions 28+29 (Pilot) |
| `en/i-history.html` | ✅ | Session 30 |
| `en/i-dentity.html` | ✅ | Session 31 |
| `en/i-grow.html` | ✅ | Session 32 |
| `en/features.html` | ✅ | Session 33 (+ `js/features-en.js`) |
| `en/ueber-uns.html` | ✅ | Session 34 |
| `en/faqs.html` | ✅ | Session 35 (FAQPage Schema) |
| `en/user-guide.html` | ✅ | Session 36 (Wizards + Mickey) |

### Branch-Strategie (eingeführt mit Session 31)

**Pro EN-Seite ein frischer Branch von `origin/main`**, Pattern `claude/en-<seite>` (z.B. `claude/en-i-dentity`). Vermeidet Hash-Konflikte durch rebase-merge die Session 30 erlebt hat (Worktree-Branch divergiert vom main-Hash). Nach Merge ist der Branch obsolet — kann lokal stehen bleiben (wird ignoriert) oder von Maggy in GitHub Desktop weggeräumt.

### Offen — direkt als Nächstes

1. **Visueller Layout-Check** durch Maggy in Privat-Tab für alle 8 live englischen Seiten.
2. **Falls Layout bricht**: punktuell anpassen.
3. **Nächste Pilot-Seiten** (Reihenfolge offen):
   - `stadtrundgaenge.html` (Hub mit Leaflet-Karte) + 4 Stadtseiten
   - `vitrine.html` Hub + 22 Vitrine-Artikel
   - 2 Blog-Artikel (`/blog/...`)
   - `404.html`
   - `workflow.html` + `kontakt.html` — **erst wenn englische Tally-Form existiert** (Maggy muss anlegen)
4. **Nicht angefasst, aber relevant** für die nächste Welle:
   - `build.py` ist noch nicht bilingual-fähig — `en/`-Versionen von vitrine.html und Stadtseiten brauchen entweder build.py-Erweiterung oder manuell-pflegte EN-Versionen.
   - `js/data/vitrine.js` und `rundgaenge.js` haben noch keine `de:`/`en:`-Felder.
   - `llms.txt` noch keine englische Sektion.

### Offene Items aus dem ursprünglichen Plan, die noch nicht durch sind

- **Sitemap-Strategie für Vollausbau**: hreflang-Annotationen in einer XML (eingeschlagen — siehe oben) — wird pro neuer EN-Seite erweitert.
- **Datenfiles** (`vitrine.js`, `rundgaenge.js`): noch keine `de:`/`en:`-Felder eingeführt. Wird relevant, sobald die Vitrine-Hub-Seite an der Reihe ist (Schritt 5).
- **`build.py` bilingual-fähig**: noch nicht angefasst. Wird relevant, sobald `en/vitrine.html` oder englische Stadtseiten kommen.
- **`llms.txt`**: noch keine englische Sektion. Anpassung nach Übersetzung der Startseite.
- **Tally-Form auf Englisch**: Maggy muss eine zweite Form im Tally-Account anlegen, bevor `en/kontakt.html` und `en/workflow.html` live gehen können. Form-ID hier nachtragen: _____.
- **Search Console / Bing**: nach Live-Gang englische Seiten in beiden Webmaster-Tools registrieren.

### Konventionen für die Doppel-Pflege (nach Phase 1 etabliert)

- Bei jeder DE-Text-Änderung muss die EN-Variante mitgepflegt werden (oder zurückgesetzt auf `[EN] <neuer DE-Text>`-Marker, falls neu zu übersetzen).
- Bei CSS- oder JS-Änderungen: Cache-Bust auf **allen** HTML-Dateien hochziehen (DE + EN), Pattern wie bei normalen Cache-Busts.
- Neue DE-Seite hat immer `<link rel="alternate" hreflang="..." />`-Triple und Sprachschalter-HTML.
