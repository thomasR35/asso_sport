<?php

// ──────────────────────────────────────────────
//  Service membre — Logique métier du profil
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Services;

use App\Models\MemberModel;
use App\Models\UserModel;

class MemberService
{
    private MemberModel $memberModel;
    private UserModel   $userModel;

    public function __construct()
    {
        $this->memberModel = new MemberModel();
        $this->userModel   = new UserModel();
    }

    /**
     * Retourne le profil complet du membre connecté.
     */
    public function getProfile(int $userId): ?array
    {
        $member = $this->memberModel->findByUserId($userId);
        if ($member === null) {
            return null;
        }

        // Formatage des données pour le frontend
        return [
            'id'             => $member['id'],
            'userId'         => $member['user_id'],
            'firstName'      => $member['first_name'],
            'lastName'       => $member['last_name'],
            'birthDate'      => $member['birth_date'],
            'phone'          => $member['phone'],
            'email'          => $member['email'],
            'memberSince'    => $member['member_since'],
            'upcomingEvents' => (int) $member['upcoming_events'],
        ];
    }

    /**
     * Met à jour les informations personnelles du membre.
     * Retourne le profil mis à jour ou une erreur string.
     */
    public function updateProfile(
        int    $userId,
        string $firstName,
        string $lastName,
        string $birthDate,
        string $phone
    ): array|string {
        // Vérification de l'âge (16 ans minimum)
        $age = (time() - strtotime($birthDate)) / (365.25 * 24 * 3600);
        if ($age < 16) {
            return 'age_too_young';
        }

        $this->memberModel->update($userId, $firstName, $lastName, $birthDate, $phone);

        return $this->getProfile($userId) ?? [];
    }

    /**
     * Change le mot de passe du membre connecté.
     * Vérifie d'abord l'ancien mot de passe.
     */
    public function changePassword(int $userId, string $currentPassword, string $newPassword): bool
    {
        $user = $this->userModel->findById($userId);
        if ($user === null) {
            return false;
        }

        // On doit chercher avec le password_hash — findById ne le retourne pas
        // On refait une requête complète pour avoir le hash
        $userWithPassword = $this->userModel->findByEmail($user['email']);
        if ($userWithPassword === null) {
            return false;
        }

        // Vérification de l'ancien mot de passe
        if (!password_verify($currentPassword, $userWithPassword['password_hash'])) {
            return false;
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $this->userModel->updatePassword($userId, $hashedPassword);

        return true;
    }
}
