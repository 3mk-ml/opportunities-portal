/**
 * بوابة الفرص — Main Application Script
 * Cinematic UI · Scroll animations · Opportunity rendering · Search & Filter
 */
'use strict';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & STATE
   ═══════════════════════════════════════════════════════════════ */
const DATA_URL = 'data/opportunities.json?v=1.2.0';
const FEATURED_IDS = [
  'oxford-weidenfeld-hoffmann-2027-2028',
  'mepi-tomorrows-leaders-undergraduate-2027-2028',
  'daad-master-studies-2027-2028',
  'tu-delft-van-effen-2027-2028',
  'um-nl-high-potential-2027-2028',
];
const URGENT_DAYS = 14;
const FAV_KEY = 'op-favorites';

const state = {
  opportunities: [],
  filtered: [],
  favorites: new Set(),
  query: '',
  filterType: 'all',
  filterStatus: 'all',
  showFavsOnly: false,
  lang: 'ar',
  modalOpen: false,
  activeOpp: null,
  countAnimated: false,
  animObserved: new Set(),
};

/* ═══════════════════════════════════════════════════════════════
   INITIALISATION
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  // Init i18n first
  I18N_MODULE.initLang();
  state.lang = I18N_MODULE.getCurrentLang();

  // Load favorites
  loadFavorites();

  // Wire up static UI
  wireHeader();
  wireNavOverlay();
  wireLangSwitch();
  wireHeroSearch();
  wireFilters();
  wireModal();
  wireFavToggle();
  wireNavLinks();

  // Listen for favorites changes from Favorites module
  document.addEventListener('favorites:changed', () => {
    loadFavorites();
    // Update any featured card buttons
    document.querySelectorAll('#featured-grid .fc-fav').forEach(btn => {
      const id = btn.dataset.id;
      if (!id) return;
      const isFaved = state.favorites.has(id);
      btn.classList.toggle('is-faved', isFaved);
      btn.setAttribute('aria-label', isFaved ? I18N_MODULE.t('fav.remove') : I18N_MODULE.t('fav.add'));
    });
  });

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Start scroll observer
  initScrollObserver();
  initDotNav();

  // Trigger hero animations
  requestAnimationFrame(() => {
    setTimeout(() => triggerHeroEntrance(), 80);
  });

  // Fetch data
  await loadData();
});

/* ═══════════════════════════════════════════════════════════════
   DATA LOADING
   ═══════════════════════════════════════════════════════════════ */
async function loadData() {
  try {
    if (!window.OpportunityList) renderSkeletons();
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    state.opportunities = json.opportunities || [];
    applyFilters();
    renderFeatured();
    if (!window.OpportunityList) {
      renderCatalogue();
    }
    updateStatCounts();
  } catch (err) {
    console.error('Failed to load opportunities:', err);
    if (!window.OpportunityList) {
      renderError();
    }
  }
}

function renderSkeletons() {
  const grid = document.getElementById('cards-grid');
  if (!grid) return;
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-line skeleton-line--sm"></div>
      <div class="skeleton-line skeleton-line--lg"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line skeleton-line--sm"></div>
    </div>
  `).join('');
}

function renderError() {
  const grid = document.getElementById('cards-grid');
  if (grid) {
    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="empty-state-title">تعذّر تحميل البيانات</p>
        <p class="empty-state-sub">تأكد من الاتصال بالإنترنت أو أعد تحميل الصفحة</p>
      </div>
    `;
  }
}

/* ═══════════════════════════════════════════════════════════════
   DEADLINE UTILITIES
   ═══════════════════════════════════════════════════════════════ */
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - TODAY) / 86400000);
}

function formatDate(dateStr, lang) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

