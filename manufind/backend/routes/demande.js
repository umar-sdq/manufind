import express from "express";
import {
  getDemandes,
  afficherDemandes,
  ajouterDemande,
  modifierDemande,
  supprimerDemande,
  accepterDemande,
  afficherDemandesByPrestataireID
  , afficherDemandesByClientID
} from "../controllers/demandeController.js"; 
const router = express.Router();
router.get("/", getDemandes);
router.post("/afficher", afficherDemandes);
router.post("/ajouter", ajouterDemande);
router.put("/modifier/:id", modifierDemande);
router.delete("/supprimer/:id", supprimerDemande);
router.put("/accepter/:id", accepterDemande);
router.get("/prestataire/:prestataire_id", afficherDemandesByPrestataireID)
router.get("/client/:client_id", afficherDemandesByClientID);

export default router;
