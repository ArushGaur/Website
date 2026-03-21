/* Utkarsh Home Tuition — script.js */

/* ── MOBILE NAV ── */
document.addEventListener('DOMContentLoaded', function () {
    var btn          = document.querySelector('.edu-nova-mobile-toggle');
    var menu         = document.querySelector('.edu-nova-menu-area');
    var header       = document.querySelector('.edu-nova-header');
    var annoBar      = document.querySelector('.announcement-bar');
    if (!btn || !menu) return;

    var iconBars  = btn.querySelector('.fa-bars');
    var iconTimes = btn.querySelector('.fa-times');

    /* ── Inject full-screen dark backdrop ── */
    var overlay = document.createElement('div');
    overlay.id = 'nav-block-overlay';
    overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:88888',
        'background:rgba(0,0,0,0.6)',
        'opacity:0',
        'visibility:hidden',
        'pointer-events:none',
        'transition:opacity 0.32s ease',
        '-webkit-tap-highlight-color:transparent'
    ].join(';');
    document.body.appendChild(overlay);

    /* Give the drawer and toggle their fixed z-indexes via JS so they
       always win regardless of CSS stacking contexts (backdrop-filter etc.) */
    menu.style.zIndex = '99999';
    btn.style.zIndex  = '999999';
    btn.style.position = 'relative';

    function openMenu() {
        menu.classList.add('is-open');
        document.body.classList.add('menu-overlay-active');
        document.body.style.overflow = 'hidden';
        btn.setAttribute('aria-expanded', 'true');
        if (iconBars)  iconBars.style.display  = 'none';
        /* fa-times stays hidden — no X shown (clean white space) */

        /* Kill backdrop-filter on header (removes stacking context that fights overlay) */
        if (header) {
            header.style.backdropFilter = 'none';
            header.style.webkitBackdropFilter = 'none';
        }
        if (annoBar) {
            annoBar.style.visibility = 'hidden';
            annoBar.style.opacity = '0';
            annoBar.style.pointerEvents = 'none';
        }

        /* Show overlay */
        overlay.style.visibility   = 'visible';
        overlay.style.opacity      = '1';
        overlay.style.pointerEvents = 'all';

        /* Hide floating buttons */
        document.querySelectorAll('.call-float-bounce,.whatsapp-float').forEach(function(el){
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            el.style.transition = 'opacity 0.2s ease';
        });
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-overlay-active');
        document.body.style.overflow = '';
        btn.setAttribute('aria-expanded', 'false');
        if (iconBars)  iconBars.style.display  = 'block';
        /* fa-times always hidden */

        /* Restore header and announcement bar */
        if (header) {
            header.style.backdropFilter = '';
            header.style.webkitBackdropFilter = '';
        }
        if (annoBar) {
            annoBar.style.visibility = '';
            annoBar.style.opacity = '';
            annoBar.style.pointerEvents = '';
        }

        /* Hide overlay */
        overlay.style.opacity      = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(function(){ overlay.style.visibility = 'hidden'; }, 320);

        /* Restore floating buttons */
        document.querySelectorAll('.call-float-bounce,.whatsapp-float').forEach(function(el){
            el.style.opacity = '';
            el.style.pointerEvents = '';
        });
    }

    function handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        if (menu.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    }

    btn.addEventListener('click', handleToggle);
    btn.addEventListener('touchend', handleToggle, { passive: false });

    /* Tap dark overlay → close */
    overlay.addEventListener('click', closeMenu);
    overlay.addEventListener('touchend', function(e){ e.preventDefault(); closeMenu(); }, { passive: false });

    /* Nav links → close then navigate */
    document.querySelectorAll('.edu-nova-item').forEach(function (a) {
        a.addEventListener('click', function () { closeMenu(); });
        a.addEventListener('touchend', function (e) {
            e.preventDefault();
            var href = a.getAttribute('href');
            closeMenu();
            if (href && href !== '#') {
                setTimeout(function () { window.location.href = href; }, 80);
            }
        }, { passive: false });
    });
});

/* ── SCROLL REVEALS ── */
document.addEventListener('DOMContentLoaded', function () {
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            el.classList.add('active');

            if (el.classList.contains('grid-3')) {
                el.querySelectorAll('.Utkarsh-card').forEach(function (c, i) {
                    setTimeout(function () { c.classList.add('active'); }, i * 180);
                });
            }

            io.unobserve(el);
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    var selectors = [
        '.reveal', '.grid-3',
        '.about-hero', '.mission-item',
        '.process-step-item', '.philosophy-strip',
        '.animate-left', '.animate-right'
    ];
    document.querySelectorAll(selectors.join(', ')).forEach(function (el) {
        io.observe(el);
    });

    /* FAQ accordion */
    document.querySelectorAll('.faq-trigger').forEach(function (b) {
        b.addEventListener('click', function () {
            var box = b.closest('.faq-glass-box');
            document.querySelectorAll('.faq-glass-box').forEach(function (x) {
                if (x !== box) x.classList.remove('active');
            });
            box.classList.toggle('active');
        });
    });
});

/* ── BODY LOADED ── */
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    setTimeout(function () {
        document.querySelectorAll('.animate').forEach(function (el) {
            el.classList.add('appear');
        });
    }, 80);
});

/* ── MOBILE FAST REVEAL (touchmove fallback) ── */
window.addEventListener('touchmove', function () {
    document.querySelectorAll('.reveal:not(.active)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight - 30)
            el.classList.add('active');
    });
}, { passive: true });

/* ── COUNTER ANIMATION ── */
document.addEventListener('DOMContentLoaded', function () {
    var counters = document.querySelectorAll('.hero-stat-num[data-count]');
    if (!counters.length) return;
    var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = +el.getAttribute('data-count');
            var duration = 1800;
            var start = null;
            function step(ts) {
                if (!start) start = ts;
                var progress = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) { requestAnimationFrame(step); }
                else { el.textContent = target; }
            }
            requestAnimationFrame(step);
            counterIO.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterIO.observe(el); });
});

/* ── FORM SUBMISSIONS ── */
document.addEventListener('DOMContentLoaded', function () {
    function sub(id, btnSel, redirect) {
        var form = document.getElementById(id);
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector(btnSel);
            if (!btn) btn = form.querySelector('button[type="submit"]');
            var orig = btn.innerHTML;
            btn.innerHTML = "Sending&#8230; <i class='fas fa-spinner fa-spin'></i>";
            btn.disabled = true; btn.style.opacity = '0.7';
            var json = JSON.stringify(Object.fromEntries(new FormData(form)));
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            }).then(function (r) {
                if (r.status === 200) { window.location.href = redirect; }
                else { alert('Submission failed. Please try again.'); reset(); }
            }).catch(function () { alert('Connection error.'); reset(); });
            function reset() { btn.innerHTML = orig; btn.disabled = false; btn.style.opacity = '1'; }
        });
    }
    sub('studentForm',  'button[type="submit"]', 'thankyou.html');
    sub('contactForm',  '.premium-btn',          'thank-contact.html');
    sub('teacherForm',  '.teacher-submit-btn',   'thankyou-tutor.html');
});

/* ── PAUSE FLOAT BUTTON ANIMATION DURING MOBILE SCROLL (prevents position jitter) ── */
(function() {
    var floats = document.querySelectorAll('.call-float-bounce, .whatsapp-float');
    if (!floats.length) return;
    var scrollTimer;
    window.addEventListener('scroll', function() {
        floats.forEach(function(el) { el.style.animationPlayState = 'paused'; });
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            floats.forEach(function(el) { el.style.animationPlayState = ''; });
        }, 150);
    }, { passive: true });
})();