function getDeadlineDisplay(opp, lang) {
  const t = I18N_MODULE.t;
  const { deadline, deadlineType, applicationStatus } = opp;

  if (applicationStatus === 'closed') {
    return { text: t('deadline.closed'), cls: 'deadline-expired', days: null };
  }
  if (deadlineType === 'ongoing') {
    return { text: t('deadline.ongoing'), cls: '', days: null };
  }
  if (deadlineType === 'course-dependent') {
    return { text: t('deadline.courseDep'), cls: '', days: null };
  }
  if (deadlineType === 'unknown') {
    return { text: t('deadline.unknown'), cls: 'deadline-expired', days: null };
  }
  if (deadlineType === 'periodic') {
    return { text: t('deadline.periodic'), cls: '', days: null };
  }
  if (!deadline) {
    return { text: t('deadline.unknown'), cls: '', days: null };
  }

  const days = daysUntil(deadline);
  if (days < 0) {
    return { text: formatDate(deadline, lang) || deadline, cls: 'deadline-expired', days };
  }
  if (days === 0) {
    return { text: lang === 'ar' ? 'ينتهي اليوم!' : 'Closes today!', cls: 'deadline-critical', days: 0 };
  }
  if (days <= URGENT_DAYS) {
    const txt = lang === 'ar'
      ? `${days} ${t('deadline.daysLeft')}`
      : `${days} ${t('deadline.daysLeft')}`;
    return { text: txt, cls: 'deadline-urgent', days };
  }

  return { text: formatDate(deadline, lang) || deadline, cls: '', days };
}

function isExpired(opp) {
  if (opp.applicationStatus === 'closed') return true;
  if (!opp.deadline) return false;
  return daysUntil(opp.deadline) < 0;
}

/* ═══════════════════════════════════════════════════════════════
   FILTERING ENGINE
   ═══════════════════════════════════════════════════════════════ */
function applyFilters() {
  const q = state.query.toLowerCase().trim();
  const lang = state.lang;

  state.filtered = state.opportunities.filter(opp => {
    // Favorites filter
    if (state.showFavsOnly && !state.favorites.has(opp.id)) return false;

    // Type filter
    if (state.filterType !== 'all' && opp.type !== state.filterType) return false;

    // Status filter
    if (state.filterStatus !== 'all') {
      const oppStatus = opp.applicationStatus;
      if (state.filterStatus === 'open' && oppStatus !== 'open') return false;
      if (state.filterStatus === 'upcoming' && oppStatus !== 'upcoming') return false;
      if (state.filterStatus === 'closed' && oppStatus !== 'closed') return false;
    }

    // Text search (bilingual)
    if (q) {
      const title   = ((opp.title && (opp.title.ar + ' ' + opp.title.en)) || '').toLowerCase();
      const prov    = ((opp.provider && (opp.provider.ar + ' ' + opp.provider.en)) || '').toLowerCase();
      const country = opp.country ? ((opp.country.ar || '') + ' ' + (opp.country.en || '')).toLowerCase() : '';
      const fields  = (opp.fields || []).map(f => (f.name.ar + ' ' + f.name.en).toLowerCase()).join(' ');
      const combined = `${title} ${prov} ${country} ${fields}`;
      if (!combined.includes(q)) return false;
    }

    return true;
  });
}

/* ═══════════════════════════════════════════════════════════════
   CARD BUILDING (safe DOM — no innerHTML for data)
   ═══════════════════════════════════════════════════════════════ */

function buildTag(text, cls) {
  const span = document.createElement('span');
  span.className = `tag ${cls}`;
  span.textContent = text;
  return span;
}

function buildFavBtn(opp) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fc-fav' + (state.favorites.has(opp.id) ? ' is-faved' : '');
  btn.setAttribute('aria-label', state.favorites.has(opp.id)
    ? I18N_MODULE.t('fav.remove')
    : I18N_MODULE.t('fav.add'));
  btn.dataset.id = opp.id;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(opp.id);
    // Re-render just the button state
    const isFaved = state.favorites.has(opp.id);
    btn.classList.toggle('is-faved', isFaved);
    btn.setAttribute('aria-label', isFaved ? I18N_MODULE.t('fav.remove') : I18N_MODULE.t('fav.add'));
    const svgPath = btn.querySelector('path');
    if (svgPath) btn.querySelector('svg').style.fill = isFaved ? 'currentColor' : 'none';
  });
  return btn;
}

