// data.js - Carregamento de palavras

import { getPalavrasCadastradas } from './storage.js';

export let palavrasBase = [];

export async function carregarPalavrasBase() {
  try {
    const response = await fetch('./data/palavras.json');
    if (!response.ok) throw new Error(`Erro: ${response.status}`);

    const data = await response.json();
    palavrasBase = data.map(item => ({
      ...item,
      palavra: item.palavra.toUpperCase()
    }));
    return palavrasBase;
  } catch (err) {
    console.error("Falha ao carregar palavras.json:", err);
    palavrasBase = [
      { palavra: "SOL", tema: "Natureza", dificuldade: "Facil" },
      { palavra: "ARVORE", tema: "Natureza", dificuldade: "Facil" },
      { palavra: "CELULAR", tema: "Tecnologia", dificuldade: "Facil" }
    ];
    return palavrasBase;
  }
}

export async function carregarTodasPalavras() {
  await carregarPalavrasBase();
  const cadastradas = getPalavrasCadastradas();

  const todas = [...palavrasBase, ...cadastradas];
  const unicas = todas.filter((item, index, self) =>
    index === self.findIndex(t => t.palavra === item.palavra)
  );

  return unicas;
}