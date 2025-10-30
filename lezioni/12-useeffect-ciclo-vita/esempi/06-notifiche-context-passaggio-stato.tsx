import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

/**
 * Esempio 6: Sistema di Notifiche con Context API (Passaggio Stato con Context)
 * 
 * Questo esempio dimostra:
 * - Context API per stato globale
 * - Comunicazione tra componenti distanti
 * - Pattern di provider e consumer
 * - Gestione notifiche con auto-remove
 * - Evitare prop drilling
 */

// Creazione del Context
const NotificationContext = createContext();

// Provider del Context
function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove dopo la durata specificata
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);
    
    return id;
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates } : n
    ));
  }, []);
  
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    updateNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook personalizzato per usare il Context
function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve essere usato dentro NotificationProvider'
  }
  return context;
}

// Componente per i pulsanti di notifica
function NotificationButtons() {
  const { addNotification } = useNotifications();
  
  const showSuccess = () => {
    addNotification({
      type: 'success',
      title: 'Operazione Completata',
      message: 'I dati sono stati salvati con successo!',
      duration: 3000
    }
  };
  
  const showError = () => {
    addNotification({
      type: 'error',
      title: 'Errore',
      message: 'Si è verificato un errore durante l\'operazione. Riprova.',
      duration: 7000
    }
  };
  
  const showWarning = () => {
    addNotification({
      type: 'warning',
      title: 'Attenzione',
      message: 'Questa operazione non può essere annullata. Sei sicuro?',
      duration: 10000
    }
  };
  
  const showInfo = () => {
    addNotification({
      type: 'info',
      title: 'Informazione',
      message: 'Nuova versione dell\'applicazione disponibile!',
      duration: 5000
    }
  };
  
  const showProgress = () => {
    const id = addNotification({
      type: 'info',
      title: 'Caricamento',
      message: 'Caricamento in corso... 0%',
      duration: 0 // Non auto-remove
    }
    
    // Simula progresso
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        addNotification({
          id,
          type: 'info',
          title: 'Caricamento',
          message: `Caricamento in corso... ${progress}%`,
          duration: 0
        }
      } else {
        clearInterval(interval);
        addNotification({
          id,
          type: 'success',
          title: 'Completato',
          message: 'Caricamento completato con successo!',
          duration: 3000
        }
      }
    }, 200);
  };
  
  return (
    <div style={{  
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '20px'
    } as React.CSSProperties}>
      <h3 style={{  margin: '0 0 15px 0', color: '#333' } as React.CSSProperties}>Testa le Notifiche</h3>
      <div style={{  display: 'flex', gap: '10px', flexWrap: 'wrap' } as React.CSSProperties}>
        <button 
          onClick={showSuccess}
          style={{ 
            padding: '10px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ✅ Successo
        </button>
        
        <button 
          onClick={showError}
          style={{ 
            padding: '10px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ❌ Errore
        </button>
        
        <button 
          onClick={showWarning}
          style={{ 
            padding: '10px 16px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ⚠️ Avviso
        </button>
        
        <button 
          onClick={showInfo}
          style={{ 
            padding: '10px 16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ℹ️ Info
        </button>
        
        <button 
          onClick={showProgress}
          style={{ 
            padding: '10px 16px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📊 Progresso
        </button>
      </div>
    </div>
  );
}

// Componente per la lista delle notifiche
function NotificationList() {
  const { notifications, removeNotification, clearAll } = useNotifications();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div style={{ 
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: '400px'
    } as React.CSSProperties}>
      <div style={{  
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      } as React.CSSProperties}>
        <h3 style={{  margin: 0, fontSize: '16px' } as React.CSSProperties}>
          Notifiche ({notifications.length})
        </h3>
        <button 
          onClick={clearAll}
          style={{ 
            padding: '4px 8px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Pulisci Tutto
        </button>
      </div>
      
      <div style={{  display: 'flex', flexDirection: 'column', gap: '10px' } as React.CSSProperties}>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}

// Componente per singola notifica
function NotificationItem({ notification, onRemove }) {
  const getStyle = (type) => {
    const styles = {
      success: { 
        backgroundColor: '#d4edda', 
        borderColor: '#c3e6cb', 
        color: '#155724',
        icon: '✅'
      },
      error: { 
        backgroundColor: '#f8d7da', 
        borderColor: '#f5c6cb', 
        color: '#721c24',
        icon: '❌'
      },
      warning: { 
        backgroundColor: '#fff3cd', 
        borderColor: '#ffeaa7', 
        color: '#856404',
        icon: '⚠️'
      },
      info: { 
        backgroundColor: '#d1ecf1', 
        borderColor: '#bee5eb', 
        color: '#0c5460',
        icon: 'ℹ️'
      }
    };
    return styles[type] || styles.info;
  };
  
  const style = getStyle(notification.type);
  
  return (
    <div style={{ 
      ...style,
      padding: '15px',
      border: '1px solid',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      animation: 'slideIn 0.3s ease-out'
    } as React.CSSProperties}>
      <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as React.CSSProperties}>
        <div style={{  flex: 1 } as React.CSSProperties}>
          <div style={{  display: 'flex', alignItems: 'center', marginBottom: '8px' } as React.CSSProperties}>
            <span style={{  marginRight: '8px', fontSize: '16px' } as React.CSSProperties}>
              {style.icon}
            </span>
            {notification.title && (
              <h4 style={{  margin: 0, fontSize: '14px', fontWeight: 'bold' } as React.CSSProperties}>
                {notification.title}
              </h4>
            )}
          </div>
          <p style={{  margin: 0, fontSize: '14px', lineHeight: '1.4' } as React.CSSProperties}>
            {notification.message}
          </p>
          <div style={{  
            fontSize: '12px', 
            opacity: 0.7, 
            marginTop: '8px'
          } as React.CSSProperties}>
            {notification.timestamp.toLocaleTimeString('it-IT')}
          </div>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          style={{ 
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginLeft: '10px',
            opacity: 0.7,
            padding: '4px'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Componente per simulare operazioni che generano notifiche
function OperationSimulator() {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  
  const simulateSave = async () => {
    setLoading(true);
    addNotification({
      type: 'info',
      title: 'Salvataggio',
      message: 'Salvataggio in corso...',
      duration: 0
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addNotification({
        type: 'success',
        title: 'Salvataggio Completato',
        message: 'I dati sono stati salvati con successo!',
        duration: 3000
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Errore di Salvataggio',
        message: 'Impossibile salvare i dati. Riprova.',
        duration: 5000
      }
    } finally {
      setLoading(false);
    }
  };
  
  const simulateError = () => {
    addNotification({
      type: 'error',
      title: 'Errore di Connessione',
      message: 'Impossibile connettersi al server. Verifica la connessione.',
      duration: 8000
    }
  };
  
  const simulateWarning = () => {
    addNotification({
      type: 'warning',
      title: 'Sessione in Scadenza',
      message: 'La tua sessione scadrà tra 5 minuti. Salva il tuo lavoro.',
      duration: 10000
    }
  };
  
  return (
    <div style={{  
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #ddd'
    } as React.CSSProperties}>
      <h3 style={{  margin: '0 0 15px 0', color: '#333' } as React.CSSProperties}>Simulatore Operazioni</h3>
      <div style={{  display: 'flex', gap: '10px', flexWrap: 'wrap' } as React.CSSProperties}>
        <button 
          onClick={simulateSave}
          disabled={loading}
          style={{ 
            padding: '10px 16px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? '⏳ Salvando...' : '💾 Simula Salvataggio'}
        </button>
        
        <button 
          onClick={simulateError}
          style={{ 
            padding: '10px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔌 Simula Errore
        </button>
        
        <button 
          onClick={simulateWarning}
          style={{ 
            padding: '10px 16px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ⏰ Simula Avviso
        </button>
      </div>
    </div>
  );
}

// Componente principale dell'app
function NotificationApp() {
  return (
    <NotificationProvider>
      <div style={{  
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      } as React.CSSProperties}>
        <div style={{  
          maxWidth: '800px', 
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        } as React.CSSProperties}>
          
          {/* Header */}
          <div style={{  
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '20px',
            textAlign: 'center'
          } as React.CSSProperties}>
            <h1 style={{  margin: 0, fontSize: '2rem' } as React.CSSProperties}>
              🔔 Sistema di Notifiche
            </h1>
            <p style={{  margin: '10px 0 0 0', opacity: 0.9 } as React.CSSProperties}>
              Esempio di Context API per gestione notifiche globali
            </p>
          </div>
          
          {/* Contenuto */}
          <div style={{  padding: '30px' } as React.CSSProperties}>
            <NotificationButtons />
            <OperationSimulator />
            
            {/* Informazioni */}
            <div style={{  
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#e9ecef',
              borderRadius: '8px'
            } as React.CSSProperties}>
              <h3 style={{  margin: '0 0 15px 0', color: '#495057' } as React.CSSProperties}>
                📚 Come Funziona
              </h3>
              <ul style={{  margin: 0, paddingLeft: '20px', color: '#495057' } as React.CSSProperties}>
                <li>Le notifiche vengono gestite tramite Context API</li>
                <li>Qualsiasi componente può aggiungere notifiche usando <code>useNotifications()</code></li>
                <li>Le notifiche si auto-rimuovono dopo la durata specificata</li>
                <li>È possibile rimuovere manualmente le notifiche</li>
                <li>Supporta diversi tipi: success, error, warning, info</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Lista notifiche */}
        <NotificationList />
        
        {/* CSS per animazioni */}
        <style>
          {`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    </NotificationProvider>
  );
}

export default NotificationApp;
