import React from 'react'
import Dashboard from './esempi/01-dashboard-condiviso'
import NotificationApp from './esempi/02-sistema-notifiche-context'
import ShoppingCartApp from './esempi/03-carrello-comunicazione'

/**
 * Demo completa per la Lezione 10: Passaggio di Stato tra Componenti
 * 
 * Questo file dimostra tutti gli esempi della lezione in un'unica pagina
 * per facilitare la comprensione e il testing della comunicazione tra componenti.
 */

function Lezione10Demo(): JSX.Element {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    } as React.CSSProperties}>
      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      } as React.CSSProperties}>
        
        {/* Header */}
        <div style={{ 
          backgroundColor: '#6f42c1', 
          color: 'white', 
          padding: '30px',
          textAlign: 'center'
        } as React.CSSProperties}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
            Lezione 10: Passaggio di Stato tra Componenti
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
            Comunicazione tra componenti, lifting state up e Context API
          </p>
        </div>
        
        {/* Contenuto principale */}
        <div style={{ padding: '40px' }}>
          
          {/* Introduzione */}
          <div style={{ 
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#f0e6ff',
            borderRadius: '8px',
            borderLeft: '4px solid #6f42c1'
          }}>
            <h2 style={{ marginTop: 0, color: '#4a148c' }}>
              🎯 Obiettivi della Lezione
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Comprendere il flusso di dati in React (unidirectional data flow)</li>
              <li>Implementare il pattern "lifting state up"</li>
              <li>Gestire la comunicazione tra componenti padre e figlio</li>
              <li>Utilizzare callback functions per aggiornare lo stato del padre</li>
              <li>Implementare pattern di comunicazione tra componenti fratelli</li>
              <li>Gestire stati condivisi tra più componenti</li>
              <li>Evitare prop drilling con pattern alternativi</li>
            </ul>
          </div>
          
          {/* Esempio 1: Dashboard con Stato Condiviso */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📊 Esempio 1: Dashboard con Stato Condiviso
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Lifting state up per condividere stato tra componenti, comunicazione 
                padre-figlio con props e callback, gestione stato complesso condiviso.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '600px'
            }}>
              <Dashboard />
            </div>
          </section>
          
          {/* Esempio 2: Sistema di Notifiche con Context */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🔔 Esempio 2: Sistema di Notifiche con Context API
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Context API per stato globale, comunicazione tra componenti distanti, 
                pattern di provider e consumer, evitare prop drilling.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <NotificationApp />
            </div>
          </section>
          
          {/* Esempio 3: Carrello con Comunicazione */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🛒 Esempio 3: Carrello con Comunicazione tra Componenti
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Comunicazione tra componenti fratelli, stato condiviso nel componente padre, 
                pattern di callback per aggiornamenti, gestione stato complesso distribuito.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '700px'
            }}>
              <ShoppingCartApp />
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
              🛠️ Pattern di Comunicazione
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  📤 Flusso di Dati
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Props down - dati dal padre ai figli</li>
                  <li>Events up - eventi dai figli al padre</li>
                  <li>Lifting state up per stato condiviso</li>
                  <li>Context API per stato globale</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  🔄 Comunicazione
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Callback functions per aggiornamenti</li>
                  <li>Render props per logica condivisa</li>
                  <li>Custom hooks per logica riutilizzabile</li>
                  <li>Event Bus per componenti distanti</li>
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
                  <li>Mantieni lo stato vicino ai componenti che lo usano</li>
                  <li>Usa lifting state up quando necessario</li>
                  <li>Passa callback functions per comunicazione</li>
                  <li>Usa Context API per stato globale</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                  ❌ Cosa Evitare
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                  <li>Non passare troppe props attraverso molti livelli</li>
                  <li>Non duplicare stato in componenti diversi</li>
                  <li>Non usare Context per stato locale</li>
                  <li>Non modificare props direttamente</li>
                </ul>
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
              Nella prossima lezione esploreremo l'<strong>interazione con l'utente</strong> 
              e la gestione degli eventi, inclusi form handling, validazione input e 
              gestione eventi personalizzati.
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
            Corso React Base - Lezione 10: Passaggio di Stato tra Componenti
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lezione10Demo;
