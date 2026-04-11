/* iappear.at – main.js
   Navigation-Toggle, Scroll-to-Top, einfache Reveal-Animationen */

(function () {
  const burger = document.querySelector('[data-menu-toggle]');
  const menu   = document.getElementById('menu');
  const closeBtn = document.querySelector('[data-menu-close]');
  const backUp = document.querySelector('[data-back-up]');

  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.add('is-open'));
  }
  if (closeBtn && menu) {
    closeBtn.addEventListener('click', () => menu.classList.remove('is-open'));
  }
  if (menu) {
    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') menu.classList.remove('is-open');
    });
  }

  // Back-to-top
  if (backUp) {
    backUp.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) backUp.classList.add('is-visible');
      else backUp.classList.remove('is-visible');
    });
  }

  // Reveal on scroll
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) => entries.forEach(en => en.isIntersecting && en.target.classList.add('is-in')),
        { threshold: 0.1 }
      )
    : null;
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('is-in'));

  // Hero-Stage: Lorbeer-Draw + Awards-Rotator starten
  const heroStage = document.querySelector('.hero__stage');
  if (heroStage) {
    const laurel = heroStage.querySelector('[data-laurel]');
    const start = () => {
      heroStage.classList.add('is-drawn');
      if (laurel) laurel.classList.add('is-drawn');
    };
    if ('IntersectionObserver' in window) {
      const heroIo = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (en.isIntersecting) { start(); obs.unobserve(heroStage); }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
      heroIo.observe(heroStage);
    } else {
      start();
    }
  }
})();
