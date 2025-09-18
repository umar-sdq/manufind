const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345React!",
  database: "testdb",
});

// Exemple API : récupérer tous les utilisateurs
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Lancer le serveur
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
