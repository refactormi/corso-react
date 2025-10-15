import React from 'react';
import RegistrationForm from './esempi/01-form-registrazione';
import AdvancedSearch from './esempi/02-ricerca-avanzata';
import FeedbackSystem from './esempi/03-sistema-feedback';

/**
 * Demo completa per la Lezione 11: Interazione Utente e Validazione
 * 
 * Questo file dimostra tutti gli esempi della lezione in un'unica pagina
 * per facilitare la comprensione e il testing dell'interazione utente.
 */

function Lezione11Demo() {
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
          backgroundColor: '#dc3545', 
          color: 'white', 
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
            Lezione 11: Interazione Utente e Validazione
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
            Form handling, validazione, feedback visivo e gestione eventi
          </p>
        </div>
        
        {/* Contenuto principale */}
        <div style={{ padding: '40px' }}>
          
          {/* Introduzione */}
          <div style={{ 
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            borderLeft: '4px solid #dc3545'
          }}>
            <h2 style={{ marginTop: 0, color: '#721c24' }}>
              🎯 Obiettivi della Lezione
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Gestire eventi utente in React</li>
              <li>Implementare form handling avanzato</li>
              <li>Creare sistemi di validazione robusti</li>
              <li>Gestire input controllati e non controllati</li>
              <li>Implementare feedback visivo per l'utente</li>
              <li>Gestire stati di loading e errori</li>
              <li>Creare esperienze utente fluide e responsive</li>
            </ul>
          </div>
          
          {/* Esempio 1: Form di Registrazione */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📝 Esempio 1: Form di Registrazione Completo
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Form handling avanzato con validazione in tempo reale, gestione stati di loading 
                e feedback visivo, validazione complessa con regole multiple, gestione errori e successo.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '700px'
            }}>
              <RegistrationForm />
            </div>
          </section>
          
          {/* Esempio 2: Ricerca Avanzata */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🔍 Esempio 2: Ricerca Avanzata con Debouncing
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Input con debouncing per ottimizzare le chiamate API, autocomplete con suggerimenti 
                dinamici, gestione stati di loading e errori, filtri avanzati e ricerca in tempo reale.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden',
              height: '800px'
            }}>
              <AdvancedSearch />
            </div>
          </section>
          
          {/* Esempio 3: Sistema di Feedback */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🔔 Esempio 3: Sistema di Feedback e Notifiche
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Sistema di notifiche con diversi tipi, feedback visivo per azioni utente, gestione 
                stati di loading e progresso, toast notifications e modal di conferma.
              </p>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <FeedbackSystem />
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
              🛠️ Pattern di Interazione Utente
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  📝 Form Handling
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Input controllati vs non controllati</li>
                  <li>Validazione in tempo reale</li>
                  <li>Gestione errori e feedback</li>
                  <li>Stati di loading e successo</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  🔍 Ricerca e Input
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>Debouncing per ottimizzare API</li>
                  <li>Autocomplete con suggerimenti</li>
                  <li>Filtri avanzati</li>
                  <li>Feedback in tempo reale</li>
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
                  <li>Usa input controllati per la maggior parte dei casi</li>
                  <li>Valida in tempo reale per migliorare l'UX</li>
                  <li>Fornisci feedback immediato all'utente</li>
                  <li>Gestisci stati di loading per operazioni asincrone</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                  ❌ Cosa Evitare
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                  <li>Non validare solo al submit</li>
                  <li>Non dimenticare stati di loading</li>
                  <li>Non ignorare la gestione errori</li>
                  <li>Non dimenticare l'accessibilità</li>
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
              Nella prossima lezione esploreremo <strong>useEffect e il ciclo di vita dei componenti</strong>, 
              inclusi side effects, cleanup, dipendenze e pattern avanzati per la gestione degli effetti.
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
            Corso React Base - Lezione 11: Interazione Utente e Validazione
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lezione11Demo;
