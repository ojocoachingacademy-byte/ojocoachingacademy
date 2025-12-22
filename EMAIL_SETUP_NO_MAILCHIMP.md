# Automated Email Setup Without Mailchimp

This guide shows you how to set up **automated booking confirmation emails** without needing Mailchimp or any email marketing platform. We'll use **Netlify Functions** + **SendGrid** (free tier).

## What Emails Can Be Automated This Way

✅ **Automated Emails (No Manual Work):**
1. **Booking Confirmation** - Sent to customer immediately when they complete booking
2. **Booking Notification** - Sent to you (coach) when new booking comes in

❌ **Cannot Be Automated (Requires Manual Sending for Now):**
- Pre-lesson reminders (24h before lesson)
- Post-lesson follow-ups
- Review requests
- Package progress updates

*These require Mailchimp or similar, OR you can send them manually from your email.*

---

## Setup Instructions

### Step 1: Create SendGrid Account (Free)

1. Go to **sendgrid.com**
2. Click "Start for Free"
3. Sign up with your email: `tobi@ojocoachingacademy.com`
4. Verify your email address
5. Complete account setup

**Free Tier Details:**
- ✅ 100 emails per day (3,000/month)
- ✅ Perfect for starting out
- ✅ Free forever

### Step 2: Get SendGrid API Key

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click "Create API Key"
3. Name it: "Netlify Functions"
4. Set permissions: **Full Access** (or at least "Mail Send")
5. Click "Create & View"
6. **COPY THE API KEY** - You'll need it in Step 4

### Step 3: Verify Your Email Address

1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click "Verify a Single Sender"
3. Fill in your details:
   - From Email: `tobi@ojocoachingacademy.com`
   - From Name: `Ojo Coaching Academy`
   - Reply To: `tobi@ojocoachingacademy.com`
4. Click "Create"
5. **Check your email** and verify the sender (this may take a few minutes)

### Step 4: Set Up Netlify Environment Variables

1. Go to your Netlify dashboard: **app.netlify.com**
2. Select your site (ojocoachingacademy)
3. Go to **Site settings** → **Environment variables**
4. Add these environment variables:

   **Variable 1:**
   - Key: `SENDGRID_API_KEY`
   - Value: `[Paste your SendGrid API key from Step 2]`

   **Variable 2:**
   - Key: `SENDGRID_FROM_EMAIL`
   - Value: `tobi@ojocoachingacademy.com`

   **Variable 3:**
   - Key: `COACH_EMAIL`
   - Value: `tobi@ojocoachingacademy.com`

5. Click "Save"

### Step 5: Update Booking Form to Trigger Email Function

The booking form needs to call the Netlify Function after form submission. I'll update the booking.js file to do this.

### Step 6: Deploy to Netlify

1. The function file is already created: `netlify/functions/send-booking-confirmation.js`
2. The `package.json` file is created with the SendGrid dependency
3. Push to GitHub (or deploy directly to Netlify)
4. Netlify will automatically install dependencies and deploy the function

---

## How It Works

1. **Customer completes booking** on your website
2. **Form submits** to Netlify Forms (already set up)
3. **Netlify Function automatically triggers** via webhook
4. **Two emails sent:**
   - ✅ Booking confirmation to customer
   - ✅ Notification to you

**No manual work required!** Emails are sent automatically.

---

## Testing

After deployment:

1. Go to your booking page
2. Fill out a test booking (use your own email)
3. Complete the form
4. Check your email inbox
5. You should receive:
   - Customer confirmation email
   - Your notification email

---

## What the Customer Email Contains

- Professional HTML email design
- Booking reference number
- Package details
- Total paid
- Next steps (contact you to schedule)
- What to bring
- Location information
- Your contact information

---

## Troubleshooting

**Emails not sending?**
1. Check SendGrid dashboard → **Activity** to see if emails were attempted
2. Verify environment variables are set correctly in Netlify
3. Check SendGrid API key has correct permissions
4. Ensure email address is verified in SendGrid

**Function errors?**
1. Check Netlify Functions logs: **Functions** → **send-booking-confirmation**
2. Verify `@sendgrid/mail` package is installed (check `package.json`)
3. Make sure function file is in correct location: `netlify/functions/`

**Email in spam folder?**
1. Verify your sender email in SendGrid (Step 3)
2. Consider setting up domain authentication (advanced)

---

## Costs

**Current Setup (Free):**
- SendGrid: Free (100 emails/day)
- Netlify Functions: Free (125,000 invocations/month)
- **Total: $0/month**

**If you exceed limits:**
- SendGrid paid: $19.95/month (up to 50,000 emails/month)
- Netlify Functions: Still free at your usage level

---

## Future Upgrades

When you're ready to add more automated emails (reminders, follow-ups), you can:
1. Keep SendGrid for transactional emails (booking confirmations)
2. Add Mailchimp for marketing/relationship emails (follow-ups, newsletters)

**Both can work together!**

---

## Manual Email Sending (For Now)

For emails that can't be automated yet (lesson reminders, follow-ups), you can:
1. **Use Gmail** - Simple and free
2. **Create templates** - Save email templates in Gmail or as text files
3. **Send manually** - Copy template, personalize, send

This works fine until you have more customers and want full automation!

