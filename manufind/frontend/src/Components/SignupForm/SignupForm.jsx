import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api.js";
import "./SignupForm.css";

const SignUpForm = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmMdp, setConfirmMdp] = useState("");
  const [role, setRole] = useState("client");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (motDePasse !== confirmMdp) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, mot_de_passe: motDePasse, role }),
      });

      const data = await res.json();
      if (res.ok) navigate("/login");
      else setMessage(data.error || "Erreur lors de l'inscription.");
    } catch {
      setMessage("Erreur serveur.");
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-form-section">
        <h1>Créer un compte</h1>
        <p className="subtitle">
          Rejoignez ManuFind et commencez à offrir ou demander des services
          dès aujourd’hui.
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label>Adresse courriel</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />

          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmMdp}
            onChange={(e) => setConfirmMdp(e.target.value)}
            required
          />

          <label>Rôle</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="prestataire">Prestataire</option>
          </select>

          {message && <p className="error-message">{message}</p>}

          <button type="submit">S'inscrire</button>

          <p className="redirect-text">
            Déjà un compte? <NavLink to="/login">Se connecter</NavLink>
          </p>
        </form>
      </div>

      <div className="signup-info-section">
        <h2>Pourquoi choisir ManuFind ?</h2>
        <p>
          Une plateforme moderne pour connecter les gens, faciliter les échanges
          et créer des opportunités locales.
        </p>
        <ul>
          <li>Trouvez rapidement des experts</li>
          <li>Boostez votre activité</li>
          <li>Interface fluide et intuitive</li>
        </ul>
      </div>
    </div>
  );
};

export default SignUpForm;
