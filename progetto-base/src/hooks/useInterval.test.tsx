import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useInterval } from './useInterval';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('chiama la callback sul tick ad ogni intervallo', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 100));

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(4);
  });

  it('può mettere in pausa passando null come delay', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
      initialProps: { delay: 100 as number | null },
    });
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ delay: null });
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('aggiorna la callback mantenendo lo stesso timer', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 100), {
      initialProps: { cb: first },
    });
    vi.advanceTimersByTime(200);
    expect(first).toHaveBeenCalledTimes(2);

    rerender({ cb: second });
    vi.advanceTimersByTime(200);
    expect(second).toHaveBeenCalledTimes(2);
  });
});


