/**
 * بوابة الفرص — Internationalisation (i18n) Module
 * Unified Bilingual AR ↔ EN Dictionary with full RTL/LTR support.
 * Master dictionary consolidating Agent A (Catalogue/Search),
 * Agent B (Details & Deadlines), and Agent C (About & Guidance).
 */
'use strict';

const I18N = {
  ar: {
    // ── Site & Meta ──
    'site.title': 'بوابة الفرص',
    'about.title': 'عن بوابة الفرص',
    'faq.heading': 'الأسئلة الشائعة',
    'detail.backToHome': 'العودة إلى دليل الفرص',
    'detail.applyOfficial': 'زيارة المصدر الرسمي والتقديم',
    'detail.admissionDeadline': 'موعد القبول الأكاديمي المطلوب',

    // ── Navigation & Header ──
    'skip.link': 'تخطى إلى المحتوى',
    'skipLink': 'تخطى إلى المحتوى',
    'nav.tagline': 'منصة موثوقة للطلاب اليمنيين',
    'navTagline': 'منصة موثوقة للطلاب اليمنيين',
    'nav.cta': 'استكشف الفرص',
    'navCta': 'استكشف الفرص',
    'nav.home': 'الرئيسية',
    'navHome': 'الرئيسية',
    'nav.featured': 'الفرص المميزة',
    'navFeatured': 'الفرص المميزة',
    'nav.catalogue': 'جميع الفرص',
    'navCatalogue': 'جميع الفرص',
    'nav.about': 'عن المنصة',
    'navAbout': 'عن المنصة',

    // ── Hero Section (Home) ──
    'hero.overline': 'بوابة الفرص التعليمية',
    'hero.headline1': 'فرصتك القادمة',
    'hero.headline2': 'تبدأ من هنا',
    'hero.sub': 'اكتشف المنح الدراسية والفرص التعليمية حول العالم. جميع الفرص موثقة ومراجعة من مصادرها الرسمية.',
    'hero.searchHint': 'فرصة موثقة متاحة الآن',
    'hero.cta.explore': 'استكشف الفرص',
    'hero.cta.featured': 'الفرص المميزة',

    // ── Search & Stats ──
    'search.label': 'ابحث عن فرصة',
    'search.placeholder': 'ابحث عن منحة أو دورة أو مؤسسة...',
    'stats.opportunities': 'فرصة موثقة',
    'stats.countries': 'دولة',
    'stats.types': 'أنواع فرص',

    // ── Featured Section ──
    'featured.overline': 'فرص مختارة',
    'featured.title': 'فرص بارزة',
    'featured.sub': 'منح وبرامج مختارة بعناية من بين أبرز الفرص المتاحة',
    'featured.viewAll': 'عرض جميع الفرص',

    // ── Catalogue Header & Filters ──
    'catalogue.overline': 'الأرشيف الكامل',
    'catalogue.title': 'جميع الفرص',

    'filter.all': 'الكل',
    'filter.scholarship': 'منح',
    'filter.course': 'دورات',
    'filter.fellowship': 'زمالات',
    'filter.internship': 'تدريب',
    'filter.allStatus': 'جميع الحالات',
    'filter.open': 'مفتوحة',
    'filter.upcoming': 'قادمة',
    'filter.closed': 'مغلقة',
    'filter.favorites': 'المفضلة',

    // Agent A Filter & Search Controls
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

    // Filter Categories
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

    // Filter Levels (Short & Long)
    'lvl.all': 'جميع المستويات',
    'lvl.high-school': 'الثانوية العامة',
    'lvl.undergraduate': 'بكالوريوس',
    'lvl.postgraduate': 'دراسات عليا (ماجستير)',
    'lvl.doctorate': 'دكتوراه',
    'lvl.postdoctoral': 'ما بعد الدكتوراه',
    'lvl.all-levels': 'متاح لكافة المستويات',

    // Filter Eligibility
    'elig.all': 'جميع حالات الأهلية',
    'elig.eligible': 'مؤهل للطلاب اليمنيين',
    'elig.conditional': 'مؤهل بشروط',
    'elig.restricted-or-ineligible': 'مقيد أو غير مؤهل',
    'elig.unconfirmed': 'أهلية غير مؤكدة',

    // Filter Status
    'stat.all': 'جميع الحالات',
    'stat.open': 'مفتوحة',
    'stat.upcoming': 'قادمة',
    'stat.closed': 'مغلقة',
    'stat.course-dependent': 'حسب التخصص',
    'stat.unconfirmed': 'غير مؤكد',

    // Filter Type
    'typ.all': 'الكل',
    'typ.scholarship': 'منح دراسية',
    'typ.course': 'دورات تدريبية',
    'typ.fellowship': 'زمالات',
    'typ.internship': 'تدريب مهني',
    'typ.leadership-program': 'برامج قيادة',

    // Catalogue Results & Card Actions
    'results.count': 'فرصة',
    'results.found': 'نتيجة',
    'results.filtered': 'فرصة مطابقة بعد الفلترة',
    'results.all': 'فرصة موثقة متاحة',
    'results.outOf': 'من أصل',
    'results.none': 'لا توجد نتائج مطابقة',
    'activeFilters.clearAll': 'مسح الكل',
    'card.viewDetails': 'عرض التفاصيل والتقديم',
    'card.urgentDays': 'يوم متبقٍ',
    'card.closesToday': 'ينتهي التقديم اليوم!',
    'card.closed': 'انتهى التقديم',
    'card.courseDep': 'يعتمد على التخصص',
    'card.ongoing': 'مفتوح باستمرار',
    'card.unknown': 'غير محدد',

    // ── Taxonomy: Types ──
    'type.scholarship': 'منحة دراسية',
    'type.course': 'دورة تدريبية',
    'type.fellowship': 'زمالة بحثية',
    'type.internship': 'تدريب مهني',
    'type.program': 'برنامج',
    'type.leadership-program': 'برنامج قيادي',

    // ── Taxonomy: Levels ──
    'level.high-school': 'المرحلة الثانوية',
    'level.undergraduate': 'بكالوريوس',
    'level.postgraduate': 'ماجستير / دراسات عليا',
    'level.doctorate': 'دكتوراه',
    'level.postdoctoral': 'أبحاث ما بعد الدكتوراه',
    'level.all-levels': 'كافة المستويات الدراسية',
    'level.short-course': 'دورة قصيرة',

    // ── Taxonomy: Status ──
    'status.open': 'التقديم مفتوح',
    'status.closed': 'انتهى التقديم',
    'status.upcoming': 'قريباً',
    'status.unconfirmed': 'غير مؤكد',
    'status.course-dependent': 'حسب البرنامج الأكاديمي',
    'status.admissions-route': 'عبر القبول الجامعي',

    // ── Taxonomy: Yemen Eligibility ──
    'eligibility.eligible': 'مؤهل لليمنيين',
    'eligibility.conditional': 'مؤهل بشروط خاصة',
    'eligibility.restricted': 'مقيد / لا يشمل اليمن',
    'eligibility.not-eligible': 'غير مؤهل للجنسية اليمنية',
    'eligibility.restricted-or-ineligible': 'مقيد أو غير مؤهل',
    'eligibility.unconfirmed': 'الأهلية قيد التأكيد',

    // ── Taxonomy: Deadlines ──
    'deadline.label': 'الموعد النهائي',
    'deadline.courseDep': 'يعتمد على التخصص',
    'deadline.ongoing': 'مفتوح باستمرار',
    'deadline.unknown': 'غير محدد',
    'deadline.periodic': 'دوري متكرر',
    'deadline.closed': 'انتهى التقديم',
    'deadline.daysLeft': 'يوم متبقٍ',
    'deadline.urgent': 'أقل من 14 يوم',

    // ── Taxonomy: Funding Coverage ──
    'funding.full-funding': 'تمويل كامل (شامل الرسوم والمعيشة)',
    'funding.partial': 'تمويل جزئي ومساهمة دراسية',
    'funding.stipend': 'مخصص مالي',
    'funding.tuition-only': 'رسوم دراسية فقط',
    'funding.tuition-waiver': 'إعفاء من الرسوم الدراسية (كامل أو جزئي)',
    'funding.living-expenses': 'نفقات معيشية',
    'funding.research-grant': 'منحة أبحاث وراتب باحث شهري',
    'funding.leadership-support': 'تغطية حضور برنامج تطوير القيادة ونفقات الفعالية',

    // ── Taxonomy: Country & Delivery ──
    'country.global': 'عالمي (دون قيود جغرافية)',
    'country.multi-country': 'متعدد الدول',
    'delivery.onsite': 'حضوري',
    'delivery.online': 'عبر الإنترنت (أونلاين)',
    'delivery.hybrid': 'هجين (حضوري وعن بُعد)',

    // ── Taxonomy: Application Route ──
    'route.direct': 'تقديم مباشر عبر بوابة الجهة المانحة',
    'route.direct-after-admission': 'تقديم مباشر للمنحة بعد الحصول على القبول الجامعي أو بالتزامن معه',
    'route.automatic-through-admission': 'ترشيح تلقائي عند التقديم لطلب القبول الجامعي دون استمارة منفصلة',
    'route.external-nomination': 'ترشيح رسمي خارجي عبر جهة أكاديمية أو حكومية معتمدة',
    'route.institution-submits': 'يتم رفع ملف الترشيح مباشرة عبر المؤسسة التعليمية المبتعثة',
    'route.direct-with-host-support': 'تقديم مباشر مع اشتراط خطاب دعم من المؤسسة المستضيفة',
    'route.admission-then-invitation': 'استكمال القبول الجامعي ثم تلقي دعوة رسمية للتقديم على المنحة',

    // ── Detail Page (Agent B) ──
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

    // ── Modal & Favorites ──
    'modal.country': 'الدولة',
    'modal.level': 'المستوى',
    'modal.type': 'النوع',
    'modal.deadline': 'الموعد النهائي',
    'modal.status': 'الحالة',
    'modal.eligibility': 'الأهلية',
    'modal.funding': 'التمويل',
    'modal.delivery': 'طريقة التقديم',
    'modal.verified': 'تم التحقق',
    'modal.source': 'الرابط الرسمي',
    'modal.openSource': 'زيارة المصدر الرسمي',
    'modal.verifiedOn': 'تم التحقق في',

    'fav.add': 'إضافة للمفضلة',
    'fav.remove': 'إزالة من المفضلة',
    'fav.inFavorites': 'في المفضلة',
    'fav.addToFavorites': 'إضافة للمفضلة',
    'fav.ariaRemove': 'إزالة هذه الفرصة من المفضلة',
    'fav.ariaAdd': 'إضافة هذه الفرصة إلى المفضلة',

    // ── Empty State & Controls ──
    'empty.title': 'لا توجد نتائج',
    'empty.sub': 'جرّب تعديل معايير البحث أو الفلاتر',
    'empty.clear': 'إعادة ضبط الفلاتر',
    'menu.open': 'فتح القائمة',
    'menu.close': 'إغلاق القائمة',
    'lang.switch': 'Switch to English',

    // ── About Page & Methodology (Agent C) ──
    'about.overline': 'عن المنصة',
    'about.title': 'للطلاب اليمنيين',
    'about.title2': 'في كل مكان',
    'about.text': 'بوابة الفرص منصة تعليمية مستقلة تهدف إلى تسهيل وصول الطلاب اليمنيين إلى المنح الدراسية والبرامج التعليمية الموثقة من مصادرها الرسمية. لا نخترع فرصًا ولا نضمن القبول — نوثّق ونصنّف ونوصل.',
    'about.f1.title': 'موثوقة من مصادرها',
    'about.f1.desc': 'كل فرصة مراجعة يدويًا من موقعها الرسمي',
    'about.f2.title': 'ثنائية اللغة',
    'about.f2.desc': 'واجهة عربية وإنجليزية متكاملة',
    'about.f3.title': 'تعمل دون إنترنت',
    'about.f3.desc': 'تصفح الفرص بعد أول تحميل دون اتصال',

    'heroBadge': 'مشروع تخرج برنامج LLM4Yemen — الدفعة الأولى',
    'heroTitle': 'بوابة الفرص — نافذة الطلاب اليمنيين نحو التعليم العالمي الموثق',
    'heroSub': 'منصة تعليمية مستقلة وغير ربحية صُممت لمساعدة الطلاب اليمنيين في الداخل والشتات على اكتشاف المنح الدراسية والدورات المجانية وبرامج القيادة الموثقة بشريًا، والتغلب على تشتت المعلومات وظروف الاتصال الصعبة.',
    'ctaExplore': 'تصفح دليل الفرص',
    'ctaGuide': 'دليل الطالب اليمني',
    'metricOpps': 'فرصة دولية محققة',
    'metricVerified': 'تحقق ومراجعة بشرية',
    'metricAds': 'إعلانات أو تتبع أو رسوم',
    'metricOffline': 'جاهزة للعمل دون اتصال',

    'methodologyOverline': 'هندسة البرمجيات بالذكاء الاصطناعي',
    'methodologyHeading': 'منهجية التطوير بالوكلاء والرقابة البشرية',
    'methodologyDesc': 'تم بناء هذا المشروع ضمن برنامج LLM4Yemen (Cohort 1) كنموذج رائد لتطبيق البرمجة بالوكلاء متعددي المهام (Agentic Pair-Programming) عبر بيئة Google Antigravity، مع التزام صارم بقاعدة ذهبية واحدة:',
    'hilTitle': 'المبدأ الجوهري: الإنسان يوجّه ويتحقق، والوكيل ينفّذ',
    'hilText': 'الوكلاء الأذكياء يتولون كتابة الشيفرة وهيكلة المكونات وفحص التوافقية وفق خطط محكمة، بينما يظل الإنسان هو صاحب القرار النهائي في التحقق من صحة الفرص وسلامة الروابط والموافقة على خطط العمل قبل تطبيقها. لا يُسمح للذكاء الاصطناعي بتأليف أي فرصة أو اختلاق أي موعد نهائي.',
    'agentGridTitle': 'هيكلية الوكلاء المتوازيين في المشروع',
    'agentARole': 'الكتالوج والبحث الذكي',
    'agentADesc': 'تطوير محرك البحث الفوري ثنائي اللغة، ونظام الفلاتر المتعددة (التخصص، الدولة، المستوى الأكاديمي، أهلية اليمن)، وترتيب الفرص العاجلة وعرض النتائج.',
    'agentBRole': 'صفحة التفاصيل والمفضلة',
    'agentBDesc': 'بناء صفحة التفاصيل المستقلة بروابط ثابتة، والعدادات التنازلية الدقيقة، ونظام حفظ المفضلة في localStorage مع معالجة الاستثناءات والتزامن.',
    'agentCRole': 'التوثيق ودليل الطالب',
    'agentCDesc': 'صياغة المحتوى التوجيهي المتكامل، وتوثيق المعمارية البرمجية ودليل التحقق البشري، وبناء صفحة عن المنصة ثنائية اللغة المتجاوبة.',
    'agentDRole': 'التكامل والتخزين دون اتصال',
    'agentDDesc': 'توحيد نظام التصميم والحركات التفاعلية، وإدارة استراتيجيات الكاش عبر Service Worker لضمان عمل كافة صفحات الموقع بدون اتصال بالإنترنت.',

    'verifyOverline': 'نزاهة البيانات وموثوقيتها',
    'verifyHeading': 'معايير التحقق الصارم الخمسة',
    'verifyDesc': 'يعاني الطلاب اليمنيون كثيرًا من المنشورات الوهمية والإعلانات المضللة التي تعيد نشر فرص قديمة أو شروط ملغاة. في بوابة الفرص، نخضع كل سجل لخمسة معايير غير قابلة للمساومة:',
    'v1Title': '1. المصدر الرسمي الأساسي فقط',
    'v1Text': 'تُجمع الفرص يدويًا ومباشرة من النطاق الرسمي للجامعة أو الجهة المانحة (مثل .edu أو .gov أو المنظمات الدولية المعتمدة). لا نعتمد مطلقًا على مدونات مجهولة أو صفحات وسائط التواصل الاجتماعي غير الموثقة.',
    'v2Title': '2. بروتوكول أمان مشفّر HTTPS حصراً',
    'v2Text': 'كل رابط فرصة يخضع للتحقق البرمجي التلقائي للتأكد من أنه يستخدم بروتوكول HTTPS المشفر، لحماية الطالب من مواقع التصيد الاحتيالي أو الروابط غير الآمنة.',
    'v3Title': '3. دقة مواعيد القبول والمنحة',
    'v3Text': 'التمييز الدقيق بين الموعد النهائي للقبول الجامعي (admissionDeadline) والموعد النهائي لطلب المنحة (deadline). نلتزم بالقاعدة الصارمة التي تضمن عدم تقديم موعد المنحة قبل تاريخ القبول الأكاديمي.',
    'v4Title': '4. تصنيف المواعيد بحيادية تامة',
    'v4Text': 'لا نختلق تواريخ نهائية وهمية. فالبرامج التي تختلف مواعيدها حسب القسم الأكاديمي (مثل أكسفورد) تُصنّف بوضوح كـ course-dependent مع تنبيه صريح دون عداد زائف، والفرص المستمرة تصنف كـ ongoing.',
    'v5Title': '5. تدقيق صريح لأهلية اليمنيين',
    'v5Text': 'تصنيف شفاف لأهلية المتقدمين اليمنيين (مؤهل، مؤهل بشروط، مقيد، غير مؤكد). إذا كانت المنحة تستثني اليمنيين أو تشترط إقامة بديلة، نعلن ذلك بوضوح لمنع إهدار وقت وجهد الطالب.',
    'v6Title': '6. تاريخ التحقق البشري المسجل',
    'v6Text': 'يحمل كل سجل تاريخ تحقق بشري فعلي (verificationDate). تُجرى مراجعات دورية لضمان استمرار صلاحية الروابط وحداثة المعايير قبل موعد كل دورة تقديم جديدة.',

    'guideOverline': 'خطوات التقديم الناجح',
    'guideHeading': 'دليل الطالب اليمني للاستعداد للمنح الدولية',
    'guideDesc': 'إن الفوز بالمنح الدراسية لا يعتمد على الحظ، بل على التحضير المسبق المنظم للملف الأكاديمي قبل أشهر من فتح باب التقديم. إليك خارطة الطريق العملية:',
    'g1Title': 'الوثائق الأكاديمية والشهادات والتصديق',
    'g1Desc': 'الشهادات الأكاديمية وكشوف الدرجات هي حجر الأساس لأي ملف منحة. ينبغي تجهيز نسخ واضحة ومترجمة معتمدة إلى اللغة الإنجليزية.',
    'g1Tip1': 'احرص على تصديق الشهادات من وزارة التربية/التعليم العالي ووزارة الخارجية في وقت مبكر لتجنب التأخير.',
    'g1Tip2': 'احفظ نسخًا رقمية ممسوحة ضوئيًا (PDF) عالية الدقة بحجم أقل من 2 ميغابايت لكل ملف.',
    'g2Title': 'إتقان اللغة الإنجليزية واختبارات الكفاءة (IELTS / TOEFL / Duolingo)',
    'g2Desc': 'تطلب معظم الجامعات العالمية إثبات الكفاءة اللغوية. ابحث دائمًا عن سياسات الإعفاء أو البدائل الميسرة.',
    'g2Tip1': 'تقبل العديد من الجامعات اختبار Duolingo English Test (DET) كبديل منخفض التكلفة يمكن أداؤه من المنزل.',
    'g2Tip2': 'إذا درست باللغة الإنجليزية في البكالوريوس، اطلب وثيقة رسمية تفيد بأن لغة التدريس كانت الإنجليزية (Medium of Instruction - MOI)، فقد تمنحك إعفاءً رسميًا.',
    'g3Title': 'رسائل التوصية الأكاديمية والمهنية (Letters of Recommendation)',
    'g3Desc': 'رسالة التوصية القوية تتحدث عن قدراتك البحثية ومثابرتك وشغفك، وتكون مكتوبة من أستاذ أو مشرف يعرف عملك جيدًا.',
    'g3Tip1': 'تواصل مع أساتذتك قبل شهرين على الأقل من الموعد النهائي وزودهم بسيرتك الذاتية ووصف البرنامج المستهدف.',
    'g3Tip2': 'تأكد من استخدام بريد إلكتروني رسمي ومؤسسي للأستاذ (مثل @univ.edu) لأن العديد من الجامعات لا تقبل بريد Gmail المجاني.',
    'g4Title': 'خطاب الدافع وبيان الغرض (Statement of Purpose / Personal Statement)',
    'g4Desc': 'خطاب الدافع هو صوتك الشخصي أمام لجنة القبول. اربط بين خلفيتك وتحديات مجتمعك وكيف ستساهم دراستك في إحداث أثر إيجابي.',
    'g4Tip1': 'تجنب الخطابات العامة المنسوخة من الإنترنت؛ خصص كل خطاب للبرنامج الأكاديمي والجامعة وأعضاء هيئة التدريس فيها.',
    'g4Tip2': 'ركّز على المرونة والقدرة على تجاوز التحديات الحقيقية، والخطط المستقبلية الواضحة بعد التخرج في خدمة اليمن أو المنطقة.',
    'g5Title': 'استراتيجية "القبول أولاً ثم المنحة" (The Dual-Deadline Strategy)',
    'g5Desc': 'في العديد من المنح الكبرى (مثل ماستريخت وأكسفورد وكامبريدج)، تشترط الجامعة الحصول على قبول أكاديمي أو التقديم للبرنامج قبل التقديم للمنحة بعدة أسابيع.',
    'g5Tip1': 'تحقق دائمًا من حقل admissionDeadline في صفحة تفاصيل الفرصة ببوابة الفرص.',
    'g5Tip2': 'قدّم طلب القبول للقسم الأكاديمي في شهر أكتوبر أو نوفمبر، لضمان صدور قرار القبول قبل إغلاق ملفات المنح في يناير وفبراير.',
    'g6Title': 'التعامل مع انقطاع الكهرباء والإنترنت والتحضير دون اتصال',
    'g6Desc': 'نعلم تمامًا التحديات اللوجستية التي يواجهها طلابنا في اليمن من انقطاع التيار الكهربائي وبطء شبكة الإنترنت. صُممت هذه المنصة خصيصًا لمساعدتك على تجاوز ذلك.',
    'g6Tip1': 'احفظ الفرص التي تهمك في قائمة المفضلة أثناء وجود اتصال؛ ستتمكن من مراجعتها لاحقًا دون اتصال بالإنترنت.',
    'g6Tip2': 'اكتب مسودات مقالاتك وأوراقك في برامج تحرير نصوص محلية غير معتمدة على الشبكة، ولا ترسل طلبك في الدقائق الأخيرة قبل الموعد النهائي تحسبًا لانقطاع مفاجئ.',

    'faqOverline': 'إجابات واضحة ومباشرة',
    'faqHeading': 'الأسئلة الشائعة',
    'faqDesc': 'جمعنا أهم التساؤلات المتكررة لدى الطلاب حول خدمات المنصة وكيفية عملها وطبيعة الفرص المعروضة:',
    'faq1Q': 'هل تقدم بوابة الفرص خدماتها بمقابل مالي؟',
    'faq1A': 'كلا، على الإطلاق. بوابة الفرص منصة غير ربحية ومفتوحة المصدر بالكامل 100%، ولا تتقاضى أي رسوم أو عمولات من الطلاب أو الجهات المانحة، ولا تتضمن أي إعلانات تجارية.',
    'faq2Q': 'هل تضمن المنصة قبولي في الجامعة أو حصولي على المنحة؟',
    'faq2A': 'لا نضمن القبول ولا نتدخل في قرارات لجان الاختيار. دور منصتنا ينحصر في التحقق الدقيق، والتصنيف المهني، وتسهيل الوصول للمعلومة الموثقة من مصدرها الرسمي، وتنبيهك بالمواعيد. قرار القبول هو حق حصري للجامعة أو المؤسسة المانحة بناءً على جودة ملفك وتنافسيته.',
    'faq3Q': 'ما الفرق بين موعد القبول الجامعي (Admission Deadline) وموعد المنحة (Scholarship Deadline)؟',
    'faq3A': 'موعد القبول الجامعي هو التاريخ الذي تشترط فيه الكلية استلام ملفك الأكاديمي للتأكد من استيفائك لشروط الدراسة (مثل الدرجات واللغة). أما موعد المنحة فهو التاريخ النهائي لتقديم استمارة التمويل المالي. في كثير من الجامعات المرموقة، يجب تقديم طلب القبول الأكاديمي قبل أسابيع من موعد المنحة، ولا يمكنك التقديم على المنحة دون الحصول على رقم طلب جامعي أو قبول مشروط.',
    'faq4Q': 'لماذا تظهر بعض الفرص مثل "أكسفورد" بدون عداد رقمي للأيام المتبقية؟',
    'faq4A': 'لأن مواعيد التقديم في هذه البرامج تعتمد على التخصص الدقيق (course-dependent)؛ فبعض التخصصات تغلق في ديسمبر وبعضها في يناير أو مارس. من منطلق الشفافية والأمانة، نرفض وضع عداد تنازلي عام مضلل قد يوهم الطالب بوجود متسع من الوقت بينما قد يكون موعد تخصصه قد انتهى بالفعل، ونوجه الطالب بدقة لمراجعة دليل برنامجه.',
    'faq5Q': 'كيف يمكنني تصفح الموقع عند انقطاع الإنترنت؟',
    'faq5A': 'تم تزويد الموقع بتقنية Service Worker المتقدمة. بمجرد فتحك للموقع مرة واحدة في وجود اتصال بالإنترنت، يتم تخزين صفحات التطبيق والبيانات الأساسية محليًا على جهازك. يمكنك بعدها فتح الموقع في أي وقت وتصفح كتالوج الفرص وقراءة التفاصيل والمفضلة دون الحاجة لاتصال نشط.',
    'faq6Q': 'أين تُحفظ الفرص التي أضيفها للمفضلة؟ وهل تتطلب حسابًا أو كلمة مرور؟',
    'faq6A': 'تُحفظ الفرص في التخزين المحلي الآمن لمتصفحك (localStorage). لا نطلب إنشاء أي حسابات أو تسجيل كلمات مرور، ولا نجمع بياناتك الشخصية حفاظًا على خصوصيتك وسرعة تجربتك. ستبقى مفضلتك محفوظة على نفس المتصفح ما لم تقم بمسح بيانات الموقع.',
    'faq7Q': 'كيف أبلغ عن خطأ في فرصة أو أقترح فرصة جديدة موثقة؟',
    'faq7A': 'نرحب بمساهمات المجتمع التعليمي دائمًا. يمكن فتح Issue أو سحب Pull Request عبر مستودع المشروع على GitHub، بشرط تقديم الرابط الرسمي المباشر وإثبات معايير الأهلية وتاريخ المراجعة.',

    'attrTitle': 'مشروع مجتمعي مستقل للطلاب اليمنيين',
    'attrDesc': 'تم تطوير بوابة الفرص بمبادرة طلابية وبحثية كأحد مشاريع التخرج في برنامج LLM4Yemen — First Cohort، تحت مسار هندسة البرمجيات بالوكلاء الذكيين (Agentic AI Software Development). نؤمن بأن المعرفة حق أصيل، وأن الفرص التعليمية الموثقة حق لكل طالب يسعى لبناء مستقبله ووطنه.',
    'attrCta': 'ابدأ استكشاف الفرص الآن',

    // ── Footer ──
    'footer.tagline': 'فرصتك القادمة تبدأ من هنا',
    'footerTagline': 'فرصتك القادمة تبدأ من هنا',
    'footer.notice': 'جميع الفرص موثقة من مصادرها الرسمية. تحقق دائمًا من الموقع الرسمي قبل التقديم.',
    'footerNotice': 'جميع الفرص موثقة من مصادرها الرسمية. تحقق دائمًا من الموقع الرسمي قبل التقديم.',
    'footer.copy': 'بوابة الفرص · LLM4Yemen Cohort 1',
    'footerCopy': 'بوابة الفرص · LLM4Yemen Cohort 1'
  },

  en: {
    // ── Site & Meta ──
    'site.title': 'Opportunities Portal',
    'about.title': 'About Opportunities Portal',
    'faq.heading': 'Frequently Asked Questions',
    'detail.backToHome': 'Back to Opportunities Catalogue',
    'detail.applyOfficial': 'Visit Official Source & Apply',
    'detail.admissionDeadline': 'Academic Admission Deadline',

    // ── Navigation & Header ──
    'skip.link': 'Skip to main content',
    'skipLink': 'Skip to main content',
    'nav.tagline': 'Trusted platform for Yemeni students',
    'navTagline': 'Trusted platform for Yemeni students',
    'nav.cta': 'Explore Opportunities',
    'navCta': 'Explore Opportunities',
    'nav.home': 'Home',
    'navHome': 'Home',
    'nav.featured': 'Featured',
    'navFeatured': 'Featured',
    'nav.catalogue': 'All Opportunities',
    'navCatalogue': 'All Opportunities',
    'nav.about': 'About',
    'navAbout': 'About',

    // ── Hero Section (Home) ──
    'hero.overline': 'Educational Opportunities Gateway',
    'hero.headline1': 'Your next opportunity',
    'hero.headline2': 'starts here',
    'hero.sub': 'Discover scholarships, fellowships, and educational opportunities around the world. All opportunities are verified from official sources.',
    'hero.searchHint': 'verified opportunities available',
    'hero.cta.explore': 'Explore Opportunities',
    'hero.cta.featured': 'Featured Opportunities',

    // ── Search & Stats ──
    'search.label': 'Search for an opportunity',
    'search.placeholder': 'Search scholarships, courses, institutions...',
    'stats.opportunities': 'Verified Opportunities',
    'stats.countries': 'Countries',
    'stats.types': 'Opportunity Types',

    // ── Featured Section ──
    'featured.overline': 'Selected Opportunities',
    'featured.title': 'Featured',
    'featured.sub': 'Carefully selected grants and programs from among the most outstanding available opportunities',
    'featured.viewAll': 'View All Opportunities',

    // ── Catalogue Header & Filters ──
    'catalogue.overline': 'Full Archive',
    'catalogue.title': 'All Opportunities',

    'filter.all': 'All',
    'filter.scholarship': 'Scholarships',
    'filter.course': 'Courses',
    'filter.fellowship': 'Fellowships',
    'filter.internship': 'Internships',
    'filter.allStatus': 'Any Status',
    'filter.open': 'Open',
    'filter.upcoming': 'Upcoming',
    'filter.closed': 'Closed',
    'filter.favorites': 'Favorites',

    // Agent A Filter & Search Controls
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

    // Filter Categories
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

    // Filter Levels (Short & Long)
    'lvl.all': 'All Levels',
    'lvl.high-school': 'High School',
    'lvl.undergraduate': 'Undergraduate',
    'lvl.postgraduate': 'Postgraduate (Master\'s)',
    'lvl.doctorate': 'Doctorate (PhD)',
    'lvl.postdoctoral': 'Postdoctoral',
    'lvl.all-levels': 'Open to All Levels',

    // Filter Eligibility
    'elig.all': 'All Eligibility',
    'elig.eligible': 'Eligible for Yemenis',
    'elig.conditional': 'Conditional Eligibility',
    'elig.restricted-or-ineligible': 'Restricted / Ineligible',
    'elig.unconfirmed': 'Eligibility Unconfirmed',

    // Filter Status
    'stat.all': 'All Statuses',
    'stat.open': 'Open',
    'stat.upcoming': 'Upcoming',
    'stat.closed': 'Closed',
    'stat.course-dependent': 'Course-Dependent',
    'stat.unconfirmed': 'Unconfirmed',

    // Filter Type
    'typ.all': 'All',
    'typ.scholarship': 'Scholarships',
    'typ.course': 'Courses',
    'typ.fellowship': 'Fellowships',
    'typ.internship': 'Internships',
    'typ.leadership-program': 'Leadership Programs',

    // Catalogue Results & Card Actions
    'results.count': 'Opportunities',
    'results.found': 'Found',
    'results.filtered': 'matching opportunities',
    'results.all': 'verified opportunities available',
    'results.outOf': 'out of',
    'results.none': 'No matching opportunities',
    'activeFilters.clearAll': 'Clear all',
    'card.viewDetails': 'View Details & Apply',
    'card.urgentDays': 'days left',
    'card.closesToday': 'Applications close today!',
    'card.closed': 'Applications closed',
    'card.courseDep': 'Course-dependent',
    'card.ongoing': 'Open — no deadline',
    'card.unknown': 'Not specified',

    // ── Taxonomy: Types ──
    'type.scholarship': 'Scholarship',
    'type.course': 'Course',
    'type.fellowship': 'Fellowship',
    'type.internship': 'Internship',
    'type.program': 'Program',
    'type.leadership-program': 'Leadership Program',

    // ── Taxonomy: Levels ──
    'level.high-school': 'High School',
    'level.undergraduate': 'Undergraduate',
    'level.postgraduate': 'Postgraduate',
    'level.doctorate': 'Doctorate',
    'level.postdoctoral': 'Postdoctoral',
    'level.all-levels': 'All Levels',
    'level.short-course': 'Short Course',

    // ── Taxonomy: Status ──
    'status.open': 'Open',
    'status.closed': 'Closed',
    'status.upcoming': 'Upcoming',
    'status.unconfirmed': 'Unconfirmed',
    'status.course-dependent': 'Course-Dependent',
    'status.admissions-route': 'Via Admission',

    // ── Taxonomy: Yemen Eligibility ──
    'eligibility.eligible': 'Eligible for Yemenis',
    'eligibility.conditional': 'Conditional Eligibility',
    'eligibility.restricted': 'Restricted / Excludes Yemen',
    'eligibility.not-eligible': 'Not Eligible for Yemeni Nationals',
    'eligibility.restricted-or-ineligible': 'Restricted / Ineligible',
    'eligibility.unconfirmed': 'Eligibility Unconfirmed',

    // ── Taxonomy: Deadlines ──
    'deadline.label': 'Deadline',
    'deadline.courseDep': 'Depends on chosen course',
    'deadline.ongoing': 'Open — no fixed deadline',
    'deadline.unknown': 'Not specified',
    'deadline.periodic': 'Recurring deadlines',
    'deadline.closed': 'Applications closed',
    'deadline.daysLeft': 'days left',
    'deadline.urgent': 'Under 14 days',

    // ── Taxonomy: Funding Coverage ──
    'funding.full-funding': 'Full Funding (Tuition & Living Allowance)',
    'funding.partial': 'Partial Funding',
    'funding.stipend': 'Stipend',
    'funding.tuition-only': 'Tuition Only',
    'funding.tuition-waiver': 'Tuition Fee Waiver (Full or partial)',
    'funding.living-expenses': 'Living Expenses',
    'funding.research-grant': 'Research Grant & Stipend',
    'funding.leadership-support': 'Leadership Program & Event Support',

    // ── Taxonomy: Country & Delivery ──
    'country.global': 'Global (No geographic restriction)',
    'country.multi-country': 'Multi-Country',
    'delivery.onsite': 'On-Site',
    'delivery.online': 'Online / Remote',
    'delivery.hybrid': 'Hybrid (On-Site & Remote)',

    // ── Taxonomy: Application Route ──
    'route.direct': 'Direct application via provider portal',
    'route.direct-after-admission': 'Direct scholarship application after or alongside university admission',
    'route.automatic-through-admission': 'Automatic scholarship consideration upon applying for university admission',
    'route.external-nomination': 'Official external nomination required via approved academic or governmental body',
    'route.institution-submits': 'Application dossier submitted directly by sending institution',
    'route.direct-with-host-support': 'Direct application requiring institutional host support letter',
    'route.admission-then-invitation': 'University admission followed by formal invitation to apply for scholarship',

    // ── Detail Page (Agent B) ──
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

    // ── Modal & Favorites ──
    'modal.country': 'Country',
    'modal.level': 'Level',
    'modal.type': 'Type',
    'modal.deadline': 'Deadline',
    'modal.status': 'Status',
    'modal.eligibility': 'Eligibility',
    'modal.funding': 'Funding',
    'modal.delivery': 'Delivery',
    'modal.verified': 'Verified',
    'modal.source': 'Official Source',
    'modal.openSource': 'Visit Official Source',
    'modal.verifiedOn': 'Verified on',

    'fav.add': 'Add to Favorites',
    'fav.remove': 'Remove from Favorites',
    'fav.inFavorites': 'Saved in Favorites',
    'fav.addToFavorites': 'Add to Favorites',
    'fav.ariaRemove': 'Remove this opportunity from favorites',
    'fav.ariaAdd': 'Add this opportunity to favorites',

    // ── Empty State & Controls ──
    'empty.title': 'No results found',
    'empty.sub': 'Try adjusting your search terms or filters',
    'empty.clear': 'Reset Filters',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'lang.switch': 'التبديل إلى العربية',

    // ── About Page & Methodology (Agent C) ──
    'about.overline': 'About',
    'about.title': 'For Yemeni Students',
    'about.title2': 'Everywhere',
    'about.text': 'Opportunities Portal is an independent educational platform aimed at helping Yemeni students access verified scholarships and educational programs from their official sources. We do not invent opportunities or guarantee admission — we document, classify, and connect.',
    'about.f1.title': 'Verified from Official Sources',
    'about.f1.desc': 'Every opportunity is manually reviewed from its official website',
    'about.f2.title': 'Bilingual Interface',
    'about.f2.desc': 'Full Arabic and English interface support',
    'about.f3.title': 'Works Offline',
    'about.f3.desc': 'Browse opportunities after initial load without internet',

    'heroBadge': 'LLM4Yemen Cohort 1 Capstone Project',
    'heroTitle': 'Opportunities Portal — Verified Global Pathways for Yemeni Students',
    'heroSub': 'An independent, non-profit educational platform built to empower Yemeni students both inside Yemen and in the diaspora. Discover rigorously verified scholarships, tuition-free courses, and leadership fellowships while overcoming fragmented information and connectivity barriers.',
    'ctaExplore': 'Browse Opportunities',
    'ctaGuide': 'Student Preparation Guide',
    'metricOpps': 'Verified Global Opportunities',
    'metricVerified': 'Human Verified & Audited',
    'metricAds': 'Ads, Trackers, or Fees',
    'metricOffline': 'Offline-Ready via Service Worker',

    'methodologyOverline': 'Agentic Software Engineering',
    'methodologyHeading': 'Agentic Workflow & Human Oversight',
    'methodologyDesc': 'Built within the LLM4Yemen (Cohort 1) program as a pioneering demonstration of multi-agent pair programming via Google Antigravity, anchored by one foundational rule:',
    'hilTitle': 'Core Principle: Humans guide and verify; agents implement',
    'hilText': 'Intelligent AI agents implement code, structure components, and verify multi-device responsiveness according to comprehensive engineering plans. However, human evaluators retain complete final authority over verifying opportunities, checking official URLs, and reviewing pull requests. No artificial intelligence is permitted to invent opportunities or hallucinate deadlines.',
    'agentGridTitle': 'Parallel Multi-Agent Architecture',
    'agentARole': 'Catalogue & Advanced Search',
    'agentADesc': 'Engineered the bilingual instant search engine, multidimensional faceted filters (fields, country, academic level, Yemen eligibility), urgent deadline alerts, and catalogue states.',
    'agentBRole': 'Detail Views & Persistence',
    'agentBDesc': 'Architected standalone deep-linked detail views, real-time deadline countdowns, program-dependent alerts, and resilient localStorage favorites management.',
    'agentCRole': 'About & System Documentation',
    'agentCDesc': 'Authored authentic bilingual documentation, architectural specifications, human verification protocols, and this comprehensive About page.',
    'agentDRole': 'Integration & Offline Resilience',
    'agentDDesc': 'Unified the Media Harbour design system, interactive cursor contrasts, and offline Service Worker caching lifecycle across all application pages.',

    'verifyOverline': 'Data Integrity & Trust',
    'verifyHeading': 'Five Non-Negotiable Verification Standards',
    'verifyDesc': 'Yemeni students frequently encounter deceptive ads, outdated scholarship posts, and revoked eligibility terms. In Opportunities Portal, every record is held to five rigorous standards:',
    'v1Title': '1. Primary Official Domains Only',
    'v1Text': 'All opportunities are collected directly and manually from official university (.edu, .ac.uk) or governmental (.gov) websites and certified international organizations. Third-party scraping blogs and unverified social media channels are strictly excluded.',
    'v2Title': '2. Enforced HTTPS Security',
    'v2Text': 'Every link is validated automatically to ensure HTTPS encryption. We strictly prevent insecure or deceptive redirects, safeguarding students against phishing threats.',
    'v3Title': '3. Dual-Deadline Integrity',
    'v3Text': 'Rigorous distinction between institutional admission deadlines and scholarship deadlines. We enforce the fundamental rule that scholarship deadlines cannot precede required academic admissions.',
    'v4Title': '4. Honest Deadline Classifications',
    'v4Text': 'We never fabricate deadlines. Multi-track programs with department-dependent closing dates (e.g. Oxford) are classified honestly as course-dependent without fake countdown clocks.',
    'v5Title': '5. Transparent Yemen Eligibility',
    'v5Text': 'Clear and unambiguous Yemen eligibility taxonomy (eligible, conditional, restricted, unconfirmed). If a program requires third-country residence or specific quotas, we state it clearly to respect the applicant’s time.',
    'v6Title': '6. Human Verification Timestamp',
    'v6Text': 'Every opportunity record carries a verifiable human verification date (verificationDate). Routine audits ensure URLs remain live and requirements remain active prior to every cycle.',

    'guideOverline': 'Pathways to Acceptance',
    'guideHeading': 'Practical Preparation Roadmap for Yemeni Applicants',
    'guideDesc': 'Winning competitive international scholarships is not an accident of luck; it is the outcome of strategic preparation months in advance. Follow this roadmap:',
    'g1Title': 'Academic Credentials, Attestations, and Translations',
    'g1Desc': 'Transcripts and graduation certificates form the core of your academic profile. Prepare certified English translations well in advance.',
    'g1Tip1': 'Attest certificates through the Ministry of Higher Education and Ministry of Foreign Affairs early to avoid bureaucratic delays.',
    'g1Tip2': 'Maintain high-resolution, lightweight scanned PDFs (under 2MB each) ready for instant upload.',
    'g2Title': 'English Proficiency & Waiver Pathways (IELTS / TOEFL / Duolingo)',
    'g2Desc': 'Most international programs require evidence of English language proficiency. Always explore institutional waiver policies and cost-effective alternatives.',
    'g2Tip1': 'Numerous universities accept the online Duolingo English Test (DET) as an affordable, home-administered test.',
    'g2Tip2': 'If your bachelor degree was taught in English, obtain an official Medium of Instruction (MOI) certificate from your registrar, which often waives test requirements.',
    'g3Title': 'Academic & Professional Letters of Recommendation',
    'g3Desc': 'Compelling recommendation letters evaluate your intellectual curiosity, research stamina, and integrity, written by professors who know your work personally.',
    'g3Tip1': 'Approach professors at least two months before application deadlines with your updated CV and program descriptions.',
    'g3Tip2': 'Ensure referees use their official institutional email addresses (@univ.edu), as many top-tier universities reject personal Gmail submissions.',
    'g4Title': 'Statement of Purpose & Personal Impact Essays',
    'g4Desc': 'Your personal statement is your authentic voice. Articulate how your academic background and lived challenges connect to your vision for positive impact.',
    'g4Tip1': 'Avoid generic templates; tailor every essay specifically to the curriculum, laboratory, or professors of that specific institution.',
    'g4Tip2': 'Emphasize resilience in overcoming difficult circumstances, with a grounded and realistic post-graduation plan benefiting Yemen and the wider region.',
    'g5Title': 'The Dual-Deadline Strategy: Early Admission First',
    'g5Desc': 'For prestigious awards (such as Maastricht NL-High Potential, Oxford Weidenfeld-Hoffmann, and Gates Cambridge), admission applications must be finalized weeks before scholarship evaluation.',
    'g5Tip1': 'Always inspect the admissionDeadline field on the opportunity detail page.',
    'g5Tip2': 'Submit your departmental admission application during October or November to guarantee an offer before scholarship shortlisting in January.',
    'g6Title': 'Mitigating Connectivity and Power Outages in Yemen',
    'g6Desc': 'We recognize the daily infrastructure hurdles faced by students across Yemen. This platform is engineered to support you in offline and low-bandwidth scenarios.',
    'g6Tip1': 'Bookmark key opportunities to your Favorites while connected; you can consult their full criteria later completely offline.',
    'g6Tip2': 'Compose all essays in offline word processors, and submit applications 3 to 5 days ahead of official deadlines to mitigate emergency power outages.',

    'faqOverline': 'Direct & Transparent Answers',
    'faqHeading': 'Frequently Asked Questions',
    'faqDesc': 'Key answers addressing common questions regarding our mission, services, and opportunity data:',
    'faq1Q': 'Does Opportunities Portal charge any fees for its services?',
    'faq1A': 'No. Opportunities Portal is 100% free, non-profit, and open-source. We do not charge students or scholarship providers, and we display zero commercial advertisements.',
    'faq2Q': 'Does the portal guarantee university admission or scholarship funding?',
    'faq2A': 'No. We do not grant admissions or influence selection panels. Our mission is strictly limited to rigorous verification, professional categorization, and reliable discovery. Acceptance decisions remain the sole prerogative of the awarding institutions based on candidate merit.',
    'faq3Q': 'What is the distinction between an admission deadline and a scholarship deadline?',
    'faq3A': 'The admission deadline is when the academic faculty evaluates your qualifications for study. The scholarship deadline is when the financial aid committee evaluates funding. At many elite universities, you must gain academic admission before your scholarship application can even be considered.',
    'faq4Q': 'Why do programs like Oxford display without a countdown clock?',
    'faq4A': 'Because their closing deadlines vary by academic department (course-dependent); some master’s courses close in December while others remain open until March. To avoid misleading students with false precision, we display an explicit notification advising students to check their departmental course page.',
    'faq5Q': 'How can I access the portal without an active internet connection?',
    'faq5A': 'The portal integrates a Service Worker that caches application assets and opportunity data upon initial visit. After your initial load, you can launch the site and explore the full catalogue without an active network connection.',
    'faq6Q': 'Where are my favorite opportunities stored? Do I need an account?',
    'faq6A': 'Favorites are stored locally in your browser’s private localStorage. We do not require account creation, passwords, or personal data collection, safeguarding your privacy and speed.',
    'faq7Q': 'How can I report an outdated deadline or submit a new verified opportunity?',
    'faq7A': 'We welcome community contributions. You can open an issue or pull request on our GitHub repository with the primary official HTTPS link and verifiable eligibility guidelines.',

    'attrTitle': 'An Independent Community Initiative for Yemeni Students',
    'attrDesc': 'Opportunities Portal was engineered as a capstone project in the LLM4Yemen First Cohort program under the Agentic AI Software Engineering track. We believe verified educational discovery is a fundamental right for every student striving to build their future.',
    'attrCta': 'Explore Opportunities Now',

    // ── Footer ──
    'footer.tagline': 'Your next opportunity starts here',
    'footerTagline': 'Your next opportunity starts here',
    'footer.notice': 'All opportunities are verified from official sources. Always check the official website before applying.',
    'footerNotice': 'All opportunities are verified from official sources. Always check the official website before applying.',
    'footer.copy': 'Opportunities Portal · LLM4Yemen Cohort 1',
    'footerCopy': 'Opportunities Portal · LLM4Yemen Cohort 1'
  }
};

