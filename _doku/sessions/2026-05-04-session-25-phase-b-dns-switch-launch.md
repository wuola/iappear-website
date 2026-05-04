# Session 25 — Phase B: DNS-Switch + iappear.at LIVE 🚀

**Datum**: 2026-05-04 (Montag, ~14:30-15:25)
**Commits**: vor diesem Doku-Commit nichts neues im Repo. GitHub-Pages-Setting via API.

---

Die neue iappear.at-Site ist live unter ihrer eigentlichen Domain. Phase B vom Plan ging in <1h durch — viel schneller als der Plan-Worst-Case (2-7h).

## Ablauf

**14:30 Pre-Flight-Check** via Bash:
- `nslookup iappear.at 8.8.8.8` zeigte A-Record `54.194.41.141` (alte Readymag-IP).
- NS-Records `ns.udag.de` / `ns.udag.net` / `ns.udag.org` bei United Domains. Best-Case: kein NS-Wechsel noetig.
- `gh api repos/wuola/iappear-website/pages` zeigte `cname: null`, `https_enforced: true`, `status: built`.
- Working tree clean.

**~14:35 Schritt 1 (Maggy, Readymag)**: Klick auf "Unmap"-Button im Project-Settings-Panel des Readymag-Editors. Eine Sekunde. Domain-Ownership-Lock geloest.

**~14:40-14:55 Schritt 2 (Maggy, united-domains)**: DNS-Eintraege bei UD umkonfiguriert. Maggy lief in zwei UI-Eigenheiten:
1. **Erster Speicher-Versuch des Apex-A-Records schlug fehl** mit "Ihre Aenderungen konnten nicht gespeichert werden". Diagnose: Session-Timeout. Maggy meldete sich neu an → Eintrag war doch persistiert (`185.199.108.153` da). UD zeigt also keinen Erfolgs-Toast wenn die Session schon abgelaufen ist, persistiert das Save aber trotzdem. Lehre: **bei UD-Speicher-Fehlern erst Re-Login pruefen, dann erneuter Versuch.**
2. **Subdomain-Feld bei Apex-Eintrag**: ich hatte zuerst `@` empfohlen als DNS-Standard. Funktionierte bei UD nicht — sie wollten Subdomain-Feld komplett LEER. Korrekt war: Subdomain-Feld leer lassen, dann Hinzufuegen.

Ergebnis bei UD nach Phase 2:
- A: 4 Eintraege fuer Apex (`185.199.108-111.153`, leeres Subdomain), plus die alten 4 (`*`, `autodiscover`, `autoconfig`, `download`) auf `54.194.41.141` lassen wir vorerst stehen — die zeigen ins Leere, schaden aber nichts.
- CNAME: `www` → `wuola.github.io` (alter `www` → `domains.readymag.com` geloescht).
- MX/TXT/SRV/AAAA/NS/TLSA/CAA: NICHT angefasst (Mail-Server-Config bleibt).

**~15:18 Schritt 3 (DNS-Propagation)**: erstes `nslookup iappear.at 8.8.8.8` direkt nach Maggy "fertig" zeigte schon alle 4 GitHub-IPs. UD propagiert mit TTL 600s und wird offenbar von Google-DNS sofort gefolgt. **De-facto-Propagationszeit: <3 Minuten.**

**~15:18 Schritt 4 (Custom Domain via gh API)**: `gh api repos/wuola/iappear-website/pages -X PUT -f cname=iappear.at`. 204 No Content. `cname: "iappear.at"`, `status: building`. GitHub legte automatisch CNAME-Datei im `main`-branch an (Repo bekam neuen Auto-Commit von github-actions[bot]).

**~15:20 Schritt 5 (HTTPS-Cert)**: Let's-Encrypt-Cert war binnen Sekunden ausgestellt. `gh api ... | jq .https_certificate.state` zeigte `approved` mit Domains `["iappear.at", "www.iappear.at"]`, expires `2026-08-02`. Auto-Renewal von GitHub uebernommen.

**~15:21 Schritt 6 (Enforce HTTPS)**: erster API-Call `-f https_enforced=true` schlug fehl (HTTP 422: `"true"` ist string, nicht boolean). Fix: `-F https_enforced=true` (capital F = typed field). 204 No Content. `https_enforced: true`, `html_url: "https://iappear.at/"`.

**~15:22 Schritt 7 (E2E-Verifikation)** via curl:
- `https://iappear.at` → 200, Server: GitHub.com, Title `i.appear - Digitale Stadtrundgaenge & Audioguides in Vorarlberg` ✓
- `http://iappear.at` → 301 → `https://iappear.at/` ✓
- `https://www.iappear.at` → 301 → `https://iappear.at/` ✓
- `/impressum.html`, `/datenschutz.html`, `/agb.html` → 200 ✓
- Meta-Author "Marilena Tumler" sichtbar (Session-24-Aenderung ist auf Live).

