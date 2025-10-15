import React, { useState } from 'react';

/**
 * Esempio 1: Contatore Semplice
 * 
 * Questo esempio dimostra l'uso base di useState per gestire
 * uno stato numerico semplice con operazioni di incremento,
 * decremento e reset.
 */

function SimpleCounter() {
  // Stato per il conteggio
  const [count, setCount] = useState(0);
  
  // Funzioni per aggiornare lo stato
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '300px',
      margin: '20px auto',
      textAlign: 'center'
    }}>
      <h2>Contatore Semplice</h2>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        margin: '20px 0',
        color: count > 0 ? 'green' : count < 0 ? 'red' : 'black'
      }}>
        {count}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={decrement}
          style={{
            padding: '10px 15px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -1
        </button>
        
        <button 
          onClick={reset}
          style={{
            padding: '10px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
        
        <button 
          onClick={increment}
          style={{
            padding: '10px 15px',
            backgroundColor: '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +1
        </button>
      </div>
      
      <div style={{ 
        marginTop: '15px', 
        fontSize: '0.9rem', 
        color: '#666' 
      }}>
        <p>Stato attuale: {count}</p>
        <p>Il colore cambia in base al valore</p>
      </div>
    </div>
  );
}

export default SimpleCounter;
