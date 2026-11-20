import PropTypes from "prop-types";

function TechChips({ tech = [] }) {
  return (
    <div className="chips">
      {tech.map((t) => (
        <span className="chip" key={t}>
          {t}
        </span>
      ))}
    </div>
  );
}

TechChips.propTypes = {
  tech: PropTypes.arrayOf(PropTypes.string),
};

export default TechChips;