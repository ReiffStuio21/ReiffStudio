/**
 * Perfect Grounds Coffee Product Page - JavaScript
 * Interactive animations and functionality
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupIntersectionObserver();
        setupScrollAnimations();
        setupCardHoverEffects();
        setupLazyLoading();
    }

    /**
     * Intersection Observer for scroll-triggered animations
     */
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        // Observe all product cards
        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });
    }

    /**
     * Parallax scrolling effect for floating coffee beans
     */
    function setupScrollAnimations() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const beans = document.querySelectorAll('.coffee-bean');

                    beans.forEach((bean, index) => {
                        const speed = 0.5 + (index * 0.2);
                        bean.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
                    });

                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * 3D tilt effect on card hover
     */
    function setupCardHoverEffects() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * Lazy loading fallback for older browsers
     */
    function setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.src;
            });
        } else {
            // Fallback for browsers without native lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }

    /**
     * Add to Cart Handler
     * @param {string} productName - The name of the product to add
     */
    window.handleAddToCart = function(productName) {
        const button = event.target.closest('.cta-button');
        if (!button) return;

        const originalText = button.innerHTML;

        // Show loading state
        button.innerHTML = '<span>Adding...</span>';
        button.disabled = true;

        // Simulate API call (replace with actual WooCommerce integration)
        setTimeout(() => {
            // Success state
            button.innerHTML = '<span>✓ Added!</span>';
            button.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

            // Log to console (for debugging)
            console.log(`Added "${productName}" to cart`);

            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }, 800);

        // For actual WooCommerce integration, use this instead:
        /*
        if (typeof jQuery !== 'undefined' && typeof wc_add_to_cart_params !== 'undefined') {
            const productIds = {
                'Ethiopian Yirgacheffe': 123,
                'Colombian Supremo': 124,
                'Guatemala Antigua': 125,
                'Sumatra Mandheling': 126,
                'Costa Rica Tarrazú': 127,
                'Kenya AA': 128
            };

            const productId = productIds[productName];

            jQuery.ajax({
                url: wc_add_to_cart_params.ajax_url,
                type: 'POST',
                data: {
                    action: 'woocommerce_ajax_add_to_cart',
                    product_id: productId,
                    quantity: 1
                },
                success: function(response) {
                    if (response.error) {
                        button.innerHTML = '<span>Error!</span>';
                        button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                    } else {
                        button.innerHTML = '<span>✓ Added!</span>';
                        button.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                        jQuery(document.body).trigger('wc_fragment_refresh');
                    }

                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '';
                        button.disabled = false;
                    }, 2000);
                },
                error: function() {
                    button.innerHTML = '<span>Error!</span>';
                    button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';

                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '';
                        button.disabled = false;
                    }, 2000);
                }
            });
        }
        */
    };

    /**
     * Product filtering (optional feature)
     * Call this function if you add filter buttons
     */
    window.filterProducts = function(category) {
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    /**
     * Smooth scroll to section (if needed)
     */
    window.scrollToCoffeeSection = function() {
        const section = document.getElementById('coffeeSection');
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Performance monitoring (optional)
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const loadTime = window.performance.timing.domContentLoadedEventEnd -
                           window.performance.timing.navigationStart;
            console.log(`Coffee products section loaded in ${loadTime}ms`);
        });
    }

})();
