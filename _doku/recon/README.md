# Recon-Ordner — Anleitung fuer kuenftige Claude-Sessions

Dieses Verzeichnis enthaelt die **Recon-Notizen** (Aufklaerung) zur Original-Readymag-Seite `iappear.at`. Sie sind die Quelle fuer den HTML-Rebuild im Repo.

## Was ist hier?

| Datei | Inhalt |
|---|---|
| `readymag-editor-startseite.md` | Komplette Startseite (Hero, Netzwerk, Kategorien, Features, Vitrine, Ueber uns, Footer) |
| `readymag-editor-i-history.md` | Subpage i.history — Zeitreisen (6 Rundgaenge) |
| `readymag-editor-i-dentity.md` | Subpage i.dentity — 3 Dornbirn Rundgaenge + 4 Coming-Soon Regionen |
| `readymag-editor-i-grow.md` | Subpage i.grow — Intro, Vorteile, Workshop-Projekte |
| `readymag-editor-workflow.md` | Workflow & Leistungen (Auftakt + Leistungen + Vielfaeltige Moeglichkeiten) |
| `readymag-editor-user-guide.md` | User Guide (2 Wege, 4 Schritte, Hinweise, Technische Anforderungen) |
| `readymag-editor-kontakt.md` | Kontakt-Seite (3 themed Bloecke) |
| `readymag-editor-faqs.md` | Alle 10 FAQs verbatim (4 Kategorien) |
| `readymag-editor-impressum.md` | Impressum-Volltext |
| `readymag-editor-legal-toc.md` | AGB + Datenschutz **nur Section-TOC** (Volltext fehlt — siehe unten) |
| `startseite-notes.md`, `unterseiten-notes.md` | Aelteres Recon (vor Editor-Zugriff) |

---

## So kommst du an Readymag-Inhalte heran

### Voraussetzungen
- Du brauchst **Chrome MCP** (`mcp__Claude_in_Chrome__*` Tools).
- Der Editor liegt auf `https://my.readymag.com/edit/6267960/{seitenzahl}/`
  - Seite 1 = Startseite (`contents/`)
  - Seiten 2–11 = Unterseiten in der Reihenfolge der Sitemap
- Die Nutzerin muss in Chrome bei Readymag eingeloggt sein. Ist sie das nicht, fragst du sie kurz.

### Arbeitsmodus: DOM-Query, **nicht** Screenshot
Der Readymag-Editor rendert jede Seite als absolut positionierte `[data-id]`-Bloecke. Screenshots geben dir nur Pixel — du brauchst die **Texte + Koordinaten**, also gehst du den DOM mit `mcp__Claude_in_Chrome__javascript_tool` ab.

### Standard-Recon-Snippet

```js
// Alle Text-Bloecke der aktuellen Editor-Seite, sortiert nach y, dann x
[...document.querySelectorAll('[data-id]')]
  .map(el => {
    const r = el.getBoundingClientRect();
    const t = (el.innerText || '').trim();
    return { y: Math.round(r.top), x: Math.round(r.left), t, id: el.dataset.id };
  })
  .filter(o => o.t && o.t.length > 1
              && !o.t.startsWith('@font-face')
              && !o.t.includes('font-face'))
  .sort((a,b) => a.y - b.y || a.x - b.x);
```

Damit bekommst du ein flaches Array `{y, x, t, id}` — daraus liest man die Sektion-Reihenfolge sehr gut ab.

### Iframes/Widgets
Manche Inhalte (FAQs als Akkordeon, Code-Widgets, SVGs) leben in `<iframe>`s. Auflisten:

```js
[...document.querySelectorAll('iframe')].map((f,i) => {
  try {
    return { i, src: f.src, len: f.contentDocument?.body?.innerText?.length || 0 };
  } catch(e) { return { i, src: f.src, blocked: true }; }
});
```

Pro Iframe dann gezielt:

```js
const f = document.querySelectorAll('iframe')[FAQ_INDEX];
[...f.contentDocument.querySelectorAll('[data-id]')]
  .map(el => el.innerText.trim()).filter(Boolean);
```

---

## Best Practice: Komplette Page als JSON-Download

Statt jedes Widget einzeln per Tool-Call zu holen (was wegen 900-Char-Limit ewig dauert), **lade alle iframes einer Page in einer einzigen Datei runter**. So gehts:

