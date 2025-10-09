// routes/demande.js
import express from "express";
import {
  afficherDemandes,
  ajouterDemande,
  modifierDemande,
  supprimerDemande,
} from "../controllers/DemandeController.js";

const router = express.Router();

router.post("/afficher", afficherDemandes);
router.post("/ajouter", ajouterDemande);
router.put("/modifier/:id", modifierDemande);
router.delete("/supprimer/:id", supprimerDemande); // ✅ nouvelle route

export default router;
