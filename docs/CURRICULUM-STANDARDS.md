# Curriculum contribution and review standard

Journey teaches through a specific outcome, a worked example, a practice task,
feedback and later retrieval. Completion is self-reported; passing a local test
is evidence about that exercise, not a professional certification.

## Source layout

- `content/lessons/*.md` and the legacy generator retain the existing catalog.
- `content/curated/<lesson_id>.json` is the complete authored source for reviewed lessons.
- Both local and hosted loaders replace matching legacy entries with curated sources.
- Lesson, phase, module, exercise and review-card IDs must remain stable.
- Unreviewed catalog entries are drafts, not implicitly equivalent to reviewed lessons.
- Every curated lesson records a review date. Review describes a content check,
  not a promise that the lesson has been evaluated by real learner cohorts.

## Acceptance checklist

1. The summary names a concrete outcome appropriate to the title.
2. Vietnamese and English goals, explanations, steps and review answers agree.
3. The worked example teaches this topic and names setup and expected output.
4. At least one failure or edge case is explained using an observable result.
5. Practice produces an artifact and an explicit way to inspect its correctness.
6. Review cards ask about the skill just learned, not unrelated interview topics.
7. Official sources identify the relevant section rather than a generic homepage.
8. Local editor, Git and runner steps have manual alternatives for web readers.
9. Installation requirements and time estimates include their assumptions.
10. No secret, personal journal or account data appears in a source or example.

Use ordinary Python snippets when Python is the teaching medium. Shell examples
are marked conceptual: they require a known environment and manual review, and
the content validator does not execute them. Static parsing is not runtime proof.

## Exercise claims

An automated exercise checks behavior, not just nonempty answer fields. Include
normal cases, an edge case and a plausible incorrect implementation. The starter
must fail, a reference must pass and an irrelevant dictionary must fail.
Reflection exercises must say they are reflection tasks; a formatting check does
not establish mastery. A learner may add tests but should not treat an altered
test suite as independent verification of their answer.

## Workload and paths

Show reading/practice estimates separately from project work and review. A pace
is a scheduling preference, not a job-placement promise. Foundation, application
engineering and deep ML paths share prerequisites but need not repeat completed
foundations. Introduce evaluation, data handling and cost awareness with the first
AI application, before advanced agent orchestration.

## Verification

Run `python scripts/validate_content.py`, the curated-content tests and the relevant
API/unit tests. Execute controlled Python examples in isolated temporary folders.
Review every command example manually before marking a lesson reviewed. Existing
learner progress, review schedules and workspace files must survive content updates.
