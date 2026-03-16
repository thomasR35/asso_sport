<?php

// ──────────────────────────────────────────────
//  Middleware d'authentification
//
//  Vérifie que la requête contient un token JWT
//  valide dans le header "Authorization".
//  Si le token est absent ou invalide → 401.
//  Si valide → stocke les infos de l'utilisateur
//  dans $_REQUEST pour que le contrôleur y accède.
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Middleware;

use App\Services\JwtService;
use App\Config\App;

class AuthMiddleware
{
    public function handle(): void
    {
        // Récupération du header Authorization
        // Format attendu : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        $authHeader = $_SERVER['HTTP_AUTHORIZATION']
            ?? getallheaders()['Authorization']
            ?? null;

        if ($authHeader === null) {
            App::errorResponse('Token manquant', 401);
        }

        // Extraction du token (on retire le préfixe "Bearer ")
        $token = str_replace('Bearer ', '', $authHeader);

        // Vérification du token
        $payload = (new JwtService())->verifyAccessToken($token);

        if ($payload === null) {
            App::errorResponse('Token invalide ou expiré', 401);
        }

        // Stockage des infos décodées pour le contrôleur
        // Le contrôleur pourra accéder à l'ID de l'utilisateur connecté via :
        // $_REQUEST['auth_user_id']
        $_REQUEST['auth_user_id'] = $payload->user_id;
        $_REQUEST['auth_user_role'] = $payload->role;
    }
}
