<?php

// ──────────────────────────────────────────────
//  Modèle Member — Requêtes SQL sur la table members
//
//  La table members contient les infos personnelles
//  du membre (prénom, nom, téléphone, etc.)
//  séparées des infos de connexion (table users).
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class MemberModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Trouve le profil complet d'un membre par l'ID de son compte utilisateur.
     */
    public function findByUserId(int $userId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT
                m.id,
                m.user_id,
                m.first_name,
                m.last_name,
                m.birth_date,
                m.phone,
                u.email,
                m.created_at AS member_since,
                (
                    SELECT COUNT(*)
                    FROM registrations r
                    JOIN events e ON r.event_id = e.id
                    WHERE r.member_id = m.id AND e.start_at > NOW()
                ) AS upcoming_events
             FROM members m
             JOIN users u ON u.id = m.user_id
             WHERE m.user_id = :user_id
             LIMIT 1'
        );
        $stmt->execute([':user_id' => $userId]);

        $member = $stmt->fetch();
        return $member !== false ? $member : null;
    }

    /**
     * Crée le profil d'un membre après son inscription.
     */
    public function create(int $userId, string $firstName, string $lastName, string $birthDate, string $phone): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO members (user_id, first_name, last_name, birth_date, phone, created_at)
             VALUES (:user_id, :first_name, :last_name, :birth_date, :phone, NOW())'
        );
        $stmt->execute([
            ':user_id'    => $userId,
            ':first_name' => $firstName,
            ':last_name'  => $lastName,
            ':birth_date' => $birthDate,
            ':phone'      => $phone,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Met à jour les informations personnelles d'un membre.
     */
    public function update(int $userId, string $firstName, string $lastName, string $birthDate, string $phone): void
    {
        $stmt = $this->db->prepare(
            'UPDATE members
             SET first_name = :first_name,
                 last_name  = :last_name,
                 birth_date = :birth_date,
                 phone      = :phone
             WHERE user_id = :user_id'
        );
        $stmt->execute([
            ':first_name' => $firstName,
            ':last_name'  => $lastName,
            ':birth_date' => $birthDate,
            ':phone'      => $phone,
            ':user_id'    => $userId,
        ]);
    }
}
