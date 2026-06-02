<?php

namespace Forca\Repositories;

use Forca\Models\Palavra;

/**
 * Contrato do repositório de palavras.
 * Define os métodos obrigatórios que qualquer implementação deve ter.
 * O Service depende desta interface — nunca da implementação concreta.
 */
interface IPalavraRepository
{
    /**
     * Salva (insere ou atualiza) uma palavra no banco.
     */
    public function save(Palavra $palavra): Palavra;

    /**
     * Busca uma palavra pelo ID.
     * Retorna null se não encontrada.
     */
    public function find(int $id): ?Palavra;

    /**
     * Remove uma palavra pelo ID.
     * Retorna true se removida com sucesso.
     */
    public function delete(int $id): bool;

    /**
     * Retorna todas as palavras, com filtro opcional por tema e/ou dificuldade.
     *
     * @return Palavra[]
     */
    public function findAll(?string $tema = null, ?string $dificuldade = null): array;

    /**
     * Verifica se já existe uma palavra com o mesmo texto (case-insensitive).
     */
    public function existsByPalavra(string $palavra, ?int $excludeId = null): bool;

    /**
     * Retorna todos os temas distintos cadastrados.
     */
    public function findTemas(): array;

    /**
     * Sorteia uma palavra aleatória, com filtro opcional.
     */
    public function findAleatorio(?string $tema = null, ?string $dificuldade = null): ?Palavra;
}
