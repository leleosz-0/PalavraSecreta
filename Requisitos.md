📄 Lista de Requisitos Funcionais

Abaixo estão as funcionalidades detalhadas, organizadas por prioridade para o desenvolvimento.
1. Mecânicas de Jogo (Prioridade: Alta)

    RF01 - Escolha de Palavra: O sistema deve selecionar aleatoriamente uma palavra do banco de dados com base no tema ou dificuldade escolhida.

    RF02 - Máscara de Palavra: A palavra secreta deve ser exibida como traços (ex: _ _ _ _), revelando as letras conforme o acerto.

    RF03 - Validação de Entrada: O sistema deve aceitar apenas letras. Caracteres especiais ou números devem ser ignorados.

    RF04 - Revelação Simultânea: Caso a palavra contenha letras repetidas (ex: "ARARA"), ao digitar "A", todas as instâncias da letra devem ser reveladas ao mesmo tempo.

    RF05 - Gestão de Erros (O Boneco): O sistema deve contabilizar erros e desenhar as partes do boneco na ordem: Cabeça, Tronco, Braço Esquerdo, Braço Direito, Perna Esquerda e Perna Direita (limite de 6 erros).

    RF06 - Verificação de Vitória/Derrota: O sistema deve encerrar a partida e exibir uma mensagem de status (Vencedor ou Perdedor) e revelar a palavra correta em caso de derrota.

2. Interface e Feedback Visual (Prioridade: Alta)

    RF07 - Alfabeto Visual: Exibição de um teclado virtual na tela para seleção de letras.

    RF08 - Feedback de Cores: As letras clicadas no alfabeto devem mudar de cor: Verde para acertos e Rosa para erros.

    RF09 - Bloqueio de Duplicatas: O sistema deve impedir que o jogador selecione uma letra que já foi utilizada na partida atual.

3. Gestão de Conteúdo e Dados (Prioridade: Média)

    RF10 - Banco de Dados Persistente: O software deve salvar permanentemente as palavras cadastradas e configurações em um arquivo local ou banco de dados.

    RF11 - Cadastro de Palavras: O usuário deve ser capaz de adicionar novas palavras ao sistema, definindo seu tema e dificuldade.

    RF12 - Seleção de Temas: O jogador pode escolher um tema específico ou optar por "Sortear Tema" (aleatório).

    RF13 - Níveis de Dificuldade: Implementar lógica para escalar a dificuldade baseada no comprimento e complexidade das palavras.

4. Funcionalidades Extras (Prioridade: Baixa)

    RF14 - Compartilhamento de Resultado: Opção para o usuário copiar ou compartilhar o status final da partida (ex: "Adivinhei a palavra X com 2 erros!").

🛠️ Requisitos Não Funcionais (Observações Técnicas)

    RNF01 - Portabilidade: O sistema deve ser leve e capaz de rodar em desktops comuns.

    RNF02 - Usabilidade: A interface deve ser intuitiva o suficiente para que crianças e adultos joguem sem tutoriais.

    RNF03 - Desempenho: O sorteio de palavras deve ser instantâneo, mesmo com um banco de dados superior a 1000 palavras.
