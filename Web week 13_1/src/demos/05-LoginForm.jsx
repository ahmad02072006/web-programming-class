import React, { useState } from 'react';

// stands in for fetch('/api/login') so the demo works without a server
const fakeLogin = (email, password) =>
  new Promise((resolve) => setTimeout(() => resolve({ ok: password === 'letmein!' }), 1100));

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();            // stop the browser's default page reload
    setStatus('loading');
    try {
      const res = await fakeLogin(email, password);
      if (!res.ok) throw new Error('Invalid credentials');
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form className="stack" onSubmit={handleSubmit} style={{ maxWidth: 380 }}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" aria-label="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password (hint: letmein!)" aria-label="Password" required />
      <div className="row" style={{ alignItems: 'center' }}>
        <button className="btn primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in…' : 'Log In'}
        </button>
        <span className={'status ' + status}>{status}</span>
      </div>
      {status === 'error' && <div className="banner bad" role="alert">Login failed. Check your credentials.</div>}
      {status === 'success' && <div className="banner ok" role="status">Welcome back ✓</div>}
    </form>
  );
}
