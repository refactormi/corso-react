# Lezione 15: Custom Hooks - Riutilizzo della Logica

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Creare e utilizzare custom hooks personalizzati
- Comprendere i pattern di composizione degli hook
- Implementare hook per casi d'uso comuni
- Gestire la logica di business riutilizzabile
- Creare hook per gestione stato complesso
- Implementare hook per side effects personalizzati
- Comprendere le best practices per custom hooks
- Evitare anti-patterns comuni

## Teoria

### 1. Introduzione ai Custom Hooks

#### Cos'è un Custom Hook?
Un custom hook è una funzione JavaScript che inizia con "use" e può chiamare altri hook. Permette di estrarre la logica dei componenti in funzioni riutilizzabili.

#### Vantaggi dei Custom Hooks:
- **Riutilizzabilità**: Logica condivisa tra componenti
- **Separazione delle responsabilità**: Logica di business separata dall'UI
- **Testabilità**: Hook testabili indipendentemente
- **Composizione**: Hook combinabili per logica complessa
- **Manutenibilità**: Codice più organizzato e leggibile

```tsx
// ❌ Senza custom hook - logica duplicata
function Component1() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return <div>{count}</div>;
}

function Component2() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return <div>{count}</div>;
}

// ✅ Con custom hook - logica riutilizzabile
function useCounter(initialValue = 0, interval = 1000) {
  const [count, setCount] = useState(initialValue);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, interval);
    
    return () => clearInterval(timer);
  }, [interval]);
  
  return { count, setCount };
}

function Component1() {
  const { count } = useCounter(0, 1000);
  return <div>{count}</div>;
}

function Component2() {
  const { count } = useCounter(10, 2000);
  return <div>{count}</div>;
}
```

### 2. Regole e Convenzioni

#### Regole Fondamentali:
1. **Naming**: Inizia sempre con "use"
2. **Hook Rules**: Segui le regole degli hook React
3. **Return**: Restituisci valori o funzioni
4. **Composizione**: Può chiamare altri hook

#### Convenzioni di Naming:
```tsx
// ✅ Nomi chiari e descrittivi
useCounter()
useLocalStorage()
useDebounce()
useAsync()
useForm()
useToggle()

// ❌ Nomi generici o confusi
useData()
useStuff()
useThing()
useHook()
```

### 3. Pattern di Base

#### Pattern 1: Hook Semplice
```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  
  return { value, toggle, setTrue, setFalse };
}

// Utilizzo
function ToggleComponent() {
  const { value, toggle, setTrue, setFalse } = useToggle();
  
  return (
    <div>
      <p>Stato: {value ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>ON</button>
      <button onClick={setFalse}>OFF</button>
    </div>
  );
}
```

#### Pattern 2: Hook con Parametri
```tsx
function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  const setValue = useCallback((value) => {
    setCount(value);
  }, []);
  
  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
}

// Utilizzo
function CounterComponent() {
  const { count, increment, decrement, reset } = useCounter(10, 5);
  
  return (
    <div>
      <p>Contatore: {count}</p>
      <button onClick={increment}>+5</button>
      <button onClick={decrement}>-5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

#### Pattern 3: Hook con Side Effects
```tsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Errore nel leggere localStorage:', error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Errore nel salvare localStorage:', error);
    }
  }, [key]);
  
  return [storedValue, setValue];
}

