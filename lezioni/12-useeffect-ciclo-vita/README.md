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

Il **debouncing** è una tecnica che ritarda l'esecuzione di una funzione fino a quando non passa un certo periodo di tempo senza che l'utente esegua ulteriori azioni. È utile per evitare chiamate API eccessive durante la digitazione.

**Esempio pratico**: Immagina di cercare su Google. Se facesse una ricerca ad ogni lettera digitata, farebbe troppe richieste. Invece, aspetta che tu finisca di digitare (circa 300ms di pausa) prima di cercare.

```tsx
/**
 * Hook personalizzato per il debouncing di un valore
 * 
 * @param value - Il valore da "debounciare" (es. testo di ricerca)
 * @param delay - Millisecondi di attesa prima di aggiornare il valore (es. 300ms)
 * @returns Il valore debounced, aggiornato solo dopo il delay
 * 
 * Come funziona:
 * 1. L'utente digita "ciao" lettera per lettera
 * 2. Ad ogni lettera, il timer viene resettato
 * 3. Solo quando l'utente smette di digitare per 300ms, il valore viene aggiornato
 * 4. Questo evita di fare una chiamata API per ogni singola lettera
 */
function useDebounce<T>(value: T, delay: number): T {
  // Stato interno che contiene il valore "ritardato"
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    // Impostiamo un timer che aggiornerà il valore dopo 'delay' millisecondi
    // Esempio: se delay = 300, aspetterà 300ms prima di eseguire questa funzione
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    // CLEANUP FUNCTION (molto importante!)
    // Questa funzione viene eseguita:
    // 1. Prima che l'effect venga rieseguito (quando value cambia)
    // 2. Quando il componente viene smontato
    // 
    // Cancella il timer precedente, così se l'utente continua a digitare,
    // il timer viene resettato e non aggiorna il valore fino a quando
    // non smette di digitare per 'delay' millisecondi
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // L'effect si riesegue quando value o delay cambiano
  
  // Ritorna il valore "debounced" (ritardato)
  return debouncedValue
}

interface SearchResult {
  id: number
  title: string
}

/**
 * Componente di esempio che usa il debouncing per una barra di ricerca
 * 
 * Scenario senza debouncing:
 * - Utente digita "react"
 * - Vengono fatte 5 chiamate API: "r", "re", "rea", "reac", "react"
 * - Spreco di risorse e possibili problemi di performance
 * 
 * Scenario con debouncing:
 * - Utente digita "react"
 * - Viene fatta 1 sola chiamata API: "react" (dopo 300ms dall'ultima lettera)
 * - Ottimizzazione delle risorse e migliore esperienza utente
 */
function SearchInput(): JSX.Element {
  // Stato per il testo digitato dall'utente (si aggiorna ad ogni lettera)
  const [query, setQuery] = useState<string>('')
  
  // Stato per i risultati della ricerca
  const [results, setResults] = useState<SearchResult[]>([])
  
  // Usiamo il nostro hook per ottenere una versione "debounced" della query
  // debouncedQuery si aggiorna solo 300ms dopo che l'utente smette di digitare
  const debouncedQuery = useDebounce(query, 300)
  
  // Questo effect si esegue solo quando debouncedQuery cambia
  // NON quando query cambia ad ogni lettera!
  useEffect(() => {
    // Se c'è del testo da cercare
    if (debouncedQuery) {
      // Fai la chiamata API solo ora (dopo 300ms di pausa nella digitazione)
      searchApi(debouncedQuery).then(setResults)
    } else {
      // Se la query è vuota, svuota i risultati
      setResults([])
    }
  }, [debouncedQuery]) // Dipende da debouncedQuery, non da query!
  
  return (
    <div>
      {/* L'input si aggiorna immediatamente mentre l'utente digita */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca..."
      />
      
      {/* I risultati vengono mostrati solo dopo il debounce */}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  )
}

/**
 * RIEPILOGO DEL FLUSSO:
 * 
 * 1. Utente digita "r" → query = "r" (immediato)
 *    - Timer parte (300ms)
 * 
 * 2. Utente digita "e" (dopo 100ms) → query = "re" (immediato)
 *    - Timer precedente viene cancellato
 *    - Nuovo timer parte (300ms)
 * 
 * 3. Utente digita "a" (dopo 100ms) → query = "rea" (immediato)
 *    - Timer precedente viene cancellato
 *    - Nuovo timer parte (300ms)
 * 
 * 4. Utente digita "c" (dopo 100ms) → query = "reac" (immediato)
 *    - Timer precedente viene cancellato
 *    - Nuovo timer parte (300ms)
 * 
 * 5. Utente digita "t" (dopo 100ms) → query = "react" (immediato)
 *    - Timer precedente viene cancellato
 *    - Nuovo timer parte (300ms)
 * 
 * 6. Passano 300ms senza nuove digitazioni
 *    - debouncedQuery = "react" (finalmente aggiornato!)
 *    - Viene eseguita UNA SOLA chiamata API con "react"
 * 
 * VANTAGGI:
 * ✅ Riduce il numero di chiamate API da 5 a 1
 * ✅ Migliora le performance
 * ✅ Riduce il carico sul server
 * ✅ Migliora l'esperienza utente (meno richieste = più veloce)
 */
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

#### Dipendenze Eccessive (Loop Infinito!)
```tsx
function ExpensiveComponent(): JSX.Element {
  const [data, setData] = useState<any>(null)
  const [filter, setFilter] = useState<string>('')
  
  useEffect(() => {
    // Operazione costosa
    const processedData = expensiveProcessing(data)
    setData(processedData)  // ← Modifica 'data'
  }, [data, filter]) // ❌ Errore: dipende da 'data' che viene modificato dentro!
  
  return <div>{data}</div>
}

