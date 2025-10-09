import React, { useState } from "react";
import "./SignupForm.css";
import { NavLink, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api.js";

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
      if (res.ok) {
        console.log("Inscription réussie", data);
        navigate("/login");
      } else {
        setMessage(data.error || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur.");
    }
  }

  return (
    <div className="signup-form">
      <form onSubmit={handleSubmit}>
        <h2>Bienvenue!</h2>

        <h4>Nom d'utilisateur</h4>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <h4>Adresse courriel</h4>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <h4>Mot de passe</h4>
        <input
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />

        <h4>Confirmer le mot de passe</h4>
        <input
          type="password"
          value={confirmMdp}
          onChange={(e) => setConfirmMdp(e.target.value)}
          required
        />

        <h4>Rôle</h4>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="prestataire">Prestataire</option>
        </select>

        <button type="submit">S'inscrire</button>
        <p>{message}</p>

        <h4>
          Déjà un compte? <NavLink to={"/login"}>Connectez-vous.</NavLink>
        </h4>
      </form>
    </div>
  );
};

export default SignUpForm;
