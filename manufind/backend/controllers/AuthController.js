const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/UserModel");

exports.signup = async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;
  try {
    const hash = await bcrypt.hash(mot_de_passe, 10);

    db.query(
      "INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)",
      [nom, email, hash, role],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Compte créé avec succès" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;

  db.query(
    "SELECT * FROM utilisateurs WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(401).json({ error: "Utilisateur introuvable" });

      const user = results[0];
      const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      if (!valid)
        return res.status(401).json({ error: "Mot de passe invalide" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Connexion réussie", token });
    }
  );
};
