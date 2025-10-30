// Demo completa - Introduzione React Query
import { useState } from 'react';
import BasicQueryExample from './01-basic-query';
import MutationsCRUDExample from './02-mutations-crud';
import AdvancedPatternsExample from './03-advanced-patterns';

const examples = [
  {
    id: 'basic-query',
    title: '🔍 Basic useQuery',
    description: 'Fondamenti di React Query: useQuery, cache, loading states e query dipendenti',
    component: BasicQueryExample,
    difficulty: 'Principiante',
    features: ['useQuery Base', 'Cache Automatica', 'Error Handling', 'Refetch Manual', 'Query Dipendenti']
  },
  {
    id: 'mutations-crud',
    title: '✏️ Mutations e CRUD',
    description: 'Operazioni di scrittura con useMutation, optimistic updates e gestione errori',
    component: MutationsCRUDExample,
    difficulty: 'Intermedio',
    features: ['useMutation', 'CRUD Operations', 'Optimistic Updates', 'Cache Invalidation', 'Error Recovery']
  },
  {
    id: 'advanced-patterns',
    title: '🚀 Pattern Avanzati',
    description: 'Paginazione, ricerca, prefetch intelligente e ottimizzazioni performance',
    component: AdvancedPatternsExample,
    difficulty: 'Avanzato',
    features: ['Pagination', 'Search + Debouncing', 'Smart Prefetch', 'Cache Strategy', 'UX Optimization']
  }
];

