import { useCallback, useEffect, useRef, useState } from 'react';

function readFromLocalStorage<T>(key: string, initialValue: T): T {
  const item = localStorage.getItem(key);
  if (item === null) {
    try {
      localStorage.setItem(key, JSON.stringify(initialValue));
    } catch {}
    return initialValue;
  }
  try {
    return JSON.parse(item) as T;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const keyRef = useRef(key);
  const [value, setValue] = useState<T>(() => readFromLocalStorage(keyRef.current, initialValue));

  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key;
      setValue(readFromLocalStorage(key, initialValue));
    }
  }, [key, initialValue]);

  const setAndPersist = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const nextValue = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(keyRef.current, JSON.stringify(nextValue));
        } catch {}
        return nextValue;
      });
    },
    []
  );

  return [value, setAndPersist] as const;
}


