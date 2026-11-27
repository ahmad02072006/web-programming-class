import React, { useState, useRef, useEffect } from 'react';
import { Field, Console, initials, hasErrors } from './common.jsx';

export const MAJORS = [
  'Computer Engineering', 'Software Engineering', 'Artificial Intelligence',
  'Data Science', 'Cybersecurity', 'Information Systems', 'Digital Media Design',
];
const MAX_BIO = 200;
const MAX_SKILLS = 8;

/* validate(): returns an errors object. Empty object = everything valid. */
export function validateProfile(form, photo) {
  const e = {};
  if (!form.name.trim()) e.name = 'Name is required';
  else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!/^\d{10}$/.test(form.studentId)) e.studentId = 'Student ID must be exactly 10 digits';
  if (!form.major) e.major = 'Choose your major';
  if (!form.year) e.year = 'Select your year (1–4)';
  if (!form.bio.trim()) e.bio = 'Bio is required';
  else if (form.bio.length > MAX_BIO) e.bio = `Bio must be ${MAX_BIO} characters or fewer`;
  if (!photo.url) e.photo = photo.error || 'Upload a profile photo';
  else if (photo.error) e.photo = photo.error;
  return e;
}

export function ProfileCard({ form, photoUrl, label }) {
  return (
    <div className="holo" aria-label={label}>
      <div style={{ position: 'relative', display: 'flex', gap: 18, alignItems: 'center' }}>
        <div className="avatar">
          {photoUrl ? <img src={photoUrl} alt={`${form.name || 'Student'} profile`} /> : initials(form.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow">{label}</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, overflowWrap: 'anywhere' }}>{form.name || 'Your name'}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', color: 'var(--muted)' }}>
            ID {form.studentId || '··········'} · Year {form.year || '–'}
          </div>
          <div style={{ color: 'var(--cyan)', fontSize: '.9rem' }}>{form.major || 'Major not selected'}</div>
        </div>
      </div>
      <p style={{ position: 'relative', margin: '16px 0 10px', color: 'var(--ink)', fontSize: '.9rem', overflowWrap: 'anywhere' }}>
        {form.bio || <span style={{ color: 'var(--dim)' }}>Your bio will appear here…</span>}
      </p>
      <div style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: '.72rem', color: 'var(--muted)', marginBottom: 10 }}>
        bio: {form.bio.length} / {MAX_BIO}
      </div>
      <div className="chips" style={{ position: 'relative' }}>
        {form.skills.map((s) => <span key={s} className="chip static">{s}</span>)}
      </div>
    </div>
  );
}

