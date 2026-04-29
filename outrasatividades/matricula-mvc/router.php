<?php

require_once __DIR__ . '/middleware.php';
require_once __DIR__ . '/controller.php';

/**
 * Router - Avalia método HTTP e URL, despacha para o destino correto.
 */

class Router
{
    private string $method;
    private string $uri;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->uri    = strtok($_SERVER['REQUEST_URI'] ?? '/', '?');
    }

    public function dispatch(): void
    {
        // Rota raiz: GET exibe o formulário, POST processa a matrícula
        if ($this->uri === '/') {

            if ($this->method === 'GET') {
                // Exibe formulário em branco
                require_once __DIR__ . '/view.php';
                renderView('');
                return;
            }

            if ($this->method === 'POST') {
                // 1. Middleware valida (ou encerra)
                $middleware = new Middleware();
                $dadosLimpos = $middleware->validar($_POST);

                // 2. Controller orquestra o restante
                $controller = new MatriculaController();
                $controller->processarMatricula($dadosLimpos);
                return;
            }
        }

        // Rota não encontrada
        http_response_code(404);
        echo '<h1>404 - Página não encontrada</h1>';
    }
}
