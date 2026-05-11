# Session 39 — Blog geht live: Hero 02+03 nachgeholt, Frauenspuren-Hero-Aspect-Bug gefixt, grosser Repo-Cleanup

**Datum**: 2026-05-11 (Montag, 08:00–09:15)
**Branch**: `claude/bold-mclaren-af85be` (gemerged in main, danach Remote weg)
**Live-Schaltung**: 2026-05-11 ~08:50 (Commit `efdca47` in main, GitHub-Pages-Build ~2-5 Min spaeter)

---

Fortsetzung von Session 38: Hero-Bilder fuer Artikel 02 + 03 nachholen, Frauenspuren-Hero verbessern, dann Blog in main mergen + grosser Repo-Cleanup.

## 1. Drei Hero-Bilder fertig

### Artikel 03 — i.grow Workflow (Foto-Hero)

Quellbild: `C:\Users\maggy\OneDrive\Bilder\i.appear\i.grow feldkirch.jpg` (1200&times;1200, mit Hand-haelt-Phone vor Menschenmenge in Feldkirch + Text-Block "!sneak peek!" unten). Crop-Strategie:
- Oberen 895px (vor Text-Block, gemessen per Pixel-Helligkeits-Scan an x=600)
- Seitlich auf 9:19→… nein, **kein Phone-Mockup-Komposit** — das Foto hat schon ein Phone drin. Crop auf 700:550-Aspect: bei H=895 ergibt W=1138, also 31px pro Seite weg.
- Resize 1138&times;895 → 700&times;550 LANCZOS, JPEG q=88 → 64&nbsp;KB.

Result: `blog/images/03-igrow-hero.jpg`. Phone zentral, Crowd unscharf im Hintergrund, kein UI-Marketing-Text mehr.

### Artikel 02 — Medien-Pflichtfach (Grafik-Hero)

Maggy wollte die Grafik aus dem Text (`grafik_02a_medienkompetenz.html`, ICILS 39% vs 15% EU-Ziel) **als Hero statt ein Foto**. Loesung: Screenshot der Grafik.

Browser-Render-Setup (kein Playwright/imgkit installiert):
```bash
brave.exe --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --virtual-time-budget=3000 \
  --screenshot=<path>.png --window-size=720,620 \
  "file:///<grafik-html-path>"
```

`--virtual-time-budget=3000` wartet 3s "virtueller Zeit" damit die Hero-Number- und Bar-Animationen durchlaufen (`countReveal`, `barGrow` sind in der Grafik mit `0.3s`–`1.0s` Delay definiert). PNG ist 36&nbsp;KB, perfekt sichtbares Endbild.

Crop fuer 700&times;550:
```python
img = Image.open(raw_png)  # 720x620
img = img.crop((0, 0, 720, 565))  # unteren Footer-Bereich weg
img = img.resize((700, 550), Image.LANCZOS)
img.convert('RGB').save(out, 'JPEG', quality=88, optimize=True)
```

Result: `blog/images/02-medien-pflichtfach-hero.jpg` (31&nbsp;KB).

**Zusatz im Artikel-HTML**: alte iframe von `grafik_02a` aus dem Text entfernt (Doppelung mit dem neuen Hero). `grafik_02b_drei-stufen.html` bleibt als animiertes iframe weiter unten im Text. Damit: 1 Hero-Screenshot + 1 Text-iframe statt 2 Text-iframes.

### Artikel 04 — Frauenspuren v4 (Phone-Aspect-Bug-Fix)

**Bug-Story:** v2 (Session 37) wirkte eierfoermig. Pixel-Scan zeigte: Phone-Outer in v2 war 255&times;415 (Aspect 0.614). Echtes 9:19-Smartphone-Aspect ist 0.474. **Phone war 29% zu breit.**

Ursache in Session 37: Phone-Outer-Maesse mit 508&times;825 angesetzt (Aspect 0.616), statt korrekt 391&times;825 (Aspect 0.474 = 9:19). Rechenfehler — Frame/Corner-Ratios waren proportional zur falschen Outer-Width berechnet.

v3-Versuch: korrektes 9:19, aber Source-Bild (ARTIKEL EINS.png 709&times;1191, Aspect 0.595) **seitlich beschnitten** auf 564&times;1191 — Maggy: *"der screen ist ueberall abgeschnitten"*. Auto/Karren links + Architektur rechts weg.

