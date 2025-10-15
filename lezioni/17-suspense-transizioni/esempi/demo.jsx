// Demo completa - Suspense e Transitions
import { useState } from 'react';
import SuspenseBaseExample from './01-suspense-base.jsx';
import TransitionsSearchExample from './02-transitions-search.jsx';
import SuspenseNestedExample from './03-suspense-nested.jsx';

const examples = [
  {
    id: 'suspense-base',
    title: '🎭 Suspense Base',
    description: 'Caricamento dati con fallback personalizzato',
    component: SuspenseBaseExample
  },
  {
    id: 'transitions-search',
    title: '⚡ Transitions per Ricerca',
    description: 'UI reattiva con aggiornamenti urgenti vs non urgenti',
    component: TransitionsSearchExample
  },
  {
    id: 'suspense-nested',
    title: '🏗️ Suspense Nested',
    description: 'Boundary multipli per caricamento granulare',
    component: SuspenseNestedExample
  }
];

export default function SuspenseTransitionsDemo() {
  const [activeExample, setActiveExample] = useState('suspense-base');
  
  const ActiveComponent = examples.find(ex => ex.id === activeExample)?.component;
  
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: 1200,
      margin: '0 auto',
      padding: 20
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: 32,
        padding: 24,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        border: '1px solid #dee2e6'
      }}>
        <h1 style={{ 
          margin: '0 0 12px 0', 
          color: '#212529',
          fontSize: 32,
          fontWeight: 'bold'
        }}>
          🚀 Lezione 16: Suspense e Transitions
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#6c757d',
          fontSize: 18,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Scopri come migliorare l'esperienza utente con caricamenti intelligenti 
          e aggiornamenti non bloccanti
        </p>
      </header>
      
      {/* Navigazione esempi */}
      <nav style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 32,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        border: '1px solid #dee2e6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {examples.map(example => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderRadius: 6,
              backgroundColor: activeExample === example.id ? '#007bff' : '#f8f9fa',
              color: activeExample === example.id ? 'white' : '#495057',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {example.title}
            </div>
            <div style={{ 
              fontSize: 12, 
              opacity: activeExample === example.id ? 0.9 : 0.7 
            }}>
              {example.description}
            </div>
          </button>
        ))}
      </nav>
      
      {/* Contenuto esempio attivo */}
      <main style={{
        backgroundColor: 'white',
        borderRadius: 12,
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {ActiveComponent && <ActiveComponent />}
      </main>
      
      {/* Footer informativo */}
      <footer style={{
        marginTop: 32,
        padding: 20,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#495057' }}>
          🎯 Concetti Chiave Appresi
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16,
          marginTop: 16
        }}>
          <div style={{ 
            padding: 16, 
            backgroundColor: 'white', 
            borderRadius: 6,
            border: '1px solid #dee2e6'
          }}>
            <strong style={{ color: '#007bff' }}>🎭 Suspense</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#6c757d' }}>
              Gestione elegante degli stati di caricamento con fallback personalizzati
            </p>
          </div>
          <div style={{ 
            padding: 16, 
            backgroundColor: 'white', 
            borderRadius: 6,
            border: '1px solid #dee2e6'
          }}>
            <strong style={{ color: '#28a745' }}>⚡ Transitions</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#6c757d' }}>
              UI reattiva distinguendo aggiornamenti urgenti da non urgenti
            </p>
          </div>
          <div style={{ 
            padding: 16, 
            backgroundColor: 'white', 
            borderRadius: 6,
            border: '1px solid #dee2e6'
          }}>
            <strong style={{ color: '#ffc107' }}>🏗️ Architettura</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#6c757d' }}>
              Boundary multipli per caricamento granulare e resiliente
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
