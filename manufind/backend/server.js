// ----------------------
// 📦 Imports
// ----------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { signup, login, updateUser } from "./controllers/AuthController.js";
import demandeRoutes from "./routes/demande.js";
import { supabase } from "./supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://manufind-g4pm-lzt9wiav4-umar-siddiquis-projects-3cbd1641.vercel.app", 
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/demandes", demandeRoutes);
app.post("/auth/signup", signup);
app.post("/auth/login", login);
app.put("/auth/update", updateUser);

app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .limit(1);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
