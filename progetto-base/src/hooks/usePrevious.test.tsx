import { renderHook } from '@testing-library/react';
import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  it('ritorna undefined al primo render', () => {
    const { result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });
    expect(result.current).toBeUndefined();
  });

  it('ritorna il valore precedente dopo un rerender', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });
    rerender({ value: 2 });
    expect(result.current).toBe(1);
  });

  it('si aggiorna anche se il valore non cambia', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 2 },
    });
    rerender({ value: 2 });
    expect(result.current).toBe(2);
  });

  it('gestisce riferimenti oggetto restituendo il precedente by-ref', () => {
    const obj1 = { a: 1 };
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    });
    const obj2 = { a: 1 };
    rerender({ value: obj2 });
    expect(result.current).toBe(obj1);
    expect(result.current).not.toBe(obj2);
  });
});


