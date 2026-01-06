// Initialize Supabase Client
// NOTE: Replace these with your actual Supabase credentials
// The anon key is safe to expose publicly if Row Level Security (RLS) is properly configured
let supabase = null;

function initSupabase() {
    // Get Supabase credentials from environment or config
    // For now, we'll try to get them from a config object or use Netlify Function as fallback
    const supabaseUrl = window.SUPABASE_URL || null;
    const supabaseAnonKey = window.SUPABASE_ANON_KEY || null;
    
    if (supabaseUrl && supabaseAnonKey && window.supabase) {
        try {
            supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
            console.log('Supabase client initialized');
        } catch (error) {
            console.warn('Failed to initialize Supabase client:', error);
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}

// Align review button's right edge with Book Now button's right edge on desktop
function alignReviewButton() {
    if (window.innerWidth >= 1400) {
        const bookNowBtn = document.querySelector('.floating-cta');
        const reviewBtn = document.querySelector('.mobile-review-toggle');
        
        if (bookNowBtn && reviewBtn) {
            // Get Book Now button's right edge position
            const bookNowRect = bookNowBtn.getBoundingClientRect();
            const bookNowRightEdge = bookNowRect.right;
            
            // Calculate right position from viewport edge
            const rightPosition = window.innerWidth - bookNowRightEdge;
            
            // Set review button's right edge to match Book Now's right edge using !important
            reviewBtn.style.setProperty('right', rightPosition + 'px', 'important');
            reviewBtn.style.setProperty('left', 'auto', 'important');
            reviewBtn.style.setProperty('transform', 'none', 'important');
            reviewBtn.style.setProperty('bottom', '100px', 'important');
        }
    } else {
        // Reset on mobile
        const reviewBtn = document.querySelector('.mobile-review-toggle');
        if (reviewBtn) {
            reviewBtn.style.removeProperty('right');
            reviewBtn.style.removeProperty('left');
        }
    }
}

// Run when DOM is ready and after a short delay to ensure buttons are positioned
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(alignReviewButton, 100);
});

// Run on load and resize
window.addEventListener('load', function() {
    setTimeout(alignReviewButton, 100);
});
window.addEventListener('resize', function() {
    setTimeout(alignReviewButton, 50);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a regular link (not dropdown toggles)
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // If clicking a regular nav link (not dropdown toggle or dropdown item)
    if (target.tagName === 'A' && target.closest('.nav-menu')) {
        const isDropdownToggle = target.closest('.nav-dropdown > a') && !target.closest('.dropdown-menu');
        const isDropdownItem = target.closest('.dropdown-menu');
        
        // Close menu if it's a regular link or a dropdown menu item
        if (!isDropdownToggle || isDropdownItem) {
            navMenu.classList.remove('active');
            // Close all dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }
});

// Dropdown Menu Functionality
(function() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    function isMobileView() {
        return window.innerWidth <= 768;
    }

    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        if (!dropdownToggle || !dropdownMenu) return;

        // Desktop: hover behavior (handled by CSS)
        dropdown.addEventListener('mouseenter', function() {
            if (!isMobileView()) {
                dropdown.classList.add('active');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (!isMobileView()) {
                dropdown.classList.remove('active');
            }
        });

        // Mobile: click behavior
        dropdownToggle.addEventListener('click', function(e) {
            if (isMobileView()) {
                e.preventDefault();
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            }
            // On desktop, let the link work normally (hover handles dropdown)
        });
    });
})();

