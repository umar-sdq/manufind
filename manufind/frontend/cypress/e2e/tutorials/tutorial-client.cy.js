describe("Tutorial Client", () => {
  beforeEach(() => {
    cy.visit("/tuto-client");
  });

  it("affiche le titre", () => {
    cy.contains("Guide Client").should("be.visible");
  });

  it("affiche les étapes", () => {
    cy.contains("Créez votre compte client").should("be.visible");
    cy.contains("Publiez une demande").should("be.visible");
    cy.contains("Suivez vos demandes").should("be.visible");
  });
});
