import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

/* =========================
   AUTHENTIFICATION CLIENT
   ========================= */

Given("je suis connecté en tant que client", () => {
  cy.visit("/login");

  cy.get('[data-cy="email"]').should("be.visible").type("test@test.ca");
  cy.get('[data-cy="password"]').should("be.visible").type("123");

  cy.get('[data-cy="login-submit"]').click();

  // ✅ Preuve que la connexion est réussie
  cy.get('[data-cy="nav-profile"]').should("be.visible");
  cy.url().should("include", "/profile-client");
});

/* =========================
   ACTIONS DE NAVIGATION
   ========================= */

When("je clique sur le lien Profil", () => {
  cy.get('[data-cy="nav-profile"]').click();
});

When("je clique sur le lien Services", () => {
  cy.get('[data-cy="nav-services"]').click();
});

When("je clique sur le lien Guide", () => {
  cy.get('[data-cy="nav-guide"]').click();
});

When("je clique sur le lien Requête", () => {
  cy.get('[data-cy="nav-request"]').click();
});

When("je clique sur le lien Soumissions", () => {
  cy.get('[data-cy="nav-submissions"]').click();
});

/* =========================
   ASSERTIONS / REDIRECTIONS
   ========================= */

Then("je suis redirigé vers la page profil client", () => {
  cy.url().should("include", "/profile-client");
  cy.contains("Profil");
});

Then("je suis redirigé vers la page des services", () => {
  cy.url().should("include", "/services");
  cy.contains("Services");
});

Then("je suis redirigé vers la page guide", () => {
  cy.url().should("include", "/guide");
  cy.contains("Guide");
});

Then("je suis redirigé vers la page de création de requête", () => {
  cy.url().should("include", "/request-service");
  cy.contains("Requête");
});

Then("je suis redirigé vers la page des requêtes soumises", () => {
  cy.url().should("include", "/requests-client");
  cy.contains("Soumises");
});
