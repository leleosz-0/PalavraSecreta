// storage.js - Gerencia localStorage para estado do jogo e placar

const STORAGE_KEYS = {
  JOGO_ESTADO: 'forca-jogo-estado',
  PLACAR: 'forca-placar'
};

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