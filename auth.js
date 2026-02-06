// Supabase-based authentication, profile (QID) and download tracking
// IMPORTANT: Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project values

(function () {
  // Read Supabase config from meta tags first (recommended)
  const metaUrl = document.querySelector('meta[name="supabase-url"]')?.getAttribute('content');
  const metaKey = document.querySelector('meta[name="supabase-key"]')?.getAttribute('content');
  const SUPABASE_URL = metaUrl || 'https://ysdupaiiglptyyfalxhp.supabase.co';
  const SUPABASE_ANON_KEY = metaKey || 'sb_publishable_V96V6yk4Fs_3bLZku79NuA_itU_YvoK';

  if (!window.supabase) {
    console.error('Supabase client not loaded. Add <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>');
    return;
  }

  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // DOM
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const authTitle = document.getElementById('auth-title');
  const authSub = document.getElementById('auth-sub');
  const authNameField = document.querySelector('.auth-field-name');
  const authNameInput = document.getElementById('auth-name');
  const authEmailInput = document.getElementById('auth-email');
  const authPasswordInput = document.getElementById('auth-password');
  const authSubmit = document.getElementById('auth-submit');
  const authToggle = document.getElementById('auth-toggle');
  const authModalClose = document.querySelector('.auth-modal-close');
  const headerAuthButtons = document.querySelector('.header-auth-buttons');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const toggleSignupBtn = document.getElementById('auth-toggle');

  const totalDownloadsEl = document.getElementById('total-downloads');

  let authMode = 'login'; // or 'signup'
  let currentUser = null;

  // ===== Download button logic =====
  // Downloads are ALWAYS available (no server-level blocking)
  // Client-side check: on download click, check if logged in
  // If NOT logged in → redirect to login.html
  // If logged in → allow download via anchor href
  function setDownloadButtonsLocked(locked = true) {
    // This function is kept for backwards compatibility but does nothing
    // All pages are PUBLIC, all files are ACCESSIBLE
    // Download gate is handled by JavaScript onclick check only
  }

  // ===== Utilities =====
  function showToast(msg) {
    let t = document.querySelector('.ki-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'ki-toast';
      Object.assign(t.style, { position: 'fixed', right: '16px', bottom: '24px', background: 'var(--primary)', color: 'white', padding: '10px 14px', borderRadius: '10px', zIndex: 9999 });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => { t.style.opacity = '0'; }, 3000);
  }

  // Show message inside auth modal
  function setAuthMessage(msg, isError = false) {
    const el = document.getElementById('auth-message');
    if (!el) return;
    el.style.display = msg ? 'block' : 'none';
    el.style.color = isError ? 'var(--danger)' : 'var(--muted)';
    el.textContent = msg || '';
  }

  function toggleAuthModal(show = true) {
    if (!authModal) return;
    if (show) authModal.classList.remove('hidden'); else authModal.classList.add('hidden');
  }


  function niceNumber(n) {
    if (n < 1000) return String(n);
    if (n < 1_000_000) return `${(n/1000).toFixed(n%1000===0?0:1)}K`;
    return `${(n/1000000).toFixed(n%1000000===0?0:1)}M`;
  }

  // ===== Supabase helpers =====
  async function createOrUpdateProfile(userId, name) {
    if (!userId) return null;
  
    try {
      await sb.from('profiles').upsert({ id: userId, name: name || '', qid }, { returning: 'minimal' });
      return { id: userId, name, qid };
    } catch (err) {
      console.error('Profile upsert error', err);
      return null;
    }
  }

  async function getProfile(userId) {
    if (!userId) return null;
    const { data, error } = await sb.from('profiles').select('name,qid').eq('id', userId).maybeSingle();
    if (error) return null;
    return data;
  }

  async function updateHeaderForUser(user, profile) {
    currentUser = user;
    if (loginBtn) loginBtn.classList.add('hidden');
    if (signupBtn) signupBtn.classList.add('hidden');

    const userBlock = document.createElement('div');
    userBlock.className = 'header-user-block';
    userBlock.style.display = 'flex';
    userBlock.style.flexDirection = 'column';
    userBlock.style.alignItems = 'flex-end';
    userBlock.style.gap = '2px';

    const nameEl = document.createElement('div');
    nameEl.textContent = `👤 ${profile?.name || user?.email.split('@')[0] || 'User'}`;
    nameEl.style.fontWeight = '700';
    const qidEl = document.createElement('div');
    qidEl.textContent = `QID: ${profile?.qid || ('QIV-' + (user?.id || '').slice(0,7).toUpperCase())}`;
    qidEl.style.fontSize = '12px';
    qidEl.style.color = 'var(--muted)';

    userBlock.appendChild(nameEl);
    userBlock.appendChild(qidEl);

    const logoutBtn = document.getElementById('logout-btn');
    const existing = document.querySelector('.header-user-block');
    if (existing) existing.remove();
    if (logoutBtn && logoutBtn.parentElement) {
      logoutBtn.parentElement.insertBefore(userBlock, logoutBtn);
      logoutBtn.classList.remove('hidden');
    } else if (headerAuthButtons) {
      headerAuthButtons.appendChild(userBlock);
    }

    try {
      const { count } = await sb.from('downloads').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const downloadsEl = document.createElement('div');
      downloadsEl.textContent = `Downloads: ${niceNumber(count || 0)}`;
      downloadsEl.style.fontSize = '12px';
      downloadsEl.style.color = 'var(--muted)';
      downloadsEl.style.marginTop = '2px';
      userBlock.appendChild(downloadsEl);
    } catch (e) {}
  }

  function clearHeaderUser() {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (signupBtn) signupBtn.classList.remove('hidden');
    const existing = document.querySelector('.header-user-block');
    if (existing) existing.remove();
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    currentUser = null;
  }

  // ===== Auth flows =====
  async function signUpWithEmail(name, email, password) {
    try {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name } } });
      if (error) throw error;
      // Attempt immediate sign-in (common for projects without email confirmations)
      const { data: signInData, error: signInErr } = await sb.auth.signInWithPassword({ email, password });
      if (signInErr) {
        showToast('Signed up — please check your email to confirm your account');
        // still create profile record so we have QID after confirmation
        if (data?.user?.id) await createOrUpdateProfile(data.user.id, name);
        // Switch to login view automatically
        setAuthMode('login');
        return;
      }
      const user = signInData.user;
      await createOrUpdateProfile(user.id, name);
      const profile = await getProfile(user.id);
      await updateHeaderForUser(user, profile);
      toggleAuthModal(false);
      resetAuthForm();
      setAuthMessage('');
      showToast('Welcome!');
      // No automatic pending-download behavior; simple downloads are supported for all users.
    } catch (err) {
      console.error('Sign up error', err);
      const message = err.message || 'Sign up failed';
      setAuthMessage(message, true);
      showToast(message);
    }
  }

  async function signInEmail(email, password) {
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user;
      await createOrUpdateProfile(user.id, user.user_metadata?.name || '');
      const profile = await getProfile(user.id);
      await updateHeaderForUser(user, profile);
      toggleAuthModal(false);
      setAuthMessage('Logged in successfully');
      showToast('Logged in');
      // No pending-download processing; downloads are direct and do not require login.
    } catch (err) {
      console.error('Sign in error', err);
      setAuthMessage(err.message || 'Login failed', true);
      showToast(err.message || 'Login failed');
    }
  }

  // Minimal public helpers
  function getCurrentUser() { return currentUser; }
  function isLoggedIn() { return !!currentUser; }

  async function updateAuthUI() {
    try {
      const { data } = await sb.auth.getSession();
      const user = data?.session?.user;
      if (user) {
        currentUser = user;
        const profile = await getProfile(user.id);
        await updateHeaderForUser(user, profile);
        // enable download buttons for signed-in users
        // downloads remain available to all users
      } else {
        clearHeaderUser();
        // lock download buttons for visitors
        // downloads remain available to visitors
      }
    } catch (e) {
      clearHeaderUser();
      setDownloadButtonsLocked(true);
    }
  }

  function handleEmailSignup() {
    setAuthMode('signup');
    toggleAuthModal(true);
  }

  function handleLogout() {
    signOut();
  }

  async function signOut() {
    try {
      await sb.auth.signOut();
      clearHeaderUser();
      showToast('Logged out');
    } catch (err) {
      console.error('Sign out error', err);
      showToast('Logout failed');
    }
  }

  // ===== Download handling =====
  // Downloads are handled by plain HTML anchor links in the markup.
  // Per project requirement, no JavaScript will modify filenames or
  // convert buttons to anchors at runtime.

  // ===== Global downloads counter =====
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

  // ===== Form handlers & UI wiring =====
  let isSubmitting = false;
  let eventListenersInitialized = false;

  function initializeEventListeners() {
    // Prevent duplicate event listener registration
    if (eventListenersInitialized) return;
    eventListenersInitialized = true;

    // Form submission handler
    authForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Prevent duplicate submissions
      if (isSubmitting) return;

      const email = (authEmailInput?.value || '').trim();
      const password = (authPasswordInput?.value || '').trim();
      const name = (authNameInput?.value || '').trim();
      const submitBtn = authSubmit;
      const spinner = submitBtn?.querySelector('.btn-spinner');
      const btnText = submitBtn?.querySelector('.btn-text');

      // Basic validation
      if (!email) { setAuthMessage('Please enter your email', true); authEmailInput?.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setAuthMessage('Please enter a valid email', true); authEmailInput?.focus(); return; }
      if (!password) { setAuthMessage('Please enter your password', true); authPasswordInput?.focus(); return; }
      if (authMode === 'signup') {
        if (!name) { setAuthMessage('Please enter your name', true); authNameInput?.focus(); return; }
        if (password.length < 6) { setAuthMessage('Password must be at least 6 characters', true); authPasswordInput?.focus(); return; }
      }

      try {
        isSubmitting = true;
        submitBtn?.classList.add('loading');
        submitBtn?.setAttribute('disabled', 'disabled');
        if (spinner) spinner.style.display = '';
        if (btnText) btnText.textContent = authMode === 'signup' ? 'Signing up...' : 'Logging in...';

        // Clear previous message
        setAuthMessage('');

        if (authMode === 'signup') {
          await signUpWithEmail(name, email, password);
        } else {
          await signInEmail(email, password);
        }
      } catch (err) {
        console.error('Form submission error:', err);
        setAuthMessage(err?.message || 'An error occurred', true);
      } finally {
        isSubmitting = false;
        submitBtn?.classList.remove('loading');
        submitBtn?.removeAttribute('disabled');
        if (spinner) spinner.style.display = 'none';
        if (btnText) btnText.textContent = authMode === 'signup' ? 'Sign up' : 'Login';
      }
    });

    // Auth toggle (Switch to Sign up / Switch to Login)
    authToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      setAuthMode(authMode === 'login' ? 'signup' : 'login');
    });

    // Modal close button
    document.querySelector('.auth-modal-close')?.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAuthModal(false);
      resetAuthForm();
    });

    // Click outside modal to close
    authModal?.addEventListener('click', (e) => {
      if (e.target === authModal) {
        toggleAuthModal(false);
        resetAuthForm();
      }
    });

    // Login button in header
    loginBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      setAuthMode('login');
      toggleAuthModal(true);
    });

    // Sign up button in header
    signupBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      setAuthMode('signup');
      toggleAuthModal(true);
    });

    // Logout button (event delegation)
    document.addEventListener('click', (e) => {
      const logout = e.target.closest && e.target.closest('#logout-btn');
      if (logout) {
        e.preventDefault();
        signOut();
      }
    });
  }

  function resetAuthForm() {
    authForm?.reset();
    setAuthMessage('');
    const resend = document.getElementById('auth-resend');
    if (resend) resend.style.display = 'none';
  }

  function setAuthMode(mode) {
    authMode = mode;
    if (mode === 'signup') {
      authTitle.textContent = 'Create account';
      authSubmit.querySelector('.btn-text').textContent = 'Sign up';
      authToggle.textContent = 'Switch to Login';
      authNameField.style.display = 'block';
    } else {
      authTitle.textContent = 'Login';
      authSubmit.querySelector('.btn-text').textContent = 'Login';
      authToggle.textContent = 'Switch to Sign up';
      authNameField.style.display = 'none';
    }
    const msg = document.getElementById('auth-message');
    if (msg) {
      msg.style.display = 'none';
      msg.textContent = '';
    }
    const resend = document.getElementById('auth-resend');
    if (resend) resend.style.display = 'none';
  }

  // ===== Auth state listener =====
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' || session?.user) {
      const user = session.user;
      currentUser = user;
      await createOrUpdateProfile(user.id, user.user_metadata?.name || '');
      const profile = await getProfile(user.id);
      await updateHeaderForUser(user, profile);
      // unlock downloads for this user
      // No pending-download processing; downloads are direct and do not require login.
    } else if (event === 'SIGNED_OUT') {
      clearHeaderUser();
      // lock downloads for visitors
      // downloads remain available to visitors
    }
  });

  (async function init() {
    await updateGlobalDownloads();
    subscribeDownloadsRealtime();
    const { data } = await sb.auth.getSession();
    if (data?.session?.user) {
      const user = data.session.user;
      currentUser = user;
      const profile = await getProfile(user.id);
      if (profile) await updateHeaderForUser(user, profile);
      // enable download buttons for restored session
      setDownloadButtonsLocked(false);
      // if user is restored and there is pending download, process it
      // No pending-download processing on init.
    } else {
      // no active session: ensure downloads are locked for visitors
      setDownloadButtonsLocked(true);
    }
    // Initialize event listeners after DOM is ready
    initializeEventListeners();
  })();

  /**
   * Logout
   */
  function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      signOut();
    }
  }

  // ===== NOTIFICATION PERMISSION =====

  /**
   * Request browser notification permission
   */
  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      subscribeToNotifications();
      return;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          subscribeToNotifications();
          showSampleNotification();
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    }
  }

  /**
   * Show welcome notification
   */
  function showSampleNotification() {
    try {
      const user = getCurrentUser();
      const title = '🎉 QIV Notifications Enabled';
      const options = {
        body: 'You will receive notifications about new alien wallpapers!',
        icon: '/icons/ki-icon-192.png',
        badge: '/icons/ki-icon-32.png',
        tag: 'qiv-welcome'
      };

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg && reg.showNotification) {
            reg.showNotification(title, options);
          }
        }).catch(() => {
          new Notification(title, options);
        });
      } else {
        new Notification(title, options);
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Subscribe to push notifications
   */
  async function subscribeToNotifications() {
    if (!('serviceWorker' in navigator)) return;

    try {
      const reg = await navigator.serviceWorker.ready;
      if (!reg.pushManager) return;

      // In production, set VAPID key and implement proper subscription
      const VAPID_PUBLIC_KEY = ''; // Add your VAPID public key
      
      if (VAPID_PUBLIC_KEY) {
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Send subscription to your backend
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            userId: getCurrentUser()?.id
          })
        }).catch(() => {});
      }

      localStorage.setItem(NOTIFICATION_PREF_KEY, 'enabled');
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  }

  /**
   * Convert VAPID key format
   */
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // ===== DOWNLOAD GATING =====

  /**
   * Check if user can download, if not show login modal
   */
  function checkDownloadAccess(callback) {
    // Downloads are available to everyone. Immediately run the callback.
    try { if (typeof callback === 'function') callback(); } catch (e) { /* noop */ }
  }

  // Downloads must be direct anchor links; no JS download handler is provided.

  // ===== TOAST NOTIFICATION =====

  function showToast(message) {
    let toast = document.querySelector('.ki-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ki-toast';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // ===== EVENT LISTENERS =====

  // Modal close
  authModalClose?.addEventListener('click', () => toggleAuthModal(false));
  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) toggleAuthModal(false);
  });

  // Header buttons
  loginBtn?.addEventListener('click', () => toggleAuthModal(true));
  signupBtn?.addEventListener('click', () => toggleAuthModal(true));
  logoutBtn?.addEventListener('click', handleLogout);

  // Signup button (email-based)
  toggleSignupBtn?.addEventListener('click', handleEmailSignup);

  // ===== INITIALIZATION =====

  // Restore login state on page load
  function initializeAuth() {
    updateAuthUI();
    
    // Check for existing session
    const user = getCurrentUser();
    if (user) {
      console.log(`User session restored: ${user.name} (${user.provider})`);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
  } else {
    initializeAuth();
  }

  // Export for external use
  window.qivAuth = {
    isLoggedIn,
    getCurrentUser,
    logout: handleLogout,
    openAuthModal: () => toggleAuthModal(true),
    closeAuthModal: () => toggleAuthModal(false),
    requestNotificationPermission,
    subscribeToNotifications
  };
  // Expose sign-in/up wrappers for onclick handlers and debugging
  window.signIn = async function(email, password) {
    setAuthMessage('');
    try {
      await signInEmail(String(email || '').trim(), String(password || ''));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || String(err) };
    }
  };

  window.signUp = async function(name, email, password) {
    setAuthMessage('');
    try {
      await signUpWithEmail(String(name || '').trim(), String(email || '').trim(), String(password || ''));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || String(err) };
    }
  };

  // Expose supabase client for debugging
  window.supabaseClient = sb;
})();
