import PropTypes from "prop-types";

function CardLinks({ github, demo }) {
  return (
    <div className="links">
      {demo && (
        <a className="btn primary" href={demo} target="_blank" rel="noreferrer">
          Live Demo
        </a>
      )}
      {github && (
        <a className="btn" href={github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      )}
    </div>
  );
}

CardLinks.propTypes = {
  github: PropTypes.string,
  demo: PropTypes.string,
};

export default CardLinks;