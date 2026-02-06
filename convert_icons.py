#!/usr/bin/env python3
"""
Convert logo.svg to PNG icons in all required sizes.

Dependencies:
    pip install pillow cairosvg

Usage:
    python convert_icons.py
"""

import os
from pathlib import Path

try:
    from cairosvg import svg2png
    from PIL import Image
    import io
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print("\nInstall required packages:")
    print("  pip install pillow cairosvg")
    exit(1)


def convert_svg_to_png(svg_path: str, output_path: str, width: int, height: int) -> bool:
    """Convert SVG to PNG at specified dimensions."""
    try:
        # Convert SVG to PNG using cairosvg
        png_data = io.BytesIO()
        svg2png(
            url=svg_path,
            write_to=png_data,
            output_width=width,
            output_height=height,
        )
        
        # Write to file
        with open(output_path, 'wb') as f:
            f.write(png_data.getvalue())
        
        file_size_kb = os.path.getsize(output_path) / 1024
        print(f"✅ {output_path} ({width}x{height}) - {file_size_kb:.1f}KB")
        return True
    
    except Exception as e:
        print(f"❌ Failed to convert {output_path}: {e}")
        return False


def main():
    """Generate all required icon sizes."""
    
    logo_path = Path(__file__).parent / "logo.svg"
    icons_dir = Path(__file__).parent / "icons"
    
    # Create icons directory if it doesn't exist
    icons_dir.mkdir(exist_ok=True)
    
    # Icon sizes required (size_name: (width, height))
        # Output files required by platforms (names requested)
        sizes = {
            "favicon-16x16.png": (16, 16),
            "favicon-32x32.png": (32, 32),
            "apple-touch-icon.png": (180, 180),
            "android-chrome-192x192.png": (192, 192),
            "android-chrome-512x512.png": (512, 512),
        }
    
    print("🎨 Converting logo.svg to PNG icons...\n")
    
    success_count = 0
    for icon_name, (width, height) in sizes.items():
        output_path = icons_dir / icon_name
        if convert_svg_to_png(str(logo_path), str(output_path), width, height):
            success_count += 1
    
    print(f"\n✨ Conversion complete: {success_count}/{len(sizes)} icons generated")
    
    if success_count == len(sizes):
        print("\n🚀 All icons ready! You can now:")
        print("   1. Deploy these icons to Netlify")
        print("   2. Update favicon links in index.html (already configured)")
        print("   3. Verify on https://realfavicongenerator.net/")
    
        # Optionally create favicon.ico from generated PNGs if Pillow is available
        try:
            ico_path = icons_dir / "favicon.ico"
            png16 = icons_dir / "favicon-16x16.png"
            png32 = icons_dir / "favicon-32x32.png"
            if png16.exists() and png32.exists():
                imgs = [Image.open(png16), Image.open(png32)]
                imgs[0].save(ico_path, format='ICO', sizes=[(16,16),(32,32)])
                print(f"✅ {ico_path} created from PNG sources")
        except Exception:
            pass


if __name__ == "__main__":
    main()
