// game.js
import {
  atualizarPalavra,
  atualizarForca,
  criarTeclado,
  desabilitarTeclado,
  mostrarMensagemFinal,
  setTentrarLetraCallback,
  animarErro,
  exibirBadgeDificuldade,
} from './ui.js';

let palavraSecreta   = "";
let temaAtual        = "";
let dificuldadeAtual = "";
let letrasErradas    = [];
let letrasAcertadas  = new Set();
let erros            = 0;
const MAX_ERROS      = 6;

// Placar da sessão (persiste enquanto a aba estiver aberta)
const placar = { vitorias: 0, derrotas: 0, sequencia: 0 };

let handleKeyPress = null;

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizarLetra(letra) {
  return removerAcentos(letra).toUpperCase();
}

// ====================== TECLADO FÍSICO ======================
function criarHandleKeyPress() {
  return function(e) {
    const letra = e.key.toUpperCase();
    if (letra.length === 1 && /[A-Z]/.test(letra)) {
      const botao = document.querySelector(`#teclado button[data-letra="${letra}"]`);
      if (botao && !botao.disabled) {
        tentarLetra(letra, botao);
      }
    }
  };
}

// ====================== INICIAR JOGO ======================
export function iniciarJogo(palavrasFiltradas, temaForcado = null) {
  const idx = Math.floor(Math.random() * palavrasFiltradas.length);
  const obj = palavrasFiltradas[idx];

  palavraSecreta   = obj.palavra.toUpperCase();
  temaAtual        = temaForcado || obj.tema;
  dificuldadeAtual = obj.dificuldade || "Médio";
  letrasErradas    = [];
  letrasAcertadas  = new Set([" "]);
  erros            = 0;

  atualizarPalavra(palavraSecreta, letrasAcertadas);
  atualizarForca(erros);
  criarTeclado();
  setTentrarLetraCallback(tentarLetra);
  mostrarMensagemFinal("");

  document.getElementById("temaAtual").innerHTML =
    `Tema: <strong>${temaAtual}</strong>`;

  // Badge de dificuldade (chama após setar innerHTML)
  exibirBadgeDificuldade(dificuldadeAtual);

  // Oculta ações finais
  const acoes = document.getElementById("acoesFinais");
  if (acoes) acoes.style.display = "none";

  // Remove listener anterior para não acumular
  if (handleKeyPress) {
    document.removeEventListener("keydown", handleKeyPress);
  }
  handleKeyPress = criarHandleKeyPress();
  document.addEventListener("keydown", handleKeyPress);
}

// ====================== TENTAR LETRA ======================
export function tentarLetra(letra, botao) {
  botao.disabled = true;
  const letraNorm = normalizarLetra(letra);

  const temLetra = [...palavraSecreta].some(
    char => normalizarLetra(char) === letraNorm
  );

  if (temLetra) {
    // Revela todas as ocorrências (acento incluso)
    [...palavraSecreta].forEach(char => {
      if (normalizarLetra(char) === letraNorm) {
        letrasAcertadas.add(char);
      }
    });
    letrasAcertadas.add(letra.toUpperCase());

    botao.classList.add("acertou");
    atualizarPalavra(palavraSecreta, letrasAcertadas);

    const venceu = [...palavraSecreta]
      .filter(l => l !== " ")
      .every(l => letrasAcertadas.has(l));

    if (venceu) finalizarJogo(true);
  } else {
    if (!letrasErradas.includes(letraNorm)) {
      letrasErradas.push(letraNorm);
      erros++;
      botao.classList.add("errou");
      atualizarForca(erros);
      animarErro();

      if (erros >= MAX_ERROS) finalizarJogo(false);
    }
  }
}

// ====================== FINALIZAR JOGO ======================
function finalizarJogo(venceu) {
  desabilitarTeclado();

  if (handleKeyPress) {
    document.removeEventListener("keydown", handleKeyPress);
    handleKeyPress = null;
  }

  if (venceu) {
    placar.vitorias++;
    placar.sequencia++;
    mostrarMensagemFinal("Parabéns! Você venceu! 🎉", "vitoria");
  } else {
    placar.derrotas++;
    placar.sequencia = 0;
    mostrarMensagemFinal(`Você perdeu! A palavra era: ${palavraSecreta}`, "derrota");
  }

  atualizarPlacarUI();
  mostrarAcoesFinais(venceu);
}

// ====================== PLACAR ======================
function atualizarPlacarUI() {
  const v = document.getElementById("placarVitorias");
  const d = document.getElementById("placarDerrotas");
  const s = document.getElementById("placarSequencia");
  if (v) v.textContent = placar.vitorias;
  if (d) d.textContent = placar.derrotas;
  if (s) s.textContent = placar.sequencia;
}

// ====================== RF14 - AÇÕES FINAIS ======================
function mostrarAcoesFinais(venceu) {
  const acoes = document.getElementById("acoesFinais");
  if (!acoes) return;
  acoes.style.display = "flex";

  // Configura o botão de compartilhar
  const btnComp = document.getElementById("btnCompartilhar");
  if (!btnComp) return;

  // Remove listener antigo para não acumular
  const novo = btnComp.cloneNode(true);
  btnComp.parentNode.replaceChild(novo, btnComp);

  novo.addEventListener("click", () => {
    const letrasUsadas = erros + letrasAcertadas.size - 1; // -1 pelo espaço inicial
    let emoji  = venceu ? "🎉" : "💀";
    let status = venceu
      ? `Adivinhei a palavra "${palavraSecreta}" com ${erros} erro${erros !== 1 ? 's' : ''}!`
      : `Não adivinhei a palavra "${palavraSecreta}" (${erros} erros).`;

    const quadrado = gerarQuadradoResultado(venceu);
    const texto = `🎯 Jogo da Forca\n${status}\nTema: ${temaAtual} | Dificuldade: ${dificuldadeAtual}\n${quadrado}`;

    navigator.clipboard.writeText(texto).then(() => {
      novo.textContent = "✅ Copiado!";
      novo.classList.add("copiado");
      setTimeout(() => {
        novo.textContent = "📋 Compartilhar";
        novo.classList.remove("copiado");
      }, 2500);
    }).catch(() => {
      // Fallback para browsers sem clipboard API
      prompt("Copie o texto abaixo:", texto);
    });
  });
}

/** Gera um mini-grid de emojis representando os acertos/erros */
function gerarQuadradoResultado(venceu) {
  const acertos = letrasAcertadas.size - 1; // remove o espaço
  const total   = acertos + erros;
  let linha = "";
  for (let i = 0; i < acertos && i < 6; i++) linha += "🟩";
  for (let i = 0; i < erros && linha.length / 2 < 6; i++) linha += "🟥";
  return linha;
}