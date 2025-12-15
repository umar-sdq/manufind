describe("RequestCard – création de demande", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/demandes/ajouter", {
      statusCode: 200,
      body: { success: true },
    }).as("addRequest");

    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({
            id: 1,
            role: "client",
            nom: "Test Client",
          })
        );
      },
    });

    cy.url().should("not.include", "/login");

    cy.visit("/request-service");
  });

  it("soumet une demande avec succès", () => {
    cy.contains("Détails de la demande").should("be.visible");

    cy.get("select").select("Plomberie");
    cy.get("input[placeholder='Description']").type("Fuite évier");
    cy.get("input[placeholder='Adresse']").type("123 rue Test");
    cy.get("input[placeholder='Code postal']").type("H7N2X3");
    cy.get("input[type='number']").clear().type("90");

    cy.contains("Soumettre").click();
    cy.wait("@addRequest");

    cy.contains("Demande soumise").should("be.visible");
  });
  
  it("affiche une erreur si la requête échoue", () => {
  cy.intercept("POST", "**/demandes/ajouter", {
    statusCode: 500,
    body: { success: false, message: "Erreur serveur" },
  }).as("addRequestFail");

  cy.visit("/request-service", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "authData",
        JSON.stringify({ id: 1, role: "client" })
      );
    },
  });

  cy.get("select").select("Plomberie");
  cy.get("input[placeholder='Description']").type("Test");
  cy.get("input[placeholder='Adresse']").type("123 rue Test");
  cy.get("input[placeholder='Code postal']").type("H7N2X3");
  cy.get("input[type='number']").type("60");

  cy.contains("Soumettre").click();
  cy.wait("@addRequestFail");

  cy.contains("Erreur").should("be.visible");
});

});
