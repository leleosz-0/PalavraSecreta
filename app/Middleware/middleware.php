<?php

/**
 * Middleware de Segurança — Passo 5
 *
 * Aplicado ANTES do Controller em rotas POST.
 * Responsabilidades:
 *  1. Verificar campos obrigatórios (não estão em branco)
 *  2. Sanitizar entradas com filter_input para barrar XSS
 *  3. Bloquear tentativas de injeção óbvias
 */

// ─────────────────────────────────────────────
//  Sanitização centralizada de campos POST
// ─────────────────────────────────────────────

/**
 * Sanitiza e valida o POST para a rota de cadastro/atualização de Palavra.
 * Retorna array com dados limpos ou encerra com erro.
 */
function sanitizarPostPalavra(): array
{
    // filter_input com FILTER_SANITIZE_SPECIAL_CHARS remove tags HTML (XSS)
    $palavra     = filter_input(INPUT_POST, 'palavra',     FILTER_SANITIZE_SPECIAL_CHARS);
    $tema        = filter_input(INPUT_POST, 'tema',        FILTER_SANITIZE_SPECIAL_CHARS);
    $dificuldade = filter_input(INPUT_POST, 'dificuldade', FILTER_SANITIZE_SPECIAL_CHARS);

    $erros = [];

    // Verifica campos em branco (além da sanitização)
    if (empty(trim($palavra ?? ''))) {
        $erros[] = 'O campo "palavra" é obrigatório.';
    }

    if (empty(trim($tema ?? ''))) {
        $erros[] = 'O campo "tema" é obrigatório.';
    }

    $dificuldadesValidas = ['Facil', 'Medio', 'Dificil'];
    if (!in_array($dificuldade, $dificuldadesValidas, true)) {
        $erros[] = 'Dificuldade inválida.';
    }

    // Testa XSS residual: rejeita se ainda houver tags após sanitização
    foreach (['palavra' => $palavra, 'tema' => $tema] as $campo => $valor) {
        if ($valor !== null && $valor !== strip_tags($valor)) {
            $erros[] = "O campo \"{$campo}\" contém conteúdo inválido (tags HTML detectadas).";
        }
    }

    if (!empty($erros)) {
        middlewareErro(implode(' | ', $erros));
    }

    // Retorna dados limpos e normalizados
    return [
        'palavra'     => htmlspecialchars_decode(trim($palavra)),
        'tema'        => htmlspecialchars_decode(trim($tema)),
        'dificuldade' => $dificuldade,
    ];
}

/**
 * Encerra a requisição com erro de middleware.
 * Para rotas API: retorna JSON. Para rotas web: redireciona.
 */
function middlewareErro(string $mensagem, int $codigo = 400): never
{
    // Detecta se é chamada de API (Accept: application/json)
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $isApi  = str_contains($accept, 'application/json')
           || str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/api/');

    if ($isApi) {
        http_response_code($codigo);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'erro' => $mensagem]);
    } else {
        http_response_code($codigo);
        // Passa erro para a próxima view via sessão
        session_start();
        $_SESSION['middleware_erro'] = $mensagem;
        header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? '/palavras'));
    }

    exit;
}

/**
 * Valida token CSRF para proteger formulários.
 * Uso: chamar gerarTokenCsrf() na view e verificarTokenCsrf() no middleware.
 */
function gerarTokenCsrf(): string
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function verificarTokenCsrf(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $tokenEnviado  = $_POST['csrf_token']        ?? '';
    $tokenSessao   = $_SESSION['csrf_token']      ?? '';

    if (!hash_equals($tokenSessao, $tokenEnviado)) {
        middlewareErro('Token de segurança inválido. Recarregue a página e tente novamente.', 403);
    }
}
