<?php

namespace Forca\Exceptions;

use RuntimeException;

/**
 * Exceção lançada quando uma regra de negócio do sistema é violada.
 * O Controller captura esta exceção e exibe a mensagem ao usuário,
 * sem expor detalhes técnicos (stack trace).
 *
 * Exemplos de uso:
 *   throw new BusinessRuleException('Palavra muito curta.');
 *   throw new BusinessRuleException('Esta palavra já está cadastrada.');
 */
class BusinessRuleException extends RuntimeException
{
    /**
     * @param string $message  Mensagem amigável para o usuário final
     * @param int    $code     Código HTTP sugerido (400 = bad request, 409 = conflict, etc.)
     */
    public function __construct(string $message, int $code = 400)
    {
        parent::__construct($message, $code);
    }
}
