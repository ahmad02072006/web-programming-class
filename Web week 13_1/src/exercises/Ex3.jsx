import React, { useState } from 'react';

// EXERCISE 3 — Submit + validation + status machine (idle → loading → success | error)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fakeApi = (data) =>   // pretend server: rejects the "wrong" password
  new Promise((ok, fail) => setTimeout(() => (data.password === 'react1234' ? ok() : fail(new Error('bad creds'))), 1200));

export default function Ex3() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const errs = {};
    if (!EMAIL.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs; // empty object = valid
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStatus('loading');
    try {
      await fakeApi(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate style={{ maxWidth: 420 }}>
      <div className={'field' + (errors.email ? ' bad' : '')}>
        <label htmlFor="e3-mail">Email</label>
        <input id="e3-mail" name="email" type="email" value={form.email} onChange={handleChange}
               aria-invalid={!!errors.email} aria-describedby="e3-mail-err" />
        <span id="e3-mail-err" className="err">{errors.email}</span>
      </div>
      <div className={'field' + (errors.password ? ' bad' : '')}>
        <label htmlFor="e3-pw">Password</label>
        <input id="e3-pw" name="password" type="password" value={form.password} onChange={handleChange}
               aria-invalid={!!errors.password} aria-describedby="e3-pw-err" />
        <span id="e3-pw-err" className="err">{errors.password}</span>
      </div>
      <div className="row" style={{ alignItems: 'center' }}>
        <button className="btn primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Authenticating…' : 'Log in'}
        </button>
        <span className={'status ' + status}>{status}</span>
      </div>
      {status === 'error' && <div className="banner bad" role="alert">Login failed. Check your credentials. (hint: react1234)</div>}
      {status === 'success' && <div className="banner ok" role="status">Access granted ✓</div>}
    </form>
  );
}