function buildStatusTag(opp) {
  const statusMap = {
    'open': ['status.open', 'tag-status--open'],
    'closed': ['status.closed', 'tag-status--closed'],
    'upcoming': ['status.upcoming', 'tag-status--upcoming'],
    'unconfirmed': ['status.unconfirmed', 'tag-status--unconfirmed'],
    'course-dependent': ['status.course-dependent', 'tag-status--course-dependent'],
  };
  const [key, cls] = statusMap[opp.applicationStatus] || ['status.unconfirmed', 'tag-status--unconfirmed'];
  return buildTag(I18N_MODULE.t(key), cls);
}

function buildTypeTag(opp) {
  const key = 'type.' + (opp.type || 'scholarship');
  return buildTag(I18N_MODULE.t(key), 'tag-type');
}

function buildEligTag(opp) {
  const eligMap = {
    'eligible': ['eligibility.eligible', 'tag-eligibility--eligible'],
    'conditional': ['eligibility.conditional', 'tag-eligibility--conditional'],
    'restricted-or-ineligible': ['eligibility.restricted-or-ineligible', 'tag-eligibility--restricted'],
    'unconfirmed': ['eligibility.unconfirmed', 'tag-eligibility--unconfirmed'],
  };
  const [key, cls] = eligMap[opp.yemenEligibility] || ['eligibility.unconfirmed', 'tag-eligibility--unconfirmed'];
  return buildTag(I18N_MODULE.t(key), cls);
}

/* ── FEATURED CARD ── */
function buildFeaturedCard(opp, isHero = false) {
  const lang = state.lang;
  const card = document.createElement('article');
  card.className = 'featured-card' + (isHero ? ' featured-card--hero' : '');
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', opp.title[lang] || opp.title.ar);

  const isOxfordHero = isHero && opp.id === 'oxford-weidenfeld-hoffmann-2027-2028';
  if (isOxfordHero) card.classList.add('has-media');

  let container = card;
  if (isOxfordHero) {
    const media = document.createElement('div');
    media.className = 'fc-media';

    const img = document.createElement('img');
    img.className = 'fc-media-img';
    img.src = 'assets/images/oxford.jpg';
    img.alt = lang === 'ar' ? 'جامعة أكسفورد - رادكليف كاميرا' : 'University of Oxford - Radcliffe Camera';
    img.loading = 'lazy';
    media.appendChild(img);

    const overlay = document.createElement('div');
    overlay.className = 'fc-media-overlay';
    media.appendChild(overlay);

    const badge = document.createElement('div');
    badge.className = 'fc-media-badge';
    badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>${lang === 'ar' ? 'أكسفورد، المملكة المتحدة' : 'Oxford, UK'}</span>`;
    media.appendChild(badge);

    card.appendChild(media);

    container = document.createElement('div');
    container.className = 'fc-content';
    card.appendChild(container);
  }

  // Header
  const header = document.createElement('div');
  header.className = 'fc-header';

  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'fc-tags';
  tagsWrap.appendChild(buildTypeTag(opp));
  tagsWrap.appendChild(buildStatusTag(opp));
  header.appendChild(tagsWrap);
  header.appendChild(buildFavBtn(opp));
  container.appendChild(header);

  // Eligibility tag
  const eligTag = buildEligTag(opp);
  container.appendChild(eligTag);

  // Title
  const title = document.createElement('h3');
  title.className = 'fc-title';
  title.textContent = opp.title[lang] || opp.title.ar;
  container.appendChild(title);

  // Provider + country
  const provider = document.createElement('div');
  provider.className = 'fc-provider';
  const provText = document.createElement('span');
  provText.textContent = opp.provider[lang] || opp.provider.ar;
  provider.appendChild(provText);
  if (opp.country) {
    const dot = document.createElement('span');
    dot.className = 'fc-provider-dot';
    dot.setAttribute('aria-hidden', 'true');
    provider.appendChild(dot);
    const country = document.createElement('span');
    country.textContent = opp.country[lang] || opp.country.ar;
    provider.appendChild(country);
  }
  container.appendChild(provider);

  // Meta
  const meta = document.createElement('div');
  meta.className = 'fc-meta';

  // Levels
  if (opp.levels && opp.levels.length) {
    const levelRow = document.createElement('div');
    levelRow.className = 'fc-meta-row';
    levelRow.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
    const levText = document.createElement('span');
    levText.textContent = opp.levels.map(l => I18N_MODULE.t('level.' + l)).join('، ');
    levelRow.appendChild(levText);
    meta.appendChild(levelRow);
  }

  // Deadline
  const dl = getDeadlineDisplay(opp, lang);
  const dlRow = document.createElement('div');
  dlRow.className = 'fc-meta-row';
  dlRow.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  const dlText = document.createElement('span');
  dlText.textContent = dl.text;
  if (dl.cls) dlText.className = dl.cls;
  dlRow.appendChild(dlText);
  meta.appendChild(dlRow);

  container.appendChild(meta);

  // CTA
  const cta = document.createElement('div');
  cta.className = 'fc-action';
  cta.setAttribute('aria-hidden', 'true');
  cta.innerHTML = `<span>${lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  container.appendChild(cta);

  // Hover shimmer track mouse
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });

  // Click opens modal
  card.addEventListener('click', () => openModal(opp));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(opp);
    }
  });

  return card;
}

