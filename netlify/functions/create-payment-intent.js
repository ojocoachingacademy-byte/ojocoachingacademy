exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Check for Stripe secret key
  if (!process.env.STRIPE_SECRET_KEY_LIVE) {
    console.error('STRIPE_SECRET_KEY_LIVE environment variable is not set');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Payment service is not configured. Please contact support.',
        details: 'STRIPE_SECRET_KEY_LIVE not set'
      })
    };
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_LIVE);

  try {
    // Validate request body exists
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { amount, customerInfo } = requestData;

    // Validate amount
    if (!amount || amount <= 0 || isNaN(amount)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }

    // Validate customerInfo exists
    if (!customerInfo || !customerInfo.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Customer information is required' })
      };
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        customerName: customerInfo.name || '',
        customerEmail: customerInfo.email || '',
        customerPhone: customerInfo.phone || '',
        packageType: customerInfo.package || '',
        referralCode: customerInfo.referralCode || ''
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Payment processing failed'
      })
    };
  }
};
