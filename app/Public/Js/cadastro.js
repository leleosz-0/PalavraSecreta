// cadastro.js - Logica da tela de cadastro integrada ao Backend

const form = document.getElementById("formCadastro");
const msgEl = document.getElementById("msgCadastro");

function exibirMensagem(texto, tipo) {
  msgEl.textContent = texto;
  msgEl.className = `msg-cadastro ${tipo}`;
  msgEl.style.display = "block";

  clearTimeout(msgEl._timer);
  msgEl._timer = setTimeout(() => {
    msgEl.style.display = "none";
  }, 4000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const palavra = document.getElementById("novaPalavra").value.trim();
  const tema = document.getElementById("novoTema").value.trim();
  const dificuldade = document.getElementById("novaDificuldade").value;

  if (!palavra || !tema) {
    exibirMensagem("Preencha a palavra e o tema.", "erro");
    return;
  }

  try {
    const response = await fetch('/api/palavras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ palavra, tema, dificuldade })
    });

    const resultado = await response.json();

    if (resultado.ok) {
      exibirMensagem(`Palavra "${palavra.toUpperCase()}" cadastrada com sucesso!`, "sucesso");
      form.reset();
    } else {
      exibirMensagem(resultado.erro || "Erro ao cadastrar.", "erro");
    }
  } catch (err) {
    console.error("Erro ao enviar para API:", err);
    exibirMensagem("Erro de conexão com o servidor.", "erro");
  }
});