describe("RequestTab – prestataire", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/demandes/prestataire/99", {
      statusCode: 200,
      body: {
        success: true,
        demandes: [
          {
            id: 20,
            categorie: "Électricité",
            description: "Prise cassée",
            adresse: "456 rue Test",
            statut: "acceptée",
            duree_estimee: 45,
          },
        ],
      },
    }).as("getPrestataire");

    cy.intercept("DELETE", "**/demandes/supprimer/20", {
      statusCode: 200,
      body: { success: true },
    }).as("complete");

    cy.visit("/requests", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({ id: 99, role: "prestataire" })
        );
      },
    });
  });

  it("complète un service", () => {
    cy.wait("@getPrestataire");

    cy.contains("Électricité").should("be.visible");
    cy.contains("Compléter le service").click();
    cy.contains("Oui").click();

    cy.wait("@complete");
    cy.contains("Électricité").should("not.exist");
  });



  
});
