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
        $sql = 'INSERT INTO palavras (palavra, tema, dificuldade) VALUES (:palavra, :tema, :dificuldade)';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':palavra'     => $palavra->getPalavra(),
            ':tema'        => $palavra->getTema(),
            ':dificuldade' => $palavra->getDificuldade(),
        ]);

        // Retorna a entidade com o ID gerado
        return $this->find((int) $this->pdo->lastInsertId());
    }

    private function update(Palavra $palavra): Palavra
    {
        $sql = 'UPDATE palavras SET palavra = :palavra, tema = :tema, dificuldade = :dificuldade WHERE id = :id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':palavra'     => $palavra->getPalavra(),
            ':tema'        => $palavra->getTema(),
            ':dificuldade' => $palavra->getDificuldade(),
            ':id'          => $palavra->getId(),
        ]);

        return $this->find($palavra->getId());
    }

    // ─────────────────────────────────────────────
    //  FIND
    // ─────────────────────────────────────────────
    public function find(int $id): ?Palavra
    {
        $stmt = $this->pdo->prepare('SELECT * FROM palavras WHERE id = :id');
        $stmt->execute([':id' => $id]);

        $row = $stmt->fetch();
        return $row ? $this->hydrate($row) : null;
    }

    public function findAll(?string $tema = null, ?string $dificuldade = null): array
    {
        $sql    = 'SELECT * FROM palavras WHERE 1=1';
        $params = [];

        if ($tema !== null) {
            $sql .= ' AND tema = :tema';
            $params[':tema'] = $tema;
        }

        if ($dificuldade !== null) {
            $sql .= ' AND dificuldade = :dificuldade';
            $params[':dificuldade'] = $dificuldade;
        }

        $sql .= ' ORDER BY tema, palavra';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return array_map([$this, 'hydrate'], $stmt->fetchAll());
    }

    public function findAleatorio(?string $tema = null, ?string $dificuldade = null): ?Palavra
    {
        $sql    = 'SELECT * FROM palavras WHERE 1=1';
        $params = [];

        if ($tema !== null) {
            $sql .= ' AND tema = :tema';
            $params[':tema'] = $tema;
        }

        if ($dificuldade !== null) {
            $sql .= ' AND dificuldade = :dificuldade';
            $params[':dificuldade'] = $dificuldade;
        }

        $sql .= ' ORDER BY RAND() LIMIT 1';

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
        $stmt = $this->pdo->query('SELECT DISTINCT tema FROM palavras ORDER BY tema');
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
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
