#!/usr/bin/env python3
"""
Generates the editorial PLACEHOLDER imagery for the portfolio.

Every file produced here is an abstract, art-directed stand-in built from
gradients, silhouettes and film grain. They are NOT photographs and they do not
depict any real person. Replace each file in src/assets/ with Valentina's real
photography (same filename, same aspect ratio) and the site updates instantly.
"""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'assets'))
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- primitives
def hx(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def sky(w, h, stops, angle=90):
    a = math.radians(angle)
    t = np.linspace(0, 1, w)[None, :] * math.cos(a) + np.linspace(0, 1, h)[:, None] * math.sin(a)
    t = (t - t.min()) / (t.max() - t.min() + 1e-9)
    pos = np.array([s[0] for s in stops], dtype=float)
    cols = np.array([hx(s[1]) for s in stops], dtype=float)
    out = np.zeros((h, w, 3))
    for c in range(3):
        out[..., c] = np.interp(t, pos, cols[:, c])
    return out


def glow(arr, cx, cy, r, color, strength=1.0, falloff=2.2, ratio=1.0):
    h, w, _ = arr.shape
    xs = (np.arange(w)[None, :] - cx * w) / (r * w)
    ys = (np.arange(h)[:, None] - cy * h) / (r * w * ratio)
    m = np.clip(1 - np.sqrt(xs ** 2 + ys ** 2), 0, 1) ** falloff * strength
    col = np.array(hx(color), float)[None, None, :]
    return 255 - (255 - arr) * (255 - col * m[..., None]) / 255


def shade(arr, cx, cy, r, color, strength=0.6, falloff=2.0, ratio=1.0):
    """Multiply-style darkening blob."""
    h, w, _ = arr.shape
    xs = (np.arange(w)[None, :] - cx * w) / (r * w)
    ys = (np.arange(h)[:, None] - cy * h) / (r * w * ratio)
    m = np.clip(1 - np.sqrt(xs ** 2 + ys ** 2), 0, 1) ** falloff * strength
    col = np.array(hx(color), float)[None, None, :] / 255
    return arr * (1 - m[..., None]) + arr * col * m[..., None]


def paint(arr, fn, blur=0, alpha=1.0):
    h, w, _ = arr.shape
    layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    fn(ImageDraw.Draw(layer), w, h)
    if blur:
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
    la = np.asarray(layer).astype(float)
    a = (la[..., 3:4] / 255.0) * alpha
    return arr * (1 - a) + la[..., :3] * a


def band(arr, other, y0, y1, feather=0.01):
    """Blend `other` array into `arr` below y0 with a soft edge."""
    h, w, _ = arr.shape
    ys = np.arange(h)[:, None] / h
    m = np.clip((ys - y0) / max(feather, 1e-6), 0, 1)
    m = m * np.clip((y1 - ys) / max(feather, 1e-6), 0, 1)
    m = m[..., None]
    return arr * (1 - m) + other * m


def grain(arr, amount=6.0, seed=1):
    rng = np.random.default_rng(seed)
    h, w, _ = arr.shape
    mono = rng.normal(0, amount, (h, w))[..., None]
    chroma = rng.normal(0, amount * 0.35, (h, w, 3))
    return arr + mono + chroma


def vignette(arr, strength=0.34, power=2.1):
    h, w, _ = arr.shape
    xs = (np.arange(w)[None, :] / w - 0.5) * 2
    ys = (np.arange(h)[:, None] / h - 0.5) * 2
    d = np.sqrt(xs ** 2 + ys ** 2) / 1.4142
    return arr * (1 - strength * d ** power)[..., None]


def ridge(w, h, base, amp, freq, phase, seed=0, step=3):
    rnd = random.Random(seed)
    o = [(rnd.uniform(0.3, 1.0), rnd.uniform(0, 6.28)) for _ in range(3)]
    pts = []
    for x in range(0, w + step, step):
        t = x / w
        y = base * h - amp * h * (
            0.60 * math.sin(2 * math.pi * freq * t + phase)
            + 0.28 * o[0][0] * math.sin(2 * math.pi * freq * 2.3 * t + o[0][1])
            + 0.14 * o[1][0] * math.sin(2 * math.pi * freq * 4.7 * t + o[1][1])
        )
        pts.append((x, y))
    return pts


def ridge_poly(d, w, h, base, amp, freq, phase, color, seed=0, alpha=255):
    pts = ridge(w, h, base, amp, freq, phase, seed)
    d.polygon(pts + [(w, h + 20), (0, h + 20)], fill=hx(color) + (alpha,))


def leaf(d, cx, cy, L, W, ang, color, alpha=255):
    pts = []
    for i in range(19):
        t = i / 18
        x, y = (t - 0.5) * L, math.sin(math.pi * t) * W / 2
        pts.append((x, y))
    upper = [(x, y) for x, y in pts]
    lower = [(x, -y) for x, y in reversed(pts)]
    a = math.radians(ang)
    out = [(cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a))
           for x, y in upper + lower]
    d.polygon(out, fill=hx(color) + (alpha,))


def frond(d, cx, cy, L, W, ang, droop, color, alpha=255):
    """Curved, drooping palm frond — reads far more naturally than a straight lens."""
    a = math.radians(ang)
    spine = []
    for i in range(25):
        t = i / 24
        x = L * t
        y = droop * L * (t ** 2)
        spine.append((x, y))
    up, dn = [], []
    for i, (x, y) in enumerate(spine):
        t = i / 24
        wd = W * math.sin(math.pi * min(1, t * 1.05)) ** 0.7 * (1 - t * 0.35)
        up.append((x, y - wd / 2))
        dn.append((x, y + wd / 2))
    pts = up + dn[::-1]
    out = [(cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)) for x, y in pts]
    d.polygon(out, fill=hx(color) + (alpha,))


def island(d, cx, base, wd, ht, color, alpha=255):
    pts = []
    for i in range(49):
        t = i / 48
        pts.append((cx - wd / 2 + wd * t, base - ht * (math.sin(math.pi * t) ** 1.5)))
    pts += [(cx + wd / 2, base + 1), (cx - wd / 2, base + 1)]
    d.polygon(pts, fill=hx(color) + (alpha,))


def balloon(d, cx, cy, r, color, alpha=255, ratio=1.12):
    d.ellipse([cx - r, cy - r * ratio, cx + r, cy + r * ratio * 0.72], fill=hx(color) + (alpha,))
    d.polygon([(cx - r * 0.52, cy + r * 0.5), (cx + r * 0.52, cy + r * 0.5),
               (cx + r * 0.13, cy + r * 1.06), (cx - r * 0.13, cy + r * 1.06)],
              fill=hx(color) + (alpha,))
    d.line([(cx - r * 0.17, cy + r * 1.06), (cx - r * 0.17, cy + r * 1.34)], fill=hx(color) + (alpha,), width=max(1, int(r * 0.05)))
    d.line([(cx + r * 0.17, cy + r * 1.06), (cx + r * 0.17, cy + r * 1.34)], fill=hx(color) + (alpha,), width=max(1, int(r * 0.05)))
    d.rectangle([cx - r * 0.2, cy + r * 1.3, cx + r * 0.2, cy + r * 1.52], fill=hx(color) + (alpha,))


def chimney(d, cx, base, ht, wd, color, alpha=255):
    """Cappadocia-style fairy chimney: tapered cone + a wider cap stone."""
    neck = base - ht * 0.70
    body = [(cx - wd / 2, base)]
    for i in range(21):
        t = i / 20
        y = base - ht * 0.70 * t
        wx = wd / 2 * (1 - 0.62 * t ** 1.25)
        body.append((cx - wx, y))
    for i in range(20, -1, -1):
        t = i / 20
        y = base - ht * 0.70 * t
        wx = wd / 2 * (1 - 0.62 * t ** 1.25)
        body.append((cx + wx, y))
    body.append((cx + wd / 2, base))
    d.polygon(body, fill=hx(color) + (alpha,))
    # cap stone: wider than the neck, with a softly domed top
    cw = wd * 0.42
    d.ellipse([cx - cw, neck - ht * 0.05, cx + cw, neck + ht * 0.12], fill=hx(color) + (alpha,))
    d.ellipse([cx - cw * 0.72, neck - ht * 0.24, cx + cw * 0.72, neck + ht * 0.04], fill=hx(color) + (alpha,))


