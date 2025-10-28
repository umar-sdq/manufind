import React from "react";
import { Popup } from "react-leaflet";
import API_BASE_URL from "../../config/api.js";

const RequestModal = ({ demande, prestataireId }) => {
  if (!demande) return null;

  const handleAccept = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/demandes/accepter/${demande.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prestataire_id: prestataireId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Demande acceptée avec succès");
        console.log("Demande mise à jour :", data);
      } else {
        alert("Erreur : " + (data.message || "Impossible d'accepter la demande"));
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <Popup>
      <div className="demande-popup-essentiel">
        <h3>{demande.categorie}</h3>
        <p className="adresse">{demande.adresse}</p>
        <p className="duree">Code Postal: {demande.code_postal}</p>
        <p className="duree">Durée estimée : {demande.duree_estimee} min</p>
        <div className="popup-actions">
          <button className="btn-accept" onClick={handleAccept}>
            Accepter
          </button>
          <button className="btn-view">Voir détails</button>
        </div>
      </div>
    </Popup>
  );
};

export default RequestModal;
