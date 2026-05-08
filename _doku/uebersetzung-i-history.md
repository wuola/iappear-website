# Übersetzungs-Liste – `i-history.html`

> **Status:** Roh-Gerüst gebaut, Übersetzung steht aus.
>
> **Workflow:** Maggy nimmt diese Liste in eine separate Übersetzungs-Claude-Session,
> lässt alle Strings übersetzen, prüft den Tonfall, kommt mit ausgefüllter Liste
> zurück. Code-Session ersetzt dann alle `[EN] <deutsch>`-Marker in
> `en/i-history.html` durch die englischen Strings.
>
> **Konventionen (siehe `_doku/englische-version.md`):**
>
> - **British English** (`en_GB`): `Honour`, `colour`, `recognise`, `theatre`
> - **Brand-Vokabular final** (aus Session 29):
>   `Stadtrundgang → walking tour`, `Rundgang → tour`, `Station → location`,
>   `Audioguide → audio guide`, `Vitrine → Showcase`, `Erlebnis → experience`,
>   `Regionale Identität → regional identity`, `Zeitreise → Travel through time`,
>   `Medienbildung → Media literacy`, `Bodensee → Lake Constance`,
>   `Schüler:innen → students`
> - **Sentence case** für Sub-Marken-Sublines, **Title Case** für Section-Headlines
> - **Meta-Description**: 70–160 Zeichen, bei Anführungszeichen `&quot;` statt `"`

## Was NICHT übersetzt wird (Eigennamen)

**Rundgang-Namen bleiben deutsch:**
`hist.appear`, `Stadtspuren`, `Frauenspuren`, `125 Jahre – 125 Bilder`,
`Barockbaumeister`, `See Runde`

