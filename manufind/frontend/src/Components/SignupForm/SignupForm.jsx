import React from "react";

const SignUpForm = () => {
  return <div>
    <input name="utilisateur" type="text" placeholder="Nom d'utilisateur" />
    <input name="Email" type="text" placeholder="Email" />
    <input name="mdp" type="password" placeholder="Mot de passe" />
    <input name="mdp" type="password" placeholder="Confirmer mot de passe" />
    <button name="connection" type="submit"> S'inscrire </button>

  </div>;
};

export default SignUpForm;