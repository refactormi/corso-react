// Conditional Rendering - Esempi con Props (Versione Statica)
// Questo file dimostra il rendering condizionale usando solo props
// Versione semplificata per la Lezione 07c - La versione interattiva sarà nella Lezione 08+

/**
 * CONCETTI DIMOSTRATI:
 * 1. Operatore ternario per rendering condizionale
 * 2. Operatore && per rendering condizionale
 * 3. If/else con early return
 * 4. Switch case per rendering multiplo
 * 5. Rendering di liste con filtri
 */

// ========================================
// 1. OPERATORE TERNARIO
// ========================================

// Componente che mostra contenuto diverso basato su props
function WelcomeMessage({ isLoggedIn, username = "Ospite" }) {
  return (
    <div style={{ 
      padding: '15px', 
      borderRadius: '8px',
      backgroundColor: isLoggedIn ? '#d4edda' : '#f8d7da',
      color: isLoggedIn ? '#155724' : '#721c24',
      marginBottom: '10px'
    }}>
      {isLoggedIn ? (
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>👋 Benvenuto, {username}!</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Sei autenticato nel sistema</p>
        </div>
      ) : (
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>🔒 Accesso Richiesto</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Effettua il login per continuare</p>
        </div>
      )}
    </div>
  );
}

// ========================================
// 2. OPERATORE && (AND LOGICO)
// ========================================

// Componente che mostra elementi solo se la condizione è vera
function NotificationBanner({ hasNotifications, notificationCount = 0 }) {
  return (
    <div>
      {/* Mostra banner solo se ci sono notifiche */}
      {hasNotifications && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <strong>🔔 Hai {notificationCount} nuove notifiche!</strong>
        </div>
      )}
      
      {/* Mostra messaggio solo se NON ci sono notifiche */}
      {!hasNotifications && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e7f3ff',
          border: '1px solid '#007bff',
          borderRadius: '4px',
          marginBottom: '10px',
          color: '#004085'
        }}>
          ✅ Nessuna nuova notifica
        </div>
      )}
    </div>
  );
}

// ========================================
// 3. EARLY RETURN
// ========================================

// Componente che usa early return per casi speciali
function UserProfile({ user }) {
  // Early return se non c'è utente
  if (!user) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>👤</p>
        <p style={{ color: '#666' }}>Nessun utente selezionato</p>
      </div>
    );
  }
  
  // Rendering normale se c'è l'utente
  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>{user.name}</h2>
          <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            <strong>Ruolo:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 4. SWITCH CASE (con funzione helper)
// ========================================

// Helper function per determinare lo stile basato sullo stato
function getStatusStyle(status) {
  switch (status) {
    case 'success':
      return {
        backgroundColor: '#d4edda',
        color: '#155724',
        icon: '✅'
      };
    case 'error':
      return {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        icon: '❌'
      };
    case 'warning':
      return {
        backgroundColor: '#fff3cd',
        color: '#856404',
        icon: '⚠️'
      };
    case 'info':
      return {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        icon: 'ℹ️'
      };
    default:
      return {
        backgroundColor: '#e2e3e5',
        color: '#383d41',
        icon: '📝'
      };
  }
}

// Componente che usa switch case per rendering
function StatusMessage({ status, message }) {
  const style = getStatusStyle(status);
  
  return (
    <div style={{ 
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '10px',
      ...style
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>{style.icon}</span>
        <div>
          <strong style={{ textTransform: 'uppercase', fontSize: '12px' }}>
            {status}
          </strong>
          <p style={{ margin: '5px 0 0 0' }}>{message}</p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 5. RENDERING LISTE CON FILTRI
// ========================================

// Componente che filtra e renderizza liste
function FilteredList({ items, filter = 'all' }) {
  // Filtra gli items in base al filtro
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'active') return item.active;
    if (filter === 'inactive') return !item.active;
    return true;
  });
  
  return (
    <div style={{ 
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '15px'
    }}>
      <div style={{ 
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '2px solid #dee2e6'
      }}>
        <strong>Filtro attivo:</strong> {filter.toUpperCase()}
      </div>
      
      {filteredItems.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Nessun elemento trovato con questo filtro
        </p>
      ) : (
        <div>
          {filteredItems.map(item => (
            <div 
              key={item.id}
              style={{ 
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: item.active ? '#d4edda' : '#f8d7da',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{item.name}</span>
              <span style={{ 
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: 'white'
              }}>
                {item.active ? 'Attivo' : 'Inattivo'}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ 
        marginTop: '15px',
        paddingTop: '10px',
        borderTop: '1px solid #dee2e6',
        fontSize: '14px',
        color: '#666'
      }}>
        Mostrando {filteredItems.length} di {items.length} elementi
      </div>
    </div>
  );
}

// ========================================
// 6. RENDERING MULTIPLO CONDIZIONALE
// ========================================

// Componente con multiple condizioni
function Dashboard({ user, hasData, isLoading, error }) {
  // Caso 1: Errore
  if (error) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>❌</p>
        <h3 style={{ color: '#721c24', margin: '0 0 10px 0' }}>Errore</h3>
        <p style={{ color: '#721c24' }}>{error}</p>
      </div>
    );
  }
  
  // Caso 2: Caricamento
  if (isLoading) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>⏳</p>
        <p style={{ color: '#004085' }}>Caricamento in corso...</p>
      </div>
    );
  }
  
  // Caso 3: Nessun utente
  if (!user) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fff3cd',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>🔐</p>
        <p style={{ color: '#856404' }}>Effettua il login per vedere la dashboard</p>
      </div>
    );
  }
  
  // Caso 4: Nessun dato
  if (!hasData) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#e2e3e5',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>📭</p>
        <p style={{ color: '#383d41' }}>Nessun dato disponibile</p>
      </div>
    );
  }
  
  // Caso 5: Tutto ok - mostra dashboard
  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#d4edda',
      borderRadius: '8px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#155724' }}>
        ✅ Dashboard di {user.name}
      </h3>
      <p style={{ margin: 0, color: '#155724' }}>
        Tutti i dati sono stati caricati correttamente!
      </p>
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPALE - DEMO
// ========================================

