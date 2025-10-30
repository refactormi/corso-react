import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

/**
 * Esempio 1: Cache Configuration - Gestione Cache Base
 * 
 * Questo esempio dimostra come configurare la cache di React Query:
 * - Stale time (quando i dati sono considerati freschi)
 * - Cache time / gcTime (quanto tempo i dati rimangono in cache)
 * - Refetch policies (quando ricaricare i dati)
 * - Query invalidation (forzare ricaricamento)
 */

// Simulazione API
interface User {
  id: number
  name: string
  email: string
  role: string
}

const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'Admin' },
    { id: 2, name: 'Anna Verdi', email: 'anna@example.com', role: 'User' },
    { id: 3, name: 'Luca Bianchi', email: 'luca@example.com', role: 'Editor' },
  ]
}

const fetchUser = async (userId: number): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const users = await fetchUsers()
  const user = users.find(u => u.id === userId)
  if (!user) throw new Error('User not found')
  return user
}

// Componente che mostra configurazione cache
function CacheConfigurationDemo(): JSX.Element {
  const queryClient = useQueryClient()
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false)
  
  // Query con stale time di 5 minuti
  const { data: users, isLoading, isFetching, dataUpdatedAt } = useQuery<User[]>({
    queryKey: ['users-cache-demo'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minuti
    gcTime: 10 * 60 * 1000, // 10 minuti
    refetchOnWindowFocus: false,
  })
  
  // Query dipendente per dettagli utente
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { data: user } = useQuery<User>({
    queryKey: ['user-cache-demo', selectedUserId],
    queryFn: () => fetchUser(selectedUserId!),
    enabled: selectedUserId !== null,
    staleTime: 2 * 60 * 1000, // 2 minuti per dettagli
  })
  
  const handleInvalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: ['users-cache-demo'] })
  }
  
  const handleInvalidateAll = (): void => {
    queryClient.invalidateQueries({ queryKey: ['users-cache-demo'], exact: false })
  }
  
  const handleRefresh = (): void => {
    queryClient.refetchQueries({ queryKey: ['users-cache-demo'] })
  }
  
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>Cache Configuration Demo</h2>
      
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0 }}>Configurazione Cache</h3>
        <ul>
          <li><strong>Stale Time:</strong> 5 minuti (dati freschi per 5 minuti)</li>
          <li><strong>Cache Time:</strong> 10 minuti (dati rimangono in cache per 10 minuti)</li>
          <li><strong>Refetch on Window Focus:</strong> Disabilitato</li>
        </ul>
        <div style={{ marginTop: '12px', fontSize: '14px', color: '#6c757d' }}>
          <strong>Ultimo aggiornamento:</strong> {lastUpdated}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            opacity: isFetching ? 0.6 : 1
          }}
        >
          {isFetching ? 'Refreshing...' : 'Refetch'}
        </button>
        <button
          onClick={handleInvalidate}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Invalidate Cache
        </button>
        <button
          onClick={handleInvalidateAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Invalidate All
        </button>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading users...</div>
        </div>
      ) : (
        <div>
          <h3>Users List</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users?.map(user => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUserId(user.id)
                  setShowUserDetails(true)
                }}
                style={{
                  padding: '12px',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedUserId === user.id ? '#e7f3ff' : 'white',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>{user.email}</div>
              </div>
            ))}
          </div>
          
          {showUserDetails && user && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffc107'
            }}>
              <h3>User Details (from cache)</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <button
                onClick={() => setShowUserDetails(false)}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
      
      {isFetching && !isLoading && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#d1ecf1',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#0c5460'
        }}>
          🔄 Background refresh in corso...
        </div>
      )}
    </div>
  )
}

// Provider wrapper
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

export default function CacheConfigurationExample(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <CacheConfigurationDemo />
    </QueryClientProvider>
  )
}

