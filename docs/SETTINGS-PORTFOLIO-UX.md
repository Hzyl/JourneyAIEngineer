# Settings and portfolio clarity

Date: 2026-10-08. Local changes, not published.

## Settings

SettingsView is extracted from App.tsx. The interface distinguishes choices that
save automatically from the weekly goal that requires a submit action. Receipts
name the saved field, and an edited weekly goal retains an explicit unsaved notice
when another preference is saved. Only a weekly-goal write puts its button into
the saving state. Controls remain disabled during any pending settings write.

The weekly goal is a keyboard-submittable form with integer bounds of 60 through
10080 minutes, accessible error feedback and immediate duplicate-submit protection.
Failed writes retain the entered minutes. Successful writes release the draft so
subsequent settings refreshes can show the current server value. Restoring a local
backup resets the draft and prior feedback. Local and hosted data panels remain
separate; this change does not enable cloud restore or local APIs on the web.

Follow-up: settings errors now use fixed VI/EN text that follows the active
language. The form and topbar language toggle share a pending-write lock; see
[workspace recovery](WORKSPACE-RECOVERY-UX.md) for the race, retry and draft checks.

## Portfolio

Ten existing project ideas now expose every authored deliverable, evaluation criteria
and a suggested learner folder inside a native disclosure. The previous four-item
slice hid later deliverables and never displayed the existing evaluation field.
The project list uses two columns on desktop and one on narrow screens; longer
requirements stay readable without opening GitHub.

Vietnamese deliverable and evaluation fields have been added to the canonical
curriculum. The career checklist now has an English version. Titles, project slugs,
phase references, existing English criteria and lesson IDs remain unchanged. The
catalog fingerprint was updated for this intentional content edit. Introductory
copy explains that project choices and advanced GenAI checklist items depend on
the target role; they are not a requirement to complete all ten projects.

## Evidence and limits

- All 124 frontend unit tests passed, including nine settings cases and three
  portfolio cases. They cover invalid goals, duplicate writes, failure/retry,
  refreshes after saving, field-specific receipts, data-mode boundaries and all
  translated deliverables/evaluation criteria.
- All 67 Python tests passed. Strict content validation passed for 23 phases and
  208 lessons; catalog fingerprint verification passed.
- Eight focused local browser tests passed: the new VI/EN settings/portfolio
  scenarios plus existing interaction and backup/restore regression checks.
- The full local browser suite passed all 38 tests. Both new VI/EN scenarios passed
  again after separating goal validation from save errors; preference saves no
  longer remove the validation message for an invalid weekly goal.
- Eighteen hosted production-build browser tests passed using synthetic cloud
  responses; they do not prove a deployed settings write or real Auth behavior.
- Lint and production build passed with the existing Fast Refresh and hosted
  chunk-size warnings. Git whitespace checks passed.
- Light/dark screenshots at 1440px and 390px are under
  `.build/settings-portfolio-evidence/`. Vietnamese dark/mobile settings and English
  light/mobile expanded portfolio were visually inspected.

The new browser cases mock settings writes, retain genuine app navigation and read
the actual catalog through the isolated local backend. They do not change private
learner settings. No dependency installation, production migration, commit, push or
deployment was performed. Release gates remain open in the implementation plan.
