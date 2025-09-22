const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

//================
// connexion a la db mysql
//===================
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "12345React!",
  database: process.env.DB_NAME || "manufind",
});

//================
//signup route
//===================
app.post("/auth/signup", async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;

  try {
    const hash = await bcrypt.hash(mot_de_passe, 10);

    db.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)",
      [nom, email, hash, role],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Compte créé avec succès" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//================
//login route
//===================
app.post("/auth/login", (req, res) => {
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
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "1h" }
      );

      res.json({ message: "Connexion réussie", token });
    }
  );
});

//================
// démarrage du serveur
//===================

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
