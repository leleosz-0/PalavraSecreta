<?php

namespace Forca\Router;

use Forca\Controllers\PalavraController;

/**
 * Camada de Roteamento (Router)
 *
 * Responsável por receber a URI e o método HTTP e direcionar para
 * a ação correspondente no controller ou renderizar views diretas.
 */
class Router
{
    private string $baseDir;

    public function __construct(private PalavraController $controller)
    {
        // Define o diretório base (app/)
        $this->baseDir = dirname(__DIR__);
    }

    /**
     * Roteia a requisição HTTP.
     *
     * @param string $uri
     * @param string $method
     * @return bool|mixed Retorna false se for um arquivo estático para que o PHP sirva diretamente,
     *                     ou executa a ação correspondente.
     */
    public function dispatch(string $uri, string $method): mixed
    {
        // Remove barra final (exceto raiz)
        $uri = rtrim($uri, '/') ?: '/';

        // Extrai segmentos da URI
        $partes = explode('/', ltrim($uri, '/'));

        // Serve arquivos estáticos (CSS, JS, Imagens) diretamente
        $arquivoEstatico = $this->baseDir . $uri;
        $extensao = pathinfo($arquivoEstatico, PATHINFO_EXTENSION);
        $extensoesPermitidas = ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'];

        if (is_file($arquivoEstatico) && in_array($extensao, $extensoesPermitidas)) {
            return false;
        }

        return match (true) {

            // Página inicial
            $uri === '/' || $uri === '/index.php'
                => $this->renderHome(),

            // ── Páginas do Jogo (Via Controller) ─────────────
            $uri === '/jogo'
                => $this->controller->viewJogo(),

            $uri === '/temas'
                => $this->controller->viewTemas(),

            $uri === '/cadastro'
                => $this->controller->viewCadastro(),

            // ── API (para o jogo JS consumir) ──────────────────────
            // GET /api/palavras/sortear
            $method === 'GET' && $uri === '/api/palavras/sortear'
                => $this->controller->sortear(),

            // GET /api/palavras/lista
            $method === 'GET' && $uri === '/api/palavras/lista'
                => $this->controller->listarApi(),

            // GET /api/temas
            $method === 'GET' && $uri === '/api/temas'
                => $this->controller->temas(),

            // POST /api/palavras (para o frontend JS cadastrar)
            $method === 'POST' && $uri === '/api/palavras'
                => $this->controller->storeApi(),

            // ── CRUD Web ────────────────────────────────────────────
            // GET /palavras
            $method === 'GET' && $uri === '/palavras'
                => $this->controller->index(),

            // GET /palavras/criar
            $method === 'GET' && $uri === '/palavras/criar'
                => $this->controller->criar(),

            // POST /palavras  (cadastrar)
            $method === 'POST' && $uri === '/palavras'
                => (function (): void {
                    verificarTokenCsrf();
                    $dados = sanitizarPostPalavra();           // Middleware sanitiza
                    $_POST = array_merge($_POST, $dados);      // Substitui POST pelos dados limpos
                    $this->controller->store();
                })(),

            // GET /palavras/{id}/editar
            $method === 'GET' && isset($partes[1]) && isset($partes[2]) && $partes[2] === 'editar'
                => $this->controller->editar((int) $partes[1]),

            // POST /palavras/{id}/atualizar
            $method === 'POST' && isset($partes[1]) && isset($partes[2]) && $partes[2] === 'atualizar'
                => (function () use ($partes): void {
                    verificarTokenCsrf();
                    $dados = sanitizarPostPalavra();
                    $_POST = array_merge($_POST, $dados);
                    $this->controller->update((int) $partes[1]);
                })(),

            // POST /palavras/{id}/deletar
            $method === 'POST' && isset($partes[1]) && isset($partes[2]) && $partes[2] === 'deletar'
                => (function () use ($partes): void {
                    verificarTokenCsrf();
                    $this->controller->destroy((int) $partes[1]);
                })(),

            // 404
            default => (function (): void {
                http_response_code(404);
                include $this->baseDir . '/Views/404.php';
            })(),
        };
    }

    /**
     * Renderiza a página inicial (Home).
     */
    private function renderHome(): void
    {
        include $this->baseDir . '/Views/home.php';
    }
}
