# Lezione 18a: React Query Cache - Ottimizzazione Cache e Performance

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere il sistema di cache di React Query
- Gestire stale time e cache time (gcTime)
- Implementare refetch policies intelligenti
- Utilizzare query invalidation e prefetching
- Ottimizzare le performance con cache strategica
- Implementare query dipendenti e parallele
- Gestire cache persistence e sincronizzazione

## Teoria

### 1. Introduzione alla Cache di React Query

#### Cos'è la Cache?
La cache di React Query è un sistema intelligente che memorizza i risultati delle query per evitare richieste duplicate e migliorare le performance dell'applicazione.

#### Vantaggi della Cache:
- ✅ **Performance**: Evita richieste duplicate
- ✅ **UX Migliore**: Dati disponibili istantaneamente
- ✅ **Riduzione Bandwidth**: Meno chiamate al server
- ✅ **Offline Support**: Dati disponibili anche senza connessione
- ✅ **Background Updates**: Aggiornamenti automatici senza bloccare l'UI

### 2. Concetti Fondamentali della Cache

#### Stale Time

`staleTime` determina per quanto tempo i dati sono considerati "freschi" e non necessitano di essere ricaricati.

```tsx
import { useQuery } from '@tanstack/react-query'

// Dati freschi per 5 minuti
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minuti
})

// Dati sempre freschi (non ricarica mai automaticamente)
const { data } = useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  staleTime: Infinity,
})

// Dati sempre stale (ricarica sempre)
const { data } = useQuery({
  queryKey: ['realtime'],
  queryFn: fetchRealtimeData,
  staleTime: 0,
})
```

**Quando Usare Stale Time:**
- Dati che cambiano raramente: `staleTime: Infinity`
- Dati che cambiano periodicamente: `staleTime: 5 * 60 * 1000` (5 minuti)
- Dati in tempo reale: `staleTime: 0`

#### Cache Time (gcTime)

`gcTime` (ex `cacheTime`) determina per quanto tempo i dati inattivi rimangono in cache prima di essere eliminati.

```tsx
// Dati rimangono in cache per 10 minuti dopo che nessun componente li usa
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  gcTime: 10 * 60 * 1000, // 10 minuti
})

// Dati rimangono in cache indefinitamente
const { data } = useQuery({
  queryKey: ['preferences'],
  queryFn: fetchPreferences,
  gcTime: Infinity,
})

// Dati eliminati immediatamente quando non utilizzati
const { data } = useQuery({
  queryKey: ['temp'],
  queryFn: fetchTempData,
  gcTime: 0,
})
```

**Quando Usare Cache Time:**
- Dati importanti: `gcTime: Infinity`
- Dati temporanei: `gcTime: 5 * 60 * 1000`
- Dati usa-e-getta: `gcTime: 0`

### 3. Refetch Policies

Le refetch policies determinano quando React Query ricarica automaticamente i dati.

```tsx
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  
  // Non ricaricare quando la finestra riprende focus
  refetchOnWindowFocus: false,
  
  // Non ricaricare quando si riconnette alla rete
  refetchOnReconnect: false,
  
  // Non ricaricare quando si monta il componente
  refetchOnMount: false,
  
  // Ricarica automaticamente ogni X millisecondi
  refetchInterval: 30 * 1000, // Ogni 30 secondi
  
  // Ricarica solo quando la finestra è visibile
  refetchIntervalInBackground: false,
})
```

#### Configurazione Globale

```tsx
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minuti
      gcTime: 10 * 60 * 1000, // 10 minuti
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})
```

### 4. Query Invalidation

Invalidare una query forza il ricaricamento dei dati.

```tsx
import { useQueryClient } from '@tanstack/react-query'

function UserList(): JSX.Element {
  const queryClient = useQueryClient()
  
  // Invalida una query specifica
  const handleRefresh = (): void => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
  
  // Invalida tutte le query che iniziano con 'users'
  const handleRefreshAll = (): void => {
    queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
  }
  
  // Invalida con filtro
  const handleRefreshActive = (): void => {
    queryClient.invalidateQueries({
      queryKey: ['users'],
      predicate: (query) => query.state.data?.status === 'active'
    })
  }
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={handleRefreshAll}>Refresh All</button>
    </div>
  )
}
```

### 5. Prefetching Intelligente

Il prefetching carica i dati prima che siano necessari, migliorando la UX.

```tsx
import { useQueryClient } from '@tanstack/react-query'

function UserList(): JSX.Element {
  const queryClient = useQueryClient()
  
  // Prefetch al hover
  const handleUserHover = (userId: number): void => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 5 * 60 * 1000, // Prefetch valido per 5 minuti
    })
  }
  
  // Prefetch al click
  const handleUserClick = (userId: number): void => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })
  }
  
  // Prefetch pagina successiva
  const handleNextPage = (): void => {
    const nextPage = currentPage + 1
    queryClient.prefetchQuery({
      queryKey: ['users', nextPage],
      queryFn: () => fetchUsers(nextPage),
    })
  }
  
  return (
    <div>
      {users.map(user => (
        <div
          key={user.id}
          onMouseEnter={() => handleUserHover(user.id)}
          onClick={() => handleUserClick(user.id)}
        >
          {user.name}
        </div>
      ))}
    </div>
  )
}
```

### 6. Query Dipendenti

Le query dipendenti vengono eseguite solo dopo che un'altra query è completata.