/* ── CATALOGUE CARD ── */
function buildOppCard(opp, delay = 0) {
  const lang = state.lang;
  const card = document.createElement('article');
  card.className = 'opp-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', opp.title[lang] || opp.title.ar);
  card.style.animationDelay = delay + 'ms';

  // Header row
  const hdr = document.createElement('div');
  hdr.className = 'opp-card-header';
  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'opp-card-tags';
  tagsWrap.appendChild(buildStatusTag(opp));
  tagsWrap.appendChild(buildEligTag(opp));
  hdr.appendChild(tagsWrap);
  hdr.appendChild(buildFavBtn(opp));
  card.appendChild(hdr);

  // Title
  const title = document.createElement('h3');
  title.className = 'opp-card-title';
  title.textContent = opp.title[lang] || opp.title.ar;
  card.appendChild(title);

  // Provider
  const provider = document.createElement('div');
  provider.className = 'opp-card-provider';
  provider.textContent = (opp.provider[lang] || opp.provider.ar);
  if (opp.country) {
    provider.textContent += ' · ' + (opp.country[lang] || opp.country.ar);
  }
  card.appendChild(provider);

  // Type tag
  card.appendChild(buildTypeTag(opp));

  // Meta
  const meta = document.createElement('div');
  meta.className = 'opp-card-meta';

  // Level row
  if (opp.levels && opp.levels.length) {
    const lvlRow = buildMetaRow(
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
      opp.levels.map(l => I18N_MODULE.t('level.' + l)).join('، ')
    );
    meta.appendChild(lvlRow);
  }

  // Deadline
  const dl = getDeadlineDisplay(opp, lang);
  const dlRow = buildMetaRow(
    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    dl.text,
    dl.cls
  );
  meta.appendChild(dlRow);

  // Funding if present
  if (opp.fundingCoverage) {
    const fRow = buildMetaRow(
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      I18N_MODULE.t('funding.' + opp.fundingCoverage)
    );
    meta.appendChild(fRow);
  }

  card.appendChild(meta);

  // Click
  card.addEventListener('click', () => openModal(opp));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(opp); }
  });

  return card;
}

function buildMetaRow(iconHtml, text, textCls) {
  const row = document.createElement('div');
  row.className = 'opp-card-meta-row';
  row.innerHTML = iconHtml;
  const span = document.createElement('span');
  span.textContent = text;
  if (textCls) span.className = textCls;
  row.appendChild(span);
  return row;
}

