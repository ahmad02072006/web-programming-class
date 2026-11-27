import React, { useState } from 'react';
import { CodeBlock } from './common.jsx';
import Wizard from './Wizard.jsx';
import D01 from '../demos/01-ControlledVsUncontrolled.jsx';
import D02 from '../demos/02-SearchBar.jsx';
import D03 from '../demos/03-PreferenceForm.jsx';
import D04 from '../demos/04-RegistrationForm.jsx';
import D05 from '../demos/05-LoginForm.jsx';
import D06 from '../demos/06-RegisterValidation.jsx';
import D07 from '../demos/07-FocusAndFile.jsx';
import D09 from '../demos/09-AccessibleForm.jsx';
import D10 from '../demos/10-ProfileEditorStarter.jsx';
import D11 from '../demos/11-CommonMistakes.jsx';
import s01 from 'raw:../demos/01-ControlledVsUncontrolled.jsx';
import s02 from 'raw:../demos/02-SearchBar.jsx';
import s03 from 'raw:../demos/03-PreferenceForm.jsx';
import s04 from 'raw:../demos/04-RegistrationForm.jsx';
import s05 from 'raw:../demos/05-LoginForm.jsx';
import s06 from 'raw:../demos/06-RegisterValidation.jsx';
import s07 from 'raw:../demos/07-FocusAndFile.jsx';
import s08 from 'raw:./Wizard.jsx';
import s09 from 'raw:../demos/09-AccessibleForm.jsx';
import s10 from 'raw:../demos/10-ProfileEditorStarter.jsx';
import s11 from 'raw:../demos/11-CommonMistakes.jsx';

const DEMOS = [
  ['01', 'ControlledVsUncontrolled', 'Controlled vs uncontrolled', D01, s01, 'Slide 4'],
  ['02', 'SearchBar', 'The controlled input pattern', D02, s02, 'Slide 6'],
  ['03', 'PreferenceForm', 'Select, textarea, checkbox, radio', D03, s03, 'Slide 9'],
  ['04', 'RegistrationForm', 'One handler for all fields', D04, s04, 'Slide 13'],
  ['05', 'LoginForm', 'Form submission and status', D05, s05, 'Slide 20'],
  ['06', 'RegisterValidation', 'Client-side validation', D06, s06, 'Slide 21'],
  ['07', 'FocusAndFile', 'useRef: focus and file inputs', D07, s07, 'Slide 25'],
  ['08', 'MultiStepRegistration', 'Challenge solution: wizard', Wizard, s08, 'Slide 29'],
  ['09', 'AccessibleForm', 'Accessibility in forms', D09, s09, 'Slide 31'],
  ['10', 'ProfileEditorStarter', 'Homework starter: profile editor', D10, s10, 'Slide 37'],
  ['11', 'CommonMistakes', 'Common form mistakes (all five)', D11, s11, 'Slide 34'],
];

export default function Lab() {
  const [active, setActive] = useState('01');
  const [showCode, setShowCode] = useState(false);
  const [n, , title, Demo, src, slide] = DEMOS.find((d) => d[0] === active);
  const file = DEMOS.find((d) => d[0] === active)[1];
  const filename = active === '08' ? 'Wizard.jsx' : `${active}-${file}.jsx`;

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Demos">
        {DEMOS.map(([id]) => (
          <button key={id} role="tab" aria-selected={active === id} className={active === id ? 'on' : ''}
                  onClick={() => { setActive(id); setShowCode(false); }}>{id}</button>
        ))}
      </div>
      <div className="panel stack" key={active}>
        <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <div>
            <div className="eyebrow">Demo {n} · {slide}</div>
            <h2 style={{ margin: '4px 0 0' }}>{title}</h2>
          </div>
          <button className="btn sm" style={{ flex: 'none' }} onClick={() => setShowCode((s) => !s)} aria-pressed={showCode}>
            {showCode ? 'Hide source' : '</> View source'}
          </button>
        </div>
        <div className="card"><Demo /></div>
        {showCode && (
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{filename}</div>
            <CodeBlock code={src} />
          </div>
        )}
        {active === '10' && <a className="btn primary" style={{ textDecoration: 'none', textAlign: 'center' }} href="task1-profile-editor.html">See the finished editor (Task 1) →</a>}
        {active === '08' && <p className="hint">This is the same component used on the Task 2 page.</p>}
      </div>
    </div>
  );
}
