<?php

/**
 * Migration - Configuração inicial do banco de dados
 * Execute este arquivo UMA ÚNICA VEZ antes de iniciar a aplicação:
 *   php migration.php
 */

class Migration
{
    private string $dbPath;

    public function __construct(string $dbPath = __DIR__ . '/database.sqlite')
    {
        $this->dbPath = $dbPath;
    }

    public function run(): void
    {
        try {
            $pdo = new PDO('sqlite:' . $this->dbPath);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "CREATE TABLE IF NOT EXISTS alunos (
                id     INTEGER PRIMARY KEY AUTOINCREMENT,
                nome   TEXT    NOT NULL,
                idade  INTEGER NOT NULL,
                curso  TEXT    NOT NULL
            )";

            $pdo->exec($sql);

            echo "✅  Migration concluída com sucesso!\n";
            echo "📁  Banco de dados: " . realpath($this->dbPath) . "\n";
            echo "📋  Tabela 'alunos' criada (ou já existia).\n";
        } catch (PDOException $e) {
            echo "❌  Erro na migration: " . $e->getMessage() . "\n";
            exit(1);
        }
    }
}

// Executa a migration ao rodar o arquivo diretamente
(new Migration())->run();
