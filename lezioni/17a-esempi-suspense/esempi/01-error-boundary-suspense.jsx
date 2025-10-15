// Esempio 1: Error Boundary + Suspense - Gestione errori avanzata
import { Suspense, Component, useState, useCallback } from 'react';

// Error Boundary personalizzato per Suspense
class SuspenseErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Suspense Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to error reporting service (esempio)
    if (window.errorReporting) {
      window.errorReporting.captureException(error, {
        extra: errorInfo,
        tags: { component: 'SuspenseErrorBoundary' }
      });
    }
  }
  
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          maxRetries={this.props.maxRetries || 3}
        />
      );
    }
    
    return this.props.children;
  }
}

// Componente di fallback per errori
function ErrorFallback({ error, errorInfo, retryCount, onRetry, maxRetries }) {
  const canRetry = retryCount < maxRetries;
  
  return (
    <div style={{
      border: '2px solid #dc3545',
      borderRadius: 8,
      padding: 24,
      margin: 16,
      backgroundColor: '#f8d7da',
      color: '#721c24'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 24, marginRight: 12 }}>⚠️</span>
        <h3 style={{ margin: 0 }}>Errore nel Caricamento</h3>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <strong>Messaggio:</strong> {error?.message || 'Errore sconosciuto'}
      </div>
      
      {errorInfo && (
        <details style={{ marginBottom: 16 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Dettagli Tecnici
          </summary>
          <pre style={{ 
            backgroundColor: '#fff', 
            padding: 12, 
            borderRadius: 4, 
            fontSize: 12,
            overflow: 'auto',
            marginTop: 8
          }}>
            {errorInfo.componentStack}
          </pre>
        </details>
      )}
      
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {canRetry ? (
          <button
            onClick={onRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Riprova ({retryCount}/{maxRetries})
          </button>
        ) : (
          <div style={{ 
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            borderRadius: 4,
            fontSize: 14
          }}>
            Tentativi esauriti
          </div>
        )}
        
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          🔄 Ricarica Pagina
        </button>
      </div>
    </div>
  );
}

// Simulazione di risorsa che può fallire
function createUnreliableResource(successRate = 0.7) {
  let status = 'pending';
  let result;
  
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        status = 'success';
        result = {
          data: `Dati caricati con successo! (${new Date().toLocaleTimeString()})`,
          timestamp: Date.now()
        };
        resolve(result);
      } else {
        status = 'error';
        result = new Error('Simulazione errore di rete');
        reject(result);
      }
    }, 2000);
  });
  
  return {
    read() {
      if (status === 'pending') {
        throw promise;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  };
}

// Componente che può fallire
function UnreliableDataComponent({ successRate }) {
  const [resource] = useState(() => createUnreliableResource(successRate));
  
  const data = resource.read();
  
  return (
    <div style={{
      border: '2px solid #28a745',
      borderRadius: 8,
      padding: 16,
      backgroundColor: '#d4edda',
      color: '#155724'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 20, marginRight: 8 }}>✅</span>
        <h4 style={{ margin: 0 }}>Caricamento Riuscito!</h4>
      </div>
      <p style={{ margin: 0 }}>{data.data}</p>
      <small style={{ opacity: 0.8 }}>
        Timestamp: {new Date(data.timestamp).toLocaleString()}
      </small>
    </div>
  );
}

// Skeleton per il caricamento
function DataSkeleton() {
  return (
    <div style={{
      border: '2px solid #dee2e6',
      borderRadius: 8,
      padding: 16,
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#dee2e6',
          marginRight: 8,
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <div style={{
          width: 120,
          height: 16,
          backgroundColor: '#dee2e6',
          borderRadius: 4,
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </div>
      <div style={{
        width: '100%',
        height: 14,
        backgroundColor: '#dee2e6',
        borderRadius: 4,
        marginBottom: 8,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{
        width: '60%',
        height: 12,
        backgroundColor: '#dee2e6',
        borderRadius: 4,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
  );
}

// Componente principale
export default function ErrorBoundarySuspenseExample() {
  const [successRate, setSuccessRate] = useState(0.7);
  const [key, setKey] = useState(0);
  
  const handleReload = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: 20 }}>
      <h2>🚨 Error Boundary + Suspense</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Gestione avanzata di errori e stati di caricamento con retry automatico.
      </p>
      
      {/* Controlli */}
      <div style={{ 
        marginBottom: 24, 
        padding: 16, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 8,
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 12px 0' }}>⚙️ Controlli Simulazione</h4>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Tasso di Successo: {Math.round(successRate * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={successRate}
            onChange={(e) => setSuccessRate(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: 12, 
            color: '#666',
            marginTop: 4
          }}>
            <span>0% (Sempre errore)</span>
            <span>50%</span>
            <span>100% (Sempre successo)</span>
          </div>
        </div>
        
        <button
          onClick={handleReload}
          style={{
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🎲 Nuova Simulazione
        </button>
      </div>
      
      {/* Demo Error Boundary + Suspense */}
      <div style={{
        border: '2px dashed #007bff',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#f8f9fa'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#007bff' }}>
          Error Boundary + Suspense
        </h4>
        
        <SuspenseErrorBoundary maxRetries={3}>
          <Suspense fallback={<DataSkeleton />}>
            <UnreliableDataComponent 
              key={key} 
              successRate={successRate} 
            />
          </Suspense>
        </SuspenseErrorBoundary>
      </div>
      
      {/* Spiegazione */}
      <div style={{
        marginTop: 24,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Come Funziona:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>Error Boundary:</strong> Cattura errori durante il rendering</li>
          <li><strong>Retry Logic:</strong> Permette di riprovare fino a 3 volte</li>
          <li><strong>Fallback Graceful:</strong> Mostra UI di errore user-friendly</li>
          <li><strong>Logging:</strong> Registra errori per debugging e monitoraggio</li>
          <li><strong>Recovery:</strong> Opzioni per riprovare o ricaricare la pagina</li>
        </ul>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
