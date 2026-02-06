# Quick Start: Adding New Wallpapers

## 30-Second Setup

### What You Need:
1. Two image URLs (thumbnail & full-quality)
2. A unique ID (lowercase, no spaces)
3. Title and description

### Example:

```json
{
  "id": "alien-sunset-skateboard",
  "title": "Sunset Alien Skateboard",
  "description": "An alien enjoying a beautiful sunset while skateboarding on the beach.",
  "thumbnail": "https://res.cloudinary.com/your-account/image/upload/alien-sunset-thumb.webp",
  "fullQuality": "https://res.cloudinary.com/your-account/image/upload/alien-sunset-full.webp",
  "fileName": "alien-sunset-skateboard.webp",
  "gallery": 2
}
```

## Steps:

1. **Open** `wallpapers.json`
2. **Add** your new wallpaper object to the `wallpapers` array
3. **Save** the file
4. **Done!** The wallpaper is now live

## Gallery Assignment:
- `"gallery": 1` → Page 1 (First section)
- `"gallery": 2` → Page 2 (Second section)  
- `"gallery": 3` → Page 3 (Third section)

## URL Format After Adding:

Your new wallpaper will be accessible at:
```
https://yourdomain.com/wallpaper.html?id=alien-sunset-skateboard
```

## What NOT to Change:

❌ Don't remove or rename existing wallpapers
❌ Don't change the `id` field for existing wallpapers
❌ Don't edit index.html (click logic is automatic)

## What You CAN Change:

✅ Add new wallpapers to wallpapers.json
✅ Update titles and descriptions
✅ Change thumbnail/fullQuality URLs
✅ Update gallery assignment

---

## Current Wallpaper Count: 38

All are fully configured and ready to use!
