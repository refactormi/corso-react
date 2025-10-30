# Lezione 14: useMemo e useCallback - Ottimizzazione Performance

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere il concetto di memoizzazione in React
- Utilizzare useMemo per ottimizzare calcoli costosi
- Utilizzare useCallback per ottimizzare funzioni
- Identificare quando usare memoizzazione
- Evitare over-optimization e anti-patterns
- Misurare e monitorare le performance
- Implementare pattern di ottimizzazione avanzati
- Comprendere il trade-off tra performance e complessità

## Teoria

### 1. Introduzione alla Memoizzazione

#### Cos'è la Memoizzazione?
La memoizzazione è una tecnica di ottimizzazione che consiste nel memorizzare i risultati di calcoli costosi e riutilizzarli quando gli input non sono cambiati. In React, questo si traduce nell'evitare re-render e re-calcoli inutili.

#### Perché è Importante?
- **Performance**: Evita calcoli costosi ripetuti
- **User Experience**: Interfaccia più fluida e reattiva
- **Efficienza**: Riduce il carico di lavoro del browser
- **Scalabilità**: Migliora le performance con dati complessi

```tsx
// ❌ Senza memoizzazione - calcolo eseguito ad ogni render
function ExpensiveComponent({ items, filter }) {
  const expensiveValue = items
    .filter(item => item.category === filter)
    .sort((a, b) => a.value - b.value)
    .reduce((sum, item) => sum + item.value, 0);
  
  return <div>Valore: {expensiveValue}</div>;
}

// ✅ Con memoizzazione - calcolo solo quando necessario
function OptimizedComponent({ items, filter }) {
  const expensiveValue = useMemo(() => {
    return items
      .filter(item => item.category === filter)
      .sort((a, b) => a.value - b.value)
      .reduce((sum, item) => sum + item.value, 0);
  }, [items, filter]);
  
  return <div>Valore: {expensiveValue}</div>;
}
```

### 2. useMemo - Memoizzazione di Valori

#### Sintassi Base
```tsx
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
```

#### Parametri:
1. **Funzione di calcolo**: Il calcolo da memoizzare
2. **Array di dipendenze**: Quando ricalcolare

#### Esempi Pratici

##### Calcolo di Statistiche
```tsx
function DataAnalytics({ data }) {
  const statistics = useMemo(() => {
    console.log('Calcolo statistiche...'); // Solo quando data cambia
    
    return {
      total: data.reduce((sum, item) => sum + item.value, 0),
      average: data.reduce((sum, item) => sum + item.value, 0) / data.length,
      max: Math.max(...data.map(item => item.value)),
      min: Math.min(...data.map(item => item.value)),
      median: calculateMedian(data.map(item => item.value))
    };
  }, [data]);
  
  return (
    <div>
      <h3>Statistiche</h3>
      <p>Totale: {statistics.total}</p>
      <p>Media: {statistics.average.toFixed(2)}</p>
      <p>Massimo: {statistics.max}</p>
      <p>Minimo: {statistics.min}</p>
      <p>Mediana: {statistics.median}</p>
    </div>
  );
}
```

##### Filtraggio e Ordinamento
```tsx
function ProductList({ products, sortBy, filterBy, searchTerm }) {
  const filteredAndSortedProducts = useMemo(() => {
    console.log('Filtraggio e ordinamento...');
    
    let filtered = products;
    
    // Filtro per categoria
    if (filterBy !== 'all') {
      filtered = filtered.filter(product => product.category === filterBy);
    }
    
    // Filtro per ricerca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordinamento
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [products, sortBy, filterBy, searchTerm]);
  
  return (
    <div>
      {filteredAndSortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

##### Creazione di Oggetti Complessi
```tsx
function ChartComponent({ data, config }) {
  const chartData = useMemo(() => {
    console.log('Preparazione dati grafico...');
    
    return {
      labels: data.map(item => item.label),
      datasets: [{
        label: config.title,
        data: data.map(item => item.value),
        backgroundColor: config.colors,
        borderColor: config.borderColors,
        borderWidth: config.borderWidth
      }]
    };
  }, [data, config]);
  
  return <Chart data={chartData} />;
}
```

### 3. useCallback - Memoizzazione di Funzioni

#### Sintassi Base
```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

