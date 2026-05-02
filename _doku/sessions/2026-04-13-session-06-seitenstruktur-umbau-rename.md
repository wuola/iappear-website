# Session 6 - Seitenstruktur-Umbau + Rename

**Datum**: 2026-04-13  
**Quelle**: aus CLAUDE.md (Stand 2026-05-02), unveraendert uebernommen.

---

- Session 6 (Seitenstruktur-Umbau + Rename, 2026-04-13):
  - **Startseite entschlackt**: index.html ist jetzt kompaktes "Schaufenster" mit Teaser-Karten statt langer Scroll-Collage. Hero + Netzwerk bleiben, alles andere sind kurze Teaser → eigene Seiten
  - **Neue eigene Seiten**: features.html, vitrine.html, ueber-uns.html (Inhalte 1:1 aus index.html ausgelagert)
  - **Blog + Vitrine verschmolzen**: "Blog" gibt es nicht mehr als eigenen Bereich. vitrine.html zeigt Kacheln (aus vitrine.js) + Artikel-Links. blog/index.html leitet per meta-refresh auf vitrine.html weiter. Die 2 bestehenden Blog-Artikel bleiben unter blog/*.html, Breadcrumbs zeigen auf Vitrine.
  - **i.dentity Rename**: "Erlebnisse" → "Regionale Identitaet" in allen Burger-Menues, Breadcrumbs, Eyebrows, Schema, JS, llms.txt, CLAUDE.md. Hero-Claim "digitale Erlebnisse" bewusst unveraendert.
  - **Nav-Links**: Alle #anchor-Links durch echte Seiten-Links ersetzt (features.html, vitrine.html, ueber-uns.html)
  - **Sitemap + llms.txt** aktualisiert
  - **Hero-Layout nach Readymag-Vorbild**: Lorbeerkranz + Awards kleiner und links, Logo kleiner, Phones nebeneinander (flex-wrap: nowrap) direkt unterm Logo, "JETZT STARTEN" Button unter den Phones, Social Media Icons (Instagram + LinkedIn) rechts unten. Alles above the fold sichtbar.
  - **Phone-Groessen**: `.phone` max 160px breit (vorher 220px), `.hero__logo` max 240px (vorher 460px)
  - **Vitrine-Links**: Alle 22 Kachel-Links aus Readymag extrahiert und in vitrine.js eingetragen (vorher alles `#`)
  - **Vitrine-Artikel-Seiten (22/22)**: Alle 22 Kacheln haben eigene SEO-Seiten in `vitrine/`. Template mit Hero-Bild, Schema.org BlogPosting, Breadcrumbs, Text aus Originalquellen, Link zum Original. vitrine.js verlinkt intern auf alle Seiten.
  - **Vitrine-Bild-Zuordnungen korrigiert**: award.png→ISTD, inno.png→Re-Design, inno2.png→Tourismus-Sonderpreis
  - **Cache-Bust**: vitrine.js auf `?v=6` in vitrine.html
