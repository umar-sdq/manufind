import db from "../models/UserModel.js";

/**
 * @route GET /api/demandes
 * @desc Récupérer toutes les demandes avec info client et prestataire
 */
export const getDemandes = async (req, res) => {
  try {
    const sql = `
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
      ORDER BY d.date_creation DESC
    `;

    const [rows] = await db.execute(sql);

    res.status(200).json({
      success: true,
      count: rows.length,
      demandes: rows,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/demandes/afficher
 * @desc Afficher les demandes (toutes ou filtrées)
 */
export const afficherDemandes = async (req, res) => {
  try {
    const { client_id, prestataire_id, statut } = req.body;

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
    }
    if (prestataire_id) {
      sql += " AND d.prestataire_id = ?";
      params.push(prestataire_id);
    }
    if (statut) {
      sql += " AND d.statut = ?";
      params.push(statut);
    }

    sql += " ORDER BY d.date_creation DESC";

    const [rows] = await db.execute(sql, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      demandes: rows,
    });
  } catch (error) {
    console.error("Erreur lors de l'affichage des demandes :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/demandes/ajouter
 * @desc Ajouter une nouvelle demande de service
 */
export const ajouterDemande = async (req, res) => {
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

    if (!client_id || !categorie || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Champs obligatoires manquants (client_id, categorie, description).",
      });
    }

    const dateHeure =
      date_heure ||
      new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

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
      duree_estimee || 60,
    ];

    const [result] = await db.execute(sql, params);

    res.status(201).json({
      success: true,
      message: "Demande ajoutée avec succès.",
      demande_id: result.insertId,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la demande :", error);
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
      return res
        .status(400)
        .json({ success: false, message: "ID de la demande manquant." });
    }

    const fields = [];
    const values = [];

    if (categorie) {
      fields.push("categorie = ?");
      values.push(categorie);
    }
    if (description) {
      fields.push("description = ?");
      values.push(description);
    }
    if (adresse) {
      fields.push("adresse = ?");
      values.push(adresse);
    }
    if (code_postal) {
      fields.push("code_postal = ?");
      values.push(code_postal);
    }
    if (date_heure) {
      fields.push("date_heure = ?");
      values.push(date_heure);
    }
    if (duree_estimee) {
      fields.push("duree_estimee = ?");
      values.push(duree_estimee);
    }
    if (statut) {
      fields.push("statut = ?");
      values.push(statut);
    }
    if (prestataire_id) {
      fields.push("prestataire_id = ?");
      values.push(prestataire_id);
    }

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Aucune donnée à mettre à jour." });
    }

    const sql = `UPDATE demandes SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(sql, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Demande introuvable." });
    }

    res
      .status(200)
      .json({ success: true, message: "Demande mise à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

/**
 * @route DELETE /api/demandes/supprimer/:id
 * @desc Supprimer une demande existante
 */
export const supprimerDemande = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de la demande manquant.",
      });
    }

    const [result] = await db.execute("DELETE FROM demandes WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune demande trouvée avec cet ID.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Demande #${id} supprimée avec succès.`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};
