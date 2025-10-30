# Lezione 18: Introduzione a React Query - Gestione Stato Server

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è React Query e perché è fondamentale per le app moderne
- Distinguere tra stato client e stato server
- Configurare React Query in un'applicazione React
- Utilizzare `useQuery` per il data fetching
- Implementare `useMutation` per le operazioni di scrittura
- Gestire loading, errori e cache automaticamente
- Applicare pattern avanzati per UX ottimale
- Implementare best practices per React Query

## Teoria

### 1. Introduzione a React Query

#### Cos'è React Query?
React Query (ora TanStack Query) è una libreria per la gestione dello stato server nelle applicazioni React. Risolve i problemi complessi del data fetching, caching, sincronizzazione e aggiornamenti in tempo reale.

#### Perché React Query?

**Problemi del Data Fetching Tradizionale:**

```tsx
// ❌ Approccio tradizionale con useState/useEffect
function UserProfile({ userId }: { userId: number }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    setError(null)
    
    fetchUser(userId)
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [userId])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>Hello, {user?.name}!</div>
}
```

**Problemi:**
- 🔄 **Duplicazione**: Stesso codice in ogni componente
- 🚫 **No Cache**: Richieste duplicate per gli stessi dati
- ⏰ **No Background Updates**: Dati mai aggiornati automaticamente
- 🐛 **Race Conditions**: Richieste che si sovrappongono
- 📱 **No Offline Support**: App inutilizzabile senza rete

**Soluzione con React Query:**

```tsx
// ✅ Approccio con React Query
function UserProfile({ userId }: { userId: number }): JSX.Element {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>Hello, {user?.name}!</div>
}
```

**Vantaggi:**
- ✅ **Cache Intelligente**: Dati condivisi tra componenti
- ✅ **Background Updates**: Aggiornamenti automatici
- ✅ **Deduplication**: Una sola richiesta per query identiche
- ✅ **Error Handling**: Gestione errori centralizzata
- ✅ **Offline Support**: Funziona anche offline

**Vedi esempio completo**: [`esempi/01-basic-query.tsx`](esempi/01-basic-query.tsx)

### 2. Concetti Fondamentali

#### Stato Client vs Stato Server

```tsx
// STATO CLIENT - Gestito da React
const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
const [selectedTab, setSelectedTab] = useState<string>('home')
const [formData, setFormData] = useState<FormData>({})

// STATO SERVER - Gestito da React Query
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers
})
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts
})
const { data: profile } = useQuery({
  queryKey: ['profile'],
  queryFn: fetchProfile
})
```

**Stato Client:**
- UI state (modal aperto/chiuso, tab attivo)
- Form state (input values)
- Preferenze locali

**Stato Server:**
- Dati dal database
- API responses
- Dati condivisi tra utenti

#### Query Keys - Il Sistema di Cache

```tsx
// Query key semplice
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers
})

// Query key con parametri
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId)
})

// Query key complessa
useQuery({
  queryKey: ['posts', { status: 'published', page: 1 }],
  queryFn: () => fetchPosts({ status: 'published', page: 1 })
})
```

**Regole delle Query Keys:**
- Array di valori che identificano univocamente la query
- Cambio di key = nuova query
- Stesso key = stessi dati dalla cache

### 3. Setup di React Query

#### Installazione

```bash
npm install @tanstack/react-query
```

#### Configurazione Base

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Crea il client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minuti
      gcTime: 10 * 60 * 1000, // 10 minuti (ex cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

interface AppProps {
  children: ReactNode
}

