# Session 14b - Netzwerk-Viz Refactor + echte Storyblok-Daten

**Datum**: 2026-04-29  
**Quelle**: aus CLAUDE.md (Stand 2026-05-02), unveraendert uebernommen.

---

- Session 14b (Netzwerk-Viz Refactor + echte Storyblok-Daten, 2026-04-29 abends):
  Direkt nach den Mini-Karten weitergemacht — die Netzwerk-Viz ("Ein Netzwerk aus digitalen Stadtrundgaengen") auf der Landingpage komplett umgebaut.
  - **Vor-Stand**: 13 Stations mit kompletten Fantasie-Namen ("Marktplatz", "BORG Schoren", "Mohrenbrauerei", "Pfarrkirche" — gibt es so im echten Storyblok nicht). Frauenspuren als coming-soon, viele "shared"-Stationen die in Wirklichkeit gar nicht geteilt sind.
  - **Quelle**: Maggys neue Obsidian-Doku `Geteilte_Stationen_und_Verlinkungen.md` (105 Stationen ueber 11 Rundgaenge, davon 4 echt geteilte Dornbirner Stations + 23 textuelle Verlinkungen). Maggy-Vorgabe: "Optik wichtiger als Korrektheit, ist nur eine schematische Erklaerung" — keine 100% Datentreue, aber echte Storyblok-Namen statt Fantasie.
  - **Daten-Refactor (`js/data/netzwerk.js`)**: 18 echte Stations: 4 echt geteilte (Inatura/Oberdorfer Turm/Rotes Haus/Schlossguggerhaus) + Migration als hist.appear↔Schul-Variante + 13 Verlinkungs-Endpunkte (Museum & Archiv, Handel & Markt, Rheintalhaus, Messehochhaus, Kirche St. Martin, Marktstrasse, Musikschule, Gedenkstein, Sitten und Alltag, Zanzenberg Ausblick, Die Wurzeln Dornbirns, Zanzenberg, Saegen). Stations ohne Verbindungen ("Hexenverfolgung", "Guetle", "Hammerle Villa" etc.) bewusst draussen — sie wuerden visuelles "Lärm" sein. Frauenspuren ist live (kein coming-soon mehr), 125 Jahre kein coming-soon-Tag mehr (war Maggy-Wunsch).
  - **Neuer Daten-Block `verlinkungen`**: 19 textuelle Verweise als gestrichelte Linien — 4 Formen unterstuetzt: Station→Station, Station→Tour, Tour→Station, Tour→Tour. Aus echtem Storyblok (12) plus 7 thematisch-plausible Verstaerkungen (z.B. "Buntes Dornbirn → Migration", "125 Jahre → Handel & Markt", "Handel & Markt → Sprechender Baum" als "vom Marktplatz aus in den Messepark"). Letzteres rettet die sonst isolierte Sprechender-Baum-Tour.
  - **Renderer-Erweiterung (`js/network.js`)**: Verlinkungen als gestrichelte Pfade in Tour-Farbe (wenn Tour beteiligt) oder neutralweiss (Station→Station). Hover-Logik erweitert: Tour- und Stations-Hover aktivieren jetzt auch alle relevanten gestrichelten Verlinkungen mit voller Sichtbarkeit (`is-active` → opacity .9). Rundgang-Anzahl-Label ("2 Rundgaenge") beim Stations-Klick komplett entfernt.
  - **Layout-Iterationen**: viewBox 1100x780 unveraendert, aber:
    - Tour-Ring von R=290 auf R=310 (etwas weiter aussen)
    - Stations-Ring durch zwei Phasen: erst R=200 (zu eng fuer 18 Stations), dann auf R=130 verkleinert (Stations-Punkte clustern eng ums Zentrum)
    - Stations-Labels radial nach AUSSEN versetzt (vorher nach innen) — sitzen jetzt im Korridor zwischen Stations-Punkt und Tour-Ring statt in der Mitte zu kollidieren
    - Default-Label-Offset 30 (Wunsch Maggy: nahe am Punkt). Optional pro Station: `labelOffsetExtra` als Override fuer Konflikt-Faelle bei langen Stations-Namen — derzeit nirgends gesetzt, Marilena entscheidet welche Stations Sonderbehandlung brauchen oder ob 1-2 raus sollten.
    - Stations-Schrift groesser: Desktop 22px (war 17px), Mobile-Default 14px (war 13px), staerkerer Kontrast (.55/.8 statt .35/.55).
  - **Backup-Datei**: `js/data/netzwerk.backup-2026-04-29-pre-stufe1.js` als Rollback-Sicherung des Vor-Stands.
  - **Verworfene Variante**: kurz Tour-zu-Tour Bezier-Boegen ausserhalb des Diagramms gebaut (4 Boegen Innenstadt→hist.appear/Frauenspuren/Stadtspuren + Oberdorf→Frauenspuren). Maggy: "passt nicht" — Verbindungen kommen ja von konkreten Stations, nicht von Touren als Ganzes. Wieder rausgerollt vor dem Push (Stand `731b7f9` hat schon die station-basierten Verlinkungen).
  - **Offene Fragen fuer Marilena** (Maggys Worte: "ich bespreche mit Marilena, ob wir eine station rausnehmen sollen"):
    - Welche Labels sollen vergroessert werden via labelOffsetExtra?
    - Sollen einzelne Stations rausgenommen werden um's aufgeraeumter zu machen?
    - Layout grundsaetzlich OK so?
  - **Cache-Bust**: components.css `?v=20260429f` → `g`, netzwerk.js `?v=20260429d` → `g` (3 Iterationen), network.js `v=11` → `12` → `13` → `14` → `15`.
  - **Commits**: `731b7f9` (Refactor + Stufe 1) → `20f1d72` (Polish-Iterationen Verlinkungen + Layout). Live: https://wuola.github.io/iappear-website/
