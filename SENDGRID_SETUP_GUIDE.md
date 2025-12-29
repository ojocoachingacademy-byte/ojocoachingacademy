# SendGrid Setup Guide

## ✅ What's Already Done

- ✅ SendGrid function created: `netlify/functions/send-booking-confirmation.js`
- ✅ SendGrid package installed: `@sendgrid/mail` in `package.json`
- ✅ Function integrated with booking flow

## 🔧 Setup Steps

### Step 1: Verify Your Sender Email in SendGrid

**IMPORTANT:** SendGrid requires you to verify the email address you'll send FROM.

1. Go to **SendGrid Dashboard**: https://app.sendgrid.com/
2. Navigate to **Settings** → **Sender Authentication**
3. Click **"Verify a Single Sender"** (or use Domain Authentication if you have a custom domain)
4. Fill in the form:
   - **From Email:** `tobi@ojocoachingacademy.com`
   - **From Name:** `Ojo Coaching Academy`
   - **Reply To:** `tobi@ojocoachingacademy.com`
   - Fill in other required fields (address, city, etc.)
5. Click **"Create"**
6. **Check your email** (`tobi@ojocoachingacademy.com`) for a verification email from SendGrid
7. Click the verification link in the email
8. Wait for verification to complete (usually instant, but can take a few minutes)

**Note:** If you're using a custom domain email, you may want to set up Domain Authentication instead for better deliverability.

---

### Step 2: Get Your SendGrid API Key

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `Netlify Functions` (or any name you prefer)
4. Set permissions: **"Full Access"** (or at minimum: **"Mail Send"**)
5. Click **"Create & View"**
6. **⚠️ COPY THE API KEY IMMEDIATELY** - You won't be able to see it again!
   - It will look like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Save it somewhere secure (password manager, notes app, etc.)

---

### Step 3: Add Environment Variables to Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com/
2. Select your site: **ojocoachingacademy** (or your site name)
3. Navigate to **Site settings** → **Environment variables**
4. Click **"Add a variable"** and add these **3 variables**:

   **Variable 1: SENDGRID_API_KEY** (Required)
   - **Key:** `SENDGRID_API_KEY`
   - **Value:** `[Paste your SendGrid API key from Step 2]`
   - **Scopes:** Leave default (applies to all contexts)

   **Variable 2: SENDGRID_FROM_EMAIL** (Optional but recommended)
   - **Key:** `SENDGRID_FROM_EMAIL`
   - **Value:** `tobi@ojocoachingacademy.com`
   - **Scopes:** Leave default

   **Variable 3: COACH_EMAIL** (Optional but recommended)
   - **Key:** `COACH_EMAIL`
   - **Value:** `tobi@ojocoachingacademy.com`
   - **Scopes:** Leave default

5. Click **"Save"** after adding each variable

**Important:** After adding environment variables, you may need to **redeploy** your site for changes to take effect.

---

### Step 4: Redeploy Your Site (If Needed)

1. In Netlify dashboard, go to **Deploys**
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete (usually 1-2 minutes)

**Alternative:** If you have auto-deploy enabled, just push a small change to GitHub to trigger a new deployment.

---

### Step 5: Test the Setup

1. Go to your booking page: `https://ojocoachingacademy.com/booking.html`
2. Fill out a **test booking** using your own email address
3. Complete the payment (use Stripe test mode if available)
4. Check your email inbox
5. You should receive **2 emails**:
   - ✅ **Booking confirmation** (to the email you used in the form)
   - ✅ **Booking notification** (to `tobi@ojocoachingacademy.com`)

---

## 🔍 Troubleshooting

### Emails Not Sending?

1. **Check SendGrid Activity Log:**
   - Go to SendGrid dashboard → **Activity**
   - Look for recent email attempts
   - Check for error messages

2. **Verify Environment Variables:**
   - In Netlify: **Site settings** → **Environment variables**
   - Make sure all 3 variables are set correctly
   - Check for typos in the API key

3. **Verify Sender Email:**
   - In SendGrid: **Settings** → **Sender Authentication**
   - Make sure `tobi@ojocoachingacademy.com` shows as **"Verified"** (green checkmark)

4. **Check Function Logs:**
   - In Netlify: **Functions** → **send-booking-confirmation**
   - Click on recent invocations
   - Check for error messages

5. **Common Issues:**
   - ❌ **"Sender email not verified"** → Complete Step 1 (verify sender email)
   - ❌ **"API key invalid"** → Check that you copied the full API key correctly
   - ❌ **"Environment variable not found"** → Make sure variables are set in Netlify and site is redeployed

---

## 📧 What Emails Are Sent?

### 1. Customer Confirmation Email
- **To:** Customer's email (from booking form)
- **Subject:** "🎾 Your Tennis Lesson Booking is Confirmed!"
- **Contains:**
  - Booking reference number
  - Package details
  - Payment amount
  - Next steps
  - Contact information

### 2. Coach Notification Email
- **To:** `tobi@ojocoachingacademy.com` (or `COACH_EMAIL` variable)
- **Subject:** "🎾 New Booking: [Name] - [Package]"
- **Contains:**
  - Student information (name, email, phone)
  - Booking details (package, amount, experience level, goals)
  - Next steps reminder

---

## ✅ Success Checklist

- [ ] SendGrid account created
- [ ] Sender email verified in SendGrid (`tobi@ojocoachingacademy.com`)
- [ ] API key created in SendGrid
- [ ] `SENDGRID_API_KEY` added to Netlify environment variables
- [ ] `SENDGRID_FROM_EMAIL` added to Netlify environment variables
- [ ] `COACH_EMAIL` added to Netlify environment variables
- [ ] Site redeployed (if needed)
- [ ] Test booking completed
- [ ] Both emails received successfully

---

## 📊 SendGrid Free Tier Limits

- **100 emails per day** (3,000 per month)
- Perfect for starting out
- If you exceed limits, you'll need to upgrade to a paid plan

---

## 🔐 Security Notes

- **Never commit API keys to GitHub** - They're stored securely in Netlify environment variables
- **API keys are sensitive** - Don't share them publicly
- **Rotate keys periodically** - Create new keys if you suspect one is compromised

---

## Need Help?

If emails still aren't working after following all steps:
1. Check Netlify function logs for specific error messages
2. Check SendGrid Activity log for delivery issues
3. Verify all environment variables are set correctly
4. Make sure the sender email is verified in SendGrid

