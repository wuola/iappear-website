# Session 20 - Launch-Vorbereitung: Mobile-Polish + Burger-Farben + Workflow-Animation

**Datum**: 2026-05-03 (Sonntag)
**Commits**: `982ed0b` -> `1f94503` -> `6b632da` -> `ddf975b` -> `b7c2d27` -> `dbd0ae9` -> `7b0d5c3` -> `2e81470`
**Cache-Bust components.css**: `?v=20260502p` -> `20260503a` -> `b` -> `c` -> `d` -> `e` -> `f`

---

Erste Session in der Launch-Endphase. Maggy hat in dieser Session entschieden: **Launch-Ziel Dienstag 2026-05-05**, SEO-Sichtbarkeit ist wichtiger als perfekte Politur. Sie darf allein entscheiden, Marilena macht Final-Review. Marilena-Punkte aus "Was offen ist" werden NICHT als Launch-Blocker behandelt — Justierung kann nach Launch passieren. Memory-Eintrag `project_launch_dienstag.md` neu angelegt.

Workflow-Rhythmus war heute durchgaengig: Maggy schickt Screenshot mit Annotation oder selektiertes Element, Claude analysiert + macht Edit, Live-Verifikation per `preview_eval`-Bounding-Box-Messung, Maggy schaut lokal, dann Push. Bei mehreren Schritten Push erst nach Maggy-OK ("perfekt!").

## 1. Hero Mobile: Cat-Links optisch mittig unter CTA (`982ed0b`)

Maggy via Screenshot: 3 Kategorie-Links auf Mobile (i.history/i.dentity/i.grow) wirken nach links versetzt unter dem "JETZT STARTEN"-Button. **Diagnose** per `preview_eval`: Items waren technisch perfekt zentriert (item-centerX = pageMidX = 187.5 bei 375 px Viewport), ABER jede Item-Box war 210 px breit mit `justify-content: flex-start` — der Text-Inhalt (z.B. "i.history Zeitreisen") hockt links in der 210-px-Box, rechts daneben 100+ px Whitespace. Visueller Schwerpunkt 30-55 px links der Page-Mitte.

**Fix**: `.hero .hero__right` auf `width: max-content` + `max-width: 100%` schrumpfen, Items von `width: 210px` auf `width: auto + align-self: stretch` umgestellt. Container ist dann 155 px breit (= breitestes Item "i.dentity Regionale Identität"), Items fuellen Container, alle Targets in einer Spalte aligned, Block per `margin: 0 auto` mittig in der Page.

Live-Mess-Beweis: Container left=110, right=265, centerX=187.5 = Page-Mitte ✓.

## 2. Hero Mobile: Lichtstreifen + KATEGORIEN-Label ueber Cat-Links (`1f94503`)

Maggy: zwischen "JETZT STARTEN" und Cat-Links soll ein Lichtstreifen-Trenner kommen, drunter eine kleine Ueberschrift "Kategorien" linksbuendig. Bevor-Push-Diskussion in zwei Iterationen:

- **Erster Versuch**: Label im `.hero__right`-Container, linksbuendig zur Cat-Link-Spalte (also bei x=110, gleiche Kante wie Targets). Maggy korrigiert per Screenshot mit Pfeil: Label soll ganz an die Page-Container-Kante (x=24).
- **Loesung**: Label aus `.hero__right` HTML-mässig rausgezogen, als Geschwister DAVOR (`<small class="hero__cats-label">Kategorien</small>`). Sitzt jetzt als eigenes Grid-Item in der 1-Spalten-Mobile-Hero, nimmt volle Container-Breite (327 px), text-align: left → automatisch an Page-Container-Kante.
- Lichtstreifen wandert mit als `::before` aufs Label, 280 px breit, `min(280px, 90vw)`, gleiches Linear-Gradient-Rezept wie `.footer::before` und `.partner-uniwien::after`.
- Default `.hero__cats-label { display: none }`, Mobile-Media-Query `@media (max-width: 719px)` macht sichtbar + style.

**Symmetrie-Fix**: Maggy bemerkt dass der Abstand "Medienbildung -> Sektions-Trenner-der-naechsten-Section" kleiner ist als "oberer Lichtstreifen -> KATEGORIEN-Text". Diagnose: oberer Gap = `padding-top: var(--sp-3)` = 24 px, unterer Gap = nur `.hero { padding-bottom: var(--sp-1) }` = 8 px. **Fix**: `.hero .hero__right { margin-bottom: var(--sp-2) }` (= 16 px) auf Mobile zugefuegt — addiert sich zum hero padding-bottom auf 24 px. Beide Abstaende jetzt exakt 23.99 px (Diff = Rundungsrest).

## 3. Index Mobile: Lichtstreifen + NETZWERK-DORNBIRN-Label ueber Network-Viz (`6b632da`)

Maggy: gleiches Pattern wie KATEGORIEN-Label fuer den Network-Block auf der Landing. Schnell umgesetzt durch CSS-Selektoren-Kombi (.hero__cats-label, .network-viz-label) — beide Labels teilen jetzt Style + Lichtstreifen-Rezept. Margin-top nur auf hero (Luft zum CTA), bei Network-Viz-Label sorgt schon `.network { gap: var(--sp-4) }` fuer Abstand.

## 4. ueber-uns: Kontakt-Box am Ende rausgenommen (`ddf975b`)

