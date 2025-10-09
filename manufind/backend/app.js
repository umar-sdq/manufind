import demandeRoutes from "./routes/demande.js";
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
app.use("/api/demandes", demandeRoutes);

module.exports = app;
