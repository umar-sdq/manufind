import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { makeSupabaseMock } from "./_mockSupabase.js";

const supa = makeSupabaseMock();
globalThis.__supabaseMock = supa.supabase;

const controllers = await import("../controllers/demandeController.js");
const {
  getDemandes,
  afficherDemandes,
  ajouterDemande,
  modifierDemande,
  supprimerDemande,
  accepterDemande,
  afficherDemandesByPrestataireID,
  afficherDemandesByClientID,
} = controllers;

function makeRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

beforeEach(() => supa.reset());

test("getDemandes -> 200 success", async () => {
  supa.push({ data: [], error: null });
  const res = makeRes();
  await getDemandes({}, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.count, 0);
});

test("getDemandes -> 500 si error", async () => {
  supa.push({ data: null, error: new Error("fail") });
  const res = makeRes();
  await getDemandes({}, res);
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.success, false);
});

test("afficherDemandes -> 200", async () => {
  supa.push({ data: [{ id: 1 }], error: null });
  const req = { body: { prestataire_id: 9, statut: "en_attente" } };
  const res = makeRes();
  await afficherDemandes(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.demandes.length, 1);
});

test("ajouterDemande -> 400 si champs obligatoires manquants", async () => {
  const req = { body: { client_id: 1, categorie: "Plomberie" } };
  const res = makeRes();
  await ajouterDemande(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
});

test("ajouterDemande -> 201 si OK", async () => {
  supa.push({ data: [{ id: 1 }], error: null });
  const req = { body: { client_id: 1, categorie: "Plomberie", description: "Fuite" } };
  const res = makeRes();
  await ajouterDemande(req, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
});

test("modifierDemande -> 400 si aucune data", async () => {
  const req = { params: { id: "1" }, body: {} };
  const res = makeRes();
  await modifierDemande(req, res);
  assert.equal(res.statusCode, 400);
});

test("modifierDemande -> 200 si OK", async () => {
  supa.push({ data: [{ id: 1 }], error: null });
  const req = { params: { id: "1" }, body: { statut: "acceptee" } };
  const res = makeRes();
  await modifierDemande(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
});

test("supprimerDemande -> 200 si OK", async () => {
  supa.push({ data: null, error: null });
  const req = { params: { id: "10" } };
  const res = makeRes();
  await supprimerDemande(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
});

test("accepterDemande -> 400 si prestataire_id manquant", async () => {
  const req = { params: { id: "123" }, body: {} };
  const res = makeRes();
  await accepterDemande(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
});

test("accepterDemande -> 200 si OK", async () => {
  supa.push({ data: [{ id: 123, statut: "acceptee" }], error: null });
  const req = { params: { id: "123" }, body: { prestataire_id: 99 } };
  const res = makeRes();
  await accepterDemande(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.demande.id, 123);
});

test("afficherDemandesByPrestataireID -> 200", async () => {
  supa.push({ data: [], error: null });
  const req = { params: { prestataire_id: "99" } };
  const res = makeRes();
  await afficherDemandesByPrestataireID(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
});

test("afficherDemandesByClientID -> 200", async () => {
  supa.push({ data: [], error: null });
  const req = { params: { client_id: "1" } };
  const res = makeRes();
  await afficherDemandesByClientID(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
});