O que é HTML?

HTML (HyperText Markup Language) é uma linguagem de marcação, não uma linguagem de programação.
Diferente de linguagens como JavaScript ou Python, o HTML não trabalha com lógica, estruturas de repetição ou funções. Ele não executa cálculos nem toma decisões.
A função do HTML é estruturar o conteúdo de uma página web. Ele define onde estarão títulos, parágrafos, imagens, listas e outros elementos. Por isso, costuma-se dizer que o HTML é o “esqueleto” do site.



Anatomia das Tags

A maioria dos elementos HTML segue uma estrutura padrão composta por três partes:
Tag de abertura – formada pelo sinal <, o nome da tag e o sinal >.
Exemplo: <p>
Conteúdo – tudo que fica entre a abertura e o fechamento, como um texto.
Tag de fechamento – semelhante à abertura, mas com uma barra / antes do nome da tag.
Exemplo: </p>
Essa estrutura delimita onde o elemento começa e termina.
Existem exceções chamadas de tags vazias (ou self-closing), que não possuem conteúdo interno, como a tag <img>, utilizada para inserir imagens.



Estrutura Inicial Obrigatória

Todo documento HTML deve seguir uma estrutura básica para que o navegador o interprete corretamente:
• <!DOCTYPE html>: Informa ao navegador que o documento utiliza a versão mais recente, o HTML5.
• <html>: É a tag principal que "abraça" todo o conteúdo do documento.
• <head>: Funciona como o "cérebro" do site; contém configurações, metadados e o título da página que aparece na aba do navegador.
• <body>: É o "corpo" do site; aqui fica todo o conteúdo visível para o usuário, como textos e imagens.
Glossário de Tags Principais
• <h1> a <h6>: Tags de título, utilizadas para definir a hierarquia e importância do conteúdo, sendo o <h1> o principal.
• <p>: Define um parágrafo de texto.
• <a>: Tag de âncora, usada para criar links. Utiliza o atributo href para indicar o destino.
• <img>: Insere imagens. Requer os atributos src (caminho da imagem) e alt (texto alternativo para acessibilidade).
• <ul> e <ol>: Criam listas não ordenadas (com marcadores) e ordenadas (numeradas), respectivamente.
• <li>: Define cada item dentro de uma lista.
• <br> e <hr>: Usadas para quebra de linha e inserção de uma linha horizontal, respectivamente.



A Tag <div> e a Organização
A tag <div> (divisão) é amplamente utilizada para organizar o código.
Ela não possui efeito visual por padrão, mas serve para agrupar elementos relacionados dentro da página.
Por meio do aninhamento (colocar elementos dentro de outros), a <div> permite dividir o layout em blocos lógicos, como cabeçalho, seção de conteúdo ou galeria.
Essa organização é fundamental para facilitar a aplicação de estilos com CSS e manter o código estruturado e mais legível.
