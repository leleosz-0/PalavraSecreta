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

function temAcento(letra) {
  const acentuadas = "ÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇÑáàãâäéèêëíìîïóòõôöúùûüçñ";
  return acentuadas.includes(letra);
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function iniciarJogo(palavrasDisponiveis) {
  const idx = Math.floor(Math.random() * palavrasDisponiveis.length);
  const obj = palavrasDisponiveis[idx];

  palavraSecreta = obj.palavra.toUpperCase();
  temaAtual = obj.tema;

  letrasErradas = [];
  letrasAcertadas = new Set();
  letrasAcertadas.add(" ");
  erros = 0;

  [...palavraSecreta].forEach(char => {
    if (temAcento(char)) {
      letrasAcertadas.add(char);
    }
  });

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

  const letraSemAcento = removerAcentos(letra);

  const temLetra = [...palavraSecreta].some(char => 
    char === letra || removerAcentos(char) === letraSemAcento
  );

  if (temLetra) {
    letrasAcertadas.add(letra);
    letrasAcertadas.add(letraSemAcento);

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