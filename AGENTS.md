# Opportunities Portal — Agent Rules

## 1. Project Identity
- Project: Opportunities Portal (بوابة الفرص).
- Program: LLM4Yemen — Cohort 1.
- Development environment: Google Antigravity.
- Purpose: Help Yemeni students discover verified scholarships, free courses, and internship opportunities.
- Read `docs/proposal.md` before planning major changes.

## 2. Technology Stack
- Use HTML5, CSS3, and Vanilla JavaScript.
- Use JSON for opportunity data.
- Use localStorage for favorites.
- Use a Service Worker for offline functionality.
- Do not introduce frameworks, backend services, or databases without explicit approval.
- Do not use external CDN libraries, fonts, or scripts.
- Prefer lightweight solutions with minimal dependencies.

## 3. Language and User Interface
- Arabic is the primary language.
- Provide full English interface support.
- Arabic pages must use RTL direction.
- English pages must use LTR direction.
- Maintain correct text direction for dates, URLs, numbers, and English terminology.
- Follow a mobile-first design approach.
- Every page must work at a 360px viewport width without horizontal scrolling.
- Use accessible, semantic HTML and readable typography.

## 4. Data Integrity
- The source of opportunity data is `data/opportunities.json`.
- Never invent scholarships, courses, internships, organizations, deadlines, or URLs.
- All real opportunities must be collected and verified manually by the project owner.
- Every opportunity must include an official source URL and verification date.
- Do not modify verified opportunity facts without explicit approval.
- Report missing or suspicious data instead of inventing replacements.
- Never silently change or remove existing records.

## 5. Security
- Never read credential files, passwords, private tokens, API keys, or `.env` files.
- Never send project files or confidential information to external services.
- Never execute destructive commands or delete project files.
- Do not use unsafe `innerHTML` to render opportunity data.
- Prefer `textContent` and safe DOM manipulation.
- Validate external URLs before rendering clickable links.
- Opportunity source URLs must use HTTPS.
- Do not disable security checks to make code work.

## 6. Agent Workflow
- For tasks affecting multiple files, first produce an Implementation Plan.
- Wait for the user's approval before implementing the plan.
- Respect the files assigned to each agent.
- Never modify another agent's assigned files during parallel development.
- After implementation, test the affected functionality.
- Provide screenshots or browser evidence for interface-related tasks.
- Explain what changed, what was tested, and what remains incomplete.
- Never claim successful testing without actually running the test.

## 7. Git and Version Control
- Recommend meaningful Git commits after successful milestones.
- Never force-push or rewrite Git history without explicit approval.
- Do not commit credentials or sensitive files.
- Keep changes focused and reviewable.

## 8. Quality Standards
- Write readable, modular, maintainable code.
- Use descriptive English names for variables and functions.
- Provide clear loading, empty, and error states.
- Test search, filtering, favorites, deadline calculations, and localization.
- Ensure core functionality works offline after a successful initial load.
- Prioritize correctness, security, accessibility, and performance over unnecessary complexity.

## 9. Human Approval
- The project owner makes final technical and data decisions.
- Ask for clarification when important requirements are ambiguous.
- Do not assume that agent-generated information is verified.
- Keep all work inside the authorized project directory.