// Pricing Tabs Functionality
(function() {
    const tabs = document.querySelectorAll('.pricing-tab');
    const contents = document.querySelectorAll('.pricing-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content
            contents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Show target content
            const targetContent = document.getElementById(targetTab + '-packages');
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });
})();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Load Testimonials from Supabase
async function loadTestimonials() {
    const track = document.querySelector('#testimonials-track');
    if (!track) return;
    
    // Fallback testimonials (used if Supabase fetch fails)
    const fallbackTestimonials = [
        {
            name: "Daniela S.",
            text: "Tobi is very insightful in identifying issues and provides helpful cues to improve. He's very patient and knows a lot about body mechanics. I come out of every lesson knowing more about the sport and myself, and his ability to clarify complex movements is quite helpful. He really breaks things down for you, step by step. He thoroughly explains movements and how they translate to the sport. He's a wonderful coach that will help you be your best self. If you're looking for a dedicated coach with a natural understanding of tennis, Tobi's the best choice.",
            date: "2 weeks ago",
            rating: 5
        },
        {
            name: "Srinath T.",
            text: "Good first session with great feedback on my play. Looking forward to my follow-up lessons with him😃",
            date: "1 month ago",
            rating: 5
        },
        {
            name: "Toni G.",
            text: "If you want to improve your game, Tobi is your guy. He is kind, patient and prompt. Thank you for taking the time to share your expertise with me. I look forward to more in the future. Toni",
            date: "2 months ago",
            rating: 5
        },
        {
            name: "Sonya",
            text: "My boyfriend and I have had the pleasure of taking lessons from Tobi for the past month. We have both played tennis before but came into lessons after a long hiatus from the game and were extremely rusty. Tobi is patient, fun and engaging. He makes our lessons interactive, challenging and interesting. The results of his coaching have been dramatic and our play has improved significantly. Our rallies are now crisp and energetic, and our enjoyment of the game has increased accordingly! Additionally Tobi's rates are affordable and great value.",
            date: "3 months ago",
            rating: 5
        },
        {
            name: "Rafael",
            text: "Tobi is a very detail-oriented tennis coach. His main focus and concern is to identify and improve the mechanical and psychological foundations of your game. With his insight and your dedication, you are guaranteed to improve your game.",
            date: "4 months ago",
            rating: 5
        },
        {
            name: "Luke B.",
            text: "Tobi has helped my swing so much in just two lessons",
            date: "5 months ago",
            rating: 5
        },
        {
            name: "Willie",
            text: "Tobi is a great tennis instructor. He took time to assess my strengths and weaknesses and gain an understanding of where I'd like to improve. In 5 minutes of court time, he identified the problems with my forehand and customized drills to make the fix. On top of his ability to develop your tennis strokes, Tobi does a great job of working strategy and shot selection into every lesson. If you're looking to improve and build confidence in your game, Tobi is the perfect coach.",
            date: "6 months ago",
            rating: 5
        },
        {
            name: "Rockwell",
            text: "Tobi has a really deep understanding of the game. And equally important he knows how to communicate that to his students to actually get them to improve, quickly.",
            date: "8 months ago",
            rating: 5
        },
        {
            name: "Michael K.",
            text: "I was initially hesitant to take tennis lessons, but Toby's friendly demeanor and expertise quickly put me at ease. He is a great teacher who knows how to explain complex techniques in a way that is easy to understand.",
            date: "10 months ago",
            rating: 5
        },
        {
            name: "Millie",
            text: "Over the past 6 months with Tobi's coaching I have developed from being able to hold a rally for 2-3 shots and not knowing how to serve, to serving well and consistently, improving my footwork and strategy on court during games and I'm very proud of the strong ground strokes and volleys I can now do! I'm not the easiest person to coach (stubborn and under confident) but Tobi has been patient, calm and learned my style to successfully keep coaching me up.",
            date: "1 year ago",
            rating: 5
        }
    ];
    
    try {
        // Try direct Supabase client first (faster, if available)
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('public_testimonials')
                    .select(`
                        id,
                        testimonial_text,
                        rating,
                        video_url,
                        featured,
                        submitted_at,
                        students!inner(
                            profiles!inner(full_name)
                        )
                    `)
                    .eq('status', 'published')
                    .order('featured', { ascending: false })
                    .order('submitted_at', { ascending: false })
                    .limit(20);
                
                if (!error && data && data.length > 0) {
                    // Transform data to match expected format
                    const formatted = data.map(t => ({
                        name: t.students?.profiles?.full_name || 'Anonymous',
                        text: t.testimonial_text,
                        rating: t.rating,
                        videoUrl: t.video_url,
                        featured: t.featured,
                        date: t.submitted_at,
                        submitted_at: t.submitted_at
                    }));
                    
                    renderTestimonials(formatted, track);
                    return;
                }
            } catch (directError) {
                console.warn('Direct Supabase fetch failed, trying Netlify Function:', directError);
            }
        }
        
        // Fallback to Netlify Function
        const response = await fetch('/.netlify/functions/get-testimonials?limit=20');
        
        if (!response.ok) {
            throw new Error('Failed to fetch testimonials');
        }
        
        const data = await response.json();
        
        if (data.success && data.testimonials && data.testimonials.length > 0) {
            // Use Supabase testimonials from Netlify Function
            renderTestimonials(data.testimonials, track);
            return;
        } else {
            throw new Error('No testimonials returned');
        }
    } catch (error) {
        console.warn('Could not load testimonials from Supabase, using fallback:', error);
        // Use fallback testimonials
        renderTestimonials(fallbackTestimonials, track);
    }
}

