/**
 * ⚠️ ATTENZIONE: Questo esempio usa useState e useEffect
 * 
 * Questo esempio avanzato usa concetti che saranno spiegati nelle lezioni successive:
 * - useState (Lezione 8): per gestire lo stato interno del componente
 * - useEffect (Lezione 12): per gestire effetti collaterali
 * 
 * Per ora, usa 'demo-hmr-simple.tsx' che mostra l'HMR senza questi concetti avanzati.
 * Potrai tornare a questo esempio dopo aver completato la Lezione 12.
 */

/*
// Demo Hot Module Replacement (HMR)
// Questo file dimostra come l'HMR mantiene lo stato durante le modifiche

import { useState, useEffect } from 'react';

// Componente principale che dimostra l'HMR
function HMRDemo() {
  const [count, setCount] = useState<number>(0);
  const [message, setMessage] = useState<string>('Ciao da React!');
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);

  // Effetto per dimostrare che l'HMR mantiene lo stato
  useEffect(() => {
    console.log('Componente montato o aggiornato');
    return () => {
      console.log('Componente smontato');
    };
  }, []);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔥 Demo Hot Module Replacement</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Contatore: {count}</h2>
        <button 
          onClick={() => setCount(count + 1)}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#61dafb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Incrementa
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#ff6b6b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Decrementa
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#4ecdc4', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        <h2>Messaggio: {message}</h2>
        <input 
          type="text" 
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          style={{ padding: '8px', margin: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h2>Lista Items ({items.length})</h2>
        <button 
          onClick={addItem}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Aggiungi Item
        </button>
        <ul style={{ textAlign: 'left', maxWidth: '300px' }}>
          {items.map((item, index) => (
            <li key={index} style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item}</span>
              <button 
                onClick={() => removeItem(index)}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Rimuovi
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
        <h3>💡 Istruzioni per testare l'HMR:</h3>
        <ol style={{ textAlign: 'left' }}>
          <li>Modifica il testo "Demo Hot Module Replacement" in questo file</li>
          <li>Salva il file (Ctrl+S / Cmd+S)</li>
          <li>Osserva che il titolo cambia ma lo stato rimane invariato!</li>
          <li>Prova a modificare i colori o gli stili</li>
          <li>Verifica che il contatore, il messaggio e la lista mantengano i loro valori</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
        <h3>🔍 Debug Info:</h3>
        <p>Contatore: {count}</p>
        <p>Messaggio: {message}</p>
        <p>Items: {items.length}</p>
        <p>Timestamp: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default HMRDemo;
*/

