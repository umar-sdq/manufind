import React, { useState } from "react";
import "./LoginForm.css";
import { NavLink, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const reponse = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          mot_de_passe: mdp,
        }),
      });

      const data = await reponse.json();

      if (reponse.ok) {
        console.log("Connexion réussie:", data);
        console.log("Token JWT:", data.token);
        navigate("/");
      } else {
        setMessage(data.error || "Identifiants invalides");
      }
    } catch (err) {
      setMessage("Erreur serveur");
      console.error(err);
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h2>Re-Bienvenue!</h2>
        <h4>Nom d'utilisateur</h4>
        <input
          name="utilisateur"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nom d'utilisateur"
        />
        <h4>Mot de passe</h4>
        <input
          name="mdp"
          type="password"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          placeholder="Mot de passe"
        />
        <button name="connection" type="submit">
          Se connecter
        </button>

        {message && <p>{message}</p>}

        <h4>
          Aucun compte?{" "}
          <NavLink to="/signup">Rejoindre la plateforme.</NavLink>
        </h4>
      </form>
    </div>
  );
};

export default LoginForm;
