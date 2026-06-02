<?php

namespace Forca\Repositories;

use PDO;
use Forca\Models\Palavra;

/**
 * Repositório concreto de Palavra.
 * Todo o SQL (PDO) fica estritamente contido aqui.
 * O Model (Palavra) é apenas uma entidade simples.
 */
class PalavraRepository implements IPalavraRepository
{
    public function __construct(private PDO $pdo) {}

    // ─────────────────────────────────────────────
    //  SAVE (INSERT ou UPDATE)
    // ─────────────────────────────────────────────
    public function save(Palavra $palavra): Palavra
    {
        if ($palavra->getId() === null) {
            return $this->insert($palavra);
        }
        return $this->update($palavra);
    }

    private function insert(Palavra $palavra): Palavra
    {
        $temaId = $this->getOrCreateTemaId($palavra->getTema());
        $dificuldadeId = $this->getDificuldadeId($palavra->getDificuldade());

        $sql = 'INSERT INTO palavras (palavra, tema_id, dificuldade_id) VALUES (:palavra, :tema_id, :dificuldade_id)';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':palavra'        => $palavra->getPalavra(),
            ':tema_id'        => $temaId,
            ':dificuldade_id' => $dificuldadeId,
        ]);

        // Retorna a entidade com o ID gerado
        return $this->find((int) $this->pdo->lastInsertId());
    }

    private function update(Palavra $palavra): Palavra
    {
        $temaId = $this->getOrCreateTemaId($palavra->getTema());
        $dificuldadeId = $this->getDificuldadeId($palavra->getDificuldade());

        $sql = 'UPDATE palavras
                   SET palavra = :palavra,
                       tema_id = :tema_id,
                       dificuldade_id = :dificuldade_id
                 WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':palavra'        => $palavra->getPalavra(),
            ':tema_id'        => $temaId,
            ':dificuldade_id' => $dificuldadeId,
            ':id'             => $palavra->getId(),
        ]);

        return $this->find($palavra->getId());
    }

    // ─────────────────────────────────────────────
    //  FIND
    // ─────────────────────────────────────────────
    public function find(int $id): ?Palavra
    {
        $stmt = $this->pdo->prepare($this->baseSelect() . ' WHERE p.id = :id');
        $stmt->execute([':id' => $id]);

        $row = $stmt->fetch();
        return $row ? $this->hydrate($row) : null;
    }

    public function findAll(?string $tema = null, ?string $dificuldade = null): array
    {
        $sql    = $this->baseSelect() . ' WHERE 1=1';
        $params = [];

        if ($tema !== null) {
            $sql .= ' AND t.nome = :tema';
            $params[':tema'] = $tema;
        }

        if ($dificuldade !== null) {
            $sql .= ' AND d.nome = :dificuldade';
            $params[':dificuldade'] = $dificuldade;
        }

        $sql .= ' ORDER BY t.nome, p.palavra';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return array_map([$this, 'hydrate'], $stmt->fetchAll());
    }

    public function findAleatorio(?string $tema = null, ?string $dificuldade = null): ?Palavra
    {
        $sql    = $this->baseSelect() . ' WHERE 1=1';
        $params = [];

        if ($tema !== null) {
            $sql .= ' AND t.nome = :tema';
            $params[':tema'] = $tema;
        }

        if ($dificuldade !== null) {
            $sql .= ' AND d.nome = :dificuldade';
            $params[':dificuldade'] = $dificuldade;
        }

        $sql .= ' ORDER BY RANDOM() LIMIT 1';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        $row = $stmt->fetch();
        return $row ? $this->hydrate($row) : null;
    }

    // ─────────────────────────────────────────────
    //  DELETE
    // ─────────────────────────────────────────────
    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM palavras WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    // ─────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────
    public function existsByPalavra(string $palavra, ?int $excludeId = null): bool
    {
        $sql    = 'SELECT COUNT(*) FROM palavras WHERE UPPER(palavra) = UPPER(:palavra)';
        $params = [':palavra' => $palavra];

        if ($excludeId !== null) {
            $sql .= ' AND id != :id';
            $params[':id'] = $excludeId;
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function findTemas(): array
    {
        $stmt = $this->pdo->query('SELECT nome FROM temas ORDER BY nome');
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    private function baseSelect(): string
    {
        return 'SELECT p.id,
                       p.palavra,
                       t.nome AS tema,
                       d.nome AS dificuldade,
                       p.criado_em
                  FROM palavras p
                  JOIN temas t ON t.id = p.tema_id
                  JOIN dificuldades d ON d.id = p.dificuldade_id';
    }

    private function getOrCreateTemaId(string $tema): int
    {
        $stmt = $this->pdo->prepare('SELECT id FROM temas WHERE nome = :nome');
        $stmt->execute([':nome' => $tema]);
        $id = $stmt->fetchColumn();

        if ($id !== false) {
            return (int) $id;
        }

        $stmt = $this->pdo->prepare('INSERT INTO temas (nome) VALUES (:nome)');
        $stmt->execute([':nome' => $tema]);

        return (int) $this->pdo->lastInsertId();
    }

    private function getDificuldadeId(string $dificuldade): int
    {
        $stmt = $this->pdo->prepare('SELECT id FROM dificuldades WHERE nome = :nome');
        $stmt->execute([':nome' => $dificuldade]);
        $id = $stmt->fetchColumn();

        if ($id === false) {
            throw new \RuntimeException("Dificuldade não cadastrada: {$dificuldade}");
        }

        return (int) $id;
    }

    /**
     * Converte uma linha do banco em objeto Palavra (hydration).
     */
    private function hydrate(array $row): Palavra
    {
        return new Palavra(
            palavra:     $row['palavra'],
            tema:        $row['tema'],
            dificuldade: $row['dificuldade'],
            id:          (int) $row['id'],
            criadoEm:    $row['criado_em'] ?? null
        );
    }
}
