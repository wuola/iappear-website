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
        lines.append(f'        <a class="vitrine-card" href="{esc_attr(link)}">')
        lines.append(thumb)
        lines.append(f'          <h3 class="vitrine-card__title">{titel}</h3>')
        lines.append(f'          <p class="vitrine-card__text">{text}</p>')
        lines.append(
            '          <span class="vitrine-card__link">&ndash; zum Artikel &ndash;</span>'
        )
        lines.append('        </a>')
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
## TEIL 2: Rundgang-Counts + Stadt-Infrastruktur aus rundgaenge.js
## ===================================================================

RUNDGAENGE_JS = os.path.join(ROOT, "js", "data", "rundgaenge.js")
HUB_HTML = os.path.join(ROOT, "stadtrundgaenge.html")
SITEMAP_XML = os.path.join(ROOT, "sitemap.xml")
LLMS_TXT = os.path.join(ROOT, "llms.txt")

# Kategorie-Labels und Farben
KAT_LABELS = {
    "history": "i.history",
    "dentity": "i.dentity",
    "grow": "i.grow",
}
KAT_SUBTITLES = {
    "history": "Zeitreisen",
    "dentity": "Regionale Identität",
    "grow": "Medienbildung",
}


def parse_staedte_config(src: str):
    """Parst window.IAPPEAR_STAEDTE aus rundgaenge.js.
    Gibt OrderedDict-artige Liste von (slug, info) zurueck.
    """
    m = re.search(r"window\.IAPPEAR_STAEDTE\s*=\s*\{(.*?)\};", src, re.DOTALL)
    if not m:
        raise RuntimeError("IAPPEAR_STAEDTE Block nicht gefunden in rundgaenge.js")

    block = m.group(1)
    staedte = {}
    stadt_order = []

    # Jede Zeile matchen: slug: { name: "...", lat: ..., lng: ..., subtitle: "...", soon: true }
    entry_re = re.compile(
        r'(\w+)\s*:\s*\{([^}]+)\}',
    )
    for em in entry_re.finditer(block):
        slug = em.group(1)
        props = em.group(2)

        info = {"anchor": f"ort-{slug}"}

        # name
        nm = re.search(r'name:\s*"([^"]*)"', props)
        if nm:
            info["name"] = nm.group(1)
        else:
            info["name"] = slug.capitalize()

        # lat, lng
        lat_m = re.search(r'lat:\s*([\d.]+)', props)
        lng_m = re.search(r'lng:\s*([\d.]+)', props)
        if lat_m:
            info["lat"] = float(lat_m.group(1))
        if lng_m:
            info["lng"] = float(lng_m.group(1))

        # subtitle
        sub_m = re.search(r'subtitle:\s*"([^"]*)"', props)
        if sub_m:
            info["subtitle"] = sub_m.group(1)

        # soon
        if "soon:" in props and "true" in props.split("soon:")[1][:10]:
            info["soon"] = True

        staedte[slug] = info
        stadt_order.append(slug)

    return staedte, stadt_order


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


def render_hub_chips(counts: dict, staedte: dict, stadt_order: list) -> str:
    """Generiert die Hub-Chips (Gesamtzahl pro Stadt)."""
    parts = []
    for slug in stadt_order:
        info = staedte[slug]
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


def inject_rundgang_counts(counts: dict, staedte: dict, stadt_order: list):
    """Ersetzt alle Rundgang-Marker in den HTML-Dateien."""
    updated = 0

    # Dynamische Dateiliste: index + hub + alle existierenden Stadtseiten
    html_files = [
        os.path.join(ROOT, "index.html"),
        os.path.join(ROOT, "stadtrundgaenge.html"),
    ]
    for slug in stadt_order:
        f = os.path.join(ROOT, f"stadtrundgang-{slug}.html")
        if os.path.exists(f):
            html_files.append(f)

    for filepath in html_files:

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
        hub_chips = render_hub_chips(counts, staedte, stadt_order)
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


## ===================================================================
## TEIL 3: Stadtseite auto-generieren
## ===================================================================

