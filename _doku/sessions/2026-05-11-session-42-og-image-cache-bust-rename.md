# Session 42 — OG-Image-Cache-Bust: og-image.png → og-image-v2.png

**Datum**: 2026-05-11 (Montag, Abend, direkt nach Session 41)
**Branch**: `main`
**Commit**: `00e874f`

---

Direkt-Nachspiel zu Session 41. Maggy hatte heute schon zwei andere Claude-Sessions offen — die haben Session 41 (OG-Image-Renovierung) abgeschlossen, aber beim End-to-End-Test versagt. Maggy teilt URLs via Microsoft Teams und SMS (iMessage) — die Vorschau-Karte zeigt **kein Bild**, sondern einen Fallback-Mini-Container mit Alt-Text "URL-Vorschau für 'i.appear - Digitale...'". Eine der vorigen Sessions hatte das mit "alles ist gecached" abgetan; Maggy hat zu Recht abgewinkt, weil sie immer in privaten Tabs testet (Konvention: kein Browser-Cache mehr als Erklärung).

## 1. Diagnose

Vier parallele Checks, ohne Cache-Hypothesen blind anzunehmen:

**Code im Repo:** Alle 28 Hub-/Hauptseiten + Blog-Index + Rechtstexte + EN-Seiten zeigen via `og:image` auf `https://iappear.at/assets/og-image.png` (Generic). Die 4 Blog-Artikel + 22 Vitrine-Artikel zeigen seit Session 41 auf eigene Hero-/Teaser-Bilder. Alles wie geplant.

**Live-Server-Output via `curl`:** Server liefert für drei verschiedene User-Agents (Facebook-Bot, LinkedIn-Bot, Microsoft-Trident-UA) das Generic-Bild mit identischer Response — 200 OK, 38291 Bytes, `Content-Type: image/png`, `Last-Modified: heute 09:38`. Kein User-Agent-Filter, kein Auslieferungs-Bug.

**Bild-Format via Pillow + PNG-Chunk-Analyse:** `og-image.png` ist 1200×630 RGB PNG, kein ICC-Profile, kanonische Chunk-Struktur (`IHDR`, 11× `IDAT`, `IEND` — sonst nichts). Standard-OG-Dimensionen, technisch makellos.

**Git-History des Files:** `assets/og-image.png` existiert seit Session 5.5 (Commit `50a3ab8`) unter **gleichem Pfad**. Heute (Commit `283b85b` aus Session 41) wurden nur die **Bytes** ausgetauscht — die URL ist unverändert. Das alte Bild war übrigens RGBA, das neue ist RGB (also Inhalt sichtbar anders).

## 2. Ursache: Plattform-OG-Scraper-Cache

Microsoft (Teams + Outlook + Office-Link-Preview-Service) und Apple (iMessage-Link-Preview) cachen OG-Vorschauen aggressiv **pro URL**. Wenn ihre Scraper das Bild vor Wochen schon mal abgerufen haben, speichern sie die generierte Vorschau-Karte und holen **nicht** bei jedem Share neu. Diese Caches:

- liegen auf den Drittanbieter-Servern (nicht im Browser) → Maggys Private-Tab-Workflow umgeht sie nicht
- prüfen ETag/Last-Modified oft nicht (manche Plattformen schon, viele nicht)
- haben sehr lange TTLs (Microsoft: Wochen, Apple: ähnlich)
- werden nicht durch HTML-Cache-Bust (`?v=...`-Query am og:image-Pfad) aufgelöst, weil viele Scraper Query-Strings beim Cache-Key entweder ignorieren oder als gleiche URL behandeln

Warum **gar kein Bild** statt **altes Bild**: Vermutlich hatte ein früherer Scrape einen Render-Fehler oder einen 404-Zwischenstand gecacht — die Plattform behält dann oft die kaputte/leere Karte bei und weigert sich, neu zu scrapen. Das ist genau das, was Maggy im Teams-Screenshot gesehen hat: Fallback-Container mit Alt-Text, statt Bild.

