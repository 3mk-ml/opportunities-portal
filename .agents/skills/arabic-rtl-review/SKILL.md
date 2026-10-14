
---
name: arabic-rtl-review
description: Review bilingual Arabic and English web interfaces for RTL/LTR correctness, typography, navigation, accessibility, language switching, and mobile responsiveness. Use this skill when reviewing or testing Opportunities Portal UI pages, especially before accepting completed frontend work.
---

# Arabic RTL Review Skill

## Objective

Review the Opportunities Portal interface to ensure
professional, accessible, and consistent Arabic and
English user experiences.

This skill is review-only. Do not modify source files
unless the user explicitly requests fixes.

## 1. Language and Direction

Check the following:

- Arabic interface uses lang="ar" and dir="rtl".
- English interface uses lang="en" and dir="ltr".
- Language switching updates both language and direction.
- Mixed Arabic and English content remains readable.
- URLs, dates, numbers, and technical terms display correctly.
- Parentheses and punctuation are not visually reversed.
- Use appropriate directional isolation for mixed text.

## 2. Layout and Navigation

Verify that:

- Navigation follows the active interface direction.
- Icons and directional arrows are positioned correctly.
- Forms and input labels are aligned consistently.
- Cards, buttons, and menus maintain correct spacing.
- CSS logical properties are preferred where appropriate.
- All interactive elements remain accessible.

## 3. Typography

Check that:

- Arabic text uses a readable Arabic-compatible font.
- No external CDN font is required.
- Font sizes are consistent and readable.
- Long titles wrap without breaking the layout.
- Line height and spacing are comfortable.
- Arabic and English text do not overlap.

## 4. Mobile Responsiveness

Test the interface at:

- 360px mobile width.
- 768px tablet width.
- 1280px desktop width.

Verify that:

- There is no horizontal scrolling at 360px.
- Buttons remain easy to tap.
- Navigation works on small screens.
- Opportunity cards remain readable.
- Search and filter controls remain usable.
- Text does not overflow its containers.

## 5. Opportunities Portal Checks

Verify that:

- Opportunity names display in the correct language.
- Country and organization names remain readable.
- Deadline labels and countdown values are understandable.
- Expired opportunities are clearly identified.
- Favorite buttons are accessible.
- Official source links are visually clear.
- Empty states and error messages use the selected language.

## 6. Browser Verification

When browser tools are available:

1. Open the relevant page.
2. Test Arabic mode.
3. Test English mode.
4. Resize to the required viewport widths.
5. Interact with navigation, forms, and filters.
6. Capture screenshots for detected problems.
7. Report any console or rendering errors.

Never claim a browser test passed unless it was executed.

If browser tools are unavailable, mark browser checks
as NOT TESTED.

## 7. Review Report

Produce a structured report with:

- Page or component reviewed.
- Check performed.
- Status: PASS / FAIL / WARNING / NOT TESTED.
- Description of the issue.
- File or component location when identifiable.
- Recommended fix.
- Screenshot evidence when available.

Group findings by severity:
- Critical
- Major
- Minor

## 8. Restrictions

- Do not delete files.
- Do not modify opportunity data.
- Do not install dependencies.
- Do not use external CDN resources.
- Do not modify source code during review.
- Follow the project's AGENTS.md rules.

## Completion Criteria

The review is complete when all applicable checks
have been assessed, findings are documented, and
unverified items are clearly identified.
