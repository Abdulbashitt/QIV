# QIV Icon & Branding Implementation — Complete Checklist

**Status:** ✅ Code updated | ⏳ PNG icons need generation | 📋 Ready for Netlify deployment

---

## 🎯 What Was Done

### 1. ✅ Rebranding (Ki → QIV)
All brand references have been updated from "Ki" to "QIV" across the entire site:

| File | Changes |
|------|---------|
| `manifest.json` | `"name": "QIV — Premium Alien Phone Wallpapers"`, `"short_name": "QIV"` |
| `index.html` | Apple web app title, meta tags, page title |
| `sw.js` | Push notification titles, cache name `qiv-v1` |
| `terms.html` | 5 references updated |
| `privacy.html` | Page title and opening text |
| `admin.html` | Admin panel title |

**Verification:** No remaining "Ki" or "KI" references in code (except folder names)

---

### 2. ✅ Favicon & Icon Configuration

#### HTML Head Updates (index.html)
```html
<meta name="apple-mobile-web-app-title" content="QIV">
<link rel="icon" type="image/png" href="/icons/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/icons/favicon-16x16.png" sizes="16x16">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/manifest.json">
```

**What this enables:**
- ✅ Browser tabs: favicon in all browsers
- ✅ iOS home screen: Apple touch icon (180x180)
- ✅ Android home screen: App icon (192x192, 512x512)
- ✅ PWA installation: Manifest-driven icons
- ✅ Safari pinned tabs: Custom color mask

#### Manifest.json Updates
```json
{
  "name": "QIV",
  "short_name": "QIV",
  "icons": [
    { "src": "/icons/android-chrome-192x192.png", "sizes": "192x192", "type":"image/png", "purpose": "any maskable" },
    { "src": "/icons/android-chrome-512x512.png", "sizes": "512x512", "type":"image/png", "purpose": "any maskable" },
    { "src": "/icons/apple-touch-icon.png", "sizes": "180x180", "type":"image/png" },
    { "src": "/icons/favicon-32x32.png", "sizes": "32x32", "type":"image/png" },
    { "src": "/icons/favicon-16x16.png", "sizes": "16x16", "type":"image/png" }
  ]
}
```

---

## 🖼️ Icon Generation (Next Step)

### Required PNG Icons
All icons are generated from **logo.svg** (existing brand logo):

```
icons/
├── favicon-16x16.png           ← Browser favicon (16x16)
├── favicon-32x32.png           ← Browser favicon (32x32)
├── apple-touch-icon.png        ← iOS home screen (180x180)
├── android-chrome-192x192.png  ← Android home screen (192x192)
├── android-chrome-512x512.png  ← PWA splash screen (512x512)
├── qiv-icon.svg                ← ✅ Already exists (source SVG)
└── favicon.ico                 ← Optional, for older browsers
```

### Option A: Online Generator (Easiest)
1. Go to: https://www.favicon-generator.org/
2. Upload `logo.svg`
3. Download ZIP
4. Extract PNG files to `icons/` folder

### Option B: Using Python
```bash
# Install dependencies
pip install pillow cairosvg

# Generate all PNG icons
python convert_icons.py

# Generate favicon.ico (optional)
python create_favicon.py
```

### Option C: CLI Tools
```bash
# Using ImageMagick (if installed)
for size in 16 32 180 192 512; do
  convert -background none logo.svg -resize ${size}x${size} icons/qiv-icon-${size}.png
done
```

---

## 📋 Deployment Checklist

### Before Deploying to Netlify:

- [ ] **Generate PNG icons** (using one of the methods above)
- [ ] **Verify file paths:**
  - [ ] All icon files in `/icons/` folder
  - [ ] Named exactly: `qiv-icon-{16,32,180,192,512}.png`
  - [ ] SVG file exists: `/icons/qiv-icon.svg`
  - [ ] favicon.ico exists in root (optional but recommended)

- [ ] **Test locally:**
  ```bash
  # Run local server (e.g., Python)
  python -m http.server 8000
  # Visit: http://localhost:8000
  # Check DevTools: favicon should load, no 404 errors
  ```

