// Initialize Stripe
const stripe = Stripe('pk_live_51SgcB8QjxWCW85VVPpXWHwiObtV0uCADnDPfEGP6hK6brSwXDDb37cAlTmKP0B4tqkJDW84mjgMv8eMFszIbnHF300zd6T7NCK');
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
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

cardElement.mount('#card-element');

// Handle real-time validation errors from the card Element
cardElement.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
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

// Handle form submission
const form = document.getElementById('booking-form');
const submitButton = document.getElementById('submit-button');

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Disable submit button to prevent double submission
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    // Get form data
    const formData = new FormData(form);
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    
    if (!selectedPackage) {
        alert('Please select a package');
        submitButton.disabled = false;
        submitButton.textContent = 'Complete Booking & Pay';
        return;
    }
    
    const packagePrice = selectedPackage.dataset.price;
    const packageName = selectedPackage.dataset.name;
    
    // In a real implementation, you would:
    // 1. Create a payment intent on your server
    // 2. Confirm the payment with Stripe
    // 3. Process the booking on your server
    // 4. Redirect to confirmation page
    
    // For demonstration purposes, we'll simulate the payment process
    // In production, you need to set up a backend server to handle Stripe payments securely
    
    try {
        // Simulate API call (replace with actual Stripe payment intent creation)
        // const { clientSecret } = await fetch('/api/create-payment-intent', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         amount: parseFloat(packagePrice) * 100, // Convert to cents
        //         currency: 'usd',
        //         metadata: {
        //             firstName: formData.get('firstName'),
        //             lastName: formData.get('lastName'),
        //             email: formData.get('email'),
        //             phone: formData.get('phone'),
        //             package: packageName,
        //         }
        //     })
        // }).then(r => r.json());
        
        // const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        //     payment_method: {
        //         card: cardElement,
        //         billing_details: {
        //             name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        //             email: formData.get('email'),
        //             phone: formData.get('phone'),
        //         },
        //     },
        // });
        
        // For demo purposes, simulate successful payment
        // In production, remove this and use the actual Stripe code above
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate booking reference
        const bookingRef = 'TEN-' + Date.now().toString().slice(-6);
        
        // Prepare booking info
        const bookingInfo = {
            reference: bookingRef,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            package: packageName,
            price: packagePrice,
            experience: formData.get('experience'),
            goals: formData.get('goals'),
            timestamp: new Date().toISOString(),
        };
        
        // Submit to Netlify Forms
        const netlifyFormData = new FormData();
        netlifyFormData.append('form-name', 'booking');
        netlifyFormData.append('firstName', bookingInfo.firstName);
        netlifyFormData.append('lastName', bookingInfo.lastName);
        netlifyFormData.append('email', bookingInfo.email);
        netlifyFormData.append('phone', bookingInfo.phone);
        netlifyFormData.append('package', bookingInfo.package);
        netlifyFormData.append('price', bookingInfo.price);
        netlifyFormData.append('experience', bookingInfo.experience);
        netlifyFormData.append('goals', bookingInfo.goals || '');
        netlifyFormData.append('bookingReference', bookingRef);
        netlifyFormData.append('timestamp', bookingInfo.timestamp);
        
        // Submit to Netlify (non-blocking - don't wait for response)
        fetch('/', {
            method: 'POST',
            body: netlifyFormData
        }).catch(err => console.log('Form submission error:', err));
        
        // Store booking info in sessionStorage
        sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
        
        // Redirect to confirmation page
        window.location.href = `confirmation.html?ref=${bookingRef}`;
        
    } catch (error) {
        // Handle errors
        const displayError = document.getElementById('card-errors');
        displayError.textContent = error.message || 'An error occurred. Please try again.';
        submitButton.disabled = false;
        submitButton.textContent = 'Complete Booking & Pay';
    }
});

