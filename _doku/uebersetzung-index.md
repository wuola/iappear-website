# Übersetzungs-Liste – `index.html` (Pilot-Seite)

> Diese Liste ist für die **separate Übersetzungs-Claude-Session** gedacht.
> Workflow: Maggy nimmt diese Datei in eine andere Claude-Session, lässt
> alle Strings übersetzen, prüft den Tonfall, kommt mit ausgefüllter Liste
> zurück. Code-Session (diese hier) setzt die Übersetzungen dann in
> `en/index.html` ein und ersetzt alle `[EN] …`-Marker.

## Brand-Vokabular (vorläufig — bitte in Übersetzungs-Session präzisieren)

Diese Begriffe werden öfter vorkommen — bitte einmalig konsistent festlegen,
dann in allen Strings verwenden:

| DE | EN (Vorschlag) | EN (final, in Session bestätigen) |
|---|---|---|
| Stadtrundgang | walking tour / city tour | _____ |
| Audioguide | audio guide | _____ |
| Rundgang | tour | _____ |
| Station | stop / point of interest | _____ |
| Vitrine | showcase | _____ |
| Erlebnis | experience | _____ |
| Regionale Identität | regional identity | _____ |
| Zeitreise | time travel | _____ |
| Medienbildung | media literacy / digital education | _____ |
| Geschichten erzählen | storytelling | _____ |
| Schüler:innen | students / pupils | _____ |
| Stadtarchiv | city archive | _____ |

**Nicht übersetzen** (Marken/Eigennamen):
`i.appear`, `i.history`, `i.dentity`, `i.grow`,
`Marilena Tumler`, `Maggy Haidacher`,
`Dornbirn`, `Feldkirch`, `Bregenz`, `Vorarlberg`, `Bodensee`,
`Hard`, `Au`, `Bregenzerwald`,
`Smart City Dornbirn`, `Innovation Call Vorarlberg`, `Ars Electronica`,
`Ehrung VN „Köpfe von morgen"`,
`Universität Wien`, alle Partnerlogos (Stadt-/Behördennamen).

---

## Strings für `en/index.html`

Alle Strings sind im File mit dem Marker-Prefix `[EN]` versehen. Wenn Übersetzung
zurück, einfach `[EN] <deutsch>` durch englische Variante ersetzen.

### Meta-Tags (Head)

- [ ] **`<title>`**:
  - DE: `i.appear - Digitale Stadtrundgänge & Audioguides in Vorarlberg`
  - EN: `_____`
  - Hinweis: max ~60 Zeichen für Suchergebnisse, "i.appear" muss vorkommen.

- [ ] **`<meta name="description">`** (70–160 Zeichen):
  - DE: `i.appear — digitale Stadtrundgänge und Audioguides in Dornbirn, Feldkirch, Bregenz und ganz Vorarlberg. Mit 3D, AR und Video, ohne App-Download.`
  - EN: `_____`
  - **Achtung Konvention** (siehe CLAUDE.md): wenn Anführungszeichen im Wert
    vorkommen, **immer `&quot;`** verwenden, niemals `"` direkt.

- [ ] **`<meta property="og:title">`** (gleicher Inhalt wie title oder Variante):
  - EN: `_____`

- [ ] **`<meta property="og:description">`**:
  - DE: `Digitale Stadtrundgänge, Audioguides und multimediale Touren in Dornbirn, Feldkirch, Bregenz und ganz Vorarlberg. Mit 3D, AR und Video - ohne App-Download.`
  - EN: `_____`

- [ ] **JSON-LD `WebSite.name`**:
  - EN: `_____`

- [ ] **JSON-LD `WebSite.description`**: gleich wie og:description

### Navigation (Top-Nav)

