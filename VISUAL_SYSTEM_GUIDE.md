# Wallpaper System - Visual Guide

## 🎯 User Journey

```
┌─────────────────────────────────────────┐
│  User opens your website                │
│  (index.html - Gallery Page)            │
└────────────────┬────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  See gallery of 38       │
    │  wallpaper thumbnails    │
    │  (Small previews)        │
    └────────────┬─────────────┘
                 │
                 │ User clicks a wallpaper
                 │
                 ▼
    ┌──────────────────────────────────────┐
    │ Browser navigates to:                │
    │ /wallpaper.html?id=alien-blue-bike  │
    └────────────┬─────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────┐
    │  Wallpaper Detail Page loads         │
    │  (wallpaper.html)                    │
    │                                      │
    │  Shows:                              │
    │  - Full-quality image                │
    │  - Title                             │
    │  - Description                       │
    │  - Download button                   │
    │  - Share button                      │
    │  - Metadata                          │
    └────────────┬─────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   User clicks        User clicks
   Download button    Share button
        │                 │
        ▼                 ▼
  Wallpaper        Shares link to
  downloads        detail page
  to device        on social media
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  YOUR WEBSITE                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐      │
│  │ index.html │  │wallpaper   │  │wallpapers.json  │      │
│  │ (Gallery)  │  │.html       │  │ (Data)          │      │
│  │            │  │(Detail)    │  │                 │      │
│  │ 38 cards   │  │            │  │ {               │      │
│  │ with       │  │ Full qual. │  │   wallpapers: [│      │
│  │ thumbnails │  │ image      │  │   {...},        │      │
│  │            │  │            │  │   {...}         │      │
│  │ Click →    │  │ Download   │  │   ]             │      │
│  │ Navigate   │  │ Share      │  │ }               │      │
│  │ to detail  │  │            │  │                 │      │
│  └────────────┘  └────────────┘  └─────────────────┘      │
│                         ▲                                   │
│                         │ Loads                             │
│                         └─ wallpapers.json                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow - Step by Step

### Step 1: Gallery Loads
```
index.html opens
    ↓
Fetches wallpapers.json
    ↓
Creates map:
  URL → ID
    ↓
Sets up click handlers
    ↓
Displays 38 wallpaper cards
```

### Step 2: User Clicks Wallpaper
```
Click on thumbnail
    ↓
JavaScript detects click
    ↓
Looks up wallpaper ID
    ↓
Navigates to:
/wallpaper.html?id=<wallpaper-id>
```

### Step 3: Detail Page Loads
```
wallpaper.html loads
    ↓
Reads URL: ?id=alien-blue-bike
    ↓
Fetches wallpapers.json
    ↓
Finds entry with id='alien-blue-bike'
    ↓
Displays:
  - fullQuality URL as main image
  - title
  - description
  - download/share buttons
```

### Step 4: User Downloads
```
Click Download button
    ↓
Fetch full-quality URL
    ↓
Convert to blob
    ↓
Create download link
    ↓
Trigger browser download
    ↓
File saved with proper filename
```

---

## 📁 How Each File Works

### wallpapers.json - The Database
```
{
  "wallpapers": [
    {
      "id": "alien-blue-bike",           ← Unique identifier
      "title": "Blue Alien on Bike",     ← Display name
      "description": "A striking...",    ← Long description
      "thumbnail": "https://...",        ← Small preview URL
      "fullQuality": "https://...",      ← Full-quality URL
      "fileName": "alien-blue-bike.webp",← Download name
      "gallery": 3                       ← Section number
    },
    { ... more wallpapers ... }
  ]
}
```

### index.html - The Gallery
```
┌─ Gallery Page
│
├─ 38 Wallpaper Cards (thumbnails)
│  ├─ Card 1 with thumbnail
│  ├─ Card 2 with thumbnail
│  └─ ... Card 38 with thumbnail
│
├─ JavaScript at bottom:
│  ├─ Loads wallpapers.json
│  ├─ Maps URLs → IDs
│  └─ Adds click handlers
│
└─ When card clicked:
   └─ Navigates to wallpaper.html?id=<id>
```

### wallpaper.html - The Detail Page
```
┌─ Detail Page
│
├─ Header with back button
│
├─ Two-column layout:
│  ├─ Left: Full-quality image
│  │  └─ Loaded from fullQuality URL
│  │
│  └─ Right: Details
│     ├─ Title (from JSON)
│     ├─ Description (from JSON)
│     ├─ Download button
│     ├─ Share button
│     └─ Metadata
│
├─ JavaScript:
│  ├─ Reads URL parameter (?id=)
│  ├─ Fetches wallpapers.json
│  ├─ Finds matching wallpaper
│  ├─ Displays all content
│  └─ Handles download/share
│
└─ Responsive design
   ├─ Desktop: Side-by-side
   ├─ Tablet: Stacked
   └─ Mobile: Optimized
