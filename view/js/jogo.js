// jogo.js - Logica completa do jogo

import { getEstadoJogo, salvarEstadoJogo, limparEstadoJogo, getPlacar, salvarPlacar } from './storage.js';

const MAX_ERROS = 6;

const forcaEstagios = [
  `  +---+
  |   |
      |
      |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

let estado = null;
let placar = null;
let handleKeyPress = null;

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizarLetra(letra) {
  return removerAcentos(letra).toUpperCase();
}

// ====================== UI ======================
function atualizarPalavraUI() {
  const palavraEl = document.getElementById("palavra");
  palavraEl.innerHTML = "";

  const grupos = estado.palavraSecreta.split(" ");
  const caracteresEspeciais = ["-", "'", ".", ":"]; // Caracteres que aparecem de cara

  grupos.forEach((grupo, idxGrupo) => {
    const grupoEl = document.createElement("span");
    grupoEl.className = "palavra-grupo";

    for (const char of grupo) {
      const letraEl = document.createElement("span");
      letraEl.className = "letra-slot";

      // Caracteres especiais sempre aparecem
      if (caracteresEspeciais.includes(char)) {
        letraEl.textContent = char;
        letraEl.classList.add("revelada", "especial");
      } else if (estado.letrasAcertadas.includes(char)) {
        letraEl.textContent = char;
        letraEl.classList.add("revelada");
      } else {
        letraEl.textContent = "_";
      }

      grupoEl.appendChild(letraEl);
    }

    palavraEl.appendChild(grupoEl);

    if (idxGrupo < grupos.length - 1) {
      const espaco = document.createElement("span");
      espaco.className = "palavra-espaco";
      palavraEl.appendChild(espaco);
    }
  });
}

function atualizarForcaUI() {
  document.getElementById("forca").textContent = forcaEstagios[estado.erros] ?? forcaEstagios[MAX_ERROS];

  const restantes = MAX_ERROS - estado.erros;
  const span = document.getElementById("errosRestantes");
  span.textContent = restantes;

  if (restantes <= 1) span.style.color = "#ff5252";
  else if (restantes <= 3) span.style.color = "#ff9800";
  else span.style.color = "#ffffff";
}

function criarTeclado() {
  const teclado = document.getElementById("teclado");
  teclado.innerHTML = "";

  const linhas = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  linhas.forEach(linha => {
    const div = document.createElement("div");
    div.className = "linha";

    linha.split("").forEach(letra => {
      const btn = document.createElement("button");
      btn.textContent = letra;
      btn.dataset.letra = letra;

      // Verifica se ja foi tentada
      if (estado.letrasAcertadas.includes(letra) || estado.letrasAcertadas.some(l => normalizarLetra(l) === letra)) {
        btn.classList.add("acertou");
        btn.disabled = true;
      } else if (estado.letrasErradas.includes(letra)) {
        btn.classList.add("errou");
        btn.disabled = true;
      }

      btn.addEventListener("click", () => tentarLetra(letra, btn));
      div.appendChild(btn);
    });

    teclado.appendChild(div);
  });
}

function desabilitarTeclado() {
  document.querySelectorAll("#teclado button").forEach(btn => btn.disabled = true);
}

function mostrarMensagem(texto, classe = "") {
  const msg = document.getElementById("mensagem");
  msg.textContent = texto;
  msg.className = "mensagem " + classe;
}

function animarErro() {
  const fig = document.querySelector("figure");
  if (!fig) return;
  fig.classList.remove("shake");
  void fig.offsetWidth;
  fig.classList.add("shake");
}

function exibirBadgeDificuldade() {
  const cores = {
    "Facil": { bg: "rgba(76,175,80,0.2)", border: "#4caf50", cor: "#81c784" },
    "Medio": { bg: "rgba(255,152,0,0.2)", border: "#ff9800", cor: "#ffb74d" },
    "Dificil": { bg: "rgba(244,67,54,0.2)", border: "#f44336", cor: "#e57373" },
  };

  const dif = removerAcentos(estado.dificuldade);
  const estilo = cores[dif] || cores["Medio"];

  let badge = document.getElementById("badgeDificuldade");
  if (!badge) {
    badge = document.createElement("span");
    badge.id = "badgeDificuldade";
    badge.style.cssText = `
      font-size: 0.75rem;
      font-weight: bold;
      padding: 3px 10px;
      border-radius: 12px;
      margin-left: 12px;
      vertical-align: middle;
      border: 1px solid;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;
    document.getElementById("temaAtual").appendChild(badge);
  }

  badge.textContent = estado.dificuldade;
  badge.style.background = estilo.bg;
  badge.style.borderColor = estilo.border;
  badge.style.color = estilo.cor;
}

function atualizarPlacarUI() {
  document.getElementById("placarVitorias").textContent = placar.vitorias;
  document.getElementById("placarDerrotas").textContent = placar.derrotas;
  document.getElementById("placarSequencia").textContent = placar.sequencia;
}

