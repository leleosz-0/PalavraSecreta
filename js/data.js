// js/data.js
export let palavrasBase = [];  // será preenchido pelo JSON

const STORAGE_KEY = 'forca-palavras-cadastradas';

export async function carregarPalavrasBase() {
  try {
    const response = await fetch('./data/palavras.json');
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Normalizamos tudo para maiúsculas
    palavrasBase = data.map(item => ({
      ...item,
      palavra: item.palavra.toUpperCase()
    }));
    
    console.log(`Carregadas ${palavrasBase.length} palavras do JSON`);
    return palavrasBase;
  } catch (err) {
    console.error("Falha ao carregar palavras.json:", err);
    
    // Fallback mínimo
    palavrasBase = [
      { palavra: "SOL", tema: "Natureza", dificuldade: "Fácil" },
      { palavra: "TESTE", tema: "Fallback", dificuldade: "Fácil" }
    ];
    return palavrasBase;
  }
}

export async function carregarTodasPalavras() {
  await carregarPalavrasBase(); // garante que o base está carregado

  const salvasStr = localStorage.getItem(STORAGE_KEY);
  const salvas = salvasStr ? JSON.parse(salvasStr) : [];

  // Combina base + cadastradas pelo usuário
  const todas = [...palavrasBase, ...salvas];

  // Opcional: remover duplicatas (por palavra)
  const unicas = todas.filter((item, index, self) =>
    index === self.findIndex(t => t.palavra === item.palavra)
  );

  return unicas;
}

export async function adicionarPalavra(palavra, tema, dificuldade) {
  if (!palavra || palavra.trim().length < 3) {
    alert("A palavra precisa ter pelo menos 3 letras.");
    return false;
  }

  const nova = {
    palavra: palavra.trim().toUpperCase(),
    tema: tema.trim(),
    dificuldade
  };

  const salvasStr = localStorage.getItem(STORAGE_KEY);
  const salvas = salvasStr ? JSON.parse(salvasStr) : [];

  salvas.push(nova);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(salvas));

  alert("Palavra cadastrada e salva localmente!");
  return true;
}