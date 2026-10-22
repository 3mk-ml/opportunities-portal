# بوابة الفرص — Opportunities Portal
> **منصة تعليمية مستقلة وموثوقة للطلاب اليمنيين لاكتشاف المنح والفرص العالمية**  
> *An independent, verified educational discovery portal for Yemeni students worldwide*

🌐 **الموقع الحي المباشر (Live Website):** [https://3mk-ml.github.io/opportunities-portal/](https://3mk-ml.github.io/opportunities-portal/)<br>
📁 **مستودع الكود (GitHub Repository):** [https://github.com/3mk-ml/opportunities-portal](https://github.com/3mk-ml/opportunities-portal)

---

[![Live Demo](https://img.shields.io/badge/Demo-3mk--ml.github.io%2Fopportunities--portal-0284c7.svg)](https://3mk-ml.github.io/opportunities-portal/)
[![Bilingual](https://img.shields.io/badge/Language-Arabic%20%7C%20English-2563eb.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-059669.svg)](#)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20Runtime%20CDNs-blueviolet.svg)](#)
[![Offline](https://img.shields.io/badge/Offline-Service%20Worker%20Ready-0284c7.svg)](#)
[![Data](https://img.shields.io/badge/Opportunities-20%20Verified%20Real-d97706.svg)](#)
[![Verification](https://img.shields.io/badge/Verification-100%25%20Human--in--the--Loop-16a34a.svg)](#)
[![Security](https://img.shields.io/badge/Security%20Audit-Passed%20(Clean)-success.svg)](docs/security-review.md)
[![Program](https://img.shields.io/badge/Program-LLM4Yemen%20Cohort%201-dc2626.svg)](#)

---

## فهرس المحتويات | Table of Contents
1. [نظرة عامة على المشروع (Project Overview)](#1-نظرة-عامة-على-المشروع--project-overview)
2. [المميزات الرئيسية (Key Features)](#2-المميزات-الرئيسية--key-features)
3. [دليل التشغيل المحلي السريع (Quick Start & Local Setup)](#3-دليل-التشغيل-المحلي-السريع--quick-start--local-setup)
4. [هيكلية المستودع (Repository Structure)](#4-هيكلية-المستودع--repository-structure)
5. [نموذج البيانات والتحقق البرمجي (Data Schema & Validation)](#5-نموذج-البيانات-والتحقق-البرمجي--data-schema--validation)
6. [سياسات الأمان ونزاهة البيانات (Security & Integrity Standards)](#6-سياسات-الأمان-ونزاهة-البيانات--security--integrity-standards)
7. [منهجية التطوير بالوكلاء والاعتماد (Methodology & Attribution)](#7-منهجية-التطوير-بالوكلاء-والاعتماد--methodology--attribution)

---

## 1. نظرة عامة على المشروع | Project Overview

### باللغة العربية
**بوابة الفرص (Opportunities Portal)** هي منصة ويب تعليمية متكاملة وثنائية اللغة (عربي / إنجليزي)، صُممت خصيصًا لتلبية احتياجات الطلاب اليمنيين في الداخل والشتات. يواجه الطالب اليمني تحديات جمة في الوصول إلى الفرص العالمية الموثوقة، تشمل تشتت الإعلانات عبر شبكات التواصل، وانتشار المنشورات المضللة أو الوهمية، فضلاً عن ضعف استقرار شبكة الإنترنت وانقطاع التيار الكهربائي.

تعتمد المنصة على:
- **بيانات حقيقية 100%:** جُمعت ودُققت بشريًا من المواقع الرسمية للجامعات والهيئات المانحة.
- **استقلالية تامة:** لا تتبع أي جهة تجارية، وخالية تمامًا من الإعلانات أو أدوات التتبع أو الرسوم.
- **تصميم مُراعٍ لظروف اليمن:** يدعم العمل دون اتصال بالإنترنت عبر تقنية `Service Worker`، ويعمل بسلاسة فائقة على شاشات الهواتف المحمولة ابتداءً من عرض 360 بكسل.

### In English
**Opportunities Portal** is a production-grade, bilingual (Arabic & English) static web application built to empower Yemeni students seeking higher education scholarships, tuition-free courses, fellowships, and leadership opportunities across the globe.

By addressing critical challenges such as fragmented social media posts, misleading criteria, and intermittent electrical and internet infrastructure in Yemen, the portal provides a single, high-trust, offline-capable gateway with 100% human-verified primary sources.

---

## 2. المميزات الرئيسية | Key Features

- **20 فرصة دولية حقيقية وموثقة (20 Real Verified Opportunities):**
  تغطي منح البكالوريوس والماجستير والدكتوراه، وبرامج الزمالات البحثية، والتدريب المهني، والبرامج القيادية في كبرى الجامعات (مثل أكسفورد، وكامبريدج، وماستريخت، وجامعة الملك عبد الله للعلوم والتقنية KAUST، ومؤسسة الغرير، وDAAD، وبرامج Coursera وIBM).
- **محرك بحث وتصفية متقدم متعدد الأبعاد (Multidimensional Faceted Search):**
  بحث فوري باللغتين العربية والإنجليزية في العناوين والجهات والتخصصات، مع إمكانية التصفية المتزامنة حسب:
  - نوع الفرصة (منحة، دورة، زمالة، تدريب، برنامج قيادي).
  - التخصص الأكاديمي (هندسة، طب، حاسوب، إدارة، علوم إنسانية، وغيرها).
  - الدولة الجغرافية ونمط الحضور (حضوري، افتراضي، هجين).
  - المستوى الدراسي (بكالوريوس، دراسات عليا، دكتوراه، كافة المستويات).
  - أهلية المتقدمين من اليمن (مؤهل، مؤهل بشروط، مقيد، غير مؤكد).
  - المواعيد العاجلة (الفرص التي تنتهي خلال 14 يومًا فأقل).
- **صفحات تفاصيل مخصصة بروابط ثابتة (Deep-Linked Dedicated Detail Pages):**
  صفحة تفاصيل كاملة لكل فرصة (`detail.html?id=...`) تتضمن عدادًا تنازليًا مباشرًا للمواعيد المحددة، وتنبيهات واضحة للمواعيد المعتمدة على البرامج الأكاديمية (`course-dependent`)، والمواعيد المستمرة (`ongoing`).
- **معالجة دقيقة للموعد المزدوج (Dual-Deadline Distinction):**
  إبراز موعد القبول الجامعي المسبق (`admissionDeadline`) إلى جانب موعد المنحة (`deadline`) لتفادي فوات مواعيد كليات الجامعات الكبرى.
- **دعم التصفح الكامل دون اتصال (Offline-First via Service Worker):**
  بمجرد تحميل المنصة للمرة الأولى، يقوم الـ `Service Worker` بتخزين الواجهة وبيانات الفرص محليًا، مما يتيح التصفح والبحث واستعراض التفاصيل والمفضلة حتى عند انقطاع الاتصال تمامًا.
- **نظام المفضلة المحلي (Local Favorites Engine):**
  حفظ الفرص بنقرة واحدة في `localStorage` دون الحاجة لإنشاء حساب أو كلمة مرور، مع معالجة استثناءات التصفح الخفي (Private Browsing) وتزامن البيانات عبر التبويبات المتعددة.
- **معمارية خالية من التبعيات الخارجية (Zero Runtime CDNs):**
  مبنية بنسبة 100% باستخدام Vanilla JS وHTML5 وCSS3 الخالص، مع حظر صارم للمكتبات الخارجية أو خطوط الشبكات الخارجية أثناء التشغيل، لضمان أعلى درجات الأمان والسرعة.
- **مؤشر فأرة سينمائي متكيف (Adaptive Cursor with Contrast Detection):**
  مؤشر تفاعلي متطور يتفاعل آنيًا مع لون السطح؛ يتحول لنقطة بيضاء فوق الأسطح الكحلية العميقة، ونقطة زرقاء فوق الأسطح الفاتحة، ويُلغى تلقائيًا على الأجهزة اللمسية.
- **إمكانية وصول ومطابقة ثنائية الاتجاه (Full RTL/LTR & WCAG AA):**
  تبديل آني سلس بين العربية (RTL) والإنجليزية (LTR)، مع عزل اتجاه النصوص (BiDi isolation) للأرقام والروابط والمصطلحات الإنجليزية.

---

## 3. دليل التشغيل المحلي السريع | Quick Start & Local Setup

التطبيق ثابت بالكامل (Pure Static Web App) ولا يحتاج إلى أدوات تجميع معقدة (No Webpack / No Vite / No Build Step). للتشغيل المحلي على جهازك، اتبع إحدى الطرق التالية:

### المتطلبات الأساسية (Prerequisites)
- متصفح حديث (Chrome, Firefox, Edge, Safari).
- أداة خادم ويب محلي بسيط (لتفعيل ميزات `fetch` و `Service Worker` التي تتطلب بيئة `http://` أو `https://`).

### الخيار 1: باستخدام Node.js (`npx serve`)
```bash
# تثبيت اختياري وتشغيل الخادم فوراً من مجلد المشروع
npx serve . -l 8000
```
افتح المتصفح على الرابط: `http://localhost:8000`

### الخيار 2: باستخدام بايثون 3 (Python Built-in Server)
```bash
# تشغيل خادم بايثون الافتراضي
python -m http.server 8000
```
افتح المتصفح على الرابط: `http://localhost:8000`

### الخيار 3: إضافة Live Server في Visual Studio Code
1. افتح مجلد المشروع في VS Code.
2. انقر بالزر الأيمن على `index.html` واختر **Open with Live Server**.

---

## 4. هيكلية المستودع | Repository Structure

```text
opportunities-portal/
├── index.html                # الصفحة الرئيسية (الهيرو، الفرص المميزة، كتالوج البحث والفلاتر)
├── detail.html               # صفحة تفاصيل الفرصة المستقلة تدعم المعرفات العميقة detail.html?id=...
├── about.html                # صفحة عن المنصة، منهجية الوكلاء، معايير التحقق، ودليل الطالب اليمني
├── sw.js                     # عامل الخدمة للتخزين المؤقت والعمل دون اتصال بالإنترنت (Service Worker)
├── manifest.json             # ملف تعريف تطبيق الويب التقدمي (PWA Web App Manifest)
├── README.md                 # دليل التوثيق الشامل للمشروع (هذا الملف)
├── AGENTS.md                 # قواعد وسلوكيات وقيود الوكلاء البرمجية المعتمدة
│
├── assets/                   # الأصول البصرية والوسائط الثابتة
│   ├── favicon.svg           # أيقونة الموقع المتجهة
│   └── images/
│       └── oxford.jpg        # صورة بطاقة جامعة أكسفورد البارزة
│
├── css/                      # الأنماط والتنسيقات
│   └── main.css              # ملف التنسيق الرئيسي (نظام Media Harbour، التوكنز، التجاوب، RTL/LTR)
│
├── js/                       # الوحدات البرمجية الخالصة (Vanilla ES6 Modules)
│   ├── main.js               # التهيئة العامة وتنسيق الأحداث المشتركة
│   ├── i18n.js               # محرك النصوص ثنائي اللغة والتبديل الحي بين RTL و LTR
│   ├── list.js               # محرك الكتالوج، البحث الفوري، الفلاتر المركبة، والترتيب
│   ├── detail.js             # وحدة قراءة وعرض تفاصيل الفرصة والعدادات التنازلية
│   ├── favorites.js          # إدارة المفضلة المحلية وتخزينها في localStorage
│   ├── cursor.js             # مؤشر الفأرة التفاعلي ذو التباين الذكي (أبيض/أزرق)
│   └── hero-fx.js            # المؤثرات التفاعلية للجسيمات في قسم الهيرو
│
├── data/                     # طبقة البيانات الموثقة
│   └── opportunities.json    # قاعدة بيانات الفرص الموثقة بشرياً (20 فرصة حقيقية)
│
├── scripts/                  # أدوات وفحوصات سطر الأوامر (Node.js CLI Tools)
│   ├── validate-data.js      # أداة التحقق الصارمة من بنية ومواعيد ونزاهة بيانات الفرص
│   └── check-html.js         # فحص السلامة الهيكلية والدلالية لصفحات HTML
│
└── docs/                     # التوثيق المعماري والتنفيذي
    ├── architecture.md       # المعمارية البرمجية وتدفق البيانات ودورة حياة الكاش
    ├── verification-guide.md # دليل وبروتوكول التحقق اليدوي البشري من الفرص
    ├── data-schema.md        # المواصفات القياسية لحقول ومخطط كائنات JSON
    ├── proposal.md           # المقترح الأولي للمشروع وأهدافه وقصص المستخدم
    └── plans/                # خطط عمل الوكلاء ومراحل التنفيذ المعتمدة
```

---

## 5. نموذج البيانات والتحقق البرمجي | Data Schema & Validation

تخضع جميع سجلات الفرص في `data/opportunities.json` لمخطط صارم موثق في `docs/data-schema.md`.

### تشغيل فحص البيانات البرمجي
يحتوي المشروع على أداة تحقق متقدمة في `scripts/validate-data.js` تغطي 20 سيناريو فحص ذاتي (مثل صحة التواريخ، السنوات الكبيسة، الروابط المشفرة، ترتيب مواعيد القبول، والقيم القياسية).

```bash
# تشغيل الاختبارات الذاتية الافتراضية
node scripts/validate-data.js --test

# فحص ملف الإنتاج وفق معايير النشر الصارمة (20 فرصة محققة بالكامل دون أي سجل معلق)
node scripts/validate-data.js --release

# فحص ملف الإعداد والتجهيز المبدئي (Staging)
node scripts/validate-data.js --staging
```

---

## 6. سياسات الأمان ونزاهة البيانات | Security & Integrity Standards

1. **الوقاية الصارمة من ثغرات الحقن (Safe DOM Manipulation):**
   - يُحظر استخدام `innerHTML` في معالجة وحقن نصوص ومحتويات الفرص.
   - يتم بناء وتحديث عناصر واجهة المستخدم حصريًا عبر دوال DOM الآمنة (`document.createElement`, `textContent`, `setAttribute`).
2. **بروتوكول الروابط الموثوقة (HTTPS Only):**
   - تخضع جميع الروابط الخارجية (`officialSourceUrl`) لفحص برمجي صارم للتأكد من أنها تبدأ بـ `https://`.
   - تُفتح الروابط دائمًا بخاصيتي الحماية `rel="noopener noreferrer"` و `target="_blank"`.
3. **انعدام التبعيات الخارجية وقت التشغيل (Zero CDN Footprint):**
   - لا يتم استدعاء أي مكتبة JavaScript أو أطر عمل من شبكات خارجية (مثل cdnjs أو unpkg)، لحماية خصوصية المستخدم ومنع انقطاع الموقع عند تعطل الشبكات الخارجية.
4. **حفظ الخصوصية في التخزين المحلي (Privacy-Respecting Local Storage):**
   - لا تجمع المنصة أي بيانات تعريف شخصية (No PII).
   - المفضلة واللغة المفضلة تُخزّن داخل متصفح المستخدم فقط في مفاتيح معزولة (`op-favorites`, `op-lang`).

---

## 7. منهجية التطوير بالوكلاء والاعتماد | Methodology & Attribution

### برنامج LLM4Yemen — الدفعة الأولى (Cohort 1)
تم تطوير هذا المشروع كأحد المشاريع التطبيقية الرائدة في مسار **البرمجة بالوكلاء الذكيين (Agentic AI Software Development)** برعاية برنامج **LLM4Yemen**، وتحت إشراف وتوجيه مباشر في بيئة **Google Antigravity**.

### المبدأ الجوهري: "الإنسان يوجّه ويتحقق، والوكيل ينفّذ"
- **فريق الوكلاء الذكيين:** قاد عمليات التصميم والبرمجة المتوازية وفحص المعايير والتوافقية.
- **الإشراف البشري الكامل (Human-in-the-Loop):** يظل مالك المشروع البشري هو المرجع الحصري لجمع وتدقيق بيانات الفرص واعتماد الخطط البرمجية واختبار القبول النهائي.

---

### الترخيص (License)
هذا المشروع مفتوح المصدر ومتاح للأغراض التعليمية وغير الربحية لخدمة الطلاب اليمنيين والباحثين عن المعرفة.
All opportunities documented belong to their respective institutions and universities.
