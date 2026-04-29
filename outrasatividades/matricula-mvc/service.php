<?php

/**
 * MatriculaService - Camada de regras de negócio.
 * Não faz SQL, não lida com HTTP — apenas aplica lógica de matrícula.
 */

class MatriculaService
{
    // Idade mínima exigida por curso
    private const IDADE_MINIMA = [
        'Engenharia de Software' => 16,
        'Medicina'               => 18,
        'Direito'                => 17,
        'Pedagogia'              => 16,
        'Administração'          => 16,
    ];

    // Cursos que concedem bolsa automática para menores de 20 anos
    private const CURSOS_COM_BOLSA = [
        'Pedagogia',
        'Administração',
    ];

    /**
     * Processa e valida os dados do aluno.
     *
     * @param  array  $dados  ['nome' => ..., 'idade' => ..., 'curso' => ...]
     * @return array          Dados processados, incluindo eventuais benefícios
     * @throws Exception      Se alguma regra de negócio for violada
     */
    public function processar(array $dados): array
    {
        $nome  = trim($dados['nome']  ?? '');
        $idade = (int) ($dados['idade'] ?? 0);
        $curso = trim($dados['curso']  ?? '');

        // ── Regra 1: idade mínima por curso ─────────────────────────────────────
        $idadeMinima = self::IDADE_MINIMA[$curso] ?? 16;

        if ($idade < $idadeMinima) {
            throw new Exception(
                "O curso \"{$curso}\" exige idade mínima de {$idadeMinima} anos. "
                . "O aluno tem {$idade} ano(s)."
            );
        }

        // ── Regra 2: bolsa de estudos automática ─────────────────────────────────
        $bolsa = false;
        if (in_array($curso, self::CURSOS_COM_BOLSA, true) && $idade < 20) {
            $bolsa = true;
        }

        return [
            'nome'  => $nome,
            'idade' => $idade,
            'curso' => $curso,
            'bolsa' => $bolsa,
        ];
    }

    /** Retorna os cursos disponíveis para popular o <select> do formulário. */
    public static function cursosDisponiveis(): array
    {
        return array_keys(self::IDADE_MINIMA);
    }
}
