import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("je suis connecté en tant que prestataire", () => {
  cy.visit("/login");

  cy.get('[data-cy="email"]').type("prestataire@gmail.com");
  cy.get('[data-cy="password"]').type("123");
  cy.get('[data-cy="login-submit"]').click();

  cy.url().should("include", "/profile-pres");
});

When("je clique sur le lien Profil prestataire", () => {
  cy.contains("Profil").click();
});

When("je clique sur le lien Requêtes prestataire", () => {
  cy.contains("Requêtes").click();
});

When("je clique sur le lien Carte prestataire", () => {
  cy.contains("Map").click();
});

When("je clique sur le lien Guide prestataire", () => {
  cy.contains("Guide").click();
});

When("je clique sur le lien Services prestataire", () => {
  cy.contains("Services").click();
});

Then("je suis redirigé vers la page profil prestataire", () => {
  cy.url().should("include", "/profile-pres");
});

Then("je suis redirigé vers la page requêtes prestataire", () => {
  cy.url().should("include", "/requests");
});

Then("je suis redirigé vers la page carte prestataire", () => {
  cy.url().should("include", "/map");
});

Then("je suis redirigé vers la page guide prestataire", () => {
  cy.url().should("include", "/guide");
});

Then("je suis redirigé vers la page services prestataire", () => {
  cy.url().should("include", "/services");
});