#### Perché useCallback?
- **Stabilità referenziale**: La funzione mantiene la stessa identità
- **Ottimizzazione componenti figli**: Evita re-render inutili
- **Dipendenze useEffect**: Funzioni stabili per useEffect

#### Esempi Pratici

##### Gestione Eventi
```tsx
function TodoList({ todos, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all');
  
  // Memoizza le funzioni di callback
  const handleToggle = useCallback((id) => {
    onUpdate(id, { completed: !todos.find(t => t.id === id).completed });
  }, [todos, onUpdate]);
  
  const handleDelete = useCallback((id) => {
    onDelete(id);
  }, [onDelete]);
  
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);
  
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  return (
    <div>
      <FilterButtons onFilterChange={handleFilterChange} />
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

##### API Calls
```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Memoizza la funzione di fetch
  const fetchUser = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Errore nel caricamento utente:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  if (loading) return <div>Caricamento...</div>;
  if (!user) return <div>Utente non trovato</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

##### Debounced Search
```tsx
function SearchComponent({ onSearch }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce della query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Memoizza la funzione di ricerca
  const handleSearch = useCallback((searchTerm) => {
    onSearch(searchTerm);
  }, [onSearch]);
  
  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Cerca..."
    />
  );
}
```

### 4. Pattern Avanzati

#### Pattern 1: Memoizzazione Condizionale
```tsx
function ConditionalMemo({ data, shouldMemoize }) {
  const processedData = useMemo(() => {
    if (!shouldMemoize) {
      return data; // Non memoizza se non necessario
    }
    
    console.log('Elaborazione costosa...');
    return expensiveProcessing(data);
  }, [data, shouldMemoize]);
  
  return <div>{processedData.length} elementi</div>;
}
```

#### Pattern 2: Memoizzazione con Dipendenze Dinamiche
```tsx
function DynamicMemo({ items, filters }) {
  const filteredItems = useMemo(() => {
    // Crea una chiave unica basata sui filtri attivi
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .sort()
      .join(',');
    
    console.log(`Filtraggio con: ${activeFilters}`);
    
    return items.filter(item => {
      return activeFilters.every(filter => item[filter]);
    });
  }, [items, filters]);
  
  return (
    <div>
      {filteredItems.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}
```

#### Pattern 3: Memoizzazione di Hook Personalizzati
```tsx
function useExpensiveCalculation(data, options) {
  return useMemo(() => {
    console.log('Calcolo costoso...');
    
    const result = {
      processed: data.map(item => ({
        ...item,
        calculated: item.value * options.multiplier,
        formatted: formatValue(item.value, options.format)
      })),
      summary: {
        total: data.reduce((sum, item) => sum + item.value, 0),
        count: data.length
      }
    };
    
    return result;
  }, [data, options]);
}

function DataProcessor({ data, options }) {
  const processedData = useExpensiveCalculation(data, options);
  
  return (
    <div>
      <h3>Dati Elaborati</h3>
      <p>Totale: {processedData.summary.total}</p>
      <p>Elementi: {processedData.summary.count}</p>
      {processedData.processed.map(item => (
        <div key={item.id}>{item.formatted}</div>
      ))}
    </div>
  );
}
```

#### Pattern 4: Memoizzazione con Context
```tsx
const DataContext = createContext();

function DataProvider({ children, data }) {
  const memoizedData = useMemo(() => {
    return {
      items: data.items,
      metadata: {
        total: data.items.length,
        lastUpdated: new Date().toISOString()
      }
    };
  }, [data.items]);
  
  const updateItem = useCallback((id, updates) => {
    // Logica di aggiornamento
  }, []);
  
  const deleteItem = useCallback((id) => {
    // Logica di eliminazione
  }, []);
  
  const value = useMemo(() => ({
    data: memoizedData,
    updateItem,
    deleteItem
  }), [memoizedData, updateItem, deleteItem]);
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
```

