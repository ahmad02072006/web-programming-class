// Quiz content taken from the lecture slides (Quiz 1–8) — React Effects & useEffect.
// `why[k]` explains each option; `answer` is the correct letter.

export const QUIZ = [
  {
    id: 1, topic: 'When effects run',
    q: 'When does the function passed to useEffect run?',
    options: {
      A: 'During rendering, before the JSX is returned',
      B: 'After React has committed the render to the DOM (typically after paint)',
      C: 'Exactly once per page load, whatever the dependencies',
      D: 'Before every render, to prepare the props',
      E: 'Whenever the browser tab regains focus',
    },
    answer: 'B',
    why: {
      A: 'Rendering must stay a pure calculation. Effects are scheduled after the render precisely so side effects never happen during it.',
      B: 'Correct. React renders and commits first; the effect then runs, usually after the browser has painted. (useLayoutEffect is the variant that runs before paint.)',
      C: 'Only an empty array [] gives once-after-mount behaviour. With other arrays, or none, the effect may run repeatedly.',
      D: 'Props are inputs to rendering, not products of an effect. An effect reacts to a render that was already committed.',
      E: 'Window focus does not drive effects. Reacting to focus needs an event listener (itself a typical effect).',
    },
  },
  {
    id: 2, topic: 'Dependency arrays',
    q: 'Which call runs its effect after every render?',
    options: {
      A: 'useEffect(fn, [])',
      B: 'useEffect(fn, [count])',
      C: 'useEffect(fn)',
      D: 'useEffect(fn, [props.id])',
      E: 'useLayoutEffect(fn, [])',
    },
    answer: 'C',
    why: {
      A: 'An empty array means “no dependencies”: the effect runs once after mount (cleanup on unmount).',
      B: 'With [count] the effect re-runs only when count differs from the previous render.',
      C: 'Correct. Omitting the array tells React to re-run the effect after every render, which is rarely what you want.',
      D: 'Re-runs only when props.id changes; unrelated re-renders are skipped.',
      E: 'A different hook: useLayoutEffect runs before paint, and with [] only once after mount.',
    },
  },
  {
    id: 3, topic: 'async effects',
    q: 'Why should the callback passed to useEffect not be declared async?',
    options: {
      A: 'async functions cannot call fetch',
      B: 'async callbacks are forbidden anywhere inside components',
      C: 'await blocks the browser main thread until the response arrives',
      D: 'It returns a Promise, but React expects undefined or a cleanup function',
      E: 'Effects run during rendering, where await is forbidden',
    },
    answer: 'D',
    why: {
      A: 'async functions can call fetch like any other function. The problem is the return value, not the call.',
      B: 'async functions are fine elsewhere (event handlers, or defined inside the effect). Only the effect callback itself must not be async.',
      C: 'await suspends only the enclosing async function; it never blocks the browser main thread.',
      D: 'Correct. An async function always returns a Promise, so any cleanup would be lost (and React warns). Define the async function inside and call it.',
      E: 'Effects run after rendering, not during it. The restriction concerns the value the callback returns.',
    },
  },
  {
    id: 4, topic: 'Why cleanup matters',
    q: 'A component starts setInterval inside an effect with [] and returns nothing. It is then unmounted. What happens?',
    options: {
      A: 'The interval keeps firing after unmount (a leak), because only a returned cleanup can stop it',
      B: 'React automatically clears every timer when the component unmounts',
      C: 'React throws an error at unmount',
      D: 'The interval pauses and resumes at the next mount',
      E: 'The timer is cleared only in production builds',
    },
    answer: 'A',
    why: {
      A: 'Correct. Timers live in the browser, not in React. Only the cleanup function can call clearInterval.',
      B: 'React cannot know which timers you created; clearing them is the job of the cleanup function.',
      C: 'No error occurs. The problem is silent, which is exactly why it is easy to miss.',
      D: 'A timer never pauses by itself. It runs until cleared, and a remount creates an additional interval.',
      E: 'Cleanup behaviour is the same in development and production builds.',
    },
  },
  {
    id: 5, topic: 'Out-of-order responses',
    q: 'A search box fires a request for every keystroke and responses arrive out of order. Which technique best prevents a stale response from replacing a newer one?',
    options: {
      A: 'Add more variables to the dependency array',
      B: 'Wrap the fetch call in try/catch',
      C: 'Remove the dependency array so the effect runs more often',
      D: 'Call setState twice for each response',
      E: 'Return a cleanup that aborts (or ignores) the previous request',
    },
    answer: 'E',
    why: {
      A: 'More dependencies change when the effect runs, not the order in which responses arrive.',
      B: 'try/catch handles failures, not ordering. A stale response is still a successful response.',
      C: 'Running more often multiplies requests and makes out-of-order arrival more likely, not less.',
      D: 'Extra state updates cannot reorder responses; they only add needless renders.',
      E: 'Correct. The previous run’s cleanup executes before the next run, so only the latest request can update state.',
    },
  },
  {
    id: 6, topic: 'Lazy state initializer',
    q: "Which statement about useState(() => localStorage.getItem('theme') || 'light') is correct?",
    options: {
      A: 'The initializer function runs on every render',
      B: 'It re-reads localStorage whenever theme changes',
      C: 'The initializer runs only once, on the first render',
      D: 'Passing a function makes the state update asynchronous',
      E: 'localStorage cannot be read inside useState',
    },
    answer: 'C',
    why: {
      A: 'A function passed to useState is a lazy initializer: invoked only to compute the initial state, never on later renders.',
      B: 'The initial state is computed once; later renders reuse the stored state. Writing to storage when theme changes is the effect’s job.',
      C: 'Correct. React calls the initializer during the first render only, so localStorage is read once instead of on every render.',
      D: 'This form only computes the initial value. State updates are not made asynchronous by it.',
      E: 'In a browser it can be read. It is unavailable only where there is no window, e.g. during server-side rendering.',
    },
  },
  {
    id: 7, topic: 'Infinite loops',
    q: 'Which effect produces an infinite render loop?',
    code: true,
    options: {
      A: 'useEffect(() => { setCount(c => c + 1); }, []);',
      B: 'useEffect(() => { setCount(count + 1); }, [count]);',
      C: 'useEffect(() => { document.title = count; }, [count]);',
      D: 'useEffect(() => { setCount(0); }, [count]);',
      E: 'useEffect(() => { console.log(count); });',
    },
    answer: 'B',
    why: {
      A: 'Runs once after mount (twice under Strict Mode in development). The empty array prevents re-running, so there is no loop.',
      B: 'Correct. Each run sets count to a new value; count is a dependency, so the change schedules the effect again, indefinitely.',
      C: 'No state is updated inside the effect, so nothing triggers a further render: no loop.',
      D: 'Sets the same value once count is 0; React bails out when the new state is identical (Object.is), so it converges.',
      E: 'Logging does not change state. With no array it runs after every render but cannot start a cycle.',
    },
  },
  {
    id: 8, topic: 'Deriving values',
    q: 'What is the best way to compute fullName from the state variables first and last?',
    code: true,
    options: {
      A: "useEffect(() => setFullName(first + ' ' + last), [first, last])",
      B: "const [fullName] = useState(first + ' ' + last)",
      C: 'useEffect(() => { fullName = first + last; })',
      D: "const fullName = first + ' ' + last;",
      E: 'Keep fullName in state and update it from both onChange handlers',
    },
    answer: 'D',
    why: {
      A: 'Works, but is redundant: extra state, an extra render and a brief moment of inconsistency. Derive the value while rendering instead.',
      B: 'The initial value is computed only on the first render, so fullName would go stale as first or last change.',
      C: 'Assigning to a local variable inside an effect has no effect on the next render, so the value is lost.',
      D: 'Correct. A value computable from existing props or state needs neither extra state nor an effect: compute it during rendering.',
      E: 'Duplicates derived data as state; every handler must remember to update it, so the copies can drift apart.',
    },
  },
];

