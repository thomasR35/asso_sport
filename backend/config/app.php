<?php

// ──────────────────────────────────────────────
//  Constantes et fonctions utilitaires globales
//
//  Ce fichier centralise les petits outils
//  utilisés partout dans l'application.
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Config;

class App
{
    /**
     * Envoie une réponse JSON et arrête l'exécution.
     *
     * Utilisé dans tous les contrôleurs pour répondre au frontend.
     *
     * Exemple d'utilisation :
     *   App::jsonResponse(['message' => 'Connexion réussie', 'user' => $user], 200);
     */
    public static function jsonResponse(mixed $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Envoie une réponse d'erreur JSON standardisée.
     *
     * Exemple d'utilisation :
     *   App::errorResponse('Email déjà utilisé', 409);
     */
    public static function errorResponse(string $message, int $statusCode = 400): void
    {
        self::jsonResponse(['message' => $message], $statusCode);
    }

    /**
     * Indique si l'application est en mode développement.
     * En production, certaines erreurs ne doivent pas être détaillées.
     */
    public static function isDevMode(): bool
    {
        return ($_ENV['APP_ENV'] ?? 'production') === 'development';
    }

    /**
     * Lit et décode le corps JSON de la requête entrante.
     * Retourne un tableau vide si le corps est absent ou invalide.
     */
    public static function getRequestBody(): array
    {
        $body = file_get_contents('php://input');
        if (empty($body)) {
            return [];
        }

        $decoded = json_decode($body, true);
        return is_array($decoded) ? $decoded : [];
    }
}
