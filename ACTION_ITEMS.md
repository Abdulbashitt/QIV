# QIV Phase 2 - Action Items & Next Steps

## 🎯 CRITICAL ACTIONS REQUIRED BEFORE LAUNCH

### 1. Domain Replacement (REQUIRED)
- [ ] Find and replace `https://your-domain.example` with your actual domain across ALL files
- [ ] Files to update:
  - lock-screen-wallpapers.html
  - home-screen-wallpapers.html
  - about.html
  - contact.html
  - sitemap.xml
  - robots.txt
  - index.html
  - iphone-wallpapers.html
  - android-wallpapers.html
- **Tools:** VS Code Find & Replace (Ctrl+H), or use command line: `grep -r "your-domain.example" .`

### 2. Form Configuration (REQUIRED)
- [ ] Set up Formspree (or alternative form service)
- [ ] Get your Formspree form ID from https://formspree.io/
- [ ] Update contact.html form action:
  ```html
  <form method="POST" action="https://formspree.io/f/YOUR_FORM_ID">
  ```
- **Alternatives:** Netlify Forms, Firebase, or your own backend

### 3. Open Graph Images (RECOMMENDED)
- [ ] Replace `PASTE-YOUR-PREVIEW-IMAGE-URL-HERE` with actual image URLs
- [ ] Files to update:
  - lock-screen-wallpapers.html (2 instances)
  - home-screen-wallpapers.html (2 instances)
  - about.html (1 instance)
  - contact.html (1 instance)
- [ ] Use Cloudinary URLs for fast delivery (same as existing wallpaper images)
- **Recommended Size:** 1200x630px (Facebook OG standard)

---

## ✅ VERIFICATION CHECKLIST

### Page Testing
- [ ] Homepage (`/`) - View in browser, test dark theme toggle
- [ ] iPhone page (`/iphone-wallpapers/`) - Verify unique content
- [ ] Android page (`/android-wallpapers/`) - Verify unique content
- [ ] Lock Screen page (`/lock-screen-wallpapers/`) - Verify unique content
- [ ] Home Screen page (`/home-screen-wallpapers/`) - Verify unique content
- [ ] About page (`/about/`) - Verify text content renders correctly
- [ ] Contact page (`/contact/`) - Test form submission

### Functionality Testing
- [ ] Theme toggle persists on page refresh (localStorage)
- [ ] Gallery scroll buttons work (left/right arrows)
- [ ] Download button works (Cloudinary fetch)
- [ ] Share button works (Web Share API or clipboard)
- [ ] All internal links navigate correctly
- [ ] Footer links point to correct pages

### Mobile Testing
- [ ] All pages render correctly on mobile devices
- [ ] Navigation is accessible on small screens
- [ ] Form fields are properly sized for touch input
- [ ] Gallery scroll works smoothly on mobile

### SEO Testing
- [ ] Run through Google PageSpeed Insights
- [ ] Check mobile usability in Google Mobile-Friendly Test
- [ ] Verify Open Graph tags (use Facebook Sharing Debugger)
- [ ] Verify Twitter Cards (use Twitter Card Validator)
- [ ] Test canonical links (view page source, check <link rel="canonical">)

---

## 📋 OPTIONAL ENHANCEMENTS

### Gallery Content Expansion (Medium Priority)
- [ ] Expand gallery on each category page (currently 1 card each)
- [ ] Goal: 5-20 unique cards per category
- [ ] Update files:
  - lock-screen-wallpapers.html
  - home-screen-wallpapers.html
- [ ] Duplicate card structure with new image URLs

### Individual Wallpaper Pages (Lower Priority)
- [ ] Create detail pages at `/wallpaper/[slug]/`
- [ ] Example: `/wallpaper/alien-green-skateboard-iphone/`
- [ ] Each page should include:
  - Unique H1 with wallpaper name
  - 2-3 sentence description
  - Large preview image
  - Prominent download button
  - Internal links to parent category
  - Schema.org ImageObject markup

### Structured Data (Lower Priority)
- [ ] Add JSON-LD Schema.org markup to all pages
- [ ] Include:
  - Organization schema (on about page)
  - ImageObject schema (on wallpaper cards)
  - WebPage schema (on category pages)
  - BreadcrumbList schema (on category/detail pages)

