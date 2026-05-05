<?php

namespace Forca\Models;

/**
 * Entidade Palavra — objeto simples com propriedades.
 * Não contém SQL. Apenas representa os dados de uma palavra do jogo.
 */
class Palavra
{
    private ?int    $id;
    private string  $palavra;
    private string  $tema;
    private string  $dificuldade;
    private ?string $criadoEm;

    public function __construct(
        string  $palavra,
        string  $tema,
        string  $dificuldade,
        ?int    $id       = null,
        ?string $criadoEm = null
    ) {
        $this->palavra     = strtoupper(trim($palavra));
        $this->tema        = trim($tema);
        $this->dificuldade = trim($dificuldade);
        $this->id          = $id;
        $this->criadoEm    = $criadoEm;
    }

    // Getters
    public function getId(): ?int       { return $this->id; }
    public function getPalavra(): string { return $this->palavra; }
    public function getTema(): string    { return $this->tema; }
    public function getDificuldade(): string { return $this->dificuldade; }
    public function getCriadoEm(): ?string   { return $this->criadoEm; }

    // Setters necessários
    public function setPalavra(string $palavra): void
    {
        $this->palavra = strtoupper(trim($palavra));
    }

    public function setTema(string $tema): void
    {
        $this->tema = trim($tema);
    }

    public function setDificuldade(string $dificuldade): void
    {
        $this->dificuldade = trim($dificuldade);
    }

    /**
     * Métodos mágicos para acesso dinâmico (ex: $palavra->palavra)
     */
    public function __get(string $name): mixed
    {
        $getter = 'get' . ucfirst($name);
        if (method_exists($this, $getter)) {
            return $this->$getter();
        }
        return null;
    }

    public function __isset(string $name): bool
    {
        return property_exists($this, $name);
    }

    /**
     * Converte para array (útil para resposta JSON da API)
     */
    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'palavra'     => $this->palavra,
            'tema'        => $this->tema,
            'dificuldade' => $this->dificuldade,
            'criado_em'   => $this->criadoEm,
        ];
    }
}
