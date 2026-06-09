<?php

/**
 * Migration - Estrutura inicial do banco SQLite
 *
 * Execute na raiz do projeto:
 *   php app/Migration/migration.php
 */
class Migration
{
    private PDO $pdo;
    private Schema $schema;
    private Seeder $seeder;

    public function __construct(string $dbPath = __DIR__ . '/../Database/database.sqlite')
    {
        $databaseDir = dirname($dbPath);

        if (!is_dir($databaseDir)) {
            mkdir($databaseDir, 0775, true);
        }

        $this->pdo = new PDO('sqlite:' . $dbPath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');

        $this->schema = new Schema($this->pdo);
        $this->seeder = new Seeder($this->pdo);
    }

    public function run(): void
    {
        try {
            $this->pdo->beginTransaction();

            $this->schema->create('temas', function (Blueprint $table): void {
                $table->id();
                $table->string('nome', 80)->unique();
                $table->string('icone', 10)->nullable();
            });

            $this->schema->create('dificuldades', function (Blueprint $table): void {
                $table->id();
                $table->string('nome', 20)->unique();
            });

            $this->schema->create('palavras', function (Blueprint $table): void {
                $table->id();
                $table->string('palavra', 100)->unique();
                $table->integer('tema_id');
                $table->integer('dificuldade_id');
                $table->timestamp('criado_em');
                $table->foreign('tema_id', 'temas', 'id');
                $table->foreign('dificuldade_id', 'dificuldades', 'id');
            });

            $this->schema->create('jogadores', function (Blueprint $table): void {
                $table->id();
                $table->string('nome', 100);
                $table->string('email', 150)->nullable()->unique();
                $table->timestamp('criado_em');
            });

            $this->schema->create('partidas', function (Blueprint $table): void {
                $table->id();
                $table->integer('jogador_id');
                $table->integer('palavra_id');
                $table->integer('erros')->default(0);
                $table->boolean('venceu')->default(0);
                $table->timestamp('jogado_em');
                $table->foreign('jogador_id', 'jogadores', 'id');
                $table->foreign('palavra_id', 'palavras', 'id');
            });

            $this->seeder->insertOrIgnore('dificuldades', [
                ['nome' => 'Facil'],
                ['nome' => 'Medio'],
                ['nome' => 'Dificil'],
            ]);

            $this->seeder->insertOrIgnore('temas', [
                ['nome' => 'Natureza', 'icone' => '🌲'],
                ['nome' => 'Tecnologia', 'icone' => '💻'],
                ['nome' => 'Animais', 'icone' => '🐾'],
                ['nome' => 'Esportes', 'icone' => '⚽'],
                ['nome' => 'Comidas', 'icone' => '🍕'],
                ['nome' => 'Paises', 'icone' => '🌎'],
                ['nome' => 'Games', 'icone' => '🎮'],
            ]);

            $this->pdo->commit();

            $this->seedPalavras();

            echo "Migration executada com sucesso.\n";
        } catch (PDOException $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            echo 'Erro na migration: ' . $e->getMessage() . "\n";
            exit(1);
        }
    }

    private function seedPalavras(): void
    {
        $jsonPath = __DIR__ . '/../Data/palavras.json';
        if (!file_exists($jsonPath)) {
            echo "Aviso: palavras.json não encontrado para seeding.\n";
            return;
        }

        $palavras = json_decode(file_get_contents($jsonPath), true);
        if (!$palavras) {
            echo "Aviso: Falha ao decodificar palavras.json.\n";
            return;
        }

        echo "Semeando " . count($palavras) . " palavras... (isso pode levar alguns segundos)\n";

        // Mapeia nomes para IDs para evitar consultas repetitivas
        $temasMap = [];
        foreach ($this->pdo->query('SELECT id, nome FROM temas')->fetchAll() as $t) {
            $temasMap[$t['nome']] = $t['id'];
        }

        $difsMap = [];
        foreach ($this->pdo->query('SELECT id, nome FROM dificuldades')->fetchAll() as $d) {
            $difsMap[$d['nome']] = $d['id'];
        }

        $this->pdo->beginTransaction();
        
        $stmt = $this->pdo->prepare('INSERT OR IGNORE INTO palavras (palavra, tema_id, dificuldade_id) VALUES (?, ?, ?)');

        foreach ($palavras as $p) {
            $temaId = $temasMap[$p['tema']] ?? null;
            // Se o tema não existe no seeder inicial, cria um novo
            if (!$temaId) {
                $insTema = $this->pdo->prepare('INSERT INTO temas (nome) VALUES (?)');
                $insTema->execute([$p['tema']]);
                $temaId = (int) $this->pdo->lastInsertId();
                $temasMap[$p['tema']] = $temaId;
            }

            // Normaliza dificuldade (json pode ter acento, banco não)
            $difNome = str_replace(['á', 'é', 'í'], ['a', 'e', 'i'], $p['dificuldade']);
            $difId = $difsMap[$difNome] ?? $difsMap['Medio'];

            $stmt->execute([
                strtoupper($p['palavra']),
                $temaId,
                $difId
            ]);
        }

        $this->pdo->commit();
        echo "Words seeded com sucesso.\n";
    }
}

class Schema
{
    public function __construct(private PDO $pdo) {}

