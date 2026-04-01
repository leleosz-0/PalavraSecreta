// temas.js - Logica da tela de selecao de temas

import { carregarTodasPalavras } from './data.js';
import { salvarEstadoJogo } from './storage.js';

const gridTemas = document.getElementById("gridTemas");
let palavrasDisponiveis = [];
let dificuldadeFiltro = "Todas";

const themeIcons = {
  "natureza": "🌲",
  "tecnologia": "💻",
  "frutas": "🍎",
  "filmes e series": "🎬",
  "objetos": "🔧",
  "profissoes": "👷",
  "lugares do mundo": "🌍",
  "mitologia": "⚡",
  "instrumentos musicais": "🎸",
  "doencas": "🦠",
  "corpo humano": "🧠",
  "personagens": "🎭",
  "animais": "🐾",
  "esportes": "⚽",
  "comidas": "🍕",
  "paises": "🌎",
  "ciencia": "🔬",
  "historia": "📜",
  "musica": "🎵",
  "arte": "🎨",
  "literatura": "📚",
  "games": "🎮",
  "marcas": "🏷️",
  "cores": "🎨",
  "veiculos": "🚗",
  "astronomia": "🌟",
  "moda": "👗",
  "bebidas": "🍹",
  "flores": "🌸",
  "oceano": "🌊",
};

// Funcao para buscar icone de forma normalizada
function getIconeTema(tema) {
  const temaNormalizado = removerAcentos(tema).toLowerCase();
  return themeIcons[temaNormalizado] || "❓";
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function criarCardsTemas() {
  gridTemas.innerHTML = "";

  const filtroNorm = removerAcentos(dificuldadeFiltro);
  const palavrasFiltradas = filtroNorm === "Todas"
    ? palavrasDisponiveis
    : palavrasDisponiveis.filter(p => removerAcentos(p.dificuldade) === filtroNorm);

  const contagemPorTema = palavrasFiltradas.reduce((acc, p) => {
    acc[p.tema] = (acc[p.tema] || 0) + 1;
    return acc;
  }, {});

  const temasUnicos = Object.keys(contagemPorTema).sort();

  // Card Aleatorio
  if (palavrasFiltradas.length > 0) {
    const cardAleatorio = document.createElement("div");
    cardAleatorio.className = "tema-card aleatorio";
    cardAleatorio.innerHTML = `
      <span class="icone">🎲</span>
      <h3>Aleatorio</h3>
      <small class="contagem">${palavrasFiltradas.length} palavras</small>
    `;
    cardAleatorio.addEventListener("click", () => iniciarJogoComTema("Aleatorio", palavrasFiltradas));
    gridTemas.appendChild(cardAleatorio);
  }

  if (temasUnicos.length === 0) {
    const aviso = document.createElement("p");
    aviso.style.cssText = "text-align:center; color:#aaa; margin:24px 0; grid-column:1/-1;";
    aviso.textContent = "Nenhuma palavra cadastrada para este nivel.";
    gridTemas.appendChild(aviso);
    return;
  }

  temasUnicos.forEach(tema => {
    const palavrasDoTema = palavrasFiltradas.filter(p => p.tema === tema);
    const card = document.createElement("div");
    card.className = "tema-card";
    const icone = getIconeTema(tema);
    card.innerHTML = `
      <span class="icone">${icone}</span>
      <h3>${tema}</h3>
      <span class="contagem">${palavrasDoTema.length} palavra${palavrasDoTema.length !== 1 ? 's' : ''}</span>
    `;
    card.addEventListener("click", () => iniciarJogoComTema(tema, palavrasDoTema));
    gridTemas.appendChild(card);
  });
}

function iniciarJogoComTema(temaEscolhido, pool) {
  let palavrasFiltradas = pool;
  let temaExibido = temaEscolhido;

  if (temaEscolhido === "Aleatorio") {
    const temasUnicos = [...new Set(pool.map(p => p.tema))];
    const temaSorteado = temasUnicos[Math.floor(Math.random() * temasUnicos.length)];
    palavrasFiltradas = pool.filter(p => p.tema === temaSorteado);
    temaExibido = temaSorteado;
  }

  // Sorteia palavra e salva estado
  const idx = Math.floor(Math.random() * palavrasFiltradas.length);
  const palavraSelecionada = palavrasFiltradas[idx];

  salvarEstadoJogo({
    palavraSecreta: palavraSelecionada.palavra.toUpperCase(),
    tema: temaExibido,
    dificuldade: palavraSelecionada.dificuldade,
    letrasAcertadas: [" ", "-"],
    letrasErradas: [],
    erros: 0
  });

  // Redireciona para o jogo
  location.href = 'jogo.html';
}

function configurarFiltros() {
  document.querySelectorAll(".btn-filtro").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      dificuldadeFiltro = btn.dataset.dif;
      criarCardsTemas();
    });
  });
}

// Inicializacao
document.addEventListener("DOMContentLoaded", async () => {
  palavrasDisponiveis = await carregarTodasPalavras();
  configurarFiltros();
  criarCardsTemas();
});