// ====================== LOGICA ======================
function tentarLetra(letra, botao) {
  botao.disabled = true;
  const letraNorm = normalizarLetra(letra);

  const temLetra = [...estado.palavraSecreta].some(
    char => normalizarLetra(char) === letraNorm
  );

  if (temLetra) {
    [...estado.palavraSecreta].forEach(char => {
      if (normalizarLetra(char) === letraNorm && !estado.letrasAcertadas.includes(char)) {
        estado.letrasAcertadas.push(char);
      }
    });
    if (!estado.letrasAcertadas.includes(letra.toUpperCase())) {
      estado.letrasAcertadas.push(letra.toUpperCase());
    }

    botao.classList.add("acertou");
    atualizarPalavraUI();
    salvarEstadoJogo(estado);

    const caracteresEspeciais = [" ", "-", "'", ".", ":"];
    const venceu = [...estado.palavraSecreta]
      .filter(l => !caracteresEspeciais.includes(l))
      .every(l => estado.letrasAcertadas.includes(l));

    if (venceu) finalizarJogo(true);
  } else {
    if (!estado.letrasErradas.includes(letraNorm)) {
      estado.letrasErradas.push(letraNorm);
      estado.erros++;
      botao.classList.add("errou");
      atualizarForcaUI();
      animarErro();
      salvarEstadoJogo(estado);

      if (estado.erros >= MAX_ERROS) finalizarJogo(false);
    }
  }
}

function finalizarJogo(venceu) {
  desabilitarTeclado();

  if (handleKeyPress) {
    document.removeEventListener("keydown", handleKeyPress);
    handleKeyPress = null;
  }

  if (venceu) {
    placar.vitorias++;
    placar.sequencia++;
    mostrarMensagem("Parabens! Voce venceu!", "vitoria");
  } else {
    placar.derrotas++;
    placar.sequencia = 0;
    mostrarMensagem(`Voce perdeu! A palavra era: ${estado.palavraSecreta}`, "derrota");
  }

  salvarPlacar(placar);
  atualizarPlacarUI();
  limparEstadoJogo();
  mostrarAcoesFinais(venceu);
}

function mostrarAcoesFinais(venceu) {
  const acoes = document.getElementById("acoesFinais");
  acoes.style.display = "flex";

  document.getElementById("btnReiniciar").onclick = () => {
    location.href = 'temas.html';
  };

  const btnComp = document.getElementById("btnCompartilhar");
  btnComp.onclick = () => {
    const letrasUsadas = estado.erros + estado.letrasAcertadas.length - 1;
    const status = venceu
      ? `Adivinhei a palavra "${estado.palavraSecreta}" com ${estado.erros} erro${estado.erros !== 1 ? 's' : ''}!`
      : `Nao adivinhei a palavra "${estado.palavraSecreta}" (${estado.erros} erros).`;

    const quadrado = gerarQuadradoResultado(venceu);
    const texto = `Jogo da Forca\n${status}\nTema: ${estado.tema} | Dificuldade: ${estado.dificuldade}\n${quadrado}`;

    navigator.clipboard.writeText(texto).then(() => {
      btnComp.textContent = "Copiado!";
      btnComp.classList.add("copiado");
      setTimeout(() => {
        btnComp.textContent = "Compartilhar";
        btnComp.classList.remove("copiado");
      }, 2500);
    }).catch(() => {
      prompt("Copie o texto abaixo:", texto);
    });
  };
}

function gerarQuadradoResultado(venceu) {
  const acertos = estado.letrasAcertadas.length - 1;
  let linha = "";
  for (let i = 0; i < acertos && i < 6; i++) linha += "🟩";
  for (let i = 0; i < estado.erros && linha.length / 2 < 6; i++) linha += "🟥";
  return linha;
}

function configurarTecladoFisico() {
  handleKeyPress = function (e) {
    const letra = e.key.toUpperCase();
    if (letra.length === 1 && /[A-Z]/.test(letra)) {
      const botao = document.querySelector(`#teclado button[data-letra="${letra}"]`);
      if (botao && !botao.disabled) {
        tentarLetra(letra, botao);
      }
    }
  };
  document.addEventListener("keydown", handleKeyPress);
}

function inicializarJogo() {
  estado = getEstadoJogo();

  if (!estado) {
    location.href = 'temas.html';
    return;
  }

  placar = getPlacar();

  document.getElementById("temaAtual").innerHTML = `Tema: <strong>${estado.tema}</strong>`;
  exibirBadgeDificuldade();
  atualizarPalavraUI();
  atualizarForcaUI();
  criarTeclado();
  atualizarPlacarUI();
  mostrarMensagem("");
  document.getElementById("acoesFinais").style.display = "none";

  configurarTecladoFisico();
}

// Inicializacao
document.addEventListener("DOMContentLoaded", inicializarJogo);