- [ ] `Stadtrundgänge` → `_____`
- [ ] `Features` → `Features` (bleibt vermutlich)
- [ ] `Leistungen` → `_____` (Vorschlag: `Services`)
- [ ] `Über uns` → `_____` (Vorschlag: `About`)
- [ ] `Vitrine` → `_____` (Vorschlag: `Showcase`)
- [ ] `Menü öffnen` (aria-label) → `Open menu`
- [ ] `Menü` (aria-label dialog) → `Menu`
- [ ] `Menü schliessen` → `Close menu`
- [ ] `Hauptnavigation` (aria-label) → `Main navigation`
- [ ] `i.appear Startseite` (aria-label) → `_____`

### Burger-Menü (3 Gruppen)

**Gruppe „Die Plattform":**
- [ ] `Die Plattform` → `_____` (Vorschlag: `The Platform`)
- [ ] `i.appear User Guide` → bleibt
- [ ] `i.history – Zeitreisen` → `i.history – _____`
- [ ] `i.dentity – Regionale Identität` → `i.dentity – _____`
- [ ] `i.grow – Medienbildung` → `i.grow – _____`
- [ ] `Features` → `Features`

**Gruppe „Stadtrundgänge":**
- [ ] `Stadtrundgänge` (Heading) → `_____`
- [ ] `Alle Orte` → `_____`
- [ ] `Hard am Bodensee` → `_____` (vermutlich: `Hard on Lake Constance`)
- [ ] `Au im Bregenzerwald` → `_____` (vermutlich: `Au in the Bregenzerwald`)

**Gruppe „Backstage":**
- [ ] `Backstage` → `Backstage` (bleibt?)
- [ ] `Workflow und Leistungen` → `_____`
- [ ] `Vitrine` → wie oben
- [ ] `Über uns` → wie oben
- [ ] `Kontakt` → `Contact`
- [ ] `FAQs` → `FAQs`
- [ ] `AGB` → `Terms (in German)` (Rechtstext bleibt deutsch — Hinweis im Footer)
- [ ] `Impressum` → `Imprint (in German)`
- [ ] `Datenschutz` → `Privacy (in German)`

### Hero-Bereich

- [ ] **Claim**: `Die Plattform` / `für digitale Erlebnisse`
  - EN Zeile 1: `_____`
  - EN Zeile 2: `_____`
  - Hinweis: zwei Zeilen, beide ungefähr gleich lang. Vorschlag: `The Platform / for digital experiences`.

- [ ] `Lorbeerkranz mit Auszeichnungen` (SVG-`<title>`, sr-only):
  - EN: `Laurel wreath with awards`

- [ ] `Auszeichnungen` (aria-label rotator): → `Awards`

- [ ] **Awards** (3 Stück, je `<br/>` + Jahr — Jahr bleibt):
  - `Smart City Dornbirn` → bleibt (Eigenname Auszeichnung)
  - `Innovation Call Vorarlberg` → bleibt
  - `Digitale Innovationen im Tourismus` → `_____` (Vorschlag: `Digital Innovations in Tourism`)

- [ ] **CTA-Button**: `Rundgang starten` → `_____` (Vorschlag: `Start a tour`)

- [ ] `Kategorien` (Mobile-Label) → `Categories`

- [ ] **Cat-Links** (rechte Spalte, je Logo + Headline + Sub):
  - `i.history / Zeitreisen` → `i.history / _____`
  - `i.dentity / Regionale Identität` → `i.dentity / _____`
  - `i.grow / Medienbildung` → `i.grow / _____`

### Sektion „Netzwerk / Über uns"

