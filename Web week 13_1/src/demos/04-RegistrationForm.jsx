import React, { useState } from 'react';

export default function RegistrationForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  // One handler for ALL fields: reads e.target.name
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // computed key
    }));
  };

  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" aria-label="Name" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" aria-label="Email" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" aria-label="Password" />
        <select name="role" value={form.role} onChange={handleChange} aria-label="Role">
          <option value="student">Student</option>
          <option value="ta">Teaching Assistant</option>
        </select>
      </form>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>{'{ ...prev, [name]: value }'}</div>
        <pre className="console">{JSON.stringify(form, null, 2)}</pre>
      </div>
    </div>
  );
}
