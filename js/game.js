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

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizarLetra(letra) {
  return removerAcentos(letra).toUpperCase();
}

export function iniciarJogo(palavrasFiltradas, temaForcado = null) {
  const idx = Math.floor(Math.random() * palavrasFiltradas.length);
  const obj = palavrasFiltradas[idx];

  palavraSecreta = obj.palavra.toUpperCase();
  temaAtual = temaForcado || obj.tema;   // ← agora recebe o parâmetro corretamente

  letrasErradas = [];
  letrasAcertadas = new Set();
  letrasAcertadas.add(" ");   // para tratar espaços
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
  const letraNormalizada = normalizarLetra(letra);
  const temLetra = [...palavraSecreta].some(char => 
    normalizarLetra(char) === letraNormalizada
  );

  if (temLetra) {
    letrasAcertadas.add(letra.toUpperCase());
    
    [...palavraSecreta].forEach(char => {
      if (normalizarLetra(char) === letraNormalizada) {
        letrasAcertadas.add(char);
      }
    });

    botao.classList.add("acertou");
    atualizarPalavra(palavraSecreta, letrasAcertadas);

    const acertouTudo = [...palavraSecreta]
      .filter(l => l !== " ")
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