def rr(d, box, r, fill, outline=None, width=0):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def save(arr, name, quality=74):
    img = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))
    img.save(os.path.join(OUT, name), 'WEBP', quality=quality, method=6)
    print(f'  {name:26s} {img.width}x{img.height}  {os.path.getsize(os.path.join(OUT, name))//1024} KB')


# ------------------------------------------------------------------- scenes
def coast_sunset(w, h, warm=False):
    """Mediterranean cape at golden hour — the signature image of the site."""
    if warm:
        stops = [(0, '#2C4763'), (0.18, '#6A6088'), (0.34, '#B0707E'), (0.50, '#DE8E6A'),
                 (0.60, '#F0B45F'), (0.68, '#F9E2B4')]
        seaC = [(0, '#F2C88E'), (0.10, '#C4855F'), (0.40, '#5C7078'), (1, '#20323E')]
        hz, sunx, sunr = 0.70, 0.46, 0.036
    else:
        stops = [(0, '#173245'), (0.18, '#3F5570'), (0.34, '#8E6B7C'), (0.48, '#D48A62'),
                 (0.58, '#EEB259'), (0.655, '#F8DFA6')]
        seaC = [(0, '#F0C086'), (0.10, '#B87A59'), (0.40, '#4A6873'), (1, '#182D39')]
        hz, sunx, sunr = 0.655, 0.665, 0.030
    a = sky(w, h, stops)
    a = glow(a, sunx, hz - 0.055, 0.50, '#E7B84B', 0.80, 2.4, 0.66)
    a = glow(a, sunx, hz - 0.055, 0.11, '#FFF1CE', 1.0, 1.9)
    sun_y = hz - 0.055

    def disc(d, W, H):
        r = W * sunr
        d.ellipse([sunx * W - r, sun_y * H - r, sunx * W + r, sun_y * H + r], fill=hx('#FFEBC0') + (150,))
    a = paint(a, disc, blur=w * 0.014)
    a = glow(a, sunx, sun_y, sunr * 2.4, '#FFF3D4', 0.55, 2.0)

    sea = sky(w, h, seaC)
    a = band(a, sea, hz, 1.2, 0.004)

    # far islands on the horizon
    def far(d, W, H):
        island(d, W * 0.14, H * hz + 2, W * 0.34, H * 0.052, '#8A8296', 150)
        island(d, W * 0.88, H * hz + 2, W * 0.30, H * 0.038, '#7C7689', 165)
        island(d, W * 0.42, H * hz + 2, W * 0.16, H * 0.018, '#6E6A7C', 175)
    a = paint(a, far, blur=1.6)

    def glitter(d, W, H):
        rnd = random.Random(7)
        for i in range(190):
            t = rnd.random() ** 0.75
            y = hz * H + t * H * (1 - hz) * 1.02
            x = sunx * W + rnd.gauss(0, (0.010 + t * 0.115) * W)
            ln = W * (0.004 + t * 0.032) * rnd.uniform(0.4, 1.5)
            al = int(195 * (1 - t * 0.72) * rnd.uniform(0.3, 1))
            d.line([(x - ln, y), (x + ln, y)], fill=hx('#FFEFD0') + (al,), width=max(1, int(H * 0.0024)))
    a = paint(a, glitter, blur=1.1)

    # foreground cape with umbrella pines
    def cape(d, W, H):
        span = W * 0.40
        def cy(t):
            return H * (hz + 0.045 + 0.34 * (t ** 2.0)) - H * 0.028 * math.sin(t * 8.5)
        pts = [(0, cy(0))]
        for i in range(1, 61):
            t = i / 60
            pts.append((span * t, cy(t)))
        pts += [(span, H + 20), (0, H + 20)]
        d.polygon(pts, fill=hx('#152630') + (255,))
        rnd = random.Random(21)
        for i in range(7):
            t = i / 7 + rnd.uniform(-0.03, 0.03)
            x = span * max(0.02, t)
            y = cy(max(0.02, t)) - 1
            s = W * rnd.uniform(0.007, 0.021)
            d.line([(x, y), (x, y - s * 1.9)], fill=hx('#152630') + (255,), width=max(1, int(s * 0.22)))
            d.ellipse([x - s, y - s * 2.9, x + s, y - s * 1.5], fill=hx('#152630') + (255,))
    a = paint(a, cape, blur=0.6)

    def birds(d, W, H):
        rnd = random.Random(33)
        for i in range(7):
            x, y = W * rnd.uniform(0.42, 0.94), H * rnd.uniform(0.14, 0.40)
            s = W * rnd.uniform(0.005, 0.011)
            d.line([(x - s, y), (x - s * 0.4, y - s * 0.42)], fill=hx('#2A2A34') + (150,), width=max(1, int(s * 0.22)))
            d.line([(x - s * 0.4, y - s * 0.42), (x + s * 0.2, y)], fill=hx('#2A2A34') + (150,), width=max(1, int(s * 0.22)))
    a = paint(a, birds)
    a = paint(a, lambda d, W, H: d.rectangle([0, H * (hz - 0.035), W, H * (hz + 0.02)], fill=hx('#FFDFA6') + (60,)), blur=26)
    a = glow(a, sunx - 0.05, hz + 0.10, 0.55, '#EBA96C', 0.18, 1.6, 0.45)
    return vignette(grain(a, 6.5, 3), 0.34)


def terracotta_arch(w, h, variant='wall'):
    cave = variant == 'cave'
    if cave:
        a = sky(w, h, [(0, '#A98873'), (0.42, '#7E6152'), (1, '#4E3B33')], angle=70)
        a = glow(a, 0.5, 0.30, 0.5, '#E8C79F', 0.30, 2.0)
        view = sky(w, h, [(0, '#8E7EA0'), (0.30, '#C88A79'), (0.52, '#E9AE69'), (0.72, '#F3D9AC'),
                          (0.80, '#B99377'), (1, '#7A5D4C')])
    else:
        a = sky(w, h, [(0, '#EAC7A6'), (0.42, '#D2916F'), (1, '#A9614A')], angle=62)
        a = glow(a, 0.18, 0.12, 0.55, '#FFE2BE', 0.42, 1.9)
        view = sky(w, h, [(0, '#F4E9D4'), (0.46, '#EBD3AE'), (0.56, '#9FB3AB'), (1, '#5C8079')])
    aw, ax, ay = (w * 0.44, 0.50, 0.26) if cave else (w * 0.50, 0.50, 0.20)
    mask = Image.new('L', (w, h), 0)
    md = ImageDraw.Draw(mask)
    left, right = ax * w - aw / 2, ax * w + aw / 2
    bottom = 0.68 if cave else 0.90
    md.ellipse([left, ay * h - aw / 2, right, ay * h + aw / 2], fill=255)
    md.rectangle([left, ay * h, right, h * bottom], fill=255)
    m = (np.asarray(mask.filter(ImageFilter.GaussianBlur(1.2))).astype(float) / 255)[..., None]
    a = a * (1 - m) + view * m
    if cave:
        def in_view(d, W, H):
            rnd = random.Random(77)
            for i in range(9):
                r = W * rnd.uniform(0.013, 0.030)
                bx = rnd.uniform(left + r * 1.4, right - r * 1.4)
                by = rnd.uniform(ay * h - aw * 0.30, h * (bottom - 0.16))
                balloon(d, bx, by, r, ['#4A3236', '#5A3A38', '#2E2730'][i % 3], int(rnd.uniform(140, 225)))
        a = paint(a, in_view, blur=0.7)
        def sill(d, W, H):
            d.rectangle([left - W * 0.05, H * bottom, right + W * 0.05, H * (bottom + 0.045)], fill=hx('#C9A184') + (255,))
            rr(d, [W * 0.30, H * (bottom + 0.09), W * 0.52, H * (bottom + 0.20)], int(W * 0.03), hx('#E7B84B') + (255,))
            d.ellipse([W * 0.58, H * (bottom + 0.13), W * 0.70, H * (bottom + 0.19)], fill=hx('#F2E7D4') + (255,))
        a = paint(a, sill, blur=1.0)
    a = paint(a, lambda d, W, H: d.polygon([(0, 0), (W * 0.45, 0), (W * 0.16, H), (0, H * 0.72)],
                                           fill=hx('#FFF6E4') + (36,)), blur=42)
    def plants(d, W, H):
        if cave:
            return
        for i in range(11):
            ang = -128 + i * 16 + random.Random(i).uniform(-8, 8)
            frond(d, W * 0.06, H * 0.96, W * 0.34, W * 0.095, ang, 0.55 if -90 < ang < 90 else -0.55, '#3E5340', 240)
        for i in range(7):
            ang = 152 + i * 9
            frond(d, W * 0.99, H * 0.36, W * 0.30, W * 0.075, ang, -0.5, '#46583F', 205)
    a = paint(a, plants, blur=1.4)
    a = paint(a, lambda d, W, H: d.rectangle([0, H * 0.90, W, H], fill=hx('#8A4E3C') + (255,)), blur=2)
    a = shade(a, 0.85, 0.95, 0.5, '#5A2E24', 0.5)
    return vignette(grain(a, 6, 11), 0.30)