```tsx
function UserProfile({ userId }: { userId: number }): JSX.Element {
  // Prima query: carica utente
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })
  
  // Seconda query: dipende da user
  const { data: posts } = useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Esegui solo se user è caricato
  })
  
  // Terza query: dipende da posts
  const { data: stats } = useQuery({
    queryKey: ['user', userId, 'stats'],
    queryFn: () => calculateStats(posts),
    enabled: !!posts && posts.length > 0,
  })
  
  if (!user) return <div>Loading user...</div>
  if (!posts) return <div>Loading posts...</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Posts: {posts.length}</p>
      {stats && <p>Stats: {stats.totalViews}</p>}
    </div>
  )
}
```

### 7. Query Parallele

Eseguire più query contemporaneamente migliora le performance.

```tsx
import { useQueries } from '@tanstack/react-query'

function UserDashboard({ userIds }: { userIds: number[] }): JSX.Element {
  // Esegui tutte le query in parallelo
  const userQueries = useQueries({
    queries: userIds.map(userId => ({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })),
  })
  
  const isLoading = userQueries.some(query => query.isLoading)
  const users = userQueries.map(query => query.data).filter(Boolean)
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### 8. Cache Persistence

Salvare la cache per riutilizzarla dopo il reload della pagina.

```tsx
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 ore
    },
  },
})

// Persist cache in localStorage
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 ore
})
```

### 9. Ottimizzazioni Avanzate

#### Selective Refetching

Ricarica solo i dati necessari.

```tsx
// Ricarica solo se i dati sono più vecchi di 5 minuti
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
  refetchOnMount: 'always', // 'always' | boolean
})
```

#### Background Refetching

Aggiorna i dati in background senza bloccare l'UI.

```tsx
const { data, isFetching } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000,
  refetchInterval: 30 * 1000, // Aggiorna ogni 30 secondi
  refetchIntervalInBackground: true, // Anche quando tab non è attiva
})

// Mostra indicatore di aggiornamento senza bloccare UI
return (
  <div>
    {isFetching && <div>Aggiornamento in corso...</div>}
    {data?.map(user => <div key={user.id}>{user.name}</div>)}
  </div>
)
```

### 10. Best Practices

#### Do's

**1. Configura Stale Time Appropriato**

```tsx
// ✅ Buono: Configurazione basata sul tipo di dato
const userQuery = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // Dati utente cambiano raramente
})

const realtimeQuery = useQuery({
  queryKey: ['realtime'],
  queryFn: fetchRealtimeData,
  staleTime: 0, // Dati in tempo reale
  refetchInterval: 5 * 1000, // Aggiorna ogni 5 secondi
})
```

**2. Usa Prefetching Strategico**

```tsx
// ✅ Buono: Prefetch per migliorare UX
const handleLinkHover = (userId: number): void => {
  queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })
}
```

**3. Invalida Cache Dopo Mutations**

```tsx
// ✅ Buono: Invalida per sincronizzare
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

#### Don'ts

**1. Stale Time Troppo Alto**

```tsx
// ❌ Sbagliato: Dati mai aggiornati
const { data } = useQuery({
  queryKey: ['realtime'],
  queryFn: fetchRealtimeData,
  staleTime: Infinity, // Non si aggiorna mai!
})
```

**2. Cache Time Troppo Basso**

```tsx
// ❌ Sbagliato: Dati eliminati troppo presto
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  gcTime: 0, // Eliminati immediatamente
})
```

**3. Troppe Query Parallele**

```tsx
// ❌ Sbagliato: Troppe richieste simultanee
const queries = useQueries({
  queries: Array.from({ length: 100 }, (_, i) => ({
    queryKey: ['item', i],
    queryFn: () => fetchItem(i),
  })),
})

// ✅ Meglio: Batch o paginazione
const { data } = useQuery({
  queryKey: ['items', page],
  queryFn: () => fetchItemsPage(page),
})
```

## Esempi Pratici

### Esempio 1: Gestione Cache Base

Esempio che mostra la configurazione base della cache con stale time e cache time.

**Vedi**: [`esempi/01-cache-configuration.tsx`](esempi/01-cache-configuration.tsx)

**Caratteristiche**:
- Configurazione stale time
- Configurazione cache time
- Refetch policies
- Invalidation

### Esempio 2: Prefetching e Query Dipendenti

Esempio avanzato che mostra prefetching intelligente e query dipendenti.

**Vedi**: [`esempi/02-prefetch-dependencies.tsx`](esempi/02-prefetch-dependencies.tsx)

**Caratteristiche**:
- Prefetch al hover
- Query dipendenti
- Query parallele
- Ottimizzazioni UX

### Esempio 3: Cache Persistence

Esempio che mostra come persistire la cache per migliorare le performance.

**Vedi**: [`esempi/03-cache-persistence.tsx`](esempi/03-cache-persistence.tsx)

**Caratteristiche**:
- Persistenza in localStorage
- Restore cache al mount
- Gestione errori
- Cleanup

## Riepilogo

In questa lezione hai imparato:
- ✅ Come funziona la cache di React Query
- ✅ Come configurare stale time e cache time
- ✅ Come implementare refetch policies
- ✅ Come usare query invalidation e prefetching
- ✅ Come ottimizzare le performance con cache strategica
- ✅ Come gestire query dipendenti e parallele
- ✅ Come persistire la cache per migliorare UX

## Prossimi Passi

Dopo aver compreso la gestione della cache, nella prossima lezione imparerai:
- **Lezione 18b (Debug e Monitoraggio)**: DevTools, debugging, monitoraggio performance

## Risorse Aggiuntive

- **[TanStack Query Cache Documentation](https://tanstack.com/query/latest/docs/react/guides/caching)**
- **[Query Invalidation Guide](https://tanstack.com/query/latest/docs/react/guides/query-invalidation)**
- **[Prefetching Guide](https://tanstack.com/query/latest/docs/react/guides/prefetching)**

**Ricorda**: La cache è uno strumento potente. Configurala basandoti sulle necessità dei tuoi dati specifici!
