import { useState } from 'react';
import { useApi } from '../../hooks/useApi';

export default function DemoApi() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const { data, error, loading, refetch } = useApi(url);

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
      <h3>Demo useApi</h3>
      <input
        style={{ width: '100%', marginBottom: 8 }}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={() => refetch()} disabled={loading}>
        {loading ? 'Carico...' : 'Refetch'}
      </button>
      {error && <p style={{ color: 'crimson' }}>Errore: {error.message}</p>}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{data ? JSON.stringify(data, null, 2) : 'Nessun dato'}</pre>
    </div>
  );
}


