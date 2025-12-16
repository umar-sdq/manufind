Feature: Navigation prestataire connecté

  Background:
    Given je suis connecté en tant que prestataire

  Scenario: Accéder au profil prestataire
    When je clique sur le lien Profil prestataire
    Then je suis redirigé vers la page profil prestataire

  Scenario: Accéder aux requêtes prestataire
    When je clique sur le lien Requêtes prestataire
    Then je suis redirigé vers la page requêtes prestataire

  Scenario: Accéder à la carte
    When je clique sur le lien Carte prestataire
    Then je suis redirigé vers la page carte prestataire

  Scenario: Accéder au guide prestataire
    When je clique sur le lien Guide prestataire
    Then je suis redirigé vers la page guide prestataire

  Scenario: Accéder aux services prestataire
    When je clique sur le lien Services prestataire
    Then je suis redirigé vers la page services prestataire