// Render testimonials to the DOM
function renderTestimonials(testimonials, track) {
    // Clear loading message
    track.innerHTML = '';
    
    // Format date helper
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    }
    
    // Create testimonial cards
    testimonials.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        
        const dateText = testimonial.date || formatDate(testimonial.submitted_at || testimonial.date);
        
        card.innerHTML = `
            <div class="testimonial-header">
                <div class="testimonial-author">${testimonial.name || 'Anonymous'}</div>
                <div class="testimonial-date">${dateText}</div>
            </div>
            <div class="testimonial-text">"${testimonial.text || testimonial.testimonial_text || ''}"</div>
        `;
        
        track.appendChild(card);
    });
    
    // Re-initialize carousel after testimonials are loaded
    setTimeout(() => {
        initTestimonialsCarousel();
    }, 100);
}

// Testimonials Carousel Auto-Rotation
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!track || !cards.length) return;
    
    let currentIndex = 0;
    let cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    let autoRotateInterval;
    
    function getCardsPerView() {
        return window.innerWidth <= 768 ? 1 : 3;
    }
    
    function updateCarousel() {
        cardsPerView = getCardsPerView();
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        currentIndex = Math.max(0, Math.min(currentIndex, totalSlides - 1));
        
        // Get the visible container width (excluding padding)
        const carouselContainer = track.parentElement;
        const containerPadding = 120; // 60px on each side
        const visibleWidth = carouselContainer.offsetWidth - containerPadding;
        
        // Get actual card width from the first card
        if (cards[0]) {
            const cardRect = cards[0].getBoundingClientRect();
            const cardWidth = cardRect.width;
            const computedStyle = window.getComputedStyle(track);
            const gap = parseFloat(computedStyle.gap) || 32; // Get actual gap value
            
            // Calculate slide width: card width + gap for each card in the view
            const slideWidth = (cardWidth + gap) * cardsPerView;
            
            const translateX = -(currentIndex * slideWidth);
            track.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    function nextSlide() {
        cardsPerView = getCardsPerView();
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        cardsPerView = getCardsPerView();
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextSlide, 5000);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoRotate(); // Reset timer after manual navigation
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoRotate(); // Reset timer after manual navigation
        });
    }
    
    // Pause auto-rotate on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            if (autoRotateInterval) clearInterval(autoRotateInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoRotate();
        });
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cardsPerView = getCardsPerView();
            currentIndex = 0; // Reset to start on resize
            updateCarousel();
        }, 250);
    });
    
    // Wait for images to load before initializing
    window.addEventListener('load', () => {
        updateCarousel();
        startAutoRotate();
    });
    
    // Initialize immediately as fallback
    setTimeout(() => {
        updateCarousel();
        startAutoRotate();
    }, 100);
}

// Load testimonials when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
    
    // Set up real-time subscription for new testimonials
    if (supabase) {
        setupTestimonialsSubscription();
    }
});

// Real-time subscription for new testimonials
let testimonialsSubscription = null;

function setupTestimonialsSubscription() {
    if (!supabase) {
        console.warn('Supabase client not initialized, skipping real-time subscription');
        return;
    }
    
    try {
        // Subscribe to new testimonials
        testimonialsSubscription = supabase
            .channel('public-testimonials')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'public_testimonials',
                filter: 'status=eq.published' // Listen for published testimonials
            }, (payload) => {
                console.log('New testimonial received:', payload);
                // Transform and add new testimonial to DOM
                const newTestimonial = transformTestimonialData(payload.new);
                if (newTestimonial) {
                    addTestimonialToDOM(newTestimonial);
                }
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'public_testimonials',
                filter: 'status=eq.published' // Listen for status changes to published
            }, (payload) => {
                console.log('Testimonial updated:', payload);
                // If a testimonial was just published, add it
                if (payload.new.status === 'published' && payload.old.status !== 'published') {
                    const newTestimonial = transformTestimonialData(payload.new);
                    if (newTestimonial) {
                        addTestimonialToDOM(newTestimonial);
                    }
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Subscribed to testimonials real-time updates');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Error subscribing to testimonials channel');
                }
            });
    } catch (error) {
        console.error('Error setting up testimonials subscription:', error);
    }
}

