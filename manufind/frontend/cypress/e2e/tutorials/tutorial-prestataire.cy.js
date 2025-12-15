describe("Tutorial Prestataire", () => {
  beforeEach(() => {
    cy.visit("/tuto-pres");
  });

  it("affiche le titre", () => {
    cy.contains("Guide Prestataire").should("be.visible");
  });

  it("affiche les étapes", () => {
    cy.contains("profil professionnel").should("be.visible");
    cy.contains("demandes sur la carte").should("be.visible");
    cy.contains("missions").should("be.visible");
  });
});
