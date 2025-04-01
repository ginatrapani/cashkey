import { CashflowState } from '../types/cashflow';

// A simpler and more URL-friendly encoding scheme
export const encodeState = (state: CashflowState): string => {
  try {
    return encodeURIComponent(JSON.stringify(state));
  } catch (error) {
    console.error('Error encoding state:', error);
    return '';
  }
};

export const decodeState = (encoded: string): CashflowState | null => {
  if (!encoded) return null;
  
  try {
    const decoded = JSON.parse(decodeURIComponent(encoded));
    return {
      incomes: Array.isArray(decoded.incomes) ? decoded.incomes : [],
      expenses: Array.isArray(decoded.expenses) ? decoded.expenses : [],
    };
  } catch (error) {
    console.error('Error decoding state:', error);
    return null;
  }
};

export const updateUrlWithState = (state: CashflowState): void => {
  const encodedState = encodeState(state);
  const url = new URL(window.location.href);
  url.searchParams.set('data', encodedState);
  window.history.replaceState({}, '', url.toString());
};

export const getStateFromUrl = (): CashflowState | null => {
  const url = new URL(window.location.href);
  const encodedState = url.searchParams.get('data');
  
  if (!encodedState) return null;
  
  return decodeState(encodedState);
};
