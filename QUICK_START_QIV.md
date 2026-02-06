# QIV Branding & Icon Setup — QUICK START

## ✅ Code Updates Complete

All source files have been updated:
- ✅ `manifest.json` — QIV branding, correct icon paths
- ✅ `index.html` — favicon links, apple-mobile-web-app-title
- ✅ `sw.js` — updated cache name, notification titles
- ✅ `terms.html`, `privacy.html`, `admin.html` — all rebranded to QIV

## 🖼️ Next: Generate PNG Icons (Choose One)

### Fastest: Online Tool (1 min)
1. Visit: https://www.favicon-generator.org/
2. Upload: `logo.svg`
3. Download and extract PNG files to `icons/` folder

### DIY: Python Script (5 min)
```bash
pip install pillow cairosvg
python convert_icons.py
```

### Manual: ImageMagick (if installed)
```bash
convert -background none logo.svg -resize 16x16 icons/qiv-icon-16.png
convert -background none logo.svg -resize 32x32 icons/qiv-icon-32.png
# ... repeat for 180, 192, 512
```

## 📁 Expected Result
```
icons/
├── qiv-icon-16.png
├── qiv-icon-32.png
├── qiv-icon-180.png
├── qiv-icon-192.png
├── qiv-icon-512.png
└── qiv-icon.svg (already exists)
```

## 🚀 Deploy
```bash
git add icons/qiv-icon-*.png manifest.json index.html sw.js *.html
git commit -m "feat: rebrand to QIV with new icon configuration"
git push origin main
```

That's it! Your site will now:
- Show "QIV" in browser tabs ✅
- Show "QIV" on iOS home screen ✅
- Show "QIV" on Android home screen ✅
- Work as a PWA with proper icons ✅

See `QIV_IMPLEMENTATION_GUIDE.md` for detailed info.