**Personen + Institutionen bleiben:**
`Franz Beer`, `Werner Matt`, `Klaus Fessler`, `Roswitha Fessler`,
`Lisa Althaus`, `Nikolay Uzunov`, `Saegenvier`,
`Dornbirner Stadtarchiv` (oder mit Klammer-Erklärung „City Archive of Dornbirn"?),
`Dornbirner Geschichtswerkstatt`, `vorarlberg museum`, `Universität Wien`,
`Universität Konstanz`, `Fachhochschule Vorarlberg`,
`Barockbaumeister Museum`, `Bundesministerium für Kunst, Kultur, öffentlichen Dienst und Sport`
(oder mit Klammer-Erklärung „Federal Ministry of Arts, Culture, the Civil Service and Sport"?)

**Ortsnamen bleiben:**
`Dornbirn`, `Feldkirch`, `Bregenz`, `Vorarlberg`, `Au`, `Bregenzerwald`, `Hard`,
`Bodenseeraum`, `Konstanz`, `Rheinau`, `Bezau`, `Forach`, `Gütle`, `Müllerbach`,
`Dornbirner Ach`

(Bei `Bodensee` → `Lake Constance` laut Brand-Vokabular.)

---

## Strings für `en/i-history.html`

Alle Strings sind im File mit dem Marker-Prefix `[EN]` versehen. Wenn Übersetzung
zurück, einfach `[EN] <deutsch>` durch englische Variante ersetzen.

### Meta-Tags (Head)

- [ ] **`<title>`**:
  - DE: `i.history - Digitale Stadtrundgänge durch die Geschichte | i.appear`
  - EN: `_____`
  - Hinweis: max ~60 Zeichen, „i.history" + „i.appear" sollten vorkommen.

- [ ] **`<meta name="description">`** (70–160 Zeichen):
  - DE: `Historische Stadtrundgänge und Audioguides in Dornbirn, Feldkirch, Au und Hard. Zeitreisen mit 3D, AR und Zeitzeugeninterviews — direkt am Ort.`
  - EN: `_____`

- [ ] **`<meta property="og:title">`** (gleich wie title oder leicht variiert):
  - EN: `_____`

- [ ] **`<meta property="og:description">`** (etwas kürzer als description):
  - DE: `Historische Stadtrundgänge und Audioguides in Dornbirn, Feldkirch, Au und Hard. Zeitreisen mit 3D, AR und Zeitzeugeninterviews.`
  - EN: `_____`

- [ ] **`<meta name="twitter:title">`**: gleich wie og:title
- [ ] **`<meta name="twitter:description">`**: gleich wie og:description

### Breadcrumb (JSON-LD ist schon englisch — nur sichtbarer Breadcrumb)

- [ ] **Home-Link Label**:
  - DE: `Startseite`
  - EN: `Home` (Vorschlag — passt zum JSON-LD)

- [ ] **Aktueller Seiten-Label im Breadcrumb**:
  - DE: `i.history - Zeitreisen`
  - EN: `i.history - Travel through time` (Vorschlag — passt zum JSON-LD)

### Page-Header (Hero der Kategorie-Seite)

- [ ] **Subtitle (unter „i.history")**:
  - DE: `Zeitreisen`
  - EN: `Travel through time` (laut Brand-Vokabular, sentence case)

- [ ] **Lead-Paragraph**:
  - DE: `Digitale Stadtrundgänge mit AR, 3D und Audio in Vorarlberg.`
  - EN: `_____`

- [ ] **Story-Headline**:
  - DE: `Historie wird zur Geschichte`
  - EN: `_____`
  - Hinweis: Wortspiel im Deutschen (Historie vs. Geschichte). Direkte
    Übersetzung schwer — vielleicht `From history to story` oder
    `Where history becomes story`?

- [ ] **Story-Body**:
  - DE: `In der Kategorie i.history machen wir Vergangenes an Orten sichtbar, an denen die Ereignisse vor Jahrzehnten oder Jahrhunderten wirklich stattfanden. Hier gibt es keinen Raum für Fiktion: Alle Inhalte basieren auf historischen Quellen, Archivmaterial, der Zusammenarbeit mit Historiker:innen und Zeitzeug:inneninterviews. Die Technologie wird dann zu einem Fenster in die Vergangenheit, um Aufzeichnungen, Akten und Artefakte verständlich und vor allem erlebbar zu machen.`
  - EN: `_____`

### Section-Headlines (3 Sektionen)

- [ ] **`Region Dornbirn`**:
  - EN: `Dornbirn region` oder `Dornbirn area`?

- [ ] **`Au im Bregenzerwald`**:
  - EN: `Au in the Bregenzerwald` (laut Burger-Menu in en/index.html)

- [ ] **`Hard am Bodensee`**:
  - EN: `Hard on Lake Constance` (laut Burger-Menu in en/index.html)

### Card 1: hist.appear

- [ ] **Body 1**:
  - DE: `Im Rundgang hist.appear begibst du dich auf eine Zeitreise durch das historische Dornbirn. Entlang einer interaktiven Karte und eines farblich codierten Zeitstrahls bewegst du dich durch unterschiedliche Epochen, vom Mittelalter bis in die Gegenwart. An den Stationen öffnen sich Inhalte auf deinem Smartphone oder Tablet und verbinden Augmented Reality, Bilder, Audio, Zeitzeug:innenberichte, historische Quellen und den realen Stadtraum zu einem immersiven Geschichtserlebnis.`
  - EN: `_____`

- [ ] **Body 2**:
  - DE: `hist.appear war der erste Rundgang von i.appear und die Initialzündung der Plattform. Das didaktische Konzept basiert auf den wissenschaftlichen Erkenntnissen einer Masterarbeit an der Universität Wien und verbindet aktuelle AR- und VR-Forschung mit Bildungsansätzen. Der Rundgang wurde vom Bundesministerium für Kunst, Kultur, öffentlichen Dienst und Sport gefördert und in Zusammenarbeit mit der Dornbirner Geschichtswerkstatt umgesetzt.`
  - EN: `_____`

- [ ] **Button**:
  - DE: `Zum Rundgang →`
  - EN: `Start the tour →` oder `To the tour →`?

### Card 2: Stadtspuren

- [ ] **Body 1**:
  - DE: `Im Rundgang Stadtspuren entdeckst du entlang der Dornbirner Ach und des Müllerbachs die Industrie- und Stadtgeschichte Dornbirns. Als zweiter historischer Rundgang in i.appear ist Stadtspuren mit hist.appear vernetzt und teilt an manchen Orten Stationen, dort, wo sich Raum, Zeit und Themen überschneiden. Die Stationen sind digital und physisch im Stadtraum verankert, mit Tafeln, Sitzgelegenheiten und Fahrradabstellplätzen. Gestaltet von den Saegenvier.`
  - EN: `_____`

- [ ] **Body 2**:
  - DE: `Pro Station öffnen sich zwei Perspektiven: Industrie und Gesellschaft. Die Route führt meist dem Wasser entlang vom Gütle bis ins Forach, vorbei an historischen Bauwerken, restaurierten Maschinen und lebensgrossen Illustrationen von Nikolay Uzunov. Inhaltlich wurde der Rundgang vom Dornbirner Stadtarchiv ausgearbeitet, insbesondere von Werner Matt und Klaus Fessler. Zum Rundgang ist auch ein gleichnamiges Buch erschienen, das es im Stadtarchiv Dornbirn zu erwerben gibt.`
  - EN: `_____`

- [ ] **Button**: gleich wie Card 1

### Card 3: Frauenspuren

- [ ] **Body 1**:
  - DE: `Ab Mai 2026 erzählt der Rundgang Frauenspuren die Frauengeschichte der letzten 300 Jahre in Dornbirn. An jeder Station begegnest du einer Frau, die stellvertretend für viele andere steht – von der Widerstandskämpferin über die erste Aerztin Vorarlbergs bis hin zur Sozialdemokratin und zur NS-Täterin. So werden sehr unterschiedliche Lebensrealitäten sichtbar.`
  - EN: `_____`

- [ ] **Body 2**:
  - DE: `Die Inhalte basieren auf dem Buch Frauenspuren von Roswitha Fessler aus der Reihe „Dornbirner Schriften". Die porträtierten Frauen sind jeweils mit den Häusern verbunden, vor denen die Stationen platziert sind, und ihre Geschichten werden direkt im Stadtraum verankert. Die Illustrationen stammen von Lisa Althaus, der Audioguide ist auf Deutsch und Englisch verfügbar.`
  - EN: `_____`

- [ ] **Button**: gleich wie Card 1

### Card 4: 125 Jahre – 125 Bilder (Coming Soon)

- [ ] **Image-Placeholder-Label**:
  - DE: `Coming soon`
  - EN: `Coming soon` (bleibt — Anglizismus auch im DE schon)

- [ ] **Body 1**:
  - DE: `2026 feiert Dornbirn sein 125-jähriges Stadterhebungsjubiläum. Im Mai erscheint der Rundgang „125 Jahre – 125 Bilder". Über das gesamte Stadtgebiet verteilt erzählen 125 Bilder Geschichten aus dem Alltag der Menschen und machen sichtbar, wie sich Dornbirn in den letzten 125 Jahren verändert hat.`
  - EN: `_____`

- [ ] **Body 2**:
  - DE: `Im Mittelpunkt stehen Nachbarschaften, Orte und persönliche Perspektiven jenseits der Innenstadt. Du begegnest Geschichten dort, wo du sie vielleicht nicht erwartet hättest, und erfährst, welche Menschen hier gelebt haben und leben und welche Ereignisse die Stadt geprägt haben. Der Rundgang ist mit den anderen i.appear-Rundgängen vernetzt und wird Teil eines wachsenden Netzwerks.`
  - EN: `_____`

- [ ] **Disabled Button**:
  - DE: `Coming soon`
  - EN: `Coming soon` (bleibt)

### Card 5: Barockbaumeister (Au im Bregenzerwald)

- [ ] **Body 1**:
  - DE: `Barockbaumeister Franz Beer führt dich auf einem Spaziergang von Au im Bregenzerwald über Bregenz, Konstanz und Rheinau bis zurück nach Bezau, wo sein Leben vor rund 300 Jahren endete. Als Erzähler begleitet er dich durch den Rundgang und erzählt von seiner Herkunft, seiner Lehrzeit, seinen Reisen und seinem Wirken im Bodenseeraum. So entsteht eine Reise durch Baukultur, Biografien und Orte, die Geschichte persönlich erfahrbar macht.`
  - EN: `_____`
  - Hinweis: „Barockbaumeister" ist Berufstitel + auch Rundgang-Name. Hier
    als Berufstitel verwendet — Vorschlag: `Master baroque builder Franz Beer`?

- [ ] **Body 2**:
  - DE: `Der Rundgang entstand im Rahmen des Forschungsprojekts Digital In&Out. In Zusammenarbeit mit dem vorarlberg museum, der Universität Konstanz, dem Barockbaumeister Museum in Au und dem Fachbereich Gestaltung der Fachhochschule Vorarlberg wurde er als Vermittlungskontext entwickelt.`
  - EN: `_____`

- [ ] **Button**: gleich wie Card 1

### Card 6: See Runde (Hard am Bodensee)

- [ ] **Body 1**:
  - DE: `In der See Runde in Hard begibst du dich entlang des Bodenseeufers auf eine Reise durch die letzten zwei Jahrhunderte der Gemeinde. Acht Stationen führen durch den Ort, ergänzt durch unsichtbare Stationen, die erst in deiner Nähe sichtbar werden. Erzählt wird vom ehemaligen Armenhaus mit Gehöft, vom Alltag der Aermsten, von Geburtenstation und Sezierhaus – begleitet vom Strassenkehrer Fiffi, einem echten Harder Original.`
  - EN: `_____`

- [ ] **Body 2**:
  - DE: `Die See Runde verbindet reale Schauplätze mit digitalen Erzählungen und macht lokale Geschichte im Stadtraum erfahrbar. Entstanden ist ein Rundgang, der Vergangenheit und Gegenwart zusammenführt und zeigt, wie Erinnerung lebendig bleibt – generationenübergreifend und nah an den Menschen.`
  - EN: `_____`

- [ ] **Button**: gleich wie Card 1

### CTA (unten)

- [ ] **CTA-Button**:
  - DE: `Eigenen Rundgang anfragen →`
  - EN: `_____`
  - Vorschlag: `Request your own tour →` oder `Get your own tour →`?

---

## Layout-Risiko-Stellen für Privat-Tab-Check

Englische Sätze sind oft länger oder kürzer als deutsche — folgende Stellen
nach dem Einbau visuell verifizieren:

- **Page-Header-Story-Body**: 4 Sätze, dichter Text — englischer Satzbau kann
  je nachdem ~5-15 % länger werden, der Story-Box-Container hat eine feste
  Spaltenbreite.
- **Card-Bodies**: 5 Cards mit je 2 langen Paragraphen — Card-Höhe in einem
  `grid-2` ist gleich für alle Geschwister, längster Text definiert die Höhe.
  Falls eine Karte (z.B. hist.appear) deutlich länger wird, wachsen alle mit.
- **Button-Text** (`Zum Rundgang`): falls EN länger als DE, prüfen ob die
  Button-Padding noch passt.

## Nach dem Einbau

- `python build.py` (sollte hier nichts tun, weil weder Vitrine-Marker noch
  Rundgang-Counts auf der Seite sind — aber zur Sicherheit)
- Sitemap ist schon erweitert (Phase 2 dieser Pilot-Iteration)
- Cache-Bust **nicht** hochziehen (reine HTML-Edits — siehe Konvention in
  `_doku/sessions/2026-05-06-session-29-englisch-pilot-uebersetzung.md`)
- Privat-Tab: `iappear.at/en/i-history.html` — Layout, Sprachschalter, Burger
- DE-Schwester: `iappear.at/i-history.html` → Sprachschalter EN klickbar
