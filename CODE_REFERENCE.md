# Code Reference - Download & Share Implementation

## Quick Reference: Key Functions

### Function 1: `getDownloadUrl()`
**Purpose:** Converts preview URL to download URL by adding `fl_attachment` flag

```javascript
function getDownloadUrl(originalUrl){
  if(!originalUrl) return null;
  // Insert fl_attachment flag right after /upload/
  return originalUrl.replace('/image/upload/', '/image/upload/fl_attachment/');
}
```

**Example:**
```
Input:  https://res.cloudinary.com/dmdlkppcg/image/upload/ar_9:16,c_auto/image.webp
Output: https://res.cloudinary.com/dmdlkppcg/image/upload/fl_attachment/ar_9:16,c_auto/image.webp
```

---

### Function 2: `handleDownload(imageUrl, filename)`
**Purpose:** Triggers real file download using Cloudinary attachment URL

```javascript
async function handleDownload(imageUrl, filename){
  if(!imageUrl){
    showToast('❌ No image URL found');
    return;
  }

  try{
    showToast('⏳ Downloading...');
    
    // Convert to download URL with fl_attachment flag
    const downloadUrl = getDownloadUrl(imageUrl);
    
    // Fetch the image as a blob with CORS support
    const response = await fetch(downloadUrl, { mode: 'cors' });
    
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Create a temporary download link and trigger download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'ki-wallpaper.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    
    showToast('✅ Download started!');
    
    // Close overlay if on mobile
    const card = document.querySelector('[data-downloading="true"]');
    if(card) card.classList.remove('active');
  }catch(error){
    console.error('Download failed:', error);
    // Fallback: open in new window
    const downloadUrl = getDownloadUrl(imageUrl);
    window.open(downloadUrl, '_blank');
    showToast('⚠️ Opening in new window...');
  }
}
```

**Parameters:**
- `imageUrl` (string): The Cloudinary image URL from button's `data-url` attribute
- `filename` (string): The filename to save as (e.g., "image.webp")

**Returns:** Promise (async function)

**What it does:**
1. Validates imageUrl exists
2. Shows "Downloading..." toast
3. Converts URL to download mode (adds `fl_attachment`)
4. Fetches image from Cloudinary as blob
5. Creates temporary object URL from blob
6. Creates `<a>` element with download attribute
7. Programmatically clicks link to trigger download
8. Cleans up resources
9. Shows success toast
10. Closes overlay on mobile

**Error Handling:**
- If fetch fails: Opens image in new window (fallback)
- Shows error toast to user
- Logs error to console for debugging

---

### Function 3: `handleShare(imageUrl)`
**Purpose:** Opens native share dialog or copies URL to clipboard

```javascript
async function handleShare(imageUrl){
  if(!imageUrl){
    showToast('❌ No URL to share');
    return;
  }

  try{
    // Try Web Share API first (mobile, modern browsers)
    if(navigator.share){
      await navigator.share({
        title: 'KI — Premium Alien Wallpaper',
        text: 'Check out this stunning alien wallpaper!',
        url: imageUrl
      });
      showToast('✅ Shared successfully!');
    }
    else if(navigator.clipboard && navigator.clipboard.writeText){
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(imageUrl);
      showToast('✅ Link copied to clipboard!');
    }
    else {
      // Last resort: Select text (older browsers)
      const textarea = document.createElement('textarea');
      textarea.value = imageUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('✅ Link copied!');
    }
    
    // Close overlay if on mobile
    const card = document.querySelector('[data-sharing="true"]');
    if(card) card.classList.remove('active');
  }catch(error){
    console.error('Share failed:', error);
    showToast('❌ Unable to share');
  }
}
```

**Parameters:**
- `imageUrl` (string): The Cloudinary image URL to share

**Returns:** Promise (async function)

**Decision Tree:**
```
Is navigator.share available?
├─ YES (Mobile): Open native share dialog
│                └─ Show "✅ Shared successfully!"
│
└─ NO (Desktop/Older browser)
   └─ Is navigator.clipboard available?
      ├─ YES (Modern): Copy to clipboard
      │               └─ Show "✅ Link copied to clipboard!"
      │
      └─ NO (Older)
         └─ Use legacy execCommand()
            └─ Show "✅ Link copied!"
```

