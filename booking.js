// Wait for DOM to be ready before initializing Stripe
let cardElement; // Make cardElement accessible globally
let stripe; // Make stripe accessible globally

// Auto-fill referral code from URL parameter
document.addEventListener('DOMContentLoaded', function() {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
        const referralInput = document.getElementById('referral-code');
        if (referralInput) {
            referralInput.value = refCode.toUpperCase();
            // Add visual feedback (green background/border)
            referralInput.style.backgroundColor = '#e6f7e6';
            referralInput.style.borderColor = 'var(--primary-color)';
            referralInput.style.borderWidth = '2px';
            
            // Remove visual feedback after 3 seconds
            setTimeout(() => {
                referralInput.style.backgroundColor = '';
                referralInput.style.borderColor = '';
                referralInput.style.borderWidth = '';
            }, 3000);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe with TEST key (test mode)
    stripe = Stripe('pk_test_51SgcB8QjxWCW85VVblilPyi9VHforilJdHO8DChqJ7DfYBeHVuJYNXGqaOPMHLcVC22XHeXMQ9JNHF1lnE5AgtdC0085IsPRy6');
    const elements = stripe.elements({
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#00a859',
                colorBackground: '#ffffff',
                colorText: '#1a1a1a',
                colorDanger: '#df1b41',
                fontFamily: 'Poppins, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px'
            }
        }
    });

    // Create card element
    cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#2d3748',
                fontFamily: '"Poppins", sans-serif',
                '::placeholder': {
                    color: '#a0aec0',
                },
            },
            invalid: {
                color: '#dc3545',
            },
        },
    });

    // Mount the card element to the payment-element container
    const paymentElementContainer = document.getElementById('payment-element');
    if (paymentElementContainer) {
        cardElement.mount('#payment-element');
        
        // Handle real-time validation errors from the card Element
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('payment-errors');
            if (displayError) {
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            }
        });
    } else {
        console.error('Payment element container not found. Make sure the form is loaded.');
    }
});

// Handle package type switching
const packageTypeInputs = document.querySelectorAll('input[name="packageType"]');
const privatePackages = document.getElementById('private-packages');
const semiprivatePackages = document.getElementById('semiprivate-packages');
const giftPackages = document.getElementById('gift-packages');
const packageTypeTitle = document.getElementById('package-type-title');
const summaryPackage = document.getElementById('summary-package');
const summaryTotal = document.getElementById('summary-total');

packageTypeInputs.forEach(input => {
    input.addEventListener('change', function() {
        const packageType = this.value;
        
        // Hide all package groups
        privatePackages.style.display = 'none';
        semiprivatePackages.style.display = 'none';
        giftPackages.style.display = 'none';
        
        // Show selected package group and update title
        if (packageType === 'private') {
            privatePackages.style.display = 'grid';
            packageTypeTitle.textContent = 'Private Lesson Packages';
            // Select first package in private
            const firstPrivate = privatePackages.querySelector('input[value="5pack"]');
            if (firstPrivate) firstPrivate.checked = true;
            updateSummary();
        } else if (packageType === 'semiprivate') {
            semiprivatePackages.style.display = 'grid';
            packageTypeTitle.textContent = 'Semi-Private Lesson Packages';
            // Select first package in semiprivate
            const firstSemi = semiprivatePackages.querySelector('input[value="semi-5pack"]');
            if (firstSemi) firstSemi.checked = true;
            updateSummary();
        } else if (packageType === 'gift') {
            giftPackages.style.display = 'grid';
            packageTypeTitle.textContent = 'Gift Packages';
            // Select first package in gift
            const firstGift = giftPackages.querySelector('input[value="gift-1"]');
            if (firstGift) firstGift.checked = true;
            updateSummary();
        }
    });
});

// Update price summary when package changes
const packageInputs = document.querySelectorAll('input[name="package"]');

function updateSummary() {
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    if (selectedPackage) {
        const price = selectedPackage.dataset.price;
        const name = selectedPackage.dataset.name;
        summaryPackage.textContent = name;
        summaryTotal.textContent = `$${parseFloat(price).toFixed(2)}`;
    }
}

packageInputs.forEach(input => {
    input.addEventListener('change', updateSummary);
});

// Initialize summary on page load
updateSummary();

