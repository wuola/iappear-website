/* iappear.at – features.js
   Klick/Hover auf Feature-Liste wechselt Mockup-Screen + Beschreibungstext */

(function () {
  const list = document.querySelector('[data-feature-list]');
  const screen = document.querySelector('[data-feature-screen]');
  const desc = document.querySelector('[data-feature-desc]');
  if (!list || !screen || !desc) return;

  const features = {
    '3d':    { title: '3D-Modelle',            text: 'Dreidimensionale Objekte, die sich im Raum betrachten lassen – ideal fuer historische Artefakte.' },
    'ar':    { title: 'Augmented Reality',     text: 'Digitale Inhalte werden direkt in die reale Umgebung eingeblendet.' },
    '360':   { title: '360 Video in VR',       text: 'Immersive Videoerlebnisse, die sich in alle Richtungen erkunden lassen.' },
    'anim':  { title: 'Animationen',           text: 'Bewegte Illustrationen erzaehlen Geschichten auf neue Art.' },
    'map':   { title: 'Interaktive Karten',    text: 'Nutzer*innen erkunden Rundgaenge auf einer interaktiven Karte.' },
    'audio': { title: 'Audio-Guide',           text: 'Geschichten und Hintergruende als Audiospur – unterwegs hoerbar.' },
    'hist':  { title: 'Historische Bilder',    text: 'Alte Fotografien zeigen Orte in ihrer frueheren Gestalt.' },
    'quiz':  { title: 'Quiz-Funktion',         text: 'Spielerische Wissensfragen zu Orten und Geschichten.' },
    'zz':    { title: 'Zeitzeugeninterviews',  text: 'Menschen erzaehlen ihre eigenen Geschichten zu Ort und Zeit.' },
    'video': { title: 'Videos',                text: 'Kurze Filme vertiefen ausgewaehlte Themen.' },
    'secret':{ title: 'Secret Stations',       text: 'Versteckte Stationen belohnen neugierige Entdecker*innen.' },
    'emo':   { title: 'Emotionale Geschichten',text: 'Persoenliche Erzaehlungen machen Geschichte greifbar.' },
    'moving':{ title: 'Bewegte Fotos',         text: 'Subtile Animationen erwecken Standbilder zum Leben.' },
    'vn':    { title: 'Vorher-Nachher-Ansichten', text: 'Vergleiche zwischen damals und heute – direkt am Ort.' }
  };

  const setActive = (key) => {
    const f = features[key];
    if (!f) return;
    desc.innerHTML = `<h3>${f.title}</h3><p>${f.text}</p>`;
    screen.textContent = 'App-Screen: ' + f.title;
    list.querySelectorAll('li').forEach(li => {
      li.classList.toggle('is-active', li.dataset.feature === key);
    });
  };

  list.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => setActive(li.dataset.feature));
    li.addEventListener('mouseenter', () => setActive(li.dataset.feature));
  });

  // initial
  setActive('3d');
})();
