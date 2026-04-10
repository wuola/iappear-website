# Readymag Editor Recon — Startseite

Quelle: https://my.readymag.com/edit/6267960/contents/ (Copy: "(Copy) i.appear für claude!")
Methode: DOM-Query aller `[data-id]`-Elemente im Editor, sortiert nach Y/X-Koordinaten.
Datum: 2026-04-10

## Widget-Inventar (iframes auf der Startseite = 23)

| iframe | Typ | ID | Notizen |
|---|---|---|---|
| 0 | Code-Widget | — | Global CSS: `cursor: default`, `user-select: none` |
| 1 | Code-Widget | — | `.feature-content` Snappy Transition CSS |
| 2 | leer | — | — |
| 3 | SVG | `i-appear-kranz-v4` | Lorbeerkranz, 11193 bytes, 2 paths, 1 g, opacity 0.4, stroke #FFFFFF |
| 4 | SVG | — | 2560 bytes, 2 gs (vermutlich i.appear Serif Logo) |
| 5 | SVG | — | 1478 bytes, 4 texts (vermutlich Award-Textblock?) |
| 6 | SVG | — | 567 bytes, 1 text, 2 paths |
| 7 | SVG | `vorarlberg-final` | 3030 bytes, 8 paths — Vorarlberg Partner-Logo |
| 8 | SVG | `dornbirn-logo` | 2343 bytes, 7 paths, 4 gs — Dornbirn Partner-Logo |
| 9–14 | SVG | — | 6× identisch, 224 bytes, 1 path — Target-Icons (Kategorien) |
| 15 | Code-Widget | — | [BLOCKED] CSS |
| 16 | Code-Widget | — | CSS für Burger-Menü (`[data-id=...]` Listen) |
| 17 | SVG | — | 955 bytes, 2 paths — wahrscheinlich Pfeil/Arrow |
| 18 | Code-Widget | — | 4761 chars |
| 19 | SVG | — | 955 bytes — Kopie von 17 |
| 20 | Code-Widget | — | 4761 chars (identisch zu 18?) |
| 21 | Code-Widget | — | Burger-Menü CSS mit "I.APPEAR USER GUIDE" extra-id |
| 22 | SVG | — | 1208 bytes, 2 paths |
| 23 | leer | — | blank iframe |

## 1. Navigation (sticky, oben)

Top-Nav Links (y=12):
- **features** (x=214)
- **kategorien** (x=306)
- **leistungen** (x=412)
- **über uns** (x=516)
- **kontakt** (x=606)
- **vitrine** (x=695)
- **User guide** (x=774)
- Burger-Icon rechts (x=981)

Invisible Duplikate (vermutlich Hover/Nav-States, y=8):
- Über uns, i.appear Guide, Unsere Formate, Workflow und Leistungen, AGBs und Datenschutz, Kontakt, Impressum

## 2. Burger-Menü (rechte Overlay-Spalte)

**DIE PLATTFORM** (y≈123)
- i.appeAr USER Guide
- Unsere kategorien
- FEATURES

**BACKSTAGE** (y≈249)
- Workflow und Leistungen
- VITRINE
- Über uns
- Kontakt
- AGBs
- Impressum
- Datenschutz

**Sprachumschalter** (y=476): `English / Deutsch` bzw. `EN / DE`

## 3. Hero-Sektion

**Claim oben links** (y=22):
> "Erlebe deine Region in der Augmented Reality.
> Lass dich von immersiven Geschichten begeistern und tauche in verborgene Welten ein."

**Social** (y=27, oben rechts): Instagram · Facebook

**Logo-Bild** (y=87, Mitte): `IA22-Logo-gross-schwarz` (Picture-Block)

**Hero-Titel** (y=160, Mitte): `i.appear digital city tours` (einzelner Text-Block — nicht zwei Texte übereinander!)

**Kategorie-Links rechts vom Hero** (y=303–395):
- ZEITREISEN (y=303, x=802)
- ERLEBNISSE (y=350, x=802)
- MEDIENBILDUNG (y=395, x=802)

**Awards — Texte auf dem Lorbeerkranz (links, y≈305–323):**
- `"Digitale Innovationen im Tourismus 2025"` (y=305, x=121)
- `"Smart City Dornbirn 2022"` (y=322, x=133)
- `"Innovation Call Vorarlberg 2025"` (y=323, x=115)

## 4. Netzwerk-Sektion "Ein Netzwerk aus Digitalen Geschichten"

**Titel** (y=731, x=60): `Ein Netzwerk aus Digitalen Geschichten`