def olive_hills(w, h):
    a = sky(w, h, [(0, '#EBDCC0'), (0.45, '#F2E5CC'), (0.62, '#F6EEDC')])
    a = glow(a, 0.78, 0.20, 0.34, '#F6DFA8', 0.75, 2.0)
    for i, (b, c, amp, f, ph, sd) in enumerate([
            (0.60, '#9AA98C', 0.045, 1.1, 0.4, 2), (0.70, '#78906F', 0.05, 1.5, 1.8, 5),
            (0.82, '#5A7458', 0.045, 1.0, 3.1, 8), (0.94, '#3F5943', 0.04, 1.8, 0.9, 12)]):
        a = paint(a, (lambda b, c, amp, f, ph, sd: lambda d, W, H: ridge_poly(d, W, H, b, amp, f, ph, c, seed=sd))(b, c, amp, f, ph, sd), blur=0.8)
    def trees(d, W, H):
        rnd = random.Random(3)
        for i in range(46):
            x = rnd.uniform(0, W)
            row = rnd.choice([0.72, 0.80, 0.88])
            r = W * rnd.uniform(0.014, 0.028) * (row)
            y = H * row
            d.ellipse([x - r, y - r * 1.25, x + r, y + r * 0.7], fill=hx('#33492F') + (int(190 * row + 40),))
    a = paint(a, trees, blur=0.8)
    return vignette(grain(a, 5.5, 21), 0.28)


def dunes(w, h):
    a = sky(w, h, [(0, '#E8C79A'), (0.34, '#F1DCB2'), (0.5, '#F7E9CE')])
    a = glow(a, 0.30, 0.30, 0.36, '#FFE9B8', 0.85, 2.0)
    for b, c, amp, f, ph, sd in [(0.50, '#DFB27C', 0.05, 0.9, 1.2, 1), (0.62, '#CE9563', 0.055, 1.4, 2.6, 4),
                                 (0.76, '#B0713F', 0.06, 1.0, 0.3, 7), (0.93, '#7C4630', 0.05, 1.6, 2.0, 10)]:
        a = paint(a, (lambda b, c, amp, f, ph, sd: lambda d, W, H: ridge_poly(d, W, H, b, amp, f, ph, c, seed=sd))(b, c, amp, f, ph, sd), blur=1.0)
    a = glow(a, 0.30, 0.46, 0.5, '#F0C182', 0.28, 1.7, 0.55)
    a = shade(a, 0.85, 0.85, 0.55, '#6A3A28', 0.42)
    def camel(d, W, H):
        rnd = random.Random(5)
        for i in range(3):
            x = W * (0.60 + i * 0.08)
            y = H * (0.68 + i * 0.012)
            s = W * 0.020
            d.ellipse([x - s, y - s * 0.5, x + s, y + s * 0.45], fill=hx('#4A2C21') + (210,))
            d.polygon([(x + s * 0.7, y - s * 0.3), (x + s * 1.25, y - s * 1.35), (x + s * 1.5, y - s * 1.3),
                       (x + s * 1.0, y - s * 0.15)], fill=hx('#4A2C21') + (210,))
            for k in (-0.7, -0.2, 0.3, 0.75):
                d.line([(x + s * k, y + s * 0.2), (x + s * k, y + s * 1.0)], fill=hx('#4A2C21') + (210,), width=max(1, int(s * 0.16)))
    a = paint(a, camel, blur=0.7)
    return vignette(grain(a, 6, 31), 0.32)


def pool_arches(w, h, palette='hotel'):
    hotel = palette == 'hotel'
    wall, arch_c = ('#F0E6D6', '#22394B') if hotel else ('#EEDCC0', '#2E4640')
    a = sky(w, h, [(0, '#FBF5EA'), (0.5, wall), (1, '#DFCFB6')])
    a = glow(a, 0.2, 0.05, 0.6, '#FFF6E2', 0.5, 2.0)
    def arches(d, W, H):
        n, top, bot = (3, H * 0.16, H * 0.63) if hotel else (2, H * 0.20, H * 0.60)
        aw = W * (0.19 if hotel else 0.27)
        for i in range(n):
            cx = W * ((0.24 + i * 0.26) if hotel else (0.30 + i * 0.40))
            d.ellipse([cx - aw / 2, top - aw / 2, cx + aw / 2, top + aw / 2], fill=hx(arch_c) + (255,))
            d.rectangle([cx - aw / 2, top, cx + aw / 2, bot], fill=hx(arch_c) + (255,))
            d.ellipse([cx - aw / 2 + aw * 0.12, top - aw / 2 + aw * 0.14, cx + aw / 2 - aw * 0.12, top + aw / 2 - aw * 0.02],
                      fill=hx('#6E8E93') + (200,))
            d.rectangle([cx - aw / 2 + aw * 0.12, top, cx + aw / 2 - aw * 0.12, bot - aw * 0.05], fill=hx('#6E8E93') + (200,))
    a = paint(a, arches, blur=0.8)
    def palm(d, W, H):
        for i in range(10):
            ang = -8 + i * 20
            frond(d, W * 0.04, H * 0.06, W * 0.44, W * 0.085, ang, 0.4 if -90 < ang < 90 else -0.4, '#2E4238', 44)
    a = paint(a, palm, blur=3.0)
    wl = 0.70 if hotel else 0.66
    water = sky(w, h, [(0, '#9CC0B4'), (0.4, '#71A29B'), (1, '#3E6E6C')])
    a = band(a, water, wl, 1.2, 0.004)
    def ripples(d, W, H):
        rnd = random.Random(2)
        for i in range(44):
            y = H * (wl + 0.02 + rnd.random() * (0.97 - wl))
            x = rnd.uniform(0, W)
            ln = W * rnd.uniform(0.03, 0.13)
            d.line([(x, y), (x + ln, y)], fill=hx('#E6F2EC') + (int(rnd.uniform(40, 120)),), width=max(1, int(H * 0.003)))
    a = paint(a, ripples, blur=1.4)
    a = paint(a, lambda d, W, H: d.rectangle([0, H * (wl - 0.015), W, H * (wl + 0.006)], fill=hx('#F4EDE0') + (255,)), blur=1)
    return vignette(grain(a, 5.5, 41), 0.26)


