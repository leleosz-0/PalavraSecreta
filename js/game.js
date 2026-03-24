// game.js
import { atualizarPalavra, atualizarForca, criarTeclado, desabilitarTeclado, mostrarMensagemFinal } from './ui.js';

let palavraSecreta = "";
let temaAtual = "";
let letrasErradas = [];
let letrasAcertadas = new Set();
let erros = 0;
const maxErros = 6;

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

export function iniciarJogo(palavrasDisponiveis) {
  const idx = Math.floor(Math.random() * palavrasDisponiveis.length);
  const obj = palavrasDisponiveis[idx];

  palavraSecreta = obj.palavra.toUpperCase();
  temaAtual = obj.tema;

  letrasErradas = [];
  letrasAcertadas = new Set();
  letrasAcertadas.add(" ");
  erros = 0;

  atualizarPalavra(palavraSecreta, letrasAcertadas);
  atualizarForca(erros);
  criarTeclado();

  mostrarMensagemFinal("");
  document.getElementById("temaAtual").textContent = `Tema: ${temaAtual}`;
  document.getElementById("temaAtual").className = "";
  document.getElementById("btnReiniciar").style.display = "none";
}

export function tentarLetra(letra, botao) {
  botao.disabled = true;

  if (palavraSecreta.includes(letra)) {
    letrasAcertadas.add(letra);
    botao.classList.add("acertou");
    atualizarPalavra(palavraSecreta, letrasAcertadas);

    // ✅ CORREÇÃO: ignora espaços na verificação de vitória
    const acertouTudo = [...palavraSecreta]
      .filter(l => l !== " ")           // remove os espaços
      .every(l => letrasAcertadas.has(l));

    if (acertouTudo) {
      finalizarJogo(true);
    }
  } else {
    if (!letrasErradas.includes(letra)) {
      letrasErradas.push(letra);
      erros++;
      botao.classList.add("errou");
      atualizarForca(erros);

      if (erros >= maxErros) {
        finalizarJogo(false);
      }
    }
  }
}

function finalizarJogo(venceu) {
  desabilitarTeclado();

  if (venceu) {
    mostrarMensagemFinal("Parabéns! Você venceu! 🎉", "vitoria");
  } else {
    mostrarMensagemFinal(`Você perdeu! A palavra era: ${palavraSecreta}`, "derrota");
  }

  document.getElementById("btnReiniciar").style.display = "block";
}