v4-Loesung (mit Maggys Screenshot 494&times;1077, Aspect 0.459 = nah-iPhone-Standard 9:19.5):
- Phone-Outer **strikt 9:19**: 460&times;972 (460&times;19/9 = 971.1)
- Frame 20 (4.5% von 460), Phone-Corner 138 (30%), Screen-Corner 118 (Outer-Corner minus Frame)
- Screen 420&times;932
- Source ins Screen einpassen **mit Letterbox top/bottom 8/9px** (Width-fit, keine seitliche Crop)
- Phone-Body mit subtilem Vertikal-Gradient (Hell-Mitte-Dunkel-Rand mimics CSS `linear-gradient(145deg, #1a1a1a, #050505, #1a1a1a)`)
- Final 700&times;550 JPG, 37&nbsp;KB

Result: `blog/images/04-frauenspuren-hero-v4.jpg`. Phone klar als Phone erkennbar, App-Screen komplett sichtbar (Header "Frauenspuren", Frauen-Illustration, alle 5 Stationen-Buttons, Bottom-Nav).

## 2. Blog-Live-Schaltung

Reihenfolge:
1. Alte Hero-Versionen weg: `git rm 04-frauenspuren-hero.jpg 04-frauenspuren-hero-v2.jpg` + Python `os.remove` fuer untracked v3
2. Commit auf bold-mclaren: "Hero-Bilder fertig: Artikel 02, 03, Frauenspuren v4 + alte Versionen aufgeraeumt" (efdca47)
3. Push origin/bold-mclaren
4. Im **root-Worktree**: `git merge --ff-only claude/bold-mclaren-af85be` → main wird zu efdca47 (fast-forward, 7 Blog-Commits + Session 38 Doku in einem Schwung)
5. `git push origin main`

**Live ab ~08:50**, GitHub-Pages-Build 2-5 Min spaeter sichtbar auf https://iappear.at/blog/.

## 3. GSC-Audit-Doku-Rettung (Phase Paranoia)

Beim Sortieren der zum Loeschen anstehenden Branches hat `git cherry main <branch>` einen unique Commit auf `claude/heuristic-cori-ca4f28` aufgedeckt: `dfd3797` "Doku: Session 37 — GSC-Audit, Pretty-URL-Altlast verifiziert (kein Code-Fix noetig)". 72-Zeilen-Diagnose von Freitag, **parallel zur Englisch-Session 36 in einem anderen Worktree** angelegt, daher Namens-Kollision mit der Session 37 "Blog-Reaktivierung".

Schritte zur Rettung:
1. `git show dfd3797:_doku/sessions/2026-05-08-session-37-gsc-pretty-url-altlast-verifiziert.md > _doku/sessions/2026-05-08-session-36.5-gsc-pretty-url-altlast-verifiziert.md` (Datei extrahiert + umbenannt)
2. Title in Datei: "Session 37" → "Session 36.5" + Hinweis-Block zur Umnummerierung mit Lehre fuer's System
3. CLAUDE.md GSC-Block ergaenzt mit aktuellem Stand (8/43 indexiert + Methodik-Lehre + Verweis auf Session 36.5)
4. README ergaenzt mit Session 36.5 Eintrag (zwischen 36 und 37)
5. **Neue Konvention in CLAUDE.md** (Konventionen & Lehren): bei parallelen Worktrees am gleichen Tag Session-Nr explizit koordinieren — vor Doku-Erstellung README pruefen + Worktree-Konflikt-Check.

Commit `16a0ea7` → ff-merge in main → push. Damit war der GSC-Audit-Inhalt 1:1 in main, nur Title + 1 Erlauterungs-Block geaendert.

## 4. Repo-Cleanup-Sweep

Vor Cleanup: 14 lokale Branches, 12 Remote-Branches, 5 Worktrees, 6 Worktree-Karteileichen in `.git/worktrees`, 1 Stash, 1 Render-Vorlage.

Methodik:
- **`git cherry main <branch>`** statt `git log main..branch` → erkennt patch-equivalente Commits aus rebase-merge (zeigt `-` statt `+`). Hat den heuristic-cori-Branch als einzigen mit echt-unique Commit identifiziert.
- Vor JEDER destruktiven Aktion verifiziert: Inhalt nachweislich in main per `git cherry` + Datei-Existenz-Check.

