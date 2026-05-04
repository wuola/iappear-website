# Session 24 — Rechtstexte v2 + Namensform-Vereinheitlichung

**Datum**: 2026-05-04 (Montag, Nachmittag — direkt vor Phase B / Launch)

---

Drei Themen abgewickelt:

1. Impressum, Datenschutz und AGB komplett mit Marilenas v2-Quelltexten getauscht — die alten Versionen waren teilweise Hallu (siehe Session 22+23) bzw. inhaltlich veraltet (z.B. fehlende Kleinunternehmer-Angabe, GLN, Mediengesetz-Offenlegung, Tally/GitHub-Pages-Datenschutz).
2. Namensform site-weit vereinheitlicht: `Marilena Tumler e.U.` → `Marilena Tumler` in 43 HTMLs (Meta-Tags + JSON-LD) + llms.txt + CLAUDE.md. Marilena hasst ihren zweiten Vornamen Gabriele; "e.U." passt sowieso nicht (sie ist Kleinunternehmerin, nicht eingetragenes Einzelunternehmen).
3. Subtitle "Informationspflicht laut §5 E-Commerce Gesetz" aus `impressum.html` page-header entfernt — die volle Aufzaehlung steht direkt darunter im Body, war doppelt gemoppelt.

## 1. Rechtstexte komplett ausgetauscht

Quellen lagen lokal in `C:\Users\maggy\OneDrive\Desktop\Website_Neu\Datenschutzt\` als drei v2-Markdown-Dateien:
- `Impressum_v2.md`
- `Datenschutzerklärung_v2.md`
- `Allgemeine Geschäftsbedingungen_v2.md`

Inhalt 1:1 in den Section-Body der drei HTML-Dateien uebernommen, Header/Nav/Footer/Meta-Tags blieben unangetastet. Markdown-zu-HTML-Konvertierung manuell (h2/h3, ul/li, table, strong, a-Tags mit `target="_blank" rel="noopener"` fuer externe Links, mailto-Links).

**Inhaltliche Verbesserungen gegenueber alter Version**:
- **Impressum**: Mediengesetz-Offenlegung (§ 25 MedienG) als eigene Sektion. GLN 9110031812839. 3 GISA-Berechtigungen als Tabelle (Werbeagentur 34641255, Multimedia-Agentur 34641262, IT-Dienstleistungen 34641279). Kleinunternehmer-Hinweis (§ 6 Abs. 1 Z 27 UStG, keine UID).
- **Datenschutz**: 14 nummerierte Punkte. Korrekte Erfassung von GitHub Pages (DPF-zertifiziert), Tally (BV in Belgien, Subprozessoren wie SendGrid/Cloudflare, Tally-DPA), Leaflet/unpkg (Cloudflare) + CARTO Basemaps. DSGVO-Rechte vollstaendig. Beschwerderecht mit DSB-Kontakt. Vorherige Version war ein bunter Mix aus generischem AdSimple-Boilerplate + Session-22-Hallus.
- **AGB**: 13 Punkte + Mediationsklausel. Kleinunternehmerin-Klausel in §3 ausdruecklich (vorher stand falsch "Preise verstehen sich in Euro ohne Umsatzsteuer" — implizierte Reverse-Charge, nicht Kleinunternehmer). Sprachlich konsistent "Auftragnehmerin" (weiblich) statt mal "Auftragnehmer" mal "Auftragnehmerin". Verbraucher:innen-Klauseln wo gesetzlich verpflichtend.

**Rechtsverbindlicher Body-Name**: "Marilena Gabriele Tumler" (so steht's im v2-Markdown, so im Personenstand). Marilenas Wunsch, dass im Marketing/Meta nur "Marilena Tumler" steht — siehe Punkt 2 — beruehrt den Body nicht.

### Methoden-Lehre: Edit auf langem `old_string` scheitert manchmal

Erster Versuch: `Edit` auf den ganzen alten Section-Body von datenschutz.html (~150 Zeilen) → `String to replace not found`. Wahrscheinlich Encoding-Drift bei einem Sonderzeichen (em-dash, typografisches Apostroph oder horizontal ellipsis `…`).

Workaround: `Write` mit kompletter Datei (Header-Block 1:1 aus Read uebernommen, neue Section dazwischen, Footer 1:1). Robuster wenn der Diff gross ist und seltene Sonderzeichen drin sind. Bei impressum + agb hat Edit funktioniert (bei impressum) bzw. Write direkt gewaehlt (bei agb, weil ich aus dem Datenschutz-Fail vorsichtig wurde).

## 2. Namensform `Marilena Tumler e.U.` → `Marilena Tumler`

Hintergrund: Marilenas Wunsch (Maggy hat's an mich weitergegeben). "e.U." passt rechtlich auch nicht, weil sie Kleinunternehmerin ohne Firmenbuch-Eintragung ist; der Zusatz waere irrefuehrend.

**Wo's stand (vor dem Replace)**:
- `<meta name="author">` auf 38 HTML-Seiten
- `<meta name="description">`, `og:description`, `twitter:description` auf impressum/datenschutz/agb/kontakt
- `index.html` Zeile 41 in JSON-LD `"legalName"` (fuer Google Knowledge-Panel)
- `llms.txt` Zeile 5 (fuer KI-Crawler)
- `CLAUDE.md` Zeile 17 (Doku)
- `_doku/recon/`, `_doku/sessions/`, `_doku/_archiv/` (historisch, nicht angefasst)

**Replace via Python-One-Liner** (Bash):
```python
import os, glob
for f in glob.glob('**/*.html', recursive=True):
    if f.startswith('_doku'): continue
    with open(f, 'r', encoding='utf-8') as fh: c = fh.read()
    nc = c.replace('Marilena Tumler e.U.', 'Marilena Tumler')
    if nc != c:
        with open(f, 'w', encoding='utf-8') as fh: fh.write(nc)
