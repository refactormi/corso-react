# Lezione 12: useEffect e Ciclo di Vita

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere il concetto di side effects in React
- Utilizzare useEffect per gestire effetti collaterali
- Gestire il ciclo di vita dei componenti funzionali
- Implementare cleanup e prevenire memory leaks
- Gestire dipendenze e ottimizzare le performance
- Utilizzare pattern avanzati con useEffect
- Evitare errori comuni nell'uso di useEffect

## Teoria

### 1. Side Effects in React

#### Cosa sono i Side Effects?
I side effects sono operazioni che influenzano qualcosa al di fuori del componente stesso, come:
- Chiamate API
- Sottoscrizioni a eventi
- Manipolazione del DOM
- Timer e interval
- Logging
- Autenticazione

#### Perché useEffect?
I componenti funzionali sono "pure" per natura, ma spesso abbiamo bisogno di eseguire side effects. `useEffect` ci permette di farlo in modo controllato e prevedibile.

```tsx
import { useState, useEffect } from 'react'

function Example(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  // Side effect: aggiorna il titolo del documento
  useEffect(() => {
    document.title = `Hai cliccato ${count} volte`
  })
  
  return (
    <div>
      <p>Hai cliccato {count} volte</p>
      <button onClick={() => setCount(count + 1)}>
        Clicca qui
      </button>
    </div>
  )
}
```

### 2. Sintassi di useEffect

#### Sintassi Base
```tsx
useEffect(() => {
  // Codice del side effect
}, [dependencies]);
```

#### Parametri:
1. **Funzione di effetto**: Il codice da eseguire
2. **Array di dipendenze**: Quando eseguire l'effetto (opzionale)

### 3. Tipi di useEffect

#### 1. Esecuzione ad Ogni Render
```tsx
function Component(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  // Si esegue ad ogni render
  useEffect(() => {
    console.log('Component renderizzato')
  })
  
  return <div>{count}</div>
}
```

#### 2. Esecuzione Solo al Mount
```tsx
interface Data {
  title: string
}

function Component(): JSX.Element {
  const [data, setData] = useState<Data | null>(null)
  
  // Si esegue solo al mount (componentDidMount)
  useEffect(() => {
    fetchData().then(setData)
  }, []) // Array vuoto = solo al mount
  
  return <div>{data ? data.title : 'Loading...'}</div>
}
```

#### 3. Esecuzione con Dipendenze
```tsx
interface User {
  name: string
}

interface UserProfileProps {
  userId: string
}

function UserProfile({ userId }: UserProfileProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  
  // Si esegue quando userId cambia
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId]) // Dipende da userId
  
  return <div>{user ? user.name : 'Loading...'}</div>
}
```

#### 4. Cleanup Function
```tsx
function Timer(): JSX.Element {
  const [seconds, setSeconds] = useState<number>(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    
    // Cleanup function
    return () => {
      clearInterval(interval)
    }
  }, []) // Solo al mount
  
  return <div>Timer: {seconds}s</div>
}
```

### 4. Pattern Avanzati

#### Pattern 1: Fetching Data
```tsx
interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useApi<T = any>(url: string): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(url)
        const result = await response.json()
        
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      cancelled = true
    }
  }, [url])
  
  return { data, loading, error }
}

interface User {
  id: number
  name: string
}

function UserList(): JSX.Element {
  const { data: users, loading, error } = useApi<User[]>('/api/users')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

#### Pattern 2: Event Listeners
```tsx
interface WindowSize {
  width: number
  height: number
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Solo al mount/unmount
  
  return windowSize
}

function ResponsiveComponent(): JSX.Element {
  const { width, height } = useWindowSize()
  
  return (
    <div>
      <p>Larghezza: {width}px</p>
      <p>Altezza: {height}px</p>
    </div>
  )
}
```

#### Pattern 3: Local Storage
```tsx
type SetValue<T> = (value: T | ((val: T) => T)) => void

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })
  
  const setValue: SetValue<T> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }
  
  return [storedValue, setValue]
}

function Settings(): JSX.Element {
  const [theme, setTheme] = useLocalStorage<string>('theme', 'light')
  const [language, setLanguage] = useLocalStorage<string>('language', 'it')
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="it">Italiano</option>
        <option value="en">English</option>
      </select>
    </div>
  )
}
```

#### Pattern 4: Debouncing
```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

