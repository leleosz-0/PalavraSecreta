# Jogo da Forca

Projeto desenvolvido com foco na aplicação prática de lógica de
programação, estruturação semântica em HTML5 e princípios básicos de
acessibilidade web.

Trata-se de uma versão digital do jogo da forca, no qual o jogador deve
descobrir uma palavra secreta antes que o limite máximo de erros seja
atingido.

------------------------------------------------------------------------

## Objetivo

O projeto tem finalidade educacional e foi desenvolvido para:

-   Aplicar conceitos fundamentais de lógica de programação
-   Trabalhar manipulação de strings e estruturas de repetição
-   Desenvolver organização estrutural utilizando HTML5 semântico
-   Aplicar boas práticas de acessibilidade (ARIA)
-   Construir uma aplicação leve executável diretamente no navegador

------------------------------------------------------------------------

## Funcionalidades

### Mecânicas do Jogo

-   Sorteio de palavra com base em tema e nível de dificuldade
-   Exibição da palavra oculta por meio de traços
-   Revelação automática de todas as ocorrências da letra correta
-   Controle de erros com limite máximo de seis tentativas
-   Verificação automática de vitória ou derrota
-   Reinício de partida

### Interface

-   Teclado virtual interativo
-   Bloqueio de letras já utilizadas
-   Estrutura organizada por seções semânticas
-   Representação textual da forca

### Gestão de Conteúdo

-   Cadastro de novas palavras
-   Organização por tema e dificuldade
-   Persistência de dados utilizando armazenamento local do navegador

------------------------------------------------------------------------

## Arquitetura e Estrutura

A aplicação foi estruturada seguindo padrões modernos de HTML5 e
acessibilidade:

-   Uso da tag `<main>` para delimitar o conteúdo principal do jogo
-   Uso da tag `<aside>` para organizar o cadastro de palavras como
    conteúdo secundário
-   Separação temática com `<section>` e hierarquia adequada de títulos
-   Utilização de `<figure>` e `<figcaption>` para representar a forca
-   Estruturação do teclado como lista (`<ul>` e `<li>`)
-   Uso adequado de tipos de botão (`type="button"` e `type="submit"`)
-   Implementação de atributos ARIA para melhoria da acessibilidade

Essa organização melhora a clareza estrutural do código, a
acessibilidade e a manutenção do projeto.

------------------------------------------------------------------------

## Tecnologias Utilizadas

-   HTML5

------------------------------------------------------------------------

## Possíveis Melhorias

-   Sistema de pontuação
-   Ranking de jogadores
-   Responsividade para dispositivos móveis
-   Sistema de dicas
-   Temporizador por rodada
-   Melhorias visuais com animações

------------------------------------------------------------------------

## Licença

Projeto desenvolvido para fins educacionais.
