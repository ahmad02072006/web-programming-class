import PropTypes from "prop-types";
function Section({ title, subtitle, children }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}
Section.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};
export default Section;