Wichtige Abgrenzung gegen die Diagnose der vorigen Session: "alles ist gecached" stimmte halb — aber ohne zu spezifizieren WELCHER Cache. Browser-Cache (Brave, Maggys Setup) ist es **nicht**. Plattform-Scraper-Cache ist ein eigener Layer.

## 3. Fix

```
git mv assets/og-image.png assets/og-image-v2.png
```

Plus Python-Mass-Replace in allen 28 HTMLs (`og-image.png` → `og-image-v2.png`):

```
agb.html, blog/index.html, datenschutz.html, faqs.html, features.html,
i-dentity.html, i-grow.html, i-history.html, impressum.html, index.html,
kontakt.html, stadtrundgaenge.html, stadtrundgang-{au,dornbirn,feldkirch,hard}.html,
ueber-uns.html, user-guide.html, vitrine.html, workflow.html,
en/{faqs, features, i-dentity, i-grow, i-history, index, ueber-uns, user-guide}.html
```

CLAUDE.md-Konvention nachgezogen (Pfad-Referenz im OG-Image-Strategie-Block + neue Konvention zur Cache-Bust-Pflicht beim Bild-Tausch).

Commit `00e874f` — Push — `gh run watch` bestätigt Deploy in 43 s — `curl` verifiziert live: `iappear.at/assets/og-image-v2.png` → 200 OK, Index-HTML zeigt die neue URL.

## 4. Test-Ergebnis (Marilena)

- **SMS / iMessage**: Vorschau-Karte rendert das neue Bild korrekt ✓
- **Microsoft Teams**: noch kaputt — Teams-Desktop hat zusätzlich einen In-Client-Cache mit eigener (langer) TTL. Maggy hat das als "Teams spinnt sowieso" abgehakt. Wenn überhaupt: Teams komplett schließen und neu öffnen, oder ein paar Tage warten.

Aus Sicht der Microsoft-Card-Service-Backend-Scraper ist `og-image-v2.png` aber eine völlig neue URL — kein Cache möglich. D. h. nach dem nächsten Teams-Refresh sollte auch dort die Vorschau funktionieren.

## 5. Lehren

Zwei Sachen für die nächste Claude-Session, die ein OG-Image tauscht:

**Beim Bild-Tausch IMMER den Filename mit Versions-Suffix wechseln.** Nicht nur die Bytes austauschen. `og-image.png` → `og-image-v2.png` zwingt jeden Plattform-Scraper zum Re-Fetch, weil der Cache-Key (= URL) sich ändert. Das ist konsistent mit der bereits etablierten Konvention für Blog-Hero-Bilder (Session 37, "Filename ändern statt nur `?v=...`-Query"), aber für OG-Image noch wichtiger — Plattform-Scraper sind hartnäckiger als Browser-Caches.

**Cache-Diagnose immer spezifisch.** Wenn jemand mit "alles ist gecached" um die Ecke kommt: nachfragen welcher Cache. Browser-Cache (Maggy: privater Tab löst), Fastly-CDN von GitHub Pages (10 min TTL, autorefresh), Plattform-OG-Scraper-Cache (URL-Wechsel nötig), App-In-Session-Cache (App-Neustart). Browser-Cache scheidet bei Maggy grundsätzlich aus.

## 6. Files

| Action | Path |
|---|---|
| Rename | `assets/og-image.png` → `assets/og-image-v2.png` |
| Mass-Edit (28 Files) | siehe Liste oben |
| Konvention | `CLAUDE.md` (OG-Image-Strategie-Block + neue Cache-Bust-Pflicht-Konvention) |
| Doku | dieses File + `_doku/sessions/README.md` |

Kein `build.py`-Lauf nötig (Generic-Bild ist nicht in Build-Marker-Blöcken).
