# App navigation verification

## Scope and direction

Codex UI implemented the responsive navigation follow-up using the existing project
design and UI/UX Pro Max accessibility guidance. No external design runtime, package,
theme or image asset was added. This covers the shared personal-app navigation;
the public landing navigation remains a separate component.

`AppNavigation.tsx` separates the sidebar markup from App. `useMobileNavigation.ts`
owns focus, viewport changes and scroll locking; `app-navigation.css` reuses project
colors, typography and reduced-motion rules. Navigation labels are 15px with 12px
hints. The mobile close button is 44 by 44 pixels. The drawer uses dynamic viewport
height and its own scrolling so the final navigation item stays reachable.

## Behavior and fixes

- Closed mobile navigation is hidden and inert, including for programmatic focus.
  Previously it was only translated off screen and remained keyboard-accessible.
- An open drawer is a labeled modal dialog. Main content and the skip link are
  inert; Tab and Shift+Tab stay inside. Background search shortcuts are suppressed.
- Escape, the close button and scrim dismiss the drawer and return focus to its
  opener. Selecting a page or using browser history closes it and focuses content.
- Body and document scrolling are restored on close/unmount. Resizing to desktop
  restores ordinary navigation and focuses the current page item. Resizing back
  closes the drawer and moves focus out of the now-hidden sidebar.
- Visibility follows the inert state rather than CSS alone. This fixes a reproduced
  resize race where CSS hid the focused item before the viewport handler could
  restore focus. Opening the drawer resets its scroll position.

## Evidence

Existing Node/npm, Playwright and Chromium were available; no installation was needed.
Tests use isolated local API/SQLite data or synthetic hosted settings, not live users.

- Before the fix, the new browser test failed because the closed sidebar was visible
  to accessibility queries. The subsequent resize failure was reproduced and fixed.
- Both VI/EN navigation scenarios passed twice after the resize correction.
- Full checkpoint: 138 unit tests, 42 local browser tests and 22 production browser
  tests passed. Lint had only the existing AuthProvider Fast Refresh warning.
- After the final font and scroll-position adjustments, all eight navigation/theme
  browser tests passed again. TypeScript/Vite production build and whitespace checks
  passed. The existing large hosted-client chunk warning remains.
- Checks cover desktop 1440px, mobile/tablet 320px, 390px and 820px; light/dark colors,
  reduced motion, keyboard loops, background isolation, dismissal, page selection,
  history, resize, reachable final items and text contrast/overflow.
- Screenshots: `.build/navigation-evidence/` (ignored). The final VI dark 390px and
  EN light 320px captures were visually inspected. Theme regression captures also
  cover the desktop app shell.

## Limits and next gates

This is browser automation and screenshot evidence, not certification with physical
mobile devices or screen readers. No real Supabase acceptance, Windows clean-machine
acceptance or learner pilot is established here. Broader release checklist items stay
open. Source changes are local; no commit, push, deploy or production change occurred.
