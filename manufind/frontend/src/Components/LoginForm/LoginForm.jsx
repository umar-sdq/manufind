import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "./../AuthContext/AuthContext.jsx";
import './LoginForm.css'

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: mdp }),
      });

      const data = await response.json();
      if (response.ok) {
        login({ token: data.token, user: data.user });
        if (data.user.role === "client") navigate("/profile-client");
        if (data.user.role === "prestataire") navigate("/profile-pres");
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Erreur serveur");
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h2>Re-Bienvenue!</h2>
        <h4>Nom d'utilisateur</h4>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nom d'utilisateur"
        />
        <h4>Mot de passe</h4>
        <input
          type="password"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          placeholder="Mot de passe"
        />
        <button type="submit">Se connecter</button>

        {message && <p>{message}</p>}

        <h4>
          Aucun compte? <NavLink to="/signup">Rejoindre la plateforme.</NavLink>
        </h4>
      </form>
    </div>
  );
};

export default LoginForm;
