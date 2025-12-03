@critique @contrat
Feature: Inscription utilisateur ManuFind

  # ----------------------------------------------
  # Scenario 1 : Email déjà utilisé / utilisateur existant
  # ----------------------------------------------
  Scenario: Inscription échouée - utilisateur déjà existant
    Given je suis sur "/signup"
    When je crée un compte avec:
      | username | email        | password | confirm | role   |
      | test     | test@test.ca | 123      | 123     | Client |
    Then je vois "Utilisateur déjà existant"

  # -----------------------------------------------------
  # Scenario 2 : Email invalide (déclenche validation HTML)
  # -----------------------------------------------------
  Scenario: Inscription échouée - email invalide
    Given je suis sur "/signup"
    When je remplis le champ email avec "test@"
    And je clique sur "S'inscrire"
    Then le champ email affiche un message contenant "Please enter a part following '@'"

  # --------------------------------------------------------
  # Scenario 3 : Mot de passe vide (validation HTML native)
  # --------------------------------------------------------
  Scenario: Inscription échouée - mot de passe manquant
    Given je suis sur "/signup"
    When je remplis le formulaire d'inscription avec:
      | username | email         | password | confirm | role   |
      | test     | test3@test.ca |          | 123     | Client |
    And je clique sur "S'inscrire"
    Then le champ mot de passe affiche un message contenant "Please fill out this field."
