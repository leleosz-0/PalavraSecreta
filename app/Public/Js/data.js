// data.js - Carregamento de palavras via API PHP

export let palavrasBase = [];

/**
 * Busca palavras do backend PHP.
 * Agora integrado com a camada de Controller e Service.
 */
export async function carregarPalavrasBase() {
  try {
    // Busca todas as palavras cadastradas no banco SQLite via API
    const response = await fetch('/api/palavras/lista'); 
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const json = await response.json();
    return json.data || [];
  } catch (err) {
    console.error("Falha crítica ao carregar palavras da API:", err);
    // Retorna vazio para sinalizar erro no carregamento
    return [];
  }
}

export async function carregarTodasPalavras() {
  const palavras = await carregarPalavrasBase();
  
  if (palavras.length === 0) {
    console.warn("Nenhuma palavra encontrada no banco de dados.");
  }

  // Normaliza e remove duplicatas
  const unicas = palavras.filter((item, index, self) =>
    index === self.findIndex(t => t.palavra.toUpperCase() === item.palavra.toUpperCase())
  );

  palavrasBase = unicas.map(item => ({
    ...item,
    palavra: item.palavra.toUpperCase()
  }));

  return palavrasBase;
}