def get_rundgaenge_by_stadt(src: str):
    """Gibt Dict { stadt_slug: { kat: [ {titel, kurz, status} ] } } zurueck."""
    data = {}
    for kat in ["history", "dentity", "grow"]:
        kat_pattern = re.compile(r'\b' + kat + r'\s*:\s*\{(.*?)\n  \}', re.DOTALL)
        kat_match = kat_pattern.search(src)
        if not kat_match:
            continue
        kat_block = kat_match.group(1)

        region_pattern = re.compile(
            r'\{\s*\n\s*name:\s*"([^"]*)",\s*\n\s*stadt:\s*"(\w+)",\s*\n\s*rundgaenge:\s*\[(.*?)\]',
            re.DOTALL
        )
        for rm in region_pattern.finditer(kat_block):
            region_name = rm.group(1)
            stadt = rm.group(2)
            rg_block = rm.group(3)

            tours = []
            tour_re = re.compile(r'\{[^}]*titel:\s*"([^"]*)"[^}]*kurz:\s*"([^"]*)"[^}]*\}', re.DOTALL)
            for tm in tour_re.finditer(rg_block):
                status_m = re.search(r'status:\s*"([^"]*)"', tm.group(0))
                tours.append({
                    "titel": tm.group(1),
                    "kurz": tm.group(2).replace("&mdash;", "\u2014").replace("&ndash;", "\u2013"),
                    "status": status_m.group(1) if status_m else "aktiv",
                })

            if stadt not in data:
                data[stadt] = {}
            if kat not in data[stadt]:
                data[stadt][kat] = []
            data[stadt][kat].extend(tours)

    return data


