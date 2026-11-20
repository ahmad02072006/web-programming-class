const CLASS_SITE = "https://ahmad02072006.github.io/web-programming-class/";
const CLASS_REPO = "https://github.com/ahmad02072006/web-programming-class/tree/main/";

const week = (id, label, title, description, tech, path, folder) => ({
  id, label, title, description, tech,
  demo: CLASS_SITE + path,
  github: CLASS_REPO + folder,
});

export const weeks = [
  week("w2-1", "Week 2.1", "Semantic HTML", "Header, nav, main, footer, figure, time and other semantic tags.", ["HTML"], "Web%20week%202.1/index.html", "Web%20week%202.1"),
  week("w2-2", "Week 2.2", "HTML: Build a Page that Feels Like You", "Headings, navigation, lists, image gallery and a personal contact section.", ["HTML"], "Web%20week%202.2/week2.html", "Web%20week%202.2"),
  week("w3-1", "Week 3.1", "First Pages, Better Style", "Eight assignments: profile pages, navigation, images, recipes and favorites.", ["HTML", "CSS"], "Web%20week%203.1/index.html", "Web%20week%203.1"),
  week("w3-2", "Week 3.2", "CSS Exercises", "Position, hover card, spinner, CSS variables, fixed nav, responsive grid.", ["CSS"], "Web%20week%203.2/exercise-7-portfolio-page.html", "Web%20week%203.2"),
  week("w4", "Week 4", "JavaScript: Make It Respond", "DOM, events, and six interactive practice exercises.", ["JavaScript", "HTML"], "Web%20week%204/index.html", "Web%20week%204"),
  week("w5", "Week 5", "Logic: Ask, Repeat, Count", "Conditions and loops: a grade checker and a working counter.", ["JavaScript"], "Web%20week%205/index.html", "Web%20week%205"),
  week("w6", "Week 6", "APIs: Bring Data to the Page", "Joke fetcher, posts, weather, random users, Pokedex, country explorer.", ["JavaScript", "API"], "Web%20week%206/1-joke-fetcher.html", "Web%20week%206"),
  week("w7", "Week 7", "Book Finder", "Search for books with an API.", ["JavaScript", "API"], "Web%20week%207/Book%20finder.html", "Web%20week%207"),
  week("w8", "Week 8", "Forms: Make Every Field Count", "Contact form and student registration form.", ["HTML", "JavaScript"], "Web%20week%208/contact.html", "Web%20week%208"),
  week("w9", "Week 9", "Keep the Notes Close", "Week 9 notes (PDF).", ["Performance"], "Web%20week%209/Web%20week%209.pdf", "Web%20week%209"),
  week("w9-2", "Week 9.2", "Web Performance Optimization", "Lighthouse and performance improvements.", ["HTML", "Performance"], "Web%20week%209.2/index.html", "Web%20week%209.2"),
  {
    id: "w11",
    label: "Week 11",
    title: "React Portfolio Gallery",
    description: "This site: components, props, lists, filtering and state.",
    tech: ["React", "CSS"],
    github: "https://github.com/ahmad02072006/portfolio-gallery",
    demo: "https://ahmad02072006.github.io/portfolio-gallery/",
  },
];

export const projects = [
  {
    id: 1,
    title: "Web Programming Class",
    description: "Collection of my weekly coursework and project submissions from the Web Programming class, built with HTML and CSS.",
    tech: ["HTML", "CSS"],
    github: "https://github.com/ahmad02072006/web-programming-class",
    demo: "https://ahmad02072006.github.io/web-programming-class/",
  },
  {
    id: 2,
    title: "API Atlas",
    description: "A travel hub linking four apps: trip planner, weather with travel tips, currency converter and place info. Vanilla JavaScript with a Cloudflare Worker backend.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/ahmad02072006/test-main-2",
    demo: "https://ahmad02072006.github.io/test-main-2/",
  },
  {
    id: 3,
    title: "Portfolio",
    description: "My personal portfolio website, built with plain HTML, CSS and JavaScript.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/ahmad02072006/portfolio",
    demo: "https://ahmad02072006.github.io/portfolio/",
  },
  {
    id: 4,
    title: "Book Search",
    description: "A book finder page where you can search for books.",
    tech: ["HTML", "JavaScript"],
    github: "https://github.com/ahmad02072006/webpro-book-search",
    demo: "https://ahmad02072006.github.io/webpro-book-search/",
  },
];