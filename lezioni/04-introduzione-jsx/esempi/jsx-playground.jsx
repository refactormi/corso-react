// JSX Playground - Esempi pratici di JSX
// Questo file contiene esempi di tutti i concetti JSX appresi

import { useState } from 'react';

// 1. JSX Base - Elementi semplici
function JSXBase() {
  return (
    <div>
      <h1>JSX Base</h1>
      <p>Questo è un paragrafo semplice</p>
      <img src="/logo.png" alt="Logo" width={100} height={50} />
      <br />
      <hr />
    </div>
  );
}

// 2. Espressioni JavaScript in JSX
function JSXExpressions() {
  const name = "Mario";
  const age = 25;
  const isActive = true;
  
  return (
    <div>
      <h2>Espressioni JavaScript</h2>
      <p>Nome: {name}</p>
      <p>Età: {age}</p>
      <p>Prossimo anno: {age + 1}</p>
      <p>Stato: {isActive ? "Attivo" : "Inattivo"}</p>
      <p>Calcolo: {10 + 5 * 2}</p>
    </div>
  );
}

// 3. Attributi e Stili
function JSXAttributes() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  const dynamicStyles = {
    backgroundColor: isHighlighted ? '#ffff00' : '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    transition: 'all 0.3s ease'
  };
  
  return (
    <div>
      <h2>Attributi e Stili</h2>
      
      {/* Attributi standard */}
      <input 
        type="text" 
        placeholder="Inserisci il tuo nome"
        maxLength={50}
        required={true}
        className="input-field"
      />
      
      {/* Stili inline */}
      <div style={dynamicStyles}>
        <p>Elemento con stili dinamici</p>
        <button onClick={() => setIsHighlighted(!isHighlighted)}>
          {isHighlighted ? 'Rimuovi evidenziazione' : 'Evidenzia'}
        </button>
      </div>
      
      {/* Classi condizionali */}
      <div className={`box ${isHighlighted ? 'highlighted' : 'normal'}`}>
        <p>Box con classe condizionale</p>
      </div>
    </div>
  );
}

// 4. Gestione Eventi
function JSXEvents() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  
  const handleClick = () => {
    setCount(count + 1);
  };
  
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };
  
  const handleButtonClick = (buttonName) => {
    alert(`Pulsante ${buttonName} cliccato!`);
  };
  
  return (
    <div>
      <h2>Gestione Eventi</h2>
      
      {/* Evento semplice */}
      <div>
        <p>Contatore: {count}</p>
        <button onClick={handleClick}>
          Incrementa
        </button>
      </div>
      
      {/* Evento con parametri */}
      <div>
        <button onClick={() => handleButtonClick('Primo')}>
          Primo Pulsante
        </button>
        <button onClick={() => handleButtonClick('Secondo')}>
          Secondo Pulsante
        </button>
      </div>
      
      {/* Evento input */}
      <div>
        <input 
          type="text" 
          value={message}
          onChange={handleInputChange}
          placeholder="Digita un messaggio..."
        />
        <p>Messaggio: {message}</p>
      </div>
    </div>
  );
}

// 5. Rendering Condizionale
function JSXConditional() {
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const toggleVisibility = () => setIsVisible(!isVisible);
  
  const loadUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({ name: 'Mario Rossi', email: 'mario@example.com' });
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div>
      <h2>Rendering Condizionale</h2>
      
      {/* Rendering condizionale semplice */}
      <div>
        <button onClick={toggleVisibility}>
          {isVisible ? 'Nascondi' : 'Mostra'} Elemento
        </button>
        {isVisible && <p>Questo elemento è visibile!</p>}
      </div>
      
      {/* Rendering condizionale con null */}
      <div>
        <button onClick={loadUser} disabled={loading}>
          {loading ? 'Caricamento...' : 'Carica Utente'}
        </button>
        {user && (
          <div>
            <p>Nome: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
      
      {/* Operatore ternario */}
      <div>
        <p>Stato: {loading ? 'Caricamento...' : user ? 'Utente caricato' : 'Nessun utente'}</p>
      </div>
    </div>
  );
}

// 6. Rendering di Liste
function JSXLists() {
  const [items, setItems] = useState(['Mela', 'Banana', 'Arancia']);
  const [users, setUsers] = useState([
    { id: 1, name: 'Mario', age: 25, active: true },
    { id: 2, name: 'Luigi', age: 30, active: false },
    { id: 3, name: 'Peach', age: 28, active: true }
  ]);
  
  const addItem = () => {
    const newItem = `Item ${items.length + 1}`;
    setItems([...items, newItem]);
  };
  
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  return (
    <div>
      <h2>Rendering di Liste</h2>
      
      {/* Lista semplice */}
      <div>
        <h3>Lista Semplice</h3>
        <button onClick={addItem}>Aggiungi Item</button>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item}
              <button onClick={() => removeItem(index)}>Rimuovi</button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Lista con oggetti */}
      <div>
        <h3>Lista Utenti</h3>
        <ul>
          {users.map(user => (
            <li key={user.id} className={user.active ? 'active' : 'inactive'}>
              <strong>{user.name}</strong> - {user.age} anni
              {user.active && <span> ✅</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 7. Fragment e JSX Avanzato
function JSXAdvanced() {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <>
      <h2>JSX Avanzato</h2>
      
      {/* Fragment */}
      <div>
        <h3>Fragment</h3>
        <p>Questo contenuto è in un Fragment</p>
        <p>Non ha un elemento wrapper</p>
      </div>
      
      {/* JSX condizionale complesso */}
      <div>
        <h3>JSX Condizionale Complesso</h3>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Nascondi' : 'Mostra'} Dettagli
        </button>
        
        {showDetails && (
          <div>
            <h4>Dettagli</h4>
            <p>Questi sono i dettagli che vengono mostrati condizionalmente.</p>
            <ul>
              <li>Dettaglio 1</li>
              <li>Dettaglio 2</li>
              <li>Dettaglio 3</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* JSX come variabile */}
      <div>
        <h3>JSX come Variabile</h3>
        {(() => {
          const title = <h4>Titolo Dinamico</h4>;
          const content = <p>Contenuto generato dinamicamente</p>;
          
          return (
            <div>
              {title}
              {content}
            </div>
          );
        })()}
      </div>
    </>
  );
}

// Componente principale che combina tutti gli esempi
function JSXPlayground() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎮 JSX Playground</h1>
      <p>Esempi pratici di tutti i concetti JSX</p>
      
      <div style={{ marginBottom: '30px' }}>
        <JSXBase />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <JSXExpressions />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <JSXAttributes />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <JSXEvents />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <JSXConditional />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <JSXLists />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <JSXAdvanced />
      </div>
    </div>
  );
}

export default JSXPlayground;
