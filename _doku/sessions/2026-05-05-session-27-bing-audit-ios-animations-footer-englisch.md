# Session 27 — Bing-Audit, iOS-Animations-Bugs, Footer-Cleanup, Englisch-Version geplant

**Datum**: 2026-05-05 (Dienstag, vormittags)
**Commits**: `35029cf` (SEO-Fix Bing-Audit), `8883b8a` (iOS-Mickey-Hand-Fix), `824c853` (Footer-Cleanup + iOS-Konvention)

---

Anschluss an die Live-Phase (Sessions 25-26). Maggy startete mit einer SEO-Sorge nach einer ChatClaude-Session, die ihr suggerierte iappear.at sei "nicht in Google" — Diagnose: die Site ist erst seit ~22 Stunden live, Google hat noch nicht crawlen können, das ist normal. `site:iappear.at` → 0 Treffer ist Erwartung, nicht Bug. Geduld 1–4 Wochen.

## Englische Version geplant (kein Code)

Maggy will alle ~41 Seiten auf Englisch nachziehen, in **separater Claude-Session** (Übersetzung) damit Code-Session und Sprach-Session getrennt bleiben. Konzept fixiert in `_doku/englische-version.md` und in CLAUDE.md verlinkt:

- **URL-Modell**: Verzeichnis `iappear.at/en/...` (kein Subdomain).
- **Sprachschalter**: Manueller Toggle `DE | EN` in der Top-Nav, **kein Auto-Redirect** (verwirrt User + Crawler, hreflang macht den Job für Suchmaschinen).
- **Workflow seitenweise**: Phase 1 = einmaliges Fundament (Verzeichnis, Toggle, hreflang, build.py bilingual, Template-Seite). Phase 2 = pro Seite Loop: Code-Session kopiert + extrahiert Texte → Maggy lässt in Übersetzungs-Session übersetzen → Code-Session baut ein.
- **Offen**: Reihenfolge der Seiten, Rechtstexte (übersetzen mit "binding is German"-Disclaimer oder DE-only?), Tally-Form auf Englisch.

## Bing-Webmaster-Tools-Audit

Maggy zeigte einen Screenshot von Bing-Webmaster für `stadtrundgaenge.html`: 2 SEO-Issues — Meta-Description zu lang (198 Zeichen, Limit 160) + 6 Bilder ohne alt-Attribut.

**Marker-Diagnose:** im ganzen Repo verwendet nur `stadtrundgaenge.html` `L.icon(...)` (rendert als `<img>`). Alle Mini-Karten in Vitrine + Stadtseiten nutzen `L.divIcon` mit Inline-SVG (kein `<img>`). Fix für die 5 Stadt-Pins via `L.marker([...], { icon, alt: 'Stadtrundgang ' + name + ' auf der Karte' })` — Leaflet 1.0+ setzt das als `alt` aufs gerenderte `<img>`.

**Description-Fix:** auf 152 Zeichen gekürzt.

**Präventiv 21 weitere Descriptions gekürzt** (Hauptseiten + 4 Stadtseiten + 2 Blog + 11 Vitrine-Artikel waren 162-210 Zeichen). Per Python-Skript (`_fix_descriptions.py` als Aufräum-Skript, nicht commited) — zwei Stolperer dabei:

1. **Eingebettete `"` im Description-Wert** zerschossen 3 Attribute (`florenz`, `ars-electronica-2021`, `vn-oktobertag-feldkirch`). Fix: `&quot;` statt `"`.
2. **Verschlucktes `g` im Wort-Mapping**: `Stadtrundgaenge` → `Stadtrund` + `ä` + `nge` (richtig wäre `Stadtrundg` + `ä` + `nge`). Bei der Umstellung von ASCII auf Umlaute fiel ein `g` weg.

Beide Lehren als Konvention in CLAUDE.md aufgenommen: **Meta-Description 70-160 Zeichen, immer `&quot;` statt `"`** im Wert.

## iOS-Animations-Bugs (zwei separate Reports)

Marilena meldete zwei Bugs auf iPhone (Desktop + Android laufen):

1. **Mickey-Hand auf user-guide.html flackert** und macht "komische Sachen"
2. **Workflow-Animationen** (Kaffeetasse-Dampf, Zahnräder, Doc-Shift, Sparkles, Bulb-Glow) bewegen sich gar nicht

### Mickey-Hand-Fix (Code, gepusht — `8883b8a`)

Erst-Diagnose war Composing-Layer-Konflikt zwischen animiertem `.ug-mickey`, `drop-shadow` auf `.ug-hand` und `backdrop-filter` auf benachbartem `.ug-toggle__track`. Klassische iOS-Safari-Resilience-Hacks:

```css
.ug-mickey {
  ...
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
.ug-hand { ... /* filter weg */ }
.ug-hand path { fill: #fff; filter: drop-shadow(...); }  /* drop-shadow nur noch auf path */
```

### Workflow-Animationen → kein Code-Bug, iOS-Setting

`@media (prefers-reduced-motion: reduce)` in workflow.html schaltet by-design alle Icon-Animationen aus (Steam, Gear, Doc, Check, Person, Sparkle, Bulb-Glow, Rocket-Flame). Marilena hatte auf dem iPhone **„Bedienungshilfen → Bewegung → Bewegung reduzieren"** aktiv — also griffen die `animation: none`-Regeln. Setting deaktiviert → alles läuft. Mickey lief direkt mit, obwohl er nicht im Reduce-Motion-Block stand (iOS regelt offenbar Animationen mit aktivem Reduce-Motion zusätzlich runter).

Unklar: war der Mickey-Code-Fix nötig oder nur das iOS-Setting? **Code-Fix bleibt drin**, schadet nicht und schützt andere iPhone-User mit aktivem Reduce-Motion oder älterem iOS.

### Lehre als Konvention (gepusht — `824c853`)

In CLAUDE.md aufgenommen: **bei „läuft nur auf iPhone nicht / spinnt"-Animations-Bugs IMMER zuerst „Bewegung reduzieren" + Stromsparmodus abfragen**, bevor Code-Theorien. Memory-Eintrag analog. Spart pro iOS-Bug-Report 20+ Min Code-Theorie für eine 30-Sekunden-Setting-Frage. Reihe ein bei den existierenden Diagnose-First-Konventionen (Cache → "ist Privat-Tab", iOS-Animation → "ist Reduce-Motion").

## Footer-Cleanup

`<a class="back-up-inline">nach oben &uarr;</a>` im Footer war redundant — der schwebende Pfeil-Button rechts unten erfüllt denselben Zweck und ist mobil besser bedienbar. Aus 44 HTMLs entfernt + zugehörige CSS-Regeln (`.back-up-inline` + Mobile-Hide) aus `components.css` raus. Cache-Bust `components.css?v=20260504a` → `?v=20260505a`.

## Status nach Session 27

- ✅ Bing-Audit-Issues gefixt (1 stadtrundgaenge.html + präventiv 21 weitere Seiten)
- ✅ Konventionen aufgenommen: Meta-Description-Länge + iOS-Reduce-Motion-Diagnose-First
- ✅ Englisch-Version geplant in `_doku/englische-version.md`, noch nicht implementiert
- ✅ Footer einheitlich (kein Inline-„nach oben"-Link mehr)
- ⏳ Google + Bing crawlen noch — Indexierung zeigt sich erst über Tage/Wochen
