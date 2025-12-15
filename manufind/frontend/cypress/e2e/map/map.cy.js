describe("Map page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/demandes", {
      success: true,
      demandes: [],
    }).as("getDemandes");

    cy.visit("/map", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({ id: 1, role: "prestataire", nom: "Test" })
        );
      },
    });
  });

  it("affiche la carte", () => {
    cy.get(".map-container").should("exist");
  });

  it("affiche la barre de recherche", () => {
    cy.get("input[placeholder='Rechercher une adresse...']").should("be.visible");
  });

  it("affiche le loading au départ", () => {
    cy.contains("Chargement des demandes").should("exist");
    cy.wait("@getDemandes");
  });

  it("ne fait rien si la recherche est vide", () => {
    cy.get("button[type='submit']").click();
    cy.get(".leaflet-marker-icon").should("not.exist");
  });

  it("ajoute un marker après une recherche valide", () => {
    cy.intercept(
      "GET",
      "https://nominatim.openstreetmap.org/search*",
      [{ lat: "45.5", lon: "-73.5" }]
    ).as("search");

    cy.get("input").type("Montreal");
    cy.get("button[type='submit']").click();

    cy.wait("@search");
    cy.get(".leaflet-marker-icon", { timeout: 10000 }).should("exist");
  });
});
