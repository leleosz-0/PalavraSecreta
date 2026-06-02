<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title><?= htmlspecialchars($titulo ?? 'Palavra') ?> — Forca Admin</title>
  <style>
    body  { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 24px; }
    h1    { color: #ff9800; }
    label { display: block; margin-bottom: 4px; color: #ccc; }
    input, select { width: 100%; max-width: 420px; padding: 10px; border-radius: 6px;
                    border: 1px solid #444; background: #2a2a2a; color: #fff;
                    font-size: 1rem; margin-bottom: 16px; }
    input:focus, select:focus { border-color: #ff9800; outline: none; }
    .btn-submit { background: #ff9800; color: #fff; padding: 12px 28px;
                  border: none; border-radius: 8px; font-size: 1rem;
                  font-weight: bold; cursor: pointer; }
    .btn-voltar { background: transparent; color: #aaa; border: 1px solid #444;
                  padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-left: 12px; }
    .alerta.erro { padding: 10px 16px; border-radius: 6px; margin-bottom: 16px;
                   background: rgba(244,67,54,.2); color: #e57373; border: 1px solid #f44336; }
  </style>
</head>
<body>

<h1><?= htmlspecialchars($titulo ?? 'Palavra') ?></h1>

<?php if (!empty($erro)): ?>
  <div class="alerta erro"><?= htmlspecialchars($erro) ?></div>
<?php endif; ?>

<?php
  // Define a action e o ID para edição
  $isEdicao  = isset($palavra);
  $action    = $isEdicao ? "/palavras/{$palavra->getId()}/atualizar" : '/palavras';
  $valorPal  = htmlspecialchars($old['palavra']      ?? ($isEdicao ? $palavra->getPalavra()     : ''));
  $valorTema = htmlspecialchars($old['tema']         ?? ($isEdicao ? $palavra->getTema()         : ''));
  $valorDif  =                  $old['dificuldade']  ?? ($isEdicao ? $palavra->getDificuldade()  : 'Medio');
?>

<form method="POST" action="<?= $action ?>">
  <input type="hidden" name="csrf_token" value="<?= gerarTokenCsrf() ?>">

  <label for="palavra">Palavra:</label>
  <input type="text" id="palavra" name="palavra"
         value="<?= $valorPal ?>"
         placeholder="Ex: COMPUTADOR"
         required autocomplete="off">

  <label for="tema">Tema:</label>
  <input type="text" id="tema" name="tema"
         value="<?= $valorTema ?>"
         placeholder="Ex: Tecnologia, Esportes..."
         required>

  <label for="dificuldade">Dificuldade:</label>
  <select id="dificuldade" name="dificuldade" required>
    <option value="Facil"   <?= ($valorDif === 'Facil'   ? 'selected' : '') ?>>Fácil</option>
    <option value="Medio"   <?= ($valorDif === 'Medio'   ? 'selected' : '') ?>>Médio</option>
    <option value="Dificil" <?= ($valorDif === 'Dificil' ? 'selected' : '') ?>>Difícil</option>
  </select>

  <div>
    <button type="submit" class="btn-submit">
      <?= $isEdicao ? 'Salvar Alterações' : 'Cadastrar' ?>
    </button>
    <a href="/palavras"><button type="button" class="btn-voltar">← Voltar</button></a>
  </div>
</form>

</body>
</html>