// Wrappa l'app
function App({ children }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 4. useQuery - Data Fetching

#### Sintassi Base

```tsx
import { useQuery } from '@tanstack/react-query'

interface User {
  id: number
  name: string
  email: string
}

function UserList(): JSX.Element {
  const {
    data,           // Dati della query
    isLoading,      // Prima volta che carica
    isFetching,     // Sta caricando (anche background)
    error,          // Errore se presente
    refetch,        // Funzione per ricaricare
    isSuccess,      // Query completata con successo
    isError,        // Query fallita
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
  
  if (isLoading) return <div>Loading users...</div>
  if (isError) return <div>Error: {error?.message}</div>
  
  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

#### Opzioni Avanzate

```tsx
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

const { data, isLoading, error } = useQuery<User>({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  
  // Opzioni di cache
  staleTime: 5 * 60 * 1000, // 5 minuti
  gcTime: 10 * 60 * 1000, // 10 minuti
  
  // Condizioni
  enabled: !!userId, // Esegui solo se userId esiste
  
  // Retry
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  // Callbacks
  onSuccess: (data) => {
    console.log('User loaded:', data)
  },
  onError: (error) => {
    console.error('Failed to load user:', error)
  },
  
  // Trasformazione dati
  select: (data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`
  }),
})
```

**Vedi esempio completo**: [`esempi/01-basic-query.tsx`](esempi/01-basic-query.tsx)

### 5. useMutation - Operazioni di Scrittura

#### Sintassi Base

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface NewUser {
  name: string
  email: string
  role: string
}

function CreateUser(): JSX.Element {
  const queryClient = useQueryClient()
  
  const mutation = useMutation<User, Error, NewUser>({
    mutationFn: (newUser) => {
      return fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).then(res => res.json())
    },
    onSuccess: () => {
      // Invalida e ricarica la lista utenti
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
  
  const handleSubmit = (formData: NewUser): void => {
    mutation.mutate(formData)
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      handleSubmit({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as string
      })
    }}>
      <input name="name" placeholder="Nome" />
      <input name="email" placeholder="Email" />
      <button 
        type="submit" 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {mutation.isError && (
        <div>Error: {mutation.error?.message}</div>
      )}
    </form>
  )
}
```

**Vedi esempio completo**: [`esempi/02-mutations-crud.tsx`](esempi/02-mutations-crud.tsx)

### 6. Pattern Comuni

#### Pattern 1: Lista con Dettaglio

```tsx
function UserList(): JSX.Element {
  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers
  })
  const queryClient = useQueryClient()
  
  const handleUserHover = (userId: number): void => {
    // Precarica dettagli utente al hover
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId)
    })
  }
  
  return (
    <div>
      {users?.map(user => (
        <div 
          key={user.id}
          onMouseEnter={() => handleUserHover(user.id)}
        >
          {user.name}
        </div>
      ))}
    </div>
  )
}
```

#### Pattern 2: Ricerca con Debouncing

```tsx
import { useState, useDeferredValue } from 'react'
import { useQuery } from '@tanstack/react-query'

function SearchUsers(): JSX.Element {
  const [search, setSearch] = useState<string>('')
  const deferredSearch = useDeferredValue(search)
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users', 'search', deferredSearch],
    queryFn: () => searchUsers(deferredSearch),
    enabled: deferredSearch.length > 2, // Cerca solo con 3+ caratteri
  })
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cerca utenti..."
      />
      {isLoading && <div>Searching...</div>}
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

#### Pattern 3: Paginazione

```tsx
function PostList(): JSX.Element {
  const [page, setPage] = useState<number>(1)
  
  const { data, isLoading } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    keepPreviousData: true, // Mantieni dati precedenti durante il caricamento
  })
  
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {data?.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button 
        onClick={() => setPage(p => p - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      <button 
        onClick={() => setPage(p => p + 1)}
        disabled={!data?.hasNextPage}
      >
        Next
      </button>
    </div>
  )
}
```

**Vedi esempio completo**: [`esempi/03-advanced-patterns.tsx`](esempi/03-advanced-patterns.tsx)

### 7. Best Practices

#### Do's

**1. Query Keys Consistenti**

```tsx
// ✅ Buono: Struttura consistente
['users'] // Lista utenti
['user', userId] // Utente specifico
['user', userId, 'posts'] // Posts dell'utente
```

**2. Optimistic Updates per UX**

```tsx
// ✅ Buono: Update ottimistico per azioni veloci
const likeMutation = useMutation({
  mutationFn: likePost,
  onMutate: async (postId: number) => {
    // Cancella query in corso per evitare override
    await queryClient.cancelQueries({ queryKey: ['post', postId] })
    
    // Snapshot del valore precedente
    const previousPost = queryClient.getQueryData(['post', postId])
    
    // Update ottimistico immediato
    queryClient.setQueryData(['post', postId], (old: Post) => ({
      ...old,
      likes: old.likes + 1,
      isLiked: true
    }))
    
    return { previousPost }
  },
  onError: (err, postId, context) => {
    // Rollback in caso di errore
    queryClient.setQueryData(['post', postId], context?.previousPost)
  },
  onSettled: (data, error, postId) => {
    // Ricarica per sincronizzare
    queryClient.invalidateQueries({ queryKey: ['post', postId] })
  },
})
```

**3. Usare Query Key Factories**

