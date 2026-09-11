import re, sys

VOID = {'img','br','hr','input','meta','link','source','area','base','col','embed','track','wbr',
        'path','circle','rect','line','polygon','polyline','ellipse','stop','use'}

ATTR = {
 'class':'className','for':'htmlFor','tabindex':'tabIndex','readonly':'readOnly',
 'maxlength':'maxLength','minlength':'minLength','autocomplete':'autoComplete',
 'stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin',
 'stroke-dasharray':'strokeDasharray','stroke-dashoffset':'strokeDashoffset',
 'fill-rule':'fillRule','clip-rule':'clipRule','clip-path':'clipPath',
 'stop-color':'stopColor','stop-opacity':'stopOpacity','stroke-opacity':'strokeOpacity',
 'fill-opacity':'fillOpacity','font-family':'fontFamily','font-size':'fontSize',
 'font-weight':'fontWeight','text-anchor':'textAnchor','preserveaspectratio':'preserveAspectRatio',
 'gradientunits':'gradientUnits','patternunits':'patternUnits','xlink:href':'xlinkHref',
 'colspan':'colSpan','rowspan':'rowSpan','srcset':'srcSet','crossorigin':'crossOrigin',
 'enctype':'encType','novalidate':'noValidate','autofocus':'autoFocus','spellcheck':'spellCheck',
}
BOOL = {'disabled','checked','required','autoplay','controls','loop','muted','playsinline',
        'allowfullscreen','async','defer','hidden','selected','multiple','open','novalidate'}

def camel(p):
    parts = p.strip().split('-')
    if p.startswith('--'): return None
    return parts[0] + ''.join(x.capitalize() for x in parts[1:])

def style_obj(v):
    out = []
    for decl in v.split(';'):
        if ':' not in decl: continue
        k, val = decl.split(':', 1)
        k = k.strip(); val = val.strip()
        if not k: continue
        if k.startswith('--'):
            out.append(f"'{k}': '{val}'")
        else:
            out.append(f"{camel(k)}: '{val}'")
    return '{{' + ', '.join(out) + '}}'

def conv_attrs(s):
    def one(m):
        name, q, val = m.group(1), m.group(2), m.group(3)
        ln = name.lower()
        if ln == 'style':
            return ' style=' + style_obj(val)
        if ln.startswith('on'):
            return ''  # inline handlers are re-attached in React
        if ln.startswith('data-') or ln.startswith('aria-'):
            return f' {ln}="{val}"'
        n = ATTR.get(ln, name)
        return f' {n}="{val}"'
    s = re.sub(r'\s([\w:-]+)=(["\'])(.*?)\2', one, s, flags=re.S)
    # bare boolean attrs
    s = re.sub(r'\s(' + '|'.join(BOOL) + r')(?=[\s/>])', lambda m: f' {m.group(1)}={{true}}', s)
    return s

def convert(html):
    # comments -> jsx comments
    html = re.sub(r'<!--(.*?)-->', lambda m: '{/*' + m.group(1).replace('*/','* /') + '*/}', html, flags=re.S)
    # tags
    def tag(m):
        raw = m.group(0)
        if raw.startswith('</'): return raw
        name = m.group(1)
        body = m.group(2) or ''
        body = conv_attrs(body)
        selfclose = bool(m.group(3))
        if name.lower() in VOID or selfclose:
            body = body.rstrip().rstrip('/')
            return f'<{name}{body} />'
        return f'<{name}{body}>'
    html = re.sub(r'<([A-Za-z][\w.:-]*)((?:"[^"]*"|\'[^\']*\'|[^<>"\'])*?)\s*(/?)>', tag, html, flags=re.S)
    # escape stray braces in text
    return html

if __name__ == '__main__':
    src = open(sys.argv[1]).read()
    out = convert(src)
    open(sys.argv[2], 'w').write(out)
    print('converted ->', sys.argv[2])