def generate_stadtseite(slug: str, info: dict, counts: dict, rundgaenge: dict):
    """Generiert eine neue stadtrundgang-{slug}.html Datei."""
    name = info["name"]
    subtitle = info.get("subtitle", f"Digitale Stadtrundg\u00e4nge und Audioguides")
    stadt_rundgaenge = rundgaenge.get(slug, {})
    total = sum(counts.get(slug, {}).values())

    # Kategorie-Sektionen generieren
    sections = []
    for kat in ["history", "dentity", "grow"]:
        tours = stadt_rundgaenge.get(kat, [])
        aktiv = [t for t in tours if t["status"] != "coming-soon"]
        if not aktiv:
            continue
        kat_label = KAT_LABELS[kat]
        kat_sub = KAT_SUBTITLES[kat]
        cards = []
        for t in aktiv:
            cards.append(f"""        <div class="card">
          <h3>{t["titel"]}</h3>
          <p class="muted">{t["kurz"]}</p>
        </div>""")
        sections.append(f"""    <section id="{kat}" class="section container">
      <h2 class="c-{kat}">{kat_sub}</h2>
      <p class="eyebrow">{kat_label} \u2013 {kat_sub} in {name}</p>
      <div class="grid grid-3" style="margin-top:var(--sp-3)">
{chr(10).join(cards)}
      </div>
    </section>""")

    sections_html = "\n\n" + "\n\n".join(sections) if sections else ""

    # Chips generieren
    chips = render_kategorie_chips(slug, counts, use_links=True)
    count_text = render_count_text(slug, counts)

    # Slug fuer CSS-Pfade (alle Stadtseiten liegen im Root)
    html = f"""<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Digitaler Stadtrundgang {name} | i.appear</title>
  <meta name="description" content="Digitale Stadtrundg\u00e4nge und Audioguides in {name} von i.appear. {subtitle}. Multimedial, interaktiv, kostenlos \u2013 direkt im Browser." />
  <link rel="canonical" href="https://iappear.at/stadtrundgang-{slug}/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Digitaler Stadtrundgang {name} | i.appear" />
  <meta property="og:description" content="Digitale Stadtrundg\u00e4nge und Audioguides in {name}. {subtitle}." />
  <meta property="og:url" content="https://iappear.at/stadtrundgang-{slug}/" />
  <meta property="og:image" content="https://iappear.at/assets/images/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/png" href="assets/favicon.png" />
  <link rel="apple-touch-icon" href="assets/favicon.png" />

  <link rel="stylesheet" href="css/global.css?v=20260416a" />
  <link rel="stylesheet" href="css/layout.css?v=20260416a" />
  <link rel="stylesheet" href="css/components.css?v=20260416a" />
  <link rel="stylesheet" href="css/animations.css?v=20260416a" />

  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{ "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://iappear.at/" }},
      {{ "@type": "ListItem", "position": 2, "name": "Stadtrundg\\u00e4nge", "item": "https://iappear.at/stadtrundgaenge/" }},
      {{ "@type": "ListItem", "position": 3, "name": "{name}" }}
    ]
  }}
  </script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Digitaler Stadtrundgang {name}",
    "description": "{subtitle}",
    "url": "https://iappear.at/stadtrundgang-{slug}/",
    "isAccessibleForFree": true,
    "provider": {{
      "@type": "Organization",
      "name": "i.appear",
      "url": "https://iappear.at"
    }}
  }}
  </script>
</head>
<body>
  <header class="nav">
    <div class="nav__inner container">
      <a class="nav__brand" href="index.html" aria-label="i.appear Startseite"><img src="assets/svg/logos/logo-mark-weiss.svg?v=20260416a" alt="i.appear" /></a>
      <nav class="nav__links">
        <a href="stadtrundgaenge.html">Stadtrundg\u00e4nge</a>
        <a href="features.html">Features</a>
        <a href="workflow.html">Leistungen</a>
        <a href="ueber-uns.html">\u00dcber uns</a>
        <a href="vitrine.html">Vitrine</a>
        <a href="kontakt.html">Kontakt</a>
      </nav>
      <button class="nav__toggle" aria-label="Men\u00fc \u00f6ffnen" aria-expanded="false">
        <svg viewBox="0 0 28 28" width="28" height="28"><circle cx="14" cy="14" r="13" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="14" x2="20" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    </div>
  </header>

  <dialog class="menu" aria-label="Hauptmen\u00fc">
    <button class="menu__close" aria-label="Men\u00fc schlie\u00dfen">&times;</button>
    <div class="menu__body">
      <div class="menu__group"><h3 class="menu__heading">Die Plattform</h3>
      <ul class="menu__list">
        <li><a href="user-guide.html">i.appear User Guide</a></li>
        <li><a href="i-history.html" class="c-history">i.history \u2013 Zeitreisen</a></li>
        <li><a href="i-dentity.html" class="c-dentity">i.dentity \u2013 Regionale Identit\u00e4t</a></li>
        <li><a href="i-grow.html" class="c-grow">i.grow \u2013 Medienbildung</a></li>
        <li><a href="features.html">Features</a></li>
      </ul></div>
      <div class="menu__group"><h3 class="menu__heading">Stadtrundg\u00e4nge</h3>
      <ul class="menu__list">
        <li><a href="stadtrundgaenge.html"><strong>Alle Orte &amp; Karte</strong></a></li>
        <li><a href="stadtrundgang-dornbirn.html">Dornbirn</a></li>
        <li><a href="stadtrundgang-feldkirch.html">Feldkirch</a></li>
        <li><a href="stadtrundgang-hard.html">Hard am Bodensee</a></li>
        <li><a href="stadtrundgang-au.html">Au im Bregenzerwald</a></li>
      </ul></div>
      <div class="menu__group"><h3 class="menu__heading">Backstage</h3>
      <ul class="menu__list">
        <li><a href="workflow.html">Workflow &amp; Leistungen</a></li>
        <li><a href="vitrine.html">Vitrine</a></li>
        <li><a href="ueber-uns.html">\u00dcber uns</a></li>
        <li><a href="kontakt.html">Kontakt</a></li>
        <li><a href="faqs.html">FAQs</a></li>
        <li><a href="impressum.html">Impressum</a></li>
        <li><a href="datenschutz.html">Datenschutz</a></li>
        <li><a href="agb.html">AGB</a></li>
      </ul></div>
    </div>
  </dialog>

  <main>
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="index.html">Startseite</a></li>
        <li><a href="stadtrundgaenge.html">Stadtrundg\u00e4nge</a></li>
        <li>{name}</li>
      </ol>
    </nav>

    <header class="page-header page-header--hub container">
      <p class="eyebrow">i.appear in {name}</p>
      <h1>Digitaler Stadtrundgang {name}</h1>
      <p class="page-header__subtitle">{subtitle}</p>
      <div class="page-header__intro">
        <p>{name} digital entdecken: Mit den Stadtrundg\u00e4ngen und Audioguides von i.appear erlebst du Geschichte, Kultur und regionale Identit\u00e4t direkt vor Ort \u2013 multimedial, interaktiv und kostenlos. Alles l\u00e4uft im Browser auf deinem Smartphone, <strong>ohne App-Download und ohne Registrierung</strong>.</p>
      </div>
      <ul class="hub-jumpnav" aria-label="Kategorien auf dieser Seite">
        <!-- CHIPS:kategorie:{slug}:START -->
{chips}
        <!-- CHIPS:kategorie:{slug}:END -->
      </ul>
    </header>
{sections_html}

    <section class="section container center">
      <h2>Weitere Orte entdecken</h2>
      <p style="margin-top:var(--sp-2)"><a href="stadtrundgaenge.html" class="btn">Alle Orte &amp; Karte ansehen \u2192</a></p>
      <p style="margin-top:var(--sp-2)"><a href="kontakt.html" class="btn">Jetzt anfragen \u2192</a></p>
    </section>
  </main>

  <footer class="footer">
    <div class="footer__bottom container">
      <span class="footer__copy">\u00a9 2026 i.appear \u2013 Digital City Tours</span>
      <nav class="footer__legal" aria-label="Rechtliches">
        <a href="kontakt.html">Kontakt</a>
        <a href="faqs.html">FAQs</a>
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
        <a href="agb.html">AGB</a>
      </nav>
      <a href="#top" class="footer__top">nach oben &uarr;</a>
    </div>
  </footer>

  <a href="#top" class="scroll-top" aria-label="Nach oben scrollen">
    <svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="19" fill="rgba(0,0,0,.6)" stroke="rgba(255,255,255,.25)" stroke-width="1"/><polyline points="14,22 20,16 26,22" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </a>
  <script src="js/main.js?v=5"></script>
</body>
</html>"""

    filepath = os.path.join(ROOT, f"stadtrundgang-{slug}.html")
    with open(filepath, "w", encoding="utf-8", newline="") as fh:
        fh.write(html)
    print(f"  NEUE STADTSEITE: stadtrundgang-{slug}.html generiert ({total} Rundg\u00e4nge)")


