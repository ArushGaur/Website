// 1. Intersection Observer for Elegant "Reveal"
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Check if this is the hero section we want to keep static
            if (entry.target.closest('.hero-custom-mobile-layout')) {
                // Add active class immediately; CSS will handle making it static
                entry.target.classList.add('active'); 
            } else {
                // Standard reveal for other sections
                entry.target.classList.add('active');
            }

            // Staggered animation for grid cards
            if (entry.target.classList.contains('grid-3')) {
                const cards = entry.target.querySelectorAll('.Utkarsh-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('active');
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

// 2. Initialize Observers
document.querySelectorAll('.reveal, .grid-3, .testimonials-overflow').forEach(el => observer.observe(el));

// 3. Professional Form Submission (AJAX - No Page Refresh)
function handleFormSubmission(id, label) {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: json
        })
            .then(async (response) => {
                if (response.status == 200) {
                    // REDIRECT LOGIC BASED ON THE FORM ID
                    if (id === 'teacherForm') {
                        window.location.href = "thankyou-tutor.html";
                    } else {
                        window.location.href = "thankyou.html";
                    }
                } else {
                    alert("Submission failed. Please try again.");
                }
            })
            .catch(error => alert("Error connecting to server."))
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
    });
}

// 4. Force reveal on mobile if scrolling is fast
window.addEventListener('touchmove', () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < windowHeight - 50) {
            reveal.classList.add('active');
        }
    });
}, { passive: true });

// 5. Accordion Logic for FAQ
document.querySelectorAll('.faq-trigger').forEach(button => {
    button.addEventListener('click', () => {
        const currentItem = button.closest('.faq-glass-box');

        // Close other open boxes (Accordion effect)
        document.querySelectorAll('.faq-glass-box').forEach(item => {
            if (item !== currentItem) item.classList.remove('active');
        });

        // Toggle the clicked box
        currentItem.classList.toggle('active');
    });
});

// 6. Final Initialization
document.addEventListener("DOMContentLoaded", function () {
    const revealElements = document.querySelectorAll(".reveal");

    const scrollReveal = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;

        revealElements.forEach((el) => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add("active");
            }
        });
    };

    // Run on scroll and once on load
    window.addEventListener("scroll", scrollReveal);
    scrollReveal();
    
    // Initialize the forms
    handleFormSubmission('studentForm', 'Student');
    handleFormSubmission('teacherForm', 'Tutor');
});

/* ==========================================================
   EDU-NOVA NAVIGATION COMPONENT
   Handles: Mobile Toggle, Overlay, and Centered Dialog Logic
   ========================================================== */

(function() {
    // 1. Wait for DOM to load to ensure elements exist
    document.addEventListener('DOMContentLoaded', () => {
        
        const mobileBtn = document.querySelector('.edu-nova-mobile-toggle');
        const menuDialog = document.querySelector('.edu-nova-menu-area');
        const menuIcon = mobileBtn ? mobileBtn.querySelector('i') : null;

        // Safety check: exit if elements are missing
        if (!mobileBtn || !menuDialog) return;

        /**
         * Function to Open Menu
         */
        const openMenu = () => {
            menuDialog.classList.add('is-open');
            document.body.classList.add('menu-overlay-active');
            if (menuIcon) menuIcon.classList.replace('fa-bars', 'fa-xmark');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        };

        /**
         * Function to Close Menu
         */
        const closeMenu = () => {
            menuDialog.classList.remove('is-open');
            document.body.classList.remove('menu-overlay-active');
            if (menuIcon) menuIcon.classList.replace('fa-xmark', 'fa-bars');
            document.body.style.overflow = ''; // Unlock scrolling
        };

        /**
         * Event: Toggle Button Click
         */
        mobileBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents click from bubbling to document
            if (menuDialog.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        /**
         * Event: Click Outside (The Dimmed Area)
         * Closes the dialog if user clicks the portion of screen 
         * where the dialog is not present.
         */
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = menuDialog.contains(event.target);
            const isClickOnButton = mobileBtn.contains(event.target);

            if (menuDialog.classList.contains('is-open') && !isClickInsideMenu && !isClickOnButton) {
                closeMenu();
            }
        });

        /**
         * Event: Link Clicks
         * Automatically close menu when a user clicks a nav link
         */
        const navLinks = document.querySelectorAll('.edu-nova-item');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    });
})();

/**
 * EDU-NOVA INTERACTIVE SCRIPTS
 * Handles: Scroll animations (Intersection Observer)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Reveal Animation Observer
    const observerOptions = {
        threshold: 0.15 // Element triggers when 15% is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'active' class to trigger CSS transition
                entry.target.classList.add('active');
                // Stop watching once it has appeared
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 2. Target all elements with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // 3. Form Submission Feedback (Simple placeholder)
    const enrollmentForm = document.querySelector('.enrollment-form');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.querySelector('.submit-btn');
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                alert('Success! Our counselor will call you shortly.');
                enrollmentForm.reset();
                btn.innerHTML = 'Submit Application →';
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 2000);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Only observe elements inside the <main> section
    const scrollElements = document.querySelectorAll('main .animate');
    scrollElements.forEach(el => observer.observe(el));
});

/* --- MOBILE MENU & ANIMATION LOGIC --- */
(function() {
    // Fix for Mobile Menu Toggle
    const toggleBtn = document.getElementById('menuToggle');
    const menuArea = document.getElementById('menuArea');
    
    if (toggleBtn && menuArea) {
        toggleBtn.onclick = function() {
            menuArea.classList.toggle('is-open');
            const icon = toggleBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        };
    }

    // Scroll Reveal Animation Logic
    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length > 0) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => revealObs.observe(item));
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector(".edu-nova-mobile-toggle");
    const menu = document.querySelector(".edu-nova-menu-area");

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }
});

window.addEventListener('load', () => {
    // This triggers the CSS rule: body.loaded .edu-nova-logo-img
    document.body.classList.add('loaded');
});

// Function to handle both Contact and Teacher form submissions
function setupFormSubmission(formId, buttonClass) {
    const form = document.getElementById(formId);
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            const submitBtn = form.querySelector(buttonClass);
            const originalText = submitBtn.innerHTML;

            // 1. Set Loading State
            submitBtn.innerHTML = "Sending... <i class='fas fa-spinner fa-spin'></i>";
            submitBtn.style.opacity = "0.7";
            submitBtn.disabled = true;

            // 2. Fetch API Submission
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                if (response.status == 200) {
                    // SUCCESS: Redirect to your attractive thank-you page
                    window.location.href = "thank-contact.html";
                } else {
                    alert("Something went wrong. Please try again.");
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                }
            })
            .catch(error => {
                alert("Connection error. Check your internet.");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            });
        });
    }
}

// Initialize for both forms
document.addEventListener('DOMContentLoaded', () => {
    // For contact.html
    setupFormSubmission('contactForm', '.premium-btn');
    
    // For teachers.html
    setupFormSubmission('teacherForm', '.teacher-submit-btn');
});