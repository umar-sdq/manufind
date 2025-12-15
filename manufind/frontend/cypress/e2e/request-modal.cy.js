describe("RequestModal – acceptation prestataire", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/demandes", {
      statusCode: 200,
      body: {
        success: true,
        demandes: [
          {
            id: 42,
            categorie: "Plomberie",
            adresse: "1950 rue Claude Gagné",
            code_postal: "H7N2X3",
            duree_estimee: 60,
          },
        ],
      },
    }).as("getDemandes");

    cy.intercept(
      "GET",
      "https://nominatim.openstreetmap.org/search*",
      {
        statusCode: 200,
        body: [{ lat: "45.56", lon: "-73.71" }],
      }
    ).as("geocode");

    cy.intercept("PUT", "**/demandes/accepter/*", {
      statusCode: 200,
      body: { success: true },
    }).as("accept");

    cy.visit("/map", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "authData",
          JSON.stringify({ id: 99, role: "prestataire" })
        );
      },
    });
  });

  it("accepte une demande", () => {
    cy.wait("@getDemandes");
    cy.wait("@geocode");

    cy.get(".leaflet-marker-icon", { timeout: 10000 })
      .first()
      .trigger("mousedown", { force: true })
      .trigger("mouseup", { force: true })
      .trigger("click", { force: true });

    cy.get(".leaflet-popup-content")
      .should("be.visible");

    cy.contains("Accepter").click();
    cy.wait("@accept");
  });

it("ouvre le modal sans accepter", () => {
  cy.wait("@getDemandes");
  cy.wait("@geocode");

  cy.get(".leaflet-marker-icon")
    .first()
    .click({ force: true });

  cy.get(".leaflet-popup-content")
    .should("be.visible");

  cy.contains("Accepter").should("be.visible");
});


});
