import React from "react";
import './SignupForm.css';
import { NavLink } from "react-router-dom";
const SignUpForm = () => {
  return <div>
    Nom d'utilisateur
    Email
    Mot de passe
    Confirmer mot de passe
    S'inscrire
    <div className="signup-form">
    <form>
      <h2>Bienvenue!</h2>
      <h4>Nom d'utilisateur</h4>
      <input name="utilisateur" type="text"  />
      <h4>Adresse courriel</h4>
      <input name="Email" type="text"  />
      <h4>Mot de passe</h4>
      <input name="mdp" type="password" />
      <h4>Confirmer le mot de passe</h4>
      <input name="mdp" type="password"  />
      <button name="connection" type="submit"> S'inscrire </button>
      <h4>Deja un compte? <NavLink to={"/login"}>Connectez vous.</NavLink></h4>

    </form>
    
    </div>
    
  </div>;
};

export default SignUpForm;