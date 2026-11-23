import { useState, useEffect } from 'react';

const LINKS = [
  { id: 1, dir: 'task1-weather', label: '1 · Weather' },
  { id: 2, dir: 'task2-github', label: '2 · GitHub' },
  { id: 3, dir: 'task3-study-guide', label: '3 · Study Guide' },
  { id: 4, dir: 'task4-effects-lab', label: '4 · Effects Lab' },
  { id: 5, dir: 'task5-sprint-quiz', label: '5 · Sprint Quiz' },
];

/** Top bar shared by all tasks. Theme uses the localStorage pattern from the lecture. */
export default function Nav({ current }) {
  // lazy initializer: read localStorage ONCE on mount
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark'; } catch { return 'dark'; }
  });

  // effect: sync the state OUT to the document + localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
  }, [theme]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href="../index.html">
          <span className="dot" /> Week 12_2
        </a>
        <nav className="nav-links" aria-label="Tasks">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`../${l.dir}/index.html`}
              className={l.id === current ? 'active' : ''}
              aria-current={l.id === current ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          className="icon-btn"
          aria-label="Toggle theme"
          title="Toggle light / dark"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
