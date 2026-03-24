// ui.js
const forca = document.getElementById("forca");
const palavraEl = document.getElementById("palavra");
const teclado = document.getElementById("teclado");
const mensagem = document.getElementById("mensagem");
const tentativas = document.getElementById("errosRestantes");
const temaAtualEl = document.getElementById("temaAtual");
const btnReiniciar = document.getElementById("btnReiniciar");

const forcaEstagios = [
  `
  +---+
  |   |
      |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

export function atualizarPalavra(palavraSecreta, letrasAcertadas) {
  let display = "";

  for (let char of palavraSecreta) {
    if (char === " ") {
      display += " ";        // 3 espaços para separar bem as palavras
    } else if (letrasAcertadas.has(char)) {
      display += char + " ";
    } else {
      display += "_ ";
    }
  }

  palavraEl.textContent = display.trim();
}

export function atualizarForca(erros) {
  forca.textContent = forcaEstagios[erros];
  tentativas.textContent = 6 - erros;
}

export function criarTeclado() {
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
        // evento será tratado no main.js agora
        window.dispatchEvent(new CustomEvent("tentar-letra", { detail: { letra, botao: btn } }));
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
  mensagem.textContent = texto;
  mensagem.className = "mensagem " + classe;

  if (classe === "vitoria") {
    temaAtualEl.className = "vitoria";
  } else if (classe === "derrota") {
    temaAtualEl.className = "derrota";
  } else {
    temaAtualEl.className = "";
  }
}