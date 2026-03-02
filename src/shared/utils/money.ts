import { FX_RATES } from '../constants/rates';

export type Currency = 'usd' | 'uah';

export function convertMoney(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;

    if (from === 'usd' && to === 'uah') return amount * FX_RATES.usdToUah;
    if (from === 'uah' && to === 'usd') return amount / FX_RATES.usdToUah;

    return amount;
}

export function formatMoney(amount: number, currency: Currency): string {
    const locale = currency === 'uah' ? 'uk-UA' : 'en-US';

    const formatted = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
    }).format(amount);

    const spaced = formatted.replace(/\u00A0/g, ' ');

    return currency === 'uah' ? `${spaced} грн` : `${spaced} USD`;
}
