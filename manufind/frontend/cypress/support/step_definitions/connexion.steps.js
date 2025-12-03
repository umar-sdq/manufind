import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("je suis sur {string}", (url) => {
  cy.visit(url);
});

When("je me connecte avec {string} et {string}", (email, password) => {
  cy.intercept("POST", "**/auth/login").as("loginRequest");

  cy.get('input[name="email"]')
    .should("be.visible")
    .clear()
    .type(email);

  cy.get('input[name="password"]')
    .should("be.visible")
    .clear()
    .type(password);

  cy.get('button[type="submit"]').click();

  cy.wait("@loginRequest", { timeout: 10000 }).then((interception) => {
    console.log("📌 API RESPONSE :", interception.response?.body);
  });
});

Then("je suis redirigé vers {string}", (url) => {
  cy.url({ timeout: 10000 }).should("include", url);
});

Then("je vois {string}", (texte) => {
  cy.contains(texte, { timeout: 8000 }).should("be.visible");
});