def fabric(w, h, cols=None):
    cols = cols or ['#F6DED4', '#EFB8A6', '#E99A86', '#D97F6C', '#EFC0A6', '#F7E7DC']
    a = sky(w, h, [(0, '#FAEFE8'), (1, '#E08D77')])
    def waves(d, W, H):
        n = 9
        for i in range(n):
            c = cols[i % len(cols)]
            y0 = H * (i / n) * 1.08 - H * 0.06
            pts_top, pts_bot = [], []
            for x in range(0, W + 6, 6):
                t = x / W
                yt = y0 + H * 0.075 * math.sin(2 * math.pi * (0.9 + i * 0.12) * t + i * 0.9)
                yb = yt + H * (0.14 + 0.03 * math.sin(2 * math.pi * 1.4 * t + i))
                pts_top.append((x, yt)); pts_bot.append((x, yb))
            d.polygon(pts_top + pts_bot[::-1], fill=hx(c) + (232,))
    a = paint(a, waves, blur=2.2)
    a = glow(a, 0.25, 0.18, 0.5, '#FFF1E6', 0.55, 2.0)
    a = shade(a, 0.85, 0.9, 0.55, '#8E4A3A', 0.35)
    return vignette(grain(a, 6, 51), 0.28)


def phone_ugc(w, h):
    a = sky(w, h, [(0, '#20303C'), (0.55, '#3A2E31'), (1, '#5A3A31')], angle=110)
    a = glow(a, 0.5, 0.30, 0.45, '#E7B84B', 0.42, 2.2)
    def ring(d, W, H):
        r = W * 0.40
        d.ellipse([W * 0.5 - r, H * 0.30 - r, W * 0.5 + r, H * 0.30 + r], outline=hx('#FFF0CE') + (150,), width=int(W * 0.028))
    a = paint(a, ring, blur=10)
    pw, ph_ = w * 0.40, h * 0.52
    px, py = w * 0.5 - pw / 2, h * 0.30
    a = paint(a, lambda d, W, H: rr(d, [px - 8, py - 8, px + pw + 8, py + ph_ + 8], int(pw * 0.13), hx('#0E1820') + (255,)), blur=1)
    screen = sky(w, h, [(0, '#E7B84B'), (0.5, '#E08A63'), (1, '#C9684B')], angle=115)
    smask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(smask).rounded_rectangle([px, py, px + pw, py + ph_], radius=int(pw * 0.11), fill=255)
    m = (np.asarray(smask).astype(float) / 255)[..., None]
    a = a * (1 - m) + screen * m
    def ui(d, W, H):
        d.ellipse([px + pw * 0.36, py + ph_ * 0.40, px + pw * 0.64, py + ph_ * 0.40 + pw * 0.28], fill=(255, 255, 255, 220))
        d.polygon([(px + pw * 0.45, py + ph_ * 0.44), (px + pw * 0.45, py + ph_ * 0.44 + pw * 0.16),
                   (px + pw * 0.60, py + ph_ * 0.44 + pw * 0.08)], fill=hx('#C9684B') + (255,))
        for i, wd in enumerate([0.55, 0.38, 0.26]):
            d.rounded_rectangle([px + pw * 0.12, py + ph_ * (0.70 + i * 0.075), px + pw * (0.12 + wd), py + ph_ * (0.70 + i * 0.075) + ph_ * 0.028],
                                radius=int(ph_ * 0.014), fill=(255, 255, 255, 170 - i * 45))
        d.rounded_rectangle([px + pw * 0.34, py + ph_ * 0.045, px + pw * 0.66, py + ph_ * 0.075], radius=int(ph_ * 0.016), fill=(0, 0, 0, 120))
    a = paint(a, ui)
    def streak(d, W, H):
        for i, (x0, x1, al) in enumerate([(0.02, 0.30, 60), (0.72, 0.99, 45), (0.05, 0.22, 35)]):
            y = H * (0.18 + i * 0.28)
            d.line([(W * x0, y), (W * x1, y + H * 0.05)], fill=hx('#FFE7BE') + (al,), width=int(H * 0.012))
    a = paint(a, streak, blur=16)
    return vignette(grain(a, 6.5, 61), 0.42)


def dome_night(w, h):
    a = sky(w, h, [(0, '#0B1620'), (0.45, '#152833'), (0.8, '#1D3A38'), (1, '#16282C')])
    def stars(d, W, H):
        rnd = random.Random(12)
        for i in range(220):
            x, y = rnd.uniform(0, W), rnd.uniform(0, H * 0.62)
            r = rnd.uniform(0.6, 2.0) * (W / 1500)
            d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 246, 224, int(rnd.uniform(60, 210))))
    a = paint(a, stars)
    a = glow(a, 0.5, 0.72, 0.38, '#E7B84B', 0.30, 2.4, 0.7)
    def trees(d, W, H):
        rnd = random.Random(6)
        for lay, (bs, col, al) in enumerate([(0.74, '#16302F', 210), (0.82, '#0E2224', 235), (0.93, '#08171B', 255)]):
            x = -W * 0.05
            while x < W * 1.05:
                tw = W * rnd.uniform(0.015, 0.032)
                th = H * rnd.uniform(0.13, 0.30) * (1 + lay * 0.25)
                d.polygon([(x - tw, H * bs), (x, H * bs - th), (x + tw, H * bs)], fill=hx(col) + (al,))
                d.rectangle([x - tw * 0.12, H * bs - th * 0.1, x + tw * 0.12, H * bs + H * 0.05], fill=hx(col) + (al,))
                x += tw * rnd.uniform(1.4, 2.6)
    a = paint(a, trees, blur=1.1)
    cx, cy, r = 0.52, 0.665, w * 0.115
    a = glow(a, cx, cy - 0.02, 0.20, '#F2C766', 0.55, 2.2)
    def dome(d, W, H):
        X, Y = cx * W, cy * H
        d.ellipse([X - r, Y - r, X + r, Y + r], fill=hx('#F0D8A0') + (86,), outline=hx('#FFF0CC') + (170,), width=max(2, int(r * 0.035)))
        d.ellipse([X - r * 0.55, Y - r * 0.45, X + r * 0.25, Y + r * 0.35], fill=hx('#FFE9B8') + (60,))
        d.rectangle([X - r * 1.05, Y + r * 0.86, X + r * 1.05, Y + r * 1.02], fill=hx('#2A211C') + (255,))
    a = paint(a, dome, blur=0.8)
    def mist(d, W, H):
        d.rectangle([0, H * 0.68, W, H * 0.80], fill=hx('#9FB6B0') + (34,))
    a = paint(a, mist, blur=30)
    return vignette(grain(a, 6.5, 71), 0.46)


def forest_mist(w, h):
    a = sky(w, h, [(0, '#DCE3D8'), (0.45, '#C3D0C4'), (1, '#8FA795')])
    for lay, (bs, col, al, bl) in enumerate([(0.55, '#7E947F', 150, 3), (0.70, '#5E7A64', 190, 2), (0.86, '#3A5546', 225, 1), (1.02, '#22382F', 255, 0.6)]):
        def trees(d, W, H, bs=bs, col=col, al=al, lay=lay):
            rnd = random.Random(20 + lay)
            x = -W * 0.05
            while x < W * 1.05:
                tw = W * rnd.uniform(0.02, 0.045) * (1 + lay * 0.2)
                th = H * rnd.uniform(0.16, 0.34) * (1 + lay * 0.3)
                d.polygon([(x - tw, H * bs), (x, H * bs - th), (x + tw, H * bs)], fill=hx(col) + (al,))
                x += tw * rnd.uniform(1.3, 2.2)
        a = paint(a, trees, blur=bl)
    a = glow(a, 0.7, 0.18, 0.4, '#FFF6DF', 0.6, 2.0)
    a = paint(a, lambda d, W, H: d.rectangle([0, H * 0.48, W, H * 0.70], fill=hx('#EAF0E6') + (60,)), blur=40)
    return vignette(grain(a, 6, 81), 0.30)


