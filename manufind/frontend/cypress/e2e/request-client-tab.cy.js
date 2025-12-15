describe("RequestClientTab – client", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/demandes/client/1", {
      statusCode: 200,
      body: {
        success: true,
        demandes: [
          {
            id: 10,
            categorie: "Plomberie",
            description: "Fuite lavabo",
            adresse: "123 rue Test",
            date_heure: "2025-01-01",
            duree_estimee: 60,
            statut: "en_attente",
          },
        ],
      },
    }).as("getDemandes");

    cy.intercept("DELETE", "**/demandes/supprimer/10", {
      statusCode: 200,
      body: { success: true },
    }).as("deleteDemande");

    cy.visit("/requests-client", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({ id: 1, role: "client" })
        );
      },
    });
  });

  it("affiche et annule une demande", () => {
    cy.wait("@getDemandes");

    cy.contains("Plomberie").should("be.visible");

    cy.contains("Annuler la requête").click();
    cy.contains("Oui, annuler").click();

    cy.wait("@deleteDemande");

    cy.contains("Plomberie").should("not.exist");
  });
  it("affiche un message si aucune demande client", () => {
  cy.intercept("GET", "**/demandes/client/1", {
    statusCode: 200,
    body: { success: true, demandes: [] },
  });

  cy.visit("/requests-client", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "authData",
        JSON.stringify({ id: 1, role: "client" })
      );
    },
  });

  cy.contains("Aucune requ").should("be.visible");
});

});
