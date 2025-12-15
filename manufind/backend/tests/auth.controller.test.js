import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { makeSupabaseMock } from "./_mockSupabase.js";

const supa = makeSupabaseMock();
globalThis.__supabaseMock = supa.supabase;
process.env.JWT_SECRET = "test-secret";

const { signup, login, updateUser } = await import("../controllers/AuthController.js");

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

test("signup -> 400 si utilisateur existe", async () => {
  supa.push({ data: { id: 1 }, error: null });
  const req = { body: { nom: "A", email: "a@a.com", motDePasse: "x", role: "client" } };
  const res = makeRes();
  await signup(req, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.body?.error);
});

test("signup -> 200 si création OK", async () => {
  supa.push({ data: null, error: null });
  supa.push({ data: null, error: null });
  const req = { body: { nom: "A", email: "a@a.com", motDePasse: "x", role: "client" } };
  const res = makeRes();
  await signup(req, res);
  assert.equal(res.statusCode, 200);
  assert.match(res.body.message, /succès/i);
});

test("signup -> 500 si insert error", async () => {
  supa.push({ data: null, error: null });
  supa.push({ data: null, error: new Error("db down") });
  const req = { body: { nom: "A", email: "a@a.com", motDePasse: "x", role: "client" } };
  const res = makeRes();
  await signup(req, res);
  assert.equal(res.statusCode, 500);
  assert.ok(res.body?.error);
});

test("login -> 401 si user introuvable", async () => {
  supa.push({ data: null, error: null });
  const req = { body: { email: "missing@test.com", motDePasse: "x" } };
  const res = makeRes();
  await login(req, res);
  assert.equal(res.statusCode, 401);
});

test("login -> 401 si mdp invalide", async () => {
  supa.push({
    data: { id: 1, nom: "Jean", email: "jean@test.com", role: "client", mot_de_passe: "hashed" },
    error: null,
  });
  const req = { body: { email: "jean@test.com", motDePasse: "wrong" } };
  const res = makeRes();
  await login(req, res);
  assert.equal(res.statusCode, 401);
});

test("login -> 200 si credentials OK", async () => {
  const bcrypt = (await import("bcrypt")).default;
  const hashed = await bcrypt.hash("ok", 10);
  supa.push({
    data: { id: 1, nom: "Jean", email: "jean@test.com", role: "client", mot_de_passe: hashed },
    error: null,
  });
  const req = { body: { email: "jean@test.com", motDePasse: "ok" } };
  const res = makeRes();
  await login(req, res);
  assert.equal(res.statusCode, 200);
  assert.ok(res.body?.token);
  assert.equal(res.body?.user?.id, 1);
});

test("updateUser -> 400 si champs manquants", async () => {
  const req = { body: { id: 1, nom: "X" } };
  const res = makeRes();
  await updateUser(req, res);
  assert.equal(res.statusCode, 400);
});

test("updateUser -> 200 si update OK", async () => {
  supa.push({ data: null, error: null });
  const req = { body: { id: 1, nom: "X", email: "x@test.com" } };
  const res = makeRes();
  await updateUser(req, res);
  assert.equal(res.statusCode, 200);
  assert.match(res.body.message, /succès/i);
});

test("updateUser -> 500 si update error", async () => {
  supa.push({ data: null, error: new Error("update failed") });
  const req = { body: { id: 1, nom: "X", email: "x@test.com" } };
  const res = makeRes();
  await updateUser(req, res);
  assert.equal(res.statusCode, 500);
});