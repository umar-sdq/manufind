@critique @contrat
Feature: Connexion utilisateur ManuFind

  Scenario: Connexion réussie
    Given je suis sur "/login"
    When je me connecte avec "test@test.ca" et "123"
    Then je suis redirigé vers "/profile-client"
    And je vois "Profil"

  Scenario: Connexion échouée - mauvais mot de passe
    Given je suis sur "/login"
    When je me connecte avec "test@test.ca" et "wrongpass"
    Then je vois "Mot de passe invalide"

  Scenario: Connexion échouée - utilisateur inexistant
    Given je suis sur "/login"
    When je me connecte avec "inexistant@mail.ca" et "123"
    Then je vois "Utilisateur introuvable"