// Utilizzo
function LocalStorageComponent() {
  const [name, setName] = useLocalStorage('userName', '');
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome utente"
      />
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Chiaro</option>
        <option value="dark">Scuro</option>
      </select>
    </div>
  );
}
```

### 4. Hook per Gestione Stato

#### Hook per Form
```tsx
function useForm(initialValues = {}, validationSchema = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validazione in tempo reale
    if (validationSchema && touched[name]) {
      try {
        validationSchema.validateSyncAt(name, { [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [validationSchema, touched]);
  
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validazione al blur
    if (validationSchema) {
      try {
        validationSchema.validateSyncAt(name, values);
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [validationSchema, values]);
  
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      if (validationSchema) {
        await validationSchema.validate(values);
      }
      
      await onSubmit(values);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}

// Utilizzo
function FormComponent() {
  const form = useForm(
    { email: '', password: '' },
    // Schema di validazione (esempio con Yup)
    null
  );
  
  const onSubmit = async (values) => {
    console.log('Form inviato:', values);
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(); }}>
      <input
        type="email"
        value={form.values.email}
        onChange={(e) => form.handleChange('email', e.target.value)}
        onBlur={() => form.handleBlur('email')}
        placeholder="Email"
      />
      {form.errors.email && <span>{form.errors.email}</span>}
      
      <input
        type="password"
        value={form.values.password}
        onChange={(e) => form.handleChange('password', e.target.value)}
        onBlur={() => form.handleBlur('password')}
        placeholder="Password"
      />
      {form.errors.password && <span>{form.errors.password}</span>}
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Invio...' : 'Invia'}
      </button>
    </form>
  );
}
```

#### Hook per Lista
```tsx
function useList(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;
    
    if (filter) {
      filtered = items.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [items, filter, sortBy, sortOrder]);
  
  const addItem = useCallback((item) => {
    setItems(prev => [...prev, { ...item, id: Date.now() }]);
  }, []);
  
  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);
  
  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);
  
  const toggleSelection = useCallback((id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  
  const selectAll = useCallback(() => {
    setSelectedItems(new Set(items.map(item => item.id)));
  }, [items]);
  
  const deselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);
  
  const removeSelected = useCallback(() => {
    setItems(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  }, [selectedItems]);
  
  return {
    items: filteredAndSortedItems,
    selectedItems,
    filter,
    sortBy,
    sortOrder,
    addItem,
    removeItem,
    updateItem,
    toggleSelection,
    selectAll,
    deselectAll,
    removeSelected,
    setFilter,
    setSortBy,
    setSortOrder
  };
}
```

### 5. Hook per Side Effects

#### Hook per API Calls
```tsx
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);
  
  return {
    data,
    loading,
    error,
    fetchData,
    refetch
  };
}

// Utilizzo
function ApiComponent() {
  const { data, loading, error, refetch } = useApi('https://api.example.com/users');
  
  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;
  
  return (
    <div>
      <button onClick={refetch}>Ricarica</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

#### Hook per WebSocket
```tsx
function useWebSocket(url, options = {}) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        options.onOpen?.();
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setLastMessage(message);
        options.onMessage?.(message);
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        options.onClose?.();
      };
      
      ws.onerror = (error) => {
        setError(error);
        options.onError?.(error);
      };
      
      setSocket(ws);
    } catch (err) {
      setError(err);
    }
  }, [url, options]);
  
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [socket]);
  
  const sendMessage = useCallback((message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, isConnected]);
  
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect, options.autoConnect]);
  
  return {
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage
  };
}
```

#### Hook per Timer
```tsx
function useTimer(initialTime = 0, autoStart = false) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [interval, setInterval] = useState(1000);
  
  useEffect(() => {
    let timer;
    
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, interval);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, interval]);
  
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);
  
  const setTimeValue = useCallback((newTime) => {
    setTime(newTime);
  }, []);
  
  const setIntervalValue = useCallback((newInterval) => {
    setInterval(newInterval);
  }, []);
  
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  return {
    time,
    isRunning,
    interval,
    start,
    stop,
    reset,
    setTime: setTimeValue,
    setInterval: setIntervalValue,
    formatTime
  };
}
```

### 6. Hook per UI e Interazione

#### Hook per Modal
```tsx
function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);
  
  const open = useCallback((modalData = null) => {
    setIsOpen(true);
    setData(modalData);
  }, []);
  
  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);
  
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Gestione escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, close]);
  
  return {
    isOpen,
    data,
    open,
    close,
    toggle
  };
}

// Utilizzo
function ModalComponent() {
  const modal = useModal();
  
  return (
    <div>
      <button onClick={() => modal.open({ title: 'Titolo', content: 'Contenuto' })}>
        Apri Modal
      </button>
      
      {modal.isOpen && (
        <div className="modal-overlay" onClick={modal.close}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{modal.data?.title}</h2>
            <p>{modal.data?.content}</p>
            <button onClick={modal.close}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Hook per Click Outside
```tsx
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Utilizzo
function DropdownComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  
  useClickOutside(dropdownRef, () => setIsOpen(false));
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div>Opzione 1</div>
          <div>Opzione 2</div>
          <div>Opzione 3</div>
        </div>
      )}
    </div>
  );
}
```

#### Hook per Scroll
```tsx
function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [direction, setDirection] = useState('none');
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;
      
      setScrollY(currentScrollY);
      setScrollX(currentScrollX);
      
      if (currentScrollY > lastScrollY) {
        setDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const scrollToBottom = useCallback(() => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  }, []);
  
  const scrollToElement = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  return {
    scrollY,
    scrollX,
    direction,
    scrollToTop,
    scrollToBottom,
    scrollToElement
  };
}
```

### 7. Hook per Performance

#### Hook per Debounce
```tsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Utilizzo
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Esegui ricerca
      console.log('Ricerca per:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Cerca..."
    />
  );
}
```

#### Hook per Throttle
```tsx
function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());
  
  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, lastExecuted.current + delay - Date.now());
      
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);
  
  return throttledValue;
}

