# Session 58 — Blog: „Daten sehen lernen" (Datenvisualisierung im Unterricht) veröffentlicht

**Datum:** 2026-10-05

## Was passiert ist

Neuer i.grow-Artikel `blog/datenvisualisierung-unterricht.html` — Thema von Maggy vorgegeben
(Didaktik der Datenvisualisierung, i.appear als Profi, generalistisch, wenige Beispiele).
Entwurf + Recherche im Vault: `---i.appear---/Blogbeiträge für Vitrine auf Website/Neu/22_Datenvisualisierung/`
(Text `_NEU_v2.md`, Grafik `grafik_22_anscombe_v2.html`). Auf Maggys OK mit Standard-Prozess veröffentlicht:

1. **Artikel** mit interaktiver Grafik `blog/figures/grafik_12a_datenvisualisierung.html`
   (Anscombe-Quartett, startet in der Grafik-Ansicht, umschaltbar auf Kennzahlen; Kennzahlen werden live
   aus den Originaldaten berechnet). iframe mit `data-fit-content`-Auto-Resize.
2. **blog/index.html:** Card oben, `data-pin-label="Neu"`; „Wie wir mit KI arbeiten" entpinnt; „125 Jahre"
   behält „Aktuell". JSON-LD `blogPost` ergänzt.
3. **vitrine.html:** Teaser oben, älteste Card („Aufwachsen mit KI", 6. Juni) raus → 4 Cards.
4. **sitemap.xml:** prio 0.7, hreflang de + x-default.
5. **llms.txt:** DE-Blog-Sektion.

**Kein Hero-Bild im Artikel-Body:** Das Hero-JPG (`blog/images/12-datenvisualisierung-hero.jpg`, 700×550,
Headless-Chrome-Render der Grafik + PIL) wäre nur eine Kopie der interaktiven Grafik im Text → wie bei
Artikel 02 Doppelung vermieden. Das JPG dient nur als `og:image` / JSON-LD `image`.

Verifiziert lokal über `localhost:3016`: Artikel desktop + 375 px, iframe-Höhe, Umschalter, Blog-Index-Card,
keine Console-Errors, JSON-LD parsebar, Meta-Description 155 Zeichen.

## Bewusst nicht angefasst

- Untracked Altlasten aus Session 57 bleiben liegen (`dornbirn-auf-eigene-faust.html`, `grafik_07a`, `grafik_11a`,
  `07-125-jahre-hero.jpg`, `_tmp_v3check.html`, `js/network-v3-preview.js`).
- Keine EN-Version (DE-only-Konvention).