- [ ] **H2**: `Ein Netzwerk aus digitalen Stadtrundgängen` → `_____`
- [ ] **Eyebrow**: `Geschichtenerzählen ist der Kern unserer Arbeit.` → `_____`
- [ ] **Absatz 1**: `i.appear macht Orte, Geschichte und regionale Identität digital erlebbar. Unsere digitalen Stadtrundgänge und Audioguides verbinden Text, Audio, Video, Bilder, 3D-Modelle und Augmented Reality zu einem durchgängigen Erlebnis – direkt am Ort, in Dornbirn, Feldkirch, Bregenz und ganz Vorarlberg.` → `_____`
- [ ] **Absatz 2** (mit `<strong>` am Anfang): `Ohne App-Download, ohne Registrierung, ohne Werbung. Jeder Stadtrundgang läuft sofort im Browser – auf dem eigenen Smartphone.` → `_____`
- [ ] **H3**: `Was macht i.appear besonders?` → `_____`
- [ ] **Absatz 3**: `Wir denken Geschichten radikal vom Ort und vom Publikum her. Jeder Rundgang entsteht als Zusammenarbeit zwischen Expert*innen, Gestalter*innen und Menschen vor Ort. Das Ergebnis: Inhalte, die berühren, informieren und Lust auf mehr machen.` → `_____`
- [ ] **Netzwerk-Caption**: `Netzwerk Dornbirn` → `Network Dornbirn`
- [ ] **Netzwerk aria-label**: `Netzwerk der Rundgänge` → `Network of tours`

### Sektion „3 Kategorien"

- [ ] **H2**: `Drei Kategorien, ein Ziel` → `_____`
- [ ] **Eyebrow**: `Jeder Rundgang gehört zu einer Kategorie` → `_____`

- [ ] **i.history Card**:
  - Eyebrow: `Zeitreisen` → `_____`
  - Body: `Vergangenes sichtbar machen – an den Orten, an denen es wirklich passiert ist. Basierend auf Archivmaterial, Zeitzeug:inneninterviews und wissenschaftlichen Quellen.` → `_____`
  - Button: `Mehr erfahren →` → `Learn more →`

- [ ] **i.dentity Card**:
  - Eyebrow: `Regionale Identität` → `_____`
  - Body: `Die Identität eines Ortes digital entdecken: Kultur, Tourismus und regionale Besonderheiten – immersiv, interaktiv und direkt vor Ort. Geschichten, die eine Region einzigartig machen, erlebbar für Einheimische und Gäste.` → `_____`
  - Button: `Mehr erfahren →`

- [ ] **i.grow Card**:
  - Eyebrow: `Medienbildung` → `_____`
  - Body: `Schüler:innen werden zu Gestalter:innen: Medienkompetenz, Demokratiebildung und digitales Storytelling in Workshops und eigenen Stadtrundgängen – lebendige Bildung direkt im öffentlichen Raum.` → `_____`
  - Button: `Mehr erfahren →`

### Sektion „14 Features Teaser"

- [ ] **H2**: `14 multimediale Features` → `_____` (Vorschlag: `14 multimedia features`)
- [ ] **Eyebrow**: `Die Bausteine unserer Stadtrundgänge` → `_____`
- [ ] **3D-Modelle** Headline + Body:
  - `3D-Modelle` → `3D models`
  - `Dreidimensionale Objekte, die sich im Raum betrachten lassen – massgefertigt für jedes Projekt.` → `_____`
- [ ] **Augmented Reality**:
  - Body: `Sie brauchen es sich nicht vorstellen. Es taucht direkt auf Ihrem Display auf.` → `_____`
- [ ] **Audio-Guide**:
  - `Audio-Guide` → `Audio guide`
  - Body: `Professionelle Audio-Erstellung mit ausgewählten Speakern in Studioqualität.` → `_____`
- [ ] **Secret Stations**:
  - Body: `Geheime Orte entdecken, die nirgendwo sonst aufscheinen – ein besonderes Entdeckungserlebnis.` → `_____`
- [ ] **Button**: `Alle 14 Features ansehen →` → `_____`

### Sektion „Stadtrundgänge in Vorarlberg" (Teaser)

