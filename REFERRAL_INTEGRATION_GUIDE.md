# Referral System Integration Guide

## Current State: Where Referral Data is Stored

### **Website (Current Implementation)**

**Referral Code Storage Location:**
- ✅ **Netlify Forms** - All booking submissions (including referral codes) are stored in Netlify's form submissions database
- ✅ **Stripe Payment Metadata** - Referral codes are included in Stripe payment metadata
- ✅ **SendGrid Email Notifications** - Referral codes are sent in booking confirmation emails

**Referral Code Flow:**
1. User generates code on `referral.html` (client-side: `FIRSTNAMELASTINITIAL2026` format)
2. Code is shared via URL: `booking.html?ref=CODE`
3. Booking form captures referral code in `referral-code` field
4. On payment success, referral code is submitted to:
   - Netlify Forms (field: `referral-code`)
   - Stripe payment metadata (field: `referralCode`)
   - SendGrid email function (included in booking data)

**Current Limitations:**
- ❌ No centralized database for referral tracking
- ❌ Referral codes are generated client-side (not validated/unique)
- ❌ No tracking of who referred whom
- ❌ No automatic reward distribution
- ❌ Data stored in separate systems (Netlify Forms, Stripe, emails)

---

## Integration Options: Connecting Website ↔ App (Supabase)

### **Option 1: Website → Supabase (Recommended)**

**Architecture:**
```
Website Booking → Netlify Function → Supabase
                      ↓
              Store referral data in Supabase
                      ↓
                 App reads from Supabase
```

**Benefits:**
- ✅ Single source of truth (Supabase)
- ✅ App can immediately access referral data
- ✅ Better tracking and analytics
- ✅ Can validate referral codes
- ✅ Can track referral relationships

**Implementation Steps:**

1. **Create Netlify Function to Sync to Supabase**
   - File: `netlify/functions/sync-booking-to-supabase.js`
   - Trigger: After booking payment succeeds
   - Action: Insert booking data (including referral code) into Supabase

2. **Supabase Schema:**
   ```sql
   -- Referrals table
   CREATE TABLE referrals (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     referral_code TEXT UNIQUE NOT NULL,
     referrer_name TEXT NOT NULL,
     referrer_email TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Bookings table (with referral tracking)
   CREATE TABLE bookings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     booking_reference TEXT UNIQUE NOT NULL,
     customer_name TEXT NOT NULL,
     customer_email TEXT NOT NULL,
     customer_phone TEXT,
     package_name TEXT NOT NULL,
     package_type TEXT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     referral_code TEXT REFERENCES referrals(referral_code),
     payment_intent_id TEXT UNIQUE,
     stripe_customer_id TEXT,
     experience_level TEXT,
     goals TEXT,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Referral redemptions (track who used which code)
   CREATE TABLE referral_redemptions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     referral_code TEXT REFERENCES referrals(referral_code),
     booking_id UUID REFERENCES bookings(id),
     redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     reward_status TEXT DEFAULT 'pending' -- pending, awarded, completed
   );
   ```

3. **Update Booking Flow:**
   - Modify `netlify/functions/create-payment-intent.js` to include referral code in metadata
   - Create `netlify/functions/sync-booking-to-supabase.js` to insert data after payment
   - Update `booking.js` to call sync function after payment success

---

### **Option 2: App → Supabase (Read Netlify Forms)**

**Architecture:**
```
Website Booking → Netlify Forms
                      ↓
            App reads via Netlify API
                      ↓
          Store in Supabase for app use
```

**Benefits:**
- ✅ Minimal changes to website
- ✅ App can sync existing data

**Limitations:**
- ❌ Requires Netlify API access
- ❌ Two-step process (Netlify → Supabase)
- ❌ Not real-time

---

### **Option 3: Dual Write (Both Systems)**

**Architecture:**
```
Website Booking → Netlify Forms + Supabase
                      ↓              ↓
              Keep existing     Store in Supabase
              Netlify storage   for app access
```

**Benefits:**
- ✅ Maintains existing Netlify Forms workflow
- ✅ App gets Supabase data
- ✅ Backup/redundancy

**Implementation:**
- Write to both Netlify Forms AND Supabase
- App reads from Supabase
- Website continues using Netlify Forms for now

---

## Recommended Implementation: Option 1 (Website → Supabase)

### **Step-by-Step Implementation**

#### **1. Set Up Supabase Tables**

Run this SQL in your Supabase SQL Editor:

```sql
-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_code TEXT UNIQUE NOT NULL,
  referrer_first_name TEXT NOT NULL,
  referrer_last_name TEXT NOT NULL,
  referrer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  package_name TEXT NOT NULL,
  package_type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  referral_code TEXT,
  payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  experience_level TEXT,
  goals TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referral_redemptions table
CREATE TABLE IF NOT EXISTS referral_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_code TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reward_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_referral_code ON bookings(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_code ON referral_redemptions(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_booking ON referral_redemptions(booking_id);

-- Enable Row Level Security (RLS)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your needs)
-- For now, allow authenticated users to read their own data
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = customer_email);

CREATE POLICY "Service role can manage bookings" ON bookings
  FOR ALL USING (auth.role() = 'service_role');
```

