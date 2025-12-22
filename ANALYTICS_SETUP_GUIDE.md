# Analytics & Tracking Setup Guide

## Google Analytics 4 Setup

You've already linked Google Analytics (G-517242116) with Google Ads (534-669-9033). Here's what's been implemented and what you need to do:

### Current Implementation
- Google Analytics tracking code added to `index.html`
- Conversion tracking events added:
  - `begin_checkout` - When user starts booking process
  - `purchase` - When booking is completed
- Enhanced ecommerce tracking for Google Ads

### Next Steps

1. **Update Google Analytics Measurement ID:**
   - Open `index.html`
   - Find: `gtag('config', 'G-XXXXXXXXXX')`
   - Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID: `G-517242116` (or find it in GA4 Admin → Data Streams)

2. **Add Google Ads Conversion Tracking:**
   - Get your Google Ads conversion ID from Google Ads dashboard
   - Replace `AW-XXXXXXXXXX` in the code with your actual conversion ID
   - Set up conversion actions in Google Ads for:
     - Booking completed
     - Review submitted
     - Phone call (if tracking calls)

3. **Set Up Conversion Events in Google Analytics:**
   - Go to GA4 → Admin → Events
   - Mark these as conversions:
     - `begin_checkout`
     - `purchase`
     - `generate_lead` (for form submissions)

### What's Being Tracked

**Page Views:**
- Homepage
- Booking page
- Blog pages
- Review page
- Confirmation page

**Events:**
- `begin_checkout` - User starts booking process
- `purchase` - Booking completed with payment
- `view_item` - Review request shown
- `generate_lead` - Form submissions (reviews, contact)

**Ecommerce Tracking:**
- Package type (Private, Semi-Private, Gift)
- Package name
- Package price
- Booking reference number

### Review Request Automation

The confirmation page now shows a review request after 5 seconds. This helps:
- Collect more reviews
- Build social proof
- Improve SEO with fresh reviews

To automate review requests:
1. Use email automation (see EMAIL_AUTOMATION_STRATEGY.md)
2. Send review request 24-48 hours after first lesson
3. Track review request clicks in Google Analytics

### Testing Your Setup

1. **Test in Google Analytics Real-Time:**
   - Go to GA4 → Reports → Real-time
   - Complete a test booking
   - Verify events appear in real-time

2. **Test Google Ads Conversions:**
   - Use Google Ads conversion tracking tester
   - Or wait 24-48 hours and check conversions in Google Ads

3. **Verify Events:**
   - Use Google Tag Assistant Chrome extension
   - Check browser console for any errors

### Advanced Tracking (Optional)

**Scroll Depth Tracking:**
- Track how far users scroll on pages
- Identify where users drop off

**Form Abandonment:**
- Track when users start but don't complete booking form
- Retarget users who abandoned

**Click Tracking:**
- Track clicks on "Book Now" buttons
- Track clicks on phone number (if added back)
- Track clicks on email links

**Video Engagement:**
- Track video plays, watch time
- Track if users watch full video

### Privacy & Compliance

- Ensure GDPR compliance if serving EU users
- Add cookie consent banner (if needed)
- Respect user privacy preferences
- Disclose analytics usage in privacy policy

---

**Your Analytics Property:** G-517242116
**Your Google Ads Account:** 534-669-9033

Remember to update the placeholder IDs in `index.html` with your actual IDs!

