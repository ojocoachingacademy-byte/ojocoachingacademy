# Referral System Setup Checklist

## What Goes Where? 🤔

### **WEBSITE (This Repo - Tennis Coaching)** ✅
- ✅ Install Supabase package (`@supabase/supabase-js`) - **DONE**
- ✅ Create Netlify function (`netlify/functions/sync-booking-to-supabase.js`) - **DONE**
- ✅ Update `booking.js` to call sync function - **DONE**
- ⏳ Set environment variables in Netlify Dashboard (see below)

### **APP (ojocoachingacademyapp Repo)** 📱
- ✅ Supabase already set up
- ✅ Read from Supabase `bookings` and `referral_redemptions` tables
- ⏳ Create Supabase tables (run SQL from guide)
- ⏳ Query referral data from Supabase

---

## Setup Steps

### **Step 1: Create Supabase Tables (In App/ Supabase Dashboard)**

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

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_referral_code ON bookings(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_code ON referral_redemptions(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_booking ON referral_redemptions(booking_id);

-- Enable Row Level Security (RLS)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies (service role can manage all bookings)
CREATE POLICY "Service role can manage bookings" ON bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage referrals" ON referrals
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage redemptions" ON referral_redemptions
  FOR ALL USING (auth.role() = 'service_role');
```

**Where:** Run this in your Supabase Dashboard → SQL Editor (same Supabase project your app uses)

---

### **Step 2: Set Environment Variables in Netlify (Website Deployment)**

**Where:** Netlify Dashboard → Your Site → Site Settings → Environment Variables

**Add these two variables:**

1. **`SUPABASE_URL`**
   - Value: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Where to find: Supabase Dashboard → Settings → API → Project URL

2. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Value: Your Supabase service role key (starts with `eyJ...`)
   - Where to find: Supabase Dashboard → Settings → API → Service Role Key (⚠️ Keep secret!)
   - ⚠️ **Important:** Use Service Role Key (not anon key) - bypasses RLS

**After adding:**
- Go to Deploys tab
- Click "Trigger deploy" → "Deploy site" (to apply new environment variables)

---

### **Step 3: Test the Integration**

1. **Make a test booking** on the website
2. **Check Netlify Function logs:**
   - Netlify Dashboard → Functions → `sync-booking-to-supabase`
   - Should show successful sync

3. **Check Supabase:**
   - Supabase Dashboard → Table Editor → `bookings`
   - Should see new booking with referral code

4. **Check app:**
   - App should be able to query Supabase tables
   - Query example:
     ```javascript
     const { data: bookings } = await supabase
       .from('bookings')
       .select('*, referral_redemptions(*)')
       .not('referral_code', 'is', null);
     ```

---

## Summary: What's Done vs. What's Left

### ✅ **Website (This Repo) - COMPLETE**
- [x] Install `@supabase/supabase-js`
- [x] Create `netlify/functions/sync-booking-to-supabase.js`
- [x] Update `booking.js` to call sync function
- [ ] Set environment variables in Netlify (you need to do this)
- [ ] Test booking flow

### ⏳ **App (ojocoachingacademyapp Repo) - TODO**
- [ ] Create Supabase tables (run SQL above)
- [ ] Query referral data from Supabase
- [ ] Build referral tracking UI

---

## Quick Reference

**Website writes to Supabase:** ✅ Done (sync function created)
**App reads from Supabase:** ⏳ Pending (tables need to be created, then query)

**Environment Variables Location:**
- Website: Netlify Dashboard → Site Settings → Environment Variables
- App: Already configured (Vercel/Netlify environment variables)

**Supabase Tables:** Same Supabase project for both website and app (shared database)

