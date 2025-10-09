import "./Header.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/ManuFind.png";

const Header = () => {
  const { authData, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="header">
      <div className="titre">
        <img src={logo} alt="ManuFind Logo" className="header-logo" />
        <h3>Manufind</h3>
      </div>
      <div>
        <NavLink to={"/"}>Accueil</NavLink>
        <NavLink to={"/about"}>A propos</NavLink>
        <NavLink to={"/contact"}>Contact</NavLink>
        <NavLink to={"/services"}>Services</NavLink>
        {authData && authData.user.role === "prestataire" && (
          <NavLink to={"/map"}>Map</NavLink>
        )}
        {authData && authData.user.role === "client" && (
          <NavLink to={"/request-service"}>Requête</NavLink>
        )}
      </div>
      <div className="account-links">
        {authData ? (
          <>
            <NavLink
              to={
                authData.user.role === "client"
                  ? "/profile-client"
                  : "/profile-pres"
              }
            >
              Mon Profil
            </NavLink>
            <button onClick={handleLogout} className="logout-btn">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <NavLink to={"/login"}>Connexion</NavLink>
            <NavLink to={"/signup"}>Inscription</NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