## ===================================================================
## TEIL 4: Leaflet-Karte, Sitemap, llms.txt auto-updaten
## ===================================================================

def update_map_markers(counts: dict, staedte: dict, stadt_order: list):
    """Aktualisiert die Leaflet-Marker-Liste in stadtrundgaenge.html."""
    if not os.path.exists(HUB_HTML):
        return

    with open(HUB_HTML, encoding="utf-8") as fh:
        html = fh.read()

    marker_start = "<!-- MAP-MARKERS:START -->"
    marker_end = "<!-- MAP-MARKERS:END -->"
    if marker_start not in html:
        return

    lines = []
    for slug in stadt_order:
        info = staedte[slug]
        lat = info.get("lat", 0)
        lng = info.get("lng", 0)
        total = sum(counts.get(slug, {}).values())
        name_js = info["name"].replace("'", "\\'")
        lines.append(
            f"      {{ name: '{name_js}', lat: {lat}, lng: {lng}, "
            f"count: '{total}', url: 'stadtrundgang-{slug}.html' }}"
        )
    new_block = "    var orte = [\n" + ",\n".join(lines) + "\n    ];"

    pattern = re.compile(
        re.escape(marker_start) + r".*?" + re.escape(marker_end),
        re.DOTALL
    )
    new_html = pattern.sub(
        marker_start + "\n" + new_block + "\n    " + marker_end,
        html
    )

    if new_html != html:
        with open(HUB_HTML, "w", encoding="utf-8", newline="") as fh:
            fh.write(new_html)
        print("  stadtrundgaenge.html Karten-Marker aktualisiert")