interface SearchResult {
  id: number
  title: string
}

function SearchInput(): JSX.Element {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<SearchResult[]>([])
  const debouncedQuery = useDebounce(query, 300)
  
  useEffect(() => {
    if (debouncedQuery) {
      searchApi(debouncedQuery).then(setResults)
    } else {
      setResults([])
    }
  }, [debouncedQuery])
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 5. Gestione delle Dipendenze

#### Dipendenze Corrette
```tsx
interface User {
  name: string
}

interface UserProfileProps {
  userId: string
}

function UserProfile({ userId }: UserProfileProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId]) // ✅ Corretto: userId è una dipendenza
  
  return <div>{user?.name}</div>
}
```

#### Dipendenze Mancanti
```tsx
function Counter(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  const [multiplier, setMultiplier] = useState<number>(2)
  
  useEffect(() => {
    const result = count * multiplier
    console.log(`Risultato: ${result}`)
  }, [count]) // ❌ Errore: manca multiplier
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Multiplier: {multiplier}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setMultiplier(multiplier + 1)}>Increase Multiplier</button>
    </div>
  )
}
```

#### Dipendenze Eccessive
```tsx
function ExpensiveComponent(): JSX.Element {
  const [data, setData] = useState<any>(null)
  const [filter, setFilter] = useState<string>('')
  
  useEffect(() => {
    // Operazione costosa
    const processedData = expensiveProcessing(data)
    setData(processedData)
  }, [data, filter]) // ❌ Errore: data include se stesso
  
  return <div>{data}</div>
}
```

### 6. Cleanup e Memory Leaks

#### Problema: Memory Leaks
```tsx
function BadComponent(): JSX.Element {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().then(setData)
    }, 1000)
    
    // ❌ Errore: nessun cleanup
  }, [])
  
  return <div>{data}</div>
}
```

#### Soluzione: Cleanup
```tsx
function GoodComponent(): JSX.Element {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().then(setData)
    }, 1000)
    
    // ✅ Corretto: cleanup function
    return () => {
      clearInterval(interval)
    }
  }, [])
  
  return <div>{data}</div>
}
```

#### Cleanup con AbortController
```tsx
interface UseApiWithAbortReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useApiWithAbort<T = any>(url: string): UseApiWithAbortReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const abortController = new AbortController()
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(url, {
          signal: abortController.signal
        })
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    return () => {
      abortController.abort()
    }
  }, [url])
  
  return { data, loading, error }
}
```

### 7. Hook Personalizzati con useEffect

#### Hook per Timer
```tsx
interface UseTimerReturn {
  time: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

function useTimer(initialTime: number = 0): UseTimerReturn {
  const [time, setTime] = useState<number>(initialTime)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning])
  
  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setTime(initialTime)
    setIsRunning(false)
  }
  
  return { time, isRunning, start, pause, reset }
}

function Timer(): JSX.Element {
  const { time, isRunning, start, pause, reset } = useTimer(0)
  
  return (
    <div>
      <h2>Timer: {time}s</h2>
      <button onClick={isRunning ? pause : start}>
        {isRunning ? 'Pausa' : 'Avvia'}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

#### Hook per Geolocation
```tsx
interface Location {
  latitude: number
  longitude: number
  accuracy: number
}

interface UseGeolocationReturn {
  location: Location | null
  error: string | null
  loading: boolean
}

function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation non supportata')
      return
    }
    
    setLoading(true)
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
        setError(null)
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
    
    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])
  
  return { location, error, loading }
}

function LocationTracker(): JSX.Element {
  const { location, error, loading } = useGeolocation()
  
  if (loading) return <div>Caricamento posizione...</div>
  if (error) return <div>Errore: {error}</div>
  if (!location) return <div>Posizione non disponibile</div>
  
  return (
    <div>
      <h3>La tua posizione:</h3>
      <p>Latitudine: {location.latitude}</p>
      <p>Longitudine: {location.longitude}</p>
      <p>Precisione: {location.accuracy}m</p>
    </div>
  )
}
```

### 8. Ottimizzazione delle Performance

#### useCallback per Funzioni
```tsx
interface Item {
  id: number
  name: string
}

interface ExpensiveComponentProps {
  items: Item[]
  onItemClick: (item: Item) => void
}

