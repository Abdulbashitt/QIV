# QIV Quick Start - Get Running in 5 Minutes

## ⚡ Fastest Way to Deploy

### Option 1: Deploy Now (No Setup Required)

```bash
# 1. Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# 2. Deploy immediately
netlify deploy --prod --dir=.

# 3. Share your link!
# Your site will be live at: https://[random].netlify.app
```

**That's it! Your site is live.**

Features working immediately:
- ✅ Theme toggle
- ✅ Login/signup modal
- ✅ Email signup (demo)
- ✅ Download button with login requirement
- ✅ Share functionality
- ✅ Persistent login (localStorage)

---

## 🔑 Add Google Sign-In (5 minutes)

### Step 1: Get Google Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Select "Web Application"
4. Add authorized redirect URIs:
   ```
   https://yourdomain.netlify.app
   ```
5. Copy your **Client ID** (looks like: `1234567890-abc...apps.googleusercontent.com`)

### Step 2: Update auth.js
Open `auth.js` and find line ~180:

```javascript
// OLD:
async function handleGoogleLogin() {
  await loginWithProvider('google', mockEmail, mockName);
}

// NEW:
async function handleGoogleLogin() {
  if (!window.google?.accounts?.id) {
    console.error('Google Sign-In not loaded');
    return;
  }

  google.accounts.id.initialize({
    client_id: 'YOUR_CLIENT_ID_HERE',  // ← PASTE YOUR ID HERE
    callback: handleGoogleCredential
  });

  try {
    google.accounts.id.prompt();
  } catch (error) {
    console.error('Google Sign-In error:', error);
  }
}

function handleGoogleCredential(response) {
  try {
    // You'll need JWT decode library
    const decoded = jwt_decode(response.credential);
    loginWithProvider('google', decoded.email, decoded.name);
  } catch (error) {
    console.error('Credential decode error:', error);
  }
}
```

### Step 3: Add JWT Decoder

In `index.html`, find the line with auth.js script and add before it:

```html
<script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.js"></script>
<script src="auth.js"></script>
```

### Step 4: Redeploy
```bash
git add .
git commit -m "Add Google OAuth"
git push origin main

# OR with Netlify CLI:
netlify deploy --prod --dir=.
```

### Step 5: Test
1. Visit your site
2. Click "Login"
3. Click "Continue with Google"
4. You should see Google's sign-in popup

**Done!** ✅

---

## 🍎 Add Apple Sign-In (5 minutes)

### Step 1: Get Apple Credentials
1. Go to [Apple Developer](https://developer.apple.com/account)
2. Go to Certificates, IDs & Profiles
3. Create a **Service ID** (e.g., `com.yourcompany.qiv`)
4. Get your **Team ID** (top-right, Account section)
5. Verify your domain
6. Create a **Signing Key** and get **Key ID**

### Step 2: Update auth.js
Find line ~200 in `auth.js`:

```javascript
// OLD:
async function handleAppleLogin() {
  const mockEmail = `user${Math.random().toString(36).substr(2, 9)}@appleid.com`;
  await loginWithProvider('apple', mockEmail, 'Apple User');
}

// NEW:
async function handleAppleLogin() {
  if (!window.AppleID?.auth) {
    console.error('Apple Sign-In not loaded');
    return;
  }

  try {
    AppleID.auth.init({
      clientId: 'com.yourcompany.qiv',  // ← YOUR SERVICE ID
      teamId: 'ABCDEF1234',              // ← YOUR TEAM ID
      keyId: 'ABC123DEF456',             // ← YOUR KEY ID
      redirectURI: window.location.origin,
      usePopup: true
    });

    const data = await AppleID.auth.signIn();
    const userEmail = data.user?.email || `user${Date.now()}@appleid.com`;
    const userName = data.user?.name?.firstName || 'Apple User';
    loginWithProvider('apple', userEmail, userName);
  } catch (error) {
    console.error('Apple Sign-In error:', error);
    showToast('❌ Apple Sign-In failed');
  }
}
```

### Step 3: Redeploy
```bash
git add auth.js
git commit -m "Add Apple Sign-In"
git push origin main
```

### Step 4: Test
1. Visit your site
2. Click "Login"
3. Click "Continue with Apple"
4. Test with your Apple ID

**Done!** ✅

---

## 🔔 Add Push Notifications (Optional)

### Step 1: Generate VAPID Keys
```bash
npm install -g web-push
web-push generate-vapid-keys

# Output:
# Public Key: ABC123XYZ...
# Private Key: DEF456UVW...
```

### Step 2: Update auth.js
Find line ~245 in `auth.js`:

```javascript
// OLD:
const VAPID_PUBLIC_KEY = '';

// NEW:
const VAPID_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';
```

### Step 3: Create Backend Endpoint
You'll need a backend to save subscriptions. Simple Node.js example:

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/subscribe', express.json(), (req, res) => {
  const { subscription, userId } = req.body;
  // Save to database
  console.log('Subscription saved for user:', userId);
  res.json({ success: true });
});

