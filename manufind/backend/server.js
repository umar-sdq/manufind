import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { signup, login, updateUser } from "./controllers/AuthController.js";
import demandeRoutes from "./routes/demande.js";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();

// ✅ CORS autorisé pour front + localhost
app.use(
  cors({
    origin: [
      "https://manufind-g4pm.vercel.app",
      "https://manufind-g4pm-lzt9wiav4-umar-siddiquis-projects-3cbd1641.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => res.send("✅ ManuFind Backend API OK"));
app.use("/demandes", demandeRoutes);
app.post("/auth/signup", signup);
app.post("/auth/login", login);
app.put("/auth/update", updateUser);

// ✅ Test route Supabase
app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase.from("utilisateurs").select("*").limit(1);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Export (pas de app.listen ici)
export default app;