def update_sitemap(staedte: dict, stadt_order: list):
    """Aktualisiert die Stadtrundgang-URLs in sitemap.xml."""
    if not os.path.exists(SITEMAP_XML):
        return

    with open(SITEMAP_XML, encoding="utf-8") as fh:
        xml = fh.read()

    start = "<!-- STADTRUNDGANG-URLS:START -->"
    end = "<!-- STADTRUNDGANG-URLS:END -->"
    if start not in xml:
        return

    entries = []
    for slug in stadt_order:
        entries.append(f"""  <url>
    <loc>https://iappear.at/stadtrundgang-{slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>""")

    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.DOTALL)
    new_xml = pattern.sub(start + "\n" + "\n".join(entries) + "\n  " + end, xml)

    if new_xml != xml:
        with open(SITEMAP_XML, "w", encoding="utf-8", newline="") as fh:
            fh.write(new_xml)
        print("  sitemap.xml aktualisiert")


def update_llms_txt(counts: dict, staedte: dict, stadt_order: list):
    """Aktualisiert die Stadtrundgang-Eintraege in llms.txt."""
    if not os.path.exists(LLMS_TXT):
        return

    with open(LLMS_TXT, encoding="utf-8") as fh:
        txt = fh.read()

    start = "<!-- STADTRUNDGANG-LINKS:START -->"
    end = "<!-- STADTRUNDGANG-LINKS:END -->"
    if start not in txt:
        return

    lines = []
    for slug in stadt_order:
        info = staedte[slug]
        total = sum(counts.get(slug, {}).values())
        sub = info.get("subtitle", "Digitale Stadtrundgaenge")
        lines.append(
            f"- [Stadtrundgang {info['name']}](https://iappear.at/stadtrundgang-{slug}/): "
            f"{total} Rundgaenge. {sub}."
        )

    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.DOTALL)
    new_txt = pattern.sub(start + "\n" + "\n".join(lines) + "\n" + end, txt)

    if new_txt != txt:
        with open(LLMS_TXT, "w", encoding="utf-8", newline="") as fh:
            fh.write(new_txt)
        print("  llms.txt aktualisiert")


## ===================================================================
## HAUPTFUNKTION: Rundgaenge + Staedte
## ===================================================================

def main_rundgaenge():
    """Hauptfunktion fuer Rundgang-Counts und Stadt-Infrastruktur."""
    with open(RUNDGAENGE_JS, encoding="utf-8") as fh:
        js_src = fh.read()

    # Config + Counts parsen
    staedte, stadt_order = parse_staedte_config(js_src)
    counts = parse_rundgaenge_js(js_src)
    rundgaenge = get_rundgaenge_by_stadt(js_src)

    # Zusammenfassung ausgeben
    print("\nRundgang-Counts aus rundgaenge.js:")
    for slug in stadt_order:
        stadt_counts = counts.get(slug, {})
        total = sum(stadt_counts.values())
        details = ", ".join(f"{k}={v}" for k, v in stadt_counts.items() if v > 0)
        print(f"  {slug}: {total} gesamt ({details})")

    # 1) Neue Stadtseiten generieren (nur wenn HTML noch nicht existiert)
    for slug in stadt_order:
        filepath = os.path.join(ROOT, f"stadtrundgang-{slug}.html")
        if not os.path.exists(filepath):
            info = staedte[slug]
            if not info.get("soon"):
                generate_stadtseite(slug, info, counts, rundgaenge)

    # 2) Counts/Chips in bestehenden HTMLs aktualisieren
    updated = inject_rundgang_counts(counts, staedte, stadt_order)
    if updated:
        print(f"\n{updated} Datei(en) mit Rundgang-Counts aktualisiert.")
    else:
        print("\nAlle Rundgang-Counts bereits aktuell.")

    # 3) Karten-Marker aktualisieren
    update_map_markers(counts, staedte, stadt_order)

    # 4) Sitemap + llms.txt aktualisieren
    update_sitemap(staedte, stadt_order)
    update_llms_txt(counts, staedte, stadt_order)


if __name__ == "__main__":
    try:
        main()
        main_rundgaenge()
    except Exception as e:
        print(f"FEHLER: {e}", file=sys.stderr)
        sys.exit(1)