/**
 * PROBLEMA - LOOP INFINITO:
 * 
 * 1. useEffect si esegue perché 'data' è cambiato
 * 2. Dentro l'effect, chiamiamo setData(processedData)
 * 3. setData modifica 'data'
 * 4. 'data' è cambiato → useEffect si riesegue (torna al punto 1)
 * 5. Loop infinito! 🔄♾️
 * 
 * È come dire: "Ogni volta che 'data' cambia, cambia 'data'"
 * 
 * SOLUZIONE 1: Rimuovi 'data' dalle dipendenze se non serve
 * SOLUZIONE 2: Usa una variabile diversa per il risultato
 * SOLUZIONE 3: Usa useMemo invece di useEffect per calcoli
 */
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

**Problema**: Se l'utente cambia pagina mentre una chiamata API è in corso, il componente viene smontato ma la chiamata continua. Quando la risposta arriva, prova ad aggiornare lo stato di un componente che non esiste più → **errore!**

**Soluzione**: `AbortController` permette di **cancellare** una chiamata fetch in corso.

> **Nota**: `AbortController` è un'API nativa del browser (come `fetch` o `setTimeout`), quindi non serve importarla. È disponibile globalmente in tutti i browser moderni e in Node.js 15+.

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
    // 1. Creiamo un "controller" che può cancellare la richiesta
    const abortController = new AbortController()
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 2. Passiamo il "signal" alla fetch
        //    Questo collega la richiesta al controller
        const response = await fetch(url, {
          signal: abortController.signal  // ← Collegamento importante!
        })
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        // 3. Se la richiesta è stata cancellata, ignoriamo l'errore
        //    (è normale, l'abbiamo cancellata noi!)
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    // 4. CLEANUP: quando il componente si smonta o l'url cambia,
    //    cancelliamo la richiesta in corso
    return () => {
      abortController.abort()  // ← Cancella la fetch!
    }
  }, [url])
  
  return { data, loading, error }
}