**Fallback Chain:**
1. **Primary:** Web Share API (native share dialog on mobile)
2. **Secondary:** Clipboard API (modern browsers)
3. **Tertiary:** Legacy `execCommand()` (older browsers)

---

### Function 4: `initializeCards()` (Updated)
**Purpose:** Attaches event listeners to all cards

```javascript
function initializeCards(){
  document.querySelectorAll('.card').forEach(card=>{
    // Skip if already initialized
    if(card.dataset.initialized) return;
    card.dataset.initialized = 'true';

    const downloadBtn = card.querySelector('.download-btn');
    const shareBtn = card.querySelector('.share-btn');
    const imgEl = card.querySelector('img');

    // Get the image URL from button data-url attribute or img src
    const imageUrl = downloadBtn?.getAttribute('data-url') || 
                    shareBtn?.getAttribute('data-url') || 
                    (imgEl && imgEl.src);

    // Extract filename from URL
    const getFilename = (url) => {
      if(!url) return 'ki-wallpaper.webp';
      const parts = url.split('/').pop().split('?')[0];
      return parts || 'ki-wallpaper.webp';
    };

    // Mobile: tap card to show buttons
    card.addEventListener('click', (e)=>{
      if(e.target === card || e.target === imgEl){
        e.stopPropagation();
        card.classList.toggle('active');
      }
    });

    // Download button handler
    if(downloadBtn){
      downloadBtn.addEventListener('click', async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        card.setAttribute('data-downloading', 'true');
        await handleDownload(imageUrl, getFilename(imageUrl));
        card.removeAttribute('data-downloading');
      });
    }

    // Share button handler
    if(shareBtn){
      shareBtn.addEventListener('click', async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        card.setAttribute('data-sharing', 'true');
        await handleShare(imageUrl);
        card.removeAttribute('data-sharing');
      });
    }

    // Image click opens lightbox (full view)
    if(imgEl){
      imgEl.addEventListener('click', (e)=>{
        e.stopPropagation();
        openLightbox(imageUrl);
      });
    }
  });
}

// Initialize on DOM ready
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initializeCards);
} else {
  initializeCards();
}
```

**Key Points:**
- Prevents duplicate initialization with `card.dataset.initialized` check
- Extracts imageUrl from button's `data-url` attribute
- Creates `getFilename()` helper to extract filename from URL
- Attaches separate listeners for download, share, and lightbox
- Runs on DOMContentLoaded or immediately if DOM already loaded

---

### Function 5: Event Delegation (Updated)
**Purpose:** Fallback button click handling at document level

```javascript
document.addEventListener('click', (e)=>{
  const downloadBtn = e.target.closest('.download-btn');
  if(downloadBtn){
    e.preventDefault();
    e.stopPropagation();
    const card = downloadBtn.closest('.card');
    const imageUrl = downloadBtn.getAttribute('data-url') || 
                    card?.querySelector('img')?.src;
    const filename = imageUrl ? imageUrl.split('/').pop().split('?')[0] : 'ki-wallpaper.webp';
    
    card?.setAttribute('data-downloading', 'true');
    handleDownload(imageUrl, filename);
    setTimeout(() => card?.removeAttribute('data-downloading'), 100);
  }

  const shareBtn = e.target.closest('.share-btn');
  if(shareBtn){
    e.preventDefault();
    e.stopPropagation();
    const card = shareBtn.closest('.card');
    const imageUrl = shareBtn.getAttribute('data-url') || 
                    card?.querySelector('img')?.src;
    
    card?.setAttribute('data-sharing', 'true');
    handleShare(imageUrl);
    setTimeout(() => card?.removeAttribute('data-sharing'), 100);
  }
}, true); // capture phase ensures event is caught before bubbling
```