    public function create(string $table, callable $definition): void
    {
        $blueprint = new Blueprint($table);
        $definition($blueprint);

        $this->pdo->exec($blueprint->toSql());
    }
}

class Blueprint
{
    private array $columns = [];
    private array $constraints = [];

    public function __construct(private string $table) {}

    public function id(string $name = 'id'): Column
    {
        return $this->addColumn(new Column($name, 'INTEGER', true, false, 'PRIMARY KEY AUTOINCREMENT'));
    }

    public function string(string $name, int $length = 255): Column
    {
        return $this->addColumn(new Column($name, 'TEXT'));
    }

    public function integer(string $name): Column
    {
        return $this->addColumn(new Column($name, 'INTEGER'));
    }

    public function boolean(string $name): Column
    {
        return $this->addColumn(new Column($name, 'INTEGER'));
    }

    public function timestamp(string $name): Column
    {
        return $this->addColumn(new Column($name, 'TEXT', false, false, "DEFAULT CURRENT_TIMESTAMP"));
    }

    public function foreign(string $column, string $referencesTable, string $referencesColumn): void
    {
        $this->constraints[] = sprintf(
            'FOREIGN KEY (%s) REFERENCES %s (%s)',
            $this->wrap($column),
            $this->wrap($referencesTable),
            $this->wrap($referencesColumn)
        );
    }

    public function toSql(): string
    {
        $definitions = array_map(
            fn (Column $column): string => $column->toSql(),
            $this->columns
        );

        return sprintf(
            'CREATE TABLE IF NOT EXISTS %s (%s)',
            $this->wrap($this->table),
            implode(', ', array_merge($definitions, $this->constraints))
        );
    }

    private function addColumn(Column $column): Column
    {
        $this->columns[] = $column;

        return $column;
    }

    private function wrap(string $identifier): string
    {
        return '"' . str_replace('"', '""', $identifier) . '"';
    }
}

class Column
{
    private mixed $default = null;

    public function __construct(
        private string $name,
        private string $type,
        private bool $nullable = false,
        private bool $unique = false,
        private ?string $extra = null
    ) {}

    public function nullable(): self
    {
        $this->nullable = true;

        return $this;
    }

    public function unique(): self
    {
        $this->unique = true;

        return $this;
    }

    public function default(mixed $value): self
    {
        $this->default = $value;

        return $this;
    }

    public function toSql(): string
    {
        $parts = [$this->wrap($this->name), $this->type];

        if (!$this->nullable) {
            $parts[] = 'NOT NULL';
        }

        if ($this->unique) {
            $parts[] = 'UNIQUE';
        }

        if ($this->default !== null) {
            $parts[] = 'DEFAULT ' . $this->formatDefault($this->default);
        }

        if ($this->extra !== null) {
            $parts[] = $this->extra;
        }

        return implode(' ', $parts);
    }

    private function formatDefault(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_int($value) || is_float($value)) {
            return (string) $value;
        }

        return "'" . str_replace("'", "''", (string) $value) . "'";
    }

    private function wrap(string $identifier): string
    {
        return '"' . str_replace('"', '""', $identifier) . '"';
    }
}

class Seeder
{
    public function __construct(private PDO $pdo) {}

    public function insertOrIgnore(string $table, array $rows): void
    {
        foreach ($rows as $row) {
            $columns = array_keys($row);
            $placeholders = array_map(fn (string $column): string => ':' . $column, $columns);

            $statement = $this->pdo->prepare(sprintf(
                'INSERT OR IGNORE INTO %s (%s) VALUES (%s)',
                $this->wrap($table),
                implode(', ', array_map([$this, 'wrap'], $columns)),
                implode(', ', $placeholders)
            ));

            foreach ($row as $column => $value) {
                $statement->bindValue(':' . $column, $value);
            }

            $statement->execute();
        }
    }

    private function wrap(string $identifier): string
    {
        return '"' . str_replace('"', '""', $identifier) . '"';
    }
}

(new Migration())->run();
