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
| `type` | string (Enum) | إلزامي | نوع الفرصة، يقتصر على: `scholarship` \| `course` \| `internship`. |
| `deliveryMode` | string (Enum) | إلزامي | نمط الحضور والتنفيذ، يقتصر على: `online` \| `onsite` \| `hybrid`. |
| `title` | object | إلزامي | كائن العناوين ثنائي اللغة: `title.ar` و `title.en` (سلاسل نصية غير فارغة). |
| `provider` | object | إلزامي | كائن الجهة المنظمة ثنائي اللغة: `provider.ar` و `provider.en`. |
| `country` | object أو `null` | إلزامي | معلومات الدولة الجغرافية الحقيقية فقط. إذا كانت افتراضية بالكامل يوضع `null`. في حال كان كائناً، يجب أن يحتوي على `ar` و `en` و `code` (كود ISO 3166-1 alpha-2 بحرفين كبيرين مثل `"TR"`, `"YE"`). |
| `fields` | array of objects | إلزامي | مصفوفة التخصصات (عنصر واحد على الأقل). كل عنصر يحوي: <br>• `category`: تصنيف قياسي من القائمة المحددة.<br>• `name`: كائن ثنائي اللغة `{ ar, en }`. |
| `levels` | array of strings | إلزامي | مصفوفة المستويات التعليمية المستهدفة (عنصر واحد على الأقل)، مقتصرة على: `high-school` \| `undergraduate` \| `postgraduate` \| `doctorate` \| `all-levels`. |
| `deadline` | string أو `null` | إلزامي | تاريخ الانتهاء النهائي للمنحة/الفرصة بصيغة `YYYY-MM-DD` (تاريخ ميلادي حقيقي). يُوضع `null` إذا كان الموعد غير محدد أو مستمراً أو يعتمد على البرنامج الأكاديمي (`course-dependent`). |
| `deadlineType` | string (Enum) | إلزامي | نوع الموعد، يقتصر على: <br>• `fixed`: موعد محدد ونهائي (يتطلب تاريخاً صالحاً في `deadline`).<br>• `ongoing`: فرصة مفتوحة ومستمرة (يتطلب `deadline: null`).<br>• `periodic`: فرصة دورية سنوية أو فصيلة (تأخذ تاريخ الدورة الحالية إن وُجد وإلا `null`).<br>• `unknown`: غير معلن أو غير متاح رسمياً حالياً (يتطلب `deadline: null`).<br>• `course-dependent`: الموعد يختلف بحسب البرنامج الأكاديمي المختار (يتطلب `deadline: null`). لا يتم تصنيفها كفرصة مفتوحة دائماً، ولا يتم احتساب أيام متبقية في الواجهة. |
| `admissionDeadline` | string أو `null` | اختياري | موعد التقديم الأكاديمي/القبول الجامعي بصيغة `YYYY-MM-DD` (تاريخ ميلادي حقيقي). تشترطه بعض الجامعات كشرط مسبق إلزامي (Prerequisite) للقبول في البرنامج الدراسي قبل أو بالتزامن مع التقديم على المنحة (`deadline`). في حال وجود كلا التاريخين، يجب ألا يكون موعد القبول الجامعي لاحقاً للموعد النهائي للتقديم على المنحة (`admissionDeadline <= deadline`). |
| `officialSourceUrl` | string (HTTPS) | إلزامي | الرابط المباشر للفرصة على موقع المصدر الرسمي. يبدأ بـ `https://` حصراً. |
| `verificationDate` | string (ISO Date) | إلزامي | تاريخ التحقق اليدوي البشري بصيغة `YYYY-MM-DD`. يُمنع أن يكون في المستقبل. |
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
- إذا كانت النتيجة `< 0` تُعد الفرصة منتهية الصلاحية (`Expired`).

### ب. تشغيل أداة التحقق (Validation Tool):
```bash
# 1. فحص ملف البيانات أثناء التطوير (يقبل المصفوفة الفارغة):
node scripts/validate-data.js

# 2. فحص الإصدار النهائي (يفشل إذا قل عدد الفرص الموثقة عن 20 فرصة):
node scripts/validate-data.js --release

# 3. تشغيل الاختبارات الذاتية للأداة على حالات اصطناعية:
node scripts/validate-data.js --test
```
