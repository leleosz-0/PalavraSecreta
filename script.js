// Palavras iniciais
let palavras = [
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
 /|\  |
      |
      |
=========`,
` 
  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
=========`,
` 
  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
=========`
];

const elPalavra = document.getElementById("palavra");
const elTeclado = document.getElementById("teclado");
const elMensagem = document.getElementById("mensagem");
const elForca = document.getElementById("forca");
const elTentativas = document.getElementById("errosRestantes");

const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnCadastrar = document.getElementById("btnCadastrar");

const sectionCadastro = document.getElementById("cadastro");
const sectionJogo = document.getElementById("jogo");

const formCadastro = document.getElementById("formCadastro");

function iniciarJogo() {

  const idx = Math.floor(Math.random() * palavras.length);
  const obj = palavras[idx];

  palavraSecreta = obj.palavra.toUpperCase();
  temaAtual = obj.tema;

  letrasErradas = [];
  letrasAcertadas = new Set();
  erros = 0;

  document.getElementById("temaAtual").textContent = "Tema: " + temaAtual;

  elMensagem.textContent = "";
  elMensagem.className = "";

  btnReiniciar.style.display = "none";

  atualizarPalavra();
  atualizarForca();
  criarTeclado();

  sectionCadastro.style.display = "none";
  sectionJogo.style.display = "block";
}

function atualizarPalavra() {

  let display = "";

  for (let letra of palavraSecreta) {

    if (letrasAcertadas.has(letra)) {
      display += letra + " ";
    } else {
      display += "_ ";
    }

  }

  elPalavra.textContent = display.trim();
}

function atualizarForca() {

  elForca.textContent = forcaEstagios[erros];
  elTentativas.textContent = maxErros - erros;

}

function criarTeclado() {

  elTeclado.innerHTML = "";

  const linhasTeclado = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
  ];

  linhasTeclado.forEach(linha => {

    const div = document.createElement("div");
    div.className = "linha";

    linha.split("").forEach(letra => {

      const btn = document.createElement("button");

      btn.textContent = letra;
      btn.dataset.letra = letra;

      btn.addEventListener("click", () => tentarLetra(letra, btn));

      div.appendChild(btn);

    });

    elTeclado.appendChild(div);

  });

}

function tentarLetra(letra, botao) {

  botao.disabled = true;

  if (palavraSecreta.includes(letra)) {

    letrasAcertadas.add(letra);
    botao.classList.add("acertou");

    atualizarPalavra();

    if ([...palavraSecreta].every(l => letrasAcertadas.has(l))) {

      elMensagem.textContent = "Parabéns! Você venceu!";
      elMensagem.className = "vitoria";

      desabilitarTeclado();

      btnReiniciar.style.display = "block";

    }

  }

  else {

    if (!letrasErradas.includes(letra)) {

      letrasErradas.push(letra);

      erros++;

      botao.classList.add("errou");

      atualizarForca();

      if (erros >= maxErros) {

        elMensagem.textContent = "Você perdeu! A palavra era: " + palavraSecreta;
        elMensagem.className = "derrota";

        desabilitarTeclado();

        btnReiniciar.style.display = "block";

      }

    }

  }

}

function desabilitarTeclado() {

  document.querySelectorAll("#teclado button").forEach(btn => {

    btn.disabled = true;

  });

}

document.addEventListener("keydown", e => {

  const letra = e.key.toUpperCase();

  if (!letra.match(/^[A-Z]$/)) return;

  const botao = document.querySelector(`#teclado button[data-letra="${letra}"]`);

  if (botao && !botao.disabled) {

    tentarLetra(letra, botao);

  }

});

btnIniciar.addEventListener("click", iniciarJogo);

btnReiniciar.addEventListener("click", iniciarJogo);

btnCadastrar.addEventListener("click", () => {

  sectionJogo.style.display = "none";
  sectionCadastro.style.display = "block";

});

formCadastro.addEventListener("submit", e => {

  e.preventDefault();

  const palavra = document.getElementById("novaPalavra").value.trim().toUpperCase();
  const tema = document.getElementById("novoTema").value.trim();
  const dificuldade = document.getElementById("novaDificuldade").value;

  if (palavra.length < 3) {

    alert("A palavra precisa ter pelo menos 3 letras.");

    return;

  }

  palavras.push({ palavra, tema, dificuldade });

  alert("Palavra cadastrada com sucesso!");

  formCadastro.reset();

  iniciarJogo();

});

sectionCadastro.style.display = "none";
sectionJogo.style.display = "block";

iniciarJogo();
