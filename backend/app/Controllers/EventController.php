<?php

// ──────────────────────────────────────────────
//  Contrôleur des événements
//
//  Toutes les routes /api/events/*
//  Requiert une connexion (middleware JWT appliqué
//  dans routes/api.php avant chaque méthode).
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Controllers;

use App\Services\EventService;
use App\Config\App;

class EventController
{
    private EventService $eventService;

    public function __construct()
    {
        $this->eventService = new EventService();
    }

    /**
     * GET /api/events
     * Paramètres optionnels : ?month=6&year=2025
     */
    public function index(): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];

        // Paramètres de filtre optionnels
        $month = isset($_GET['month']) ? (string) intval($_GET['month']) : null;
        $year  = isset($_GET['year'])  ? (string) intval($_GET['year'])  : null;

        $events = $this->eventService->getAllEvents($userId, $month, $year);

        App::jsonResponse($events, 200);
    }

    /**
     * GET /api/events/{id}
     */
    public function show(int $eventId): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];

        $event = $this->eventService->getEvent($eventId, $userId);

        if ($event === null) {
            App::errorResponse('Événement introuvable', 404);
        }

        App::jsonResponse($event, 200);
    }

    /**
     * POST /api/events/{id}/register
     * Inscrit le membre connecté à un événement.
     */
    public function registerToEvent(int $eventId): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];

        $result = $this->eventService->registerToEvent($eventId, $userId);

        if ($result === 'member_not_found') {
            App::errorResponse('Profil membre introuvable', 404);
        }

        if ($result === 'registration_failed') {
            App::errorResponse('Inscription impossible (événement complet ou déjà inscrit)', 409);
        }

        App::jsonResponse(['message' => 'Inscription confirmée'], 201);
    }

    /**
     * DELETE /api/events/{id}/register
     * Désinscrit le membre connecté d'un événement.
     */
    public function unregisterFromEvent(int $eventId): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];

        $success = $this->eventService->unregisterFromEvent($eventId, $userId);

        if (!$success) {
            App::errorResponse('Désinscription impossible (vous n\'êtes pas inscrit)', 404);
        }

        App::jsonResponse(['message' => 'Désinscription confirmée'], 200);
    }
}
