<?php

namespace Forca\Database;

use PDO;
use PDOException;
use RuntimeException;

/**
 * Classe responsável exclusivamente por:
 * 1. Ler as configurações do config.ini
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
     * Se ainda não existir, lê o config.ini e cria a conexão.
     */
    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            self::$instance = self::createConnection();
        }

        return self::$instance;
    }

    /**
     * Lê o config.ini e instancia o PDO.
     * Lança RuntimeException em caso de falha — nunca exibe stack trace ao usuário.
     */
    private static function createConnection(): PDO
    {
        $configPath = __DIR__ . '/../../config/config.ini';

        if (!file_exists($configPath)) {
            throw new RuntimeException('Arquivo de configuração não encontrado.');
        }

        $config = parse_ini_file($configPath, true);

        if ($config === false || !isset($config['database'])) {
            throw new RuntimeException('Configuração de banco de dados inválida.');
        }

        $db = $config['database'];

        $dsn = sprintf(
            '%s:host=%s;port=%s;dbname=%s;charset=%s',
            $db['driver'],
            $db['host'],
            $db['port'],
            $db['dbname'],
            $db['charset']
        );

        try {
            $pdo = new PDO($dsn, $db['username'], $db['password'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);

            return $pdo;

        } catch (PDOException $e) {
            // Loga internamente, mas nunca expõe detalhes ao usuário
            error_log('[Database] Falha na conexão: ' . $e->getMessage());
            throw new RuntimeException('Não foi possível conectar ao banco de dados.');
        }
    }
}