**~15:25 (Post-Launch-Verwirrung) Browser-Zoom**: Maggy oeffnete iappear.at in Brave (eingeloggt) — Layout sah klein/zentriert aus, riesige schwarze Flaechen. Erstreaktion Panik ("warum ist die Seite so klein?"). Diagnose: Brave/Chromium synchronisiert Zoom-Levels per Domain ueber das gesamte Profil (auch in privaten Tabs vom selben Profil). Maggy hatte irgendwann auf der alten iappear.at-Readymag-Version `Strg+-` runtergezoomt, das war auf 25% haengen geblieben. Erst ein FRISCH neu geoeffnetes privates Opera-Fenster startete sauber bei 100% — Site sah dann wie erwartet aus. **Lehre: Browser-Zoom-Level wird pro Domain in Profilen persistiert, ueberlebt Re-Login und Tab-Wechsel; nur ein neues Profil/eine neue Browser-Instanz bricht den Override.**

## Tally-Submit-Test

**Noch offen (Maggy nach Pause)** — privater Tab + Test-Submit auf `iappear.at/kontakt.html` muss Mail an `maggy@iappear.app` produzieren. Bei Tally sind keine Allowed-Domains restriktiv konfiguriert (Free-Plan default = alle Origins erlaubt), sollte direkt funktionieren.

## Was bei UD bewusst NICHT angefasst wurde

- **MX-Records** (`mx00.udag.de` / `mx01.udag.de`) — Mail-Server fuer iappear.at-Adressen. Aenderung haette E-Mail-Ausfall fuer alle iappear.at-Adressen verursacht.
- **TXT (SPF)** `v=spf1 include:_smtp.udag.de ~all` — Mail-Authentifizierung.
- **A-Records `*`, `autodiscover`, `autoconfig`, `download`** auf alter Readymag-IP `54.194.41.141` — zeigen jetzt ins Leere, kein neuer Schaden. Aufraeumen kann nach Launch.
- **NS / SRV / AAAA / TLSA / CAA** — alle leer/Standard, irrelevant.

## Lehren dieser Session

1. **CNAME-File-via-API ist sauberer als File-Commit**. `gh api ... -X PUT -f cname=...` setzt das Repo-Setting und GitHub legt die CNAME-Datei automatisch auf `main` an (mit github-actions-bot als Author). Vorteil: wir brauchen keinen lokalen Hand-Commit zu pushen, und der "CNAME nie vor DNS-Switch ins Repo"-Stolperstein wird unmoeglich (DNS-Switch-Reihenfolge wird strict eingehalten weil der API-Call ja nach DNS-Verifikation passiert).
2. **`gh api -f` vs `-F`**: Kleines `-f` macht string-Werte; grosses `-F` macht typed fields (boolean, number). Fuer `https_enforced=true` braucht's `-F`, sonst HTTP 422.
3. **UD-Speicher-UI ist verbuggt bei Session-Timeout**: kein Erfolgs-Toast aber Save geht trotzdem durch. Bei "konnte nicht gespeichert werden" → Re-Login, dann Status pruefen.
4. **Subdomain-Feld bei Apex-A bei UD: leer lassen, NICHT `@`**. Ist UD-spezifisch, andere Provider akzeptieren `@`.
5. **Browser-Zoom-Level ist Domain-persistent in Brave/Chromium**, ueberlebt private Tabs vom selben Profil. Bei merkwuerdigem Render-Verhalten nach Domain-Wechsel: zoom-level pruefen, evtl. frische Browser-Instanz.
6. **Mit Best-Case-Glueck dauert Phase B <1h, nicht 2-7h.** UD propagierte in Minuten, GitHub stellte das Cert sofort aus. Plan-Schaetzung war konservativ — gut so, aber nicht jeder Phase B braucht so lang.
7. **Mein Patzer**: erster API-Call mit `-f` statt `-F` brachte 422-Error mitten im Live-Switch. Lehre fuer zukuenftige gh-api-Calls: bei boolean-Werten immer `-F`. (Hat Maggy nicht gestoert, weil's in Sekunden gefixt war, aber bei groesseren Side-Effects haette das nervig werden koennen.)

## Stand am Ende

- ✅ iappear.at LIVE mit HTTPS gruen, www-Redirect, alle Unterseiten.
- ✅ Phase A + Phase B komplett abgeschlossen.
- ⏳ Tally-Submit-Test (Maggy nach Pause).
- ⚪ A-Record-Aufraeumen (`*`, `autodiscover`, `autoconfig`, `download` zeigen auf tote Readymag-IP) — kann nach Launch.
- ⚪ Englische Version + Blog-Reaktivierung (Post-Launch-Phasen, siehe CLAUDE.md "Was offen").
