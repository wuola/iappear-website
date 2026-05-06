# Session 28 — Englisch-Version: Phase 1 + Pilot-Seite `index.html`

**Datum:** 2026-05-06
**Branch:** `claude/continue-website-PUZIa`
**Ziel:** Technisches Fundament für die englische Version aufbauen und die Startseite als Pilot-Seite ins `/en/`-Verzeichnis bringen.

## Was gemacht wurde

### 1. Sprachschalter-CSS (`css/components.css`)

Neue Komponente `.nav__lang` als glassy Pill mit zwei Slots (DE | EN).
Glas-Rezept aus den vorhandenen `--glass-*`-Variablen identisch zum Burger.
Aktive Sprache hat `aria-current="page"` und volle Opazität, andere Sprache
ist auf `.55` gedimmt mit Hover-Effekt. Trenner ist ein dezentes „|".
Höhe 36px (Burger ist 42px — bewusst etwas kleiner für visuelle Hierarchie).
Sichtbar auf allen Breakpoints (auch Mobile außen neben dem Burger).

### 2. DE `index.html`

- `hreflang`-Tags für DE, EN, x-default in `<head>` ergänzt.
- `<meta property="og:locale:alternate" content="en_US" />` ergänzt.
- Sprachschalter-HTML zwischen `.nav__links` und `.nav__burger` eingefügt
  (DE aktiv, EN zeigt auf `en/index.html`).
- Cache-Bust `components.css?v=20260505a` → `?v=20260506a`.

### 3. `/en/`-Verzeichnis + `en/index.html` (Pilot)

Neue Datei als komplette Kopie der DE-Struktur, mit:

- `<html lang="en">`
- Canonical → `https://iappear.at/en/index.html`
- hreflang-Triple (de, en, x-default)
- `og:locale="en_US"`, `og:locale:alternate="de_AT"`
- JSON-LD `WebSite.inLanguage="en-US"`, eigene `@id`
- Alle Asset-Pfade auf `../assets/...`, CSS auf `../css/...`, JS auf `../js/...`
- Sprachschalter mit DE → `../index.html`, EN aktiv
- **Top-Nav-Links und Burger-Menü-Links zeigen vorerst auf `../X.html`**
  (deutsche Seiten), bis die jeweilige englische Seite existiert. So
  vermeiden wir 404-Links während der Übersetzungsphase.
- **Alle übersetzbaren Strings tragen den Marker `[EN] `** als Prefix —
  damit jede Untranslated-Stelle sofort sichtbar ist und wir per
  find-replace austauschen können, sobald die Übersetzungen aus der
  separaten Übersetzungs-Session zurückkommen.
- Lorbeer-SVG ist **inline dupliziert** (nicht als externer `<use>`-Verweis)
  — der CSS-Stroke-Animation-Selektor `.hero__laurel-svg path` greift
  über Shadow-DOM-Grenzen nicht durch, daher Inline. Trade-off: ~20KB
  Duplikat pro Sprache, dafür identische Animation.
- Rechtstext-Links im Footer sind explizit als „Imprint (in German)" /
  „Privacy (in German)" / „Terms (in German)" gelabelt + `hreflang="de"` —
  Rechtstexte bleiben deutsch (rechtssichere Bindung), Hinweis zeigt das.

### 4. Übersetzungs-Liste (`_doku/uebersetzung-index.md`)

Komplette Markdown-Liste aller `[EN]`-Strings aus `index.html`, gruppiert
nach Bereichen (Meta, Nav, Burger, Hero, Sektionen, Footer). Inkl.:
- Brand-Vokabular-Tabelle (DE | EN-Vorschlag | EN-final)
- „Nicht übersetzen"-Liste (Marken, Eigennamen, Ortsnamen)
- Hinweis auf Description-Konvention (70-160 Zeichen, `&quot;` statt `"`)
- Workflow-Anleitung wie Maggy nach der Übersetzungs-Session weitermacht

### 5. Sitemap

`sitemap.xml` mit `xhtml`-Namespace erweitert. Startseite (DE) und
`en/index.html` haben jetzt `<xhtml:link rel="alternate" hreflang="..."/>`-
Annotationen pro hreflang-Variante (Google-Standard). Weitere DE-URLs
bekommen das Pattern, sobald die jeweilige EN-Seite existiert.

### 6. Cache-Bust auf 43 anderen DE-Seiten

`components.css?v=20260505a` → `?v=20260506a` per `sed -i` in 43 weiteren
HTML-Dateien synchron hochgezogen (Pflicht laut CLAUDE.md-Konvention bei
jeder CSS-Änderung).

## Was offen ist (für Maggy)

1. **Übersetzungs-Liste in separate Claude-Session nehmen**, übersetzen
   lassen, ausgefüllt zurückbringen.
2. Code-Session ersetzt dann alle `[EN] …`-Marker in `en/index.html`.
3. Layout-Check: längere englische Sätze brechen evtl. das Hero-Layout —
   visuell prüfen (Mobile + Desktop).
4. **Tally-Form auf Englisch** muss Maggy im Tally-Account anlegen, sobald
   `en/kontakt.html` und `en/workflow.html` an der Reihe sind.
5. **Suche-Console / Bing**: nach Live-Gang englische Sitemap-Variante
   einreichen, sonst dauert die Indexierung.

## Nächste Pilot-Seiten (Reihenfolge laut Plan)

1. ✅ `index.html` (diese Session)
2. ⏳ `i-history.html` / `i-dentity.html` / `i-grow.html`
3. ⏳ `features.html` / `workflow.html` / `kontakt.html` / `faqs.html` / `user-guide.html`
4. ⏳ `stadtrundgaenge.html` + 4 Stadtseiten
5. ⏳ Vitrine-Hub + 22 Artikel
6. ⏳ Rechtstexte (DE belassen, nur EN-Stub mit Verweis)

## Konventionen-Lehren aus dieser Session

- **Sprachschalter** ist eine eigene Komponente `.nav__lang`, sitzt
  zwischen `.nav__links` und `.nav__burger`, nutzt die globalen `--glass-*`
  Variablen — keine Stand-alone-Styles.
- **`[EN] `-Marker-Prefix** ist die Konvention für untranslated Strings.
  Vorteile: visuell sofort erkennbar, grep-bar (`grep -rn '\[EN\]' en/`),
  per find-replace austauschbar.
- **Lorbeer-SVG (und ähnliche animierte Inline-SVGs)** müssen pro Seite
  inline dupliziert werden, weil CSS-Animationen auf Inline-`path`-Elemente
  zielen. Externes `<use>` würde Shadow-DOM-Grenzen einführen — Animation
  bricht.
- **Top-Nav und Burger auf englischen Seiten zeigen auf DE-URLs**, solange
  die jeweilige EN-Seite nicht existiert. Sobald eine EN-Seite ergänzt
  wird, alle bestehenden EN-Seiten patchen, damit der Link auf die EN-
  Variante zeigt.
- **Rechtstexte bleiben deutsch**. Footer-Links auf EN-Seiten labeln das
  explizit mit „(in German)" und tragen `hreflang="de"`.