```

→ 43 HTML-Dateien upgedated. llms.txt + CLAUDE.md per Edit. Verifikation per Grep: 0 Treffer ausserhalb `_doku/` mehr.

**Body in Impressum/Datenschutz/AGB unangetastet** — da steht weiterhin "Marilena Gabriele Tumler" (rechtsverbindlich). Die Trennung Marketing-Name (kurz) vs. rechtsverbindlicher Name (vollstaendig) ist absichtlich.

### Aufgeklaert: was ist rechtlich Pflicht, was frei?

Auf Maggys Frage hin: Impressumspflicht (§ 5 ECG, § 25 MedienG) bezieht sich nur auf den **Body-Text**, der fuer Besucher sichtbar ist. Meta-Tags / JSON-LD / llms.txt sind keine rechtsrelevante Pflichtangabe — koennen frei gestaltet werden ("i.appear", "Marilena Tumler", oder leer).

## 3. Impressum-Subtitle entfernt

`<p class="page-header__subtitle">Informationspflicht laut §5 E-Commerce Gesetz</p>` raus aus `impressum.html` Zeile 95. Inhalt steht direkt darunter im Body in Vollform (mit allen 4 Paragraphen), war doppelt.

## E-Mail-Trennung: `info@` vs `marilena@`

Klar gemacht und so belassen:
- **Body-Text Impressum/Datenschutz/AGB**: `marilena@iappear.app` (Verantwortliche/Datenschutz-Kontakt)
- **Alles andere** (kontakt.html, Footer, Tally-Form-Notification, Meta-Tags): `info@iappear.app` (Marketing/allgemein)

Diese Trennung war schon im v2 so vorgesehen — keine Aenderungsaktion noetig.

## Akzeptiert-bleibt: ß in Rechtstexten, ss anderswo

CLAUDE.md-Konvention sagt `ß → ss` site-weit. Marilenas v2-Texte verwenden aber `ß` (Mozartstraße, ausschließlich, gemäß, Maßnahmen, ...). Maggys Entscheidung: in den Rechtstexten **lassen wie geliefert**. Inkonsistenz zwischen Rechtstexten (mit ß) und Rest der Site (ohne ß) wird in Kauf genommen, weil rechtliche Texte "originalgetreu" bleiben sollen.

## Verifikation

- Lokale Preview (`localhost:5173`) durchgesehen via `preview_snapshot` fuer alle drei Seiten:
  - impressum.html: Subtitle weg, Stand-Hinweis, alle 12 Sektionen + GISA-Tabelle korrekt gerendert.
  - datenschutz.html: Browser-Cache hatte zunaechst noch alte Version → `window.location.reload(true)` erzwang Hard-Reload, danach 14 nummerierte Sektionen sauber sichtbar.
  - agb.html: Stand + Vertragspartnerin-Header + alle 13 Sektionen + Mediationsklausel korrekt.
- Grep nach `Marilena Tumler e\.U\.` zeigt 0 Treffer ausserhalb `_doku/`.
- Sektion-fuer-Sektion-Vergleich v2.md vs. HTML manuell durchgegangen, keine Auslassungen.

## Stand am Ende der Session

- 3 Rechtstexte vollstaendig gegen v2-Quelltexte ausgetauscht.
- Namensform site-weit vereinheitlicht.
- 43 HTMLs + llms.txt + CLAUDE.md updated.
- settings.local.json wieder auf Stub zurueckgesetzt (war ein `nslookup`-Auto-Eintrag drin).
- Phase A wirklich erledigt — Phase B (DNS-Switch + CNAME re-add) steht weiter offen.

## Lehren dieser Session

1. **Bei langem old_string in Edit kann Encoding-Drift zuschlagen** — bei Sonderzeichen wie em-dash / horizontal ellipsis. Wenn Edit fehlschlaegt: `Write` mit kompletter Datei ist robuster.
2. **Body-Texte = rechtsverbindlich. Meta-Tags = frei.** Diese Trennung gezielt nutzen: vollstaendiger Personenstands-Name nur dort wo's gesetzlich vorgeschrieben ist; im Marketing kuerzeren Markennamen verwenden.
3. **Bei Massen-Replace ueber viele Dateien**: Python-One-Liner via Bash (filter `_doku/` raus) ist sauberer als 40+ Edit-Calls. Verifikation mit Grep im Anschluss.
4. **Maggy-Patzer von mir am Anfang**: Erster Antwort-Block enthielt "ich mache das alles parallel". Maggy hat unterbrochen ("warte, was tust du da die ganze zeit"). Lehre: bei vielen Schritten erst kurz ankuendigen WAS und in welcher REIHENFOLGE, dann ausfuehren. Sichtbarkeit > Geschwindigkeit.