/* ═══════════════════════════════════════════════════════════════
   RENDERING
   ═══════════════════════════════════════════════════════════════ */
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Pick featured opportunities in order
  const featuredOpps = [];
  FEATURED_IDS.forEach(id => {
    const opp = state.opportunities.find(o => o.id === id);
    if (opp) featuredOpps.push(opp);
  });

  // Fill remaining slots with open, eligible opps if we don't have 5
  if (featuredOpps.length < 5) {
    state.opportunities.forEach(opp => {
      if (featuredOpps.length >= 5) return;
      if (!featuredOpps.find(f => f.id === opp.id)) {
        featuredOpps.push(opp);
      }
    });
  }

  const toShow = featuredOpps.slice(0, 5);
  toShow.forEach((opp, idx) => {
    const card = buildFeaturedCard(opp, idx === 0);
    grid.appendChild(card);
  });

  // Observe for scroll animations
  observeCards(grid.querySelectorAll('.featured-card'));
}

function renderCatalogue() {
  if (window.OpportunityList) return; // OpportunityList in list.js owns the catalogue
  const grid = document.getElementById('cards-grid');
  const emptyState = document.getElementById('empty-state');
  const countEl = document.getElementById('results-count');
  if (!grid) return;

  grid.setAttribute('aria-busy', 'false');
  grid.innerHTML = '';

  const lang = state.lang;

  if (state.filtered.length === 0) {
    if (emptyState) emptyState.hidden = false;
    if (countEl) countEl.textContent = '';
    return;
  }

  if (emptyState) emptyState.hidden = true;

  // Results count
  if (countEl) {
    const n = state.filtered.length;
    countEl.textContent = lang === 'ar'
      ? `${n} ${n === 1 ? 'فرصة' : 'فرصة'} ${state.query || state.filterType !== 'all' || state.filterStatus !== 'all' || state.showFavsOnly ? 'بعد الفلترة' : 'إجمالاً'}`
      : `${n} ${I18N_MODULE.t('results.count')} ${state.query || state.filterType !== 'all' || state.filterStatus !== 'all' || state.showFavsOnly ? '(filtered)' : 'total'}`;
  }

  // Sort: open first, then by days remaining ascending, expired last
  const sorted = [...state.filtered].sort((a, b) => {
    const aExp = isExpired(a);
    const bExp = isExpired(b);
    if (aExp !== bExp) return aExp ? 1 : -1;
    const aDays = daysUntil(a.deadline);
    const bDays = daysUntil(b.deadline);
    if (aDays === null && bDays === null) return 0;
    if (aDays === null) return 1;
    if (bDays === null) return -1;
    return aDays - bDays;
  });

  sorted.forEach((opp, idx) => {
    const delay = Math.min(idx * 40, 400);
    const card = buildOppCard(opp, delay);
    grid.appendChild(card);
  });

  // Observe new cards
  observeCards(grid.querySelectorAll('.opp-card'));
}

