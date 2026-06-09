# Session 50 - Rundgang-Links Dornbirn gefixt (Oberdorf/Innenstadt + 125-Platzhalter)

**Datum:** 2026-06-09
**Account:** wuola (verifiziert)
**Branch:** main

## Was gemacht wurde

Maggy meldete fehlende Rundgang-Links. Audit + Fix der Dornbirn-Rundgang-Deeplinks
(`iappear.app/.../routes/...`) ueber alle Seiten.

### Architektur-Befund (wichtig fuer kuenftige Link-Arbeit)

Die App-Route-Links sind **direkt im HTML hardcodiert** als `<a class="btn btn--<kat>">Zum
Rundgang &rarr;</a>` — **NICHT** aus `rundgaenge.js` generiert. `rundgaenge.js` speist nur die
**Counts/Chips** (via `build.py`), die einzelnen Rundgaenge dort haben gar kein Link-Feld.
D.h. Link-Aenderungen sind reine HTML-Edits, kein `build.py`-Lauf noetig.

**Drei unabhaengige Namenssysteme pro Rundgang** (NICHT verwechseln):
1. **App-Route-Slug** (im Link): z.B. `innenstadt-erleben`, `oberdorf-entdecken`
2. **Karten-Stations-Key** (`data-rundgang` + Key in `rundgang-stationen.js`): z.B. `innenstadt-erkunden` (!), `oberdorf-entdecken`
3. **Karten-Titel** (H3 sichtbar): z.B. „Innenstadt erleben"
Beispiel Innenstadt: Slug `innenstadt-erleben` ≠ Map-Key `innenstadt-erkunden` ≠ Titel „Innenstadt erleben". Alle drei korrekt, nur eben verschieden.

### Verifikation per curl (die App macht echte 404s, kein Catch-all-SPA!)

Darum lassen sich Route-Links zuverlaessig pruefen:
- `routes/dornbirn/oberdorf-entdecken` → **200** (DE + EN-Pfad), `routes/dornbirn/innenstadt-erleben` → **200**
- alte Slugs `routes/dornbirn/oberdorf` / `innenstadt` / `125-jahre` → **404**
- `iappear.app` (non-www) → 301 → `www.iappear.app`. Site nutzt ueberall **non-www** (funktioniert via Redirect) → fuer Konsistenz non-www beibehalten.

### Gefixte Links

| Datei | Rundgang | vorher | nachher |
|---|---|---|---|
| `i-dentity.html` | Innenstadt, Oberdorf | leerer Platzhalter `iappear.app` | `…/de/routes/dornbirn/innenstadt-erleben` / `…/oberdorf-entdecken` |
| `en/i-dentity.html` | dito | leerer Platzhalter | `…/en/routes/dornbirn/…-erleben` / `…-entdecken` |
| `stadtrundgang-dornbirn.html` | Innenstadt, Oberdorf | toter Slug (404) | `…-erleben` / `…-entdecken` |
| `en/stadtrundgang-dornbirn.html` | dito | toter Slug (404) | dito |

### 125 Jahre — Platzhalter (echte URL kommt spaeter von Maggy)

- `stadtrundgang-dornbirn.html` + `en/…`: 125-Button zeigte auf **toten** Slug `125-jahre` (404).
  Temporaer auf die **App-Startseite** umgebogen: DE → `iappear.app/de`, EN → `iappear.app/en`
  (sprachlich passend, beide 200). Kein toter Link mehr live.
- `i-history.html` + `en/…`: die 125-Karte ist dort **bewusst „Coming soon"** (`ph--soon`-Platzhalter +
  deaktiviertes `<span class="btn">Coming soon</span>`, kein Link) — **unangetastet gelassen**, weil
  ehrlich und nicht kaputt. Wird live geschaltet, sobald die echte Route-URL + Stations-Koordinaten da sind.

### Karten

- Oberdorf + Innenstadt haben auf `i-dentity.html` **schon funktionierende Mini-Karten** (Stations-Keys
  `oberdorf-entdecken` + `innenstadt-erkunden` in `rundgang-stationen.js`). Keine Karten-Luecke.
- **125 Jahre** hat **keine** Stationsdaten → noch keine Karte moeglich. Kommt mit Maggys 125-Daten.
- Stadtseiten nutzen gar keine Mini-Karten (nur Tour-Cards).

## Offen (wartet auf Maggy)

Echte 125-Route-URL (+ ggf. Stations-Koordinaten). Dann: 2 Stadtseiten-Buttons von `/de`/`/en` auf die
echte Route umstellen, i-history (DE+EN) von „Coming soon" auf live (Button + Mini-Karte).

## Geaenderte Dateien

`i-dentity.html`, `en/i-dentity.html`, `stadtrundgang-dornbirn.html`, `en/stadtrundgang-dornbirn.html`
