# توثيق مخطط ونموذج البيانات | Opportunities Portal Data Schema Documentation

يوثق هذا المستند نموذج بيانات مشروع **بوابة الفرص (Opportunities Portal)** المخزن في المسار:
`data/opportunities.json`.

---

## 1. نظرة عامة وفلسفة التصميم (Design Overview)

- **كائن جذري مهيكل (Structured Root Object):** يحوي بيانات وصفية عليا (`version`, `lastUpdated`) وقائمة الفرص `opportunities`.
- **ثنائي اللغة (Bilingual by Design):** كل نص بشري يتم تمثيله ككائن متوازن `{ ar: "...", en: "..." }`.
- **نزاهة البيانات (Data Integrity):**
  - لا توجد أي بيانات وهمية في ملف الإنتاج؛ يبدأ الملف بمصفوفة فارغة `[]` مخصصة للملء اليدوي البشري فقط.
  - لا يتم افتراض أو اختلاق أي تواريخ نهائية للتقديم؛ إذا كان الموعد غير محدد أو مفتوحاً، يوضع `deadline: null` مع تحديد نوع الموعد بدقة عبر `deadlineType`.
- **فصل الجغرافيا عن نمط التقديم (Separation of Concerns):**
  - تم فصل الدولة الجغرافية للمؤسسة/الجهة المانحة (`country`) تماماً عن نمط حضور وتنفيذ الفرصة (`deliveryMode`).
  - يُحظر استخدام `ONLINE` كرمز دولة؛ الفرص الافتراضية بالكامل التي لا ترتبط ببلد محدد تأخذ `country: null`.
  - لا يعني كون الفرصة `online` أهليتها التلقائية للطلاب اليمنيين، بل يرجع ذلك لشروط الجهة المانحة.
- **تعدد التخصصات والمراحل:** دعم مصفوفات `fields` و `levels` لتغطية الفرص الشاملة ومتعددة التخصصات.

---

## 2. مواصفات الحقول التفصيلية (Field Specifications)

### الكائن الجذري (Root Object)
| الحقل (Field) | النوع (Type) | الإلزامية | الوصف والقواعد |
|---|---|---|---|
| `version` | string | إلزامي | إصدار مخطط البيانات بصيغة الترقيم الدلالي (Semantic Versioning)، مثال: `"1.0.0"`. |
| `lastUpdated` | string | إلزامي | تاريخ آخر تحديث لمجموعة البيانات بصيغة `YYYY-MM-DD`. يُمنع أن يكون تاريخاً مستقبلياً. |
| `opportunities` | array | إلزامي | مصفوفة كائنات الفرص. تكون فارغة `[]` في بداية المشروع حتى يضيف مالك المشروع الفرص الموثقة. |

---

