# Fonts auf iappear.at

Stand: 2026-04-14 (Session 7)

## Was wir verwenden

Zwei Schriftfamilien, beides selbst gehostet (DSGVO-konform, kein Google-Fonts-CDN):

| Rolle | Schrift | Datei | Weight |
|---|---|---|---|
| Body, UI, Buttons, Nav | **Roboto** Variable | `assets/fonts/Roboto-Variable.ttf` | 100–900 |
| Body italic | Roboto Variable Italic | `assets/fonts/Roboto-Variable-Italic.ttf` | 100–900 |
| H3, H4, kleine Headlines | **TheSerif** HP5 Plain | `assets/fonts/TheSerif-HP5Plain.otf` | 400 |
| Serif italic | TheSerif HP5 Plain Italic | `assets/fonts/TheSerif-HP5PlainIT.otf` | 400 italic |
| H2, Sektions-Ueberschriften | **TheSerif** HP6 SemiBold | `assets/fonts/TheSerif-HP6SeBld.otf` | 600 |
| H1, Hero-Claim, fette Akzente | **TheSerif** HP9 Black | `assets/fonts/TheSerif-HP9Blk.otf` | 900 |

`@font-face` Block: `css/global.css` ganz oben.
CSS-Variablen: `--f-sans` (Roboto), `--f-serif` (TheSerif).

## Typo-Hierarchie

```
H1 → TheSerif Black 900,    clamp(2rem, 5vw, 4rem),     letter-spacing -.01em
H2 → TheSerif SemiBold 600, clamp(1.75rem, 3.5vw, 2.75rem), letter-spacing .01em
H3 → TheSerif SemiBold 600, clamp(1.25rem, 2vw, 1.6rem)
H4 → TheSerif Plain 400
Body / p → Roboto 400, 16px, line-height 1.6
Eyebrow → Roboto italic 400, .95rem, color: muted
.section-title → uppercase + letter-spacing .15em
```

## Warum diese Auswahl

- **Roboto fuer Body**: bester Lesbarkeit auf Screens, klassische Wahl, gratis (Apache License). Variable Font deckt alle Gewichte in einer Datei (~340 KB).
- **TheSerif (LucasFonts) fuer Headlines**: das ist die Schrift, die Marilena/Maggy schon auf Readymag verwendet haben (`custom_172070`). Eleganter humanistischer Serif, passt zum Marken-Auftritt "elegant, dunkel, modern".
- **Mix Sans+Serif**: klassische Editorial-Kombi, modern und ruhig.

## Alternative Schnitte verfuegbar (nicht eingebunden)

Die komplette LucasFonts-Familie liegt bei dir lokal in:
`C:\Users\maggy\OneDrive\Dokumente\Promo_Iappear...\NEUE_FONTS_2025\Fonts i.appear\`

Verfuegbare TheSerif-Schnitte (Roman + Italic):

| File | Weight | Verwendung |
|---|---|---|
| TheSerif-HP2ExLig | 200 ExtraLight | sehr duenne Display |
| TheSerif-HP3Lig | 300 Light | duenne Subhead |
| TheSerif-HP4SeLig | 350 SemiLight | weiche Subhead |
| **TheSerif-HP5Plain** | 400 Regular | ✓ eingebunden |
| **TheSerif-HP6SeBld** | 600 SemiBold | ✓ eingebunden |
| TheSerif-HP7Bld | 700 Bold | klassischer Bold |
| TheSerif-HP8ExBld | 800 ExtraBold | sehr fett |
| **TheSerif-HP9Blk** | 900 Black | ✓ eingebunden |

Auch verfuegbar: komplette **TheSans** (LucasFonts) Familie (TheSansOsF Plain/Light/SemiLight/SemiBold/Bold/ExtraBold/Black + Italics) und **TheSans Mono** in W2-W9. Falls Marilena spaeter Body auf TheSans statt Roboto haben will, einfach analog ins `@font-face` aufnehmen und `--f-sans` umstellen.

## Aenderung der Auswahl (z.B. Marilena will andere Schrift)

1. Neue .otf/.ttf nach `assets/fonts/` kopieren
2. `@font-face` Block in `css/global.css` (oben) ergaenzen oder ersetzen
3. Falls Familienname sich aendert: `--f-sans` / `--f-serif` in `:root` anpassen
4. Falls Weight-Mapping anders: `h1`/`h2`/`h3` in `css/global.css` (Typografie-Block, ~Zeile 110-120) anpassen
5. Cache-Bust hochzaehlen: in allen HTMLs `?v=YYYYMMDD[a-z]` auf neues Datum
6. Im privaten Fenster verifizieren

## Was wir NICHT verwenden (und warum)

- **Google Fonts CDN**: DSGVO-Risiko (IP-Logging in USA), ausserdem langsamer als selbst gehostet
- **Roboto-Black als separate Datei**: Roboto Variable deckt 100–900 in einer Datei ab, kein Grund fuer Einzel-Schnitte
- **Maison Neue / Switzer / Surt** aus `C:\dev\iappear\public\fonts\`: das ist ein anderes Dev-Projekt, nicht i.appear
- **TheSans** (vorerst): Roboto ist objektiv besser fuer Body-Lesbarkeit. Kann bei Bedarf geaendert werden (siehe oben).

## Live-Vergleich Readymag

Die alte Readymag-Seite laedt:
- Google Fonts Roboto in 4 Gewichten (300/400/500/700) — wir decken das mit Roboto Variable ab
- Eine custom-uploaded Schrift `custom_172070` — sehr wahrscheinlich TheSerif, die Marilena ins Readymag-Schriftsystem hochgeladen hat

Unsere neue HTML-Seite ist also visuell sehr nah am Original, nutzt aber die echten LucasFont-Dateien direkt statt eines Readymag-Wrappers.
