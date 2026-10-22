#!/usr/bin/env node

/**
 * Opportunities Portal Data Validator
 *
 * Validates data/opportunities.json against the data schema without any external dependencies.
 *
 * Usage:
 *   node scripts/validate-data.js              # Standard development validation
 *   node scripts/validate-data.js --release    # Fails if fewer than 20 records exist
 *   node scripts/validate-data.js --test       # Runs self-tests on synthetic datasets
 *
 * Security & Integrity:
 * - Read-only: never modifies any file or opportunity record.
 * - Non-zero exit code (1) on any validation failure.
 * - Identifies opportunity array index, ID (when available), and exact field path.
 */

const fs = require('fs');
const path = require('path');

const ALLOWED_TYPES = new Set(['scholarship', 'course', 'internship', 'fellowship', 'leadership-program']);
const ALLOWED_DELIVERY_MODES = new Set(['online', 'onsite', 'hybrid']);
const ALLOWED_DEADLINE_TYPES = new Set(['fixed', 'ongoing', 'periodic', 'unknown', 'course-dependent']);
const ALLOWED_LEVELS = new Set([
  'high-school',
  'undergraduate',
  'postgraduate',
  'doctorate',
  'postdoctoral',
  'all-levels'
]);
const ALLOWED_CATEGORIES = new Set([
  'engineering',
  'medicine',
  'computer-science',
  'business',
  'humanities',
  'natural-sciences',
  'social-sciences',
  'arts-design',
  'general'
]);
const ALLOWED_APPLICATION_STATUS = new Set([
  'open',
  'closed',
  'upcoming',
  'course-dependent',
  'unconfirmed',
  'admissions-route'
]);
const ALLOWED_YEMEN_ELIGIBILITY = new Set([
  'eligible',
  'conditional',
  'restricted',
  'not-eligible',
  'unconfirmed'
]);
const ALLOWED_APPLICATION_ROUTES = new Set([
  'direct',
  'direct-after-admission',
  'automatic-through-admission',
  'external-nomination',
  'institution-submits',
  'direct-with-host-support',
  'admission-then-invitation'
]);
const ALLOWED_VERIFICATION_STATUS = new Set([
  'verified',
  'pending-human-review'
]);
const ALLOWED_LOCATION_SCOPES = new Set([
  'national',
  'multi-country',
  'global'
]);
const ALLOWED_FUNDING_COVERAGE = new Set([
  'full-funding',
  'tuition-waiver',
  'partial',
  'research-grant',
  'leadership-support'
]);

const ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_FORMAT_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

/**
 * Checks if a year is a leap year in the Gregorian calendar.
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Strict calendar date validation.
 * Verifies month lengths, leap years, and calendar existence.
 */
function isValidCalendarDate(dateStr) {
  if (typeof dateStr !== 'string' || !DATE_FORMAT_REGEX.test(dateStr)) {
    return false;
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > daysInMonth[month - 1]) return false;

  return true;
}

/**
 * Checks if date string is in the future relative to a reference date.
 */
function isDateInFuture(dateStr, referenceDate = new Date()) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetUtc = Date.UTC(year, month - 1, day);
  const refUtc = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate()
  );
  return targetUtc > refUtc;
}

/**
 * Syntactic HTTPS URL validation.
 * Note: Syntactic validity does NOT establish authentication or current live accessibility.
 */
function isValidHttpsUrl(urlString) {
  if (typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

/**
 * Validates a bilingual text object { ar: string, en: string }
 */
function validateBilingualText(obj, fieldPath, errors, location) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    errors.push(`${location} -> Field "${fieldPath}": Must be an object with non-empty "ar" and "en" string properties.`);
    return;
  }

  if (typeof obj.ar !== 'string' || obj.ar.trim().length === 0) {
    errors.push(`${location} -> Field "${fieldPath}.ar": Must be a non-empty string.`);
  }

  if (typeof obj.en !== 'string' || obj.en.trim().length === 0) {
    errors.push(`${location} -> Field "${fieldPath}.en": Must be a non-empty string.`);
  }
}

/**
 * Validates the dataset object according to schema rules.
 */
