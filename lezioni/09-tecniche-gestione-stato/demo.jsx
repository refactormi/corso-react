import React from 'react';
import AdvancedShoppingCart from './esempi/01-shopping-cart-avanzato';
import AdvancedForm from './esempi/02-form-validazione-avanzata';
import SearchWithCache from './esempi/03-ricerca-con-cache';

/**
 * Demo completa per la Lezione 9: Tecniche Avanzate di Gestione Stato
 * 
 * Questo file dimostra tutti gli esempi della lezione in un'unica pagina
 * per facilitare la comprensione e il testing delle tecniche avanzate.
 */

function Lezione9Demo() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
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
            Lezione 9: Tecniche Avanzate di Gestione Stato
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
            Pattern avanzati, ottimizzazioni e gestione stati complessi
          </p>
        </div>
        
        {/* Contenuto principale */}
        <div style={{ padding: '40px' }}>
          
          {/* Introduzione */}
          <div style={{ 
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            borderLeft: '4px solid #28a745'
          }}>
            <h2 style={{ marginTop: 0, color: '#155724' }}>
              🎯 Obiettivi della Lezione
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Utilizzare tecniche avanzate per la gestione dello stato</li>
              <li>Implementare pattern di stato complessi e scalabili</li>
              <li>Gestire stati derivati e calcolati</li>
              <li>Ottimizzare le performance con tecniche di memoizzazione</li>
              <li>Implementare pattern di stato immutabile avanzati</li>
              <li>Gestire stati asincroni e side effects</li>
            </ul>
          </div>
          
          {/* Esempio 1: Shopping Cart Avanzato */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🛒 Esempio 1: Shopping Cart Avanzato con useReducer
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Gestione stato complesso con useReducer, pattern di azioni, stati derivati 
                calcolati e ottimizzazioni con useMemo e useCallback.
              </p>
            </div>
            <AdvancedShoppingCart />
          </section>
          
          {/* Esempio 2: Form con Validazione Avanzata */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📝 Esempio 2: Form con Validazione Avanzata
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Hook personalizzato per validazione, gestione stato complesso con oggetti 
                annidati, validazione in tempo reale e pattern di aggiornamento immutabile.
              </p>
            </div>
            <AdvancedForm />
          </section>
          
          {/* Esempio 3: Ricerca con Cache */}
          <section style={{ marginBottom: '50px' }}>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🔍 Esempio 3: Ricerca con Cache e Debouncing
              </h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Gestione stati asincroni, pattern di cache per ottimizzazione, debouncing 
                per ridurre chiamate API e gestione stati di loading ed errori.
              </p>
            </div>
            <SearchWithCache />
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
              🛠️ Pattern e Tecniche Avanzate
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  🔧 Pattern di Stato
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>useReducer per logica complessa</li>
                  <li>Stati raggruppati vs separati</li>
                  <li>Stati derivati e calcolati</li>
                  <li>Pattern immutabili avanzati</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0c5460', marginBottom: '10px' }}>
                  ⚡ Ottimizzazioni
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                  <li>useMemo per calcoli costosi</li>
                  <li>useCallback per funzioni</li>
                  <li>Cache per dati asincroni</li>
                  <li>Debouncing per performance</li>
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
                  <li>Raggruppa stato correlato</li>
                  <li>Usa stati derivati</li>
                  <li>Memoizza calcoli costosi</li>
                  <li>Gestisci stati asincroni</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                  ❌ Cosa Evitare
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
                  <li>Non duplicare stato</li>
                  <li>Non aggiornare direttamente</li>
                  <li>Non ignorare performance</li>
                  <li>Non dimenticare cleanup</li>
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
              Nella prossima lezione esploreremo il <strong>passaggio di stato tra componenti</strong> 
              e la comunicazione tra componenti, inclusi pattern di lifting state up e 
              gestione di stato condiviso.
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
            Corso React Base - Lezione 9: Tecniche Avanzate di Gestione Stato
          </p>
        </div>
      </div>
    </div>
  );
}

export default Lezione9Demo;
