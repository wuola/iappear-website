# Session 55 — Hero-Phones: Video-Mockups durch statisches Bild-Mockup ersetzt

**Datum:** 2026-07-02

## Was gemacht wurde

Maggy hat vier fertige 3D-Phone-Mockup-Bilder geliefert (`C:\Users\maggy\OneDrive\Bilder\MOCKUPS 2026\Mockups Web.zip`, entpackt vier PNGs: SingleCase, Tilt, SideBySide, OverEachother — alle reine Bilder, keine Videos). Alle vier kurz angeschaut, dann `MocupWeb SideBySide.png` ausgewählt und probeweise auf der Landingpage (`index.html`) an Stelle der beiden `.hero__phones`-Video-Elemente (Navigation-Loop + hist.appear-Loop) eingesetzt.

Nach visueller Freigabe ("wow schaut cool aus") final gemacht:

- Bild kopiert nach `assets/images/hero-mockup-sidebyside.png` (kein `-test`-Suffix im finalen Dateinamen).
- `index.html`: `.hero__phones`-Video-Markup ersetzt durch `<div class="hero__phones-mockup"><img ...></div>`.
- `css/components.css`: neue Klasse `.hero__phones-mockup` (max-width 420px, zentriert) + sanfte Float-Animation (`translateY` ±10px, 5s ease-in-out), mit `prefers-reduced-motion: reduce`-Fallback (`animation: none`).
- Cache-Bust: `components.css?v=20260513a` → `...b` in allen 78 betroffenen HTML-Dateien (DE + EN + Blog), per Python-Script (keine PowerShell-Massenedits, siehe Konvention).

## Warum

Die alten Hero-Phones liefen mit echten Video-Loops (`assets/videos/hero/navigation.mp4` + `histappear.mp4`). Maggy wollte stattdessen die neuen statischen Mockup-Renderings testen — wirkt ruhiger/hochwertiger, kein Autoplay-Video-Gewicht im wichtigsten Above-the-fold-Bereich.

## Offen / zu beachten

- Die 3 anderen Mockup-Varianten (SingleCase, Tilt, OverEachother) liegen unangetastet in Maggys lokalem Ordner — könnten für andere Seiten/Zwecke später relevant werden.
- Alte Video-Assets (`assets/videos/hero/navigation.mp4`, `histappear.mp4` + zugehörige `.jpg`-Poster) sind NICHT gelöscht — nur aus `index.html` entfernt. Aufräum-Kandidat, falls sie sonst nirgends mehr referenziert werden (kurz gegenchecken vor dem Löschen).
- Die EN-Landingpage (`en/index.html`) nutzt weiterhin die alten Video-Phones — dort bewusst nicht angefasst, da Maggy nur von der DE-Landingpage sprach. Falls gewünscht, gleiche Umstellung dort nachziehen.
- Bei einem späteren Bild-Tausch (anderes Mockup-PNG): laut Konvention Dateiname ändern statt nur `?v=`-Query, manche Caches ignorieren Query-Strings.
