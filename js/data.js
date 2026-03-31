// data.js
export let palavrasBase = [];

const STORAGE_KEY = 'forca-palavras-cadastradas';

export async function carregarPalavrasBase() {
  try {
    const response = await fetch('./data/palavras.json');

    if (!response.ok) {
      throw new Error(`Erro ao carregar JSON: ${response.status}`);
    }

    const data = await response.json();

    palavrasBase = data.map(item => ({
      ...item,
      palavra: item.palavra.toUpperCase()
    }));

    console.log(`Carregadas ${palavrasBase.length} palavras do JSON`);
    return palavrasBase;
  } catch (err) {
    console.error("Falha ao carregar palavras.json:", err);

    palavrasBase = [
      { palavra: "SOL",     tema: "Natureza",   dificuldade: "Fácil" },
      { palavra: "ARVORE",  tema: "Natureza",   dificuldade: "Fácil" },
      { palavra: "CELULAR", tema: "Tecnologia", dificuldade: "Fácil" },
      { palavra: "BANANA",  tema: "Frutas",     dificuldade: "Fácil" }
    ];
    return palavrasBase;
  }
}

export async function carregarTodasPalavras() {
  await carregarPalavrasBase();

  const salvasStr = localStorage.getItem(STORAGE_KEY);
  const salvas    = salvasStr ? JSON.parse(salvasStr) : [];

  const todas  = [...palavrasBase, ...salvas];
  const unicas = todas.filter((item, index, self) =>
    index === self.findIndex(t => t.palavra === item.palavra)
  );

  return unicas;
}

/**
 * Adiciona uma palavra ao localStorage.
 * Retorna: { ok: true } em caso de sucesso
 *           { ok: false, motivo: string } em caso de erro
 * — sem usar alert() —
 */
export async function adicionarPalavra(palavra, tema, dificuldade) {
  const palavraLimpa = palavra ? palavra.trim().toUpperCase() : '';

  if (palavraLimpa.length < 3) {
    return { ok: false, motivo: 'A palavra precisa ter pelo menos 3 letras.' };
  }

  const salvasStr = localStorage.getItem(STORAGE_KEY);
  const salvas    = salvasStr ? JSON.parse(salvasStr) : [];

  // RF09-like: impede duplicata nas palavras cadastradas
  const jaExiste = salvas.some(s => s.palavra === palavraLimpa);
  if (jaExiste) {
    return { ok: false, motivo: `A palavra "${palavraLimpa}" já está cadastrada.` };
  }

  const nova = { palavra: palavraLimpa, tema: tema.trim(), dificuldade };
  salvas.push(nova);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(salvas));

  return { ok: true };
}