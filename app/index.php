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
    // Ex: Forca\Controllers\PalavraController → Controllers/PalavraController.php
    $base = __DIR__ . '/';
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
use Forca\Router\Router;

require_once __DIR__ . '/Middleware/middleware.php';

// ─────────────────────────────────────────────
//  Tratamento global de erros (Passo 6)
//  Nunca exibe stack trace ao usuário em produção
// ─────────────────────────────────────────────
set_exception_handler(function (Throwable $e): void {
    error_log('[ERRO] ' . $e->getMessage() . ' em ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    include __DIR__ . '/Views/erro.php';
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
//  ROUTER
// ─────────────────────────────────────────────
$router = new Router($controller);
return $router->dispatch(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH),
    $_SERVER['REQUEST_METHOD']
);
