import React from 'react';
import SimpleCounter from './esempi/01-contatore-semplice';
import TodoList from './esempi/02-lista-todo';
import ContactForm from './esempi/03-form-validazione';

/**
 * Demo completa per la Lezione 8: Componenti Stateless/Stateful e useState
 * 
 * Questo file dimostra tutti gli esempi della lezione in un'unica pagina
 * per facilitare la comprensione e il testing.
 */

function Lezione8Demo() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
            Lezione 8: Componenti Stateless/Stateful e useState
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
            Gestione dello stato in React con l'hook useState
          </p>
        </div>
        
        {/* Contenuto principale */}
        <div style={{ padding: '40px' }}>
          
          {/* Introduzione */}
          <div style={{ 
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            borderLeft: '4px solid #2196f3'
          }}>
            <h2 style={{ marginTop: 0, color: '#1976d2' }}>
              🎯 Obiettivi della Lezione
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Distinguere tra componenti stateless e stateful</li>
              <li>Comprendere il concetto di stato in React</li>
              <li>Utilizzare l'hook useState per gestire lo stato locale</li>
              <li>Implementare aggiornamenti di stato in modo corretto</li>
              <li>Evitare errori comuni nella gestione dello stato</li>
            </ul>
          </div>
          
          {/* Esempio 1: Contatore Semplice */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📊 Esempio 1: Contatore Semplice
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Gestione di stato numerico semplice con operazioni di incremento, 
                decremento e reset. Dimostra l'uso base di useState.
              </p>
            </div>
            <SimpleCounter />
          </section>
          
          {/* Esempio 2: Lista Todo */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                ✅ Esempio 2: Lista Todo
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Gestione di stato complesso con array di oggetti. Include aggiunta, 
                modifica, eliminazione e statistiche in tempo reale.
              </p>
            </div>
            <TodoList />
          </section>
          
          {/* Esempio 3: Form con Validazione */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📝 Esempio 3: Form con Validazione
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Gestione di stato complesso con oggetti, validazione in tempo reale, 
                gestione errori e stati di loading.
              </p>
            </div>
            <ContactForm />
          </section>
          
          {/* Riepilogo */}
          <div style={{ 
            marginTop: '50px',
            padding: '25px',
            backgroundColor: '#d1ecf1',
            borderRadius: '8px',
            border: '1px solid #bee5eb'
          }}>
            <h3 style={{ marginTop: 0, color: '#0c5460' }}>
              📚 Riepilogo della Lezione
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  ✅ Concetti Chiave
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Componenti stateless vs stateful</li>
                  <li>Hook useState per gestione stato</li>
                  <li>Aggiornamenti immutabili</li>
                  <li>Pattern di gestione stato</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  🎯 Best Practices
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Non modificare mai lo stato direttamente</li>
                  <li>Usare aggiornamenti immutabili</li>
                  <li>Raggruppare stato correlato</li>
                  <li>Gestire stati di loading ed errori</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Prossimi Passi */}
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            border: '1px solid #ffeaa7'
          }}>
            <h3 style={{ marginTop: 0, color: '#856404' }}>
              🚀 Prossimi Passi
            </h3>
            <p style={{ margin: 0, color: '#856404' }}>
              Nella prossima lezione esploreremo <strong>tecniche avanzate per la gestione dello stato</strong>, 
              inclusi pattern più complessi e ottimizzazioni per le performance.
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
            Corso React Base - Lezione 8: Componenti Stateless/Stateful e useState
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lezione8Demo;