export const TAKEAWAYS = [
  { n: 1, title: 'useEffect runs AFTER rendering', body: 'Never during the render function. Render stays pure: props + state → JSX.' },
  { n: 2, title: 'The dependency array controls WHEN', body: '[] = once · [val] = on change · no array = every render.' },
  { n: 3, title: 'Include every value you read', body: 'List every component-scope variable used inside the effect. ESLint exhaustive-deps enforces it: trust it.' },
  { n: 4, title: 'Return a cleanup function', body: 'Prevents leaks: clear timers, abort fetches, remove listeners, unsubscribe.' },
  { n: 5, title: 'async/await: define it INSIDE', body: 'Never make the effect callback async. Define an async function inside the effect and call it.' },
];

export const CHEAT = [
  ['useEffect(fn, [])', 'once, after the first render', 'on unmount', 'initial fetch, subscribe, start a timer'],
  ['useEffect(fn, [a, b])', 'after mount and whenever a or b changes', 'before each re-run, and on unmount', 're-fetch when a prop changes'],
  ['useEffect(fn)', 'after every render', 'before every re-run', 'rarely needed (usually a bug)'],
  ['return () => { … }', '(returned from the effect)', 'runs before the next effect and on unmount', 'clear timers, abort fetches, unsubscribe'],
  ['useEffect(async () => …)', 'never do this', 'not possible: returns a Promise', 'define an async function inside and call it'],
];

export const FLASHCARDS = [
  { q: 'What is a side effect in React?', a: 'Work that reaches outside the pure render: fetch, timers, event listeners, document.title, localStorage.' },
  { q: 'When does an effect run relative to rendering?', a: 'After React commits the render to the DOM (typically after paint) — never during rendering.' },
  { q: 'What does useEffect(fn, []) do?', a: 'Runs once after the first render (mount); its cleanup runs on unmount.' },
  { q: 'What does useEffect(fn) with NO array do?', a: 'Runs after every render. Usually a bug; can cause loops if it sets state.' },
  { q: 'Why can’t the effect callback be async?', a: 'An async function returns a Promise, but React expects undefined or a cleanup function. Define the async function inside and call it.' },
  { q: 'When does the cleanup function run?', a: 'Before the next effect run (when dependencies change) and when the component unmounts.' },
  { q: 'How do you stop out-of-order (stale) responses?', a: 'Create an AbortController, pass its signal to fetch, and call controller.abort() in the cleanup.' },
  { q: 'What is the lazy state initializer?', a: 'useState(() => compute()): the function runs only on the first render, e.g. to read localStorage once.' },
  { q: 'What causes an infinite effect loop?', a: 'Setting state inside an effect whose dependency array contains that same state. Fix: functional update + [] or remove the dependency.' },
  { q: 'When should you NOT use useEffect?', a: 'For user events (use handlers) and for values derivable from props/state (compute while rendering).' },
  { q: 'What does StrictMode do to effects in development?', a: 'Intentionally runs them twice (mount → cleanup → mount) to expose missing cleanups. Production is unaffected.' },
  { q: 'Map lifecycle methods to useEffect.', a: 'componentDidMount → [] · componentDidUpdate → [dep] · componentWillUnmount → the cleanup return.' },
];
