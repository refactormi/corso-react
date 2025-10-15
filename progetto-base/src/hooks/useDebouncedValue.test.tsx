import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  it('ritorna il valore iniziale subito', () => {
    const { result } = renderHook(() => useDebouncedValue('a', 200));
    expect(result.current).toBe('a');
  });

  it('aggiorna il valore solo dopo il delay', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'a', delay: 100 },
    });
    expect(result.current).toBe('a');

    rerender({ value: 'ab', delay: 100 });
    // prima del delay non deve aggiornare
    expect(result.current).toBe('a');

    await waitFor(() => {
      expect(result.current).toBe('ab');
    }, { timeout: 500 });
  });

  it('resetta il timer se arrivano aggiornamenti rapidi (debounce)', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: '', delay: 100 },
    });

    rerender({ value: 'a', delay: 100 });
    rerender({ value: 'ab', delay: 100 });
    rerender({ value: 'abc', delay: 100 });
    // ancora il precedente
    expect(result.current).toBe('');

    await waitFor(() => {
      expect(result.current).toBe('abc');
    }, { timeout: 500 });
  });

  it('cancella il timeout al unmount', async () => {
    const { result, rerender, unmount } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'x', delay: 200 },
    });
    rerender({ value: 'xy', delay: 200 });
    unmount();
    // se non crasha e non tenta update dopo unmount, test ok
    expect(result.current).toBe('x');
  });
});