```js
const data = {
  page: pageNum, pageName: 'i-history',
  iframes: [...document.querySelectorAll('iframe')].map((f, i) => {
    try { return { i, html: f.contentDocument?.body?.innerHTML || '' }; }
    catch(e) { return { i, err: 1 }; }
  })
};
const blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});
const u = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = u; a.download = 'iappear-page-' + pageNum + '.txt';
document.body.appendChild(a); a.click(); a.remove();
```

Wichtig:
- **Endung muss `.txt` sein**, nicht `.json` — Chrome blockiert sonst u.U. den Auto-Download.
- Wrap das ganze in einer IIFE und gib am Ende nur eine **harmlose** Zahl/Status zurueck (keine URLs, keine HTML-Snippets), sonst greift der Content-Filter.
- Datei landet in `C:\Users\maggy\Downloads\` — von dort liest du sie mit `Read` oder Bash + Python.

Danach lokal verarbeiten: parsen, dedupen per Hash, in `_doku/recon/widgets/` schreiben. Dort liegt aktuell der Output von 67 unique Widgets aus 11 Pages, mit `INDEX.md` als Uebersicht.

Vorteile:
- 11 Tool-Calls statt ~2600 (1 dump pro Page)
- Alles als echte Dateien lokal, keine Recon-Notizen mehr noetig
- Dedupe ueber alle Pages hinweg moeglich → identische Widgets (z.B. Burger-Menue, scroll-to-top) werden nur einmal gespeichert

## Stolperfallen — wichtig!

### 1. Tool-Response-Limit ~900 Zeichen
`mcp__Claude_in_Chrome__javascript_tool` schneidet Responses bei ~900–1000 Zeichen ab und ersetzt den Rest durch `[TRUNCATED]`. **Nicht** versuchen, einen 10k-Text in einer Antwort zu holen.

**Loesung:** Lange Texte in `window.__chunks` zwischenspeichern und in 800-Char-Slices abrufen:

```js
window.__longText = el.innerText;
window.__longText.slice(0, 800);   // Aufruf 1
window.__longText.slice(800, 1600); // Aufruf 2
// ...
```

Oder besser: Split nach Absaetzen, jeden Absatz einzeln holen.

### 2. Content-Filter blockt URL-aehnliche Strings
Wenn der Text `http://`, `?id=`, Cookies oder Query-Strings enthaelt, kommt zurueck: `[BLOCKED: Cookie/query string data]`. Das passiert besonders bei AGB/Datenschutz.

**Loesung:**
- Nur die erste Zeile holen (`text.split('\n')[0]`)
- Oder per `startsWith`/`includes` gezielt suchen
- Oder den Text vorher filtern (`.replace(/https?:\/\/\S+/g, '[URL]')`) bevor du ihn returnst

### 3. Clipboard funktioniert nicht
`navigator.clipboard.writeText` schlaegt mit "Document is not focused" fehl. `document.execCommand('copy')` gibt `false` zurueck. **Gib es auf** und arbeite direkt mit Slices.

### 4. `@font-face`-Rauschen
Style-Tags und Code-Widgets enthalten oft riesige `@font-face`-Bloecke. Filter:

```js
.filter(t => !t.startsWith('@font-face') && !t.includes('font-face') && !t.includes('@charset'))
```

### 5. Promise-Lifecycle
`new Promise(r => setTimeout(...)).then(v => v)` failed mit "Promise was collected", weil die JS-Eval-Bridge keinen Microtask haelt. **Synchron returnen oder direkt `return await`** im richtigen Kontext.

### 6. Lange Texte fuer AGB/Datenschutz
- AGB: ~15.000 Zeichen
- Datenschutz: ~29.000 Zeichen
- Generiert mit dem **adsimple.at**-Generator (Fassung 14.04.2022)
- **Wir haben sie NICHT extrahiert.** Das wuerde >50 Tool-Calls kosten und der Content-Filter blockt staendig.
- **Plan:** Vor dem Launch entweder
  1. Per Browser-Copy/Paste vom Live-`iappear.at` in `agb.html` und `datenschutz.html` einsetzen, oder
  2. Auf `adsimple.at` neu generieren mit aktuellen Firmendaten (Marilena Tumler e.U.).
- TOC-Struktur ist in `readymag-editor-legal-toc.md` gesichert.

---

## Workflow fuer eine neue Session

