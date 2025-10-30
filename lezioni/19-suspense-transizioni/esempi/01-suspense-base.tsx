// Esempio 1: Suspense Base - Caricamento dati con fallback
import { Suspense, useState, useEffect } from 'react';

// Simulazione di una risorsa che "sospende"
function createResource(promise) {
  let status = 'pending';
  let result;
  
  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (error) => {
      status = 'error';
      result = error;
    }
  );
  
  return {
    read() {
      if (status === 'pending') {
        throw suspender; // Questo causa la "sospensione"
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  };
}

// Simulazione API
const fetchUserData = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: `Utente ${userId}`,
        email: `user${userId}@example.com`,
        avatar: `https://i.pravatar.cc/150?u=${userId}`
      });
    }, 2000); // 2 secondi di delay
  });
};

// Componente che sospende durante il caricamento
function UserProfile({ userId }) {
  // Crea la risorsa che causerà la sospensione
  const [resource] = useState(() => createResource(fetchUserData(userId)));
  
  // Questo read() causerà la sospensione se i dati non sono pronti
  const userData = resource.read();
  
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: 8, 
      padding: 16, 
      margin: 16,
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img 
          src={userData.avatar} 
          alt={userData.name}
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />
        <div>
          <h3 style={{ margin: 0, color: '#333' }}>{userData.name}</h3>
          <p style={{ margin: 0, color: '#666' }}>{userData.email}</p>
          <small style={{ color: '#999' }}>ID: {userData.id}</small>
        </div>
      </div>
    </div>
  );
}

// Componente di fallback personalizzato
function UserProfileSkeleton() {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: 8, 
      padding: 16, 
      margin: 16,
      backgroundColor: '#f0f0f0',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          backgroundColor: '#ddd' 
        }} />
        <div>
          <div style={{ 
            width: 120, 
            height: 20, 
            backgroundColor: '#ddd', 
            borderRadius: 4, 
            marginBottom: 8 
          }} />
          <div style={{ 
            width: 180, 
            height: 16, 
            backgroundColor: '#ddd', 
            borderRadius: 4, 
            marginBottom: 4 
          }} />
          <div style={{ 
            width: 60, 
            height: 12, 
            backgroundColor: '#ddd', 
            borderRadius: 4 
          }} />
        </div>
      </div>
    </div>
  );
}

// Componente principale con Suspense
export default function SuspenseBaseExample() {
  const [userId, setUserId] = useState(1);
  const [key, setKey] = useState(0);

  const handleUserChange = (newUserId) => {
    setUserId(newUserId);
    setKey(prev => prev + 1); // Force re-mount per simulare nuovo caricamento
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎭 Suspense Base - Caricamento Dati</h2>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Seleziona Utente:</label>
        <select 
          value={userId} 
          onChange={(e) => handleUserChange(Number(e.target.value))}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value={1}>Utente 1</option>
          <option value={2}>Utente 2</option>
          <option value={3}>Utente 3</option>
        </select>
        <button 
          onClick={() => setKey(prev => prev + 1)}
          style={{ 
            marginLeft: 10, 
            padding: '8px 12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          🔄 Ricarica
        </button>
      </div>

      <div style={{ 
        border: '2px dashed #007bff', 
        borderRadius: 8, 
        padding: 16,
        backgroundColor: '#f8f9fa'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
          Suspense Boundary
        </h4>
        
        <Suspense fallback={<UserProfileSkeleton />}>
          <UserProfile key={key} userId={userId} />
        </Suspense>
      </div>

      <div style={{ marginTop: 20, padding: 16, backgroundColor: '#e9ecef', borderRadius: 8 }}>
        <h4>💡 Come Funziona:</h4>
        <ol style={{ margin: 0 }}>
          <li>Il componente <code>UserProfile</code> tenta di leggere i dati</li>
          <li>Se i dati non sono pronti, il componente "sospende" (throw Promise)</li>
          <li>React mostra il <code>fallback</code> del Suspense più vicino</li>
          <li>Quando i dati sono pronti, React ri-renderizza il componente</li>
        </ol>
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
