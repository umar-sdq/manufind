describe("ProfileClient", () => {
  beforeEach(() => {
    // 🔐 fake auth
    cy.visit("/profile-client", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({
            id: 1,
            role: "client",
            nom: "Jean Test",
            email: "jean@test.com",
          })
        );
      },
    });

    // 📊 stats client
    cy.intercept("GET", "**/demandes/client/1", {
      statusCode: 200,
      body: {
        success: true,
        demandes: [
          { statut: "complétée" },
          { statut: "en_attente" },
          { statut: "en_attente" },
        ],
      },
    }).as("getStats");

    // ✏️ update profil
    cy.intercept("PUT", "**/auth/update", {
      statusCode: 200,
      body: { success: true },
    }).as("updateProfile");
  });

  it("affiche les infos et statistiques du client", () => {
    cy.wait("@getStats");

    cy.contains("Bienvenue, Jean Test").should("be.visible");

    cy.contains("3").should("be.visible"); // total
    cy.contains("1").should("be.visible"); // complétées
    cy.contains("2").should("be.visible"); // en attente
  });

  it("met à jour le profil avec succès", () => {
    cy.get("input").eq(0).clear().type("Jean Modifié");
    cy.get("input").eq(1).clear().type("new@test.com");

    cy.contains("Mettre à jour").click();
    cy.wait("@updateProfile");

    cy.contains("Mise à jour réussie").should("be.visible");
  });

  it("redirige vers les requêtes client", () => {
    cy.contains("Voir mes requêtes").click();
    cy.url().should("include", "/requests-client");
  });

  it("déconnecte l’utilisateur", () => {
    cy.contains("Déconnexion").click();
    cy.url().should("include", "/login");
  });
});
