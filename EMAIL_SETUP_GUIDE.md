# Step-by-Step Email Setup Guide for Ojo Coaching Academy

## Quick Start: Mailchimp Setup (Recommended)

### Step 1: Create Mailchimp Account
1. Go to **mailchimp.com**
2. Click "Sign Up Free"
3. Create account with your email: `tobi@ojocoachingacademy.com`
4. Verify your email address

### Step 2: Verify Your Domain (Optional but Recommended)
1. In Mailchimp dashboard, go to **Settings** → **Verified Domains**
2. Add `ojocoachingacademy.com`
3. Follow DNS setup instructions (helps emails avoid spam folder)

### Step 3: Create Email Templates

**Where to create templates:**
- Mailchimp Dashboard → **Templates** → **Create Template**
- Or use **Content Studio** → **Templates**

**Templates to create:**
1. **Booking Confirmation** - Use template from EMAIL_AUTOMATION_STRATEGY.md
2. **Lesson Reminder** - 24h before lesson
3. **Post-Lesson Follow-up** - After lesson
4. **Review Request** - 48h after first lesson
5. **Package Progress** - Mid-package update

**Each template should include:**
- Your logo/branding
- Personalization tags: `*|FNAME|*` for first name, `*|LNAME|*` for last name
- Professional signature with contact info
- Mobile-responsive design

### Step 4: Set Up Contact Lists

**Where:** Mailchimp Dashboard → **Audience** → **Manage Audience**

**Create these lists:**
- **All Students** - Everyone who has booked
- **Active Students** - Currently taking lessons
- **Past Students** - Completed packages
- **Prospects** - Interested but haven't booked

### Step 5: Manual Email Sending

**To send a manual email:**
1. Log into **mailchimp.com**
2. Click **Campaigns** → **Create Campaign** → **Email**
3. Choose **Regular** or **Template** campaign
4. Select your audience (list or segment)
5. Write your email or use a template
6. Add personalization (`*|FNAME|*`, etc.)
7. Preview and test
8. Click **Send** or **Schedule**

**Mobile app option:**
- Download Mailchimp mobile app
- Send emails from your phone
- Monitor campaign performance on the go

### Step 6: Set Up Automation (Optional but Recommended)

**For automated booking confirmations:**

**Option A: Using Zapier (Easiest)**
1. Create Zapier account (zapier.com) - free tier available
2. Create new Zap:
   - **Trigger:** Netlify Forms (New Form Submission)
   - **Action:** Mailchimp (Send Email or Add to Audience)
3. Connect your Netlify account
4. Connect your Mailchimp account
5. Map form fields to email personalization
6. Test and activate

**Option B: Manual Trigger**
- For now, you can manually send emails from Mailchimp dashboard
- Copy booking details from Netlify Forms submissions
- Send using your templates
- More time-consuming but works immediately

---

## Quick Start: Gmail Setup (Simple Manual Option)

If you prefer to start simple with just Gmail:

### Setup:
1. Use your existing Gmail account: `tobi@ojocoachingacademy.com`
2. Create email templates in Gmail:
   - Compose email
   - Write template with placeholders (e.g., [First Name], [Package Type])
   - Save as draft or use Gmail templates feature
3. **To send:**
   - Open Gmail (gmail.com)
   - Compose new email
   - Copy template, replace placeholders manually
   - Send

**Gmail Template Feature:**
- Settings → Advanced → Templates
- Create templates for each email type
- Use templates when composing

