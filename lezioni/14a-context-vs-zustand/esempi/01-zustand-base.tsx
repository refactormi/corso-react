/**
 * Esempio 1: Zustand Base - Store Semplice
 * 
 * Questo esempio dimostra come creare e usare uno store Zustand base.
 * 
 * COSA DIMOSTRA QUESTO ESEMPIO:
 * ===============================
 * 1. Come creare uno store Zustand con TypeScript
 * 2. Come definire actions (funzioni) per modificare lo stato
 * 3. Come usare selective subscription (sottoscrizione selettiva)
 * 4. Che NON serve un Provider wrapper (a differenza di Context API)
 * 
 * RISULTATO ATTESO:
 * =================
 * - Un contatore che può essere incrementato, decrementato, resettato
 * - Solo il componente che mostra il valore del contatore si ri-renderizza quando cambia
 * - I pulsanti NON si ri-renderizzano quando il contatore cambia (performance ottimale!)
 */

import { create } from 'zustand'
import { ReactNode } from 'react'
import React from 'react'

// ==================== DEFINIZIONE INTERFACCIA ====================
/**
 * STEP 1: Definiamo l'interfaccia TypeScript dello store
 * 
 * Questa interfaccia descrive:
 * - count: il valore numerico del contatore (stato)
 * - increment: funzione per aumentare il contatore di 1
 * - decrement: funzione per diminuire il contatore di 1
 * - reset: funzione per riportare il contatore a 0
 * - incrementBy: funzione per aumentare il contatore di un valore specifico
 */
interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  incrementBy: (amount: number) => void
}

// ==================== CREAZIONE STORE ====================
/**
 * STEP 2: Creiamo lo store usando create() di Zustand
 * 
 * SPIEGAZIONE PASSO-PASSO:
 * -------------------------
 * 1. create<CounterStore> → Crea uno store con il tipo CounterStore
 * 2. (set) => ({ ... }) → Funzione che riceve "set" per aggiornare lo stato
 * 3. count: 0 → Stato iniziale del contatore
 * 4. increment: () => set(...) → Action che usa set per aggiornare lo stato
 *    - set((state) => ...) → Riceve lo stato corrente e ritorna il nuovo stato
 *    - { count: state.count + 1 } → Nuovo stato con count incrementato
 * 
 * COSA SUCCEDE QUANDO CHIAMI increment():
 * - Zustand prende lo stato corrente (state)
 * - Esegue la funzione che ritorna il nuovo stato
 * - Aggiorna lo store con il nuovo stato
 * - Notifica SOLO i componenti che usano count (selective subscription!)
 */
const useCounterStore = create<CounterStore>((set) => ({
  // Stato iniziale
  count: 0,
  
  // Action per incrementare di 1
  increment: () => set((state) => ({ count: state.count + 1 })),
  
  // Action per decrementare di 1
  decrement: () => set((state) => ({ count: state.count - 1 })),
  
  // Action per resettare a 0
  reset: () => set({ count: 0 }),
  
  // Action per incrementare di un valore specifico
  incrementBy: (amount: number) => set((state) => ({ count: state.count + amount })),
}))

// ==================== COMPONENTE DISPLAY ====================
/**
 * STEP 3: Creiamo un componente che MOSTRA il valore del contatore
 * 
 * COSA DIMOSTRA:
 * --------------
 * Questo componente mostra come usare selective subscription.
 * 
 * SPIEGAZIONE DEL CODICE:
 * -----------------------
 * const count = useCounterStore((state) => state.count)
 * 
 * Questa riga significa:
 * - "Voglio accedere SOLO alla proprietà 'count' dello store"
 * - Quando count cambia, questo componente si ri-renderizza
 * - Quando altre proprietà cambiano (increment, decrement, ecc.), questo componente NON si ri-renderizza
 * 
 * RISULTATO:
 * ----------
 * Questo componente si ri-renderizza SOLO quando count cambia.
 * Puoi verificarlo aprendo la console del browser - vedrai il log "CounterDisplay renderizzato"
 * solo quando il valore del contatore cambia.
 */
function CounterDisplay(): React.JSX.Element {
  // Selective subscription: questo componente si sottoscrive SOLO a count
  // Quando count cambia → questo componente si ri-renderizza
  // Quando altre proprietà cambiano → questo componente NON si ri-renderizza
  const count = useCounterStore((state) => state.count)
  
  // Questo log viene stampato SOLO quando count cambia
  console.log('CounterDisplay renderizzato - count:', count)
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e7f3ff',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '20px'
    }}>
      <h2 style={{ marginTop: 0, fontSize: '3rem', color: '#007bff' }}>
        {count}
      </h2>
      <p style={{ margin: 0, color: '#6c757d' }}>Contatore</p>
    </div>
  )
}

