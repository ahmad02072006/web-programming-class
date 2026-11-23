import { useState, useEffect, useMemo } from 'react';
import Nav from '../shared/Nav.jsx';
import { QUIZ, TAKEAWAYS, CHEAT, FLASHCARDS } from './quizData.js';

const SECONDS_PER_Q = 30;
const KEYS = Object.keys(QUIZ[0].options); // ['A'..'E']

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

/* ===================================================================
   SPRINT QUIZ
   =================================================================== */
function SprintQuiz({ onBest }) {
  const [phase, setPhase] = useState('start'); // start | play | done
  const [timed, setTimed] = useState(true);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null); // letter | 'timeout' | null
  const [answers, setAnswers] = useState([]); // [{id, picked, correct}]
  const [left, setLeft] = useState(SECONDS_PER_Q);
  const [total, setTotal] = useState(0);

  const q = QUIZ[index];
  const score = answers.filter((a) => a.correct).length;

  /* Effect: per-question countdown. Cleanup clears the interval whenever the question changes or an answer is locked. */
  useEffect(() => {
    if (phase !== 'play' || !timed || picked) return;
    setLeft(SECONDS_PER_Q);
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timed, index, picked]);

  /* Effect: when the countdown hits 0, lock the question as missed */
  useEffect(() => {
    if (phase === 'play' && timed && !picked && left <= 0) lock('timeout');
  }); // eslint-disable-line react-hooks/exhaustive-deps

  /* Effect: total stopwatch while playing */
  useEffect(() => {
    if (phase !== 'play') return;
    const id = setInterval(() => setTotal((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  /* Effect: keyboard shortcuts A–E, Enter (event listener added on mount, removed in cleanup) */
  useEffect(() => {
    if (phase !== 'play') return;
    function onKey(e) {
      const k = e.key.toUpperCase();
      if (!picked && KEYS.includes(k)) lock(k);
      else if (picked && e.key === 'Enter') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  function start(withTimer) {
    setTimed(withTimer);
    setIndex(0); setPicked(null); setAnswers([]); setTotal(0); setLeft(SECONDS_PER_Q);
    setPhase('play');
  }
  function lock(letter) {
    setPicked(letter);
    setAnswers((a) => [...a, { id: q.id, picked: letter, correct: letter === q.answer }]);
  }
  function next() {
    if (index + 1 < QUIZ.length) { setIndex(index + 1); setPicked(null); setLeft(SECONDS_PER_Q); }
    else {
      setPhase('done');
      onBest(answers.filter((a) => a.correct).length, total);
    }
  }

  /* ---------- views ---------- */
  if (phase === 'start') {
    return (
      <section className="card q5-start pop">
        <div style={{ fontSize: '3rem' }}>⚡</div>
        <h2>Sprint Quiz · useEffect</h2>
        <p className="muted">8 questions from today’s lecture. Instant feedback with reasoning for every option. Use keys <kbd>A</kbd>–<kbd>E</kbd> to answer and <kbd>Enter</kbd> for next.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn primary" onClick={() => start(true)}>⏱ Start timed sprint ({SECONDS_PER_Q}s / question)</button>
          <button className="btn" onClick={() => start(false)}>Practice mode (no timer)</button>
        </div>
      </section>
    );
  }

  if (phase === 'done') {
    const pct = Math.round((score / QUIZ.length) * 100);
    const grade = pct === 100 ? ['🏆', 'Perfect — effects mastered!'] : pct >= 75 ? ['🎉', 'Great job!'] : pct >= 50 ? ['👍', 'Good start — review the misses'] : ['📚', 'Keep practising — see the Concept Mastery tab'];
    return (
      <section className="card pop">
        <div className="q5-result">
          <div className="q5-ring" style={{ '--p': pct }}><strong>{score}/{QUIZ.length}</strong><span>{pct}%</span></div>
          <div>
            <h2 style={{ margin: 0 }}>{grade[0]} {grade[1]}</h2>
            <p className="muted">Time: {Math.floor(total / 60)}m {total % 60}s · {timed ? 'Timed sprint' : 'Practice mode'}</p>
            <div className="row">
              <button className="btn primary" onClick={() => start(timed)}>↻ Retake</button>
              <button className="btn" onClick={() => setPhase('start')}>Menu</button>
            </div>
          </div>
        </div>
        <h3 className="mt">Review</h3>
        <div className="q5-review">
          {QUIZ.map((item) => {
            const a = answers.find((x) => x.id === item.id);
            return (
              <div key={item.id} className={`q5-review-row ${a?.correct ? 'ok' : 'bad'}`}>
                <span className="q5-mark">{a?.correct ? '✓' : '✗'}</span>
                <div style={{ flex: 1 }}>
                  <strong>Q{item.id} · {item.topic}</strong>
                  <div className="muted" style={{ fontSize: '.85rem' }}>
                    {a?.correct ? `Correct: ${item.answer}` : `You: ${a?.picked === 'timeout' ? 'time out' : a?.picked} · Correct: ${item.answer} — ${item.options[item.answer]}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  const locked = picked !== null;
  return (
    <section className="card pop" key={q.id}>
      <div className="row">
        <span className="badge accent">Question {index + 1} / {QUIZ.length}</span>
        <span className="badge">{q.topic}</span>
        <span className="spacer" />
        {timed && !locked && <span className={`badge ${left <= 10 ? 'err' : 'warn'}`}>⏱ {Math.max(left, 0)}s</span>}
        <span className="badge ok">Score {score}</span>
      </div>
      <div className="q5-progress"><i style={{ width: `${((index + (locked ? 1 : 0)) / QUIZ.length) * 100}%` }} /></div>

      <h2 className="q5-q">{q.q}</h2>

      <div className="q5-options">
        {KEYS.map((k) => {
          const state = !locked ? '' : k === q.answer ? 'right' : k === picked ? 'wrong' : 'dim';
          return (
            <button key={k} className={`q5-opt ${state}`} disabled={locked} onClick={() => lock(k)}>
              <span className="q5-key">{k}</span>
              <span className={q.code ? 'q5-code' : ''}>{q.options[k]}</span>
              {locked && <small>{q.why[k]}</small>}
            </button>
          );
        })}
      </div>

      {locked && (
        <div className="row mt pop">
          <span className={`alert ${picked === q.answer ? 'ok' : 'err'}`} style={{ flex: 1 }}>
            {picked === 'timeout' ? '⌛ Time’s up!' : picked === q.answer ? '✅ Correct!' : `❌ Not quite — the answer is ${q.answer}.`}
          </span>
          <button className="btn primary" onClick={next}>{index + 1 < QUIZ.length ? 'Next →' : 'See results'}</button>
        </div>
      )}
    </section>
  );
}

/* ===================================================================
   CONCEPT MASTERY
   =================================================================== */
function Flashcards({ known, setKnown }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = FLASHCARDS[i];

  const go = (d) => { setFlipped(false); setI((x) => (x + d + FLASHCARDS.length) % FLASHCARDS.length); };
  const mark = () => { setKnown((k) => (k.includes(i) ? k.filter((x) => x !== i) : [...k, i])); };

  return (
    <div>
      <div className="row"><span className="badge accent">Card {i + 1} / {FLASHCARDS.length}</span><span className="spacer" /><span className="badge ok">{known.length} known</span></div>
      <button className={`q5-flip ${flipped ? 'on' : ''}`} onClick={() => setFlipped((f) => !f)} aria-label="Flip card">
        <span className="muted" style={{ fontSize: '.75rem' }}>{flipped ? 'ANSWER' : 'QUESTION · click to flip'}</span>
        <strong>{flipped ? card.a : card.q}</strong>
      </button>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn" onClick={() => go(-1)}>← Prev</button>
        <button className={`btn ${known.includes(i) ? 'primary' : ''}`} onClick={mark}>{known.includes(i) ? '✓ Known' : 'Mark as known'}</button>
        <button className="btn" onClick={() => go(1)}>Next →</button>
      </div>
    </div>
  );
}

function Mastery({ best }) {
  const [known, setKnown] = useState(() => loadJSON('q5-known', []));
  useEffect(() => { localStorage.setItem('q5-known', JSON.stringify(known)); }, [known]);

  const flashPct = Math.round((known.length / FLASHCARDS.length) * 100);
  const quizPct = best ? Math.round((best.score / QUIZ.length) * 100) : 0;
  const mastery = Math.round(flashPct * 0.5 + quizPct * 0.5); // derived value → computed while rendering, no effect!

  return (
    <div className="grid">
      <section className="card q5-mastery">
        <div className="q5-ring" style={{ '--p': mastery }}><strong>{mastery}%</strong><span>mastery</span></div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h2>Concept mastery</h2>
          <p className="muted">50% flashcards known ({known.length}/{FLASHCARDS.length}) + 50% best quiz score ({best ? `${best.score}/${QUIZ.length}` : 'not taken yet'}).</p>
          <div className="q5-progress"><i style={{ width: `${mastery}%` }} /></div>
        </div>
      </section>

      <section className="card">
        <h2>🧠 Flashcards</h2>
        <Flashcards known={known} setKnown={setKnown} />
      </section>

      <section className="card">
        <h2>🔑 5 key takeaways</h2>
        <div className="grid cols-3">
          {TAKEAWAYS.map((t) => (
            <div key={t.n} className="q5-take">
              <span className="q5-num">{t.n}</span>
              <strong>{t.title}</strong>
              <span className="muted">{t.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ overflowX: 'auto' }}>
        <h2>📋 useEffect cheat sheet</h2>
        <table className="q5-table">
          <thead><tr><th>Pattern</th><th>Runs when</th><th>Cleanup runs</th><th>Typical use</th></tr></thead>
          <tbody>
            {CHEAT.map((r) => <tr key={r[0]}><td><code>{r[0]}</code></td><td>{r[1]}</td><td>{r[2]}</td><td className="muted">{r[3]}</td></tr>)}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ overflowX: 'auto' }}>
        <h2>✅ Quiz recap: answers at a glance</h2>
        <table className="q5-table">
          <thead><tr><th>#</th><th>Topic</th><th>Answer</th><th>Key idea</th></tr></thead>
          <tbody>
            {QUIZ.map((q) => (
              <tr key={q.id}><td>{q.id}</td><td>{q.topic}</td><td><span className="badge ok">{q.answer}</span></td><td className="muted">{q.options[q.answer]}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>🚦 When NOT to use useEffect</h2>
        <div className="grid cols-3">
          <div className="q5-take"><strong>Response to a user event?</strong><span className="muted">Use an <b>event handler</b>.</span></div>
          <div className="q5-take"><strong>Can it be calculated from props or state?</strong><span className="muted"><b>Compute while rendering</b>: <code>const fullName = first + ' ' + last</code></span></div>
          <div className="q5-take"><strong>Syncing with something OUTSIDE React?</strong><span className="muted"><b>useEffect</b> is the right tool (fetch, timers, DOM, storage).</span></div>
        </div>
      </section>
    </div>
  );
}

/* ===================================================================
   PAGE
   =================================================================== */
export default function App() {
  const [tab, setTab] = useState('quiz');
  const [best, setBest] = useState(() => loadJSON('q5-best', null));

  useEffect(() => { document.title = 'Task 5 · Sprint Quiz & Concept Mastery'; }, []);

  function recordResult(score, seconds) {
    setBest((prev) => {
      const better = !prev || score > prev.score || (score === prev.score && seconds < prev.seconds);
      const next = better ? { score, seconds } : prev;
      localStorage.setItem('q5-best', JSON.stringify(next));
      return next;
    });
  }

  const bestLabel = useMemo(() => (best ? `Best: ${best.score}/${QUIZ.length} in ${best.seconds}s` : 'No attempts yet'), [best]);

  return (
    <>
      <Nav current={5} />
      <main className="container">
        <div className="page-head">
          <div className="eyebrow">Task 5 · Lecture slides</div>
          <h1>Sprint Quiz & Concept Mastery</h1>
          <p>Eight quiz questions and the key concepts from the “React Effects & useEffect” lecture slides. <span className="badge accent">{bestLabel}</span></p>
        </div>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'quiz'} className={`tab ${tab === 'quiz' ? 'active' : ''}`} onClick={() => setTab('quiz')}>⚡ Sprint Quiz</button>
          <button role="tab" aria-selected={tab === 'mastery'} className={`tab ${tab === 'mastery' ? 'active' : ''}`} onClick={() => setTab('mastery')}>🧠 Concept Mastery</button>
        </div>
        <div className="mt">
          {tab === 'quiz' ? <SprintQuiz onBest={recordResult} /> : <Mastery best={best} />}
        </div>
      </main>
    </>
  );
}
