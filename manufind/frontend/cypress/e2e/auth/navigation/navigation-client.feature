Feature: Navigation client connecté

  Background:
    Given je suis connecté en tant que client

  Scenario: Accéder au profil client
    When je clique sur le lien Profil
    Then je suis redirigé vers la page profil client

  Scenario: Accéder aux soumissions
    When je clique sur le lien Soumissions
    Then je suis redirigé vers la page des requêtes soumises

  Scenario: Créer une nouvelle requête
    When je clique sur le lien Requête
    Then je suis redirigé vers la page de création de requête

  Scenario: Accéder au guide
    When je clique sur le lien Guide
    Then je suis redirigé vers la page guide

  Scenario: Accéder aux services
    When je clique sur le lien Services
    Then je suis redirigé vers la page des services
