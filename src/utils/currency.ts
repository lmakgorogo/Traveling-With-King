export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToZAR: number; // 1 unit of foreign currency = X ZAR (fixed rates)
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    rateToZAR: 1.0,
    flag: '🇿🇦',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToZAR: 18.50,
    flag: '🇺🇸',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateToZAR: 20.00,
    flag: '🇪🇺',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToZAR: 23.50,
    flag: '🇬🇧',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateToZAR: 12.00,
    flag: '🇦🇺',
  },
};

/**
 * Converts a ZAR amount to the selected currency
 */
export function convertZAR(amountZAR: number, currency: CurrencyCode): number {
  if (currency === 'ZAR') return amountZAR;
  const config = CURRENCIES[currency];
  return Math.round(amountZAR / config.rateToZAR);
}

/**
 * Formats a single ZAR amount into the target currency with symbol
 */
export function formatCurrency(
  amountZAR: number,
  currency: CurrencyCode,
  includeCode: boolean = false
): string {
  const config = CURRENCIES[currency];
  const converted = convertZAR(amountZAR, currency);
  const formattedNumber = converted.toLocaleString();

  if (currency === 'ZAR') {
    return `${config.symbol}${formattedNumber}${includeCode ? ' ZAR' : ''}`;
  }

  return `${config.symbol}${formattedNumber}${includeCode ? ` ${currency}` : ''}`;
}

/**
 * Formats a price range (min and max) into the target currency
 */
export function formatCurrencyRange(
  minZAR: number,
  maxZAR: number,
  currency: CurrencyCode,
  isFromPrefix: boolean = false,
  includeCode: boolean = false
): string {
  const config = CURRENCIES[currency];
  const convertedMin = convertZAR(minZAR, currency);
  const convertedMax = convertZAR(maxZAR, currency);

  if (isFromPrefix) {
    return `From ${config.symbol}${convertedMin.toLocaleString()}${includeCode ? ` ${currency}` : ''}`;
  }

  if (convertedMin === convertedMax) {
    return `${config.symbol}${convertedMin.toLocaleString()}${includeCode ? ` ${currency}` : ''}`;
  }

  return `${config.symbol}${convertedMin.toLocaleString()} – ${config.symbol}${convertedMax.toLocaleString()}${
    includeCode ? ` ${currency}` : ''
  }`;
}
