"""iappear.at – build.py

Generiert statisches HTML fuer die Vitrine-Kacheln aus js/data/vitrine.js
und schreibt es direkt in vitrine.html rein.

Warum? Damit Google, ClaudeBot, GPTBot & Co. die 22 Vitrine-Kacheln und
die Links zu den Artikel-Seiten direkt aus dem HTML lesen koennen — ohne
erst JavaScript ausfuehren zu muessen. Viele LLM-Crawler rendern kein JS.

Wie benutzen:
    python build.py
    # (danach committen wenn die HTML-Aenderungen ok sind)

Die Quelle der Wahrheit bleibt js/data/vitrine.js. Wenn du (oder Marilena)
dort einen Eintrag aenderst, musst du danach einmal `python build.py`
laufen lassen, damit das HTML den neuen Stand zeigt.

Das Script ersetzt nur den Block zwischen diesen Markern in vitrine.html:
    <!-- VITRINE-GRID-START -->
    ...wird ueberschrieben...
    <!-- VITRINE-GRID-END -->

Die beiden Marker MUESSEN in vitrine.html drinstehen — sonst bricht das
Script ab und beruehrt die Datei nicht.
"""
import re
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
VITRINE_JS = os.path.join(ROOT, "js", "data", "vitrine.js")
VITRINE_HTML = os.path.join(ROOT, "vitrine.html")

START_MARK = "<!-- VITRINE-GRID-START -->"
END_MARK = "<!-- VITRINE-GRID-END -->"


def parse_vitrine_js(src: str):
    """Ein ganz kleiner Parser fuer die window.IAPPEAR_VITRINE-Liste.

    Wir suchen blockweise { ... } zwischen den eckigen Klammern und ziehen
    pro Block die 4 Felder (titel, text, bild, link) mit einfachen Regexes
    raus. Das reicht fuer unsere Daten (keine verschachtelten Objekte).
    """
    m = re.search(r"window\.IAPPEAR_VITRINE\s*=\s*\[(.*?)\];", src, re.DOTALL)
    if not m:
        raise RuntimeError("IAPPEAR_VITRINE Array nicht gefunden in vitrine.js")
    arr = m.group(1)
    # Alle Block-Objekte extrahieren — simpel, weil keine Verschachtelung
    blocks = re.findall(r"\{([^{}]*?)\}", arr, re.DOTALL)
    items = []
    field_re = re.compile(r'(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"')
    for b in blocks:
        fields = dict(field_re.findall(b))
        if "titel" in fields:
            items.append({
                "titel": fields.get("titel", ""),
                "text": fields.get("text", ""),
                "bild": fields.get("bild", ""),
                "link": fields.get("link", ""),
            })
    return items


def esc_attr(s: str) -> str:
    return s.replace("&", "&amp;").replace('"', "&quot;")


def render_grid(items) -> str:
    lines = [
        '      <div class="vitrine-grid" data-vitrine-grid style="margin-top:var(--sp-3)">',
    ]
    for it in items:
        titel = it["titel"]
        text = it["text"]
        bild = it["bild"]
        link = it["link"]
        if bild:
            thumb = (
                '          <div class="vitrine-card__thumb">'
                f'<img src="{esc_attr(bild)}" alt="{esc_attr(titel)}" loading="lazy" decoding="async" />'
                '</div>'
            )
        else:
            thumb = (
                '          <div class="ph ph--square vitrine-card__thumb">'
                f'<small>{titel}</small>'
                '</div>'
            )
        lines.append('        <article class="vitrine-card">')
        lines.append(thumb)
        lines.append(f'          <p class="vitrine-card__text">{text}</p>')
        lines.append(
            f'          <a href="{esc_attr(link)}" class="vitrine-card__link">&ndash; zum Artikel &ndash;</a>'
        )
        lines.append('        </article>')
    lines.append('      </div>')
    return "\n".join(lines)


def update_html(html: str, new_block: str) -> str:
    if START_MARK not in html or END_MARK not in html:
        raise RuntimeError(
            f"Marker {START_MARK} / {END_MARK} fehlen in vitrine.html — "
            "Script bricht ab, um nichts kaputt zu machen."
        )
    pattern = re.compile(
        re.escape(START_MARK) + r".*?" + re.escape(END_MARK),
        re.DOTALL,
    )
    replacement = START_MARK + "\n" + new_block + "\n      " + END_MARK
    return pattern.sub(replacement, html)


def main():
    with open(VITRINE_JS, encoding="utf-8") as fh:
        js_src = fh.read()
    items = parse_vitrine_js(js_src)
    print(f"Gefunden: {len(items)} Vitrine-Eintraege in vitrine.js")

    with open(VITRINE_HTML, encoding="utf-8") as fh:
        html = fh.read()

    new_block = render_grid(items)
    new_html = update_html(html, new_block)

    if new_html == html:
        print("vitrine.html ist bereits aktuell — nichts zu tun.")
        return

    with open(VITRINE_HTML, "w", encoding="utf-8", newline="") as fh:
        fh.write(new_html)
    print(f"vitrine.html aktualisiert ({len(items)} Kacheln statisch eingebaut)")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"FEHLER: {e}", file=sys.stderr)
        sys.exit(1)
