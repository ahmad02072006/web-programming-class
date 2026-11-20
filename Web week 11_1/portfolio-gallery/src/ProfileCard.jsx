import PropTypes from "prop-types";
import TechChips from "./TechChips";

function ProfileCard({ name, role, university, skills = [], available = false }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <div className="profile">
      <div className="avatar">{initials}</div>
      <div>
        <h2>{name}</h2>
        <p className="role">
          {role} · {university}
        </p>
        <p className={available ? "status on" : "status off"}>
          {available ? "Open to collaboration" : "Currently studying"}
        </p>
        <TechChips tech={skills} />
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  university: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string),
  available: PropTypes.bool,
};

export default ProfileCard;