- [ ] **H2**: `Stadtrundgänge in Vorarlberg` → `_____`
- [ ] **Eyebrow**: `Entdecke unsere digitalen Touren und Audioguides` → `_____`
- [ ] **Dornbirn-Caption**: `10 Stadtrundgänge & Audioguides` → `_____`
- [ ] **Feldkirch-Caption**: `Schulprojekte & Bombenabwürfe 1943` → `_____`
- [ ] **Hard-Caption**: `Die See Runde am Bodensee` → `_____`
- [ ] **Au-Caption**: `Barockbaumeister im Bregenzerwald` → `_____`
- [ ] **Button**: `Alle Orte & Karte ansehen →` → `_____`

### Sektion „Vitrine Teaser"

- [ ] **H2**: `Vitrine` → `_____` (Vorschlag: `Showcase`)
- [ ] **Eyebrow**: `Auszeichnungen, Presse, Artikel und Referenzen` → `_____`
- [ ] **Card 1 (Smart City Dornbirn)**:
  - Headline: `Smart City Dornbirn` → bleibt
  - Sub: `Siegerprojekt 2022` → `Winning project 2022`
  - alt-Text: `Smart City Dornbirn Preis 2022` → `Smart City Dornbirn award 2022`
- [ ] **Card 2 (Ars Electronica)**:
  - Sub: `Ausstellung 2021 & 2022` → `Exhibition 2021 & 2022`
  - alt-Text: `Ars Electronica Ausstellung` → `Ars Electronica exhibition`
- [ ] **Card 3 (Innovation Call)**:
  - Headline: `Innovation Call`
  - Sub: `Digitale Innovationen im Tourismus 2025` → `_____`
  - alt-Text: `Innovation Call Tourismus 2025` → `_____`
- [ ] **Card 4 (Köpfe von morgen)**:
  - Headline: `VN „Köpfe von morgen"` → bleibt? (Eigenname VN-Auszeichnung) — alternativ: `VN „Köpfe von morgen" (Heads of Tomorrow)`
  - Sub: `Ehrung für Marilena Tumler` → `Honor for Marilena Tumler`
  - alt-Text: `VN Köpfe von morgen` → `_____`
- [ ] **Button**: `Zur Vitrine →` → `_____`

### Sektion „Team / Über uns"

- [ ] **H2**: `Das Team` → `The Team`
- [ ] **Eyebrow** (italic): `Eine Historikerin und ein Computerzwerg gehen in eine Bar…` → `_____`
- [ ] **Button 1**: `Über uns →` → `About us →`
- [ ] **Button 2**: `Kontakt →` → `Contact →`

### Footer

- [ ] **Heading**: `Partner und Fördergeber` → `_____` (Vorschlag: `Partners and Sponsors`)
- [ ] **Uniwien-Text**: `Entwickelt im Rahmen einer Masterarbeit an der Universität Wien.` → `_____`
- [ ] **aria-label**: `Rechtliches` → `Legal`
- [ ] **Footer-Links**: Kontakt / FAQs / Impressum / Datenschutz / AGB
  - Kontakt → Contact
  - Impressum → `Imprint (in German)` ← Hinweis bleibt deutsch
  - Datenschutz → `Privacy (in German)`
  - AGB → `Terms (in German)`
- [ ] **back-up-Button** (aria-label): `Nach oben` → `Back to top`

---

## Nach der Übersetzung — Workflow

1. Maggy bringt diese Liste ausgefüllt zurück.
2. Code-Session sucht in `en/index.html` nach jedem `[EN]` und ersetzt mit der finalen englischen Version.
3. Layout-Check: längere englische Sätze (z.B. „Regionale Identität" → „Regional identity") brechen evtl. das Hero-Layout — visuell prüfen.
4. Cache-Bust auf alle relevanten CSS/JS-Dateien synchron hochziehen, falls Änderungen am Stylesheet nötig wurden.
5. Sitemap.xml: `<url><loc>https://iappear.at/en/index.html</loc>...</url>` mit hreflang-Annotation ergänzen.
6. `llms.txt`: englische Sektion nachziehen.
7. Push, in Privat-Tab live testen.