// Transform testimonial data from Supabase format to our format
async function transformTestimonialData(testimonial) {
    if (!testimonial) return null;
    
    // If the testimonial already has student data, use it
    if (testimonial.students?.profiles?.full_name) {
        return {
            id: testimonial.id,
            name: testimonial.students.profiles.full_name,
            text: testimonial.testimonial_text,
            rating: testimonial.rating,
            videoUrl: testimonial.video_url,
            featured: testimonial.featured,
            date: testimonial.submitted_at,
            submitted_at: testimonial.submitted_at
        };
    }
    
    // Otherwise, fetch the student data
    if (supabase && testimonial.student_id) {
        try {
            const { data: studentData, error } = await supabase
                .from('students')
                .select(`
                    profiles!inner(full_name)
                `)
                .eq('id', testimonial.student_id)
                .single();
            
            if (!error && studentData) {
                return {
                    id: testimonial.id,
                    name: studentData.profiles?.full_name || 'Anonymous',
                    text: testimonial.testimonial_text,
                    rating: testimonial.rating,
                    videoUrl: testimonial.video_url,
                    featured: testimonial.featured,
                    date: testimonial.submitted_at,
                    submitted_at: testimonial.submitted_at
                };
            }
        } catch (error) {
            console.error('Error fetching student data for testimonial:', error);
        }
    }
    
    // Fallback with minimal data
    return {
        id: testimonial.id,
        name: 'Anonymous',
        text: testimonial.testimonial_text || '',
        rating: testimonial.rating || 5,
        videoUrl: testimonial.video_url,
        featured: testimonial.featured || false,
        date: testimonial.submitted_at,
        submitted_at: testimonial.submitted_at
    };
}

// Add a new testimonial to the DOM without refreshing
function addTestimonialToDOM(testimonial) {
    const track = document.querySelector('#testimonials-track');
    if (!track) {
        console.warn('Testimonials track not found');
        return;
    }
    
    // Check if testimonial already exists (avoid duplicates)
    const existingCard = track.querySelector(`[data-testimonial-id="${testimonial.id}"]`);
    if (existingCard) {
        console.log('Testimonial already exists in DOM');
        return;
    }
    
    // Format date
    function formatDate(dateString) {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    }
    
    const dateText = formatDate(testimonial.submitted_at || testimonial.date);
    
    // Create testimonial card
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-testimonial-id', testimonial.id);
    
    // If featured, add to the beginning; otherwise add to the end
    const isFeatured = testimonial.featured;
    
    card.innerHTML = `
        <div class="testimonial-header">
            <div class="testimonial-author">${testimonial.name || 'Anonymous'}</div>
            <div class="testimonial-date">${dateText}</div>
        </div>
        <div class="testimonial-text">"${testimonial.text || testimonial.testimonial_text || ''}"</div>
    `;
    
    // Add animation class for smooth appearance
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Insert at the beginning if featured, otherwise at the end
    if (isFeatured && track.firstChild) {
        track.insertBefore(card, track.firstChild);
    } else {
        track.appendChild(card);
    }
    
    // Animate in
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 10);
    
    // Re-initialize carousel to include new card
    setTimeout(() => {
        initTestimonialsCarousel();
    }, 100);
    
    // Show a subtle notification (optional)
    showTestimonialNotification(testimonial.name);
}