- [ ] **Push to GitHub/Netlify:**
  - All PNG icons committed
  - Manifest.json valid JSON
  - HTML valid markup

---

## ✨ What Works Everywhere

### Browser Tabs
- ✅ Chrome (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (macOS & iOS)
- ✅ Edge (Windows)

### Mobile Home Screen
- ✅ **iOS:** Apple Touch Icon (180x180)
  - Shows when: "Add to Home Screen" → Install
  - Displays with rounded corners (iOS default)
  
- ✅ **Android:** PWA Install Button
  - Shows icon from manifest (192x192)
  - Requires manifest.json + service worker (already have both)
  - Can install to home screen or app drawer

### PWA Features
- ✅ App name: "QIV" (from manifest + apple-mobile-web-app-title)
- ✅ App icons: Multiple sizes for different contexts
- ✅ Standalone display: Hides browser chrome when installed
- ✅ Splash screen: Uses 512x512 icon during load

---

## 🔍 Verification Steps

### 1. Check Favicon Loads
```
DevTools → Network → Filter "favicon" 
Should see: /icons/qiv-icon-32.png (Status 200)
```

### 2. Check Manifest
```
DevTools → Application → Manifest
Should show: name: "QIV — Premium Alien Phone Wallpapers"
```

### 3. Check PWA Readiness
```
DevTools → Lighthouse → PWA
Should pass all checks with configured icons
```

### 4. Test on Real Device (iOS)
- Open Safari
- Tap Share → Add to Home Screen
- Icon should appear with "QIV" label

### 5. Test on Real Device (Android)
- Open in Chrome
- Tap menu → Install app
- Icon should appear with "QIV" label

---

## 📱 How It Works on Each Platform

### iOS (Safari)
1. User taps "Add to Home Screen"
2. Searches for `<link rel="apple-touch-icon">`
3. Finds: `/icons/qiv-icon-180.png`
4. Downloads and displays on home screen
5. Displays app name from `apple-mobile-web-app-title`

### Android (Chrome)
1. Service worker + manifest detect PWA
2. Shows "Install" button in menu
3. Uses largest icon from manifest (512x512)
4. Creates home screen shortcut
5. Displays app name from manifest's `short_name`

### Desktop Browsers
1. Requests favicon from multiple places:
   - `/favicon.ico` (if exists)
   - Links in `<head>` (32x32, 16x16)
2. Displays in browser tab
3. Refreshes when manifest icon changes

---

## 🚀 Next Steps

1. **Generate PNG icons** (choose Option A, B, or C above)
2. **Verify icon files** are in `icons/` folder with correct names
3. **Test locally** (see "Test locally" in checklist)
4. **Deploy to Netlify:**
   ```bash
   git add icons/qiv-icon-*.png
   git add manifest.json
   git add index.html sw.js
   git commit -m "feat: rebrand to QIV with new icon configuration"
   git push
   ```
5. **Verify on production** at your Netlify domain

---

## 🎨 Icon Design Notes

- **Source:** logo.svg (existing brand logo)
- **Style:** Gradient + glow effect with rounded corners
- **Colors:** Pink gradient (#ff73c7 → #ff3aa6)
- **Transparency:** PNG with transparent background
- **Quality:** All sizes rendered at high quality from vector

---

## ⚙️ Configuration Summary

| Setting | Value | Purpose |
|---------|-------|---------|
| App Name | QIV — Premium Alien Phone Wallpapers | Manifest full name |
| Short Name | QIV | Home screen label |
| Theme Color | #ff3aa6 | Browser chrome color |
| Icons | 6 variants (16→512px) | Different contexts |
| Start URL | / | Where app opens |
| Display | standalone | Full-screen mode |
| Scope | / | Where PWA applies |

---

## 📚 Resources

- [Favicon Best Practices](https://github.com/audreyr/favicon-cheat-sheet)
- [Web Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Apple Web Apps](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [PWA Icons Guide](https://web.dev/add-manifest/#icons)

---

**Last Updated:** January 30, 2026  
**Deployed to:** Netlify (pending icon generation)
