<?php

// ──────────────────────────────────────────────
//  Modèle User — Requêtes SQL sur la table users
//
//  RÈGLE : Ce fichier ne contient QUE des
//  requêtes SQL. Pas de logique métier.
//  Toutes les requêtes sont préparées
//  (protection contre les injections SQL).
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class UserModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Trouve un utilisateur par son email.
     * Retourne null si non trouvé.
     */
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users WHERE email = :email LIMIT 1'
        );
        $stmt->execute([':email' => $email]);

        $user = $stmt->fetch();
        return $user !== false ? $user : null;
    }

    /**
     * Trouve un utilisateur par son ID.
     */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, email, role, is_verified, created_at FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);

        $user = $stmt->fetch();
        return $user !== false ? $user : null;
    }

    /**
     * Crée un nouvel utilisateur.
     * Retourne l'ID du compte créé.
     */
    public function create(string $email, string $hashedPassword, string $verificationToken): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (email, password_hash, verification_token, created_at)
             VALUES (:email, :password, :token, NOW())'
        );
        $stmt->execute([
            ':email'    => $email,
            ':password' => $hashedPassword,
            ':token'    => $verificationToken,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Active le compte d'un utilisateur après vérification email.
     */
    public function verifyEmail(string $token): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE users
             SET is_verified = 1, verification_token = NULL
             WHERE verification_token = :token AND is_verified = 0'
        );
        $stmt->execute([':token' => $token]);

        return $stmt->rowCount() > 0;
    }

    /**
     * Enregistre un token de réinitialisation de mot de passe.
     * Le token expire dans 1 heure.
     */
    public function savePasswordResetToken(int $userId, string $token): void
    {
        $stmt = $this->db->prepare(
            'UPDATE users
             SET reset_token = :token, reset_token_expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR)
             WHERE id = :id'
        );
        $stmt->execute([':token' => $token, ':id' => $userId]);
    }

    /**
     * Trouve un utilisateur par son token de réinitialisation (s'il n'est pas expiré).
     */
    public function findByResetToken(string $token): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users
             WHERE reset_token = :token
               AND reset_token_expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute([':token' => $token]);

        $user = $stmt->fetch();
        return $user !== false ? $user : null;
    }

    /**
     * Met à jour le mot de passe et invalide le token de réinitialisation.
     */
    public function updatePassword(int $userId, string $hashedPassword): void
    {
        $stmt = $this->db->prepare(
            'UPDATE users
             SET password_hash = :password, reset_token = NULL, reset_token_expires_at = NULL
             WHERE id = :id'
        );
        $stmt->execute([':password' => $hashedPassword, ':id' => $userId]);
    }

    /**
     * Sauvegarde le hash d'un refresh token en base
     * (pour pouvoir l'invalider lors de la déconnexion).
     */
    public function saveRefreshToken(int $userId, string $tokenHash, int $expiresAt): void
    {
        // On supprime d'abord les anciens tokens de cet utilisateur
        $stmtDelete = $this->db->prepare('DELETE FROM refresh_tokens WHERE user_id = :id');
        $stmtDelete->execute([':id' => $userId]);

        $stmtInsert = $this->db->prepare(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
             VALUES (:user_id, :token_hash, FROM_UNIXTIME(:expires_at))'
        );
        $stmtInsert->execute([
            ':user_id'    => $userId,
            ':token_hash' => $tokenHash,
            ':expires_at' => $expiresAt,
        ]);
    }

    /**
     * Vérifie si un refresh token est valide en base.
     */
    public function findRefreshToken(int $userId, string $tokenHash): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM refresh_tokens
             WHERE user_id = :user_id
               AND token_hash = :token_hash
               AND expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute([':user_id' => $userId, ':token_hash' => $tokenHash]);

        $token = $stmt->fetch();
        return $token !== false ? $token : null;
    }

    /**
     * Supprime tous les refresh tokens d'un utilisateur (déconnexion).
     */
    public function deleteRefreshTokens(int $userId): void
    {
        $stmt = $this->db->prepare('DELETE FROM refresh_tokens WHERE user_id = :id');
        $stmt->execute([':id' => $userId]);
    }
}
