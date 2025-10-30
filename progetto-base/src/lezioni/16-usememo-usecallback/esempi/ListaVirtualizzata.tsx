import { useMemo, useState } from 'react';

export default function ListaVirtualizzata() {
  const [search, setSearch] = useState('');
  const items = useMemo(() => Array.from({ length: 5000 }, (_, i) => `Elemento ${i + 1}`), []);
  const filtered = useMemo(() => items.filter((x) => x.toLowerCase().includes(search.toLowerCase())).slice(0, 200), [items, search]);
  return (
    <div style={{ padding: 12 }}>
      <h3>Lista filtrata (useMemo)</h3>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca..." />
      <div style={{ height: 300, overflow: 'auto', marginTop: 8, border: '1px solid #ddd' }}>
        {filtered.map((x) => (
          <div key={x} style={{ padding: 6, borderBottom: '1px solid #eee' }}>{x}</div>
        ))}
      </div>
    </div>
  );
}
 


