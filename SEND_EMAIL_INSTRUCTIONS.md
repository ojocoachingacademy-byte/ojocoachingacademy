# How to Send Confirmation Email Manually

## Issue: 500 Internal Server Error

The 500 error usually means the Netlify Function is missing required environment variables.

## Fix the 500 Error First

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Environment Variables
2. **Check for these variables:**
   - `SENDGRID_API_KEY` - Your SendGrid API key (starts with `SG.`)
   - `SENDGRID_FROM_EMAIL` - Email address verified in SendGrid (e.g., `tobi@ojocoachingacademy.com`)
   - `COACH_EMAIL` - Your email for notifications (optional, defaults to `tobi@ojocoachingacademy.com`)

3. **If missing, add them:**
   - Get SendGrid API key from: https://app.sendgrid.com/settings/api_keys
   - Make sure the FROM email is verified in SendGrid

4. **Redeploy your site** after adding environment variables

## Alternative: Send Email Directly via SendGrid (If Function Still Fails)

If the function still doesn't work, you can send the email directly using SendGrid's API:

### Option 1: Use SendGrid Web Interface
1. Go to https://app.sendgrid.com/
2. Click "Email API" → "Dynamic Templates" or "Single Send"
3. Create and send the email manually

### Option 2: Use cURL Command (if you have SendGrid API key)

Replace `YOUR_SENDGRID_API_KEY` with your actual key:

```bash
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header 'Authorization: Bearer YOUR_SENDGRID_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [{
      "to": [{"email": "jeanmarielevy@gmail.com", "name": "Jean Marie Levy"}]
    }],
    "from": {"email": "tobi@ojocoachingacademy.com", "name": "Ojo Coaching Academy"},
    "subject": "🎾 Your Tennis Lesson Booking is Confirmed!",
    "content": [{
      "type": "text/html",
      "value": "<html><body><h1>Booking Confirmed!</h1><p>Hi Jean Marie,</p><p>Your tennis lesson booking has been confirmed!</p><p><strong>Booking Details:</strong><br>Package: Single Lesson (1-hour private lesson)<br>Total Paid: $100.00</p><p>Please contact Coach Tobi at (619) 981-5772 or tobi@ojocoachingacademy.com to schedule your first lesson.</p><p>Coach Tobi<br>Ojo Coaching Academy</p></body></html>"
    }]
  }'
```

## Customer Details for Jean Marie Levy:
- **Name:** Jean Marie Levy
- **Email:** jeanmarielevy@gmail.com
- **Phone:** 8184241060
- **Package:** Single Lesson (1-hour private lesson)
- **Price:** $100.00
- **Package Type:** Private

