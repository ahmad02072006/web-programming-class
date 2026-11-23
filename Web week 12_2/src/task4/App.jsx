import { useState, useEffect, useRef, useCallback } from 'react';
import Nav from '../shared/Nav.jsx';

/* =====================================================================
   Effects Lifecycle & Patterns Lab
   Six interactive labs that make the invisible visible:
   1 Lifecycle · 2 Dependencies · 3 Cleanup · 4 Race condition
   5 Persistence & title · 6 Gotchas
   NOTE: <StrictMode> is intentionally NOT used on this page so the logs are
   clean. In development StrictMode runs every effect twice (mount → cleanup → mount).
   ===================================================================== */

const time = () => new Date().toLocaleTimeString('en-GB', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0');

/* ---------- tiny shared widgets ---------- */
function Lab({ title, children, concept }) {
  return (
    <section className="card pop">
      <h2>{title}</h2>
      {concept && <p className="muted">{concept}</p>}
      {children}
    </section>
  );
}

function LogPanel({ logs, onClear }) {
  const ref = useRef(null);
  // effect that syncs with the DOM: keep the newest line in view
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);
  return (
    <div>
      <div className="row" style={{ marginBottom: 6 }}>
        <strong style={{ fontSize: '.85rem' }}>Console</strong><span className="spacer" />
        <button className="chip" onClick={onClear}>clear</button>
      </div>
      <div className="l4-log" ref={ref} role="log">
        {logs.length === 0 && <span className="muted">Nothing yet — interact with the lab…</span>}
        {logs.map((l) => (
          <div key={l.id} className={`l4-line ${l.type}`}><time>{l.t}</time><b>{l.type}</b><span>{l.msg}</span></div>
        ))}
      </div>
    </div>
  );
}

function useLogs() {
  const [logs, setLogs] = useState([]);
  const idRef = useRef(0);
  const add = useCallback((type, msg) => {
    setLogs((prev) => [...prev.slice(-39), { id: idRef.current++, t: time(), type, msg }]);
  }, []);
  const clear = useCallback(() => setLogs([]), []);
  return [logs, add, clear];
}

/* =====================================================================
   LAB 1 · Lifecycle: mount → update → cleanup → unmount
   ===================================================================== */
function Probe({ value, log }) {
  useEffect(() => {
    log('effect', `effect runs   (value = ${value})`);
    return () => log('cleanup', `cleanup runs  (value was ${value})`);
  }, [value, log]);

  return <div className="l4-probe">Probe component · <strong>value = {value}</strong></div>;
}

function LifecycleLab() {
  const [logs, log, clear] = useLogs();
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(1);

  return (
    <Lab title="1 · The life of an effect"
      concept="Effect = after render & paint. On an update React runs the OLD cleanup first, then the NEW effect. On unmount only the cleanup runs.">
      <div className="grid cols-2">
        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="row">
            <button className="btn primary" onClick={() => { setMounted((m) => !m); log('info', mounted ? '— unmount —' : '— mount —'); }}>
              {mounted ? 'Unmount Probe' : 'Mount Probe'}
            </button>
            <button className="btn" onClick={() => setValue((v) => v + 1)}>value + 1</button>
          </div>
          {mounted ? <Probe value={value} log={log} /> : <div className="l4-probe off">Probe is not mounted</div>}
          <div className="l4-legend">
            <div><span className="dot mount" />MOUNT → render → paint → <b>effect</b></div>
            <div><span className="dot update" />UPDATE → re-render → <b>cleanup(old)</b> → <b>effect(new)</b></div>
            <div><span className="dot unmount" />UNMOUNT → <b>cleanup</b></div>
          </div>
        </div>
        <LogPanel logs={logs} onClear={clear} />
      </div>
    </Lab>
  );
}

/* =====================================================================
   LAB 2 · The three dependency patterns
   Counters are written straight to the DOM from effects (no extra state),
   otherwise updating state would itself cause more renders.
   ===================================================================== */
function PatternCard({ name, code, deps, val }) {
  const effectRef = useRef(0);
  const renderRef = useRef(0);
  const effectEl = useRef(null);
  const renderEl = useRef(null);

  // pattern under test
  useEffect(() => {
    effectRef.current += 1;
    if (effectEl.current) effectEl.current.textContent = effectRef.current;
  }, deps === 'once' ? [] : deps === 'val' ? [val] : undefined); // eslint-disable-line react-hooks/exhaustive-deps

  // no deps => runs after EVERY render, so it counts renders
  useEffect(() => {
    renderRef.current += 1;
    if (renderEl.current) renderEl.current.textContent = renderRef.current;
  });

  return (
    <div className="l4-pattern">
      <code>{code}</code>
      <h3>{name}</h3>
      <div className="l4-counters">
        <div><span>renders</span><strong ref={renderEl}>0</strong></div>
        <div className="hot"><span>effect runs</span><strong ref={effectEl}>0</strong></div>
      </div>
    </div>
  );
}

