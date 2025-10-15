import { useCallback, useEffect, useRef, useState } from 'react';

type UseApiResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

export function useApi<T = unknown>(url: string, init?: RequestInit): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const requestIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const id = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as T;
      if (requestIdRef.current === id) {
        setData(json);
      }
    } catch (e) {
      if (requestIdRef.current === id) {
        setError(e as Error);
        setData(null);
      }
    } finally {
      if (requestIdRef.current === id) {
        setLoading(false);
      }
    }
  }, [url, init]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}


