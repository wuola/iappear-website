"""iappear.at – build.py

Generiert statische HTML-Bloecke aus den JS-Datenquellen:

  1. VITRINE: Kacheln aus js/data/vitrine.js → vitrine.html
  2. RUNDGANG-COUNTS: Zahlen aus js/data/rundgaenge.js → 6 HTML-Dateien

Warum? Damit Google, ClaudeBot, GPTBot & Co. die Inhalte direkt aus dem
HTML lesen koennen — ohne erst JavaScript ausfuehren zu muessen.

Wie benutzen:
    python build.py
    # (danach committen wenn die HTML-Aenderungen ok sind)

Die Quellen der Wahrheit bleiben die JS-Dateien. Wenn du (oder Marilena)
dort einen Eintrag aenderst, musst du danach einmal `python build.py`
laufen lassen, damit das HTML den neuen Stand zeigt.

Marker im HTML (nicht loeschen!):
    Vitrine:   <!-- VITRINE-GRID-START --> / <!-- VITRINE-GRID-END -->
    Counts:    <!-- COUNT:stadtslug:START --> / <!-- COUNT:stadtslug:END -->
    Chips:     <!-- CHIPS:kategorie:stadtslug:START --> / <!-- CHIPS:kategorie:stadtslug:END -->
    Hub-Chips: <!-- CHIPS:hub:START --> / <!-- CHIPS:hub:END -->
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


## ===================================================================
## TEIL 2: Rundgang-Counts aus rundgaenge.js
## ===================================================================

RUNDGAENGE_JS = os.path.join(ROOT, "js", "data", "rundgaenge.js")

# Welche HTML-Dateien Rundgang-Marker enthalten koennen
RUNDGANG_HTML_FILES = [
    os.path.join(ROOT, "index.html"),
    os.path.join(ROOT, "stadtrundgaenge.html"),
    os.path.join(ROOT, "stadtrundgang-dornbirn.html"),
    os.path.join(ROOT, "stadtrundgang-feldkirch.html"),
    os.path.join(ROOT, "stadtrundgang-hard.html"),
    os.path.join(ROOT, "stadtrundgang-au.html"),
]

# Stadt-Konfiguration: Slug → Anzeigename + Anker-ID + Sonderstatus
STAEDTE = {
    "dornbirn":  {"name": "Dornbirn",   "anchor": "ort-dornbirn"},
    "feldkirch": {"name": "Feldkirch",  "anchor": "ort-feldkirch"},
    "hard":      {"name": "Hard",       "anchor": "ort-hard"},
    "au":        {"name": "Au",         "anchor": "ort-au"},
    "bregenz":   {"name": "Bregenz",    "anchor": "ort-bregenz", "soon": True},
}

# Reihenfolge der Staedte im Hub
STADT_ORDER = ["dornbirn", "feldkirch", "hard", "au", "bregenz"]

# Kategorie-Labels
KAT_LABELS = {
    "history": "i.history",
    "dentity": "i.dentity",
    "grow": "i.grow",
}


def parse_rundgaenge_js(src: str):
    """Parst rundgaenge.js und gibt ein Dict zurueck:
    { stadt_slug: { kategorie: anzahl_aktiv } }
    """
    counts = {}  # stadt -> { kat -> n }

    # Finde alle stadt:"slug" Eintraege + zugehoerige rundgaenge-Arrays
    # Strategie: Wir gehen kategorie-weise vor
    for kat in ["history", "dentity", "grow"]:
        # Finde den Kategorie-Block
        kat_pattern = re.compile(
            r'\b' + kat + r'\s*:\s*\{(.*?)\n  \}',
            re.DOTALL
        )
        kat_match = kat_pattern.search(src)
        if not kat_match:
            continue

        kat_block = kat_match.group(1)

        # Finde alle Regionen innerhalb dieses Kategorie-Blocks
        region_pattern = re.compile(
            r'\{\s*\n\s*name:\s*"[^"]*",\s*\n\s*stadt:\s*"(\w+)",\s*\n\s*rundgaenge:\s*\[(.*?)\]',
            re.DOTALL
        )

        for region_match in region_pattern.finditer(kat_block):
            stadt = region_match.group(1)
            rundgaenge_block = region_match.group(2)

            # Zaehle aktive Rundgaenge (alles was NICHT "coming-soon" ist)
            # Einfach: zaehle titel-Eintraege und ziehe coming-soon ab
            titel_count = len(re.findall(r'titel\s*:', rundgaenge_block))
            soon_count = len(re.findall(r'status\s*:\s*"coming-soon"', rundgaenge_block))
            aktiv = titel_count - soon_count

            if stadt not in counts:
                counts[stadt] = {}
            counts[stadt][kat] = counts[stadt].get(kat, 0) + aktiv

    return counts


def render_kategorie_chips(stadt_slug: str, counts: dict, use_links: bool) -> str:
    """Generiert Kategorie-Chips fuer eine Stadt.
    use_links=True: <li><a href="#kat">...</a></li> (Stadtseiten)
    use_links=False: <span>...</span> (Landingpage-Karten)
    """
    stadt_counts = counts.get(stadt_slug, {})
    parts = []
    for kat in ["history", "dentity", "grow"]:
        n = stadt_counts.get(kat, 0)
        if n <= 0:
            continue
        label = KAT_LABELS[kat]
        if use_links:
            parts.append(
                f'        <li><a href="#{kat}" class="hub-jumpnav__chip hub-jumpnav__chip--{kat}">'
                f'{label} <span class="hub-jumpnav__count">&middot; {n}</span></a></li>'
            )
        else:
            parts.append(
                f'<span class="hub-jumpnav__chip hub-jumpnav__chip--{kat}">'
                f'{label} <span class="hub-jumpnav__count">&middot; {n}</span></span>'
            )
    return "\n".join(parts)


def render_hub_chips(counts: dict) -> str:
    """Generiert die Hub-Chips (Gesamtzahl pro Stadt)."""
    parts = []
    for slug in STADT_ORDER:
        info = STAEDTE[slug]
        total = sum(counts.get(slug, {}).values())
        is_soon = info.get("soon", False)
        chip_class = "hub-jumpnav__chip--soon" if is_soon else "hub-jumpnav__chip--neutral"
        count_text = "bald" if is_soon else str(total)
        parts.append(
            f'        <li><a href="#{info["anchor"]}" class="hub-jumpnav__chip {chip_class}">'
            f'{info["name"]} <span class="hub-jumpnav__count">&middot; {count_text}</span></a></li>'
        )
    return "\n".join(parts)


def render_count_text(stadt_slug: str, counts: dict) -> str:
    """Generiert den Count-Text (z.B. '10 Stadtrundgänge &amp; Audioguides')."""
    total = sum(counts.get(stadt_slug, {}).values())
    if total == 1:
        return "1 Stadtrundgang"
    else:
        return f"{total} Stadtrundg\u00e4nge &amp; Audioguides"


def inject_rundgang_counts(counts: dict):
    """Ersetzt alle Rundgang-Marker in den HTML-Dateien."""
    updated = 0

    for filepath in RUNDGANG_HTML_FILES:
        if not os.path.exists(filepath):
            continue

        with open(filepath, encoding="utf-8") as fh:
            html = fh.read()

        original = html

        # 1) COUNT:slug Marker ersetzen
        def replace_count(m):
            slug = m.group(1)
            return f"<!-- COUNT:{slug}:START -->{render_count_text(slug, counts)}<!-- COUNT:{slug}:END -->"
        html = re.sub(
            r'<!-- COUNT:(\w+):START -->.*?<!-- COUNT:\1:END -->',
            replace_count, html, flags=re.DOTALL
        )

        # 2) CHIPS:kategorie:slug Marker ersetzen
        def replace_kat_chips(m):
            slug = m.group(1)
            # Stadtseiten haben <li><a> Links, Landingpage hat <span>
            # Erkennung: Stadtseiten haben "stadtrundgang-" im Dateinamen
            basename = os.path.basename(filepath)
            use_links = basename.startswith("stadtrundgang-")
            chips = render_kategorie_chips(slug, counts, use_links)
            return f"<!-- CHIPS:kategorie:{slug}:START -->{chips}<!-- CHIPS:kategorie:{slug}:END -->"
        html = re.sub(
            r'<!-- CHIPS:kategorie:(\w+):START -->.*?<!-- CHIPS:kategorie:\1:END -->',
            replace_kat_chips, html, flags=re.DOTALL
        )

        # 3) CHIPS:hub Marker ersetzen
        hub_chips = render_hub_chips(counts)
        html = re.sub(
            r'<!-- CHIPS:hub:START -->.*?<!-- CHIPS:hub:END -->',
            f"<!-- CHIPS:hub:START -->\n{hub_chips}\n        <!-- CHIPS:hub:END -->",
            html, flags=re.DOTALL
        )

        if html != original:
            with open(filepath, "w", encoding="utf-8", newline="") as fh:
                fh.write(html)
            updated += 1
            print(f"  {os.path.basename(filepath)} aktualisiert")

    return updated


def main_rundgaenge():
    """Hauptfunktion fuer Rundgang-Counts."""
    with open(RUNDGAENGE_JS, encoding="utf-8") as fh:
        js_src = fh.read()

    counts = parse_rundgaenge_js(js_src)

    # Zusammenfassung ausgeben
    print("\nRundgang-Counts aus rundgaenge.js:")
    for slug in STADT_ORDER:
        stadt_counts = counts.get(slug, {})
        total = sum(stadt_counts.values())
        details = ", ".join(f"{k}={v}" for k, v in stadt_counts.items() if v > 0)
        print(f"  {slug}: {total} gesamt ({details})")

    updated = inject_rundgang_counts(counts)
    if updated:
        print(f"\n{updated} Datei(en) mit Rundgang-Counts aktualisiert.")
    else:
        print("\nAlle Rundgang-Counts bereits aktuell.")


if __name__ == "__main__":
    try:
        main()
        main_rundgaenge()
    except Exception as e:
        print(f"FEHLER: {e}", file=sys.stderr)
        sys.exit(1)