```

---

## 🔗 URL Examples

### Gallery URLs
```
https://qiv.com/                    ← Main gallery
https://qiv.com/index.html          ← Same (explicit)
```

### Detail Page URLs
```
https://qiv.com/wallpaper.html?id=alien-blue-bike
https://qiv.com/wallpaper.html?id=alien-girl-fly-skateboard
https://qiv.com/wallpaper.html?id=alien-funny-shoe
... and 35 more ...
```

---

## 🎨 Image URLs Explained

### Thumbnail Images
- Shown in gallery
- Small size (180px)
- Can be compressed
- URL: `thumbnail` field in JSON

### Full-Quality Images
- Shown on detail page
- Larger size (1080px wide)
- High quality for download
- URL: `fullQuality` field in JSON

### Both Can Be Same URL
If you want to use the same URL for both:
```json
{
  "id": "alien-example",
  "thumbnail": "https://cdn.com/image.webp",
  "fullQuality": "https://cdn.com/image.webp"
}
```

Or use different optimization levels from CDN:
```json
{
  "id": "alien-example",
  "thumbnail": "https://cdn.com/image.webp?w=180&q=80",
  "fullQuality": "https://cdn.com/image.webp?w=1080&q=95"
}
```

---

## 🎯 What Happens When...

### User Clicks Wallpaper Card
```
indexhtml detects click
  ↓
Gets thumbnail URL from image
  ↓
Looks up in mapping: URL → ID
  ↓
Navigates to wallpaper.html?id=<ID>
```

### Detail Page Loads with New ID
```
wallpaper.html reads URL
  ↓
Extracts ID from ?id=<ID>
  ↓
Fetches wallpapers.json
  ↓
Searches for wallpaper with that ID
  ↓
Found! Displays title, description, images
```

### User Clicks Download
```
JavaScript event listener triggers
  ↓
Gets fullQuality URL from wallpaper data
  ↓
Fetches the image
  ↓
Converts to blob
  ↓
Creates temporary download link
  ↓
Triggers browser download
  ↓
Names file using fileName field
```

---

## 💾 How to Add a New Wallpaper

```
1. Get 2 URLs:
   - Thumbnail URL
   - Full-quality URL

2. Create wallpaper ID:
   "alien-new-design"

3. Add to wallpapers.json:
   {
     "id": "alien-new-design",
     "title": "New Alien Design",
     "description": "...",
     "thumbnail": "https://...",
     "fullQuality": "https://...",
     "fileName": "alien-new-design.webp",
     "gallery": 2
   }

4. Save wallpapers.json

5. Done! 🎉
   New detail page automatically created:
   /wallpaper.html?id=alien-new-design
```

---

## 🔄 Auto-Updates

When you add a wallpaper to wallpapers.json:

✅ Gallery automatically includes it
✅ Detail page URL automatically works
✅ Click handler automatically attaches
✅ Share functionality automatic
✅ Download button works automatically
✅ SEO tags update automatically
✅ Open Graph tags update automatically

**No other files need to be changed!**

---

## 🌙 Dark Theme Support

Both index.html and wallpaper.html support:
- Light mode (default)
- Dark mode (toggle button in header)
- Saved preference (localStorage)

When theme button clicked:
```
User clicks theme toggle
  ↓
JavaScript toggles dark-theme class
  ↓
CSS variables switch colors
  ↓
Preference saved in localStorage
  ↓
Next visit remembers choice
```

---

## 📱 Responsive Behavior

### On Large Screens (Desktop)
```
┌──────────────────────────────────────┐
│ Header with theme toggle             │
├──────────────────────────────────────┤
│                                      │
│  Full Image │ Title, Description    │
│  (left)     │ Download button       │
│             │ Share button          │
│  9:16       │ Metadata              │
│  ratio      │ (right)               │
│             │                       │
└──────────────────────────────────────┘
```

### On Medium Screens (Tablet)
```
┌──────────────────┐
│ Header           │
├──────────────────┤
│                  │
│  Full Image      │
│  (stacked top)   │
│                  │
│  Details         │
│  (stacked below) │
│                  │
└──────────────────┘
```

### On Small Screens (Mobile)
```
┌─────────────┐
│ Header      │
├─────────────┤
│ Image       │
│ (full width)│
│             │
│ Title       │
│             │
│ Description │
│             │
│ Buttons     │
│             │
│ Metadata    │
│             │
└─────────────┘
```

---

## ✨ Key Features Map

```
Gallery (index.html)
├─ Theme toggle ✓
├─ 38 wallpaper cards ✓
├─ Click to detail page ✓
└─ Auto-mapped to IDs ✓

Detail Page (wallpaper.html)
├─ Full-quality image ✓
├─ Dynamic title ✓
├─ Dynamic description ✓
├─ Download button ✓
├─ Share button ✓
├─ Metadata section ✓
├─ Theme toggle ✓
├─ Responsive design ✓
├─ Back button ✓
└─ SEO optimized ✓

Data (wallpapers.json)
├─ 38 wallpapers ✓
├─ All with IDs ✓
├─ All with titles ✓
├─ All with descriptions ✓
├─ All with thumbnails ✓
├─ All with full-quality ✓
└─ All with filenames ✓
```

---

## 🎓 Summary

Your wallpaper system now works like this:

1. **Users visit gallery** - See 38 beautiful thumbnail previews
2. **Users click any wallpaper** - Automatically navigates to detail page
3. **Detail page shows** - Full-quality image + title + description + download
4. **Users download** - Gets the full-quality image with proper filename
5. **Users share** - Shares the detail page link on social media

All powered by:
- Simple JSON database (wallpapers.json)
- One gallery template (index.html)
- One detail template (wallpaper.html)
- Minimal JavaScript (automatic URL routing)

**No backend server needed!** ⚡
