<?php

// ──────────────────────────────────────────────
//  Middleware CORS (Cross-Origin Resource Sharing)
//
//  Le navigateur bloque par défaut les requêtes
//  entre deux origines différentes (ex: port 5173
//  vers port 8000). Ce middleware dit au navigateur
//  que c'est autorisé pour notre frontend.
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Middleware;

class CorsMiddleware
{
    public function handle(): void
    {
        $allowedOrigin = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';

        // Autoriser uniquement notre frontend (pas "toutes les origines")
        header("Access-Control-Allow-Origin: {$allowedOrigin}");

        // Autoriser les cookies (nécessaire pour le refresh token httpOnly)
        header('Access-Control-Allow-Credentials: true');

        // Méthodes HTTP autorisées
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

        // En-têtes autorisés dans les requêtes
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        // Les requêtes OPTIONS sont des "pre-flight" envoyées par le navigateur
        // avant une vraie requête — on répond juste 200 et on s'arrête
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        // Headers de sécurité supplémentaires
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
    }
}