// Current language state
let currentLang = 'ar';

/**
 * Get a translated string with fallback
 * @param {string} key
 * @param {string} [lang] - override language
 * @returns {string}
 */
function t(key, lang) {
  const l = lang || currentLang;
  if (I18N[l] && typeof I18N[l][key] !== 'undefined') return I18N[l][key];
  if (I18N['ar'] && typeof I18N['ar'][key] !== 'undefined') return I18N['ar'][key];
  return key;
}

/**
 * Apply all data-i18n and data-about-i18n translations to the DOM
 * @param {string} lang
 */
function applyTranslations(lang) {
  // Elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key, lang);
    if (text && text !== key) el.textContent = text;
  });

  // Elements with data-about-i18n
  document.querySelectorAll('[data-about-i18n]').forEach(el => {
    const key = el.getAttribute('data-about-i18n');
    let text = t(key, lang);
    if (text === key) text = t('about.' + key, lang);
    if (text && text !== key && text !== ('about.' + key)) el.textContent = text;
  });

  // Update search placeholders
  const heroInput = document.getElementById('hero-search-input');
  if (heroInput) heroInput.placeholder = t('search.placeholder', lang);
  const catInput = document.getElementById('cat-search');
  if (catInput) catInput.placeholder = lang === 'ar' ? 'ابحث عن منحة، دولة، تخصص...' : 'Search scholarships, countries, fields...';

  // Update static dropdown placeholders if list module is loaded
  if (window.OpportunityList && typeof window.OpportunityList.render === 'function') {
    // handled by list module
  }
}

