import React from 'react';
import RealTimeDashboard from './esempi/01-dashboard-tempo-reale';
import TimerManager from './esempi/02-gestione-timer';
import ThemeManager from './esempi/03-gestione-tema';

/**
 * Demo completa per la Lezione 12: useEffect e Ciclo di Vita
 * 
 * Questo file dimostra tutti gli esempi della lezione in un'unica pagina
 * per facilitare la comprensione e il testing di useEffect e side effects.
 */

function Lezione12Demo() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ 
          backgroundColor: '#17a2b8', 
          color: 'white', 
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
            Lezione 12: useEffect e Ciclo di Vita
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
            Side effects, cleanup, dipendenze e pattern avanzati
          </p>
        </div>
        
        {/* Contenuto principale */}
        <div style={{ padding: '40px' }}>
          
          {/* Introduzione */}
          <div style={{ 
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#d1ecf1',
            borderRadius: '8px',
            borderLeft: '4px solid #17a2b8'
          }}>
            <h2 style={{ marginTop: 0, color: '#0c5460' }}>
              🎯 Obiettivi della Lezione
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Comprendere il concetto di side effects in React</li>
              <li>Utilizzare useEffect per gestire effetti collaterali</li>
              <li>Gestire il ciclo di vita dei componenti funzionali</li>
              <li>Implementare cleanup e prevenire memory leaks</li>
              <li>Gestire dipendenze e ottimizzare le performance</li>
              <li>Utilizzare pattern avanzati con useEffect</li>
              <li>Evitare errori comuni nell'uso di useEffect</li>
            </ul>
          </div>
          
          {/* Esempio 1: Dashboard Tempo Reale */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📊 Esempio 1: Dashboard con Dati in Tempo Reale
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useEffect per gestire connessioni WebSocket, cleanup per prevenire memory leaks, 
                gestione stati di connessione e errori, aggiornamenti in tempo reale.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '700px'
            }}>
              <RealTimeDashboard />
            </div>
          </section>
          
          {/* Esempio 2: Gestione Timer */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                ⏱️ Esempio 2: Gestione Timer e Cronometri
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useEffect per gestire timer e interval, cleanup per prevenire memory leaks, 
                gestione stati complessi con useRef, hook personalizzati per logica riutilizzabile.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '800px'
            }}>
              <TimerManager />
            </div>
          </section>
          
          {/* Esempio 3: Gestione Tema */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🎨 Esempio 3: Gestione Tema e Preferenze Utente
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useEffect per gestire preferenze utente, Context API per stato globale, 
                persistenza con localStorage, gestione eventi del sistema.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '900px'
            }}>
              <ThemeManager />
            </div>
          </section>
          
          {/* Pattern e Tecniche */}
          <div style={{ 
            marginTop: '50px',
            padding: '25px',
            backgroundColor: '#d1ecf1',
            borderRadius: '8px',
            border: '1px solid #bee5eb'
          }}>
            <h3 style={{ marginTop: 0, color: '#0c5460' }}>
              🛠️ Pattern di useEffect
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  🔄 Side Effects
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Chiamate API e fetch dati</li>
                  <li>Sottoscrizioni a eventi</li>
                  <li>Timer e interval</li>
                  <li>Manipolazione del DOM</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  🧹 Cleanup
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Prevenire memory leaks</li>
                  <li>Pulire timer e interval</li>
                  <li>Rimuovere event listeners</li>
                  <li>Annullare richieste HTTP</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Best Practices */}
          <div style={{ 
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            border: '1px solid #ffeaa7'
          }}>
            <h3 style={{ marginTop: 0, color: '#856404' }}>
              ✅ Best Practices
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                  🎯 Cosa Fare
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                  <li>Includi tutte le dipendenze necessarie</li>
                  <li>Implementa cleanup quando necessario</li>
                  <li>Usa useEffect solo per side effects</li>
                  <li>Ottimizza con useCallback e useMemo</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                  ❌ Cosa Evitare
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                  <li>Non dimenticare le dipendenze</li>
                  <li>Non ignorare il cleanup</li>
                  <li>Non usare useEffect per calcoli sincroni</li>
                  <li>Non creare dipendenze eccessive</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Tipi di useEffect */}
          <div style={{ 
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#e2e3e5',
            borderRadius: '8px',
            border: '1px solid #d6d8db'
          }}>
            <h3 style={{ marginTop: 0, color: '#383d41' }}>
              📋 Tipi di useEffect
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Ad Ogni Render</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  useEffect(() =&gt; &#123;...&#125;)
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Si esegue ad ogni render del componente
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Solo al Mount</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  useEffect(() =&gt; &#123;...&#125;, [])
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Si esegue solo quando il componente viene montato
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Con Dipendenze</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  useEffect(() =&gt; &#123;...&#125;, [dep])
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Si esegue quando le dipendenze cambiano
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Con Cleanup</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  useEffect(() =&gt; &#123;<br/>
                  &nbsp;&nbsp;return () =&gt; &#123;...&#125;<br/>
                  &#125;)
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Include una funzione di cleanup
                </p>
              </div>
            </div>
          </div>
          
          {/* Prossimi Passi */}
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#e2e3e5',
            borderRadius: '8px',
            border: '1px solid #d6d8db'
          }}>
            <h3 style={{ marginTop: 0, color: '#383d41' }}>
              🚀 Prossimi Passi
            </h3>
            <p style={{ margin: 0, color: '#383d41' }}>
              Nella prossima lezione esploreremo <strong>useRef e la manipolazione del DOM</strong>, 
              inclusi riferimenti a elementi, valori persistenti e integrazione con librerie esterne.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          textAlign: 'center',
          borderTop: '1px solid #dee2e6'
        }}>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Corso React Base - Lezione 12: useEffect e Ciclo di Vita
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lezione12Demo;