// Show a subtle notification when a new testimonial is added
function showTestimonialNotification(studentName) {
    // Create a small notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #4B2C6C;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    notification.textContent = `✨ New testimonial from ${studentName}!`;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Cleanup subscription on page unload
window.addEventListener('beforeunload', () => {
    if (testimonialsSubscription) {
        supabase.removeChannel(testimonialsSubscription);
        testimonialsSubscription = null;
    }
});

// ============================================
// Supabase Helper Functions
// ============================================

/**
 * Submit contact form to Supabase
 * @param {Object} formData - { name, email, phone, message }
 */
async function submitContactForm(formData) {
    if (!supabase) {
        console.error('Supabase client not initialized');
        return { success: false, error: 'Database connection not available' };
    }
    
    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([{
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                message: formData.message,
                source: 'website',
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('Error submitting contact form:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Exception submitting contact form:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Load pricing from Supabase
 * @returns {Promise<Array>} Array of pricing packages
 */
async function loadPricing() {
    if (!supabase) {
        console.warn('Supabase client not initialized, using default pricing');
        return null;
    }
    
    try {
        const { data, error } = await supabase
            .from('public_pricing')
            .select('*')
            .eq('is_active', true)
            .order('lessons', { ascending: true });
        
        if (error) {
            console.error('Error loading pricing:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Exception loading pricing:', error);
        return null;
    }
}

/**
 * Get published testimonials directly from Supabase
 * @param {Object} options - { featured: boolean, limit: number }
 * @returns {Promise<Array>} Array of testimonials
 */
async function getTestimonialsFromSupabase(options = {}) {
    if (!supabase) {
        return null;
    }
    
    try {
        let query = supabase
            .from('public_testimonials')
            .select(`
                id,
                testimonial_text,
                rating,
                video_url,
                featured,
                submitted_at,
                students!inner(
                    profiles!inner(full_name)
                )
            `)
            .eq('status', 'published');
        
        if (options.featured) {
            query = query.eq('featured', true);
        }
        
        query = query
            .order('featured', { ascending: false })
            .order('submitted_at', { ascending: false });
        
        if (options.limit) {
            query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error fetching testimonials:', error);
            return null;
        }
        
        return data.map(t => ({
            id: t.id,
            name: t.students?.profiles?.full_name || 'Anonymous',
            text: t.testimonial_text,
            rating: t.rating,
            videoUrl: t.video_url,
            featured: t.featured,
            date: t.submitted_at,
            submitted_at: t.submitted_at
        }));
    } catch (error) {
        console.error('Exception fetching testimonials:', error);
        return null;
    }
}

// Floating CTA Button - Always visible
(function() {
    const floatingCTA = document.getElementById('floating-cta');
    if (!floatingCTA) return;
    
    // Remove hidden class if it exists
    floatingCTA.classList.remove('hidden');
})();

// FAQ Accordion Functionality
(function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
})();

// Image Modal for Success Stories
function openImageModal(imageSrc) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'image-modal-overlay';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <img src="${imageSrc}" alt="Full size image">
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on X click
    modal.querySelector('.image-modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function openBioModal(title, student, bio) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'bio-modal-overlay';
    modal.innerHTML = `
        <div class="bio-modal-content">
            <span class="bio-modal-close">&times;</span>
            <h2>${title}</h2>
            <p class="bio-student">${student}</p>
            <p class="bio-text">${bio}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on X click
    modal.querySelector('.bio-modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Floating Side Reviews (Desktop Only)
(function() {
    // Review data
    const reviews = [
        {
            author: "Daniela S.",
            text: "Tobi is very insightful in identifying issues and provides helpful cues to improve. He's very patient and knows a lot about body mechanics."
        },
        {
            author: "Srinath T.",
            text: "Good first session with great feedback on my play. Looking forward to my follow-up lessons with him😃"
        },
        {
            author: "Toni G.",
            text: "If you want to improve your game, Tobi is your guy. He is kind, patient and prompt. Thank you for taking the time to share your expertise with me."
        },
        {
            author: "Sonya",
            text: "Tobi is patient, fun and engaging. He makes our lessons interactive, challenging and interesting. The results of his coaching have been dramatic!"
        },
        {
            author: "Rafael",
            text: "Tobi is a very detail-oriented tennis coach. His main focus is to identify and improve the mechanical and psychological foundations of your game."
        },
        {
            author: "Luke B.",
            text: "Tobi has helped my swing so much in just two lessons"
        },
        {
            author: "Willie",
            text: "Tobi is a great tennis instructor. In 5 minutes of court time, he identified the problems with my forehand and customized drills to make the fix."
        },
        {
            author: "Rockwell",
            text: "Tobi has a really deep understanding of the game. And equally important he knows how to communicate that to his students to actually get them to improve, quickly."
        },
        {
            author: "Michael K.",
            text: "I was initially hesitant to take tennis lessons, but Toby's friendly demeanor and expertise quickly put me at ease. He is a great teacher."
        },
        {
            author: "Millie",
            text: "Over the past 6 months with Tobi's coaching I have developed from being able to hold a rally for 2-3 shots to serving well and consistently!"
        },
        {
            author: "Rajesh",
            text: "Been practicing Tennis on my own for couple of years. Getting coaching from Tobi has been wonderful. I could see my game is getting better."
        },
        {
            author: "Rachel C.",
            text: "Toby is an amazing tennis coach! He is patient, knowledgeable, and always willing to go the extra mile to help his students succeed."
        },
        {
            author: "Jeff",
            text: "Tobi was able to quickly identify and help correct a couple of fundamentals that have really helped improve my game."
        },
        {
            author: "David M.",
            text: "As an experienced player, I was looking for a coach who could help me take my game to the next level. Toby's insights and guidance have been invaluable in helping me refine my technique and strategy."
        },
        {
            author: "Julian S.",
            text: "Toby is an excellent tennis coach who truly cares about his students' progress. He is patient, kind, and always willing to answer any questions. I would highly recommend him to players of all levels."
        },
        {
            author: "Julia S.",
            text: "Toby is a fantastic tennis instructor! He really knows how to connect with his students and help them improve their game. As a beginner, I felt very comfortable learning from him. Highly recommend!"
        },
        {
            author: "Lisa T.",
            text: "Toby's passion for tennis is infectious! His enthusiasm for the sport has inspired me to take my game more seriously and has helped me develop a love for the game. Highly recommend him as a coach."
        },
        {
            author: "Marcus H.",
            text: "I have been playing tennis for years but had never worked with a coach before. Toby's expertise and attention to detail have helped me improve my game in ways I never thought possible."
        },
        {
            author: "Lea G.",
            text: "I have worked with several tennis coaches over the years, but Toby is by far the best. He takes the time to understand his students' goals and tailor his lessons to their needs."
        },
        {
            author: "Douglas",
            text: "I've been taking lessons with Tobi for over three years, and it's been an amazing experience! Tobi has helped me improve my tennis skills tremendously and given me the confidence I needed to play better. The lessons focus on solid fundamentals, and I can truly see the difference in my game quickly. I highly recommend Tobi to anyone looking to boost their skills and confidence—both on and off the court! He is a great coach."
        }
    ];
    
    let leftReviewIndex = 0;
    let rightReviewIndex = Math.floor(reviews.length / 2); // Start right side at different point
    
    const leftReviewText = document.getElementById('floating-review-text-left');
    const leftReviewAuthor = document.getElementById('floating-review-author-left');
    const rightReviewText = document.getElementById('floating-review-text-right');
    const rightReviewAuthor = document.getElementById('floating-review-author-right');
    const leftReview = document.getElementById('floating-review-left');
    const rightReview = document.getElementById('floating-review-right');
    
    function updateFloatingReviews() {
        // Only show on desktop when there's enough space (screen width >= 1600px)
        // This ensures reviews don't overlap with the 1200px container
        if (window.innerWidth < 1600) {
            if (leftReview) leftReview.style.display = 'none';
            if (rightReview) rightReview.style.display = 'none';
            return;
        }
        
        // Show on desktop - position outside the container
        if (leftReview) {
            leftReview.style.display = 'block';
            const containerWidth = 1200;
            const reviewWidth = 280;
            const margin = 40;
            const leftPosition = (window.innerWidth - containerWidth) / 2 - reviewWidth - margin;
            leftReview.style.left = `${Math.max(20, leftPosition)}px`;
        }
        if (rightReview) {
            rightReview.style.display = 'block';
            const containerWidth = 1200;
            const reviewWidth = 280;
            const margin = 40;
            const rightPosition = (window.innerWidth - containerWidth) / 2 - reviewWidth - margin;
            rightReview.style.right = `${Math.max(20, rightPosition)}px`;
        }
        
        // Update left review
        if (leftReviewText && leftReviewAuthor) {
            const review = reviews[leftReviewIndex];
            leftReviewText.textContent = `"${review.text}"`;
            leftReviewAuthor.textContent = `- ${review.author}`;
        }
        
        // Update right review
        if (rightReviewText && rightReviewAuthor) {
            const review = reviews[rightReviewIndex];
            rightReviewText.textContent = `"${review.text}"`;
            rightReviewAuthor.textContent = `- ${review.author}`;
        }
    }
    
    function rotateReviews() {
        // Rotate left review
        leftReviewIndex = (leftReviewIndex + 1) % reviews.length;
        
        // Rotate right review (different timing)
        rightReviewIndex = (rightReviewIndex + 1) % reviews.length;
        
        // Ensure they're different
        if (leftReviewIndex === rightReviewIndex) {
            rightReviewIndex = (rightReviewIndex + 1) % reviews.length;
        }
        
        // Fade out
        if (leftReview) leftReview.style.opacity = '0';
        if (rightReview) rightReview.style.opacity = '0';
        
        // Update and fade in
        setTimeout(() => {
            updateFloatingReviews();
            if (leftReview) leftReview.style.opacity = '1';
            if (rightReview) rightReview.style.opacity = '1';
        }, 300);
    }
    
    // Initialize
    updateFloatingReviews();
    
    // Rotate every 8 seconds
    setInterval(rotateReviews, 8000);
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateFloatingReviews();
        }, 250);
    });
    
    // Update position on scroll (keep them centered vertically)
    window.addEventListener('scroll', () => {
        if (window.innerWidth >= 1600) {
            if (leftReview) {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const scrollPercent = scrollTop / (document.documentElement.scrollHeight - windowHeight);
                const maxOffset = 200; // Maximum offset from center
                const offset = scrollPercent * maxOffset - maxOffset / 2;
                leftReview.style.transform = `translateY(calc(-50% + ${offset}px))`;
            }
            if (rightReview) {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const scrollPercent = scrollTop / (document.documentElement.scrollHeight - windowHeight);
                const maxOffset = 200;
                const offset = scrollPercent * maxOffset - maxOffset / 2;
                rightReview.style.transform = `translateY(calc(-50% + ${offset}px))`;
            }
        }
    });
})();

// Mobile Review Widget
(function() {
    const reviews = [
        {
            author: "Daniela S.",
            text: "Tobi is very insightful in identifying issues and provides helpful cues to improve. He's very patient and knows a lot about body mechanics."
        },
        {
            author: "Srinath T.",
            text: "Good first session with great feedback on my play. Looking forward to my follow-up lessons with him😃"
        },
        {
            author: "Toni G.",
            text: "If you want to improve your game, Tobi is your guy. He is kind, patient and prompt. Thank you for taking the time to share your expertise with me."
        },
        {
            author: "Sonya",
            text: "Tobi is patient, fun and engaging. He makes our lessons interactive, challenging and interesting. The results of his coaching have been dramatic!"
        },
        {
            author: "Rafael",
            text: "Tobi is a very detail-oriented tennis coach. His main focus is to identify and improve the mechanical and psychological foundations of your game."
        },
        {
            author: "Luke B.",
            text: "Tobi has helped my swing so much in just two lessons"
        },
        {
            author: "Willie",
            text: "Tobi is a great tennis instructor. In 5 minutes of court time, he identified the problems with my forehand and customized drills to make the fix."
        },
        {
            author: "Rockwell",
            text: "Tobi has a really deep understanding of the game. And equally important he knows how to communicate that to his students to actually get them to improve, quickly."
        },
        {
            author: "Michael K.",
            text: "I was initially hesitant to take tennis lessons, but Toby's friendly demeanor and expertise quickly put me at ease. He is a great teacher."
        },
        {
            author: "Millie",
            text: "Over the past 6 months with Tobi's coaching I have developed from being able to hold a rally for 2-3 shots to serving well and consistently!"
        },
        {
            author: "Rajesh",
            text: "Been practicing Tennis on my own for couple of years. Getting coaching from Tobi has been wonderful. I could see my game is getting better."
        },
        {
            author: "Rachel C.",
            text: "Toby is an amazing tennis coach! He is patient, knowledgeable, and always willing to go the extra mile to help his students succeed."
        },
        {
            author: "Jeff",
            text: "Tobi was able to quickly identify and help correct a couple of fundamentals that have really helped improve my game."
        },
        {
            author: "David M.",
            text: "As an experienced player, I was looking for a coach who could help me take my game to the next level. Toby's insights and guidance have been invaluable in helping me refine my technique and strategy."
        },
        {
            author: "Julian S.",
            text: "Toby is an excellent tennis coach who truly cares about his students' progress. He is patient, kind, and always willing to answer any questions. I would highly recommend him to players of all levels."
        },
        {
            author: "Julia S.",
            text: "Toby is a fantastic tennis instructor! He really knows how to connect with his students and help them improve their game. As a beginner, I felt very comfortable learning from him. Highly recommend!"
        },
        {
            author: "Lisa T.",
            text: "Toby's passion for tennis is infectious! His enthusiasm for the sport has inspired me to take my game more seriously and has helped me develop a love for the game. Highly recommend him as a coach."
        },
        {
            author: "Marcus H.",
            text: "I have been playing tennis for years but had never worked with a coach before. Toby's expertise and attention to detail have helped me improve my game in ways I never thought possible."
        },
        {
            author: "Lea G.",
            text: "I have worked with several tennis coaches over the years, but Toby is by far the best. He takes the time to understand his students' goals and tailor his lessons to their needs."
        },
        {
            author: "Douglas",
            text: "I've been taking lessons with Tobi for over three years, and it's been an amazing experience! Tobi has helped me improve my tennis skills tremendously and given me the confidence I needed to play better. The lessons focus on solid fundamentals, and I can truly see the difference in my game quickly. I highly recommend Tobi to anyone looking to boost their skills and confidence—both on and off the court! He is a great coach."
        }
    ];
    
    const mobileWidget = document.getElementById('mobile-review-widget');
    const mobileToggle = document.getElementById('mobile-review-toggle');
    const mobileContent = document.getElementById('mobile-review-content');
    const mobileClose = document.getElementById('mobile-review-close');
    const mobileText = document.getElementById('mobile-review-text-mobile');
    const mobileAuthor = document.getElementById('mobile-review-author-mobile');
    const mobileCounter = document.getElementById('mobile-review-counter');
    const mobilePrev = document.getElementById('mobile-review-prev');
    const mobileNext = document.getElementById('mobile-review-next');
    
    if (!mobileWidget || !mobileToggle) return;
    
    let currentMobileIndex = 0;
    
    function updateMobileReview() {
        if (mobileText && mobileAuthor && mobileCounter) {
            const review = reviews[currentMobileIndex];
            mobileText.textContent = `"${review.text}"`;
            mobileAuthor.textContent = review.author;
            mobileCounter.textContent = `${currentMobileIndex + 1} / ${reviews.length}`;
        }
    }
    
    function toggleMobileWidget() {
        if (mobileWidget) {
            mobileWidget.classList.toggle('active');
        }
    }
    
    function nextMobileReview() {
        currentMobileIndex = (currentMobileIndex + 1) % reviews.length;
        updateMobileReview();
    }
    
    function prevMobileReview() {
        currentMobileIndex = (currentMobileIndex - 1 + reviews.length) % reviews.length;
        updateMobileReview();
    }
    
    // Event listeners
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileWidget);
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', toggleMobileWidget);
    }
    
    if (mobileNext) {
        mobileNext.addEventListener('click', nextMobileReview);
    }
    
    if (mobilePrev) {
        mobilePrev.addEventListener('click', prevMobileReview);
    }
    
    // Close when clicking outside (on the overlay)
    if (mobileContent) {
        mobileContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Close when clicking overlay background on desktop
    if (mobileWidget) {
        mobileWidget.addEventListener('click', (e) => {
            if (e.target === mobileWidget && mobileWidget.classList.contains('active')) {
                toggleMobileWidget();
            }
        });
    }
    
    // Initialize
    updateMobileReview();
    
    // Auto-rotate reviews when widget is open
    let mobileRotateInterval;
    function startMobileRotation() {
        if (mobileRotateInterval) clearInterval(mobileRotateInterval);
        if (mobileWidget && mobileWidget.classList.contains('active')) {
            mobileRotateInterval = setInterval(() => {
                nextMobileReview();
            }, 6000);
        }
    }
    
    // Start rotation when widget opens
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            setTimeout(startMobileRotation, 300);
        });
    }
    
    // Stop rotation when widget closes
    if (mobileClose) {
        mobileClose.addEventListener('click', () => {
            if (mobileRotateInterval) clearInterval(mobileRotateInterval);
        });
    }
})();

// Gallery Carousel Functionality
(function() {
    const galleryCarousel = document.querySelector('.gallery-carousel');
    if (!galleryCarousel) return;
    
    const galleryTrack = galleryCarousel.querySelector('.gallery-track');
    const galleryItems = galleryTrack ? galleryTrack.querySelectorAll('.gallery-item') : [];
    const prevBtn = galleryCarousel.querySelector('.carousel-btn.prev');
    const nextBtn = galleryCarousel.querySelector('.carousel-btn.next');
    
    if (galleryItems.length === 0) return;
    
    let currentIndex = 0;
    let autoRotateInterval;
    
    function getItemsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 4; // Desktop: 4 items
    }
    
    function updateCarousel() {
        if (!galleryTrack) return;
        
        let itemsPerView = getItemsPerView();
        const containerPadding = 120; // 60px on each side
        const visibleWidth = galleryCarousel.offsetWidth - containerPadding;
        
        if (galleryItems[0]) {
            const itemRect = galleryItems[0].getBoundingClientRect();
            const itemWidth = itemRect.width;
            const computedStyle = window.getComputedStyle(galleryTrack);
            const gap = parseFloat(computedStyle.gap) || 24;
            
            const slideWidth = (itemWidth + gap) * itemsPerView;
            const translateX = -(currentIndex * slideWidth);
            galleryTrack.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    function nextSlide() {
        let itemsPerView = getItemsPerView();
        const totalSlides = Math.ceil(galleryItems.length / itemsPerView);
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        let itemsPerView = getItemsPerView();
        const totalSlides = Math.ceil(galleryItems.length / itemsPerView);
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextSlide, 4000); // Rotate every 4 seconds
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoRotate();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoRotate();
        });
    }
    
    // Pause auto-rotate on hover
    galleryCarousel.addEventListener('mouseenter', () => {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
    });
    
    galleryCarousel.addEventListener('mouseleave', () => {
        startAutoRotate();
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = 0;
            updateCarousel();
        }, 250);
    });
    
    // Wait for images to load
    window.addEventListener('load', () => {
        updateCarousel();
        startAutoRotate();
    });
    
    // Initialize immediately as fallback
    setTimeout(() => {
        updateCarousel();
        startAutoRotate();
    }, 100);
})();