export default function ProfileEditor() {
  const [form, setForm] = useState({ name: '', studentId: '', major: '', year: '', bio: '', skills: [] });
  const [touched, setTouched] = useState({});
  const [photo, setPhoto] = useState({ url: '', name: '', error: '' });
  const [skillDraft, setSkillDraft] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const fileRef = useRef(null);       // file inputs cannot be controlled -> useRef (slide 25)
  const formRef = useRef(null);

  const errors = validateProfile(form, photo);

  // free the object URL when the photo changes / component unmounts
  useEffect(() => () => { if (photo.url) URL.revokeObjectURL(photo.url); }, [photo.url]);

  /* ONE handler for all text-like fields (slide 13) */
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'studentId') value = value.replace(/\D/g, '').slice(0, 10); // live transform
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handlePhoto = () => {
    const file = fileRef.current.files[0];
    setTouched((t) => ({ ...t, photo: true }));
    if (!file) { setPhoto({ url: '', name: '', error: '' }); return; }
    let error = '';
    if (!file.type.startsWith('image/')) error = 'File must be an image (PNG, JPG, WebP)';
    else if (file.size > 2 * 1024 * 1024) error = 'Image must be smaller than 2 MB';
    setPhoto({ url: error ? '' : URL.createObjectURL(file), name: file.name, error });
  };

  /* stretch goal: skill tags — Enter adds, × removes */
  const addSkill = () => {
    const s = skillDraft.trim().toLowerCase().replace(/\s+/g, '-');
    if (!s) return;
    if (!form.skills.includes(s) && form.skills.length < MAX_SKILLS)
      setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillDraft('');
  };
  const onSkillKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    else if (e.key === 'Backspace' && !skillDraft && form.skills.length)
      setForm((p) => ({ ...p, skills: p.skills.slice(0, -1) }));
  };
  const removeSkill = (s) => setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  const handleSubmit = (e) => {
    e.preventDefault();                                  // stop the page reload (slide 17)
    setTouched({ name: 1, studentId: 1, major: 1, year: 1, bio: 1, photo: 1 });
    if (hasErrors(errors)) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    const payload = { ...form, year: Number(form.year), photo: photo.name };
    console.log('Profile submitted', payload);
    setSubmitted(payload);
  };

  const reset = () => {
    setForm({ name: '', studentId: '', major: '', year: '', bio: '', skills: [] });
    setTouched({}); setPhoto({ url: '', name: '', error: '' }); setSubmitted(null);
  };

  if (submitted) {
    return (
      <div className="grid2">
        <div className="stack">
          <div className="banner ok" role="status">✓ Profile saved. This is your Profile Preview.</div>
          <ProfileCard form={form} photoUrl={photo.url} label="PROFILE PREVIEW" />
          <div className="row" style={{ gap: 10 }}>
            <button className="btn primary" onClick={() => setSubmitted(null)}>Edit profile</button>
            <button className="btn" onClick={reset}>New student</button>
          </div>
        </div>
        <div className="panel"><Console title="console.log(profile)" data={submitted} /></div>
      </div>
    );
  }

  const t = touched;
  const ok = (k) => t[k] && !errors[k];
  const bioLen = form.bio.length;

  return (
    <div className="grid2">
      <form className="panel stack" onSubmit={handleSubmit} noValidate ref={formRef} aria-label="Student profile editor">
        <div>
          <h2>Student profile editor</h2>
          <p className="sub">Controlled inputs · one shared handler · validation on blur and submit.</p>
        </div>

        <div className="row">
          <Field id="name" label="Full name" required error={errors.name} touched={t.name} valid={ok('name')}>
            {(a) => <input {...a} type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="Kim Minho" autoComplete="name" />}
          </Field>
          <Field id="studentId" label="Student ID" required error={errors.studentId} touched={t.studentId} valid={ok('studentId')}
                 hint="10 digits — letters are stripped as you type"
                 right={<span className={'count' + (form.studentId.length === 10 ? '' : '')}>{form.studentId.length}/10</span>}>
            {(a) => <input {...a} type="text" inputMode="numeric" name="studentId" value={form.studentId} onChange={handleChange} onBlur={handleBlur} placeholder="2024123456" />}
          </Field>
        </div>

        <Field id="major" label="Major" required error={errors.major} touched={t.major} valid={ok('major')}>
          {(a) => (
            <select {...a} name="major" value={form.major} onChange={handleChange} onBlur={handleBlur}>
              <option value="">Select a major…</option>
              {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          )}
        </Field>

        <fieldset style={{ border: 0, padding: 0, margin: 0 }} aria-describedby="year-msg">
          <legend className="lbl" style={{ fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            Year <span className="req" aria-hidden="true">*</span>
          </legend>
          <div className="pills" role="radiogroup">
            {[1, 2, 3, 4].map((y) => (
              <label className="pill" key={y}>
                <input type="radio" name="year" value={String(y)} checked={form.year === String(y)}
                       onChange={handleChange} onBlur={handleBlur} aria-invalid={!!(t.year && errors.year)} />
                <span>Year {y}</span>
              </label>
            ))}
          </div>
          <span id="year-msg" className="err" role={t.year && errors.year ? 'alert' : undefined}>{t.year ? errors.year : ''}</span>
        </fieldset>

        <Field id="bio" label="Bio" required error={errors.bio} touched={t.bio} valid={ok('bio')}
               right={<span className={'count' + (bioLen > MAX_BIO ? ' over' : '')}>{bioLen} / {MAX_BIO}</span>}>
          {(a) => <textarea {...a} name="bio" value={form.bio} onChange={handleChange} onBlur={handleBlur} rows={4} placeholder="Tell us about your interests…" />}
        </Field>
        <div className="bar" aria-hidden="true"><i style={{ width: Math.min(100, (bioLen / MAX_BIO) * 100) + '%', background: bioLen > MAX_BIO ? 'var(--pink)' : undefined }} /></div>

        <Field id="photo" label="Photo" required error={errors.photo} touched={t.photo} valid={ok('photo')}
               hint="PNG / JPG / WebP, max 2 MB — read through useRef">
          {(a) => <input {...a} type="file" accept="image/*" ref={fileRef} onChange={handlePhoto} />}
        </Field>

        <div className="field">
          <label htmlFor="skills"><span>Skills <span style={{ textTransform: 'none', color: 'var(--dim)' }}>(stretch)</span></span><span className="count">{form.skills.length}/{MAX_SKILLS}</span></label>
          <div className="chips" style={{ marginBottom: form.skills.length ? 8 : 0 }}>
            {form.skills.map((s) => (
              <span key={s} className="chip">{s}
                <button type="button" onClick={() => removeSkill(s)} aria-label={`Remove skill ${s}`}>×</button>
              </span>
            ))}
          </div>
          <input id="skills" type="text" value={skillDraft} onChange={(e) => setSkillDraft(e.target.value)} onKeyDown={onSkillKey}
                 placeholder="Type a skill, press Enter…" disabled={form.skills.length >= MAX_SKILLS} />
        </div>

        <div className="actions" style={{ justifyContent: 'flex-start' }}>
          <button className="btn primary" type="submit">Submit profile</button>
          <button className="btn" type="button" onClick={reset}>Reset</button>
        </div>
      </form>

      <div className="stack" style={{ position: 'sticky', top: 74 }}>
        <ProfileCard form={form} photoUrl={photo.url} label="LIVE PREVIEW" />
        <div className="card" style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
          {Object.keys(errors).length === 0
            ? <span style={{ color: 'var(--lime)' }}>● All fields valid — ready to submit</span>
            : <span>● {Object.keys(errors).length} field(s) still need attention</span>}
        </div>
      </div>
    </div>
  );
}
