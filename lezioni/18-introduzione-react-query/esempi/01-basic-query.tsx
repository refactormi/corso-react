// Esempio 1: Basic Query - useQuery fondamentale
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Simulazione API
const fetchUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay
  
  // Simula possibile errore
  if (Math.random() < 0.1) {
    throw new Error('Errore di rete simulato');
  }
  
  return [
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'Admin' },
    { id: 2, name: 'Anna Verdi', email: 'anna@example.com', role: 'User' },
    { id: 3, name: 'Luca Bianchi', email: 'luca@example.com', role: 'Editor' },
    { id: 4, name: 'Sara Neri', email: 'sara@example.com', role: 'User' },
    { id: 5, name: 'Paolo Gialli', email: 'paolo@example.com', role: 'Admin' }
  ];
};

const fetchUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = await fetchUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error(`Utente con ID ${userId} non trovato`);
  }
  
  return {
    ...user,
    details: {
      joinDate: '2023-01-15',
      lastLogin: '2024-01-20',
      posts: Math.floor(Math.random() * 50),
      followers: Math.floor(Math.random() * 1000)
    }
  };
};

// Componente lista utenti
function UserList() {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minuti
    cacheTime: 10 * 60 * 1000, // 10 minuti
  });
  
  if (isLoading) {
    return (
      <div style={{ 
        padding: 20, 
        textAlign: 'center',
        border: '2px dashed #007bff',
        borderRadius: 8,
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ fontSize: 18, marginBottom: 12 }}>🔄 Caricamento utenti...</div>
        <div style={{ 
          width: 40, 
          height: 40, 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div style={{
        padding: 20,
        border: '2px solid #dc3545',
        borderRadius: 8,
        backgroundColor: '#f8d7da',
        color: '#721c24'
      }}>
        <h3 style={{ margin: '0 0 12px 0' }}>❌ Errore nel Caricamento</h3>
        <p style={{ margin: '0 0 16px 0' }}>{error.message}</p>
        <button
          onClick={() => refetch()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          🔄 Riprova
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20
      }}>
        <h3 style={{ margin: 0 }}>👥 Lista Utenti ({users.length})</h3>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            padding: '8px 12px',
            backgroundColor: isFetching ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: isFetching ? 'not-allowed' : 'pointer'
          }}
        >
          {isFetching ? '🔄 Aggiornamento...' : '🔄 Aggiorna'}
        </button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

// Componente card utente
function UserCard({ user }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: 8,
      padding: 16,
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          marginRight: 12
        }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: 16 }}>{user.name}</h4>
          <div style={{ fontSize: 12, color: '#6c757d' }}>{user.email}</div>
        </div>
      </div>
      
      <div style={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: user.role === 'Admin' ? '#dc3545' : 
                        user.role === 'Editor' ? '#ffc107' : '#28a745',
        color: user.role === 'Admin' ? 'white' : 
               user.role === 'Editor' ? '#212529' : 'white'
      }}>
        {user.role}
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          marginTop: 12,
          padding: '6px 12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 12
        }}
      >
        {showDetails ? '👁️ Nascondi' : '👁️ Dettagli'}
      </button>
      
      {showDetails && <UserDetails userId={user.id} />}
    </div>
  );
}

// Componente dettagli utente con query dipendente
function UserDetails({ userId }) {
  const {
    data: userDetails,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Esegui solo se userId esiste
  });
  
  if (isLoading) {
    return (
      <div style={{ 
        marginTop: 12, 
        padding: 12, 
        backgroundColor: '#f8f9fa',
        borderRadius: 4,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 12 }}>Caricamento dettagli...</div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div style={{ 
        marginTop: 12, 
        padding: 12, 
        backgroundColor: '#f8d7da',
        borderRadius: 4,
        color: '#721c24',
        fontSize: 12
      }}>
        Errore: {error.message}
      </div>
    );
  }
  
  return (
    <div style={{ 
      marginTop: 12, 
      padding: 12, 
      backgroundColor: '#e7f3ff',
      borderRadius: 4,
      fontSize: 12
    }}>
      <div><strong>Data iscrizione:</strong> {userDetails.details.joinDate}</div>
      <div><strong>Ultimo accesso:</strong> {userDetails.details.lastLogin}</div>
      <div><strong>Posts:</strong> {userDetails.details.posts}</div>
      <div><strong>Followers:</strong> {userDetails.details.followers}</div>
    </div>
  );
}

// Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minuti
      cacheTime: 10 * 60 * 1000, // 10 minuti
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente principale
export default function BasicQueryExample() {
  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 React Query - Basic useQuery</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Esempio di base con useQuery per il data fetching, gestione cache e query dipendenti.
      </p>
      
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
      
      <div style={{
        marginTop: 32,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Funzionalità Dimostrate:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>useQuery Base:</strong> Caricamento automatico con stati loading/error</li>
          <li><strong>Cache Intelligente:</strong> Dati condivisi tra componenti</li>
          <li><strong>Refetch:</strong> Ricaricamento manuale con pulsante</li>
          <li><strong>Query Dipendenti:</strong> Dettagli caricati solo quando necessario</li>
          <li><strong>Error Handling:</strong> Gestione errori con retry</li>
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
