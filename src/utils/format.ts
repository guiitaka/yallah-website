/**
 * Utilitários para formatação de valores
 */

/**
 * Formata um valor numérico como moeda no padrão brasileiro (R$ 1.234,56)
 * @param value Valor a ser formatado
 * @param currency Símbolo da moeda (padrão: R$)
 * @param decimals Número de casas decimais (padrão: 0)
 * @returns Valor formatado como moeda
 */
export function formatCurrency(value: number, currency: string = 'R$', decimals: number = 0): string {
    // Formata o número com separador de milhar (.) e decimal (,)
    const formatter = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return `${currency} ${formatter.format(value)}`;
} 