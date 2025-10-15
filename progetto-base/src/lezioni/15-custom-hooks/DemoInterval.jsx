import { useState } from 'react';
import { useInterval } from '../../hooks/useInterval';

export default function DemoInterval() {
  const [running, setRunning] = useState(true);
  const [count, setCount] = useState(0);
  useInterval(() => setCount((c) => c + 1), running ? 500 : null);

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
      <h3>Demo useInterval</h3>
      <p>Tick: {count}</p>
      <button onClick={() => setRunning((r) => !r)}>
        {running ? 'Pausa' : 'Riprendi'}
      </button>
      <button onClick={() => setCount(0)} style={{ marginLeft: 8 }}>
        Reset
      </button>
    </div>
  );
}


