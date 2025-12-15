describe("Header", () => {
  it("affiche Connexion / Inscription si non connecté", () => {
    cy.visit("/");
    cy.contains("Connexion").should("be.visible");
    cy.contains("Inscription").should("be.visible");
  });

  it("affiche les liens client connecté", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({ role: "client", nom: "ClientTest" })
        );
      },
    });

    cy.contains("Profil").should("be.visible");
    cy.contains("Déconnexion").should("be.visible");
    cy.contains("Requête").should("exist");
  });

  

  it("logout redirige vers accueil", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({ role: "client" })
        );
      },
    });

    cy.contains("Déconnexion").click();
    cy.location("pathname").should("eq", "/");
  });
});
