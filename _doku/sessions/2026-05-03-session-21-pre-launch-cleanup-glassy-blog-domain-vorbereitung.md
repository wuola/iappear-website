# Session 21 — Pre-Launch-Cleanup: Mini-Karten-Dedup, Glassy-Modifier, i-dentity-Inhalt, User-Guide-Bild, Blog-Verstecken, LinkedIn-Fix, Pre-Launch-Audit

**Datum**: 2026-05-03 (Sonntag, Nachmittag/Abend)
**Commits**: `86d7efb` -> `dd84d0f` -> `c70cda7` -> `2736192` -> `fdb7864` -> `9deab8b` (plus Doku am Ende)
**Cache-Bust components.css**: `?v=20260503j` -> `k`

---

Zweite Session am Launch-Vorbereitungs-Sonntag. Maggy hat in dieser Session die letzte Etappe vor Domain-Umleitung angegangen: Karten-Daten-Bereinigungen, Glassy-Stil ueberall, i-dentity-Content-Updates, Blog vom Launch ausschliessen, LinkedIn-Slug-Bug. Am Ende ein Pre-Launch-Audit: 3 Risiken vor Live-Stellung identifiziert, Domain-Setup-Checkliste fuer morgen frueh.

## 1. Mini-Karten: Dedup identischer Koordinaten (`86d7efb`)

Maggy hat alle 5 Karten-TODO-Punkte aus `_doku/karten-todos.md` geklaert:
- hist.appear 3 Stations auf Default-Koord 47.414/9.740 (Wurzeln Dornbirns, Vertiefung Turteltaub, Vertiefung Zeitzeugen) → **Spezialfall, ok**
- See Runde Doppelpunkte (Gedenkstein + Würfelturm auf 47.494/9.689; "Gert Hoor" 2x) → **ok**
- Barockbaumeister weite Streuung Vorarlberg+Schweiz → **bewusst so** (Franz Beer baute weit)
- i-grow Mapping "Buntes Dornbirn" → "Immersive Ethik" → **korrekt**
- i-grow "hist.appear Schulversion" identisch zu i-history → **gewollt**

**Renderer-Fix** in `js/rundgang-map.js`: Stations dedup nach `lat,lng`-Key vor dem Marker-Loop. Mehrere Stations mit identischer Koord rendern jetzt nur EIN Target statt N gestapelte. Bounds-Berechnung bleibt mit allen (identische Koords aendern Bounds nicht).

`_doku/karten-todos.md` als "abgearbeitet" markiert + Audit-Trail.
`CLAUDE.md` "Was offen ist" massiv geschrumpft: Marilena-Bloecke entfernt (Phone-Notch komplett weggelassen, Netzwerk Marilena-OK, Typo passt provisorisch). Verbleibend nur noch: Domain-Umleitung + EN-Version + ein "Akzeptiert-offen"-Block (Hero-Videos Opera Mobile, Color-Contrast).

## 2. i-dentity: Region-Cards verlinkt + Headline-Update + Bludenz raus (`dd84d0f`)

Section "Weitere Stadtrundgaenge in Vorarlberg" → **"Weitere Highlights in Vorarlberg"**.
Bludenz-Card durch **Dornbirn**-Card ersetzt: "Dornbirn ist die groesste Stadt Vorarlbergs und ein wichtiges wirtschaftliches, kulturelles und Bildungszentrum im Rheintal."
Alle 4 Cards (Hard, Bregenzerwald/Au, Feldkirch, Dornbirn) jetzt komplett klickbar — Links auf die Region-Listen-Views in der iappear.app (`target="_blank"`).

**Neuer generischer `a.card`-Block** in `components.css`: Anchor-Reset + dezenter Hover (translateY -3px, Border heller, h3 underline). Ist dann ueberall nutzbar wo Cards Links werden.

## 3. i-dentity: CTA-Sektion am Seitenende neu formuliert (`c70cda7`)

"Du moechtest einen digitalen Stadtrundgang oder Audioguide für deine Stadt oder Region?" → "Du moechtest dein Unternehmen praesentieren, einen Tourismusstandort bewerben oder kulturelle Events sichtbar machen?" — adressiert die i-dentity-Zielgruppen direkter (Kultur, Tourismus, Unternehmen). Button "Eigenen Rundgang anfragen" → "Eigene Idee umsetzen".

## 4. Glassy-Stil als wiederverwendbare `.card--glass` Klasse + auf 3 Stadtrundgaenge-Cards (`ab589aa`)

Neuer Modifier in `components.css`: gleiche Optik wie `.contact-form` (`--glass-bg`, `--glass-border`, Backdrop-Blur, Inset-Highlights + weicher Glow). Auf einzelne `.card`-Items setzbar wo der ruhige glassy Look passt.
Angewendet auf die 3 "So funktioniert ein digitaler Stadtrundgang"-Cards (QR-Code scannen / Stationen entdecken / Erleben und staunen) in `stadtrundgaenge.html`.
Im selben Commit dazu: workflow.html "Vielfaeltige Moeglichkeiten"-Box-Texte (Top + Right) inhaltlich erweitert (vorher zu wenig Text -> grosse Whitespace-Boxen).

**Vorher** in workflow.html: Glassy-Stil hardcoded auf `.card.workflow-step` und `.options-diagram__box`. Jetzt einheitlich via `.card--glass`-Klasse — die workflow-Eigen-Definitionen koennen spaeter refactor-t werden, wurden aber heute aus Zeitgruenden noch belassen (funktioniert gleich).

