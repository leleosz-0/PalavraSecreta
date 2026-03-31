// main.js
import { carregarTodasPalavras, adicionarPalavra } from './data.js';
import { iniciarJogo } from './game.js';

const els = {
  home:             document.getElementById("home"),
  temas:            document.getElementById("temas"),
  jogo:             document.getElementById("jogo"),
  cadastro:         document.getElementById("cadastro"),
  gridTemas:        document.getElementById("gridTemas"),
  btnComecar:       document.getElementById("btnComecar"),
  btnVoltarHome:    document.getElementById("btnVoltarHome"),
  btnVoltarHomeCad: document.getElementById("btnVoltarHomeCad"),
  btnIniciar:       document.getElementById("btnIniciar"),
  btnCadastrar:     document.getElementById("btnCadastrar"),
  formCadastro:     document.getElementById("formCadastro"),
  msgCadastro:      document.getElementById("msgCadastro"),
};

let palavrasDisponiveis = [];
let ultimoTemaRandom    = null;
let dificuldadeFiltro   = "Todas"; // RF13

const themeIcons = {
  "Natureza":        "🌲",
  "Tecnologia":      "💻",
  "Frutas":          "🍎",
  "Filmes e Séries": "🎬",
  "Objetos":         "🔧",
};

// ====================== NAVEGAÇÃO ======================
function mostrarTela(tela) {
  [els.home, els.temas, els.jogo, els.cadastro].forEach(s => {
    if (s) s.style.display = "none";
  });
  if (tela) tela.style.display = "block";
}

// ====================== CARDS DE TEMAS ======================
function criarCardsTemas() {
  els.gridTemas.innerHTML = "";

  // Filtra palavras pela dificuldade selecionada
  const palavrasFiltradas = dificuldadeFiltro === "Todas"
    ? palavrasDisponiveis
    : palavrasDisponiveis.filter(p => p.dificuldade === dificuldadeFiltro);

  // Conta palavras por tema (com filtro aplicado)
  const contagemPorTema = palavrasFiltradas.reduce((acc, p) => {
    acc[p.tema] = (acc[p.tema] || 0) + 1;
    return acc;
  }, {});

  const temasUnicos = Object.keys(contagemPorTema).sort();

  // Card Aleatório — só aparece se há palavras disponíveis
  if (palavrasFiltradas.length > 0) {
    const cardAleatorio = document.createElement("div");
    cardAleatorio.className = "tema-card aleatorio";
    cardAleatorio.innerHTML = `
      <span class="icone">🎲</span>
      <h3>Aleatório</h3>
      <small class="contagem">${palavrasFiltradas.length} palavras</small>
    `;
    cardAleatorio.addEventListener("click", () => iniciarJogoComTema("Aleatório", palavrasFiltradas));
    els.gridTemas.appendChild(cardAleatorio);
  }

  if (temasUnicos.length === 0) {
    const aviso = document.createElement("p");
    aviso.style.cssText = "text-align:center; color:#aaa; margin:24px 0; grid-column:1/-1;";
    aviso.textContent   = "Nenhuma palavra cadastrada para este nível.";
    els.gridTemas.appendChild(aviso);
    return;
  }

  temasUnicos.forEach(tema => {
    const palavrasDoTema = palavrasFiltradas.filter(p => p.tema === tema);
    const card = document.createElement("div");
    card.className = "tema-card";
    const icone = themeIcons[tema] || "❓";
    card.innerHTML = `
      <span class="icone">${icone}</span>
      <h3>${tema}</h3>
      <span class="contagem">${palavrasDoTema.length} palavra${palavrasDoTema.length !== 1 ? 's' : ''}</span>
    `;
    card.addEventListener("click", () => iniciarJogoComTema(tema, palavrasDoTema));
    els.gridTemas.appendChild(card);
  });
}

// ====================== INICIAR COM TEMA ======================
function iniciarJogoComTema(temaEscolhido, poolFiltrado) {
  let palavrasFiltradas = poolFiltrado;
  let temaExibido       = temaEscolhido;

  if (temaEscolhido === "Aleatório") {
    const temasUnicos    = [...new Set(poolFiltrado.map(p => p.tema))];
    let temasDisponiveis = temasUnicos.filter(t => t !== ultimoTemaRandom);
    if (temasDisponiveis.length === 0) temasDisponiveis = temasUnicos;

    const temaSorteado = temasDisponiveis[Math.floor(Math.random() * temasDisponiveis.length)];
    palavrasFiltradas  = poolFiltrado.filter(p => p.tema === temaSorteado);
    temaExibido        = temaSorteado;
    ultimoTemaRandom   = temaSorteado;
  }

  mostrarTela(els.jogo);
  iniciarJogo(palavrasFiltradas, temaExibido);
}

// ====================== FILTRO DE DIFICULDADE (RF13) ======================
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

// ====================== FEEDBACK DE CADASTRO (sem alert) ======================
function exibirMsgCadastro(texto, tipo) {
  const msg = els.msgCadastro;
  if (!msg) return;
  msg.textContent = texto;
  msg.className   = `msg-cadastro ${tipo}`;
  msg.style.display = "block";

  clearTimeout(msg._timer);
  msg._timer = setTimeout(() => { msg.style.display = "none"; }, 4000);
}

// ====================== EVENTOS ======================
document.addEventListener("DOMContentLoaded", async () => {
  palavrasDisponiveis = await carregarTodasPalavras();
  mostrarTela(els.home);
  configurarFiltros();

  els.btnComecar?.addEventListener("click", () => {
    mostrarTela(els.temas);
    criarCardsTemas();
  });

  els.btnIniciar?.addEventListener("click", () => {
    mostrarTela(els.temas);
    criarCardsTemas();
  });

  els.btnVoltarHome?.addEventListener("click", () => mostrarTela(els.home));

  els.btnCadastrar?.addEventListener("click", () => {
    if (els.msgCadastro) els.msgCadastro.style.display = "none";
    mostrarTela(els.cadastro);
  });

  // Botão Voltar do cadastro
  els.btnVoltarHomeCad?.addEventListener("click", () => mostrarTela(els.home));

  // Formulário de cadastro — sem alert()
  els.formCadastro?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const palavra     = document.getElementById("novaPalavra").value.trim();
    const tema        = document.getElementById("novoTema").value.trim();
    const dificuldade = document.getElementById("novaDificuldade").value;

    if (!palavra || !tema) {
      exibirMsgCadastro("Preencha a palavra e o tema.", "erro");
      return;
    }

    const resultado = await adicionarPalavra(palavra, tema, dificuldade);

    if (resultado.ok) {
      palavrasDisponiveis = await carregarTodasPalavras();
      exibirMsgCadastro(`✅ Palavra "${palavra.toUpperCase()}" cadastrada com sucesso!`, "sucesso");
      els.formCadastro.reset();
    } else {
      exibirMsgCadastro(`❌ ${resultado.motivo}`, "erro");
    }
  });

  // Jogar Novamente
  document.getElementById("btnReiniciar")?.addEventListener("click", () => {
    mostrarTela(els.temas);
    criarCardsTemas();
  });
});