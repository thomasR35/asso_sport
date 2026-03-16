<?php

// ──────────────────────────────────────────────
//  Modèle Event — Requêtes SQL sur la table events
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class EventModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Retourne tous les événements avec le statut d'inscription
     * du membre connecté.
     */
    public function findAll(int $memberId, ?string $month = null, ?string $year = null): array
    {
        $where = '1=1';
        $params = [':member_id' => $memberId];

        // Filtrer par mois/année si demandé
        if ($month !== null && $year !== null) {
            $where .= ' AND MONTH(e.start_at) = :month AND YEAR(e.start_at) = :year';
            $params[':month'] = $month;
            $params[':year']  = $year;
        }

        $stmt = $this->db->prepare(
            "SELECT
                e.id,
                e.title,
                e.description,
                e.start_at,
                e.end_at,
                e.location,
                e.max_participants,
                e.category,
                COUNT(DISTINCT r2.id) AS current_participants,
                CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END AS is_registered
             FROM events e
             LEFT JOIN registrations r
                ON r.event_id = e.id AND r.member_id = :member_id
             LEFT JOIN registrations r2
                ON r2.event_id = e.id
             WHERE {$where}
             GROUP BY e.id
             ORDER BY e.start_at ASC"
        );
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    /**
     * Retourne un événement précis avec le statut d'inscription.
     */
    public function findById(int $eventId, int $memberId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT
                e.id,
                e.title,
                e.description,
                e.start_at,
                e.end_at,
                e.location,
                e.max_participants,
                e.category,
                COUNT(DISTINCT r2.id) AS current_participants,
                CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END AS is_registered
             FROM events e
             LEFT JOIN registrations r
                ON r.event_id = e.id AND r.member_id = :member_id
             LEFT JOIN registrations r2
                ON r2.event_id = e.id
             WHERE e.id = :event_id
             GROUP BY e.id
             LIMIT 1'
        );
        $stmt->execute([':event_id' => $eventId, ':member_id' => $memberId]);

        $event = $stmt->fetch();
        return $event !== false ? $event : null;
    }

    /**
     * Retourne les événements auxquels un membre est inscrit.
     */
    public function findByMemberId(int $memberId): array
    {
        $stmt = $this->db->prepare(
            'SELECT
                e.id,
                e.title,
                e.description,
                e.start_at,
                e.end_at,
                e.location,
                e.max_participants,
                e.category,
                COUNT(DISTINCT r2.id) AS current_participants,
                1 AS is_registered
             FROM events e
             JOIN registrations r ON r.event_id = e.id AND r.member_id = :member_id
             LEFT JOIN registrations r2 ON r2.event_id = e.id
             GROUP BY e.id
             ORDER BY e.start_at ASC'
        );
        $stmt->execute([':member_id' => $memberId]);

        return $stmt->fetchAll();
    }

    /**
     * Inscrit un membre à un événement.
     * Retourne false si l'événement est complet ou déjà inscrit.
     */
    public function registerMember(int $eventId, int $memberId): bool
    {
        // Vérification : déjà inscrit ?
        $stmtCheck = $this->db->prepare(
            'SELECT id FROM registrations WHERE event_id = :event_id AND member_id = :member_id'
        );
        $stmtCheck->execute([':event_id' => $eventId, ':member_id' => $memberId]);
        if ($stmtCheck->fetch()) {
            return false; // Déjà inscrit
        }

        // Vérification : places disponibles ?
        $stmtCount = $this->db->prepare(
            'SELECT e.max_participants, COUNT(r.id) AS count
             FROM events e
             LEFT JOIN registrations r ON r.event_id = e.id
             WHERE e.id = :event_id
             GROUP BY e.id'
        );
        $stmtCount->execute([':event_id' => $eventId]);
        $result = $stmtCount->fetch();

        if (
            $result
            && $result['max_participants'] !== null
            && $result['count'] >= $result['max_participants']
        ) {
            return false; // Complet
        }

        // Inscription
        $stmt = $this->db->prepare(
            'INSERT INTO registrations (event_id, member_id, registered_at)
             VALUES (:event_id, :member_id, NOW())'
        );
        $stmt->execute([':event_id' => $eventId, ':member_id' => $memberId]);

        return true;
    }

    /**
     * Désinscrit un membre d'un événement.
     */
    public function unregisterMember(int $eventId, int $memberId): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM registrations WHERE event_id = :event_id AND member_id = :member_id'
        );
        $stmt->execute([':event_id' => $eventId, ':member_id' => $memberId]);

        return $stmt->rowCount() > 0;
    }
}
