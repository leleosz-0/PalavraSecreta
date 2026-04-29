<?php

/**
 * Middleware - Segurança de entrada.
 * Executado ANTES do Controller; interrompe a requisição se os dados forem inválidos.
 */

class Middleware
{
    /**
     * Valida os campos do formulário.
     * Encerra a execução com mensagem de aviso caso a validação falhe.
     *
     * @param  array  $dados  Dados vindos do $_POST
     * @return array          Os mesmos dados, prontos para uso
     */
    public function validar(array $dados): array
    {
        $erros = [];

        // ── 1. Campos obrigatórios ────────────────────────────────────────────────
        $camposObrigatorios = ['nome', 'idade', 'curso'];

        foreach ($camposObrigatorios as $campo) {
            if (empty(trim($dados[$campo] ?? ''))) {
                $erros[] = "O campo <strong>{$campo}</strong> é obrigatório e não pode ser vazio.";
            }
        }

        // ── 2. Idade deve ser numérica e positiva ─────────────────────────────────
        if (!empty($dados['idade'])) {
            if (!ctype_digit((string) $dados['idade']) || (int) $dados['idade'] <= 0) {
                $erros[] = 'O campo <strong>idade</strong> deve ser um número inteiro positivo.';
            }
        }

        // ── 3. Se houver erros, exibe e encerra ───────────────────────────────────
        if (!empty($erros)) {
            $lista = implode('</li><li>', $erros);
            $conteudo = "
                <div class='card erro'>
                    <h2>⚠️ Dados Inválidos</h2>
                    <p>Corrija os problemas abaixo antes de continuar:</p>
                    <ul style='margin: 14px 0 0 18px; line-height:2;'>
                        <li>{$lista}</li>
                    </ul>
                    <a href='/'>← Voltar ao formulário</a>
                </div>
            ";

            // Precisamos do helper de view para renderizar com o layout completo
            require_once __DIR__ . '/view.php';
            renderView($conteudo);
            exit; // 🔴 Interrompe a execução aqui
        }

        return $dados;
    }
}
