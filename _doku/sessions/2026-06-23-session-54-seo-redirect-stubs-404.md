# Session 54 – SEO: Redirect-Stubs gegen 404-Geister + 7 Descriptions gekürzt

**Datum:** 2026-06-23
**Commit:** `278c007`
**Auslöser:** Maggy sah in der Google Search Console „Nicht gefunden (404)" mit **15 betroffenen Seiten** (Trend wachsend bis Anfang Juni) und fragte, warum Google diese Seiten nicht findet.

## Diagnose

Die 15 URLs waren allesamt die **Pretty-URL-Geister** unserer eigenen Seiten — mit Schrägstrich statt `.html`:

- `iappear.at/features/` → 404 (echte Seite: `features.html` → 200)
- `iappear.at/ueber-uns/`, `/faqs/`, `/i-grow/`, `/stadtrundgang-hard/` usw.

**15 = exakt die 11 Hauptseiten + 4 Stadtseiten.** Herkunft: das Bug-Fenster vor Session 26 (Mai 2026), als canonical/og:url/sitemap noch auf Schrägstrich-URLs zeigten. Google hatte sie damals entdeckt, in die Crawl-Queue gelegt und arbeitete den Rückstau Ende Mai/Anfang Juni ab → jeder Treffer ein 404. **Keine neue Quelle** — Code-Audit (HTML, sitemap.xml, llms.txt, robots.txt, build.py) bestätigte: 0 Pretty-URL-Verweise im Live-Code. GitHub Pages serviert `/X/` grundsätzlich nicht (kein Pretty-URL-Support) → echter 404.

Die anderen GSC-Kategorien sind **keine Fehler**: „Alternative Seite mit richtigem kanonischen Tag" (2) = `/index.html` bzw. `/en/index.html` gegen ihre Verzeichnis-Roots dedupliziert; „Seite mit Weiterleitung" (1) = www/http-Normalisierung.

## Fix

### 1. Redirect-Stubs in build.py (TEIL 5, neu)
Statt die alten Adressen ins Leere (404) laufen zu lassen → saubere Weiterleitung. `generate_redirect_stubs()` legt pro Top-Level-Seite `X.html` eine winzige Datei `X/index.html` an mit:
- `<link rel="canonical" href="…/X.html">`
- `<meta name="robots" content="noindex, follow">`
- `<meta http-equiv="refresh" content="0; url=…/X.html">` + `<script>location.replace(...)</script>`

**18 Stubs** generiert. Schutzmechanik: überspringt `index`, `404`, `_`-Dateien; eine vorhandene **echte** `index.html` (kein Stub) wird nie überschrieben (Erkennung über `http-equiv="refresh"`). `vitrine/` war sicher (kein eigenes index.html), `blog/`/`en/` haben kein `X.html`-Pendant im Root → unberührt. Idempotent, läuft bei jedem `python build.py` mit.

Aus dem 404 wird damit „Seite mit Weiterleitung" (informativ, kein Fehler) + canonical-Konsolidierung auf die echte Seite. **GSC-Effekt:** Die 404-Liste schmilzt nach Re-Crawl, „Seite mit Weiterleitung" wächst entsprechend (~16) — das ist **gewollt**, nicht alarmierend.

### 2. SEO-Audit-Nebenbefund: 7 zu lange Meta-Descriptions (>160)
Subagent-Audit über alle 73 crawlbaren Seiten — sonst alles sauber (Canonicals, Titles, hreflang, interne Links, Sitemap, og-Tags). Gekürzt auf ≤160 gerenderte Zeichen (Bing-Error-Schwelle):
- `blog/frauenspuren-dornbirn.html` (162→152)
- `en/blog/frauenspuren-launch-mai-2026.html` (171→150, auch og/twitter)
- `en/blog/medien-und-demokratie-pflichtfach.html` (165→157, auch og/twitter)
- `en/faqs.html` (161→150), `en/i-history.html` (167→151)
- `en/stadtrundgaenge.html` (162→141), `en/stadtrundgang-hard.html` (163→142)

## Verifikation (live, mit Cache-Bust-Query gegen CDN-Edge-Cache)
- Alle 18 Schrägstrich-URLs liefern jetzt **200** (vorher 404), Stub zeigt korrekt auf `…/X.html`.
- Echte `.html`-Seiten unverändert 200 (Stichprobe features/en-i-history/vitrine/index).
- Gekürzte Description live auf `en/i-history.html` bestätigt.

## Lehre / Konvention
- **Pretty-URL-404-Geister fängt man mit Redirect-Stubs ab, nicht mit Warten.** Ist jetzt fest in build.py (TEIL 5), läuft bei jedem Build automatisch für jede neue Root-Seite mit.
- Bei GSC-„nicht indexiert"-Kategorien immer erst klären, **welche** Kategorie: nur „Nicht gefunden (404)" / „Soft 404" / „Serverfehler" sind echte Probleme; „Alternative Seite mit kanonischem Tag", „Seite mit Weiterleitung", „Duplikat …" sind das System, das korrekt arbeitet.

## Offen / Hinweis
- Leftover-Tempdatei `_seo_audit.py` (vom Audit-Subagent) im Root — `_`-Prefix, von Jekyll ignoriert, nicht crawlbar, **nicht committed**. Kann gelöscht werden.
- GSC-Aktion für Maggy (optional, beschleunigt nur): im 404-Report „Validierung starten" klicken — Google re-crawlt die 15 und hakt sie ab.
