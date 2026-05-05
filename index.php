<?php

/**
 * index.php — Ponto de entrada único da aplicação
 *
 * Passo 5: Atua como Container de Injeção de Dependência simplificado.
 * É aqui que PDO, Repositório e Service são instanciados e "montados"
 * antes de serem entregues ao Controller.
 *
 * Fluxo:
 *   Requisição → index.php → Middleware → Controller → Service → Repository → BD
 */

declare(strict_types=1);

// ─────────────────────────────────────────────
//  Autoload (sem Composer: autoload manual simples)
// ─────────────────────────────────────────────
spl_autoload_register(function (string $class): void {
    // Converte namespace em caminho de arquivo
    // Ex: Forca\Controllers\PalavraController → src/Controllers/PalavraController.php
    $base = __DIR__ . '/src/';
    $rel  = str_replace('Forca\\', '', $class);
    $rel  = str_replace('\\', DIRECTORY_SEPARATOR, $rel);
    $file = $base . $rel . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

// ─────────────────────────────────────────────
//  Imports
// ─────────────────────────────────────────────
use Forca\Database\Database;
use Forca\Repositories\PalavraRepository;
use Forca\Services\PalavraService;
use Forca\Controllers\PalavraController;

require_once __DIR__ . '/middleware/middleware.php';

// ─────────────────────────────────────────────
//  Tratamento global de erros (Passo 6)
//  Nunca exibe stack trace ao usuário em produção
// ─────────────────────────────────────────────
set_exception_handler(function (Throwable $e): void {
    error_log('[ERRO] ' . $e->getMessage() . ' em ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    include __DIR__ . '/views/erro.php';
    exit;
});

// ─────────────────────────────────────────────
//  CONTAINER DE INJEÇÃO DE DEPENDÊNCIA
//  Monta toda a cadeia: PDO → Repository → Service → Controller
// ─────────────────────────────────────────────
$pdo        = Database::getInstance();                 // Singleton PDO
$repository = new PalavraRepository($pdo);             // DI: recebe PDO
$service    = new PalavraService($repository);         // DI: recebe Interface
$controller = new PalavraController($service);         // DI: recebe Service

// ─────────────────────────────────────────────
//  ROUTER simples
// ─────────────────────────────────────────────
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove barra final (exceto raiz)
$uri = rtrim($uri, '/') ?: '/';

// Extrai segmentos da URI
$partes = explode('/', ltrim($uri, '/'));

match (true) {

    // Página inicial
    $uri === '/' || $uri === '/index.php'
        => (include __DIR__ . '/views/home.php'),

    // ── API (para o jogo JS consumir) ──────────────────────
    // GET /api/palavras/sortear
    $method === 'GET' && $uri === '/api/palavras/sortear'
        => $controller->sortear(),

    // GET /api/temas
    $method === 'GET' && $uri === '/api/temas'
        => $controller->temas(),

    // ── CRUD Web ────────────────────────────────────────────
    // GET /palavras
    $method === 'GET' && $uri === '/palavras'
        => $controller->index(),

    // GET /palavras/criar
    $method === 'GET' && $uri === '/palavras/criar'
        => $controller->criar(),

    // POST /palavras  (cadastrar)
    $method === 'POST' && $uri === '/palavras'
        => (function () use ($controller): void {
            verificarTokenCsrf();
            $dados = sanitizarPostPalavra();           // Middleware sanitiza
            $_POST = array_merge($_POST, $dados);      // Substitui POST pelos dados limpos
            $controller->store();
        })(),

    // GET /palavras/{id}/editar
    $method === 'GET' && isset($partes[1]) && isset($partes[2]) && $partes[2] === 'editar'
        => $controller->editar((int) $partes[1]),

    // POST /palavras/{id}/atualizar
    $method === 'POST' && isset($partes[1]) && isset($partes[2]) && $partes[2] === 'atualizar'
        => (function () use ($controller, $partes): void {
            verificarTokenCsrf();
            $dados = sanitizarPostPalavra();
            $_POST = array_merge($_POST, $dados);
            $controller->update((int) $partes[1]);
        })(),

    // POST /palavras/{id}/deletar
    $method === 'POST' && isset($partes[1]) && isset($partes[2]) && $partes[2] === 'deletar'
        => $controller->destroy((int) $partes[1]),

    // 404
    default => (function (): void {
        http_response_code(404);
        include __DIR__ . '/views/404.php';
    })(),
};
