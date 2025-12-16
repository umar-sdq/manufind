import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("je suis sur {string}", (url) => {
  cy.visit(url);
});

Then("je suis redirigé vers {string}", (url) => {
  cy.url({ timeout: 10000 }).should("include", url);
});

Then("je vois {string}", (texte) => {
  cy.contains(texte, { timeout: 8000 }).should("be.visible");
});