#### **2. Create Netlify Function to Sync to Supabase**

Create file: `netlify/functions/sync-booking-to-supabase.js`

```javascript
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Validate environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Supabase configuration missing' })
      };
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse request body
    const bookingData = JSON.parse(event.body);

    // Insert booking into Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          booking_reference: bookingData.bookingReference,
          customer_first_name: bookingData.firstName,
          customer_last_name: bookingData.lastName,
          customer_email: bookingData.email,
          customer_phone: bookingData.phone || null,
          package_name: bookingData.package,
          package_type: bookingData.packageType,
          price: parseFloat(bookingData.price),
          referral_code: bookingData.referralCode || null,
          payment_intent_id: bookingData.paymentIntentId || null,
          experience_level: bookingData.experience || null,
          goals: bookingData.goals || null
        }
      ])
      .select()
      .single();

    if (bookingError) {
      console.error('Error inserting booking:', bookingError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to sync booking', details: bookingError.message })
      };
    }

    // If referral code exists, create referral redemption record
    if (bookingData.referralCode) {
      const { error: redemptionError } = await supabase
        .from('referral_redemptions')
        .insert([
          {
            referral_code: bookingData.referralCode,
            booking_id: booking.id,
            reward_status: 'pending'
          }
        ]);

      if (redemptionError) {
        console.error('Error creating referral redemption:', redemptionError);
        // Don't fail the whole request, just log the error
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, bookingId: booking.id })
    };

  } catch (error) {
    console.error('Error syncing booking to Supabase:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};
```

#### **3. Update package.json**

Add Supabase dependency:

```json
{
  "dependencies": {
    "@sendgrid/mail": "^8.1.0",
    "stripe": "^14.0.0",
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

#### **4. Update booking.js**

Add call to sync function after payment success:

```javascript
// In processPayment function, after payment succeeds:
if (paymentIntent.status === 'succeeded') {
  // ... existing code ...
  
  // Sync to Supabase (non-blocking)
  fetch('/.netlify/functions/sync-booking-to-supabase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingReference: bookingRef,
      firstName: firstName,
      lastName: lastName,
      email: customerInfo.email,
      phone: customerInfo.phone || '',
      package: customerInfo.package,
      packageType: packageType,
      price: amount.toString(),
      referralCode: customerInfo.referralCode || '',
      paymentIntentId: paymentIntent.id,
      experience: formData.get('experience') || '',
      goals: formData.get('goals') || ''
    })
  })
  .then(response => {
    if (!response.ok) console.error('Supabase sync failed:', response.status);
    else console.log('Booking synced to Supabase');
    return response;
  })
  .catch(err => console.error('Supabase sync error:', err));
  
  // ... rest of existing code ...
}
```

#### **5. Set Environment Variables in Netlify**

Add to Netlify Dashboard → Site Settings → Environment Variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)

---

## App Integration: Reading Referral Data from Supabase

### **Query Referral Data in Your App**

```javascript
// Example: Get all bookings with referral codes
const { data: bookings, error } = await supabase
  .from('bookings')
  .select('*, referral_redemptions(*)')
  .not('referral_code', 'is', null);

// Example: Get referral statistics
const { data: referrals, error } = await supabase
  .from('referral_redemptions')
  .select('referral_code, count')
  .group('referral_code');

// Example: Get bookings for a specific referral code
const { data: redemptions, error } = await supabase
  .from('referral_redemptions')
  .select('*, bookings(*)')
  .eq('referral_code', 'SARAS2026');
```

---

## Migration: Existing Netlify Forms Data

If you want to migrate existing Netlify Forms data to Supabase:

1. Export Netlify Forms data (via Netlify API or manual export)
2. Create a migration script to insert into Supabase
3. Run migration for historical data

---

## Summary

**Current Storage:**
- ✅ Netlify Forms (booking submissions with referral codes)
- ✅ Stripe (payment metadata)
- ✅ SendGrid (email notifications)

**Recommended Integration:**
- ✅ Add Supabase sync via Netlify Function
- ✅ Store all booking + referral data in Supabase
- ✅ App reads from Supabase (single source of truth)
- ✅ Keep Netlify Forms as backup (optional)

**Next Steps:**
1. Create Supabase tables (SQL above)
2. Create sync function (`sync-booking-to-supabase.js`)
3. Update `booking.js` to call sync function
4. Add Supabase environment variables to Netlify
5. Test booking flow → verify data in Supabase
6. Update app to read from Supabase tables

---

## Questions?

- **Where is referral data currently stored?** → Netlify Forms (form submissions)
- **How to connect website to app?** → Sync booking data (including referrals) to Supabase
- **How does app access referral data?** → Query Supabase `bookings` and `referral_redemptions` tables
- **Should we migrate existing data?** → Optional, but recommended for complete tracking