### 5. React.memo e Ottimizzazione Componenti

#### React.memo
```tsx
// Componente senza memo
function ExpensiveChild({ data, onUpdate }) {
  console.log('Render ExpensiveChild');
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// Componente con memo
const MemoizedChild = React.memo(function ExpensiveChild({ data, onUpdate }) {
  console.log('Render ExpensiveChild'); // Solo quando props cambiano
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

// Con funzione di confronto personalizzata
const CustomMemoChild = React.memo(
  function ExpensiveChild({ data, onUpdate }) {
    return (
      <div>
        {data.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Confronto personalizzato
    return prevProps.data.length === nextProps.data.length &&
           prevProps.data.every((item, index) => 
             item.id === nextProps.data[index].id
           );
  }
);
```

#### Combinazione con useCallback
```tsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  // Senza useCallback - causa re-render del figlio
  const handleUpdate = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };
  
  // Con useCallback - evita re-render del figlio
  const memoizedHandleUpdate = useCallback((id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <MemoizedChild data={items} onUpdate={memoizedHandleUpdate} />
    </div>
  );
}
```

### 6. Misurazione delle Performance

#### React DevTools Profiler
```tsx
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log('Profiler:', {
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  });
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <ExpensiveComponent />
    </Profiler>
  );
}
```

#### Hook per Misurazione
```tsx
function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    console.log(`${componentName} - Render ${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    
    startTime.current = performance.now();
  });
  
  return renderCount.current;
}

function MonitoredComponent() {
  const renderCount = usePerformanceMonitor('MonitoredComponent');
  
  return <div>Render count: {renderCount}</div>;
}
```

#### Benchmarking
```tsx
function BenchmarkComponent() {
  const [data, setData] = useState([]);
  const [useMemo, setUseMemo] = useState(true);
  
  const expensiveValue = useMemo(() => {
    if (!useMemo) return null;
    
    const start = performance.now();
    const result = data.reduce((sum, item) => sum + item.value, 0);
    const end = performance.now();
    
    console.log(`Calcolo con useMemo: ${(end - start).toFixed(2)}ms`);
    return result;
  }, [data, useMemo]);
  
  const expensiveValueWithoutMemo = useMemo(() => {
    if (useMemo) return null;
    
    const start = performance.now();
    const result = data.reduce((sum, item) => sum + item.value, 0);
    const end = performance.now();
    
    console.log(`Calcolo senza useMemo: ${(end - start).toFixed(2)}ms`);
    return result;
  }, [data, useMemo]);
  
  return (
    <div>
      <button onClick={() => setUseMemo(!useMemo)}>
        Toggle useMemo: {useMemo ? 'ON' : 'OFF'}
      </button>
      <button onClick={() => setData(generateLargeDataset())}>
        Genera Dati
      </button>
      <div>Risultato: {expensiveValue || expensiveValueWithoutMemo}</div>
    </div>
  );
}
```

### 7. Quando NON Usare Memoizzazione

#### Anti-Patterns Comuni

##### 1. Over-Memoization
```tsx
// ❌ Memoizzazione inutile
function SimpleComponent({ name }) {
  const memoizedName = useMemo(() => name, [name]); // Inutile!
  
  return <div>{memoizedName}</div>;
}

// ✅ Versione semplice
function SimpleComponent({ name }) {
  return <div>{name}</div>;
}
```

##### 2. Dipendenze Eccessive
```tsx
// ❌ Troppe dipendenze
function OverMemoized({ data, filter, sort, search, page, limit }) {
  const result = useMemo(() => {
    // Calcolo semplice
    return data.filter(item => item.name.includes(search));
  }, [data, filter, sort, search, page, limit]); // Troppe dipendenze!
  
  return <div>{result.length} risultati</div>;
}

// ✅ Solo dipendenze necessarie
function Optimized({ data, search }) {
  const result = useMemo(() => {
    return data.filter(item => item.name.includes(search));
  }, [data, search]); // Solo quelle necessarie
  
  return <div>{result.length} risultati</div>;
}
```

##### 3. Memoizzazione di Valori Primitivi
```tsx
// ❌ Memoizzazione inutile
function BadExample({ count }) {
  const memoizedCount = useMemo(() => count, [count]);
  const memoizedString = useMemo(() => 'Hello', []);
  
  return <div>{memoizedCount} - {memoizedString}</div>;
}

