import "./Header.css";
import { NavLink } from "react-router-dom";


const Header = () => {
  return (
    
    <div className="header">

    <div className="titre">
    <h3>Manufind</h3>
    </div>
    <div >
    <NavLink to={"/"}>Accueil</NavLink>
    <NavLink to={"/about"}>A propos</NavLink>
    <NavLink to={"/contact"}>Contact</NavLink>
    <NavLink to={"/services"}>Services</NavLink>
    
    </div>
    <div className="account-links">    
    <NavLink to={"/login"}>Connexion</NavLink>
    <NavLink to={"/signup"}>Inscription</NavLink>
    </div>
    

    </div>

  );
}

export default Header;