import React, { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext.jsx";
import "./Profile.css";
import API_BASE_URL from "../../config/api.js";

const ProfilePrestataire = () => {
  const { authData, login } = useAuth();
  const [nom, setNom] = useState(authData?.nom || "");
  const [email, setEmail] = useState(authData?.email || "");
  const [message, setMessage] = useState("");

  if (!authData) return <h2>Non connecté</h2>;

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
        setMessage("Profil mis à jour");
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Erreur serveur");
    }
  }

  return (
    <div className="profile-container">
      <h1>Bienvenue, {authData.nom} (prestataire)</h1>
      <p>Email: {authData.email}</p>
      <p>Rôle: {authData.role}</p>

      <form onSubmit={handleUpdate}>
        <label>Nom</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <button type="submit">Mettre à jour</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProfilePrestataire;