Reihenfolge:
1. **Stash drop**: `git stash drop stash@{0}` — Inhalt ("Leistungen"-Link in Top-Nav) bereits in main, Name war eh "redundant-with-main"
2. **Render-Vorlage `blog/_hero-render-01.html`**: `git rm` + Commit `3be3dca`
3. **Worktrees entfernen**: `git worktree remove` fuer 4 Stueck. 3 OK (heuristic-cori, infallible-moser, loving-haibt), 1 Permission-Denied (wizardly-sammet, OneDrive-Lock).
4. **Lokale Branches loeschen**: `git branch -d` fuer alle. 13 OK (en-* x7 + i-history-fresh + loving-haibt + wizardly-sammet + infallible-moser + keen-raman + elegant-hermann), 1 brauchte `-D` (heuristic-cori, weil dfd3797-Commit nicht patch-equivalent zu meinem Rescue-Commit war).
5. **PowerShell-Befehle fuer Maggy** (OneDrive-gelockte Pfade): 2 physische Worktree-Verzeichnisse + 6 Git-Karteileichen + finaler `git branch -D heuristic-cori`. Lief glatt durch nach Maggys Copy-Paste.
6. **Render-Vorlage-Commit ff-merge in main + push** (3be3dca)
7. **Remote-Branches loeschen**: `git push origin --delete claude/en-faqs claude/en-features ... claude/bold-mclaren-af85be` (10 Branches in einem Sweep)

Endstand:
- **Lokal**: `bold-mclaren-af85be` (= main inhaltlich, in elegant-hermann-Worktree ausgecheckt), `experiment/startseite-neu` (Backup, NICHT loeschen), `main`
- **Remote**: `experiment/startseite-neu` (Backup), `main`
- **Worktrees**: root + elegant-hermann (2 aktiv)

## 5. Lehren / wichtig fuer naechste Sessions

- **Phone-Mockup-Maesse: Phone-Outer-Width muss strikt 9:19-Aspect zur Phone-Outer-Height haben** (Width = Height × 9/19). Session 37 hatte 508&times;825 (= 9:15, ei-foermig) statt 391&times;825 (= 9:19). Frame/Corner-Ratios proportional zur **korrigierten** Outer-Width berechnen, nicht 1:1 von alten Sessions kopieren. Pixel-Scan des Render-Outputs als Verifikation: `(Phone-Outer-Width / Phone-Outer-Height)` muss bei 0.473 ± 0.01 liegen.

- **Bei Hero-Bild ist Source-Aspect ≠ Phone-Aspect: Letterbox top/bottom statt seitlicher Crop.** Maggy will den App-Screen-Inhalt komplett sichtbar, nicht halb abgeschnitten. Mini-Letterbox (8-9px schwarz) ist unsichtbar.

- **`git cherry main <branch>` ist das richtige Tool fuer Branch-Cleanup-Verifikation**, nicht `git log main..branch`. Erkennt rebase-merge-Patch-Equivalenz, zeigt `-` fuer "in main per anderem Hash" vs `+` fuer "echt unique".

- **Browser-Headless-Screenshots: `--virtual-time-budget=Nms` ist der Schluessel** bei animierten HTML-Inhalten. Sonst sieht man Initial-Frames mit `opacity:0` / `scaleX(0)`. Brave/Chrome/Edge (Chromium) haben das Flag.

- **OneDrive lockt Worktree-Verzeichnisse**. `git worktree remove` und `git worktree prune` koennen Permission-Denied geben. Loesung: PowerShell `Remove-Item -Recurse -Force <path>` als User. Falls auch das nicht klappt: OneDrive-Sync via Taskleiste pausieren.

- **Bei Auto-Mode + destruktivem Schritt: noch mal kurz fragen lohnt sich.** Heute kam ein "STOP! mir reicht es langsam" mitten in der Cleanup-Phase, weil Maggy von dem Tempo + den vielen Optionen ueberfordert war. Lehre: bei Multi-Step-Cleanups klar nummerierte Phasen, nach jeder Phase **eine** Bestaetigung. Nicht alle Optionen + alle Phasen + Code-Optionen in einer Antwort.
