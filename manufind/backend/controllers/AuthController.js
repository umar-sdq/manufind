import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/UserModel.js";

export const signup = async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  try {
    const hash = await bcrypt.hash(mot_de_passe, 10);
    db.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)",
      [nom, email, hash, role],
      (err) => {
        if (err) return res.status(500).json({ error: err.sqlMessage || "Erreur serveur" });
        res.json({ message: "Compte créé avec succès" });
      }
    );
  } catch {
    res.status(500).json({ error: "Erreur interne" });
  }
};

export const login = (req, res) => {
  const { email, mot_de_passe } = req.body;
  db.query("SELECT * FROM utilisateurs WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    if (results.length === 0) return res.status(401).json({ error: "Utilisateur introuvable" });

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
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role }
    });
  });
};

export const updateUser = (req, res) => {
  const { id, nom, email } = req.body;

  if (!id || !nom || !email) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  db.query(
    "UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?",
    [nom, email, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ message: "Profil mis à jour avec succès" });
    }
  );
};

