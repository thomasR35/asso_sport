-- ──────────────────────────────────────────────
--  Schéma de la base de données AS Dynamo
--
--  À exécuter UNE SEULE FOIS pour créer les tables.
--  Dans phpMyAdmin : importer ce fichier SQL.
--  En ligne de commande :
--    mysql -u root -p as_dynamo < database/schema.sql
-- ──────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS as_dynamo
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE as_dynamo;

-- ── Table : comptes utilisateurs (connexion) ──
CREATE TABLE IF NOT EXISTS users (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    password_hash           VARCHAR(255) NOT NULL,
    role                    ENUM('member', 'admin') NOT NULL DEFAULT 'member',
    is_verified             TINYINT(1)   NOT NULL DEFAULT 0,
    verification_token      VARCHAR(64)  NULL,
    reset_token             VARCHAR(64)  NULL,
    reset_token_expires_at  DATETIME     NULL,
    created_at              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_email            (email),
    INDEX idx_verification_token (verification_token),
    INDEX idx_reset_token       (reset_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Table : profils des membres ────────────────
-- Séparée de "users" pour distinguer les infos
-- de connexion des infos personnelles.
CREATE TABLE IF NOT EXISTS members (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL UNIQUE,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    birth_date  DATE         NOT NULL,
    phone       VARCHAR(20)  NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Table : refresh tokens ─────────────────────
-- Stocke les tokens de renouvellement de session.
-- Permet de les invalider lors d'une déconnexion.
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    token_hash  VARCHAR(64)  NOT NULL,
    expires_at  DATETIME     NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id   (user_id),
    INDEX idx_token_hash (token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Table : événements sportifs ────────────────
CREATE TABLE IF NOT EXISTS events (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    description      TEXT         NULL,
    start_at         DATETIME     NOT NULL,
    end_at           DATETIME     NULL,
    location         VARCHAR(255) NULL,
    max_participants INT UNSIGNED  NULL,   -- NULL = pas de limite
    category         ENUM('training', 'competition', 'social', 'meeting', 'other')
                     NOT NULL DEFAULT 'other',
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_start_at (start_at),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Table : inscriptions aux événements ────────
CREATE TABLE IF NOT EXISTS registrations (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_id     INT UNSIGNED NOT NULL,
    event_id      INT UNSIGNED NOT NULL,
    registered_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Un membre ne peut s'inscrire qu'une seule fois à un événement
    UNIQUE KEY unique_registration (member_id, event_id),

    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id)  REFERENCES events(id)  ON DELETE CASCADE,
    INDEX idx_member_id (member_id),
    INDEX idx_event_id  (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────
--  Données de test (à supprimer en production)
-- ──────────────────────────────────────────────

-- Événements de démonstration
INSERT INTO events (title, description, start_at, end_at, location, max_participants, category) VALUES
    ('Entraînement football',    'Entraînement hebdomadaire de l\'équipe senior',   DATE_ADD(NOW(), INTERVAL 2  DAY),  DATE_ADD(NOW(), INTERVAL 2  DAY),  'Stade municipal, Rennes',   22,   'training'),
    ('Match amical',             'Match amical contre le FC Betton',                DATE_ADD(NOW(), INTERVAL 5  DAY),  DATE_ADD(NOW(), INTERVAL 5  DAY),  'Stade de Betton',           NULL, 'competition'),
    ('Tournoi de printemps',     'Tournoi inter-associations, 8 équipes engagées', DATE_ADD(NOW(), INTERVAL 10 DAY),  DATE_ADD(NOW(), INTERVAL 11 DAY),  'Complexe sportif Nord',     100,  'competition'),
    ('Soirée de fin de saison',  'Repas convivial et remise des récompenses',       DATE_ADD(NOW(), INTERVAL 20 DAY),  DATE_ADD(NOW(), INTERVAL 20 DAY),  'Salle des fêtes, Rennes',   80,   'social'),
    ('Réunion bureau',           'Réunion mensuelle du bureau de l\'association',   DATE_ADD(NOW(), INTERVAL 7  DAY),  DATE_ADD(NOW(), INTERVAL 7  DAY),  'Siège de l\'association',   15,   'meeting'),
    ('Entraînement basket',      'Entraînement hebdomadaire basket',                DATE_ADD(NOW(), INTERVAL 3  DAY),  DATE_ADD(NOW(), INTERVAL 3  DAY),  'Gymnase Pasteur, Rennes',   20,   'training');
