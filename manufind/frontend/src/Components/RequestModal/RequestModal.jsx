import React, { useState } from "react";
import { Popup } from "react-leaflet";
import API_BASE_URL from "../../config/api.js";
import { useAuth } from "../AuthContext/AuthContext.jsx";

const RequestModal = ({ demande, onAccept }) => {
  const { authData } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!demande) return null;

  const handleAccept = async () => {
    try {
      if (!authData || !authData.id) {
        console.error("Erreur : aucun prestataire connecté.");
        return;
      }

      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/demandes/accepter/${demande.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prestataire_id: authData.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setTimeout(() => {
          setLoading(false);
          if (onAccept) onAccept(demande.id);
        }, 1500);
      } else {
        console.error("Erreur : " + (data.message || "Impossible d'accepter la demande"));
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
      setLoading(false);
    }
  };

  return (
    <Popup>
      <div className="demande-popup-essentiel">
        <h3>{demande.categorie}</h3>
        <p className="adresse">{demande.adresse}</p>
        <p className="duree">Code Postal : {demande.code_postal}</p>
        <p className="duree">Durée estimée : {demande.duree_estimee} min</p>

        <div className="popup-actions">
          <button
            className={`btn-accept ${loading ? "fade-out" : ""}`}
            onClick={!loading ? handleAccept : undefined}
            disabled={loading}
          >
            Accepter
          </button>

          <button className="btn-view">Voir détails</button>
        </div>
      </div>
    </Popup>
  );
};

export default RequestModal;
