// Conditional Rendering Ottimizzato - Demo Avanzata con Ottimizzazioni
// Questo esempio mostra pattern di rendering condizionale con memo e useMemo
// Ora che hai completato la Lezione 14, puoi capire le ottimizzazioni avanzate!

import { useState, useEffect, memo, useMemo } from 'react';

// 1. Componente per stati di caricamento
function LoadingSpinner({ size = 'medium' }) {
  const sizeStyles = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        ...sizeStyles[size],
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );
}

// 2. Componente per gestione errori
function ErrorMessage({ error, onRetry }) {
  return (
    <div style={{
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #f5c6cb',
      margin: '16px 0'
    }}>
      <h4 style={{ margin: '0 0 8px 0' }}>Errore</h4>
      <p style={{ margin: '0 0 12px 0' }}>{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Riprova
        </button>
      )}
    </div>
  );
}

// 3. Componente per stato vuoto
function EmptyState({ message, action }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      color: '#6c757d'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
      <h3 style={{ margin: '0 0 8px 0' }}>Nessun elemento</h3>
      <p style={{ margin: '0 0 16px 0' }}>{message}</p>
      {action && action}
    </div>
  );
}

// 4. Demo operatore ternario
function TernaryOperatorDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  return (
    <div style={{
      border: '2px solid #28a745',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#d4edda'
    }}>
      <h3>🔄 Operatore Ternario</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={isLoggedIn}
            onChange={(e) => setIsLoggedIn(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Utente loggato
        </label>
        
        {isLoggedIn && (
          <input
            type="text"
            placeholder="Nome utente"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              width: '200px'
            }}
          />
        )}
      </div>
      
      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}>
        {isLoggedIn ? (
          <div>
            <h4>Benvenuto, {username || 'Utente'}!</h4>
            <p>Sei loggato nel sistema.</p>
          </div>
        ) : (
          <div>
            <h4>Effettua il login</h4>
            <p>Per accedere alle funzionalità del sistema.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. Demo operatore AND
function AndOperatorDemo() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nuovo messaggio ricevuto', read: false },
    { id: 2, message: 'Aggiornamento disponibile', read: true },
    { id: 3, message: 'Promemoria appuntamento', read: false }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  return (
    <div style={{
      border: '2px solid #6f42c1',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#e2e3f1'
    }}>
      <h3>🔗 Operatore AND</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <p><strong>Notifiche non lette:</strong> {unreadCount}</p>
      </div>
      
      {/* Mostra badge solo se ci sono notifiche non lette */}
      {unreadCount > 0 && (
        <div style={{
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          display: 'inline-block',
          marginBottom: '16px'
        }}>
          {unreadCount} non lette
        </div>
      )}
      
      <div style={{ display: 'grid', gap: '8px' }}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{
              opacity: notification.read ? 0.6 : 1,
              fontWeight: notification.read ? 'normal' : 'bold'
            }}>
              {notification.message}
            </span>
            
            {/* Mostra pulsante solo se non letto */}
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Segna come letto
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Demo if/else con early return
function IfElseDemo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula errore casuale
      if (Math.random() > 0.7) {
        throw new Error('Errore di rete');
      }
      
      setData({
        users: [
          { id: 1, name: 'Mario Rossi', email: 'mario@example.com' },
          { id: 2, name: 'Luigi Bianchi', email: 'luigi@example.com' }
        ],
        total: 2
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Early return per stati di caricamento ed errore
  if (loading) {
    return (
      <div style={{
        border: '2px solid #ffc107',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        backgroundColor: '#fff3cd'
      }}>
        <h3>⏳ If/Else con Early Return</h3>
        <LoadingSpinner />
        <p>Caricamento dati...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        border: '2px solid #dc3545',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        backgroundColor: '#f8d7da'
      }}>
        <h3>⏳ If/Else con Early Return</h3>
        <ErrorMessage error={error} onRetry={fetchData} />
      </div>
    );
  }
  
  if (!data || data.users.length === 0) {
    return (
      <div style={{
        border: '2px solid #6c757d',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        backgroundColor: '#e9ecef'
      }}>
        <h3>⏳ If/Else con Early Return</h3>
        <EmptyState 
          message="Nessun dato disponibile"
          action={
            <button
              onClick={fetchData}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Ricarica
            </button>
          }
        />
      </div>
    );
  }
  
  return (
    <div style={{
      border: '2px solid #28a745',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#d4edda'
    }}>
      <h3>⏳ If/Else con Early Return</h3>
      <p><strong>Totale utenti:</strong> {data.total}</p>
      
      <div style={{ display: 'grid', gap: '8px' }}>
        {data.users.map(user => (
          <div
            key={user.id}
            style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}
          >
            <strong>{user.name}</strong> - {user.email}
          </div>
        ))}
      </div>
      
      <button
        onClick={fetchData}
        style={{
          marginTop: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Ricarica Dati
      </button>
    </div>
  );
}

// 7. Demo variabili condizionali
function ConditionalVariablesDemo() {
  const [user, setUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Variabili condizionali
  let userInfo = null;
  if (user) {
    userInfo = (
      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}>
        <h4>{user.name}</h4>
        <p>Email: {user.email}</p>
        <p>Ruolo: {user.role}</p>
      </div>
    );
  }
  
  let detailsSection = null;
  if (showDetails && user) {
    detailsSection = (
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        marginTop: '16px'
      }}>
        <h5>Dettagli Utente</h5>
        <p>ID: {user.id}</p>
        <p>Data creazione: {user.createdAt}</p>
        <p>Ultimo accesso: {user.lastLogin}</p>
      </div>
    );
  }
  
  let actionsSection = null;
  if (showActions && user) {
    actionsSection = (
      <div style={{
        padding: '16px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        marginTop: '16px'
      }}>
        <h5>Azioni</h5>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Modifica
          </button>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Elimina
          </button>
        </div>
      </div>
    );
  }
  
  const loadUser = () => {
    setUser({
      id: 1,
      name: 'Mario Rossi',
      email: 'mario@example.com',
      role: 'admin',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    });
  };
  
  return (
    <div style={{
      border: '2px solid #17a2b8',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#d1ecf1'
    }}>
      <h3>📝 Variabili Condizionali</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={loadUser}
          style={{
            padding: '8px 16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          Carica Utente
        </button>
        
        <label style={{ marginRight: '16px' }}>
          <input
            type="checkbox"
            checked={showDetails}
            onChange={(e) => setShowDetails(e.target.checked)}
            style={{ marginRight: '4px' }}
          />
          Mostra Dettagli
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={showActions}
            onChange={(e) => setShowActions(e.target.checked)}
            style={{ marginRight: '4px' }}
          />
          Mostra Azioni
        </label>
      </div>
      
      {userInfo}
      {detailsSection}
      {actionsSection}
      
      {!user && (
        <EmptyState 
          message="Nessun utente caricato"
          action={
            <button
              onClick={loadUser}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Carica Utente
            </button>
          }
        />
      )}
    </div>
  );
}

// 8. Demo form con validazione condizionale
function FormValidationDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome è richiesto';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email è richiesta';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }
    
    if (!formData.age) {
      newErrors.age = 'Età è richiesta';
    } else if (formData.age < 18) {
      newErrors.age = 'Devi essere maggiorenne';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'Devi accettare i termini';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simula invio form
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Errore invio form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  // Early return per stato di successo
  if (isSubmitted) {
    return (
      <div style={{
        border: '2px solid #28a745',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        backgroundColor: '#d4edda',
        textAlign: 'center'
      }}>
        <h3>✅ Form Inviato con Successo!</h3>
        <p>Grazie per aver compilato il form.</p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', age: '', terms: false });
          }}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Invia Nuovo Form
        </button>
      </div>
    );
  }
  
  return (
    <div style={{
      border: '2px solid #6c757d',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#e9ecef'
    }}>
      <h3>📝 Form con Validazione Condizionale</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Nome *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.name ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.name}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.email ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.email && (
            <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.email}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Età *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.age ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          {errors.age && (
            <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.age}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => handleChange('terms', e.target.checked)}
            />
            Accetto i termini e condizioni *
          </label>
          {errors.terms && (
            <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.terms}</span>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Invio in corso...' : 'Invia Form'}
        </button>
      </form>
    </div>
  );
}