```tsx
// ✅ Buono: Query keys organizzate
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

// Utilizzo
useQuery({ queryKey: userKeys.list('active'), queryFn: fetchActiveUsers })
useQuery({ queryKey: userKeys.detail(1), queryFn: () => fetchUser(1) })
```

#### Don'ts

**1. Query Keys Inconsistenti**

```tsx
// ❌ Sbagliato: Strutture diverse
['users']
['userList']
['getAllUsers']
```

**2. Fetch in useEffect**

```tsx
// ❌ Sbagliato: useEffect quando hai React Query
useEffect(() => {
  fetchUsers().then(setUsers)
}, [])
```

**3. Mutations senza Cache Invalidation**

```tsx
// ❌ Sbagliato: Cache non aggiornata dopo mutation
const mutation = useMutation({
  mutationFn: createUser,
  // Manca onSuccess per invalidare cache
})
```

### 8. Errori Comuni da Evitare

#### Errore 1: Non Gestire gli Stati di Loading

```tsx
// ❌ Problema: user può essere undefined
function UserProfile({ userId }: { userId: number }): JSX.Element {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })
  
  return <div>{user.name}</div> // Errore se user è undefined!
}

// ✅ Soluzione: Gestisci loading e errori
function UserProfile({ userId }: { userId: number }): JSX.Element {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return null
  
  return <div>{user.name}</div>
}
```

#### Errore 2: Query Keys che Cambiano Troppo Spesso

```tsx
// ❌ Problema: Nuova query ad ogni render
function Component(): JSX.Element {
  const [filters, setFilters] = useState({})
  
  const { data } = useQuery({
    queryKey: ['users', filters], // Oggetto nuovo ogni render!
    queryFn: () => fetchUsers(filters)
  })
}

// ✅ Soluzione: Serializza la query key
function Component(): JSX.Element {
  const [filters, setFilters] = useState({})
  
  const { data } = useQuery({
    queryKey: ['users', JSON.stringify(filters)], // Stabile
    queryFn: () => fetchUsers(filters)
  })
}
```

#### Errore 3: Non Invalidare Cache Dopo Mutations

```tsx
// ❌ Problema: Lista non si aggiorna dopo creazione
const mutation = useMutation({
  mutationFn: createUser,
  // Manca invalidazione cache
})

// ✅ Soluzione: Invalida cache dopo successo
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
})
```

## Esempi Pratici

### Esempio 1: Basic Query

Un esempio semplice che mostra l'uso base di `useQuery` per il data fetching.

**Vedi**: [`esempi/01-basic-query.tsx`](esempi/01-basic-query.tsx)

**Caratteristiche**:
- useQuery base con loading e error handling
- Query dipendenti da parametri
- Cache automatica
- Refetch manuale

### Esempio 2: Mutations e CRUD

Esempio completo che mostra operazioni CRUD con `useMutation`.

**Vedi**: [`esempi/02-mutations-crud.tsx`](esempi/02-mutations-crud.tsx)

**Caratteristiche**:
- Create, Read, Update, Delete
- Cache invalidation
- Optimistic updates
- Error recovery

### Esempio 3: Pattern Avanzati

Esempio che mostra pattern avanzati per applicazioni reali.

**Vedi**: [`esempi/03-advanced-patterns.tsx`](esempi/03-advanced-patterns.tsx)

**Caratteristiche**:
- Paginazione
- Ricerca con debouncing
- Prefetch intelligente
- Ottimizzazioni UX

## Riepilogo

In questa lezione hai imparato:
- ✅ Cos'è React Query e perché è importante
- ✅ Come configurare React Query in un'applicazione
- ✅ Come usare `useQuery` per il data fetching
- ✅ Come usare `useMutation` per operazioni di scrittura
- ✅ Pattern comuni (lista/dettaglio, ricerca, paginazione)
- ✅ Best practices e errori comuni da evitare

## Prossimi Passi

Dopo aver compreso React Query base, nella prossima lezione imparerai:
- **Lezione 18a (React Query Cache)**: Gestione cache avanzata, stale time, cache time, refetch policies
- **Lezione 18b (Debug e Monitoraggio)**: DevTools, debugging, monitoraggio performance

## Risorse Aggiuntive

- **[TanStack Query Documentation](https://tanstack.com/query/latest)**
- **[React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)**
- **[Query Key Factories](https://tkdodo.eu/blog/effective-react-query-keys)**

**Ricorda**: React Query è progettato per semplificare la gestione dello stato server. Non sovraccaricare con configurazioni complesse finché non è necessario!
