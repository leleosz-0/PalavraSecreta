// words.js
export const palavras = [
  { palavra: "sol", tema: "Natureza", dificuldade: "Fácil" },
  { palavra: "computador", tema: "Tecnologia", dificuldade: "Médio" },
  { palavra: "abacaxi", tema: "Frutas", dificuldade: "Médio" },
  { palavra: "paralelepipedo", tema: "Objetos", dificuldade: "Difícil" }
];

export function cadastrarPalavra(palavra, tema, dificuldade) {
  if (palavra.length < 3) {
    alert("A palavra precisa ter pelo menos 3 letras.");
    return false;
  }
  palavras.push({ palavra: palavra.toUpperCase(), tema, dificuldade });
  alert("Palavra cadastrada com sucesso!");
  return true;
}