describe("Login ManuFind", () => {

  it("login valide", () => {

    cy.visit("/login");

    cy.getByTest("email").type("test123@test.ca");
    cy.getByTest("password").type("test123");

    cy.intercept("POST", "**/auth/login").as("login");

    cy.getByTest("login-btn").click();

    cy.wait("@login")
      .its("response.statusCode")
      .should("eq", 200);
    cy.location("pathname").should("include", "/profile-client");
  });

});