function ConditionalRenderingDemo() {
  // Dati di esempio - statici per questa lezione
  const sampleItems = [
    { id: 1, name: 'Elemento 1', active: true },
    { id: 2, name: 'Elemento 2', active: false },
    { id: 3, name: 'Elemento 3', active: true },
    { id: 4, name: 'Elemento 4', active: false },
    { id: 5, name: 'Elemento 5', active: true }
  ];
  
  const sampleUser = {
    name: 'Mario Rossi',
    email: 'mario@example.com',
    role: 'Admin'
  };
  
  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{ 
        padding: '20px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>🔀 Conditional Rendering - Props Only</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Esempi di rendering condizionale usando solo props e valori statici
        </p>
      </div>
      
      {/* Sezione 1: Operatore Ternario */}
      <div style={{ marginBottom: '30px' }}>
        <h2>1️⃣ Operatore Ternario</h2>
        <WelcomeMessage isLoggedIn={true} username="Mario" />
        <WelcomeMessage isLoggedIn={false} />
      </div>
      
      {/* Sezione 2: Operatore && */}
      <div style={{ marginBottom: '30px' }}>
        <h2>2️⃣ Operatore && (AND Logico)</h2>
        <NotificationBanner hasNotifications={true} notificationCount={5} />
        <NotificationBanner hasNotifications={false} />
      </div>
      
      {/* Sezione 3: Early Return */}
      <div style={{ marginBottom: '30px' }}>
        <h2>3️⃣ Early Return</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <UserProfile user={sampleUser} />
          <UserProfile user={null} />
        </div>
      </div>
      
      {/* Sezione 4: Switch Case */}
      <div style={{ marginBottom: '30px' }}>
        <h2>4️⃣ Switch Case per Stati Diversi</h2>
        <StatusMessage status="success" message="Operazione completata con successo!" />
        <StatusMessage status="error" message="Si è verificato un errore." />
        <StatusMessage status="warning" message="Attenzione: verifica i dati inseriti." />
        <StatusMessage status="info" message="Informazione: aggiornamento disponibile." />
      </div>
      
      {/* Sezione 5: Liste Filtrate */}
      <div style={{ marginBottom: '30px' }}>
        <h2>5️⃣ Rendering Liste con Filtri</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <FilteredList items={sampleItems} filter="all" />
          <FilteredList items={sampleItems} filter="active" />
          <FilteredList items={sampleItems} filter="inactive" />
        </div>
      </div>
      
      {/* Sezione 6: Multiple Condizioni */}
      <div style={{ marginBottom: '30px' }}>
        <h2>6️⃣ Multiple Condizioni</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <Dashboard user={sampleUser} hasData={true} isLoading={false} error={null} />
          <Dashboard user={null} hasData={false} isLoading={false} error={null} />
          <Dashboard user={sampleUser} hasData={false} isLoading={true} error={null} />
          <Dashboard user={sampleUser} hasData={false} isLoading={false} error="Errore di connessione" />
        </div>
      </div>
      
      {/* Note Finali */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 Nota per gli Studenti</h3>
        <p>
          Questi esempi mostrano il <strong>rendering condizionale</strong> usando solo <strong>props</strong>.
          Nella <strong>Lezione 08</strong> imparerai a usare <strong>useState</strong> per rendere
          queste condizioni dinamiche e interattive!
        </p>
        <p style={{ marginBottom: 0, fontSize: '14px' }}>
          Per ora, concentrati sui <strong>pattern</strong> di rendering condizionale:
          operatore ternario, &&, early return, e gestione di casi multipli. 🚀
        </p>
      </div>
    </div>
  );
}

export default ConditionalRenderingDemo;

