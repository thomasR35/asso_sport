<?php

// ──────────────────────────────────────────────
//  Contrôleur d'authentification
//
//  RÈGLE : Ce contrôleur ne contient que 3 choses :
//    1. Lire les données de la requête
//    2. Appeler le service correspondant
//    3. Renvoyer la réponse JSON
//
//  Toute la logique métier est dans AuthService.
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;
use App\Middleware\RateLimitMiddleware;
use App\Config\App;

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * POST /api/auth/login
     * Corps attendu : { "email": "...", "password": "..." }
     */
    public function login(): void
    {
        // Protection force brute : max 5 tentatives / 10 min
        (new RateLimitMiddleware())->handle();

        $body = App::getRequestBody();

        $email    = trim($body['email']    ?? '');
        $password = trim($body['password'] ?? '');

        // Validation basique des champs
        if (empty($email) || empty($password)) {
            App::errorResponse('Email et mot de passe requis', 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            App::errorResponse('Format d\'email invalide', 400);
        }

        $result = $this->authService->login($email, $password);

        // Email non vérifié
        if (is_array($result) && isset($result['error']) && $result['error'] === 'email_not_verified') {
            App::errorResponse('Veuillez vérifier votre adresse email avant de vous connecter', 403);
        }

        // Identifiants incorrects
        if ($result === null) {
            // Message volontairement vague — on ne dit pas si c'est l'email ou le mdp
            App::errorResponse('Identifiants incorrects', 401);
        }

        App::jsonResponse($result, 200);
    }

    /**
     * POST /api/auth/register
     * Corps attendu : { "email", "password", "firstName", "lastName", "birthDate", "phone" }
     */
    public function register(): void
    {
        // Protection contre les inscriptions en masse
        (new RateLimitMiddleware())->handle();

        $body = App::getRequestBody();

        // Lecture et nettoyage des champs
        $email     = trim($body['email']       ?? '');
        $password  = trim($body['password']    ?? '');
        $firstName = trim($body['firstName']   ?? '');
        $lastName  = trim($body['lastName']    ?? '');
        $birthDate = trim($body['birthDate']   ?? '');
        $phone     = trim($body['phone']       ?? '');

        // Validation
        if (empty($email) || empty($password) || empty($firstName) || empty($lastName) || empty($birthDate) || empty($phone)) {
            App::errorResponse('Tous les champs sont requis', 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            App::errorResponse('Format d\'email invalide', 400);
        }

        if (strlen($password) < 8) {
            App::errorResponse('Le mot de passe doit faire au moins 8 caractères', 400);
        }

        $result = $this->authService->register($email, $password, $firstName, $lastName, $birthDate, $phone);

        if ($result === 'email_already_exists') {
            // Message volontairement vague pour ne pas confirmer l'existence d'un compte
            App::jsonResponse(['message' => 'Si cet email n\'est pas encore utilisé, un email de confirmation vous a été envoyé.'], 200);
            return;
        }

        App::jsonResponse(['message' => 'Compte créé. Vérifiez vos emails pour activer votre compte.'], 201);
    }

    /**
     * POST /api/auth/logout
     * Requiert : token JWT valide (middleware auth appliqué dans routes/api.php)
     * Note : la déconnexion est volontairement publique pour éviter une boucle
     */
    public function logout(): void
    {
        // On essaie de récupérer l'ID depuis le token, mais on déconnecte dans tous les cas
        $userId = $_REQUEST['auth_user_id'] ?? null;

        if ($userId !== null) {
            $this->authService->logout((int) $userId);
        }

        App::jsonResponse(['message' => 'Déconnecté avec succès'], 200);
    }

    /**
     * POST /api/auth/refresh
     * Pas de corps — lit le cookie httpOnly "refresh_token"
     */
    public function refresh(): void
    {
        $newAccessToken = $this->authService->refreshToken();

        if ($newAccessToken === null) {
            App::errorResponse('Session expirée, veuillez vous reconnecter', 401);
        }

        App::jsonResponse(['accessToken' => $newAccessToken], 200);
    }

    /**
     * GET /api/auth/verify-email?token=xxx
     */
    public function verifyEmail(): void
    {
        $token = $_GET['token'] ?? '';

        if (empty($token)) {
            App::errorResponse('Token manquant', 400);
        }

        $success = $this->authService->verifyEmail($token);

        if (!$success) {
            App::errorResponse('Token invalide ou déjà utilisé', 400);
        }

        // Redirection vers le frontend avec un message de succès
        $frontendUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';
        header("Location: {$frontendUrl}/login?verified=1");
        exit;
    }

    /**
     * POST /api/auth/forgot-password
     * Corps attendu : { "email": "..." }
     */
    public function forgotPassword(): void
    {
        (new RateLimitMiddleware())->handle();

        $body  = App::getRequestBody();
        $email = trim($body['email'] ?? '');

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            App::errorResponse('Email invalide', 400);
        }

        // On appelle le service même si l'email n'existe pas
        // → réponse identique dans les deux cas (sécurité)
        $this->authService->forgotPassword($email);

        App::jsonResponse(['message' => 'Si cet email est enregistré, un lien de réinitialisation vous a été envoyé.'], 200);
    }

    /**
     * POST /api/auth/reset-password
     * Corps attendu : { "token": "...", "newPassword": "..." }
     */
    public function resetPassword(): void
    {
        $body        = App::getRequestBody();
        $token       = trim($body['token']       ?? '');
        $newPassword = trim($body['newPassword'] ?? '');

        if (empty($token) || empty($newPassword)) {
            App::errorResponse('Token et nouveau mot de passe requis', 400);
        }

        if (strlen($newPassword) < 8) {
            App::errorResponse('Le mot de passe doit faire au moins 8 caractères', 400);
        }

        $success = $this->authService->resetPassword($token, $newPassword);

        if (!$success) {
            App::errorResponse('Token invalide ou expiré', 400);
        }

        App::jsonResponse(['message' => 'Mot de passe modifié avec succès'], 200);
    }
}
