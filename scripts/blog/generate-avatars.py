#!/usr/bin/env python3
"""
Continental Media — one-time prep: Rafael Aguirre's and Pepe Bermúdez's
existing square source photos (public/assets/images/team/<slug>.jpg,
720x720, already a clean centered crop used by the home page's
about-teaser carousel) into circular, alpha-matted WebP avatars for the
blog (card avatar, hero signature, author box all share one file, sized
down via CSS/HTML width — no separate crop per use site).

Not part of the regular blog:build pipeline — run by hand if a source
photo ever changes:
    python3 scripts/blog/generate-avatars.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

REPO_ROOT = Path(__file__).resolve().parents[2]
SRC_DIR = REPO_ROOT / "public" / "assets" / "images" / "team"
OUT_DIR = REPO_ROOT / "public" / "assets" / "images" / "blog" / "authors"

AUTHORS = ["rafael-aguirre", "pepe-bermudez"]

# Master output size. Displayed everywhere via CSS/HTML width (card
# avatar ~40px, author box ~72px, hero signature ~96px) so one file
# covers every use site at a sharp max pixel density.
OUT_SIZE = 640
# Supersample the circular mask at 4x then downsample on save, so the
# edge is anti-aliased instead of jagged.
SS = 4


def make_circular_avatar(src_path: Path, out_path: Path) -> None:
    img = Image.open(src_path).convert("RGB")
    side = min(img.size)
    left = (img.width - side) // 2
    top = (img.height - side) // 2
    img = img.crop((left, top, left + side, top + side)).resize(
        (OUT_SIZE * SS, OUT_SIZE * SS), Image.LANCZOS
    )

    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)

    img = img.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
    mask = mask.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)

    out = Image.new("RGBA", (OUT_SIZE, OUT_SIZE))
    out.paste(img, (0, 0))
    out.putalpha(mask)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out.save(out_path, "WEBP", quality=92, method=6)


def main() -> None:
    for slug in AUTHORS:
        src = SRC_DIR / f"{slug}.jpg"
        if not src.exists():
            raise SystemExit(f"ERROR: source photo not found: {src}")
        out = OUT_DIR / f"{slug}.webp"
        make_circular_avatar(src, out)
        print(f"OK: {src.relative_to(REPO_ROOT)} -> {out.relative_to(REPO_ROOT)} ({OUT_SIZE}x{OUT_SIZE})")


if __name__ == "__main__":
    main()
