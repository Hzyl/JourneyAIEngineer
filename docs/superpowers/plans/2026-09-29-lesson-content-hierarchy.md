# Lesson Content Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make lesson content scanable by separating major learning areas, fixing narrow split columns, and adding accessible navigation anchors.

**Architecture:** Keep the current React lesson components and CSS files. Add semantic section wrappers and a small presentational anchor navigation in `LessonDetail`, move the existing content into those wrappers, and update `learning-workflow.css` for a single-column reading flow with desktop-only supporting grids. No new dependency or backend route is needed.

**Tech Stack:** React 19, TypeScript, Vite, existing CSS, Playwright.

---

### Task 1: Add semantic lesson navigation and heading hierarchy

**Files:**
- Modify: `src/App.tsx` (`LessonPage`, `LessonDetail`, `StudyStepAccordion`)
- Modify: `src/learning-workflow.css`
- Test: `tests/e2e/learning-flow.spec.ts`

- [x] Add an anchor navigation component with links for overview, concept, practice, check, resources, and notes. Give it an accessible label and visible focus state.
- [x] Change the lesson title to `h1`, major regions to `section` with `h2`, and content cards to `h3` without changing copy or data.
- [x] Add `role="region"` and a matching labelled heading to open accordion panels.
- [x] Focus the lesson `h1` after opening a lesson and remove the redundant parent scroll call so the window is the only scroll owner.
- [x] Extend the E2E lesson test to assert the `h1`, anchor links, and one target section after clicking an anchor.
- [x] Run `npm run lint`, `npm run build`, and the focused Playwright test.

### Task 2: Split the lesson into scanable learning areas

**Files:**
- Modify: `src/App.tsx` (`LessonDetail`)
- Modify: `src/learning-workflow.css`

- [x] Wrap overview, concept, practice, check, resources, and notes/feedback in distinct sections with stable IDs.
- [x] Give concept, practice, check, resources, and notes distinct surface classes while reusing existing color tokens.
- [x] Move code examples and linked exercises into the practice region, and move interview/self-check content into the check region while preserving handlers and state.
- [x] Remove the duplicate hidden parallel resource list; retain the guided resource list as the only rendered resource list.
- [x] Keep completion actions and next-lesson navigation in the final completion area.

### Task 3: Fix responsive card widths and visual grouping

**Files:**
- Modify: `src/learning-workflow.css`
- Modify: `src/App.css` only if shared lesson section tokens need a small adjustment

- [x] Make the primary study-step content one column by default and allow a supporting two-column layout only at wide desktop widths.
- [x] Set readable text measure, code overflow behavior, and section spacing for 1440px, 1024px, 768px, and 390px viewports.
- [x] Keep mobile anchor navigation horizontally scrollable without horizontal page overflow.
- [x] Verify focus outlines, touch target sizes, contrast, and reduced-motion behavior.

### Task 4: Verify browser behavior and regression safety

**Files:**
- Modify: `tests/e2e/learning-flow.spec.ts`

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run desktop and mobile Playwright smoke tests, including deep-link, anchor navigation, feedback report generation, and no horizontal overflow.
- [x] Inspect the diff and confirm no backend, content catalog, progress, or release artifacts changed.
- [x] Prepare a commit proposal only after all checks pass; do not commit or push without a new explicit confirmation.
