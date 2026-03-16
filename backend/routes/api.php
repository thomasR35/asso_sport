<?php

// ──────────────────────────────────────────────
//  Toutes les routes de l'API
//
//  Format : METHOD /chemin → Contrôleur@méthode
//
//  Pour ajouter une route :
//    1. Écrire la ligne du bon format ci-dessous
//    2. Créer la méthode dans le contrôleur
//
//  Préfixe /api ajouté automatiquement par Vite
//  (configuré dans frontend/vite.config.ts)
// ──────────────────────────────────────────────

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\EventController;
use App\Controllers\MemberController;
use App\Middleware\AuthMiddleware;
use App\Config\App;

// Lecture de la méthode HTTP et de l'URL demandée
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Suppression du préfixe /api s'il est présent
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/') ?: '/';

// ══════════════════════════════════════════════
//  Routes publiques — accessibles sans connexion
// ══════════════════════════════════════════════

// Connexion
if ($method === 'POST' && $uri === '/auth/login') {
    (new AuthController())->login();
}

// Inscription
if ($method === 'POST' && $uri === '/auth/register') {
    (new AuthController())->register();
}

// Déconnexion
if ($method === 'POST' && $uri === '/auth/logout') {
    (new AuthController())->logout();
}

// Renouvellement du token JWT (via cookie refresh)
if ($method === 'POST' && $uri === '/auth/refresh') {
    (new AuthController())->refresh();
}

// Vérification de l'email après inscription
if ($method === 'GET' && $uri === '/auth/verify-email') {
    (new AuthController())->verifyEmail();
}

// Demande de réinitialisation de mot de passe
if ($method === 'POST' && $uri === '/auth/forgot-password') {
    (new AuthController())->forgotPassword();
}

// Réinitialisation du mot de passe avec token
if ($method === 'POST' && $uri === '/auth/reset-password') {
    (new AuthController())->resetPassword();
}

// ══════════════════════════════════════════════
//  Routes protégées — connexion obligatoire
//  Le middleware AuthMiddleware vérifie le JWT
//  avant d'exécuter le contrôleur.
// ══════════════════════════════════════════════

// Vérification du token JWT pour toutes les routes suivantes
$authMiddleware = new AuthMiddleware();

// Liste de tous les événements
if ($method === 'GET' && $uri === '/events') {
    $authMiddleware->handle();
    (new EventController())->index();
}

// Détail d'un événement (ex: /events/5)
if ($method === 'GET' && preg_match('#^/events/(\d+)$#', $uri, $matches)) {
    $authMiddleware->handle();
    (new EventController())->show((int) $matches[1]);
}

// S'inscrire à un événement
if ($method === 'POST' && preg_match('#^/events/(\d+)/register$#', $uri, $matches)) {
    $authMiddleware->handle();
    (new EventController())->registerToEvent((int) $matches[1]);
}

// Se désinscrire d'un événement
if ($method === 'DELETE' && preg_match('#^/events/(\d+)/register$#', $uri, $matches)) {
    $authMiddleware->handle();
    (new EventController())->unregisterFromEvent((int) $matches[1]);
}

// Profil du membre connecté
if ($method === 'GET' && $uri === '/member/profile') {
    $authMiddleware->handle();
    (new MemberController())->getProfile();
}

// Mise à jour du profil
if ($method === 'PUT' && $uri === '/member/profile') {
    $authMiddleware->handle();
    (new MemberController())->updateProfile();
}

// Événements du membre connecté
if ($method === 'GET' && $uri === '/member/events') {
    $authMiddleware->handle();
    (new MemberController())->getMyEvents();
}

// Changement de mot de passe
if ($method === 'PUT' && $uri === '/member/password') {
    $authMiddleware->handle();
    (new MemberController())->changePassword();
}

// ══════════════════════════════════════════════
//  Route inconnue → 404
// ══════════════════════════════════════════════
App::errorResponse('Route introuvable', 404);
