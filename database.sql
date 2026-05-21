-- ============================================================
--  Palavra Secreta — DDL MySQL / MariaDB
-- ============================================================

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ------------------------------------------------------------
CREATE TABLE `temas` (
  `id`    INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome`  VARCHAR(80)  NOT NULL UNIQUE,
  `icone` VARCHAR(10)  NULL COMMENT 'Emoji representativo do tema'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Temas disponíveis para categorizar as palavras';

-- ------------------------------------------------------------
CREATE TABLE `dificuldades` (
  `id`   INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(20) NOT NULL UNIQUE COMMENT 'Facil | Medio | Dificil'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Níveis de dificuldade das palavras';

-- ------------------------------------------------------------
CREATE TABLE `palavras` (
  `id`             INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `palavra`        VARCHAR(100) NOT NULL UNIQUE COMMENT 'Sempre em maiúsculo',
  `tema_id`        INT          NOT NULL,
  `dificuldade_id` INT          NOT NULL,
  `criado_em`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_palavras_tema`        FOREIGN KEY (`tema_id`)        REFERENCES `temas`        (`id`),
  CONSTRAINT `fk_palavras_dificuldade` FOREIGN KEY (`dificuldade_id`) REFERENCES `dificuldades` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Palavras usadas no jogo da forca';

-- ------------------------------------------------------------
CREATE TABLE `jogadores` (
  `id`        INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome`      VARCHAR(100) NOT NULL,
  `email`     VARCHAR(150) NULL UNIQUE COMMENT 'Opcional — para ranking futuro',
  `criado_em` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Jogadores registrados no sistema';

-- ------------------------------------------------------------
CREATE TABLE `partidas` (
  `id`         INT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `jogador_id` INT       NOT NULL,
  `palavra_id` INT       NOT NULL,
  `erros`      TINYINT   NOT NULL DEFAULT 0 COMMENT 'Máximo 6 erros',
  `venceu`     TINYINT(1) NOT NULL DEFAULT 0,
  `jogado_em`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_partidas_jogador` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`),
  CONSTRAINT `fk_partidas_palavra` FOREIGN KEY (`palavra_id`) REFERENCES `palavras`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Histórico de partidas';

-- ------------------------------------------------------------
--  Dados iniciais
-- ------------------------------------------------------------
INSERT INTO `dificuldades` (`nome`) VALUES ('Facil'), ('Medio'), ('Dificil');

INSERT INTO `temas` (`nome`, `icone`) VALUES
  ('Natureza',    '🌲'),
  ('Tecnologia',  '💻'),
  ('Animais',     '🐾'),
  ('Esportes',    '⚽'),
  ('Comidas',     '🍕'),
  ('Paises',      '🌎'),
  ('Games',       '🎮');

SET foreign_key_checks = 1;
