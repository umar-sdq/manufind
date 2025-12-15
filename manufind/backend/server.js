import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { signup, login, updateUser } from "./controllers/AuthController.js";
import demandeRoutes from "./routes/demande.js";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: [
    "https://manufind-g4pm.vercel.app",
    "https://manufind-g4pm-lzt9wiav4-umar-siddiquis-projects-3cbd1641.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.get("/", (req, res) => res.send(" ManuFind Backend API OK"));
app.use("/demandes", demandeRoutes);
app.post("/auth/signup", signup);
app.post("/auth/login", login);
app.put("/auth/update", updateUser);

app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase.from("utilisateurs").select("*").limit(1);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("Supabase error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Serveur ManuFind démarré sur le port ${PORT}`);
});
export default app;
