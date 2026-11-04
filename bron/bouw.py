#!/usr/bin/env python3
"""Bouwt de website in alle talen uit de sjablonen en bron/talen/*.json.

Nederlands komt in de hoofdmap (/), elke andere taal in een eigen map (/en/, /de/, ...).
Gebruik:  python3 bron/bouw.py   (vanuit de hoofdmap van de repository)
"""
import html, json, os, re, sys

HIER = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HIER)
SITE = 'https://areainspect.com/'

# Volgorde in het taalmenu: Engels eerst, dan de grote talen, dan de rest van Europa.
VOLGORDE_BOVEN = ['en', 'de', 'fr', 'es', 'it', 'nl']
VOLGORDE_ONDER = ['no', 'sv', 'da', 'pl', 'fi', 'pt', 'cs', 'sk', 'hu', 'ro', 'hr', 'sr', 'sl', 'bg', 'el', 'et', 'lv', 'lt', 'uk']
HTML_LANG = {'no': 'nb', 'sr': 'sr-Latn', 'pt': 'pt-PT', 'en': 'en-GB'}

GLOBE = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/>'
         '<path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5s-1.3 6.7-3.9 9.5c-2.6-2.8-3.9-6-3.9-9.5s1.3-6.7 3.9-9.5z"/></svg>')
PIJL = ('<svg class="pijl" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>')
VINK = ('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111214" stroke-width="2.2" '
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>')


def laad_talen():
    talen = {}
    nl = json.load(open(os.path.join(HIER, 'talen', 'nl.json'), encoding='utf-8'))
    for code in VOLGORDE_BOVEN + VOLGORDE_ONDER:
        pad = os.path.join(HIER, 'talen', code + '.json')
        if not os.path.exists(pad):
            print('  (nog geen vertaling: %s)' % code)
            continue
        d = json.load(open(pad, encoding='utf-8'))
        mist = [k for k in nl if k not in d]
        if mist:
            sys.exit('%s.json mist sleutels: %s' % (code, ', '.join(mist)))
        talen[code] = d
    return talen


def map_van(code):
    return '' if code == 'nl' else code + '/'


def taalmenu(talen, huidig, pagina, R):
    regels = []
    for groep in (VOLGORDE_BOVEN, VOLGORDE_ONDER):
        if regels:
            regels.append('<li class="scheiding" role="separator"></li>')
        for code in groep:
            if code not in talen:
                continue
            doel = R + map_van(code) + ('privacy.html' if pagina == 'privacy' else '')
            if not doel:
                doel = './'
            naam = html.escape(talen[code]['_taalnaam'])
            cur = ' aria-current="true"' if code == huidig else ''
            regels.append('<li><a href="%s" lang="%s" hreflang="%s" data-taal="%s"%s>%s<small>%s</small></a></li>'
                          % (doel, HTML_LANG.get(code, code), code, code, cur, naam, code.upper()))
    label = html.escape(talen[huidig]['taal_knop'])
    if huidig != 'en':
        label += ' / Language'
    return ('<details class="taalmenu"><summary aria-label="%s">%s<span>%s</span>%s</summary>'
            '<ul>%s</ul></details>' % (label, GLOBE, huidig.upper(), PIJL, ''.join(regels)))


def hreflang(talen):
    r = []
    for code in talen:
        r.append('<link rel="alternate" hreflang="%s" href="%s%s">' % (HTML_LANG.get(code, code), SITE, map_van(code)))
    r.append('<link rel="alternate" hreflang="x-default" href="%s%s">' % (SITE, map_van('en' if 'en' in talen else 'nl')))
    return '\n'.join(r) + '\n'


def vul(sjabloon, d, extra):
    def sub(m):
        k = m.group(1)
        if k in extra:
            return extra[k]
        if k not in d:
            sys.exit('onbekende sleutel in sjabloon: ' + k)
        return d[k]
    return re.sub(r'\{\{(\w+)\}\}', sub, sjabloon)


def attr_veilig(d):
    """Waarden die in een HTML-attribuut komen: aanhalingstekens escapen."""
    d = dict(d)
    for k in ('meta_title', 'meta_desc', 'og_desc', 'logo_alt', 'nav_label', 'film_hero_label', 'keuze_label',
              'film_wind_label', 'film_gebouw_label', 'film_bee_label', 'band_label', 'pv_logo_alt') + tuple(
              k for k in d if k.startswith('alt_')):
        d[k] = html.escape(d[k], quote=True)
    return d


def main():
    talen = laad_talen()
    tpl = {p: open(os.path.join(HIER, p + '.tpl.html'), encoding='utf-8').read() for p in ('index', 'privacy')}
    detectie = open(os.path.join(HIER, 'detectie.js'), encoding='utf-8').read()
    detectie = re.sub(r'\n\s*//[^\n]*', '', detectie).strip()
    hl = hreflang(talen)
    for code, d in talen.items():
        R = '' if code == 'nl' else '../'
        js_t = {k: v for k, v in d.items() if k.startswith('js_') or k == 'form_knop'}
        for pagina, s in tpl.items():
            extra = {
                'LANG': HTML_LANG.get(code, code),
                'R': R,
                'CANONICAL': SITE + map_van(code),
                'HREFLANG': hl,
                'DETECTIE': ('<script>' + detectie + '</script>\n') if (code == 'nl' and pagina == 'index') else '',
                'TAALMENU': taalmenu(talen, code, pagina, R),
                'JS_T': json.dumps(js_t, ensure_ascii=False).replace('</', '<\\/'),
                'VINK': VINK,
            }
            uit = vul(s, attr_veilig(d), extra)
            pad = os.path.join(ROOT, map_van(code), pagina + '.html')
            os.makedirs(os.path.dirname(pad), exist_ok=True)
            open(pad, 'w', encoding='utf-8').write(uit)
    # Sitemap met alle talen
    regels = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for code in talen:
        regels.append('  <url><loc>%s%s</loc>' % (SITE, map_van(code)))
        for c2 in talen:
            regels.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s%s"/>' % (HTML_LANG.get(c2, c2), SITE, map_van(c2)))
        regels.append('  </url>')
    regels.append('</urlset>')
    open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(regels) + '\n')
    print('Gebouwd:', ', '.join(talen))


if __name__ == '__main__':
    main()
