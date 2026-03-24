// Theme toggle: persists in localStorage and updates document attribute
(function () {
  const KEY = 'theme-preference';
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    const label = theme === 'dark' ? '🌙' : '☀️';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = label;
      btn.setAttribute('aria-pressed', theme === 'dark');
    });
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    setTheme(next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();
