// Demo16 - Suspense e Transitions per il playground
import React, { Suspense, useState, useTransition, useDeferredValue, useMemo } from 'react';

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

interface Resource<T> {
  read: () => T
}

// Simulazione risorsa che sospende
function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T | Error;
  
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
    read(): T {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      }
      // status === 'success'
      return result as T;
    }
  };
}

// Componente che sospende
interface UserCardProps {
  userId: number
}

function UserCard({ userId }: UserCardProps): React.JSX.Element {
  const [resource] = useState<Resource<User>>(() => 
    createResource(
      new Promise(resolve => 
        setTimeout(() => resolve({
          id: userId,
          name: `Utente ${userId}`,
          email: `user${userId}@example.com`,
          avatar: `https://i.pravatar.cc/100?u=${userId}`
        }), 1500)
      )
    )
  );
  
  const user = resource.read();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      border: '1px solid #ddd',
      borderRadius: 8,
      backgroundColor: '#f9f9f9'
    }}>
      <img 
        src={user.avatar} 
        alt={user.name}
        style={{ width: 50, height: 50, borderRadius: '50%' }}
      />
      <div>
        <h4 style={{ margin: 0 }}>{user.name}</h4>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{user.email}</p>
      </div>
    </div>
  );
}

// Skeleton per UserCard
function UserCardSkeleton(): React.JSX.Element {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      border: '1px solid #ddd',
      borderRadius: 8,
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        backgroundColor: '#ddd',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div>
        <div style={{
          width: 100,
          height: 16,
          backgroundColor: '#ddd',
          borderRadius: 4,
          marginBottom: 8,
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <div style={{
          width: 150,
          height: 12,
          backgroundColor: '#ddd',
          borderRadius: 4,
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </div>
    </div>
  );
}

// Demo Suspense
function SuspenseDemo(): React.JSX.Element {
  const [userId, setUserId] = useState<number>(1);
  const [key, setKey] = useState<number>(0);
  
  return (
    <div style={{ marginBottom: 32 }}>
      <h3>🎭 Demo Suspense</h3>
      <div style={{ marginBottom: 16 }}>
        <button 
          onClick={() => {
            setUserId(prev => prev + 1);
            setKey(prev => prev + 1);
          }}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginRight: 8
          }}
        >
          Carica Prossimo Utente
        </button>
        <button 
          onClick={() => setKey(prev => prev + 1)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#28a745',
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
        <p style={{ margin: '0 0 12px 0', fontSize: 14, color: '#007bff', fontWeight: 'bold' }}>
          Suspense Boundary
        </p>
        <Suspense fallback={<UserCardSkeleton />}>
          <UserCard key={key} userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

interface Item {
  id: number
  name: string
  category: string
}

// Demo Transitions
function TransitionsDemo(): React.JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<Item[]>([]);
  
  // Simulazione dati
  const allItems = useMemo<Item[]>(() => 
    Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Elemento ${i + 1}`,
      category: ['Tech', 'Sport', 'Casa', 'Auto'][i % 4]
    }))
  , []);
  
  const deferredQuery = useDeferredValue(query);
  
  // Ricerca pesante
  const searchResults = useMemo<Item[]>(() => {
    if (!deferredQuery.trim()) return allItems.slice(0, 10);
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [deferredQuery, allItems]);
  
  const handleSearch = (value: string) => {
    setQuery(value); // Urgente
    
    startTransition(() => {
      setResults(searchResults); // Non urgente
    });
  };
  
  return (
    <div>
      <h3>⚡ Demo Transitions</h3>
      
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cerca elementi..."
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            border: '2px solid #ddd',
            borderRadius: 8,
            outline: 'none',
            backgroundColor: isPending ? '#f8f9fa' : 'white'
          }}
        />
      </div>
      
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 16,
        fontSize: 14
      }}>
        <span style={{
          padding: '4px 8px',
          borderRadius: 4,
          backgroundColor: query !== deferredQuery ? '#ffeaa7' : '#d4edda',
          fontWeight: 'bold'
        }}>
          Query: "{query}"
        </span>
        <span style={{
          padding: '4px 8px',
          borderRadius: 4,
          backgroundColor: isPending ? '#ffcccc' : '#ccffcc',
          fontWeight: 'bold'
        }}>
          {isPending ? 'PENDING' : 'IDLE'}
        </span>
      </div>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        maxHeight: 300,
        overflowY: 'auto',
        opacity: isPending ? 0.7 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        <div style={{ marginBottom: 12, fontWeight: 'bold' }}>
          {results.length} risultati trovati
        </div>
        {results.slice(0, 20).map(item => (
          <div key={item.id} style={{
            padding: 8,
            marginBottom: 4,
            backgroundColor: '#f8f9fa',
            borderRadius: 4,
            fontSize: 14
          }}>
            <strong>{item.name}</strong> - {item.category}
          </div>
        ))}
        {results.length > 20 && (
          <div style={{ textAlign: 'center', color: '#666', fontSize: 12, marginTop: 8 }}>
            ... e altri {results.length - 20} risultati
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principale
export default function Demo16(): React.JSX.Element {
  return (
    <div style={{ padding: 20 }}>
      <h2>🚀 Lezione 16: Suspense e Transitions</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Scopri come migliorare l'UX con caricamenti intelligenti e aggiornamenti non bloccanti.
      </p>
      
      <SuspenseDemo />
      <TransitionsDemo />
      
      <div style={{
        marginTop: 32,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Concetti Chiave:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>Suspense:</strong> Gestisce stati di caricamento con fallback eleganti</li>
          <li><strong>Transitions:</strong> Distingue aggiornamenti urgenti da non urgenti</li>
          <li><strong>useDeferredValue:</strong> Ottimizza performance con valori differiti</li>
          <li><strong>UX migliorata:</strong> Interfacce più reattive e fluide</li>
        </ul>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
