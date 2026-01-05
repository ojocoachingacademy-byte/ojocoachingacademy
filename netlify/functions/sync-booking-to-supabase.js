// Netlify Function to sync booking data (including referrals) to Supabase
// This function is called after a successful booking payment to store data in Supabase
// so the app can access referral and booking information

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    // Validate environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase configuration missing:', {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Supabase configuration missing',
          details: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in Netlify environment variables'
        })
      };
    }

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    let bookingData;
    try {
      bookingData = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    // Validate required fields
    if (!bookingData.bookingReference || !bookingData.email || !bookingData.package) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['bookingReference', 'email', 'package']
        })
      };
    }

    // Insert booking into Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          booking_reference: bookingData.bookingReference,
          customer_first_name: bookingData.firstName || '',
          customer_last_name: bookingData.lastName || '',
          customer_email: bookingData.email,
          customer_phone: bookingData.phone || null,
          package_name: bookingData.package,
          package_type: bookingData.packageType || 'Private',
          price: parseFloat(bookingData.price) || 0,
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
        body: JSON.stringify({ 
          error: 'Failed to sync booking to Supabase', 
          details: bookingError.message,
          code: bookingError.code
        })
      };
    }

    // If referral code exists, create referral redemption record
    if (bookingData.referralCode) {
      const { error: redemptionError } = await supabase
        .from('referral_redemptions')
        .insert([
          {
            referral_code: bookingData.referralCode.toUpperCase(),
            booking_id: booking.id,
            reward_status: 'pending'
          }
        ]);

      if (redemptionError) {
        console.error('Error creating referral redemption:', redemptionError);
        // Don't fail the whole request if referral redemption fails
        // Log error but still return success for the booking
      } else {
        console.log('Referral redemption created for code:', bookingData.referralCode);
      }
    }

    console.log('Booking synced to Supabase successfully:', booking.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        bookingId: booking.id,
        message: 'Booking synced to Supabase successfully'
      })
    };

  } catch (error) {
    console.error('Error syncing booking to Supabase:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      })
    };
  }
};

