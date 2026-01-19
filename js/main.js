/**
 * DALEN MASKINDRIFT - Main JavaScript
 * Maskinentreprenor i Strand og Ryfylke
 */

(function() {
    'use strict';

    // =====================================================
    // DOM ELEMENTS
    // =====================================================
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // =====================================================
    // MOBILE MENU TOGGLE
    // =====================================================
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    function handleSmoothScroll(e) {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;

        const targetId = target.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        closeMobileMenu();
    }

    // =====================================================
    // CONTACT FORM HANDLING
    // =====================================================
    async function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Get form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            address: form.address ? form.address.value.trim() : '',
            projectType: form.projectType ? form.projectType.value : '',
            timing: form.timing ? form.timing.value : '',
            description: form.description.value.trim(),
            siteVisit: form.siteVisit ? form.siteVisit.checked : false,
            timestamp: new Date().toISOString()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.description) {
            showFormError('Vennligst fyll ut alle obligatoriske felt.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormError('Vennligst oppgi en gyldig e-postadresse.');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                <circle cx="12" cy="12" r="10"/>
            </svg>
            Sender...
        `;

        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(formData);

            // Show success message
            form.style.display = 'none';
            formSuccess.classList.add('show');

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Form submission error:', error);
            showFormError('Det oppstod en feil. Vennligst prov igjen eller ring oss direkte.');

            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }

    // Simulate form submission (replace with actual Resend API integration)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('Form data submitted:', data);
                // In production, this would send data to your backend/Resend API
                resolve({ success: true });
            }, 1500);
        });
    }

    function showFormError(message) {
        // Create or update error message element
        let errorEl = document.querySelector('.form-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.style.cssText = `
                background-color: #FED7D7;
                color: #C53030;
                padding: 12px 16px;
                border-radius: 4px;
                margin-bottom: 16px;
                font-size: 14px;
            `;
            contactForm.insertBefore(errorEl, contactForm.firstChild);
        }
        errorEl.textContent = message;
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove error after 5 seconds
        setTimeout(() => {
            errorEl.remove();
        }, 5000);
    }

    // =====================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // =====================================================
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .why-us-item, .value-card, .project-card');

        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            animatedElements.forEach(el => el.style.opacity = '1');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // =====================================================
    // HANDLE SERVICE PAGE HASH NAVIGATION
    // =====================================================
    function handleHashNavigation() {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    // =====================================================
    // LAZY LOADING FOR IMAGES
    // =====================================================
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            images.forEach(img => {
                img.src = img.dataset.src;
            });
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // =====================================================
    // PHONE NUMBER CLICK TRACKING
    // =====================================================
    function setupPhoneTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Phone link clicked:', link.href);
                // In production, you might send this to analytics
            });
        });
    }

    // =====================================================
    // ADD SPIN ANIMATION FOR LOADING STATES
    // =====================================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // =====================================================
    // INITIALIZE
    // =====================================================
    function init() {
        // Header scroll effect
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Initial check

        // Mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking nav links
        if (navLinks) {
            navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    closeMobileMenu();
                }
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });

        // Smooth scroll
        document.addEventListener('click', handleSmoothScroll);

        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Hash navigation
        handleHashNavigation();
        window.addEventListener('hashchange', handleHashNavigation);

        // Scroll animations
        setupScrollAnimations();

        // Lazy loading
        setupLazyLoading();

        // Phone tracking
        setupPhoneTracking();

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
