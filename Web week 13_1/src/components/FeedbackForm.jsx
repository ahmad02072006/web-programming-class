import React, { useState } from 'react';
import { Field, Console, isEmail, hasErrors } from './common.jsx';

const COURSES = ['Web Programming K0126_002', 'Data Structures', 'Operating Systems', 'Database Systems'];
const TOPICS = ['React basics', 'Hooks', 'Forms', 'CSS layout', 'Live demos', 'Homework'];
const LABELS = ['', 'Needs work', 'Fair', 'Good', 'Great', 'Stellar'];
const MIN_C = 10, MAX_C = 400;

export function validateFeedback(f) {
  const e = {};
  if (f.email && !isEmail(f.email)) e.email = 'Enter a valid email address (or leave it empty)';
  if (!f.course) e.course = 'Select a course';
  if (!f.rating) e.rating = 'Give an overall rating';
  if (!f.recommend) e.recommend = 'Tell us if you would recommend it';
  const len = f.comments.trim().length;
  if (len < MIN_C) e.comments = `Comments need at least ${MIN_C} characters (${len} so far)`;
  else if (f.comments.length > MAX_C) e.comments = `Keep comments under ${MAX_C} characters`;
  return e;
}

const INITIAL = { name: '', email: '', course: '', rating: 0, difficulty: 3, topics: [], recommend: '', comments: '', anonymous: false };

export default function FeedbackForm() {
  const [form, setForm] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');   // idle | loading | success | error
  const [sent, setSent] = useState(null);

  const errors = validateFeedback(form);
  const t = (k) => touched[k];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : type === 'range' ? Number(value) : value }));
  };
  const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));
  const setRating = (n) => { setForm((p) => ({ ...p, rating: n })); setTouched((p) => ({ ...p, rating: true })); };
  const toggleTopic = (topic) =>
    setForm((p) => ({ ...p, topics: p.topics.includes(topic) ? p.topics.filter((x) => x !== topic) : [...p.topics, topic] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: 1, course: 1, rating: 1, recommend: 1, comments: 1 });
    if (hasErrors(errors)) return;
    setStatus('loading');
    const payload = { ...form, name: form.anonymous ? null : form.name.trim() || null, email: form.anonymous ? null : form.email || null };
    // simulated network call (swap for fetch('/api/feedback', …) when a backend exists)
    setTimeout(() => {
      console.log('Feedback submitted', payload);
      setSent(payload);
      setStatus('success');
    }, 1100);
  };

  const reset = () => { setForm(INITIAL); setTouched({}); setStatus('idle'); setSent(null); };

  if (status === 'success') {
    return (
      <div className="grid2">
        <div className="panel stack">
          <div className="banner ok" role="status">✓ Transmission received. Thank you for the feedback!</div>
          <div className="holo" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div className="big">{sent.rating}.0</div>
              <div className="eyebrow">{LABELS[sent.rating]}</div>
              <p style={{ margin: '12px 0 0', color: 'var(--muted)', fontSize: '.9rem' }}>{sent.course}</p>
            </div>
          </div>
          <button className="btn primary" onClick={reset}>Send another response</button>
        </div>
        <div className="panel"><Console data={sent} /></div>
      </div>
    );
  }

  const comLen = form.comments.length;
  return (
    <form className="panel stack" onSubmit={handleSubmit} noValidate style={{ maxWidth: 780, margin: '0 auto' }} aria-label="Course feedback">
      <div>
        <h2>Course feedback</h2>
        <p className="sub">Your signal shapes next semester. Takes about a minute.</p>
      </div>

      <label className="check">
        <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={handleChange} />
        Submit anonymously (hides name and email)
      </label>

      {!form.anonymous && (
        <div className="row">
          <Field id="fb-name" label="Name (optional)">
            {(a) => <input {...a} type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" />}
          </Field>
          <Field id="fb-email" label="Email (optional)" error={errors.email} touched={t('email')}>
            {(a) => <input {...a} type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />}
          </Field>
        </div>
      )}

      <Field id="fb-course" label="Course" required error={errors.course} touched={t('course')} valid={t('course') && !errors.course}>
        {(a) => (
          <select {...a} name="course" value={form.course} onChange={handleChange} onBlur={handleBlur}>
            <option value="">Select a course…</option>
            {COURSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        )}
      </Field>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }} aria-describedby="fb-rating-msg">
        <legend className="lbl" style={{ fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
          Overall rating <span className="req" aria-hidden="true">*</span>
          <span className="count" style={{ marginLeft: 12, color: 'var(--cyan)' }}>{LABELS[form.rating]}</span>
        </legend>
        <div className="orbs">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={'orb' + (n <= form.rating ? ' lit' : '')}>
              <input type="radio" name="rating" value={n} checked={form.rating === n} onChange={() => setRating(n)} aria-label={`${n} out of 5 — ${LABELS[n]}`} />
              <span>{n}</span>
            </label>
          ))}
        </div>
        <span id="fb-rating-msg" className="err" role={t('rating') && errors.rating ? 'alert' : undefined}>{t('rating') ? errors.rating : ''}</span>
      </fieldset>

      <div className="field">
        <label htmlFor="fb-diff"><span>Difficulty</span><span className="count">{['', 'very easy', 'easy', 'balanced', 'hard', 'brutal'][form.difficulty]}</span></label>
        <input id="fb-diff" type="range" min="1" max="5" name="difficulty" value={form.difficulty} onChange={handleChange} />
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="lbl" style={{ fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>What worked best?</legend>
        <div className="pills">
          {TOPICS.map((tp) => (
            <label className="pill" key={tp}>
              <input type="checkbox" checked={form.topics.includes(tp)} onChange={() => toggleTopic(tp)} />
              <span>{tp}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }} aria-describedby="fb-rec-msg">
        <legend className="lbl" style={{ fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
          Would you recommend this course? <span className="req" aria-hidden="true">*</span>
        </legend>
        <div className="pills">
          {[['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']].map(([v, l]) => (
            <label className="pill" key={v}>
              <input type="radio" name="recommend" value={v} checked={form.recommend === v} onChange={(e) => { handleChange(e); handleBlur(e); }} />
              <span>{l}</span>
            </label>
          ))}
        </div>
        <span id="fb-rec-msg" className="err" role={t('recommend') && errors.recommend ? 'alert' : undefined}>{t('recommend') ? errors.recommend : ''}</span>
      </fieldset>

      <Field id="fb-com" label="Comments" required error={errors.comments} touched={t('comments')} valid={t('comments') && !errors.comments}
             right={<span className={'count' + (comLen > MAX_C ? ' over' : '')}>{comLen} / {MAX_C}</span>}>
        {(a) => <textarea {...a} name="comments" rows={5} value={form.comments} onChange={handleChange} onBlur={handleBlur} placeholder="What should we keep, change, or add?" />}
      </Field>

      <div className="actions" style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
        <button className="btn primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Transmitting…' : 'Send feedback'}
        </button>
        <span className={'status ' + status} aria-live="polite">{status}</span>
      </div>
    </form>
  );
}
