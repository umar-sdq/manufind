-- Script de création de la base de données ManuFind

-- 1) Créer la base
CREATE DATABASE IF NOT EXISTS manufind
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE manufind;

-- 2) Table des utilisateurs (clients + prestataires)
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,  -- sera haché avec bcrypt
    role ENUM('client','prestataire') NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3) Table des prestataires (infos pro)
CREATE TABLE prestataires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    categorie VARCHAR(100) NOT NULL,     -- ex: plombier, mécanicien
    zone VARCHAR(100) NOT NULL,          -- code postal / secteur
    disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- 4) Table des demandes de services
CREATE TABLE demandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    adresse VARCHAR(255),
    code_postal VARCHAR(20),
    date_heure DATETIME NOT NULL,
    duree_estimee INT,  -- en minutes
    statut ENUM('en_attente','acceptee','en_cours','terminee') DEFAULT 'en_attente',
    prestataire_id INT DEFAULT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (prestataire_id) REFERENCES prestataires(id)
);

-- 5) Table des évaluations
CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    demande_id INT NOT NULL,
    client_id INT NOT NULL,
    prestataire_id INT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (demande_id) REFERENCES demandes(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (prestataire_id) REFERENCES prestataires(id)
);

-- 6) Données de test
INSERT INTO utilisateurs (nom, email, mot_de_passe, role)
VALUES 
('Alice Client', 'alice@mail.com', 'password123', 'client'),
('Bob Prestataire', 'bob@mail.com', 'password123', 'prestataire');

INSERT INTO prestataires (utilisateur_id, categorie, zone)
VALUES (2, 'plombier', 'H7S');

INSERT INTO demandes (client_id, categorie, description, adresse, code_postal, date_heure, duree_estimee)
VALUES (1, 'plombier', 'Réparer un évier bouché', '1983 chemin de Nice, Laval', 'H7S 1G5', '2025-09-20 10:00:00', 60);
