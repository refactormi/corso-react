/**
 * Esempio 2: Confronto Context API vs Zustand - Side by Side
 * 
 * COSA DIMOSTRA QUESTO ESEMPIO:
 * ===============================
 * Questo esempio mostra la STESSA funzionalità implementata con:
 * 1. Context API (nativo React)
 * 2. Zustand (libreria esterna)
 * 
 * Confrontiamo:
 * - La quantità di codice necessaria (boilerplate)
 * - Le performance (quanti componenti si ri-renderizzano)
 * - La facilità d'uso
 * 
 * RISULTATO ATTESO:
 * =================
 * Entrambe le implementazioni permettono di cambiare il tema (light/dark),
 * MA con Zustand:
 * - Meno codice da scrivere (nessun Provider)
 * - Migliori performance (solo i componenti che usano theme si ri-renderizzano)
 * - Codice più pulito e leggibile
 */

import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { create } from 'zustand'
import React from 'react'

// ==================== DEFINIZIONE TIPI ====================
/**
 * Definiamo l'interfaccia per lo stato del tema.
 * Entrambe le implementazioni usano la stessa struttura.
 */
interface ThemeState {
  theme: 'light' | 'dark'  // Il tema corrente
  toggleTheme: () => void  // Funzione per cambiare tema
}

// ==================== IMPLEMENTAZIONE CONTEXT API ====================
/**
 * STEP 1: CONTEXT API - Creazione del Context
 * 
 * SPIEGAZIONE:
 * ------------
 * Con Context API dobbiamo:
 * 1. Creare il Context
 * 2. Creare un Provider
 * 3. Creare un hook personalizzato per usare il Context
 * 
 * CODICE NECESSARIO: ~30 righe
 */

// Creiamo il Context (React nativo)
const ThemeContext = createContext<ThemeState | undefined>(undefined)

// Hook personalizzato per usare il Context con type safety
function useThemeContext(): ThemeState {
  const context = useContext(ThemeContext)
  if (!context) {
    // Se il Context non è disponibile, lanciamo un errore
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return context
}

// Provider component - NECESSARIO per Context API
function ThemeProvider({ children }: { children: ReactNode }): React.JSX.Element {
  // Stato locale per il tema
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // useMemo necessario per evitare che l'oggetto value venga ricreato ad ogni render
  // Questo è un'ottimizzazione manuale che DOBBIAMO fare
  const value = useMemo<ThemeState>(
    () => ({
      theme,
      toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }),
    [theme] // Solo quando theme cambia, ricrea l'oggetto
  )
  
  // Provider wrapper - avvolge tutti i componenti che usano il Context
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// ==================== IMPLEMENTAZIONE ZUSTAND ====================
/**
 * STEP 2: ZUSTAND - Creazione dello store
 * 
 * SPIEGAZIONE:
 * ------------
 * Con Zustand dobbiamo SOLO:
 * 1. Creare lo store con create()
 * 
 * CODICE NECESSARIO: ~3 righe!
 * 
 * VANTAGGI:
 * ---------
 * - Nessun Provider necessario
 * - Nessun hook personalizzato necessario
 * - Nessun useMemo necessario (Zustand gestisce tutto automaticamente)
 */
const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}))

// ==================== COMPONENTI CONTEXT API ====================
/**
 * STEP 3: Componenti che usano CONTEXT API
 * 
 * PROBLEMA CON CONTEXT API:
 * -------------------------
 * Quando usi useContext(ThemeContext), ricevi TUTTO l'oggetto value.
 * Questo significa che:
 * - Se usi solo theme, ricevi anche toggleTheme
 * - Se cambi theme, TUTTI i componenti che usano il Context si ri-renderizzano
 * - Anche i componenti che usano solo toggleTheme si ri-renderizzano!
 */

function ContextHeader(): React.JSX.Element {
  // Usiamo useContext che ritorna TUTTO l'oggetto (theme + toggleTheme)
  const { theme } = useThemeContext()
  
  // PROBLEMA: Questo componente si ri-renderizza anche quando toggleTheme cambia
  // (anche se non usa toggleTheme direttamente!)
  console.log('⚠️ ContextHeader renderizzato - anche quando toggleTheme cambia')
  
  return (
    <header style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderBottom: `1px solid ${theme === 'light' ? '#e0e0e0' : '#333333'}`,
      marginBottom: '16px',
      borderRadius: '8px'
    }}>
      <h2 style={{ margin: 0 }}>Header (Context API)</h2>
      <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: theme === 'light' ? '#666' : '#ccc' }}>
        Tema: {theme}
      </p>
    </header>
  )
}

