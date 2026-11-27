import React, { useState, useEffect, useRef } from 'react';
import { QUIZ } from './quizData.js';

const SECONDS = 20;
const L = ['A', 'B', 'C', 'D', 'E'];

function OptText({ text, code }) { return code ? <code>{text}</code> : <span>{text}</span>; }

function Question({ q, picked, onPick, showWhy = true, locked }) {
  const answered = picked !== null && picked !== undefined;
  return (
    <div>
      <div className="eyebrow">Quiz {q.id} / {QUIZ.length} · {q.topic}</div>
      <h2 style={{ fontSize: '1.3rem', margin: '8px 0 6px' }}>{q.q}</h2>
      <div role="group" aria-label="Answer options">
        {q.opts.map(([text, code, why], i) => {
          const cls = answered || locked ? (i === q.correct ? ' right' : i === picked ? ' wrong' : '') : '';
          return (
            <button key={i} className={'opt' + cls} disabled={answered || locked} onClick={() => onPick(i)}>
              <span className="L">{L[i]}</span>
              <span>
                <OptText text={text} code={code} />
                {(answered || locked) && showWhy && (i === q.correct || i === picked) && <span className="why">{why}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- SPRINT: 8 questions, 20 s each, streak + time bonus ---------------- */
function Sprint() {
  const [state, setState] = useState('ready');  // ready | play | done
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);   // null = open, -1 = timed out
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [log, setLog] = useState([]);
  const [left, setLeft] = useState(SECONDS);
  const startRef = useRef(0);

  const q = QUIZ[idx];
  const answered = picked !== null;

  const settle = (choice, remaining) => {
    if (picked !== null) return;
    setPicked(choice);
    const right = choice === q.correct;
    const bonus = right ? Math.round((remaining / SECONDS) * 50) : 0;
    setScore((s) => s + (right ? 100 + bonus + streak * 10 : 0));
    setStreak((s) => (right ? s + 1 : 0));
    if (right) setBest((b) => Math.max(b, streak + 1));
    setLog((l) => [...l, { id: q.id, right, choice }]);
  };

  useEffect(() => {
    if (state !== 'play' || answered) return;
    startRef.current = performance.now();
    setLeft(SECONDS);
    const t = setInterval(() => {
      const rem = Math.max(0, SECONDS - (performance.now() - startRef.current) / 1000);
      setLeft(rem);
      if (rem <= 0) { clearInterval(t); settle(-1, 0); }
    }, 100);
    return () => clearInterval(t);
  }, [state, idx, answered]);   // eslint-disable-line

  const start = () => { setState('play'); setIdx(0); setPicked(null); setScore(0); setStreak(0); setBest(0); setLog([]); };
  const next = () => { if (idx + 1 >= QUIZ.length) setState('done'); else { setIdx(idx + 1); setPicked(null); } };

  if (state === 'ready') {
    return (
      <div className="panel stack" style={{ textAlign: 'center' }}>
        <div className="eyebrow">Monday sprint quiz</div>
        <h2 style={{ fontSize: '1.8rem' }}>8 questions · {SECONDS}s each</h2>
        <p className="sub" style={{ margin: '0 auto', maxWidth: 480 }}>Correct answers score 100 points plus a speed bonus and a streak bonus. Wrong or late answers break your streak.</p>
        <div><button className="btn primary" onClick={start}>Launch sprint →</button></div>
      </div>
    );
  }
  if (state === 'done') {
    const right = log.filter((x) => x.right).length;
    const grade = right === 8 ? 'FLAWLESS' : right >= 6 ? 'SHARP' : right >= 4 ? 'WARMING UP' : 'REBOOT & RETRY';
    return (
      <div className="panel stack" style={{ textAlign: 'center' }}>
        <div className="eyebrow">Sprint complete · {grade}</div>
        <div className="big">{score}</div>
        <p className="sub" style={{ margin: 0 }}>{right} / {QUIZ.length} correct · best streak {best}</p>
        <div className="chips" style={{ justifyContent: 'center' }}>
          {log.map((x) => <span key={x.id} className="chip static" style={x.right ? { color: 'var(--lime)', borderColor: 'rgba(125,255,178,.4)' } : { color: 'var(--pink)', borderColor: 'rgba(255,77,141,.4)' }}>Q{x.id} {x.right ? '✓' : '✗'}</span>)}
        </div>
        <div><button className="btn primary" onClick={start}>Run again</button></div>
      </div>
    );
  }
  return (
    <div className="panel stack">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <span className="badge hot">score {score}</span>
        <span className="badge">🔥 streak {streak}</span>
        <span className="badge">{Math.ceil(left)}s</span>
      </div>
      <div className="timer" role="progressbar" aria-valuemin="0" aria-valuemax={SECONDS} aria-valuenow={Math.ceil(left)} aria-label="Time left">
        <i style={{ width: (left / SECONDS) * 100 + '%', transformOrigin: 'left' }} />
      </div>
      <Question q={q} picked={picked} onPick={(i) => settle(i, left)} />
      {answered && (
        <div className="actions" style={{ marginTop: 6 }}>
          <span className={'status ' + (picked === q.correct ? 'success' : 'error')}>{picked === -1 ? 'time up' : picked === q.correct ? 'correct' : 'incorrect'}</span>
          <button className="btn primary" onClick={next}>{idx + 1 >= QUIZ.length ? 'See results' : 'Next →'}</button>
        </div>
      )}
    </div>
  );
}

/* ---------------- MASTERY: missed questions come back until every one is answered right ---------------- */
function Mastery() {
  const fresh = () => ({ queue: QUIZ.map((q) => q.id), mastered: [], tries: 0, picked: null });
  const [s, setS] = useState(fresh);
  const q = QUIZ.find((x) => x.id === s.queue[0]);
  const done = s.queue.length === 0;

  const pick = (i) => {
    if (s.picked !== null) return;
    setS((p) => ({ ...p, picked: i, tries: p.tries + 1 }));
  };
  const advance = () => {
    setS((p) => {
      const [head, ...rest] = p.queue;
      const right = p.picked === QUIZ.find((x) => x.id === head).correct;
      return right
        ? { ...p, queue: rest, mastered: [...p.mastered, head], picked: null }
        : { ...p, queue: [...rest.slice(0, 2), head, ...rest.slice(2)], picked: null }; // comes back in 3 questions
    });
  };

  const pct = (s.mastered.length / QUIZ.length) * 100;
  return (
    <div className="panel stack">
      <div className="row" style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <span className="eyebrow" style={{ flex: 'none' }}>Mastery {s.mastered.length}/{QUIZ.length}</span>
        <div className="bar" style={{ flex: 1 }}><i style={{ width: pct + '%' }} /></div>
        <span className="badge">{s.tries} attempts</span>
      </div>
      {done ? (
        <div style={{ textAlign: 'center' }} className="stack">
          <div className="big">MASTERED</div>
          <p className="sub" style={{ margin: 0 }}>All 8 concepts cleared in {s.tries} attempts{s.tries === 8 ? ' — perfect run!' : '.'}</p>
          <div><button className="btn primary" onClick={() => setS(fresh())}>Train again</button></div>
        </div>
      ) : (
        <>
          <Question q={q} picked={s.picked} onPick={pick} />
          {s.picked !== null && (
            <div className="actions" style={{ marginTop: 6 }}>
              <span className={'status ' + (s.picked === q.correct ? 'success' : 'error')}>{s.picked === q.correct ? 'mastered ✓' : 'returns in 3 questions'}</span>
              <button className="btn primary" onClick={advance}>Continue →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------- REVIEW: every slide quiz with its answer + reasoning ---------------- */
function Review() {
  const [open, setOpen] = useState(1);
  return (
    <div className="stack">
      {QUIZ.map((q) => (
        <div key={q.id} className="panel" style={{ padding: 18 }}>
          <button className="btn" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
                  aria-expanded={open === q.id} onClick={() => setOpen(open === q.id ? 0 : q.id)}>
            <span><span style={{ color: 'var(--cyan)', fontFamily: 'var(--mono)' }}>Q{q.id}</span> &nbsp;{q.q}</span>
            <span>{open === q.id ? '−' : '+'}</span>
          </button>
          {open === q.id && <div style={{ marginTop: 14 }}><Question q={q} picked={q.correct} locked onPick={() => {}} /></div>}
        </div>
      ))}
      <div className="panel">
        <h2>Answers at a glance</h2>
        <div className="chips" style={{ marginTop: 10 }}>
          {QUIZ.map((q) => <span key={q.id} className="chip static">Q{q.id} → {L[q.correct]} · {q.topic}</span>)}
        </div>
      </div>
    </div>
  );
}

export default function QuizApp() {
  const [mode, setMode] = useState('sprint');
  const modes = [['sprint', '⚡ Sprint'], ['mastery', '🎯 Mastery'], ['review', '📖 Slide quizzes']];
  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div className="tabs" role="tablist">
        {modes.map(([k, l]) => <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>{l}</button>)}
      </div>
      {mode === 'sprint' && <Sprint />}
      {mode === 'mastery' && <Mastery />}
      {mode === 'review' && <Review />}
    </div>
  );
}