/**
 * SCENARIO PRATICO:
 * 
 * 1. Utente apre pagina "/api/users" → fetch parte
 * 2. Dopo 1 secondo, utente cambia pagina → componente si smonta
 * 3. La cleanup function viene eseguita → abort() cancella la fetch
 * 4. La risposta arriva dopo 2 secondi → viene ignorata (già cancellata)
 * 5. Nessun errore! ✅
 * 
 * SENZA AbortController:
 * - La fetch continua anche dopo lo smontaggio
 * - Quando arriva la risposta, prova a fare setData()
 * - Errore: "Can't perform a React state update on an unmounted component" ❌
 */
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

Hook che traccia la posizione GPS dell'utente in tempo reale usando l'API `navigator.geolocation` del browser.

> **Nota**: `navigator.geolocation` è un'API nativa del browser. Richiede il permesso dell'utente per funzionare.

```tsx
interface Location {
  latitude: number   // Latitudine (es. 45.4642 per Torino)
  longitude: number  // Longitudine (es. 9.1900 per Milano)
  accuracy: number   // Precisione in metri (es. 10 = ±10 metri)
}

interface UseGeolocationReturn {
  location: Location | null  // Posizione corrente (null se non ancora disponibile)
  error: string | null       // Messaggio di errore se qualcosa va storto
  loading: boolean           // true durante il caricamento iniziale
}

function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  useEffect(() => {
    // 1. Verifica se il browser supporta la geolocalizzazione
    if (!navigator.geolocation) {
      setError('Geolocation non supportata')
      return  // Esci subito, non c'è niente da fare
    }
    
    setLoading(true)
    
    // 2. watchPosition monitora la posizione in tempo reale
    //    (a differenza di getCurrentPosition che la legge una sola volta)
    const watchId = navigator.geolocation.watchPosition(
      // SUCCESS CALLBACK: chiamata quando la posizione è disponibile
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
        setError(null)
        setLoading(false)
      },
      // ERROR CALLBACK: chiamata se c'è un errore
      (error) => {
        setError(error.message)
        setLoading(false)
      },
      // OPZIONI:
      {
        enableHighAccuracy: true,  // Usa GPS invece di WiFi/IP (più preciso ma più lento)
        timeout: 10000,            // Timeout dopo 10 secondi
        maximumAge: 300000         // Accetta posizioni "vecchie" fino a 5 minuti (300000ms)
      }
    )
    
    // 3. CLEANUP: ferma il monitoraggio quando il componente si smonta
    //    Importante per non sprecare batteria!
    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])  // Array vuoto = esegui solo al mount
  
  return { location, error, loading }
}

/**
 * Componente che mostra la posizione dell'utente
 * 
 * FLUSSO:
 * 1. Il browser chiede il permesso all'utente
 * 2. Se accetta → mostra la posizione
 * 3. Se rifiuta → mostra l'errore
 * 4. La posizione si aggiorna automaticamente se l'utente si muove
 */
function LocationTracker(): JSX.Element {
  const { location, error, loading } = useGeolocation()
  
  // Gestione degli stati
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

/**
 * DIFFERENZA TRA getCurrentPosition e watchPosition:
 * 
 * getCurrentPosition():
 * - Legge la posizione UNA SOLA VOLTA
 * - Utile per: "Dove sono adesso?"
 * 
 * watchPosition():
 * - Monitora la posizione CONTINUAMENTE
 * - Utile per: "Traccia il mio percorso mentre cammino"
 * - ⚠️ Consuma più batteria!
 * - ⚠️ Ricordati sempre il cleanup con clearWatch()
 */
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

Questo esempio mostra come creare un sistema di **keyboard shortcuts** (scorciatoie da tastiera) riutilizzabile, simile a quello che trovi in editor come VS Code, Google Docs o Notion.

**Caso d'uso**: Immagina di costruire un editor di testo dove l'utente può:
- Premere `Ctrl+S` per salvare
- Premere `Ctrl+Z` per annullare
- Premere `Ctrl+B` per rendere il testo in grassetto
- E così via...

Invece di gestire gli eventi tastiera in ogni componente, creiamo un **custom hook** che centralizza questa logica.

```tsx
// Tipo per le funzioni callback delle scorciatoie
// Esempio: () => console.log('Salvato!')
type ShortcutCallback = () => void

