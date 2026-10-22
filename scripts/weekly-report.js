/**
 * بوابة الفرص (Opportunities Portal) — Weekly Scheduled Verification Report Script
 * 
 * Purpose:
 * Every week, inspect data/opportunities.json (READ-ONLY) and generate a structured audit report:
 * 1. Opportunities closing within 14 days.
 * 2. Opportunities whose verification date is older than 90 days.
 * 3. Records with missing, uncertain, or unconfirmed verification details.
 * 
 * STRICT POLICY:
 * - Read-only access: NEVER edit the dataset, automatically update verification dates,
 *   or modify application statuses. All data updates require human review and approval.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'opportunities.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'reports');

function generateWeeklyReport(asOfDate = new Date()) {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Error: Dataset file not found at ${DATA_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);
  const opportunities = data.opportunities || [];

  const today = new Date(asOfDate);
  today.setHours(0, 0, 0, 0);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const NINETY_DAYS_MS = 90 * MS_PER_DAY;

  // 1. Opportunities closing within 14 days
  const closingSoon = [];
  // 2. Opportunities older than 90 days
  const olderThan90Days = [];
  // 3. Records with missing or uncertain verification details
  const uncertainOrMissing = [];

  opportunities.forEach(opp => {
    // Check deadline proximity
    if (opp.deadline && opp.deadlineType === 'fixed' && opp.applicationStatus !== 'closed') {
      const d = new Date(opp.deadline + 'T00:00:00Z');
      const diffDays = Math.round((d.getTime() - today.getTime()) / MS_PER_DAY);
      if (diffDays >= 0 && diffDays <= 14) {
        closingSoon.push({
          id: opp.id,
          titleAr: opp.title?.ar || opp.id,
          titleEn: opp.title?.en || opp.id,
          deadline: opp.deadline,
          daysLeft: diffDays,
          status: opp.applicationStatus,
          url: opp.officialSourceUrl
        });
      }
    }

    // Check verification date age (> 90 days)
    if (opp.verificationDate) {
      const vDate = new Date(opp.verificationDate + 'T00:00:00Z');
      const ageMs = today.getTime() - vDate.getTime();
      const ageDays = Math.round(ageMs / MS_PER_DAY);
      if (ageDays > 90) {
        olderThan90Days.push({
          id: opp.id,
          titleAr: opp.title?.ar || opp.id,
          titleEn: opp.title?.en || opp.id,
          verificationDate: opp.verificationDate,
          ageDays: ageDays,
          url: opp.officialSourceUrl
        });
      }
    } else {
      uncertainOrMissing.push({
        id: opp.id,
        titleAr: opp.title?.ar || opp.id,
        reason: 'Missing verification date (verificationDate is null)'
      });
    }

    // Check uncertain status
    if (
      opp.verificationStatus !== 'verified' ||
      opp.applicationStatus === 'unconfirmed' ||
      opp.deadlineType === 'unknown' ||
      opp.yemenEligibility === 'unconfirmed'
    ) {
      uncertainOrMissing.push({
        id: opp.id,
        titleAr: opp.title?.ar || opp.id,
        titleEn: opp.title?.en || opp.id,
        verificationStatus: opp.verificationStatus,
        applicationStatus: opp.applicationStatus,
        deadlineType: opp.deadlineType,
        yemenEligibility: opp.yemenEligibility,
        url: opp.officialSourceUrl
      });
    }
  });

  // Sort closing soon by soonest first
  closingSoon.sort((a, b) => a.daysLeft - b.daysLeft);
  // Sort age descending (oldest first)
  olderThan90Days.sort((a, b) => b.ageDays - a.ageDays);

  const reportDateStr = today.toISOString().split('T')[0];

  let md = `# تقرير التحقق الأسبوعي للفرص التعليمية | Weekly Verification Report\n\n`;
  md += `**تاريخ إصدار التقرير (Report Date):** ${reportDateStr}\n`;
  md += `**إجمالي الفرص في قاعدة البيانات:** ${opportunities.length}\n`;
  md += `**إصدار البيانات (Dataset Version):** ${data.version || '1.2.0'}\n`;
  md += `**نمط التحقق:** قراءة محضة (Read-Only) — لا يتم إجراء أي تعديل آلي.\n\n`;
  md += `---\n\n`;

  // Section 1
  md += `## 1. الفرص القريبة من الإغلاق خلال 14 يوماً (Closing within 14 Days)\n\n`;
  if (closingSoon.length === 0) {
    md += `*لا توجد فرص تُغلق خلال الـ 14 يوماً القادمة.*\n\n`;
  } else {
    md += `| المعرف (ID) | اسم الفرصة (العربية / الإنجليزية) | الموعد النهائي | الأيام المتبقية | الرابط الرسمي |\n`;
    md += `|---|---|---|---|---|\n`;
    closingSoon.forEach(c => {
      md += `| \`${c.id}\` | ${c.titleAr}<br>*${c.titleEn}* | ${c.deadline} | **${c.daysLeft} يوم** | [المصدر الرسمي](${c.url}) |\n`;
    });
    md += `\n`;
  }

  // Section 2
  md += `## 2. الفرص التي تجاوز تاريخ تحققها 90 يوماً (Verification Older than 90 Days)\n\n`;
  if (olderThan90Days.length === 0) {
    md += `*جميع الفرص تم التحقق منها خلال الـ 90 يوماً الماضية.*\n\n`;
  } else {
    md += `> [!NOTE]\n> هذه الفرص تتطلب مراجعة بشرية دورية للمصدر الرسمي للتأكد من استمرار الشروط والمواعيد.\n\n`;
    md += `| المعرف (ID) | اسم الفرصة | تاريخ التحقق السابق | العمر بالأيام | الرابط الرسمي للمراجعة |\n`;
    md += `|---|---|---|---|---|\n`;
    olderThan90Days.forEach(o => {
      md += `| \`${o.id}\` | ${o.titleAr} | ${o.verificationDate} | ${o.ageDays} يوم | [فحص المصدر](${o.url}) |\n`;
    });
    md += `\n`;
  }

  // Section 3
  md += `## 3. السجلات التي تتضمن تفاصيل غير مؤكدة أو بحاجة لمراجعة (Uncertain / Unconfirmed Details)\n\n`;
  if (uncertainOrMissing.length === 0) {
    md += `*لا توجد سجلات ذات حالات غير مؤكدة؛ كافة الفرص محققة ومكتملة.*\n\n`;
  } else {
    md += `| المعرف (ID) | اسم الفرصة | حالة التحقق | حالة التقديم | أهلية اليمن | نوع الموعد |\n`;
    md += `|---|---|---|---|---|---|\n`;
    uncertainOrMissing.forEach(u => {
      md += `| \`${u.id}\` | ${u.titleAr} | ${u.verificationStatus || '—'} | ${u.applicationStatus || '—'} | ${u.yemenEligibility || '—'} | ${u.deadlineType || '—'} |\n`;
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += `### سياسة حوكمة البيانات (Data Governance Notice):\n`;
  md += `وفقاً لقواعد \`AGENTS.md\`، تظل مسؤولية تحديث السجلات وتعديل التواريخ أو تمديد المواعيد مسؤولية بشرية حصرية للمشرف على المشروع بعد التحقق من الموقع الرسمي. هذا التقرير استرشادي بالكامل ولا يُجري أي تغييرات في ملف الإنتاج.\n`;

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outFilePath = path.join(OUTPUT_DIR, 'weekly-verification-report.md');
  fs.writeFileSync(outFilePath, md, 'utf8');

  console.log(`✔ Weekly report successfully generated at: ${outFilePath}`);
  console.log(`  - Closing soon (<= 14d): ${closingSoon.length}`);
  console.log(`  - Older than 90 days: ${olderThan90Days.length}`);
  console.log(`  - Uncertain / unconfirmed: ${uncertainOrMissing.length}`);

  return { closingSoon, olderThan90Days, uncertainOrMissing, outFilePath };
}

if (require.main === module) {
  generateWeeklyReport();
}

module.exports = { generateWeeklyReport };