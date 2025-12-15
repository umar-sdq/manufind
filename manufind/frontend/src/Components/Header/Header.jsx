import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/ManuFind.png";
import { useAuth } from "../AuthContext/AuthContext";
import { useState } from "react";

const Header = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleLogoutSide = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const role = authData?.role;

  return (
    <>
      <div className="header">
        <div className="titre">
          <img src={logo} alt="ManuFind Logo" className="header-logo" />
          <NavLink to={"/"}>ManuFind</NavLink>
        </div>

        <div className={`burger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
  <div></div>
  <div></div>
  <div></div>
</div>


        <div className="nav-links desktop">
          <NavLink to={"/services"}>Services</NavLink>
          <NavLink to={"/guide"}>Guide</NavLink>
          {role === "prestataire" && <NavLink to={"/map"}>Map</NavLink>}
          {role === "prestataire" && <NavLink to={"/requests"}>Requêtes</NavLink>}
          {role === "client" && <NavLink to={"/request-service"}>Requête</NavLink>}
          {role === "client" && <NavLink to={"/requests-client"}>Soumises</NavLink>}
        </div>

        <div className="account-links desktop">
          {authData ? (
            <>
              <NavLink to={role === "client" ? "/profile-client" : "/profile-pres"}>
                Profil
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

      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <NavLink to={"/"} onClick={() => setMenuOpen(false)}> <h2>ManuFind</h2></NavLink>
        <NavLink to={"/services"} onClick={() => setMenuOpen(false)}>Services</NavLink>
          <NavLink to={"/guide"}onClick={() => setMenuOpen(false)}>Guide</NavLink>

        {authData ? (
          <>
            {role === "prestataire" && <NavLink to={"/map"}onClick={() => setMenuOpen(false)}>Map</NavLink>}
            {role === "prestataire" && <NavLink to={"/requests"}onClick={() => setMenuOpen(false)}>Requêtes</NavLink>}
            {role === "client" && <NavLink to={"/request-service"}onClick={() => setMenuOpen(false)}>Requête</NavLink>}
            {role === "client" && <NavLink to={"/requests-client"}onClick={() => setMenuOpen(false)}>Soumises</NavLink>}
            <NavLink to={role === "client" ? "/profile-client" : "/profile-pres"}>Profil</NavLink>
            <button onClick={handleLogoutSide} className="logout-btn">
            Déconnexion
            </button>
          </>
        ) : (
          <>
            <NavLink to={"/login"} onClick={() => setMenuOpen(false)}>Connexion</NavLink>
            <NavLink to={"/signup"}onClick={() => setMenuOpen(false)}>Inscription</NavLink>
          </>
        )}
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default Header;
