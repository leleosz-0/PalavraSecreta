<?php

namespace Forca\Services;

use Forca\Models\Palavra;
use Forca\Repositories\IPalavraRepository;
use Forca\Exceptions\BusinessRuleException;

/**
 * Service de Palavra — contém todas as regras de negócio.
 *
 * Regra de Ouro: O Service NÃO instancia o Repositório internamente.
 * Recebe a Interface via construtor (Injeção de Dependência).
 */
class PalavraService
{
    private const DIFICULDADES_VALIDAS = ['Facil', 'Medio', 'Dificil'];
    private const MIN_LETRAS           = 3;
    private const MAX_LETRAS           = 50;

    /**
     * Recebe a interface — não a implementação concreta.
     * Isso desacopla o Service do banco de dados real.
     */
    public function __construct(private IPalavraRepository $repository) {}

    // ─────────────────────────────────────────────
    //  CADASTRAR
    // ─────────────────────────────────────────────
    public function cadastrar(string $palavra, string $tema, string $dificuldade): Palavra
    {
        $this->validarPalavra($palavra);
        $this->validarTema($tema);
        $this->validarDificuldade($dificuldade);

        $palavraUpper = strtoupper(trim($palavra));

        if ($this->repository->existsByPalavra($palavraUpper)) {
            throw new BusinessRuleException(
                "A palavra \"{$palavraUpper}\" já está cadastrada.",
                409
            );
        }

        $entidade = new Palavra($palavraUpper, trim($tema), $dificuldade);
        return $this->repository->save($entidade);
    }

    // ─────────────────────────────────────────────
    //  ATUALIZAR
    // ─────────────────────────────────────────────
    public function atualizar(int $id, string $palavra, string $tema, string $dificuldade): Palavra
    {
        $existente = $this->repository->find($id);
        if ($existente === null) {
            throw new BusinessRuleException("Palavra com ID {$id} não encontrada.", 404);
        }

        $this->validarPalavra($palavra);
        $this->validarTema($tema);
        $this->validarDificuldade($dificuldade);

        $palavraUpper = strtoupper(trim($palavra));

        if ($this->repository->existsByPalavra($palavraUpper, $id)) {
            throw new BusinessRuleException(
                "A palavra \"{$palavraUpper}\" já está cadastrada.",
                409
            );
        }

        $existente->setPalavra($palavraUpper);
        $existente->setTema(trim($tema));
        $existente->setDificuldade($dificuldade);

        return $this->repository->save($existente);
    }

    // ─────────────────────────────────────────────
    //  REMOVER
    // ─────────────────────────────────────────────
    public function remover(int $id): void
    {
        $existente = $this->repository->find($id);
        if ($existente === null) {
            throw new BusinessRuleException("Palavra com ID {$id} não encontrada.", 404);
        }

        $this->repository->delete($id);
    }

    // ─────────────────────────────────────────────
    //  CONSULTAS
    // ─────────────────────────────────────────────
    public function listar(?string $tema = null, ?string $dificuldade = null): array
    {
        if ($dificuldade !== null && !in_array($dificuldade, self::DIFICULDADES_VALIDAS, true)) {
            throw new BusinessRuleException("Dificuldade inválida: {$dificuldade}");
        }

        return $this->repository->findAll($tema ?: null, $dificuldade ?: null);
    }

    public function buscarPorId(int $id): Palavra
    {
        $palavra = $this->repository->find($id);
        if ($palavra === null) {
            throw new BusinessRuleException("Palavra com ID {$id} não encontrada.", 404);
        }
        return $palavra;
    }

    public function sortearPalavra(?string $tema = null, ?string $dificuldade = null): Palavra
    {
        $palavra = $this->repository->findAleatorio($tema ?: null, $dificuldade ?: null);

        if ($palavra === null) {
            $filtro = $tema ? " para o tema \"{$tema}\"" : '';
            $filtro .= $dificuldade ? " com dificuldade \"{$dificuldade}\"" : '';
            throw new BusinessRuleException("Nenhuma palavra cadastrada{$filtro}.", 404);
        }

        return $palavra;
    }

    public function listarTemas(): array
    {
        return $this->repository->findTemas();
    }

    // ─────────────────────────────────────────────
    //  VALIDAÇÕES PRIVADAS
    // ─────────────────────────────────────────────
    private function validarPalavra(string $palavra): void
    {
        $palavra = trim($palavra);

        if ($palavra === '') {
            throw new BusinessRuleException('A palavra não pode estar em branco.');
        }

        // Conta apenas letras (ignora espaços e hífens compostos)
        $apenasLetras = preg_replace('/[\s\-]/', '', $palavra);

        if (mb_strlen($apenasLetras) < self::MIN_LETRAS) {
            throw new BusinessRuleException(
                'A palavra precisa ter pelo menos ' . self::MIN_LETRAS . ' letras.'
            );
        }

        if (mb_strlen($palavra) > self::MAX_LETRAS) {
            throw new BusinessRuleException(
                'A palavra não pode ter mais de ' . self::MAX_LETRAS . ' caracteres.'
            );
        }

        // Permite letras com acentos, espaços (palavras compostas) e hífens
        if (!preg_match('/^[\p{L}\s\-]+$/u', $palavra)) {
            throw new BusinessRuleException(
                'A palavra contém caracteres inválidos. Use apenas letras, espaços ou hífens.'
            );
        }
    }

    private function validarTema(string $tema): void
    {
        if (trim($tema) === '') {
            throw new BusinessRuleException('O tema não pode estar em branco.');
        }

        if (mb_strlen(trim($tema)) < 2) {
            throw new BusinessRuleException('O tema precisa ter pelo menos 2 caracteres.');
        }
    }

    private function validarDificuldade(string $dificuldade): void
    {
        if (!in_array($dificuldade, self::DIFICULDADES_VALIDAS, true)) {
            throw new BusinessRuleException(
                'Dificuldade inválida. Use: ' . implode(', ', self::DIFICULDADES_VALIDAS)
            );
        }
    }
}
