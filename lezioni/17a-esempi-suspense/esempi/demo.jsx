// Demo completa - Esempi Pratici di Suspense
import { useState } from 'react';
import ErrorBoundarySuspenseExample from './01-error-boundary-suspense.jsx';
import LazyRoutingPreloadExample from './02-lazy-routing-preload.jsx';
import ProgressiveLoadingExample from './03-progressive-loading.jsx';

const examples = [
  {
    id: 'error-boundary',
    title: '🚨 Error Boundary + Suspense',
    description: 'Gestione avanzata di errori con retry logic e fallback graceful',
    component: ErrorBoundarySuspenseExample,
    complexity: 'Avanzato',
    features: ['Error Recovery', 'Retry Logic', 'Logging', 'Fallback UI']
  },
  {
    id: 'lazy-routing',
    title: '🚀 Lazy Routing + Preload',
    description: 'Navigazione ottimizzata con preload intelligente e cache',
    component: LazyRoutingPreloadExample,
    complexity: 'Intermedio',
    features: ['Code Splitting', 'Preload Strategy', 'Route Cache', 'Custom Skeletons']
  },
  {
    id: 'progressive-loading',
    title: '📈 Progressive Loading',
    description: 'Caricamento a priorità per UX ottimale',
    component: ProgressiveLoadingExample,
    complexity: 'Avanzato',
    features: ['Priority Loading', 'Phased Rendering', 'Smart Skeletons', 'Performance']
  }
];

function ExampleCard({ example, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${isActive ? '#007bff' : '#dee2e6'}`,
        borderRadius: 8,
        padding: 16,
        cursor: 'pointer',
        backgroundColor: isActive ? '#f8f9fa' : 'white',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 2px 8px rgba(0,123,255,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: isActive ? '#007bff' : '#333' }}>
          {example.title}
        </h3>
        <span style={{
          padding: '2px 8px',
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 'bold',
          backgroundColor: example.complexity === 'Avanzato' ? '#dc3545' : 
                          example.complexity === 'Intermedio' ? '#ffc107' : '#28a745',
          color: example.complexity === 'Avanzato' ? 'white' : 
                 example.complexity === 'Intermedio' ? '#212529' : 'white'
        }}>
          {example.complexity}
        </span>
      </div>
      
      <p style={{ 
        margin: '0 0 12px 0', 
        color: '#666', 
        fontSize: 14,
        lineHeight: 1.4
      }}>
        {example.description}
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {example.features.map(feature => (
          <span key={feature} style={{
            padding: '2px 6px',
            backgroundColor: isActive ? '#007bff' : '#e9ecef',
            color: isActive ? 'white' : '#6c757d',
            borderRadius: 4,
            fontSize: 11
          }}>
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SuspenseAdvancedDemo() {
  const [activeExample, setActiveExample] = useState('error-boundary');
  
  const ActiveComponent = examples.find(ex => ex.id === activeExample)?.component;
  const activeExampleData = examples.find(ex => ex.id === activeExample);
  
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: 1400,
      margin: '0 auto',
      padding: 20
    }}>
      {/* Header */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: 32,
        padding: 32,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        color: 'white'
      }}>
        <h1 style={{ 
          margin: '0 0 16px 0', 
          fontSize: 36,
          fontWeight: 'bold'
        }}>
          🎭 Lezione 16a: Esempi Pratici di Suspense
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: 18,
          opacity: 0.9,
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Pattern avanzati, gestione errori, ottimizzazioni performance e casi d'uso reali 
          per implementazioni Suspense di livello professionale
        </p>
      </header>
      
      {/* Selezione esempi */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: '#333',
          fontSize: 24
        }}>
          📚 Seleziona un Esempio
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 16
        }}>
          {examples.map(example => (
            <ExampleCard
              key={example.id}
              example={example}
              isActive={activeExample === example.id}
              onClick={() => setActiveExample(example.id)}
            />
          ))}
        </div>
      </section>
      
      {/* Contenuto esempio attivo */}
      <main style={{
        backgroundColor: 'white',
        borderRadius: 16,
        border: '1px solid #dee2e6',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header esempio */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
                {activeExampleData?.title}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                {activeExampleData?.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                padding: '4px 12px',
                backgroundColor: activeExampleData?.complexity === 'Avanzato' ? '#dc3545' : 
                                activeExampleData?.complexity === 'Intermedio' ? '#ffc107' : '#28a745',
                color: activeExampleData?.complexity === 'Avanzato' ? 'white' : 
                       activeExampleData?.complexity === 'Intermedio' ? '#212529' : 'white',
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 'bold',
                marginBottom: 8
              }}>
                {activeExampleData?.complexity}
              </div>
              <div style={{ fontSize: 12, color: '#6c757d' }}>
                {activeExampleData?.features.length} funzionalità
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenuto */}
        <div>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>
      
      {/* Riepilogo concetti */}
      <footer style={{
        marginTop: 32,
        padding: 24,
        backgroundColor: '#e9ecef',
        borderRadius: 12
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#495057', textAlign: 'center' }}>
          🎯 Concetti Avanzati Appresi
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20
        }}>
          <div style={{ 
            padding: 20, 
            backgroundColor: 'white', 
            borderRadius: 8,
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#dc3545' }}>
              🚨 Error Handling
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#6c757d' }}>
              <li>Error Boundaries personalizzati</li>
              <li>Retry logic avanzato</li>
              <li>Fallback graceful</li>
              <li>Logging e monitoraggio</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: 20, 
            backgroundColor: 'white', 
            borderRadius: 8,
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#007bff' }}>
              🚀 Performance
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#6c757d' }}>
              <li>Code splitting intelligente</li>
              <li>Preload strategico</li>
              <li>Cache dei componenti</li>
              <li>Progressive loading</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: 20, 
            backgroundColor: 'white', 
            borderRadius: 8,
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#28a745' }}>
              🎨 UX Design
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#6c757d' }}>
              <li>Skeleton personalizzati</li>
              <li>Feedback visivo</li>
              <li>Caricamento a priorità</li>
              <li>Transizioni fluide</li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          backgroundColor: '#d1ecf1',
          borderRadius: 8,
          border: '1px solid #bee5eb',
          textAlign: 'center'
        }}>
          <strong style={{ color: '#0c5460' }}>
            💡 Prossimo Step: Lezione 17 - React Query per gestione avanzata dello stato server
          </strong>
        </div>
      </footer>
    </div>
  );
}
