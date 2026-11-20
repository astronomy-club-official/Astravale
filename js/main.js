/* ============================================================
   AstraVale | Main JavaScript
   Professional GSAP Animations, Optical Calibration Intro, Fast Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     OPTICAL CALIBRATION HUD (Professional & Lightweight Intro)
     ============================================================ */
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.querySelector('.loading-bar-fill');
  const loadingPct = document.getElementById('loading-pct');
  const statusLabel = document.getElementById('loading-status-text');
  const opticsStatus = document.getElementById('optics-status');

  document.body.style.overflow = 'hidden';

  // Fast, sleek calibration timeline
  let progressVal = 0;
  const progressObj = { value: 0 };

  const telemetrySteps = [
    { at: 20, text: 'SCANNING FIELD', sub: 'COLLIMATION: 20%' },
    { at: 55, text: 'ALIGNING OPTICS', sub: 'COLLIMATION: 58%' },
    { at: 85, text: 'FOCAL LOCK f/2.8', sub: 'COLLIMATION: 88%' },
    { at: 100, text: 'OPTICS ALIGNED | READY', sub: 'COLLIMATION: 100%' }
  ];

  function updateTelemetry(val) {
    if (loadingPct) loadingPct.textContent = `${Math.round(val)}%`;
    if (loadingBar) loadingBar.style.width = `${val}%`;

    for (let i = telemetrySteps.length - 1; i >= 0; i--) {
      if (val >= telemetrySteps[i].at) {
        if (statusLabel && statusLabel.textContent !== telemetrySteps[i].text) {
          statusLabel.textContent = telemetrySteps[i].text;
        }
        if (opticsStatus && opticsStatus.textContent !== telemetrySteps[i].sub) {
          opticsStatus.textContent = telemetrySteps[i].sub;
        }
        break;
      }
    }
  }

  // Smooth, snappy loading animation (~850ms)
  if (typeof gsap !== 'undefined') {
    gsap.to(progressObj, {
      value: 100,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: () => updateTelemetry(progressObj.value),
      onComplete: finishLoading
    });
  } else {
    // Fallback animation
    const interval = setInterval(() => {
      progressVal += 12;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
        updateTelemetry(100);
        setTimeout(finishLoading, 200);
      } else {
        updateTelemetry(progressVal);
      }
    }, 50);
  }

  function finishLoading() {
    if (!loadingScreen) return;

    if (typeof gsap !== 'undefined') {
      const exitTl = gsap.timeline({
        onComplete: () => {
          loadingScreen.classList.add('hide');
          document.body.style.overflow = '';
          initGSAP();
        }
      });

      exitTl.to('.optics-core', {
        scale: 1.15,
        filter: 'drop-shadow(0 0 40px rgba(6, 182, 212, 0.9))',
        duration: 0.25,
        ease: 'power2.out'
      })
      .to(loadingScreen, {
        opacity: 0,
        scale: 1.04,
        duration: 0.5,
        ease: 'power3.inOut'
      }, '-=0.1');
    } else {
      loadingScreen.classList.add('hide');
      document.body.style.overflow = '';
    }
  }

  // Safety fallback in case of hanging
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hide')) {
      loadingScreen.classList.add('hide');
      document.body.style.overflow = '';
      initGSAP();
    }
  }, 2200);


  /* ============================================================
     NAVBAR
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  /* ============================================================
     SMOOTH SCROLL WITH OFFSET
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(target * ease);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.counter);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, suffix);
      }
    });
  }, { threshold: 0.4 });

  counterEls.forEach(el => counterObserver.observe(el));


  /* ============================================================
     GSAP PROFESSIONAL ANIMATION SUITE
     ============================================================ */
  let gsapInitialized = false;

  function initGSAP() {
    if (gsapInitialized) return;
    gsapInitialized = true;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.timeline-item, .feature-card, .gallery-slot, .participant-stat-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* --- 1. HERO ENTRANCE TIMELINE --- */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .fromTo('#navbar', {
        y: -30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      })
      .fromTo('.hero-title .line-inner', {
        y: 60,
        opacity: 0,
        filter: 'blur(10px)'
      }, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.18,
        ease: 'power4.out'
      }, '-=0.4')
      .fromTo('.hero-subtitle', {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8
      }, '-=0.5')
      .fromTo('.hero-buttons .btn-cosmic, .hero-buttons .btn-ghost', {
        y: 25,
        opacity: 0,
        scale: 0.95
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.5)'
      }, '-=0.5')
      .fromTo('.hero-stats', {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8
      }, '-=0.4')
      .fromTo('.hero-scroll', {
        opacity: 0,
        y: -10
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, '-=0.3');

    /* --- 2. FLOATING COSMIC ORBS --- */
    document.querySelectorAll('.hero-cosmic-orb').forEach((orb, i) => {
      gsap.to(orb, {
        y: `+=${25 + i * 8}`,
        x: `+=${15 + i * 6}`,
        duration: 5 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    /* --- 3. SECTION HEADERS REVEAL --- */
    document.querySelectorAll('.section-header').forEach(header => {
      const tag = header.querySelector('.section-tag');
      const title = header.querySelector('.section-title');
      const subtitle = header.querySelector('.section-subtitle');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      if (tag) {
        tl.fromTo(tag, { opacity: 0, y: 15, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' });
      }
      if (title) {
        tl.fromTo(title, { opacity: 0, y: 25, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' }, '-=0.25');
      }
      if (subtitle) {
        tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35');
      }
    });

    /* --- 4. CURRICULUM TIMELINE & PROGRESS LINE --- */
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');

    if (timelineProgress) {
      gsap.to(timelineProgress, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-wrapper',
          start: 'top 65%',
          end: 'bottom 45%',
          scrub: 0.4
        }
      });
    }

    timelineItems.forEach((item, i) => {
      const dot = item.querySelector('.timeline-dot');
      const card = item.querySelector('.timeline-card');
      const isOdd = i % 2 === 0;

      gsap.fromTo(item, {
        opacity: 0,
        x: isOdd ? -50 : 50,
        y: 20
      }, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });

      if (dot) {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          onEnter: () => dot.classList.add('active')
        });
      }
    });

    /* --- 5. FEATURE CARDS REVEAL & 60FPS 3D TILT --- */
    const featureCards = document.querySelectorAll('.feature-card');

    gsap.fromTo(featureCards, {
      opacity: 0,
      y: 35,
      scale: 0.94
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#features .features-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // High performance 3D Tilt with gsap.quickTo
    featureCards.forEach(card => {
      const setRotateX = gsap.quickTo(card, 'rotateX', { duration: 0.35, ease: 'power2.out' });
      const setRotateY = gsap.quickTo(card, 'rotateY', { duration: 0.35, ease: 'power2.out' });
      const setY = gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power2.out' });

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

        const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
        const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

        setRotateX(rotX);
        setRotateY(rotY);
        setY(-8);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        setRotateX(0);
        setRotateY(0);
        setY(0);
      });
    });

    /* --- 6. STUDENT GALLERY REVEAL --- */
    const gallerySlots = document.querySelectorAll('.gallery-slot');

    gsap.fromTo(gallerySlots, {
      opacity: 0,
      y: 30,
      scale: 0.92
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.07,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#gallery .gallery-grid',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    /* --- 7. PARTICIPANTS & STAT CARDS --- */
    const statCards = document.querySelectorAll('.participant-stat-card');
    gsap.fromTo(statCards, {
      opacity: 0,
      y: 35,
      scale: 0.94
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.participants-hero',
        start: 'top 78%',
        toggleActions: 'play none none none'
      }
    });

    /* --- 8. BEST MEMBERS CARDS --- */
    const bestMemberCards = document.querySelectorAll('.best-member-card');
    gsap.fromTo(bestMemberCards, {
      opacity: 0,
      y: 35,
      scale: 0.92
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.best-members-grid',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    /* --- 9. FOOTER REVEAL --- */
    gsap.fromTo('#footer .footer-grid', {
      opacity: 0,
      y: 25
    }, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#footer',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

  } // end initGSAP


  /* ============================================================
     ENROLL MODAL
     ============================================================ */
  const enrollTriggers = document.querySelectorAll('.enroll-trigger');
  const modal = document.getElementById('enroll-modal');
  const modalClose = document.getElementById('modal-close');

  if (enrollTriggers.length && modal) {
    enrollTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

}); // end DOMContentLoaded
