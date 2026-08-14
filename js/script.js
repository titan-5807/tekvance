/* =========================================================
   TEKVANCE — script.js
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hide'), 300);
    });
    setTimeout(() => preloader.classList.add('hide'), 1500);
  }
  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('mainNav');
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
  /* ---------- Language toggle (EN / AR) ---------- */
  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');
  const htmlRoot = document.getElementById('htmlRoot');
  const bilingualEls = document.querySelectorAll('[data-en][data-ar]');
  function setLanguage(lang) {
    bilingualEls.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) el.textContent = text;
    });
    if (lang === 'ar') {
      htmlRoot.setAttribute('lang', 'ar');
      htmlRoot.setAttribute('dir', 'rtl');
      langLabel.textContent = 'English';
    } else {
      htmlRoot.setAttribute('lang', 'en');
      htmlRoot.setAttribute('dir', 'ltr');
      langLabel.textContent = 'العربية';
    }
    localStorage.setItem('tekvance_lang', lang);
  }
  langToggle.addEventListener('click', () => {
    const current = htmlRoot.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    setLanguage(current === 'ar' ? 'en' : 'ar');
  });
  // Restore saved language preference
  const savedLang = localStorage.getItem('tekvance_lang');
  if (savedLang) setLanguage(savedLang);
  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.vm-card, .service-card, .process-step, .info-card, .floating-card, .about-visual, .why-content, .contact-form, .project-card, .testimonial-card'
  );
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
  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('.num');
  let countersStarted = false;
  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
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
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
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
  /* ---------- Projects filter (Projects page only) ---------- */
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
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
  /* ---------- Contact form -> Formspree (real submission via AJAX) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitBtn = document.getElementById('submitBtn');
  if (contactForm) {
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
  /* ---------- Animated network canvas (hero) ---------- */
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
});