/* ═══════════════════════════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════════════════════════ */
function openModal(opp) {
  const modal = document.getElementById('opp-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  state.modalOpen = true;
  state.activeOpp = opp;

  const lang = state.lang;

  // Build modal content using safe DOM
  content.innerHTML = '';

  // Header
  const hdr = document.createElement('div');
  hdr.className = 'modal-header';

  const tags = document.createElement('div');
  tags.className = 'modal-tags';
  tags.appendChild(buildTypeTag(opp));
  tags.appendChild(buildStatusTag(opp));
  tags.appendChild(buildEligTag(opp));
  hdr.appendChild(tags);

  const title = document.createElement('h2');
  title.className = 'modal-title';
  title.id = 'modal-title';
  title.textContent = opp.title[lang] || opp.title.ar;
  hdr.appendChild(title);

  const provider = document.createElement('div');
  provider.className = 'modal-provider';
  provider.textContent = (opp.provider[lang] || opp.provider.ar);
  if (opp.country) provider.textContent += ' · ' + (opp.country[lang] || opp.country.ar);
  hdr.appendChild(provider);

  content.appendChild(hdr);

  // Body
  const body = document.createElement('div');
  body.className = 'modal-body';

  // Description
  const desc = opp.description && (opp.description[lang] || opp.description.ar);
  if (desc) {
    const descEl = document.createElement('p');
    descEl.className = 'modal-desc';
    descEl.textContent = desc;
    body.appendChild(descEl);
  }

  // Detail grid
  const dg = document.createElement('div');
  dg.className = 'modal-detail-grid';

  const dl = getDeadlineDisplay(opp, lang);
  const details = [
    [I18N_MODULE.t('modal.deadline'), dl.text, dl.cls],
    [I18N_MODULE.t('modal.status'), I18N_MODULE.t('status.' + (opp.applicationStatus || 'unconfirmed')), ''],
    [I18N_MODULE.t('modal.eligibility'), I18N_MODULE.t('eligibility.' + (opp.yemenEligibility || 'unconfirmed')), ''],
    [I18N_MODULE.t('modal.country'), opp.country ? (opp.country[lang] || opp.country.ar) : I18N_MODULE.t('country.' + (opp.locationScope || 'global')), ''],
    [I18N_MODULE.t('modal.level'), opp.levels ? opp.levels.map(l => I18N_MODULE.t('level.' + l)).join(lang === 'ar' ? '، ' : ', ') : '—', ''],
    opp.fundingCoverage ? [I18N_MODULE.t('modal.funding'), I18N_MODULE.t('funding.' + opp.fundingCoverage), ''] : null,
    opp.deliveryMode ? [I18N_MODULE.t('modal.delivery'), I18N_MODULE.t('delivery.' + opp.deliveryMode), ''] : null,
  ].filter(Boolean);

  details.forEach(([label, value, cls]) => {
    const item = document.createElement('div');
    item.className = 'modal-detail';
    const lbl = document.createElement('span');
    lbl.className = 'modal-detail-label';
    lbl.textContent = label;
    const val = document.createElement('span');
    val.className = 'modal-detail-value' + (cls ? ' ' + cls : '');
    val.textContent = value || '—';
    item.appendChild(lbl);
    item.appendChild(val);
    dg.appendChild(item);
  });

  body.appendChild(dg);
  content.appendChild(body);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'modal-footer';

  // Validate URL is HTTPS before rendering
  if (opp.officialSourceUrl && opp.officialSourceUrl.startsWith('https://')) {
    const link = document.createElement('a');
    link.className = 'modal-source-link';
    link.href = opp.officialSourceUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = I18N_MODULE.t('modal.openSource');
    link.appendChild((() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '14'); svg.setAttribute('height', '14');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>';
      return svg;
    })());
    footer.appendChild(link);
  }

  // Verification notice
  if (opp.verificationDate) {
    const verif = document.createElement('p');
    verif.className = 'modal-verification';
    verif.textContent = `${I18N_MODULE.t('modal.verifiedOn')} ${formatDate(opp.verificationDate, lang)}`;
    footer.appendChild(verif);
  }

  content.appendChild(footer);

  // Show modal
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus trap
  setTimeout(() => {
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function closeModal() {
  const modal = document.getElementById('opp-modal');
  if (!modal) return;
  state.modalOpen = false;
  state.activeOpp = null;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function wireModal() {
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.modalOpen) closeModal();
  });
}

/* ═══════════════════════════════════════════════════════════════
   FAVORITES
   ═══════════════════════════════════════════════════════════════ */
function loadFavorites() {
  if (typeof window.Favorites !== 'undefined' && typeof window.Favorites.getFavorites === 'function') {
    state.favorites = new Set(window.Favorites.getFavorites());
    return;
  }
  try {
    const stored = localStorage.getItem(FAV_KEY);
    if (stored) {
      JSON.parse(stored).forEach(id => state.favorites.add(id));
    }
  } catch (e) {}
}

function saveFavorites() {
  if (typeof window.Favorites !== 'undefined') return;
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...state.favorites]));
  } catch (e) {}
}

