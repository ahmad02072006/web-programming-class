import{r,j as e,N,c as v}from"./Nav-Dc1xVmcR.js";/* empty css              */function y(){const[n,l]=r.useState("");return r.useEffect(()=>(document.title=n||"WebPro",()=>{document.title="WebPro"}),[n]),e.jsxs("div",{className:"grid",children:[e.jsxs("label",{className:"field",children:["Type to change the browser tab title",e.jsx("input",{className:"input",value:n,onChange:a=>l(a.target.value),placeholder:"Type to change tab title…"})]}),e.jsxs("div",{className:"s3-tab","aria-label":"Browser tab preview",children:[e.jsxs("span",{className:"s3-dots",children:[e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{})]}),e.jsxs("span",{className:"s3-tab-chip",children:["🌐 ",n||"WebPro"]})]}),e.jsxs("p",{className:"muted",style:{margin:0},children:["Look at your real browser tab: it is ",e.jsx("code",{children:"document.title"}),". Switch to another exercise (the component unmounts) and the cleanup puts it back to “WebPro”."]})]})}function S(){const[n,l]=r.useState(1),[a,d]=r.useState(!1),[c,u]=r.useState(null),[i,h]=r.useState(!0),[o,s]=r.useState(null);return r.useEffect(()=>{const t=new AbortController;async function m(){h(!0),s(null);try{const p=`https://jsonplaceholder.typicode.com/${a?"userz":"users"}/${n}`,x=await fetch(p,{signal:t.signal});if(!x.ok)throw new Error(`Failed to fetch (HTTP ${x.status})`);u(await x.json())}catch(p){if(p.name==="AbortError")return;u(null),s(p.message==="Failed to fetch"?"Network error: could not reach the server":p.message)}finally{t.signal.aborted||h(!1)}}return m(),()=>t.abort()},[n,a]),e.jsxs("div",{className:"grid",children:[e.jsxs("div",{className:"row",children:[e.jsx("span",{className:"muted",children:"User ID"}),[1,2,3,4,5].map(t=>e.jsx("button",{className:`chip ${t===n?"s3-chip-on":""}`,onClick:()=>l(t),children:t},t)),e.jsx("span",{className:"spacer"}),e.jsxs("label",{className:"row",style:{cursor:"pointer"},children:[e.jsx("input",{type:"checkbox",checked:a,onChange:t=>d(t.target.checked)}),e.jsx("span",{className:"muted",children:"Simulate error"})]})]}),i&&e.jsxs("div",{className:"row",children:[e.jsx("span",{className:"spinner"})," ",e.jsx("span",{children:"Loading…"})]}),o&&!i&&e.jsxs("div",{className:"alert err",role:"alert",children:["⚠️ Error: ",o]}),c&&!i&&e.jsxs("div",{className:"s3-user pop",children:[e.jsx("div",{className:"s3-avatar",children:c.name.split(" ").map(t=>t[0]).slice(0,2).join("")}),e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0},children:c.name}),e.jsx("a",{href:`mailto:${c.email}`,children:c.email}),e.jsxs("div",{className:"muted",style:{fontSize:".85rem"},children:[c.company?.name," · ",c.address?.city]})]})]})]})}const f=(n,l=2)=>String(n).padStart(l,"0");function j(n){const l=Math.floor(n/6e4),a=Math.floor(n%6e4/1e3),d=Math.floor(n%1e3/10);return`${f(l)}:${f(a)}.${f(d)}`}function w(){const[n,l]=r.useState(0),[a,d]=r.useState(!1),[c,u]=r.useState([]),i=r.useRef(0);r.useEffect(()=>{if(!a)return;const o=Date.now()-i.current,s=setInterval(()=>{i.current=Date.now()-o,l(i.current)},10);return()=>clearInterval(s)},[a]);function h(){d(!1),i.current=0,l(0),u([])}return e.jsxs("div",{className:"grid",style:{justifyItems:"center"},children:[e.jsx("div",{className:`s3-clock ${a?"on":""}`,role:"timer",children:j(n)}),e.jsxs("div",{className:"row",children:[e.jsx("button",{className:"btn primary",disabled:a,onClick:()=>d(!0),children:"▶ Start"}),e.jsx("button",{className:"btn",disabled:!a,onClick:()=>d(!1),children:"⏸ Stop"}),e.jsx("button",{className:"btn",disabled:!a,onClick:()=>u(o=>[i.current,...o]),children:"⚑ Lap"}),e.jsx("button",{className:"btn danger",onClick:h,children:"↺ Reset"})]}),c.length>0&&e.jsx("ol",{className:"s3-laps",children:c.map((o,s)=>e.jsxs("li",{children:[e.jsxs("span",{className:"muted",children:["Lap ",c.length-s]}),e.jsx("strong",{children:j(o)})]},c.length-s))})]})}const E={1:`function TitleEditor() {
  const [text, setText] = useState('');

  useEffect(() => {
    document.title = text || 'WebPro';
    return () => { document.title = 'WebPro'; };
  }, [text]);

  return (
    <input value={text} onChange={e => setText(e.target.value)}
      placeholder="Type to change tab title…" />
  );
}`,2:`function UserProfile() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchUser() {            // async lives INSIDE the effect
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
        if (!res.ok) throw new Error('Failed to fetch');
        setUser(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  return <div><h2>{user.name}</h2><p>{user.email}</p></div>;
}`,3:`function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);        // cleanup: stop the timer
  }, [running]);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning(true)}>Start</button>
      <button onClick={() => setRunning(false)}>Stop</button>
      <button onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button>
    </div>
  );
}`},g=[{id:1,title:"Page Title Sync",icon:"🏷️",Comp:y,task:"Build a text input whose value updates document.title. Revert the title to “WebPro” on unmount using cleanup."},{id:2,title:"Fetch a User",icon:"📡",Comp:S,task:"Fetch https://jsonplaceholder.typicode.com/users/1, display the name and email, show “Loading…” while fetching, and handle errors."},{id:3,title:"Stopwatch",icon:"⏱️",Comp:w,task:"Build a stopwatch with Start, Stop and Reset buttons. Use setInterval inside useEffect and clean it up correctly."}],b=["Explain what a side effect is and why it needs special handling","Use the dependency array to control when effects run","Write cleanup functions to prevent memory leaks","Fetch data from an API inside useEffect","Avoid the infinite loop trap"],k=[["useEffect(fn)","After every render","Usually a bug"],["useEffect(fn, [])","Once, after the first render","Fetch on load, subscribe, start timer"],["useEffect(fn, [a, b])","First render + whenever a or b changes","Re-fetch when a prop changes"]];function C(){const[n,l]=r.useState(1),[a,d]=r.useState(!1),[c,u]=r.useState(()=>{try{return JSON.parse(localStorage.getItem("sg-objectives"))??[]}catch{return[]}});r.useEffect(()=>{localStorage.setItem("sg-objectives",JSON.stringify(c))},[c]),r.useEffect(()=>{document.title="Task 3 · Study Guide Exercises"},[]);const i=g.find(s=>s.id===n),h=s=>u(t=>t.includes(s)?t.filter(m=>m!==s):[...t,s]),o=Math.round(c.length/b.length*100);return e.jsxs(e.Fragment,{children:[e.jsx(N,{current:3}),e.jsxs("main",{className:"container",children:[e.jsxs("div",{className:"page-head",children:[e.jsx("div",{className:"eyebrow",children:"Task 3 · Study guide"}),e.jsx("h1",{children:"useEffect: Exercises & Key Concepts"}),e.jsx("p",{children:"Three practice exercises from the study guide, each running live with its solution code. Track your learning objectives as you go."})]}),e.jsxs("div",{className:"grid cols-2",children:[e.jsxs("section",{className:"card",children:[e.jsxs("div",{className:"row",children:[e.jsx("h2",{style:{margin:0},children:"🎯 Learning objectives"}),e.jsx("span",{className:"spacer"}),e.jsxs("span",{className:"badge accent",children:[o,"%"]})]}),e.jsx("div",{className:"s3-bar",children:e.jsx("i",{style:{width:`${o}%`}})}),e.jsx("ul",{className:"s3-objectives",children:b.map((s,t)=>e.jsx("li",{children:e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",checked:c.includes(t),onChange:()=>h(t)}),e.jsx("span",{className:c.includes(t)?"done":"",children:s})]})},s))})]}),e.jsxs("section",{className:"card",children:[e.jsx("h2",{children:"🧭 Dependency array cheat sheet"}),e.jsxs("table",{className:"s3-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Form"}),e.jsx("th",{children:"Runs"}),e.jsx("th",{children:"Typical use"})]})}),e.jsx("tbody",{children:k.map(([s,t,m])=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:s})}),e.jsx("td",{children:t}),e.jsx("td",{className:"muted",children:m})]},s))})]}),e.jsxs("p",{className:"muted mt",style:{marginBottom:0,fontSize:".88rem"},children:["Lifecycle mapping: ",e.jsx("code",{children:"componentDidMount"})," → ",e.jsx("code",{children:"[]"})," · ",e.jsx("code",{children:"componentDidUpdate"})," → ",e.jsx("code",{children:"[dep]"})," · ",e.jsx("code",{children:"componentWillUnmount"})," → the cleanup return."]})]})]}),e.jsx("div",{className:"tabs mt",role:"tablist",children:g.map(s=>e.jsxs("button",{role:"tab","aria-selected":s.id===n,className:`tab ${s.id===n?"active":""}`,onClick:()=>{l(s.id),d(!1)},children:[s.icon," Exercise ",s.id,": ",s.title]},s.id))}),e.jsxs("section",{className:"card mt",children:[e.jsxs("div",{className:"eyebrow",children:["Exercise ",i.id]}),e.jsx("h2",{children:i.title}),e.jsxs("div",{className:"alert info",style:{marginBottom:16},children:[e.jsx("span",{children:"📝"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Task:"})," ",i.task]})]}),e.jsx(i.Comp,{}),e.jsx("div",{className:"row mt",children:e.jsxs("button",{className:"btn sm",onClick:()=>d(s=>!s),children:[a?"Hide":"Show"," solution code"]})}),a&&e.jsx("pre",{className:"code mt pop",children:e.jsx("code",{children:E[i.id]})})]},i.id),e.jsxs("section",{className:"card mt",children:[e.jsx("h2",{children:"♾️ The infinite loop trap"}),e.jsx("p",{className:"muted",children:"If an effect sets state that is also in its own dependency array, it re-runs forever. Two fixes: drop the dependency, or use the functional update form."}),e.jsxs("div",{className:"grid cols-2",children:[e.jsx("pre",{className:"code",children:e.jsx("code",{children:`// ❌ runs forever
useEffect(() => {
  setCount(count + 1);
}, [count]);`})}),e.jsx("pre",{className:"code",children:e.jsx("code",{children:`// ✅ functional update, runs once
useEffect(() => {
  setCount(c => c + 1);
}, []);`})})]})]})]})]})}v.createRoot(document.getElementById("root")).render(e.jsx(r.StrictMode,{children:e.jsx(C,{})}));
