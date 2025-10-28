import { supabase } from "../supabase.js";

export const getDemandes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("demandes")
      .select(`
        id,
        categorie,
        description,
        adresse,
        code_postal,
        date_heure,
        duree_estimee,
        statut,
        date_creation,
        client_id,
        prestataire_id,
        client:client_id (id, nom),
        prestataire:prestataire_id (id, nom)
      `)
      .order("date_creation", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      demandes: data,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des demandes:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message,
    });
  }
};


/**
 * @route POST /api/demandes/afficher
 * @desc Afficher les demandes (toutes ou filtrées)
 */
export const afficherDemandes = async (req, res) => {
  const { prestataire_id, statut } = req.body;

  try {
    let query = supabase.from("demandes").select("*");

    if (prestataire_id) query = query.eq("prestataire_id", prestataire_id);
    if (statut) query = query.eq("statut", statut);

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      demandes: data || []
    });
  } catch (err) {
    console.error("Erreur afficherDemandes:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message
    });
  }
};

/**
 * @route POST /api/demandes/ajouter
 * @desc Ajouter une nouvelle demande
 */
export const ajouterDemande = async (req, res) => {
  try {
    const { client_id, categorie, description, adresse, code_postal, date_heure, duree_estimee } = req.body;

    if (!client_id || !categorie || !description) {
      return res.status(400).json({
        success: false,
        message: "Champs obligatoires manquants (client_id, categorie, description).",
      });
    }

    const dateHeure =
      date_heure ||
      new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    const { data, error } = await supabase.from("demandes").insert([
      {
        client_id,
        categorie,
        description,
        adresse,
        code_postal,
        date_heure: dateHeure,
        duree_estimee: duree_estimee || 60,
        statut: "en_attente",
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Demande ajoutée avec succès.",
      data,
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout de la demande:", err.message);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};

/**
 * @route PUT /api/demandes/modifier/:id
 * @desc Modifier une demande existante
 */
export const modifierDemande = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID de la demande manquant." });

    const { categorie, description, adresse, code_postal, date_heure, duree_estimee, statut, prestataire_id } = req.body;

    const updateData = {};
    if (categorie) updateData.categorie = categorie;
    if (description) updateData.description = description;
    if (adresse) updateData.adresse = adresse;
    if (code_postal) updateData.code_postal = code_postal;
    if (date_heure) updateData.date_heure = date_heure;
    if (duree_estimee) updateData.duree_estimee = duree_estimee;
    if (statut) updateData.statut = statut;
    if (prestataire_id) updateData.prestataire_id = prestataire_id;

    if (Object.keys(updateData).length === 0)
      return res.status(400).json({ success: false, message: "Aucune donnée à mettre à jour." });

    const { data, error } = await supabase.from("demandes").update(updateData).eq("id", id);
    if (error) throw error;

    res.status(200).json({ success: true, message: "Demande mise à jour avec succès.", data });
  } catch (err) {
    console.error("Erreur lors de la modification:", err.message);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};

/**
 * @route DELETE /api/demandes/supprimer/:id
 * @desc Supprimer une demande
 */
export const supprimerDemande = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID manquant." });

    const { error } = await supabase.from("demandes").delete().eq("id", id);
    if (error) throw error;

    res.status(200).json({ success: true, message: `Demande #${id} supprimée avec succès.` });
  } catch (err) {
    console.error("Erreur lors de la suppression:", err.message);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};
/**
 * @route PUT /api/demandes/accepter/:id
 * @desc Accepter une demande (mise à jour du statut et association au prestataire)
 */
export const accepterDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const { prestataire_id } = req.body;

    if (!id || !prestataire_id) {
      return res.status(400).json({
        success: false,
        message: "ID de la demande ou du prestataire manquant.",
      });
    }

    // Met à jour la demande
    const { data, error } = await supabase
      .from("demandes")
      .update({
        statut: "acceptee",
        prestataire_id: prestataire_id,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Demande acceptée avec succès.",
      demande: data[0],
    });
  } catch (err) {
    console.error("Erreur lors de l'acceptation de la demande:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

