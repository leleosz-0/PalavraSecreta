import { carregarTodasPalavras } from './data.js';
import { iniciarJogo } from './game.js';
import { criarTeclado } from './ui.js';
import { carregarTodasPalavras } from './data.js';
import { adicionarPalavra } from './data.js';   // ← adicione esta linha

const els = {
  home: document.getElementById("home"),
  temas: document.getElementById("temas"),
  jogo: document.getElementById("jogo"),
  cadastro: document.getElementById("cadastro"),
  gridTemas: document.getElementById("gridTemas"),
  btnComecar: document.getElementById("btnComecar"),
  btnVoltarHome: document.getElementById("btnVoltarHome"),
  btnIniciar: document.getElementById("btnIniciar"),
  btnCadastrar: document.getElementById("btnCadastrar"),
  formCadastro: document.getElementById("formCadastro"),
};

let palavrasDisponiveis = [];
let ultimoTemaRandom = null;   // ← para alternar no modo Aleatório

const themeIcons = {
  "Natureza": "🌲",
  "Tecnologia": "💻",
  "Frutas": "🍎",
  "Filmes e Séries": "🎬",
  "Objetos": "🔧",
  // adicione mais aqui se quiser
};

function mostrarTela(tela) {
  els.home.style.display = "none";
  els.temas.style.display = "none";
  els.jogo.style.display = "none";
  els.cadastro.style.display = "none";

  if (tela) {
    tela.style.display = "block";
  }
}

function criarCardsTemas() {
  els.gridTemas.innerHTML = "";

  const temasUnicos = [...new Set(palavrasDisponiveis.map(p => p.tema))].sort();

  // Card Aleatório (primeiro)
  const cardAleatorio = document.createElement("div");
  cardAleatorio.className = "tema-card aleatorio";
  cardAleatorio.innerHTML = `
    <span class="icone">🎲</span>
    <h3>Aleatório</h3>
    <small>Mistura de temas</small>
  `;
  cardAleatorio.addEventListener("click", () => iniciarJogoComTema("Aleatório"));
  els.gridTemas.appendChild(cardAleatorio);

  // Cards dos temas normais
  temasUnicos.forEach(tema => {
    const card = document.createElement("div");
    card.className = "tema-card";
    const icone = themeIcons[tema] || "❓";
    card.innerHTML = `
      <span class="icone">${icone}</span>
      <h3>${tema}</h3>
    `;
    card.addEventListener("click", () => iniciarJogoComTema(tema));
    els.gridTemas.appendChild(card);
  });
}

function iniciarJogoComTema(temaEscolhido) {
  let palavrasFiltradas = palavrasDisponiveis;

  if (temaEscolhido !== "Aleatório") {
    palavrasFiltradas = palavrasDisponiveis.filter(p => p.tema === temaEscolhido);
    ultimoTemaRandom = temaEscolhido;
  } else {
    // === MODO ALEATÓRIO - alterna tema ===
    const temasUnicos = [...new Set(palavrasDisponiveis.map(p => p.tema))];
    let temasDisponiveis = temasUnicos;

    if (ultimoTemaRandom && temasUnicos.length > 1) {
      temasDisponiveis = temasUnicos.filter(t => t !== ultimoTemaRandom);
    }

    const temaSorteado = temasDisponiveis[Math.floor(Math.random() * temasDisponiveis.length)];
    palavrasFiltradas = palavrasDisponiveis.filter(p => p.tema === temaSorteado);
    ultimoTemaRandom = temaSorteado;

    // Mostra o tema real mesmo no modo aleatório
    temaEscolhido = temaSorteado;
  }

  mostrarTela(els.jogo);
  iniciarJogo(palavrasFiltradas, temaEscolhido);   // ← alterei o game.js para aceitar tema
}

// ====================== EVENTOS ======================
document.addEventListener("DOMContentLoaded", async () => {
  palavrasDisponiveis = await carregarTodasPalavras();

  // Tela inicial
  mostrarTela(els.home);

  els.btnComecar.addEventListener("click", () => {
    mostrarTela(els.temas);
    criarCardsTemas();
  });

  els.btnVoltarHome.addEventListener("click", () => mostrarTela(els.home));

  // Header
  els.btnIniciar.addEventListener("click", () => {
    mostrarTela(els.temas);
    criarCardsTemas();
  });

  els.btnCadastrar.addEventListener("click", () => {
    mostrarTela(els.cadastro);
  });

  // Cadastro (mantido)
  if (els.formCadastro) {
    els.formCadastro.addEventListener("submit", async e => {
      e.preventDefault();
      // (código de cadastro que você já tinha)
      const palavra = document.getElementById("novaPalavra").value.trim();
      const tema = document.getElementById("novoTema").value.trim();
      const dif = document.getElementById("novaDificuldade").value;

      // ... (seu código de adicionarPalavra)
      alert("Palavra cadastrada!");
      els.formCadastro.reset();
      palavrasDisponiveis = await carregarTodasPalavras(); // atualiza
      mostrarTela(els.home);
    });
  }
});