### كائن الفرصة (Opportunity Object)
| الحقل (Field) | النوع (Type) | الإلزامية | القيم المسموحة والقواعد |
|---|---|---|---|
| `id` | string | إلزامي | معرف نصي فريد وثابت بنمط kebab-case، أحرف إنجليزية صغيرة وأرقام وشُرط فقط: `^[a-z0-9]+(-[a-z0-9]+)*$`. لا يجوز تكراره مطلقاً. |
| `type` | string (Enum) | إلزامي | نوع الفرصة، يقتصر على: `scholarship` (منحة دراسية) \| `course` (دورة تدريبية) \| `internship` (تدريب مهني) \| `fellowship` (زمالة بحثية) \| `leadership-program` (برنامج قيادي). |
| `deliveryMode` | string (Enum) | إلزامي | نمط الحضور والتنفيذ، يقتصر على: `online` \| `onsite` \| `hybrid`. |
| `locationScope` | string (Enum) | اختياري | النطاق الجغرافي: `national` (وطني في بلد محدد) \| `multi-country` (متعدد الدول) \| `global` (عالمي). عند اختيار `multi-country` أو `global` يُسمح بـ `country: null` حتى لو كان النمط حضورياً. |
| `title` | object | إلزامي | كائن العناوين ثنائي اللغة: `title.ar` و `title.en` (سلاسل نصية غير فارغة). |
| `provider` | object | إلزامي | كائن الجهة المنظمة ثنائي اللغة: `provider.ar` و `provider.en`. |
| `country` | object أو `null` | إلزامي | معلومات الدولة الجغرافية الحقيقية فقط. إذا كانت افتراضية أو متعددة الدول يوضع `null`. في حال كان كائناً، يجب أن يحتوي على `ar` و `en` و `code` (كود ISO 3166-1 alpha-2 بحرفين كبيرين مثل `"TR"`, `"YE"`). |
| `fields` | array of objects | إلزامي | مصفوفة التخصصات (عنصر واحد على الأقل). كل عنصر يحوي: <br>• `category`: تصنيف قياسي من القائمة المحددة.<br>• `name`: كائن ثنائي اللغة `{ ar, en }`. |
| `levels` | array of strings | إلزامي | مصفوفة المستويات التعليمية المستهدفة (عنصر واحد على الأقل)، مقتصرة على: `high-school` \| `undergraduate` \| `postgraduate` \| `doctorate` \| `postdoctoral` \| `all-levels`. |
| `deadline` | string أو `null` | إلزامي | تاريخ الانتهاء النهائي للمنحة/الفرصة بصيغة `YYYY-MM-DD` (تاريخ ميلادي حقيقي). يُوضع `null` إذا كان الموعد غير محدد أو مستمراً أو يعتمد على البرنامج الأكاديمي (`course-dependent`) أو كان تاريخ الإغلاق مجهولاً. |
| `deadlineType` | string (Enum) | إلزامي | نوع الموعد، يقتصر على: <br>• `fixed`: موعد محدد ونهائي (يتطلب تاريخاً صالحاً في `deadline`).<br>• `ongoing`: فرصة مفتوحة ومستمرة (يتطلب `deadline: null`).<br>• `periodic`: فرصة دورية سنوية أو فصيلة (تأخذ تاريخ الدورة الحالية إن وُجد وإلا `null`).<br>• `unknown`: غير معلن أو غير متاح رسمياً حالياً (يتطلب `deadline: null`).<br>• `course-dependent`: الموعد يختلف بحسب البرنامج الأكاديمي المختار (يتطلب `deadline: null`). لا يتم تصنيفها كفرصة مفتوحة دائماً، ولا يتم احتساب أيام متبقية في الواجهة. |
| `admissionDeadline` | string أو `null` | اختياري | موعد التقديم الأكاديمي/القبول الجامعي بصيغة `YYYY-MM-DD` (تاريخ ميلادي حقيقي). تشترطه بعض الجامعات كشرط مسبق إلزامي (Prerequisite) للقبول في البرنامج الدراسي قبل أو بالتزامن مع التقديم على المنحة (`deadline`). في حال وجود كلا التاريخين، يجب ألا يكون موعد القبول الجامعي لاحقاً للموعد النهائي للتقديم على المنحة (`admissionDeadline <= deadline`). |
| `applicationStatus` | string (Enum) | اختياري | حالة التقديم: `open` (مفتوح) \| `closed` (مغلق) \| `upcoming` (قادم) \| `course-dependent` (يتبع البرنامج) \| `unconfirmed` (غير مؤكد استمرار الدورة) \| `admissions-route` (ترشيح عبر القبول الجامعي). |
| `yemenEligibility` | string (Enum) | اختياري | أهلية المتقدمين من اليمن: `eligible` (مؤهل) \| `conditional` (مشروط بقبول أكاديمي أو شروط خاصة) \| `restricted` (مقيد/يتطلب ترشيحاً أو لا يشمل اليمن) \| `not-eligible` (غير مؤهل لجنسية/إقامة أخرى) \| `unconfirmed` (قيد تأكيد القائمة). |
| `applicationRoute` | string (Enum) | اختياري | مسار التقديم: `direct` \| `direct-after-admission` \| `automatic-through-admission` \| `external-nomination` \| `institution-submits` \| `direct-with-host-support` \| `admission-then-invitation`. |
| `fundingCoverage` | string (Enum) | اختياري | نوع التغطية المالية: `full-funding` (تمويل كامل) \| `tuition-waiver` (إعفاء رسوم دراسية فقط) \| `partial` (جزئي) \| `research-grant` (منحة أبحاث/راتب باحث) \| `leadership-support` (دعم مشاركة قيادية). |
| `verificationStatus` | string (Enum) | اختياري | حالة التحقق البشري: `verified` (تم التحقق البشري) \| `pending-human-review` (قيد المراجعة البشرية في ملف staging). |
| `officialSourceUrl` | string (HTTPS) | إلزامي | الرابط المباشر للفرصة على موقع المصدر الرسمي. يبدأ بـ `https://` حصراً. |
| `verificationDate` | string (ISO Date) أو `null` | إلزامي للمعتمد | تاريخ التحقق اليدوي البشري بصيغة `YYYY-MM-DD`. يُمنع أن يكون في المستقبل. يُسمح بـ `null` فقط عندما تكون `verificationStatus` هي `pending-human-review` في ملف التجهيز (staging). |
| `description` | object | اختياري | نبذة وصفية ثنائية اللغة: `{ ar: string, en: string }`. |

