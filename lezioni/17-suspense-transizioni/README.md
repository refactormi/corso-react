# Lezione 16: Suspense e Transitions

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è React Suspense e come funziona
- Utilizzare Suspense per gestire stati di loading
- Implementare Transitions per migliorare l'esperienza utente
- Distinguere tra aggiornamenti urgenti e non urgenti
- Creare interfacce più reattive e performanti

## 📚 Cos'è React Suspense?

**React Suspense** è una funzionalità che permette ai componenti di "sospendere" il rendering mentre aspettano che qualcosa si carichi (dati, codice, immagini). Durante l'attesa, React mostra un fallback UI.

### Definizione Ufficiale
> "Suspense permette ai componenti di dichiarare cosa stanno aspettando prima di poter essere renderizzati." - [React.dev](https://react.dev/reference/react/Suspense)

## 🔄 Come Funziona Suspense

### 1. **Suspense Boundary**
```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <ComponenteCheSospende />
    </Suspense>
  );
}
```

### 2. **Componente che Sospende**
```jsx
// Questo componente "sospende" durante il caricamento
function ComponenteCheSospende() {
  const data = use(fetchData()); // use() è un hook che sospende
  return <div>{data.message}</div>;
}
```

### 3. **Flusso di Esecuzione**
1. React inizia a renderizzare `ComponenteCheSospende`
2. Il componente incontra `use(fetchData())` che non è ancora pronto
3. Il componente "sospende" (throw Promise)
4. React mostra il `fallback` del Suspense più vicino
5. Quando i dati sono pronti, React ri-renderizza il componente

## 🎭 Suspense Boundary e Fallback

### **Boundary Multipli**
```jsx
function App() {
  return (
    <div>
      {/* Suspense per la sidebar */}
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      
      {/* Suspense per il contenuto principale */}
      <Suspense fallback={<ContentSkeleton />}>
        <MainContent />
      </Suspense>
    </div>
  );
}
```

### **Fallback Personalizzati**
```jsx
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Caricamento dati...</p>
    </div>
  );
}

<Suspense fallback={<LoadingSpinner />}>
  <DataComponent />
</Suspense>
```

## ⚡ React Transitions

Le **Transitions** permettono di marcare alcuni aggiornamenti di stato come "non urgenti", migliorando la reattività dell'interfaccia.

### 1. **useTransition Hook**
```jsx
import { useTransition, useState } from 'react';

function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery); // Aggiornamento urgente (input)
    
    startTransition(() => {
      // Aggiornamento non urgente (risultati)
      setResults(searchData(newQuery));
    });
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={isPending}
      />
      {isPending && <div>Ricerca in corso...</div>}
      <ResultsList results={results} />
    </div>
  );
}
```

### 2. **startTransition Standalone**
```jsx
import { startTransition } from 'react';

function handleClick() {
  // Aggiornamento urgente
  setCurrentTab('messages');
  
  // Aggiornamento non urgente
  startTransition(() => {
    setMessages(loadMessages());
  });
}
```

## 🔍 Differenza tra Aggiornamenti Urgenti e Non Urgenti

### **Aggiornamenti Urgenti**
- Input dell'utente (digitazione, click, hover)
- Animazioni critiche
- Feedback immediato

### **Aggiornamenti Non Urgenti**
- Risultati di ricerca
- Caricamento di liste lunghe
- Aggiornamenti di dati in background

```jsx
function App() {
  const [tab, setTab] = useState('home');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const switchTab = (newTab) => {
    setTab(newTab); // Urgente: cambio tab immediato
    
    startTransition(() => {
      // Non urgente: caricamento contenuto
      setContent(loadTabContent(newTab));
    });
  };

  return (
    <div>
      <TabBar activeTab={tab} onTabChange={switchTab} />
      {isPending && <div>Caricamento contenuto...</div>}
      <TabContent content={content} />
    </div>
  );
}
```

## 🛠️ Pattern Pratici

### 1. **Suspense per Code Splitting**
```jsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Caricamento componente...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 2. **Suspense Nested**
```jsx
function App() {
  return (
    <Suspense fallback={<AppSkeleton />}>
      <Header />
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>
        <MainContent />
      </Suspense>
    </Suspense>
  );
}
```

### 3. **Transition con Debouncing**
```jsx
function SearchWithTransition() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (deferredQuery) {
      startTransition(() => {
        setResults(searchAPI(deferredQuery));
      });
    }
  }, [deferredQuery]);

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca..."
      />
      {isPending && <div>Ricerca in corso...</div>}
      <SearchResults results={results} />
    </div>
  );
}
```

## 🎨 Migliorare l'UX con Suspense e Transitions

### 1. **Loading States Granulari**
```jsx
function Dashboard() {
  return (
    <div className="dashboard">
      <Suspense fallback={<HeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>
      
      <div className="dashboard-content">
        <Suspense fallback={<StatsSkeleton />}>
          <StatsCards />
        </Suspense>
        
        <Suspense fallback={<ChartSkeleton />}>
          <Charts />
        </Suspense>
      </div>
    </div>
  );
}
```

### 2. **Feedback Visivo Durante Transitions**
```jsx
function TabContainer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPending, startTransition] = useTransition();

  const switchTab = (tab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  return (
    <div>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`tab ${activeTab === tab.id ? 'active' : ''} ${isPending ? 'loading' : ''}`}
          >
            {tab.label}
            {isPending && <Spinner />}
          </button>
        ))}
      </div>
      
      <div className={`tab-content ${isPending ? 'transitioning' : ''}`}>
        <TabContent tab={activeTab} />
      </div>
    </div>
  );
}
```

## 🚨 Errori Comuni e Best Practices

### ❌ **Errori da Evitare**

1. **Suspense senza Boundary**
```jsx
// ❌ Sbagliato: nessun Suspense boundary
function App() {
  return <ComponenteCheSospende />; // Errore!
}
```

2. **Transition per Tutto**
```jsx
// ❌ Sbagliato: input non dovrebbe essere in transition
startTransition(() => {
  setInputValue(e.target.value); // L'input diventa lento!
});
```

3. **Fallback Troppo Generico**
```jsx
// ❌ Sbagliato: stesso fallback per tutto
<Suspense fallback={<div>Loading...</div>}>
  <ComplexDashboard />