function ContextSidebar(): React.JSX.Element {
  const { theme } = useThemeContext()
  
  // PROBLEMA: Anche questo componente si ri-renderizza quando toggleTheme cambia
  console.log('⚠️ ContextSidebar renderizzato - anche quando toggleTheme cambia')
  
  return (
    <aside style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#2a2a2a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderRadius: '8px',
      marginBottom: '16px'
    }}>
      <h3 style={{ marginTop: 0 }}>Sidebar (Context API)</h3>
      <p style={{ margin: 0, fontSize: '14px' }}>
        ⚠️ Si ri-renderizza anche quando toggleTheme cambia (non usa toggleTheme)
      </p>
    </aside>
  )
}

function ContextButton(): React.JSX.Element {
  const { toggleTheme } = useThemeContext()
  
  // PROBLEMA: Questo componente si ri-renderizza anche quando theme cambia
  // (anche se non usa theme direttamente!)
  console.log('⚠️ ContextButton renderizzato - anche quando theme cambia')
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}
    >
      Toggle Theme (Context API)
    </button>
  )
}

// ==================== COMPONENTI ZUSTAND ====================
/**
 * STEP 4: Componenti che usano ZUSTAND
 * 
 * VANTAGGI CON ZUSTAND:
 * ---------------------
 * Quando usi useThemeStore, puoi selezionare SOLO ciò che ti serve:
 * - Se selezioni solo theme → ricevi solo theme
 * - Se selezioni solo toggleTheme → ricevi solo toggleTheme
 * - I componenti si ri-renderizzano SOLO quando cambia ciò che hanno selezionato!
 */

function ZustandHeader(): React.JSX.Element {
  // Selective subscription: selezioniamo SOLO theme
  // Questo componente si ri-renderizza SOLO quando theme cambia
  const theme = useThemeStore((state) => state.theme)
  
  // VANTAGGIO: Questo log viene stampato SOLO quando theme cambia
  console.log('✅ ZustandHeader renderizzato - SOLO quando theme cambia')
  
  return (
    <header style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderBottom: `1px solid ${theme === 'light' ? '#e0e0e0' : '#333333'}`,
      marginBottom: '16px',
      borderRadius: '8px'
    }}>
      <h2 style={{ margin: 0 }}>Header (Zustand)</h2>
      <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: theme === 'light' ? '#666' : '#ccc' }}>
        Tema: {theme}
      </p>
    </header>
  )
}

function ZustandSidebar(): React.JSX.Element {
  // VANTAGGIO: Questo componente NON usa theme, quindi NON si ri-renderizza quando theme cambia!
  // Questo dimostra la selective subscription funzionante
  
  // Questo log viene stampato SOLO al mount iniziale
  console.log('✅ ZustandSidebar renderizzato - SOLO al mount iniziale (non usa theme)')
  
  return (
    <aside style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '16px'
    }}>
      <h3 style={{ marginTop: 0 }}>Sidebar (Zustand)</h3>
      <p style={{ margin: 0, fontSize: '14px' }}>
        ✅ Questo componente NON si ri-renderizza quando theme cambia perché non usa theme.
        È un esempio di selective subscription funzionante!
      </p>
    </aside>
  )
}

function ZustandButton(): React.JSX.Element {
  // Selective subscription: selezioniamo SOLO toggleTheme
  // Questo componente NON si ri-renderizza quando theme cambia!
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  
  // VANTAGGIO: Questo log viene stampato SOLO al mount iniziale
  console.log('✅ ZustandButton renderizzato - SOLO al mount iniziale (non usa theme)')
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}
    >
      Toggle Theme (Zustand)
    </button>
  )
}

// ==================== COMPONENTE PRINCIPALE ====================
/**
 * STEP 5: Componente principale con confronto side-by-side
 * 
 * COSA VEDRAI:
 * ------------
 * Due colonne affiancate:
 * - Sinistra: Context API (con Provider necessario)
 * - Destra: Zustand (senza Provider)
 * 
 * COME TESTARE:
 * -------------
 * 1. Apri la console del browser (F12)
 * 2. Clicca sui pulsanti "Toggle Theme"
 * 3. Osserva i log nella console:
 *    - Context API: Tutti i componenti si ri-renderizzano ad ogni click
 *    - Zustand: Solo ZustandHeader si ri-renderizza!
 */
