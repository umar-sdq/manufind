// routes/demande.js
import express from "express";
import {
  getDemandes,
  afficherDemandes,
  ajouterDemande,
  modifierDemande,
  supprimerDemande,
} from "../controllers/DemandeController.js";

const router = express.Router();
router.get("/", getDemandes);
router.post("/afficher", afficherDemandes);
router.post("/ajouter", ajouterDemande);
router.put("/modifier/:id", modifierDemande);
router.delete("/supprimer/:id", supprimerDemande); // ✅ nouvelle route

export default router;
