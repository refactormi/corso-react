// Virtual DOM - Dimostrazione Concettuale (Versione Statica)
// Questo file illustra i concetti del Virtual DOM usando esempi statici e visualizzazioni
// Versione semplificata per la Lezione 06 - La versione interattiva sarà nella Lezione 14+

/**
 * CONCETTO: Virtual DOM
 * 
 * Il Virtual DOM è una rappresentazione leggera del DOM reale mantenuta in memoria.
 * React usa il Virtual DOM per ottimizzare gli aggiornamenti al DOM reale.
 * 
 * Processo:
 * 1. React crea un Virtual DOM (oggetto JavaScript)
 * 2. Quando lo stato cambia, React crea un nuovo Virtual DOM
 * 3. React confronta (diffing) il vecchio e il nuovo Virtual DOM
 * 4. React aggiorna solo le parti cambiate nel DOM reale (reconciliation)
 */

interface OldState {
  title: string
  items: string[]
}

interface NewState {
  title: string
  items: string[]
}

// Esempio 1: Visualizzazione del concetto di Virtual DOM
function VirtualDOMConcept() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🌳 Cos'è il Virtual DOM?</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* Virtual DOM */}
        <div style={{ 
          border: '2px solid #61dafb', 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#f0f8ff'
        }}>
          <h3>Virtual DOM (JavaScript)</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`{
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: 'Titolo'
        }
      },
      {
        type: 'p',
        props: {
          children: 'Paragrafo'
        }
      }
    ]
  }
}`}
          </pre>
        </div>
        
        {/* DOM Reale */}
        <div style={{ 
          border: '2px solid #ff6b6b', 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        }}>
          <h3>DOM Reale (Browser)</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`<div class="container">
  <h1>Titolo</h1>
  <p>Paragrafo</p>
</div>`}
          </pre>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fffacd',
        borderRadius: '8px'
      }}>
        <h4>💡 Perché il Virtual DOM?</h4>
        <ul style={{ textAlign: 'left' }}>
          <li><strong>Performance</strong>: Aggiornamenti al DOM sono costosi, il Virtual DOM minimizza questi aggiornamenti</li>
          <li><strong>Batching</strong>: React può raggruppare più aggiornamenti in uno solo</li>
          <li><strong>Diffing Intelligente</strong>: React calcola il modo più efficiente per aggiornare il DOM</li>
        </ul>
      </div>
    </div>
  )
}

