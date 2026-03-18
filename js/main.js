// js/main.js
import { carregarTodasPalavras, adicionarPalavra } from './data.js';
import { iniciarJogo, tentarLetra } from './game.js';
import { atualizarPalavra, criarTeclado, atualizarForca, desabilitarTeclado, mostrarMensagemFinal } from './ui.js';

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

let palavrasDisponiveis = [];  // ← declaramos aqui

function mostrarJogo() {
  els.sectionCadastro.style.display = "none";
  els.sectionJogo.style.display = "block";
}

function mostrarCadastro() {
  els.sectionJogo.style.display = "none";
  els.sectionCadastro.style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
  // Carrega todas as palavras (JSON + localStorage)
  palavrasDisponiveis = await carregarTodasPalavras();

  // Botão Novo Jogo
  els.btnIniciar.addEventListener("click", () => {
    mostrarJogo();
    iniciarJogo(palavrasDisponiveis);
  });

  // Botão Jogar Novamente
  if (els.btnReiniciar) {
    els.btnReiniciar.addEventListener("click", () => {
      iniciarJogo(palavrasDisponiveis);
    });
  }

  // Cadastro de nova palavra
  if (els.formCadastro) {
    els.formCadastro.addEventListener("submit", async e => {
      e.preventDefault();

      const palavra = els.novaPalavra.value.trim();
      const tema = els.novoTema.value.trim();
      const dif = els.novaDificuldade.value;

      const sucesso = await adicionarPalavra(palavra, tema, dif);

      if (sucesso) {
        els.formCadastro.reset();
        // Recarrega a lista atualizada
        palavrasDisponiveis = await carregarTodasPalavras();
        mostrarJogo();
        iniciarJogo(palavrasDisponiveis);
      }
    });
  }

  // Teclado físico (permanece igual)
  document.addEventListener("keydown", e => {
    const letra = e.key.toUpperCase();
    if (!/^[A-Z]$/.test(letra)) return;

    const botao = document.querySelector(`#teclado button[data-letra="${letra}"]`);
    if (botao && !botao.disabled) {
      window.dispatchEvent(new CustomEvent("tentar-letra", { detail: { letra, botao } }));
    }
  });

  window.addEventListener("tentar-letra", (e) => {
    const { letra, botao } = e.detail;
    tentarLetra(letra, botao);
  });

  // Inicia o jogo na primeira carga
  mostrarJogo();
  iniciarJogo(palavrasDisponiveis);
});