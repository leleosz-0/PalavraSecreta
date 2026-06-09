<?php

namespace Forca\Controllers;

use Forca\Services\PalavraService;
use Forca\Exceptions\BusinessRuleException;

/**
 * Controller enxuto de Palavra.
 *
 * Responsabilidades:
 *  - Receber a requisição HTTP
 *  - Chamar o Service via try-catch
 *  - Renderizar a view ou redirecionar
 *
 * O Controller NÃO valida regras de negócio. Apenas orquestra.
 * Também recebe suas dependências via construtor (DI).
 */
class PalavraController
{
    public function __construct(private PalavraService $service) {}

    // ─────────────────────────────────────────────
    //  LISTAR — GET /palavras
    // ─────────────────────────────────────────────
    public function index(): void
    {
        try {
            $tema        = $_GET['tema']        ?? null;
            $dificuldade = $_GET['dificuldade'] ?? null;

            $palavras = $this->service->listar($tema, $dificuldade);
            $temas    = $this->service->listarTemas();

            $this->renderView('Palavras/index', [
                'palavras'    => $palavras,
                'temas'       => $temas,
                'filtroTema'  => $tema,
                'filtroDif'   => $dificuldade,
            ]);

        } catch (BusinessRuleException $e) {
            $this->renderView('Palavras/index', ['erro' => $e->getMessage(), 'palavras' => [], 'temas' => []]);
        }
    }

    // ─────────────────────────────────────────────
    //  FORMULÁRIO DE CADASTRO — GET /palavras/criar
    // ─────────────────────────────────────────────
    public function criar(): void
    {
        $this->renderView('Palavras/form', ['titulo' => 'Cadastrar Palavra']);
    }

    // ─────────────────────────────────────────────
    //  SALVAR NOVA PALAVRA — POST /palavras
    // ─────────────────────────────────────────────
    public function store(): void
    {
        try {
            // Dados já sanitizados pelo Middleware (Passo 5)
            $palavra     = $_POST['palavra']     ?? '';
            $tema        = $_POST['tema']        ?? '';
            $dificuldade = $_POST['dificuldade'] ?? '';

            $this->service->cadastrar($palavra, $tema, $dificuldade);

            // Sucesso: redireciona (PRG Pattern — evita duplo envio)
            $this->redirect('/palavras?sucesso=1');

        } catch (BusinessRuleException $e) {
            // Erro de negócio: renderiza o form com a mensagem amigável
            $this->renderView('Palavras/form', [
                'titulo' => 'Cadastrar Palavra',
                'erro'   => $e->getMessage(),
                'old'    => $_POST, // repopula o formulário
            ]);
        }
    }

    // ─────────────────────────────────────────────
    //  FORMULÁRIO DE EDIÇÃO — GET /palavras/{id}/editar
    // ─────────────────────────────────────────────
    public function editar(int $id): void
    {
        try {
            $palavra = $this->service->buscarPorId($id);
            $this->renderView('Palavras/form', [
                'titulo'  => 'Editar Palavra',
                'palavra' => $palavra,
            ]);

        } catch (BusinessRuleException $e) {
            $this->redirect('/palavras?erro=' . urlencode($e->getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  ATUALIZAR — POST /palavras/{id}/atualizar
    // ─────────────────────────────────────────────
    public function update(int $id): void
    {
        try {
            $palavra     = $_POST['palavra']     ?? '';
            $tema        = $_POST['tema']        ?? '';
            $dificuldade = $_POST['dificuldade'] ?? '';

            $this->service->atualizar($id, $palavra, $tema, $dificuldade);
            $this->redirect('/palavras?sucesso=1');

        } catch (BusinessRuleException $e) {
            $this->renderView('Palavras/form', [
                'titulo' => 'Editar Palavra',
                'erro'   => $e->getMessage(),
                'old'    => $_POST,
            ]);
        }
    }

    // ─────────────────────────────────────────────
    //  DELETAR — POST /palavras/{id}/deletar
    // ─────────────────────────────────────────────
    public function destroy(int $id): void
    {
        try {
            $this->service->remover($id);
            $this->redirect('/palavras?sucesso=1');

        } catch (BusinessRuleException $e) {
            $this->redirect('/palavras?erro=' . urlencode($e->getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    //  API: SORTEAR PALAVRA (para o jogo JS consumir)
    //  GET /api/palavras/sortear
    // ─────────────────────────────────────────────
    public function sortear(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        try {
            $tema        = $_GET['tema']        ?? null;
            $dificuldade = $_GET['dificuldade'] ?? null;

            $palavra = $this->service->sortearPalavra($tema, $dificuldade);

            echo json_encode([
                'ok'     => true,
                'data'   => $palavra->toArray(),
            ]);

        } catch (BusinessRuleException $e) {
            http_response_code($e->getCode() ?: 400);
            echo json_encode([
                'ok'    => false,
                'erro'  => $e->getMessage(),
            ]);
        }
    }

    // ─────────────────────────────────────────────
    //  API: LISTAR TEMAS (para o jogo JS)
    //  GET /api/temas
    // ─────────────────────────────────────────────
    public function temas(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        try {
            $temas = $this->service->listarTemas();
            echo json_encode(['ok' => true, 'data' => $temas]);

        } catch (BusinessRuleException $e) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'erro' => $e->getMessage()]);
        }
    }

    // ─────────────────────────────────────────────
    //  API: LISTAR TODAS (para carregar o pool inicial no JS)
    //  GET /api/palavras/lista
    // ─────────────────────────────────────────────
    public function listarApi(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        try {
            $palavras = $this->service->listar();
            
            // Converte objetos Palavra em arrays
            $data = array_map(fn($p) => $p->toArray(), $palavras);

            echo json_encode([
                'ok'   => true,
                'data' => $data,
            ]);

        } catch (BusinessRuleException $e) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'erro' => $e->getMessage()]);
        }
    }

    // ─────────────────────────────────────────────
    //  API: SALVAR NOVA PALAVRA (para o JS)
    //  POST /api/palavras
    // ─────────────────────────────────────────────
    public function storeApi(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        try {
            // Tenta ler do body JSON primeiro, senão do $_POST
            $json  = file_get_contents('php://input');
            $dados = json_decode($json, true) ?? $_POST;

            $palavra     = $dados['palavra']     ?? '';
            $tema        = $dados['tema']        ?? '';
            $dificuldade = $dados['dificuldade'] ?? '';

            $nova = $this->service->cadastrar($palavra, $tema, $dificuldade);

            echo json_encode([
                'ok'   => true,
                'data' => $nova->toArray(),
            ]);

        } catch (BusinessRuleException $e) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'erro' => $e->getMessage()]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'erro' => 'Erro interno ao salvar.']);
        }
    }

    // ─────────────────────────────────────────────
    //  VIEWS DO JOGO
    // ─────────────────────────────────────────────
    public function viewJogo(): void
    {
        $this->renderView('Public/jogo');
    }

    public function viewTemas(): void
    {
        $this->renderView('Public/temas');
    }

    public function viewCadastro(): void
    {
        $this->renderView('Public/cadastro');
    }

    // ─────────────────────────────────────────────
    //  HELPERS PRIVADOS
    // ─────────────────────────────────────────────
    private function renderView(string $view, array $dados = []): void
    {
        // Extrai variáveis para uso na view
        extract($dados);
        $viewPath = __DIR__ . '/../Views/' . $view . '.php';

        if (!file_exists($viewPath)) {
            throw new \RuntimeException("View não encontrada: {$view}");
        }

        include $viewPath;
    }

    private function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }
}
