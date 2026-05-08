/* iappear.at – features-en.js
   Englische Schwester-Datei zu features.js. Wird auf en/features.html geladen.
   Strings auf en_GB, Asset-Pfade ../assets/... (englische Seite liegt unter /en/). */

(function () {
  const list = document.querySelector('[data-feature-list]');
  const screen = document.querySelector('[data-feature-screen]');
  const desc = document.querySelector('[data-feature-desc]');
  if (!list || !screen || !desc) return;

  const features = {
    '3d':    { title: '3D models',                  sub: 'Made to measure or freely designed', text: 'Three-dimensional objects you can examine in space &ndash; made to measure for your project or freely produced on demand.' },
    'ar':    { title: 'Augmented Reality',          sub: 'You don&rsquo;t need to imagine it.', text: 'You don&rsquo;t need to imagine it. It appears right on your screen.' },
    '360':   { title: '360&deg; video in VR',       sub: 'Right in the middle of it', text: 'Have you ever seen a bell tower from inside? You stand right in the middle of things and experience places that are otherwise inaccessible.' },
    'anim':  { title: 'Animations',                 sub: 'We move content that moves you.', text: 'We move content that moves you.' },
    'map':   { title: 'Interactive maps',           sub: 'Complex change at a glance', text: 'Our surroundings change over time. This can be visualised on maps. Interacting with the map lets users experience that change live.' },
    'audio': { title: 'Audio guide',                sub: 'From a short sound to a full podcast', text: 'From a short sound effect to a podcast with many episodes. Professional audio production with carefully selected speakers in studio quality.' },
    'hist':  { title: 'Historical images',          sub: 'Authentic, from archives and attics', text: 'We dig deep through old attics, archives and private collections to digitally preserve authentic images, places and artefacts of history.' },
    'quiz':  { title: 'Quiz feature',               sub: 'Test your knowledge', text: 'Test your knowledge with our quiz. Or check whether your companions were paying attention. Questions and answers can include images and even videos.' },
    'zz':    { title: 'Contemporary witness interviews', sub: 'The Harry Potter effect', text: 'Some events you can only really grasp when they&rsquo;re told from an emotionally lived perspective. We produce interviews in studio quality.' },
    'video': { title: 'Videos',                     sub: 'Professional storytelling', text: 'Professional storytelling that takes you by the hand and leads you into new worlds. Example: let Franz Beer, the master baroque builder from the Bregenzerwald, walk you through his own story from Au via Konstanz to Rheinau in Switzerland.' },
    'secret':{ title: 'Secret Stations',            sub: 'Discover hidden places', text: 'For a special discovery experience, secret locations can be unveiled &mdash; places that don&rsquo;t appear anywhere else.' },
    'emo':   { title: 'Emotional stories',          sub: 'The Harry Potter effect', text: 'Personal accounts make history tangible. Stories that move you and stay in memory.' },
    'moving':{ title: 'Living photos',              sub: 'Photos that move', text: 'With artificial intelligence, static photos are transformed into moving stories.' },
    'vn':    { title: 'Before-and-after views',     sub: 'Change your perspective', text: 'Change your perspective with a slider. What did this place look like in the past? What used to be there? How has the surroundings changed?' }
  };

  /* Setup: img + video als persistente Layer im phone__screen.
     Identisch zur DE-Variante in features.js. */
  screen.innerHTML = '';
  const imgEl = document.createElement('img');
  imgEl.alt = '';
  imgEl.setAttribute('aria-hidden', 'true');
  screen.appendChild(imgEl);

  const videoEl = document.createElement('video');
  videoEl.muted = true;
  videoEl.loop = true;
  videoEl.autoplay = true;
  videoEl.playsInline = true;
  videoEl.preload = 'metadata';
  screen.appendChild(videoEl);

  const VBUST = '20260502c';

  const setActive = (key) => {
    const f = features[key];
    if (!f) return;
    desc.innerHTML = `<h3>${f.title}</h3><p class="eyebrow">${f.sub}</p><p>${f.text}</p>`;
    /* Pfade aus Sicht der englischen Seite (en/features.html) — daher ../assets/... */
    const videoUrl = `../assets/videos/features/${key}.mp4?v=${VBUST}`;
    const posterUrl = `../assets/videos/features/${key}.jpg?v=${VBUST}`;
    imgEl.src = posterUrl;
    videoEl.poster = posterUrl;
    videoEl.src = videoUrl;
    videoEl.load();
    videoEl.play().catch(() => {});
    const phone = screen.closest('.phone');
    if (phone) {
      phone.classList.toggle('phone--landscape', key === 'map');
    }
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
