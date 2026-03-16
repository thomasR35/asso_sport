<?php

// ──────────────────────────────────────────────
//  Middleware de limitation de débit (Rate Limiting)
//
//  Empêche les attaques par force brute sur les
//  routes sensibles (login, register).
//  Mécanisme : on stocke le nombre de tentatives
//  par IP dans un fichier temporaire.
//  → 5 tentatives max par 10 minutes par IP
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Middleware;

use App\Config\App;

class RateLimitMiddleware
{
    // Nombre de tentatives autorisées
    private int $maxAttempts = 5;

    // Fenêtre de temps en secondes (10 minutes)
    private int $windowSeconds = 600;

    // Dossier de stockage des compteurs
    private string $storageDir;

    public function __construct()
    {
        $this->storageDir = __DIR__ . '/../../logs/rate_limits/';

        // Créer le dossier s'il n'existe pas encore
        if (!is_dir($this->storageDir)) {
            mkdir($this->storageDir, 0755, true);
        }
    }

    public function handle(): void
    {
        $ip  = $this->getClientIp();
        $key = md5($ip); // On hashe l'IP pour le nom de fichier
        $file = $this->storageDir . $key . '.json';

        $data = $this->readData($file);

        // Si la fenêtre de temps est dépassée, on repart à zéro
        if (time() - $data['window_start'] > $this->windowSeconds) {
            $data = ['attempts' => 0, 'window_start' => time()];
        }

        $data['attempts']++;
        $this->writeData($file, $data);

        if ($data['attempts'] > $this->maxAttempts) {
            $retryAfter = $this->windowSeconds - (time() - $data['window_start']);
            header("Retry-After: {$retryAfter}");
            App::errorResponse(
                'Trop de tentatives. Réessayez dans ' . ceil($retryAfter / 60) . ' minute(s).',
                429
            );
        }
    }

    private function getClientIp(): string
    {
        // Vérification dans l'ordre de fiabilité
        return $_SERVER['HTTP_X_FORWARDED_FOR']
            ?? $_SERVER['HTTP_CLIENT_IP']
            ?? $_SERVER['REMOTE_ADDR']
            ?? 'unknown';
    }

    private function readData(string $file): array
    {
        if (!file_exists($file)) {
            return ['attempts' => 0, 'window_start' => time()];
        }

        $content = file_get_contents($file);
        $data    = json_decode($content, true);

        return is_array($data) ? $data : ['attempts' => 0, 'window_start' => time()];
    }

    private function writeData(string $file, array $data): void
    {
        file_put_contents($file, json_encode($data), LOCK_EX);
    }
}
