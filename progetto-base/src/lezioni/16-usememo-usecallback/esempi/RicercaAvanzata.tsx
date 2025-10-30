import { useMemo, useState } from 'react';

export default function RicercaAvanzata() {
  const [term, setTerm] = useState('');
  const products = useMemo(() => Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `Prodotto ${i + 1}` })), []);
  const results = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(term.toLowerCase())).slice(0, 50), [products, term]);
  return (
    <div style={{ padding: 12 }}>
      <h3>Ricerca prodotti (useMemo)</h3>
      <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Cerca prodotto..." />
      <ul>
        {results.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
 