// ==================== COMPONENTE CONTROLS ====================
/**
 * STEP 4: Creiamo un componente con i pulsanti per CONTROLLARE il contatore
 * 
 * COSA DIMOSTRA:
 * --------------
 * Questo componente mostra la MAGIA della selective subscription!
 * 
 * SPIEGAZIONE DEL CODICE:
 * -----------------------
 * const increment = useCounterStore((state) => state.increment)
 * 
 * Questa riga significa:
 * - "Voglio accedere SOLO alla funzione 'increment'"
 * - Questa funzione NON cambia mai (è sempre la stessa funzione)
 * - Quindi questo componente NON si ri-renderizza quando count cambia!
 * 
 * CONFRONTO CON CONTEXT API:
 * --------------------------
 * Con Context API, questo componente si ri-renderizzerebbe ogni volta che count cambia,
 * anche se non usa count direttamente. Con Zustand, questo NON succede!
 * 
 * RISULTATO:
 * ----------
 * Questo componente si ri-renderizza SOLO al mount iniziale.
 * Quando clicchi i pulsanti e count cambia, questo componente NON si ri-renderizza!
 * Puoi verificarlo aprendo la console - vedrai "CounterControls renderizzato" solo una volta all'inizio.
 */
function CounterControls(): React.JSX.Element {
  // Selective subscription: questi componenti accedono SOLO alle funzioni
  // Le funzioni NON cambiano mai → questi componenti NON si ri-renderizzano quando count cambia!
  
  // Prendiamo solo le funzioni dallo store
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)
  const incrementBy = useCounterStore((state) => state.incrementBy)
  
  // Questo log viene stampato SOLO al mount iniziale, NON quando count cambia!
  console.log('CounterControls renderizzato - Ma NON quando count cambia!')
  
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      {/* Pulsante per decrementare */}
      <button
        onClick={decrement}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        -1
      </button>
      
      {/* Pulsante per resettare */}
      <button
        onClick={reset}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Reset
      </button>
      
      {/* Pulsante per incrementare */}
      <button
        onClick={increment}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        +1
      </button>
      
      {/* Pulsante per incrementare di 5 */}
      <button
        onClick={() => incrementBy(5)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        +5
      </button>
      
      {/* Pulsante per incrementare di 10 */}
      <button
        onClick={() => incrementBy(10)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6610f2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        +10
      </button>
    </div>
  )
}

// ==================== COMPONENTE INFO ====================
/**
 * STEP 5: Componente che mostra informazioni sullo store
 * 
 * Questo componente mostra anche informazioni sullo store e dimostra
 * che possiamo leggere lo stato in qualsiasi componente.
 */
function StoreInfo(): React.JSX.Element {
  // Leggiamo count per mostrare il valore attuale
  const count = useCounterStore((state) => state.count)
  
  return (
    <div style={{
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ marginTop: 0 }}>Informazioni Store</h3>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        <li><strong>Valore attuale:</strong> {count}</li>
        <li><strong>Store:</strong> Zustand</li>
        <li><strong>Provider:</strong> Non necessario!</li>
        <li><strong>Selective Subscription:</strong> Attivo</li>
      </ul>
      <p style={{ marginTop: '12px', fontSize: '14px', color: '#6c757d' }}>
        💡 <strong>Tip:</strong> Apri la console del browser (F12) per vedere quando i componenti vengono renderizzati.
        Noterai che CounterControls non si ri-renderizza quando count cambia!
      </p>
    </div>
  )
}

// ==================== COMPONENTE PRINCIPALE ====================
/**
 * STEP 6: Componente principale - NOTA CHE NON SERVE UN PROVIDER!
 * 
 * COSA SUCCEDE:
 * -------------
 * A differenza di Context API, Zustand NON richiede un Provider wrapper.
 * Puoi usare lo store direttamente in qualsiasi componente!
 * 
 * RISULTATO FINALE:
 * -----------------
 * Quando esegui questo esempio:
 * 1. Vedi un contatore visualizzato in grande
 * 2. Hai 5 pulsanti per controllare il contatore
 * 3. Quando clicchi un pulsante:
 *    - CounterDisplay si ri-renderizza (mostra il nuovo valore)
 *    - CounterControls NON si ri-renderizza (i pulsanti rimangono gli stessi)
 * 4. Questo dimostra la selective subscription - performance ottimale!
 */
export default function ZustandBaseExample(): React.JSX.Element {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginTop: 0 }}>Zustand Base Example</h1>
      
      <div style={{
        padding: '16px',
        backgroundColor: '#d1ecf1',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #bee5eb'
      }}>
        <h3 style={{ marginTop: 0 }}>Cosa Vedrai</h3>
        <ul>
          <li>✅ Store semplice e intuitivo - solo poche righe di codice</li>
          <li>✅ Nessun Provider necessario - usa lo store direttamente!</li>
          <li>✅ Selective subscription automatica - solo i componenti necessari si ri-renderizzano</li>
          <li>✅ TypeScript support nativo - type safety completo</li>
          <li>✅ Performance ottimale - i pulsanti non si ri-renderizzano quando count cambia</li>
        </ul>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#0c5460' }}>
          <strong>Prova:</strong> Apri la console (F12) e clicca i pulsanti. Noterai che "CounterControls renderizzato"
          viene loggato solo una volta all'inizio, mentre "CounterDisplay renderizzato" viene loggato ogni volta che count cambia!
        </p>
      </div>
      
      <CounterDisplay />
      <CounterControls />
      <StoreInfo />
    </div>
  )
}
