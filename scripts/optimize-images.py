"""
Generate web-ready WebP derivatives from the original photographs.

Reads:  Media/<Category>/<file>.jpg   (originals, never modified)
Writes: public/media/<category-slug>/<name>-<width>.webp
        src/data/manifest.json        (dimensions + category index)

Run again any time photos are added; existing derivatives are skipped
unless --force is passed.

Usage:
    python scripts/optimize-images.py
    python scripts/optimize-images.py --force
"""

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

# Widths generated for every photograph. The grid uses the small ones,
# the lightbox and hero use the large ones.
WIDTHS = [640, 1280, 2000]
# Per-format quality. The scales are NOT comparable: AVIF at 80 came out 53%
# LARGER than WebP at 80. Measured on sample frames, AVIF 55 lands ~36% under
# WebP 80 at matching fidelity, which is the point of shipping it at all.
FORMATS = {"webp": ("WEBP", 80), "avif": ("AVIF", 55)}

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "Media"
OUTPUT_DIR = ROOT / "public" / "media"
MANIFEST = ROOT / "src" / "data" / "manifest.json"

FORCE = "--force" in sys.argv


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def process_image(source: Path, out_dir: Path) -> dict | None:
    """Write every WebP size for one photo, return its manifest entry."""
    stem = slugify(source.stem)

    with Image.open(source) as img:
        # Honour the camera's EXIF orientation flag, then drop all EXIF.
        # Travel photos frequently carry GPS coordinates that should not
        # be published alongside them.
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")
        full_w, full_h = img.size

        for width in WIDTHS:
            pending = {
                ext: out_dir / f"{stem}-{width}.{ext}"
                for ext in FORMATS
                if FORCE or not (out_dir / f"{stem}-{width}.{ext}").exists()
            }
            if not pending:
                continue

            # Never upscale past the original.
            w = min(width, full_w)
            h = round(full_h * (w / full_w))
            resized = img.resize((w, h), Image.LANCZOS)
            for ext, target in pending.items():
                fmt, quality = FORMATS[ext]
                resized.save(target, fmt, quality=quality)

    return {"src": stem, "width": full_w, "height": full_h}


def main() -> None:
    if not SOURCE_DIR.is_dir():
        sys.exit(f"Source folder not found: {SOURCE_DIR}")

    categories = sorted(p for p in SOURCE_DIR.iterdir() if p.is_dir())
    if not categories:
        sys.exit(f"No category folders inside {SOURCE_DIR}")

    manifest: dict[str, list[dict]] = {}

    for category in categories:
        slug = slugify(category.name)
        out_dir = OUTPUT_DIR / slug
        out_dir.mkdir(parents=True, exist_ok=True)

        photos = sorted(
            p for p in category.iterdir()
            if p.suffix.lower() in {".jpg", ".jpeg", ".png"}
        )

        entries = []
        for index, photo in enumerate(photos, start=1):
            entry = process_image(photo, out_dir)
            if entry:
                entries.append(entry)
            print(f"  [{index}/{len(photos)}] {category.name}/{photo.name}", flush=True)

        manifest[slug] = entries
        print(f"{category.name}: {len(entries)} photos -> public/media/{slug}/")

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\nManifest written to {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
