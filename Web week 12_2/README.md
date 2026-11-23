# Week 12_2 · React Effects & useEffect (Homework)

Five separate mini-apps (React 19 + Vite), one folder each:

| # | Folder | What it is |
|---|--------|------------|
| 1 | `task1-weather` | Weather Dashboard (Open-Meteo, city search + coordinates + geolocation bonus) |
| 2 | `task2-github` | GitHub User Lookup (debounce 500 ms, loading, 404, abort previous request) |
| 3 | `task3-study-guide` | Study-guide exercises: title sync, fetch user, stopwatch |
| 4 | `task4-effects-lab` | Effects lifecycle & patterns lab (6 interactive experiments) |
| 5 | `task5-sprint-quiz` | Sprint quiz (8 Qs from the slides) + concept mastery / flashcards |

## Run locally
```bash
npm install
npm run dev        # open the printed http://localhost:5173
```

## Build (creates ./dist, which is committed and deployed)
```bash
npm run build
```
Open: `dist/index.html` is the hub page linking to all 5 tasks.

## Deploy with GitHub Pages
Settings → Pages → Deploy from a branch → pick your branch, folder `/ (root)`.
Live URL: `https://<user>.github.io/<repo>/week12_2/dist/`
