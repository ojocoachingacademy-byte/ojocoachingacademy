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

// Floating CTA Button - Hide on scroll down, show on scroll up
(function() {
    const floatingCTA = document.getElementById('floating-cta');
    if (!floatingCTA) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Always show if near top of page
        if (scrollTop < scrollThreshold) {
            floatingCTA.classList.remove('hidden');
            return;
        }
        
        // Hide when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            floatingCTA.classList.add('hidden');
        } else {
            // Scrolling up
            floatingCTA.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
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


