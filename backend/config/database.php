<?php

// ──────────────────────────────────────────────
//  Connexion à la base de données (PDO)
//
//  PDO est l'outil PHP pour parler à MySQL.
//  On utilise des "requêtes préparées" qui
//  protègent contre les injections SQL.
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    // Instance unique (pattern Singleton)
    // → une seule connexion ouverte pendant toute la requête
    private static ?PDO $connection = null;

    /**
     * Retourne la connexion PDO.
     * Si elle n'existe pas encore, elle est créée.
     */
    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            self::$connection = self::createConnection();
        }

        return self::$connection;
    }

    /**
     * Crée la connexion en lisant les variables d'environnement (.env)
     */
    private static function createConnection(): PDO
    {
        $host     = $_ENV['DB_HOST']     ?? '127.0.0.1';
        $port     = $_ENV['DB_PORT']     ?? '3306';
        $database = $_ENV['DB_NAME']     ?? 'as_dynamo';
        $username = $_ENV['DB_USER']     ?? 'root';
        $password = $_ENV['DB_PASSWORD'] ?? '';

        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

        try {
            $pdo = new PDO($dsn, $username, $password, [
                // Lance une exception PHP si une requête SQL échoue
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                // Retourne les résultats sous forme de tableaux associatifs
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                // Désactive l'émulation des requêtes préparées (plus sûr)
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);

            return $pdo;

        } catch (PDOException $e) {
            // On logue l'erreur mais on n'expose RIEN à l'utilisateur
            error_log('Erreur de connexion BDD : ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Erreur interne du serveur']);
            exit;
        }
    }
}
