/* iappear.at – vitrine.js
   EDITIERBAR: Vitrine-Kacheln fuer Startseite.
   Neue Eintraege einfach hier ergaenzen. */

window.IAPPEAR_VITRINE = [
  {
    titel: "askd:Magazin Portrait",
    text: "Portrait ueber i.appear im askd:Magazin.",
    link: "#"
  },
  {
    titel: "ARS Electronica 2022",
    text: "i.appear beim Ars Electronica Festival 2022.",
    link: "#"
  },
  {
    titel: "Smart City Dornbirn Preis",
    text: "Auszeichnung Smart City Dornbirn 2022.",
    link: "#"
  },
  {
    titel: "Ars Electronica 2021 Symposium",
    text: "Beitrag beim Ars Electronica Symposium 2021.",
    link: "#"
  },
  {
    titel: "Innovation Call Vorarlberg 2025",
    text: "Auszeichnung beim Innovation Call Vorarlberg 2025.",
    link: "#"
  },
  {
    titel: "Digitale Innovationen im Tourismus 2025",
    text: "Auszeichnung fuer digitale Innovationen im Tourismus 2025.",
    link: "#"
  }
];

// Rendert die Vitrine-Grid auf der Startseite (wird von index.html aufgerufen)
(function () {
  const grid = document.querySelector('[data-vitrine-grid]');
  if (!grid || !window.IAPPEAR_VITRINE) return;
  grid.innerHTML = window.IAPPEAR_VITRINE.map(item => `
    <article class="vitrine-card">
      <div class="ph">Bild: ${item.titel}</div>
      <h3 class="card__title">${item.titel}</h3>
      <p class="muted">${item.text}</p>
      <a href="${item.link}" class="vitrine-card__link">– zum Artikel –</a>
    </article>
  `).join('');
})();
