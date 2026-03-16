<?php

// ──────────────────────────────────────────────
//  Service JWT (JSON Web Token)
//
//  Un JWT est un "ticket" signé numériquement.
//  Le serveur le crée lors de la connexion.
//  Le client le renvoie à chaque requête pour
//  prouver qu'il est bien connecté.
//
//  On utilise DEUX tokens :
//  - Access token  : durée courte (15 min), dans le header
//  - Refresh token : durée longue (7 jours), dans un cookie httpOnly
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class JwtService
{
    private string $secret;
    private int    $accessExpiry;
    private int    $refreshExpiry;

    public function __construct()
    {
        $this->secret        = $_ENV['JWT_SECRET']         ?? 'changez_cette_cle';
        $this->accessExpiry  = (int)($_ENV['JWT_ACCESS_EXPIRY']  ?? 900);
        $this->refreshExpiry = (int)($_ENV['JWT_REFRESH_EXPIRY'] ?? 604800);
    }

    /**
     * Crée un access token JWT de courte durée (15 min par défaut).
     * Contient l'ID et le rôle de l'utilisateur.
     */
    public function createAccessToken(int $userId, string $role): string
    {
        $payload = [
            'iss'     => $_ENV['APP_URL'] ?? 'http://localhost:8000',
            'iat'     => time(),
            'exp'     => time() + $this->accessExpiry,
            'type'    => 'access',
            'user_id' => $userId,
            'role'    => $role,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    /**
     * Crée un refresh token JWT de longue durée (7 jours par défaut).
     * Envoyé dans un cookie httpOnly (invisible au JavaScript).
     */
    public function createRefreshToken(int $userId): string
    {
        $payload = [
            'iss'     => $_ENV['APP_URL'] ?? 'http://localhost:8000',
            'iat'     => time(),
            'exp'     => time() + $this->refreshExpiry,
            'type'    => 'refresh',
            'user_id' => $userId,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    /**
     * Vérifie un access token et retourne son contenu.
     * Retourne null si le token est invalide ou expiré.
     */
    public function verifyAccessToken(string $token): ?object
    {
        return $this->decodeToken($token, 'access');
    }

    /**
     * Vérifie un refresh token et retourne son contenu.
     * Retourne null si le token est invalide ou expiré.
     */
    public function verifyRefreshToken(string $token): ?object
    {
        return $this->decodeToken($token, 'refresh');
    }

    /**
     * Envoie le refresh token dans un cookie sécurisé httpOnly.
     * "httpOnly" = le JavaScript ne peut PAS lire ce cookie (protection XSS).
     */
    public function sendRefreshTokenCookie(string $token): void
    {
        $isProduction = ($_ENV['APP_ENV'] ?? 'development') === 'production';

        setcookie('refresh_token', $token, [
            'expires'  => time() + $this->refreshExpiry,
            'path'     => '/api/auth',  // Cookie limité aux routes auth
            'secure'   => $isProduction, // HTTPS uniquement en production
            'httponly' => true,           // Invisible au JavaScript
            'samesite' => 'Strict',       // Protège contre le CSRF
        ]);
    }

    /**
     * Supprime le cookie refresh token (lors de la déconnexion).
     */
    public function clearRefreshTokenCookie(): void
    {
        setcookie('refresh_token', '', [
            'expires'  => time() - 3600,
            'path'     => '/api/auth',
            'secure'   => false,
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
    }

    /**
     * Méthode interne : décode et valide un token.
     */
    private function decodeToken(string $token, string $expectedType): ?object
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));

            // Vérification du type de token (access vs refresh)
            if (($decoded->type ?? '') !== $expectedType) {
                return null;
            }

            return $decoded;

        } catch (\Exception) {
            // Token invalide, expiré ou malformé → on retourne null
            return null;
        }
    }
}
