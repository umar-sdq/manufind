import express from "express";
import {
  getDemandes,
  afficherDemandes,
  ajouterDemande,
  modifierDemande,
  supprimerDemande,
  accepterDemande
} from "../controllers/demandeController.js"; 
const router = express.Router();
router.get("/", getDemandes);
router.post("/afficher", afficherDemandes);
router.post("/ajouter", ajouterDemande);
router.put("/modifier/:id", modifierDemande);
router.delete("/supprimer/:id", supprimerDemande);
router.put("/accepter/:id", accepterDemande);

export default router;