**Intro-Paragraph 1** (y=873, Spalte links):
> "Geschichtenerzählen ist der Kern unserer Arbeit. Mit i.appear in der Tasche spaziert ihr durch Städte, Gemeinden, Landschaften und dabei werden euch Ge…" (abgeschnitten)

**Zentrum-Label** (y=1073): `Beispiel Dornbirn`

**Netzwerk-Knoten** (Kacheln mit Namen um das Zentrum):
- OberdorfEntdecken (y=920, x=575) — COMING SOON
- Stadtspuren (y=989, x=370)
- hist.appear (y=1080, x=740)
- 125 Jahre / 125 Bilder (y=1217, x=393) — COMING SOON (y=1183)
- InnenstadtErleben (y=1252, x=555) — COMING SOON (y=1226)
- Frauenspuren (y=1271, x=858) — COMING SOON (y=1228)
- BuntesDornbirn (y=1367, x=667)

**Intro-Paragraph 2** (y=1056):
> "Ohne App-Download, ohne Registrierung, ohne Werbung. Mit einer Web-App, die mittlerweile so viele Geschichten zu erzählen hat, dass immer mehr Rundgäng…"

**Intro-Paragraph 3** (y=1337):
> "Was macht i.appear besonders? Diesen Erzählstrang begleiten noch viele weitere Medien, wodurch die Geschichte immer mehr angereichert wird. So entsteht…"

**back up Link** (y=1619)

## 5. Kategorien-Sektion

**Titel** (y=1718): `Kategorien`

**3 Spalten** (y=1824):
- **i.history** — Zeitreisen — "Historie wird zur Geschichte. In der Kategorie i.history machen wir Vergangenes an Orten sichtbar, an denen die Ereignisse vor Jahrzehnten oder Jahrhunde…"
- **i.dentity** — Regionale Erlebnisse — "Kultur, Tourismus, Wirtschaft. Die Kategorie i.dentity öffnet den Blick für die Identität eines Ortes. Diese Kategorie bündelt Rundgänge, die Kultur, Fr…"
- **i.grow** — Medienbildung — "Vom Konsumieren zum Gestalten. Mit i.grow werden Schüler:innen zu Gestalter:innen ihrer Lerninhalte. In Workshops erleben sie Themen in ihrem eigenen Le…"

## 6. Features-Sektion

**Titel** (y=2374): `FEATURES`
**Untertitel** (y=2428): `Multimediale Inhalte für immersives Erleben`

**Feature-Labels links** (x=136, y=2529–2843):
1. 3D-Modelle (y=2529)
2. Augmented Reality (y=2552)
3. 360° Video in VR (y=2574)
4. Animationen (y=2597)
5. Interaktive Karten (y=2621)
6. Audio-Guide (y=2645)
7. Historische Bilder (y=2668)
8. Quiz-Funktion (y=2692)
9. [BLOCKED — wahrscheinlich Zeitzeug:innen-Interviews] (y=2715)
10. Videos (y=2738)
11. Secret Stations (y=2761)
12. Emotionale Geschichten (y=2790)
13. Bewegte Fotos (y=2817)
14. Vorher-Nachher-Ansichten (y=2843)

**Feature-Beschreibungen** (rechts, x=717) — jeweils mit Titel-Zeile:

