<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Palavras — Forca Admin</title>
  <style>
    body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 24px; }
    h1   { color: #ff9800; }
    .alerta { padding: 10px 16px; border-radius: 6px; margin-bottom: 16px; }
    .alerta.sucesso { background: rgba(76,175,80,.2); color: #81c784; border: 1px solid #4caf50; }
    .alerta.erro    { background: rgba(244,67,54,.2);  color: #e57373; border: 1px solid #f44336; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #333; }
    th { color: #ff9800; }
    a  { color: #2196f3; text-decoration: none; }
    .btn { padding: 6px 14px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; }
    .btn-add    { background: #4caf50; color: #fff; }
    .btn-edit   { background: #ff9800; color: #fff; }
    .btn-delete { background: #f44336; color: #fff; }
  </style>
</head>
<body>

<h1>🎮 Gerenciar Palavras</h1>
<a href="/palavras/criar"><button class="btn btn-add">+ Cadastrar Palavra</button></a>

<?php if (!empty($_GET['sucesso'])): ?>
  <div class="alerta sucesso">Operação realizada com sucesso!</div>
<?php endif; ?>

<?php if (!empty($_GET['erro'])): ?>
  <div class="alerta erro"><?= htmlspecialchars($_GET['erro']) ?></div>
<?php endif; ?>

<?php if (!empty($erro)): ?>
  <div class="alerta erro"><?= htmlspecialchars($erro) ?></div>
<?php endif; ?>

<!-- Filtros -->
<form method="GET" action="/palavras" style="margin: 16px 0; display:flex; gap:12px; flex-wrap:wrap;">
  <select name="tema" style="padding:8px; border-radius:6px; background:#2a2a2a; color:#fff; border:1px solid #444;">
    <option value="">Todos os temas</option>
    <?php foreach ($temas as $t): ?>
      <option value="<?= htmlspecialchars($t) ?>" <?= ($filtroTema === $t ? 'selected' : '') ?>>
        <?= htmlspecialchars($t) ?>
      </option>
    <?php endforeach; ?>
  </select>

  <select name="dificuldade" style="padding:8px; border-radius:6px; background:#2a2a2a; color:#fff; border:1px solid #444;">
    <option value="">Todas as dificuldades</option>
    <option value="Facil"   <?= ($filtroDif === 'Facil'   ? 'selected' : '') ?>>Fácil</option>
    <option value="Medio"   <?= ($filtroDif === 'Medio'   ? 'selected' : '') ?>>Médio</option>
    <option value="Dificil" <?= ($filtroDif === 'Dificil' ? 'selected' : '') ?>>Difícil</option>
  </select>

  <button type="submit" class="btn" style="background:#607d8b; color:#fff;">Filtrar</button>
  <a href="/palavras"><button type="button" class="btn" style="background:#37474f; color:#fff;">Limpar</button></a>
</form>

<p style="color:#aaa;"><?= count($palavras) ?> palavra(s) encontrada(s)</p>

<table>
  <thead>
    <tr><th>#</th><th>Palavra</th><th>Tema</th><th>Dificuldade</th><th>Cadastrado em</th><th>Ações</th></tr>
  </thead>
  <tbody>
    <?php foreach ($palavras as $p): ?>
    <tr>
      <td><?= $p->getId() ?></td>
      <td><?= htmlspecialchars($p->getPalavra()) ?></td>
      <td><?= htmlspecialchars($p->getTema()) ?></td>
      <td><?= htmlspecialchars($p->getDificuldade()) ?></td>
      <td><?= htmlspecialchars($p->getCriadoEm() ?? '—') ?></td>
      <td style="display:flex; gap:8px;">
        <a href="/palavras/<?= $p->getId() ?>/editar">
          <button class="btn btn-edit">Editar</button>
        </a>
        <form method="POST" action="/palavras/<?= $p->getId() ?>/deletar"
              onsubmit="return confirm('Remover esta palavra?')">
          <input type="hidden" name="csrf_token" value="<?= gerarTokenCsrf() ?>">
          <button type="submit" class="btn btn-delete">Excluir</button>
        </form>
      </td>
    </tr>
    <?php endforeach; ?>

    <?php if (empty($palavras)): ?>
    <tr><td colspan="6" style="text-align:center; color:#666;">Nenhuma palavra encontrada.</td></tr>
    <?php endif; ?>
  </tbody>
</table>

</body>
</html>
