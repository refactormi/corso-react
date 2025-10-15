import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useApi } from './useApi';

describe('useApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('carica i dati e aggiorna gli stati', async () => {
    const data = { id: 1, title: 'ok' };
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } }) as any
    );

    const { result } = renderHook(() => useApi('/api/test'));
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(data);
      expect(result.current.error).toBeNull();
    });
    expect(fetchSpy).toHaveBeenCalledWith('/api/test', expect.any(Object));
  });

  it('gestisce errori HTTP', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'boom' }), { status: 500, headers: { 'Content-Type': 'application/json' } }) as any
    );

    const { result } = renderHook(() => useApi('/api/error'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeNull();
    });
  });

  it('refetch permette di rieseguire la chiamata', async () => {
    const first = { n: 1 };
    const second = { n: 2 };
    const fetchSpy = vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify(first), { status: 200, headers: { 'Content-Type': 'application/json' } }) as any)
      .mockResolvedValueOnce(new Response(JSON.stringify(second), { status: 200, headers: { 'Content-Type': 'application/json' } }) as any);

    const { result } = renderHook(() => useApi('/api/counter'));
    await waitFor(() => expect(result.current.data).toEqual(first));

    await result.current.refetch();
    await waitFor(() => expect(result.current.data).toEqual(second));

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('ignora risposte tardive dopo cambio URL (last write wins)', async () => {
    const r1 = new Promise<Response>((resolve) => setTimeout(() => resolve(new Response(JSON.stringify({ id: 'A' })) as any), 200));
    const r2 = Promise.resolve(new Response(JSON.stringify({ id: 'B' })) as any);
    vi.spyOn(global, 'fetch')
      .mockReturnValueOnce(r1 as any)
      .mockReturnValueOnce(r2 as any);

    const { result, rerender } = renderHook(({ url }) => useApi(url), { initialProps: { url: '/api/a' } });

    rerender({ url: '/api/b' });

    await waitFor(() => expect(result.current.data).toEqual({ id: 'B' }));
  });
});