app.listen(3000);
```

### Step 4: Redeploy
```bash
git add auth.js
git commit -m "Add push notifications support"
git push origin main
```

### Step 5: Test
1. Login to your site
2. You should see a notification permission popup
3. Grant permission
4. Check your Service Worker in DevTools (Application tab)

**Done!** ✅

---

## 📋 Features Checklist

### Immediate (No setup)
- [x] Theme toggle (light/dark)
- [x] Gallery browsing
- [x] Download button with login requirement
- [x] Login/Logout buttons
- [x] Modal system
- [x] Email signup (demo)
- [x] Persistent login (localStorage)
- [x] Share functionality
- [x] Responsive design

### With Google OAuth (5 min)
- [ ] Google Sign-In
- [ ] One-click login
- [ ] Auto-fill user info

### With Apple Sign-In (5 min)
- [ ] Apple Sign-In
- [ ] One-click login
- [ ] Auto-fill user info

### With Push Notifications (10 min)
- [ ] Browser notifications
- [ ] Permission request
- [ ] Notification bell

---

## 🧪 Test Everything Locally

### Start Local Server
```bash
# Python 3
python -m http.server 3000

# Node.js
npx http-server -p 3000

# Then visit: http://localhost:3000
```

### Test Features
1. **Theme Toggle**
   - Click sun/moon icon
   - Should switch light/dark

2. **Login/Logout**
   - Click "Login"
   - Modal appears
   - Click email signup
   - Enter any email
   - Should say "Welcome!"
   - Check header shows "Logout"
   - Refresh page (should still be logged in)
   - Click "Logout" (should show login/signup buttons again)

3. **Download Button**
   - While logged out: Click "FREE DOWNLOAD" → Should show login modal
   - While logged in: Click "FREE DOWNLOAD" → Should download file

4. **Share**
   - Click share icon
   - Should copy link to clipboard or show native share

5. **Mobile View**
   - Resize browser to 360px width
   - Everything should still work
   - Modal should be centered

---

## 🚨 Troubleshooting

### "Module not found: auth.js"
- Make sure `auth.js` file exists in same directory as `index.html`
- Check filename spelling (lowercase)

### Google Sign-In not working
- Check browser console for errors
- Verify Client ID is correct
- Check domain is in Authorized Redirect URIs
- Make sure `jwt_decode` library is loaded first

### Apple Sign-In not working
- Apple requires HTTPS (not localhost http)
- Use ngrok to test locally: `ngrok http 3000`
- Check credentials (Team ID, Service ID, Key ID)

### Push notifications not working
- Check browser notifications permission (DevTools → Application → Manifest)
- Check Service Worker is registered
- Verify VAPID keys are correct

### localStorage not persisting
- Check browser privacy/incognito mode
- Check storage quota
- Check DevTools Application → Storage → Local Storage

---

## 📊 Deployment Options

### Netlify (Recommended)
```bash
netlify deploy --prod --dir=.
```
✅ Free tier works great
✅ Easy setup
✅ Automatic HTTPS
✅ Great performance

### Vercel
```bash
vercel --prod
```
✅ Free tier available
✅ Very fast
✅ Automatic deployment

### GitHub Pages
```bash
# Add to package.json scripts
"deploy": "git subtree push --prefix . origin gh-pages"
```
✅ Free with GitHub
⚠️ No backend support

### Your Own Server
```bash
# Copy files to your server
scp -r . user@yourserver.com:/var/www/qiv/
```
✅ Full control
⚠️ Need to manage SSL, backups, etc.

---

## 🎯 Next Steps

### Today
1. ✅ Deploy to Netlify
2. ✅ Test basic features
3. Share your link!

### This Week
1. Add Google OAuth
2. Add Apple Sign-In
3. Test with real accounts

### This Month
1. Set up backend server
2. Enable push notifications
3. Monitor analytics

### This Quarter
1. Build admin panel
2. Add more wallpapers
3. Launch marketing campaign

---

## 🆘 Common Errors & Fixes

**"SyntaxError: Unexpected token < in JSON"**
- Usually means you're trying to parse HTML as JSON
- Check that API endpoints return proper JSON, not HTML error pages

**"CORS error when fetching..."**
- Add proper CORS headers on backend
- Or use a CORS proxy temporarily

**"localStorage quota exceeded"**
- You've stored too much data
- Clear localStorage: `localStorage.clear()`
- Or only store 60 users max (already configured)

**"Image not loading"**
- Check image URL is valid
- Verify CORS headers on image server
- Try in incognito mode (cache issue?)

---

## 📚 Documentation

Detailed guides available:
- [README.md](README.md) - Overview & features
- [QIV_SETUP_GUIDE.md](QIV_SETUP_GUIDE.md) - Complete setup
- [API_REFERENCE.md](API_REFERENCE.md) - Backend API
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - Task list

---

## 🚀 You're Ready!

Everything is set up and ready to go. Just:

1. Deploy to Netlify (1 minute)
2. Test locally (2 minutes)
3. Add Google OAuth (5 minutes)
4. Add Apple Sign-In (5 minutes)

**Total time: ~15 minutes to have a fully functional platform!**

---

## 💬 Questions?

Check the detailed documentation or dive into the code - everything is well-commented.

**Good luck! 🎉**
