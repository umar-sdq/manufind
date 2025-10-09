// controllers/DemandeController.js
import db from "../models/UserModel.js"; // Changer vers UserModel.js car config/db.js n'existe pas

/**
 * @route POST /api/demandes/afficher
 * @desc Afficher les demandes (toutes ou filtrées)
 */
export const afficherDemandes = async (req, res) => {
  console.log("🔍 [DEBUG] Affichage des demandes - Début");
  console.log("📥 [DEBUG] Body reçu:", req.body);

  try {
    const { client_id, prestataire_id, statut } = req.body;
    console.log("📊 [DEBUG] Paramètres extraits:", {
      client_id,
      prestataire_id,
      statut,
    });

    let sql = `
      SELECT 
        d.id,
        d.categorie,
        d.description,
        d.adresse,
        d.code_postal,
        d.date_heure,
        d.duree_estimee,
        d.statut,
        d.date_creation,
        u.nom AS client_nom,
        p.id AS prestataire_id,
        up.nom AS prestataire_nom
      FROM demandes d
      JOIN utilisateurs u ON d.client_id = u.id
      LEFT JOIN prestataires p ON d.prestataire_id = p.id
      LEFT JOIN utilisateurs up ON p.utilisateur_id = up.id
      WHERE 1=1
    `;

    const params = [];

    if (client_id) {
      sql += " AND d.client_id = ?";
      params.push(client_id);
      console.log("🔍 [DEBUG] Filtre par client_id:", client_id);
    }
    if (prestataire_id) {
      sql += " AND d.prestataire_id = ?";
      params.push(prestataire_id);
      console.log("🔍 [DEBUG] Filtre par prestataire_id:", prestataire_id);
    }
    if (statut) {
      sql += " AND d.statut = ?";
      params.push(statut);
      console.log("🔍 [DEBUG] Filtre par statut:", statut);
    }

    sql += " ORDER BY d.date_creation DESC";

    console.log("📝 [DEBUG] SQL final:", sql);
    console.log("📝 [DEBUG] Paramètres SQL:", params);

    const [rows] = await db.query(sql, params);

    console.log("✅ [DEBUG] Résultats trouvés:", rows.length);
    console.log("📊 [DEBUG] Première ligne:", rows[0] || "Aucune donnée");

    res.status(200).json({
      success: true,
      count: rows.length,
      demandes: rows,
    });

    console.log("🎉 [DEBUG] Réponse envoyée avec succès");
  } catch (error) {
    console.error("❌ [DEBUG] Erreur lors de l'affichage des demandes:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error,
    });
  }
};

/**
 * @route POST /api/demandes/ajouter
 * @desc Ajouter une nouvelle demande de service
 */
