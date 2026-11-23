import { useState, useEffect, useRef } from 'react';
import Nav from '../shared/Nav.jsx';

/* =====================================================================
   Study Guide · Practice Exercises
   Ex 1  Page-title sync (+ cleanup)
   Ex 2  Fetch a user from an API (loading / error / success)
   Ex 3  Stopwatch with a properly cleaned-up setInterval
   ===================================================================== */

/* ---------- Exercise 1 ---------- */
function TitleEditor() {
  const [text, setText] = useState('');

  useEffect(() => {
    document.title = text || 'WebPro';
    return () => { document.title = 'WebPro'; }; // revert on unmount / before next run
  }, [text]);

  return (
    <div className="grid">
      <label className="field">Type to change the browser tab title
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type to change tab title…" />
      </label>
      <div className="s3-tab" aria-label="Browser tab preview">
        <span className="s3-dots"><i /><i /><i /></span>
        <span className="s3-tab-chip">🌐 {text || 'WebPro'}</span>
      </div>
      <p className="muted" style={{ margin: 0 }}>
        Look at your real browser tab: it is <code>document.title</code>. Switch to another exercise (the component
        unmounts) and the cleanup puts it back to “WebPro”.
      </p>
    </div>
  );
}

/* ---------- Exercise 2 ---------- */
function UserProfile() {
  const [userId, setUserId] = useState(1);
  const [broken, setBroken] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        // "broken" toggles a bad URL so you can see the error branch
        const url = `https://jsonplaceholder.typicode.com/${broken ? 'userz' : 'users'}/${userId}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch (HTTP ${res.status})`);
        setUser(await res.json());
      } catch (err) {
        if (err.name === 'AbortError') return;
        setUser(null);
        setError(err.message === 'Failed to fetch' ? 'Network error: could not reach the server' : err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchUser();
    return () => controller.abort();
  }, [userId, broken]);

  return (
    <div className="grid">
      <div className="row">
        <span className="muted">User ID</span>
        {[1, 2, 3, 4, 5].map((id) => (
          <button key={id} className={`chip ${id === userId ? 's3-chip-on' : ''}`} onClick={() => setUserId(id)}>{id}</button>
        ))}
        <span className="spacer" />
        <label className="row" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={broken} onChange={(e) => setBroken(e.target.checked)} />
          <span className="muted">Simulate error</span>
        </label>
      </div>

      {loading && <div className="row"><span className="spinner" /> <span>Loading…</span></div>}
      {error && !loading && <div className="alert err" role="alert">⚠️ Error: {error}</div>}
      {user && !loading && (
        <div className="s3-user pop">
          <div className="s3-avatar">{user.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
          <div>
            <h3 style={{ margin: 0 }}>{user.name}</h3>
            <a href={`mailto:${user.email}`}>{user.email}</a>
            <div className="muted" style={{ fontSize: '.85rem' }}>{user.company?.name} · {user.address?.city}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Exercise 3 ---------- */
const pad = (n, l = 2) => String(n).padStart(l, '0');
function format(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const elapsedRef = useRef(0); // lets the effect resume without listing `elapsed` as a dependency

  useEffect(() => {
    if (!running) return; // nothing to start or clean up
    const startedAt = Date.now() - elapsedRef.current;
    const id = setInterval(() => {
      elapsedRef.current = Date.now() - startedAt;
      setElapsed(elapsedRef.current);
    }, 10);
    return () => clearInterval(id); // stop on Stop / Reset / unmount
  }, [running]);

  function reset() {
    setRunning(false);
    elapsedRef.current = 0;
    setElapsed(0);
    setLaps([]);
  }

  return (
    <div className="grid" style={{ justifyItems: 'center' }}>
      <div className={`s3-clock ${running ? 'on' : ''}`} role="timer">{format(elapsed)}</div>
      <div className="row">
        <button className="btn primary" disabled={running} onClick={() => setRunning(true)}>▶ Start</button>
        <button className="btn" disabled={!running} onClick={() => setRunning(false)}>⏸ Stop</button>
        <button className="btn" disabled={!running} onClick={() => setLaps((l) => [elapsedRef.current, ...l])}>⚑ Lap</button>
        <button className="btn danger" onClick={reset}>↺ Reset</button>
      </div>
      {laps.length > 0 && (
        <ol className="s3-laps">
          {laps.map((l, i) => <li key={laps.length - i}><span className="muted">Lap {laps.length - i}</span><strong>{format(l)}</strong></li>)}
        </ol>
      )}
    </div>
  );
}

/* ---------- code shown under each exercise ---------- */
const CODE = {
  1: `function TitleEditor() {
  const [text, setText] = useState('');

  useEffect(() => {
    document.title = text || 'WebPro';
    return () => { document.title = 'WebPro'; };
  }, [text]);

  return (
    <input value={text} onChange={e => setText(e.target.value)}
      placeholder="Type to change tab title…" />
  );
}`,
  2: `function UserProfile() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchUser() {            // async lives INSIDE the effect
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
        if (!res.ok) throw new Error('Failed to fetch');
        setUser(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  return <div><h2>{user.name}</h2><p>{user.email}</p></div>;
}`,
  3: `function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);        // cleanup: stop the timer
  }, [running]);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning(true)}>Start</button>
      <button onClick={() => setRunning(false)}>Stop</button>
      <button onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button>
    </div>
  );
}`,
};

const EXERCISES = [
  { id: 1, title: 'Page Title Sync', icon: '🏷️', Comp: TitleEditor,
    task: 'Build a text input whose value updates document.title. Revert the title to “WebPro” on unmount using cleanup.' },
  { id: 2, title: 'Fetch a User', icon: '📡', Comp: UserProfile,
    task: 'Fetch https://jsonplaceholder.typicode.com/users/1, display the name and email, show “Loading…” while fetching, and handle errors.' },
  { id: 3, title: 'Stopwatch', icon: '⏱️', Comp: Stopwatch,
    task: 'Build a stopwatch with Start, Stop and Reset buttons. Use setInterval inside useEffect and clean it up correctly.' },
];

const OBJECTIVES = [
  'Explain what a side effect is and why it needs special handling',
  'Use the dependency array to control when effects run',
  'Write cleanup functions to prevent memory leaks',
  'Fetch data from an API inside useEffect',
  'Avoid the infinite loop trap',
];

const DEP_TABLE = [
  ['useEffect(fn)', 'After every render', 'Usually a bug'],
  ['useEffect(fn, [])', 'Once, after the first render', 'Fetch on load, subscribe, start timer'],
  ['useEffect(fn, [a, b])', 'First render + whenever a or b changes', 'Re-fetch when a prop changes'],
];

/* ---------- page ---------- */
export default function App() {
  const [active, setActive] = useState(1);
  const [showCode, setShowCode] = useState(false);
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sg-objectives')) ?? []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('sg-objectives', JSON.stringify(done));
  }, [done]);

  useEffect(() => {
    document.title = 'Task 3 · Study Guide Exercises';
  }, []);

  const ex = EXERCISES.find((e) => e.id === active);
  const toggle = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  const pct = Math.round((done.length / OBJECTIVES.length) * 100);

  return (
    <>
      <Nav current={3} />
      <main className="container">
        <div className="page-head">
          <div className="eyebrow">Task 3 · Study guide</div>
          <h1>useEffect: Exercises & Key Concepts</h1>
          <p>Three practice exercises from the study guide, each running live with its solution code. Track your learning objectives as you go.</p>
        </div>

        <div className="grid cols-2">
          {/* objectives */}
          <section className="card">
            <div className="row"><h2 style={{ margin: 0 }}>🎯 Learning objectives</h2><span className="spacer" /><span className="badge accent">{pct}%</span></div>
            <div className="s3-bar"><i style={{ width: `${pct}%` }} /></div>
            <ul className="s3-objectives">
              {OBJECTIVES.map((o, i) => (
                <li key={o}>
                  <label>
                    <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
                    <span className={done.includes(i) ? 'done' : ''}>{o}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* dependency table */}
          <section className="card">
            <h2>🧭 Dependency array cheat sheet</h2>
            <table className="s3-table">
              <thead><tr><th>Form</th><th>Runs</th><th>Typical use</th></tr></thead>
              <tbody>
                {DEP_TABLE.map(([a, b, c]) => <tr key={a}><td><code>{a}</code></td><td>{b}</td><td className="muted">{c}</td></tr>)}
              </tbody>
            </table>
            <p className="muted mt" style={{ marginBottom: 0, fontSize: '.88rem' }}>
              Lifecycle mapping: <code>componentDidMount</code> → <code>[]</code> · <code>componentDidUpdate</code> → <code>[dep]</code> · <code>componentWillUnmount</code> → the cleanup return.
            </p>
          </section>
        </div>

        {/* exercises */}
        <div className="tabs mt" role="tablist">
          {EXERCISES.map((e) => (
            <button key={e.id} role="tab" aria-selected={e.id === active} className={`tab ${e.id === active ? 'active' : ''}`}
              onClick={() => { setActive(e.id); setShowCode(false); }}>
              {e.icon} Exercise {e.id}: {e.title}
            </button>
          ))}
        </div>

        <section className="card mt" key={ex.id}>
          <div className="eyebrow">Exercise {ex.id}</div>
          <h2>{ex.title}</h2>
          <div className="alert info" style={{ marginBottom: 16 }}><span>📝</span><div><strong>Task:</strong> {ex.task}</div></div>
          <ex.Comp />
          <div className="row mt">
            <button className="btn sm" onClick={() => setShowCode((s) => !s)}>{showCode ? 'Hide' : 'Show'} solution code</button>
          </div>
          {showCode && <pre className="code mt pop"><code>{CODE[ex.id]}</code></pre>}
        </section>

        {/* infinite loop trap */}
        <section className="card mt">
          <h2>♾️ The infinite loop trap</h2>
          <p className="muted">If an effect sets state that is also in its own dependency array, it re-runs forever. Two fixes: drop the dependency, or use the functional update form.</p>
          <div className="grid cols-2">
            <pre className="code"><code>{`// ❌ runs forever
useEffect(() => {
  setCount(count + 1);
}, [count]);`}</code></pre>
            <pre className="code"><code>{`// ✅ functional update, runs once
useEffect(() => {
  setCount(c => c + 1);
}, []);`}</code></pre>
          </div>
        </section>
      </main>
    </>
  );
}
