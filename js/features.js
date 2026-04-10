/* iappear.at – features.js
   Klick/Hover auf Feature-Liste wechselt Mockup-Screen + Beschreibungstext */

(function () {
  const list = document.querySelector('[data-feature-list]');
  const screen = document.querySelector('[data-feature-screen]');
  const desc = document.querySelector('[data-feature-desc]');
  if (!list || !screen || !desc) return;

  const features = {
    '3d':    { title: '3D-Modelle',               sub: 'Massanfertigungen oder frei nach Wunsch', text: 'Dreidimensionale Objekte, die sich im Raum betrachten lassen &ndash; massgefertigt fuer dein Projekt oder frei nach Wunsch produziert.' },
    'ar':    { title: 'Augmented Reality',        sub: 'Sie brauchen es sich nicht vorstellen.', text: 'Sie brauchen es sich nicht vorstellen. Es taucht direkt auf ihrem Display auf.' },
    '360':   { title: '360&deg; Video in VR',     sub: 'Mitten im Geschehen', text: 'Haben Sie schon einmal einen Glockenturm von innen gesehen? Sie stehen mitten im Geschehen und erleben Orte, die sonst unzugaenglich sind.' },
    'anim':  { title: 'Animationen',              sub: 'Wir bewegen Inhalte, die dich bewegen.', text: 'Wir bewegen Inhalte, die dich bewegen.' },
    'map':   { title: 'Interaktive Karten',       sub: 'Komplexe Veraenderungen auf einen Blick', text: 'Unsere Umgebung veraendert sich mit der Zeit. Dies laesst sich auf Karten abbilden. Die Interaktion mit der Karte laesst die Nutzer:innen diese Veraenderungen live miterleben.' },
    'audio': { title: 'Audio-Guide',              sub: 'Vom kurzen Geraeusch bis zum Podcast', text: 'Fuer ein kurzes Geraeusch oder einen Podcast mit vielen Folgen. Professionelle Audio-Erstellung mit ausgewaehlten Speakern in Studioqualitaet.' },
    'hist':  { title: 'Historische Bilder',       sub: 'Authentisch aus Archiven und Dachboeden', text: 'Wir graben tief in alten Dachboeden, Archiven und privaten Sammlungen, um authentische Abbildungen, Orte und Artefakte der Geschichte digital konservieren zu koennen.' },
    'quiz':  { title: 'Quiz-Funktion',            sub: 'Festige dein Wissen', text: 'Festige dein Wissen mit unserem Quiz. Oder ueberpruefe deine Begleiter:innen, ob sie auch gut aufgepasst haben. In den Fragen und in den Antworten koennen Bilder und sogar Videos integriert werden.' },
    'zz':    { title: 'Zeitzeug:innen-Interviews',sub: 'Der Harry-Potter-Effekt', text: 'Manche Ereignisse kann man erst begreifen, wenn sie aus einer emotional erlebten Perspektive erzaehlt werden. Wir produzieren Interviews in Studioqualitaet.' },
    'video': { title: 'Videos',                   sub: 'Professionelles Storytelling', text: 'Professionelles Storytelling, das die Rezipient:innen an der Hand nimmt und in neue Welten fuehrt. Beispiel: Lass dich von Franz Beer, dem Barockbaumeister aus dem Bregenzerwald, durch seine eigene Geschichte von Au ueber Konstanz bis Rheinau in der Schweiz fuehren.' },
    'secret':{ title: 'Secret Stations',          sub: 'Geheime Orte entdecken', text: 'Fuer ein besonderes Entdeckungserlebnis koennen geheime Orte entdeckt werden, die nirgendwo sonst aufscheinen.' },
    'emo':   { title: 'Emotionale Geschichten',   sub: 'Der Harry-Potter-Effekt', text: 'Persoenliche Erzaehlungen machen Geschichte greifbar. Geschichten, die beruehren und in Erinnerung bleiben.' },
    'moving':{ title: 'Bewegte Fotos',            sub: 'Die lebendigeren Bilder', text: 'Mit kuenstlicher Intelligenz werden statische Fotos in bewegte Geschichten verwandelt.' },
    'vn':    { title: 'Vorher-Nachher-Ansichten', sub: 'Aendere deine Perspektive', text: 'Aendere deine Perspektive ueber einen Schieberegler. Wie sah es hier frueher aus? Was war denn dort einmal? Wie hat sich die Umgebung veraendert?' }
  };

  // Screen tauscht beim Wechsel das Video aus. autoplay/loop/muted/playsinline
  // ist Pflicht damit mobile Browser das Video ohne Klick abspielen.
  const setActive = (key) => {
    const f = features[key];
    if (!f) return;
    desc.innerHTML = `<h3>${f.title}</h3><p class="eyebrow">${f.sub}</p><p>${f.text}</p>`;
    const videoUrl = `assets/videos/features/${key}.mp4`;
    screen.innerHTML = `<video src="${videoUrl}" autoplay muted loop playsinline preload="metadata"></video>`;
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