// Interfaccia per memorizzare le scorciatoie
// Struttura: { 'ctrl+s': funzioneCallback, 'ctrl+z': altraFunzione }
interface Shortcuts {
  [key: string]: ShortcutCallback
}

// Interfaccia di ritorno del nostro hook personalizzato
interface UseKeyboardShortcutsReturn {
  registerShortcut: (key: string, callback: ShortcutCallback) => void
}

/**
 * HOOK PERSONALIZZATO: useKeyboardShortcuts
 * 
 * Gestisce le scorciatoie da tastiera in modo centralizzato.
 * 
 * FUNZIONAMENTO:
 * 1. Mantiene un oggetto con tutte le scorciatoie registrate
 * 2. Ascolta gli eventi 'keydown' sul documento
 * 3. Quando viene premuto un tasto, controlla se corrisponde a una scorciatoia
 * 4. Se sì, esegue la funzione callback associata
 * 
 * VANTAGGI:
 * ✅ Centralizza la gestione delle scorciatoie
 * ✅ Riutilizzabile in qualsiasi componente
 * ✅ Supporta modificatori (Ctrl, Alt, Shift, Cmd)
 * ✅ Previene il comportamento di default del browser
 */
function useKeyboardShortcuts(): UseKeyboardShortcutsReturn {
  // State per memorizzare tutte le scorciatoie registrate
  // Esempio: { 'ctrl+s': () => save(), 'ctrl+z': () => undo() }
  const [shortcuts, setShortcuts] = useState<Shortcuts>({})
  
  useEffect(() => {
    /**
     * HANDLER DEGLI EVENTI TASTIERA
     * 
     * Viene chiamato ogni volta che l'utente preme un tasto
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      // 1. Ottieni il tasto premuto (es. 's', 'z', 'enter')
      const key = event.key.toLowerCase()
      
      // 2. Controlla quali modificatori sono premuti
      //    (Ctrl, Alt, Shift, Cmd/Meta)
      const modifiers = {
        ctrl: event.ctrlKey,    // true se Ctrl è premuto
        alt: event.altKey,      // true se Alt è premuto
        shift: event.shiftKey,  // true se Shift è premuto
        meta: event.metaKey     // true se Cmd (Mac) o Win (Windows) è premuto
      }
      
      // 3. Costruisci la stringa della scorciatoia
      //    Esempio: se premi Ctrl+S → 'ctrl+s'
      //    Esempio: se premi Ctrl+Shift+Z → 'ctrl+shift+z'
      const shortcut = `${modifiers.ctrl ? 'ctrl+' : ''}${modifiers.alt ? 'alt+' : ''}${modifiers.shift ? 'shift+' : ''}${modifiers.meta ? 'cmd+' : ''}${key}`
      
      // 4. Controlla se questa scorciatoia è stata registrata
      if (shortcuts[shortcut]) {
        // Previeni il comportamento di default del browser
        // (es. Ctrl+S normalmente apre la finestra di salvataggio del browser)
        event.preventDefault()
        
        // Esegui la funzione callback associata
        shortcuts[shortcut]()
      }
    }
    
    // SETUP: Aggiungi l'event listener al documento
    // Questo ascolta TUTTI gli eventi tastiera nella pagina
    document.addEventListener('keydown', handleKeyDown)
    
    // CLEANUP: Rimuovi l'event listener quando il componente si smonta
    // o quando le scorciatoie cambiano
    // ⚠️ IMPORTANTE: senza questo, l'event listener rimarrebbe attivo
    // anche dopo che il componente è stato distrutto → memory leak!
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts]) // Ri-esegui quando le scorciatoie cambiano
  
  /**
   * FUNZIONE PER REGISTRARE UNA NUOVA SCORCIATOIA
   * 
   * @param key - La scorciatoia (es. 'ctrl+s', 'ctrl+shift+z')
   * @param callback - La funzione da eseguire quando viene premuta
   * 
   * Esempio d'uso:
   * registerShortcut('ctrl+s', () => console.log('Salvato!'))
   */
  const registerShortcut = (key: string, callback: ShortcutCallback) => {
    setShortcuts(prev => ({
      ...prev,        // Mantieni le scorciatoie esistenti
      [key]: callback // Aggiungi la nuova scorciatoia
    }))
  }
  
  // Ritorna la funzione per registrare scorciatoie
  return { registerShortcut }
}

/**
 * COMPONENTE ESEMPIO: TextEditor
 * 
 * Un semplice editor di testo che usa le scorciatoie da tastiera.
 * 
 * SCORCIATOIE DISPONIBILI:
 * - Ctrl+S: Salva il documento
 * - Ctrl+Z: Annulla l'ultima modifica
 */
function TextEditor(): JSX.Element {
  // State per il testo dell'editor
  const [text, setText] = useState<string>('')
  
  // Usa il nostro hook personalizzato
  const { registerShortcut } = useKeyboardShortcuts()
  
  // REGISTRAZIONE DELLE SCORCIATOIE
  // Questo useEffect viene eseguito solo al mount del componente
  useEffect(() => {
    // Registra Ctrl+S per salvare
    registerShortcut('ctrl+s', () => {
      console.log('Salvataggio...')
      // Qui potresti chiamare un'API per salvare il testo:
      // await fetch('/api/save', { method: 'POST', body: JSON.stringify({ text }) })
    })
    
    // Registra Ctrl+Z per annullare
    registerShortcut('ctrl+z', () => {
      console.log('Undo...')
      // Qui potresti implementare la logica di undo:
      // setText(previousText)
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

/**
 * FLUSSO COMPLETO:
 * 
 * 1. L'utente apre il TextEditor
 * 2. Il componente registra le scorciatoie Ctrl+S e Ctrl+Z
 * 3. L'hook useKeyboardShortcuts aggiunge un event listener al documento
 * 4. L'utente digita del testo nella textarea
 * 5. L'utente preme Ctrl+S
 * 6. L'event listener cattura l'evento
 * 7. Costruisce la stringa 'ctrl+s'
 * 8. Trova la funzione callback associata
 * 9. Previene il comportamento di default del browser
 * 10. Esegue la funzione callback (console.log('Salvataggio...'))
 * 
 * QUANDO IL COMPONENTE SI SMONTA:
 * 11. Il cleanup di useEffect rimuove l'event listener
 * 12. Nessun memory leak! ✅
 * 
 * VANTAGGI DI QUESTO PATTERN:
 * ✅ Riutilizzabile: puoi usare useKeyboardShortcuts in qualsiasi componente
 * ✅ Centralizzato: tutta la logica delle scorciatoie è in un solo posto
 * ✅ Flessibile: supporta qualsiasi combinazione di tasti
 * ✅ Sicuro: fa cleanup correttamente per evitare memory leaks
 * ✅ Testabile: puoi testare l'hook separatamente dal componente
 * 
 * POSSIBILI MIGLIORAMENTI:
 * 💡 Aggiungere supporto per scorciatoie multiple (es. Ctrl+K Ctrl+S come in VS Code)
 * 💡 Permettere di disabilitare/abilitare scorciatoie dinamicamente
 * 💡 Aggiungere un sistema di priorità per scorciatoie in conflitto
 * 💡 Mostrare un tooltip con le scorciatoie disponibili
 */
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
