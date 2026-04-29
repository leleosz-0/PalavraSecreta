<?php

/**
 * index.php — Front Controller
 *
 * Ponto de entrada ÚNICO da aplicação.
 * Toda requisição chega aqui e é repassada ao Router.
 *
 * Para iniciar:
 *   1. php migration.php   (apenas uma vez)
 *   2. php -S localhost:8000
 */

require_once __DIR__ . '/router.php';

$router = new Router();
$router->dispatch();