function ComparisonDemo(): React.JSX.Element {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginTop: 0 }}>Confronto Context API vs Zustand</h1>
      
      <div style={{
        padding: '16px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ffc107'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 Come Testare</h3>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Apri la console del browser (F12)</li>
          <li>Fai click sui pulsanti "Toggle Theme"</li>
          <li>Osserva i log nella console per vedere quali componenti vengono ri-renderizzati</li>
          <li><strong>Context API:</strong> Tutti i componenti si ri-renderizzano quando theme cambia</li>
          <li><strong>Zustand:</strong> Solo i componenti che usano theme si ri-renderizzano</li>
        </ol>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#856404' }}>
          <strong>Risultato atteso:</strong> Con Zustand vedrai molti meno log nella console,
          dimostrando che solo i componenti necessari si ri-renderizzano!
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Colonna Context API */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px solid #007bff'
        }}>
          <h2 style={{ marginTop: 0, color: '#007bff' }}>Context API</h2>
          
          {/* NOTA: Serve il Provider wrapper! */}
          <ThemeProvider>
            <ContextHeader />
            <ContextSidebar />
            <ContextButton />
          </ThemeProvider>
          
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#e7f3ff',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>⚠️ Problema:</strong> Tutti i componenti si ri-renderizzano quando theme cambia,
            anche quelli che non usano theme direttamente (come ContextButton che usa solo toggleTheme).
          </div>
          
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '13px',
            border: '1px solid #dee2e6'
          }}>
            <strong>Codice necessario:</strong>
            <ul style={{ margin: '8px 0 0 20px', fontSize: '12px' }}>
              <li>createContext()</li>
              <li>useContext() hook</li>
              <li>Provider component</li>
              <li>useMemo per ottimizzazioni</li>
              <li>Hook personalizzato per type safety</li>
            </ul>
          </div>
        </div>
        
        {/* Colonna Zustand */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px solid #28a745'
        }}>
          <h2 style={{ marginTop: 0, color: '#28a745' }}>Zustand</h2>
          
          {/* NOTA: Nessun Provider necessario! */}
          <ZustandHeader />
          <ZustandSidebar />
          <ZustandButton />
          
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#d4edda',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>✅ Vantaggio:</strong> Solo i componenti che usano theme si ri-renderizzano.
            ZustandButton e ZustandSidebar NON si ri-renderizzano quando theme cambia!
          </div>
          
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '13px',
            border: '1px solid #dee2e6'
          }}>
            <strong>Codice necessario:</strong>
            <ul style={{ margin: '8px 0 0 20px', fontSize: '12px' }}>
              <li>create() - solo 3 righe!</li>
              <li>Nessun Provider</li>
              <li>Nessun useMemo</li>
              <li>Selective subscription automatica</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Tabella Confronto */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0 }}>Tabella Confronto Dettagliato</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Caratteristica</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Context API</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Zustand</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}><strong>Provider</strong></td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>✅ Necessario (boilerplate)</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>❌ Non necessario</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}><strong>Selective Subscription</strong></td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>❌ No (tutti i consumer)</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>✅ Sì (automatico)</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}><strong>Re-render</strong></td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>⚠️ Tutti i consumer</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>✅ Solo selezionati</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}><strong>Boilerplate</strong></td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>⚠️ ~30 righe (Provider + Hook)</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>✅ ~3 righe</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}><strong>Performance</strong></td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>⚠️ Richiede ottimizzazioni manuali</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>✅ Ottimale automaticamente</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}><strong>Dipendenza</strong></td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>✅ Nativa React</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>⚠️ Libreria esterna (~1KB)</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}><strong>Middleware</strong></td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>❌ No</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>✅ Persistenza, DevTools</td>
            </tr>
          </tbody>
        </table>
        
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#e7f3ff',
          borderRadius: '8px',
          border: '1px solid #b3d9ff'
        }}>
          <h4 style={{ marginTop: 0 }}>Conclusione</h4>
          <p style={{ margin: '8px 0', fontSize: '14px' }}>
            Zustand è migliore quando:
          </p>
          <ul style={{ margin: '8px 0', fontSize: '14px' }}>
            <li>Hai bisogno di performance ottimali</li>
            <li>Vuoi meno boilerplate</li>
            <li>Hai molti componenti che si ri-renderizzano spesso</li>
            <li>Vuoi middleware come persistenza</li>
          </ul>
          <p style={{ margin: '8px 0', fontSize: '14px' }}>
            Context API è migliore quando:
          </p>
          <ul style={{ margin: '8px 0', fontSize: '14px' }}>
            <li>Vuoi evitare dipendenze esterne</li>
            <li>I dati cambiano raramente</li>
            <li>Preferisci soluzioni native React</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ComparisonDemo