export const ajouterDemande = async (req, res) => {
  console.log("➕ [DEBUG] Ajout d'une demande - Début");
  console.log(
    "📥 [DEBUG] Body complet reçu:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const {
      client_id,
      categorie,
      description,
      adresse,
      code_postal,
      date_heure,
      duree_estimee,
    } = req.body;

    console.log("📊 [DEBUG] Paramètres extraits:");
    console.log("   - client_id:", client_id, "Type:", typeof client_id);
    console.log("   - categorie:", categorie, "Type:", typeof categorie);
    console.log("   - description:", description, "Type:", typeof description);
    console.log("   - adresse:", adresse, "Type:", typeof adresse);
    console.log("   - code_postal:", code_postal, "Type:", typeof code_postal);
    console.log("   - date_heure:", date_heure, "Type:", typeof date_heure);
    console.log(
      "   - duree_estimee:",
      duree_estimee,
      "Type:",
      typeof duree_estimee
    );

    // Validation basique - rendre date_heure optionnel
    if (!client_id || !categorie || !description) {
      console.log("❌ [DEBUG] Validation échouée - Champs manquants");
      console.log("   - client_id présent:", !!client_id);
      console.log("   - categorie présent:", !!categorie);
      console.log("   - description présent:", !!description);

      return res.status(400).json({
        success: false,
        message:
          "Champs obligatoires manquants (client_id, categorie, description).",
      });
    }

    console.log("✅ [DEBUG] Validation réussie");

    // Si date_heure n'est pas fournie, utiliser la date actuelle + 1 heure
    const dateHeure =
      date_heure ||
      new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    console.log("📅 [DEBUG] Date/heure calculée:", dateHeure);

    const sql = `
      INSERT INTO demandes (
        client_id, categorie, description, adresse, code_postal, date_heure, duree_estimee, statut
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'en_attente')
    `;

    const params = [
      client_id,
      categorie,
      description,
      adresse || null,
      code_postal || null,
      dateHeure,
      duree_estimee || 60, // durée par défaut de 60 minutes
    ];

    console.log("📝 [DEBUG] SQL à exécuter:", sql);
    console.log("📝 [DEBUG] Paramètres finaux:", params);

    // Utiliser db.query avec callback au lieu de await
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("❌ [DEBUG] Erreur SQL:", err);
        console.error("❌ [DEBUG] Code d'erreur:", err.code);
        console.error("❌ [DEBUG] Message SQL:", err.sqlMessage);

        return res.status(500).json({
          success: false,
          message: "Erreur serveur",
          error: err.message,
        });
      }

      console.log("✅ [DEBUG] Insertion réussie!");
      console.log("📊 [DEBUG] Résultat de l'insertion:", result);
      console.log("🆔 [DEBUG] ID de la nouvelle demande:", result.insertId);

      res.status(201).json({
        success: true,
        message: "Demande ajoutée avec succès.",
        demande_id: result.insertId,
      });

      console.log("🎉 [DEBUG] Réponse envoyée avec succès");
    });
  } catch (error) {
    console.error("❌ [DEBUG] Erreur dans le try/catch:", error);
    console.error("❌ [DEBUG] Stack trace:", error.stack);

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

/**
 * @route PUT /api/demandes/modifier/:id
 * @desc Modifier une demande existante
 */
export const modifierDemande = async (req, res) => {
  console.log("✏️ [DEBUG] Modification d'une demande - Début");
  console.log("📥 [DEBUG] Paramètre ID:", req.params.id);
  console.log("📥 [DEBUG] Body reçu:", req.body);

  try {
    const { id } = req.params;
    const {
      categorie,
      description,
      adresse,
      code_postal,
      date_heure,
      duree_estimee,
      statut,
      prestataire_id,
    } = req.body;

    if (!id) {
      console.log("❌ [DEBUG] ID manquant");
      return res
        .status(400)
        .json({ success: false, message: "ID de la demande manquant." });
    }

    // Construction dynamique des champs à modifier
    const fields = [];
    const values = [];

    if (categorie) {
      fields.push("categorie = ?");
      values.push(categorie);
      console.log("📝 [DEBUG] Champ à modifier: categorie =", categorie);
    }
    if (description) {
      fields.push("description = ?");
      values.push(description);
      console.log("📝 [DEBUG] Champ à modifier: description =", description);
    }
    if (adresse) {
      fields.push("adresse = ?");
      values.push(adresse);
      console.log("📝 [DEBUG] Champ à modifier: adresse =", adresse);
    }
    if (code_postal) {
      fields.push("code_postal = ?");
      values.push(code_postal);
      console.log("📝 [DEBUG] Champ à modifier: code_postal =", code_postal);
    }
    if (date_heure) {
      fields.push("date_heure = ?");
      values.push(date_heure);
      console.log("📝 [DEBUG] Champ à modifier: date_heure =", date_heure);
    }
    if (duree_estimee) {
      fields.push("duree_estimee = ?");
      values.push(duree_estimee);
      console.log(
        "📝 [DEBUG] Champ à modifier: duree_estimee =",
        duree_estimee
      );
    }
    if (statut) {
      fields.push("statut = ?");
      values.push(statut);
      console.log("📝 [DEBUG] Champ à modifier: statut =", statut);
    }
    if (prestataire_id) {
      fields.push("prestataire_id = ?");
      values.push(prestataire_id);
      console.log(
        "📝 [DEBUG] Champ à modifier: prestataire_id =",
        prestataire_id
      );
    }

    if (fields.length === 0) {
      console.log("❌ [DEBUG] Aucun champ à modifier");
      return res
        .status(400)
        .json({ success: false, message: "Aucune donnée à mettre à jour." });
    }

    const sql = `UPDATE demandes SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    console.log("📝 [DEBUG] SQL de modification:", sql);
    console.log("📝 [DEBUG] Valeurs:", values);

    const [result] = await db.query(sql, values);

    console.log("📊 [DEBUG] Résultat de la modification:", result);

    if (result.affectedRows === 0) {
      console.log("❌ [DEBUG] Aucune ligne affectée - Demande introuvable");
      return res
        .status(404)
        .json({ success: false, message: "Demande introuvable." });
    }

    console.log("✅ [DEBUG] Modification réussie");
    res
      .status(200)
      .json({ success: true, message: "Demande mise à jour avec succès." });
  } catch (error) {
    console.error("❌ [DEBUG] Erreur lors de la modification:", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error });
  }
};

/**
 * @route DELETE /api/demandes/supprimer/:id
 * @desc Supprimer une demande existante
 */
export const supprimerDemande = async (req, res) => {
  console.log("🗑️ [DEBUG] Suppression d'une demande - Début");
  console.log("📥 [DEBUG] ID à supprimer:", req.params.id);

  try {
    const { id } = req.params;

    if (!id) {
      console.log("❌ [DEBUG] ID manquant pour la suppression");
      return res.status(400).json({
        success: false,
        message: "ID de la demande manquant.",
      });
    }

    console.log("📝 [DEBUG] Exécution de la suppression pour ID:", id);

    const [result] = await db.query("DELETE FROM demandes WHERE id = ?", [id]);

    console.log("📊 [DEBUG] Résultat de la suppression:", result);

    if (result.affectedRows === 0) {
      console.log("❌ [DEBUG] Aucune ligne supprimée - Demande introuvable");
      return res.status(404).json({
        success: false,
        message: "Aucune demande trouvée avec cet ID.",
      });
    }

    console.log("✅ [DEBUG] Suppression réussie");
    res.status(200).json({
      success: true,
      message: `Demande #${id} supprimée avec succès.`,
    });
  } catch (error) {
    console.error("❌ [DEBUG] Erreur lors de la suppression:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error,
    });
  }
};
