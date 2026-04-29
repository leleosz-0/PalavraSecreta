<?php

require_once __DIR__ . '/service.php';

/**
 * Função helper chamada pelo Controller para envolver o conteúdo no layout base.
 */
function renderView(string $conteudo): void
{
    $cursos = MatriculaService::cursosDisponiveis();
    $opcoesHtml = '';
    foreach ($cursos as $curso) {
        $opcoesHtml .= '<option value="' . htmlspecialchars($curso) . '">'
                     . htmlspecialchars($curso) . '</option>';
    }
    ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Matrícula</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #0f1117;
            color: #e0e0e0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 16px;
        }

        header {
            width: 100%;
            max-width: 560px;
            margin-bottom: 32px;
            text-align: center;
        }

        header h1 {
            font-size: 2rem;
            color: #ff9800;
            letter-spacing: 1px;
        }

        header p {
            color: #888;
            margin-top: 6px;
            font-size: 0.95rem;
        }

        .card {
            background: #1e1e2e;
            border: 1px solid #2a2a3e;
            border-radius: 16px;
            padding: 36px 40px;
            width: 100%;
            max-width: 560px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .card h2 {
            margin-bottom: 24px;
            font-size: 1.4rem;
            color: #fff;
        }

        label {
            display: block;
            font-size: 0.85rem;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        input[type="text"],
        input[type="number"],
        select {
            width: 100%;
            padding: 12px 14px;
            background: #12121c;
            border: 1px solid #333;
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            margin-bottom: 20px;
            transition: border-color 0.2s;
            outline: none;
        }

        input:focus, select:focus {
            border-color: #ff9800;
        }

        button[type="submit"] {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #ff9800, #e65100);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.1s;
            margin-top: 4px;
        }

        button[type="submit"]:hover { opacity: 0.9; transform: translateY(-1px); }
        button[type="submit"]:active { transform: translateY(0); }

        /* Cards de resultado */
        .sucesso { border-color: #2e7d32; }
        .sucesso h2 { color: #66bb6a; }
        .sucesso p, .erro p { margin-bottom: 10px; font-size: 1rem; line-height: 1.6; }

        .erro { border-color: #b71c1c; }
        .erro h2 { color: #ef5350; }

        .bolsa {
            background: rgba(255,152,0,0.12);
            border: 1px solid rgba(255,152,0,0.3);
            border-radius: 8px;
            padding: 10px 14px;
            color: #ffb74d;
            margin-top: 12px;
        }

        a {
            display: inline-block;
            margin-top: 20px;
            color: #ff9800;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover { text-decoration: underline; }

        .aviso {
            background: rgba(255,152,0,0.1);
            border: 1px solid rgba(255,152,0,0.35);
            border-radius: 8px;
            padding: 12px 16px;
            color: #ffb74d;
            margin-bottom: 20px;
            font-size: 0.95rem;
        }
    </style>
</head>
<body>

<header>
    <h1>🎓 Sistema de Matrícula</h1>
    <p>Preencha o formulário para realizar a matrícula do aluno</p>
</header>

<?php if (!empty($conteudo)): ?>
    <?= $conteudo ?>
<?php else: ?>
    <!-- Formulário padrão -->
    <div class="card">
        <h2>Nova Matrícula</h2>
        <form method="POST" action="/">

            <label for="nome">Nome completo</label>
            <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Ex: Maria da Silva"
                required
            >

            <label for="idade">Idade</label>
            <input
                type="number"
                id="idade"
                name="idade"
                min="1"
                max="120"
                placeholder="Ex: 18"
                required
            >

            <label for="curso">Curso</label>
            <select id="curso" name="curso" required>
                <option value="" disabled selected>Selecione um curso…</option>
                <?= $opcoesHtml ?>
            </select>

            <button type="submit">Matricular Aluno →</button>
        </form>
    </div>
<?php endif; ?>

</body>
</html>
    <?php
}

// Se chamado diretamente (GET sem parâmetros), exibe o formulário vazio
if (!function_exists('renderView')) {
    renderView('');
}
