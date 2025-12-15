describe("Signup ManuFind", () => {
  
  it("Signup valide", () => {
    cy.visit("/signup");

    // Nom d'utilisateur
    cy.get("input[type='text']").type("UmarTest");

    // Email
    cy.get("input[type='email']").type("signup_test_" + Date.now() + "@test.ca");

    // Mot de passe
    cy.get("input[type='password']").eq(0).type("test123");
    cy.get("input[type='password']").eq(1).type("test123");

    // Rôle
    cy.get("select").select("client");

    // Intercepter API
    cy.intercept("POST", "**/auth/signup").as("signup");

    // Soumettre
    cy.get("button[type='submit']").click();

    // Attendre API success + redirection
    cy.wait("@signup")
      .its("response.statusCode")
      .should("eq", 200);

    cy.location("pathname").should("include", "/login");
  });


  it("Erreur si mots de passe ne matchent pas", () => {
    cy.visit("/signup");

    cy.get("input[type='text']").type("UmarTest");
    cy.get("input[type='email']").type("test@test.com");

    cy.get("input[type='password']").eq(0).type("abc123");
    cy.get("input[type='password']").eq(1).type("differentPassword");

    cy.get("button[type='submit']").click();

    cy.contains("Les mots de passe ne correspondent pas.").should("exist");
  });

});