// Utilizzo
function ScrollComponent() {
  const { scrollY } = useScroll();
  const throttledScrollY = useThrottle(scrollY, 100);
  
  return (
    <div>
      <p>Scroll attuale: {scrollY}</p>
      <p>Scroll throttled: {throttledScrollY}</p>
    </div>
  );
}
```

#### Hook per Memoization
```tsx
function useMemoizedCallback(callback, dependencies) {
  const memoizedCallback = useCallback(callback, dependencies);
  
  const memoizedValue = useMemo(() => {
    return memoizedCallback;
  }, [memoizedCallback]);
  
  return memoizedValue;
}

// Hook per deep comparison
function useDeepMemo(value, dependencies) {
  const ref = useRef();
  
  if (!ref.current || !dependencies.every((dep, index) => 
    JSON.stringify(dep) === JSON.stringify(ref.current.deps[index])
  )) {
    ref.current = {
      value,
      deps: dependencies.map(dep => JSON.parse(JSON.stringify(dep)))
    };
  }
  
  return ref.current.value;
}
```

### 8. Hook per Comunicazione

#### Hook per Event Bus
```tsx
function useEventBus() {
  const listeners = useRef(new Map());
  
  const subscribe = useCallback((event, callback) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event).add(callback);
    
    // Return unsubscribe function
    return () => {
      const eventListeners = listeners.current.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          listeners.current.delete(event);
        }
      }
    };
  }, []);
  
  const publish = useCallback((event, data) => {
    const eventListeners = listeners.current.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Errore nell\'event listener:', error);
        }
      });
    }
  }, []);
  
  const unsubscribe = useCallback((event, callback) => {
    const eventListeners = listeners.current.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }, []);
  
  return {
    subscribe,
    publish,
    unsubscribe
  };
}

// Utilizzo
function EventBusExample() {
  const eventBus = useEventBus();
  
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('userLogin', (userData) => {
      console.log('Utente loggato:', userData);
    });
    
    return unsubscribe;
  }, [eventBus]);
  
  const handleLogin = () => {
    eventBus.publish('userLogin', { id: 1, name: 'Mario' });
  };
  
  return (
    <button onClick={handleLogin}>
      Simula Login
    </button>
  );
}
```

#### Hook per Context
```tsx
function useLocalContext(context, defaultValue = null) {
  const contextValue = useContext(context);
  
  if (contextValue === undefined) {
    return defaultValue;
  }
  
  return contextValue;
}

// Hook per context con provider
function useLocalContextProvider(context, value) {
  const ContextProvider = useMemo(() => {
    return ({ children }) => (
      <context.Provider value={value}>
        {children}
      </context.Provider>
    );
  }, [context, value]);
  
  return ContextProvider;
}
```

### 9. Hook per Testing

#### Hook per Mock Data
```tsx
function useMockData(initialData = []) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const generateMockData = useCallback((count = 10) => {
    setIsLoading(true);
    
    // Simula delay di rete
    setTimeout(() => {
      const mockData = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `Item ${index + 1}`,
        value: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
      }));
      
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const addMockItem = useCallback(() => {
    const newItem = {
      id: Date.now(),
      name: `Item ${data.length + 1}`,
      value: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    };
    
    setData(prev => [...prev, newItem]);
  }, [data.length]);
  
  const removeMockItem = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const updateMockItem = useCallback((id, updates) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);
  
  const clearMockData = useCallback(() => {
    setData([]);
  }, []);
  
  return {
    data,
    isLoading,
    error,
    generateMockData,
    addMockItem,
    removeMockItem,
    updateMockItem,
    clearMockData
  };
}
```

### 10. Best Practices e Anti-Patterns

#### ✅ Cosa Fare

1. **Naming chiaro e descrittivo**
```tsx
// ✅ Nomi chiari
useUserProfile()
useProductCatalog()
useShoppingCart()

// ❌ Nomi generici
useData()
useStuff()
useHook()
```

2. **Restituisci oggetti per hook complessi**
```tsx
// ✅ Restituisci oggetto
function useCounter() {
  const [count, setCount] = useState(0);
  
  return {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
    reset: () => setCount(0)
  };
}

