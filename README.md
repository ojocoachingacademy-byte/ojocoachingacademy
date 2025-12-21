# Tennis Coaching Website

A modern, professional website for a tennis coaching business with booking and payment functionality.

## Features

- **Landing Page**: Beautiful homepage with hero section, about, services, pricing, and contact information
- **Booking System**: Easy-to-use booking form with package selection
- **Payment Integration**: Stripe payment integration (requires setup)
- **Responsive Design**: Mobile-friendly design that works on all devices
- **Confirmation Page**: Guides customers to contact you to schedule their first lesson

## Setup Instructions

### 1. Update Contact Information

Edit `index.html` and `confirmation.html` to update:
- Phone number: `(123) 456-7890`
- Email: `coach@tennislessons.com`
- Location: `Your City, State`

### 2. Update Pricing

Edit the pricing in both `index.html` and `booking.html`:
- Single Lesson: $75
- 5-Lesson Package: $350
- 10-Lesson Package: $650

### 3. Set Up Stripe Payment (Required for Production)

The website is set up to use Stripe for payments. To enable payment processing:

1. **Create a Stripe Account**: Sign up at https://stripe.com
2. **Get Your API Keys**: Get your publishable and secret keys from the Stripe Dashboard
3. **Update the Stripe Key**: In `booking.js`, replace `'pk_test_your_publishable_key'` with your actual Stripe publishable key
4. **Set Up Backend Server**: You'll need a backend server to securely handle payment processing. The current implementation includes commented code showing where to integrate the actual Stripe API calls.

**Important**: The current payment flow is a demo. For production, you MUST:
- Set up a backend server (Node.js, Python, etc.)
- Create payment intents server-side
- Never expose your secret key in client-side code
- Handle webhooks for payment confirmations
- Store booking information in a database

### 4. Deploy the Website

You can deploy this website to:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to a repository and enable Pages
- **Any web hosting service**: Upload all files via FTP

## File Structure

```
├── index.html          # Main landing page
├── booking.html        # Booking and payment page
├── confirmation.html   # Post-payment confirmation page
├── styles.css          # All styling
├── booking.js          # Booking form and payment logic
├── script.js           # General JavaScript (mobile menu, smooth scroll)
└── README.md           # This file
```

## Customization

### Colors
The website uses CSS variables for easy customization. Edit `styles.css`:
```css
:root {
    --primary-color: #00a859;  /* Main green color */
    --secondary-color: #ff6b35; /* Accent color */
    /* ... other colors ... */
}
```

### Content
All text content is in the HTML files and can be easily edited:
- About section: `index.html` (lines ~60-80)
- Services: `index.html` (lines ~85-120)
- Pricing: `index.html` (lines ~125-180)

## Notes

- The payment form currently uses a demo flow. For production, integrate with a backend server.
- After payment, customers are directed to call/email to schedule their actual lesson time.
- All booking information is stored in sessionStorage for demo purposes. In production, store this in a database.

## Support

For questions or issues, please contact the website developer.

