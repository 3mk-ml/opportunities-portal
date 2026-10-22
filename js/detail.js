/**
 * بوابة الفرص — Opportunity Detail Page Controller (js/detail.js)
 * Standalone, secure controller for rendering complete verified opportunity details.
 * Strict DOM safety (NO innerHTML for dynamic data), full bilingual support (AR/EN),
 * live countdown timer, and integration with js/favorites.js & js/i18n.js.
 */
'use strict';

(function() {
  // Localized dictionary for detail view
  const DETAIL_I18N = {
    ar: {
      'detail.back': 'العودة لدليل الفرص',
      'detail.home': 'الرئيسية',
      'detail.catalogue': 'جميع الفرص',
      'detail.breadcrumbs': 'مسار التنقل',
      'detail.verifiedBadge': 'مراجعة بشرية موثقة',
      'detail.verifiedOn': 'تاريخ التحقق الرسمي:',
      'detail.officialSource': 'المصدر الرسمي',
      'detail.applyNow': 'زيارة المصدر الرسمي والتقديم',
      'detail.additionalSources': 'روابط ومراجع رسمية إضافية',
      'detail.deadlineTitle': 'الموعد النهائي للتقديم',
      'detail.admissionDeadlineTitle': 'موعد القبول الأكاديمي المسبق',
      'detail.admissionWarningTitle': 'تنبيه مهم: شرط القبول الأكاديمي المسبق',
      'detail.admissionWarningText': 'تشترط هذه الفرصة إكمال أو استيفاء طلب القبول الجامعي في أحد البرامج الأكاديمية المؤهلة قبل أو بالتزامن مع التقديم على المنحة. احرص على مراجعة متطلبات القبول الأكاديمي ومواعيده المحددة في الجامعة أولاً.',
      'detail.courseDepNoticeTitle': 'موعد التقديم يعتمد على البرنامج الأكاديمي',
      'detail.courseDepNoticeText': 'الموعد النهائي يختلف بحسب البرنامج الأكاديمي المختار — يرجى مراجعة صفحة البرنامج الرسمي للاطلاع على الموعد المحدد لكل تخصص.',
      'detail.ongoingNoticeTitle': 'التقديم مفتوح باستمرار',
      'detail.ongoingNoticeText': 'هذه الفرصة مستمرة ومتاحة للتسجيل والتقديم على مدار العام دون موعد إغلاق نهائي.',
      'detail.closedNoticeTitle': 'انتهت فترة التقديم',
      'detail.closedNoticeText': 'لقد انتهت فترة التقديم لهذه الدورة. يتم الاحتفاظ بهذا السجل كمرجع للاطلاع على الشروط والمتطلبات للدورات القادمة.',
      'detail.unknownNoticeTitle': 'الموعد النهائي غير معلن',
      'detail.unknownNoticeText': 'لم تعلن الجهة المنظمة عن موعد إغلاق محدد لهذه الدورة حتى تاريخ التحقق.',
      'detail.countdownDays': 'يوم',
      'detail.countdownHours': 'ساعة',
      'detail.countdownMins': 'دقيقة',
      'detail.countdownSecs': 'ثانية',
      'detail.endsToday': 'ينتهي التقديم اليوم!',
      'detail.remainingTime': 'الوقت المتبقي لإغلاق التقديم:',
      'detail.overviewTitle': 'نظرة عامة على الفرصة',
      'detail.providerTitle': 'الجهة المنظمة / المانحة',
      'detail.countryTitle': 'الدولة / الموقع',
      'detail.deliveryModeTitle': 'نمط الحضور والتنفيذ',
      'detail.fundingTitle': 'التغطية المالية',
      'detail.levelsTitle': 'المراحل التعليمية المستهدفة',
      'detail.fieldsTitle': 'التخصصات والمجالات المتاحة',
      'detail.routeTitle': 'مسار التقديم',
      'detail.eligibilityTitle': 'أهلية المتقدمين من اليمن',
      'detail.descriptionAr': 'التفاصيل باللغة العربية',
      'detail.descriptionEn': 'التفاصيل باللغة الإنجليزية (English)',
      'detail.trustNoticeTitle': 'معايير النزاهة والموثوقية',
      'detail.trustNoticeText': 'بوابة الفرص منصة مستقلة توثّق وتصنّف الفرص التعليمية المتاحة من مصادرها الرسمية المعتمدة حصراً. نحن لا نضمن القبول ولا نتقاضى أي رسوم أو بيانات شخصية، ويكون التقديم دائماً مباشرة عبر موقع الجهة المانحة الرسمي.',
      'detail.shareTitle': 'مشاركة الفرصة',
      'detail.copyLink': 'نسخ رابط الفرصة',
      'detail.copied': 'تم نسخ الرابط بنجاح!',
      'detail.errorNotFoundTitle': 'لم يتم العثور على الفرصة المطلوبة',
      'detail.errorNotFoundText': 'عذراً، لم نتمكن من العثور على فرصة مطابقة للمعرّف المحدد. قد تكون الفرصة أزيلت أو أن الرابط غير صحيح.',
      'detail.errorNoIdTitle': 'لم يتم تحديد معرّف الفرصة',
      'detail.errorNoIdText': 'يرجى اختيار فرصة من دليل الفرص لتصفح كامل تفاصيلها ومواعيدها الرسمية.',
      'detail.errorLoadTitle': 'تعذر تحميل بيانات الفرص',
      'detail.errorLoadText': 'حدث خطأ أثناء تحميل بيانات الفرص التعليمية. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.',
      'detail.backToCatalogue': 'العودة إلى دليل الفرص',
      'detail.retry': 'إعادة المحاولة',
      'detail.global': 'عالمي (دون قيود جغرافية)',
      'detail.multiCountry': 'متعدد الدول',

      // Favorites
      'fav.inFavorites': 'في المفضلة',
      'fav.addToFavorites': 'إضافة للمفضلة',
      'fav.ariaRemove': 'إزالة هذه الفرصة من المفضلة',
      'fav.ariaAdd': 'إضافة هذه الفرصة إلى المفضلة',

      // Types
      'type.scholarship': 'منحة دراسية',
      'type.course': 'دورة تدريبية',
      'type.internship': 'تدريب مهني',
      'type.fellowship': 'زمالة بحثية',
      'type.leadership-program': 'برنامج قيادي',

      // Status
      'status.open': 'التقديم مفتوح',
      'status.closed': 'انتهى التقديم',
      'status.upcoming': 'قريباً',
      'status.course-dependent': 'حسب البرنامج الأكاديمي',
      'status.unconfirmed': 'غير مؤكد الاستمرار',
      'status.admissions-route': 'عبر القبول الجامعي',

      // Yemen Eligibility
      'eligibility.eligible': 'مؤهل لليمنيين',
      'eligibility.conditional': 'مؤهل بشروط خاصة',
      'eligibility.restricted': 'مقيد / لا يشمل اليمن',
      'eligibility.not-eligible': 'غير مؤهل للجنسية اليمنية',
      'eligibility.unconfirmed': 'الأهلية قيد التأكيد',

      // Delivery mode
      'delivery.online': 'عبر الإنترنت (أونلاين)',
      'delivery.onsite': 'حضوري',
      'delivery.hybrid': 'هجين (حضوري وعن بُعد)',

      // Application Route
      'route.direct': 'تقديم مباشر عبر بوابة الجهة المانحة',
      'route.direct-after-admission': 'تقديم مباشر للمنحة بعد الحصول على القبول الجامعي أو بالتزامن معه',
      'route.automatic-through-admission': 'ترشيح تلقائي عند التقديم لطلب القبول الجامعي دون استمارة منفصلة',
      'route.external-nomination': 'ترشيح رسمي خارجي عبر جهة أكاديمية أو حكومية معتمدة',
      'route.institution-submits': 'يتم رفع ملف الترشيح مباشرة عبر المؤسسة التعليمية المبتعثة',
      'route.direct-with-host-support': 'تقديم مباشر مع اشتراط خطاب دعم من المؤسسة المستضيفة',
      'route.admission-then-invitation': 'استكمال القبول الجامعي ثم تلقي دعوة رسمية للتقديم على المنحة',

      // Funding Coverage
      'funding.full-funding': 'تمويل كامل (يشمل الرسوم الدراسية ومخصصات المعيشة)',
      'funding.tuition-waiver': 'إعفاء من الرسوم الدراسية (كامل أو جزئي)',
      'funding.partial': 'تمويل جزئي ومساهمة دراسية',
      'funding.research-grant': 'منحة أبحاث وراتب باحث شهري',
      'funding.leadership-support': 'تغطية حضور برنامج تطوير القيادة ونفقات الفعالية',

      // Levels
      'level.high-school': 'المرحلة الثانوية',
      'level.undergraduate': 'البكالوريوس',
      'level.postgraduate': 'الماجستير / الدراسات العليا',
      'level.doctorate': 'الدكتوراه',
      'level.postdoctoral': 'أبحاث ما بعد الدكتوراه',
      'level.all-levels': 'متاح لكافة المستويات الدراسية'
    },

    en: {
      'detail.back': 'Back to Catalogue',
      'detail.home': 'Home',
      'detail.catalogue': 'All Opportunities',
      'detail.breadcrumbs': 'Breadcrumbs',
      'detail.verifiedBadge': 'Verified by Human Reviewer',
      'detail.verifiedOn': 'Officially verified on:',
      'detail.officialSource': 'Official Source',
      'detail.applyNow': 'Visit Official Source & Apply',
      'detail.additionalSources': 'Additional Official Sources & References',
      'detail.deadlineTitle': 'Application Deadline',
      'detail.admissionDeadlineTitle': 'Academic Admission Deadline',
      'detail.admissionWarningTitle': 'Important Notice: Academic Admission Prerequisite',
      'detail.admissionWarningText': 'This scholarship requires submitting or securing an admission application for an eligible academic programme prior to or alongside the scholarship application. Make sure to review the university admission requirements and deadlines first.',
      'detail.courseDepNoticeTitle': 'Deadline Depends on Chosen Course',
      'detail.courseDepNoticeText': 'Application deadline depends on chosen programme — please check the specific course page for exact closing dates.',
      'detail.ongoingNoticeTitle': 'Application Open Year-Round',
      'detail.ongoingNoticeText': 'This opportunity is ongoing and open for applications or enrollment throughout the year with no fixed closing date.',
      'detail.closedNoticeTitle': 'Application Round Closed',
      'detail.closedNoticeText': 'The application window for this round has closed. This record is maintained for reference and preparation for future rounds.',
      'detail.unknownNoticeTitle': 'Deadline Not Announced',
      'detail.unknownNoticeText': 'The official provider has not published a specific closing date for this round as of the latest verification date.',
      'detail.countdownDays': 'Days',
      'detail.countdownHours': 'Hours',
      'detail.countdownMins': 'Mins',
      'detail.countdownSecs': 'Secs',
      'detail.endsToday': 'Application ends today!',
      'detail.remainingTime': 'Time remaining until deadline:',
      'detail.overviewTitle': 'Opportunity Overview',
      'detail.providerTitle': 'Host Provider / Institution',
      'detail.countryTitle': 'Location / Country',
      'detail.deliveryModeTitle': 'Delivery Mode',
      'detail.fundingTitle': 'Funding Coverage',
      'detail.levelsTitle': 'Target Educational Levels',
      'detail.fieldsTitle': 'Eligible Academic Fields',
      'detail.routeTitle': 'Application Route',
      'detail.eligibilityTitle': 'Eligibility for Yemeni Students',
      'detail.descriptionAr': 'Description in Arabic',
      'detail.descriptionEn': 'Description in English',
      'detail.trustNoticeTitle': 'Integrity & Verification Standards',
      'detail.trustNoticeText': 'Opportunities Portal is an independent platform curating verified academic opportunities from official institutions. We never charge fees or collect personal data; all applications must be submitted directly through the verified official source above.',
      'detail.shareTitle': 'Share Opportunity',
      'detail.copyLink': 'Copy Link',
      'detail.copied': 'Link copied successfully!',
      'detail.errorNotFoundTitle': 'Opportunity Not Found',
      'detail.errorNotFoundText': 'Sorry, we could not find an opportunity matching the provided ID. It may have been moved, removed, or the link may be incorrect.',
      'detail.errorNoIdTitle': 'No Opportunity Specified',
      'detail.errorNoIdText': 'Please select an opportunity from the catalogue to view its full verified details and deadlines.',
      'detail.errorLoadTitle': 'Unable to Load Opportunity Data',
      'detail.errorLoadText': 'An error occurred while loading opportunities data. Please verify your connection and try again.',
      'detail.backToCatalogue': 'Return to Opportunities Catalogue',
      'detail.retry': 'Retry',
      'detail.global': 'Global (No geographic restriction)',
      'detail.multiCountry': 'Multi-country',

      // Favorites
      'fav.inFavorites': 'Saved in Favorites',
      'fav.addToFavorites': 'Add to Favorites',
      'fav.ariaRemove': 'Remove this opportunity from favorites',
      'fav.ariaAdd': 'Add this opportunity to favorites',

      // Types
      'type.scholarship': 'Scholarship',
      'type.course': 'Course',
      'type.internship': 'Internship',
      'type.fellowship': 'Research Fellowship',
      'type.leadership-program': 'Leadership Programme',

      // Status
      'status.open': 'Application Open',
      'status.closed': 'Closed',
      'status.upcoming': 'Upcoming',
      'status.course-dependent': 'Course-dependent',
      'status.unconfirmed': 'Unconfirmed Round',
      'status.admissions-route': 'Via Admission',

      // Yemen Eligibility
      'eligibility.eligible': 'Eligible for Yemenis',
      'eligibility.conditional': 'Conditionally Eligible',
      'eligibility.restricted': 'Restricted / Excludes Yemen',
      'eligibility.not-eligible': 'Not Eligible for Yemeni Nationals',
      'eligibility.unconfirmed': 'Eligibility Unconfirmed',

      // Delivery mode
      'delivery.online': 'Online / Remote',
      'delivery.onsite': 'On-site',
      'delivery.hybrid': 'Hybrid (On-site & Remote)',

      // Application Route
      'route.direct': 'Direct application via provider portal',
      'route.direct-after-admission': 'Direct scholarship application after or alongside university admission',
      'route.automatic-through-admission': 'Automatic scholarship consideration upon applying for university admission',
      'route.external-nomination': 'Official external nomination required via approved academic or governmental body',
      'route.institution-submits': 'Application dossier submitted directly by sending institution',
      'route.direct-with-host-support': 'Direct application requiring institutional host support letter',
      'route.admission-then-invitation': 'University admission followed by formal invitation to apply for scholarship',

      // Funding Coverage
      'funding.full-funding': 'Fully Funded (Tuition fees & living allowance)',
      'funding.tuition-waiver': 'Tuition Fee Waiver (Full or partial)',
      'funding.partial': 'Partial Funding & Study Allowance',
      'funding.research-grant': 'Research Grant & Monthly Stipend',
      'funding.leadership-support': 'Leadership Programme Participation & Travel Support',

      // Levels
      'level.high-school': 'High School',
      'level.undergraduate': 'Undergraduate / Bachelor',
      'level.postgraduate': 'Postgraduate / Master',
      'level.doctorate': 'Doctorate / PhD',
      'level.postdoctoral': 'Postdoctoral Research',
      'level.all-levels': 'Open to All Educational Levels'
    }
  };

  // State
  let currentOpportunity = null;
  let countdownTimerId = null;

  /**
   * Helper to retrieve active language ('ar' or 'en').
   * @returns {string}
   */
  function getLang() {
    if (typeof window.I18N_MODULE !== 'undefined' && window.I18N_MODULE.getCurrentLang) {
      return window.I18N_MODULE.getCurrentLang();
    }
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang === 'en' || htmlLang === 'ar') return htmlLang;
    try {
      const stored = localStorage.getItem('op-lang');
      if (stored === 'en' || stored === 'ar') return stored;
    } catch (e) {}
    return 'ar';
  }

  /**
   * Translate key with fallback to English then Arabic then key itself.
   * @param {string} key
   * @param {string} [lang]
   * @returns {string}
   */
  function t(key, lang) {
    const l = lang || getLang();
    if (DETAIL_I18N[l] && DETAIL_I18N[l][key]) return DETAIL_I18N[l][key];
    if (typeof window.I18N_MODULE !== 'undefined' && window.I18N_MODULE.t) {
      const globalVal = window.I18N_MODULE.t(key, l);
      if (globalVal && globalVal !== key) return globalVal;
    }
    if (DETAIL_I18N.ar && DETAIL_I18N.ar[key]) return DETAIL_I18N.ar[key];
    return key;
  }

  /**
   * Validate that URL uses HTTPS before creating clickable link.
   * @param {string} url
   * @returns {boolean}
   */
  function isValidHttpsUrl(url) {
    if (typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed.startsWith('https://')) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  /**
   * Format Gregorian date into localized string (e.g. "1 فبراير 2027" or "1 February 2027").
   * @param {string} dateStr - 'YYYY-MM-DD'
   * @param {string} lang
   * @returns {string}
   */
  function formatGregorianDate(dateStr, lang) {
    if (!dateStr || typeof dateStr !== 'string') return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(Date.UTC(year, month, day));

      const formatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-YE' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      });
      return formatter.format(d);
    } catch (e) {
      return dateStr;
    }
  }

  /**
   * Helper to safely create an SVG element with given path data.
   * @param {string} iconName
   * @param {number} size
   * @returns {SVGElement}
   */
  function createSvg(iconName, size = 18) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    if (iconName === 'arrow-back') {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', getLang() === 'ar' ? 'M5 12h14M12 5l7 7-7 7' : 'M19 12H5M12 19l-7-7 7-7');
      svg.appendChild(path);
    } else if (iconName === 'calendar') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '3');
      rect.setAttribute('y', '4');
      rect.setAttribute('width', '18');
      rect.setAttribute('height', '18');
      rect.setAttribute('rx', '2');
      rect.setAttribute('ry', '2');
      const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line1.setAttribute('x1', '16'); line1.setAttribute('y1', '2'); line1.setAttribute('x2', '16'); line1.setAttribute('y2', '6');
      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', '8'); line2.setAttribute('y1', '2'); line2.setAttribute('x2', '8'); line2.setAttribute('y2', '6');
      const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line3.setAttribute('x1', '3'); line3.setAttribute('y1', '10'); line3.setAttribute('x2', '21'); line3.setAttribute('y2', '10');
      svg.appendChild(rect);
      svg.appendChild(line1);
      svg.appendChild(line2);
      svg.appendChild(line3);
    } else if (iconName === 'external') {
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6');
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '15 3 21 3 21 9');
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '10'); line.setAttribute('y1', '14'); line.setAttribute('x2', '21'); line.setAttribute('y2', '3');
      svg.appendChild(path1);
      svg.appendChild(polyline);
      svg.appendChild(line);
    } else if (iconName === 'star') {
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2');
      svg.appendChild(polygon);
    } else if (iconName === 'check-circle') {
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M22 11.08V12a10 10 0 1 1-5.93-9.14');
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '22 4 12 14.01 9 11.01');
      svg.appendChild(path1);
      svg.appendChild(polyline);
    } else if (iconName === 'warning') {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z');
      const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line1.setAttribute('x1', '12'); line1.setAttribute('y1', '9'); line1.setAttribute('x2', '12'); line1.setAttribute('y2', '13');
      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', '12'); line2.setAttribute('y1', '17'); line2.setAttribute('x2', '12.01'); line2.setAttribute('y2', '17');
      svg.appendChild(path);
      svg.appendChild(line1);
      svg.appendChild(line2);
    } else if (iconName === 'info') {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '12'); circle.setAttribute('cy', '12'); circle.setAttribute('r', '10');
      const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line1.setAttribute('x1', '12'); line1.setAttribute('y1', '16'); line1.setAttribute('x2', '12'); line1.setAttribute('y2', '12');
      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', '12'); line2.setAttribute('y1', '8'); line2.setAttribute('x2', '12.01'); line2.setAttribute('y2', '8');
      svg.appendChild(circle);
      svg.appendChild(line1);
      svg.appendChild(line2);
    } else if (iconName === 'share') {
      const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle1.setAttribute('cx', '18'); circle1.setAttribute('cy', '5'); circle1.setAttribute('r', '3');
      const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle2.setAttribute('cx', '6'); circle2.setAttribute('cy', '12'); circle2.setAttribute('r', '3');
      const circle3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle3.setAttribute('cx', '18'); circle3.setAttribute('cy', '19'); circle3.setAttribute('r', '3');
      const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line1.setAttribute('x1', '8.59'); line1.setAttribute('y1', '13.51'); line1.setAttribute('x2', '15.42'); line1.setAttribute('y2', '17.49');
      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', '15.41'); line2.setAttribute('y1', '6.51'); line2.setAttribute('x2', '8.59'); line2.setAttribute('y2', '10.49');
      svg.appendChild(circle1);
      svg.appendChild(circle2);
      svg.appendChild(circle3);
      svg.appendChild(line1);
      svg.appendChild(line2);
    }

    return svg;
  }

  /**
   * Clear any active live countdown ticker.
   */
  function stopCountdown() {
    if (countdownTimerId) {
      clearInterval(countdownTimerId);
      countdownTimerId = null;
    }
  }

  /**
   * Setup live countdown ticker for a given deadline date.
   * Compares against end of target day in UTC.
   * @param {string} deadlineStr - 'YYYY-MM-DD'
   * @param {HTMLElement} containerEl
   * @param {string} lang
   */
  function startCountdown(deadlineStr, containerEl, lang) {
    stopCountdown();
    if (!deadlineStr || !containerEl) return;

    const parts = deadlineStr.split('-');
    if (parts.length !== 3) return;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    // End of the deadline date in UTC (23:59:59.999)
    const targetTime = Date.UTC(year, month, day, 23, 59, 59, 999);

    function update() {
      const now = Date.now();
      const diff = targetTime - now;

      // Clear existing children
      while (containerEl.firstChild) {
        containerEl.removeChild(containerEl.firstChild);
      }

      if (diff <= 0) {
        stopCountdown();
        const closedEl = document.createElement('div');
        closedEl.className = 'detail-countdown-closed';
        closedEl.textContent = t('detail.closedNoticeTitle', lang);
        containerEl.appendChild(closedEl);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (days === 0) {
        const todayAlert = document.createElement('div');
        todayAlert.className = 'detail-countdown-today';
        todayAlert.textContent = t('detail.endsToday', lang);
        containerEl.appendChild(todayAlert);
      }

      const grid = document.createElement('div');
      grid.className = 'detail-countdown-grid';

      const units = [
        { val: days, label: t('detail.countdownDays', lang) },
        { val: hours, label: t('detail.countdownHours', lang) },
        { val: minutes, label: t('detail.countdownMins', lang) },
        { val: seconds, label: t('detail.countdownSecs', lang) }
      ];

      units.forEach(u => {
        const item = document.createElement('div');
        item.className = 'detail-countdown-item';

        const num = document.createElement('span');
        num.className = 'detail-countdown-num';
        num.textContent = String(u.val).padStart(2, '0');

        const lbl = document.createElement('span');
        lbl.className = 'detail-countdown-label';
        lbl.textContent = u.label;

        item.appendChild(num);
        item.appendChild(lbl);
        grid.appendChild(item);
      });

      containerEl.appendChild(grid);
    }

    update();
    countdownTimerId = setInterval(update, 1000);
  }

  /**
   * Render polite error state if no ID query param was provided.
   */
  function renderNoIdError(lang) {
    stopCountdown();
    const loading = document.getElementById('detail-loading');
    if (loading) loading.style.display = 'none';

    const container = document.getElementById('detail-container');
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);

    const card = document.createElement('div');
    card.className = 'detail-error-card';

    const icon = createSvg('warning', 48);
    icon.classList.add('detail-error-icon');

    const title = document.createElement('h2');
    title.className = 'detail-error-title';
    title.textContent = t('detail.errorNoIdTitle', lang);

    const text = document.createElement('p');
    text.className = 'detail-error-text';
    text.textContent = t('detail.errorNoIdText', lang);

    const btn = document.createElement('a');
    btn.href = 'index.html#catalogue';
    btn.className = 'btn btn-primary detail-error-btn';
    btn.textContent = t('detail.backToCatalogue', lang);

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(btn);
    container.appendChild(card);
  }

  /**
   * Render polite error state if opportunity was not found.
   */
  function renderNotFound(id, lang) {
    stopCountdown();
    const loading = document.getElementById('detail-loading');
    if (loading) loading.style.display = 'none';

    const container = document.getElementById('detail-container');
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);

    const card = document.createElement('div');
    card.className = 'detail-error-card';

    const icon = createSvg('warning', 48);
    icon.classList.add('detail-error-icon');

    const title = document.createElement('h2');
    title.className = 'detail-error-title';
    title.textContent = t('detail.errorNotFoundTitle', lang);

    const text = document.createElement('p');
    text.className = 'detail-error-text';
    text.textContent = t('detail.errorNotFoundText', lang);

    const idNotice = document.createElement('code');
    idNotice.className = 'detail-error-code';
    idNotice.textContent = id ? `ID: ${id}` : '';

    const btn = document.createElement('a');
    btn.href = 'index.html#catalogue';
    btn.className = 'btn btn-primary detail-error-btn';
    btn.textContent = t('detail.backToCatalogue', lang);

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(text);
    if (id) card.appendChild(idNotice);
    card.appendChild(btn);
    container.appendChild(card);
  }

  /**
   * Render polite error state if fetching opportunities failed.
   */
  function renderLoadError(lang) {
    stopCountdown();
    const loading = document.getElementById('detail-loading');
    if (loading) loading.style.display = 'none';

    const container = document.getElementById('detail-container');
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);

    const card = document.createElement('div');
    card.className = 'detail-error-card';

    const icon = createSvg('warning', 48);
    icon.classList.add('detail-error-icon');

    const title = document.createElement('h2');
    title.className = 'detail-error-title';
    title.textContent = t('detail.errorLoadTitle', lang);

    const text = document.createElement('p');
    text.className = 'detail-error-text';
    text.textContent = t('detail.errorLoadText', lang);

    const btnsGroup = document.createElement('div');
    btnsGroup.className = 'detail-error-actions';

    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.className = 'btn btn-primary';
    retryBtn.textContent = t('detail.retry', lang);
    retryBtn.addEventListener('click', () => initDetail());

    const backBtn = document.createElement('a');
    backBtn.href = 'index.html#catalogue';
    backBtn.className = 'btn btn-outline';
    backBtn.textContent = t('detail.backToCatalogue', lang);

    btnsGroup.appendChild(retryBtn);
    btnsGroup.appendChild(backBtn);

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(btnsGroup);
    container.appendChild(card);
  }

  /**
   * Build badges header: Opportunity Type, Status, Yemen Eligibility, Delivery Mode, Funding.
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildBadgesRow(opp, lang) {
    const row = document.createElement('div');
    row.className = 'detail-badges-row';

    // Type badge
    if (opp.type) {
      const typeBadge = document.createElement('span');
      typeBadge.className = 'detail-badge detail-badge--type';
      typeBadge.textContent = t(`type.${opp.type}`, lang);
      row.appendChild(typeBadge);
    }

    // Status badge
    if (opp.applicationStatus) {
      const statusBadge = document.createElement('span');
      statusBadge.className = `detail-badge detail-badge--status detail-badge--status-${opp.applicationStatus}`;
      statusBadge.textContent = t(`status.${opp.applicationStatus}`, lang);
      row.appendChild(statusBadge);
    }

    // Yemen Eligibility badge
    if (opp.yemenEligibility) {
      const eligBadge = document.createElement('span');
      eligBadge.className = `detail-badge detail-badge--elig detail-badge--elig-${opp.yemenEligibility}`;
      eligBadge.textContent = t(`eligibility.${opp.yemenEligibility}`, lang);
      row.appendChild(eligBadge);
    }

    // Delivery Mode badge
    if (opp.deliveryMode) {
      const delivBadge = document.createElement('span');
      delivBadge.className = `detail-badge detail-badge--delivery detail-badge--deliv-${opp.deliveryMode}`;
      delivBadge.textContent = t(`delivery.${opp.deliveryMode}`, lang);
      row.appendChild(delivBadge);
    }

    // Funding Coverage badge
    if (opp.fundingCoverage) {
      const fundBadge = document.createElement('span');
      fundBadge.className = 'detail-badge detail-badge--funding';
      fundBadge.textContent = t(`funding.${opp.fundingCoverage}`, lang);
      row.appendChild(fundBadge);
    }

    return row;
  }

  /**
   * Build the Deadline & Live Countdown Card
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildDeadlineCard(opp, lang) {
    const card = document.createElement('section');
    card.className = 'detail-deadline-card';
    card.setAttribute('aria-label', t('detail.deadlineTitle', lang));

    const header = document.createElement('div');
    header.className = 'detail-deadline-header';

    const calIcon = createSvg('calendar', 22);
    calIcon.classList.add('detail-deadline-icon');

    const titleGroup = document.createElement('div');
    titleGroup.className = 'detail-deadline-title-group';

    const title = document.createElement('h3');
    title.className = 'detail-deadline-title';
    title.textContent = t('detail.deadlineTitle', lang);

    titleGroup.appendChild(title);
    header.appendChild(calIcon);
    header.appendChild(titleGroup);
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'detail-deadline-body';

    // CASE 1: course-dependent (e.g. Oxford)
    if (opp.deadlineType === 'course-dependent') {
      const alert = document.createElement('div');
      alert.className = 'detail-alert detail-alert--course-dep';

      const alertIcon = createSvg('info', 20);
      alertIcon.classList.add('detail-alert-icon');

      const alertContent = document.createElement('div');
      alertContent.className = 'detail-alert-content';

      const alertHeading = document.createElement('h4');
      alertHeading.className = 'detail-alert-heading';
      alertHeading.textContent = t('detail.courseDepNoticeTitle', lang);

      const alertText = document.createElement('p');
      alertText.className = 'detail-alert-text';
      alertText.textContent = t('detail.courseDepNoticeText', lang);

      alertContent.appendChild(alertHeading);
      alertContent.appendChild(alertText);
      alert.appendChild(alertIcon);
      alert.appendChild(alertContent);
      body.appendChild(alert);
    }
    // CASE 2: ongoing (e.g. IBM SkillsBuild, KAUST)
    else if (opp.deadlineType === 'ongoing') {
      const alert = document.createElement('div');
      alert.className = 'detail-alert detail-alert--ongoing';

      const alertIcon = createSvg('check-circle', 20);
      alertIcon.classList.add('detail-alert-icon');

      const alertContent = document.createElement('div');
      alertContent.className = 'detail-alert-content';

      const alertHeading = document.createElement('h4');
      alertHeading.className = 'detail-alert-heading';
      alertHeading.textContent = t('detail.ongoingNoticeTitle', lang);

      const alertText = document.createElement('p');
      alertText.className = 'detail-alert-text';
      alertText.textContent = t('detail.ongoingNoticeText', lang);

      alertContent.appendChild(alertHeading);
      alertContent.appendChild(alertText);
      alert.appendChild(alertIcon);
      alert.appendChild(alertContent);
      body.appendChild(alert);
    }
    // CASE 3: unknown
    else if (opp.deadlineType === 'unknown' || (!opp.deadline && opp.deadlineType !== 'fixed')) {
      const alert = document.createElement('div');
      alert.className = 'detail-alert detail-alert--unknown';

      const alertIcon = createSvg('info', 20);
      alertIcon.classList.add('detail-alert-icon');

      const alertContent = document.createElement('div');
      alertContent.className = 'detail-alert-content';

      const alertHeading = document.createElement('h4');
      alertHeading.className = 'detail-alert-heading';
      alertHeading.textContent = t('detail.unknownNoticeTitle', lang);

      const alertText = document.createElement('p');
      alertText.className = 'detail-alert-text';
      alertText.textContent = t('detail.unknownNoticeText', lang);

      alertContent.appendChild(alertHeading);
      alertContent.appendChild(alertText);
      alert.appendChild(alertIcon);
      alert.appendChild(alertContent);
      body.appendChild(alert);
    }
    // CASE 4: fixed / periodic with deadline date
    else if (opp.deadline) {
      const dateRow = document.createElement('div');
      dateRow.className = 'detail-date-display';

      const formatted = formatGregorianDate(opp.deadline, lang);
      const dateValue = document.createElement('span');
      dateValue.className = 'detail-date-value';
      dateValue.textContent = formatted;

      const isoCode = document.createElement('span');
      isoCode.className = 'detail-date-iso';
      isoCode.textContent = `(${opp.deadline})`;

      dateRow.appendChild(dateValue);
      dateRow.appendChild(isoCode);
      body.appendChild(dateRow);

      // Countdown ticker container
      const tickerContainer = document.createElement('div');
      tickerContainer.className = 'detail-countdown-container';
      body.appendChild(tickerContainer);

      // Start live countdown
      startCountdown(opp.deadline, tickerContainer, lang);
    }

    card.appendChild(body);
    return card;
  }

  /**
   * Build Admission Deadline warning alert card if admissionDeadline is present.
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement|null}
   */
  function buildAdmissionAlert(opp, lang) {
    if (!opp.admissionDeadline) return null;

    const box = document.createElement('div');
    box.className = 'detail-alert detail-alert--admission';
    box.setAttribute('role', 'alert');

    const icon = createSvg('warning', 24);
    icon.classList.add('detail-alert-icon');

    const content = document.createElement('div');
    content.className = 'detail-alert-content';

    const heading = document.createElement('h4');
    heading.className = 'detail-alert-heading';
    heading.textContent = t('detail.admissionWarningTitle', lang);

    const desc = document.createElement('p');
    desc.className = 'detail-alert-text';
    desc.textContent = t('detail.admissionWarningText', lang);

    const meta = document.createElement('div');
    meta.className = 'detail-admission-meta';

    const lbl = document.createElement('strong');
    lbl.textContent = `${t('detail.admissionDeadlineTitle', lang)}: `;

    const val = document.createElement('span');
    val.className = 'detail-admission-date';
    val.textContent = `${formatGregorianDate(opp.admissionDeadline, lang)} (${opp.admissionDeadline})`;

    meta.appendChild(lbl);
    meta.appendChild(val);

    content.appendChild(heading);
    content.appendChild(desc);
    content.appendChild(meta);
    box.appendChild(icon);
    box.appendChild(content);

    return box;
  }

  /**
   * Build breadcrumbs navigation.
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildBreadcrumbs(opp, lang) {
    const nav = document.createElement('nav');
    nav.className = 'detail-breadcrumbs';
    nav.setAttribute('aria-label', t('detail.breadcrumbs', lang));

    const list = document.createElement('ol');
    list.className = 'detail-breadcrumbs-list';

    // Home
    const homeLi = document.createElement('li');
    homeLi.className = 'detail-breadcrumb-item';
    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.textContent = t('detail.home', lang);
    homeLi.appendChild(homeLink);

    // Catalogue
    const catLi = document.createElement('li');
    catLi.className = 'detail-breadcrumb-item';
    const catLink = document.createElement('a');
    catLink.href = 'index.html#catalogue';
    catLink.textContent = t('detail.catalogue', lang);
    catLi.appendChild(catLink);

    // Current title
    const currentLi = document.createElement('li');
    currentLi.className = 'detail-breadcrumb-item is-active';
    currentLi.setAttribute('aria-current', 'page');
    const primaryTitle = (lang === 'ar' ? (opp.title?.ar || opp.title?.en) : (opp.title?.en || opp.title?.ar)) || opp.id;
    currentLi.textContent = primaryTitle;

    list.appendChild(homeLi);
    list.appendChild(catLi);
    list.appendChild(currentLi);
    nav.appendChild(list);

    return nav;
  }

  /**
   * Build top navigation bar (Back button + Favorite toggle + Share link).
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildTopActionsBar(opp, lang) {
    const bar = document.createElement('div');
    bar.className = 'detail-top-actions';

    // Back to catalogue
    const backBtn = document.createElement('a');
    backBtn.href = 'index.html#catalogue';
    backBtn.className = 'btn btn-outline detail-back-btn';
    const backIcon = createSvg('arrow-back', 16);
    const backText = document.createElement('span');
    backText.textContent = t('detail.back', lang);
    backBtn.appendChild(backIcon);
    backBtn.appendChild(backText);

    // Actions group (Fav + Share)
    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'detail-actions-group';

    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = 'btn detail-fav-btn';
    favBtn.id = 'detail-fav-btn';

    const isFav = typeof window.Favorites !== 'undefined' && window.Favorites.isFavorite(opp.id);
    favBtn.classList.toggle('is-faved', !!isFav);
    favBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    favBtn.setAttribute('aria-label', isFav ? t('fav.ariaRemove', lang) : t('fav.ariaAdd', lang));

    const starIcon = createSvg('star', 18);
    const favLabel = document.createElement('span');
    favLabel.className = 'detail-fav-label';
    favLabel.textContent = isFav ? t('fav.inFavorites', lang) : t('fav.addToFavorites', lang);

    favBtn.appendChild(starIcon);
    favBtn.appendChild(favLabel);

    favBtn.addEventListener('click', () => {
      if (typeof window.Favorites !== 'undefined') {
        const nextState = window.Favorites.toggleFavorite(opp.id);
        favBtn.classList.toggle('is-faved', nextState);
        favBtn.setAttribute('aria-pressed', nextState ? 'true' : 'false');
        favBtn.setAttribute('aria-label', nextState ? t('fav.ariaRemove', lang) : t('fav.ariaAdd', lang));
        favLabel.textContent = nextState ? t('fav.inFavorites', lang) : t('fav.addToFavorites', lang);
      }
    });

    // Share button
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn btn-outline detail-share-btn';
    shareBtn.setAttribute('aria-label', t('detail.shareTitle', lang));
    const shareIcon = createSvg('share', 16);
    const shareText = document.createElement('span');
    shareText.className = 'detail-share-text';
    shareText.textContent = t('detail.copyLink', lang);
    shareBtn.appendChild(shareIcon);
    shareBtn.appendChild(shareText);

    shareBtn.addEventListener('click', async () => {
      try {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const input = document.createElement('input');
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        }
        shareText.textContent = t('detail.copied', lang);
        shareBtn.classList.add('is-copied');
        setTimeout(() => {
          shareText.textContent = t('detail.copyLink', lang);
          shareBtn.classList.remove('is-copied');
        }, 2500);
      } catch (err) {
        console.warn('Share copy failed', err);
      }
    });

    actionsGroup.appendChild(favBtn);
    actionsGroup.appendChild(shareBtn);

    bar.appendChild(backBtn);
    bar.appendChild(actionsGroup);
    return bar;
  }

  /**
   * Build the Main Hero Section: Titles, Provider, Location.
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildHeroHeader(opp, lang) {
    const header = document.createElement('header');
    header.className = 'detail-header-card';

    // Badges Row
    const badgesRow = buildBadgesRow(opp, lang);
    header.appendChild(badgesRow);

    // Primary Title
    const primaryTitle = (lang === 'ar' ? (opp.title?.ar || opp.title?.en) : (opp.title?.en || opp.title?.ar)) || opp.id;
    const secondaryTitle = (lang === 'ar' ? opp.title?.en : opp.title?.ar);

    const h1 = document.createElement('h1');
    h1.className = 'detail-main-title';
    h1.textContent = primaryTitle;
    header.appendChild(h1);

    // Secondary Title (bilingual subtitle)
    if (secondaryTitle && secondaryTitle !== primaryTitle) {
      const sub = document.createElement('p');
      sub.className = 'detail-secondary-title';
      sub.setAttribute('dir', lang === 'ar' ? 'ltr' : 'rtl');
      sub.setAttribute('lang', lang === 'ar' ? 'en' : 'ar');
      sub.textContent = secondaryTitle;
      header.appendChild(sub);
    }

    // Meta bar: Provider & Country
    const metaBar = document.createElement('div');
    metaBar.className = 'detail-meta-bar';

    // Provider
    const provName = (lang === 'ar' ? (opp.provider?.ar || opp.provider?.en) : (opp.provider?.en || opp.provider?.ar)) || '';
    if (provName) {
      const provEl = document.createElement('div');
      provEl.className = 'detail-meta-item';
      const provLbl = document.createElement('span');
      provLbl.className = 'detail-meta-label';
      provLbl.textContent = t('detail.providerTitle', lang);
      const provVal = document.createElement('span');
      provVal.className = 'detail-meta-value detail-meta-provider';
      provVal.textContent = provName;
      provEl.appendChild(provLbl);
      provEl.appendChild(provVal);
      metaBar.appendChild(provEl);
    }

    // Country
    const countryEl = document.createElement('div');
    countryEl.className = 'detail-meta-item';
    const countryLbl = document.createElement('span');
    countryLbl.className = 'detail-meta-label';
    countryLbl.textContent = t('detail.countryTitle', lang);
    const countryVal = document.createElement('span');
    countryVal.className = 'detail-meta-value';

    if (opp.country) {
      const cName = lang === 'ar' ? (opp.country.ar || opp.country.en) : (opp.country.en || opp.country.ar);
      countryVal.textContent = cName + (opp.country.code ? ` (${opp.country.code})` : '');
    } else if (opp.locationScope === 'global') {
      countryVal.textContent = t('detail.global', lang);
    } else if (opp.locationScope === 'multi-country') {
      countryVal.textContent = t('detail.multiCountry', lang);
    } else {
      countryVal.textContent = t('detail.global', lang);
    }

    countryEl.appendChild(countryLbl);
    countryEl.appendChild(countryVal);
    metaBar.appendChild(countryEl);

    header.appendChild(metaBar);
    return header;
  }

  /**
   * Build the specifications detail grid (Route, Levels, Fields, Coverage, Mode).
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildSpecsGrid(opp, lang) {
    const section = document.createElement('section');
    section.className = 'detail-specs-section';
    section.setAttribute('aria-labelledby', 'specs-heading');

    const h2 = document.createElement('h2');
    h2.id = 'specs-heading';
    h2.className = 'detail-section-heading';
    h2.textContent = t('detail.overviewTitle', lang);
    section.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'detail-specs-grid';

    // Helper for grid cell
    function addCell(titleKey, contentNode) {
      const cell = document.createElement('div');
      cell.className = 'detail-spec-cell';

      const label = document.createElement('h3');
      label.className = 'detail-spec-label';
      label.textContent = t(titleKey, lang);

      const val = document.createElement('div');
      val.className = 'detail-spec-content';
      if (typeof contentNode === 'string') {
        val.textContent = contentNode;
      } else if (contentNode) {
        val.appendChild(contentNode);
      }

      cell.appendChild(label);
      cell.appendChild(val);
      grid.appendChild(cell);
    }

    // 1. Application Route
    if (opp.applicationRoute) {
      const routeText = t(`route.${opp.applicationRoute}`, lang);
      addCell('detail.routeTitle', routeText);
    }

    // 2. Educational Levels
    if (Array.isArray(opp.levels) && opp.levels.length > 0) {
      const pillsContainer = document.createElement('div');
      pillsContainer.className = 'detail-pills-wrap';
      opp.levels.forEach(lvl => {
        const pill = document.createElement('span');
        pill.className = 'detail-pill';
        pill.textContent = t(`level.${lvl}`, lang);
        pillsContainer.appendChild(pill);
      });
      addCell('detail.levelsTitle', pillsContainer);
    }

    // 3. Academic Fields
    if (Array.isArray(opp.fields) && opp.fields.length > 0) {
      const fieldsContainer = document.createElement('div');
      fieldsContainer.className = 'detail-fields-list';
      opp.fields.forEach(f => {
        const fieldItem = document.createElement('div');
        fieldItem.className = 'detail-field-item';

        const fieldName = (lang === 'ar' ? (f.name?.ar || f.name?.en) : (f.name?.en || f.name?.ar)) || f.category;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'detail-field-name';
        nameSpan.textContent = fieldName;

        fieldItem.appendChild(nameSpan);
        fieldsContainer.appendChild(fieldItem);
      });
      addCell('detail.fieldsTitle', fieldsContainer);
    }

    // 4. Funding Coverage
    if (opp.fundingCoverage) {
      const fundText = t(`funding.${opp.fundingCoverage}`, lang);
      addCell('detail.fundingTitle', fundText);
    }

    // 5. Yemen Eligibility
    if (opp.yemenEligibility) {
      const eligText = t(`eligibility.${opp.yemenEligibility}`, lang);
      addCell('detail.eligibilityTitle', eligText);
    }

    // 6. Delivery Mode
    if (opp.deliveryMode) {
      const delivText = t(`delivery.${opp.deliveryMode}`, lang);
      addCell('detail.deliveryModeTitle', delivText);
    }

    section.appendChild(grid);
    return section;
  }

  /**
   * Build the bilingual descriptions section.
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildDescriptionsSection(opp, lang) {
    const section = document.createElement('section');
    section.className = 'detail-descriptions-section';

    // Primary language description
    if (opp.description?.ar) {
      const arCard = document.createElement('div');
      arCard.className = 'detail-desc-card';
      arCard.setAttribute('dir', 'rtl');
      arCard.setAttribute('lang', 'ar');

      const arHeading = document.createElement('h3');
      arHeading.className = 'detail-desc-heading';
      arHeading.textContent = t('detail.descriptionAr', lang);

      const arText = document.createElement('p');
      arText.className = 'detail-desc-paragraph';
      arText.textContent = opp.description.ar;

      arCard.appendChild(arHeading);
      arCard.appendChild(arText);
      section.appendChild(arCard);
    }

    // Secondary language description
    if (opp.description?.en) {
      const enCard = document.createElement('div');
      enCard.className = 'detail-desc-card';
      enCard.setAttribute('dir', 'ltr');
      enCard.setAttribute('lang', 'en');

      const enHeading = document.createElement('h3');
      enHeading.className = 'detail-desc-heading';
      enHeading.textContent = t('detail.descriptionEn', lang);

      const enText = document.createElement('p');
      enText.className = 'detail-desc-paragraph';
      enText.textContent = opp.description.en;

      enCard.appendChild(enHeading);
      enCard.appendChild(enText);
      section.appendChild(enCard);
    }

    return section;
  }

  /**
   * Build Official Links, Verification Box, and Security Disclaimers.
   * @param {Object} opp
   * @param {string} lang
   * @returns {HTMLElement}
   */
  function buildActionsAndTrustSection(opp, lang) {
    const section = document.createElement('section');
    section.className = 'detail-action-trust-section';

    // Main CTA Box
    const ctaBox = document.createElement('div');
    ctaBox.className = 'detail-cta-box';

    if (isValidHttpsUrl(opp.officialSourceUrl)) {
      const mainLink = document.createElement('a');
      mainLink.href = opp.officialSourceUrl;
      mainLink.target = '_blank';
      mainLink.rel = 'noopener noreferrer';
      mainLink.className = 'btn btn-primary btn-large detail-official-btn';

      const btnText = document.createElement('span');
      btnText.textContent = t('detail.applyNow', lang);

      const extIcon = createSvg('external', 20);
      extIcon.classList.add('detail-btn-icon');

      mainLink.appendChild(btnText);
      mainLink.appendChild(extIcon);
      ctaBox.appendChild(mainLink);
    }

    // Additional Official Sources
    if (Array.isArray(opp.additionalOfficialSources) && opp.additionalOfficialSources.length > 0) {
      const addWrap = document.createElement('div');
      addWrap.className = 'detail-additional-sources';

      const addHeading = document.createElement('h4');
      addHeading.className = 'detail-add-sources-heading';
      addHeading.textContent = t('detail.additionalSources', lang);
      addWrap.appendChild(addHeading);

      const linksList = document.createElement('ul');
      linksList.className = 'detail-add-sources-list';

      opp.additionalOfficialSources.forEach((url, idx) => {
        if (!isValidHttpsUrl(url)) return;
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'detail-add-source-link';

        let domain = url;
        try { domain = new URL(url).hostname; } catch(e) {}
        link.textContent = `${domain} ↗`;

        li.appendChild(link);
        linksList.appendChild(li);
      });

      if (linksList.children.length > 0) {
        addWrap.appendChild(linksList);
        ctaBox.appendChild(addWrap);
      }
    }

    section.appendChild(ctaBox);

    // Verification Metadata & Trust Seal Card
    const trustCard = document.createElement('div');
    trustCard.className = 'detail-trust-card';

    const sealHeader = document.createElement('div');
    sealHeader.className = 'detail-seal-header';

    const checkIcon = createSvg('check-circle', 22);
    checkIcon.classList.add('detail-seal-icon');

    const badgeText = document.createElement('strong');
    badgeText.className = 'detail-seal-title';
    badgeText.textContent = t('detail.verifiedBadge', lang);

    sealHeader.appendChild(checkIcon);
    sealHeader.appendChild(badgeText);

    // Verification Date
    if (opp.verificationDate) {
      const dateNotice = document.createElement('span');
      dateNotice.className = 'detail-seal-date';
      dateNotice.textContent = `${t('detail.verifiedOn', lang)} ${formatGregorianDate(opp.verificationDate, lang)}`;
      sealHeader.appendChild(dateNotice);
    }

    trustCard.appendChild(sealHeader);

    // Trust & Security Notice
    const trustNotice = document.createElement('p');
    trustNotice.className = 'detail-trust-notice';
    trustNotice.textContent = t('detail.trustNoticeText', lang);
    trustCard.appendChild(trustNotice);

    section.appendChild(trustCard);
    return section;
  }

  /**
   * Render complete Opportunity Detail view.
   * @param {Object} opp
   */
  function renderDetail(opp) {
    stopCountdown();
    const lang = getLang();

    // Update document title
    const primaryTitle = (lang === 'ar' ? (opp.title?.ar || opp.title?.en) : (opp.title?.en || opp.title?.ar)) || opp.id;
    document.title = `${primaryTitle} | ${lang === 'ar' ? 'بوابة الفرص' : 'Opportunities Portal'}`;

    // Hide loading
    const loading = document.getElementById('detail-loading');
    if (loading) loading.style.display = 'none';

    const container = document.getElementById('detail-container');
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);

    // Breadcrumbs
    const breadcrumbs = buildBreadcrumbs(opp, lang);
    container.appendChild(breadcrumbs);

    // Top actions bar
    const topBar = buildTopActionsBar(opp, lang);
    container.appendChild(topBar);

    // Hero Header Card
    const heroCard = buildHeroHeader(opp, lang);
    container.appendChild(heroCard);

    // Admission Warning Alert (if present)
    const admissionAlert = buildAdmissionAlert(opp, lang);
    if (admissionAlert) {
      container.appendChild(admissionAlert);
    }

    // Deadline & Countdown Card
    const deadlineCard = buildDeadlineCard(opp, lang);
    container.appendChild(deadlineCard);

    // Specifications Grid
    const specsGrid = buildSpecsGrid(opp, lang);
    container.appendChild(specsGrid);

    // Bilingual Descriptions
    const descriptionsSection = buildDescriptionsSection(opp, lang);
    container.appendChild(descriptionsSection);

    // Action CTA, Additional Links & Trust Seal
    const actionAndTrustSection = buildActionsAndTrustSection(opp, lang);
    container.appendChild(actionAndTrustSection);
  }

  /**
   * Fetch opportunities and initialize view.
   */
  async function initDetail() {
    const lang = getLang();

    // Parse 'id' from URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id || !id.trim()) {
      renderNoIdError(lang);
      return;
    }

    const cleanId = id.trim();

    try {
      const response = await fetch('data/opportunities.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (!data || !Array.isArray(data.opportunities)) {
        throw new Error('Invalid opportunities.json structure');
      }

      const found = data.opportunities.find(o => o && o.id === cleanId);
      if (!found) {
        renderNotFound(cleanId, lang);
        return;
      }

      currentOpportunity = found;
      renderDetail(found);
    } catch (err) {
      console.error('[Detail] Error loading opportunity:', err);
      renderLoadError(lang);
    }
  }

  // Setup event listeners
  document.addEventListener('DOMContentLoaded', () => {
    initDetail();

    // Listen to language changes from i18n module
    document.addEventListener('langchange', () => {
      if (currentOpportunity) {
        renderDetail(currentOpportunity);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) renderNoIdError(getLang());
      }
    });

    // Listen to cross-window or local favorites updates
    document.addEventListener('favorites:changed', (e) => {
      if (!currentOpportunity) return;
      const favBtn = document.getElementById('detail-fav-btn');
      if (!favBtn) return;
      const isFav = typeof window.Favorites !== 'undefined' && window.Favorites.isFavorite(currentOpportunity.id);
      const lang = getLang();
      favBtn.classList.toggle('is-faved', !!isFav);
      favBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
      favBtn.setAttribute('aria-label', isFav ? t('fav.ariaRemove', lang) : t('fav.ariaAdd', lang));
      const lbl = favBtn.querySelector('.detail-fav-label');
      if (lbl) lbl.textContent = isFav ? t('fav.inFavorites', lang) : t('fav.addToFavorites', lang);
    });
  });

  // Expose API for testing
  window.DetailController = {
    init: initDetail,
    getCurrentOpportunity: () => currentOpportunity,
    t: t
  };

})();
