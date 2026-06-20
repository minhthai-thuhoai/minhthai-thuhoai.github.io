#!/usr/bin/env python3
"""
Image Compression Tool for Web Optimization
Compresses JPG images by reducing resolution 50% and optimizing quality for web use.

Usage:
    python compress_images.py <input>          # Single file or folder
    python compress_images.py <input> -o <output_dir>
    python compress_images.py <input> -q 80    # Custom quality (1-95, default: 82)
    python compress_images.py <input> --no-webp  # Keep as JPEG only
"""

import argparse
import sys
from pathlib import Path
from PIL import Image


# ── Config ────────────────────────────────────────────────────────────────────
DEFAULT_QUALITY = 82          # JPEG / WebP quality (1-95)
SCALE_FACTOR    = 0.5         # 50 % of original width × height
SUPPORTED_EXTS  = {".jpg", ".jpeg"}


# ── Core function ──────────────────────────────────────────────────────────────
def compress_image(
    src: Path,
    out_dir: Path,
    quality: int = DEFAULT_QUALITY,
    webp: bool = True,
) -> dict:
    """
    Compress a single JPEG image.

    Returns a dict with size_before, size_after, saving_pct, output_path.
    """
    size_before = src.stat().st_size

    with Image.open(src) as img:
        # Convert to RGB so we can save as JPEG / WebP (handles RGBA / palette modes)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # ── Resize to 50 % ────────────────────────────────────────────────────
        new_w = max(1, int(img.width  * SCALE_FACTOR))
        new_h = max(1, int(img.height * SCALE_FACTOR))
        img_resized = img.resize((new_w, new_h), Image.LANCZOS)

        # ── Save ──────────────────────────────────────────────────────────────
        out_dir.mkdir(parents=True, exist_ok=True)

        if webp:
            out_path = out_dir / (src.stem + ".webp")
            img_resized.save(
                out_path,
                format="WEBP",
                quality=quality,
                method=6,       # slowest / best compression
                optimize=True,
            )
        else:
            out_path = out_dir / (src.stem + "_web.jpg")
            img_resized.save(
                out_path,
                format="JPEG",
                quality=quality,
                optimize=True,
                progressive=True,   # progressive JPEG loads faster on slow connections
            )

    size_after   = out_path.stat().st_size
    saving_pct   = (1 - size_after / size_before) * 100 if size_before else 0

    return {
        "input":       src,
        "output":      out_path,
        "orig_res":    None,          # filled below
        "new_res":     (new_w, new_h),
        "size_before": size_before,
        "size_after":  size_after,
        "saving_pct":  saving_pct,
    }


def fmt_size(n: int) -> str:
    if n >= 1_048_576:
        return f"{n / 1_048_576:.1f} MB"
    return f"{n / 1024:.1f} KB"


# ── CLI ───────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="Compress JPG images for web: 50 % resolution + quality optimisation"
    )
    parser.add_argument("input",  help="Path to a JPG file or a folder of JPG files")
    parser.add_argument("-o", "--output", default=None,
                        help="Output directory (default: <input_dir>/web_optimized/)")
    parser.add_argument("-q", "--quality", type=int, default=DEFAULT_QUALITY,
                        help=f"Compression quality 1-95 (default {DEFAULT_QUALITY})")
    parser.add_argument("--no-webp", dest="webp", action="store_false",
                        help="Output as progressive JPEG instead of WebP")
    args = parser.parse_args()

    src_path = Path(args.input).resolve()

    # ── Collect files ─────────────────────────────────────────────────────────
    if src_path.is_file():
        if src_path.suffix.lower() not in SUPPORTED_EXTS:
            print(f"[ERROR] Not a supported JPEG file: {src_path}")
            sys.exit(1)
        files    = [src_path]
        base_dir = src_path.parent
    elif src_path.is_dir():
        files    = sorted(
            f for f in src_path.rglob("*") if f.suffix.lower() in SUPPORTED_EXTS
        )
        base_dir = src_path
        if not files:
            print(f"[ERROR] No JPG files found in {src_path}")
            sys.exit(1)
    else:
        print(f"[ERROR] Path not found: {src_path}")
        sys.exit(1)

    out_dir = Path(args.output).resolve() if args.output else base_dir / "web_optimized"
    quality = max(1, min(95, args.quality))
    fmt     = "WebP" if args.webp else "Progressive JPEG"

    print(f"\n{'─'*62}")
    print(f"  Web Image Compressor")
    print(f"{'─'*62}")
    print(f"  Files found : {len(files)}")
    print(f"  Output dir  : {out_dir}")
    print(f"  Format      : {fmt}")
    print(f"  Quality     : {quality}")
    print(f"  Resolution  : 50 % of original")
    print(f"{'─'*62}\n")

    total_before = total_after = 0
    errors = []

    for i, src in enumerate(files, 1):
        try:
            # Read original resolution before compression
            with Image.open(src) as probe:
                orig_res = probe.size

            result = compress_image(src, out_dir, quality=quality, webp=args.webp)
            result["orig_res"] = orig_res
            total_before += result["size_before"]
            total_after  += result["size_after"]

            status = "✓"
            print(
                f"  [{i:>3}/{len(files)}] {status}  {src.name}\n"
                f"           Resolution : {orig_res[0]}×{orig_res[1]}"
                f" → {result['new_res'][0]}×{result['new_res'][1]}\n"
                f"           Size       : {fmt_size(result['size_before'])}"
                f" → {fmt_size(result['size_after'])}"
                f"  (saved {result['saving_pct']:.1f} %)\n"
                f"           Output     : {result['output'].name}\n"
            )
        except Exception as exc:
            errors.append((src, exc))
            print(f"  [{i:>3}/{len(files)}] ✗  {src.name}  ERROR: {exc}\n")

    # ── Summary ───────────────────────────────────────────────────────────────
    processed = len(files) - len(errors)
    overall   = (1 - total_after / total_before) * 100 if total_before else 0

    print(f"{'─'*62}")
    print(f"  Done  {processed}/{len(files)} file(s) processed successfully")
    if total_before:
        print(f"  Total : {fmt_size(total_before)} → {fmt_size(total_after)}"
              f"  (overall saving {overall:.1f} %)")
    if errors:
        print(f"\n  Errors ({len(errors)}):")
        for f, e in errors:
            print(f"    {f.name}: {e}")
    print(f"{'─'*62}\n")


if __name__ == "__main__":
    main()