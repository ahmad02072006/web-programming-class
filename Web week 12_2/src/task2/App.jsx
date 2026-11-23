import { useState, useEffect } from 'react';
import Nav from '../shared/Nav.jsx';
import { useDebouncedValue } from '../shared/useDebouncedValue.js';

const SUGGESTED = ['octocat', 'muxiddin19', 'torvalds', 'gaearon'];
const fmt = (n) => new Intl.NumberFormat('en-US', { notation: n > 9999 ? 'compact' : 'standard' }).format(n);

/** GET a GitHub endpoint and translate HTTP failures into friendly messages */
async function ghFetch(path, signal, username) {
  let res;
  try {
    res = await fetch(`https://api.github.com/${path}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Network error. Check your connection.');
  }
  if (res.status === 404) throw new Error(`User “${username}” was not found (404).`);
  if (res.status === 403 || res.status === 429) {
    const reset = Number(res.headers.get('x-ratelimit-reset'));
    const when = reset ? ` Try again around ${new Date(reset * 1000).toLocaleTimeString()}.` : '';
    throw new Error('GitHub API rate limit reached (60 requests / hour without a token).' + when);
  }
  if (!res.ok) throw new Error(`GitHub returned an error (HTTP ${res.status}).`);
  return res.json();
}

export default function App() {
  const [input, setInput] = useState('');
  const [username, setUsername] = useState(''); // the name we actually fetch
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gh-recent')) ?? []; } catch { return []; }
  });

  /* BONUS: debounce typing by 500 ms, then commit it as the username */
  const debounced = useDebouncedValue(input.trim(), 500);
  useEffect(() => {
    setUsername(debounced);
  }, [debounced]);

  /* MAIN EFFECT: fetch whenever `username` changes; abort the previous request in cleanup */
  useEffect(() => {
    if (!username) {
      setUser(null); setRepos([]); setError(null); setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const [profile, topRepos] = await Promise.all([
          ghFetch(`users/${encodeURIComponent(username)}`, controller.signal, username),
          ghFetch(`users/${encodeURIComponent(username)}/repos?sort=updated&per_page=4`, controller.signal, username),
        ]);
        setUser(profile);
        setRepos(topRepos);
        setRecent((prev) => [profile.login, ...prev.filter((n) => n.toLowerCase() !== profile.login.toLowerCase())].slice(0, 5));
      } catch (err) {
        if (err.name === 'AbortError') return; // a newer request replaced this one
        setUser(null); setRepos([]);
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();

    return () => controller.abort(); // runs before the next effect and on unmount
  }, [username]);

  /* persist recent searches */
  useEffect(() => {
    localStorage.setItem('gh-recent', JSON.stringify(recent));
  }, [recent]);

  /* tab title follows the profile */
  useEffect(() => {
    document.title = user ? `${user.name || user.login} · GitHub Lookup` : 'Task 2 · GitHub User Lookup';
  }, [user]);

  function submit(e) {
    e.preventDefault();
    setUsername(input.trim()); // immediate search (skips the debounce)
  }
  function choose(name) {
    setInput(name);
    setUsername(name);
  }

  return (
    <>
      <Nav current={2} />
      <main className="container">
        <div className="page-head">
          <div className="eyebrow">Task 2 · Code challenge</div>
          <h1>GitHub User Lookup</h1>
          <p>
            Type a username (searches automatically after 500&nbsp;ms) or press <strong>Search</strong>. Each new
            request <em>aborts the previous one</em> in the effect cleanup, so stale responses can never overwrite fresh ones.
          </p>
        </div>

        <form className="card gh-form" onSubmit={submit}>
          <div className="row">
            <div className="gh-input-wrap">
              <span aria-hidden="true">🔎</span>
              <input
                className="input"
                placeholder="GitHub username, e.g. octocat"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="GitHub username"
                autoFocus
              />
            </div>
            <button className="btn primary" type="submit" disabled={!input.trim()}>Search</button>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="muted" style={{ fontSize: '.82rem' }}>Try:</span>
            {SUGGESTED.map((n) => (
              <button type="button" className="chip" key={n} onClick={() => choose(n)}>{n}</button>
            ))}
            {recent.length > 0 && (
              <>
                <span className="muted" style={{ fontSize: '.82rem', marginLeft: 8 }}>Recent:</span>
                {recent.map((n) => (
                  <button type="button" className="chip" key={n} onClick={() => choose(n)}>🕘 {n}</button>
                ))}
                <button type="button" className="chip" onClick={() => setRecent([])}>clear</button>
              </>
            )}
          </div>
        </form>

        {/* ----- states: idle / loading / error / success ----- */}
        {!username && !loading && !error && (
          <div className="card gh-empty mt">
            <div style={{ fontSize: '2.5rem' }}>🐙</div>
            <h3>Search for any GitHub user</h3>
            <p className="muted">Tip: search <code>muxiddin19</code> to see the instructor’s profile.</p>
          </div>
        )}

        {loading && (
          <div className="card mt gh-skel" aria-busy="true">
            <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%' }} />
            <div style={{ flex: 1, display: 'grid', gap: 10 }}>
              <div className="skeleton" style={{ height: 26, width: '50%' }} />
              <div className="skeleton" style={{ height: 14, width: '30%' }} />
              <div className="skeleton" style={{ height: 14, width: '85%' }} />
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="alert err mt" role="alert">
            <span>🚫</span>
            <div><strong>Lookup failed</strong><br />{error}</div>
          </div>
        )}

        {user && !loading && (
          <section className="card gh-profile mt pop">
            <div className="gh-head">
              <img className="gh-avatar" src={user.avatar_url} alt={`${user.login} avatar`} width="120" height="120" />
              <div style={{ flex: 1, minWidth: 220 }}>
                <h2 style={{ fontSize: '1.7rem', margin: 0 }}>{user.name || user.login}</h2>
                <a href={user.html_url} target="_blank" rel="noreferrer">@{user.login} ↗</a>
                <p className="gh-bio">{user.bio || <span className="muted">This user has no bio.</span>}</p>
                <div className="row">
                  {user.location && <span className="badge">📍 {user.location}</span>}
                  {user.company && <span className="badge">🏢 {user.company}</span>}
                  {user.blog && <a className="badge accent" href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">🔗 website</a>}
                  <span className="badge">📅 Joined {new Date(user.created_at).getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="gh-stats">
              <div><strong>{fmt(user.followers)}</strong><span>Followers</span></div>
              <div><strong>{fmt(user.following)}</strong><span>Following</span></div>
              <div><strong>{fmt(user.public_repos)}</strong><span>Public repos</span></div>
              <div><strong>{fmt(user.public_gists)}</strong><span>Gists</span></div>
            </div>

            {repos.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>Recently updated repositories</h3>
                <div className="grid cols-2">
                  {repos.map((r) => (
                    <a key={r.id} className="gh-repo" href={r.html_url} target="_blank" rel="noreferrer">
                      <strong>{r.name}</strong>
                      <span className="muted gh-repo-desc">{r.description || 'No description'}</span>
                      <span className="row" style={{ gap: 8 }}>
                        {r.language && <span className="badge accent">{r.language}</span>}
                        <span className="badge">⭐ {fmt(r.stargazers_count)}</span>
                        <span className="badge">🍴 {fmt(r.forks_count)}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </>
  );
}
