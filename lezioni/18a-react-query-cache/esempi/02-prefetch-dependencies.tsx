import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

/**
 * Esempio 2: Prefetch e Query Dipendenti
 * 
 * Questo esempio mostra:
 * - Prefetching intelligente (caricare dati prima che siano necessari)
 * - Query dipendenti (query che dipendono da altre query)
 * - Query parallele (eseguire più query contemporaneamente)
 * - Ottimizzazioni UX con prefetching
 */

// Simulazione API
interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Post {
  id: number
  title: string
  content: string
  userId: number
}

interface UserStats {
  totalPosts: number
  totalLikes: number
  totalViews: number
}

const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return [
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'Admin' },
    { id: 2, name: 'Anna Verdi', email: 'anna@example.com', role: 'User' },
    { id: 3, name: 'Luca Bianchi', email: 'luca@example.com', role: 'Editor' },
    { id: 4, name: 'Sara Neri', email: 'sara@example.com', role: 'User' },
  ]
}

const fetchUserPosts = async (userId: number): Promise<Post[]> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  return [
    { id: 1, title: 'Post 1', content: 'Content 1', userId },
    { id: 2, title: 'Post 2', content: 'Content 2', userId },
    { id: 3, title: 'Post 3', content: 'Content 3', userId },
  ]
}

const fetchUserStats = async (userId: number, posts: Post[]): Promise<UserStats> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return {
    totalPosts: posts.length,
    totalLikes: posts.length * Math.floor(Math.random() * 50),
    totalViews: posts.length * Math.floor(Math.random() * 1000),
  }
}

// Componente principale
function PrefetchDependenciesDemo(): JSX.Element {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  
  // Prima query: lista utenti
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['users-prefetch'],
    queryFn: fetchUsers,
  })
  
  // Seconda query: posts dell'utente (dipende da selectedUserId)
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['user-posts', selectedUserId],
    queryFn: () => fetchUserPosts(selectedUserId!),
    enabled: selectedUserId !== null, // Esegui solo se userId è selezionato
  })
  
  // Terza query: stats dell'utente (dipende da posts)
  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['user-stats', selectedUserId],
    queryFn: () => fetchUserStats(selectedUserId!, posts!),
    enabled: !!posts && posts.length > 0, // Esegui solo se ci sono posts
  })
  
  // Prefetch posts quando l'utente passa il mouse su un utente
  const handleUserHover = (userId: number): void => {
    queryClient.prefetchQuery({
      queryKey: ['user-posts', userId],
      queryFn: () => fetchUserPosts(userId),
      staleTime: 5 * 60 * 1000, // Prefetch valido per 5 minuti
    })
  }
  
  // Prefetch stats quando i posts sono disponibili
  const handlePostsLoaded = (): void => {
    if (selectedUserId && posts) {
      queryClient.prefetchQuery({
        queryKey: ['user-stats', selectedUserId],
        queryFn: () => fetchUserStats(selectedUserId!, posts),
      })
    }
  }
  
  // Query parallele per prefetch di tutti gli utenti
  const prefetchAllUsers = (): void => {
    users?.forEach(user => {
      queryClient.prefetchQuery({
        queryKey: ['user-posts', user.id],
        queryFn: () => fetchUserPosts(user.id),
      })
    })
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>Prefetch e Query Dipendenti</h2>
      
      <div style={{
        padding: '16px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #b3d9ff'
      }}>
        <h3 style={{ marginTop: 0 }}>Come Funziona</h3>
        <ul>
          <li><strong>Prefetch al Hover:</strong> Passa il mouse su un utente per precaricare i suoi posts</li>
          <li><strong>Query Dipendenti:</strong> Stats vengono caricate solo dopo che i posts sono disponibili</li>
          <li><strong>Query Parallele:</strong> Puoi precaricare tutti gli utenti con un click</li>
        </ul>
        <button
          onClick={prefetchAllUsers}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Prefetch All Users
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Lista Utenti */}
        <div>
          <h3>Users List</h3>
          {usersLoading ? (
            <div>Loading users...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users?.map(user => (
                <div
                  key={user.id}
                  onClick={() => {
                    setSelectedUserId(user.id)
                    // Prefetch stats quando selezioni l'utente
                    if (posts) {
                      handlePostsLoaded()
                    }
                  }}
                  onMouseEnter={() => handleUserHover(user.id)}
                  style={{
                    padding: '12px',
                    border: selectedUserId === user.id ? '2px solid #007bff' : '1px solid #dee2e6',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedUserId === user.id ? '#e7f3ff' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>{user.email}</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    Hover per prefetch posts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Dettagli Utente */}
        <div>
          <h3>User Details</h3>
          {!selectedUserId ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#6c757d',
              border: '2px dashed #dee2e6',
              borderRadius: '8px'
            }}>
              Seleziona un utente per vedere i dettagli
            </div>
          ) : (
            <div>
              {/* Posts (query dipendente) */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ marginTop: 0 }}>Posts</h4>
                {postsLoading ? (
                  <div>Loading posts...</div>
                ) : posts && posts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {posts.map(post => (
                      <div
                        key={post.id}
                        style={{
                          padding: '8px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.title}</div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>{post.content}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No posts found</div>
                )}
              </div>
              
              {/* Stats (query dipendente da posts) */}
              {posts && posts.length > 0 && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '8px',
                  border: '1px solid #ffc107'
                }}>
                  <h4 style={{ marginTop: 0 }}>Stats</h4>
                  {statsLoading ? (
                    <div>Loading stats...</div>
                  ) : stats ? (
                    <div>
                      <p><strong>Total Posts:</strong> {stats.totalPosts}</p>
                      <p><strong>Total Likes:</strong> {stats.totalLikes}</p>
                      <p><strong>Total Views:</strong> {stats.totalViews}</p>
                    </div>
                  ) : (
                    <div>No stats available</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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

export default function PrefetchDependenciesExample(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <PrefetchDependenciesDemo />
    </QueryClientProvider>
  )
}

