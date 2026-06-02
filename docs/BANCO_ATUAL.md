# Estado atual do banco de dados

## Situação atual

O projeto atualmente tem uma migration em PHP para criar um banco SQLite em:

```text
app/Database/database.sqlite
```

Esse arquivo já existe e foi gerado pela migration `app/Migration/migration.php`.

Estado validado:

| Item | Quantidade |
| --- | --- |
| Tabelas criadas | 5 |
| Dificuldades iniciais | 3 |
| Temas iniciais | 7 |

## Migration atual

A migration principal está em:

```text
app/Migration/migration.php
```

Ela usa SQLite via `PDO` e cria a estrutura do banco usando classes PHP (`Schema`, `Blueprint` e `Seeder`) em vez de manter um arquivo `.sql` separado como fonte principal.

Para executar:

```bash
php app/Migration/migration.php
```

## Tabelas previstas

### temas

Armazena os temas usados para categorizar as palavras.

| Campo | Tipo SQLite | Regras |
| --- | --- | --- |
| id | INTEGER | chave primária, autoincremento |
| nome | TEXT | obrigatório, único |
| icone | TEXT | opcional |

Dados iniciais previstos:

| nome | icone |
| --- | --- |
| Natureza | 🌲 |
| Tecnologia | 💻 |
| Animais | 🐾 |
| Esportes | ⚽ |
| Comidas | 🍕 |
| Paises | 🌎 |
| Games | 🎮 |

### dificuldades

Armazena os níveis de dificuldade das palavras.

| Campo | Tipo SQLite | Regras |
| --- | --- | --- |
| id | INTEGER | chave primária, autoincremento |
| nome | TEXT | obrigatório, único |

Dados iniciais previstos:

| nome |
| --- |
| Facil |
| Medio |
| Dificil |

### palavras

Armazena as palavras usadas no jogo.

| Campo | Tipo SQLite | Regras |
| --- | --- | --- |
| id | INTEGER | chave primária, autoincremento |
| palavra | TEXT | obrigatório, único |
| tema_id | INTEGER | obrigatório, chave estrangeira para `temas.id` |
| dificuldade_id | INTEGER | obrigatório, chave estrangeira para `dificuldades.id` |
| criado_em | TEXT | obrigatório, padrão `CURRENT_TIMESTAMP` |

### jogadores

Armazena jogadores registrados.

| Campo | Tipo SQLite | Regras |
| --- | --- | --- |
| id | INTEGER | chave primária, autoincremento |
| nome | TEXT | obrigatório |
| email | TEXT | opcional, único |
| criado_em | TEXT | obrigatório, padrão `CURRENT_TIMESTAMP` |

### partidas

Armazena o histórico de partidas.

| Campo | Tipo SQLite | Regras |
| --- | --- | --- |
| id | INTEGER | chave primária, autoincremento |
| jogador_id | INTEGER | obrigatório, chave estrangeira para `jogadores.id` |
| palavra_id | INTEGER | obrigatório, chave estrangeira para `palavras.id` |
| erros | INTEGER | obrigatório, padrão `0` |
| venceu | INTEGER | obrigatório, padrão `0` |
| jogado_em | TEXT | obrigatório, padrão `CURRENT_TIMESTAMP` |

## Relacionamentos

| Tabela | Campo | Referência |
| --- | --- | --- |
| palavras | tema_id | temas.id |
| palavras | dificuldade_id | dificuldades.id |
| partidas | jogador_id | jogadores.id |
| partidas | palavra_id | palavras.id |

## Observações

A aplicação usa SQLite diretamente em `app/Database/database.sqlite`.

O arquivo antigo `database.sql` em MySQL/MariaDB foi removido da estrutura principal, porque a referência atual de criação do banco é `app/Migration/migration.php`.

A pasta `app/config` também foi removida, pois a conexão atual não depende mais de `config.ini`.
