import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import API_BASE_URL from "../../config/api.js";
import "./RequestClientTab.css"; // même style que RequestTab.css

const RequestClientTab = () => {
  const { authData } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchClientDemandes = async () => {
      if (!authData?.id) return;

      try {
        const response = await fetch(`${API_BASE_URL}/demandes/client/${authData.id}`);
        const result = await response.json();

        if (result.success) setDemandes(result.demandes);
        else setDemandes([]);
      } catch (err) {
        console.error("⚠️ Erreur lors de la récupération des demandes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDemandes();
  }, [authData]);

  // 🔹 Afficher la fenêtre de confirmation
  const confirmCancelRequest = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  // 🔹 Fermer la fenêtre
  const cancelCancelRequest = () => {
    setSelectedId(null);
    setShowConfirm(false);
  };

  // 🔹 Supprimer la demande
  const handleCancelRequest = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/demandes/supprimer/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        // Mettre à jour la liste localement
        setDemandes((prev) => prev.filter((d) => d.id !== id));
      } else {
        console.error("Erreur :", result.message);
      }
    } catch (err) {
      console.error("⚠️ Erreur lors de la suppression :", err);
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="request-tab-container">
      <h1 className="request-tab-title">Mes requêtes soumises</h1>

      {loading ? (
        <p className="loading-text">Chargement...</p>
      ) : demandes.length === 0 ? (
        <p className="no-demandes-text">Aucune requête pour l’instant.</p>
      ) : (
        <div className="demandes-list">
          {demandes.map((d) => (
            <div key={d.id} className="demande-card">
              <div className="demande-header">
                <h3 className="demande-categorie">{d.categorie}</h3>
                <p className={`statut statut-${d.statut}`}>
  Statut :{" "}
  <span>
    {d.statut === "en_attente"
      ? "En attente"
      : d.statut === "acceptee"
      ? "Acceptée"
      : d.statut === "terminee"
      ? "Terminée"
      : d.statut === "annulee"
      ? "Annulée"
      : d.statut}
  </span>
</p>
              </div>

              <p className="demande-description">{d.description}</p>
              <p><strong>Adresse :</strong> {d.adresse}</p>
              <p><strong>Date :</strong> {d.date_heure}</p>
              <p><strong>Durée estimée :</strong> {d.duree_estimee} min</p>

              {d.prestataire && (
                <p><strong>Prestataire :</strong> {d.prestataire.nom}</p>
              )}

              <button
                className="btn-cancel"
                onClick={() => confirmCancelRequest(d.id)}
              >
                Annuler la requête
              </button>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h2>Confirmation</h2>
            <p>Voulez-vous vraiment annuler cette requête ?</p>
            <div className="confirm-actions">
              <button
                onClick={() => handleCancelRequest(selectedId)}
                className="btn-yes"
              >
                Oui, annuler
              </button>
              <button onClick={cancelCancelRequest} className="btn-no">
                Non, garder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestClientTab;