**Limitations:**
- No automation (must send manually)
- Limited personalization
- No tracking (can't see if opened/clicked)
- Daily sending limits

---

## Setting Up Automation with Zapier

### Connecting Netlify Forms to Mailchimp

**Prerequisites:**
- Mailchimp account created
- Zapier account created (free tier works)
- Your website deployed on Netlify

**Steps:**

1. **In Zapier:**
   - Create new Zap
   - Search for "Netlify" as trigger
   - Choose "New Form Submission"
   - Connect your Netlify account
   - Select "booking" form

2. **Set up Mailchimp Action:**
   - Add action → Search "Mailchimp"
   - Choose "Add/Update Subscriber" or "Send Email"
   - Connect Mailchimp account
   - Map form fields:
     - First Name → `*|FNAME|*`
     - Email → Email address
     - Package Type → Custom field
   - Select your Mailchimp audience/list

3. **Test:**
   - Test the Zap with a sample submission
   - Verify email is sent correctly
   - Turn on Zap to activate

**Cost:** Zapier free tier allows 5 Zaps and 100 tasks/month (perfect for starting out)

---

## Manual Email Workflow (No Automation)

If you want to send emails manually without automation:

### Daily Workflow:

1. **Morning Routine:**
   - Check Netlify Forms for new bookings (Netlify dashboard → Forms)
   - Check calendar for lessons today/tomorrow

2. **For New Bookings:**
   - Open Mailchimp (or Gmail)
   - Use "Booking Confirmation" template
   - Fill in details:
     - [First Name] → Customer's first name
     - [Package] → Package they purchased
     - [Booking Ref] → Reference number
   - Send email

3. **For Lesson Reminders:**
   - Check calendar for tomorrow's lessons
   - Open Mailchimp
   - Use "Lesson Reminder" template
   - Fill in customer name and lesson time
   - Send to each student

4. **After Lessons:**
   - Open Mailchimp
   - Use "Post-Lesson Follow-up" template
   - Customize with what you worked on
   - Send to student

**Time commitment:** 10-15 minutes per day for manual sending

---

## Where to Access Everything

### Mailchimp Dashboard
- **URL:** mailchimp.com
- **Login:** Your email (tobi@ojocoachingacademy.com)
- **What you can do:**
  - Send manual emails
  - View all campaigns
  - See open rates, click rates
  - Manage contact lists
  - Create automation workflows
  - Design email templates

### Netlify Forms (Booking Submissions)
- **URL:** app.netlify.com
- **Location:** Your site → Forms → Submissions
- **What you can do:**
  - See all booking form submissions
  - View customer details
  - Export data

### Zapier (If using automation)
- **URL:** zapier.com
- **Location:** Dashboard → My Zaps
- **What you can do:**
  - View automation workflows
  - See if Zaps are running
  - Test and troubleshoot

---

## Recommended Starting Setup

**Phase 1 (Start Now - Free):**
- ✅ Create Mailchimp account (free)
- ✅ Create email templates in Mailchimp
- ✅ Send booking confirmations manually from Mailchimp dashboard
- ✅ Send lesson reminders manually

**Phase 2 (After 1-2 weeks):**
- ✅ Set up Zapier free account
- ✅ Connect Netlify Forms → Mailchimp via Zapier
- ✅ Automate booking confirmation emails
- ✅ Still manually send post-lesson and review requests

**Phase 3 (When growing):**
- ✅ Upgrade to Mailchimp paid plan if needed
- ✅ Set up full automation sequences
- ✅ Add more sophisticated workflows

---

## Troubleshooting

**Email not sending?**
- Check Mailchimp account limits (free tier: 500 emails/month)
- Verify recipient email address is correct
- Check spam folder (verify your domain to avoid spam)

**Automation not working?**
- Check Zapier Zap is turned on (not paused)
- Verify Netlify Forms webhook is configured
- Test Zap manually in Zapier

**Can't find a feature?**
- Mailchimp has helpful help center: mailchimp.com/help
- Zapier has tutorials: zapier.com/learn

---

## Cost Summary

**Free Option (Starting Out):**
- Mailchimp: Free (up to 500 contacts, 1,000 emails/month)
- Zapier: Free (5 Zaps, 100 tasks/month)
- **Total: $0/month**

**Paid Option (Growing Business):**
- Mailchimp Essentials: $13/month (500+ contacts, unlimited emails)
- Zapier Starter: $20/month (more Zaps and tasks)
- **Total: ~$33/month**

This setup gives you professional email automation without breaking the bank!

