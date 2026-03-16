<?php

// ──────────────────────────────────────────────
//  Point d'entrée unique de l'API
//
//  TOUTES les requêtes HTTP arrivent ici.
//  Ce fichier ne fait que démarrer l'application.
//  Il ne contient aucune logique métier.
// ──────────────────────────────────────────────

declare(strict_types=1);

// Sécurité : on empêche l'affichage des erreurs PHP en production
// (les erreurs sont loguées, jamais affichées à l'utilisateur)
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Chargement de l'autoloader Composer
// (il va charger automatiquement toutes nos classes)
require_once __DIR__ . '/../vendor/autoload.php';

// Chargement des variables d'environnement (.env)
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Chargement des middlewares globaux
// (CORS doit être en tout premier — avant tout traitement)
require_once __DIR__ . '/../app/Middleware/CorsMiddleware.php';
(new App\Middleware\CorsMiddleware())->handle();

// Chargement du routeur
// (il lit l'URL et appelle le bon contrôleur)
require_once __DIR__ . '/../routes/api.php';
