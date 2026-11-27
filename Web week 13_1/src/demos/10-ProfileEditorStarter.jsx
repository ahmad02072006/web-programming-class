import React, { useState } from 'react';

// HOMEWORK STARTER — finish this, then compare with the full Task 1 editor.
// TODO 1: validate studentId === exactly 10 digits
// TODO 2: show the bio counter in red above 200 characters
// TODO 3: add a photo field (useRef + preview) and skill tags
export default function ProfileEditorStarter() {
  const [form, setForm] = useState({ name: '', studentId: '', major: '', year: '1', bio: '' });
  const [submitted, setSubmitted] = useState(null);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(form); };

  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <form className="stack" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" aria-label="Name" />
        <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="Student ID" aria-label="Student ID" />
        <select name="major" value={form.major} onChange={handleChange} aria-label="Major">
          <option value="">Major…</option><option>Computer Engineering</option><option>Data Science</option>
        </select>
        <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Bio" aria-label="Bio" />
        <span className="count">{form.bio.length} / 200</span>
        <button className="btn primary">Submit</button>
      </form>
      <pre className="console">{submitted ? JSON.stringify(submitted, null, 2) : '// submit to see the data'}</pre>
    </div>
  );
}