| Feature | Titel-Zeile | Beschreibung |
|---|---|---|
| 3D-Modelle | "Maßanfertigungen oder frei nach Wunsch" | — |
| Augmented Reality | "Sie brauchen es sich nicht vorstellen. Es taucht direkt auf ihrem Display auf." | — |
| 360° Video in VR | "Haben Sie schon einmal einen Glockenturm von innen gesehen? Sie stehen mitten im Geschehen und erleben Orte, die sonst unzugänglich sind." | — |
| Animationen | "Wir bewegen Inhalte, die dich bewegen." | — |
| Interaktive Karten | "Komplexe Verändungen auf einem Blick" oder "Unsere Umgebung verändert sich mit der Zeit. Dies lässt sich auf Karten abbilden. Die Interaktion mit der Karte lässt den User diese Veränderungen live miterleben." | — |
| Audio-Guide | "Für ein kurzes Geräusch oder einen Podcast mit vielen Folgen. Professionelle Audio-Erstellung mit ausgewählten Speakern in Studioqualität." | — |
| Historische Bilder | "Wir graben tief in alten Dachböden, Archiven und privaten Sammlungen um authentische Abbildungen Orte und Artefakte der Geschichte digital konservieren zu können." | — |
| Quiz-Funktion | "Festige dein Wissen mit unserem Quiz. Oder überprüfe deine Begleiter:innen, ob sie auch gut aufgepasst haben. In den Fragen und in den Antworten können Bilder und sogar Videos integriert werden." | — |
| Zeitzeug:innen-Interviews | "Der Harry Potter Effekt" / "Manche Ereignisse kann man erst begreifen, wenn sie aus einer emotional erlebten Perspektive erzählt werden. Wir produzieren Interviews in Studioqualität." | — |
| Videos | "Professionelles Storytelling das den Rezipienten an der Hand nimmt und ihn in neue Welten führt." | Beispiel: "Lass dich von Franz Beer, dem Barockbaumeister aus dem Bregenzerwald durch seine eigene Geschichte von Au, über Konstanz bis Rheinau in der Schweiz führen." |
| Secret Stations | "Für ein besonderes Entdeckungserlebnis können geheime Orte endeckt werden, die nirgendwo sonst aufscheinen" | — |
| Emotionale Geschichten | (Interview-Titel: "Der Harry Potter Effekt") | — |
| Bewegte Fotos | "Die lebendigeren Bilder" / "Mit künstlicher Intelligenz werden statische Fotos in bewegte Geschichten verwandelt." | — |
| Vorher-Nachher-Ansichten | "Ändere deine Perspektive über einen Schieberegler. Wie sah es hier früher aus? Was war denn dort einmal? Wie hat sich die Umgebung verändert?" | — |
| Historische Bilder (Zusatz) | "1943 wurden Bomben auf Feldkirch geworfen - die Flugroute der Bomber wurde auf einer Skizze festgehalten. Wir haben dieses Ergeignis virtuell nachgebaut, um die Vergangenheit besser begreifbar zu mach…" | — |

## 7. Vitrine-Sektion

**Titel** (y=3199, x=60): `VITRINE`
**Untertitel** (y=3255): `Projekte die uns stolz machen`

**14 Vitrine-Kacheln** (4 Spalten × ~4 Reihen):

**Reihe 1 (y≈3514):**
1. (x=107) "Ein wunderschönes Portrait vom askd:Magazin über Marilena Tumler"
2. (x=324) "2022 wurden die Rundgänge Brigantium und Barochbaumeister auf der ARS ausgestellt."
3. (x=542) "Marilena erhiehlt 2022 den Smart City Dornbirn Preis mit dem Siegerprojekt i.appear"
4. (x=760) "Ars Electronica 2021 Garden Vorarlberg: Hist.appear auf dem Symposium im vorarlberg museum."

**Reihe 2 (y≈3803):**
5. (x=107) "Ein Beitrag über das Projekt Digital In&Out in Kooperation mit dem vorarlberg museum."
6. (x=324) "Wir haben uns beworben und gewonnen! Herzlichen Dank an die Jury! Das Preisgeld wurde in das Re-Design von i.appear gesteckt."
7. (x=542) "i.appear erobert die Klassenräume in Vorarlberg: Medienbildung und Medienethik"
8. (x=763) "Vortrag und Publikation auf der internationalen Konferenz 'The Future of Education' in Florenz 2023."

**Reihe 3 (y≈4091):**
9. (x=106) "Video-Beitrag des ORF Vorarlberg über i.appear im Schulunterricht inklusive Rundgang in der Stadt."
10. (x=324) "Zusätzlich zum Innovation-Call-Preis erhielt i.appear die Auszeichnung 'Digitale Innovatinen im Tourismus! Juhu!"
11. (x=542) "Ehrung der VN: Marilena ist als eine der 'Köpfe von morgen' geehrt worden. Eine sehr coole Auszeichnung!"
12. (x=753) "Ein tolles Portrait über Marilena Tumler als Pionierin in der Technik. Großes Danke an die Marke Vorarlberg."

**Reihe 4 (y≈4384):**
13. (x=105) "Buch- und App-Präsentation zum Thema Bombenabwürfe 1943 in Feldkirch. Ein Schulprojekt in i.grow."
14. (x=318) "Masters Thesis zur verwendung immersiver Lernwelten im Ethikunterricht: i.appear als Fallbeispiel"
15. (x=550) "Masters Thesis in Geschichte: Die wissenschaftlich fundierte Seite von i.appear"
16. (x=759) "Ein VN-Artikel zum Schüler:innen-Projekt i.grow in Feldkirch (Ein Oktobertag). Die VN hat uns begleitet!"