Maggy via "launch-selected-element" auf der Live-Preview: die Info-Card mit Adresse + Tel + Mail am Ende von ueber-uns.html soll weg. Begruendung: Daten stehen schon im Impressum (Pflicht), auf der Kontakt-Seite und im JSON-LD; direkt drueber sitzt der "Kontakt aufnehmen"-CTA der dorthin fuehrt — die Box war reine Dopplung.

## 5. Hero-CTA: "JETZT STARTEN" -> "Rundgang starten" Mixed-Case (`b7c2d27`)

Drei Iterationen Text-Vorschlaege ("Tour starten" -> "Rundgang starten"), Maggy entschied "Rundgang starten" + "nicht in capitals". `.hero__cta` ueberschreibt jetzt das von `.btn` geerbte `text-transform: uppercase` + `letter-spacing: .15em` (Mixed-Case sieht mit dem weiten Letter-Spacing zerrissen aus). Neue Werte: `text-transform: none, letter-spacing: .02em`.

## 6. Index Desktop: NETZWERK-DORNBIRN-Label als Caption unter Network-Viz (`dbd0ae9`)

Auf Desktop war das Label `display: none`. Maggy via Screenshot mit gelbem Rechteck: gleiches "Netzwerk Dornbirn"-Label soll auch auf Desktop kommen, aber UNTER der Visualisierung, zentriert.

**Loesung**: Wrapper-Div bekommt Klasse `.network-viz-wrap` mit `display: flex; flex-direction: column-reverse` auf Desktop. Label im HTML steht weiterhin VOR der Viz (Mobile-Reihenfolge mit Lichtstreifen oben), aber visuell auf Desktop unter ihr. Kein Lichtstreifen Desktop (war Mobile-Trenner — Desktop-Caption braucht keinen).

## 7. Burger-Menue: Farb-Hierarchie umgedreht (`7b0d5c3`)

Maggy: Headings im Burger-Menue ("Die Plattform", "Stadtrundgaenge", "Backstage") sollen weiss sein, Eintraege in der aktuellen Heading-Farbe (rgba(255,255,255,.75) = leicht gedaempftes Weiss) — Akzent-Farben fuer i.history/i.dentity/i.grow bleiben. Vorher waren Headings gedaempft, Eintraege voll-weiss → Hierarchie wirkte verkehrt.

**Specificity-Trick**: `.menu__list a { color: rgba(255,255,255,.75) }` allein wuerde die globalen `.c-history` etc. (Specificity 0,1,0) ueberschreiben (0,2,1). Loesung: `.menu__list a.c-history` etc. mit hoeherer Specificity (0,3,1) explizit setzen.

## 8. Workflow: "Vielfaeltige Moeglichkeiten"-Animation + Schreib-uns-Box kompakter (`2e81470`)

**Animation**: Maggy hat das alte Readymag-Animation-Widget vermisst (4 Boxen + Crosshair in der Mitte mit Animation drauf, "leuchtende weisse Punkte die sich auf Linien bewegen"). Im Recon nichts klares gefunden. Maggy: "war eh nicht so cool, wuerde es selbst neu machen."

Iterationen:
- **v1**: 4 Punkte pendeln zwischen Center-Edge und Card-Edge. Phase-shift im Uhrzeigersinn (top → right → bottom → left, je 0.75 s Versatz). Maggy: Reihenfolge nicht "im Kreis" sondern "vertikal-paar dann horizontal-paar abwechselnd".
- **v2**: Top + Bottom synchron (delay 0s), Left + Right synchron (delay 1.5s — startet wenn V-Pair maximal aussen). Maggy: cool aber Center-Box-Border sieht "tot" aus, koennen Punkte AUCH durch die Mitte wandern oder bis zur Mitte vom Crosshair?
- **v3**: Center-Box-Border raus (nur Crosshair sichtbar), Punkte starten unsichtbar in der Mitte des Crosshair-Schnittpunkts, fliegen mit fade-in nach aussen zur Card-Edge, zurueck mit fade-out. V/H-Pair-Phasing wie v2.
- **v4 (final)**: Maggy: doch lieber "alle gleichzeitig aussen starten, in der mitte treffen, zurueck". Phase-Delays alle auf 0s, Keyframes umgedreht (0%/100% = aussen, 50% = Mitte), opacity raus (Punkte voll sichtbar). Glow stackt in der Mitte zu hellem Pulse — symbolisch perfekt fuer "alles haengt zusammen, treffen sich im Hub, fliessen wieder raus".

**Schreib-uns-Box**: Maggy via Screenshot der Kontakt-Seite: die Form-Box auf workflow.html ("Fuer Details"-Sektion) ist viel zu gross. **Fix**: alte `.for-details__form-wrap` + `.for-details__mail` Loesung raus, ersetzt durch das `.contact-form`-Pattern aus kontakt.html (glassy, max-width 408 px, "Schreib uns"-Heading + "Lieber direkt? info@iappear.app"-Inline-Zeile statt Mail-Icon-Block). Grid-Spalten von `1fr 1fr` auf `1fr minmax(0, 408px)` — Text bekommt mehr Platz.

---

## Quick-Stats Session 20

- 8 Commits (`982ed0b` bis `2e81470`)
- 7 Cache-Bust Versionen components.css (a → f)
- 5 verschiedene Pages beruehrt: index, ueber-uns, workflow, alle 44 HTMLs (Cache-Bust)
- 1 neuer Memory-Eintrag (`project_launch_dienstag.md`)
- Plan-vor-Action workflow durchgaengig: Bounding-Box-Messung als Beweis, kein Spekulieren
- Animation in 4 Iterationen entwickelt (Maggy hat das Konzept beim Probieren gefunden)
