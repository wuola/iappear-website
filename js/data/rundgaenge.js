/* iappear.at – rundgaenge.js
   EDITIERBAR: Rundgang-Daten fuer Kategorie-Seiten (i.history, i.dentity, i.grow).
   Wird in Session 2/3 in die Seiten eingebunden. */

window.IAPPEAR_RUNDGAENGE = {
  history: {
    titel: "i.history – Zeitreisen",
    farbe: "#D3A54A",
    regionen: [
      {
        name: "Dornbirn",
        rundgaenge: [
          { titel: "hist.appear",        kurz: "Historische Rundgaenge durch Dornbirn." },
          { titel: "Stadtspuren",        kurz: "Spuren der Stadtgeschichte entdecken." },
          { titel: "125 Jahre 125 Bilder", kurz: "Ein Bild pro Jahr – 125 Jahre Dornbirn." },
          { titel: "Frauenspuren",       kurz: "Frauen, die Dornbirn gepraegt haben." }
        ]
      },
      {
        name: "Au / Bregenzerwald",
        rundgaenge: [
          { titel: "Platzhalter Rundgang Au", kurz: "Platzhalter – wird befuellt." }
        ]
      }
    ]
  },

  dentity: {
    titel: "i.dentity – Regionale Erlebnisse",
    farbe: "#769CA2",
    regionen: [
      {
        name: "Dornbirn",
        rundgaenge: [
          { titel: "Oberdorf Entdecken", kurz: "Das Dornbirner Oberdorf neu erleben." },
          { titel: "Innenstadt Erleben", kurz: "Die Innenstadt interaktiv entdecken." },
          { titel: "Buntes Dornbirn",    kurz: "Dornbirn in seinen vielen Facetten." }
        ]
      }
    ]
  },

  grow: {
    titel: "i.grow – Medienbildung",
    farbe: "#8E9F6A",
    regionen: [
      {
        name: "Schulprojekte",
        rundgaenge: [
          { titel: "Platzhalter Medienbildungs-Projekt", kurz: "Vom Konsumieren zum Gestalten – Jugendliche werden selbst zu Autor*innen." }
        ]
      }
    ]
  }
};
