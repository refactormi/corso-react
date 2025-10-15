import React from 'react';
import AdvancedTextEditor from './esempi/01-editor-testo-avanzato';
import InteractiveImageGalleryDemo from './esempi/02-galleria-immagini-interattiva';
import VideoPlayerDemo from './esempi/03-player-video-personalizzato';

/**
 * Demo completa per la Lezione 13: useRef e Manipolazione DOM
 * 
 * Questo file dimostra tutti gli esempi della lezione in un'unica pagina
 * per facilitare la comprensione e il testing di useRef e manipolazione DOM.
 */

function Lezione13Demo() {
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
          backgroundColor: '#6f42c1', 
          color: 'white', 
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
            Lezione 13: useRef e Manipolazione DOM
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
            Riferimenti DOM, manipolazione diretta e integrazione librerie esterne
          </p>
        </div>
        
        {/* Contenuto principale */}
        <div style={{ padding: '40px' }}>
          
          {/* Introduzione */}
          <div style={{ 
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#e2e3e5',
            borderRadius: '8px',
            borderLeft: '4px solid #6f42c1'
          }}>
            <h2 style={{ marginTop: 0, color: '#383d41' }}>
              🎯 Obiettivi della Lezione
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Comprendere il concetto di useRef e riferimenti</li>
              <li>Utilizzare useRef per accedere agli elementi DOM</li>
              <li>Gestire valori persistenti tra i render</li>
              <li>Integrare librerie esterne con React</li>
              <li>Manipolare il DOM direttamente quando necessario</li>
              <li>Gestire focus e input programmaticamente</li>
              <li>Evitare errori comuni nell'uso di useRef</li>
              <li>Ottimizzare le performance con useRef</li>
            </ul>
          </div>
          
          {/* Esempio 1: Editor di Testo Avanzato */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📝 Esempio 1: Editor di Testo Avanzato
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useRef per accesso diretto agli elementi DOM, manipolazione del cursore e selezione, 
                gestione focus e input programmatico, integrazione con API del browser.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '700px'
            }}>
              <AdvancedTextEditor />
            </div>
          </section>
          
          {/* Esempio 2: Galleria Immagini Interattiva */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🖼️ Esempio 2: Galleria Immagini Interattiva
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useRef per gestire elementi DOM complessi, Intersection Observer per lazy loading, 
                gestione eventi mouse e touch, manipolazione DOM per animazioni.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '800px'
            }}>
              <InteractiveImageGalleryDemo />
            </div>
          </section>
          
          {/* Esempio 3: Player Video Personalizzato */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🎬 Esempio 3: Player Video Personalizzato
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                useRef per controllare elementi video HTML5, gestione eventi video e timeline, 
                controlli personalizzati e keyboard shortcuts, gestione fullscreen.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '600px'
            }}>
              <VideoPlayerDemo />
            </div>
          </section>
          
          {/* Pattern e Tecniche */}
          <div style={{ 
            marginTop: '50px',
            padding: '25px',
            backgroundColor: '#e2e3e5',
            borderRadius: '8px',
            border: '1px solid #d6d8db'
          }}>
            <h3 style={{ marginTop: 0, color: '#383d41' }}>
              🛠️ Pattern di useRef
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#383d41', marginBottom: '10px' }}>
                  🎯 Riferimenti DOM
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#383d41' }}>
                  <li>Accesso diretto agli elementi</li>
                  <li>Manipolazione proprietà e stili</li>
                  <li>Gestione focus e selezione</li>
                  <li>Controllo eventi nativi</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#383d41', marginBottom: '10px' }}>
                  💾 Valori Persistenti
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#383d41' }}>
                  <li>Timer e interval</li>
                  <li>Valori tra render</li>
                  <li>Cache e memoizzazione</li>
                  <li>Stati non reattivi</li>
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
                  <li>Controlla sempre se ref.current esiste</li>
                  <li>Usa useRef per valori non reattivi</li>
                  <li>Pulisci i ref nei cleanup</li>
                  <li>Usa forwardRef per componenti riutilizzabili</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                  ❌ Cosa Evitare
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                  <li>Non accedere a ref prima dell'assegnazione</li>
                  <li>Non usare ref per valori reattivi</li>
                  <li>Non dimenticare il cleanup</li>
                  <li>Non abusare della manipolazione DOM</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Tipi di useRef */}
          <div style={{ 
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#d1ecf1',
            borderRadius: '8px',
            border: '1px solid #bee5eb'
          }}>
            <h3 style={{ marginTop: 0, color: '#0c5460' }}>
              📋 Tipi di useRef
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Ref per Elementi DOM</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const inputRef = useRef(null);<br/>
                  &lt;input ref={inputRef} /&gt;
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Accesso diretto agli elementi del DOM
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Ref per Valori</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const countRef = useRef(0);<br/>
                  countRef.current += 1;
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Valori persistenti tra i render
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Ref per Timer</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const timerRef = useRef(null);<br/>
                  timerRef.current = setInterval(...)
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Gestione timer e interval
                </p>
              </div>
              
              <div style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Forwarding Refs</h4>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  const CustomInput = forwardRef((props, ref) =&gt; &#123;<br/>
                  &nbsp;&nbsp;return &lt;input ref={ref} /&gt;;<br/>
                  &#125;);
                </code>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Passaggio di ref tra componenti
                </p>
              </div>
            </div>
          </div>
          
          {/* Integrazione Librerie Esterne */}
          <div style={{ 
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            border: '1px solid #f5c6cb'
          }}>
            <h3 style={{ marginTop: 0, color: '#721c24' }}>
              🔌 Integrazione Librerie Esterne
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>Chart.js</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Grafici e visualizzazioni</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>D3.js</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Visualizzazioni dati avanzate</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>Leaflet</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Mappe interattive</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <strong>Three.js</strong><br/>
                <span style={{ fontSize: '12px', color: '#666' }}>Grafica 3D</span>
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
              Nella prossima lezione esploreremo <strong>useMemo e useCallback per l'ottimizzazione delle performance</strong>, 
              inclusi memoizzazione, ottimizzazione re-render e pattern di performance.
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
            Corso React Base - Lezione 13: useRef e Manipolazione DOM
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lezione13Demo;
