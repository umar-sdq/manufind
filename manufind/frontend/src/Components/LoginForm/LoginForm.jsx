import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext.jsx";
import API_BASE_URL from "../../config/api.js";
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setmotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);

        const role = data.user.role.toLowerCase();
        navigate(role === "client" ? "/profile-client" : "/profile-pres");
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Erreur serveur");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-form-section">
          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">
            Accédez à votre espace ManuFind et gérez vos services simplement.
          </p>

          {/* 🔐 FORMULAIRE LOGIN */}
          <form
            data-cy="login-form"
            onSubmit={handleSubmit}
            className="login-form"
          >
            <label htmlFor="email">Adresse courriel</label>
            <input
              data-cy="email"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@courriel.com"
              required
            />

            <label htmlFor="password">Mot de passe</label>
            <input
              data-cy="password"
              id="password"
              name="password"
              type="password"
              value={motDePasse}
              onChange={(e) => setmotDePasse(e.target.value)}
              placeholder="••••••••"
              required
            />

            {message && (
              <p data-cy="login-error" className="error-message">
                {message}
              </p>
            )}

            <button data-cy="login-submit" type="submit">
              Se connecter
            </button>

            <p className="redirect-text">
              Pas encore inscrit ?{" "}
              <NavLink data-cy="go-signup" to="/signup">
                Créer un compte.
              </NavLink>
            </p>
          </form>
        </div>

        {/* 🔹 SECTION INFO */}
        <div className="login-info-section">
          <h2>Re-bienvenue sur ManuFind</h2>
          <p>
            Trouvez des professionnels fiables ou proposez vos services
            rapidement. La plateforme qui connecte clients et travailleurs de
            confiance.
          </p>
          <ul>
            <li>Trouvez de l’aide près de chez vous</li>
            <li>Gagnez de nouveaux clients facilement</li>
            <li>Une interface simple et moderne</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
