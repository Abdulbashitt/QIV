#!/usr/bin/env python3
"""
Generate favicon.ico from logo.svg

This creates a proper favicon.ico file suitable for browser tabs.
Note: favicon.ico is traditionally a multi-resolution ICO file.
Modern browsers also support PNG favicons, but ICO is still recommended.

Run: python create_favicon.py
"""

try:
    from PIL import Image, ImageDraw
    try:
        from cairosvg import svg2png
    except Exception:
        svg2png = None
    import io
except ImportError:
    print("Missing dependencies: pip install pillow [cairosvg optional]")
    exit(1)


def create_favicon():
    """Create favicon.ico from logo.svg or fallback PNGs.

    Prefer converting from `logo.svg` when `cairosvg` is available. Otherwise
    will attempt to read `icons/favicon-16x16.png` and `icons/favicon-32x32.png`.
    """
    svg_path = "logo.svg"
    ico_path = "favicon.ico"

    # Try SVG -> PNG -> ICO if cairosvg available
    if svg2png:
        try:
            png_data = io.BytesIO()
            svg2png(url=svg_path, write_to=png_data, output_width=32, output_height=32)
            png_data.seek(0)
            img = Image.open(png_data)
            img.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32)])
            print(f"✅ {ico_path} created from {svg_path}")
            return
        except Exception as e:
            print("SVG->ICO conversion failed:", e)

    # Fallback: use pre-generated PNGs in icons/ folder
    try:
        png16 = Image.open("icons/favicon-16x16.png")
        png32 = Image.open("icons/favicon-32x32.png")
        png16.save(ico_path, format="ICO", sizes=[(16,16),(32,32)])
        print(f"✅ {ico_path} created from icons/ PNG files")
        return
    except Exception as e:
        print("Fallback PNG->ICO creation failed:", e)

    print("❌ Could not create favicon.ico. Please generate 16x16 and 32x32 PNGs in icons/")


if __name__ == "__main__":
    create_favicon()