def bokeh_warm(w, h):
    a = sky(w, h, [(0, '#2A1D1A'), (0.6, '#3F2A21'), (1, '#5B3A28')])
    def circles(d, W, H):
        rnd = random.Random(15)
        for i in range(34):
            r = W * rnd.uniform(0.03, 0.13)
            x, y = rnd.uniform(0, W), rnd.uniform(0, H)
            c = rnd.choice(['#E7B84B', '#E99A86', '#F4D89A', '#C9684B'])
            d.ellipse([x - r, y - r, x + r, y + r], fill=hx(c) + (int(rnd.uniform(40, 120)),))
    a = paint(a, circles, blur=22)
    def sharp(d, W, H):
        rnd = random.Random(16)
        for i in range(10):
            r = W * rnd.uniform(0.008, 0.022)
            x, y = rnd.uniform(0, W), rnd.uniform(0, H)
            d.ellipse([x - r, y - r, x + r, y + r], fill=hx('#FFE7B4') + (int(rnd.uniform(120, 220)),))
    a = paint(a, sharp, blur=2)
    return vignette(grain(a, 7, 91), 0.44)


def vegas_neon(w, h):
    a = sky(w, h, [(0, '#08111C'), (0.4, '#152033'), (0.72, '#3A2036'), (1, '#57262E')])
    a = glow(a, 0.5, 0.86, 0.6, '#C9684B', 0.45, 1.8, 0.45)
    def build(d, W, H):
        rnd = random.Random(30)
        x = 0
        while x < W:
            bw = W * rnd.uniform(0.05, 0.12)
            bh = H * rnd.uniform(0.16, 0.46)
            d.rectangle([x, H * 0.72 - bh, x + bw, H * 0.80], fill=hx('#0C1620') + (255,))
            for i in range(int(bh * bw / (W * H) * 900)):
                wx = x + rnd.uniform(bw * 0.08, bw * 0.9)
                wy = H * 0.72 - bh + rnd.uniform(bh * 0.06, bh * 0.92)
                s = W * 0.004
                d.rectangle([wx, wy, wx + s, wy + s * 1.6], fill=hx(rnd.choice(['#E7B84B', '#F4D89A', '#E99A86'])) + (int(rnd.uniform(70, 200)),))
            x += bw * rnd.uniform(1.02, 1.2)
    a = paint(a, build, blur=0.8)
    def neon(d, W, H):
        rnd = random.Random(31)
        for i, (x, top) in enumerate([(0.09, 0.40), (0.27, 0.30), (0.55, 0.44), (0.79, 0.34), (0.93, 0.48)]):
            c = ['#E7B84B', '#E99A86', '#C9684B', '#F4D89A', '#E7B84B'][i]
            d.line([(W * x, H * top), (W * x, H * 0.735)], fill=hx(c) + (235,), width=int(W * rnd.uniform(0.007, 0.012)))
        # vertical marquee sign
        rr(d, [W * 0.16, H * 0.20, W * 0.235, H * 0.66], int(W * 0.014), None, hx('#E7B84B') + (235,), int(W * 0.007))
        for i in range(5):
            y = H * (0.25 + i * 0.085)
            d.line([(W * 0.175, y), (W * 0.222, y)], fill=hx('#F4D89A') + (215,), width=int(W * 0.006))
        # oval sign + arrow marquee
        d.ellipse([W * 0.60, H * 0.17, W * 0.80, H * 0.37], outline=hx('#E99A86') + (225,), width=int(W * 0.008))
        d.line([(W * 0.645, H * 0.27), (W * 0.755, H * 0.27)], fill=hx('#F4D89A') + (215,), width=int(W * 0.007))
        d.polygon([(W * 0.36, H * 0.50), (W * 0.47, H * 0.50), (W * 0.515, H * 0.545),
                   (W * 0.47, H * 0.59), (W * 0.36, H * 0.59)], outline=hx('#C9684B') + (235,), width=int(W * 0.006))
    a = paint(a, neon, blur=1.2)
    a = paint(a, neon, blur=18, alpha=0.85)
    def trails(d, W, H):
        rnd = random.Random(32)
        for i in range(7):
            y = H * (0.82 + i * 0.024)
            c = '#FFE7B4' if i % 2 else '#E8746A'
            d.line([(W * rnd.uniform(-0.1, 0.2), y), (W * rnd.uniform(0.75, 1.15), y + H * 0.01)],
                   fill=hx(c) + (int(rnd.uniform(90, 190)),), width=int(H * rnd.uniform(0.006, 0.016)))
    a = paint(a, trails, blur=7)
    return vignette(grain(a, 7, 101), 0.48)


def neon_signs(w, h):
    a = sky(w, h, [(0, '#0D1420'), (1, '#2C1A24')])
    def sh(d, W, H):
        d.ellipse([W * 0.16, H * 0.12, W * 0.84, H * 0.52], outline=hx('#E7B84B') + (235,), width=int(W * 0.016))
        d.rounded_rectangle([W * 0.24, H * 0.56, W * 0.76, H * 0.76], radius=int(W * 0.05), outline=hx('#E99A86') + (235,), width=int(W * 0.014))
        d.line([(W * 0.32, H * 0.85), (W * 0.68, H * 0.85)], fill=hx('#C9684B') + (235,), width=int(W * 0.014))
        d.line([(W * 0.42, H * 0.30), (W * 0.58, H * 0.30)], fill=hx('#FFF0CC') + (200,), width=int(W * 0.010))
    a = paint(a, sh, blur=1)
    a = paint(a, sh, blur=22, alpha=0.9)
    return vignette(grain(a, 7, 111), 0.46)


def cappadocia_dawn(w, h, close=False):
    a = sky(w, h, [(0, '#33436B'), (0.22, '#6D5C7E'), (0.42, '#B87C78'), (0.60, '#DE9F6E'),
                   (0.72, '#E9BC72'), (0.80, '#F3DEBB')])
    a = glow(a, 0.22, 0.74, 0.42, '#F2C878', 0.72, 2.2, 0.6)
    a = glow(a, 0.22, 0.755, 0.07, '#FFF2D2', 0.9, 2.0)
    base = 0.90 if close else 0.83
    for lay, (bs, col, al, bl) in enumerate([(base - 0.04, '#B0897A', 190, 2.0), (base, '#8B6455', 225, 1.2), (base + 0.07, '#5A4038', 255, 0.7)]):
        def rocks(d, W, H, bs=bs, col=col, al=al, lay=lay):
            rnd = random.Random(40 + lay)
            d.rectangle([0, H * bs, W, H + 20], fill=hx(col) + (al,))
            x = -W * 0.02
            while x < W * 1.04:
                hgt = H * rnd.uniform(0.045, 0.095) * (1 + lay * 0.40) * (1.9 if close else 1.0)
                wd = W * rnd.uniform(0.045, 0.085) * (1 + lay * 0.35) * (1.4 if close else 1.0)
                chimney(d, x, H * bs + 2, hgt, wd, col, al)
                x += wd * rnd.uniform(2.0, 4.2)
        a = paint(a, rocks, blur=bl)
    def balloons(d, W, H):
        rnd = random.Random(44)
        n = 9 if close else 16
        for i in range(n):
            depth = rnd.random()
            r = W * ((0.055 + depth * 0.055) if close else (0.016 + depth * 0.040))
            x = rnd.uniform(W * 0.04, W * 0.97)
            y = rnd.uniform(H * 0.10, H * (0.70 if close else 0.66))
            col = ['#3B2E33', '#4A3236', '#5A3A38', '#2E2730'][i % 4]
            balloon(d, x, y, r, col, int(120 + depth * 125))
    a = paint(a, balloons, blur=0.9)
    a = paint(a, lambda d, W, H: d.rectangle([0, H * (base - 0.10), W, H * (base + 0.03)], fill=hx('#F1CFA0') + (54,)), blur=34)
    return vignette(grain(a, 6.5, 121), 0.36)


