# Mini-Karten-TODOs

Gesammelte Auffälligkeiten beim Ausrollen der Mini-Karten auf alle Rundgänge.
Diese Punkte werden NICHT automatisch gefixt — Maggy entscheidet später was sinnvoll ist.

Stand: 2026-04-29 (Session 14, beim Ausrollen der Mini-Karten)

---

## Stationen mit Default-Koordinaten (übereinander auf der Karte)

Drei Stationen in **hist.appear** liegen alle auf 47.414141 / 9.740922:
- "Die Wurzeln Dornbirns"
- "Vertiefung Turteltaub"
- "Vertiefung Zeitzeugen"

Folge: auf der Mini-Karte sieht man dort nur EINEN Marker statt drei (drei perfekt aufeinander).
In der Storyblok-Koordinaten-MD bereits mit ⚠ markiert.

**Was tun?** Echte Koordinaten in Storyblok eintragen, dann Daten neu ziehen.

---

## Doppelte Koordinaten innerhalb desselben Rundgangs

**See Runde (Hard):**
- "Gedenkstein Sanierung" und "Würfelturm" — beide exakt auf 47.4943502 / 9.688513
- "Gert Hoor" existiert zweimal (anderer Name? Datenfehler? Zwei verschiedene Stations mit identischem Stations-Namen)

**Was tun?** Im Storyblok prüfen ob das absichtlich ist (z.B. Vertiefungs-Station) oder ein Fehler.

---

## Stationen weit ausserhalb des Hauptgebiets

**Frauenspuren (Dornbirn):**
- Station 1 "Überblick" liegt auf 47.389988 / 9.777290 — das ist im **Gütle**, weit ausserhalb der Innenstadt
- Die anderen 9 Stationen sind alle im Innenstadt-Bereich
- Folge: Mini-Karte zoomt auto auf die Bounding Box → die ganze Karte wird sehr weit, Innenstadt-Stations clustern in einem kleinen Bereich oben

**Was tun?** Entweder Station 1 echte Koordinate in der Innenstadt geben, oder bei der Karten-Darstellung Station 1 ausnehmen.

**Barockbaumeister (Au):**
Die 6 Stationen verteilen sich extrem weit:
- 47.32 / 9.99 (Au)
- 47.36 / 9.93
- 47.50 / 9.74
- 47.64 / 8.60 (Schweiz!)
- 47.66 / 9.17
- Folge: die Mini-Karte zeigt das halbe Vorarlberg + Teile der Schweiz, lokale Aussagekraft = null

**Was tun?** Ist möglicherweise gewollt (Franz Beer hat ja in der ganzen Bodensee-Region und der Schweiz gebaut). Eventuell auf der Karte einen "Hauptort" Au stark betonen und die anderen als kleinere Punkte. Oder eigene Karten-Variante mit Mini-Pfeilen "weiter weg".

---

## Mapping-Annahmen

Beim Mapping HTML-Card → Stationen-Daten gab es zwei nicht 100% sichere Zuordnungen:

1. **i-grow "Buntes Dornbirn"** wurde auf den Storyblok-Rundgang **"Immersive Ethik"** gemappt
   (Begründung: Stat 1 in Immersive Ethik heisst "Buntes Dornbirn", die anderen Stations passen thematisch)
   → Falls das ein eigener Rundgang ist, andere Daten verlinken.

2. **i-grow "hist.appear (Schulversion)"** zeigt die gleichen Koordinaten wie **"Hist.appear"** auf i-history
   → Falls die Schulversion eine eigene Station-Auswahl hat, eigenen Rundgang in der Daten-Datei anlegen.

---

## Karten ohne Stationen

**125 Jahre — 125 Bilder** (i-history): kein Rundgang mit Stations, sondern eine Foto-Ausstellung
→ Mini-Karte macht keinen Sinn, Platzhalter wurde belassen.

---

## Karten mit nur 1 Station

**Messepark — Der sprechende Baum** (i-dentity): nur 1 Station
→ Mini-Karte zeigt einen einzelnen Punkt zentriert. Ggf. visuell schwach. Alternativ später anders darstellen (z.B. statisches Foto statt Karte, oder weiter rauszoomen damit man Dornbirn sieht und den Punkt im Kontext).
