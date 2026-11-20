import PropTypes from "prop-types";
import TechChips from "./TechChips";
import CardLinks from "./CardLinks";

function ProjectCard({ title = "Untitled", description = "", tech = [], github, demo, label }) {
  return (
    <div className="card">
      {label && <span className="badge">{label}</span>}
      <h3>{title}</h3>
      <p className="desc">{description}</p>
      <TechChips tech={tech} />
      <CardLinks github={github} demo={demo} />
    </div>
  );
}

ProjectCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  tech: PropTypes.arrayOf(PropTypes.string),
  github: PropTypes.string,
  demo: PropTypes.string,
  label: PropTypes.string,
};

export default ProjectCard;