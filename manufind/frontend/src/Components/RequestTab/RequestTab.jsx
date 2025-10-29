import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext.jsx";
import API_BASE_URL from "../../config/api.js";
import "./RequestTab.css";

const RequestTab = () => {
  const { authData } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ✅ Fonction suppression
  const handleComplete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/demandes/supprimer/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setDemandes((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert("❌ Erreur : " + result.message);
      }
    } catch (err) {
      alert("⚠️ Erreur serveur : " + err.message);
    }
  };

  // ✅ Ouvre le modal
  const confirmCompletion = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  // ✅ Ferme le modal sans rien faire
  const cancelCompletion = () => {
    setSelectedId(null);
    setShowConfirm(false);
  };

  // ✅ Confirme la suppression
  const confirmDelete = () => {
    if (selectedId) handleComplete(selectedId);
    setShowConfirm(false);
  };

  useEffect(() => {
    const fetchAcceptedDemandes = async () => {
      if (!authData?.id) return;
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/demandes/prestataire/${authData.id}`
        );
        const result = await response.json();

        if (result.success) setDemandes(result.demandes);
        else setDemandes([]);
      } catch (err) {
        console.error("Erreur lors du chargement des demandes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedDemandes();
  }, [authData]);

  return (
    <div className="request-tab-container">
      <h1>Demandes Acceptées</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : demandes.length === 0 ? (
        <p>Aucune demande acceptée pour l’instant.</p>
      ) : (
        <div className="demandes-list">
          {demandes.map((d) => (
            <div key={d.id} className="demande-card">
              <h3>{d.categorie}</h3>
              <p>{d.description}</p>
              <p><strong>Adresse :</strong> {d.adresse}</p>
              <p><strong>Date :</strong> {d.date_heure}</p>
              <p><strong>Durée estimée :</strong> {d.duree_estimee} min</p>
              <p className={`statut statut-${d.statut}`}>
                Statut : {d.statut}
              </p>
              {d.client && <p><strong>Client :</strong> {d.client.nom}</p>}

              <button
                className="btn-complete"
                onClick={() => confirmCompletion(d.id)}
              >
                Compléter le service
              </button>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h2>Confirmer la complétion</h2>
            <p>Voulez-vous vraiment marquer ce service comme complété ?</p>
            <div className="confirm-actions">
              <button onClick={confirmDelete} className="btn-yes">Oui</button>
              <button onClick={cancelCompletion} className="btn-no">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTab;
