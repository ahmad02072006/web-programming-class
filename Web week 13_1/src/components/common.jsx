import React from 'react';

/* ---------- validators (plain functions: easy to test) ---------- */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v) => EMAIL_RE.test(v);
export const hasErrors = (errs) => Object.keys(errs).length > 0; // empty object = valid

/* ---------- Field: label + control + linked error (accessibility, slide 31) ----------
   Every input gets <label htmlFor>, aria-invalid and aria-describedby -> error span. */
export function Field({ id, label, required, error, hint, touched = true, valid, right, children }) {
  const show = touched && error;
  const cls = 'field' + (show ? ' bad' : valid ? ' good' : '');
  return (
    <div className={cls}>
      <label htmlFor={id}>
        <span>{label}{required && <span className="req" aria-hidden="true"> *</span>}</span>
        {right}
      </label>
      {typeof children === 'function'
        ? children({
            id,
            'aria-invalid': !!show,
            'aria-describedby': id + '-msg',
            'aria-required': required ? 'true' : undefined,
          })
        : children}
      <span id={id + '-msg'} className="err" role={show ? 'alert' : undefined}>
        {show ? error : ''}
      </span>
      {hint && !show && <span className="hint">{hint}</span>}
    </div>
  );
}

/* ---------- tiny syntax highlighter for the code panels ---------- */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function highlight(src) {
  const out = [];
  const re = /(\/\/[^\n]*|\{\/\*[\s\S]*?\*\/\})|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(import|from|export|default|function|const|let|return|if|else|async|await|try|catch|throw|new|true|false|null|typeof)\b|(<\/?[A-Za-z][\w.]*)|\b(\d+)\b/g;
  let last = 0, m;
  while ((m = re.exec(src))) {
    out.push(esc(src.slice(last, m.index)));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 't' : 'n';
    out.push(`<span class="tok-${cls}">${esc(m[0])}</span>`);
    last = re.lastIndex;
  }
  out.push(esc(src.slice(last)));
  return out.join('');
}
export function CodeBlock({ code }) {
  return <pre className="code" dangerouslySetInnerHTML={{ __html: highlight(code.trim()) }} />;
}

export const initials = (name) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '··';

/* pretty JSON for the on-page "console" */
export function Console({ title = 'console.log', data }) {
  const json = JSON.stringify(data, null, 2) || '';
  const html = esc(json)
    .replace(/&quot;/g, '"')
    .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
    .replace(/: (true|false|\d+)/g, ': <span class="n">$1</span>');
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{title}</div>
      <pre className="console" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
