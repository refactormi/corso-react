import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function DemoLocalStorage() {
  const [name, setName] = useLocalStorage('demo-name', '');
  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
      <h3>Demo useLocalStorage</h3>
      <input
        placeholder="Il tuo nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={() => setName('')}>Reset</button>
      <button onClick={() => localStorage.removeItem('demo-name')} style={{ marginLeft: 8 }}>
        Rimuovi chiave
      </button>
      <p>Valore salvato: {name || '(vuoto)'}</p>
    </div>
  );
}