def backpack_bright(w, h):
    a = sky(w, h, [(0, '#FBF3E4'), (0.55, '#F5E0B8'), (1, '#EFC98F')])
    a = glow(a, 0.5, 0.40, 0.42, '#FFE9B4', 0.7, 2.0)
    a = paint(a, lambda d, W, H: d.ellipse([W * 0.28, H * 0.10, W * 0.72, H * 0.10 + W * 0.44], fill=hx('#E7B84B') + (210,)), blur=2)
    def bag(d, W, H):
        bw, bh = W * 0.24, H * 0.46
        x, y = W * 0.5 - bw / 2, H * 0.30
        d.rounded_rectangle([x - bw * 0.16, y + bh * 0.10, x + bw * 1.16, y + bh * 0.98], radius=int(bw * 0.22), fill=hx('#A9503A') + (255,))
        d.rounded_rectangle([x, y, x + bw, y + bh], radius=int(bw * 0.28), fill=hx('#C9684B') + (255,))
        d.rounded_rectangle([x + bw * 0.16, y + bh * 0.46, x + bw * 0.84, y + bh * 0.86], radius=int(bw * 0.16), fill=hx('#B0563B') + (255,))
        d.arc([x + bw * 0.30, y - bh * 0.10, x + bw * 0.70, y + bh * 0.12], 180, 360, fill=hx('#5A3A2E') + (255,), width=int(bw * 0.07))
        d.rounded_rectangle([x + bw * 0.22, y + bh * 0.16, x + bw * 0.78, y + bh * 0.26], radius=int(bw * 0.05), fill=hx('#E7B84B') + (255,))
        d.rounded_rectangle([x + bw * 0.38, y + bh * 0.60, x + bw * 0.62, y + bh * 0.68], radius=int(bw * 0.04), fill=hx('#F7F3EC') + (230,))
    a = paint(a, bag, blur=0.6)
    a = paint(a, lambda d, W, H: d.ellipse([W * 0.30, H * 0.775, W * 0.70, H * 0.83], fill=hx('#B98A5E') + (110,)), blur=16)
    def confetti(d, W, H):
        rnd = random.Random(55)
        for i in range(26):
            x, y = rnd.uniform(0, W), rnd.uniform(0, H)
            r = W * rnd.uniform(0.004, 0.011)
            c = rnd.choice(['#607A61', '#E99A86', '#C9684B', '#E7B84B'])
            d.ellipse([x - r, y - r, x + r, y + r], fill=hx(c) + (int(rnd.uniform(90, 190)),))
    a = paint(a, confetti, blur=0.8)
    return vignette(grain(a, 5.5, 131), 0.24)


def flatlay(w, h):
    a = sky(w, h, [(0, '#F7F1E6'), (1, '#E6DAC6')], angle=120)
    a = glow(a, 0.3, 0.2, 0.55, '#FFFBF2', 0.5, 1.9)
    def items(d, W, H):
        rr(d, [W * 0.08, H * 0.10, W * 0.44, H * 0.40], int(W * 0.04), hx('#607A61') + (255,))
        rr(d, [W * 0.11, H * 0.13, W * 0.41, H * 0.22], int(W * 0.02), hx('#4F6851') + (255,))
        rr(d, [W * 0.52, H * 0.08, W * 0.90, H * 0.30], int(W * 0.03), hx('#C9684B') + (255,))
        rr(d, [W * 0.56, H * 0.12, W * 0.72, H * 0.26], int(W * 0.02), hx('#E99A86') + (255,))
        d.ellipse([W * 0.60, H * 0.40, W * 0.86, H * 0.66], fill=hx('#22394B') + (255,))
        d.ellipse([W * 0.655, H * 0.455, W * 0.805, H * 0.605], fill=hx('#3E5D6E') + (255,))
        d.ellipse([W * 0.685, H * 0.485, W * 0.775, H * 0.575], fill=hx('#0E1820') + (255,))
        rr(d, [W * 0.10, H * 0.48, W * 0.44, H * 0.70], int(W * 0.02), hx('#E7B84B') + (255,))
        rr(d, [W * 0.14, H * 0.52, W * 0.34, H * 0.55], int(W * 0.01), hx('#B8892F') + (255,))
        rr(d, [W * 0.12, H * 0.76, W * 0.52, H * 0.92], int(W * 0.05), hx('#EFE3CE') + (255,))
        rr(d, [W * 0.60, H * 0.74, W * 0.88, H * 0.94], int(W * 0.03), hx('#B0563B') + (255,))
        d.ellipse([W * 0.66, H * 0.79, W * 0.82, H * 0.89], fill=hx('#F7F3EC') + (255,))
    a = paint(a, items, blur=0.7)
    a = shade(a, 0.9, 0.95, 0.6, '#8A7457', 0.35)
    return vignette(grain(a, 5.5, 141), 0.26)


def airport_light(w, h):
    a = sky(w, h, [(0, '#F3E7D0'), (0.5, '#EBD3A9'), (1, '#D9A97C')])
    a = glow(a, 0.72, 0.36, 0.42, '#FFF0CE', 0.8, 2.1)
    def frame(d, W, H):
        for i in range(4):
            x = W * (0.06 + i * 0.29)
            d.rectangle([x, 0, x + W * 0.020, H * 0.78], fill=hx('#2A3A44') + (235,))
        d.rectangle([0, H * 0.06, W, H * 0.085], fill=hx('#2A3A44') + (235,))
        d.rectangle([0, H * 0.78, W, H + 10], fill=hx('#233440') + (255,))
    a = paint(a, frame, blur=0.7)
    def plane(d, W, H):
        cx, cy, s = W * 0.42, H * 0.44, W * 0.16
        d.polygon([(cx - s, cy), (cx + s * 0.55, cy - s * 0.16), (cx + s, cy), (cx + s * 0.55, cy + s * 0.16)], fill=hx('#2A3A44') + (220,))
        d.polygon([(cx - s * 0.1, cy), (cx - s * 0.55, cy - s * 0.62), (cx - s * 0.30, cy - s * 0.62), (cx + s * 0.25, cy - s * 0.04)], fill=hx('#2A3A44') + (220,))
        d.polygon([(cx - s * 0.1, cy), (cx - s * 0.55, cy + s * 0.62), (cx - s * 0.30, cy + s * 0.62), (cx + s * 0.25, cy + s * 0.04)], fill=hx('#2A3A44') + (220,))
    a = paint(a, plane, blur=1.0)
    a = paint(a, lambda d, W, H: d.polygon([(W * 0.55, 0), (W * 0.95, 0), (W * 0.62, H * 0.78), (W * 0.30, H * 0.78)], fill=hx('#FFF3DA') + (46,)), blur=30)
    return vignette(grain(a, 6, 151), 0.34)


def desert_road(w, h):
    """Empty desert highway at dusk — the drive out of the city."""
    a = sky(w, h, [(0, '#2A3E5C'), (0.22, '#6A5A78'), (0.40, '#C0796E'), (0.55, '#E9A96A'), (0.62, '#F4D9A8')])
    a = glow(a, 0.50, 0.60, 0.40, '#F0C078', 0.7, 2.3, 0.6)
    a = paint(a, lambda d, W, H: ridge_poly(d, W, H, 0.635, 0.055, 0.9, 1.1, '#7A5E62', seed=5, alpha=200), blur=1.4)
    a = paint(a, lambda d, W, H: ridge_poly(d, W, H, 0.655, 0.032, 1.8, 3.0, '#5A4247', seed=8, alpha=225), blur=1)
    ground = sky(w, h, [(0, '#8A6450'), (0.35, '#6B4B3E'), (1, '#3A2A26')])
    a = band(a, ground, 0.655, 1.2, 0.004)
    def road(d, W, H):
        d.polygon([(W * 0.455, H * 0.655), (W * 0.545, H * 0.655), (W * 1.10, H), (W * -0.10, H)], fill=hx('#2C2A30') + (255,))
        y = H * 0.68
        i = 0
        while y < H * 1.02:
            seg = H * (0.012 + i * 0.010)
            t = (y / H - 0.655) / 0.345
            half = W * (0.004 + t * 0.030)
            d.polygon([(W * 0.5 - half * 0.5, y), (W * 0.5 + half * 0.5, y),
                       (W * 0.5 + half * 0.6, y + seg), (W * 0.5 - half * 0.6, y + seg)],
                      fill=hx('#E7B84B') + (230,))
            y += seg * 2.3
            i += 1
    a = paint(a, road, blur=0.8)
    def poles(d, W, H):
        for i, t in enumerate([0.06, 0.20, 0.36, 0.56]):
            x = W * (0.90 - t * 0.10)
            top = H * (0.60 - 0.20 * (1 - t))
            d.line([(x, H * (0.70 + t * 0.28)), (x, top)], fill=hx('#241F22') + (235,), width=max(1, int(W * (0.004 + t * 0.004))))
            d.line([(x - W * 0.02 * (1 + t), top + H * 0.01), (x + W * 0.02 * (1 + t), top + H * 0.01)],
                   fill=hx('#241F22') + (235,), width=max(1, int(W * (0.003 + t * 0.003))))
    a = paint(a, poles, blur=0.7)
    return vignette(grain(a, 6.5, 211), 0.40)


