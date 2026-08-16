/* =========================================================
   TEKVANCE — script.js
   Hardened version: every feature runs independently so a
   missing element on one page never breaks another feature
   (most importantly, the language toggle).
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const htmlRoot = document.getElementById('htmlRoot') || document.documentElement;
  function isAr() { return htmlRoot.getAttribute('lang') === 'ar'; }

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
  let applyLanguageFn = null;
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

      // Re-apply dynamic phone hints (country-specific) whenever the
      // language changes, since their text is language-dependent too.
      document.querySelectorAll('.country-select').forEach(sel => {
        const evt = new Event('change');
        sel.dispatchEvent(evt);
      });
    }
    applyLanguageFn = applyLanguage;

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
  } catch (err) { console.error('Scroll reveal error:', err); }

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
            if (filter === 'all' || cat === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
  } catch (err) { console.error('Projects filter error:', err); }

  /* ==========================================================
     FAQ accordion
     ========================================================== */
  try {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          const otherQuestion = other.querySelector('.faq-question');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  } catch (err) { console.error('FAQ accordion error:', err); }

  /* ==========================================================
     GENERIC FORM FIELD VALIDATION MODULE
     Reused by both the Contact form and the Careers form so
     that every field (name / phone / email / message / select)
     is actually validated in real time AND blocks submission
     when invalid — instead of silently accepting anything,
     since both forms use novalidate to fully control the UX.
     ========================================================== */
  const Validation = (() => {
    const NAME_RE = /^[A-Za-z\u0600-\u06FF]+(?:[\s'-][A-Za-z\u0600-\u06FF]+)+$/;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const MESSAGES = {
      required: { en: 'This field is required.', ar: 'هذا الحقل مطلوب.' },
      name: { en: 'Please enter your first and last name using letters only.', ar: 'برجاء إدخال الاسم الأول والأخير بحروف فقط.' },
      email: { en: 'Please enter a valid email address.', ar: 'برجاء إدخال بريد إلكتروني صحيح.' },
      phoneDigits: { en: 'Phone number must contain digits only.', ar: 'رقم الهاتف يجب أن يحتوي على أرقام فقط.' },
      phoneLength: { en: 'Phone number length does not match the selected country.', ar: 'عدد أرقام الهاتف لا يتطابق مع الدولة المختارة.' },
      minLength: { en: 'This field is too short.', ar: 'هذا الحقل قصير جدًا.' },
      selectRequired: { en: 'Please select an option.', ar: 'برجاء اختيار قيمة.' }
    };

    function msg(key) { return isAr() ? MESSAGES[key].ar : MESSAGES[key].en; }

    function setState(input, errorEl, valid, message) {
      if (valid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (errorEl) errorEl.textContent = '';
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = message || '';
      }
      return valid;
    }

    function clearState(input, errorEl) {
      input.classList.remove('is-invalid', 'is-valid');
      if (errorEl) errorEl.textContent = '';
    }

    function validateName(input, errorEl) {
      const value = input.value.trim();
      if (!value) return setState(input, errorEl, false, msg('required'));
      if (value.length < (parseInt(input.getAttribute('minlength'), 10) || 3)) {
        return setState(input, errorEl, false, msg('minLength'));
      }
      if (!NAME_RE.test(value)) return setState(input, errorEl, false, msg('name'));
      return setState(input, errorEl, true);
    }

    function validateEmail(input, errorEl) {
      const value = input.value.trim();
      if (!value) return setState(input, errorEl, false, msg('required'));
      if (!EMAIL_RE.test(value)) return setState(input, errorEl, false, msg('email'));
      return setState(input, errorEl, true);
    }

    function validatePhone(input, errorEl, countrySelect) {
      const digits = input.value.replace(/\D/g, '');
      if (input.value !== digits) input.value = digits; // strip anything non-numeric as the user types
      if (!digits) return setState(input, errorEl, false, msg('required'));
      const expectedDigits = countrySelect && countrySelect.selectedOptions[0]
        ? parseInt(countrySelect.selectedOptions[0].getAttribute('data-digits'), 10)
        : null;
      if (expectedDigits && digits.length !== expectedDigits) {
        return setState(input, errorEl, false, msg('phoneLength'));
      }
      return setState(input, errorEl, true);
    }

    function validateRequiredText(input, errorEl) {
      const value = input.value.trim();
      const minLen = parseInt(input.getAttribute('minlength'), 10) || 0;
      if (!value) return setState(input, errorEl, false, msg('required'));
      if (minLen && value.length < minLen) return setState(input, errorEl, false, msg('minLength'));
      return setState(input, errorEl, true);
    }

    function validateSelectRequired(select, errorEl) {
      if (!select.value) return setState(select, errorEl, false, msg('selectRequired'));
      return setState(select, errorEl, true);
    }

    function shake(el) {
      el.classList.remove('shake');
      // Force reflow so the animation can restart if triggered repeatedly
      void el.offsetWidth;
      el.classList.add('shake');
    }

    return {
      validateName, validateEmail, validatePhone,
      validateRequiredText, validateSelectRequired,
      clearState, shake, msg
    };
  })();

  /* ==========================================================
     Dynamic phone hint + placeholder based on selected country
     Fixes the bug where the hint text always said "10 digits"
     regardless of which country was actually selected.
     Wires up: countryCode <-> phoneInput/phoneHint (Contact form)
               careerCountryCode <-> careerPhoneInput/careerPhoneHint (Careers form)
     ========================================================== */
  function wireCountryHint(selectId, inputId, hintId, errorId) {
    try {
      const select = document.getElementById(selectId);
      const input = document.getElementById(inputId);
      const hint = document.getElementById(hintId);
      const errorEl = errorId ? document.getElementById(errorId) : null;
      if (!select || !input || !hint) return;

      function refresh() {
        const opt = select.selectedOptions[0];
        if (!opt) return;
        const hintText = opt.getAttribute(isAr() ? 'data-hint-ar' : 'data-hint-en');
        if (hintText) hint.textContent = hintText;
        const ph = opt.getAttribute('data-ph');
        if (ph) input.setAttribute('placeholder', ph);
        // Re-validate the phone value against the newly selected country
        // only if the user already typed something, so we don't show an
        // error on a field the user hasn't touched yet.
        if (input.value && errorEl) {
          Validation.validatePhone(input, errorEl, select);
        }
      }

      select.addEventListener('change', refresh);
      refresh(); // set correct hint immediately on page load (Egypt by default)
    } catch (err) {
      console.error('Country hint wiring error (' + selectId + '):', err);
    }
  }
  wireCountryHint('countryCode', 'phoneInput', 'phoneHint', 'phoneError');
  wireCountryHint('careerCountryCode', 'careerPhoneInput', 'careerPhoneHint', 'careerPhoneError');

  /* ==========================================================
     Contact form — real-time validation + AJAX submit
     ========================================================== */
  try {
    const contactForm = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');
    const submitBtn = document.getElementById('submitBtn');
    const nameInput = document.getElementById('nameInput');
    const nameError = document.getElementById('nameError');
    const emailInput = document.getElementById('emailInput');
    const emailError = document.getElementById('emailError');
    const phoneInput = document.getElementById('phoneInput');
    const phoneError = document.getElementById('phoneError');
    const phoneFull = document.getElementById('phoneFull');
    const countryCode = document.getElementById('countryCode');
    const messageInput = document.getElementById('messageInput');
    const messageError = document.getElementById('messageError');

    function syncContactPhone() {
      if (!countryCode || !phoneInput || !phoneFull) return;
      const code = countryCode.value;
      const digits = phoneInput.value.replace(/\D/g, '');
      phoneFull.value = digits ? `+${code}${digits}` : '';
    }

    if (contactForm) {
      if (nameInput) nameInput.addEventListener('input', () => Validation.validateName(nameInput, nameError));
      if (nameInput) nameInput.addEventListener('blur', () => Validation.validateName(nameInput, nameError));

      if (emailInput) emailInput.addEventListener('input', () => Validation.validateEmail(emailInput, emailError));
      if (emailInput) emailInput.addEventListener('blur', () => Validation.validateEmail(emailInput, emailError));

      if (phoneInput) {
        phoneInput.addEventListener('input', () => {
          Validation.validatePhone(phoneInput, phoneError, countryCode);
          syncContactPhone();
        });
        phoneInput.addEventListener('blur', () => Validation.validatePhone(phoneInput, phoneError, countryCode));
      }
      if (countryCode) {
        countryCode.addEventListener('change', () => {
          syncContactPhone();
          if (phoneInput && phoneInput.value) Validation.validatePhone(phoneInput, phoneError, countryCode);
        });
      }

      if (messageInput) {
        messageInput.addEventListener('input', () => Validation.validateRequiredText(messageInput, messageError));
        messageInput.addEventListener('blur', () => Validation.validateRequiredText(messageInput, messageError));
      }

      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        syncContactPhone();

        let valid = true;
        if (nameInput && !Validation.validateName(nameInput, nameError)) { valid = false; Validation.shake(nameInput); }
        if (emailInput && !Validation.validateEmail(emailInput, emailError)) { valid = false; Validation.shake(emailInput); }
        if (phoneInput && !Validation.validatePhone(phoneInput, phoneError, countryCode)) { valid = false; Validation.shake(phoneInput); }
        if (messageInput && !Validation.validateRequiredText(messageInput, messageError)) { valid = false; Validation.shake(messageInput); }

        if (!valid) {
          if (formNote) {
            formNote.textContent = isAr()
              ? '⚠️ برجاء تصحيح الحقول المظللة باللون الأحمر قبل الإرسال.'
              : '⚠️ Please correct the highlighted fields before submitting.';
            formNote.className = 'form-note error';
          }
          const firstInvalid = contactForm.querySelector('.is-invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        if (!formNote || !submitBtn) return;
        const endpoint = contactForm.getAttribute('action');
        if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
          formNote.textContent = isAr()
            ? '⚠️ لسه محتاج تحط رابط Formspree بتاعك في الكود (action attribute).'
            : '⚠️ Please set your Formspree endpoint in the form action attribute.';
          formNote.className = 'form-note error';
          return;
        }
        submitBtn.disabled = true;
        const originalLabel = submitBtn.textContent;
        submitBtn.textContent = isAr() ? 'جارٍ الإرسال...' : 'Sending...';
        try {
          const formData = new FormData(contactForm);
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            formNote.textContent = isAr()
              ? '✅ تم استلام رسالتك بنجاح، سنتواصل معك في أقرب وقت.'
              : '✅ Your message has been sent successfully. We will contact you shortly.';
            formNote.className = 'form-note success';
            contactForm.reset();
            if (nameInput) Validation.clearState(nameInput, nameError);
            if (emailInput) Validation.clearState(emailInput, emailError);
            if (phoneInput) Validation.clearState(phoneInput, phoneError);
            if (messageInput) Validation.clearState(messageInput, messageError);
          } else {
            throw new Error('Submission failed with status ' + response.status);
          }
        } catch (err) {
          console.error('Form submission error:', err);
          formNote.textContent = isAr()
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

  /* ==========================================================
     Careers page — CV upload widget (drag & drop UX + validation)
     ========================================================== */
  try {
    const fileUpload = document.getElementById('cvFileUpload');
    const fileInput = document.getElementById('cvFileInput');
    const fileNameDisplay = document.getElementById('cvFileName');
    const fileError = document.getElementById('cvFileError');
    if (fileUpload && fileInput) {
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      const ALLOWED_EXT = ['pdf', 'doc', 'docx'];

      function validateFile(file) {
        if (!file) return null;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXT.includes(ext)) {
          return isAr()
            ? '⚠️ الملف لازم يكون بصيغة PDF أو Word فقط.'
            : '⚠️ File must be a PDF or Word document.';
        }
        if (file.size > MAX_SIZE) {
          return isAr()
            ? '⚠️ حجم الملف أكبر من 5 ميجا، اختار ملف أصغر.'
            : '⚠️ File is larger than 5 MB. Please choose a smaller file.';
        }
        return null;
      }

      function handleFile(file) {
        const errMsg = validateFile(file);
        if (errMsg) {
          if (fileError) fileError.textContent = errMsg;
          if (fileNameDisplay) fileNameDisplay.textContent = '';
          fileUpload.classList.add('is-invalid-upload');
          return false;
        }
        if (fileError) fileError.textContent = '';
        if (fileNameDisplay) fileNameDisplay.textContent = file ? file.name : '';
        fileUpload.classList.remove('is-invalid-upload');
        return true;
      }

      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        handleFile(file);
      });

      ['dragenter', 'dragover'].forEach(evt => {
        fileUpload.addEventListener(evt, (e) => {
          e.preventDefault();
          fileUpload.classList.add('drag-over');
        });
      });
      ['dragleave', 'drop'].forEach(evt => {
        fileUpload.addEventListener(evt, (e) => {
          e.preventDefault();
          fileUpload.classList.remove('drag-over');
        });
      });
      fileUpload.addEventListener('drop', (e) => {
        const dropped = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (dropped) {
          fileInput.files = e.dataTransfer.files;
          handleFile(dropped);
        }
      });
    }
  } catch (err) { console.error('CV upload widget error:', err); }

  /* ==========================================================
     Careers page — application form: real-time validation
     + submit -> Formspree (AJAX, with file)
     ========================================================== */
  try {
    const careerForm = document.getElementById('careerForm');
    const careerNote = document.getElementById('careerFormNote');
    const careerSubmitBtn = document.getElementById('careerSubmitBtn');
    const careerNameInput = document.getElementById('careerNameInput');
    const careerNameError = document.getElementById('careerNameError');
    const careerEmailInput = document.getElementById('careerEmailInput');
    const careerEmailError = document.getElementById('careerEmailError');
    const careerCountryCode = document.getElementById('careerCountryCode');
    const careerPhoneInput = document.getElementById('careerPhoneInput');
    const careerPhoneError = document.getElementById('careerPhoneError');
    const careerPhoneFull = document.getElementById('careerPhoneFull');
    const careerPositionSelect = document.getElementById('careerPositionSelect');
    const careerPositionError = document.getElementById('careerPositionError');
    const careerConsent = document.getElementById('careerConsentInput');
    const careerConsentError = document.getElementById('careerConsentError');
    const cvFileInput = document.getElementById('cvFileInput');
    const cvFileError = document.getElementById('cvFileError');
    const cvFileUpload = document.getElementById('cvFileUpload');

    function syncCareerPhone() {
      if (!careerCountryCode || !careerPhoneInput || !careerPhoneFull) return;
      const code = careerCountryCode.value;
      const digits = careerPhoneInput.value.replace(/\D/g, '');
      careerPhoneFull.value = digits ? `+${code}${digits}` : '';
    }

    if (careerForm) {
      if (careerNameInput) {
        careerNameInput.addEventListener('input', () => Validation.validateName(careerNameInput, careerNameError));
        careerNameInput.addEventListener('blur', () => Validation.validateName(careerNameInput, careerNameError));
      }
      if (careerEmailInput) {
        careerEmailInput.addEventListener('input', () => Validation.validateEmail(careerEmailInput, careerEmailError));
        careerEmailInput.addEventListener('blur', () => Validation.validateEmail(careerEmailInput, careerEmailError));
      }
      if (careerPhoneInput) {
        careerPhoneInput.addEventListener('input', () => {
          Validation.validatePhone(careerPhoneInput, careerPhoneError, careerCountryCode);
          syncCareerPhone();
        });
        careerPhoneInput.addEventListener('blur', () => Validation.validatePhone(careerPhoneInput, careerPhoneError, careerCountryCode));
      }
      if (careerCountryCode) {
        careerCountryCode.addEventListener('change', () => {
          syncCareerPhone();
          if (careerPhoneInput && careerPhoneInput.value) Validation.validatePhone(careerPhoneInput, careerPhoneError, careerCountryCode);
        });
      }
      if (careerPositionSelect) {
        careerPositionSelect.addEventListener('change', () => Validation.validateSelectRequired(careerPositionSelect, careerPositionError));
      }
      if (careerConsent) {
        careerConsent.addEventListener('change', () => {
          if (careerConsent.checked && careerConsentError) careerConsentError.textContent = '';
        });
      }

      careerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        syncCareerPhone();

        let valid = true;

        if (careerNameInput && !Validation.validateName(careerNameInput, careerNameError)) { valid = false; Validation.shake(careerNameInput); }
        if (careerEmailInput && !Validation.validateEmail(careerEmailInput, careerEmailError)) { valid = false; Validation.shake(careerEmailInput); }
        if (careerPhoneInput && !Validation.validatePhone(careerPhoneInput, careerPhoneError, careerCountryCode)) { valid = false; Validation.shake(careerPhoneInput); }
        if (careerPositionSelect && !Validation.validateSelectRequired(careerPositionSelect, careerPositionError)) { valid = false; Validation.shake(careerPositionSelect); }

        // Validate CV file is present and valid before submitting
        const file = cvFileInput && cvFileInput.files && cvFileInput.files[0];
        if (!file) {
          valid = false;
          if (cvFileError) {
            cvFileError.textContent = isAr()
              ? '⚠️ برجاء إرفاق سيرتك الذاتية.'
              : '⚠️ Please attach your CV.';
          }
          if (cvFileUpload) {
            cvFileUpload.classList.add('is-invalid-upload');
            Validation.shake(cvFileUpload);
          }
        }

        // Validate consent checkbox
        if (careerConsent && !careerConsent.checked) {
          valid = false;
          if (careerConsentError) {
            careerConsentError.textContent = isAr()
              ? '⚠️ لازم توافق على معالجة بياناتك للمتابعة.'
              : '⚠️ Please agree to the data processing terms to continue.';
          }
        }

        if (!valid) {
          if (careerNote) {
            careerNote.textContent = isAr()
              ? '⚠️ برجاء تصحيح الحقول المظللة قبل إرسال الطلب.'
              : '⚠️ Please correct the highlighted fields before submitting.';
            careerNote.className = 'form-note error';
          }
          const firstInvalid = careerForm.querySelector('.is-invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        if (!careerNote || !careerSubmitBtn) return;
        const endpoint = careerForm.getAttribute('action');
        if (!endpoint || endpoint.includes('YOUR_CAREERS_FORM_ID')) {
          careerNote.textContent = isAr()
            ? '⚠️ لسه محتاج تحط رابط Formspree الخاص بصفحة الوظائف في الكود (action attribute).'
            : '⚠️ Please set your Formspree endpoint for the careers form in the action attribute.';
          careerNote.className = 'form-note error';
          return;
        }

        careerSubmitBtn.disabled = true;
        const originalLabel = careerSubmitBtn.textContent;
        careerSubmitBtn.textContent = isAr() ? 'جارٍ الإرسال...' : 'Sending...';
        try {
          const formData = new FormData(careerForm);
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            careerNote.textContent = isAr()
              ? '✅ تم استلام طلبك بنجاح، هنراجعه ونتواصل معك لو كنت مناسب للوظيفة.'
              : '✅ Your application has been received. We will review it and contact you if there is a match.';
            careerNote.className = 'form-note success';
            careerForm.reset();
            if (document.getElementById('cvFileName')) document.getElementById('cvFileName').textContent = '';
            if (careerNameInput) Validation.clearState(careerNameInput, careerNameError);
            if (careerEmailInput) Validation.clearState(careerEmailInput, careerEmailError);
            if (careerPhoneInput) Validation.clearState(careerPhoneInput, careerPhoneError);
            if (careerPositionSelect) Validation.clearState(careerPositionSelect, careerPositionError);
            if (cvFileUpload) cvFileUpload.classList.remove('is-invalid-upload');
          } else {
            throw new Error('Submission failed with status ' + response.status);
          }
        } catch (err) {
          console.error('Career form submission error:', err);
          careerNote.textContent = isAr()
            ? '❌ حدث خطأ أثناء إرسال طلبك، برجاء المحاولة مرة أخرى أو إرسال سيرتك الذاتية بالإيميل مباشرة.'
            : '❌ Something went wrong while sending your application. Please try again or email your CV directly.';
          careerNote.className = 'form-note error';
        } finally {
          careerSubmitBtn.disabled = false;
          careerSubmitBtn.textContent = originalLabel;
          setTimeout(() => { careerNote.textContent = ''; careerNote.className = 'form-note'; }, 8000);
        }
      });
    }
  } catch (err) { console.error('Career form error:', err); }

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

  /* ==========================================================
     Partners carousel — directional hover scroll
     - Mouse on the right side of the strip  -> scrolls right
     - Mouse on the left side of the strip   -> scrolls left
     - Mouse resting exactly on a company name/icon -> pauses
     - Mouse outside the strip -> gentle idle auto-scroll (left)
     ========================================================== */
  try {
    const carousel = document.querySelector('.partners-carousel');
    const track = document.querySelector('.partners-track');
    if (carousel && track) {
      const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        // Respect accessibility preference: keep the strip static.
        track.style.transform = 'translateX(0)';
      } else {
        const IDLE_SPEED = -0.35;   // px/frame when the mouse is away (slow drift, left)
        const MAX_SPEED = 2.6;      // px/frame at the far edges of the strip
        const EASE = 0.07;          // how quickly speed catches up to target (0-1)

        let posX = 0;
        let speed = IDLE_SPEED;
        let targetSpeed = IDLE_SPEED;
        let halfWidth = 0;

        function measure() {
          // Track content is duplicated once for a seamless loop,
          // so half of the scrollWidth equals one full set of logos.
          halfWidth = track.scrollWidth / 2;
        }
        measure();
        window.addEventListener('resize', measure);

        function speedFromPointer(clientX) {
          const rect = carousel.getBoundingClientRect();
          const relX = (clientX - rect.left) / rect.width; // 0 (left edge) .. 1 (right edge)
          const clamped = Math.min(1, Math.max(0, relX));
          // Map 0..1 to -MAX_SPEED..+MAX_SPEED (0.5 = center = stop drifting fast, near-zero)
          return (clamped - 0.5) * 2 * MAX_SPEED;
        }

        carousel.addEventListener('mousemove', (e) => {
          const onItem = e.target.closest && e.target.closest('.partner-item');
          targetSpeed = onItem ? 0 : speedFromPointer(e.clientX);
        });

        carousel.addEventListener('mouseleave', () => {
          targetSpeed = IDLE_SPEED;
        });

        // Basic touch support: pause while touching, resume gently after.
        carousel.addEventListener('touchstart', () => { targetSpeed = 0; }, { passive: true });
        carousel.addEventListener('touchend', () => { targetSpeed = IDLE_SPEED; }, { passive: true });
        carousel.addEventListener('touchcancel', () => { targetSpeed = IDLE_SPEED; }, { passive: true });

        function tick() {
          speed += (targetSpeed - speed) * EASE;
          posX += speed;
          if (halfWidth > 0) {
            if (posX <= -halfWidth) posX += halfWidth;
            if (posX > 0) posX -= halfWidth;
          }
          track.style.transform = `translateX(${posX}px)`;
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    }
  } catch (err) { console.error('Partners carousel error:', err); }

});
