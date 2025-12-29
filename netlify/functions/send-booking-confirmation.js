// Netlify Function to send booking confirmation email
// This runs automatically when a booking form is submitted

const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' })
        };
    }

    try {
        // Validate request body
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Request body is required' })
            };
        }

        let formData;
        try {
            formData = JSON.parse(event.body);
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid JSON in request body' })
            };
        }
        
        // Check for SendGrid API key
        if (!process.env.SENDGRID_API_KEY) {
            console.error('SENDGRID_API_KEY environment variable is not set');
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    message: 'Email service is not configured. Please contact support.',
                    error: 'SENDGRID_API_KEY not set'
                })
            };
        }
        
        // Set SendGrid API key from environment variable
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        // Extract booking information
        const firstName = formData.firstName || 'Student';
        const lastName = formData.lastName || '';
        const email = formData.email;
        const phone = formData.phone || '';
        const packageName = formData.package || 'Tennis Lesson';
        const packageType = formData.packageType || 'Private';
        const price = formData.price || '0.00';
        const bookingRef = formData.bookingReference || 'TEN-' + Date.now().toString().slice(-6);
        const experience = formData.experience || '';
        const goals = formData.goals || '';
        
        // Email to customer (booking confirmation)
        const customerEmail = {
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL || 'tobi@ojocoachingacademy.com',
                name: 'Ojo Coaching Academy'
            },
            subject: '🎾 Your Tennis Lesson Booking is Confirmed!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #00a859, #9333ea); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                        .detail-row:last-child { border-bottom: none; }
                        .detail-label { font-weight: 600; color: #2d3748; }
                        .detail-value { color: #718096; }
                        .total { font-size: 1.2em; font-weight: 700; color: #00a859; }
                        .button { display: inline-block; background: #00a859; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎾 Booking Confirmed!</h1>
                            <p>Thank you for choosing Ojo Coaching Academy</p>
                        </div>
                        <div class="content">
                            <p>Hi ${firstName},</p>
                            
                            <p>Your tennis lesson booking has been confirmed! We're excited to help you improve your game.</p>
                            
                            <div class="booking-details">
                                <h2 style="margin-top: 0; color: #2d3748;">Booking Details</h2>
                                <div class="detail-row">
                                    <span class="detail-label">Booking Reference:</span>
                                    <span class="detail-value">${bookingRef}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Package:</span>
                                    <span class="detail-value">${packageName}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Package Type:</span>
                                    <span class="detail-value">${packageType}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Total Paid:</span>
                                    <span class="detail-value">$${price}</span>
                                </div>
                                ${experience ? `<div class="detail-row">
                                    <span class="detail-label">Experience Level:</span>
                                    <span class="detail-value">${experience.charAt(0).toUpperCase() + experience.slice(1)}</span>
                                </div>` : ''}
                            </div>
                            
                            <h2 style="color: #2d3748;">Next Steps</h2>
                            <ol style="line-height: 2;">
                                <li><strong>Schedule Your First Lesson:</strong> Please contact me at (619) 981-5772 or reply to this email to schedule your first lesson time.</li>
                                <li><strong>What to Bring:</strong> Your own tennis racquet (I'll provide tennis balls)</li>
                                <li><strong>What to Wear:</strong> Comfortable athletic clothing and tennis shoes</li>
                                <li><strong>Location:</strong> Colina Del Sol Park, 5319 Orange Avenue, San Diego, CA 92115</li>
                            </ol>
                            
                            <h2 style="color: #2d3748;">What to Expect</h2>
                            <ul style="line-height: 2;">
                                <li>Assessment of your current skill level</li>
                                <li>Identification of strengths and areas for improvement</li>
                                <li>Personalized drills and exercises</li>
                                <li>Clear feedback on technique</li>
                            </ul>
                            
                            <p style="margin-top: 30px;">If you have any questions before your lesson, feel free to reply to this email or call me at <a href="tel:6199815772">(619) 981-5772</a>.</p>
                            
                            <p>Looking forward to helping you improve your game!</p>
                            
                            <p style="margin-top: 30px;">
                                <strong>Coach Tobi</strong><br>
                                Ojo Coaching Academy<br>
                                <a href="mailto:tobi@ojocoachingacademy.com">tobi@ojocoachingacademy.com</a><br>
                                <a href="tel:6199815772">(619) 981-5772</a>
                            </p>
                            
                            <div class="footer">
                                <p>📍 Colina Del Sol Park, 5319 Orange Avenue, San Diego, CA 92115</p>
                                <p>PTR Certified Tennis Coach | 17+ Years Playing | 14+ Years Teaching</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Hi ${firstName},

Your tennis lesson booking has been confirmed! We're excited to help you improve your game.

Booking Details:
- Booking Reference: ${bookingRef}
- Package: ${packageName}
- Package Type: ${packageType}
- Total Paid: $${price}
${experience ? `- Experience Level: ${experience.charAt(0).toUpperCase() + experience.slice(1)}` : ''}

Next Steps:
1. Schedule Your First Lesson: Please contact me at (619) 981-5772 or reply to this email to schedule your first lesson time.
2. What to Bring: Your own tennis racquet (I'll provide tennis balls)
3. What to Wear: Comfortable athletic clothing and tennis shoes
4. Location: Colina Del Sol Park, 5319 Orange Avenue, San Diego, CA 92115

What to Expect:
- Assessment of your current skill level
- Identification of strengths and areas for improvement
- Personalized drills and exercises
- Clear feedback on technique

If you have any questions before your lesson, feel free to reply to this email or call me at (619) 981-5772.

Looking forward to helping you improve your game!

Coach Tobi
Ojo Coaching Academy
tobi@ojocoachingacademy.com
(619) 981-5772

Location: Colina Del Sol Park, 5319 Orange Avenue, San Diego, CA 92115
PTR Certified Tennis Coach | 17+ Years Playing | 14+ Years Teaching
            `
        };

        // Email to you (notification)
        const coachEmail = {
            to: process.env.COACH_EMAIL || 'tobi@ojocoachingacademy.com',
            from: {
                email: process.env.SENDGRID_FROM_EMAIL || 'tobi@ojocoachingacademy.com',
                name: 'Ojo Coaching Academy Booking System'
            },
            subject: `🎾 New Booking: ${firstName} ${lastName} - ${packageName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #00a859; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
                        .info-row { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
                        .info-row:last-child { border-bottom: none; }
                        .label { font-weight: 600; color: #2d3748; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎾 New Booking Received!</h1>
                        </div>
                        <div class="content">
                            <div class="info-box">
                                <h2 style="margin-top: 0;">Student Information</h2>
                                <div class="info-row">
                                    <span class="label">Name:</span> ${firstName} ${lastName}
                                </div>
                                <div class="info-row">
                                    <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
                                </div>
                                <div class="info-row">
                                    <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <h2 style="margin-top: 0;">Booking Details</h2>
                                <div class="info-row">
                                    <span class="label">Booking Reference:</span> ${bookingRef}
                                </div>
                                <div class="info-row">
                                    <span class="label">Package:</span> ${packageName}
                                </div>
                                <div class="info-row">
                                    <span class="label">Package Type:</span> ${packageType}
                                </div>
                                <div class="info-row">
                                    <span class="label">Amount Paid:</span> $${price}
                                </div>
                                <div class="info-row">
                                    <span class="label">Experience Level:</span> ${experience || 'Not specified'}
                                </div>
                                ${goals ? `<div class="info-row">
                                    <span class="label">Goals:</span> ${goals}
                                </div>` : ''}
                            </div>
                            
                            <p><strong>Next Step:</strong> Contact ${firstName} at ${email} or ${phone} to schedule their first lesson.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send both emails
        await sgMail.send(customerEmail);
        await sgMail.send(coachEmail);

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Booking confirmation emails sent successfully',
                bookingReference: bookingRef
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Error sending email',
                error: error.message 
            })
        };
    }
};