// ✅ Versione ottimizzata
function GoodExample({ count }) {
  return <div>{count} - Hello</div>;
}
```

### 8. Best Practices

#### ✅ Cosa Fare

1. **Memoizza calcoli costosi**
```tsx
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

2. **Memoizza funzioni passate come props**
```tsx
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

3. **Usa React.memo per componenti costosi**
```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* rendering costoso */}</div>;
});
```

4. **Misura prima di ottimizzare**
```tsx
// Usa React DevTools Profiler
// Misura le performance reali
// Ottimizza solo se necessario
```

#### ❌ Cosa Evitare

1. **Non memoizzare tutto**
```tsx
// ❌ Over-optimization
const simpleValue = useMemo(() => props.value, [props.value]);
```

2. **Non dimenticare le dipendenze**
```tsx
// ❌ Dipendenze mancanti
const result = useMemo(() => {
  return processData(data, filter);
}, [data]); // Manca filter!
```

3. **Non memoizzare valori che cambiano sempre**
```tsx
// ❌ Memoizzazione inutile
const timestamp = useMemo(() => Date.now(), []); // Cambia sempre!
```

### 9. Pattern di Ottimizzazione Avanzati

#### Pattern 1: Virtualizzazione
```tsx
function VirtualizedList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: item.index * itemHeight,
              height: itemHeight
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Pattern 2: Lazy Loading con Memoizzazione
```tsx
function LazyImage({ src, alt, placeholder }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  const observer = useMemo(() => {
    return new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
  }, []);
  
  useEffect(() => {
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [observer]);
  
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div ref={imgRef} style={{ minHeight: '200px' }}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      {!isLoaded && placeholder}
    </div>
  );
}
```

#### Pattern 3: Memoizzazione con Web Workers
```tsx
function useWebWorker(workerScript) {
  const workerRef = useRef();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    workerRef.current = new Worker(workerScript);
    
    workerRef.current.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
    };
    
    return () => {
      workerRef.current.terminate();
    };
  }, [workerScript]);
  
  const processData = useCallback((data) => {
    setLoading(true);
    workerRef.current.postMessage(data);
  }, []);
  
  return { result, loading, processData };
}

function HeavyComputationComponent({ data }) {
  const { result, loading, processData } = useWebWorker('/worker.js');
  
  const memoizedData = useMemo(() => {
    if (data.length > 1000) {
      processData(data);
      return null;
    }
    return processDataLocally(data);
  }, [data, processData]);
  
  if (loading) return <div>Elaborazione in corso...</div>;
  
  return <div>Risultato: {result || memoizedData}</div>;
}
```

### 10. Debugging e Troubleshooting

#### Debugging useMemo
```tsx
function DebugMemo({ data, filter }) {
  const result = useMemo(() => {
    console.log('useMemo eseguito:', { data: data.length, filter });
    
    return data.filter(item => item.category === filter);
  }, [data, filter]);
  
  // Debug delle dipendenze
  useEffect(() => {
    console.log('Dipendenze cambiate:', { data, filter });
  }, [data, filter]);
  
  return <div>{result.length} elementi</div>;
}
```

#### Debugging useCallback
```tsx
function DebugCallback({ onUpdate }) {
  const handleClick = useCallback((id) => {
    console.log('Callback eseguito:', id);
    onUpdate(id);
  }, [onUpdate]);
  
  // Debug della stabilità
  const prevCallback = useRef();
  useEffect(() => {
    if (prevCallback.current !== handleClick) {
      console.log('Callback ricreato');
      prevCallback.current = handleClick;
    }
  }, [handleClick]);
  
  return <button onClick={() => handleClick(1)}>Click</button>;
}
```

