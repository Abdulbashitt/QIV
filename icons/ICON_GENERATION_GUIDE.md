# Icon Generation Guide for QIV

## Using Online Tools (Recommended - Free & Easy)

### Option 1: Using favicon-generator.org
1. Visit: https://www.favicon-generator.org/
2. Upload `logo.svg`
3. Download the ZIP with all required sizes
4. Extract to `icons/` folder

### Option 2: Using ezgif.com
1. Visit: https://ezgif.com/svg-to-png
2. Upload `logo.svg`
3. Convert with dimensions:
   - 16x16 → `favicon-16x16.png`
   - 32x32 → `favicon-32x32.png`
   - 180x180 → `apple-touch-icon.png`
   - 192x192 → `android-chrome-192x192.png`
   - 512x512 → `android-chrome-512x512.png`

### Option 3: Using Python (Local)
```bash
# Install dependencies
pip install pillow cairosvg

# Run conversion script
python convert_icons.py
```

## Required Files
```
icons/
├── favicon-16x16.png       (16x16)
├── favicon-32x32.png       (32x32)
├── apple-touch-icon.png    (180x180) - Apple touch icon
├── android-chrome-192x192.png (192x192) - Android home screen
├── android-chrome-512x512.png (512x512) - PWA splash screen
├── qiv-icon.svg            (Already exists - source SVG)
└── favicon.ico             (Optional, auto-generated)
```

## Quality Notes
- All PNG icons should have rounded corners matching logo.svg (rx="20")
- Ensure no background (transparent PNG preferred)
- Test on real devices before deploying
- iOS requires at least 180x180
- Android minimum is 192x192
- PWA splash screens need 512x512

## Verification
After generating icons:
1. Check file sizes are reasonable (50-200KB each)
2. Verify transparency is preserved
3. Test on iOS and Android
4. Validate manifest.json references

---
Generated: 2026-01-30
