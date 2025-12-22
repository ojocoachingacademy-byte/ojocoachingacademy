// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
    });
});

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

// Testimonials Carousel Auto-Rotation
(function() {
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
})();

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
        // Only show on desktop (screen width > 1600px)
        if (window.innerWidth < 1600) {
            if (leftReview) leftReview.style.display = 'none';
            if (rightReview) rightReview.style.display = 'none';
            return;
        }
        
        // Show on desktop
        if (leftReview) leftReview.style.display = 'block';
        if (rightReview) rightReview.style.display = 'block';
        
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

