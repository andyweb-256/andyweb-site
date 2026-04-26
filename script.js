/* ============================================================
   ANDYWEB - Main JavaScript
   Edit contact links, prices, and currency labels here
   ============================================================ */

/* ---- EDITABLE: Contact info ---- */
const ANDYWEB_CONFIG = {
  whatsapp: '+256785721129',        // ← Change to your WhatsApp number
  email: 'hello@andyweb.ug',        // ← Change to your email
  phone: '+256 785721129',        // ← Change to your phone
  instagram: '#',                   // ← Change to your Instagram URL
  twitter: '#',
  facebook: '#',
  linkedin: '#',
};

/* ---- EDITABLE: Pricing ---- */
const PRICING = {
  UGX: {
    starter:  { min: '150,000', max: '250,000', display: 'UGX 150K – 250K', symbol: 'UGX' },
    business: { min: '300,000', max: '500,000', display: 'UGX 300K – 500K', symbol: 'UGX' },
    store:    { min: '700,000', max: '1,200,000', display: 'UGX 700K – 1.2M', symbol: 'UGX' },
    hostFree: 'Free',
    hostPaid: 'UGX 80K – 120K / yr',
    hostPaidFull: '80,000 – 120,000',
    currency: 'UGX',
    locationMsg: '🇺🇬 Showing prices in Ugandan Shillings (UGX)',
    heroPrice: 'UGX 150,000',
    heroRange: 'Starting price',
    emphasis: 'Perfect for first-time website owners in Uganda',
  },
  USD: {
    starter:  { min: '$80',  max: '$120', display: '$80 – $120', symbol: '$' },
    business: { min: '$150', max: '$250', display: '$150 – $250', symbol: '$' },
    store:    { min: '$300', max: '$500', display: '$300 – $500', symbol: '$' },
    hostFree: 'Free',
    hostPaid: '$30 – $60 / year',
    hostPaidFull: '$30 – $60',
    currency: 'USD',
    locationMsg: '🌍 Showing prices in US Dollars (USD)',
    heroPrice: 'From $80',
    heroRange: 'Starting price',
    emphasis: 'Affordable professional websites for small businesses',
  }
};

/* ============================================================
   STATE
   ============================================================ */
let currentCurrency = 'USD'; // default before detection
let locationDetected = false;

/* ============================================================
   GEOLOCATION (free ipapi.co)
   ============================================================ */
async function detectLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data && data.country_code) {
      currentCurrency = data.country_code === 'UG' ? 'UGX' : 'USD';
      locationDetected = true;
      applyPricing();
    }
  } catch (e) {
    // Silently fail – keep default USD
    applyPricing();
  }
}

/* ============================================================
   APPLY PRICING to current page
   ============================================================ */
function applyPricing() {
  const p = PRICING[currentCurrency];

  // Location banner
  const banner = document.getElementById('location-banner');
  if (banner) {
    banner.textContent = p.locationMsg;
    banner.classList.remove('hidden');
  }

  // Hero price
  setInnerHTML('.hero-price-amount', p.heroPrice);
  setInnerHTML('.hero-price-range', p.heroRange);
  setInnerHTML('.hero-emphasis', p.emphasis);

  // Service card prices (home page preview)
  setInnerHTML('.price-starter', p.starter.display);
  setInnerHTML('.price-business', p.business.display);
  setInnerHTML('.price-store', p.store.display);

  // Hosting prices
  setInnerHTML('.price-host-free', p.hostFree);
  setInnerHTML('.price-host-paid', p.hostPaid);

  // Services page full pricing
  setInnerHTML('.pricing-starter-amount', p.starter.symbol + (p.currency === 'USD' ? p.starter.min.replace('$','') : p.starter.min));
  setInnerHTML('.pricing-starter-range', `Up to ${p.starter.symbol}${p.starter.max}`);
  setInnerHTML('.pricing-business-amount', p.business.symbol + (p.currency === 'USD' ? p.business.min.replace('$','') : p.business.min));
  setInnerHTML('.pricing-business-range', `Up to ${p.business.symbol}${p.business.max}`);
  setInnerHTML('.pricing-store-amount', p.store.symbol + (p.currency === 'USD' ? p.store.min.replace('$','') : p.store.min));
  setInnerHTML('.pricing-store-range', `Up to ${p.store.symbol}${p.store.max}`);

  // Currency toggle active state
  document.querySelectorAll('.currency-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.currency === currentCurrency);
  });
}

function setInnerHTML(selector, value) {
  document.querySelectorAll(selector).forEach(el => { el.innerHTML = value; });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  // Scroll effect
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Active link
  const links = document.querySelectorAll('.nav-links a, .nav-mobile a');
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send Message';
      const success = document.getElementById('contact-success');
      if (success) { success.classList.add('show'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }, 1200);
  });
}

/* ============================================================
   DASHBOARD FORM
   ============================================================ */