/**
 * Switch language and synchronize DOM attributes
 * @param {string} lang - 'ar' or 'en'
 */
function switchLang(lang) {
  if (lang === currentLang) return;
  currentLang = lang;

  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.body.setAttribute('data-lang', lang);

  // Update body classes
  document.body.classList.toggle('lang-ar', lang === 'ar');
  document.body.classList.toggle('lang-en', lang === 'en');

  // Update lang switch button highlight
  const arEls = document.querySelectorAll('.lang-switch-ar');
  const enEls = document.querySelectorAll('.lang-switch-en');
  arEls.forEach(el => el.classList.toggle('is-active', lang === 'ar'));
  enEls.forEach(el => el.classList.toggle('is-active', lang === 'en'));

  // Update aria-label of lang switch
  const btn = document.getElementById('lang-switch');
  if (btn) btn.setAttribute('aria-label', t('lang.switch', lang));

  // Apply string translations
  applyTranslations(lang);

  // Persist preference
  try { localStorage.setItem('op-lang', lang); } catch(e) {}

  // Dispatch event for all other modules
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/**
 * Initialise language from URL param or stored preference
 */
function initLang() {
  let lang = 'ar';
  try {
    const params = typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search) : null;
    if (params && params.has('lang')) {
      const qLang = params.get('lang');
      if (qLang === 'ar' || qLang === 'en') lang = qLang;
    } else {
      lang = localStorage.getItem('op-lang') || 'ar';
    }
  } catch(e) {}
  if (lang !== 'ar' && lang !== 'en') lang = 'ar';

  currentLang = lang;
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.body.setAttribute('data-lang', lang);

  document.body.classList.toggle('lang-ar', lang === 'ar');
  document.body.classList.toggle('lang-en', lang === 'en');

  const arEls = document.querySelectorAll('.lang-switch-ar');
  const enEls = document.querySelectorAll('.lang-switch-en');
  arEls.forEach(el => el.classList.toggle('is-active', lang === 'ar'));
  enEls.forEach(el => el.classList.toggle('is-active', lang === 'en'));

  const btn = document.getElementById('lang-switch');
  if (btn) btn.setAttribute('aria-label', t('lang.switch', lang));

  applyTranslations(lang);
}

// Expose public API
window.I18N_MODULE = {
  t,
  switchLang,
  initLang,
  getCurrentLang: () => currentLang,
  I18N
};