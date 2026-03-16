<?php

// ──────────────────────────────────────────────
//  Service événements — Logique métier
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Services;

use App\Models\EventModel;
use App\Models\MemberModel;

class EventService
{
    private EventModel  $eventModel;
    private MemberModel $memberModel;

    public function __construct()
    {
        $this->eventModel  = new EventModel();
        $this->memberModel = new MemberModel();
    }

    /**
     * Retourne tous les événements formatés pour le frontend.
     */
    public function getAllEvents(int $userId, ?string $month = null, ?string $year = null): array
    {
        $member = $this->memberModel->findByUserId($userId);
        $memberId = $member['id'] ?? 0;

        $events = $this->eventModel->findAll($memberId, $month, $year);

        return array_map(fn($e) => $this->formatEvent($e), $events);
    }

    /**
     * Retourne un événement précis.
     */
    public function getEvent(int $eventId, int $userId): ?array
    {
        $member = $this->memberModel->findByUserId($userId);
        $memberId = $member['id'] ?? 0;

        $event = $this->eventModel->findById($eventId, $memberId);
        return $event !== null ? $this->formatEvent($event) : null;
    }

    /**
     * Retourne les événements du membre connecté.
     */
    public function getMemberEvents(int $userId): array
    {
        $member = $this->memberModel->findByUserId($userId);
        if ($member === null) {
            return [];
        }

        $events = $this->eventModel->findByMemberId($member['id']);
        return array_map(fn($e) => $this->formatEvent($e), $events);
    }

    /**
     * Inscrit un membre à un événement.
     */
    public function registerToEvent(int $eventId, int $userId): bool|string
    {
        $member = $this->memberModel->findByUserId($userId);
        if ($member === null) {
            return 'member_not_found';
        }

        $success = $this->eventModel->registerMember($eventId, $member['id']);
        return $success ? true : 'registration_failed';
    }

    /**
     * Désinscrit un membre d'un événement.
     */
    public function unregisterFromEvent(int $eventId, int $userId): bool
    {
        $member = $this->memberModel->findByUserId($userId);
        if ($member === null) {
            return false;
        }

        return $this->eventModel->unregisterMember($eventId, $member['id']);
    }

    /**
     * Formate un événement de la BDD vers le format attendu par le frontend.
     * Convention BDD : snake_case → Convention frontend : camelCase
     */
    private function formatEvent(array $event): array
    {
        return [
            'id'                  => $event['id'],
            'title'               => $event['title'],
            'description'         => $event['description'] ?? '',
            'startAt'             => $event['start_at'],
            'endAt'               => $event['end_at'],
            'location'            => $event['location'] ?? '',
            'maxParticipants'     => $event['max_participants'] !== null
                                        ? (int) $event['max_participants']
                                        : null,
            'currentParticipants' => (int) $event['current_participants'],
            'isRegistered'        => (bool) $event['is_registered'],
            'category'            => $event['category'] ?? 'other',
        ];
    }
}
