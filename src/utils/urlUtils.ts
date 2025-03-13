
import { CashflowState } from '../types/cashflow';

// A simpler and more URL-friendly encoding scheme
export const encodeState = (state: CashflowState): string => {
  try {
    const encoded = btoa(JSON.stringify(state));
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (error) {
    console.error('Error encoding state:', error);
    return '';
  }
};

export const decodeState = (encoded: string): CashflowState | null => {
  if (!encoded) return null;
  
  try {
    // Add back padding if needed
    const padding = encoded.length % 4;
    const paddedEncoded = padding ? 
      encoded + '='.repeat(4 - padding) : 
      encoded;
    
    // Replace URL-safe characters
    const base64 = paddedEncoded.replace(/-/g, '+').replace(/_/g, '/');
    
    const decoded = JSON.parse(atob(base64));
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
