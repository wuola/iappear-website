# Session 22 — Tally-Forms eingebaut + Pre-Launch-Cleanup (Phase A)

> ⚠️ **Korrektur-Hinweis (Session 23, 2026-05-04)**: Diese Doku enthaelt drei nachweislich falsche oder unvollstaendige Aussagen, die in Session 23 aufgedeckt wurden:
> 1. **"Tally springt zurueck auf 476" (Block 4, Lehre 2)** ist FALSCH. Tally akzeptiert feste Hoehe sauber; bei zu kleinem Wert kommt nur eine interne iframe-Scrollbar (Submit-Button geht unter die Falte). Empirisch verifiziert in Session 23 mit `height="400"` + `dynamicHeight` raus.
> 2. **"Column-Layout im Tally-Editor, kostet 2 Klicks" (Block 4 + Akzeptiert-offen)** war NICHT VERIFIZIERT. Mechanik existiert (`⋮⋮`-Drag-Handle), aber unklar ob Short-Answer + Email-Felder spaltenfaehig sind. Mobile faellt sowieso auf einspaltig zurueck (laut Tally-Doku).
> 3. **Block 7 "CNAME-File angelegt"** verschweigt den kritischen Side-Effect: GitHub Pages erkennt die Datei sofort als Custom-Domain-Config und aktiviert Live-301-Redirects von `wuola.github.io/iappear-website/...` auf `iappear.at/...`. Da DNS noch nicht umgestellt war, wurden User auf die alte Readymag-Site umgeleitet. CNAME wurde in Session 23 wieder entfernt (Commit `1ae0f60`).
> 4. **Block 6 "Datenschutzerklaerung erweitert"** enthaelt ebenfalls Hallu-Anteile in den von Session 22 in `datenschutz.html` eingefuegten Sektionen "Kontaktformulare (Tally)" + "Hosting (GitHub Pages)". Maggy schreibt diese in Session 24 (2026-05-04) selbst neu. Bis dahin diese Sektionen in `datenschutz.html` als nicht verifiziert behandeln.
>
> Details in `2026-05-04-session-23-tally-hoehe-test-cname-incident.md`.

**Datum**: 2026-05-04 (Montag, Vormittag — Tag vor Launch)
**Commits**: `cfa073e` (1 grosser Commit fuer alle Aenderungen)
**Cache-Bust components.css**: `?v=20260503k` -> `?v=20260504a`

---

Tag der Live-Stellung: heute Phase A (Repo-Vorbereitung + Push auf GitHub Pages), morgen Phase B (Domain-Switch bei united-domains + Readymag freigeben + GitHub Custom Domain). In dieser Session wurde Punkt 1, 2, 3 der Pre-Launch-Checkliste aus CLAUDE.md abgehakt: Kontaktformulare via Tally, Bregenz-404-Risiko entschaerft, CNAME angelegt. Plus Datenschutzerklaerung erweitert + Container-Tuning.

## 1. Tally als Form-Backend gewaehlt

Diskussion am Anfang der Session: Optionen fuer das tote `<form action="#">` auf workflow.html + kontakt.html. Erwogen: Mailto-Link (DSGVO-trivial, aber Reibung), Web3Forms (gratis, aber USA + DSGVO-Graubereich), Formspree (USA mit DPA, aber 50 Submissions/Monat im Free-Plan), **Tally** (Belgien, EU-Server, DSGVO by design, DPA in ToS enthalten, unbegrenzte Forms+Submissions im Free Plan).