function initDashboard() {
  const form = document.getElementById('project-form');
  if (!form) return;

  // Live preview in summary sidebar
  const fields = form.querySelectorAll('input, textarea, select');
  fields.forEach(field => {
    field.addEventListener('input', updateSummary);
    field.addEventListener('change', updateSummary);
  });

  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      const inp = document.getElementById('preferred-colors');
      if (inp) { inp.value = swatch.dataset.color; updateSummary(); }
    });
  });

  // Form submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    const submission = collectFormData();
    submission.id = Date.now();
    submission.date = new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' });

    // Save to localStorage
    const key = 'andyweb_submissions';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(submission);
    localStorage.setItem(key, JSON.stringify(existing));

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '✓ Request Submitted!';
      form.reset();
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      updateSummary();
      clearSummary();
      const success = document.getElementById('project-success');
      if (success) { success.classList.add('show'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      setTimeout(() => { if(success) success.classList.remove('show'); btn.textContent = 'Submit Website Request'; }, 5000);
      loadSubmissions();
    }, 1400);
  });

  loadSubmissions();
}

function collectFormData() {
  return {
    businessName: val('business-name'),
    businessType: val('business-type'),
    description: val('business-description'),
    services: val('services-offered'),
    pages: val('num-pages'),
    colors: val('preferred-colors'),
    needsHosting: getRadio('needs-hosting'),
    hostingType: getRadio('hosting-type'),
    email: val('contact-email'),
    phone: val('contact-phone'),
    notes: val('additional-notes'),
  };
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function getRadio(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : '';
}

function updateSummary() {
  const data = collectFormData();
  const container = document.getElementById('summary-content');
  if (!container) return;

  const items = [
    { label: 'Business Name', value: data.businessName },
    { label: 'Business Type', value: data.businessType },
    { label: 'Description', value: data.description ? data.description.substring(0,80) + (data.description.length > 80 ? '…' : '') : '' },
    { label: 'Pages Needed', value: data.pages },
    { label: 'Preferred Colors', value: data.colors },
    { label: 'Needs Hosting', value: data.needsHosting },
    { label: 'Hosting Type', value: data.hostingType },
    { label: 'Contact Email', value: data.email },
    { label: 'Contact Phone', value: data.phone },
  ].filter(item => item.value);

  if (items.length === 0) {
    container.innerHTML = `<div class="summary-empty"><div class="empty-icon">📋</div><p>Fill in the form to see your project summary here.</p></div>`;
    return;
  }

  container.innerHTML = items.map((item, i) => `
    <div class="summary-item">
      <div class="summary-item-label">${item.label}</div>
      <div class="summary-item-value">${escapeHTML(item.value)}</div>
    </div>
    ${i < items.length - 1 ? '<div class="summary-divider"></div>' : ''}
  `).join('');
}

function clearSummary() {
  const container = document.getElementById('summary-content');
  if (container) container.innerHTML = `<div class="summary-empty"><div class="empty-icon">📋</div><p>Fill in the form to see your project summary here.</p></div>`;
}

/* ---- Load saved submissions ---- */
function loadSubmissions() {
  const list = document.getElementById('submissions-list');
  if (!list) return;
  const submissions = JSON.parse(localStorage.getItem('andyweb_submissions') || '[]');

  if (submissions.length === 0) {
    list.innerHTML = `<div class="no-submissions"><div class="ns-icon">📭</div><h3>No submissions yet</h3><p>Submit your first website request using the form above.</p></div>`;
    return;
  }

  list.innerHTML = submissions.slice().reverse().map((sub, i) => `
    <div class="submission-card reveal reveal-delay-${Math.min(i+1,4)}">
      <div class="sub-num">${submissions.length - i}</div>
      <div class="sub-info">
        <h4>${escapeHTML(sub.businessName || 'Unnamed Project')}</h4>
        <p>${escapeHTML(sub.description ? sub.description.substring(0,100) + (sub.description.length > 100 ? '…' : '') : 'No description provided.')}</p>
        <div class="sub-meta">
          ${sub.businessType ? `<span class="sub-tag">${escapeHTML(sub.businessType)}</span>` : ''}
          ${sub.pages ? `<span class="sub-tag accent">${escapeHTML(sub.pages)} pages</span>` : ''}
          ${sub.needsHosting ? `<span class="sub-tag">Hosting: ${escapeHTML(sub.needsHosting)}</span>` : ''}
          ${sub.hostingType ? `<span class="sub-tag">${escapeHTML(sub.hostingType)}</span>` : ''}
        </div>
        <div class="sub-date">Submitted: ${sub.date || 'Unknown date'}</div>
      </div>
      <div class="sub-actions">
        <button class="sub-btn danger" onclick="deleteSubmission(${sub.id})">Delete</button>
      </div>
    </div>
  `).join('');

  initScrollReveal();
}

function deleteSubmission(id) {
  if (!confirm('Delete this submission?')) return;
  const existing = JSON.parse(localStorage.getItem('andyweb_submissions') || '[]');
  const filtered = existing.filter(s => s.id !== id);
  localStorage.setItem('andyweb_submissions', JSON.stringify(filtered));
  loadSubmissions();
}

/* ============================================================
   CURRENCY MANUAL TOGGLE
   ============================================================ */
function initCurrencyToggle() {
  document.querySelectorAll('.currency-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCurrency = btn.dataset.currency;
      applyPricing();
    });
  });
}

/* ============================================================
   UTILS
   ============================================================ */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initContactForm();
  initDashboard();
  initCurrencyToggle();
  detectLocation(); // async – updates prices when ready
  applyPricing();   // show defaults immediately
});
