import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Components/AuthContext/AuthContext.jsx";
import API_BASE_URL from "../../config/api.js";

const RequestCard = () => {
  const { authData } = useAuth();
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [dateHeure, setDateHeure] = useState(""); 
  const [dureeEstimee, setDureeEstimee] = useState(60); 
  const [message, setMessage] = useState("");

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

    const userId = authData?.user?.id || authData?.user?._id;
    if (!userId) {
      setMessage("Veuillez vous connecter avant de créer une demande.");
      return;
    }

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
        setMessage("✅ Demande créée avec succès !");
        setCategorie("");
        setDescription("");
        setAdresse("");
        setCodePostal("");
        setDateHeure("");
      } else {
        const err = await res.json();
        setMessage("❌ Erreur : " + (err.message || "Création échouée"));
      }
    } catch (error) {
      setMessage("⚠️ Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h2>Demande de service</h2>

        <h4>Catégorie de service</h4>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <h4>Description</h4>
        <input
          type="text"
          placeholder="Décrivez votre demande"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <h4>Adresse</h4>
        <input
          type="text"
          placeholder="Adresse complète"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />

        <h4>Code postal</h4>
        <input
          type="text"
          placeholder="Ex: H7N 2Y5"
          value={codePostal}
          onChange={(e) => setCodePostal(e.target.value)}
          required
        />

        <h4>Date et heure (optionnel)</h4>
        <input
          type="datetime-local"
          value={dateHeure}
          onChange={(e) => setDateHeure(e.target.value)}
        />

        <h4>Durée estimée (minutes)</h4>
        <input
          type="number"
          value={dureeEstimee}
          onChange={(e) => setDureeEstimee(e.target.value)}
          min="15"
          max="480"
        />

        <button type="submit">Créer la demande</button>
        {message && <p>{message}</p>}

        <h4>
          Pas encore membre ? <NavLink to="/signup">Créer un compte.</NavLink>
        </h4>
        <h4>
          Déjà membre ? <NavLink to="/login">Se connecter.</NavLink>
        </h4>
      </form>
    </div>
  );
};

export default RequestCard;
