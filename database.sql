-- =========================================
--  Passo 6 — Script de criação do banco
--  Execute: mysql -u root -p < database.sql
-- =========================================

CREATE DATABASE IF NOT EXISTS forca_jogo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE forca_jogo;

CREATE TABLE IF NOT EXISTS palavras (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    palavra     VARCHAR(100)  NOT NULL,
    tema        VARCHAR(80)   NOT NULL,
    dificuldade ENUM('Facil', 'Medio', 'Dificil') NOT NULL DEFAULT 'Medio',
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Evita palavras duplicadas (case-insensitive via collation)
    UNIQUE KEY uk_palavra (palavra),

    -- Índices para os filtros mais comuns
    INDEX idx_tema        (tema),
    INDEX idx_dificuldade (dificuldade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  Seed: algumas palavras de exemplo
-- ─────────────────────────────────────────
INSERT IGNORE INTO palavras (palavra, tema, dificuldade) VALUES
  ('SOL',          'Natureza',    'Facil'),
  ('FLORESTA',     'Natureza',    'Facil'),
  ('CACHOEIRA',    'Natureza',    'Facil'),
  ('COMPUTADOR',   'Tecnologia',  'Facil'),
  ('ALGORITMO',    'Tecnologia',  'Medio'),
  ('ENCAPSULAMENTO','Tecnologia', 'Dificil'),
  ('BANANA',       'Frutas',      'Facil'),
  ('MARACUJA',     'Frutas',      'Facil'),
  ('PIZZA',        'Comidas',     'Facil'),
  ('FEIJOADA',     'Comidas',     'Medio'),
  ('MEDICO',       'Profissoes',  'Facil'),
  ('NEUROCIRURGIAO','Profissoes', 'Dificil');
