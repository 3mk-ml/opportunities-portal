/**
 * بوابة الفرص (Opportunities Portal) — Opportunity Listings & Advanced Search
 * Module: js/list.js
 * Author: Agent A (LLM4Yemen Cohort 1)
 *
 * Responsibilities:
 * - Real-time bilingual search with debounce across title, provider, country, fields, description
 * - Compound multidimensional filtering (Type, Status, Field Category, Country, Level, Yemen Eligibility, Urgent <= 14d, Favorites)
 * - Smart sorting (Deadline ascending/descending, Title A-Z, smart default) with closed/expired always at the end
 * - Safe DOM construction (document.createElement + textContent, zero innerHTML injection for opportunity data)
 * - Direct deep links to detail.html?id=... on every card + keyboard navigation (Enter/Space)
 * - Dynamic country filter population from data
 * - Active filter indicator chips with one-click removal
 * - Accessible empty state with Reset Filters button
 * - Bilingual RTL/LTR reactivity on 'langchange'
 */

'use strict';

(function () {
  /* ═══════════════════════════════════════════════════════════════
     1. CONSTANTS & CONFIGURATION
     ═══════════════════════════════════════════════════════════════ */
  const DATA_URL = 'data/opportunities.json?v=1.2.0';
  const URGENT_DAYS_THRESHOLD = 14;
  const FAV_STORAGE_KEY = 'op-favorites';
  const SEARCH_DEBOUNCE_MS = 200;

  // Localized dictionary for Agent A controls (Agent D can integrate into js/i18n.js)
  const LIST_I18N = {
    ar: {
      'filter.field': 'التخصص الأكاديمي',
      'filter.allFields': 'جميع التخصصات',
      'filter.country': 'الدولة',
      'filter.allCountries': 'جميع الدول',
      'filter.level': 'المستوى الدراسي',
      'filter.allLevels': 'جميع المستويات',
      'filter.eligibility': 'أهلية اليمن',
      'filter.allEligibility': 'جميع حالات الأهلية',
      'filter.sort': 'الترتيب',
      'filter.sortDefault': 'الترتيب الافتراضي (النشطة أولاً)',
      'filter.sortDeadlineAsc': 'الأقرب موعداً نهائياً',
      'filter.sortDeadlineDesc': 'الأبعد موعداً نهائياً',
      'filter.sortTitleAsc': 'أبجدياً حسب العنوان (أ–ي)',
      'filter.urgent': 'مواعيد عاجلة (≤ 14 يوم)',
      'filter.urgentShort': 'عاجلة (≤ 14 يوم)',
      'filter.reset': 'إعادة ضبط الفلاتر',
      'filter.typeLabel': 'النوع',
      'filter.statusLabel': 'الحالة',
      'results.all': 'فرصة موثقة متاحة',
      'results.filtered': 'فرصة مطابقة بعد الفلترة',
      'results.outOf': 'من أصل',
      'results.none': 'لا توجد نتائج مطابقة',
      'card.viewDetails': 'عرض التفاصيل والتقديم',
      'card.urgentDays': 'يوم متبقٍ',
      'card.closesToday': 'ينتهي التقديم اليوم!',
      'card.closed': 'انتهى التقديم',
      'card.courseDep': 'يعتمد على التخصص',
      'card.ongoing': 'مفتوح باستمرار',
      'card.unknown': 'غير محدد',
      'activeFilters.clearAll': 'مسح الكل',
      // Categories
      'cat.all': 'جميع التخصصات',
      'cat.engineering': 'الهندسة والتكنولوجيا',
      'cat.medicine': 'الطب والعلوم الصحية',
      'cat.computer-science': 'علوم الحاسوب والذكاء الاصطناعي',
      'cat.business': 'إدارة الأعمال والاقتصاد',
      'cat.humanities': 'العلوم الإنسانية واللغات',
      'cat.natural-sciences': 'العلوم الطبيعية والبيئية',
      'cat.social-sciences': 'العلوم الاجتماعية والقانون',
      'cat.arts-design': 'الفنون والتصميم',
      'cat.general': 'تخصصات عامة ومتعددة',
      // Levels
      'lvl.all': 'جميع المستويات',
      'lvl.high-school': 'الثانوية العامة',
      'lvl.undergraduate': 'بكالوريوس',
      'lvl.postgraduate': 'دراسات عليا (ماجستير)',
      'lvl.doctorate': 'دكتوراه',
      'lvl.postdoctoral': 'ما بعد الدكتوراه',
      'lvl.all-levels': 'متاح لكافة المستويات',
      // Eligibility
      'elig.all': 'جميع حالات الأهلية',
      'elig.eligible': 'مؤهل للطلاب اليمنيين',
      'elig.conditional': 'مؤهل بشروط',
      'elig.restricted-or-ineligible': 'مقيد أو غير مؤهل',
      'elig.unconfirmed': 'أهلية غير مؤكدة',
      // Status
      'stat.all': 'جميع الحالات',
      'stat.open': 'مفتوحة',
      'stat.upcoming': 'قادمة',
      'stat.closed': 'مغلقة',
      'stat.course-dependent': 'حسب التخصص',
      'stat.unconfirmed': 'غير مؤكد',
      // Type
      'typ.all': 'الكل',
      'typ.scholarship': 'منح دراسية',
      'typ.course': 'دورات تدريبية',
      'typ.fellowship': 'زمالات',
      'typ.internship': 'تدريب مهني',
      'typ.leadership-program': 'برامج قيادة'
    },
    en: {
      'filter.field': 'Field / Discipline',
      'filter.allFields': 'All Fields',
      'filter.country': 'Country',
      'filter.allCountries': 'All Countries',
      'filter.level': 'Educational Level',
      'filter.allLevels': 'All Levels',
      'filter.eligibility': 'Yemen Eligibility',
      'filter.allEligibility': 'All Eligibility',
      'filter.sort': 'Sort by',
      'filter.sortDefault': 'Default (Active First)',
      'filter.sortDeadlineAsc': 'Soonest Deadline First',
      'filter.sortDeadlineDesc': 'Furthest Deadline First',
      'filter.sortTitleAsc': 'Title (A–Z)',
      'filter.urgent': 'Urgent Deadlines (≤ 14d)',
      'filter.urgentShort': 'Urgent (≤ 14d)',
      'filter.reset': 'Reset Filters',
      'filter.typeLabel': 'Type',
      'filter.statusLabel': 'Status',
      'results.all': 'verified opportunities available',
      'results.filtered': 'matching opportunities',
      'results.outOf': 'out of',
      'results.none': 'No matching opportunities',
      'card.viewDetails': 'View Details & Apply',
      'card.urgentDays': 'days left',
      'card.closesToday': 'Applications close today!',
      'card.closed': 'Applications closed',
      'card.courseDep': 'Course-dependent',
      'card.ongoing': 'Open — no deadline',
      'card.unknown': 'Not specified',
      'activeFilters.clearAll': 'Clear all',
      // Categories
      'cat.all': 'All Fields',
      'cat.engineering': 'Engineering & Technology',
      'cat.medicine': 'Medicine & Health Sciences',
      'cat.computer-science': 'Computer Science & AI',
      'cat.business': 'Business & Economics',
      'cat.humanities': 'Humanities & Languages',
      'cat.natural-sciences': 'Natural & Environmental Sciences',
      'cat.social-sciences': 'Social Sciences & Law',
      'cat.arts-design': 'Arts & Design',
      'cat.general': 'General / Multi-disciplinary',
      // Levels
      'lvl.all': 'All Levels',
      'lvl.high-school': 'High School',
      'lvl.undergraduate': 'Undergraduate',
      'lvl.postgraduate': 'Postgraduate (Master\'s)',
      'lvl.doctorate': 'Doctorate (PhD)',
      'lvl.postdoctoral': 'Postdoctoral',
      'lvl.all-levels': 'Open to All Levels',
      // Eligibility
      'elig.all': 'All Eligibility',
      'elig.eligible': 'Eligible for Yemenis',
      'elig.conditional': 'Conditional Eligibility',
      'elig.restricted-or-ineligible': 'Restricted / Ineligible',
      'elig.unconfirmed': 'Eligibility Unconfirmed',
      // Status
      'stat.all': 'All Statuses',
      'stat.open': 'Open',
      'stat.upcoming': 'Upcoming',
      'stat.closed': 'Closed',
      'stat.course-dependent': 'Course-Dependent',
      'stat.unconfirmed': 'Unconfirmed',
      // Type
      'typ.all': 'All',
      'typ.scholarship': 'Scholarships',
      'typ.course': 'Courses',
      'typ.fellowship': 'Fellowships',
      'typ.internship': 'Internships',
      'typ.leadership-program': 'Leadership Programs'
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     2. MODULE STATE
     ═══════════════════════════════════════════════════════════════ */
  const state = {
    opportunities: [],
    filtered: [],
    distinctCountries: [], // { code, en, ar }
    query: '',
    filterType: 'all',
    filterStatus: 'all',
    filterCategory: 'all',
    filterCountry: 'all',
    filterLevel: 'all',
    filterEligibility: 'all',
    filterUrgent: false,
    filterFavs: false,
    sortBy: 'default',
    lang: 'ar',
    favorites: new Set(),
    isLoaded: false
  };

  /* ═══════════════════════════════════════════════════════════════
     3. TRANSLATION & LOCALIZATION HELPERS
     ═══════════════════════════════════════════════════════════════ */
  function t(key) {
    const l = state.lang;
    // Check global I18N_MODULE first
    if (window.I18N_MODULE && typeof window.I18N_MODULE.t === 'function') {
      const globalVal = window.I18N_MODULE.t(key, l);
      if (globalVal && globalVal !== key) return globalVal;
    }
    // Check local dictionary
    if (LIST_I18N[l] && LIST_I18N[l][key]) return LIST_I18N[l][key];
    if (LIST_I18N.ar && LIST_I18N.ar[key]) return LIST_I18N.ar[key];
    return key;
  }

  /* ═══════════════════════════════════════════════════════════════
     5. DATE & DEADLINE UTILITIES
     ═══════════════════════════════════════════════════════════════ */
  function getToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    d.setHours(0, 0, 0, 0);
    return Math.round((d - getToday()) / 86400000);
  }

  function isClosedOrExpired(opp) {
    if (opp.applicationStatus === 'closed') return true;
    if (!opp.deadline) return false;
    const days = daysUntil(opp.deadline);
    return days !== null && days < 0;
  }

  function formatDate(dateStr, lang) {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }

  function getDeadlineDisplay(opp, lang) {
    const { deadline, deadlineType, applicationStatus } = opp;

    if (applicationStatus === 'closed') {
      return { text: t('card.closed'), cls: 'deadline-expired', days: null };
    }
    if (deadlineType === 'ongoing') {
      return { text: t('card.ongoing'), cls: '', days: null };
    }
    if (deadlineType === 'course-dependent') {
      return { text: t('card.courseDep'), cls: '', days: null };
    }
    if (!deadline || deadlineType === 'unknown') {
      return { text: t('card.unknown'), cls: '', days: null };
    }

    const days = daysUntil(deadline);
    if (days < 0) {
      return { text: formatDate(deadline, lang) || deadline, cls: 'deadline-expired', days };
    }
    if (days === 0) {
      return { text: t('card.closesToday'), cls: 'deadline-critical', days: 0 };
    }
    if (days <= URGENT_DAYS_THRESHOLD) {
      const label = lang === 'ar' ? `${days} ${t('card.urgentDays')}` : `${days} ${t('card.urgentDays')}`;
      return { text: label, cls: 'deadline-urgent', days };
    }

    return { text: formatDate(deadline, lang) || deadline, cls: '', days };
  }

  /* ═══════════════════════════════════════════════════════════════
     6. TEXT NORMALIZATION & SEARCH MATCHING
     ═══════════════════════════════════════════════════════════════ */
  function normalizeText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, '') // Remove Arabic tashkeel/diacritics
      .replace(/[أإآء]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim();
  }

  function buildSearchIndex(opp) {
    const parts = [
      opp.title?.ar, opp.title?.en,
      opp.provider?.ar, opp.provider?.en,
      opp.country?.ar, opp.country?.en, opp.country?.code,
      opp.description?.ar, opp.description?.en
    ];
    if (Array.isArray(opp.fields)) {
      opp.fields.forEach(f => {
        parts.push(f.name?.ar, f.name?.en, f.category);
      });
    }
    if (Array.isArray(opp.levels)) {
      parts.push(...opp.levels);
    }
    parts.push(opp.type, opp.applicationStatus, opp.yemenEligibility);
    return normalizeText(parts.filter(Boolean).join(' '));
  }

  /* ═══════════════════════════════════════════════════════════════
     7. FAVORITES PERSISTENCE
     ═══════════════════════════════════════════════════════════════ */
  function loadFavorites() {
    if (typeof window.Favorites !== 'undefined' && typeof window.Favorites.getFavorites === 'function') {
      state.favorites = new Set(window.Favorites.getFavorites());
      return;
    }
    try {
      const stored = localStorage.getItem(FAV_STORAGE_KEY);
      if (stored) {
        state.favorites = new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read favorites from localStorage:', e);
    }
  }

  function saveFavorites() {
    if (typeof window.Favorites !== 'undefined') return;
    try {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify([...state.favorites]));
    } catch (e) {
      console.warn('Could not save favorites to localStorage:', e);
    }
  }

  function toggleFavorite(id) {
    let isFaved = false;
    if (typeof window.Favorites !== 'undefined' && typeof window.Favorites.toggleFavorite === 'function') {
      isFaved = window.Favorites.toggleFavorite(id);
      state.favorites = new Set(window.Favorites.getFavorites());
    } else {
      if (state.favorites.has(id)) {
        state.favorites.delete(id);
        isFaved = false;
      } else {
        state.favorites.add(id);
        isFaved = true;
      }
      saveFavorites();

      try {
        window.dispatchEvent(new CustomEvent('favoriteschange', {
          detail: { id, isFavorited: isFaved, favorites: [...state.favorites] }
        }));
      } catch (e) {}
    }

    // Update buttons in DOM
    document.querySelectorAll(`.fc-fav[data-id="${id}"]`).forEach(btn => {
      btn.classList.toggle('is-faved', isFaved);
      btn.setAttribute('aria-label', isFaved ? t('fav.remove') : t('fav.add'));
      const svg = btn.querySelector('svg');
      if (svg) svg.style.fill = isFaved ? 'currentColor' : 'none';
    });

    // If favorites-only mode active, re-filter
    if (state.filterFavs) {
      applyFilters();
      render();
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     8. COMPOUND FILTERING & SORTING ENGINE
     ═══════════════════════════════════════════════════════════════ */
  function applyFilters() {
    const rawTokens = normalizeText(state.query).split(/\s+/).filter(Boolean);

    state.filtered = state.opportunities.filter(opp => {
      // 1. Favorites toggle
      if (state.filterFavs && !state.favorites.has(opp.id)) {
        return false;
      }

      // 2. Type filter
      if (state.filterType !== 'all' && opp.type !== state.filterType) {
        return false;
      }

      // 3. Status filter
      if (state.filterStatus !== 'all' && opp.applicationStatus !== state.filterStatus) {
        return false;
      }

      // 4. Field Category filter
      if (state.filterCategory !== 'all') {
        const matchesCategory = Array.isArray(opp.fields) &&
          opp.fields.some(f => f.category === state.filterCategory);
        if (!matchesCategory) return false;
      }

      // 5. Country filter
      if (state.filterCountry !== 'all') {
        if (state.filterCountry === 'global') {
          const isGlobal = opp.locationScope === 'global' ||
            !opp.country ||
            opp.country.code === 'GLOBAL';
          if (!isGlobal) return false;
        } else {
          const c = opp.country;
          const matchesCountry = c && (
            (c.code && c.code.toUpperCase() === state.filterCountry.toUpperCase()) ||
            (c.en && c.en.toLowerCase() === state.filterCountry.toLowerCase())
          );
          if (!matchesCountry) return false;
        }
      }

      // 6. Educational Level filter
      if (state.filterLevel !== 'all') {
        const lvls = opp.levels || [];
        const matchesLevel = lvls.includes(state.filterLevel) || lvls.includes('all-levels');
        if (!matchesLevel) return false;
      }

      // 7. Yemen Eligibility filter
      if (state.filterEligibility !== 'all') {
        if (opp.yemenEligibility !== state.filterEligibility) {
          return false;
        }
      }

      // 8. Approaching Deadlines quick-filter toggle (<= 14 days, US-03)
      if (state.filterUrgent) {
        if (opp.applicationStatus === 'closed') return false;
        const du = daysUntil(opp.deadline);
        if (du === null || du < 0 || du > URGENT_DAYS_THRESHOLD) {
          return false;
        }
      }

      // 9. Full-text bilingual search
      if (rawTokens.length > 0) {
        const textIndex = opp._searchIndex || buildSearchIndex(opp);
        const matchesQuery = rawTokens.every(tok => textIndex.includes(tok));
        if (!matchesQuery) return false;
      }

      return true;
    });

    // Apply sorting
    sortFiltered();
  }

  function sortFiltered() {
    const lang = state.lang;
    const mode = state.sortBy;

    state.filtered.sort((a, b) => {
      // RULE: Closed / Expired opportunities MUST always sort to the end
      const aExp = isClosedOrExpired(a);
      const bExp = isClosedOrExpired(b);
      if (aExp !== bExp) {
        return aExp ? 1 : -1;
      }

      // Title sort
      if (mode === 'title-asc') {
        const titleA = (a.title && (a.title[lang] || a.title.ar)) || '';
        const titleB = (b.title && (b.title[lang] || b.title.ar)) || '';
        return titleA.localeCompare(titleB, lang);
      }

      // Furthest deadline first
      if (mode === 'deadline-desc') {
        const aDays = daysUntil(a.deadline);
        const bDays = daysUntil(b.deadline);
        if (aDays !== null && bDays !== null) return bDays - aDays;
        if (aDays !== null) return -1;
        if (bDays !== null) return 1;
        const titleA = (a.title && (a.title[lang] || a.title.ar)) || '';
        const titleB = (b.title && (b.title[lang] || b.title.ar)) || '';
        return titleA.localeCompare(titleB, lang);
      }

      // Soonest deadline first (or default smart)
      const aDays = daysUntil(a.deadline);
      const bDays = daysUntil(b.deadline);
      if (aDays !== null && bDays !== null) return aDays - bDays;
      if (aDays !== null) return -1;
      if (bDays !== null) return 1;

      // Tiebreaker: compare titles
      const titleA = (a.title && (a.title[lang] || a.title.ar)) || '';
      const titleB = (b.title && (b.title[lang] || b.title.ar)) || '';
      return titleA.localeCompare(titleB, lang);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     9. SAFE DOM BUILDERS (Strictly textContent + createElement)
     ═══════════════════════════════════════════════════════════════ */
  function createSvg(width, height, pathD, viewBox = '0 0 24 24') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    if (Array.isArray(pathD)) {
      pathD.forEach(d => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
      });
    } else {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      svg.appendChild(path);
    }
    return svg;
  }

  function createCalendarSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '13');
    svg.setAttribute('height', '13');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('aria-hidden', 'true');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '3');
    rect.setAttribute('y', '4');
    rect.setAttribute('width', '18');
    rect.setAttribute('height', '18');
    rect.setAttribute('rx', '2');
    svg.appendChild(rect);

    const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l1.setAttribute('x1', '16');
    l1.setAttribute('y1', '2');
    l1.setAttribute('x2', '16');
    l1.setAttribute('y2', '6');
    svg.appendChild(l1);

    const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l2.setAttribute('x1', '8');
    l2.setAttribute('y1', '2');
    l2.setAttribute('x2', '8');
    l2.setAttribute('y2', '6');
    svg.appendChild(l2);

    const l3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l3.setAttribute('x1', '3');
    l3.setAttribute('y1', '10');
    l3.setAttribute('x2', '21');
    l3.setAttribute('y2', '10');
    svg.appendChild(l3);

    return svg;
  }

  function createGraduationCapSvg() {
    return createSvg(13, 13, [
      'M22 10v6M2 10l10-5 10 5-10 5z',
      'M6 12v5c3 3 9 3 12 0v-5'
    ]);
  }

  function createCoinSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '13');
    svg.setAttribute('height', '13');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('aria-hidden', 'true');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    svg.appendChild(circle);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3');
    svg.appendChild(path);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '12');
    line.setAttribute('y1', '17');
    line.setAttribute('x2', '12.01');
    line.setAttribute('y2', '17');
    svg.appendChild(line);

    return svg;
  }

  function createArrowSvg(lang) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // Flip arrow for RTL
    if (lang === 'ar') {
      path.setAttribute('d', 'M19 12H5M12 19l-7-7 7-7');
    } else {
      path.setAttribute('d', 'M5 12h14M12 5l7 7-7 7');
    }
    svg.appendChild(path);
    return svg;
  }

  function buildTag(text, cls) {
    const span = document.createElement('span');
    span.className = `tag ${cls}`;
    span.textContent = text;
    return span;
  }

  function buildStatusTag(opp) {
    const statusMap = {
      'open': ['status.open', 'tag-status--open'],
      'closed': ['status.closed', 'tag-status--closed'],
      'upcoming': ['status.upcoming', 'tag-status--upcoming'],
      'unconfirmed': ['status.unconfirmed', 'tag-status--unconfirmed'],
      'course-dependent': ['status.course-dependent', 'tag-status--course-dependent'],
      'admissions-route': ['status.open', 'tag-status--open']
    };
    const [key, cls] = statusMap[opp.applicationStatus] || ['status.unconfirmed', 'tag-status--unconfirmed'];
    return buildTag(t(key), cls);
  }

  function buildTypeTag(opp) {
    const typeKey = 'type.' + (opp.type || 'scholarship');
    return buildTag(t(typeKey), 'tag-type');
  }

  function buildEligTag(opp) {
    const eligMap = {
      'eligible': ['eligibility.eligible', 'tag-eligibility--eligible'],
      'conditional': ['eligibility.conditional', 'tag-eligibility--conditional'],
      'restricted-or-ineligible': ['eligibility.restricted-or-ineligible', 'tag-eligibility--restricted'],
      'unconfirmed': ['eligibility.unconfirmed', 'tag-eligibility--unconfirmed']
    };
    const [key, cls] = eligMap[opp.yemenEligibility] || ['eligibility.unconfirmed', 'tag-eligibility--unconfirmed'];
    return buildTag(t(key), cls);
  }

  function buildCategoryTag(category) {
    if (!category) return null;
    const catText = t('cat.' + category) || category;
    return buildTag(catText, 'tag-category');
  }

  function buildFavBtn(opp) {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isFaved = state.favorites.has(opp.id);
    btn.className = 'fc-fav' + (isFaved ? ' is-faved' : '');
    btn.setAttribute('aria-label', isFaved ? t('fav.remove') : t('fav.add'));
    btn.setAttribute('data-id', opp.id);

    const svg = createSvg(16, 16, 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z');
    if (isFaved) svg.style.fill = 'currentColor';
    btn.appendChild(svg);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(opp.id);
    });

    return btn;
  }

  function buildMetaRow(svgIcon, text, textCls) {
    const row = document.createElement('div');
    row.className = 'opp-card-meta-row';
    row.appendChild(svgIcon);

    const span = document.createElement('span');
    span.textContent = text;
    if (textCls) span.className = textCls;
    row.appendChild(span);
    return row;
  }

  /* ── FULL CATALOGUE CARD ── */
  function buildOppCard(opp, delay = 0) {
    const lang = state.lang;
    const card = document.createElement('article');
    card.className = 'opp-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-id', opp.id);

    const titleText = (opp.title && (opp.title[lang] || opp.title.ar)) || '';
    card.setAttribute('aria-label', titleText);
    if (delay > 0) card.style.animationDelay = `${delay}ms`;

    // 1. Header row
    const hdr = document.createElement('div');
    hdr.className = 'opp-card-header';

    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'opp-card-tags';
    tagsWrap.appendChild(buildStatusTag(opp));
    tagsWrap.appendChild(buildEligTag(opp));
    hdr.appendChild(tagsWrap);

    const favBtn = buildFavBtn(opp);
    hdr.appendChild(favBtn);
    card.appendChild(hdr);

    // 2. Title with link
    const titleEl = document.createElement('h3');
    titleEl.className = 'opp-card-title';

    const titleLink = document.createElement('a');
    titleLink.className = 'opp-card-title-link';
    titleLink.href = `detail.html?id=${encodeURIComponent(opp.id)}`;
    titleLink.textContent = titleText;
    titleEl.appendChild(titleLink);
    card.appendChild(titleEl);

    // 3. Provider & Country
    const providerEl = document.createElement('div');
    providerEl.className = 'opp-card-provider';
    const provName = (opp.provider && (opp.provider[lang] || opp.provider.ar)) || '';
    const countryName = (opp.country && (opp.country[lang] || opp.country.ar)) || '';
    providerEl.textContent = countryName ? `${provName} · ${countryName}` : provName;
    card.appendChild(providerEl);

    // 4. Badges (Type + Primary Field)
    const subtags = document.createElement('div');
    subtags.className = 'opp-card-subtags';
    subtags.appendChild(buildTypeTag(opp));
    if (Array.isArray(opp.fields) && opp.fields.length > 0 && opp.fields[0].category) {
      const catTag = buildCategoryTag(opp.fields[0].category);
      if (catTag) subtags.appendChild(catTag);
    }
    card.appendChild(subtags);

    // 5. Meta Details
    const meta = document.createElement('div');
    meta.className = 'opp-card-meta';

    // Levels
    if (Array.isArray(opp.levels) && opp.levels.length > 0) {
      const levelTexts = opp.levels.map(l => t('level.' + l) || t('lvl.' + l) || l);
      meta.appendChild(buildMetaRow(
        createGraduationCapSvg(),
        levelTexts.join(lang === 'ar' ? '، ' : ', ')
      ));
    }

    // Deadline
    const dl = getDeadlineDisplay(opp, lang);
    meta.appendChild(buildMetaRow(
      createCalendarSvg(),
      dl.text,
      dl.cls
    ));

    // Funding Coverage
    if (opp.fundingCoverage) {
      const fundingText = t('funding.' + opp.fundingCoverage) || opp.fundingCoverage;
      meta.appendChild(buildMetaRow(
        createCoinSvg(),
        fundingText
      ));
    }

    card.appendChild(meta);

    // 6. Action Link / Card Footer
    const footerEl = document.createElement('div');
    footerEl.className = 'opp-card-footer';

    const actionLink = document.createElement('a');
    actionLink.className = 'opp-card-action-link';
    actionLink.href = `detail.html?id=${encodeURIComponent(opp.id)}`;
    actionLink.setAttribute('aria-label', `${t('card.viewDetails')} — ${titleText}`);

    const actionSpan = document.createElement('span');
    actionSpan.textContent = t('card.viewDetails');
    actionLink.appendChild(actionSpan);
    actionLink.appendChild(createArrowSvg(lang));

    footerEl.appendChild(actionLink);
    card.appendChild(footerEl);

    // 7. Click & Keyboard Activation
    card.addEventListener('click', e => {
      // If user clicked the favorite button, ignore navigation
      if (e.target.closest('.fc-fav')) return;
      // If user clicked a direct <a> link, browser handles navigation
      if (e.target.closest('a')) return;
      // Card body clicked -> navigate to detail
      window.location.href = `detail.html?id=${encodeURIComponent(opp.id)}`;
    });

    card.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.fc-fav')) {
        e.preventDefault();
        window.location.href = `detail.html?id=${encodeURIComponent(opp.id)}`;
      }
    });

    return card;
  }

  /* ═══════════════════════════════════════════════════════════════
     10. RENDERING ENGINE
     ═══════════════════════════════════════════════════════════════ */
  function render() {
    const grid = document.getElementById('cards-grid');
    const emptyState = document.getElementById('empty-state');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = '';

    const lang = state.lang;
    const totalCount = state.opportunities.length;
    const filteredCount = state.filtered.length;
    const isFiltered = Boolean(
      state.query ||
      state.filterType !== 'all' ||
      state.filterStatus !== 'all' ||
      state.filterCategory !== 'all' ||
      state.filterCountry !== 'all' ||
      state.filterLevel !== 'all' ||
      state.filterEligibility !== 'all' ||
      state.filterUrgent ||
      state.filterFavs
    );

    // Update results counter
    if (countEl) {
      if (filteredCount === 0) {
        countEl.textContent = t('results.none');
      } else if (isFiltered) {
        countEl.textContent = lang === 'ar'
          ? `${filteredCount} ${t('results.filtered')} (${t('results.outOf')} ${totalCount})`
          : `${filteredCount} ${t('results.filtered')} (${t('results.outOf')} ${totalCount})`;
      } else {
        countEl.textContent = lang === 'ar'
          ? `${totalCount} ${t('results.all')}`
          : `${totalCount} ${t('results.all')}`;
      }
    }

    // Render active filter chips
    renderActiveFilterChips();

    // Check empty state
    if (filteredCount === 0) {
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    // Render cards with staggered entrance delays
    state.filtered.forEach((opp, idx) => {
      const delay = Math.min(idx * 35, 350);
      const card = buildOppCard(opp, delay);
      grid.appendChild(card);
    });
  }

  /* ── ACTIVE FILTER CHIPS ── */
  function renderActiveFilterChips() {
    const container = document.getElementById('active-filters-chips');
    if (!container) return;
    container.innerHTML = '';

    const chips = [];

    if (state.query) {
      chips.push({
        label: `"${state.query}"`,
        clear: () => {
          state.query = '';
          const heroInput = document.getElementById('hero-search-input');
          const catInput = document.getElementById('cat-search');
          if (heroInput) heroInput.value = '';
          if (catInput) catInput.value = '';
        }
      });
    }

    if (state.filterUrgent) {
      chips.push({
        label: t('filter.urgentShort'),
        clear: () => {
          state.filterUrgent = false;
          const btn = document.getElementById('urgent-toggle');
          if (btn) btn.setAttribute('aria-pressed', 'false');
        }
      });
    }

    if (state.filterFavs) {
      chips.push({
        label: t('filter.favorites') || (state.lang === 'ar' ? 'المفضلة' : 'Favorites'),
        clear: () => {
          state.filterFavs = false;
          const btn = document.getElementById('fav-toggle');
          if (btn) btn.setAttribute('aria-pressed', 'false');
        }
      });
    }

    if (state.filterType !== 'all') {
      chips.push({
        label: t('typ.' + state.filterType) || state.filterType,
        clear: () => {
          state.filterType = 'all';
          updatePillsActive('[data-filter="type"]', 'all');
        }
      });
    }

    if (state.filterStatus !== 'all') {
      chips.push({
        label: t('stat.' + state.filterStatus) || state.filterStatus,
        clear: () => {
          state.filterStatus = 'all';
          updatePillsActive('[data-filter="status"]', 'all');
        }
      });
    }

    if (state.filterCategory !== 'all') {
      chips.push({
        label: t('cat.' + state.filterCategory) || state.filterCategory,
        clear: () => {
          state.filterCategory = 'all';
          const select = document.getElementById('filter-category');
          if (select) select.value = 'all';
        }
      });
    }

    if (state.filterCountry !== 'all') {
      let countryLabel = state.filterCountry;
      if (state.filterCountry === 'global') {
        countryLabel = state.lang === 'ar' ? 'عالمي' : 'Global';
      } else {
        const found = state.distinctCountries.find(c =>
          c.code.toUpperCase() === state.filterCountry.toUpperCase() ||
          c.en.toLowerCase() === state.filterCountry.toLowerCase()
        );
        if (found) countryLabel = found[state.lang] || found.en;
      }
      chips.push({
        label: countryLabel,
        clear: () => {
          state.filterCountry = 'all';
          const select = document.getElementById('filter-country');
          if (select) select.value = 'all';
        }
      });
    }

    if (state.filterLevel !== 'all') {
      chips.push({
        label: t('lvl.' + state.filterLevel) || state.filterLevel,
        clear: () => {
          state.filterLevel = 'all';
          const select = document.getElementById('filter-level');
          if (select) select.value = 'all';
        }
      });