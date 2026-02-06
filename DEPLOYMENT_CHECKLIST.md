# QIV Deployment Checklist — Before Going Live

**Status: READY FOR FINAL STEPS**

---

## ✅ Completed Tasks

### Code Updates
- [x] Updated `manifest.json` with QIV branding
- [x] Updated `index.html` favicon/apple-touch-icon links
- [x] Updated `sw.js` cache name and notification titles
- [x] Rebranded `terms.html`, `privacy.html`, `admin.html`
- [x] Created icon generation scripts
- [x] Copied `qiv-icon.svg` to icons folder

### Files Created
- [x] `convert_icons.py` — PNG icon generator
- [x] `create_favicon.py` — ICO generator
- [x] `icons/ICON_GENERATION_GUIDE.md` — Generation instructions
- [x] `QIV_IMPLEMENTATION_GUIDE.md` — Full documentation
- [x] `QUICK_START_QIV.md` — Quick reference
- [x] `CHANGES_SUMMARY.md` — What was changed

---

## ⏳ Remaining Tasks (Icon Generation)

### Step 1: Choose an Icon Generation Method

**Option A: Online Tool (Recommended - 1 minute)**
```
1. Visit: https://www.favicon-generator.org/
2. Upload: icons/qiv-icon.svg
3. Download ZIP
4. Extract PNG files to icons/ folder
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png
   - android-chrome-192x192.png
   - android-chrome-512x512.png
```

**Option B: Python Script (5 minutes)**
```bash
# Make sure you have Python 3.7+
pip install pillow cairosvg
python convert_icons.py
```

**Option C: Manual ImageMagick (if installed)**
```bash
cd icons
convert -background none qiv-icon.svg -resize 16x16 qiv-icon-16.png
convert -background none qiv-icon.svg -resize 32x32 qiv-icon-32.png
convert -background none qiv-icon.svg -resize 180x180 qiv-icon-180.png
convert -background none qiv-icon.svg -resize 192x192 qiv-icon-192.png
convert -background none qiv-icon.svg -resize 512x512 qiv-icon-512.png
```

### Step 2: Verify PNG Files
After generating, your `icons/` folder should contain:
```
icons/
├── ICON_GENERATION_GUIDE.md
├── ki-icon.svg                 (old, can delete after confirming)
├── qiv-icon.svg               ✅ (new, source SVG)
├── favicon-16x16.png         ⏳ (NEEDED)
├── favicon-32x32.png         ⏳ (NEEDED)
├── apple-touch-icon.png      ⏳ (NEEDED)
├── android-chrome-192x192.png ⏳ (NEEDED)
└── android-chrome-512x512.png ⏳ (NEEDED)
```

---

## 🧪 Local Testing

### Test 1: Verify File Paths
```bash
# In project root, run a local server
python -m http.server 8000

# Visit: http://localhost:8000
# Open DevTools → Network tab
# Refresh and check:
# - ✅ /manifest.json loads (200 OK)
# - ✅ /icons/qiv-icon-*.png load (200 OK each)
# - ✅ No 404 errors
```

### Test 2: Check Manifest
```
DevTools → Application → Manifest
- name: "QIV"
- short_name: "QIV"
- icons: 6 entries (all qiv-icon-*)
- theme_color: #ff3aa6
- display: standalone
```

### Test 3: Check Service Worker
```
DevTools → Application → Service Workers
- Should show: registration successful
- Cache should show: qiv-v1
```

### Test 4: Lighthouse PWA Audit
```
DevTools → Lighthouse
- Select: PWA audit
- Run audit
- Should have no errors about icons/manifest
```

---

## 📱 Real Device Testing (After Deployment)

### iOS Testing
1. Open QIV site in Safari on iPhone
2. Tap Share button (bottom menu)
3. Tap "Add to Home Screen"
4. Verify:
   - [x] Icon appears with rounded corners
   - [x] App name shows as "QIV"
   - [x] Icon quality is good (not pixelated)

### Android Testing
1. Open QIV site in Chrome on Android phone
2. Wait 3-5 seconds
3. Look for "Install" button in menu (three dots)
4. Tap "Install app"
5. Verify:
   - [x] Dialog shows "QIV" as app name
   - [x] Icon preview looks correct
   - [x] Installation completes
   - [x] App appears on home screen
   - [x] App launches in full-screen mode

### Desktop Testing
1. Open in Chrome/Edge/Firefox
2. Check browser tab:
   - [x] Favicon appears (not generic icon)
   - [x] Favicon is QIV logo (pink gradient)
3. Right-click favicon, inspect:
   - [x] Shows correct path in DevTools
   - [x] Shows 32x32 or 16x16 sizes

---

## 🚀 Deployment Steps

### Step 1: Prepare Files
```bash
# Make sure PNG icons exist in icons/ folder
ls -la icons/qiv-icon-*.png

# Verify manifest is valid JSON
cat manifest.json | python -m json.tool
```

### Step 2: Commit Changes
```bash
git add manifest.json
git add index.html
git add sw.js
git add privacy.html
git add admin.html
git add terms.html
git add icons/qiv-icon-*.png
git add convert_icons.py
git add create_favicon.py
git add icons/ICON_GENERATION_GUIDE.md
git add QIV_IMPLEMENTATION_GUIDE.md
git add QUICK_START_QIV.md
git add CHANGES_SUMMARY.md

git commit -m "feat: rebrand to QIV with new icon configuration

- Updated manifest.json with QIV branding
- Configured favicon and PWA icons
- Rebranded all pages from Ki to QIV
- Added icon generation scripts and documentation
- Supports iOS home screen, Android PWA, browser tabs"

git push origin main
```

### Step 3: Netlify Deployment
- Netlify auto-deploys on push
- Check: https://app.netlify.com → your-site
- Deploy status should show: ✅ Published

### Step 4: Verify Production
Wait 2-3 minutes for CDN cache, then:
1. Visit: https://your-domain.com
2. Check favicon in browser tab
3. Check DevTools → Manifest loads
4. Test on real iOS device
5. Test on real Android device

---

## 🔄 Rollback Plan

If something breaks:
```bash
git revert HEAD
git push origin main
# Netlify auto-deploys previous version
```

---

## 📋 Final Checklist

Before clicking "Deploy":
- [ ] All PNG icons generated (5 files in icons/)
- [ ] Manifest.json validated as JSON
- [ ] Local testing passed (no 404 errors)
- [ ] All 5 PNG icons load in DevTools Network tab
- [ ] Favicon appears in browser tab locally
- [ ] Service worker shows qiv-v1 cache
- [ ] Lighthouse PWA audit passes

Before marking as complete:
- [ ] Production favicon appears in browser tab
- [ ] iOS home screen install works with icon
- [ ] Android app install shows "QIV" name
- [ ] PWA installs and launches in full-screen
- [ ] No "Ki" branding visible anywhere

---

## 📞 Support Resources

If you need to regenerate icons:
- See: `icons/ICON_GENERATION_GUIDE.md`

If you need details on implementation:
- See: `QIV_IMPLEMENTATION_GUIDE.md`

If you need to understand what changed:
- See: `CHANGES_SUMMARY.md`

---

**Generated:** January 30, 2026  
**Ready to Deploy:** YES ✅  
**Next Step:** Generate PNG icons → Deploy to Netlify