// ❌ Restituisci array per hook semplici
function useCounter() {
  const [count, setCount] = useState(0);
  
  return [
    count,
    () => setCount(c => c + 1),
    () => setCount(c => c - 1),
    () => setCount(0)
  ];
}
```

3. **Usa useCallback per funzioni restituite**
```tsx
// ✅ Funzioni memoizzate
function useCounter() {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(c => c - 1);
  }, []);
  
  return { count, increment, decrement };
}
```

4. **Gestisci correttamente le dipendenze**
```tsx
// ✅ Dipendenze corrette
function useApi(url, options) {
  const fetchData = useCallback(async () => {
    // logica fetch
  }, [url, options]); // Dipendenze esplicite
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
}
```

#### ❌ Cosa Evitare

1. **Non creare hook che violano le regole**
```tsx
// ❌ Hook condizionale
function BadComponent() {
  if (condition) {
    const [state, setState] = useState(0); // Violazione regole
  }
  
  return <div>Component</div>;
}

// ✅ Hook sempre chiamato
function GoodComponent() {
  const [state, setState] = useState(0);
  
  if (condition) {
    // logica condizionale
  }
  
  return <div>Component</div>;
}
```

2. **Non creare hook che cambiano comportamento**
```tsx
// ❌ Hook con comportamento variabile
function useBadHook(shouldUseState) {
  if (shouldUseState) {
    return useState(0);
  } else {
    return [null, () => {}];
  }
}

// ✅ Hook con comportamento consistente
function useGoodHook(initialValue) {
  const [state, setState] = useState(initialValue);
  
  return [state, setState];
}
```

3. **Non creare hook troppo complessi**
```tsx
// ❌ Hook monolitico
function useMonolithicHook() {
  // 100+ righe di logica
  // Troppe responsabilità
  // Difficile da testare
}

// ✅ Hook focalizzati
function useUserState() { /* gestione stato utente */ }
function useUserActions() { /* azioni utente */ }
function useUserValidation() { /* validazione utente */ }
```

## Esempi Pratici

### Esempio 1: Hook per Gestione Utente
```tsx
function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Credenziali non valide');
      }
      
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);
  
  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Errore aggiornamento profilo');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Carica utente da localStorage al mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  return {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };
}
```

### Esempio 2: Hook per Gestione Tema
```tsx
function useTheme() {
  const [theme, setTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const setThemeExplicit = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);
  
  const useSystemTheme = useCallback(() => {
    setTheme(systemPreference);
  }, [systemPreference]);
  
  // Rileva preferenza sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newPreference = e.matches ? 'dark' : 'light';
      setSystemPreference(newPreference);
      
      // Aggiorna tema se non è stato impostato manualmente
      if (localStorage.getItem('theme') === 'system') {
        setTheme(newPreference);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Applica tema al DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Carica tema salvato al mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== 'system') {
      setTheme(savedTheme);
    } else if (savedTheme === 'system') {
      setTheme(systemPreference);
    }
  }, [systemPreference]);
  
  return {
    theme,
    systemPreference,
    toggleTheme,
    setTheme: setThemeExplicit,
    useSystemTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}
```

## Esercizi

### Esercizio 1: Hook per Gestione Carrello
Crea un hook `useCart` che gestisca:
- Aggiunta/rimozione prodotti
- Calcolo totale e quantità
- Persistenza in localStorage
- Gestione sconti e promozioni

### Esercizio 2: Hook per Gestione Notifiche
Implementa un hook `useNotifications` che gestisca:
- Stack di notifiche
- Tipi diversi (success, error, warning, info)
- Auto-dismiss
- Posizionamento personalizzato

### Esercizio 3: Hook per Gestione Form Avanzato
Crea un hook `useAdvancedForm` che gestisca:
- Validazione in tempo reale
- Gestione errori
- Submit asincrono
- Reset e dirty state

## Riepilogo

In questa lezione abbiamo imparato:

- **Custom Hooks** e i loro vantaggi
- **Pattern di creazione** e composizione
- **Hook per gestione stato** complesso
- **Hook per side effects** personalizzati
- **Hook per UI e interazione**
- **Hook per performance** e ottimizzazione
- **Hook per comunicazione** tra componenti
- **Best practices** e anti-patterns

I custom hooks sono uno strumento potente per:
- **Riutilizzare la logica** tra componenti
- **Separare le responsabilità** (business logic vs UI)
- **Migliorare la testabilità** del codice
- **Creare API consistenti** per la logica comune
- **Comporre funzionalità** complesse

Nella prossima lezione esploreremo **Suspense e Transizioni** per gestire stati di caricamento e transizioni fluide.

