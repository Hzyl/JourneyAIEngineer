# Lesson content hierarchy design

## Goal

Make a lesson readable as a study document by separating the title, outcomes, concepts, examples, practice, review, resources, notes, and completion actions without changing lesson data or progress behavior.

## Design

- Keep the existing single lesson page and URL/deep-link behavior.
- Use one semantic `h1` for the lesson title. Major learning areas use `h2`; cards use `h3`.
- Add a compact anchor navigation immediately below the lesson header. It links to `overview`, `concept`, `practice`, `check`, `resources`, and `notes` and remains horizontally scrollable on small screens.
- Group the page into distinct sections:
  - Overview: summary, objectives, prerequisites, keywords, and checklist progress.
  - Concept: concept notes, why it matters, formulas, and the learning playbook.
  - Practice: code examples, linked VS Code exercises, and practice evidence.
  - Check understanding: completion checklist, definition of done, self-check cards, and interview questions.
  - Resources: one guided resource list with in-app resources rendered as content blocks.
  - Notes and feedback: note editor, feedback form, and generated report preview.
- Preserve the existing accordion interaction for the five study steps. Open panels use a single primary column so long text and code are not squeezed into narrow cards. Short supporting cards can form a two-column grid only at wide desktop widths.
- Remove the duplicate hidden resource markup and keep one source of truth for lesson resources.
- Focus the lesson heading after a deep-link/open and use the window as the only scroll owner.
- Keep the current editorial palette, use semantic tinted section surfaces, preserve reduced-motion behavior, and keep touch targets at least 44px on mobile.

## Acceptance criteria

- A reader can identify the lesson title, current phase/module, objectives, concept, practice, review, resources, and notes without reading every paragraph.
- No long text column becomes visibly narrow at desktop, tablet, or 390px viewport widths.
- The lesson title is the page `h1`, major sections have a logical heading hierarchy, and anchor navigation is keyboard accessible.
- Refresh, deep-link, Back/Forward, progress, notes, feedback, review, and exercise actions keep their existing behavior.
- No duplicate resource list is rendered or maintained.
- `npm run lint`, `npm run build`, and Playwright desktop/mobile smoke tests pass.
