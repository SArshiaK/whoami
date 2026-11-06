"""Rebuild brand marks: emblem-only, transparent bg, no white plates."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ASSETS = Path(r"C:\Users\User\.cursor\projects\d-Projects-whoami\assets")
OUT = Path(r"d:\Projects\whoami\public\logos")
OUT.mkdir(parents=True, exist_ok=True)


def flood_transparent(im: Image.Image, tol: int = 18) -> Image.Image:
    """Make near-white background transparent via edge flood-fill.

    Preserves intentional white regions inside the logo (not edge-connected).
    """
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    def is_bg(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        if a < 10:
            return True
        return r >= 255 - tol and g >= 255 - tol and b >= 255 - tol

    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        px[x, y] = (255, 255, 255, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and is_bg(nx, ny):
                seen[ny][nx] = True
                q.append((nx, ny))
    return rgba


def flood_transparent_dark(im: Image.Image, tol: int = 28) -> Image.Image:
    """Make near-black background transparent via edge flood-fill."""
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    def is_bg(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        if a < 10:
            return True
        return (r + g + b) / 3 <= tol

    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and is_bg(nx, ny):
                seen[ny][nx] = True
                q.append((nx, ny))
    return rgba


def trim(im: Image.Image, pad: int = 2) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def to_square(im: Image.Image, size: int = 512, pad_ratio: float = 0.12) -> Image.Image:
    im = trim(im, pad=1)
    w, h = im.size
    side = int(max(w, h) * (1 + pad_ratio * 2))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def circular_alpha(im: Image.Image) -> Image.Image:
    size = im.size[0]
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, size - 2, size - 2), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.8))
    r, g, b, a = im.split()
    from PIL import ImageChops

    return Image.merge("RGBA", (r, g, b, ImageChops.multiply(a, mask)))


# ---------- Iran Zamin: swirl emblem only ----------
iz = Image.open(ASSETS / "logo-928aa719-b55f-43da-b489-3dcfa173afb8.jpg").convert("RGBA")
# pink core ~ (168, 40); emblem radius ~39–42. Stay inside circle — no calligraphy.
cx, cy, rad = 168, 40, 38
emblem = iz.crop((cx - rad, cy - rad, cx + rad, cy + rad))
emblem = flood_transparent(emblem, tol=12)
# kill leftover calligraphy pixels on left edge
px = emblem.load()
ew, eh = emblem.size
for y in range(eh):
    for x in range(ew):
        # outside true circle → clear
        if (x - rad) ** 2 + (y - rad) ** 2 > (rad - 0.5) ** 2:
            px[x, y] = (255, 255, 255, 0)
iz_out = to_square(emblem, size=512, pad_ratio=0.08)
iz_out = circular_alpha(iz_out)
iz_out.save(OUT / "iranzamin.png", optimize=True)
print("iranzamin", iz_out.size)

# ---------- Faraz: stylized ف mark (pin + pink dot) ----------
faraz = Image.open(ASSETS / "plusLogop-2a935d89-dd29-4246-b2b1-94a9f329fa62.jpg").convert("RGBA")
# Rightmost glyph is ف with pink nuqta. Crop generously then flood.
fe = faraz.crop((148, 0, 192, 48))
fe = flood_transparent(fe, tol=14)
# Drop any leftover stroke from previous letter on far left
px = fe.load()
fw, fh = fe.size
for y in range(fh):
    for x in range(min(4, fw)):
        r, g, b, a = px[x, y]
        if a > 0 and r < 180:
            # thin leftover from previous letter
            px[x, y] = (255, 255, 255, 0)
fe = trim(fe, pad=2)
faraz_out = to_square(fe, size=512, pad_ratio=0.16)
faraz_out.save(OUT / "faraz.png", optimize=True)
print("faraz", faraz_out.size)

# ---------- IUST: gear + torch only (no calligraphy) ----------
iust = Image.open(ASSETS / "image-da7b876f-fde2-4fec-b919-e75a7ea1dbd3.png").convert("RGBA")
# Emblem lives in top ~0–200; calligraphy below ~205
emblem = iust.crop((10, 5, 265, 200))
emblem = flood_transparent(emblem, tol=16)
emblem = trim(emblem, pad=4)
iust_out = to_square(emblem, size=512, pad_ratio=0.1)
iust_out.save(OUT / "iust.png", optimize=True)
print("iust", iust_out.size)

# ---------- Bazaar / Myket keep clean transparent icons, upscale ----------
bazaar = Image.open(ASSETS / "bazaar-logo-ca52c752-606a-4cd4-819d-92354ba262f1.png")
bazaar = flood_transparent_dark(bazaar, tol=30)
bazaar = trim(bazaar)
to_square(bazaar, size=512, pad_ratio=0.14).save(OUT / "bazaar.png", optimize=True)

myket = Image.open(ASSETS / "download-9844884b-1510-4f49-a3b2-cc6c56c3e406.png")
myket = flood_transparent_dark(myket, tol=22)
myket = trim(myket)
mw, mh = myket.size
myket_icon = myket.crop((max(0, mw - mh), 0, mw, mh))
myket_out = to_square(myket_icon, size=512, pad_ratio=0.04)
myket_out = circular_alpha(myket_out)
myket_out.save(OUT / "myket.png", optimize=True)

# cleanup debug
for p in OUT.glob("_dbg*"):
    p.unlink()
print("files", sorted(x.name for x in OUT.iterdir()))
