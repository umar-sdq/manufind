import express from "express";
import {
  getDemandes,
  afficherDemandes,
  ajouterDemande,
  modifierDemande,
  supprimerDemande,
  getDemandeById,
  accepterDemande,
} from "../controllers/demandeController.js"; // corriger la casse

const router = express.Router();
router.get("/", getDemandes);
router.post("/afficher", afficherDemandes);
router.post("/ajouter", ajouterDemande);
router.put("/modifier/:id", modifierDemande);
router.delete("/supprimer/:id", supprimerDemande);
router.get("/:id", getDemandeById);
router.put("/:id", accepterDemande);

export default router;