---

### القيم المسموحة للتصنيفات القياسية (Standard Field Categories)
- `engineering` (الهندسة وتكنولوجيا المعلومات)
- `medicine` (العلوم الطبية والصحية)
- `computer-science` (علوم الحاسوب والذكاء الاصطناعي)
- `business` (إدارة الأعمال والاقتصاد)
- `humanities` (العلوم الإنسانية واللغات)
- `natural-sciences` (العلوم الطبيعية والرياضيات)
- `social-sciences` (العلوم الاجتماعية والقانون)
- `arts-design` (الفنون والتصميم والإعلام)
- `general` (تخصصات عامة ومتعددة)

---

## 3. أمثلة إيضاحية مرجعية (Illustrative Schema Examples — Placeholders Only)

> [!NOTE]
> هذه السجلات إيضاحية للتوثيق فقط بهدف توضيح البنية التحتية، ولا تُدرج في ملف بيانات الإنتاج الحقيقي.

### مثال 1: منحة دراسية حضورية بموعد ثابت ومجالات متعددة
```json
{
  "id": "opp-placeholder-scholarship",
  "type": "scholarship",
  "deliveryMode": "onsite",
  "title": {
    "ar": "منحة الحكومة التركية للدراسات العليا",
    "en": "Türkiye Scholarships for Postgraduate Studies"
  },
  "provider": {
    "ar": "الحكومة التركية",
    "en": "Government of Turkey"
  },
  "country": {
    "ar": "تركيا",
    "en": "Turkey",
    "code": "TR"
  },
  "fields": [
    {
      "category": "engineering",
      "name": {
        "ar": "الهندسة وتكنولوجيا المعلومات",
        "en": "Engineering & Technology"
      }
    },
    {
      "category": "medicine",
      "name": {
        "ar": "العلوم الطبية",
        "en": "Medical Sciences"
      }
    }
  ],
  "levels": [
    "postgraduate",
    "doctorate"
  ],
  "deadline": "2027-02-20",
  "deadlineType": "fixed",
  "officialSourceUrl": "https://example.org/turkiye-burslari",
  "verificationDate": "2026-10-14",
  "description": {
    "ar": "منحة ممولة بالكامل تشمل الرسوم والإقامة والتأمين الصحي.",
    "en": "Fully funded scholarship covering tuition, accommodation, and health insurance."
  }
}
```

### مثال 2: دورة تدريبية إلكترونية مستمرة بدون موعد إغلاق
```json
{
  "id": "opp-placeholder-course",
  "type": "course",
  "deliveryMode": "online",
  "title": {
    "ar": "مقدمة في الذكاء الاصطناعي وتعلم الآلة",
    "en": "Introduction to AI and Machine Learning"
  },
  "provider": {
    "ar": "منصة تعليمية مفتوحة",
    "en": "Open Education Platform"
  },
  "country": null,
  "fields": [
    {
      "category": "computer-science",
      "name": {
        "ar": "علوم الحاسوب والذكاء الاصطناعي",
        "en": "Computer Science & AI"
      }
    }
  ],
  "levels": [
    "all-levels"
  ],
  "deadline": null,
  "deadlineType": "ongoing",
  "officialSourceUrl": "https://example.org/ai-course",
  "verificationDate": "2026-10-14",
  "description": {
    "ar": "دورة ذاتية التعلّم متاحة مجاناً على مدار العام.",
    "en": "Self-paced course available for free throughout the year."
  }
}
```

### مثال 3: تدريب مهني هجين ذو موعد دوري
```json
{
  "id": "opp-placeholder-internship",
  "type": "internship",
  "deliveryMode": "hybrid",
  "title": {
    "ar": "برنامج التدريب الصيفي للتقنية",
    "en": "Summer Technology Internship Program"
  },
  "provider": {
    "ar": "مؤسسة الابتكار الرقمي",
    "en": "Digital Innovation Foundation"
  },
  "country": {
    "ar": "اليمن",
    "en": "Yemen",
    "code": "YE"
  },
  "fields": [
    {
      "category": "computer-science",
      "name": {
        "ar": "تطوير البرمجيات",
        "en": "Software Engineering"
      }
    }
  ],
  "levels": [
    "undergraduate"
  ],
  "deadline": "2027-05-15",
  "deadlineType": "periodic",
  "officialSourceUrl": "https://example.org/summer-internship",
  "verificationDate": "2026-10-14",
  "description": {
    "ar": "تدريب عملي صيفي هجين يجمع بين العمل عن بعد والمهام الميدانية.",
    "en": "Hybrid summer practical internship combining remote work and field tasks."
  }
}
```

