import React, { useState } from 'react';

/* Five classic mistakes, each with a switch between the BUG and the FIX. */
function Toggle({ fixed, setFixed }) {
  return (
    <div className="pills" role="group" aria-label="Bug or fix">
      <label className="pill"><input type="radio" checked={!fixed} onChange={() => setFixed(false)} /><span>✗ bug</span></label>
      <label className="pill"><input type="radio" checked={fixed} onChange={() => setFixed(true)} /><span>✓ fix</span></label>
    </div>
  );
}

// 1 — missing e.preventDefault() (simulated: we show the reload instead of really reloading)
function Mistake1() {
  const [fixed, setFixed] = useState(false);
  const [text, setText] = useState('');
  const [log, setLog] = useState('');
  const submit = (e) => {
    if (fixed) { e.preventDefault(); setLog('handler ran, page stayed, state kept ✓'); }
    else { e.preventDefault(); setText(''); setLog('↻ page reloaded — state lost ✗'); } // we simulate the reload safely
  };
  return (
    <div className="card stack">
      <div className="eyebrow">1 · Missing preventDefault()</div>
      <Toggle fixed={fixed} setFixed={setFixed} />
      <form onSubmit={submit} className="row" style={{ flexWrap: 'nowrap' }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type, then submit" aria-label="text" />
        <button className="btn" style={{ flex: 'none' }}>Submit</button>
      </form>
      <p className="hint">{log || 'submit the form to see what happens'}</p>
    </div>
  );
}

// 2 — mutating state
function Mistake2() {
  const [fixed, setFixed] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const onChange = (e) => {
    if (fixed) setForm({ ...form, name: e.target.value });   // new object → re-render
    else { form.name = e.target.value; setForm(form); }      // same reference → React sees no change
  };
  return (
    <div className="card stack">
      <div className="eyebrow">2 · Mutating state</div>
      <Toggle fixed={fixed} setFixed={(v) => { setFixed(v); setForm({ name: '' }); }} />
      <input value={form.name} onChange={onChange} placeholder="type here…" aria-label="name" />
      <p className="hint">{fixed ? 'new object each time → input updates ✓' : 'same object reference → the input looks stuck ✗'}</p>
    </div>
  );
}

// 3 — no loading / disabled state
function Mistake3() {
  const [fixed, setFixed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(0);
  const send = () => {
    setBusy(true); setSent((n) => n + 1);
    setTimeout(() => setBusy(false), 1500);
  };
  return (
    <div className="card stack">
      <div className="eyebrow">3 · No loading state</div>
      <Toggle fixed={fixed} setFixed={(v) => { setFixed(v); setSent(0); }} />
      <div className="row" style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <button className="btn primary" style={{ flex: 'none' }} onClick={send} disabled={fixed && busy}>{fixed && busy ? 'Sending…' : 'Pay now'}</button>
        <span className="count">requests sent: {sent}</span>
      </div>
      <p className="hint">{fixed ? 'disabled while loading → only one request ✓' : 'click it three times quickly → duplicate charges ✗'}</p>
    </div>
  );
}

// 4 — validating only on submit
function Mistake4() {
  const [fixed, setFixed] = useState(false);
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div className="card stack">
      <div className="eyebrow">4 · Validate only on submit</div>
      <Toggle fixed={fixed} setFixed={(v) => { setFixed(v); setTouched(false); }} />
      <div className={'field' + (fixed && touched && bad ? ' bad' : '')}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} placeholder="email — then tab away" aria-label="email" />
        <span className="err">{fixed && touched && bad ? 'Enter a valid email address' : ''}</span>
      </div>
      <p className="hint">{fixed ? 'validated on blur → feedback right when you leave the field ✓' : 'no feedback until you press submit ✗'}</p>
    </div>
  );
}

// 5 — missing htmlFor / id
function Mistake5() {
  const [fixed, setFixed] = useState(false);
  return (
    <div className="card stack">
      <div className="eyebrow">5 · Missing htmlFor / id</div>
      <Toggle fixed={fixed} setFixed={setFixed} />
      <div className="field">
        <label htmlFor={fixed ? 'm5-email' : undefined} style={{ cursor: 'pointer' }}>Click this label</label>
        <input id="m5-email" type="text" placeholder="…does it get focus?" />
      </div>
      <p className="hint">{fixed ? 'label is linked → clicking it focuses the input ✓' : 'label not linked → nothing happens, screen readers lose the name ✗'}</p>
    </div>
  );
}

export default function CommonMistakes() {
  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
      <Mistake1 /><Mistake2 /><Mistake3 /><Mistake4 /><Mistake5 />
    </div>
  );
}
