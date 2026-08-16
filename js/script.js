/* =========================================================
   TEKVANCE — script.js
   Hardened version: every feature runs independently so a
   missing element on one page never breaks another feature
   (most importantly, the language toggle).
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const htmlRoot = document.getElementById('htmlRoot') || document.documentElement;

  /* ---------- Preloader ---------- */
  try {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hide'), 300);
      });
      setTimeout(() => preloader.classList.add('hide'), 1500);
    }
  } catch (err) { console.error('Preloader error:', err); }

  /* ---------- Year ---------- */
  try {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (err) { console.error('Year error:', err); }

  /* ---------- Header scroll state ---------- */
  try {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    if (header || backToTop) {
      const onScroll = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);
        if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
    }
  } catch (err) { console.error('Header/back-to-top error:', err); }

  /* ---------- Mobile menu ---------- */
  try {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('mainNav');
    if (burger && nav) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        nav.classList.toggle('open');
      });
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          burger.classList.remove('open');
          nav.classList.remove('open');
        });
      });
    }
  } catch (err) { console.error('Mobile menu error:', err); }

  /* ==========================================================
     Language toggle (EN / AR) — this block is fully independent
     from everything else above and below it, and is wrapped in
     its own try/catch so it ALWAYS runs regardless of what
     happens elsewhere on the page.
     ========================================================== */
  try {
    const langToggle = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');

    // Elements whose visible text switches between English/Arabic
    const bilingualEls = document.querySelectorAll('[data-en][data-ar]');
    // Elements whose `title` tooltip switches between English/Arabic
    const titledEls = document.querySelectorAll('[data-title-en][data-title-ar]');
    // Elements whose `placeholder` switches between English/Arabic
    const placeholderEls = document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]');

    function applyLanguage(lang) {
      bilingualEls.forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text !== null) el.textContent = text;
      });
      titledEls.forEach(el => {
        const t = el.getAttribute('data-title-' + lang);
        if (t !== null) el.setAttribute('title', t);
      });
      placeholderEls.forEach(el => {
        const p = el.getAttribute('data-placeholder-' + lang);
        if (p !== null) el.setAttribute('placeholder', p);
      });

      if (lang === 'ar') {
        htmlRoot.setAttribute('lang', 'ar');
        htmlRoot.setAttribute('dir', 'rtl');
        if (langLabel) langLabel.textContent = 'English';
      } else {
        htmlRoot.setAttribute('lang', 'en');
        htmlRoot.setAttribute('dir', 'ltr');
        if (langLabel) langLabel.textContent = 'العربية';
      }

      try { localStorage.setItem('tekvance_lang', lang); } catch (e) { /* ignore storage errors */ }
    }

    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const current = htmlRoot.getAttribute('lang') === 'ar' ? 'ar' : 'en';
        applyLanguage(current === 'ar' ? 'en' : 'ar');
      });
    }

    // Restore saved language preference on page load (if any)
    let savedLang = null;
    try { savedLang = localStorage.getItem('tekvance_lang'); } catch (e) { /* ignore storage errors */ }
    if (savedLang === 'ar' || savedLang === 'en') {
      applyLanguage(savedLang);
    }
  } catch (err) {
    console.error('Language toggle error:', err);
  }

  /* ---------- Scroll reveal ---------- */
  try {
    const revealTargets = document.querySelectorAll(
      '.vm-card, .service-card, .process-step, .info-card, .floating-card, .about-visual, .why-content, .contact-form, .project-card, .testimonial-card'
    );
    if (revealTargets.length) {
      revealTargets.forEach(el => el.classList.add('reveal'));
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealTargets.forEach(el => revealObserver.observe(el));
    }
  } catch (err) { console.error('Scroll reveal error:', err); }

  /* ---------- Counter animation ---------- */
  try {
    const counters = document.querySelectorAll('.num');
    const heroStats = document.querySelector('.hero-stats');
    if (counters.length && heroStats) {
      let countersStarted = false;
      function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 60));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = current;
          }, 25);
        });
      }
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });
      statsObserver.observe(heroStats);
    }
  } catch (err) { console.error('Counter animation error:', err); }

  /* ---------- Projects filter (Projects page only) ---------- */
  try {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (filterBtns.length && projectCards.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');
          projectCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
          });
        });
      });
    }
  } catch (err) { console.error('Projects filter error:', err); }

  /* ---------- FAQ accordion ---------- */
  try {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(other => {
            other.classList.remove('active');
            const otherQuestion = other.querySelector('.faq-question');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          });
          if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
      });
    }
  } catch (err) { console.error('FAQ accordion error:', err); }

  /* ---------- Contact form -> Formspree (real submission via AJAX) ---------- */
  try {
    const contactForm = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');
    const submitBtn = document.getElementById('submitBtn');
    if (contactForm && formNote && submitBtn) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isAr = htmlRoot.getAttribute('lang') === 'ar';
        const endpoint = contactForm.getAttribute('action');
        if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
          formNote.textContent = isAr
            ? '⚠️ لسه محتاج تحط رابط Formspree بتاعك في الكود (action attribute).'
            : '⚠️ Please set your Formspree endpoint in the form action attribute.';
          formNote.className = 'form-note error';
          return;
        }
        submitBtn.disabled = true;
        const originalLabel = submitBtn.textContent;
        submitBtn.textContent = isAr ? 'جارٍ الإرسال...' : 'Sending...';
        try {
          const formData = new FormData(contactForm);
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            formNote.textContent = isAr
              ? '✅ تم استلام رسالتك بنجاح، سنتواصل معك في أقرب وقت.'
              : '✅ Your message has been sent successfully. We will contact you shortly.';
            formNote.className = 'form-note success';
            contactForm.reset();
          } else {
            throw new Error('Submission failed with status ' + response.status);
          }
        } catch (err) {
          console.error('Form submission error:', err);
          formNote.textContent = isAr
            ? '❌ حدث خطأ أثناء الإرسال، برجاء المحاولة مرة أخرى أو التواصل عبر الهاتف.'
            : '❌ Something went wrong. Please try again or contact us by phone.';
          formNote.className = 'form-note error';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
          setTimeout(() => { formNote.textContent = ''; formNote.className = 'form-note'; }, 7000);
        }
      });
    }
  } catch (err) { console.error('Contact form error:', err); }

  /* ---------- Animated network canvas (hero) ---------- */
  try {
    const canvas = document.getElementById('networkCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let width, height;
      function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
      function initParticles() {
        const count = Math.min(70, Math.floor((width * height) / 18000));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.6 + 0.6
        }));
      }
      function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              ctx.strokeStyle = `rgba(62,198,255,${0.16 * (1 - dist / 140)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(100,209,255,0.8)';
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      resize();
      initParticles();
      draw();
      window.addEventListener('resize', () => {
        resize();
        initParticles();
      });
    }
  } catch (err) { console.error('Network canvas error:', err); }

});
