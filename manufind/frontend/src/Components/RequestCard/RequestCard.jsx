import React, { useState } from "react";
import { useAuth } from "../../Components/AuthContext/AuthContext.jsx";
import API_BASE_URL from "../../config/api.js";
import "./RequestCard.css";

export default function RequestCard() {
  const { authData } = useAuth();

  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [dureeEstimee, setDureeEstimee] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); 

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
    if (!userId) {
      setError("Veuillez vous connecter avant de créer une demande.");
      return;
    }

    setError("");
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

      const data = await res.json();

      if (res.ok && data.success !== false) {
        setSuccess(true);
        setError("");

        setTimeout(() => {
          setSuccess(false);
          setCategorie("");
          setDescription("");
          setAdresse("");
          setCodePostal("");
          setDateHeure("");
          setDureeEstimee("");
        }, 2500);
      } else {
        setError("Erreur lors de la soumission de la demande");
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  };

  return (
    <div className="request-page">
      <div className="request-banner">
        <h1>Créer une nouvelle demande</h1>
        <p>
          Remplissez les informations ci-dessous pour soumettre votre requête à
          nos prestataires.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        <h2>Détails de la demande</h2>

        {error && <p className="error-message">{error}</p>}

        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
        >
          <option value="" disabled hidden>
            Choisir une catégorie
          </option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
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

        <button
          type="submit"
          className={`submit-btn ${success ? "success" : ""}`}
        >
          <span className="btn-text">
            {success ? "Demande soumise" : "Soumettre"}
          </span>
        </button>
      </form>
    </div>
  );
}