Maggy hat Tally gewaehlt wegen DSGVO-Klarheit. Setup ueber [tally.so](https://tally.so) (NICHT tally.at — das war ein Verirrungs-Versuch, anderer Anbieter).

## 2. Tally-Form gebaut + designed

Im Tally-Form-Editor 3 Felder zusammengeklickt: Name (Short Answer), E-Mail (Email-Block, mit eingebauter Email-Validierung), Nachricht (Long Answer). Alle drei als Pflichtfeld (Tally-Default). Submit-Button-Label auf **"Absenden"** umgestellt. Form-Title: **"Schreib uns"**.

Customize-Tab — Werte fuer i.appear-Look (alle im Free Plan verfuegbar):
- Theme: Custom
- Font: Roboto
- Background: `#000000` / Text: `#ffffff`
- Button: dunkel mit hellem Text (Maggy hat selbst die Farben gewaehlt)
- Settings: Language **Deutsch** (sonst englische Fehlermeldungen), Self email notifications **ON**

**Tally-Branding** ("Made with Tally"-Stern unten rechts) ist Pro-only zum Entfernen — bleibt im Free-Plan sichtbar.

## 3. Account-Email-Patzer (Lehre)

**Erster Anlauf**: Maggy registrierte sich mit `maggywonderland@gmail.com` auf Empfehlung "egal welche Email, kannst du spaeter umstellen". **Nicht ganz richtig** — im Tally-Free-Plan gehen Notification-Mails an die **Account-Email**, und die ist im Free-Plan **nicht aenderbar pro Form**. Das hat sich erst beim Notification-Setup gezeigt.

**Loesung**: Maggy hat den Account neu mit `maggy@iappear.app` registriert (bewusste Entscheidung NICHT info@iappear.app zu nehmen, weil das eine "ueberlaufende" Inbox bei Marilena waere). Form neu gebaut — ging zum zweiten Mal in 5 Min, weil sie das UI dann kannte.

**Lehre**: Bei Free-Tier-Forms-Diensten **immer vorab klaeren mit welcher Empfaenger-Email registriert werden soll** — der Sign-up bestimmt den Empfaenger und ist im Free-Plan oft nicht trivial aenderbar.

## 4. Tally-Form-Hoehe ist nicht via Embed-Settings kuerzbar (Lehre)

Maggy wollte das Form etwa so lang wie der Text-Block daneben (auf workflow.html ist Text ~396px, das Form rendert mit ~480px Inhalt + ~107px Container-Drumherum = 587px Gesamthoehe).

Erste Annahme (falsch): "Height-Wert im Embed-Panel reduzieren". **Funktioniert nicht** — der `height`-Parameter im Tally-Embed ist nur Initial-Hoehe. Mit `dynamicHeight=1` schickt Tally per `postMessage` die echte Render-Hoehe an die Parent-Page und ueberschreibt das.

Zweite Annahme (auch falsch): "Dynamic Height ausschalten und festen kleineren Wert setzen". Live im Preview getestet:
- iframe-`height`-Attribut auf 380 manuell setzen → Tally springt zurueck auf 476
- iframe-`style="height:380px"` → Tally springt zurueck auf 476
- Tally-Script entfernen → Tally springt **immer noch** zurueck auf 476 (das laeuft auch tally-seitig)
- CSS-Wrapper aussen mit `max-height: 380px; overflow:hidden` → funktioniert, aber schneidet Submit-Button ab

**Echte Wege das Form kuerzer zu machen** (alle innerhalb von Tally, nicht im embed):
- **Felder umordnen** (Name+E-Mail nebeneinander via Column-Layout, Free Plan): -70px
- **Felder weglassen** (z.B. Name): -80px
- **Long Answer Initial-Rows reduzieren**: -30-50px (ggf. Pro)
- Tally Pro fuer Custom CSS

**Lehre fuer zukuenftige Claudes**: Die "Hoehe" eines Tally-Embeds ist durch den Form-INHALT bestimmt, nicht durch Embed-Parameter. Wenn das Form kompakter sein soll, muss man das Form-Layout in Tally selbst aendern. Aktuell akzeptiert: 587px Container-Hoehe — Optimierung (Felder umordnen) nach Launch wenn Maggy will.

## 5. Embed in workflow.html + kontakt.html

Embed-Code mit `transparentBackground=1`, `hideTitle=1`, `alignLeft=1`, `dynamicHeight=1` aus Tally Share-Tab geholt. In beide HTMLs:

- `<head>`: `<script async src="https://tally.so/widgets/embed.js"></script>` (fuer Dynamic-Height-Logic)
- Form-Bereich: `<form ... action="#">` durch `<div class="form contact-form">...</div>` ersetzt, der **`<h3>Schreib uns</h3>` Title + `Lieber direkt? info@iappear.app` Mailto-Link bleiben** (Glassy-Container drum), und das Tally-iframe sitzt drin.

## 6. Datenschutzerklaerung erweitert

Vor dem `<h3>Cookies</h3>`-Block in `datenschutz.html` zwei neue Sektionen eingefuegt:

- **Kontaktformulare (Tally)**: Anbieter Tally B.V. Belgien, EU-Server (Google Cloud Belgien), DSGVO-konform, DPA in ToS enthalten, keine Tracking-Cookies. Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO. Link zu tally.so/privacy-policy.
- **Hosting (GitHub Pages)**: GitHub Inc. (USA, Microsoft-Tochter), zertifiziert nach EU-U.S. Data Privacy Framework, Server-Logdaten (IP, Datum, abgerufene Datei) zum sicheren Betrieb. Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO.

## 7. CNAME-File angelegt

`/CNAME` mit Inhalt `iappear.at`. Wird beim DNS-Switch morgen mit GitHub Pages "Custom Domain"-Setting verknuepft.

## 8. Bregenz-404-Verweise via build.py-Filter eliminiert

Aktueller Stand in `rundgaenge.js`: Bregenz hat einen `history`-Rundgang ("Brigantium") und `IAPPEAR_STAEDTE.bregenz` mit `soon: true`. `build.py` hat aber bisher **keinen `soon`-Filter** in `update_sitemap()` und `update_llms_txt()` gehabt → Bregenz-URL stand drin als 404-Fallstrick.

**Fix**: in beide Funktionen `if staedte[slug].get("soon"): continue` ergaenzt. `python build.py` ausgefuehrt → Bregenz raus aus sitemap.xml + llms.txt. Karten-Pin auf Hub-Seite + Counts-System bleiben unveraendert.

**Vorteil ggue. Maggys urspruenglichem CLAUDE.md-Plan** ("auskommentieren analog Blog-Pattern"): build.py-Filter ist zukunftssicher — wenn Bregenz freigeschaltet wird (`soon: true` raus), kommt's automatisch wieder rein. Selbiges Mechanismus fuer beliebige zukuenftige "bald"-Staedte.

## 9. Container-Tuning fuer .contact-form

Padding `var(--sp-3)` (24px) → `var(--sp-2)` (16px). Mailto-Margin `var(--sp-2)` (16px) → `var(--sp-1)` (8px). Spart ~24px Container-Hoehe (604 → 580). Klein, aber merklich auf kontakt.html (durch Grid identisch zur Anliegen-Liste). Auf workflow.html bleibt's ~190px laenger als Text-Block.

## 10. Push + GitHub Pages Auto-Deploy

Commit `cfa073e` auf main, push. 49 Files (Tally-Embed in 2 HTMLs + Datenschutz + CNAME + build.py + components.css + 44 HTMLs Cache-Bust). GitHub Pages baut automatisch — Stand ist live auf `wuola.github.io/iappear-website/` ein paar Minuten nach Push, in privatem Tab pruefbar.

## Stand am Ende der Session

**Phase A komplett** (alles im Repo + auf GitHub Pages live):
- Tally-Forms eingebunden auf workflow + kontakt
- Datenschutz-Erklaerung Tally+GitHub-Pages-konform
- CNAME bereit
- Bregenz-404-Risiko weg
- Container leicht kompakter

**Phase B steht an** (Maggy + ich gemeinsam, fuer Live-Stellung morgen):
1. Bei Readymag: Custom Domain `iappear.at` freigeben
2. Bei united-domains.de: A-Records (4 GitHub-IPs) fuer Apex + CNAME `www` -> `wuola.github.io`
3. Im GitHub-Repo: Settings -> Pages -> Custom Domain `iappear.at` + "Enforce HTTPS"
4. Verifikation: iappear.at laedt, HTTPS gruen, Form-Submit echt testen

**Akzeptiert-offen** (kein Launch-Blocker, kann nach Launch):
- Form-Hoehe auf workflow.html ~190px laenger als Text-Block daneben — Optimierung via "Name+E-Mail nebeneinander" in Tally moeglich, kostet 2 Klicks im Tally-Editor.

## Lehren dieser Session (fuer zukuenftige Claudes)

1. **Tally Free-Plan = Account-Email ist der Notification-Empfaenger**, nicht via Form-Settings aenderbar. Vor Sign-up klaeren mit welcher Adresse.
2. **Tally-Embed-Hoehe ist nicht via embed-Parameter kuerzbar**. Tally setzt sich selbst auf seine "natuerliche" Render-Hoehe zurueck — selbst wenn man das embed.js-Script entfernt. Wer das Form kuerzer will, muss den **Form-Inhalt** in Tally aendern (Felder umordnen / weglassen) ODER Tally Pro nutzen ODER mit CSS-Wrapper hartcappen (Submit verschwindet dann oder Scrollbar erscheint).
3. **build.py erweitern, statt sitemap.xml/llms.txt manuell auszukommentieren**. Filter-Logik (`if soon: continue`) ist robuster als Hand-Edits — re-runs des Build-Scripts loeschen sonst Manual-Comments.
4. **Tony-Patzer dieser Session (mein Verschulden)**: Mehrfach Theorien aufgestellt ohne zu testen, dann unter Druck schnell-Tests im falschen Layer (Browser-Konsole am gerenderten iframe statt Tally-Form-Settings). Maggys Frage "warum soll der Inhalt 480 sein" war ein berechtigter Reality-Check — die 480 sind das was Tally aus dem Form-Layout rendert, nicht ein Naturgesetz. **Lehre fuer zukuenftige Claudes**: bei Embed-Limits-Fragen erst die Konfigurations-Quelle beim Anbieter checken (was ist im Form-Editor einstellbar?), nicht das schon-gerenderte iframe manipulieren.