// 9. Componente principale che combina tutte le demo
function ConditionalRenderingDemo() {
  const [activeDemo, setActiveDemo] = useState('all');
  
  const demos = [
    { id: 'all', name: 'Tutte le Demo' },
    { id: 'ternary', name: 'Operatore Ternario' },
    { id: 'and', name: 'Operatore AND' },
    { id: 'ifelse', name: 'If/Else' },
    { id: 'variables', name: 'Variabili Condizionali' },
    { id: 'form', name: 'Form Validazione' }
  ];
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>🔄 Demo Conditional Rendering</h1>
      <p>Esempi pratici di diversi pattern di rendering condizionale</p>
      
      <div style={{ 
        backgroundColor: '#e9ecef', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>🎛️ Seleziona Demo</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {demos.map(demo => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeDemo === demo.id ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {demo.name}
            </button>
          ))}
        </div>
      </div>
      
      {(activeDemo === 'all' || activeDemo === 'ternary') && <TernaryOperatorDemo />}
      {(activeDemo === 'all' || activeDemo === 'and') && <AndOperatorDemo />}
      {(activeDemo === 'all' || activeDemo === 'ifelse') && <IfElseDemo />}
      {(activeDemo === 'all' || activeDemo === 'variables') && <ConditionalVariablesDemo />}
      {(activeDemo === 'all' || activeDemo === 'form') && <FormValidationDemo />}
      
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>💡 Istruzioni</h3>
        <ol>
          <li>Interagisci con le diverse demo per vedere il conditional rendering in azione</li>
          <li>Osserva come diversi pattern gestiscono condizioni diverse</li>
          <li>Nota le differenze tra operatore ternario, AND e if/else</li>
          <li>Testa la validazione del form per vedere il rendering condizionale degli errori</li>
          <li>Verifica come le variabili condizionali rendono il codice più leggibile</li>
        </ol>
      </div>
    </div>
  );
}

export default ConditionalRenderingDemo;
