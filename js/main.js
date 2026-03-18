// main.js
import { palavras, cadastrarPalavra } from './words.js';
import { iniciarJogo, tentarLetra } from './game.js';
import { atualizarPalavra, criarTeclado, atualizarForca } from './ui.js';

const els = {
  btnIniciar: document.getElementById("btnIniciar"),
  btnReiniciar: document.getElementById("btnReiniciar"),
  formCadastro: document.getElementById("formCadastro"),
  novaPalavra: document.getElementById("novaPalavra"),
  novoTema: document.getElementById("novoTema"),
  novaDificuldade: document.getElementById("novaDificuldade"),
  sectionCadastro: document.getElementById("cadastro"),
  sectionJogo: document.getElementById("jogo")
};

function mostrarJogo() {
  els.sectionCadastro.style.display = "none";
  els.sectionJogo.style.display = "block";
}

function mostrarCadastro() {
  els.sectionJogo.style.display = "none";
  els.sectionCadastro.style.display = "block";
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  // Botão Novo Jogo
  els.btnIniciar.addEventListener("click", () => {
    mostrarJogo();
    iniciarJogo(palavras);
  });

  // Botão Jogar Novamente
  if (els.btnReiniciar) {
    els.btnReiniciar.addEventListener("click", () => iniciarJogo(palavras));
  }

  // Cadastro de palavra
  if (els.formCadastro) {
    els.formCadastro.addEventListener("submit", e => {
      e.preventDefault();

      const palavra = els.novaPalavra.value.trim();
      const tema = els.novoTema.value.trim();
      const dif = els.novaDificuldade.value;

      if (cadastrarPalavra(palavra, tema, dif)) {
        els.formCadastro.reset();
        mostrarJogo();
        iniciarJogo(palavras);
      }
    });
  }

  // Teclado físico
  document.addEventListener("keydown", e => {
    const letra = e.key.toUpperCase();
    if (!/^[A-Z]$/.test(letra)) return;

    const botao = document.querySelector(`#teclado button[data-letra="${letra}"]`);
    if (botao && !botao.disabled) {
      window.dispatchEvent(new CustomEvent("tentar-letra", { detail: { letra, botao } }));
    }
  });

  // Centraliza tentativa de letra (clique ou teclado físico)
  window.addEventListener("tentar-letra", (e) => {
    const { letra, botao } = e.detail;
    tentarLetra(letra, botao);
  });

  // Inicia o jogo na carga inicial
  mostrarJogo();
  iniciarJogo(palavras);
});