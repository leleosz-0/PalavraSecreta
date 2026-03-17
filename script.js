// ───────────────────────────────────────
// Configurações iniciais
// ───────────────────────────────────────
const palavras = [
  { palavra: "sol", tema: "Natureza", dificuldade: "Fácil" },
  { palavra: "computador", tema: "Tecnologia", dificuldade: "Médio" },
  { palavra: "abacaxi", tema: "Frutas", dificuldade: "Médio" },
  { palavra: "paralelepipedo", tema: "Objetos", dificuldade: "Difícil" }
];

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

// ───────────────────────────────────────
// Elementos do DOM (cache)
const $ = id => document.getElementById(id);
const els = {
  palavra: $("palavra"),
  teclado: $("teclado"),
  mensagem: $("mensagem"),
  forca: $("forca"),
  tentativas: $("errosRestantes"),
  temaAtual: $("temaAtual"),
  btnReiniciar: $("btnReiniciar"),
  sectionCadastro: $("cadastro"),
  sectionJogo: $("jogo"),
  formCadastro: $("formCadastro")
};

// ───────────────────────────────────────
// Funções principais
// ───────────────────────────────────────
function iniciarJogo() {
  const idx = Math.floor(Math.random() * palavras.length);
  const obj = palavras[idx];

  palavraSecreta = obj.palavra.toUpperCase();
  temaAtual = obj.tema;

  letrasErradas = [];
  letrasAcertadas = new Set();
  erros = 0;

  els.temaAtual.textContent = `Tema: ${temaAtual}`;
  els.temaAtual.className = "";                 // limpa classes de vitória/derrota
  els.mensagem.textContent = "";
  els.mensagem.className = "mensagem";
  els.sectionJogo.className = "";                 // limpa bg de vitoria/derrota

  els.btnReiniciar.style.display = "none";

  atualizarPalavra();
  atualizarForca();
  criarTeclado();

  els.sectionCadastro.style.display = "none";
  els.sectionJogo.style.display = "block";
}

function atualizarPalavra() {
  let display = "";
  for (let letra of palavraSecreta) {
    display += letrasAcertadas.has(letra) ? letra + " " : "_ ";
  }
  els.palavra.textContent = display.trim();
}

function atualizarForca() {
  els.forca.textContent = forcaEstagios[erros];
  els.tentativas.textContent = maxErros - erros;
}

function criarTeclado() {
  els.teclado.innerHTML = "";

  const linhas = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  linhas.forEach(linha => {
    const div = document.createElement("div");
    div.className = "linha";

    linha.split("").forEach(letra => {
      const btn = document.createElement("button");
      btn.textContent = letra;
      btn.dataset.letra = letra;
      btn.addEventListener("click", () => tentarLetra(letra, btn));
      div.appendChild(btn);
    });

    els.teclado.appendChild(div);
  });
}

function tentarLetra(letra, botao) {
  botao.disabled = true;

  if (palavraSecreta.includes(letra)) {
    letrasAcertadas.add(letra);
    botao.classList.add("acertou");
    atualizarPalavra();

    if ([...palavraSecreta].every(l => letrasAcertadas.has(l))) {
      finalizarJogo(true);
    }
  } else {
    if (!letrasErradas.includes(letra)) {
      letrasErradas.push(letra);
      erros++;
      botao.classList.add("errou");
      atualizarForca();

      if (erros >= maxErros) {
        finalizarJogo(false);
      }
    }
  }
}

function finalizarJogo(venceu) {
  desabilitarTeclado();

  if (venceu) {
    els.mensagem.textContent = "Parabéns! Você venceu! 🎉";
    els.mensagem.className = "mensagem vitoria";
    els.temaAtual.className = "vitoria";
    els.sectionJogo.className = "vitoria";
  } else {
    els.mensagem.textContent = `Você perdeu! A palavra era: ${palavraSecreta}`;
    els.mensagem.className = "mensagem derrota";
    els.temaAtual.className = "derrota";
    els.sectionJogo.className = "derrota";
  }

  els.btnReiniciar.style.display = "block";
}

function desabilitarTeclado() {
  document.querySelectorAll("#teclado button").forEach(btn => {
    btn.disabled = true;
  });
}

// ───────────────────────────────────────
// Eventos + Inicialização segura
// ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Re-atribui os elementos (garante que existem)
  const els = {
    palavra:        document.getElementById("palavra"),
    teclado:        document.getElementById("teclado"),
    mensagem:       document.getElementById("mensagem"),
    forca:          document.getElementById("forca"),
    tentativas:     document.getElementById("errosRestantes"),
    temaAtual:      document.getElementById("temaAtual"),
    btnReiniciar:   document.getElementById("btnReiniciar"),
    sectionCadastro: document.getElementById("cadastro"),
    sectionJogo:    document.getElementById("jogo"),
    formCadastro:   document.getElementById("formCadastro"),
    btnIniciar:     document.getElementById("btnIniciar"),
    novaPalavra:    document.getElementById("novaPalavra"),
    novoTema:       document.getElementById("novoTema"),
    novaDificuldade: document.getElementById("novaDificuldade")
  };

  // Verifica se elementos críticos existem
  if (!els.btnIniciar) {
    console.error("ERRO: botão #btnIniciar não encontrado!");
    return;
  }
  if (!els.sectionJogo) {
    console.error("ERRO: section #jogo não encontrada!");
    return;
  }

  // Eventos
  els.btnIniciar.addEventListener("click", iniciarJogo);
  if (els.btnReiniciar) {
    els.btnReiniciar.addEventListener("click", iniciarJogo);
  }

  if (els.formCadastro) {
    els.formCadastro.addEventListener("submit", e => {
      e.preventDefault();

      const palavra = els.novaPalavra.value.trim().toUpperCase();
      const tema    = els.novoTema.value.trim();
      const dif     = els.novaDificuldade.value;

      if (palavra.length < 3) {
        alert("A palavra precisa ter pelo menos 3 letras.");
        return;
      }

      palavras.push({ palavra, tema, dificuldade: dif });
      alert("Palavra cadastrada com sucesso!");
      els.formCadastro.reset();
      iniciarJogo();
    });
  }

  // Teclado físico (sempre disponível)
  document.addEventListener("keydown", e => {
    const letra = e.key.toUpperCase();
    if (!/^[A-Z]$/.test(letra)) return;

    const botao = document.querySelector(`#teclado button[data-letra="${letra}"]`);
    if (botao && !botao.disabled) {
      tentarLetra(letra, botao);
    }
  });

  // Inicia o jogo
  console.log("DOM carregado → iniciando jogo");
  iniciarJogo();
});