import React from "react";
import { useNavigate } from "react-router-dom";
import "./Guide.css";
import signupClient from "../../assets/images/signup-client.png";
import main from "../../assets/images/main.png"; 
export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="guide-container">
      <h1>Centre de guide ManuFind</h1>
      <p className="guide-intro">
        Apprenez comment utiliser ManuFind, que vous soyez prestataire ou client. 
        Découvrez comment publier, accepter et gérer vos requêtes en quelques étapes simples.
      </p>

      <div className="guide-sections">
        <div className="guide-card" onClick={() => navigate("/tuto-pres")}>
          <img src={main} alt="Aperçu guide prestataire" className="guide-img" />
          <h2>Guide Prestataire</h2>
          <p>
            Découvrez comment accepter des demandes, gérer vos requêtes et utiliser la carte interactive pour trouver des clients proches de vous.
          </p>
          <button className="guide-btn">Voir le guide</button>
        </div>

        <div className="guide-card" onClick={() => navigate("/tuto-client")}>
          <img src={signupClient} alt="Aperçu guide client" className="guide-img" />
          <h2>Guide Client</h2>
          <p>
            Apprenez à créer un compte, soumettre vos requêtes et suivre vos demandes depuis votre espace personnel.
          </p>
          <button className="guide-btn">Voir le guide</button>
        </div>
      </div>
    </div>
  );
}
