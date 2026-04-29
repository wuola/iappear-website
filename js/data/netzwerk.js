/* iappear.at – netzwerk.js
   ============================================================
   HIER BEARBEITEN: Stations-Daten für die Netzwerk-Visualisierung.
   Die Grafik zeigt, wie sich Rundgänge Stationen teilen UND wie
   Stationen im Text auf andere Stationen oder Routen verweisen.
   ------------------------------------------------------------

   ANLEITUNG:

   1) "touren" — Liste aller Rundgänge mit Name und Kategorie.
      Kategorie-Werte: "history", "dentity" oder "grow"
      Optional: status: "coming-soon" für angekündigte Rundgänge

   2) "stationen" — Liste aller Stationen mit ihren Rundgang-Namen.
      Jede Station listet die Namen der Rundgänge, in denen sie vorkommt.
      WICHTIG: Die Namen müssen EXAKT mit den Tour-Namen oben uebereinstimmen!

   3) "verlinkungen" — Textuelle Verweise zwischen Stationen/Routen.
      Format pro Eintrag:
        { vonStation: "...", nachStation: "..." }   → Station→Station
        { vonStation: "...", nachTour:    "..." }   → Station→ganze Route

   STAND DER DATEN (Session 14, 2026-04-29):
   Auswahl ist jetzt verlinkungs-fokussiert: jede Station ist entweder echt
   geteilt zwischen Routen ODER ist Sender/Empfänger einer textuellen
   Verlinkung. Reine Solo-Stations ohne Verbindungs-Bedeutung sind raus,
   damit das Netzwerk-Schaubild dichte und Verzahnung zeigt.
   Quelle: Geteilte_Stationen_und_Verlinkungen.md im Obsidian-Vault.
   ============================================================ */

window.IAPPEAR_NETZWERK = {

  /* Titel über der Grafik */
  titel: "Beispiel Dornbirn",

  /* --- TOUREN ------------------------------------------------------------ */
  touren: [
    /* i.history (Gold) */
    { name: "hist.appear",           kategorie: "history" },
    { name: "Stadtspuren",           kategorie: "history" },
    { name: "125 Jahre",             kategorie: "history" },
    { name: "Frauenspuren",          kategorie: "history" },

    /* i.dentity (Blau/Teal) */
    { name: "Innenstadt Erkunden",   kategorie: "dentity" },
    { name: "Oberdorf Entdecken",    kategorie: "dentity" },
    { name: "Sprechender Baum",      kategorie: "dentity" },

    /* i.grow (Grün) */
    { name: "hist.appear Schule",    kategorie: "grow" },
    { name: "Buntes Dornbirn",       kategorie: "grow" }
  ],

  /* --- STATIONEN ---------------------------------------------------------- */
  stationen: [
    /* === Echt geteilte Stationen (gleicher Ort, mehrere Rundgaenge) === */
    { name: "Inatura",                touren: ["Innenstadt Erkunden", "Stadtspuren"] },
    { name: "Rotes Haus",             touren: ["Innenstadt Erkunden", "hist.appear"] },
    { name: "Oberdorfer Turm",        touren: ["Oberdorf Entdecken", "hist.appear"] },
    { name: "Schlossguggerhaus",      touren: ["Oberdorf Entdecken", "hist.appear"] },
    { name: "Migration",              touren: ["hist.appear", "hist.appear Schule"] },

    /* === Innenstadt Erkunden — Hub-Stationen (Sender von Verlinkungen) === */
    { name: "Museum & Archiv",        touren: ["Innenstadt Erkunden"] },
    { name: "Handel & Markt",         touren: ["Innenstadt Erkunden"] },
    { name: "Rheintalhaus",           touren: ["Innenstadt Erkunden"] },
    { name: "Messehochhaus",          touren: ["Innenstadt Erkunden"] },
    { name: "Kirche St. Martin",      touren: ["Innenstadt Erkunden"] },
    { name: "Marktstrasse",           touren: ["Innenstadt Erkunden"] },

    /* === Oberdorf — Sender === */
    { name: "Musikschule",            touren: ["Oberdorf Entdecken"] },

    /* === hist.appear — Empfaenger und Sender === */
    { name: "Gedenkstein",            touren: ["hist.appear"] },
    { name: "Sitten und Alltag",      touren: ["hist.appear"] },
    { name: "Zanzenberg Ausblick",    touren: ["hist.appear"] },
    { name: "Die Wurzeln Dornbirns",  touren: ["hist.appear"] },

    /* === Stadtspuren — Empfaenger === */
    { name: "Zanzenberg",             touren: ["Stadtspuren"] },
    { name: "Sägen",                  touren: ["Stadtspuren"] }
  ],

  /* --- VERLINKUNGEN (textuelle Verweise im Stationstext) ----------------- */
  verlinkungen: [
    /* Tour-Verlinkungen: "siehe Rundgang X" */
    { vonStation: "Museum & Archiv",       nachTour: "hist.appear"  },
    { vonStation: "Handel & Markt",        nachTour: "Frauenspuren" },
    { vonStation: "Rotes Haus",            nachTour: "Frauenspuren" },
    { vonStation: "Rheintalhaus",          nachTour: "hist.appear"  },
    { vonStation: "Messehochhaus",         nachTour: "Stadtspuren"  },
    { vonStation: "Musikschule",           nachTour: "Frauenspuren" },
    { vonStation: "Handel & Markt",        nachTour: "Sprechender Baum" },

    /* Station-Verlinkungen: "siehe Station Y" */
    { vonStation: "Kirche St. Martin",     nachStation: "Marktstrasse" },
    { vonStation: "Kirche St. Martin",     nachStation: "Gedenkstein"  },
    { vonStation: "Rheintalhaus",          nachStation: "Sitten und Alltag" },
    { vonStation: "Schlossguggerhaus",     nachStation: "Zanzenberg" },
    { vonStation: "Schlossguggerhaus",     nachStation: "Zanzenberg Ausblick" },
    { vonStation: "Die Wurzeln Dornbirns", nachStation: "Sägen" },

    /* Tour→Station: thematische Verweise von einer Tour auf konkrete
       Stations in einer anderen Tour. */
    { vonTour: "Buntes Dornbirn",          nachStation: "Migration" },
    { vonTour: "Buntes Dornbirn",          nachStation: "Handel & Markt" },
    { vonTour: "125 Jahre",                nachStation: "Handel & Markt" },
    { vonTour: "125 Jahre",                nachStation: "Messehochhaus" },
    { vonTour: "hist.appear Schule",       nachStation: "Rotes Haus" },
    { vonTour: "hist.appear Schule",       nachStation: "Rheintalhaus" }
  ]
};
