# Wallpaper Download Login Requirement - Implementation Guide

## Overview
All wallpaper downloads on the QIV website now require users to be logged in. The system automatically shows a login/signup modal if a user attempts to download without being authenticated, and automatically starts the download after successful login or signup.

## Features Implemented ✅

### 1. Login Requirement for Downloads
- All download buttons (`.download-btn`) are monitored by the authentication system
- When a non-logged-in user clicks download, the login modal appears immediately
- Users cannot download without logging in or signing up

### 2. Automatic Download After Login
- When a user attempts to download before logging in, the URL is stored in `sessionStorage` as `qiv_pending_download`
- After successful login or signup, the system automatically retrieves the pending URL and starts the download
- No user action required - it's completely automatic

### 3. Download Tracking in Supabase
- Every download is recorded in the Supabase `downloads` table
- Tracked fields:
  - `user_id`: UUID of the logged-in user
  - `wallpaper_id`: The image URL (used as unique identifier)
  - `downloaded_at`: ISO timestamp of when the download occurred
- Real-time counter updates the global download count on the page

### 4. Works for All Current and Future Wallpapers
- Download handler uses event delegation on `.download-btn` class
- Any new wallpaper added with a download button will automatically be protected
- No additional code needed for new wallpapers

## Technical Architecture

### Key Components

#### 1. **auth.js** - Main Authentication & Download Handler
Location: `auth.js`

Key Functions:
- `startDownloadByUrl(imageUrl)` - Main download handler
  - Checks if user is logged in
  - If not: Shows auth modal, stores pending download
  - If yes: Tracks download, initiates file download
  
- `handleDownloadClick(btn)` - Button click handler
  - Extracts image URL from button data attributes
  - Calls `startDownloadByUrl`

Event Listeners:
```javascript
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.download-btn');
  if (btn) {
    e.preventDefault();
    handleDownloadClick(btn);
  }
});
```

Auth State Listener:
```javascript
sb.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const pending = sessionStorage.getItem('qiv_pending_download');
    if (pending) {
      sessionStorage.removeItem('qiv_pending_download');
      await startDownloadByUrl(pending);
    }
  }
});
```

#### 2. **Supabase Database Schema**
Location: `supabase_schema.sql`

```sql
create table if not exists downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  wallpaper_id text,
  downloaded_at timestamptz default now()
);
```

#### 3. **HTML Structure**
Location: `index.html`

Download button example:
```html
<button class="card-btn download-btn" 
        aria-label="Download wallpaper" 
        data-url="https://res.cloudinary.com/...image.webp">
  <svg>...</svg>
</button>
```

Script loading order:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="auth.js"></script>
```

## User Flow

### Scenario 1: Non-logged-in User Downloads
1. User clicks download button
2. `handleDownloadClick()` is triggered
3. System checks `currentUser` (null if not logged in)
4. Auth modal appears with message: "Please login to download"
5. Image URL stored in `sessionStorage` as `qiv_pending_download`
6. User signs up or logs in
7. After authentication succeeds:
   - Profile is created/updated
   - `signUpWithEmail()` or `signInEmail()` retrieves pending URL
   - `startDownloadByUrl()` is called automatically
   - Download is tracked in Supabase
   - File download begins automatically
8. User sees toast: "✅ Download started"

### Scenario 2: Logged-in User Downloads
1. User clicks download button
2. `handleDownloadClick()` is triggered
3. System checks `currentUser` (exists)
4. `startDownloadByUrl()` is called immediately
5. Download is tracked in Supabase with user_id
6. File download begins
7. User sees toast: "✅ Download started"

## How It Works for Future Wallpapers

When you add new wallpapers to the website:

1. Add the wallpaper HTML to a gallery section:
```html
<div class="card ratio-9-16">
  <img src="..." alt="...">
  <div class="card-overlay">
    <div class="card-buttons">
      <button class="card-btn download-btn" 
              data-url="https://...wallpaper.webp">
        <svg>...</svg>
      </button>
    </div>
  </div>
</div>
```

2. **That's it!** The existing event listener in `auth.js` will automatically:
   - Detect the new download button
   - Apply login requirement
   - Track downloads in Supabase
   - Handle auto-download after login

No additional code modifications needed.

## Database Queries

### View all downloads
```sql
SELECT * FROM downloads ORDER BY downloaded_at DESC;
```

### Downloads by user
```sql
SELECT * FROM downloads 
WHERE user_id = 'USER_UUID' 
ORDER BY downloaded_at DESC;
```

### Download count
```sql
SELECT COUNT(*) as total_downloads FROM downloads;
```

### Downloads in date range
```sql
SELECT COUNT(*) FROM downloads 
WHERE downloaded_at >= '2024-01-01' 
  AND downloaded_at < '2024-02-01';
```

## Configuration

### Supabase Credentials
Configured in `index.html` via meta tags:
```html
<meta name="supabase-url" content="https://ysdupaiiglptyyfalxhp.supabase.co">
<meta name="supabase-key" content="sb_publishable_V96V6yk4Fs_3bLZku79NuA_itU_YvoK">
```

These are read by `auth.js` at runtime:
```javascript
const metaUrl = document.querySelector('meta[name="supabase-url"]')?.getAttribute('content');
const metaKey = document.querySelector('meta[name="supabase-key"]')?.getAttribute('content');
```

## Error Handling

The system handles various error scenarios:

1. **Supabase not available** - Downloads proceed with user notification
2. **Download tracking fails** - Download still proceeds, error logged
3. **Network error during download** - Falls back to opening in new tab
4. **Missing image URL** - Button click is ignored with console warning

All errors are logged to the browser console for debugging.

## Browser Storage

- **sessionStorage**: `qiv_pending_download` - Stores image URL while user logs in (cleared after use)
- **localStorage**: Auth session managed by Supabase SDK

## Toast Notifications

Users see toast messages for:
- "Please login to download" - when non-logged user clicks download
- "✅ Download started" - successful download
- "Opening in new tab" - fallback download method
- Custom error messages if download fails

## Monitoring & Analytics

The downloads table can be used for:
- **User engagement tracking** - how many users download wallpapers
- **Popular wallpapers** - which images are downloaded most
- **Download trends** - weekly/monthly download statistics
- **User behavior** - which users are most active

## Testing Checklist

- [ ] Non-logged-in user clicks download → Auth modal appears
- [ ] Pending download URL is stored correctly
- [ ] User signs up → Download starts automatically
- [ ] User logs in → Download starts automatically
- [ ] Download appears in Supabase downloads table
- [ ] Download record includes correct user_id, wallpaper_id, and timestamp
- [ ] Global download counter updates in real-time
- [ ] Works on mobile and desktop
- [ ] Works with multiple browsers
- [ ] New wallpaper with download button auto-protects

## Security Notes

1. **Authentication Required** - Supabase handles auth security
2. **RLS Policies** - Can be enabled for additional security
3. **User Data** - Only user ID is stored, no personal data
4. **Session Management** - Supabase SDK handles secure sessions

## Support & Debugging

Check browser console for:
- `auth.js` logs for auth issues
- Download tracking errors
- Network errors during download

Use `window.qivAuth` to check status:
```javascript
window.qivAuth.isLoggedIn()        // Returns true/false
window.qivAuth.getCurrentUser()    // Returns user object or null
```

## Future Enhancements

Possible improvements:
- Add download count per user to profile
- Implement download rate limiting
- Add email notifications for new wallpapers
- Create admin dashboard to view download analytics
- Add payment/premium wallpaper features
