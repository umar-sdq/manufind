import React from "react";
import './LoginForm.css';
const LoginForm = () => {
  return <div className="login-form">
    <form>
      <input name="utilisateur" type="text" placeholder="Nom d'utilisateur" />
      <input name="mdp" type="password" placeholder="Mot de passe" />
      <button name="connection" type="submit"> Se connecter </button>
    </form>
    
  </div>;
};

export default LoginForm;