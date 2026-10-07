// This same-origin script runs before styles and React, including on deep links.
// Keep the storage key in sync with src/theme/theme-store.ts.
(() => {
  let choice;
  try {
    choice = localStorage.getItem('journey.theme');
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
  const theme = choice === 'light' || choice === 'dark'
    ? choice
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content', theme === 'dark' ? '#101923' : '#f7f8fa',
  );
})();
