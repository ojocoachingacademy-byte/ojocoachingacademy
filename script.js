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