**Why Needed:**
- Backup mechanism if per-card listeners fail to attach
- Ensures buttons work in all scenarios
- Uses event capturing phase for reliability
- Provides redundancy for production website

---

## Integration Points

### HTML Requirement
Each button must have a `data-url` attribute:

```html
<button class="card-btn download-btn" 
        aria-label="Download wallpaper" 
        data-url="https://res.cloudinary.com/dmdlkppcg/image/upload/ar_9:16,c_auto/image.webp">
  <svg>...</svg>
</button>
```

✅ **Already present in all 70 cards - No changes needed**

### Toast Function Requirement
The `showToast()` function is called throughout:

```javascript
showToast('✅ Download started!');
```

✅ **Already exists in script.js**

### Lightbox Function Requirement
The `openLightbox()` function is called for image clicks:

```javascript
openLightbox(imageUrl);
```

✅ **Already exists in script.js**

---

## Cloudinary URL Transformation Details

### Original URL (in HTML):
```
https://res.cloudinary.com/dmdlkppcg/image/upload/ar_9:16,c_auto/ChatGPT_Image_Jan_30_2026_12_10_20_AM_v1v0j9.webp
```

### What getDownloadUrl() does:
```javascript
originalUrl.replace('/image/upload/', '/image/upload/fl_attachment/')
```

### Result (for download):
```
https://res.cloudinary.com/dmdlkppcg/image/upload/fl_attachment/ar_9:16,c_auto/ChatGPT_Image_Jan_30_2026_12_10_20_AM_v1v0j9.webp
```

### Cloudinary Interpretation:
- `fl_attachment` = Force content disposition as attachment (download)
- `ar_9:16` = Aspect ratio 9:16 (portrait)
- `c_auto` = Automatic crop
- Result = Image downloads instead of displaying in browser

---

## Testing Code Snippets

### Test Download in Console:
```javascript
// Manually test download handler
const testUrl = 'https://res.cloudinary.com/dmdlkppcg/image/upload/ar_9:16,c_auto/ChatGPT_Image_Jan_30_2026_12_10_20_AM_v1v0j9.webp';
handleDownload(testUrl, 'test-image.webp');
```

### Test Share in Console:
```javascript
// Manually test share handler
const testUrl = 'https://res.cloudinary.com/dmdlkppcg/image/upload/ar_9:16,c_auto/ChatGPT_Image_Jan_30_2026_12_10_20_AM_v1v0j9.webp';
handleShare(testUrl);
```

### Verify URL Conversion:
```javascript
// Test getDownloadUrl function
getDownloadUrl('https://res.cloudinary.com/dmdlkppcg/image/upload/ar_9:16,c_auto/image.webp');
// Should output:
// https://res.cloudinary.com/dmdlkppcg/image/upload/fl_attachment/ar_9:16,c_auto/image.webp
```

### Check Initialization:
```javascript
// Verify cards are initialized
document.querySelectorAll('.card[data-initialized="true"]').length;
// Should equal number of cards (70)
```

---

## Performance Notes

- **No External Libraries:** Pure vanilla JavaScript
- **Minimal DOM Manipulation:** Only creates temporary elements
- **Resource Cleanup:** Blob URLs revoked after use
- **Event Efficiency:** Single document listener + per-card listeners
- **Async Operations:** Download/share don't block UI (async/await)
- **Error Recovery:** Graceful fallbacks prevent crashes

---

## Browser Compatibility Matrix

| Browser | Download | Share | Notes |
|---------|----------|-------|-------|
| Chrome 90+ | ✅ | ✅ Mobile: native, Desktop: clipboard |
| Firefox 88+ | ✅ | ✅ Clipboard |
| Safari 14+ | ✅ | ✅ iOS: native, Desktop: clipboard |
| Edge 90+ | ✅ | ✅ Clipboard |
| iOS Safari 14+ | ✅ | ✅ Native share dialog |
| Android Chrome 90+ | ✅ | ✅ Native share dialog |
| IE 11 | ❌ | ⚠️ Legacy fallback only |

---

**Last Updated:** January 30, 2026  
**Status:** Production Ready ✅