function ExpensiveComponent({ items, onItemClick }: ExpensiveComponentProps): JSX.Element {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  
  // ❌ Errore: funzione ricreata ad ogni render
  const handleFilter = (filter: string) => {
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredItems(filtered)
  }
  
  useEffect(() => {
    handleFilter('')
  }, [items]) // items cambia, ma handleFilter è ricreata
  
  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => onItemClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

#### Soluzione con useCallback
```tsx
interface Item {
  id: number
  name: string
}

interface OptimizedComponentProps {
  items: Item[]
  onItemClick: (item: Item) => void
}

function OptimizedComponent({ items, onItemClick }: OptimizedComponentProps): JSX.Element {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  
  // ✅ Corretto: funzione memoizzata
  const handleFilter = useCallback((filter: string) => {
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [items]) // Dipende da items
  
  useEffect(() => {
    handleFilter('')
  }, [handleFilter]) // Dipende da handleFilter memoizzata
  
  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => onItemClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

#### useMemo per Valori Calcolati
```tsx
function DataVisualization({ data, filters }) {
  // ❌ Errore: calcolo eseguito ad ogni render
  const processedData = data
    .filter(item => filters.category === 'all' || item.category === filters.category)
    .sort((a, b) => a.value - b.value)
    .slice(0, 100);
  
  useEffect(() => {
    updateChart(processedData);
  }, [processedData]); // processedData è ricreata ad ogni render
  
  return <div>Chart component</div>;
}
```

#### Soluzione con useMemo
```tsx
interface DataItem {
  id: number
  category: string
  value: number
}

interface Filters {
  category: string
}

interface OptimizedDataVisualizationProps {
  data: DataItem[]
  filters: Filters
}

function OptimizedDataVisualization({ data, filters }: OptimizedDataVisualizationProps): JSX.Element {
  // ✅ Corretto: calcolo memoizzato
  const processedData = useMemo(() => {
    return data
      .filter(item => filters.category === 'all' || item.category === filters.category)
      .sort((a, b) => a.value - b.value)
      .slice(0, 100)
  }, [data, filters]) // Dipende da data e filters
  
  useEffect(() => {
    updateChart(processedData)
  }, [processedData]) // processedData è memoizzata
  
  return <div>Chart component</div>
}
```

### 9. Errori Comuni e Best Practices

#### ❌ Errori Comuni

1. **Dimenticare le dipendenze**
```tsx
// ❌ Errore
useEffect(() => {
  fetchData(userId);
}, []); // Manca userId
```

2. **Dipendenze eccessive**
```tsx
// ❌ Errore
useEffect(() => {
  setData(processData(data));
}, [data]); // data include se stesso
```

3. **Nessun cleanup**
```tsx
// ❌ Errore
useEffect(() => {
  const interval = setInterval(() => {
    // ...
  }, 1000);
  // Nessun cleanup
}, []);
```

4. **useEffect per calcoli sincroni**
```tsx
// ❌ Errore
useEffect(() => {
  const result = a + b;
  setResult(result);
}, [a, b]); // Dovrebbe essere useMemo
```

#### ✅ Best Practices

1. **Usa useEffect solo per side effects**
```tsx
// ✅ Corretto
const result = useMemo(() => a + b, [a, b]);
```

2. **Includi tutte le dipendenze**
```tsx
// ✅ Corretto
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

3. **Sempre cleanup quando necessario**
```tsx
// ✅ Corretto
useEffect(() => {
  const interval = setInterval(() => {
    // ...
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

4. **Usa hook personalizzati per logica complessa**
```tsx
// ✅ Corretto
function useApi<T = any>(url: string) {
  // Logica complessa qui
  return { data, loading, error }
}
```

### 10. Debugging useEffect

#### Console Logging
```tsx
function DebugComponent(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  const [name, setName] = useState<string>('')
  
  useEffect(() => {
    console.log('Effect eseguito:', { count, name })
    
    return () => {
      console.log('Cleanup eseguito:', { count, name })
    }
  }, [count, name])
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  )
}
```

#### React DevTools
- Usa React DevTools per vedere quando i componenti si aggiornano
- Controlla il profiler per identificare re-render inutili
- Usa il tab "Components" per ispezionare lo stato

#### ESLint Rules
```json
{
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

## Esempi Pratici

### Esempio 1: Dashboard con Dati in Tempo Reale
```tsx
interface UseRealTimeDataReturn<T> {
  data: T | null
  error: string | null
  connected: boolean
}

function useRealTimeData<T = any>(endpoint: string): UseRealTimeDataReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState<boolean>(false)
  
  useEffect(() => {
    const eventSource = new EventSource(endpoint)
    
    eventSource.onopen = () => {
      setConnected(true)
      setError(null)
    }
    
    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data)
        setData(newData)
      } catch (err) {
        setError('Errore nel parsing dei dati')
      }
    }
    
    eventSource.onerror = () => {
      setConnected(false)
      setError('Errore di connessione')
    }
    
    return () => {
      eventSource.close()
    }
  }, [endpoint])
  
  return { data, error, connected }
}

function Dashboard(): JSX.Element {
  const { data, error, connected } = useRealTimeData('/api/stream')
  
  return (
    <div>
      <div>Stato: {connected ? '🟢 Connesso' : '🔴 Disconnesso'}</div>
      {error && <div>Errore: {error}</div>}
      {data && (
        <div>
          <h2>Dati in Tempo Reale</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

### Esempio 2: Gestione Focus e Keyboard
```tsx
type ShortcutCallback = () => void

interface Shortcuts {
  [key: string]: ShortcutCallback
}

interface UseKeyboardShortcutsReturn {
  registerShortcut: (key: string, callback: ShortcutCallback) => void
}

function useKeyboardShortcuts(): UseKeyboardShortcutsReturn {
  const [shortcuts, setShortcuts] = useState<Shortcuts>({})
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const modifiers = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey
      }
      
      const shortcut = `${modifiers.ctrl ? 'ctrl+' : ''}${modifiers.alt ? 'alt+' : ''}${modifiers.shift ? 'shift+' : ''}${modifiers.meta ? 'cmd+' : ''}${key}`
      
      if (shortcuts[shortcut]) {
        event.preventDefault()
        shortcuts[shortcut]()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
  
  const registerShortcut = (key: string, callback: ShortcutCallback) => {
    setShortcuts(prev => ({
      ...prev,
      [key]: callback
    }))
  }
  
  return { registerShortcut }
}

function TextEditor(): JSX.Element {
  const [text, setText] = useState<string>('')
  const { registerShortcut } = useKeyboardShortcuts()
  
  useEffect(() => {
    registerShortcut('ctrl+s', () => {
      console.log('Salvataggio...')
      // Logica di salvataggio
    })
    
    registerShortcut('ctrl+z', () => {
      console.log('Undo...')
      // Logica di undo
    })
  }, [registerShortcut])
  
  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Digita qui... (Ctrl+S per salvare, Ctrl+Z per annullare)"
    />
  )
}
```

## Esercizi

### Esercizio 1: Timer con Pausa
Crea un timer che:
- Parte da 0 e conta i secondi
- Ha pulsanti per avviare, pausare e resettare
- Salva il tempo in localStorage
- Mostra il tempo in formato MM:SS

### Esercizio 2: Chat in Tempo Reale
Implementa una chat che:
- Si connette a un WebSocket
- Mostra messaggi in tempo reale
- Gestisce la riconnessione automatica
- Salva la cronologia in localStorage

### Esercizio 3: Gestione Tema
Crea un sistema di temi che:
- Cambia tra light e dark mode
- Salva la preferenza in localStorage
- Applica il tema al body del documento
- Ha transizioni smooth tra i temi

## Riepilogo

In questa lezione abbiamo imparato:

- **Side effects** e quando usarli
- **useEffect** per gestire effetti collaterali
- **Ciclo di vita** dei componenti funzionali
- **Cleanup** e prevenzione memory leaks
- **Dipendenze** e ottimizzazione performance
- **Hook personalizzati** con useEffect
- **Pattern avanzati** per casi d'uso comuni
- **Best practices** e errori da evitare

useEffect è uno degli hook più potenti di React, ma richiede attenzione per essere usato correttamente. Ricorda sempre di:

- Includere tutte le dipendenze necessarie
- Implementare cleanup quando necessario
- Usare useEffect solo per side effects
- Ottimizzare le performance con useCallback e useMemo
- Testare i tuoi hook personalizzati

Nella prossima lezione esploreremo useRef e la manipolazione del DOM.
