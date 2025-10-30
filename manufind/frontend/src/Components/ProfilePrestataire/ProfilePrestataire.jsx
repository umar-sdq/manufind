import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext.jsx";
import "./Profile.css";
import API_BASE_URL from "../../config/api.js";
import { useNavigate } from "react-router-dom";

const ProfilePrestataire = () => {
  const { authData, login, logout } = useAuth();
  const [nom, setNom] = useState(authData?.nom || "");
  const [email, setEmail] = useState(authData?.email || "");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const navigate = useNavigate();

  if (!authData) return <h2>Non connecté</h2>;

  const handleMap = () => {
    navigate("/map");
  };

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: authData.id, nom, email }),
      });

      const data = await response.json();
      if (response.ok) {
        login({ ...authData, nom, email });
        setMessage("success");
        setTimeout(() => setMessage(""), 2500);
      } else {
        setMessage("error");
      }
    } catch {
      setMessage("error");
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/demandes/prestataire/${authData.id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          const demandes = data.demandes || [];
          const completed = demandes.filter((d) => d.statut === "complétée").length;
          const pending = demandes.filter((d) => d.statut === "en_attente").length;

          setStats({
            total: demandes.length,
            completed,
            pending,
          });
        }
      } catch (error) {
        console.error("Erreur récupération stats prestataire:", error);
      }
    };

    fetchStats();
  }, [authData.id]);

  return (
    <div className="profile-page">
      <div className="profile-banner">
        <h1>Bonjour, {authData.nom}</h1>
        <p>Rôle : Prestataire</p>
      </div>

      <section className="profile-info-section">
        <h2>Informations du compte</h2>
        <form className="profile-form" onSubmit={handleUpdate}>
          <div>
            <label>Nom</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`profile-save-btn ${message === "success" ? "success" : ""}`}
          >
            <span className="btn-text">
              {message === "success" ? "Sauvegardé ✅" : "Sauvegarder"}
            </span>
          </button>
        </form>
      </section>

      <section className="profile-stats-section">
        <h2>Performance</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total}</h3>
            <p>Total des requêtes</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completed}</h3>
            <p>Complétées</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pending}</h3>
            <p>En attente</p>
          </div>
        </div>

        <div className="stat-summary">
          Vous avez géré {stats.total} requêtes sur ManuFind.
          Continuez à maintenir un excellent taux de complétion
          pour améliorer votre visibilité auprès des clients.
        </div>
      </section>

      <div className="profile-actions">
        <button className="btn-main" onClick={handleMap}>
          Accéder à la carte
        </button>
        <button className="btn-alt" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default ProfilePrestataire;
