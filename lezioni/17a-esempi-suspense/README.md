# Lezione 16a: Esempi Pratici di Suspense

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Implementare Suspense in scenari reali e complessi
- Gestire errori con Error Boundaries e Suspense
- Creare pattern avanzati per il caricamento dati
- Ottimizzare l'esperienza utente con Suspense strategico
- Integrare Suspense con routing e code splitting

## 🏗️ Architetture Avanzate con Suspense

### 1. **Suspense per Code Splitting Avanzato**

```jsx
import { lazy, Suspense } from 'react';

// Lazy loading con preload strategico
const Dashboard = lazy(() => 
  import('./Dashboard').then(module => {
    // Preload componenti correlati
    import('./UserProfile');
    import('./Analytics');
    return module;
  })
);

const UserProfile = lazy(() => import('./UserProfile'));
const Analytics = lazy(() => import('./Analytics'));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/profile" element={
          <Suspense fallback={<ProfileSkeleton />}>
            <UserProfile />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}
```

### 2. **Data Fetching con Suspense Pattern**

```jsx
// Hook personalizzato per Suspense data fetching
function useSuspenseQuery(queryKey, queryFn) {
  const [resource] = useState(() => {
    let status = 'pending';
    let result;
    
    const promise = queryFn().then(
      data => {
        status = 'success';
        result = data;
      },
      error => {
        status = 'error';
        result = error;
      }
    );
    
    return {
      read() {
        if (status === 'pending') throw promise;
        if (status === 'error') throw result;
        return result;
      }
    };
  });
  
  return resource.read();
}

// Componente che usa il pattern
function UserDashboard({ userId }) {
  const userData = useSuspenseQuery(
    ['user', userId],
    () => fetchUserData(userId)
  );
  
  const userStats = useSuspenseQuery(
    ['userStats', userId],
    () => fetchUserStats(userId)
  );
  
  return (
    <div>
      <UserHeader user={userData} />
      <UserStats stats={userStats} />
    </div>
  );
}
```

## 🚨 Error Boundaries + Suspense

### **Pattern Completo di Gestione Errori**

```jsx
class SuspenseErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Suspense Error:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    
    return this.props.children;
  }
}

// Wrapper completo
function SuspenseWrapper({ children, fallback, errorFallback }) {
  return (
    <SuspenseErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </SuspenseErrorBoundary>
  );
}
```

### **Retry Logic Avanzato**

```jsx
function useRetryableResource(fetcher, maxRetries = 3) {
  const [retryCount, setRetryCount] = useState(0);
  const [resource, setResource] = useState(() => createResource(fetcher()));
  
  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setResource(createResource(fetcher()));
    }
  }, [fetcher, retryCount, maxRetries]);
  
  return { resource, retry, canRetry: retryCount < maxRetries };
}

function DataComponent() {
  const { resource, retry, canRetry } = useRetryableResource(
    () => fetchData(),
    3
  );
  
  try {
    const data = resource.read();
    return <DataDisplay data={data} />;
  } catch (error) {
    if (error instanceof Promise) {
      throw error; // Re-throw promise per Suspense
    }
    
    // Gestione errore
    return (
      <ErrorDisplay 
        error={error}
        onRetry={canRetry ? retry : null}
      />
    );
  }
}
```

## 🎨 Pattern UI Avanzati

### 1. **Progressive Loading**

```jsx
function ProgressiveApp() {
  return (
    <div className="app">
      {/* Carica immediatamente */}
      <Header />
      
      {/* Carica con priorità alta */}
      <Suspense fallback={<NavigationSkeleton />}>
        <Navigation />
      </Suspense>
      
      <main>
        {/* Carica con priorità media */}
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        
        {/* Carica con priorità bassa */}
        <Suspense fallback={<ContentSkeleton />}>
          <MainContent />
          
          {/* Carica solo se necessario */}
          <Suspense fallback={<WidgetSkeleton />}>
            <OptionalWidgets />
          </Suspense>
        </Suspense>
      </main>
      
      {/* Carica in background */}
      <Suspense fallback={null}>
        <BackgroundServices />
      </Suspense>
    </div>
  );
}
```

### 2. **Conditional Suspense**

```jsx
function ConditionalSuspense({ condition, fallback, children }) {
  if (condition) {
    return (
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    );
  }
  
  return children;
}

// Uso pratico
function UserProfile({ user, isLoading }) {
  return (
    <ConditionalSuspense 
      condition={isLoading}
      fallback={<ProfileSkeleton />}
    >
      <ProfileContent user={user} />
    </ConditionalSuspense>
  );
}
```

