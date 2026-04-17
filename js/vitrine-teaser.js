/* iappear.at - vitrine-teaser.js
   Rotator fuer den Vitrine-Teaser auf der Landingpage.
   Rotiert die 4 Kacheln gestaffelt durch alle Eintraege aus window.IAPPEAR_VITRINE.
   - Intervall: alle 5s wechselt eine Kachel
   - Staggering: Slots 0..3 starten mit je 1.25s Versatz
   - Fade-Uebergang ueber .vitrine-slot.is-swapping (opacity via CSS)
   - Pause on hover auf dem Container
   - Respektiert prefers-reduced-motion (dann kein Rotator)
*/
(function () {
  'use strict';

  var SLOT_COUNT = 4;
  var TICK_MS = 2500;         // alle 2.5s wechselt EINE Card (round-robin)
  var FADE_MS = 600;          // muss zur CSS-Transition passen

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function init() {
    var rotator = document.querySelector('[data-vitrine-rotator]');
    if (!rotator) return;

    var data = window.IAPPEAR_VITRINE;
    if (!Array.isArray(data) || data.length <= SLOT_COUNT) return;

    var slots = Array.from(rotator.querySelectorAll('.vitrine-slot'));
    if (slots.length !== SLOT_COUNT) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Welche Indexe sind gerade in welchem Slot? Erstmal: Indexe 0..3 in Slot 0..3
    // matchen auf die statisch im HTML stehenden Eintraege. Wir suchen die in der
    // Daten-Liste, damit wir danach korrekt weiterrotieren koennen.
    var currentIdx = slots.map(function (slot) {
      var img = slot.querySelector('.card__image img');
      if (!img) return -1;
      var src = img.getAttribute('src') || '';
      for (var i = 0; i < data.length; i++) {
        if (data[i].bild === src) return i;
      }
      return -1;
    });

    // Fallback: wenn wir einen Slot nicht matchen konnten, einfach data[slot]
    for (var s = 0; s < SLOT_COUNT; s++) {
      if (currentIdx[s] === -1) currentIdx[s] = s;
    }

    // Naechster Kandidat: der kleinste Index aus data, der gerade in keinem Slot
    // sichtbar ist und auch in den letzten paar Wechseln nicht gezeigt wurde.
    // Einfachste robuste Variante: wir fuehren einen Cursor, der durch data laeuft
    // und ueberspringt, was grad sichtbar ist.
    var cursor = SLOT_COUNT % data.length;
    function nextIndex() {
      for (var tries = 0; tries < data.length; tries++) {
        var candidate = cursor % data.length;
        cursor++;
        if (currentIdx.indexOf(candidate) === -1) return candidate;
      }
      return -1;
    }

    function swap(slotIdx) {
      var slot = slots[slotIdx];
      var next = nextIndex();
      if (next === -1) return;

      slot.classList.add('is-swapping');

      setTimeout(function () {
        var entry = data[next];
        var img = slot.querySelector('.card__image img');
        var h3 = slot.querySelector('h3');
        var p = slot.querySelector('p.muted');

        if (slot.tagName === 'A' && entry.link) slot.setAttribute('href', entry.link);
        if (img && entry.bild) {
          img.setAttribute('src', entry.bild);
          if (entry.titel) img.setAttribute('alt', entry.titel);
        }
        if (h3 && entry.titel) h3.textContent = entry.titel;
        if (p && entry.text) p.textContent = entry.text;

        currentIdx[slotIdx] = next;

        // naechsten Frame reingeblendet
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            slot.classList.remove('is-swapping');
          });
        });
      }, FADE_MS);
    }

    var timer = null;
    var activeSlot = 0;
    var paused = false;

    function tick() {
      if (!paused) {
        swap(activeSlot);
        activeSlot = (activeSlot + 1) % SLOT_COUNT;
      }
    }

    function start() {
      stop();
      // kleiner Initial-Delay damit die Startansicht erst mal wahrgenommen wird
      timer = setTimeout(function loop() {
        tick();
        timer = setTimeout(loop, TICK_MS);
      }, TICK_MS);
    }

    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
    }

    rotator.addEventListener('mouseenter', function () { paused = true; });
    rotator.addEventListener('mouseleave', function () { paused = false; });

    // Erst starten, wenn der Rotator mal sichtbar war - spart Arbeit above the fold
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      io.observe(rotator);
    } else {
      start();
    }
  });
})();
