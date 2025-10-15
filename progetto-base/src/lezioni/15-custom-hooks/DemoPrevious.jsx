import { useState } from 'react';
import { usePrevious } from '../../hooks/usePrevious';

export default function DemoPrevious() {
  const [value, setValue] = useState('');
  const prev = usePrevious(value);

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
      <h3>Demo usePrevious</h3>
      <input
        placeholder="Scrivi qualcosa"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={() => setValue('')}>Reset</button>
      <p>Valore corrente: {value || '(vuoto)'}</p>
      <p>Valore precedente: {prev ?? '(undefined al primo render)'}
      </p>
    </div>
  );
}


