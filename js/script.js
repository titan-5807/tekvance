/* =========================================================
   TEKVANCE — script.js
   HARDENED-V3 (every section isolated, no single failure can
   stop the rest of the script from running)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  try {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hide'), 300);
      });
      setTimeout(() => preloader.classList.add('hide'), 1500);
    }
  } catch (err) { console.error('Preloader section error:', err); }

  /* ---------- Year ---------- */
  try {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (err) { console.error('Year section error:', err); }

  /* ---------- Header scroll state ---------- */
  try {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    if (header || backToTop) {
      const onScroll = () => {
        if (header) {
          if (window.scrollY > 40) header.classList.add('scrolled');
          else header.classList.remove('scrolled');
        }
        if (backToTop) {
          if (window.scrollY > 500) backToTop.classList.add('show');
          else backToTop.classList.remove('show');
        }
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
    }
  } catch (err) { console.error('Header scroll section error:', err); }

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
  } catch (err) { console.error('Mobile menu section error:', err); }

  /* ---------- Language toggle (EN / AR) ---------- */
  const htmlRoot = document.getElementById('htmlRoot');
  try {
    const langToggle = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');
    const bilingualEls = document.querySelectorAll('[data-en][data-ar]');

    function setLanguage(lang) {
      bilingualEls.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text !== null) el.textContent = text;
      });
      if (!htmlRoot) return;
      if (lang === 'ar') {
        htmlRoot.setAttribute('lang', 'ar');
        htmlRoot.setAttribute('dir', 'rtl');
        if (langLabel) langLabel.textContent = 'English';
      } else {
        htmlRoot.setAttribute('lang', 'en');
        htmlRoot.setAttribute('dir', 'ltr');
        if (langLabel) langLabel.textContent = 'العربية';
      }
      localStorage.setItem('tekvance_lang', lang);
      if (typeof window.updatePhoneHint === 'function') window.updatePhoneHint();
    }

    if (langToggle && htmlRoot) {
      langToggle.addEventListener('click', () => {
        const current = htmlRoot.getAttribute('lang') === 'ar' ? 'ar' : 'en';
        setLanguage(current === 'ar' ? 'en' : 'ar');
      });
    }
    const savedLang = localStorage.getItem('tekvance_lang');
    if (savedLang) setLanguage(savedLang);
  } catch (err) { console.error('Language toggle section error:', err); }

  /* ---------- Scroll reveal ---------- */
  try {
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
  } catch (err) { console.error('Scroll reveal section error:', err); }

  /* ---------- Counter animation ---------- */
  try {
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
          if (current >= target) { current = target; clearInterval(timer); }
          counter.textContent = current;
        }, 25);
      });
    }
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { animateCounters(); statsObserver.disconnect(); }
        });
      }, { threshold: 0.4 });
      statsObserver.observe(heroStats);
    }
  } catch (err) { console.error('Counter animation section error:', err); }

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
  } catch (err) { console.error('Projects filter section error:', err); }

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
          faqItems.forEach(i => {
            i.classList.remove('active');
            const ans = i.querySelector('.faq-answer');
            const q = i.querySelector('.faq-question');
            if (ans) ans.style.maxHeight = null;
            if (q) q.setAttribute('aria-expanded', 'false');
          });
          if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }
  } catch (err) { console.error('FAQ accordion section error:', err); }

  /* =========================================================
     Contact form validation and Formspree submit
     (fully isolated in its own try block so nothing above
     can ever prevent this from running)
     ========================================================= */
  try {
    const contactForm  = document.getElementById('contactForm');
    const formNote     = document.getElementById('formNote');
    const submitBtn    = document.getElementById('submitBtn');

    const nameInput    = document.getElementById('nameInput');
    const nameError    = document.getElementById('nameError');

    const countryCode  = document.getElementById('countryCode');
    const phoneInput   = document.getElementById('phoneInput');
    const phoneHint    = document.getElementById('phoneHint');
    const phoneError   = document.getElementById('phoneError');
    const phoneFull    = document.getElementById('phoneFull');

    const emailInput   = document.getElementById('emailInput');
    const emailError   = document.getElementById('emailError');

    const messageInput = document.getElementById('messageInput');
    const messageError = document.getElementById('messageError');

    function isArabic() {
      return htmlRoot && htmlRoot.getAttribute('lang') === 'ar';
    }

    function markField(input, errorEl, valid, message) {
      if (input) {
        input.classList.toggle('is-invalid', !valid);
        input.classList.toggle('is-valid', valid && input.value.length > 0);
        input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      }
      if (errorEl) errorEl.textContent = valid ? '' : (message || '');
    }

    /* ============ NAME ============ */
    const NAME_ALLOWED_RE = /^[A-Za-z\u0600-\u06FF ]$/;
    const NAME_STRIP_RE = /[^A-Za-z\u0600-\u06FF\s]/g;
    const NAME_FULL_RE = /^[A-Za-z\u0600-\u06FF]{2,25}(?:\s[A-Za-z\u0600-\u06FF]{2,25})+$/;

    function cleanName(value) {
      return value.replace(NAME_STRIP_RE, '').replace(/\s{2,}/g, ' ').replace(/^\s+/, '').slice(0, 50);
    }

    function validateName(showMsg = true) {
      if (!nameInput) return true;
      nameInput.value = cleanName(nameInput.value);
      const value = nameInput.value.trim();
      const valid = NAME_FULL_RE.test(value) && value.length >= 3 && value.length <= 50;
      const msg = isArabic()
        ? 'من فضلك أدخل اسمًا كاملًا واضحًا (اسم أول واسم عائلة على الأقل)، حروف فقط بدون أرقام أو رموز.'
        : 'Please enter a clear full name (first and last name), letters only, no digits or symbols.';
      markField(nameInput, nameError, valid, showMsg ? msg : '');
      return valid;
    }

    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'];
        if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
        if (e.key.length === 1 && !NAME_ALLOWED_RE.test(e.key)) e.preventDefault();
      });
      nameInput.addEventListener('input', () => validateName(true));
      nameInput.addEventListener('paste', () => setTimeout(() => validateName(true), 0));
      nameInput.addEventListener('blur', () => validateName(true));
    }

    /* ============ EMAIL ============ */
    const EMAIL_ALLOWED_RE = /^[A-Za-z0-9._%+\-@]$/;
    const EMAIL_STRIP_RE = /[^A-Za-z0-9._%+\-@]/g;
    const EMAIL_FULL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/;

    function validateEmail(showMsg = true) {
      if (!emailInput) return true;
      emailInput.value = emailInput.value.replace(EMAIL_STRIP_RE, '').slice(0, 100);
      const value = emailInput.value.trim();
      const valid = EMAIL_FULL_RE.test(value);
      const msg = isArabic()
        ? 'من فضلك أدخل بريد إلكتروني صحيح مثل example@email.com (حروف وأرقام إنجليزية فقط).'
        : 'Please enter a valid email address like example@email.com.';
      markField(emailInput, emailError, valid, showMsg ? msg : '');
      return valid;
    }

    if (emailInput) {
      emailInput.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'];
        if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
        if (e.key.length === 1 && !EMAIL_ALLOWED_RE.test(e.key)) e.preventDefault();
      });
      emailInput.addEventListener('input', () => validateEmail(true));
      emailInput.addEventListener('paste', () => setTimeout(() => validateEmail(true), 0));
      emailInput.addEventListener('blur', () => validateEmail(true));
    }

    /* ============ PHONE ============ */
    const countryRules = {
      '20':  { digits: 10, startsWith: ['1'] },
      '966': { digits: 9,  startsWith: ['5'] },
      '971': { digits: 9,  startsWith: ['5'] },
      '965': { digits: 8,  startsWith: [] },
      '974': { digits: 8,  startsWith: [] },
      '973': { digits: 8,  startsWith: [] },
      '968': { digits: 8,  startsWith: [] },
      '962': { digits: 9,  startsWith: ['7'] },
      '964': { digits: 10, startsWith: ['7'] },
      '218': { digits: 9,  startsWith: ['9'] },
      '1':   { digits: 10, startsWith: [] },
      '44':  { digits: 10, startsWith: ['7'] }
    };

    function getPhoneRule() {
      if (!countryCode) return { digits: 10, startsWith: [] };
      const opt = countryCode.options[countryCode.selectedIndex];
      const fallback = opt ? parseInt(opt.getAttribute('data-digits'), 10) : 10;
      return countryRules[countryCode.value] || { digits: fallback || 10, startsWith: [] };
    }

    function normalizePhoneDigits(value) {
      return value
        .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
        .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06F0));
    }

    function updatePhoneHint() {
      if (!countryCode || !phoneHint) return;
      const rule = getPhoneRule();
      phoneHint.textContent = isArabic()
        ? `أدخل ${rule.digits} أرقام فقط بدون كود الدولة وبدون الصفر في البداية`
        : `Enter ${rule.digits} digits only, without country code or leading 0`;
      if (phoneInput) phoneInput.setAttribute('maxlength', String(rule.digits));
    }

    function updateFullPhone() {
      if (!countryCode || !phoneInput || !phoneFull) return;
      phoneFull.value = phoneInput.value ? `+${countryCode.value}${phoneInput.value}` : '';
    }

    function validatePhone(showMsg = true) {
      if (!phoneInput || !countryCode) return true;
      const rule = getPhoneRule();
      const normalized = normalizePhoneDigits(phoneInput.value);
      phoneInput.value = normalized.replace(/[^0-9]/g, '').slice(0, rule.digits);
      const value = phoneInput.value;
      const hasValue = value.length > 0;
      const lengthOk = value.length === rule.digits;
      const startOk  = !rule.startsWith.length || rule.startsWith.some(p => value.startsWith(p));
      const valid = lengthOk && startOk;
      const msg = isArabic()
        ? `رقم الهاتف يجب أن يكون ${rule.digits} أرقام بالظبط${rule.startsWith.length ? ' ويبدأ بـ ' + rule.startsWith.join(' أو ') : ''}.`
        : `Phone number must be exactly ${rule.digits} digits${rule.startsWith.length ? ', starting with ' + rule.startsWith.join(' or ') : ''}.`;
      markField(phoneInput, phoneError, !hasValue ? true : valid, showMsg && hasValue ? msg : '');
      updateFullPhone();
      return valid;
    }

    if (countryCode && phoneInput) {
      phoneInput.setAttribute('inputmode', 'numeric');
      phoneInput.setAttribute('pattern', '[0-9]*');
      phoneInput.setAttribute('autocomplete', 'tel-national');

      phoneInput.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'];
        if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
        const isDigitKey = /^[0-9٠-٩]$/.test(e.key);
        if (!isDigitKey) { e.preventDefault(); return; }
        const rule = getPhoneRule();
        const selectionLength = (phoneInput.selectionEnd || 0) - (phoneInput.selectionStart || 0);
        const currentDigitCount = normalizePhoneDigits(phoneInput.value).replace(/[^0-9]/g, '').length;
        const nextDigitCount = currentDigitCount - selectionLength + 1;
        if (nextDigitCount > rule.digits) e.preventDefault();
      });

      phoneInput.addEventListener('input', () => validatePhone(true));
      phoneInput.addEventListener('paste', () => setTimeout(() => validatePhone(true), 0));
      phoneInput.addEventListener('drop', () => setTimeout(() => validatePhone(true), 0));
      phoneInput.addEventListener('blur', () => validatePhone(true));

      countryCode.addEventListener('change', () => {
        phoneInput.value = '';
        markField(phoneInput, phoneError, true, '');
        updatePhoneHint();
        updateFullPhone();
      });

      updatePhoneHint();
      updateFullPhone();
    }

    /* ============ MESSAGE ============ */
    function sanitizeMessage(value) {
      return value.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '');
    }

    function validateMessage(showMsg = true) {
      if (!messageInput) return true;
      messageInput.value = sanitizeMessage(messageInput.value);
      const trimmed = messageInput.value.trim();
      const valid = trimmed.length >= 10 && trimmed.length <= 1000;
      const msg = isArabic()
        ? 'الرسالة يجب ألا تقل عن 10 أحرف ولا تزيد عن 1000 حرف.'
        : 'Message must be between 10 and 1000 characters.';
      markField(messageInput, messageError, valid, showMsg ? msg : '');
      return valid;
    }

    if (messageInput) {
      messageInput.addEventListener('input', () => validateMessage(true));
      messageInput.addEventListener('blur', () => validateMessage(true));
    }

    window.updatePhoneHint = updatePhoneHint;
    window.validateTekvancePhone = () => validatePhone(true);

    /* ============ SUBMIT ============ */
    if (contactForm) {
      contactForm.setAttribute('novalidate', 'novalidate');
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const endpoint = contactForm.getAttribute('action');

        const okName    = validateName(true);
        const okPhone   = validatePhone(true);
        const okEmail   = validateEmail(true);
        const okMessage = validateMessage(true);

        if (!okName || !okPhone || !okEmail || !okMessage) {
          if (formNote) {
            formNote.textContent = isArabic()
              ? '⚠️ برجاء تصحيح الحقول المظللة قبل إرسال الرسالة.'
              : '⚠️ Please correct the highlighted fields before sending.';
            formNote.className = 'form-note error';
          }
          return;
        }

        if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
          if (formNote) {
            formNote.textContent = isArabic()
              ? '⚠️ رابط Formspree غير موجود داخل نموذج الإرسال.'
              : '⚠️ Formspree endpoint is missing in the form action attribute.';
            formNote.className = 'form-note error';
          }
          return;
        }

        if (submitBtn) submitBtn.disabled = true;
        const originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) submitBtn.textContent = isArabic() ? 'جارٍ الإرسال...' : 'Sending...';

        try {
          const formData = new FormData(contactForm);
          if (nameInput) formData.set('name', nameInput.value.trim());
          if (emailInput) formData.set('email', emailInput.value.trim());
          if (phoneFull) formData.set('phone', phoneFull.value);
          if (messageInput) formData.set('message', messageInput.value.trim());

          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (!response.ok) throw new Error('Submission failed with status ' + response.status);

          if (formNote) {
            formNote.textContent = isArabic()
              ? '✅ تم استلام رسالتك بنجاح، سنتواصل معك في أقرب وقت.'
              : '✅ Your message has been sent successfully. We will contact you shortly.';
            formNote.className = 'form-note success';
          }
          contactForm.reset();
          markField(nameInput, nameError, true, '');
          markField(emailInput, emailError, true, '');
          markField(phoneInput, phoneError, true, '');
          markField(messageInput, messageError, true, '');
          updatePhoneHint();
          updateFullPhone();
        } catch (err) {
          console.error('Form submission error:', err);
          if (formNote) {
            formNote.textContent = isArabic()
              ? '❌ حدث خطأ أثناء الإرسال، برجاء المحاولة مرة أخرى أو التواصل عبر الهاتف.'
              : '❌ Something went wrong. Please try again or contact us by phone.';
            formNote.className = 'form-note error';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        }
      });
    }
  } catch (err) {
    console.error('Contact form validation section error:', err);
  }

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
          p.x += p.vx; p.y += p.vy;
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
      window.addEventListener('resize', () => { resize(); initParticles(); });
    }
  } catch (err) { console.error('Network canvas section error:', err); }
});
