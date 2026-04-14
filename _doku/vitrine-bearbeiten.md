# Vitrine-Kacheln bearbeiten

## Kurzfassung

1. Datei `js/data/vitrine.js` im Editor oeffnen
2. Gewuenschten Eintrag aendern / neuen Block kopieren
3. Speichern
4. Im Repo-Ordner einmal `python build.py` ausfuehren
5. Geaenderte Dateien committen & pushen

Fertig — die Aenderung ist live sobald GitHub Pages deployed hat (~1 Min).

## Wie die Vitrine aufgebaut ist

Die 22 Vitrine-Kacheln auf https://iappear.at/vitrine/ werden aus einer
einzigen Datei gespeist:

    js/data/vitrine.js

Jeder Eintrag in der Liste ist ein Objekt mit 4 Feldern:

```js
{
  titel: "askd:Magazin Portrait Marilena Tumler",
  text:  "Ein wunderschoenes Portrait vom askd:Magazin ueber Marilena Tumler.",
  bild:  "assets/images/vitrine/asked.png",
  link:  "vitrine/askd-magazin-portrait-marilena-tumler.html"
}
```

- **titel**: wird als Bild-alt und Platzhalter-Text verwendet
- **text**: Beschreibung unter der Kachel (1-2 Saetze)
- **bild**: Pfad zum Bild in `assets/images/vitrine/`. Leer lassen ("")
  wenn du kein Bild hast — dann erscheint ein dunkler Platzhalter mit
  dem Titel
- **link**: Pfad zur Artikel-Seite in `vitrine/` (ASCII-Dateinamen!)

## Warum ist `build.py` noetig?

Frueher wurden die Kacheln per JavaScript im Browser zusammengebaut. Das
Problem: Google kann JS zwar meistens rendern, aber KI-Crawler (ChatGPT,
Claude, Perplexity, Common Crawl) tun das oft nicht. Die sahen dann eine
leere Vitrine-Seite.

Seit Session 8 bauen wir die 22 Kacheln **einmal** direkt ins HTML rein,
damit sie ohne JavaScript lesbar sind. Das Build-Script liest die
`vitrine.js`-Daten und generiert den HTML-Block automatisch.

Der Block in `vitrine.html` steht zwischen diesen Markern:

    <!-- VITRINE-GRID-START -->
    ... (wird automatisch generiert) ...
    <!-- VITRINE-GRID-END -->

Das Script ersetzt nur diesen Bereich. Alles andere in der Datei bleibt
unangetastet.

## Neue Kachel hinzufuegen

1. In `js/data/vitrine.js` einen bestehenden Block kopieren
2. Die 4 Felder anpassen
3. Ans Ende der Liste (vor dem `];`) einfuegen
4. Bild in `assets/images/vitrine/` ablegen (wenn vorhanden)
5. **Wichtig:** wenn die Kachel auf eine neue Artikel-Seite zeigen soll,
   muss diese Artikel-Seite erst in `vitrine/dein-name.html` angelegt
   werden (am besten eine bestehende Seite kopieren und anpassen)
6. `python build.py` ausfuehren
7. Testen: `vitrine.html` im Browser oeffnen, neue Kachel sollte da sein
8. Committen & pushen

## Stolperfalle: Dateinamen

Die Artikel-Seiten in `vitrine/` haben **bewusst ASCII-Dateinamen**:

    vitrine/bombenabwuerfe-feldkirch.html   (nicht bombenabwürfe)
    vitrine/koepfe-von-morgen.html          (nicht köpfe)
    vitrine/iappear-in-den-klassenraeumen.html

Grund: Umlaute in URLs werden von manchen Systemen anders kodiert und
koennen zu kaputten Links fuehren. Nur die sichtbaren Texte (Titel,
Beschreibung) duerfen echte Umlaute enthalten.

## Was wenn ich `build.py` vergesse?

Kein Drama. Die `vitrine.js` hat einen JavaScript-Fallback: wenn das
statische Grid leer ist (z.B. weil du die Datei bearbeitet hast aber
`build.py` noch nicht gelaufen ist), rendern die Kacheln im Browser zur
Laufzeit. Die Seite funktioniert also immer.

Aber: LLM-Crawler sehen dann wieder nichts. Also — einfach nicht
vergessen. `python build.py` dauert 1 Sekunde.