def range_cinematic(w, h):
    """Blue hour over a mountain lake — moody, high contrast, clearly composed."""
    a = sky(w, h, [(0, '#0C1A26'), (0.30, '#1B3247'), (0.48, '#3E5566'), (0.58, '#8A7B79'), (0.63, '#C79A76')])
    a = glow(a, 0.30, 0.60, 0.40, '#E0A469', 0.55, 2.4, 0.55)
    a = paint(a, lambda d, W, H: d.ellipse([W * 0.68, H * 0.11, W * 0.80, H * 0.11 + W * 0.12], fill=hx('#F6ECCF') + (225,)), blur=3)
    a = glow(a, 0.74, 0.16, 0.22, '#F6ECCF', 0.45, 2.2)
    for b, c, amp, f, ph, sd, al in [(0.615, '#4C5C6E', 0.075, 0.9, 0.4, 3, 210),
                                     (0.635, '#2E4152', 0.055, 1.5, 2.1, 6, 235),
                                     (0.660, '#16242F', 0.038, 2.3, 4.0, 9, 255)]:
        a = paint(a, (lambda b, c, amp, f, ph, sd, al: lambda d, W, H: ridge_poly(d, W, H, b, amp, f, ph, c, seed=sd, alpha=al))(b, c, amp, f, ph, sd, al), blur=1.0)
    lake = sky(w, h, [(0, '#B4885F'), (0.10, '#5C6470'), (0.5, '#22323F'), (1, '#0E1A24')])
    a = band(a, lake, 0.665, 1.2, 0.004)
    def refl(d, W, H):
        rnd = random.Random(64)
        for i in range(90):
            t = rnd.random() ** 0.7
            y = H * (0.67 + t * 0.33)
            x = W * 0.30 + rnd.gauss(0, (0.02 + t * 0.10) * W)
            ln = W * (0.006 + t * 0.03)
            d.line([(x - ln, y), (x + ln, y)], fill=hx('#E7C08A') + (int(150 * (1 - t * 0.8)),), width=max(1, int(H * 0.0026)))
    a = paint(a, refl, blur=1.2)
    a = paint(a, lambda d, W, H: d.polygon([(W * 0.46, 0), (W * 0.84, 0), (W * 0.56, H), (W * 0.10, H)],
                                           fill=hx('#CFE3DE') + (26,)), blur=40)
    a = paint(a, lambda d, W, H: d.rectangle([0, H * 0.60, W, H * 0.68], fill=hx('#D9B187') + (44,)), blur=26)
    return vignette(grain(a, 7, 161), 0.44)


def range_relatable(w, h):
    a = sky(w, h, [(0, '#F6D9C6'), (0.5, '#EFA98F'), (1, '#E38468')], angle=115)
    a = paint(a, lambda d, W, H: d.ellipse([W * 0.10, H * 0.14, W * 0.78, H * 0.14 + W * 0.68], fill=hx('#E7B84B') + (235,)), blur=1)
    a = paint(a, lambda d, W, H: d.ellipse([W * 0.44, H * 0.50, W * 0.98, H * 0.50 + W * 0.54], fill=hx('#607A61') + (215,)), blur=1)
    a = paint(a, lambda d, W, H: rr(d, [W * 0.08, H * 0.62, W * 0.52, H * 0.86], int(W * 0.10), hx('#F7F3EC') + (235,)), blur=1)
    def dots(d, W, H):
        rnd = random.Random(70)
        for i in range(30):
            x, y = rnd.uniform(0, W), rnd.uniform(0, H)
            r = W * rnd.uniform(0.006, 0.018)
            d.ellipse([x - r, y - r, x + r, y + r], fill=hx(rnd.choice(['#C9684B', '#F7F3EC', '#22394B'])) + (int(rnd.uniform(110, 210)),))
    a = paint(a, dots, blur=0.6)
    return vignette(grain(a, 5.5, 171), 0.22)


def range_educational(w, h):
    a = sky(w, h, [(0, '#FAF6EE'), (1, '#E9E0D0')])
    def grid(d, W, H):
        for i in range(1, 9):
            d.line([(W * i / 9, 0), (W * i / 9, H)], fill=hx('#22394B') + (18,), width=1)
        for i in range(1, 12):
            d.line([(0, H * i / 12), (W, H * i / 12)], fill=hx('#22394B') + (18,), width=1)
    a = paint(a, grid)
    def cards(d, W, H):
        for i in range(3):
            y = H * (0.16 + i * 0.24)
            rr(d, [W * 0.12, y, W * 0.88, y + H * 0.17], int(W * 0.045), hx('#FFFFFF') + (250,))
            d.ellipse([W * 0.17, y + H * 0.045, W * 0.17 + W * 0.09, y + H * 0.045 + W * 0.09], fill=hx(['#C9684B', '#607A61', '#E7B84B'][i]) + (255,))
            rr(d, [W * 0.33, y + H * 0.055, W * 0.78, y + H * 0.075], int(W * 0.01), hx('#22394B') + (190,))
            rr(d, [W * 0.33, y + H * 0.090, W * 0.62, y + H * 0.105], int(W * 0.008), hx('#22394B') + (95,))
    a = paint(a, cards, blur=0.5)
    a = shade(a, 0.5, 1.05, 0.8, '#B9AA92', 0.3)
    return vignette(grain(a, 5, 181), 0.20)


def range_aspirational(w, h):
    a = sky(w, h, [(0, '#5B5A83'), (0.24, '#A9748A'), (0.44, '#DE9A78'), (0.58, '#EBBE79'), (0.66, '#F4DDB4')])
    a = glow(a, 0.56, 0.60, 0.36, '#FFDFA0', 0.8, 2.2, 0.6)
    water = sky(w, h, [(0, '#E9C08F'), (0.2, '#B58D7E'), (0.6, '#5E7C86'), (1, '#37545F')])
    a = band(a, water, 0.66, 1.2, 0.005)
    def palms(d, W, H):
        for base_x, sc, al, tilt in [(0.11, 1.0, 255, 3), (0.88, 0.78, 238, -4)]:
            topx, topy = W * (base_x + 0.022 * sc), H * 0.40
            d.line([(W * base_x, H * 0.94), (topx, topy)], fill=hx('#22322F') + (al,), width=int(W * 0.013 * sc))
            for i in range(9):
                ang = -178 + i * 22 + tilt
                frond(d, topx, topy, W * 0.27 * sc, W * 0.085 * sc, ang, 0.75 if -90 < ang < 90 else -0.75, '#22322F', al)
            d.ellipse([topx - W * 0.012 * sc, topy - W * 0.012 * sc, topx + W * 0.012 * sc, topy + W * 0.012 * sc], fill=hx('#22322F') + (al,))
    a = paint(a, palms, blur=0.8)
    a = paint(a, lambda d, W, H: d.rectangle([0, H * 0.655, W, H * 0.675], fill=hx('#F7E2BC') + (200,)), blur=3)
    return vignette(grain(a, 6, 191), 0.34)


