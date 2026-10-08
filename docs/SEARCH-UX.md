# Global search follow-up — 2026-10-08

## Behavior

Global search is now a separate component. A slow response for an earlier query
cannot replace newer results. Failed requests show a retry action and preserve
the query; they are not presented as an empty result set. Clearing or shortening
the query hides results, and input is bounded to the API's 120-character limit.

The combobox supports Ctrl/Cmd+K, Arrow Up/Down, Enter and Escape. Focus stays in
the input while navigating options, the active option is identified through
ARIA, and opening an exercise moves focus to its heading. Result text and type
labels follow VI/EN. Native browser clear controls are hidden to avoid a second
clear button beside the app control. Result text is larger and the popup scrolls
within the viewport.

Exercise selection navigates directly to its stable exercise URL, including
when another exercise is already open. Back restores the previous exercise.
Lesson selection uses the existing lesson navigation. Resources open the library
filtered by title, while phases/modules open a filtered roadmap.

## Hosted catalogue

Hosted search now includes phases, modules and exercises alongside lessons and
resources. It searches both languages, returns bilingual titles, and applies
type, phase, status and limit filters. Ordinary catalogue search does not request
learning progress. Status-filtered lesson searches read paginated progress for
the authenticated account through the existing adapter. No schema or RPC changed.

## Evidence

- All 69 frontend unit tests passed. Added cases cover out-of-order responses,
  retry, localized titles, keyboard selection, exact destinations, all catalogue
  categories, filters, validation and the hosted adapter's request boundary.
- The adapter test uses a mock Supabase query builder, including a second page
  and the user filter. It does not establish live RLS behavior.
- All 26 local Playwright tests passed. The two new search tests cover VI/EN,
  delayed and failed responses, 1440px/390px layouts, light/dark contrast,
  keyboard focus, same-page exercise navigation and browser Back. Each also
  removes its search mock and opens an exercise through the real isolated local API.
- After the final font/clear-control polish, both search E2E tests passed again.
  Screenshots in `.build/search-evidence/` were visually inspected.
- All 14 production-browser tests passed against synthetic hosted settings.
  These cover public reading and auth boundaries, not signed-in live search.
- TypeScript/Vite build and diff checks passed. Lint has no errors and only the
  existing AuthProvider Fast Refresh warning. The large hosted chunk warning remains.

No packages were installed, and no production account, database or deployment
was changed. This work remains local and unpublished. It advances the main-flow
UI checklist without closing the broader public-readiness acceptance gates.