**Reihe 5 (y≈4672):**
17. (x=106) "Eine coole Möglichkeit um den i.appear Entwicklungsprozess mit UX-Redesign aufzuarbeiten"
18. (x=324) "Einer der ersten Artikel über i.appear aus 2022. Seither ist viel passiert. Auf der Welt und mit dem App auch."
19. (x=536) "Wir sind stolz, dass der App-Rundgang Stadtspuren Teil des Siegerprojektes des ISTD war. Glückwunsch an Sägenvier!"
20. (x=756) "In Bludenz referierte Marilena Tumler über die Schnittstelle zwischen Lehre, Unternehmer:innentum und Wertekultur - 'gen Z'"

**Reihe 6 (y≈4958):**
21. (x=106) "Ein tolles Format: Die Schafferei bietet interessierten Personen ein Mittagessen mit deinem Traumjob an."
22. (x=324) "Podiumsdiskussion: Digitale Kompetenzen im Spannungsfeld zwischen Kinderschutz und Künstlicher Intelligenz"

Das sind **22 Kacheln**, nicht 14 wie bisher angenommen! Jede mit `-zum Artikel-` Link darunter.

## 8. Über uns-Sektion

**Titel** (y=5119): `Über UNS`

**Marilena Tumler** (y=5226):
> "Geschäftsführung, Inhaltliche Leitung, UX/UI-Design und Content Creation
> Marilena garantiert die inhaltliche Tiefe unserer Projekte. Als studierte Historikerin, Philosophin und Medienethikerin weiß sie…"

**Maggy Haidacher** (y=5458):
> "3D-Artist, Kartographie, Webdesign, Animation und AR
> Maggy ist die Schnittstelle zwischen Landkarte und digitalem Erlebnis. Ihr geographisches Fachwissen und der Fokus auf digitale Kartographie bilden…"

**Kontaktformular** rechts (y=5331–5355): Feld + `info@iappear.app` + `Absenden`-Button

## 9. Footer

**Spalten-Titel** (y=5765): `Quicklinks` (x=64) · `Partner und Fördergeber` (x=282)

**3 Spalten Quicklinks** (x=292, x=480, x=705):

Spalte 1 (x=292):
- HOME
- vitrine
- i.appear USER Guide
- Unsere KATEGORIEN
- Workflow und Leistungen

Spalte 2 (x=480):
- i.history - Zeitreisen
- i.dentity - Regionale Erlebnisse
- i.grow - Medienbildung

Spalte 3 (x=705):
- FAQs
- KONTAKT
- AGB
- Impressum
- Datenschutz

**BRING ME BACK UP** Link (x=878, y=5820)

**Kontakt-Block** (x=28, y=5973):
> "i.appear - digital city tours
> Marilena Tumler e.U.
> Mozartstraße 5 | 16
> 6850 Dornbirn
> +43 676 82554212
> info@iappear.app
> iappear.at"

**Uni-Wien-Hinweis** (x=777, y=6039):
> "Entwickelt im Rahmen einer Masterarbeit an der Universität Wien"

**Partner-Logos** (y≈6087–6150): Inline-SVGs mit style-Elements (cls-1 etc.) — mehrere Partner-Logos als code-snippets

**Copyright** (y=6270): `© 2026 i.appear - digital city tours`

## Wichtige Korrekturen gegenüber aktuellem Repo

1. **Burger-Menü Struktur**: DIE PLATTFORM / BACKSTAGE Aufteilung — aktuell als flache Liste im Repo
2. **Vitrine**: **22 Kacheln** (nicht 14!) — Repo hat aktuell 14
3. **Hero**: Hero-Titel ist **ein** Text-Block "i.appear digital city tours" (nicht zwei Zeilen)
4. **Hero-Bild**: `IA22-Logo-gross-schwarz` als Picture-Block (nicht Serif-Text!) — das ist vermutlich das Logo auf schwarzem Hintergrund als PNG/SVG
5. **Awards**: 3 Awards ("Digitale Innovationen im Tourismus 2025", "Smart City Dornbirn 2022", "Innovation Call Vorarlberg 2025") auf einem einzelnen Lorbeerkranz LINKS
6. **Kategorie-Links rechts**: 3 kleine Links "ZEITREISEN / ERLEBNISSE / MEDIENBILDUNG" rechts vom Hero (nicht unten als Cards)
7. **Netzwerk-Zentrum**: Label `Beispiel Dornbirn` (klein geschrieben, nicht "Beispiel Dornbirn")
8. **Features**: 14 Features in 2 Spalten mit detaillierten Beschreibungen (Titel + Text)
9. **Social-Icons Hero**: Instagram + Facebook oben rechts
10. **Footer-Quicklinks**: 3-Spalten-Struktur mit spezifischer Aufteilung wie oben