def studio_object(w, h, kind):
    if kind == 'bag':
        a = sky(w, h, [(0, '#F6EEE0'), (1, '#E2C7AE')], angle=110)
        a = glow(a, 0.28, 0.18, 0.5, '#FFFAF0', 0.55, 2.0)
        def obj(d, W, H):
            x0, x1 = W * 0.16, W * 0.84
            y0, y1 = H * 0.40, H * 0.70
            rr(d, [x0, y0, x1, y1], int(H * 0.11), hx('#607A61') + (255,))
            rr(d, [x0 + W * 0.06, y0 - H * 0.04, x1 - W * 0.06, y0 + H * 0.05], int(H * 0.05), hx('#4E6650') + (255,))
            d.arc([W * 0.38, y0 - H * 0.16, W * 0.62, y0 + H * 0.04], 180, 360, fill=hx('#3A2A22') + (255,), width=int(H * 0.022))
            rr(d, [x0 + W * 0.08, y0 + H * 0.10, x0 + W * 0.30, y1 - H * 0.05], int(H * 0.03), hx('#55704F') + (255,))
            rr(d, [W * 0.46, y0 + H * 0.13, W * 0.56, y0 + H * 0.17], int(H * 0.02), hx('#E7B84B') + (255,))
        a = paint(a, obj, blur=0.6)
        a = paint(a, lambda d, W, H: d.ellipse([W * 0.18, H * 0.685, W * 0.82, H * 0.745], fill=hx('#9C8168') + (120,)), blur=18)
    elif kind == 'product':
        a = sky(w, h, [(0, '#C9684B'), (0.499, '#C9684B'), (0.501, '#F4EDE0'), (1, '#F4EDE0')])
        def obj(d, W, H):
            cx = W * 0.5
            rr(d, [cx - W * 0.13, H * 0.30, cx + W * 0.13, H * 0.78], int(W * 0.09), hx('#22394B') + (255,))
            rr(d, [cx - W * 0.055, H * 0.22, cx + W * 0.055, H * 0.32], int(W * 0.02), hx('#E7B84B') + (255,))
            rr(d, [cx - W * 0.10, H * 0.44, cx + W * 0.10, H * 0.54], int(W * 0.02), hx('#F7F3EC') + (240,))
            rr(d, [cx - W * 0.065, H * 0.60, cx + W * 0.065, H * 0.635], int(W * 0.012), hx('#E99A86') + (240,))
        a = paint(a, obj, blur=0.6)
        a = paint(a, lambda d, W, H: d.ellipse([W * 0.30, H * 0.76, W * 0.70, H * 0.82], fill=hx('#8A5442') + (110,)), blur=14)
    else:  # app
        a = sky(w, h, [(0, '#7A9078'), (1, '#4C6650')], angle=110)
        a = glow(a, 0.3, 0.2, 0.5, '#DCE8D6', 0.35, 2.0)
        pw, ph_ = w * 0.44, h * 0.62
        px, py = w * 0.5 - pw / 2, h * 0.20
        a = paint(a, lambda d, W, H: rr(d, [px - 7, py - 7, px + pw + 7, py + ph_ + 7], int(pw * 0.13), hx('#1B2A22') + (255,)), blur=1)
        a = paint(a, lambda d, W, H: rr(d, [px, py, px + pw, py + ph_], int(pw * 0.12), hx('#F7F3EC') + (255,)))
        def ui(d, W, H):
            rr(d, [px + pw * 0.07, py + ph_ * 0.06, px + pw * 0.93, py + ph_ * 0.36], int(pw * 0.08), hx('#C9DACD') + (255,))
            rnd = random.Random(88)
            for i in range(6):
                y = py + ph_ * (0.10 + i * 0.045)
                d.line([(px + pw * 0.10, y), (px + pw * (0.30 + rnd.random() * 0.55), y)], fill=hx('#8FA894') + (255,), width=int(pw * 0.012))
            d.ellipse([px + pw * 0.55, py + ph_ * 0.20, px + pw * 0.64, py + ph_ * 0.20 + pw * 0.09], fill=hx('#C9684B') + (255,))
            for i in range(3):
                y = py + ph_ * (0.44 + i * 0.16)
                rr(d, [px + pw * 0.07, y, px + pw * 0.93, y + ph_ * 0.12], int(pw * 0.05), hx('#E7DECD') + (255,))
                d.ellipse([px + pw * 0.12, y + ph_ * 0.028, px + pw * 0.12 + pw * 0.11, y + ph_ * 0.028 + pw * 0.11], fill=hx(['#E7B84B', '#607A61', '#E99A86'][i]) + (255,))
                rr(d, [px + pw * 0.29, y + ph_ * 0.035, px + pw * 0.80, y + ph_ * 0.055], int(pw * 0.01), hx('#22394B') + (170,))
                rr(d, [px + pw * 0.29, y + ph_ * 0.068, px + pw * 0.62, y + ph_ * 0.082], int(pw * 0.008), hx('#22394B') + (90,))
        a = paint(a, ui)
    return vignette(grain(a, 5.5, 201), 0.28)


# --------------------------------------------------------------------- build
if __name__ == '__main__':
    print('Generating placeholder visuals →', OUT)
    jobs = [
        ('hero-coast.webp',        lambda: coast_sunset(2000, 1180), 76),
        ('contact-sunset.webp',    lambda: coast_sunset(1700, 1150, warm=True), 76),
        ('portrait-arch.webp',     lambda: terracotta_arch(1000, 1300), 76),
        ('about-hills.webp',       lambda: olive_hills(900, 1120), 74),
        ('cat-travel.webp',        lambda: dunes(900, 1125), 74),
        ('cat-hospitality.webp',   lambda: pool_arches(900, 1125), 74),
        ('cat-lifestyle.webp',     lambda: fabric(900, 1125), 74),
        ('cat-ugc.webp',           lambda: phone_ugc(900, 1125), 74),
        ('work-bubbleroom.webp',   lambda: dome_night(1500, 1050), 74),
        ('bubbleroom-2.webp',      lambda: forest_mist(820, 1025), 72),
        ('bubbleroom-3.webp',      lambda: bokeh_warm(820, 1025), 72),
        ('work-vegas.webp',        lambda: vegas_neon(1500, 1050), 74),
        ('vegas-2.webp',           lambda: neon_signs(820, 1025), 72),
        ('vegas-3.webp',           lambda: desert_road(820, 1025), 72),
        ('work-cappadocia.webp',   lambda: cappadocia_dawn(1500, 1050), 74),
        ('cappadocia-2.webp',      lambda: cappadocia_dawn(820, 1025, close=True), 72),
        ('cappadocia-3.webp',      lambda: terracotta_arch(820, 1025, variant='cave'), 72),
        ('work-backpack.webp',     lambda: backpack_bright(1500, 1050), 74),
        ('backpack-2.webp',        lambda: flatlay(820, 1025), 72),
        ('backpack-3.webp',        lambda: airport_light(820, 1025), 72),
        ('range-cinematic.webp',   lambda: range_cinematic(860, 1150), 74),
        ('range-relatable.webp',   lambda: range_relatable(860, 1150), 74),
        ('range-educational.webp', lambda: range_educational(860, 1150), 74),
        ('range-aspirational.webp',lambda: range_aspirational(860, 1150), 74),
        ('spec-bag.webp',          lambda: studio_object(860, 1075, 'bag'), 74),
        ('spec-hotel.webp',        lambda: pool_arches(860, 1075, palette='spec'), 74),
        ('spec-app.webp',          lambda: studio_object(860, 1075, 'app'), 74),
        ('spec-fashion.webp',      lambda: fabric(860, 1075, ['#F5E7CE', '#E7B84B', '#EFC9A8', '#E99A86', '#F7F3EC', '#DFAE7C']), 74),
        ('spec-product.webp',      lambda: studio_object(860, 1075, 'product'), 74),
    ]
    total = 0
    for name, fn, q in jobs:
        save(fn(), name, q)
        total += os.path.getsize(os.path.join(OUT, name))
    print(f'\nTotal: {total/1024/1024:.2f} MB across {len(jobs)} files')
