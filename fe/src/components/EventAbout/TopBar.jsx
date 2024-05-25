
import aboutIcon from "../../assets/images/remind.png"

const TopBar = ({ title }) => (
  <div className="top-bar">
    <p className="top-bar__text">{title}</p>
    <div className="top-bar__icon">
      <img
        className="top-bar__icon__img--about"
        src={aboutIcon}
        alt="Button"
      />
    </div>
  </div>
)

export default TopBar