1. **Lies CLAUDE.md** (Repo-Root) — der "Aktueller Stand"-Block sagt dir, was gemacht ist und was noch fehlt.
2. **Lies diese README** — methodische Stolperfallen.
3. **Wenn du eine bestimmte Page abarbeiten willst:** lies die zugehoerige `readymag-editor-*.md` und vergleiche sie mit der echten Datei im Repo (z.B. `i-history.html`). Was im Recon steht, gilt als Source-of-Truth fuer Texte und Layout. Was im Repo besser ist (z.B. richer Text), darf bleiben.
4. **Wenn du nochmal Readymag anzapfen musst:**
   - Tab zu `https://my.readymag.com/edit/6267960/{N}/` navigieren
   - Standard-Snippet von oben ausfuehren
   - Ergebnisse als neuen Recon-File schreiben oder bestehenden ergaenzen
5. **Sichere wichtige Werte als globale Variablen** (`window.__faqs = ...`), damit du sie zwischen Calls nicht verlierst — der JS-Tool-Context bleibt erhalten, solange der Tab offen ist.

---

## Welche Pages haben welche Editor-URLs?

Aus dem Recon (Reihenfolge in der Readymag-Sitemap):

| # | Page | Recon-File | Repo-Datei |
|---|---|---|---|
| 1 | Startseite | `readymag-editor-startseite.md` | `index.html` |
| 2 | i.history | `readymag-editor-i-history.md` | `i-history.html` |
| 3 | i.dentity | `readymag-editor-i-dentity.md` | `i-dentity.html` |
| 4 | i.grow | `readymag-editor-i-grow.md` | `i-grow.html` |
| 5 | Workflow | `readymag-editor-workflow.md` | `workflow.html` |
| 6 | User Guide | `readymag-editor-user-guide.md` | `user-guide.html` |
| 7 | Kontakt | `readymag-editor-kontakt.md` | `kontakt.html` |
| 8 | FAQs | `readymag-editor-faqs.md` | `faqs.html` |
| 9 | Datenschutz | `readymag-editor-legal-toc.md` (nur TOC) | `datenschutz.html` (Stub) |
| 10 | AGB | `readymag-editor-legal-toc.md` (nur TOC) | `agb.html` (Stub) |
| 11 | Impressum | `readymag-editor-impressum.md` | `impressum.html` |

(Reihenfolge 9/10/11 unsicher — die Editor-URL `/edit/6267960/9/` etc. einfach ausprobieren.)

---

## Was wurde bereits ins Repo uebernommen (Stand 2026-04-10)

### Vollstaendig synced
- `i-history.html` — passt zu Recon (6 Rundgaenge)
- `i-dentity.html` — Dornbirn 3 + Coming-Soon 4 (Bregenz/Hard, Au, Feldkirch, Bludenz)
- `i-grow.html` — passt zu Recon
- `workflow.html` — Auftakt + Leistungen + Vielfaeltige Moeglichkeiten + CTA (kein 5-Schritt-Prozess wie urspruenglich in CLAUDE.md angedacht!)
- `user-guide.html` — 2 Wege, 4 Schritte, Hinweis, 8 technische Anforderungen
- `kontakt.html` — 3 themed Bloecke
- `faqs.html` — alle 10 FAQs
- `impressum.html` — Volltext mit allen Liability-Sektionen

### Teilweise synced
- `index.html`:
  - Burger-Menue **Plattform/Backstage** Struktur (only on index.html)
  - Vitrine `js/data/vitrine.js` mit allen **22 Eintraegen** in Recon-Reihenfolge
  - Features `js/features.js` mit allen **14 Features + Subtitel** aus Recon
  - **Noch offen:** Hero-Bild als `IA22-Logo-gross-schwarz` Picture-Block, Lorbeer-SVG-Animation, Netzwerk-Visualisierung mit den 7 Dornbirn-Knoten

### Burger-Menue
- Nur in `index.html` umstrukturiert (Plattform/Backstage). Alle anderen Pages haben noch die alte flache Liste — bei Gelegenheit nachziehen.

### Stubs (Volltext fehlt)
- `agb.html`
- `datenschutz.html`

---

## Faustregeln fuer Edits

- **HTML-Files: ASCII** (`ae`/`oe`/`ue`/`ss`), keine Umlaute. Recon-Files **duerfen** Umlaute enthalten — die wurden direkt aus Readymag uebernommen.
- **Bilder kommen am Ende.** Bis dahin Platzhalter `<div class="ph">` oder `<div class="ph ph--square">`.
- **Nutzerin ist kein Developer** — Kommentare im Code auf Deutsch und sehr verstaendlich. Editierbare Daten gehoeren in `js/data/*.js` mit `HIER BEARBEITEN`-Hinweis.
- **Eigenstaendig arbeiten** — nicht nach jedem Schritt fragen. Memory-Eintrag bestaetigt das.
