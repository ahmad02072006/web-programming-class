import React, { useState } from 'react';
import { Field, Console, isEmail } from './common.jsx';

const STEPS = ['Personal', 'Account', 'Preferences'];
const ROLES = [['student', 'Student'], ['ta', 'TA'], ['instructor', 'Instructor']];

/* One validator per step: returns an errors object (empty = step is valid) */
export function validateStep(step, f) {
  const e = {};
  if (step === 0) {
    if (f.name.trim().length < 2) e.name = 'Name is required (min 2 characters)';
    if (!isEmail(f.email)) e.email = 'Enter a valid email address';
  }
  if (step === 1) {
    if (f.username.length < 3) e.username = 'Username needs at least 3 characters';
    else if (/\s/.test(f.username)) e.username = 'Username cannot contain spaces';
    if (f.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (f.confirm !== f.password || !f.confirm) e.confirm = 'Passwords do not match';
  }
  return e;
}
export function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-4
}

const INITIAL = { name: '', email: '', username: '', password: '', confirm: '', role: 'student', newsletter: false };

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);          // ONE object for all steps -> "Previous" keeps data
  const [touched, setTouched] = useState({});
  const [done, setDone] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const errors = validateStep(step, form);
  const stepValid = Object.keys(errors).length === 0;
  const show = (k) => touched[k] && errors[k];

  const next = () => stepValid && setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 2) { next(); return; }            // Enter key advances until the last step
    const { confirm, ...full } = form;           // never log the confirmation field
    console.log(full);
    setDone(full);
  };

  const restart = () => { setForm(INITIAL); setTouched({}); setStep(0); setDone(null); };

  if (done) {
    return (
      <div className="grid2">
        <div className="panel stack">
          <div className="banner ok" role="status">✓ Registration complete — welcome aboard, {done.name.split(' ')[0]}.</div>
          <p className="sub" style={{ margin: 0 }}>The full form object was sent to <code>console.log</code> (open DevTools to see it). Here is the same payload:</p>
          <button className="btn primary" onClick={restart}>Register another</button>
        </div>
        <div className="panel"><Console data={done} /></div>
      </div>
    );
  }

  const pw = strength(form.password);
  const pwLabel = ['too weak', 'weak', 'fair', 'strong', 'excellent'][pw];
  const pwColor = ['var(--pink)', 'var(--pink)', 'var(--amber)', 'var(--lime)', 'var(--cyan)'][pw];

  return (
    <div className="panel" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="stepper" aria-hidden="true">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={'step' + (i === step ? ' on' : '') + (i < step ? ' done' : '')}>
              <b>{i < step ? '✓' : i + 1}</b><span>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </React.Fragment>
        ))}
      </div>
      <div className="eyebrow" aria-live="polite" style={{ marginBottom: 6 }}>Step {step + 1} of 3</div>
      <div className="bar" style={{ marginBottom: 22 }}><i style={{ width: ((step + 1) / 3) * 100 + '%' }} /></div>

      <form onSubmit={handleSubmit} noValidate className="stack">
        {step === 0 && (
          <>
            <h2>Personal info</h2>
            <Field id="w-name" label="Name" required error={errors.name} touched={touched.name} valid={touched.name && !errors.name}>
              {(a) => <input {...a} type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} autoComplete="name" placeholder="Ada Lovelace" />}
            </Field>
            <Field id="w-email" label="Email" required error={errors.email} touched={touched.email} valid={touched.email && !errors.email}>
              {(a) => <input {...a} type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" placeholder="ada@university.kr" />}
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <h2>Account setup</h2>
            <Field id="w-user" label="Username" required error={errors.username} touched={touched.username} valid={touched.username && !errors.username} hint="min 3 characters, no spaces">
              {(a) => <input {...a} type="text" name="username" value={form.username} onChange={handleChange} onBlur={handleBlur} autoComplete="username" placeholder="ada_codes" />}
            </Field>
            <Field id="w-pass" label="Password" required error={errors.password} touched={touched.password} valid={touched.password && !errors.password}
                   right={<span className="count" style={{ color: pwColor }}>{form.password ? pwLabel : ''}</span>}>
              {(a) => <input {...a} type="password" name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" placeholder="at least 8 characters" />}
            </Field>
            <div className="bar" aria-hidden="true" style={{ marginTop: -8 }}><i style={{ width: (pw / 4) * 100 + '%', background: pwColor, boxShadow: 'none' }} /></div>
            <Field id="w-conf" label="Confirm password" required error={errors.confirm} touched={touched.confirm} valid={touched.confirm && !errors.confirm}>
              {(a) => <input {...a} type="password" name="confirm" value={form.confirm} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" placeholder="repeat password" />}
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Preferences</h2>
            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="lbl" style={{ fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Role</legend>
              <div className="pills">
                {ROLES.map(([v, l]) => (
                  <label className="pill" key={v}>
                    <input type="radio" name="role" value={v} checked={form.role === v} onChange={handleChange} />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="check">
              <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={handleChange} />
              Subscribe to the newsletter
            </label>
            <div className="card">
              <div className="eyebrow" style={{ marginBottom: 10 }}>Review summary · read-only</div>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 18px', fontSize: '.9rem' }}>
                <dt style={{ color: 'var(--muted)' }}>Name</dt><dd style={{ margin: 0 }}>{form.name}</dd>
                <dt style={{ color: 'var(--muted)' }}>Email</dt><dd style={{ margin: 0 }}>{form.email}</dd>
                <dt style={{ color: 'var(--muted)' }}>Username</dt><dd style={{ margin: 0 }}>{form.username}</dd>
                <dt style={{ color: 'var(--muted)' }}>Password</dt><dd style={{ margin: 0 }}>{'•'.repeat(form.password.length)}</dd>
                <dt style={{ color: 'var(--muted)' }}>Role</dt><dd style={{ margin: 0 }}>{ROLES.find(([v]) => v === form.role)[1]}</dd>
                <dt style={{ color: 'var(--muted)' }}>Newsletter</dt><dd style={{ margin: 0 }}>{form.newsletter ? 'Yes' : 'No'}</dd>
              </dl>
            </div>
          </>
        )}

        <div className="actions">
          <button type="button" className="btn" onClick={prev} disabled={step === 0}>← Previous</button>
          {step < 2
            ? <button key="next" type="button" className="btn primary" onClick={next} disabled={!stepValid}>Next →</button>
            : <button key="submit" type="submit" className="btn primary">Create account</button>}
        </div>
        {step < 2 && !stepValid && <p className="hint" style={{ textAlign: 'right', margin: 0 }}>Next stays disabled until this step is valid.</p>}
      </form>
    </div>
  );
}
