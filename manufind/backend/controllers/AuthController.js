import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/UserModel.js";

export const signup = async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  try {
    const hash = await bcrypt.hash(mot_de_passe, 10);
    await db.execute(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)",
      [nom, email, hash, role]
    );
    res.json({ message: "Compte créé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage || "Erreur serveur" });
  }
};

export const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const [results] = await db.execute(
      "SELECT * FROM utilisateurs WHERE email = ?",
      [email]
    );
    if (results.length === 0)
      return res.status(401).json({ error: "Utilisateur introuvable" });

    const user = results[0];
    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!valid) return res.status(401).json({ error: "Mot de passe invalide" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
    });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateUser = async (req, res) => {
  const { id, nom, email } = req.body;

  if (!id || !nom || !email) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    await db.execute(
      "UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?",
      [nom, email, id]
    );
    res.json({ message: "Profil mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage || "Erreur serveur" });
  }
};
