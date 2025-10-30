// Demo16a - Esempi Pratici di Suspense per il playground
import { Suspense, Component, useState, lazy, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  retryCount: number
}

// Error Boundary semplificato per il playground
class SimpleErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      retryCount: prevState.retryCount + 1
    }));
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          border: '2px solid #dc3545',
          borderRadius: 8,
          padding: 16,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          textAlign: 'center'
        }}>
          <h4>⚠️ Errore nel Caricamento</h4>
          <p>Si è verificato un errore durante il caricamento del componente.</p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            🔄 Riprova ({this.state.retryCount}/3)
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

interface ResourceData {
  message: string
  timestamp: number
}

interface Resource {
  read: () => ResourceData
}

// Simulazione risorsa che può fallire
function createUnreliableResource(successRate: number = 0.8): Resource {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: ResourceData | Error;
  
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        status = 'success';
        result = { message: 'Dati caricati con successo!', timestamp: Date.now() };
        resolve(result);
      } else {
        status = 'error';
        result = new Error('Errore simulato');
        reject(result);
      }
    }, 1500);
  });
  
  return {
    read() {
      if (status === 'pending') throw promise;
      if (status === 'error') throw result;
      return result;
    }
  };
}

// Componente che può fallire
interface UnreliableComponentProps {
  successRate: number
}

function UnreliableComponent({ successRate }: UnreliableComponentProps): JSX.Element {
  const [resource] = useState<Resource>(() => createUnreliableResource(successRate));
  const data = resource.read();
  
  return (
    <div style={{
      border: '2px solid #28a745',
      borderRadius: 8,
      padding: 16,
      backgroundColor: '#d4edda',
      color: '#155724'
    }}>
      <h4>✅ Caricamento Riuscito!</h4>
      <p>{data.message}</p>
      <small>Timestamp: {new Date(data.timestamp).toLocaleString()}</small>
    </div>
  );
}

// Demo Error Boundary
function ErrorBoundaryDemo(): JSX.Element {
  const [successRate, setSuccessRate] = useState<number>(0.7);
  const [key, setKey] = useState<number>(0);
  
  return (
    <div style={{ marginBottom: 32 }}>
      <h3>🚨 Error Boundary + Suspense</h3>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Tasso di Successo: {Math.round(successRate * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={successRate}
          onChange={(e) => setSuccessRate(parseFloat(e.target.value))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button
          onClick={() => setKey(prev => prev + 1)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          🎲 Nuova Simulazione
        </button>
      </div>
      
      <SimpleErrorBoundary>
        <Suspense fallback={
          <div style={{
            border: '2px solid #dee2e6',
            borderRadius: 8,
            padding: 16,
            backgroundColor: '#f8f9fa',
            textAlign: 'center'
          }}>
            <div>Caricamento in corso...</div>
            <div style={{ 
              width: 40, 
              height: 40, 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '16px auto'
            }} />
          </div>
        }>
          <UnreliableComponent key={key} successRate={successRate} />
        </Suspense>
      </SimpleErrorBoundary>
    </div>
  );
}

// Simulazione componenti lazy
const LazyComponentA = lazy(() => 
  new Promise(resolve => 
    setTimeout(() => resolve({
      default: () => (
        <div style={{ padding: 16, backgroundColor: '#d4edda', borderRadius: 8 }}>
          <h4>📄 Componente A</h4>
          <p>Questo è il componente A caricato dinamicamente.</p>
        </div>
      )
    }), 1000)
  )
);

const LazyComponentB = lazy(() => 
  new Promise(resolve => 
    setTimeout(() => resolve({
      default: () => (
        <div style={{ padding: 16, backgroundColor: '#cce5ff', borderRadius: 8 }}>
          <h4>📊 Componente B</h4>
          <p>Questo è il componente B con caricamento più lento.</p>
        </div>
      )
    }), 2000)
  )
);

// Demo Lazy Loading
function LazyLoadingDemo(): JSX.Element {
  const [activeComponent, setActiveComponent] = useState<'A' | 'B' | null>(null);
  
  const components = {
    A: LazyComponentA,
    B: LazyComponentB
  };
  
  const ActiveComponent = activeComponent ? components[activeComponent] : null;
  
  return (
    <div style={{ marginBottom: 32 }}>
      <h3>🚀 Lazy Loading Componenti</h3>
      
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setActiveComponent('A')}
          style={{
            padding: '8px 12px',
            backgroundColor: activeComponent === 'A' ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginRight: 8
          }}
        >
          Carica Componente A (1s)
        </button>
        <button
          onClick={() => setActiveComponent('B')}
          style={{
            padding: '8px 12px',
            backgroundColor: activeComponent === 'B' ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginRight: 8
          }}
        >
          Carica Componente B (2s)
        </button>
        <button
          onClick={() => setActiveComponent(null)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
      
      <div style={{
        border: '2px dashed #007bff',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#f8f9fa',
        minHeight: 100
      }}>
        {ActiveComponent ? (
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div>Caricamento componente...</div>
              <div style={{ 
                width: 30, 
                height: 30, 
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '12px auto'
              }} />
            </div>
          }>
            <ActiveComponent />
          </Suspense>
        ) : (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: 20 }}>
            Seleziona un componente da caricare
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principale
export default function Demo16a(): JSX.Element {
  return (
    <div style={{ padding: 20 }}>
      <h2>🎭 Lezione 16a: Esempi Pratici di Suspense</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Pattern avanzati per gestione errori, lazy loading e ottimizzazioni UX.
      </p>
      
      <ErrorBoundaryDemo />
      <LazyLoadingDemo />
      
      <div style={{
        marginTop: 32,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Pattern Implementati:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>Error Boundaries:</strong> Gestione errori con retry logic</li>
          <li><strong>Lazy Loading:</strong> Caricamento dinamico dei componenti</li>
          <li><strong>Fallback Personalizzati:</strong> UI di caricamento contestuali</li>
          <li><strong>Resilienza:</strong> Recupero automatico da errori</li>
        </ul>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
