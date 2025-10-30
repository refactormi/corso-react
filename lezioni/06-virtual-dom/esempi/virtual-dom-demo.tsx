/**
 * ⚠️ ATTENZIONE: Questo esempio usa hooks avanzati
 * 
 * Questo esempio usa concetti che saranno spiegati nelle lezioni successive:
 * - useState (Lezione 8)
 * - useEffect (Lezione 12)
 * - useRef (Lezione 13)
 * - memo, useMemo, useCallback (Lezione 14)
 * 
 * Per la Lezione 06, usa 'virtual-dom-concept.tsx' che spiega i concetti
 * del Virtual DOM senza interattività.
 * 
 * Questo file sarà spostato nella Lezione 14 come esempio avanzato.
 */

/*
// Virtual DOM Demo - Esempi pratici del Virtual DOM
// Questo file dimostra come funziona il Virtual DOM in React

import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';

interface RenderTrackerProps {
  name: string;
}

// Componente per tracciare i render
function RenderTracker({ name }: RenderTrackerProps) {
  const renderCount = useRef<number>(0);
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
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  const [renderCount, setRenderCount] = useState<number>(0);
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  const addItem = () => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
  };
  
  const removeItem = (index: number) => {
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
      
      <RenderTracker name="ListUpdateDemo" />
    </div>
  );
}

// ... resto del codice con tipi TypeScript appropriati ...
*/