---

## 4. قواعد الحساب والتصفية في الواجهة (Frontend Implementation Rules)

### أ. حساب الأيام المتبقية التقويمي (Calendar-Day UTC Calculation):
- تُحسب الأيام التقويمية بمقارنة منتصف ليل UTC لتاريخ الموعد التقويمي مع منتصف ليل UTC لليوم التقويمي المحلي للمستخدم.
- **قاعدة يوم الموعد:** إذا كان الموعد هو اليوم نفسه، تكون الأيام المتبقية `0` ("ينتهي اليوم / Ends today").
- **الفرص الدورية (`periodic`):** إذا توفر لها تاريخ للدورة الحالية، تُحسب الأيام المتبقية للدورة الحالية بنفس المعادلة، وإذا كانت بدون تاريخ محدد يُعرض تنبيه بأنها دورية دون اختلاق تاريخ.
- **الفرص المعتمدة على البرنامج الأكاديمي (`course-dependent`):**
  - تختلف مواعيد التقديم باختلاف البرنامج الأكاديمي التابع للمنحة.
  - يكون `deadline: null` دائماً، ويُحظر احتساب أو عرض أيام متبقية رقمية لها.
  - لا تُصنف على أنها مفتوحة دائماً (`ongoing`).
  - تُعرض في الواجهة بطاقة تنبيهية ثنائية اللغة: ("الموعد يختلف بحسب البرنامج الأكاديمي المختار — يرجى مراجعة صفحة البرنامج الرسمي" / "Application deadline depends on chosen programme — check specific course page").
  - **أمثلة توثيقية مرجعية فقط:** مواعيد برامج أكسفورد (مثل ماجستير علوم الحاسوب المتقدم: `2027-01-06` وماجستير اقتصاديات التنمية: `2027-01-26`) هي تواريخ خاصة بكل برنامج على حدة ولا تُعمم كموعد شامل للمنحة.
- **الفرص المغلقة والمنتهية (`closed`):**
  - الفرص ذات المواعيد التاريخية المنتهية (مثل منح DAAD) تُحفظ تواريخها التاريخية الأصلية كما هي وتُصنف كـ `closed`؛ يُحظر استبدالها بتواريخ مستقبلية مفترضة.
  - إذا كان موعد الإغلاق مجهولاً ولكن الدورة مغلقة بشكل مؤكد (مثل Pedro Zamora و relAI)، يُسجل `deadline: null` مع `deadlineType: "unknown"` و `applicationStatus: "closed"`. يُمنع عرض عداد تنازلي للمواعيد المجهولة.
- **الفرص متعددة المسارات والمستويات (`applicationWindows`):**
  - مثل جامعة جنوب الدنمارك (SDU)، تمثل سجلاً واحداً بمسارين (ماجستير وبكالوريوس)، ويُسجل لكل مسار موعد فتحه وإغلاقه المستقل داخل مصفوفة `applicationWindows`.
- **الفرص المقيدة وغير المؤكدة:**
  - الفرص التي تشترط جنسية/إقامة دول أخرى (مثل NOAA) أو ترشيحاً حكومياً لا يشمل اليمن (مثل GRIPS YLP) تُصنف صراحة تحت `yemenEligibility: "not-eligible"` أو `"restricted"`.
  - الفرص التي يشوب استمرار دورتها تعارض موثق (مثل Harvard Equity) تُصنف كـ `applicationStatus: "unconfirmed"`.
- إذا كانت النتيجة `< 0` تُعد الفرصة منتهية الصلاحية (`Expired`).

### ب. تشغيل أداة التحقق (Validation Tool):
```bash
# 1. فحص ملف بيانات الإنتاج data/opportunities.json أثناء التطوير:
node scripts/validate-data.js

# 2. فحص ملف التجهيز data/opportunities-staging.json (الذي يحوي الفرص قيد المراجعة البشرية):
node scripts/validate-data.js --staging

# 3. فحص الإصدار النهائي (يفشل إذا قل عدد الفرص الموثقة بشرياً عن 20 فرصة أو وُجدت سجلات قيد المراجعة):
node scripts/validate-data.js --release

# 4. تشغيل الاختبارات الذاتية للأداة على 20 حالة اصطناعية:
node scripts/validate-data.js --test
```
