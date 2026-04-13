/* iappear.at – rundgaenge.js
   ============================================================
   HIER BEARBEITEN: Rundgang-Daten fuer Startseite & Kategorie-Seiten.
   ------------------------------------------------------------
   Aufbau:
     window.IAPPEAR_RUNDGAENGE.history.regionen[ ... ]
       - "name"      = Region (z.B. Dornbirn, Feldkirch ...)
       - "rundgaenge" = Liste der Rundgaenge in dieser Region
           - "titel" = Anzeige-Name
           - "kurz"  = Kurztext (1-2 Saetze)
           - "status" = optional ("aktiv" oder "coming-soon")
   ============================================================ */

window.IAPPEAR_RUNDGAENGE = {

  history: {
    titel: "i.history – Zeitreisen",
    farbe: "#D3A54A",
    regionen: [
      {
        name: "Dornbirn",
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
            kurz: "Anlaesslich 125 Jahre Stadtarchiv Dornbirn: Ein Bild pro Jahr, 125 Geschichten am Originalort.",
            status: "aktiv"
          },
          {
            titel: "Frauenspuren",
            kurz: "Frauen, die Dornbirn gepraegt haben. (Coming soon)",
            status: "coming-soon"
          }
        ]
      },
      {
        name: "Bregenz",
        rundgaenge: [
          {
            titel: "Brigantium",
            kurz: "Roemisches Bregenz: Eine Zeitreise zurueck nach Brigantium mit 3D-Rekonstruktionen und Funden vor Ort.",
            status: "aktiv"
          }
        ]
      },
      {
        name: "Feldkirch",
        rundgaenge: [
          {
            titel: "Barockbaumeister",
            kurz: "Auf den Spuren der Vorarlberger Barockbaumeister-Schule rund um Feldkirch.",
            status: "aktiv"
          }
        ]
      },
      {
        name: "Bodenseeregion",
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
    titel: "i.dentity – Regionale Identitaet",
    farbe: "#769CA2",
    regionen: [
      {
        name: "Dornbirn",
        rundgaenge: [
          {
            titel: "Oberdorf Entdecken",
            kurz: "Das Dornbirner Oberdorf interaktiv erkunden: Plaetze, Geschichten und Lieblingsorte.",
            status: "aktiv"
          },
          {
            titel: "Innenstadt Erleben",
            kurz: "Die Innenstadt mit allen Sinnen erleben &mdash; ein Rundgang fuer Einheimische und Gaeste.",
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
        rundgaenge: [
          {
            titel: "Sprechender Baum",
            kurz: "Der sprechende Baum im Messepark: Ein interaktives Erlebnis fuer Familien.",
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
        rundgaenge: [
          {
            titel: "hist.appear Schulversion",
            kurz: "Die Schulversion von hist.appear &mdash; entwickelt mit Schueler:innen fuer den Unterricht.",
            status: "aktiv"
          },
          {
            titel: "Buntes Dornbirn (i.grow)",
            kurz: "Schueler:innen erzaehlen ihr Dornbirn: Vielfalt, Identitaet und persoenliche Sichtweisen.",
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
        rundgaenge: [
          {
            titel: "Ein Oktobertag",
            kurz: "Schueler:innen-Projekt in Feldkirch: Ein Tag im Oktober, multimedial erzaehlt.",
            status: "aktiv"
          },
          {
            titel: "Bombenabwuerfe 1943",
            kurz: "Buch- und App-Projekt zu den Bombenabwuerfen 1943 in Feldkirch.",
            status: "aktiv"
          }
        ]
      }
    ]
  }
};
