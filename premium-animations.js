/* ============================================================
   PREMIUM ANIMATIONS JS — Utkarsh Home Tuition  v6
   Logo fly on every page · No splash · Clean dismiss
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     UTILITY — lock / unlock scroll without layout shift
     ══════════════════════════════════════════════════════════ */
  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.documentElement.style.overflow = '';
  }


  /* ══════════════════════════════════════════════════════════
     1. PAGE LOADER — runs on every page
        After 3 s + page load: logo flies to the nav logo,
        everything else fades out, then loader disappears.
     ══════════════════════════════════════════════════════════ */
  function buildLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <div class="loader-brand">
        <img id="loader-logo-img" src="Logo.png" alt="Utkarsh"
             onerror="this.style.display='none'">
        <span class="loader-name">Utkarsh Home Tuition</span>
        <span class="loader-tagline">Excellence in Learning</span>
      </div>
      <div class="loader-track">
        <div class="loader-fill" id="loader-fill"></div>
      </div>
      <span class="loader-percent" id="loader-percent">0%</span>
      <div class="loader-dots">
        <span></span><span></span><span></span>
      </div>`;
    document.body.prepend(loader);
    document.body.classList.add('loader-active');
    lockScroll();

    const fill    = document.getElementById('loader-fill');
    const percent = document.getElementById('loader-percent');

    const MIN_MS  = 2000;   /* minimum visible time */
    const FILL_MS = 1800;   /* bar fill duration     */
    const t0      = performance.now();
    let pageReady = false;
    let barDone   = false;

    /* Smooth eased progress bar */
    function animateBar(now) {
      const raw   = Math.min((now - t0) / FILL_MS, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      const p     = Math.round(eased * 100);
      fill.style.width    = p + '%';
      percent.textContent = p + '%';
      if (raw < 1) {
        requestAnimationFrame(animateBar);
      } else {
        barDone = true;
        tryFinish();
      }
    }
    requestAnimationFrame(animateBar);

    window.addEventListener('load', () => { pageReady = true; tryFinish(); });

    function tryFinish() {
      if (!barDone || !pageReady) return;
      const wait = Math.max(MIN_MS - (performance.now() - t0), 0);
      setTimeout(startFlyOut, wait + 180);
    }

    /* Hard fallback — never block beyond 7.5 s */
    setTimeout(() => {
      if (document.getElementById('page-loader')) startFlyOut();
    }, 7500);

    /* ── THE FLY-OUT ─────────────────────────────────────────
       1. Find the nav logo's screen position
       2. Fade all loader UI except the logo image
       3. Fly the logo from centre-screen to nav logo position,
          scaling it down to match the nav logo's size
       4. Once the fly lands, fade the entire loader out
    ────────────────────────────────────────────────────────── */
    function startFlyOut() {
      const loaderImg = document.getElementById('loader-logo-img');
      const navLogo   = document.querySelector('.edu-nova-logo-img');

      /* ── Fade everything except the logo image ── */
      loader.querySelectorAll(
        '.loader-track, .loader-percent, .loader-dots, .loader-name, .loader-tagline'
      ).forEach(el => {
        el.style.transition = 'opacity 0.22s ease';
        el.style.opacity    = '0';
      });

      /* ── Fly the logo ── */
      if (loaderImg && navLogo) {
        const fR = loaderImg.getBoundingClientRect();  /* from rect */
        const tR = navLogo.getBoundingClientRect();    /* to rect   */

        const dx    = (tR.left + tR.width  / 2) - (fR.left + fR.width  / 2);
        const dy    = (tR.top  + tR.height / 2) - (fR.top  + fR.height / 2);
        const scale = tR.height / fR.height;

        /* One rAF to let the fade start, then trigger the fly */
        requestAnimationFrame(() => {
          loaderImg.style.transition =
            'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)';
          loaderImg.style.transform =
            `translate(${dx}px, ${dy}px) scale(${scale})`;
        });

        /* After fly completes: fade loader out, unlock scroll */
        setTimeout(dismissLoader, 820);

      } else {
        /* No nav logo found — just dismiss immediately */
        dismissLoader();
      }

      function dismissLoader() {
        loader.style.transition = 'opacity 0.45s ease';
        loader.style.opacity    = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => {
          loader.remove();
          document.body.classList.remove('loader-active'); /* ← reveal float buttons */
        }, 480);

        unlockScroll();
        document.body.classList.add('loaded');
        setTimeout(() => {
          document.querySelectorAll('.animate').forEach(el => el.classList.add('appear'));
        }, 80);
      }
    }
  }


  /* ══════════════════════════════════════════════════════════
     2. SCROLL PROGRESS BAR
     ══════════════════════════════════════════════════════════ */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (s / h) * 100 : 0).toFixed(2) + '%';
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════════
     3. CUSTOM CURSOR — warm amber / gold
     ══════════════════════════════════════════════════════════ */
  function initCursor() {
    if (window.matchMedia('(max-width:768px)').matches) return;
    if (window.matchMedia('(pointer:coarse)').matches)  return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.id  = 'cursor-dot';
    ring.id = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = -300, my = -300;
    let rx = -300, ry = -300;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }
    (function loop() {
      rx = lerp(rx, mx, 0.11);
      ry = lerp(ry, my, 0.11);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    const hoverSel = 'a, button, label, select, [role="button"]';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
    });
    document.addEventListener('mouseover', e => {
      if (e.target.matches('input, textarea')) document.body.classList.add('cursor-text');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.matches('input, textarea')) document.body.classList.remove('cursor-text');
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
  }


  /* ══════════════════════════════════════════════════════════
     4. STICKY HEADER GLASS
     ══════════════════════════════════════════════════════════ */
  function initStickyHeader() {
    const header = document.querySelector('.edu-nova-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════════
     5. SCROLL REVEALS
     ══════════════════════════════════════════════════════════ */
  function initScrollReveals() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('active');
        if (el.classList.contains('grid-3')) {
          el.querySelectorAll('.Utkarsh-card').forEach((c, i) => {
            setTimeout(() => c.classList.add('active'), i * 130);
          });
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    [
      '.reveal', '.about-hero', '.mission-item', '.process-step-item',
      '.philosophy-strip', '.grid-3', '.modern-features-grid',
      '.process-section', '.animate-left', '.animate-right', 'footer'
    ].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => io.observe(el));
    });
  }


  /* ══════════════════════════════════════════════════════════
     6. TEXT MASK REVEALS
     ══════════════════════════════════════════════════════════ */
  function initTextMasks() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal-mask').forEach(el => io.observe(el));
  }


  /* ══════════════════════════════════════════════════════════
     7. PAGE-LOAD .animate
     ══════════════════════════════════════════════════════════ */
  function initPageLoad() {
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      setTimeout(() => {
        document.querySelectorAll('.animate').forEach(el => el.classList.add('appear'));
      }, 80);
    });
  }


  /* ══════════════════════════════════════════════════════════
     8. MAGNETIC — nav links + Contact Us button
     ══════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (window.matchMedia('(max-width:992px)').matches) return;

    function addMagnetic(el, strength) {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * strength;
        const dy = (e.clientY - (r.top  + r.height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    }

    document.querySelectorAll('.edu-nova-item').forEach(el => addMagnetic(el, 0.28));
    document.querySelectorAll('.edu-nova-cta').forEach(el  => addMagnetic(el, 0.35));
  }


  /* ══════════════════════════════════════════════════════════
     9. TEACHERS FORM — PUSH-BACK
     ══════════════════════════════════════════════════════════ */
  function enableFormPushBack(selector) {
    const form = document.querySelector(selector);
    if (!form) return;
    const isTouch  = window.matchMedia('(pointer:coarse)').matches;
    const isMobile = window.matchMedia('(max-width:768px)').matches;

    if (isMobile || isTouch) {
      /* Touch: subtle lift on press */
      form.addEventListener('touchstart', () => {
        form.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        form.style.transform  = 'translateY(-4px)';
        form.style.boxShadow  = '0 24px 60px rgba(58,12,163,0.22)';
      }, { passive: true });
      form.addEventListener('touchend', () => {
        form.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        form.style.transform  = '';
        form.style.boxShadow  = '';
      }, { passive: true });
    } else {
      /* Desktop: original 3D tilt */
      form.addEventListener('mousemove', e => {
        const r  = form.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
        const ny = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
        form.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        form.style.transform  =
          `perspective(900px) rotateX(${-ny * 6}deg) rotateY(${nx * 8}deg) translateZ(-18px)`;
        form.style.boxShadow  =
          `${-nx * 12}px ${ny * 10}px 50px rgba(58,12,163,0.22)`;
      });
      form.addEventListener('mouseleave', () => {
        form.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease';
        form.style.transform  = '';
        form.style.boxShadow  = '';
      });
    }
  }


  /* ══════════════════════════════════════════════════════════
     10. RIPPLE
     ══════════════════════════════════════════════════════════ */
  function initRipple() {
    const sel =
      '.premium-btn, .teacher-submit-btn, .submit-btn, .back-btn, .home-btn, .edu-nova-cta';
    document.querySelectorAll(sel).forEach(btn => {
      btn.addEventListener('click', e => {
        const r    = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 1.5;
        const rip  = document.createElement('span');
        rip.className = 'ripple-effect';
        rip.style.cssText =
          `width:${size}px; height:${size}px;` +
          `left:${e.clientX - r.left - size / 2}px;` +
          `top:${e.clientY  - r.top  - size / 2}px;`;
        btn.appendChild(rip);
        setTimeout(() => rip.remove(), 700);
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     11. COUNT-UP
     ══════════════════════════════════════════════════════════ */
  function initCountUp() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const tgt = parseInt(el.dataset.count, 10);
        const t0  = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / 1600, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * tgt);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = tgt;
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
  }


  /* ══════════════════════════════════════════════════════════
     12. HERO FLOAT CARD count-up
     ══════════════════════════════════════════════════════════ */
  function initHeroCounter() {
    const card = document.querySelector('.floating-experience-card');
    if (!card) return;
    const num = card.querySelector('.exp-number');
    if (!num) return;
    const m = num.textContent.match(/\d+/);
    if (!m) return;
    const tgt = parseInt(m[0], 10);
    num.textContent = '0+';
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / 1200, 1);
          num.textContent = Math.round(p * tgt) + '+';
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        io.unobserve(card);
      });
    }, { threshold: 0.5 });
    io.observe(card);
  }


  /* ══════════════════════════════════════════════════════════
     13. MOBILE FAST REVEAL
     ══════════════════════════════════════════════════════════ */
  function initMobileFastReveal() {
    window.addEventListener('touchmove', () => {
      document.querySelectorAll(
        '.reveal:not(.active), .mission-item:not(.active), .process-step-item:not(.active)'
      ).forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 30)
          el.classList.add('active');
      });
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════════════════════ */
  /* Loader must inject before DOMContentLoaded so it covers the page immediately */
  if (document.body) {
    buildLoader();
  } else {
    document.addEventListener('DOMContentLoaded', buildLoader);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initCursor();
    initStickyHeader();
    initScrollReveals();
    initTextMasks();
    initPageLoad();
    initMagnetic();
    enableFormPushBack(".form-glass-container");
    enableFormPushBack(".index-request-a-call");
    enableFormPushBack(".tutor-form-compact");
    enableFormPushBack(".enrollment-card");
    enableFormPushBack(".contact-form-premium");
    enableFormPushBack(".hero-form-card");
    initRipple();
    initCountUp();
    initHeroCounter();
    initMobileFastReveal();
  });

})();