function toggleFavorite(id) {
  if (typeof window.Favorites !== 'undefined' && typeof window.Favorites.toggleFavorite === 'function') {
    window.Favorites.toggleFavorite(id);
    state.favorites = new Set(window.Favorites.getFavorites());
  } else {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    saveFavorites();
  }

  // If fav-only mode on standalone, re-render
  if (state.showFavsOnly && !window.OpportunityList) {
    applyFilters();
    renderCatalogue();
  }
}

function wireFavToggle() {
  if (window.OpportunityList) return; // Managed by OpportunityList in list.js
  const btn = document.getElementById('fav-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    state.showFavsOnly = !state.showFavsOnly;
    btn.setAttribute('aria-pressed', state.showFavsOnly ? 'true' : 'false');
    applyFilters();
    renderCatalogue();
  });
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH & FILTERS
   ═══════════════════════════════════════════════════════════════ */
function wireHeroSearch() {
  if (window.OpportunityList) return; // Managed by OpportunityList in list.js
  const input = document.getElementById('hero-search-input');
  const btn = document.getElementById('hero-search-btn');

  const performSearch = () => {
    state.query = input ? input.value : '';
    applyFilters();
    renderCatalogue();
    // Scroll to catalogue
    const catEl = document.getElementById('catalogue');
    if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
  };

  if (input) {
    input.addEventListener('input', () => {
      state.query = input.value;
      applyFilters();
      renderCatalogue();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') performSearch();
    });
  }
  if (btn) btn.addEventListener('click', performSearch);

  // Sync hero search ↔ catalogue search
  const catInput = document.getElementById('cat-search');
  if (catInput) {
    catInput.addEventListener('input', () => {
      state.query = catInput.value;
      if (input) input.value = catInput.value;
      applyFilters();
      renderCatalogue();
    });
  }
}

function wireFilters() {
  if (window.OpportunityList) return; // Managed by OpportunityList in list.js
  // Type pills
  document.querySelectorAll('[data-filter="type"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter="type"]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.filterType = btn.dataset.value;
      applyFilters();
      renderCatalogue();
    });
  });

  // Status pills
  document.querySelectorAll('[data-filter="status"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter="status"]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.filterStatus = btn.dataset.value;
      applyFilters();
      renderCatalogue();
    });
  });

  // Clear button
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.query = '';
      state.filterType = 'all';
      state.filterStatus = 'all';
      state.showFavsOnly = false;

      const heroInput = document.getElementById('hero-search-input');
      const catInput = document.getElementById('cat-search');
      if (heroInput) heroInput.value = '';
      if (catInput) catInput.value = '';

      document.querySelectorAll('[data-filter="type"]').forEach(b =>
        b.classList.toggle('is-active', b.dataset.value === 'all'));
      document.querySelectorAll('[data-filter="status"]').forEach(b =>
        b.classList.toggle('is-active', b.dataset.value === 'all'));

      const favBtn = document.getElementById('fav-toggle');
      if (favBtn) favBtn.setAttribute('aria-pressed', 'false');

      applyFilters();
      renderCatalogue();
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════ */
function wireHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   NAV OVERLAY
   ═══════════════════════════════════════════════════════════════ */
function wireNavOverlay() {
  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('nav-overlay');
  const backdrop = document.getElementById('nav-backdrop');
  if (!toggle || !overlay) return;

  function openNav() {
    overlay.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', I18N_MODULE.t('menu.close'));
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first nav link
    setTimeout(() => {
      const firstLink = overlay.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }, 100);
  }

  function closeNav() {
    overlay.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', I18N_MODULE.t('menu.open'));
    overlay.setAttribute('aria-hidden', 'true');
    if (!state.modalOpen) document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    overlay.classList.contains('is-open') ? closeNav() : openNav();
  });

  backdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeNav();
  });

  // Close on nav link click
  overlay.querySelectorAll('[data-close-nav]').forEach(el => {
    el.addEventListener('click', closeNav);
  });
}

/* ═══════════════════════════════════════════════════════════════
   LANGUAGE SWITCH
   ═══════════════════════════════════════════════════════════════ */
function wireLangSwitch() {
  const btn = document.getElementById('lang-switch');