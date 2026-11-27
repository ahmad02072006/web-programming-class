import React, { useState } from 'react';

export default function PreferenceForm() {
  const [country, setCountry] = useState('KR');
  const [bio, setBio] = useState('');
  const [agree, setAgree] = useState(false);
  const [theme, setTheme] = useState('dark');
  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        {/* select: value lives on <select>, NOT on <option> */}
        <select value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
          <option value="KR">South Korea</option>
          <option value="UZ">Uzbekistan</option>
          <option value="US">United States</option>
        </select>
        {/* textarea: same pattern as <input> */}
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Bio…" aria-label="Bio" />
        {/* radio + checkbox: use checked, not value */}
        <div className="pills">
          {['dark', 'neon', 'light'].map((t) => (
            <label className="pill" key={t}>
              <input type="radio" name="theme" value={t} checked={theme === t} onChange={(e) => setTheme(e.target.value)} />
              <span>{t}</span>
            </label>
          ))}
        </div>
        <label className="check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree
        </label>
      </form>
      <pre className="console">{JSON.stringify({ country, bio, theme, agree }, null, 2)}</pre>
    </div>
  );
}