// Process payment function
async function processPayment(amount, customerInfo, cardElement) {
  const submitButton = document.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Complete Booking & Pay';
  
  try {
    // Show loading state
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
    }
    
    // Hide any previous error messages
    const existingError = document.getElementById('payment-error');
    if (existingError) {
      existingError.style.display = 'none';
    }

    // Step 1: Create payment intent via Netlify Function
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        customerInfo: customerInfo
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment failed');
    }

    const { clientSecret, paymentIntentId } = await response.json();

    // Step 2: Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || ''
        }
      }
    });

    if (error) {
      // Payment failed
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      // Payment successful - store booking data for confirmation page
      sessionStorage.setItem('bookingPrice', amount.toString());
      sessionStorage.setItem('bookingPackage', customerInfo.package);
      sessionStorage.setItem('bookingPackageType', 'Private'); // Default, can be enhanced
      
      // Generate booking reference
      const bookingRef = 'TEN-' + Date.now().toString().slice(-6);
      sessionStorage.setItem('bookingReference', bookingRef);
      
      // Get form data for submission (need to access form from here)
      const form = document.getElementById('booking-form');
      const formData = new FormData(form);
      const packageType = document.querySelector('input[name="packageType"]:checked')?.value || 'Private';
      
      // Parse name (handle cases where name might be split or combined)
      const nameParts = customerInfo.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Submit to Netlify Forms (non-blocking - don't wait)
      const netlifyFormData = new FormData();
      netlifyFormData.append('form-name', 'booking');
      netlifyFormData.append('firstName', firstName);
      netlifyFormData.append('lastName', lastName);
      netlifyFormData.append('email', customerInfo.email);
      netlifyFormData.append('phone', customerInfo.phone || '');
      netlifyFormData.append('package', customerInfo.package);
      netlifyFormData.append('packageType', packageType);
      netlifyFormData.append('price', amount.toString());
      netlifyFormData.append('experience', formData.get('experience') || '');
      netlifyFormData.append('goals', formData.get('goals') || '');
      netlifyFormData.append('referral-code', customerInfo.referralCode || '');
      netlifyFormData.append('bookingReference', bookingRef);
      netlifyFormData.append('timestamp', new Date().toISOString());
      
      // Submit to Netlify Forms (fire and forget)
      fetch('/', {
          method: 'POST',
          body: netlifyFormData
      }).catch(err => console.log('Form submission error:', err));
      
      // Send booking confirmation email via Netlify Function (fire and forget)
      fetch('/.netlify/functions/send-booking-confirmation', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: customerInfo.email,
              phone: customerInfo.phone || '',
              package: customerInfo.package,
              packageType: packageType,
              price: amount.toString(),
              bookingReference: bookingRef,
              experience: formData.get('experience') || '',
              goals: formData.get('goals') || '',
              referralCode: customerInfo.referralCode || ''
          })
      }).catch(err => console.log('Email sending error:', err));
      
      // Redirect to confirmation page (use relative path)
      window.location.href = `confirmation.html?payment_intent=${paymentIntent.id}&amount=${amount}&package=${encodeURIComponent(customerInfo.package)}&ref=${bookingRef}`;
    } else {
      throw new Error('Payment was not completed');
    }

  } catch (error) {
    // Show error to user
    console.error('Payment error:', error);
    
    // Re-enable button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
    
    // Display error message
    const errorDiv = document.getElementById('payment-error') || createErrorDiv();
    errorDiv.textContent = error.message || 'Payment failed. Please try again.';
    errorDiv.style.display = 'block';
    
    // Re-throw to allow caller to handle if needed
    throw error;
  }
}

function createErrorDiv() {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'payment-error';
  errorDiv.style.color = '#dc3545';
  errorDiv.style.padding = '1rem';
  errorDiv.style.marginTop = '1rem';
  errorDiv.style.borderRadius = '8px';
  errorDiv.style.backgroundColor = '#ffe8e8';
  errorDiv.style.border = '1px solid #dc3545';
  const form = document.querySelector('form');
  form.appendChild(errorDiv);
  return errorDiv;
}

// Handle form submission
const form = document.getElementById('booking-form');
const submitButton = document.getElementById('submit-button');

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    
    if (!selectedPackage) {
        alert('Please select a package');
        return;
    }
    
    // Validate card element is mounted
    if (!cardElement) {
        alert('Payment form is not ready. Please refresh the page and try again.');
        return;
    }
    
    const packagePrice = parseFloat(selectedPackage.dataset.price);
    const packageName = selectedPackage.dataset.name;
    
    // Prepare customer info for payment
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const customerName = `${firstName} ${lastName}`;
    const customerEmail = formData.get('email');
    const customerPhone = formData.get('phone');
    const referralCode = document.getElementById('referral-code')?.value || '';
    
    const customerInfo = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        package: packageName,
        referralCode: referralCode
    };
    
    try {
        // Process payment via Netlify Function
        // processPayment handles button state, form submission, email, and redirect
        await processPayment(packagePrice, customerInfo, cardElement);
        
        // If payment succeeds, processPayment will redirect to confirmation page
        // This code will not execute on success due to redirect
        
    } catch (error) {
        // Error is already handled in processPayment function
        // This catch is here for any unexpected errors
        console.error('Booking submission error:', error);
    }
});

