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

const ALLOWED_TYPES = new Set(['scholarship', 'course', 'internship']);
const ALLOWED_DELIVERY_MODES = new Set(['online', 'onsite', 'hybrid']);
const ALLOWED_DEADLINE_TYPES = new Set(['fixed', 'ongoing', 'periodic', 'unknown']);
const ALLOWED_LEVELS = new Set([
  'high-school',
  'undergraduate',
  'postgraduate',
  'doctorate',
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

  // Release mode check: requires at least 20 records
  if (isReleaseMode && data.opportunities.length < 20) {
    errors.push(`Release Mode: Dataset must contain at least 20 verified opportunity records. Currently found: ${data.opportunities.length}. (Note: Passing this count check does not establish official authenticity).`);
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

    // 6. Country validation (geographic only, or null if entirely virtual)
    if (item.country === undefined) {
      errors.push(`${location} -> Field "country": Field is required. Must be a valid country object or explicit null for virtual opportunities.`);
    } else if (item.country !== null) {
      if (typeof item.country !== 'object' || Array.isArray(item.country)) {
        errors.push(`${location} -> Field "country": Must be an object or null.`);
      } else {
        validateBilingualText(item.country, 'country', errors, location);
        if (typeof item.country.code !== 'string' || !COUNTRY_CODE_REGEX.test(item.country.code)) {
          errors.push(`${location} -> Field "country.code": Must be a 2-letter uppercase ISO 3166-1 alpha-2 code (e.g. "TR", "YE"). "ONLINE" is prohibited. Received: "${item.country.code}".`);
        }
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
      }
    } else {
      // deadline is null
      if (item.deadlineType === 'fixed') {
        errors.push(`${location} -> Field "deadline": Fixed deadline opportunities must specify a valid date string. Null is not allowed when deadlineType is "fixed".`);
      }
    }

    // 11. Official Source URL (Syntactic HTTPS check)
    if (!isValidHttpsUrl(item.officialSourceUrl)) {
      errors.push(`${location} -> Field "officialSourceUrl": Must be a valid syntactic HTTPS URL starting with "https://". Received: "${item.officialSourceUrl}".`);
    }

    // 12. Verification Date (strictly non-future valid ISO date)
    if (!item.verificationDate || !isValidCalendarDate(item.verificationDate)) {
      errors.push(`${location} -> Field "verificationDate": Must be a valid Gregorian ISO calendar date (YYYY-MM-DD). Received: "${item.verificationDate}".`);
    } else if (isDateInFuture(item.verificationDate, referenceDate)) {
      errors.push(`${location} -> Field "verificationDate": Verification date cannot be in the future. Received: "${item.verificationDate}".`);
    }

    // 13. Optional description validation
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

  console.log(`\nSelf-test summary: ${testFailures === 0 ? 'ALL TESTS PASSED ✔' : `${testFailures} TEST(S) FAILED ❌`}\n`);
  return testFailures === 0;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const isTestMode = args.includes('--test');
  const isReleaseMode = args.includes('--release');

  if (isTestMode) {
    const success = runSelfTests();
    process.exit(success ? 0 : 1);
  }

  const dataFilePath = path.resolve(__dirname, '../data/opportunities.json');

  if (!fs.existsSync(dataFilePath)) {
    console.error(`[ERROR] File not found: ${dataFilePath}`);
    process.exit(1);
  }

  let rawContent = '';
  try {
    rawContent = fs.readFileSync(dataFilePath, 'utf8');
  } catch (err) {
    console.error(`[ERROR] Unable to read file ${dataFilePath}: ${err.message}`);
    process.exit(1);
  }

  let parsedData = null;
  try {
    parsedData = JSON.parse(rawContent);
  } catch (jsonErr) {
    console.error(`[ERROR] Malformed JSON syntax in ${dataFilePath}: ${jsonErr.message}`);
    process.exit(1);
  }

  console.log(`Validating data/opportunities.json (${isReleaseMode ? 'RELEASE MODE' : 'DEVELOPMENT MODE'})...`);

  const validation = validateOpportunitiesData(parsedData, { isReleaseMode });

  if (!validation.isValid) {
    console.error('\n❌ VALIDATION FAILED with the following error(s):\n');
    validation.errors.forEach((err, i) => {
      console.error(`  ${i + 1}. ${err}`);
    });
    console.error(`\nTotal errors: ${validation.errors.length}`);
    process.exit(1);
  }

  console.log('\n✔ VALIDATION SUCCESSFUL: data/opportunities.json conforms to all schema rules.');
  console.log(`  - Version: ${parsedData.version}`);
  console.log(`  - Last Updated: ${parsedData.lastUpdated}`);
  console.log(`  - Opportunity Records Count: ${parsedData.opportunities.length}`);
  if (parsedData.opportunities.length === 0) {
    console.log('  - Note: Development dataset is currently empty ([]), ready for verified manual entry.');
  }
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  validateOpportunitiesData,
  isValidCalendarDate,
  isDateInFuture,
  isValidHttpsUrl,
  isLeapYear
};
