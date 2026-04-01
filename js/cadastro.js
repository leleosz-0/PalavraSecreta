// cadastro.js - Logica da tela de cadastro

import { salvarPalavra } from './storage.js';

const form = document.getElementById("formCadastro");
const msgEl = document.getElementById("msgCadastro");

function exibirMensagem(texto, tipo) {
  msgEl.textContent = texto;
  msgEl.className = `msg-cadastro ${tipo}`;
  msgEl.style.display = "block";

  clearTimeout(msgEl._timer);
  msgEl._timer = setTimeout(() => {
    msgEl.style.display = "none";
  }, 4000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const palavra = document.getElementById("novaPalavra").value.trim();
  const tema = document.getElementById("novoTema").value.trim();
  const dificuldade = document.getElementById("novaDificuldade").value;

  if (!palavra || !tema) {
    exibirMensagem("Preencha a palavra e o tema.", "erro");
    return;
  }

  const resultado = salvarPalavra(palavra, tema, dificuldade);

  if (resultado.ok) {
    exibirMensagem(`Palavra "${palavra.toUpperCase()}" cadastrada com sucesso!`, "sucesso");
    form.reset();
  } else {
    exibirMensagem(resultado.motivo, "erro");
  }
});