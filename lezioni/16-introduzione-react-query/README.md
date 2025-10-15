# Lezione 16: Introduzione a React Query

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è React Query e perché è fondamentale per le app moderne
- Distinguere tra stato client e stato server
- Configurare React Query in un'applicazione React
- Utilizzare `useQuery` per il data fetching
- Implementare `useMutation` per le operazioni di scrittura
- Gestire loading, errori e cache automaticamente

## 📚 Cos'è React Query?

**React Query** (ora **TanStack Query**) è una libreria potentissima per la gestione dello **stato server** nelle applicazioni React. Risolve i problemi complessi del data fetching, caching, sincronizzazione e aggiornamenti in tempo reale.

### Definizione Ufficiale
> "Powerful data synchronization for React. Fetch, cache and update data in your React and React Native applications all without touching any 'global state'." - [TanStack Query](https://tanstack.com/query/latest)

## 🤔 Perché React Query?

### **Problemi del Data Fetching Tradizionale**

```jsx
// ❌ Approccio tradizionale con useState/useEffect
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Hello, {user.name}!</div>;
}
```

**Problemi:**
- 🔄 **Duplicazione**: Stesso codice in ogni componente
- 🚫 **No Cache**: Richieste duplicate per gli stessi dati
- ⏰ **No Background Updates**: Dati mai aggiornati automaticamente
- 🐛 **Race Conditions**: Richieste che si sovrappongono
- 📱 **No Offline Support**: App inutilizzabile senza rete

### **Soluzione con React Query**

```jsx
// ✅ Approccio con React Query
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Hello, {user.name}!</div>;
}
```

**Vantaggi:**
- ✅ **Cache Intelligente**: Dati condivisi tra componenti
- ✅ **Background Updates**: Aggiornamenti automatici
- ✅ **Deduplication**: Una sola richiesta per query identiche
- ✅ **Error Handling**: Gestione errori centralizzata
- ✅ **Offline Support**: Funziona anche offline

## 🏗️ Concetti Fondamentali

### 1. **Stato Client vs Stato Server**

```jsx
// STATO CLIENT - Gestito da React
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('home');
const [formData, setFormData] = useState({});

// STATO SERVER - Gestito da React Query
const { data: users } = useQuery(['users'], fetchUsers);
const { data: posts } = useQuery(['posts'], fetchPosts);
const { data: profile } = useQuery(['profile'], fetchProfile);
```

**Stato Client:**
- UI state (modal aperto/chiuso, tab attivo)
- Form state (input values)
- Preferenze locali

**Stato Server:**
- Dati dal database
- API responses
- Dati condivisi tra utenti

### 2. **Query Keys - Il Sistema di Cache**

```jsx
// Query key semplice
useQuery(['users'], fetchUsers);

// Query key con parametri
useQuery(['user', userId], () => fetchUser(userId));

// Query key complessa
useQuery(['posts', { status: 'published', page: 1 }], 
  () => fetchPosts({ status: 'published', page: 1 })
);
```

**Regole delle Query Keys:**
- Array di valori che identificano univocamente la query
- Cambio di key = nuova query
- Stesso key = stessi dati dalla cache

## ⚙️ Setup di React Query

### **1. Installazione**

```bash
npm install @tanstack/react-query
```

### **2. Configurazione Base**

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crea il client
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

// Wrappa l'app
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
    </QueryClientProvider>
  );
}
```

## 🔍 useQuery - Data Fetching

### **Sintassi Base**

```jsx
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const {
    data,           // Dati della query
    isLoading,      // Prima volta che carica
    isFetching,     // Sta caricando (anche background)
    error,          // Errore se presente
    refetch,        // Funzione per ricaricare
    isSuccess,      // Query completata con successo
    isError,        // Query fallita
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  
  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### **Opzioni Avanzate**

```jsx
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  
  // Opzioni di cache
  staleTime: 5 * 60 * 1000, // 5 minuti
  cacheTime: 10 * 60 * 1000, // 10 minuti
  
  // Condizioni
  enabled: !!userId, // Esegui solo se userId esiste
  
  // Retry
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  // Callbacks
  onSuccess: (data) => {
    console.log('User loaded:', data);
  },
  onError: (error) => {
    console.error('Failed to load user:', error);
  },
  
  // Trasformazione dati
  select: (data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`
  }),
});
```

## ✏️ useMutation - Operazioni di Scrittura

### **Sintassi Base**

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newUser) => {
      return fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).then(res => res.json());
    },
    onSuccess: () => {
      // Invalida e ricarica la lista utenti
      queryClient.invalidateQueries(['users']);
    },
  });
  
  const handleSubmit = (formData) => {
    mutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" />
      <button 
        type="submit" 
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Creating...' : 'Create User'}
      </button>
      {mutation.isError && (
        <div>Error: {mutation.error.message}</div>
      )}
    </form>
  );
}
```

## 🎨 Pattern Comuni

### **1. Lista con Dettaglio**

```jsx
function UserList() {
  const { data: users } = useQuery(['users'], fetchUsers);
  const queryClient = useQueryClient();
  
  const handleUserHover = (userId) => {
    // Precarica dettagli utente al hover
    queryClient.prefetchQuery(['user', userId], () => fetchUser(userId));
  };
  
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
  );
}
```

### **2. Ricerca con Debouncing**

```jsx
function SearchUsers() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'search', deferredSearch],
    queryFn: () => searchUsers(deferredSearch),
    enabled: deferredSearch.length > 2, // Cerca solo con 3+ caratteri
  });
  
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
  );
}
```

## 🎯 Best Practices

### ✅ **Do's**

1. **Query Keys Consistenti**
```jsx
// ✅ Buono: Struttura consistente
['users'] // Lista utenti
['user', userId] // Utente specifico
['user', userId, 'posts'] // Posts dell'utente
```

2. **Optimistic Updates per UX**
```jsx
// ✅ Buono: Update ottimistico per azioni veloci
const likeMutation = useMutation({
  mutationFn: likePost,
  onMutate: async (postId) => {
    // Update ottimistico immediato
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      likes: old.likes + 1,
      isLiked: true
    }));
  },
});
```

### ❌ **Don'ts**

1. **Query Keys Inconsistenti**
```jsx
// ❌ Sbagliato: Strutture diverse
['users']
['userList']
['getAllUsers']
```

2. **Fetch in useEffect**
```jsx
// ❌ Sbagliato: useEffect quando hai React Query
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);
```

## 🎯 Prossimi Passi

1. **Lezione 16a**: Cache avanzata e ottimizzazioni
2. **Lezione 16b**: DevTools e debugging
3. **Integrazione con Suspense**: Per UX ancora migliore

## 📚 Risorse Aggiuntive

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://react-query.tanstack.com/guides/best-practices)
- [Query Key Factories](https://tkdodo.eu/blog/effective-react-query-keys)

---

**Prossima lezione**: [16a - Cache e Web API](../16a-react-query-cache/) per ottimizzazioni avanzate e gestione cache intelligente.