function DependencyLab() {
  const [val, setVal] = useState(0);
  const [, setTick] = useState(0);

  return (
    <Lab title="2 · The three dependency patterns"
      concept="Click “Change val” and “Unrelated re-render” and watch which effect counters move. [] ignores everything, [val] only reacts to val, and no array reacts to every render.">
      <div className="row">
        <button className="btn primary" onClick={() => setVal((v) => v + 1)}>Change val (now {val})</button>
        <button className="btn" onClick={() => setTick((t) => t + 1)}>Unrelated re-render</button>
      </div>
      <div className="grid cols-3 mt">
        <PatternCard name="Runs once" code="useEffect(fn, [])" deps="once" val={val} />
        <PatternCard name="Runs when val changes" code="useEffect(fn, [val])" deps="val" val={val} />
        <PatternCard name="Runs every render" code="useEffect(fn)" deps="every" val={val} />
      </div>
    </Lab>
  );
}

/* =====================================================================
   LAB 3 · Cleanup: timers (with a deliberately leaky copy)
   ===================================================================== */
const leakStore = { cleanActive: 0, leakyActive: 0, leakyTicks: 0, subs: new Set() };
const notify = () => leakStore.subs.forEach((f) => f());

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    leakStore.cleanActive += 1; notify();
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(id); // ✅ cleanup
      leakStore.cleanActive -= 1; notify();
    };
  }, []);
  return <div className="l4-clock ok">{now.toLocaleTimeString('en-GB')}<small>with cleanup</small></div>;
}

function LeakyClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    // ❌ no cleanup. (Demo safety: it stops itself after 10 ticks.)
    leakStore.leakyActive += 1; notify();
    let ticks = 0;
    const id = setInterval(() => {
      leakStore.leakyTicks += 1; notify();
      setNow(new Date()); // still called after unmount
      if (++ticks >= 10) { clearInterval(id); leakStore.leakyActive -= 1; notify(); }
    }, 1000);
  }, []);
  return <div className="l4-clock bad">{now.toLocaleTimeString('en-GB')}<small>NO cleanup</small></div>;
}

function CleanupLab() {
  const [showClean, setShowClean] = useState(true);
  const [showLeaky, setShowLeaky] = useState(false);
  const [stats, setStats] = useState({ ...leakStore });

  // subscribe to the store; cleanup = unsubscribe (another classic effect)
  useEffect(() => {
    const sync = () => setStats({ cleanActive: leakStore.cleanActive, leakyActive: leakStore.leakyActive, leakyTicks: leakStore.leakyTicks });
    leakStore.subs.add(sync);
    sync();
    return () => leakStore.subs.delete(sync);
  }, []);

  return (
    <Lab title="3 · Cleanup: stop what you started"
      concept="Timers live in the browser, not in React. Unmount the leaky clock and see its interval keep ticking in the background (a memory leak); the clean one stops instantly.">
      <div className="grid cols-2">
        <div className="grid">
          <div className="row">
            <button className="btn primary" onClick={() => setShowClean((s) => !s)}>{showClean ? 'Unmount' : 'Mount'} LiveClock</button>
          </div>
          {showClean ? <LiveClock /> : <div className="l4-clock off">unmounted</div>}
        </div>
        <div className="grid">
          <div className="row">
            <button className="btn danger" onClick={() => setShowLeaky((s) => !s)}>{showLeaky ? 'Unmount' : 'Mount'} LeakyClock</button>
          </div>
          {showLeaky ? <LeakyClock /> : <div className="l4-clock off">unmounted</div>}
        </div>
      </div>
      <div className="l4-stats mt">
        <div><span>Active timers (with cleanup)</span><strong className={stats.cleanActive ? 'ok' : ''}>{stats.cleanActive}</strong></div>
        <div><span>Zombie timers (no cleanup)</span><strong className={stats.leakyActive ? 'bad' : ''}>{stats.leakyActive}</strong></div>
        <div><span>Total leaky ticks</span><strong>{stats.leakyTicks}</strong></div>
      </div>
      <p className="muted" style={{ fontSize: '.85rem', margin: '10px 0 0' }}>
        Try: mount the leaky clock → unmount it → the zombie counter stays at 1 and ticks keep growing until its 10-tick safety stop.
      </p>
    </Lab>
  );
}

/* =====================================================================
   LAB 4 · Race condition & AbortController (simulated, no rate limits)
   ===================================================================== */
// Fake network: SHORT queries are SLOW, so older requests can arrive last.
function fakeSearch(query, signal) {
  const delay = Math.max(250, 1500 - query.length * 350) + Math.random() * 150;
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => resolve(`Results for “${query}”`), delay);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

