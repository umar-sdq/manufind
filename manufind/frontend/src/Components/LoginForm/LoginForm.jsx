import React from "react";
import './LoginForm.css';
const LoginForm = () => {
  return <div>
    <div className="login-form">
      <form>
        <h2> Re-Bienvenue!</h2>
        <h2>Login</h2>
        <h4>Nom d'utilisateur</h4>
        <input name="utilisateur" type="text" />
        <h4>Mot de passe</h4>
        <input name="mdp" type="password" />
        <button name="connection" type="submit"> Se connecter </button>
      </form>

    </div>

  </div>;
};

export default LoginForm;