#### Performance Monitoring
```tsx
function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });
  
  const renderStart = useRef();
  const renderTimes = useRef([]);
  
  useEffect(() => {
    renderStart.current = performance.now();
  });
  
  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    renderTimes.current.push(renderTime);
    
    // Mantieni solo gli ultimi 10 render
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }
    
    const average = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    
    setMetrics({
      renderCount: metrics.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime: average
    });
  });
  
  return metrics;
}
```

## Esempi Pratici

### Esempio 1: Dashboard con Calcoli Complessi
```tsx
function Dashboard({ sales, expenses, period }) {
  const analytics = useMemo(() => {
    console.log('Calcolo analytics...');
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;
    
    const salesByMonth = sales.reduce((acc, sale) => {
      const month = new Date(sale.date).getMonth();
      acc[month] = (acc[month] || 0) + sale.amount;
      return acc;
    }, {});
    
    return {
      totalSales,
      totalExpenses,
      profit,
      profitMargin,
      salesByMonth
    };
  }, [sales, expenses]);
  
  const chartData = useMemo(() => {
    console.log('Preparazione dati grafico...');
    
    return {
      labels: Object.keys(analytics.salesByMonth),
      datasets: [{
        label: 'Vendite per Mese',
        data: Object.values(analytics.salesByMonth),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  }, [analytics.salesByMonth]);
  
  return (
    <div>
      <div className="metrics">
        <MetricCard title="Vendite Totali" value={analytics.totalSales} />
        <MetricCard title="Spese Totali" value={analytics.totalExpenses} />
        <MetricCard title="Profitto" value={analytics.profit} />
        <MetricCard title="Margine" value={`${analytics.profitMargin.toFixed(1)}%`} />
      </div>
      <Chart data={chartData} />
    </div>
  );
}
```

### Esempio 2: Lista con Filtri e Ricerca
```tsx
function ProductList({ products, filters, searchTerm, sortBy }) {
  const filteredProducts = useMemo(() => {
    console.log('Filtraggio prodotti...');
    
    let filtered = products;
    
    // Filtro per categoria
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Filtro per prezzo
    if (filters.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice < Infinity) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    // Filtro per rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }
    
    // Ricerca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [products, filters, searchTerm]);
  
  const sortedProducts = useMemo(() => {
    console.log('Ordinamento prodotti...');
    
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);
  
  const handleProductUpdate = useCallback((id, updates) => {
    // Logica di aggiornamento
  }, []);
  
  const handleProductDelete = useCallback((id) => {
    // Logica di eliminazione
  }, []);
  
  return (
    <div>
      <div className="product-grid">
        {sortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdate={handleProductUpdate}
            onDelete={handleProductDelete}
          />
        ))}
      </div>
    </div>
  );
}
```

## Esercizi

### Esercizio 1: Calcolatrice con Memoizzazione
Crea una calcolatrice che:
- Memoizza i risultati dei calcoli
- Evita ricalcoli inutili
- Gestisce operazioni complesse
- Mostra statistiche di performance

### Esercizio 2: Lista Virtualizzata
Implementa una lista virtualizzata che:
- Memoizza gli elementi visibili
- Gestisce scroll infinito
- Ottimizza il rendering
- Misura le performance

### Esercizio 3: Dashboard in Tempo Reale
Crea un dashboard che:
- Memoizza calcoli di analytics
- Aggiorna in tempo reale
- Gestisce dati complessi
- Ottimizza le performance

## Riepilogo

In questa lezione abbiamo imparato:

- **Memoizzazione** e i suoi benefici
- **useMemo** per ottimizzare calcoli costosi
- **useCallback** per ottimizzare funzioni
- **React.memo** per ottimizzare componenti
- **Pattern avanzati** di ottimizzazione
- **Misurazione performance** e debugging
- **Best practices** e anti-patterns
- **Quando usare** e quando evitare la memoizzazione

La memoizzazione è uno strumento potente per ottimizzare le performance, ma deve essere usata con saggezza:

- **Misura prima di ottimizzare**
- **Memoizza solo quando necessario**
- **Evita over-optimization**
- **Considera il trade-off complessità/performance**

Nella prossima lezione esploreremo i Custom Hooks per riutilizzare la logica tra componenti.




