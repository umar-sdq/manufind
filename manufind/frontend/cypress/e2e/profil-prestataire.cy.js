describe("ProfilePrestataire", () => {
  beforeEach(() => {
    cy.visit("/profile-pres", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({
            id: 99,
            role: "prestataire",
            nom: "Pro Test",
            email: "pro@test.com",
          })
        );
      },
    });

    cy.intercept("GET", "**/demandes/prestataire/99", {
      statusCode: 200,
      body: {
        success: true,
        demandes: [
          { statut: "complétée" },
          { statut: "complétée" },
          { statut: "en_attente" },
        ],
      },
    }).as("getStats");

    cy.intercept("PUT", "**/auth/update", {
      statusCode: 200,
      body: { success: true },
    }).as("updateProfile");
  });

  it("affiche les statistiques prestataire", () => {
    cy.wait("@getStats");

    cy.contains("Bonjour, Pro Test").should("be.visible");

    cy.contains("3").should("be.visible"); // total
    cy.contains("2").should("be.visible"); // complétées
    cy.contains("1").should("be.visible"); // en attente
  });

  it("met à jour le profil prestataire", () => {
    cy.get("input").eq(0).clear().type("Pro Modifié");
    cy.get("input").eq(1).clear().type("newpro@test.com");

    cy.contains("Sauvegarder").click();
    cy.wait("@updateProfile");

    cy.contains("Sauvegardé").should("be.visible");
  });

  it("navigue vers la carte", () => {
    cy.contains("Accéder à la carte").click();
    cy.url().should("include", "/map");
  });

  it("déconnecte le prestataire", () => {
    cy.contains("Déconnexion").click();
    cy.url().should("include", "/login");
  });
});
