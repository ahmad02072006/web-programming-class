import React, { useState } from 'react';

// EXERCISE 2 — One handler for many fields (select, textarea, checkbox, radio)
export default function Ex2() {
  const [form, setForm] = useState({
    callsign: '', email: '', country: 'KR', bio: '', level: 'beginner', agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); // computed key
  };

  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        <div className="field"><label htmlFor="e2-call">Callsign</label>
          <input id="e2-call" type="text" name="callsign" value={form.callsign} onChange={handleChange} /></div>
        <div className="field"><label htmlFor="e2-mail">Email</label>
          <input id="e2-mail" type="email" name="email" value={form.email} onChange={handleChange} /></div>
        <div className="field"><label htmlFor="e2-country">Country</label>
          <select id="e2-country" name="country" value={form.country} onChange={handleChange}>
            <option value="KR">South Korea</option>
            <option value="UZ">Uzbekistan</option>
            <option value="US">United States</option>
          </select></div>
        <div className="field"><label htmlFor="e2-bio">Bio</label>
          <textarea id="e2-bio" name="bio" rows={3} value={form.bio} onChange={handleChange} /></div>
        <div className="pills">
          {['beginner', 'builder', 'wizard'].map((l) => (
            <label className="pill" key={l}>
              <input type="radio" name="level" value={l} checked={form.level === l} onChange={handleChange} />
              <span>{l}</span>
            </label>
          ))}
        </div>
        <label className="check">
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
          I accept the mission terms
        </label>
      </form>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>live state</div>
        <pre className="console">{JSON.stringify(form, null, 2)}</pre>
      </div>
    </div>
  );
}
