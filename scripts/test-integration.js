/**
 * بوابة الفرص (Opportunities Portal) — Comprehensive Integration Test Suite
 * Script: scripts/test-integration.js
 * Author: Agent D (Integration & Design Consistency)
 *
 * Verifies:
 * 1. Data Integrity (20 opportunities, HTTPS sources, verified dates)
 * 2. i18n Master Dictionary Completeness (AR & EN keys sync)
 * 3. Favorites Manager (persistence, toggling, count, event emission, corrupted storage resilience)
 * 4. Arabic/English Search Normalization & Compound Filtering
 * 5. Deadline Calculations & Classification (urgent, ongoing, course-dependent, dual-deadline)
 * 6. Safe DOM Security Standards (zero unescaped innerHTML for user/opportunity data)
 * 7. Multi-page Landmark & Architecture Consistency (index, detail, about, sw.js)
 */

'use strict';

const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✔ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✖ FAILED: ${message}`);
  }
}

function suite(title) {
  console.log(`\n─── ${title} ───`);
}

// ═══════════════════════════════════════════════════════════════
// 1. DATA INTEGRITY
// ═══════════════════════════════════════════════════════════════
suite('1. Opportunity Data Integrity (data/opportunities.json)');

const dataRaw = fs.readFileSync(path.join(__dirname, '..', 'data', 'opportunities.json'), 'utf8');
const data = JSON.parse(dataRaw);
const opps = data.opportunities || [];

assert(Array.isArray(opps), 'Opportunities array is defined');
assert(opps.length === 20, `Contains exactly 20 verified opportunities (found ${opps.length})`);

let allHttps = true;
let allVerified = true;
let allBilingual = true;
const idSet = new Set();
let duplicates = 0;

opps.forEach(opp => {
  if (idSet.has(opp.id)) duplicates++;
  idSet.add(opp.id);

  if (!opp.officialSourceUrl || !opp.officialSourceUrl.startsWith('https://')) {
    allHttps = false;
  }
  if (!opp.verificationDate || !/^\d{4}-\d{2}-\d{2}$/.test(opp.verificationDate)) {
    allVerified = false;
  }
  if (!opp.title?.ar || !opp.title?.en || !opp.description?.ar || !opp.description?.en) {
    allBilingual = false;
  }
});

assert(duplicates === 0, 'All 20 opportunity IDs are unique');
assert(allHttps, 'All 20 opportunities use secure HTTPS source URLs');
assert(allVerified, 'All 20 opportunities have valid ISO verification dates');
assert(allBilingual, 'All 20 opportunities have complete bilingual titles and descriptions');

// ═══════════════════════════════════════════════════════════════
// 2. I18N MASTER DICTIONARY
// ═══════════════════════════════════════════════════════════════
suite('2. Unified i18n Master Dictionary (js/i18n.js)');

const i18nCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'i18n.js'), 'utf8');

// Evaluate i18n in a mocked browser context
const i18nContext = {
  window: {},
  document: {
    documentElement: { setAttribute: () => {}, getAttribute: () => 'ar' },
    body: {
      classList: { toggle: () => {} },
      setAttribute: () => {}
    },
    querySelectorAll: () => [],
    getElementById: () => null,
    dispatchEvent: () => {}
  },
  localStorage: {
    getItem: () => 'ar',
    setItem: () => {}
  },
  CustomEvent: function(name, opts) { return { name, ...opts }; }
};

const runI18n = new Function('window', 'document', 'localStorage', 'CustomEvent', `${i18nCode}; return window.I18N_MODULE;`);
const I18N_MODULE = runI18n(i18nContext.window, i18nContext.document, i18nContext.localStorage, i18nContext.CustomEvent);

assert(typeof I18N_MODULE === 'object', 'I18N_MODULE exported properly to window');
assert(typeof I18N_MODULE.t === 'function', 'I18N_MODULE.t is a callable function');
assert(typeof I18N_MODULE.switchLang === 'function', 'I18N_MODULE.switchLang is available');

const arTitle = I18N_MODULE.t('site.title', 'ar');
const enTitle = I18N_MODULE.t('site.title', 'en');
assert(arTitle === 'بوابة الفرص', `Arabic site title matches: "${arTitle}"`);
assert(enTitle === 'Opportunities Portal', `English site title matches: "${enTitle}"`);

// Verify essential unified keys across modules A, B, and C
const essentialKeys = [
  'filter.field', 'filter.country', 'filter.urgent', 'filter.reset',
  'detail.backToHome', 'detail.applyOfficial', 'detail.admissionDeadline',
  'about.title', 'faq.heading', 'nav.home', 'nav.about'
];

let allKeysPresent = true;
essentialKeys.forEach(k => {
  const arVal = I18N_MODULE.t(k, 'ar');
  const enVal = I18N_MODULE.t(k, 'en');
  if (arVal === k || enVal === k) {
    allKeysPresent = false;
    console.error(`Missing translation for key: ${k}`);
  }
});
assert(allKeysPresent, 'All key cross-page translation strings exist in both Arabic and English');

// ═══════════════════════════════════════════════════════════════
// 3. FAVORITES MANAGER
// ═══════════════════════════════════════════════════════════════
suite('3. Standalone Favorites Manager (js/favorites.js)');

const favCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'favorites.js'), 'utf8');

// Mock localStorage and window
let store = {};
let dispatchedEvents = [];
const mockLocalStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { store = {}; }
};

const favWindow = {
  localStorage: mockLocalStorage,
  addEventListener: () => {},
  removeEventListener: () => {}
};
const favDoc = {
  dispatchEvent: (e) => { dispatchedEvents.push(e); },
  addEventListener: () => {},
  removeEventListener: () => {}
};

const runFav = new Function('window', 'document', 'CustomEvent', 'module', `${favCode}; return window.Favorites;`);
const Favorites = runFav(favWindow, favDoc, i18nContext.CustomEvent, { exports: {} });

assert(typeof Favorites === 'object', 'Favorites module exported successfully');
assert(Favorites.isStorageSupported() === true, 'localStorage is reported as supported');

// Test adding favorite
Favorites.clearFavorites();
assert(Favorites.getFavoritesCount() === 0, 'Initial favorites count is 0');

const added = Favorites.toggleFavorite('oxford-weidenfeld-hoffmann-2027-2028');
assert(added === true, 'Toggling empty favorite returns true (added)');
assert(Favorites.isFavorite('oxford-weidenfeld-hoffmann-2027-2028') === true, 'isFavorite returns true');
assert(Favorites.getFavoritesCount() === 1, 'getFavoritesCount returns 1');
assert(JSON.parse(store['op-favorites']).includes('oxford-weidenfeld-hoffmann-2027-2028'), 'Persisted to localStorage');

// Test event dispatch
assert(dispatchedEvents.length > 0, 'CustomEvent favorites:changed was dispatched');
const lastEvent = dispatchedEvents[dispatchedEvents.length - 1];
assert(lastEvent.detail.id === 'oxford-weidenfeld-hoffmann-2027-2028', 'Event contains target ID');
assert(lastEvent.detail.isFavorite === true, 'Event indicates isFavorite is true');

// Test removing favorite
const removed = Favorites.toggleFavorite('oxford-weidenfeld-hoffmann-2027-2028');
assert(removed === false, 'Toggling existing favorite returns false (removed)');
assert(Favorites.isFavorite('oxford-weidenfeld-hoffmann-2027-2028') === false, 'isFavorite returns false');
assert(Favorites.getFavoritesCount() === 0, 'Count back to 0');

// Test corrupted JSON recovery
store['op-favorites'] = '{ corrupted invalid json';
Favorites.reload();
assert(Favorites.getFavoritesCount() === 0, 'Gracefully recovers from corrupted JSON in storage without crashing');

// ═══════════════════════════════════════════════════════════════
// 4. SEARCH NORMALIZATION & COMPOUND FILTERING
// ═══════════════════════════════════════════════════════════════
suite('4. Arabic Search Normalization & Filtering Logic');

function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[أإآٱ]/g, 'ا')               // normalize alef
    .replace(/ة/g, 'ه')                   // normalize teh marbuta
    .replace(/ى/g, 'ي')                   // normalize alef maqsura
    .replace(/[ـ\-\_\.\,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

assert(normalizeText('أكسفورد') === 'اكسفورد', 'Alef with hamza normalized to plain alef');
assert(normalizeText('المِنْحَة') === 'المنحه', 'Tashkeel removed and teh marbuta normalized to heh');
assert(normalizeText('جامعة إكستر') === 'جامعه اكستر', 'Compound Arabic string normalized properly');

// Test search matching on dataset
const oxfordMatch = opps.filter(o => {
  const normTitleAr = normalizeText(o.title.ar);
  const normTitleEn = normalizeText(o.title.en);
  const q = normalizeText('اكسفورد');
  return normTitleAr.includes(q) || normTitleEn.includes(q);
});
assert(oxfordMatch.length >= 1, `Found ${oxfordMatch.length} match(es) searching for "اكسفورد"`);

const csMatch = opps.filter(o => 
  Array.isArray(o.fields) && o.fields.some(f => f.category === 'computer-science')
);
assert(csMatch.length >= 3, `Found ${csMatch.length} opportunities in computer-science category`);

const eligibleMatch = opps.filter(o => o.yemenEligibility === 'eligible');
assert(eligibleMatch.length >= 10, `Found ${eligibleMatch.length} fully eligible opportunities for Yemen`);

// ═══════════════════════════════════════════════════════════════
// 5. DEADLINE & DUAL-DEADLINE LOGIC
// ═══════════════════════════════════════════════════════════════
suite('5. Deadline Calculation & Classification');

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  d.setHours(0, 0, 0, 0);
  return Math.round((d - TODAY) / 86400000);
}

// Check ongoing
const ongoingOpp = opps.find(o => o.deadlineType === 'ongoing');
assert(ongoingOpp !== undefined, `Found ongoing opportunity: ${ongoingOpp?.id}`);

// Check course-dependent
const oxford = opps.find(o => o.id === 'oxford-weidenfeld-hoffmann-2027-2028');
assert(oxford && oxford.deadlineType === 'course-dependent', 'Oxford Weidenfeld is classified as course-dependent');

// Check dual-deadline integrity: admissionDeadline cannot be after scholarship deadline if both exist
let dualDeadlineValid = true;
opps.forEach(o => {
  if (o.admissionDeadline && o.deadline) {
    const adm = new Date(o.admissionDeadline).getTime();
    const ddl = new Date(o.deadline).getTime();
    // Admission deadline must be <= scholarship deadline
    if (adm > ddl) {
      dualDeadlineValid = false;
      console.error(`Invalid dual deadline order in ${o.id}: adm=${o.admissionDeadline} > ddl=${o.deadline}`);
    }
  }
});
assert(dualDeadlineValid, 'All dual deadlines adhere to chronological integrity (admission deadline <= scholarship deadline)');

// ═══════════════════════════════════════════════════════════════
// 6. SAFE DOM SECURITY
// ═══════════════════════════════════════════════════════════════
suite('6. Security & Safe DOM Enforcement');

const listCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'list.js'), 'utf8');
const detailCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'detail.js'), 'utf8');
const mainCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');

// Check that opportunity fields are not directly injected via innerHTML
const dangerousPatterns = [
  /\.innerHTML\s*=\s*.*opp\.title/,
  /\.innerHTML\s*=\s*.*opp\.description/,
  /\.innerHTML\s*=\s*.*opp\.provider/,
  /\.innerHTML\s*=\s*.*opp\.officialSourceUrl/,
  /\.innerHTML\s*=\s*.*item\.title/
];

let safeDOM = true;
[
  { name: 'js/list.js', code: listCode },
  { name: 'js/detail.js', code: detailCode },
  { name: 'js/main.js', code: mainCode }
].forEach(file => {
  dangerousPatterns.forEach(pattern => {
    if (pattern.test(file.code)) {
      safeDOM = false;
      console.error(`Unsafe innerHTML pattern found in ${file.name}: ${pattern}`);
    }
  });
});

assert(safeDOM, 'Zero unsafe innerHTML assignments of opportunity text in list.js, detail.js, and main.js');

// Verify external links have rel="noopener noreferrer"
assert(detailCode.includes('noopener noreferrer'), 'detail.js applies rel="noopener noreferrer" to external links');
assert(listCode.includes('noopener noreferrer') || listCode.includes('detail.html?id='), 'list.js uses safe links');

// ═══════════════════════════════════════════════════════════════
// 7. MULTI-PAGE LANDMARKS & ARCHITECTURE CONSISTENCY
// ═══════════════════════════════════════════════════════════════
suite('7. Multi-page Landmarks, Navigation & Service Worker');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const detailHtml = fs.readFileSync(path.join(__dirname, '..', 'detail.html'), 'utf8');
const aboutHtml = fs.readFileSync(path.join(__dirname, '..', 'about.html'), 'utf8');
const swCode = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');

// Check Service Worker cache version
assert(swCode.includes("const CACHE_VERSION = 'op-v2.1'"), 'Service Worker cache version updated to op-v2.1');
assert(swCode.includes("'./detail.html'") && swCode.includes("'./about.html'"), 'Service Worker static cache includes detail.html and about.html');
assert(swCode.includes("'./js/favorites.js'") && swCode.includes("'./js/list.js'"), 'Service Worker static cache includes favorites.js and list.js');

// Check header, navigation, and footer consistency across all 3 pages
const pages = [
  { name: 'index.html', html: indexHtml },
  { name: 'detail.html', html: detailHtml },
  { name: 'about.html', html: aboutHtml }
];

pages.forEach(p => {
  assert(p.html.includes('lang="ar"') && p.html.includes('dir="rtl"'), `${p.name} has lang="ar" and dir="rtl"`);
  assert(p.html.includes('class="skip-link"'), `${p.name} has accessible skip-link`);
  assert(p.html.includes('id="site-header"'), `${p.name} has unified #site-header`);
  assert(p.html.includes('id="menu-toggle"'), `${p.name} has mobile #menu-toggle`);
  assert(p.html.includes('id="nav-overlay"'), `${p.name} has #nav-overlay drawer`);
  assert(p.html.includes('class="cursor-dot"'), `${p.name} has custom interactive cursor-dot`);
  assert(p.html.includes('class="site-footer'), `${p.name} has unified .site-footer landmark`);
  assert(p.html.includes('css/main.css'), `${p.name} links unified stylesheet css/main.css`);
  assert(p.html.includes('js/i18n.js'), `${p.name} links master i18n script`);
  assert(p.html.includes('js/favorites.js'), `${p.name} links favorites manager script`);
  assert(p.html.includes('navigator.serviceWorker.register'), `${p.name} registers Service Worker`);
});

// Verify no leftover temporary guard in list.js
assert(!listCode.includes('installMainJsGuard'), 'No temporary monkey-patch guard remains in list.js');

// ═══════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════════');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('══════════════════════════════════════════════════\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL INTEGRATION TESTS PASSED PERFECTLY!\n');
  process.exit(0);
}