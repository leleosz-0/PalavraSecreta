<?php

require_once __DIR__ . '/model.php';
require_once __DIR__ . '/service.php';

/**
 * MatriculaController - O "maestro" da aplicação.
 * Recebe dados da requisição, aciona o Service e o Model, decide a resposta.
 */

class MatriculaController
{
    private MatriculaService $service;

    public function __construct()
    {
        $this->service = new MatriculaService();
    }

    /**
     * Orquestra o processo completo de matrícula.
     * Chamado pelo Router quando chega um POST.
     */
    public function processarMatricula(array $dados): void
    {
        try {
            // 1. Service valida as regras de negócio
            $dadosProcessados = $this->service->processar($dados);

            // 2. Model persiste no SQLite
            $aluno = new AlunoModel();
            $aluno->setNome($dadosProcessados['nome']);
            $aluno->setIdade($dadosProcessados['idade']);
            $aluno->setCurso($dadosProcessados['curso']);

            $id = $aluno->save();

            // 3. Resposta de sucesso para o usuário
            $bolsaMsg = $dadosProcessados['bolsa']
                ? '<p class="bolsa">🎓 Parabéns! O aluno recebeu <strong>bolsa de estudos</strong> automática!</p>'
                : '';

            $this->renderSucesso(
                $dadosProcessados['nome'],
                $dadosProcessados['curso'],
                $id,
                $bolsaMsg
            );

        } catch (Exception $e) {
            // 4. Qualquer falha (regra de negócio ou banco) vai para a view de erro
            $this->renderErro($e->getMessage(), $dados);
        }
    }

    // ─── Respostas HTML ──────────────────────────────────────────────────────────

    private function renderSucesso(
        string $nome,
        string $curso,
        int    $id,
        string $bolsaMsg
    ): void {
        require __DIR__ . '/view.php';
        // Passa variáveis para a view via output buffer
        $conteudo = "
            <div class='card sucesso'>
                <h2>✅ Matrícula Realizada!</h2>
                <p><strong>Aluno:</strong> " . htmlspecialchars($nome) . "</p>
                <p><strong>Curso:</strong> " . htmlspecialchars($curso) . "</p>
                <p><strong>ID no banco:</strong> #{$id}</p>
                {$bolsaMsg}
                <a href='/'>← Nova matrícula</a>
            </div>
        ";
        renderView($conteudo);
    }

    private function renderErro(string $mensagem, array $dadosAnteriores = []): void
    {
        $conteudo = "
            <div class='card erro'>
                <h2>⚠️ Matrícula Recusada</h2>
                <p>" . htmlspecialchars($mensagem) . "</p>
                <a href='/'>← Tentar novamente</a>
            </div>
        ";
        renderView($conteudo);
    }
}
