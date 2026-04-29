<?php

/**
 * AlunoModel - Responsável pela comunicação com a tabela 'alunos' no SQLite.
 * Segue o princípio de encapsulamento: propriedades privadas, acesso via getters/setters.
 */

class AlunoModel
{
    private string $nome;
    private int    $idade;
    private string $curso;

    // ─── Getters ────────────────────────────────────────────────────────────────

    public function getNome(): string  { return $this->nome;  }
    public function getIdade(): int    { return $this->idade; }
    public function getCurso(): string { return $this->curso; }

    // ─── Setters ────────────────────────────────────────────────────────────────

    public function setNome(string $nome): void
    {
        $nome = trim($nome);
        if (empty($nome)) {
            throw new InvalidArgumentException('O nome não pode ser vazio.');
        }
        $this->nome = $nome;
    }

    public function setIdade(int $idade): void
    {
        if ($idade <= 0) {
            throw new InvalidArgumentException('A idade deve ser um número positivo.');
        }
        $this->idade = $idade;
    }

    public function setCurso(string $curso): void
    {
        $curso = trim($curso);
        if (empty($curso)) {
            throw new InvalidArgumentException('O curso não pode ser vazio.');
        }
        $this->curso = $curso;
    }

    // ─── Persistência ───────────────────────────────────────────────────────────

    /**
     * Salva o aluno no banco de dados usando Prepared Statements
     * para prevenir SQL Injection.
     */
    public function save(): int
    {
        $dbPath = __DIR__ . '/database.sqlite';

        if (!file_exists($dbPath)) {
            throw new RuntimeException(
                'Banco de dados não encontrado. Execute "php migration.php" primeiro.'
            );
        }

        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare(
            'INSERT INTO alunos (nome, idade, curso) VALUES (:nome, :idade, :curso)'
        );

        $stmt->execute([
            ':nome'  => $this->nome,
            ':idade' => $this->idade,
            ':curso' => $this->curso,
        ]);

        return (int) $pdo->lastInsertId();
    }
}
