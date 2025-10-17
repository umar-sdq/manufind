import React from "react";
import { Popup } from "react-leaflet";

const RequestModal = ({ demande }) => {
  if (!demande) return null;

  return (
    <Popup>
      <div className="demande-popup-essentiel">
        <h3>{demande.categorie}</h3>
        <p className="adresse">{demande.adresse}</p>
        <p className="duree">Code Postal: {demande.code_postal}</p>
        <p className="duree">Durée estimée : {demande.duree_estimee} min</p>
        <div className="popup-actions">
          <button className="btn-accept">Accepter</button>
          <button className="btn-view">Voir détails</button>
        </div>
      </div>
    </Popup>
  );
};

export default RequestModal;
