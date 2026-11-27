// Builds dist/taskN.js (React bundled in — no CDN needed) and writes every HTML page.
// Usage:  npm install  &&  npm run build
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const rawPlugin = {   // lets us `import src from 'raw:./file.jsx'` to show source code on the page
  name: 'raw',
  setup(b) {
    b.onResolve({ filter: /^raw:/ }, (a) => ({ path: resolve(a.resolveDir, a.path.slice(4)), namespace: 'raw' }));
    b.onLoad({ filter: /.*/, namespace: 'raw' }, (a) => ({ contents: 'export default ' + JSON.stringify(readFileSync(a.path, 'utf8')), loader: 'js' }));
  },
};

const TASKS = [
  { n: 1, file: 'task1-profile-editor', nav: 'Profile Editor', icon: '01', title: 'Student Profile Editor', eyebrow: 'Task 01 · Homework (slide 37)',
    desc: 'A full student-management form: validated name, 10-digit ID, major, year, bio counter, photo upload with preview, and skill tags. Submit to reveal your Profile Preview card.',
    badges: ['useState', 'useRef (file)', 'validation', 'stretch: tags'], hot: 'slide 37' },
  { n: 2, file: 'task2-registration-wizard', nav: 'Wizard', icon: '02', title: 'Multi-Step Registration Wizard', eyebrow: 'Task 02 · Code challenge (slide 29)',
    desc: 'Three steps, each validated before Next unlocks. Previous keeps your data, a progress indicator shows Step N of 3, and the final submit logs the full form object.',
    badges: ['one state object', 'per-step validation', 'radio + checkbox', 'review summary'], hot: 'slide 29' },
  { n: 3, file: 'task3-study-guide', nav: 'Study Guide', icon: '03', title: 'Study Guide · Exercises 1–3', eyebrow: 'Task 03 · Study guide practice',
    desc: 'Three guided exercises: a controlled input, one handler for many fields, and a validated submit with a status machine. Each one is live, with its full code one click away.',
    badges: ['controlled input', 'computed keys', 'preventDefault', 'status states'], hot: 'exercises 1–3' },
  { n: 4, file: 'task4-feedback-form', nav: 'Feedback', icon: '04', title: 'Course Feedback Form', eyebrow: 'Task 04 · Video lecture challenge (slide 13)',
    desc: 'Rate the course with glowing orbs, pick what worked, add comments with a live counter, or submit anonymously. Validates on blur and submit, then simulates a network call.',
    badges: ['mixed inputs', 'conditional fields', 'aria-describedby', 'loading state'], hot: 'slide 13' },
  { n: 5, file: 'task5-live-lab', nav: 'Live Lab', icon: '05', title: 'React Forms · Interactive Lab', eyebrow: 'Task 05 · Live demos & source 01–11',
    desc: 'All eleven lecture demos in one console. Flip between them, interact live, and open the exact source of each file.',
    badges: ['11 demos', 'view source', 'bug ↔ fix toggles'], hot: 'demos 01–11' },
  { n: 6, file: 'task6-sprint-quiz', nav: 'Quizzes', icon: '06', title: 'Monday Sprint Quiz & Mastery', eyebrow: 'Task 06 · Sprint quiz & slide quizzes',
    desc: 'Race the clock in Sprint mode, drill missed concepts in Mastery mode, or review all eight slide quizzes with the reasoning for every option.',
    badges: ['8 quizzes', 'timer + streak', 'mastery loop', 'answer review'], hot: 'sprint + mastery' },
];

const nav = (active) => `
  <nav class="nav" aria-label="Week 13_1 tasks">
    <a class="brand" href="index.html">NEXUS<i>/FORMS</i> · 13_1</a>
    <a class="tab" href="../index.html">← Back to course</a>
    ${TASKS.map((t) => `<a class="tab${t.n === active ? ' on' : ''}" href="${t.file}.html">${t.icon} ${t.nav}</a>`).join('\n    ')}
  </nav>`;

const head = (title) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Web Programming Week 13_1</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/theme.css">
</head>`;

for (const t of TASKS) {
  writeFileSync(`${t.file}.html`, `${head(t.title)}
<body>
<div class="shell">${nav(t.n)}
  <header class="hero">
    <div class="eyebrow">${t.eyebrow}</div>
    <h1>${t.title}</h1>
    <p>${t.desc}</p>
    <div class="meta">${t.badges.map((b, i) => `<span class="badge${i === 0 ? ' hot' : ''}">${b}</span>`).join('')}</div>
  </header>
  <main id="root"><noscript><div class="banner bad">This page needs JavaScript.</div></noscript></main>
  <footer class="foot">Web Programming K0126_002 · Week 13_1 · React Forms &amp; Controlled Components</footer>
</div>
<script src="dist/task${t.n}.js"></script>
</body>
</html>
`);
}

writeFileSync('index.html', `${head('Week 13_1 — React Forms')}
<body>
<div class="shell">
  <nav class="nav" aria-label="Week 13_1 tasks"><a class="brand" href="index.html">NEXUS<i>/FORMS</i> · 13_1</a>
    <a class="tab" href="../index.html">← Back to course</a>
    ${TASKS.map((t) => `<a class="tab" href="${t.file}.html">${t.icon} ${t.nav}</a>`).join('\n    ')}
  </nav>
  <header class="hero">
    <div class="eyebrow">Web Programming K0126_002 · Week 13_1 · Monday</div>
    <h1>React Forms &amp;<br>Controlled Components</h1>
    <p>Six missions from the Monday lecture — every form built from scratch with React state, one shared handler, inline validation and accessible markup.</p>
    <div class="meta"><span class="badge hot">6 tasks</span><span class="badge">controlled inputs</span><span class="badge">useRef</span><span class="badge">aria-*</span></div>
  </header>
  <main class="hub">
    ${TASKS.map((t) => `<a class="panel task" href="${t.file}.html">
      <div class="num">${t.icon}</div><h3>${t.title}</h3><p>${t.desc}</p>
      <span class="go">OPEN MISSION → <span style="color:var(--dim)">${t.hot}</span></span></a>`).join('\n    ')}
  </main>
  <footer class="foot">Built with React · no CDN, runs offline · open any page directly</footer>
</div>
</body>
</html>
`);

await build({
  entryPoints: Object.fromEntries(TASKS.map((t) => [`task${t.n}`, `src/entries/task${t.n}.jsx`])),
  outdir: 'dist', bundle: true, minify: true, format: 'iife', target: 'es2020',
  loader: { '.jsx': 'jsx' }, plugins: [rawPlugin],
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [],
  logLevel: 'info',
});
console.log('✓ built');