## 🔄 Suspense con React Router

### **Lazy Routes con Preloading**

```jsx
import { lazy } from 'react';

// Preload strategico delle route
const preloadRoute = (routeComponent) => {
  const componentImport = routeComponent();
  return componentImport;
};

// Route lazy con preload
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Preload al hover
function NavLink({ to, children, preload }) {
  const handleMouseEnter = () => {
    if (preload) {
      preload();
    }
  };
  
  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
}

function App() {
  return (
    <Router>
      <nav>
        <NavLink to="/" preload={() => preloadRoute(() => import('./pages/Home'))}>
          Home
        </NavLink>
        <NavLink to="/dashboard" preload={() => preloadRoute(() => import('./pages/Dashboard'))}>
          Dashboard
        </NavLink>
      </nav>
      
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

## 🧪 Testing Avanzato

### **Testing Suspense Components**

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';

// Mock resource per testing
function createMockResource(data, delay = 100) {
  let status = 'pending';
  let result;
  
  const promise = new Promise(resolve => {
    setTimeout(() => {
      status = 'success';
      result = data;
      resolve(data);
    }, delay);
  });
  
  return {
    read() {
      if (status === 'pending') throw promise;
      return result;
    }
  };
}

test('mostra fallback e poi contenuto', async () => {
  const mockResource = createMockResource({ message: 'Hello World' });
  
  function TestComponent() {
    const data = mockResource.read();
    return <div>{data.message}</div>;
  }
  
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <TestComponent />
    </Suspense>
  );
  
  // Verifica fallback
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Aspetta che il contenuto si carichi
  await waitFor(() => {
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
  
  // Verifica che il fallback sia sparito
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
```

## 🚀 Best Practices Avanzate

### ✅ **Do's**

1. **Granularità Strategica**
```jsx
// ✅ Buono: Suspense granulare per sezioni indipendenti
<div className="dashboard">
  <Suspense fallback={<HeaderSkeleton />}>
    <Header />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <MainContent />
  </Suspense>
</div>
```

2. **Preloading Intelligente**
```jsx
// ✅ Buono: Preload al hover o in base al comportamento utente
const handleMouseEnter = () => {
  preloadComponent(() => import('./HeavyComponent'));
};
```

3. **Error Recovery**
```jsx
// ✅ Buono: Retry logic e fallback graceful
<SuspenseWithRetry maxRetries={3} fallback={<Skeleton />}>
  <DataComponent />
</SuspenseWithRetry>
```

### ❌ **Don'ts**

1. **Suspense Troppo Granulare**
```jsx
// ❌ Sbagliato: Troppi boundary per elementi piccoli
{items.map(item => (
  <Suspense key={item.id} fallback={<ItemSkeleton />}>
    <Item data={item} />
  </Suspense>
))}
```

2. **Fallback Generici**
```jsx
// ❌ Sbagliato: Stesso fallback per contenuti diversi
<Suspense fallback={<div>Loading...</div>}>
  <ComplexDashboard />
</Suspense>
```

## 🔗 Integrazione con Librerie Esterne

### **React Query + Suspense**

```jsx
import { useQuery } from '@tanstack/react-query';

function DataComponent() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    suspense: true, // Abilita Suspense
    staleTime: 300000, // 5 minuti
    cacheTime: 600000, // 10 minuti
  });
  
  return <DataDisplay data={data} />;
}

// Wrapper con Suspense
function App() {
  return (
    <QueryClient client={queryClient}>
      <Suspense fallback={<AppSkeleton />}>
        <DataComponent />
      </Suspense>
    </QueryClient>
  );
}
```

## 🎯 Prossimi Passi

1. **Lezione 17**: Integrazione completa con React Query
2. **Progetti reali**: E-commerce con Suspense ottimizzato
3. **Performance**: Monitoraggio e ottimizzazione avanzata

## 📚 Risorse Aggiuntive

- [Suspense for Data Fetching](https://react.dev/reference/react/Suspense#suspense-for-data-fetching)
- [Concurrent Features Deep Dive](https://react.dev/blog/2021/12/17/react-conf-2021-recap)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React Query Suspense](https://tanstack.com/query/latest/docs/react/guides/suspense)

---

**Prossima lezione**: [17 - Introduzione React Query](../17-introduzione-react-query/) per gestione avanzata dello stato server.