import React, { useState } from 'react';
import { CodeBlock } from './common.jsx';
import Ex1 from '../exercises/Ex1.jsx';
import Ex2 from '../exercises/Ex2.jsx';
import Ex3 from '../exercises/Ex3.jsx';
import c1 from 'raw:../exercises/Ex1.jsx';
import c2 from 'raw:../exercises/Ex2.jsx';
import c3 from 'raw:../exercises/Ex3.jsx';

const LIST = [
  { n: 1, title: 'Controlled input', Comp: Ex1, code: c1, skill: 'value + onChange',
    task: 'Build a message box whose text React fully controls: show a live character counter, an UPPERCASE mode that transforms as you type, and a Clear button.' },
  { n: 2, title: 'One handler, many fields', Comp: Ex2, code: c2, skill: 'e.target.name + [name]',
    task: 'Build a form with text, email, select, textarea, radio and checkbox fields that share ONE handleChange, and display the live state object next to it.' },
  { n: 3, title: 'Submit & validate', Comp: Ex3, code: c3, skill: 'preventDefault · errors object · status',
    task: 'Build a login form that validates into an errors object, calls e.preventDefault(), and moves through idle → loading → success/error with a disabled button.' },
];

export default function StudyExercises() {
  const [open, setOpen] = useState({});
  return (
    <div className="stack" style={{ '--gap': '22px' }}>
      {LIST.map(({ n, title, Comp, code, task, skill }) => (
        <section className="panel stack" key={n} aria-labelledby={'ex' + n}>
          <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '2.2rem', fontWeight: 700, color: 'transparent', WebkitTextStroke: '1px var(--cyan)' }}>0{n}</span>
              <div><h2 id={'ex' + n}>Exercise {n} — {title}</h2><span className="badge">{skill}</span></div>
            </div>
            <button className="btn sm" style={{ flex: 'none' }} aria-pressed={!!open[n]} onClick={() => setOpen((o) => ({ ...o, [n]: !o[n] }))}>
              {open[n] ? 'Hide code' : '</> Show code'}
            </button>
          </div>
          <p className="sub" style={{ margin: 0 }}><b style={{ color: 'var(--ink)' }}>Task:</b> {task}</p>
          <div className="card"><Comp /></div>
          {open[n] && <CodeBlock code={code} />}
        </section>
      ))}
    </div>
  );
}
