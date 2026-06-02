// storage.js - Gerencia localStorage para estado do jogo e placar

const STORAGE_KEYS = {
  PALAVRAS_CADASTRADAS: 'forca-palavras-cadastradas',
  JOGO_ESTADO: 'forca-jogo-estado',
  PLACAR: 'forca-placar'
};

// ====================== PALAVRAS CADASTRADAS ======================
export function getPalavrasCadastradas() {
  const str = localStorage.getItem(STORAGE_KEYS.PALAVRAS_CADASTRADAS);
  return str ? JSON.parse(str) : [];
}

export function salvarPalavra(palavra, tema, dificuldade) {
  const palavras = getPalavrasCadastradas();
  const palavraLimpa = palavra.trim().toUpperCase();

  if (palavraLimpa.length < 3) {
    return { ok: false, motivo: 'A palavra precisa ter pelo menos 3 letras.' };
  }

  const jaExiste = palavras.some(p => p.palavra === palavraLimpa);
  if (jaExiste) {
    return { ok: false, motivo: `A palavra "${palavraLimpa}" ja esta cadastrada.` };
  }

  palavras.push({ palavra: palavraLimpa, tema: tema.trim(), dificuldade });
  localStorage.setItem(STORAGE_KEYS.PALAVRAS_CADASTRADAS, JSON.stringify(palavras));
  return { ok: true };
}

// ====================== ESTADO DO JOGO ======================
export function salvarEstadoJogo(estado) {
  localStorage.setItem(STORAGE_KEYS.JOGO_ESTADO, JSON.stringify(estado));
}

export function getEstadoJogo() {
  const str = localStorage.getItem(STORAGE_KEYS.JOGO_ESTADO);
  return str ? JSON.parse(str) : null;
}

export function limparEstadoJogo() {
  localStorage.removeItem(STORAGE_KEYS.JOGO_ESTADO);
}

// ====================== PLACAR ======================
export function getPlacar() {
  const str = localStorage.getItem(STORAGE_KEYS.PLACAR);
  return str ? JSON.parse(str) : { vitorias: 0, derrotas: 0, sequencia: 0 };
}

export function salvarPlacar(placar) {
  localStorage.setItem(STORAGE_KEYS.PLACAR, JSON.stringify(placar));
}