function ExampleCard({ example, isActive, onClick }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Principiante': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      case 'Intermedio': return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
      case 'Avanzato': return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };
      default: return { bg: '#e2e3e5', color: '#383d41', border: '#d6d8db' };
    }
  };
  
  const difficultyStyle = getDifficultyColor(example.difficulty);
  
  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${isActive ? '#007bff' : '#dee2e6'}`,
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        backgroundColor: isActive ? '#f8f9fa' : 'white',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 4px 16px rgba(0,123,255,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
        transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: isActive ? '#007bff' : '#333', fontSize: 18 }}>
          {example.title}
        </h3>
        <span style={{
          padding: '4px 12px',
          borderRadius: 16,
          fontSize: 12,
          fontWeight: 'bold',
          backgroundColor: difficultyStyle.bg,
          color: difficultyStyle.color,
          border: `1px solid ${difficultyStyle.border}`
        }}>
          {example.difficulty}
        </span>
      </div>
      
      <p style={{ 
        margin: '0 0 16px 0', 
        color: '#666', 
        fontSize: 14,
        lineHeight: 1.5
      }}>
        {example.description}
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {example.features.map(feature => (
          <span key={feature} style={{
            padding: '3px 8px',
            backgroundColor: isActive ? '#007bff' : '#e9ecef',
            color: isActive ? 'white' : '#6c757d',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: '500'
          }}>
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8,
      marginBottom: 24
    }}>
      <span style={{ fontSize: 14, color: '#6c757d', fontWeight: '500' }}>
        Progresso:
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: i < currentStep ? '#28a745' : i === currentStep ? '#007bff' : '#dee2e6',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>
      <span style={{ fontSize: 14, color: '#6c757d' }}>
        {currentStep + 1} di {totalSteps}
      </span>
    </div>
  );
}

export default function ReactQueryDemo() {
  const [activeExample, setActiveExample] = useState('basic-query');
  
  const ActiveComponent = examples.find(ex => ex.id === activeExample)?.component;
  const activeExampleData = examples.find(ex => ex.id === activeExample);
  const currentIndex = examples.findIndex(ex => ex.id === activeExample);
  
  const navigateToNext = () => {
    const nextIndex = (currentIndex + 1) % examples.length;
    setActiveExample(examples[nextIndex].id);
  };
  
  const navigateToPrev = () => {
    const prevIndex = currentIndex === 0 ? examples.length - 1 : currentIndex - 1;
    setActiveExample(examples[prevIndex].id);
  };
  
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
        marginBottom: 40,
        padding: 40,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 20,
        color: 'white'
      }}>
        <h1 style={{ 
          margin: '0 0 16px 0', 
          fontSize: 42,
          fontWeight: 'bold'
        }}>
          ⚡ Lezione 16: Introduzione React Query
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: 20,
          opacity: 0.9,
          maxWidth: 800,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Scopri la potenza di React Query per la gestione dello stato server: 
          cache intelligente, sincronizzazione automatica e UX ottimizzata
        </p>
      </header>
      
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentIndex} totalSteps={examples.length} />
      
      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 32
      }}>
        <button
          onClick={navigateToPrev}
          style={{
            padding: '12px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: '500'
          }}
        >
          ← Precedente
        </button>
        
        <h2 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: 24,
          textAlign: 'center'
        }}>
          📚 Seleziona un Esempio da Esplorare
        </h2>
        
        <button
          onClick={navigateToNext}
          style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: '500'
          }}
        >
          Successivo →
        </button>
      </div>
      
      {/* Selezione esempi */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: 20
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
        borderRadius: 20,
        border: '1px solid #dee2e6',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header esempio */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: 20 }}>
                {activeExampleData?.title}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                {activeExampleData?.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                padding: '6px 16px',
                backgroundColor: activeExampleData?.difficulty === 'Avanzato' ? '#dc3545' : 
                                activeExampleData?.difficulty === 'Intermedio' ? '#ffc107' : '#28a745',
                color: activeExampleData?.difficulty === 'Avanzato' ? 'white' : 
                       activeExampleData?.difficulty === 'Intermedio' ? '#212529' : 'white',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 'bold',
                marginBottom: 8
              }}>
                {activeExampleData?.difficulty}
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
        marginTop: 40,
        padding: 32,
        backgroundColor: '#e9ecef',
        borderRadius: 16
      }}>
        <h3 style={{ margin: '0 0 24px 0', color: '#495057', textAlign: 'center', fontSize: 24 }}>
          🎯 Concetti Fondamentali di React Query
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24
        }}>
          <div style={{ 
            padding: 24, 
            backgroundColor: 'white', 
            borderRadius: 12,
            border: '1px solid #dee2e6',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#007bff', fontSize: 18 }}>
              🔍 Data Fetching
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#6c757d', lineHeight: 1.6 }}>
              <li>useQuery per caricamento dati</li>
              <li>Stati automatici (loading, error, success)</li>
              <li>Cache intelligente e condivisione</li>
              <li>Background updates e refetch</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: 24, 
            backgroundColor: 'white', 
            borderRadius: 12,
            border: '1px solid #dee2e6',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#28a745', fontSize: 18 }}>
              ✏️ Mutations
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#6c757d', lineHeight: 1.6 }}>
              <li>useMutation per operazioni di scrittura</li>
              <li>Optimistic updates per UX fluida</li>
              <li>Rollback automatico su errori</li>
              <li>Cache invalidation intelligente</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: 24, 
            backgroundColor: 'white', 
            borderRadius: 12,
            border: '1px solid #dee2e6',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#ffc107', fontSize: 18 }}>
              🚀 Performance
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#6c757d', lineHeight: 1.6 }}>
              <li>Prefetch strategico e intelligente</li>
              <li>Deduplication delle richieste</li>
              <li>Paginazione con keepPreviousData</li>
              <li>Debouncing per ricerche ottimizzate</li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          backgroundColor: '#d1ecf1',
          borderRadius: 12,
          border: '1px solid #bee5eb',
          textAlign: 'center'
        }}>
          <strong style={{ color: '#0c5460', fontSize: 16 }}>
            💡 Prossimi Step: Lezione 16a - Cache Avanzata e Ottimizzazioni per padroneggiare React Query
          </strong>
        </div>
      </footer>
    </div>
  );
}
