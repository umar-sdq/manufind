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

// ✅ CORS configuré pour gérer preflight + whitelist
const allowedOrigins = [
  "https://manufind-g4pm.vercel.app", //  vrai site
  "https://manufind-g4pm-lzt9wiav4-umar-siddiquis-projects-3cbd1641.vercel.app", // preview Vercel
  "http://localhost:5173", // dev local
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Important : accepter explicitement les requêtes preflight OPTIONS
app.options("*", cors());

// ------------------ ROUTES ------------------
app.use("/demandes", demandeRoutes);
app.post("/auth/signup", signup);
app.post("/auth/login", login);
app.put("/auth/update", updateUser);

// ✅ Test Supabase route
app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase.from("utilisateurs").select("*").limit(1);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------ SERVER START ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
