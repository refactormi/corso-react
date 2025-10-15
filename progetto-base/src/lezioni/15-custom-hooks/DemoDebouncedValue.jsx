import { useState } from 'react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export default function DemoDebouncedValue() {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 500);

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
      <h3>Demo useDebouncedValue</h3>
      <input
        placeholder="Digita velocemente..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={() => setQuery('')}>Reset</button>
      <p>Immediato: {query || '(vuoto)'}</p>
      <p>Debounced (500ms): {debounced || '(vuoto)'}</p>
    </div>
  );
}