## 5. User Guide b3.png: weisser Strich unter Action-Buttons entfernt (`cc798f5`)

Maggy via Screenshot: Im "In meiner Naehe" Schritt-3-Mockup hat es immer noch einen feinen weissen Strich unter den 3 Action-Buttons. Vorheriger Claude hatte das Original-Bild bereits einmal bearbeitet (unteren weissen UI-Bereich schwarz gemacht), aber ein 34 px hoher Bereich direkt unter den Buttons war noch RGB ~46 grau — auf schwarzem Hintergrund als feiner Strich sichtbar.

**Diagnose-Workflow**: Pillow Pixel-Scan, zuerst nach "weiss" gesucht (Threshold > 200 mean) — nichts gefunden. Dann nach "non-pure-black" (max > 5) — Streifen lokalisiert. **Lehre**: Bei direkter Bild-Bearbeitung Pixel-Scan in 2 Stufen (helle + leicht-helle Pixel), nicht nur eine.

**Fix**: Per Pillow alle Pixel ab Row 1239 auf (0,0,0) gesetzt. Verifikation: max value im Bereich = 0.

## 6. Blog fuer Launch versteckt (`2736192`)

Maggy: Blog-Artikel sind ClaudeCowork-Drafts mit Fehlern, vor dem Launch nicht oeffentlich. Loesung minimal-invasiv + reversibel:

- `vitrine.html`: "Zum Blog ↓"-Jumpnav-Chip + ganze `<section id="blog">` per HTML-Comment ausgeblendet.
- `blog/index.html` + 2 Artikel: `<meta name="robots" content="noindex,nofollow">` ergaenzt.
- `sitemap.xml`: 2 Blog-URLs auskommentiert.
- `llms.txt`: 2 Blog-Eintraege entfernt.

**Reaktivieren** spaeter = Comments raus + noindex-Tags loeschen + sitemap/llms-Eintraege zurueck.

## 7. i-history: Frauenspuren "Coming soon" → Link auf Rundgang (`fdb7864`)

Frauenspuren-Rundgang geht ab Dienstag vormittag live in der iappear.app. Karte hatte bisher `<span class="btn">Coming soon</span>` — jetzt regulaerer Button-Link analog zu Stadtspuren etc. URL: `https://iappear.app/de/routes/dornbirn/frauenspuren?view=list`. Funktioniert sobald der Rundgang in der App live ist.

## 8. LinkedIn-Slug-Fix: i-appear statt iappear (`9deab8b`)

Maggy gemeldet: Klick auf LinkedIn-Social-Pill im Footer redirected zu `linkedin.com/company/cherryblossomdevelopment/` statt zu i.appear. Diagnose: Alter LinkedIn-Slug "iappear" (ohne Bindestrich) wurde von einer fremden Firma uebernommen. Korrekter Slug: **"i-appear"** (mit Bindestrich), plus `/posts/?feedView=all` damit User direkt auf der Posts-Page landen.
Per Python-Replace auf alle 44 HTMLs aktualisiert.

## 9. Pre-Launch-Audit (kein Commit — Diskussion)

Maggys Frage: "fehlt was essentielles? koennte was peinlich werden?"

**3 Risiken identifiziert** vor Live-Stellung:
1. **Kontaktformulare tot**: `workflow.html` und `kontakt.html` haben `<form action="#">` — Click auf "Absenden" macht garnichts. Auf statisch gehosteter GitHub-Pages-Seite gibt's keinen Server. **Sehr peinlich.** Loesungen morgen entscheiden: Form ganz raus + nur Mail-Link, oder Formspree/Web3Forms anbinden.
2. **`stadtrundgang-bregenz.html` existiert nicht**, ist aber in `sitemap.xml` + `llms.txt` verlinkt → 404 sobald Google die Sitemap zieht. **Schnellfix**: aus Sitemap+llms raus, spaeter wieder rein.
3. **Kein `CNAME`-File** im Repo. Brauchen wir fuer die Domain-Umleitung.

**Domain-Umleitung Setup** fuer morgen frueh:

| Wer | Was |
|---|---|
| Claude | `CNAME`-File mit Inhalt `iappear.at` ins Repo |
| Maggy auf github.com | wuola/iappear-website → Settings → Pages → Custom Domain `iappear.at` + "Enforce HTTPS" haken |
| Maggy bei united-domains | A-Records fuer Apex `iappear.at`: `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`. CNAME fuer `www`: `wuola.github.io` |
| Maggy bei Readymag | Domain freigeben (sonst Konflikt) |

Timing: Montag frueh starten ist sicher fuer Dienstag vormittag live. DNS-Propagation 1-6h typisch (Worst Case 24h), GitHub HTTPS-Cert 5-30 min nach DNS-Switch.

---

## Quick-Stats Session 21

- 6 Code-Commits (`86d7efb`, `dd84d0f`, `c70cda7`, `ab589aa`, `cc798f5`, `2736192`, `fdb7864`, `9deab8b`)
- 1 Cache-Bust-Bump (`j` → `k`)
- 5 inhaltliche Pages beruehrt (i-dentity, i-history, vitrine, workflow, stadtrundgaenge)
- 1 Bild direkt editiert (b3.png in user-guide)
- Blog komplett vom Launch ausgenommen (4 Layer: HTML-Comment, sitemap, llms.txt, noindex-Meta)
- Karten-TODOs alle abgehakt — Datei zur Audit-Trail-Datei
- LinkedIn-Slug-Bug auf 44 HTMLs gefixt
- Pre-Launch-Audit mit 3 Risiken + Domain-Setup-Checkliste fuer morgen frueh