</Suspense>
```

### ✅ **Best Practices**

1. **Suspense Granulare**
```jsx
// ✅ Corretto: boundary specifici per sezioni
<Suspense fallback={<UserProfileSkeleton />}>
  <UserProfile />
</Suspense>
```

2. **Transition Solo per Non-Urgenti**
```jsx
// ✅ Corretto: input urgente, risultati non urgenti
const handleSearch = (value) => {
  setQuery(value); // Urgente
  startTransition(() => {
    setResults(search(value)); // Non urgente
  });
};
```

3. **Fallback Contestuali**
```jsx
// ✅ Corretto: fallback specifici per contenuto
<Suspense fallback={<ProductListSkeleton />}>
  <ProductList />
</Suspense>
```

## 🧪 Testing con Suspense e Transitions

### **Testing Suspense**
```jsx
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';

test('mostra fallback durante loading', async () => {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncComponent />
    </Suspense>
  );
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Aspetta che il componente si carichi
  await screen.findByText('Contenuto caricato');
});
```

### **Testing Transitions**
```jsx
import { act, renderHook } from '@testing-library/react';
import { useTransition } from 'react';

test('useTransition gestisce pending state', () => {
  const { result } = renderHook(() => useTransition());
  const [isPending, startTransition] = result.current;
  
  expect(isPending).toBe(false);
  
  act(() => {
    startTransition(() => {
      // Simula aggiornamento non urgente
    });
  });
  
  expect(result.current[0]).toBe(true);
});
```

## 🔗 Integrazione con React Query

Suspense si integra perfettamente con React Query per il data fetching:

```jsx
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    suspense: true, // Abilita Suspense
  });

  return <div>Ciao, {data.name}!</div>;
}

function App() {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfile userId={1} />
    </Suspense>
  );
}
```

## 📈 Performance e Monitoraggio

### **React DevTools**
- Visualizza Suspense boundaries
- Monitora transitions in corso
- Analizza tempi di caricamento

### **Metriche Importanti**
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Cumulative Layout Shift (CLS)

## 🎯 Prossimi Passi

1. **Lezione 16a**: Esempi pratici avanzati con Suspense
2. **Lezione 17**: Integrazione con React Query
3. **Progetti reali**: Dashboard con loading states ottimizzati

## 📚 Risorse Aggiuntive

- [React Suspense Documentation](https://react.dev/reference/react/Suspense)
- [useTransition Hook](https://react.dev/reference/react/useTransition)
- [Concurrent Features](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)
- [Building Great User Experiences with Concurrent Features](https://react.dev/blog/2021/12/17/react-conf-2021-recap#react-18-and-concurrent-features)

---

**Prossima lezione**: [16a - Esempi pratici Suspense](../16a-esempi-suspense/) per implementazioni avanzate e casi d'uso reali.