// Esempio 2: Processo di Diffing (Visualizzazione Statica)
function DiffingProcess() {
  // Simulazione di due stati diversi
  const oldState: OldState = {
    title: "Titolo Vecchio",
    items: ["Item 1", "Item 2", "Item 3"]
  }
  
  const newState: NewState = {
    title: "Titolo Nuovo",  // Cambiato
    items: ["Item 1", "Item 2", "Item 3", "Item 4"]  // Aggiunto Item 4
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>🔄 Processo di Diffing</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '15px',
        marginTop: '20px'
      }}>
        {/* Stato Vecchio */}
        <div style={{ 
          border: '2px solid #95a5a6', 
          padding: '15px', 
          borderRadius: '8px'
        }}>
          <h4>1️⃣ Virtual DOM Vecchio</h4>
          <div style={{ backgroundColor: '#ecf0f1', padding: '10px', borderRadius: '4px' }}>
            <h3>{oldState.title}</h3>
            <ul>
              {oldState.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Stato Nuovo */}
        <div style={{ 
          border: '2px solid #3498db', 
          padding: '15px', 
          borderRadius: '8px'
        }}>
          <h4>2️⃣ Virtual DOM Nuovo</h4>
          <div style={{ backgroundColor: '#ebf5fb', padding: '10px', borderRadius: '4px' }}>
            <h3 style={{ color: '#e74c3c' }}>{newState.title}</h3>
            <ul>
              {newState.items.map((item, i) => (
                <li key={i} style={{ 
                  color: i === newState.items.length - 1 ? '#e74c3c' : 'inherit'
                }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Differenze */}
        <div style={{ 
          border: '2px solid #27ae60', 
          padding: '15px', 
          borderRadius: '8px'
        }}>
          <h4>3️⃣ Differenze Trovate</h4>
          <div style={{ backgroundColor: '#eafaf1', padding: '10px', borderRadius: '4px' }}>
            <p><strong>Cambiamenti:</strong></p>
            <ul style={{ fontSize: '14px' }}>
              <li style={{ color: '#e74c3c' }}>
                ✏️ Titolo modificato
              </li>
              <li style={{ color: '#27ae60' }}>
                ➕ Item 4 aggiunto
              </li>
            </ul>
            <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '10px' }}>
              React aggiornerà SOLO questi elementi nel DOM reale!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Esempio 3: Reconciliation (Riconciliazione)
function ReconciliationExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>⚡ Reconciliation (Riconciliazione)</h2>
      
      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h3>Algoritmo di Diffing di React</h3>
        
        <div style={{ marginTop: '15px' }}>
          <h4>1. Confronto per Tipo di Elemento</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <code style={{ color: '#e74c3c' }}>
                {'<div>Contenuto</div>'}
              </code>
              <p style={{ fontSize: '12px', marginTop: '5px' }}>⬇️</p>
              <code style={{ color: '#27ae60' }}>
                {'<span>Contenuto</span>'}
              </code>
              <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>
                Tipo diverso → Ricrea elemento
              </p>
            </div>
            
            <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <code>
                {'<div className="old">'}
              </code>
              <p style={{ fontSize: '12px', marginTop: '5px' }}>⬇️</p>
              <code>
                {'<div className="new">'}
              </code>
              <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>
                Stesso tipo → Aggiorna solo attributi
              </p>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h4>2. Importanza delle Keys nelle Liste</h4>
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', marginTop: '10px' }}>
            <p><strong>❌ Senza Key:</strong></p>
            <pre style={{ fontSize: '12px', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
{`// React deve ricreare tutti gli elementi
['A', 'B', 'C'] → ['A', 'B', 'C', 'D']
// Ricrea: A, B, C, D (4 operazioni)`}
            </pre>
            
            <p style={{ marginTop: '15px' }}><strong>✅ Con Key:</strong></p>
            <pre style={{ fontSize: '12px', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
{`// React riconosce gli elementi esistenti
[{key:1, val:'A'}, {key:2, val:'B'}, {key:3, val:'C'}]
→ [{key:1, val:'A'}, {key:2, val:'B'}, {key:3, val:'C'}, {key:4, val:'D'}]
// Crea solo: D (1 operazione)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// Esempio 4: Performance Comparison (Visualizzazione Concettuale)
function PerformanceComparison() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Confronto Performance</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* Senza Virtual DOM */}
        <div style={{ 
          border: '2px solid #e74c3c', 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#fadbd8'
        }}>
          <h3>❌ Senza Virtual DOM</h3>
          <div style={{ marginTop: '10px' }}>
            <p><strong>Processo:</strong></p>
            <ol style={{ fontSize: '14px', textAlign: 'left' }}>
              <li>Stato cambia</li>
              <li>Aggiorna TUTTO il DOM</li>
              <li>Browser ricalcola layout</li>
              <li>Browser ridisegna tutto</li>
            </ol>
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: '#fff', 
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '24px', margin: 0 }}>🐌</p>
              <p style={{ fontSize: '12px', color: '#e74c3c', margin: '5px 0 0 0' }}>
                Lento e inefficiente
              </p>
            </div>
          </div>
        </div>
        
        {/* Con Virtual DOM */}
        <div style={{ 
          border: '2px solid #27ae60', 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#d5f4e6'
        }}>
          <h3>✅ Con Virtual DOM</h3>
          <div style={{ marginTop: '10px' }}>
            <p><strong>Processo:</strong></p>
            <ol style={{ fontSize: '14px', textAlign: 'left' }}>
              <li>Stato cambia</li>
              <li>Crea nuovo Virtual DOM</li>
              <li>Confronta (diffing)</li>
              <li>Aggiorna SOLO le parti cambiate</li>
            </ol>
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: '#fff', 
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '24px', margin: 0 }}>🚀</p>
              <p style={{ fontSize: '12px', color: '#27ae60', margin: '5px 0 0 0' }}>
                Veloce ed efficiente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente Principale
function VirtualDOMDemo() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        padding: '30px', 
        backgroundColor: '#282c34', 
        color: 'white',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>🌳 Virtual DOM - Concetti Fondamentali</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Comprendi come React ottimizza le performance con il Virtual DOM
        </p>
      </div>
      
      {/* Sezione 1: Concetto */}
      <div style={{ marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <VirtualDOMConcept />
      </div>
      
      {/* Sezione 2: Diffing */}
      <div style={{ marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <DiffingProcess />
      </div>
      
      {/* Sezione 3: Reconciliation */}
      <div style={{ marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <ReconciliationExample />
      </div>
      
      {/* Sezione 4: Performance */}
      <div style={{ marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <PerformanceComparison />
      </div>
      
      {/* Note Finali */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#d1ecf1', 
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 Nota per gli Studenti</h3>
        <p>
          Questi esempi mostrano i <strong>concetti</strong> del Virtual DOM in modo statico.
          Nella <strong>Lezione 14</strong> (useMemo e useCallback), vedrai demo interattive 
          che mostrano il Virtual DOM in azione con ottimizzazioni avanzate!
        </p>
        <p style={{ marginBottom: 0, fontSize: '14px', color: '#0c5460' }}>
          Per ora, concentrati sulla comprensione di <strong>COME</strong> e <strong>PERCHÉ</strong> 
          React usa il Virtual DOM per ottimizzare le performance. 🚀
        </p>
      </div>
    </div>
  )
}

export default VirtualDOMDemo

