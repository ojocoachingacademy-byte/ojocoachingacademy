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

