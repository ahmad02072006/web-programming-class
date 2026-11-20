import PropTypes from "prop-types";
function FilterBar({ options, selected, onSelect }) {
  return (
    <div className="filter-bar">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={opt === selected ? "active" : ""}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
FilterBar.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
export default FilterBar;