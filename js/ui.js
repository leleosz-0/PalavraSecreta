// ui.js
let tentarLetraFn = null;

export function setTentrarLetraCallback(fn) {
  tentarLetraFn = fn;
}

// Elementos cacheados uma vez
const getEl = id => document.getElementById(id);

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

const MAX_ERROS = 6;

export function atualizarPalavra(palavraSecreta, letrasAcertadas) {
  const palavraEl = getEl("palavra");
  palavraEl.innerHTML = "";

  // Divide a palavra secreta em grupos separados por espaço
  const grupos = palavraSecreta.split(" ");

  grupos.forEach((grupo, idxGrupo) => {
    // Cada grupo (palavra) vira um <span> flex que mantém as letras juntas
    const grupoEl = document.createElement("span");
    grupoEl.className = "palavra-grupo";

    for (const char of grupo) {
      const letraEl = document.createElement("span");
      letraEl.className = "letra-slot";

      if (letrasAcertadas.has(char)) {
        letraEl.textContent = char;
        letraEl.classList.add("revelada");
      } else {
        letraEl.textContent = "_";
      }

      grupoEl.appendChild(letraEl);
    }

    palavraEl.appendChild(grupoEl);

    // Separador de espaço entre grupos (exceto após o último)
    if (idxGrupo < grupos.length - 1) {
      const espaco = document.createElement("span");
      espaco.className = "palavra-espaco";
      palavraEl.appendChild(espaco);
    }
  });
}

export function atualizarForca(erros) {
  getEl("forca").textContent = forcaEstagios[erros] ?? forcaEstagios[MAX_ERROS];

  const restantes = MAX_ERROS - erros;
  const span = getEl("errosRestantes");
  span.textContent = restantes;

  // Cor do contador muda conforme o perigo
  if (restantes <= 1)      span.style.color = "#ff5252";
  else if (restantes <= 3) span.style.color = "#ff9800";
  else                     span.style.color = "#ffffff";
}

export function criarTeclado() {
  const teclado = getEl("teclado");
  teclado.innerHTML = "";

  const linhas = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  linhas.forEach(linha => {
    const div = document.createElement("div");
    div.className = "linha";

    linha.split("").forEach(letra => {
      const btn = document.createElement("button");
      btn.textContent = letra;
      btn.dataset.letra = letra;

      btn.addEventListener("click", () => {
        if (typeof tentarLetraFn === "function") {
          tentarLetraFn(letra, btn);
        }
      });

      div.appendChild(btn);
    });

    teclado.appendChild(div);
  });
}

export function desabilitarTeclado() {
  document.querySelectorAll("#teclado button").forEach(btn => {
    btn.disabled = true;
  });
}

export function mostrarMensagemFinal(texto, classe = "") {
  const mensagem = getEl("mensagem");
  mensagem.textContent = texto;
  mensagem.className = "mensagem " + classe;
}

/**
 * Faz a figura da forca tremer levemente ao errar.
 * Usa uma classe CSS com animação curta.
 */
export function animarErro() {
  const fig = document.querySelector("figure");
  if (!fig) return;
  fig.classList.remove("shake");
  // Força reflow para reiniciar a animação
  void fig.offsetWidth;
  fig.classList.add("shake");
}

/**
 * Exibe o badge de dificuldade no h2 do tema.
 */
export function exibirBadgeDificuldade(dificuldade) {
  const cores = {
    "Fácil":   { bg: "rgba(76,175,80,0.2)",  border: "#4caf50", cor: "#81c784" },
    "Médio":   { bg: "rgba(255,152,0,0.2)",  border: "#ff9800", cor: "#ffb74d" },
    "Difícil": { bg: "rgba(244,67,54,0.2)",  border: "#f44336", cor: "#e57373" },
  };
  const estilo = cores[dificuldade] || cores["Médio"];

  // Garante que o span existe
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
    getEl("temaAtual").appendChild(badge);
  }

  badge.textContent = dificuldade;
  badge.style.background    = estilo.bg;
  badge.style.borderColor   = estilo.border;
  badge.style.color         = estilo.cor;
}