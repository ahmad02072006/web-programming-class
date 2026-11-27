import React, { useState, useRef } from 'react';

// Same text box, two owners. Left: the DOM owns the value. Right: React state owns it.
export default function ControlledVsUncontrolled() {
  const domRef = useRef(null);
  const [snapshot, setSnapshot] = useState('');
  const [value, setValue] = useState('');

  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <div className="card stack">
        <div className="eyebrow">Uncontrolled · the DOM owns it</div>
        <input ref={domRef} type="text" defaultValue="" placeholder="type here…" aria-label="Uncontrolled input" />
        <button className="btn sm" onClick={() => setSnapshot(domRef.current.value)}>Read DOM value</button>
        <p className="hint">React only learns the value when you ask: <b style={{ color: 'var(--cyan)' }}>“{snapshot}”</b></p>
      </div>
      <div className="card stack">
        <div className="eyebrow">Controlled · React owns it</div>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="type here…" aria-label="Controlled input" />
        <button className="btn sm" onClick={() => setValue(value.toUpperCase())}>Uppercase it</button>
        <p className="hint">React always knows: <b style={{ color: 'var(--cyan)' }}>“{value}”</b> ({value.length} chars)</p>
      </div>
    </div>
  );
}
