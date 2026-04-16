/* iappear.at – rundgänge.js
   ============================================================
   HIER BEARBEITEN: Rundgang-Daten für Startseite & Kategorie-Seiten.
   ------------------------------------------------------------
   Aufbau:
     window.IAPPEAR_RUNDGAENGE.history.regionen[ ... ]
       - "name"      = Region (z.B. Dornbirn, Feldkirch ...)
       - "rundgänge" = Liste der Rundgänge in dieser Region
           - "titel" = Anzeige-Name
           - "kurz"  = Kurztext (1-2 Sätze)
           - "status" = optional ("aktiv" oder "coming-soon")
   ============================================================ */

window.IAPPEAR_RUNDGAENGE = {

  history: {
    titel: "i.history – Zeitreisen",
    farbe: "#D3A54A",
    regionen: [
      {
        name: "Dornbirn",
        stadt: "dornbirn",
        rundgaenge: [
          {
            titel: "hist.appear",
            kurz: "Der erste Rundgang von i.appear: Eine multimediale Zeitreise durch Dornbirns Geschichte mit Stationen, Audio, Bildern und 3D-Rekonstruktionen.",
            status: "aktiv"
          },
          {
            titel: "Stadtspuren",
            kurz: "Spuren der Stadtgeschichte entdecken: Wo war einst was, und wie hat sich Dornbirn gewandelt?",
            status: "aktiv"
          },
          {
            titel: "125 Jahre 125 Bilder",
            kurz: "Anlässlich 125 Jahre Stadtarchiv Dornbirn: Ein Bild pro Jahr, 125 Geschichten am Originalort.",
            status: "aktiv"
          },
          {
            titel: "Frauenspuren",
            kurz: "Frauen, die Dornbirn geprägt haben. (Coming soon)",
            status: "coming-soon"
          }
        ]
      },
      {
        name: "Bregenz",
        stadt: "bregenz",
        rundgaenge: [
          {
            titel: "Brigantium",
            kurz: "Römisches Bregenz: Eine Zeitreise zurück nach Brigantium mit 3D-Rekonstruktionen und Funden vor Ort.",
            status: "aktiv"
          }
        ]
      },
      {
        name: "Au im Bregenzerwald",
        stadt: "au",
        rundgaenge: [
          {
            titel: "Barockbaumeister",
            kurz: "Barockbaumeister Franz Beer führt auf einer Reise von Au über Bregenz und Konstanz bis Bezau durch sein Leben.",
            status: "aktiv"
          }
        ]
      },
      {
        name: "Bodenseeregion",
        stadt: "hard",
        rundgaenge: [
          {
            titel: "Seerunde",
            kurz: "Eine historische Rundtour entlang des Bodensees.",
            status: "aktiv"
          }
        ]
      }
    ]
  },

  dentity: {
    titel: "i.dentity – Regionale Identität",
    farbe: "#769CA2",
    regionen: [
      {
        name: "Dornbirn",
        stadt: "dornbirn",
        rundgaenge: [
          {
            titel: "Oberdorf Entdecken",
            kurz: "Das Dornbirner Oberdorf interaktiv erkunden: Plätze, Geschichten und Lieblingsorte.",
            status: "aktiv"
          },
          {
            titel: "Innenstadt Erleben",
            kurz: "Die Innenstadt mit allen Sinnen erleben &mdash; ein Rundgang für Einheimische und Gaeste.",
            status: "aktiv"
          },
          {
            titel: "Buntes Dornbirn",
            kurz: "Dornbirn in seinen vielen Facetten: Kultur, Vielfalt, Lebensraum.",
            status: "aktiv"
          }
        ]
      },
      {
        name: "Messepark Dornbirn",
        stadt: "dornbirn",
        rundgaenge: [
          {
            titel: "Sprechender Baum",
            kurz: "Der sprechende Baum im Messepark: Ein interaktives Erlebnis für Familien.",
            status: "aktiv"
          }
        ]
      }
    ]
  },

  grow: {
    titel: "i.grow – Medienbildung",
    farbe: "#8E9F6A",
    regionen: [
      {
        name: "Dornbirn",
        stadt: "dornbirn",
        rundgaenge: [
          {
            titel: "hist.appear Schulversion",
            kurz: "Die Schulversion von hist.appear &mdash; entwickelt mit Schüler:innen für den Unterricht.",
            status: "aktiv"
          },
          {
            titel: "Buntes Dornbirn (i.grow)",
            kurz: "Schüler:innen erzählen ihr Dornbirn: Vielfalt, Identität und persönliche Sichtweisen.",
            status: "aktiv"
          },
          {
            titel: "Zusammenwachsen",
            kurz: "Ein Schulprojekt zum Thema Gemeinschaft und Wandel.",
            status: "aktiv"
          }
        ]
      },
      {
        name: "Feldkirch",
        stadt: "feldkirch",
        rundgaenge: [
          {
            titel: "Ein Oktobertag",
            kurz: "Schüler:innen-Projekt in Feldkirch: Ein Tag im Oktober, multimedial erzählt.",
            status: "aktiv"
          },
          {
            titel: "Bombenabwürfe 1943",
            kurz: "Buch- und App-Projekt zu den Bombenabwürfen 1943 in Feldkirch.",
            status: "aktiv"
          }
        ]
      }
    ]
  }
};
