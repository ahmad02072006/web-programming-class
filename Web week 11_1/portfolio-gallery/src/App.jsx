import { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import ProjectList from "./ProjectList";
import Section from "./Section";
import ProfileCard from "./ProfileCard";
import { weeks, projects } from "./data";
import "./App.css";

const allItems = [...weeks, ...projects];
const filters = ["All", ...new Set(allItems.flatMap((p) => p.tech))];

function matches(item, selected, query) {
  const techOk = selected === "All" || item.tech.includes(selected);
  const q = query.trim().toLowerCase();
  const textOk =
    q === "" ||
    item.title.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q);
  return techOk && textOk;
}

function App() {
  const [selected, setSelected] = useState("All");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const visibleWeeks = weeks.filter((w) => matches(w, selected, query));
  const visibleProjects = projects.filter((p) => matches(p, selected, query));

  return (
    <div className="app">
      <header className="hero">
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? "Light mode" : "Dark mode"}
        </button>
        <h1>Ahmad's Portfolio</h1>
        <p>Every week of my Web Programming class, plus my projects, in one place</p>
      </header>
      <ProfileCard
  name="Ochilov Akhmadjon"
  role="Web Programming student"
  university="Gachon University"
  skills={["HTML", "CSS", "JavaScript", "React"]}
  available={true}
/>
      <input
        className="search"
        type="search"
        placeholder="Search weeks and projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <FilterBar options={filters} selected={selected} onSelect={setSelected} />
      <p className="count">
        Showing {visibleWeeks.length + visibleProjects.length} of {allItems.length} items
      </p>

      <Section title="Course Weeks" subtitle="Open any week's tasks (Weeks 2 to 11)">
        <ProjectList projects={visibleWeeks} />
      </Section>

      <Section title="Projects" subtitle="Things I built beyond the weekly tasks">
        <ProjectList projects={visibleProjects} />
      </Section>

      <footer className="footer">
        © 2026 Ahmad · Web Programming K0126_002 · Built with React + Vite
      </footer>
    </div>
  );
}

export default App;