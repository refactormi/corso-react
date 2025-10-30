// Virtual DOM Performance Demo - Esempio Avanzato con Ottimizzazioni
// Questo esempio mostra come il Virtual DOM lavora insieme a memo, useMemo e useCallback
// per ottimizzare le performance. Ora che hai completato la Lezione 14, puoi capire
// come tutti questi concetti lavorano insieme!

import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';

// Componente per tracciare i render
function RenderTracker({ name }) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  return (
    <div style={{ 
      border: '2px solid #61dafb', 
      padding: '10px', 
      margin: '5px 0',
      borderRadius: '4px',
      backgroundColor: '#f8f9fa'
    }}>
      <strong>{name}</strong> - Render: {renderCount.current}
    </div>
  );
}

// Demo 1: Aggiornamento di Lista
function ListUpdateDemo() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [renderCount, setRenderCount] = useState(0);
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  const addItem = () => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
  };
  
  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const shuffleItems = () => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5));
  };
  
  return (
    <div style={{ 
      border: '2px solid #28a745', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#d4edda'
    }}>
      <h3>📝 Demo Aggiornamento Lista</h3>
      <p><strong>Render count:</strong> {renderCount}</p>
      <p><strong>Items:</strong> {items.length}</p>
      
      <div style={{ margin: '15px 0' }}>
        <button onClick={addItem} style={{ 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '5px'
        }}>
          Aggiungi Item
        </button>
        <button onClick={shuffleItems} style={{ 
          backgroundColor: '#ffc107', 
          color: '#212529', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '5px'
        }}>
          Mescola Items
        </button>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li key={item} style={{ 
            backgroundColor: 'white', 
            padding: '10px', 
            margin: '5px 0', 
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{item}</span>
            <button onClick={() => removeItem(index)} style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '5px 10px', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Rimuovi
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Demo 2: Rendering Condizionale
function ConditionalRenderingDemo() {
  const [showDetails, setShowDetails] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const loadUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({ 
        name: 'Mario Rossi', 
        email: 'mario@example.com', 
        age: 25,
        city: 'Milano'
      });
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div style={{ 
      border: '2px solid #6f42c1', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#e2e3f1'
    }}>
      <h3>🔄 Demo Rendering Condizionale</h3>
      
      <div style={{ margin: '15px 0' }}>
        <button onClick={loadUser} disabled={loading} style={{ 
          backgroundColor: '#6f42c1', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}>
          {loading ? 'Caricamento...' : 'Carica Utente'}
        </button>
        <button onClick={() => setShowDetails(!showDetails)} style={{ 
          backgroundColor: '#17a2b8', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}>
          {showDetails ? 'Nascondi' : 'Mostra'} Dettagli
        </button>
      </div>
      
      {user ? (
        <div>
          <h4>👤 {user.name}</h4>
          {showDetails && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '15px', 
              borderRadius: '4px',
              margin: '10px 0'
            }}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Età:</strong> {user.age} anni</p>
              <p><strong>Città:</strong> {user.city}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Nessun utente caricato</p>
      )}
    </div>
  );
}

// Demo 3: Memoization
const ExpensiveComponent = memo(function ExpensiveComponent({ data, onUpdate }) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  // Simula un calcolo costoso
  const expensiveValue = useMemo(() => {
    console.log('Calcolo costoso eseguito');
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
  
  return (
    <div style={{ 
      border: '2px solid #fd7e14', 
      padding: '15px', 
      margin: '10px 0',
      borderRadius: '4px',
      backgroundColor: '#fff3cd'
    }}>
      <h4>💰 Componente Costoso (Memoizzato)</h4>
      <p><strong>Render count:</strong> {renderCount.current}</p>
      <p><strong>Valore calcolato:</strong> {expensiveValue}</p>
      <button onClick={() => onUpdate(Math.random())} style={{ 
        backgroundColor: '#fd7e14', 
        color: 'white', 
        border: 'none', 
        padding: '8px 16px', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Aggiorna Dati
      </button>
    </div>
  );
});

function MemoizationDemo() {
  const [data, setData] = useState([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 }
  ]);
  const [counter, setCounter] = useState(0);
  
  const updateData = useCallback((newValue) => {
    setData(prev => [...prev, { id: Date.now(), value: newValue }]);
  }, []);
  
  return (
    <div style={{ 
      border: '2px solid #20c997', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#d1ecf1'
    }}>
      <h3>🧠 Demo Memoization</h3>
      <p><strong>Counter:</strong> {counter}</p>
      <button onClick={() => setCounter(counter + 1)} style={{ 
        backgroundColor: '#20c997', 
        color: 'white', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Incrementa Counter
      </button>
      
      <ExpensiveComponent data={data} onUpdate={updateData} />
    </div>
  );
}

// Demo 4: Batching degli Aggiornamenti
function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  const handleBatchUpdate = () => {
    // Questi aggiornamenti vengono raggruppati automaticamente in React 18
    setCount(count + 1);
    setName('Mario');
    setEmail('mario@example.com');
    setCount(count + 2);
    
    console.log('Aggiornamenti raggruppati - solo un re-render');
  };
  
  return (
    <div style={{ 
      border: '2px solid #e83e8c', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#f8d7da'
    }}>
      <h3>📦 Demo Batching</h3>
      <p><strong>Render count:</strong> {renderCount}</p>
      <p><strong>Count:</strong> {count}</p>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      
      <button onClick={handleBatchUpdate} style={{ 
        backgroundColor: '#e83e8c', 
        color: 'white', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Aggiornamento Raggruppato
      </button>
    </div>
  );
}

// Demo 5: Confronto Virtual DOM vs DOM Reale
function VirtualDOMComparison() {
  const [items, setItems] = useState(['A', 'B', 'C']);
  const [useVirtualDOM, setUseVirtualDOM] = useState(true);
  
  const addItem = () => {
    if (useVirtualDOM) {
      // React Virtual DOM
      setItems(prev => [...prev, String.fromCharCode(65 + prev.length)]);
    } else {
      // Manipolazione diretta del DOM (per confronto)
      const ul = document.getElementById('direct-dom-list');
      const li = document.createElement('li');
      li.textContent = String.fromCharCode(65 + items.length);
      li.style.padding = '10px';
      li.style.margin = '5px 0';
      li.style.backgroundColor = 'white';
      li.style.borderRadius = '4px';
      ul.appendChild(li);
    }
  };
  
  return (
    <div style={{ 
      border: '2px solid #6c757d', 
      padding: '20px', 
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: '#e9ecef'
    }}>
      <h3>⚖️ Confronto Virtual DOM vs DOM Reale</h3>
      
      <div style={{ margin: '15px 0' }}>
        <label>
          <input 
            type="checkbox" 
            checked={useVirtualDOM}
            onChange={(e) => setUseVirtualDOM(e.target.checked)}
          />
          Usa Virtual DOM (React)
        </label>
      </div>
      
      <button onClick={addItem} style={{ 
        backgroundColor: '#6c757d', 
        color: 'white', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Aggiungi Item
      </button>
      
      <div style={{ margin: '15px 0' }}>
        <h4>React Virtual DOM:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, index) => (
            <li key={index} style={{ 
              backgroundColor: 'white', 
              padding: '10px', 
              margin: '5px 0', 
              borderRadius: '4px'
            }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ margin: '15px 0' }}>
        <h4>DOM Reale (per confronto):</h4>
        <ul id="direct-dom-list" style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ backgroundColor: 'white', padding: '10px', margin: '5px 0', borderRadius: '4px' }}>A</li>
          <li style={{ backgroundColor: 'white', padding: '10px', margin: '5px 0', borderRadius: '4px' }}>B</li>
          <li style={{ backgroundColor: 'white', padding: '10px', margin: '5px 0', borderRadius: '4px' }}>C</li>
        </ul>
      </div>
    </div>
  );
}

// Componente principale che combina tutte le demo
function VirtualDOMDemo() {
  const [activeDemo, setActiveDemo] = useState('all');
  
  const demos = [
    { id: 'all', name: 'Tutte le Demo' },
    { id: 'list', name: 'Aggiornamento Lista' },
    { id: 'conditional', name: 'Rendering Condizionale' },
    { id: 'memoization', name: 'Memoization' },
    { id: 'batching', name: 'Batching' },
    { id: 'comparison', name: 'Confronto Virtual DOM' }
  ];
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>🌐 Virtual DOM Demo</h1>
      <p>Esempi pratici di come funziona il Virtual DOM in React</p>
      
      <div style={{ 
        backgroundColor: '#e9ecef', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>🎛️ Seleziona Demo</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {demos.map(demo => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              style={{ 
                backgroundColor: activeDemo === demo.id ? '#61dafb' : '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {demo.name}
            </button>
          ))}
        </div>
      </div>
      
      {(activeDemo === 'all' || activeDemo === 'list') && <ListUpdateDemo />}
      {(activeDemo === 'all' || activeDemo === 'conditional') && <ConditionalRenderingDemo />}
      {(activeDemo === 'all' || activeDemo === 'memoization') && <MemoizationDemo />}
      {(activeDemo === 'all' || activeDemo === 'batching') && <BatchingDemo />}
      {(activeDemo === 'all' || activeDemo === 'comparison') && <VirtualDOMComparison />}
      
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>💡 Istruzioni</h3>
        <ol>
          <li>Apri la console del browser (F12) per vedere i log</li>
          <li>Interagisci con le demo per vedere il Virtual DOM in azione</li>
          <li>Osserva come React aggiorna solo le parti necessarie</li>
          <li>Confronta le performance tra Virtual DOM e DOM reale</li>
          <li>Nota come la memoization previene re-render inutili</li>
        </ol>
      </div>
    </div>
  );
}

export default VirtualDOMDemo;
