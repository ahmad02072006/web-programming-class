import React, { useState } from 'react';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [ok, setOk] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs; // empty object = all valid
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setOk(false);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setOk(true); // all valid: proceed with submission
  };

  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <form className="stack" onSubmit={handleSubmit} noValidate>
        {['name', 'email', 'password'].map((k) => (
          <div key={k} className={'field' + (errors[k] ? ' bad' : '')}>
            <input name={k} type={k === 'password' ? 'password' : 'text'} value={form[k]} onChange={handleChange} placeholder={k} aria-label={k} />
            <span className="err">{errors[k]}</span>
          </div>
        ))}
        <button className="btn primary">Register</button>
        {ok && <div className="banner ok" role="status">Valid — errors object is empty ✓</div>}
      </form>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>errors object</div>
        <pre className="console">{JSON.stringify(errors, null, 2)}</pre>
        <p className="hint">{} (no keys) = valid · keys = invalid</p>
      </div>
    </div>
  );
}
