import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { signup, login, updateUser } from "./controllers/AuthController.js";
import demandeRoutes from "./routes/demande.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/demandes", demandeRoutes);

app.post("/auth/signup", signup);
app.post("/auth/login", login);
app.put("/auth/update", updateUser);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
