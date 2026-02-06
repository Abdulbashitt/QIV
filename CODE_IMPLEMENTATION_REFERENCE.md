# Download Login Feature - Code Reference

This document shows the exact code that implements the download login requirement feature.

## 1. Download Button Event Listener

**File:** `auth.js`, Lines 313-320

```javascript
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.download-btn');
  if (btn) {
    e.preventDefault();
    handleDownloadClick(btn);
  }
});
```

**Purpose:** Intercepts all clicks on download buttons (class `.download-btn`)

---

## 2. Download Click Handler

**File:** `auth.js`, Lines 300-310

```javascript
async function handleDownloadClick(btn) {
  const imageUrl = btn.getAttribute('data-url') || btn.dataset.url;
  if (!imageUrl) return;
  if (!currentUser) {
    try { sessionStorage.setItem('qiv_pending_download', imageUrl); } catch (e) {}
    toggleAuthModal(true);
    showToast('Please login to download — your download will start after login');
    return;
  }
  await startDownloadByUrl(imageUrl);
}
```

**Purpose:** 
- Extracts image URL from button
- Checks if user is logged in
- If not: stores URL and shows modal
- If yes: proceeds with download

---

## 3. Main Download Function (Core Logic)

**File:** `auth.js`, Lines 265-300

```javascript
async function startDownloadByUrl(imageUrl) {
  if (!imageUrl) return;
  if (!currentUser) {
    try { sessionStorage.setItem('qiv_pending_download', imageUrl); } catch (e) {}
    toggleAuthModal(true);
    showToast('Please login to download — your download will start after login');
    return;
  }
  try {
    // TRACK DOWNLOAD IN SUPABASE
    await sb.from('downloads').insert([{ 
      user_id: currentUser.id, 
      wallpaper_id: imageUrl, 
      downloaded_at: new Date().toISOString() 
    }]);
  } catch (err) {
    console.error('Download tracking error', err);
  }

  try {
    // INITIATE FILE DOWNLOAD
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = imageUrl.split('/').pop().split('?')[0] || 'wallpaper.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    showToast('✅ Download started');
  } catch (err) {
    console.error('Download fallback', err);
    window.open(imageUrl, '_blank');
    showToast('Opening in new tab');
  }
}
```

**Key Features:**
- ✅ Login check
- ✅ Supabase tracking with user_id, wallpaper_id, downloaded_at
- ✅ File download with error handling
- ✅ Toast notifications

---

## 4. Sign Up with Auto-Download

**File:** `auth.js`, Lines 191-198

```javascript
// If a download was pending before auth, start it now
const pending = sessionStorage.getItem('qiv_pending_download');
if (pending) {
  try { sessionStorage.removeItem('qiv_pending_download'); } catch(e){}
  await startDownloadByUrl(pending);
}
```

Located inside `signUpWithEmail()` function after successful signup.

---

## 5. Sign In with Auto-Download

**File:** `auth.js`, Lines 225-232

```javascript
// If a download was pending before auth, start it now
const pending = sessionStorage.getItem('qiv_pending_download');
if (pending) {
  try { sessionStorage.removeItem('qiv_pending_download'); } catch(e){}
  await startDownloadByUrl(pending);
}
```

Located inside `signInEmail()` function after successful login.

---

## 6. Auth State Change Listener (Handles Session Restoration)

**File:** `auth.js`, Lines 394-402

```javascript
if (event === 'SIGNED_IN' || session?.user) {
  const user = session.user;
  currentUser = user;
  await createOrUpdateProfile(user.id, user.user_metadata?.name || '');
  const profile = await getProfile(user.id);
  await updateHeaderForUser(user, profile);
  // process any pending download after sign-in
  const pending = sessionStorage.getItem('qiv_pending_download');
  if (pending) {
    try { sessionStorage.removeItem('qiv_pending_download'); } catch(e){}
    await startDownloadByUrl(pending);
  }
}
```

Located in `sb.auth.onAuthStateChange()` listener.
**Purpose:** Handle auto-download if user's session is restored (e.g., page refresh)

---

## 7. Download Button HTML Structure

**File:** `index.html` (Example from line 1910)

```html
<button class="card-btn download-btn" 
        aria-label="Download wallpaper" 
        data-url="https://res.cloudinary.com/dmdlkppcg/image/upload/ar_9:16,c_auto/alien-pro-riding-skateboard-wallpaper-for-phone.webp_irttd4">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
</button>
```

**Key Attributes:**
- `class="download-btn"` - Allows event listener to detect button
- `data-url="...image.webp"` - Contains the image URL for download

---

## 8. Script Loading Order

**File:** `index.html`, Lines 2729-2732

```html
<!-- Supabase client (replace keys in auth.js) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

<!-- Authentication Module -->
<script src="auth.js"></script>
```

**Order is critical:**
1. Supabase SDK loads first
2. auth.js loads and sets up event listeners
3. All download buttons are automatically protected

---

## 9. Supabase Configuration

**File:** `index.html`, Lines 24-25

