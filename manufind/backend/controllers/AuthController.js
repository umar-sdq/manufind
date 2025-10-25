import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../supabase.js";

export const signup = async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;

  try {
    const { data: existingUser } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser)
      return res.status(400).json({ error: "Utilisateur déjà existant" });

    const hash = await bcrypt.hash(motDePasse, 10);

    const { error } = await supabase.from("utilisateurs").insert([
      { nom, email, mot_de_passe: hash, role }
    ]);

    if (error) throw error;

    res.json({ message: "Compte créé avec succès" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
export const login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user)
      return res.status(401).json({ error: "Utilisateur introuvable" });

    const valid = await bcrypt.compare(motDePasse, user.mot_de_passe);
    if (!valid)
      return res.status(401).json({ error: "Mot de passe invalide" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateUser = async (req, res) => {
  const { id, nom, email } = req.body;

  if (!id || !nom || !email)
    return res.status(400).json({ error: "Champs manquants" });

  try {
    const { error } = await supabase
      .from("utilisateurs")
      .update({ nom, email })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Profil mis à jour avec succès" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
