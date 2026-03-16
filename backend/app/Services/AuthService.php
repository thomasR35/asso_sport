<?php

// ──────────────────────────────────────────────
//  Service d'authentification — Logique métier
//
//  Ce service orchestre les opérations liées
//  à l'authentification. Il utilise :
//  - UserModel  → pour lire/écrire en base
//  - MemberModel → pour créer le profil membre
//  - JwtService  → pour créer les tokens
//  - MailService → pour envoyer les emails
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Services;

use App\Models\UserModel;
use App\Models\MemberModel;

class AuthService
{
    private UserModel   $userModel;
    private MemberModel $memberModel;
    private JwtService  $jwtService;
    private MailService $mailService;

    public function __construct()
    {
        $this->userModel   = new UserModel();
        $this->memberModel = new MemberModel();
        $this->jwtService  = new JwtService();
        $this->mailService = new MailService();
    }

    /**
     * Connecte un utilisateur.
     * Retourne les tokens et les infos utilisateur, ou null si échec.
     */
    public function login(string $email, string $password): ?array
    {
        // 1. L'utilisateur existe-t-il ?
        $user = $this->userModel->findByEmail($email);
        if ($user === null) {
            return null; // Email inconnu — même message que "mauvais mdp" (sécurité)
        }

        // 2. Le mot de passe est-il correct ?
        if (!password_verify($password, $user['password_hash'])) {
            return null;
        }

        // 3. L'email a-t-il été vérifié ?
        if (!$user['is_verified']) {
            return ['error' => 'email_not_verified'];
        }

        // 4. Récupérer le profil membre
        $member = $this->memberModel->findByUserId($user['id']);

        // 5. Créer les tokens
        $accessToken  = $this->jwtService->createAccessToken($user['id'], $user['role']);
        $refreshToken = $this->jwtService->createRefreshToken($user['id']);

        // 6. Sauvegarder le hash du refresh token en base
        $refreshExpiry = (int)($_ENV['JWT_REFRESH_EXPIRY'] ?? 604800);
        $this->userModel->saveRefreshToken(
            $user['id'],
            hash('sha256', $refreshToken),
            time() + $refreshExpiry
        );

        // 7. Envoyer le refresh token dans un cookie sécurisé
        $this->jwtService->sendRefreshTokenCookie($refreshToken);

        return [
            'accessToken' => $accessToken,
            'user' => [
                'id'         => $user['id'],
                'email'      => $user['email'],
                'role'       => $user['role'],
                'firstName'  => $member['first_name']  ?? '',
                'lastName'   => $member['last_name']   ?? '',
                'isVerified' => (bool) $user['is_verified'],
                'createdAt'  => $user['created_at'],
            ],
        ];
    }

    /**
     * Inscrit un nouvel utilisateur.
     * Retourne true si succès, ou un code d'erreur string si problème.
     */
    public function register(
        string $email,
        string $password,
        string $firstName,
        string $lastName,
        string $birthDate,
        string $phone
    ): bool|string {
        // 1. L'email est-il déjà utilisé ?
        if ($this->userModel->findByEmail($email) !== null) {
            return 'email_already_exists';
        }

        // 2. Hasher le mot de passe (bcrypt)
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        // 3. Générer un token de vérification email
        $verificationToken = bin2hex(random_bytes(32));

        // 4. Créer le compte utilisateur
        $userId = $this->userModel->create($email, $hashedPassword, $verificationToken);

        // 5. Créer le profil membre
        $this->memberModel->create($userId, $firstName, $lastName, $birthDate, $phone);

        // 6. Envoyer l'email de confirmation
        $this->mailService->sendEmailVerification($email, $firstName, $verificationToken);

        return true;
    }

    /**
     * Déconnecte un utilisateur (supprime ses refresh tokens).
     */
    public function logout(int $userId): void
    {
        $this->userModel->deleteRefreshTokens($userId);
        $this->jwtService->clearRefreshTokenCookie();
    }

    /**
     * Renouvelle l'access token à partir du refresh token (cookie httpOnly).
     * Retourne le nouvel access token ou null si le refresh token est invalide.
     */
    public function refreshToken(): ?string
    {
        // Lecture du refresh token dans le cookie
        $refreshToken = $_COOKIE['refresh_token'] ?? null;
        if ($refreshToken === null) {
            return null;
        }

        // Vérification de la signature JWT
        $payload = $this->jwtService->verifyRefreshToken($refreshToken);
        if ($payload === null) {
            return null;
        }

        $userId = $payload->user_id;

        // Vérification que le token est bien en base (pas révoqué)
        $tokenHash = hash('sha256', $refreshToken);
        if ($this->userModel->findRefreshToken($userId, $tokenHash) === null) {
            return null;
        }

        // Récupération du rôle pour le nouvel access token
        $user = $this->userModel->findById($userId);
        if ($user === null) {
            return null;
        }

        return $this->jwtService->createAccessToken($userId, $user['role']);
    }

    /**
     * Active un compte utilisateur via le token reçu par email.
     */
    public function verifyEmail(string $token): bool
    {
        return $this->userModel->verifyEmail($token);
    }

    /**
     * Initie la réinitialisation du mot de passe.
     * Envoie un email avec un lien sécurisé.
     */
    public function forgotPassword(string $email): void
    {
        $user = $this->userModel->findByEmail($email);

        // On ne révèle pas si l'email existe (sécurité)
        if ($user === null) {
            return;
        }

        $token = bin2hex(random_bytes(32));
        $this->userModel->savePasswordResetToken($user['id'], $token);
        $this->mailService->sendPasswordReset($email, $user['email'], $token);
    }

    /**
     * Réinitialise le mot de passe avec un token valide.
     */
    public function resetPassword(string $token, string $newPassword): bool
    {
        $user = $this->userModel->findByResetToken($token);
        if ($user === null) {
            return false;
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $this->userModel->updatePassword($user['id'], $hashedPassword);

        return true;
    }
}
