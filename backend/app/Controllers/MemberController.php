<?php

// ──────────────────────────────────────────────
//  Contrôleur de l'espace membre
//
//  Toutes les routes /api/member/*
//  Requiert une connexion (middleware JWT).
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Controllers;

use App\Services\MemberService;
use App\Services\EventService;
use App\Config\App;

class MemberController
{
    private MemberService $memberService;
    private EventService  $eventService;

    public function __construct()
    {
        $this->memberService = new MemberService();
        $this->eventService  = new EventService();
    }

    /**
     * GET /api/member/profile
     * Retourne le profil complet du membre connecté.
     */
    public function getProfile(): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];

        $profile = $this->memberService->getProfile($userId);

        if ($profile === null) {
            App::errorResponse('Profil introuvable', 404);
        }

        App::jsonResponse($profile, 200);
    }

    /**
     * PUT /api/member/profile
     * Met à jour les informations personnelles.
     * Corps attendu : { "firstName", "lastName", "birthDate", "phone" }
     */
    public function updateProfile(): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];
        $body   = App::getRequestBody();

        $firstName = trim($body['firstName'] ?? '');
        $lastName  = trim($body['lastName']  ?? '');
        $birthDate = trim($body['birthDate'] ?? '');
        $phone     = trim($body['phone']     ?? '');

        // Validation
        if (empty($firstName) || empty($lastName) || empty($birthDate) || empty($phone)) {
            App::errorResponse('Tous les champs sont requis', 400);
        }

        if (strlen($firstName) < 2 || strlen($lastName) < 2) {
            App::errorResponse('Prénom et nom doivent faire au moins 2 caractères', 400);
        }

        $result = $this->memberService->updateProfile($userId, $firstName, $lastName, $birthDate, $phone);

        if ($result === 'age_too_young') {
            App::errorResponse('Vous devez avoir au moins 16 ans', 400);
        }

        App::jsonResponse($result, 200);
    }

    /**
     * GET /api/member/events
     * Retourne les événements auxquels le membre est inscrit.
     */
    public function getMyEvents(): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];

        $events = $this->eventService->getMemberEvents($userId);

        App::jsonResponse($events, 200);
    }

    /**
     * PUT /api/member/password
     * Change le mot de passe du membre connecté.
     * Corps attendu : { "currentPassword": "...", "newPassword": "..." }
     */
    public function changePassword(): void
    {
        $userId = (int) $_REQUEST['auth_user_id'];
        $body   = App::getRequestBody();

        $currentPassword = trim($body['currentPassword'] ?? '');
        $newPassword     = trim($body['newPassword']     ?? '');

        if (empty($currentPassword) || empty($newPassword)) {
            App::errorResponse('Les deux mots de passe sont requis', 400);
        }

        if (strlen($newPassword) < 8) {
            App::errorResponse('Le nouveau mot de passe doit faire au moins 8 caractères', 400);
        }

        $success = $this->memberService->changePassword($userId, $currentPassword, $newPassword);

        if (!$success) {
            App::errorResponse('Mot de passe actuel incorrect', 401);
        }

        App::jsonResponse(['message' => 'Mot de passe modifié avec succès'], 200);
    }
}
