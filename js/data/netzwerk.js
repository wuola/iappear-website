/* iappear.at – netzwerk.js
   ============================================================
   HIER BEARBEITEN: Stations-Daten für die Netzwerk-Visualisierung.
   Die Grafik zeigt, wie sich Rundgänge Stationen teilen.
   Geteilte Stationen werden automatisch groesser und farbig dargestellt.
   ------------------------------------------------------------

   ANLEITUNG:

   1) "touren" — Liste aller Rundgänge mit Name und Kategorie.
      Kategorie-Werte: "history", "dentity" oder "grow"
      Optional: status: "coming-soon" für angekündigte Rundgänge

   2) "stationen" — Liste aller Stationen mit ihren Rundgang-Namen.
      Jede Station listet die Namen der Rundgänge, in denen sie vorkommt.
      WICHTIG: Die Namen müssen EXAKT mit den Tour-Namen oben uebereinstimmen!

   Wenn eine Station in mehreren Rundgängen vorkommt, wird sie
   automatisch groesser und bekommt farbige Ringe.

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
    { name: "Frauenspuren",          kategorie: "history", status: "coming-soon" },

    /* i.dentity (Blau/Teal) */
    { name: "Innenstadt Erleben",    kategorie: "dentity" },
    { name: "Oberdorf Entdecken",    kategorie: "dentity" },
    { name: "Sprechender Baum",      kategorie: "dentity" },

    /* i.grow (Grün) */
    { name: "hist.appear Schule",    kategorie: "grow" },
    { name: "Buntes Dornbirn",       kategorie: "grow" }
  ],

  /* --- STATIONEN (PLATZHALTER — bitte mit echten Daten ersetzen!) -------- */
  stationen: [
    /* Stark geteilte Stationen (3–4 Rundgänge) */
    { name: "Marktplatz",         touren: ["hist.appear", "Innenstadt Erleben", "Stadtspuren", "Oberdorf Entdecken"] },
    { name: "Rotes Haus",         touren: ["hist.appear", "Oberdorf Entdecken", "hist.appear Schule"] },
    { name: "Pfarrkirche",        touren: ["hist.appear", "Innenstadt Erleben", "Frauenspuren"] },
    { name: "Stadtarchiv",        touren: ["125 Jahre", "hist.appear", "Frauenspuren"] },

    /* Mittel geteilte Stationen (2 Rundgänge) */
    { name: "Mohrenbrauerei",     touren: ["Innenstadt Erleben", "hist.appear"] },
    { name: "Textilweg",          touren: ["hist.appear", "Stadtspuren"] },
    { name: "Eisengasse",         touren: ["Innenstadt Erleben", "Buntes Dornbirn"] },
    { name: "BORG Schoren",       touren: ["hist.appear Schule", "Buntes Dornbirn"] },
    { name: "Hatlerstrasse",      touren: ["Buntes Dornbirn", "Frauenspuren"] },
    { name: "Zanzenberg",         touren: ["125 Jahre", "Stadtspuren"] },

    /* Eigene Stationen (nur 1 Rundgang) */
    { name: "Gutle",              touren: ["Stadtspuren"] },
    { name: "Rappenloch",         touren: ["Stadtspuren"] },
    { name: "Messepark",          touren: ["Sprechender Baum"] }
  ]
};
