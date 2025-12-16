import { When } from "@badeball/cypress-cucumber-preprocessor";

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

  cy.wait("@loginRequest", { timeout: 10000 });
});
