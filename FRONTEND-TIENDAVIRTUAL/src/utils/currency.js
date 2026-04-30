// src/utils/currency.js

const LOCALE = 'es-PE';
const CURRENCY_SYMBOL = 'S/ ';
const CURRENCY_CODE = 'PEN';

export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return `${showSymbol ? CURRENCY_SYMBOL : ''}0.00`;
  
  const formatted = Math.abs(amount).toLocaleString(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const prefix = showSymbol ? CURRENCY_SYMBOL : '';
  const sign = amount < 0 ? '-' : '';
  
  return `${sign}${prefix}${formatted}`;
};

export const formatCurrencyNoDecimals = (amount) => {
  if (amount === null || amount === undefined) return 'S/ 0';
  
  const formatted = Math.abs(amount).toLocaleString(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  const sign = amount < 0 ? '-' : '';
  return `${sign}S/ ${formatted}`;
};

export { LOCALE, CURRENCY_SYMBOL, CURRENCY_CODE };