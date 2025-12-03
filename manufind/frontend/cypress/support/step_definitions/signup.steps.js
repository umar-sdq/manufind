/* global expect */
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("je crée un compte avec:", (dataTable) => {
  const { username, email, password, confirm, role } = dataTable.hashes()[0];

  cy.intercept("POST", "**/auth/signup").as("signupRequest");

  if (username) cy.get('[name="username"]').clear().type(username);
  if (email) cy.get('[name="email"]').clear().type(email);
  if (password) cy.get('[name="password"]').clear().type(password);
  if (confirm) cy.get('[name="confirmPassword"]').clear().type(confirm);
  if (role) cy.get('[name="role"]').select(role);

  cy.get('button[type="submit"]').click();

  cy.wait("@signupRequest");
});

When("je remplis le champ email avec {string}", (email) => {
  cy.get('[name="email"]').clear().type(email);
});

Then("le champ email affiche un message contenant {string}", (message) => {
  cy.get('[name="email"]').then(($input) => {
    expect($input[0].validationMessage).to.contain(message);
  });
});

When("je remplis le formulaire d'inscription avec:", (dataTable) => {
  const { username, email, password, confirm, role } = dataTable.hashes()[0];

  if (username) cy.get('[name="username"]').clear().type(username);
  if (email) cy.get('[name="email"]').clear().type(email);
  if (password) cy.get('[name="password"]').clear().type(password);
  if (confirm) cy.get('[name="confirmPassword"]').clear().type(confirm);
  if (role) cy.get('[name="role"]').select(role);
});

Then("le champ mot de passe affiche un message contenant {string}", (message) => {
  cy.get('[name="password"]').then(($input) => {
    expect($input[0].validationMessage).to.contain(message);
  });
});

When('je clique sur {string}', (label) => {
  cy.contains('button', label).click();
});