### Performance Optimization (Lower Priority)
- [ ] Implement lazy loading for images
- [ ] Compress CSS (minify)
- [ ] Compress JavaScript (minify)
- [ ] Set up CDN for faster global delivery
- [ ] Enable gzip compression on server

---

## 🚀 LAUNCH CHECKLIST

### Pre-Launch
- [ ] ✅ Domain replacement completed
- [ ] ✅ Form service configured
- [ ] ✅ Open Graph images updated
- [ ] ✅ All pages tested in browser
- [ ] ✅ Mobile responsiveness verified
- [ ] ✅ All links tested

### Post-Launch
- [ ] ✅ Submit sitemap.xml to Google Search Console
- [ ] ✅ Submit sitemap.xml to Bing Webmaster Tools
- [ ] ✅ Request indexing for new pages in GSC
- [ ] ✅ Set up Google Analytics 4 tracking
- [ ] ✅ Verify robots.txt is accessible at /robots.txt
- [ ] ✅ Monitor search console for crawl errors

---

## 📊 SEO MONITORING

### Week 1-2 After Launch
- Monitor Google Search Console for any crawl errors
- Check indexation status of all new pages
- Monitor for any manual actions or penalties

### Week 2-4 After Launch
- Begin monitoring search rankings for target keywords
- Identify any missing internal links or broken redirects
- Check Core Web Vitals scores

### Month 2+
- Track keyword rankings for all category pages
- Monitor traffic distribution across categories
- Identify top-performing content
- Plan content expansion based on user behavior

### Key Metrics to Monitor
- Organic traffic (by page and keyword)
- Click-through rate (CTR) from search results
- Average position in search results
- Core Web Vitals (LCP, FID, CLS)
- Mobile usability issues
- Mobile-first indexing status

---

## 🔧 TROUBLESHOOTING

### Issue: Pages not appearing in Google results
**Solution:**
1. Verify domain replacement was complete
2. Check sitemap.xml syntax (XML validator: https://www.xml-sitemaps.com/)
3. Submit sitemap to Google Search Console
4. Request indexing for specific pages
5. Wait 1-2 weeks for initial crawl

### Issue: Internal links returning 404
**Solution:**
1. Verify all href attributes match actual file names
2. Check for trailing slashes consistency (use or don't use across all URLs)
3. Verify category pages are at correct paths (e.g., `/iphone-wallpapers/` not `/iphone-wallpapers.html`)

### Issue: Images not loading
**Solution:**
1. Verify Cloudinary URLs are still accessible
2. Check image URLs don't have typos
3. Test direct image URL in browser
4. Verify image file format (should be .webp or .jpg)

### Issue: Form not receiving submissions
**Solution:**
1. Verify Formspree form ID is correct
2. Test form in browser developer console for JavaScript errors
3. Check email address associated with Formspree account
4. Verify spam folder for form submissions

---

## 📚 RESOURCES

### SEO Tools
- Google Search Console: https://search.google.com/search-console/
- Bing Webmaster Tools: https://www.bing.com/webmasters/
- Google PageSpeed Insights: https://pagespeed.web.dev/
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- XML Validator: https://www.xml-sitemaps.com/

### Optimization Tools
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/og/object/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Schema.org Validator: https://validator.schema.org/
- Cloudinary: https://cloudinary.com/

### Form Services
- Formspree: https://formspree.io/
- Netlify Forms: https://www.netlify.com/products/forms/
- Firebase: https://firebase.google.com/

---

## 📝 NOTES

- All new pages follow the same header/footer/navigation structure for consistency
- Each category page has 1 wallpaper card (proof of concept); expand as needed
- Contact form uses Formspree; alternative services available
- Sitemap uses `your-domain.example` placeholder; replace before launch
- robots.txt allows all crawlers; adjust Disallow rules as needed
- All pages have dark theme support via CSS variables

---

**Last Updated:** 2026-01-15
**Status:** Ready for Pre-Launch Configuration
**Next Review:** After domain replacement and form setup
