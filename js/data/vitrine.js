/* iappear.at – vitrine.js
   ============================================================
   HIER BEARBEITEN: Vitrine-Kacheln fuer die Startseite.
   ------------------------------------------------------------
   So fuegst du eine neue Kachel hinzu:
     - Kopiere einen kompletten Block { ... },
     - aendere "titel", "text" und "link"
     - Fertig. Speichern.
   Bilder kommen spaeter in den Ordner assets/img/vitrine/.
   ============================================================ */

window.IAPPEAR_VITRINE = [
  {
    titel: "askd:Magazin Portrait Marilena Tumler",
    text: "Ein wunderschoenes Portrait vom askd:Magazin ueber Marilena Tumler.",
    link: "#"
  },
  {
    titel: "ARS Electronica 2022",
    text: "2022 wurden die Rundgaenge Brigantium und Barockbaumeister auf der ARS Electronica ausgestellt.",
    link: "#"
  },
  {
    titel: "Smart City Dornbirn 2022",
    text: "Marilena erhielt 2022 den Smart City Dornbirn Preis mit dem Siegerprojekt i.appear.",
    link: "#"
  },
  {
    titel: "Ars Electronica 2021 Garden Vorarlberg",
    text: "Hist.appear auf dem Symposium im vorarlberg museum im Rahmen des Ars Electronica 2021 Garden Vorarlberg.",
    link: "#"
  },
  {
    titel: "ORF Vorarlberg Video",
    text: "Video-Beitrag des ORF Vorarlberg ueber i.appear im Schulunterricht inklusive Rundgang in der Stadt.",
    link: "#"
  },
  {
    titel: "Innovation Call Tourismus 2025",
    text: "Zusaetzlich zum Innovation-Call-Preis erhielt i.appear die Auszeichnung 'Digitale Innovationen im Tourismus'. Juhu!",
    link: "#"
  },
  {
    titel: "VN 'Koepfe von morgen'",
    text: "Ehrung der VN: Marilena ist als eine der 'Koepfe von morgen' geehrt worden. Eine sehr coole Auszeichnung!",
    link: "#"
  },
  {
    titel: "Marke Vorarlberg Portrait",
    text: "Ein tolles Portrait ueber Marilena Tumler als Pionierin in der Technik. Grosses Danke an die Marke Vorarlberg.",
    link: "#"
  },
  {
    titel: "Bombenabwuerfe Feldkirch",
    text: "Buch- und App-Praesentation zum Thema Bombenabwuerfe 1943 in Feldkirch. Ein Schulprojekt in i.grow.",
    link: "#"
  },
  {
    titel: "Masters Thesis Ethik",
    text: "Masters Thesis zur Verwendung immersiver Lernwelten im Ethikunterricht: i.appear als Fallbeispiel.",
    link: "#"
  },
  {
    titel: "Masters Thesis Geschichte",
    text: "Masters Thesis in Geschichte: Die wissenschaftlich fundierte Seite von i.appear.",
    link: "#"
  },
  {
    titel: "VN Oktobertag Feldkirch",
    text: "Ein VN-Artikel zum Schueler:innen-Projekt i.grow in Feldkirch (Ein Oktobertag). Die VN hat uns begleitet!",
    link: "#"
  },
  {
    titel: "Schafferei Traumjob",
    text: "Ein tolles Format: Die Schafferei bietet interessierten Personen ein Mittagessen mit ihrem Traumjob an. (12. November 2025)",
    link: "#"
  },
  {
    titel: "Podiumsdiskussion PH Vorarlberg",
    text: "Podiumsdiskussion: Digitale Kompetenzen im Spannungsfeld zwischen Kinderschutz und Kuenstlicher Intelligenz.",
    link: "#"
  }
];

// Rendert die Vitrine-Grid auf der Startseite
(function () {
  const grid = document.querySelector('[data-vitrine-grid]');
  if (!grid || !window.IAPPEAR_VITRINE) return;
  grid.innerHTML = window.IAPPEAR_VITRINE.map(item => `
    <article class="vitrine-card">
      <div class="ph ph--square">Bild: ${item.titel}</div>
      <p class="vitrine-card__text">${item.text}</p>
      <a href="${item.link}" class="vitrine-card__link">&ndash; zum Artikel &ndash;</a>
    </article>
  `).join('');
})();
