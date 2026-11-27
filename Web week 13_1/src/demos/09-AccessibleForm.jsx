import React, { useState } from 'react';

export default function AccessibleForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    setErrors(errs);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="stack" style={{ maxWidth: 420 }}>
      <div className={'field' + (errors.email ? ' bad' : '')}>
        {/* label + id: clicking the label focuses the input */}
        <label htmlFor="email">Email <span className="req" aria-hidden="true">*</span></label>
        <input
          id="email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {/* screen readers announce this together with the field */}
        <span id="email-error" className="err" role="alert">{errors.email}</span>
      </div>
      <button className="btn primary">Check</button>
      <p className="hint">Try it keyboard-only: Tab to the field, type, Tab to the button, press Enter.</p>
    </form>
  );
}
