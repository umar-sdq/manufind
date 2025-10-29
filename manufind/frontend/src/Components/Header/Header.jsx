import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/ManuFind.png";
import { useAuth } from "../AuthContext/AuthContext";

const Header = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  const role = authData?.role;

  return (
    <div className="header">
      <div className="titre">
        <img src={logo} alt="ManuFind Logo" className="header-logo" />
        <NavLink to={"/"}>Manufind</NavLink>
      </div>

      <div className="nav-links">
        <NavLink to={"/services"}>Services</NavLink>
        <NavLink to={"/services"}>Prestataire</NavLink>
        <NavLink to={"/services"}>Client</NavLink>

        {role === "prestataire" && <NavLink to={"/map"}>Map</NavLink>}
        {role === "prestataire" && <NavLink to={"/requests"}>Requêtes acceptées</NavLink>}
        {role === "client" && <NavLink to={"/request-service"}>Requête</NavLink>}
        {role === "client" && <NavLink to={"/requests-client"}>Requête soûmises</NavLink>}
      </div>

      <div className="account-links">
        {authData ? (
          <>
            <NavLink to={role === "client" ? "/profile-client" : "/profile-pres"}>
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