function RaceLab() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [useAbort, setUseAbort] = useState(false);
  const [logs, log, clear] = useLogs();

  useEffect(() => {
    if (!query) { setResult(null); return; }
    const controller = new AbortController();
    log('effect', `→ request “${query}”`);

    fakeSearch(query, useAbort ? controller.signal : undefined)
      .then((r) => { setResult(r); log('info', `← response “${query}” arrived`); })
      .catch((err) => { if (err.name === 'AbortError') log('cleanup', `✕ aborted “${query}”`); });

    return () => { if (useAbort) controller.abort(); };
  }, [query, useAbort, log]);

  const stale = result && query && result !== `Results for “${query}”`;

  return (
    <Lab title="4 · Race condition: out-of-order responses"
      concept="Type “abc” quickly. Short queries are slow here, so without abort the response for “a” arrives LAST and overwrites the correct one. The cleanup of the previous run fixes it.">
      <div className="row">
        <input className="input" style={{ flex: 1, minWidth: 200 }} placeholder="Type a few letters fast…" value={query}
          onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
        <label className="row" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={useAbort} onChange={(e) => setUseAbort(e.target.checked)} />
          <strong>Abort previous request</strong>
        </label>
      </div>
      <div className="grid cols-2 mt">
        <div className="grid" style={{ alignContent: 'start' }}>
          <div className={`l4-result ${stale ? 'stale' : result ? 'fresh' : ''}`}>
            <div className="muted" style={{ fontSize: '.8rem' }}>UI shows</div>
            <strong>{result ?? '—'}</strong>
            {stale && <span className="badge err">⚠ STALE: you typed “{query}”</span>}
            {result && !stale && <span className="badge ok">✓ matches input</span>}
          </div>
          <p className="muted" style={{ fontSize: '.85rem', margin: 0 }}>
            Mode: <strong>{useAbort ? 'cleanup aborts the previous request ✅' : 'no cleanup ❌ (bug)'}</strong>
          </p>
        </div>
        <LogPanel logs={logs} onClear={clear} />
      </div>
    </Lab>
  );
}

/* =====================================================================
   LAB 5 · Persistence (localStorage) + document.title
   ===================================================================== */
function PersistLab() {
  // lazy initializer: read once
  const [theme, setTheme] = useState(() => localStorage.getItem('lab-theme') || 'light');
  const [unread, setUnread] = useState(3);

  // write whenever theme changes
  useEffect(() => {
    localStorage.setItem('lab-theme', theme);
  }, [theme]);

  // title follows the count; restore on unmount
  useEffect(() => {
    document.title = unread ? `Inbox (${unread}) · Effects Lab` : 'Inbox · Effects Lab';
    return () => { document.title = 'Task 4 · Effects Lifecycle & Patterns Lab'; };
  }, [unread]);

  return (
    <Lab title="5 · Sync with the outside world: localStorage & document.title"
      concept="Reading uses a lazy useState initializer (runs once). Writing is an effect that depends on [theme]. Reload the page: your choice survives.">
      <div className="grid cols-2">
        <div className="l4-preview" data-theme={theme}>
          <div className="l4-preview-inner">
            <div className="muted" style={{ fontSize: '.8rem' }}>Scoped preview · key <code>lab-theme</code></div>
            <h3>Current theme: {theme}</h3>
            <button className="btn primary" onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>Toggle theme</button>
            <pre className="code" style={{ marginTop: 12, fontSize: '.75rem' }}>{`localStorage['lab-theme'] = '${theme}'`}</pre>
          </div>
        </div>
        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="l4-inbox">
            <div style={{ fontSize: '2.4rem' }}>📬</div>
            <div><strong style={{ fontSize: '2rem' }}>{unread}</strong> <span className="muted">unread messages</span></div>
          </div>
          <div className="row">
            <button className="btn primary" onClick={() => setUnread((n) => n + 1)}>+ New message</button>
            <button className="btn" onClick={() => setUnread(0)}>Mark all read</button>
          </div>
          <p className="muted" style={{ fontSize: '.85rem', margin: 0 }}>Look at your browser tab: it reads <code>Inbox ({unread})</code>.</p>
        </div>
      </div>
    </Lab>
  );
}

/* =====================================================================
   LAB 6 · Gotchas: infinite loop (guarded) and “you might not need an effect”
   ===================================================================== */
const MAX_RUNS = 8;

function BadLoop() {
  const [count, setCount] = useState(0);
  const runs = useRef(0);
  useEffect(() => {
    runs.current += 1;
    if (runs.current > MAX_RUNS) return; // GUARD so the demo can't freeze your tab
    setCount(count + 1);                  // ❌ sets state that is also a dependency
  }, [count]);
  return (
    <div className="l4-loop bad">
      <code>{'useEffect(() => setCount(count + 1), [count])'}</code>
      <strong>count = {count}</strong>
      <span className="muted">effect ran {Math.min(runs.current, MAX_RUNS)}× — would be infinite without the guard</span>
    </div>
  );
}

