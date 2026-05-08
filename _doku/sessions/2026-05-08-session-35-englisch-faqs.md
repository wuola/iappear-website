# Session 35 — Englisch: `faqs.html` direkt übersetzt

**Datum:** 2026-05-08
**Branch:** `claude/en-faqs`

## Was gemacht wurde

### `en/faqs.html`

Komplett uebersetzt mit besonderem Augenmerk auf das **FAQPage Schema**
(Google Rich Snippets):

- BreadcrumbList JSON-LD: en/-URL
- FAQPage JSON-LD: alle 7 Q&amp;A in en_GB, plus `inLanguage: en-GB`
- Sichtbare FAQ-Listen (10 Q&amp;A in 4 Sektionen): General / Usage &amp;
  technology / Content / For partners
- Sichtbare Strings exakt gleich wie im JSON-LD &mdash; sonst Google penalisiert

### Wichtige Übersetzungs-Entscheidungen

- **Page-Header-Subtitle** „Freundlich gefragte Fragen" (humorvolles Wortspiel
  im DE) → `The questions we hear most` (sympathisch, aber Wortspiel ist nicht
  uebersetzbar &mdash; alternative Idiomatik passt besser).
- **„progressive Web-App"** &rarr; `progressive web app` (lowercase, en_GB-Form).
- **„Ortsbasiert"** &rarr; `location-based` (Brand-Vokabular: Station &rarr;
  location).
- **Gerätelinks**: deutscher Google-AR-Devices-Link auf englische Variante
  umgestellt (`/ar/devices` ohne `?hl=de`).

### DE `faqs.html`

- 3 hreflang-Tags + canonical
- `og:locale:alternate="en_GB"`
- `.nav__lang`-Block

### `sitemap.xml`

- en/faqs.html neu (priority 0.55)
- DE-Eintrag um hreflang-Triples erweitert

## Stand nach Session 35

EN live: index, i-history, i-dentity, i-grow, features, ueber-uns, faqs &mdash;
**7 Seiten**.

## Hinweis fuer Maggy

Das **FAQPage Schema** ist SEO-Gold &mdash; Google zeigt damit ggf. Rich Snippets
direkt in den Suchergebnissen (z.B. ein aufklappbares „Was ist i.appear?" mit
Antwort). Nach Indexierung in Search Console gucken, ob es ankommt.