```html
<meta name="supabase-url" content="https://ysdupaiiglptyyfalxhp.supabase.co">
<meta name="supabase-key" content="sb_publishable_V96V6yk4Fs_3bLZku79NuA_itU_YvoK">
```

**Read by auth.js:**
```javascript
const metaUrl = document.querySelector('meta[name="supabase-url"]')?.getAttribute('content');
const metaKey = document.querySelector('meta[name="supabase-key"]')?.getAttribute('content');
const SUPABASE_URL = metaUrl || 'https://ysdupaiiglptyyfalxhp.supabase.co';
const SUPABASE_ANON_KEY = metaKey || 'sb_publishable_V96V6yk4Fs_3bLZku79NuA_itU_YvoK';
```

---

## 10. Download Tracking in Supabase

**File:** `supabase_schema.sql`

```sql
create table if not exists downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  wallpaper_id text,
  downloaded_at timestamptz default now()
);
```

**Used by auth.js:**
```javascript
await sb.from('downloads').insert([{ 
  user_id: currentUser.id,           // User's UUID
  wallpaper_id: imageUrl,            // Image URL (unique identifier)
  downloaded_at: new Date().toISOString()  // Timestamp
}]);
```

---

## 11. Global Download Counter

**File:** `auth.js`, Lines 323-330

```javascript
async function updateGlobalDownloads() {
  try {
    const { count } = await sb.from('downloads').select('*', { count: 'exact', head: true });
    const total = count || 0;
    if (totalDownloadsEl) totalDownloadsEl.textContent = niceNumber(total);
  } catch (err) {
    console.error('Count fetch error', err);
  }
}

function subscribeDownloadsRealtime() {
  try {
    const channel = sb.channel('downloads_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'downloads' }, (payload) => {
        updateGlobalDownloads();
      })
      .subscribe();
    window.__qiv_downloads_channel = channel;
  } catch (err) {
    console.error('Realtime subscribe error', err);
  }
}
```

**Purpose:** Update download count in real-time as new downloads are recorded

---

## Complete Feature Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks download button (class: download-btn)           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ Event listener detects   │
        │ click (#3)               │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ handleDownloadClick()    │ (#4)
        │ Gets image URL           │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ startDownloadByUrl()     │ (#5)
        │ Main function            │
        └──────────┬───────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   Not Logged In          Logged In
        │                     │
        ▼                     ▼
   Store URL in         Track in DB (#10)
   sessionStorage       user_id, 
   (#6, #7)            wallpaper_id,
        │              downloaded_at
        │                     │
        ▼                     ▼
   Show Modal          Download File
   (#8)                (#11)
        │                     │
        ▼                     ▼
   User Login/Signup   Show Toast
        │              "#✅ Download
        │              started"
        │
        ▼
   Login Success
        │
        ▼
   Retrieve pending URL
   from sessionStorage
        │
        ▼
   Call startDownloadByUrl()
   again with pending URL
        │
        ▼
   Track in DB
        │
        ▼
   Download File
        │
        ▼
   Show Toast
```

---

## Testing Each Component

### Test Event Listener (Step 1)
```javascript
// In browser console:
document.querySelectorAll('.download-btn').length
// Should return number of download buttons
```

### Test Login Check (Step 2-3)
```javascript
// In browser console:
window.qivAuth.isLoggedIn()        // Should return false if not logged in
window.qivAuth.getCurrentUser()    // Should return null if not logged in
```

### Test Modal Display (Step 4)
```javascript
// In browser console:
document.getElementById('auth-modal').classList.contains('hidden')
// Should return false (modal is visible) after clicking download
```

### Test Pending Download Storage (Step 5)
```javascript
// In browser console:
sessionStorage.getItem('qiv_pending_download')
// Should show the image URL after clicking download as non-logged-in user
```

### Test Database Tracking (Step 6)
```javascript
// In Supabase SQL editor:
SELECT * FROM downloads ORDER BY downloaded_at DESC LIMIT 1;
// Should show the most recent download with user_id
```

---

## All Requirements Met

✅ **Requirement 1:** All wallpaper downloads require login
- Location: Lines 265-310 in auth.js (login check)

✅ **Requirement 2:** Show login/signup modal if not logged in
- Location: Line 308 in auth.js (toggleAuthModal)

✅ **Requirement 3:** Don't allow download without login
- Location: Lines 268-274 in auth.js (return early if not logged in)

✅ **Requirement 4:** Auto-download after successful login
- Location: Lines 191-198, 225-232, 394-402 in auth.js

✅ **Requirement 5:** Track downloads in Supabase
- Location: Lines 275-279 in auth.js (insert to downloads table)
- Fields: user_id, wallpaper_id, downloaded_at

✅ **Requirement 6:** Works for all current and future wallpapers
- Location: Lines 313-320 in auth.js (event delegation with .download-btn class)

✅ **Requirement 7:** Plain HTML + JS
- No frameworks used, pure JavaScript with Supabase SDK

---

**All code is currently in place and functional!**
