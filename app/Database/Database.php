<?php

namespace Forca\Database;

use PDO;
use PDOException;
use RuntimeException;

/**
 * Classe responsável exclusivamente por:
 * 1. Abrir o banco SQLite da aplicação
 * 2. Retornar uma única instância PDO (padrão Singleton)
 *
 * Nenhum outro arquivo do sistema deve saber como conectar ao banco.
 */
class Database
{
    private static ?PDO $instance = null;

    // Construtor privado: impede instanciação direta
    private function __construct() {}

    // Clonagem proibida (Singleton)
    private function __clone() {}

    /**
     * Retorna a única instância PDO da aplicação.
     * Se ainda não existir, abre o SQLite e cria a conexão.
     */
    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            self::$instance = self::createConnection();
        }

        return self::$instance;
    }

    /**
     * Instancia o PDO apontando para o banco SQLite principal.
     * Lança RuntimeException em caso de falha — nunca exibe stack trace ao usuário.
     */
    private static function createConnection(): PDO
    {
        $dbPath = __DIR__ . '/database.sqlite';

        try {
            $pdo = new PDO('sqlite:' . $dbPath, null, null, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);

            $pdo->exec('PRAGMA foreign_keys = ON');

            return $pdo;

        } catch (PDOException $e) {
            // Loga internamente, mas nunca expõe detalhes ao usuário
            error_log('[Database] Falha na conexão: ' . $e->getMessage());
            throw new RuntimeException('Não foi possível conectar ao banco de dados.');
        }
    }
}
