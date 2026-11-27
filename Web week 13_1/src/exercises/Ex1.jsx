import React, { useState } from 'react';

// EXERCISE 1 — Controlled input: "Signal Composer"
// value + onChange, live character count, live transform, programmatic clear.
export default function Ex1() {
  const LIMIT = 80;
  const [text, setText] = useState('');
  const [shout, setShout] = useState(false);

  const handleChange = (e) => {
    const v = e.target.value;
    setText(shout ? v.toUpperCase() : v);          // transform live: only possible when controlled
  };
  const remaining = LIMIT - text.length;

  return (
    <div className="stack">
      <input
        type="text"
        value={text}                                // React owns the value
        onChange={handleChange}
        placeholder="Transmit a message…"
        aria-label="Message"
      />
      <div className="bar"><i style={{ width: Math.min(100, (text.length / LIMIT) * 100) + '%', background: remaining < 0 ? 'var(--pink)' : undefined }} /></div>
      <div className="row" style={{ alignItems: 'center' }}>
        <span className={'count' + (remaining < 0 ? ' over' : '')}>{text.length} / {LIMIT} characters</span>
        <label className="check">
          <input type="checkbox" checked={shout} onChange={(e) => setShout(e.target.checked)} />
          UPPERCASE mode
        </label>
        <button className="btn sm" onClick={() => setText('')} disabled={!text}>Clear</button>
      </div>
      <p className="hint">Echo: “{text}”</p>
    </div>
  );
}
