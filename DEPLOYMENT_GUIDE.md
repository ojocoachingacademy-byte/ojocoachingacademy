# Deployment Guide - Ojo Coaching Academy Website

## Quick Start (5 Minutes)

### Option 1: Netlify (Easiest - Recommended)

1. **Create Account**
   - Go to https://www.netlify.com
   - Sign up for free account (use email or GitHub)

2. **Deploy Your Site**
   - After logging in, you'll see a deploy area
   - Simply drag and drop your entire "Tennis Coaching" folder
   - Wait 1-2 minutes for deployment
   - Your site is now live! You'll get a URL like: `your-site-name.netlify.app`

3. **Custom Domain (Optional)**
   - In Netlify dashboard, go to "Domain settings"
   - Click "Add custom domain"
   - Enter your domain name (if you have one)
   - Follow DNS configuration instructions

---

### Option 2: Vercel

1. **Create Account**
   - Go to https://vercel.com
   - Sign up with GitHub (easiest) or email

2. **Deploy**
   - Click "New Project"
   - Import your folder or connect GitHub repository
   - Click "Deploy"
   - Your site is live!

---

### Option 3: GitHub Pages

1. **Create GitHub Account**
   - Go to https://github.com and sign up

2. **Create Repository**
   - Click "New repository"
   - Name it (e.g., "tennis-coaching-website")
   - Make it Public (required for free GitHub Pages)
   - Click "Create repository"

3. **Upload Files**
   - Click "uploading an existing file"
   - Drag all your website files
   - Commit changes

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be at: `your-username.github.io/repository-name`

---

## Before You Deploy - Checklist

### ✅ Update Contact Information

**Files to update:**
- `index.html` - Contact section
- `confirmation.html` - Contact buttons

**What to change:**
- [ ] Email address (currently: coach@ojocoachingacademy.com)
- [ ] Phone number (if you want to display it)
- [ ] Location details (currently: Colina Del Sol Park, Mid City, San Diego)

### ✅ Test Locally

1. Open `index.html` in your browser
2. Test all links:
   - [ ] Navigation links work
   - [ ] "Book Now" button works
   - [ ] Contact information is correct
   - [ ] All images load properly
   - [ ] Video plays correctly

### ✅ Stripe Payment Setup (Important!)

**Current Status:** The payment form uses a demo/test flow. For real payments, you need:

1. **Create Stripe Account**
   - Sign up at https://stripe.com
   - Complete business verification

2. **Get Your Publishable Key**
   - Go to Developers → API keys
   - Copy your "Publishable key"

3. **Update booking.js**
   - Open `booking.js`
   - Find line 3: `const stripe = Stripe('pk_test_your_publishable_key');`
   - Replace with: `const stripe = Stripe('pk_live_YOUR_ACTUAL_KEY');`
   - ⚠️ **Important:** Use test key (`pk_test_...`) first to test, then switch to live key (`pk_live_...`)

4. **Backend Server Needed for Real Payments**
   - The current code simulates payment processing
   - For production, you need a backend server to:
     - Securely process payments
     - Store booking information
     - Send confirmation emails
   - **For now:** The demo flow works for collecting booking info, then redirects to confirmation page

---

## Domain Name Setup (Optional)

### Recommended Domain
- `ojocoachingacademy.com` (matches your branding)
- `ojotenniscoaching.com`
- `tenniswithtobi.com`

### Where to Buy
- **Namecheap** (recommended) - https://www.namecheap.com
- **Google Domains** - https://domains.google
- **GoDaddy** - https://www.godaddy.com

### Cost
- Usually $10-15 per year

### After Buying Domain
1. Go to your hosting provider's domain settings
2. Add your custom domain
3. Update DNS records (hosting provider will give instructions)
4. Wait 24-48 hours for DNS to propagate

---

## Post-Deployment Tasks

### 1. Test Everything
- [ ] Visit your live website
- [ ] Test on mobile device
- [ ] Test on desktop
- [ ] Check all links work
- [ ] Verify images load
- [ ] Test booking form (even if payment is demo)

### 2. Share Your Website
- [ ] Add link to your TeachMe.to profile
- [ ] Share on Instagram (@ojocoachingacademy)
- [ ] Add to email signature
- [ ] Share with current students

### 3. Monitor & Update
- Check website analytics (if available through hosting)
- Update content as needed
- Add new testimonials
- Update pricing if needed

---

## Advanced: Payment Processing Setup

For full payment processing (future enhancement):

### What You'll Need:
1. **Backend Server**
   - Node.js server (recommended for Stripe)
   - Or Python/Flask server
   - Hosted on: Heroku, Render, Railway, or Vercel Functions

2. **Database**
   - Store bookings (MongoDB, PostgreSQL, or Firebase)
   - Track lesson packages purchased

3. **Email Service**
   - Send confirmation emails (SendGrid, Mailgun, or AWS SES)
   - Notify you of new bookings

### Current Workaround:
The demo flow collects booking information and shows confirmation. You can manually process bookings by having customers contact you after booking.

---

## Troubleshooting

### Images Not Loading?
- Make sure all image files are in the same folder as HTML files
- Check file names match exactly (case-sensitive)

### Styles Not Working?
- Verify `styles.css` is in the same folder
- Check browser console for errors (F12)

### Payment Form Issues?
- Make sure Stripe key is correct
- Test with Stripe test mode first
- Check browser console for JavaScript errors

---

## Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Stripe Docs:** https://stripe.com/docs
- **GitHub Pages Docs:** https://docs.github.com/pages

---

## Quick Command Reference

If using Git and command line:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial website deployment"

# Push to GitHub (after creating repository)
git remote add origin https://github.com/yourusername/repository-name.git
git push -u origin main
```

Then deploy to Netlify/Vercel by connecting the GitHub repository.

