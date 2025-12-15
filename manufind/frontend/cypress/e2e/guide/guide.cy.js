describe("Guide page", () => {
  beforeEach(() => {
    cy.visit("/guide");
  });

  it("affiche le titre principal", () => {
    cy.contains("Centre de guide ManuFind").should("be.visible");
  });

  it("contient les deux cartes de guide", () => {
    cy.contains("Guide Prestataire").should("be.visible");
    cy.contains("Guide Client").should("be.visible");
  });
});
