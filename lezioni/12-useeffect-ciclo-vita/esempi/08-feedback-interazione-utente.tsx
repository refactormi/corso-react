import React, { useState, useCallback, useEffect } from 'react'

/**
 * Esempio 8: Sistema di Feedback e Notifiche (Interazione Utente)
 * 
 * Questo esempio dimostra:
 * - Sistema di notifiche con diversi tipi
 * - Feedback visivo per azioni utente
 * - Gestione stati di loading e progresso
 * - Toast notifications e modal di conferma
 * - Gestione errori con retry
 * - Feedback in tempo reale
 */

// Hook per gestire le notifiche
function useNotifications() {
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
    if (newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, newNotification.duration);
    }
    
    return id;
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
}

// Componente per le notifiche toast
function ToastNotifications({ notifications, onRemove }) {
  if (notifications.length === 0) return null;
  
  return (
    <div style={{ 
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: '400px'
    } as React.CSSProperties}>
      {notifications.map(notification => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

// Componente per singola notifica toast
function ToastNotification({ notification, onRemove }) {
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
      marginBottom: '10px',
      border: '1px solid',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      animation: 'slideIn 0.3s ease-out',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px'
    } as React.CSSProperties}>
      <span style={{  fontSize: '18px', flexShrink: 0 } as React.CSSProperties}>
        {style.icon}
      </span>
      
      <div style={{  flex: 1 } as React.CSSProperties}>
        {notification.title && (
          <h4 style={{  margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' } as React.CSSProperties}>
            {notification.title}
          </h4>
        )}
        <p style={{  margin: 0, fontSize: '14px', lineHeight: '1.4' } as React.CSSProperties}>
          {notification.message}
        </p>
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            style={{ 
              marginTop: '8px',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: '1px solid currentColor',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            {notification.action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={() => onRemove(notification.id)}
        style={{ 
          background: 'none',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          opacity: 0.7,
          padding: '4px',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        ✕
      </button>
    </div>
  );
}

// Componente per loading con progresso
function LoadingWithProgress({ loading, progress, message }) {
  if (!loading) return null;
  
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    } as React.CSSProperties}>
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        textAlign: 'center',
        minWidth: '300px'
      } as React.CSSProperties}>
        <div style={{ 
          width: '60px',
          height: '60px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        
        <h3 style={{  margin: '0 0 10px 0', color: '#333' } as React.CSSProperties}>
          {message || 'Caricamento...'}
        </h3>
        
        {progress !== undefined && (
          <div style={{  marginTop: '20px' } as React.CSSProperties}>
            <div style={{ 
              width: '100%',
              height: '8px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden'
            } as React.CSSProperties}>
              <div style={{ 
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{  margin: '10px 0 0 0', fontSize: '14px', color: '#666' } as React.CSSProperties}>
              {progress}% completato
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente per modal di conferma
function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }) {
  if (!isOpen) return null;
  
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    } as React.CSSProperties}>
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      } as React.CSSProperties}>
        <div style={{  fontSize: '48px', marginBottom: '20px' } as React.CSSProperties}>⚠️</div>
        
        <h3 style={{  margin: '0 0 15px 0', color: '#333' } as React.CSSProperties}>
          {title}
        </h3>
        
        <p style={{  margin: '0 0 25px 0', color: '#666', lineHeight: '1.5' } as React.CSSProperties}>
          {message}
        </p>
        
        <div style={{  display: 'flex', gap: '15px', justifyContent: 'center' } as React.CSSProperties}>
          <button
            onClick={onCancel}
            style={{ 
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {cancelText || 'Annulla'}
          </button>
          
          <button
            onClick={onConfirm}
            style={{ 
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {confirmText || 'Conferma'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente per feedback in tempo reale
function RealTimeFeedback({ onAction }) {
  const [typing, setTyping] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  
  const handleTyping = (e) => {
    setTyping(true);
    setLastAction('typing'
    
    // Simula feedback di digitazione
    setTimeout(() => {
      setTyping(false);
    }, 1000);
  };
  
  const handleAction = (actionType) => {
    setLastAction(actionType);
    onAction(actionType);
    
    setTimeout(() => {
      setLastAction(null);
    }, 2000);
  };
  
  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '20px'
    } as React.CSSProperties}>
      <h4 style={{  margin: '0 0 15px 0' } as React.CSSProperties}>Feedback in Tempo Reale</h4>
      
      <div style={{  marginBottom: '15px' } as React.CSSProperties}>
        <input
          type="text"
          placeholder="Digita qualcosa per vedere il feedback..."
          onInput={handleTyping}
          style={{ 
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        {typing && (
          <div style={{  
            marginTop: '5px', 
            fontSize: '12px', 
            color: '#007bff',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          } as React.CSSProperties}>
            <div style={{ 
              width: '12px',
              height: '12px',
              border: '2px solid #007bff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Digitando...
          </div>
        )}
      </div>
      
      <div style={{  display: 'flex', gap: '10px', flexWrap: 'wrap' } as React.CSSProperties}>
        <button
          onClick={() => handleAction('like')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          👍 Mi Piace
        </button>
        
        <button
          onClick={() => handleAction('share')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📤 Condividi
        </button>
        
        <button
          onClick={() => handleAction('save')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          💾 Salva
        </button>
      </div>
      
      {lastAction && (
        <div style={{ 
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#1976d2'
        } as React.CSSProperties}>
          ✅ Azione "{lastAction}" completata!
        </div>
      )}
    </div>
  );
}

// Componente principale
function FeedbackSystem() {
  const { notifications, addNotification, removeNotification, clearAll } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(''
  const [confirmModal, setConfirmModal] = useState({ isOpen: false }
  const [retryCount, setRetryCount] = useState(0);
  
  const showSuccess = () => {
    addNotification({
      type: 'success',
      title: 'Operazione Completata',
      message: 'I dati sono stati salvati con successo!'
    }
  };
  
  const showError = () => {
    addNotification({
      type: 'error',
      title: 'Errore',
      message: 'Si è verificato un errore durante l\'operazione.',
      action: {
        label: 'Riprova',
        onClick: () => {
          setRetryCount(prev => prev + 1);
          addNotification({
            type: 'info',
            title: 'Riprovando...',
            message: `Tentativo ${retryCount + 1} in corso...`
          }
        }
      }
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
      message: 'Nuova versione dell\'applicazione disponibile!'
    }
  };
  
  const simulateLoading = () => {
    setLoading(true);
    setProgress(0);
    setLoadingMessage('Caricamento dati...'
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          addNotification({
            type: 'success',
            title: 'Caricamento Completato',
            message: 'Tutti i dati sono stati caricati con successo!'
          }
          return 100;
        }
        return prev + 10;
      }
    }, 200);
  };
  
  const showConfirmation = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Conferma Eliminazione',
      message: 'Sei sicuro di voler eliminare questo elemento? Questa azione non può essere annullata.',
      onConfirm: () => {
        setConfirmModal({ isOpen: false }
        addNotification({
          type: 'success',
          title: 'Elemento Eliminato',
          message: 'L\'elemento è stato eliminato con successo.'
        }
      },
      onCancel: () => {
        setConfirmModal({ isOpen: false }
        addNotification({
          type: 'info',
          title: 'Operazione Annullata',
          message: 'L\'eliminazione è stata annullata.'
        }
      }
    }
  };
  
  const handleRealTimeAction = (actionType) => {
    addNotification({
      type: 'success',
      title: 'Azione Completata',
      message: `Azione "${actionType}" eseguita con successo!`
    }
  };
  
  return (
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
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '20px',
          textAlign: 'center'
        } as React.CSSProperties}>
          <h1 style={{  margin: 0, fontSize: '2rem' } as React.CSSProperties}>
            🔔 Sistema di Feedback
          </h1>
          <p style={{  margin: '10px 0 0 0', opacity: 0.9 } as React.CSSProperties}>
            Esempi di notifiche, loading e feedback utente
          </p>
        </div>
        
        {/* Contenuto */}
        <div style={{  padding: '30px' } as React.CSSProperties}>
          
          {/* Feedback in tempo reale */}
          <RealTimeFeedback onAction={handleRealTimeAction} />
          
          {/* Pulsanti per testare le notifiche */}
          <div style={{  marginBottom: '30px' } as React.CSSProperties}>
            <h3 style={{  marginBottom: '15px', color: '#333' } as React.CSSProperties}>Testa le Notifiche</h3>
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
            </div>
          </div>
          
          {/* Pulsanti per testare loading e conferme */}
          <div style={{  marginBottom: '30px' } as React.CSSProperties}>
            <h3 style={{  marginBottom: '15px', color: '#333' } as React.CSSProperties}>Testa Loading e Conferme</h3>
            <div style={{  display: 'flex', gap: '10px', flexWrap: 'wrap' } as React.CSSProperties}>
              <button 
                onClick={simulateLoading}
                style={{ 
                  padding: '10px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📊 Simula Loading
              </button>
              
              <button 
                onClick={showConfirmation}
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
                🗑️ Conferma Eliminazione
              </button>
            </div>
          </div>
          
          {/* Gestione notifiche */}
          {notifications.length > 0 && (
            <div style={{ 
              padding: '15px',
              backgroundColor: '#e9ecef',
              borderRadius: '6px',
              marginBottom: '20px'
            } as React.CSSProperties}>
              <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties}>
                <span style={{  fontWeight: 'bold' } as React.CSSProperties}>
                  Notifiche Attive: {notifications.length}
                </span>
                <button
                  onClick={clearAll}
                  style={{ 
                    padding: '6px 12px',
                    backgroundColor: '#6c757d',
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
            </div>
          )}
          
          {/* Informazioni */}
          <div style={{  
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '1px solid #2196f3'
          } as React.CSSProperties}>
            <h3 style={{  margin: '0 0 15px 0', color: '#1976d2' } as React.CSSProperties}>
              📚 Come Funziona
            </h3>
            <ul style={{  margin: 0, paddingLeft: '20px', color: '#1976d2' } as React.CSSProperties}>
              <li>Le notifiche si auto-rimuovono dopo la durata specificata</li>
              <li>È possibile aggiungere azioni personalizzate alle notifiche</li>
              <li>Il loading mostra progresso in tempo reale</li>
              <li>Le conferme richiedono interazione esplicita dell'utente</li>
              <li>Il feedback in tempo reale risponde immediatamente alle azioni</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Componenti overlay */}
      <ToastNotifications 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      
      <LoadingWithProgress 
        loading={loading} 
        progress={progress} 
        message={loadingMessage} 
      />
      
      <ConfirmationModal {...confirmModal} />
      
      {/* CSS per animazioni */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
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
  );
}

export default FeedbackSystem;