function validateOpportunitiesData(data, options = {}) {
  const { isReleaseMode = false, referenceDate = new Date() } = options;
  const errors = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push('Root: Must be a JSON object.');
    return { isValid: false, errors };
  }

  // Root version
  if (typeof data.version !== 'string' || data.version.trim().length === 0) {
    errors.push('Root -> Field "version": Must be a non-empty string (e.g. "1.0.0").');
  }

  // Root lastUpdated
  if (!data.lastUpdated || !isValidCalendarDate(data.lastUpdated)) {
    errors.push(`Root -> Field "lastUpdated": Must be a valid ISO calendar date (YYYY-MM-DD). Received: "${data.lastUpdated}".`);
  } else if (isDateInFuture(data.lastUpdated, referenceDate)) {
    errors.push(`Root -> Field "lastUpdated": Cannot be a future date. Received: "${data.lastUpdated}".`);
  }

  // Root opportunities array
  if (!Array.isArray(data.opportunities)) {
    errors.push('Root -> Field "opportunities": Must be an array.');
    return { isValid: errors.length === 0, errors };
  }

  // Release mode check: requires at least 20 records and all must be verified
  if (isReleaseMode) {
    if (data.opportunities.length < 20) {
      errors.push(`Release Mode: Dataset must contain at least 20 verified opportunity records. Currently found: ${data.opportunities.length}. (Note: Passing this count check does not establish official authenticity).`);
    }
    const pendingReviewCount = data.opportunities.filter(o => o && o.verificationStatus === 'pending-human-review').length;
    if (pendingReviewCount > 0) {
      errors.push(`Release Mode: Dataset cannot be released with opportunities pending human verification. Currently found ${pendingReviewCount} record(s) with verificationStatus "pending-human-review".`);
    }
  }

  const seenIds = new Set();

  data.opportunities.forEach((item, index) => {
    const oppId = item && typeof item.id === 'string' && item.id.trim().length > 0 ? item.id : 'NO_ID';
    const location = `opportunities[${index}] (id: "${oppId}")`;

    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      errors.push(`${location}: Opportunity entry must be a valid JSON object.`);
      return;
    }

    // 1. ID validation
    if (typeof item.id !== 'string' || !ID_REGEX.test(item.id)) {
      errors.push(`${location} -> Field "id": Must be a lowercase alphanumeric kebab-case string (e.g. "opp-turkiye-2027"). Received: "${item.id}".`);
    } else {
      if (seenIds.has(item.id)) {
        errors.push(`${location} -> Field "id": Duplicate ID found: "${item.id}". All opportunity IDs must be unique.`);
      }
      seenIds.add(item.id);
    }

    // 2. Type validation
    if (!ALLOWED_TYPES.has(item.type)) {
      errors.push(`${location} -> Field "type": Invalid value "${item.type}". Allowed values: [${Array.from(ALLOWED_TYPES).join(', ')}].`);
    }

    // 3. Delivery Mode validation
    if (!ALLOWED_DELIVERY_MODES.has(item.deliveryMode)) {
      errors.push(`${location} -> Field "deliveryMode": Invalid value "${item.deliveryMode}". Allowed values: [${Array.from(ALLOWED_DELIVERY_MODES).join(', ')}].`);
    }

    // 4. Bilingual Title
    validateBilingualText(item.title, 'title', errors, location);

    // 5. Bilingual Provider
    validateBilingualText(item.provider, 'provider', errors, location);

    // 6. Country validation (geographic only, or null if multi-country/global/virtual)
    if (item.locationScope !== undefined) {
      if (!ALLOWED_LOCATION_SCOPES.has(item.locationScope)) {
        errors.push(`${location} -> Field "locationScope": Invalid value "${item.locationScope}". Allowed: [${Array.from(ALLOWED_LOCATION_SCOPES).join(', ')}].`);
      }
    }

    if (item.country === undefined) {
      errors.push(`${location} -> Field "country": Field is required. Must be a valid country object or explicit null for multi-country/global/virtual opportunities.`);
    } else if (item.country !== null) {
      if (typeof item.country !== 'object' || Array.isArray(item.country)) {
        errors.push(`${location} -> Field "country": Must be an object or null.`);
      } else {
        validateBilingualText(item.country, 'country', errors, location);
        if (typeof item.country.code !== 'string' || !COUNTRY_CODE_REGEX.test(item.country.code)) {
          errors.push(`${location} -> Field "country.code": Must be a 2-letter uppercase ISO 3166-1 alpha-2 code (e.g. "TR", "YE"). "ONLINE" is prohibited. Received: "${item.country.code}".`);
        }
      }
    } else {
      // country is null: allowed if virtual, or if locationScope is multi-country or global
      if (item.deliveryMode === 'onsite' && item.locationScope !== 'multi-country' && item.locationScope !== 'global') {
        errors.push(`${location} -> Field "country": Onsite opportunities with country set to null must explicitly declare locationScope as "multi-country" or "global".`);
      }
    }

    // 7. Fields validation (array of { category, name: { ar, en } })
    if (!Array.isArray(item.fields) || item.fields.length === 0) {
      errors.push(`${location} -> Field "fields": Must be a non-empty array of field objects.`);
    } else {
      item.fields.forEach((f, fIdx) => {
        const fieldLoc = `${location} -> Field "fields[${fIdx}]"`;
        if (!f || typeof f !== 'object' || Array.isArray(f)) {
          errors.push(`${fieldLoc}: Must be an object with "category" and "name".`);
          return;
        }
        if (!ALLOWED_CATEGORIES.has(f.category)) {
          errors.push(`${fieldLoc}.category: Invalid category "${f.category}". Allowed: [${Array.from(ALLOWED_CATEGORIES).join(', ')}].`);
        }
        validateBilingualText(f.name, `fields[${fIdx}].name`, errors, location);
      });
    }

    // 8. Education levels validation (array of string enums)
    if (!Array.isArray(item.levels) || item.levels.length === 0) {
      errors.push(`${location} -> Field "levels": Must be a non-empty array of education level strings.`);
    } else {
      item.levels.forEach((lvl, lvlIdx) => {
        if (!ALLOWED_LEVELS.has(lvl)) {
          errors.push(`${location} -> Field "levels[${lvlIdx}]": Invalid education level "${lvl}". Allowed: [${Array.from(ALLOWED_LEVELS).join(', ')}].`);
        }
      });
    }

    // 9. Deadline Type validation
    if (!ALLOWED_DEADLINE_TYPES.has(item.deadlineType)) {
      errors.push(`${location} -> Field "deadlineType": Invalid value "${item.deadlineType}". Allowed: [${Array.from(ALLOWED_DEADLINE_TYPES).join(', ')}].`);
    }

    // 10. Deadline validation and consistency with deadlineType
    if (item.deadline === undefined) {
      errors.push(`${location} -> Field "deadline": Field is required. Must be an ISO date string (YYYY-MM-DD) or explicit null.`);
    } else if (item.deadline !== null) {
      if (!isValidCalendarDate(item.deadline)) {
        errors.push(`${location} -> Field "deadline": "${item.deadline}" is not a valid Gregorian calendar date (YYYY-MM-DD).`);
      }

      if (item.deadlineType === 'ongoing') {
        errors.push(`${location} -> Field "deadline": Ongoing opportunities must have deadline set to null. Received: "${item.deadline}".`);
      } else if (item.deadlineType === 'unknown') {
        errors.push(`${location} -> Field "deadline": Opportunities with unknown deadline must have deadline set to null. Received: "${item.deadline}".`);
      } else if (item.deadlineType === 'course-dependent') {
        errors.push(`${location} -> Field "deadline": Course-dependent opportunities must have deadline set to null because deadlines vary by course. Received: "${item.deadline}".`);
      }
    } else {
      // deadline is null
      if (item.deadlineType === 'fixed') {
        errors.push(`${location} -> Field "deadline": Fixed deadline opportunities must specify a valid date string. Null is not allowed when deadlineType is "fixed".`);
      }
    }

    // 10b. Optional admissionDeadline validation and relation to deadline
    if (item.admissionDeadline !== undefined && item.admissionDeadline !== null) {
      if (!isValidCalendarDate(item.admissionDeadline)) {
        errors.push(`${location} -> Field "admissionDeadline": "${item.admissionDeadline}" is not a valid Gregorian calendar date (YYYY-MM-DD).`);
      } else if (item.deadline !== null && typeof item.deadline === 'string' && isValidCalendarDate(item.deadline)) {
        if (item.admissionDeadline > item.deadline) {
          errors.push(`${location} -> Field "admissionDeadline": Admission deadline ("${item.admissionDeadline}") cannot be later than scholarship application deadline ("${item.deadline}").`);
        }
      }
    }

    // 10c. Optional additional date fields
    if (item.applicationOpens !== undefined && item.applicationOpens !== null) {
      if (!isValidCalendarDate(item.applicationOpens)) {
        errors.push(`${location} -> Field "applicationOpens": Must be a valid Gregorian ISO calendar date (YYYY-MM-DD). Received: "${item.applicationOpens}".`);
      }
    }
    if (item.admissionRecommendedBy !== undefined && item.admissionRecommendedBy !== null) {
      if (!isValidCalendarDate(item.admissionRecommendedBy)) {
        errors.push(`${location} -> Field "admissionRecommendedBy": Must be a valid Gregorian ISO calendar date (YYYY-MM-DD). Received: "${item.admissionRecommendedBy}".`);
      }
    }
    if (item.nextCycleOpens !== undefined && item.nextCycleOpens !== null) {
      if (!isValidCalendarDate(item.nextCycleOpens)) {
        errors.push(`${location} -> Field "nextCycleOpens": Must be a valid Gregorian ISO calendar date (YYYY-MM-DD). Received: "${item.nextCycleOpens}".`);
      }
    }

    // 10d. Optional applicationWindows validation (e.g. for multi-track opportunities like SDU)
    if (item.applicationWindows !== undefined && item.applicationWindows !== null) {
      if (!Array.isArray(item.applicationWindows) || item.applicationWindows.length === 0) {
        errors.push(`${location} -> Field "applicationWindows": Must be a non-empty array of window objects.`);
      } else {
        item.applicationWindows.forEach((win, wIdx) => {
          const wLoc = `${location} -> Field "applicationWindows[${wIdx}]"`;
          if (!win || typeof win !== 'object' || Array.isArray(win)) {
            errors.push(`${wLoc}: Must be a window object.`);
            return;
          }
          if (win.label && typeof win.label === 'object') {
            validateBilingualText(win.label, `applicationWindows[${wIdx}].label`, errors, location);
          }
          if (!Array.isArray(win.levels) || win.levels.length === 0) {
            errors.push(`${wLoc}.levels: Must be a non-empty array of levels.`);
          } else {
            win.levels.forEach(lvl => {
              if (!ALLOWED_LEVELS.has(lvl)) {
                errors.push(`${wLoc}.levels: Invalid level "${lvl}".`);
              }
            });
          }
          if (!win.deadline || !isValidCalendarDate(win.deadline)) {
            errors.push(`${wLoc}.deadline: Must be a valid Gregorian calendar date (YYYY-MM-DD). Received: "${win.deadline}".`);
          }
          if (win.opensAt && !isValidCalendarDate(win.opensAt)) {
            errors.push(`${wLoc}.opensAt: Must be a valid Gregorian calendar date (YYYY-MM-DD). Received: "${win.opensAt}".`);
          }
        });
      }
    }

    // 10e. Optional secondaryDeadlines validation (e.g. reference letters)
    if (item.secondaryDeadlines !== undefined && item.secondaryDeadlines !== null) {
      if (!Array.isArray(item.secondaryDeadlines) || item.secondaryDeadlines.length === 0) {
        errors.push(`${location} -> Field "secondaryDeadlines": Must be a non-empty array.`);
      } else {
        item.secondaryDeadlines.forEach((sd, sdIdx) => {
          const sdLoc = `${location} -> Field "secondaryDeadlines[${sdIdx}]"`;
          if (!sd || typeof sd !== 'object' || Array.isArray(sd)) {
            errors.push(`${sdLoc}: Must be an object.`);
            return;
          }
          if (sd.label && typeof sd.label === 'object') {
            validateBilingualText(sd.label, `secondaryDeadlines[${sdIdx}].label`, errors, location);
          }
          if (!sd.date || !isValidCalendarDate(sd.date)) {
            errors.push(`${sdLoc}.date: Must be a valid Gregorian calendar date. Received: "${sd.date}".`);
          }
        });
      }
    }

    // 10f. Optional recurringDeadlines validation (e.g. SRH)
    if (item.recurringDeadlines !== undefined && item.recurringDeadlines !== null) {
      if (!Array.isArray(item.recurringDeadlines) || item.recurringDeadlines.length === 0) {
        errors.push(`${location} -> Field "recurringDeadlines": Must be a non-empty array.`);
      } else {
        const MONTH_DAY_REGEX = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        item.recurringDeadlines.forEach((rd, rdIdx) => {
          const rdLoc = `${location} -> Field "recurringDeadlines[${rdIdx}]"`;
          if (!rd || typeof rd !== 'object' || Array.isArray(rd)) {
            errors.push(`${rdLoc}: Must be an object.`);
            return;
          }
          if (!rd.monthDay || !MONTH_DAY_REGEX.test(rd.monthDay)) {
            errors.push(`${rdLoc}.monthDay: Must be MM-DD format. Received: "${rd.monthDay}".`);
          }
          if (rd.intake && typeof rd.intake === 'object') {
            validateBilingualText(rd.intake, `recurringDeadlines[${rdIdx}].intake`, errors, location);
          }
        });
      }
    }

    // 11. Official Source URL (Syntactic HTTPS check)
    if (!isValidHttpsUrl(item.officialSourceUrl)) {
      errors.push(`${location} -> Field "officialSourceUrl": Must be a valid syntactic HTTPS URL starting with "https://". Received: "${item.officialSourceUrl}".`);
    }

    // 11b. Optional additionalOfficialSources validation
    if (item.additionalOfficialSources !== undefined && item.additionalOfficialSources !== null) {
      if (!Array.isArray(item.additionalOfficialSources)) {
        errors.push(`${location} -> Field "additionalOfficialSources": Must be an array of HTTPS URLs.`);
      } else {
        item.additionalOfficialSources.forEach((url, uIdx) => {
          if (!isValidHttpsUrl(url)) {
            errors.push(`${location} -> Field "additionalOfficialSources[${uIdx}]": Must be a valid HTTPS URL. Received: "${url}".`);
          }
        });
      }
    }

    // 12. Verification Status & Date
    if (item.verificationStatus !== undefined) {
      if (!ALLOWED_VERIFICATION_STATUS.has(item.verificationStatus)) {
        errors.push(`${location} -> Field "verificationStatus": Invalid value "${item.verificationStatus}". Allowed: [${Array.from(ALLOWED_VERIFICATION_STATUS).join(', ')}].`);
      }
    }

    if (item.verificationStatus === 'pending-human-review') {
      if (item.verificationDate !== null && item.verificationDate !== undefined) {
        if (!isValidCalendarDate(item.verificationDate)) {
          errors.push(`${location} -> Field "verificationDate": When verificationStatus is "pending-human-review", verificationDate must be null or a valid ISO calendar date.`);
        } else if (isDateInFuture(item.verificationDate, referenceDate)) {
          errors.push(`${location} -> Field "verificationDate": Verification date cannot be in the future.`);
        }
      }
    } else {
      // verified or legacy record
      if (!item.verificationDate || !isValidCalendarDate(item.verificationDate)) {
        errors.push(`${location} -> Field "verificationDate": Must be a valid Gregorian ISO calendar date (YYYY-MM-DD). Received: "${item.verificationDate}".`);
      } else if (isDateInFuture(item.verificationDate, referenceDate)) {
        errors.push(`${location} -> Field "verificationDate": Verification date cannot be in the future. Received: "${item.verificationDate}".`);
      }
    }

    // 13. Application Status Enum
    if (item.applicationStatus !== undefined && item.applicationStatus !== null) {
      if (!ALLOWED_APPLICATION_STATUS.has(item.applicationStatus)) {
        errors.push(`${location} -> Field "applicationStatus": Invalid value "${item.applicationStatus}". Allowed: [${Array.from(ALLOWED_APPLICATION_STATUS).join(', ')}].`);
      }
    }

    // 14. Yemen Eligibility Enum
    if (item.yemenEligibility !== undefined && item.yemenEligibility !== null) {
      if (!ALLOWED_YEMEN_ELIGIBILITY.has(item.yemenEligibility)) {
        errors.push(`${location} -> Field "yemenEligibility": Invalid value "${item.yemenEligibility}". Allowed: [${Array.from(ALLOWED_YEMEN_ELIGIBILITY).join(', ')}].`);
      }
    }

    // 15. Application Route Enum
    if (item.applicationRoute !== undefined && item.applicationRoute !== null) {
      if (!ALLOWED_APPLICATION_ROUTES.has(item.applicationRoute)) {
        errors.push(`${location} -> Field "applicationRoute": Invalid value "${item.applicationRoute}". Allowed: [${Array.from(ALLOWED_APPLICATION_ROUTES).join(', ')}].`);
      }
    }

    // 16. Funding Coverage Enum & Summary
    if (item.fundingCoverage !== undefined && item.fundingCoverage !== null) {
      if (!ALLOWED_FUNDING_COVERAGE.has(item.fundingCoverage)) {
        errors.push(`${location} -> Field "fundingCoverage": Invalid value "${item.fundingCoverage}". Allowed: [${Array.from(ALLOWED_FUNDING_COVERAGE).join(', ')}].`);
      }
    }
    if (item.fundingSummary !== undefined && item.fundingSummary !== null) {
      validateBilingualText(item.fundingSummary, 'fundingSummary', errors, location);
    }

    // 17. Optional description validation
    if (item.description !== undefined && item.description !== null) {
      validateBilingualText(item.description, 'description', errors, location);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Self-tests for validator functionality using synthetic valid and invalid cases.
 * Never touches the production dataset.
 */
function runSelfTests() {
  console.log('--- Running Validator Self-Tests (Synthetic Datasets) ---\n');
  let testFailures = 0;

  const fixedRefDate = new Date('2026-10-14T12:00:00Z');

  // Test 1: Leap year valid (2024-02-29)
  if (!isValidCalendarDate('2024-02-29')) {
    console.error('❌ Test 1 Failed: 2024-02-29 should be recognized as a valid leap day.');
    testFailures++;
  } else {
    console.log('✔ Test 1 Passed: Recognized valid leap day (2024-02-29).');
  }

  // Test 2: Non-leap year invalid (2025-02-29)
  if (isValidCalendarDate('2025-02-29')) {
    console.error('❌ Test 2 Failed: 2025-02-29 must be rejected (not a leap year).');
    testFailures++;
  } else {
    console.log('✔ Test 2 Passed: Rejected invalid leap day (2025-02-29).');
  }

  // Test 3: Invalid calendar date (2026-04-31 - April only has 30 days)
  if (isValidCalendarDate('2026-04-31')) {
    console.error('❌ Test 3 Failed: 2026-04-31 must be rejected (April has 30 days).');
    testFailures++;
  } else {
    console.log('✔ Test 3 Passed: Rejected non-existent calendar date (2026-04-31).');
  }

  // Test 4: Duplicate IDs detection
  const duplicateIdData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'dup-id',
        type: 'course',
        deliveryMode: 'online',
        title: { ar: 'عنوان 1', en: 'Title 1' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: null,
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['all-levels'],
        deadline: null,
        deadlineType: 'ongoing',
        officialSourceUrl: 'https://example.org/1',
        verificationDate: '2026-10-14'
      },
      {
        id: 'dup-id',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان 2', en: 'Title 2' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'دولة', en: 'Country', code: 'TR' },
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['undergraduate'],
        deadline: '2026-12-31',
        deadlineType: 'fixed',
        officialSourceUrl: 'https://example.org/2',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const dupResult = validateOpportunitiesData(duplicateIdData, { referenceDate: fixedRefDate });
  if (dupResult.isValid || !dupResult.errors.some(e => e.includes('Duplicate ID found'))) {
    console.error('❌ Test 4 Failed: Duplicate IDs were not detected.');
    testFailures++;
  } else {
    console.log('✔ Test 4 Passed: Correctly identified duplicate ID.');
  }

  // Test 5: Inconsistent deadlineType & deadline combinations (fixed with null deadline)
  const inconsistentDeadlineData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-bad-deadline',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'دولة', en: 'Country', code: 'YE' },
        fields: [{ category: 'engineering', name: { ar: 'هندسة', en: 'Engineering' } }],
        levels: ['undergraduate'],
        deadline: null,
        deadlineType: 'fixed', // invalid: fixed requires string date
        officialSourceUrl: 'https://example.org/opp',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const deadlineResult = validateOpportunitiesData(inconsistentDeadlineData, { referenceDate: fixedRefDate });
  if (deadlineResult.isValid || !deadlineResult.errors.some(e => e.includes('Fixed deadline opportunities must specify a valid date string'))) {
    console.error('❌ Test 5 Failed: Inconsistent fixed deadline with null was not caught.');
    testFailures++;
  } else {
    console.log('✔ Test 5 Passed: Caught inconsistent deadlineType ("fixed" with null deadline).');
  }

  // Test 6: Inconsistent ongoing with date string
  const ongoingWithDate = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-bad-ongoing',
        type: 'course',
        deliveryMode: 'online',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: null,
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['all-levels'],
        deadline: '2026-12-31', // invalid: ongoing must be null
        deadlineType: 'ongoing',
        officialSourceUrl: 'https://example.org/opp',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const ongoingResult = validateOpportunitiesData(ongoingWithDate, { referenceDate: fixedRefDate });
  if (ongoingResult.isValid || !ongoingResult.errors.some(e => e.includes('Ongoing opportunities must have deadline set to null'))) {
    console.error('❌ Test 6 Failed: Inconsistent ongoing deadline with date string was not caught.');
    testFailures++;
  } else {
    console.log('✔ Test 6 Passed: Caught ongoing opportunity with non-null deadline.');
  }

  // Test 7: Malformed / Non-HTTPS URLs
  const badUrlData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-insecure-url',
        type: 'course',
        deliveryMode: 'online',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: null,
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['all-levels'],
        deadline: null,
        deadlineType: 'ongoing',
        officialSourceUrl: 'http://insecure-example.org/opp', // HTTP forbidden
        verificationDate: '2026-10-14'
      }
    ]
  };
  const urlResult = validateOpportunitiesData(badUrlData, { referenceDate: fixedRefDate });
  if (urlResult.isValid || !urlResult.errors.some(e => e.includes('Must be a valid syntactic HTTPS URL'))) {
    console.error('❌ Test 7 Failed: Insecure HTTP URL was not caught.');
    testFailures++;
  } else {
    console.log('✔ Test 7 Passed: Rejected non-HTTPS URL.');
  }

  // Test 8: Missing translation strings
  const missingTranslationData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-missing-tr',
        type: 'course',
        deliveryMode: 'online',
        title: { ar: 'عنوان بالعربي فقط', en: '' }, // empty English
        provider: { ar: 'جهة', en: 'Provider' },
        country: null,
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['all-levels'],
        deadline: null,
        deadlineType: 'ongoing',
        officialSourceUrl: 'https://example.org/opp',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const trResult = validateOpportunitiesData(missingTranslationData, { referenceDate: fixedRefDate });
  if (trResult.isValid || !trResult.errors.some(e => e.includes('title.en": Must be a non-empty string'))) {
    console.error('❌ Test 8 Failed: Missing English title translation was not caught.');
    testFailures++;
  } else {
    console.log('✔ Test 8 Passed: Caught missing English translation string.');
  }

  // Test 9: Release mode threshold check (<20 records fails)
  const releaseTestResult = validateOpportunitiesData(
    { version: '1.0.0', lastUpdated: '2026-10-14', opportunities: [] },
    { isReleaseMode: true, referenceDate: fixedRefDate }
  );
  if (releaseTestResult.isValid || !releaseTestResult.errors.some(e => e.includes('Release Mode: Dataset must contain at least 20'))) {
    console.error('❌ Test 9 Failed: Release mode did not enforce 20 records minimum.');
    testFailures++;
  } else {
    console.log('✔ Test 9 Passed: Release mode enforced minimum 20 records requirement.');
  }

  // Test 10: Valid admissionDeadline before deadline
  const validAdmissionData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-valid-admission',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'هولندا', en: 'Netherlands', code: 'NL' },
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['postgraduate'],
        deadline: '2027-02-01',
        deadlineType: 'fixed',
        admissionDeadline: '2026-12-10',
        officialSourceUrl: 'https://example.org/valid',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const validAdmResult = validateOpportunitiesData(validAdmissionData, { referenceDate: fixedRefDate });
  if (!validAdmResult.isValid) {
    console.error('❌ Test 10 Failed: Valid admissionDeadline was rejected.', validAdmResult.errors);
    testFailures++;
  } else {
    console.log('✔ Test 10 Passed: Accepted valid admissionDeadline prior to deadline.');
  }

  // Test 11: Invalid calendar date in admissionDeadline (e.g. 2026-02-30)
  const invalidCalendarAdmissionData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-invalid-cal-admission',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'هولندا', en: 'Netherlands', code: 'NL' },
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['postgraduate'],
        deadline: '2027-02-01',
        deadlineType: 'fixed',
        admissionDeadline: '2026-02-30', // invalid calendar date
        officialSourceUrl: 'https://example.org/test',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const invalidCalAdmResult = validateOpportunitiesData(invalidCalendarAdmissionData, { referenceDate: fixedRefDate });
  if (invalidCalAdmResult.isValid || !invalidCalAdmResult.errors.some(e => e.includes('is not a valid Gregorian calendar date'))) {
    console.error('❌ Test 11 Failed: Non-existent calendar date in admissionDeadline was not rejected.');
    testFailures++;
  } else {
    console.log('✔ Test 11 Passed: Rejected non-existent calendar date in admissionDeadline.');
  }

  // Test 12: admissionDeadline later than deadline (e.g. admission in March, scholarship in Feb)
  const admissionAfterDeadlineData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-admission-after-deadline',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'هولندا', en: 'Netherlands', code: 'NL' },
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['postgraduate'],
        deadline: '2027-02-01',
        deadlineType: 'fixed',
        admissionDeadline: '2027-03-01', // later than deadline
        officialSourceUrl: 'https://example.org/test',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const admAfterDeadlineResult = validateOpportunitiesData(admissionAfterDeadlineData, { referenceDate: fixedRefDate });
  if (admAfterDeadlineResult.isValid || !admAfterDeadlineResult.errors.some(e => e.includes('cannot be later than scholarship application deadline'))) {
    console.error('❌ Test 12 Failed: admissionDeadline later than deadline was not caught.');
    testFailures++;
  } else {
    console.log('✔ Test 12 Passed: Caught admissionDeadline occurring later than scholarship deadline.');
  }

  // Test 13: Valid course-dependent deadlineType with deadline: null
  const validCourseDependentData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-valid-course-dependent',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'المملكة المتحدة', en: 'United Kingdom', code: 'GB' },
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['postgraduate'],
        deadline: null,
        deadlineType: 'course-dependent',
        officialSourceUrl: 'https://example.org/valid-cd',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const validCdResult = validateOpportunitiesData(validCourseDependentData, { referenceDate: fixedRefDate });
  if (!validCdResult.isValid) {
    console.error('❌ Test 13 Failed: Valid course-dependent opportunity was rejected.', validCdResult.errors);
    testFailures++;
  } else {
    console.log('✔ Test 13 Passed: Accepted valid course-dependent opportunity with deadline: null.');
  }

  // Test 14: Invalid course-dependent deadlineType with non-null deadline
  const invalidCourseDependentData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-invalid-course-dependent',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'المملكة المتحدة', en: 'United Kingdom', code: 'GB' },
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['postgraduate'],
        deadline: '2027-01-06', // invalid: must be null for course-dependent
        deadlineType: 'course-dependent',
        officialSourceUrl: 'https://example.org/invalid-cd',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const invalidCdResult = validateOpportunitiesData(invalidCourseDependentData, { referenceDate: fixedRefDate });
  if (invalidCdResult.isValid || !invalidCdResult.errors.some(e => e.includes('Course-dependent opportunities must have deadline set to null'))) {
    console.error('❌ Test 14 Failed: Inconsistent course-dependent opportunity with non-null deadline was not caught.');
    testFailures++;
  } else {
    console.log('✔ Test 14 Passed: Caught course-dependent opportunity with non-null deadline.');
  }

  // Test 15: Valid fellowship and leadership-program types with postdoctoral level
  const validNewTypesData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-valid-fellowship',
        type: 'fellowship',
        deliveryMode: 'onsite',
        locationScope: 'national',
        title: { ar: 'عنوان زمالة', en: 'Fellowship Title' },
        provider: { ar: 'جهة مانحة', en: 'Funder' },
        country: { ar: 'الولايات المتحدة', en: 'United States', code: 'US' },
        fields: [{ category: 'natural-sciences', name: { ar: 'علوم', en: 'Science' } }],
        levels: ['postdoctoral'],
        deadline: '2026-12-01',
        deadlineType: 'fixed',
        officialSourceUrl: 'https://example.org/fellowship',
        verificationStatus: 'verified',
        verificationDate: '2026-10-14'
      },
      {
        id: 'opp-valid-leadership',
        type: 'leadership-program',
        deliveryMode: 'hybrid',
        locationScope: 'global',
        title: { ar: 'برنامج قيادي', en: 'Leadership Program' },
        provider: { ar: 'منظمة دولية', en: 'Organization' },
        country: null,
        fields: [{ category: 'social-sciences', name: { ar: 'قيادة', en: 'Leadership' } }],
        levels: ['all-levels'],
        deadline: '2026-11-15',
        deadlineType: 'fixed',
        officialSourceUrl: 'https://example.org/leadership',
        verificationStatus: 'verified',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const newTypesResult = validateOpportunitiesData(validNewTypesData, { referenceDate: fixedRefDate });
  if (!newTypesResult.isValid) {
    console.error('❌ Test 15 Failed: Valid fellowship/leadership-program or postdoctoral was rejected.', newTypesResult.errors);
    testFailures++;
  } else {
    console.log('✔ Test 15 Passed: Accepted fellowship, leadership-program, and postdoctoral level.');
  }

  // Test 16: Valid staging record with verificationStatus 'pending-human-review' and verificationDate: null
  const validStagingData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-staging-record',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان قيد المراجعة', en: 'Pending Review Title' },
        provider: { ar: 'جامعة', en: 'University' },
        country: { ar: 'الدنمارك', en: 'Denmark', code: 'DK' },
        fields: [{ category: 'engineering', name: { ar: 'هندسة', en: 'Engineering' } }],
        levels: ['undergraduate'],
        deadline: '2027-03-15',
        deadlineType: 'fixed',
        officialSourceUrl: 'https://example.org/sdu',
        verificationStatus: 'pending-human-review',
        verificationDate: null
      }
    ]
  };
  const stagingResult = validateOpportunitiesData(validStagingData, { referenceDate: fixedRefDate });
  if (!stagingResult.isValid) {
    console.error('❌ Test 16 Failed: Staging record with pending-human-review was rejected.', stagingResult.errors);
    testFailures++;
  } else {
    console.log('✔ Test 16 Passed: Accepted staging record with pending-human-review and null verificationDate.');
  }

  // Test 17: Valid multi-country with locationScope 'multi-country' and country: null
  const validMultiCountryData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-valid-multi-country',
        type: 'fellowship',
        deliveryMode: 'onsite',
        locationScope: 'multi-country',
        title: { ar: 'برنامج دكتوراه أوروبي', en: 'European PhD Program' },
        provider: { ar: 'شبكة بحثية', en: 'Research Network' },
        country: null,
        fields: [{ category: 'computer-science', name: { ar: 'حاسوب', en: 'CS' } }],
        levels: ['doctorate'],
        deadline: '2026-10-31',
        deadlineType: 'fixed',
        officialSourceUrl: 'https://example.org/ellis',
        verificationStatus: 'verified',
        verificationDate: '2026-10-14'
      }
    ]
  };
  const mcResult = validateOpportunitiesData(validMultiCountryData, { referenceDate: fixedRefDate });
  if (!mcResult.isValid) {
    console.error('❌ Test 17 Failed: Valid multi-country opportunity was rejected.', mcResult.errors);
    testFailures++;
  } else {
    console.log('✔ Test 17 Passed: Accepted onsite multi-country opportunity with null country and locationScope="multi-country".');
  }

  // Test 18: Invalid applicationStatus value rejected
  const invalidStatusData = {
    version: '1.0.0',
    lastUpdated: '2026-10-14',
    opportunities: [
      {
        id: 'opp-invalid-status',
        type: 'scholarship',
        deliveryMode: 'onsite',
        title: { ar: 'عنوان', en: 'Title' },
        provider: { ar: 'جهة', en: 'Provider' },
        country: { ar: 'ألمانيا', en: 'Germany', code: 'DE' },
        fields: [{ category: 'general', name: { ar: 'عام', en: 'General' } }],
        levels: ['postgraduate'],
        deadline: '2026-12-01',
        deadlineType: 'fixed',
        officialSourceUrl: 'https://example.org/opp',
        verificationDate: '2026-10-14',
        applicationStatus: 'completely-fake-status' // invalid enum
      }