# OROVA Landing Page - GitHub Upload Instructions

## ✅ What I Just Did
Replaced `index.html` in your `personal_site` folder with the complete production landing page.

**File Updated:** `c:\Users\Mike\OneDrive\Desktop\Cosker\OROVA\personal_site\index.html`

---

## 📤 How to Upload to GitHub (Without Git Installed)

Since your GitHub repo is connected to Render, when you push the new `index.html`, Render will automatically redeploy your site!

### Method 1: GitHub Web Interface (Easiest)

1. **Go to your GitHub repo** in your browser:
   - `https://github.com/markcosker2-dev/markcosker2-dev` (or your actual repo URL)

2. **Upload the file:**
   - Click on `index.html` in your repo
   - Click the **trash icon** to delete the old file
   - Commit the deletion
   - Click **Upload files** button
   - Drag and drop the new `index.html` from:
     ```
     c:\Users\Mike\OneDrive\Desktop\Cosker\OROVA\personal_site\index.html
     ```
   - Add commit message: "Update landing page with production design"
   - Click **Commit changes**

3. **Render will auto-deploy:**
   - After you commit, Render will detect the change
   - It will automatically redeploy your site
   - Wait 1-2 minutes for deployment to complete
   - Your new landing page will be live!

### Method 2: GitHub Desktop (If Installed)

If you have GitHub Desktop:
1. Open GitHub Desktop
2. Select your repo
3. It will show `index.html` as modified
4. Add commit message: "Update landing page"
5. Click **Commit to main**
6. Click **Push origin**
7. Render auto-deploys!

---

## 🎵 Don't Forget the Audio File!

Your landing page needs an AI demo audio file:

**Location needed:** `assets/ai-demo.mp3`

**Options:**
1. Record an actual AI call from your VAPI system
2. Use a professional voiceover sample
3. Create a mock qualification conversation

**Specs:**
- Format: MP3
- Duration: 30-60 seconds
- Size: <500KB
- Content: Shows budget/timeline/interest qualification

**To upload:**
1. Create `assets` folder in your GitHub repo (if not exists)
2. Upload `ai-demo.mp3` to the assets folder
3. The audio player will work automatically!

---

## 🚀 After Upload

Once the new `index.html` is in GitHub:

1. **Render auto-deploys** (usually takes 1-2 min)
2. **Check your live site** at your Render URL
3. **Add the audio file** when ready
4. **Test the form** - update the form submission code if needed

---

## 📝 Optional: Form Integration

The form currently logs to console. To capture leads:

Update the form submission in `index.html` around line 888:

```javascript
// Replace console.log with actual submission
fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData)
});
```

Or integrate with your existing backend API!

---

## ✨ What's New in This Landing Page

- ✅ Production-grade design with dark theme
- ✅ Interactive circular audio visualizer
- ✅ PAS copywriting framework
- ✅ 3-step "How OROVA Works" process
- ✅ Social proof testimonials
- ✅ Mobile-responsive Tailwind CSS
- ✅ Sticky CTA button (appears on scroll)
- ✅ Form validation
- ✅ Territory exclusivity messaging
- ✅ Self-contained (no build process needed)

---

## 🎯 Next Steps

1. Upload `index.html` to GitHub ✅
2. Wait for Render to auto-deploy (1-2 min)
3. View your new landing page live!
4. Add `assets/ai-demo.mp3` when ready
5. Test form submission
6. Celebrate! 🎉
