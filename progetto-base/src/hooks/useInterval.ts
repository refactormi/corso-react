import { useEffect, useLayoutEffect, useRef } from 'react';

type Delay = number | null;

export function useInterval(callback: () => void, delay: Delay) {
  const savedCallback = useRef(callback);
  const intervalId = useRef<number | null>(null);

  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    if (delay === null) return;

    intervalId.current = window.setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [delay]);
}


