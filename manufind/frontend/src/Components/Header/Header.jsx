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
          <NavLink to="/">ManuFind</NavLink>
        </div>

        <div
          className={`burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* 🔹 NAVBAR DESKTOP */}
        <div className="nav-links desktop">
          <NavLink data-cy="nav-services" to="/services">
            Services
          </NavLink>

          <NavLink data-cy="nav-guide" to="/guide">
            Guide
          </NavLink>

          {role === "prestataire" && (
            <NavLink data-cy="nav-map" to="/map">
              Map
            </NavLink>
          )}

          {role === "prestataire" && (
            <NavLink data-cy="nav-requests-prestataire" to="/requests">
              Requêtes
            </NavLink>
          )}

          {role === "client" && (
            <NavLink data-cy="nav-request" to="/request-service">
              Requête
            </NavLink>
          )}

          {role === "client" && (
            <NavLink data-cy="nav-submissions" to="/requests-client">
              Soumises
            </NavLink>
          )}
        </div>

        {/* 🔹 COMPTE DESKTOP */}
        <div className="account-links desktop">
          {authData ? (
            <>
              <NavLink
                data-cy="nav-profile"
                to={role === "client" ? "/profile-client" : "/profile-pres"}
              >
                Profil
              </NavLink>

              <button
                data-cy="nav-logout"
                onClick={handleLogout}
                className="logout-btn"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink data-cy="nav-login" to="/login">
                Connexion
              </NavLink>

              <NavLink data-cy="nav-signup" to="/signup">
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* 🔹 SIDEBAR MOBILE */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <h2>ManuFind</h2>
        </NavLink>

        <NavLink
          data-cy="side-services"
          to="/services"
          onClick={() => setMenuOpen(false)}
        >
          Services
        </NavLink>

        <NavLink
          data-cy="side-guide"
          to="/guide"
          onClick={() => setMenuOpen(false)}
        >
          Guide
        </NavLink>

        {authData ? (
          <>
            {role === "prestataire" && (
              <NavLink
                data-cy="side-map"
                to="/map"
                onClick={() => setMenuOpen(false)}
              >
                Map
              </NavLink>
            )}

            {role === "prestataire" && (
              <NavLink
                data-cy="side-requests-prestataire"
                to="/requests"
                onClick={() => setMenuOpen(false)}
              >
                Requêtes
              </NavLink>
            )}

            {role === "client" && (
              <NavLink
                data-cy="side-request"
                to="/request-service"
                onClick={() => setMenuOpen(false)}
              >
                Requête
              </NavLink>
            )}

            {role === "client" && (
              <NavLink
                data-cy="side-submissions"
                to="/requests-client"
                onClick={() => setMenuOpen(false)}
              >
                Soumises
              </NavLink>
            )}

            <NavLink
              data-cy="side-profile"
              to={role === "client" ? "/profile-client" : "/profile-pres"}
              onClick={() => setMenuOpen(false)}
            >
              Profil
            </NavLink>

            <button
              data-cy="side-logout"
              onClick={handleLogoutSide}
              className="logout-btn"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <NavLink
              data-cy="side-login"
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </NavLink>

            <NavLink
              data-cy="side-signup"
              to="/signup"
              onClick={() => setMenuOpen(false)}
            >
              Inscription
            </NavLink>
          </>
        )}
      </div>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  );
};

export default Header;