function FixedOnce() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount((c) => c + 1); // ✅ functional update, no dependency on count
  }, []);
  return (
    <div className="l4-loop ok">
      <code>{'useEffect(() => setCount(c => c + 1), [])'}</code>
      <strong>count = {count}</strong>
      <span className="muted">runs exactly once</span>
    </div>
  );
}

function RenderBadge({ label }) {
  const n = useRef(0);
  const el = useRef(null);
  useEffect(() => { n.current += 1; if (el.current) el.current.textContent = n.current; }); // every commit
  return <span className="badge accent">{label}: <b ref={el}>0</b></span>;
}

function WithEffect() {
  const [first, setFirst] = useState('Ada');
  const [last, setLast] = useState('Lovelace');
  const [fullName, setFullName] = useState('Ada Lovelace'); // ❌ redundant state
  useEffect(() => { setFullName(first + ' ' + last); }, [first, last]);
  return (
    <div className="l4-derived bad">
      <h3>❌ With effect + extra state</h3>
      <div className="row"><input className="input" value={first} onChange={(e) => setFirst(e.target.value)} />
        <input className="input" value={last} onChange={(e) => setLast(e.target.value)} /></div>
      <p>Full name: <strong>{fullName}</strong></p>
      <RenderBadge label="commits" />
    </div>
  );
}

function Derived() {
  const [first, setFirst] = useState('Ada');
  const [last, setLast] = useState('Lovelace');
  const fullName = first + ' ' + last; // ✅ computed while rendering
  return (
    <div className="l4-derived ok">
      <h3>✅ Derived during render</h3>
      <div className="row"><input className="input" value={first} onChange={(e) => setFirst(e.target.value)} />
        <input className="input" value={last} onChange={(e) => setLast(e.target.value)} /></div>
      <p>Full name: <strong>{fullName}</strong></p>
      <RenderBadge label="commits" />
    </div>
  );
}

function GotchaLab() {
  const [round, setRound] = useState(0);
  return (
    <Lab title="6 · Gotchas: infinite loops & unnecessary effects"
      concept="An effect that changes its own dependency loops forever. And if a value can be calculated from props/state, it needs neither extra state nor an effect: type in both forms and compare the commit counters.">
      <div className="row"><button className="btn" onClick={() => setRound((r) => r + 1)}>↺ Re-run loop demo</button></div>
      <div className="grid cols-2 mt" key={round}>
        <BadLoop />
        <FixedOnce />
      </div>
      <div className="grid cols-2 mt">
        <WithEffect />
        <Derived />
      </div>
      <div className="alert info mt"><span>💡</span><div>Decision guide: response to a user event → <b>event handler</b> · calculable from props/state → <b>compute while rendering</b> · syncing with something outside React → <b>useEffect</b>.</div></div>
    </Lab>
  );
}

/* =====================================================================
   PAGE
   ===================================================================== */
const LABS = [
  { id: 'life', label: '1 Lifecycle', C: LifecycleLab },
  { id: 'deps', label: '2 Dependencies', C: DependencyLab },
  { id: 'cleanup', label: '3 Cleanup', C: CleanupLab },
  { id: 'race', label: '4 Race condition', C: RaceLab },
  { id: 'persist', label: '5 Persistence', C: PersistLab },
  { id: 'gotchas', label: '6 Gotchas', C: GotchaLab },
];

export default function App() {
  const [active, setActive] = useState(() => sessionStorage.getItem('lab4-tab') || 'life');
  useEffect(() => { sessionStorage.setItem('lab4-tab', active); }, [active]);
  useEffect(() => { document.title = 'Task 4 · Effects Lifecycle & Patterns Lab'; }, []);

  const Current = (LABS.find((l) => l.id === active) ?? LABS[0]).C;

  return (
    <>
      <Nav current={4} />
      <main className="container">
        <div className="page-head">
          <div className="eyebrow">Task 4 · Lab</div>
          <h1>Effects Lifecycle & Patterns Lab</h1>
          <p>Six hands-on experiments covering mount / update / unmount, dependency arrays, cleanup, race conditions, persistence and common mistakes.</p>
        </div>
        <div className="tabs" role="tablist">
          {LABS.map((l) => (
            <button key={l.id} role="tab" aria-selected={l.id === active} className={`tab ${l.id === active ? 'active' : ''}`} onClick={() => setActive(l.id)}>{l.label}</button>
          ))}
        </div>
        <div className="mt"><Current /></div>
      </main>
    </>
  );
}
