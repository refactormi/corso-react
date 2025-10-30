import React from 'react';
import AnalyticsDashboard from './esempi/01-dashboard-analytics';
import VirtualizedListDemo from './esempi/02-lista-virtualizzata';
import AdvancedSearchSystem from './esempi/03-ricerca-avanzata';

/**
 * Demo completa per la Lezione 14: useMemo e useCallback
 * 
 * Questo file dimostra tutti gli esempi della lezione in un'unica pagina
 * per facilitare la comprensione e il testing di useMemo e useCallback.
 */

function Lezione14Demo() {
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
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
            Lezione 14: useMemo e useCallback
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
            Ottimizzazione Performance e Memoizzazione
          </p>
        </div>
        
        {/* Contenuto principale */}
        <div style={{ padding: '40px' }}>
          
          {/* Introduzione */}
          <div style={{ 
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            borderLeft: '4px solid #28a745'
          }}>
            <h2 style={{ marginTop: 0, color: '#155724' }}>
              🎯 Obiettivi della Lezione
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Comprendere il concetto di memoizzazione in React</li>
              <li>Utilizzare useMemo per ottimizzare calcoli costosi</li>
              <li>Utilizzare useCallback per ottimizzare funzioni</li>
              <li>Identificare quando usare memoizzazione</li>
              <li>Evitare over-optimization e anti-patterns</li>
              <li>Misurare e monitorare le performance</li>
              <li>Implementare pattern di ottimizzazione avanzati</li>
              <li>Comprendere il trade-off tra performance e complessità</li>
            </ul>
          </div>
          
          {/* Esempio 1: Dashboard Analytics */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📊 Esempio 1: Dashboard Analytics con Memoizzazione
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useMemo per calcoli costosi di analytics, useCallback per funzioni di callback, 
                React.memo per ottimizzare componenti figli, misurazione delle performance.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '700px'
            }}>
              <AnalyticsDashboard />
            </div>
          </section>
          
          {/* Esempio 2: Lista Virtualizzata */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📋 Esempio 2: Lista Virtualizzata con Memoizzazione
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useMemo per ottimizzare calcoli di virtualizzazione, useCallback per gestire eventi di scroll, 
                React.memo per ottimizzare elementi della lista, gestione performance con liste grandi.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '800px'
            }}>
              <VirtualizedListDemo />
            </div>
          </section>
          
          {/* Esempio 3: Sistema di Ricerca Avanzata */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🔍 Esempio 3: Sistema di Ricerca Avanzata con Memoizzazione
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useMemo per ottimizzare filtri e ricerche complesse, useCallback per gestire eventi di input, 
                debouncing con memoizzazione, cache dei risultati di ricerca.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '900px'
            }}>
              <AdvancedSearchSystem />
            </div>
          </section>
          
          {/* Pattern e Tecniche */}
          <div style={{ 
            marginTop: '50px',
            padding: '25px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            border: '1px solid #c3e6cb'
          }}>
            <h3 style={{ marginTop: 0, color: '#155724' }}>
              🛠️ Pattern di Memoizzazione
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#155724', marginBottom: '10px' }}>
                  🎯 useMemo
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#155724' }}>
                  <li>Calcoli costosi e complessi</li>
                  <li>Filtraggio e ordinamento dati</li>
                  <li>Creazione oggetti complessi</li>
                  <li>Trasformazioni di dati</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#155724', marginBottom: '10px' }}>
                  🔄 useCallback
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#155724' }}>
                  <li>Funzioni passate come props</li>
                  <li>Event handlers</li>
                  <li>Dipendenze di useEffect</li>
                  <li>Callback per componenti figli</li>
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
                  <li>Memoizza calcoli costosi</li>
                  <li>Memoizza funzioni passate come props</li>
                  <li>Usa React.memo per componenti costosi</li>
                  <li>Misura prima di ottimizzare</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                  ❌ Cosa Evitare
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                  <li>Non memoizzare tutto</li>
                  <li>Non dimenticare le dipendenze</li>
                  <li>Non memoizzare valori primitivi</li>
                  <li>Non abusare della memoizzazione</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Tipi di Memoizzazione */}
          <div style={{ 
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#d1ecf1',
            borderRadius: '8px',
            border: '1px solid #bee5eb'
          }}>
            <h3 style={{ marginTop: 0, color: '#0c5460' }}>
              📋 Tipi di Memoizzazione
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>useMemo per Valori</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const result = useMemo(() =&gt; &#123;<br/>
                  &nbsp;&nbsp;return expensiveCalculation(data);<br/>
                  &#125;, [data]);
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Memoizza il risultato di calcoli costosi
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>useCallback per Funzioni</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const callback = useCallback(() =&gt; &#123;<br/>
                  &nbsp;&nbsp;doSomething(a, b);<br/>
                  &#125;, [a, b]);
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Memoizza funzioni per stabilità referenziale
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>React.memo per Componenti</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const MemoComponent = React.memo((&#123;data&#125;) =&gt; &#123;<br/>
                  &nbsp;&nbsp;return &lt;div&gt;&#123;data&#125;&lt;/div&gt;;<br/>
                  &#125;);
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Memoizza componenti per evitare re-render
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Memoizzazione Condizionale</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const result = useMemo(() =&gt; &#123;<br/>
                  &nbsp;&nbsp;if (!shouldMemoize) return data;<br/>
                  &nbsp;&nbsp;return expensiveProcessing(data);<br/>
                  &#125;, [data, shouldMemoize]);
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Memoizza solo quando necessario
                </p>
              </div>
            </div>
          </div>
          
          {/* Performance e Misurazione */}
          <div style={{ 
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            border: '1px solid #f5c6cb'
          }}>
            <h3 style={{ marginTop: 0, color: '#721c24' }}>
              📊 Performance e Misurazione
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>React DevTools Profiler</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Analisi dettagliata delle performance</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>Console Logging</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Monitoraggio render e tempi</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>Performance API</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Misurazione tempi di esecuzione</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>Benchmarking</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Confronto performance</span>
              </div>
            </div>
          </div>
          
          {/* Prossimi Passi */}
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            border: '1px solid #c3e6cb'
          }}>
            <h3 style={{ marginTop: 0, color: '#155724' }}>
              🚀 Prossimi Passi
            </h3>
            <p style={{ margin: 0, color: '#155724' }}>
              Nella prossima lezione esploreremo <strong>Custom Hooks per riutilizzare la logica tra componenti</strong>, 
              inclusi hook personalizzati, composizione di hook e pattern avanzati.
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
            Corso React Base - Lezione 14: useMemo e useCallback
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lezione14Demo;





