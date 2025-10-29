import React, { useState } from "react";
import { useAuth } from "../../Components/AuthContext/AuthContext.jsx";
import API_BASE_URL from "../../config/api.js";
import "./RequestCard.css";

const RequestCard = () => {
  const { authData } = useAuth();
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [dureeEstimee, setDureeEstimee] = useState("");
  const [showCheck, setShowCheck] = useState(false);

  const categories = [
    "Plomberie",
    "Électricité",
    "Peinture",
    "Rénovation",
    "Toiture",
    "Charpenterie",
    "Nettoyage",
    "Paysagement",
    "Déménagement",
    "Réparation automobile",
    "Climatisation et chauffage",
    "Informatique",
    "Serrurerie",
    "Maçonnerie",
    "Petits travaux",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = authData?.id || authData?._id;
    if (!userId) return console.log("⚠️ Connectez-vous avant de créer une demande.");

    const newRequest = {
      client_id: userId,
      categorie,
      description,
      adresse,
      code_postal: codePostal,
      date_heure: dateHeure || null,
      duree_estimee: dureeEstimee || 60,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/demandes/ajouter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      if (res.ok) {
        console.log("✅ Demande créée avec succès !");
        setShowCheck(true);
        setCategorie("");
        setDescription("");
        setAdresse("");
        setCodePostal("");
        setDateHeure("");
        setTimeout(() => setShowCheck(false), 2500);
      }
    } catch (error) {
      console.log("⚠️ Erreur serveur.", error);
    }
  };

  return (
    <div className="request-container">
      <form onSubmit={handleSubmit} className="request-form">
        <h1>Nouvelle demande</h1>

        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
        >
          <option value="" disabled hidden>
            Catégorie
          </option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Code postal"
          value={codePostal}
          onChange={(e) => setCodePostal(e.target.value)}
          required
        />

        <input
          type="datetime-local"
          value={dateHeure}
          onChange={(e) => setDateHeure(e.target.value)}
        />

        <input
          type="number"
          placeholder="Durée estimée (minutes)"
          value={dureeEstimee}
          onChange={(e) => setDureeEstimee(e.target.value)}
          min="15"
          max="480"
        />

        <button type="submit">Soumettre</button>
      </form>

      {showCheck && (
        <div className="check-overlay">
          <div className="checkmark-container">
            <div className="checkmark"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
