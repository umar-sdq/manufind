import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext.jsx";
import API_BASE_URL from "../../config/api.js";
import { useNavigate } from "react-router-dom";

const ProfileClient = () => {
  const { authData, login, logout } = useAuth();
  const [nom, setNom] = useState(authData?.nom || "");
  const [email, setEmail] = useState(authData?.email || "");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const navigate = useNavigate();

  if (!authData) return <h2>Non connecté</h2>;

  const handleDemandes = () => {
    navigate("/requests-client");
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
        const res = await fetch(`${API_BASE_URL}/demandes/client/${authData.id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          const demandes = data.demandes || [];
          const completed = demandes.filter(d => d.statut === "complétée").length;
          const pending = demandes.filter(d => d.statut === "en_attente").length;

          setStats({
            total: demandes.length,
            completed,
            pending,
          });
        }
      } catch (error) {
        console.error("Erreur récupération stats:", error);
      }
    };

    fetchStats();
  }, [authData.id]);

  return (
    <div className="profile-page">
      <div className="profile-banner">
        <h1>Bienvenue, {authData.nom}</h1>
        <p>Rôle : Client</p>
      </div>

      <section className="profile-info-section">
        <h2>Informations personnelles</h2>
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
              {message === "success" ? "Mise à jour réussie" : "Mettre à jour"}
            </span>
          </button>
        </form>
      </section>

      <section className="profile-stats-section">
        <h2>Résumé d'activité</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total}</h3>
            <p>Requêtes totales</p>
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
          Vous avez un total de {stats.total} requêtes sur ManuFind. Continuez à explorer
          de nouveaux services et à collaborer avec nos prestataires locaux.
        </div>
      </section>

      <div className="profile-actions">
        <button className="btn-main" onClick={handleDemandes}>
          Voir mes requêtes
        </button>
        <button className="btn-alt" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default ProfileClient;
