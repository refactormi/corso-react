import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('inizializza con valore di default se chiave assente', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    expect(result.current[0]).toBe(0);
    expect(localStorage.getItem('counter')).toBe('0');
  });

  it('legge valore esistente da localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));
    const { result } = renderHook(() => useLocalStorage('theme', 'light'));
    expect(result.current[0]).toBe('dark');
  });

  it('aggiorna stato e persiste in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('name', ''));
    act(() => {
      const setName = result.current[1];
      setName('Alice');
    });
    expect(result.current[0]).toBe('Alice');
    expect(localStorage.getItem('name')).toBe(JSON.stringify('Alice'));
  });

  it('supporta updater function come setState', () => {
    const { result } = renderHook(() => useLocalStorage('n', 1));
    act(() => {
      const setN = result.current[1];
      setN((prev: number) => prev + 1);
    });
    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem('n')).toBe('2');
  });

  it('gestisce JSON malformato senza crash e usa default', () => {
    localStorage.setItem('broken', '{not-json');
    const { result } = renderHook(() => useLocalStorage('broken', 5));
    expect(result.current[0]).toBe(5);
  });
});


