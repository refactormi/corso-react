# Lezione 14a: Context API vs Zustand - State Management Moderno

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere le differenze tra Context API e Zustand
- Identificare quando usare Context API e quando Zustand
- Creare e utilizzare store Zustand con TypeScript
- Implementare pattern avanzati con Zustand
- Ottimizzare le performance con Zustand
- Applicare best practices per Zustand
- Migrare da Context API a Zustand quando necessario

## Teoria

### 1. Introduzione a Zustand

#### Cos'è Zustand?
Zustand è una libreria di state management leggera e moderna per React. Il nome "Zustand" deriva dal tedesco e significa "stato" o "condizione". È progettata per essere semplice, performante e senza boilerplate.

#### Caratteristiche Principali:
- ✅ **Leggero**: Solo ~1KB gzipped
- ✅ **Semplice**: API minimale e intuitiva
- ✅ **Performante**: Evita re-render inutili automaticamente
- ✅ **TypeScript**: Supporto nativo per TypeScript
- ✅ **Flessibile**: Nessun Provider necessario per store base
- ✅ **Middleware**: Supporto per persistenza, devtools, ecc.

#### Installazione

```bash
npm install zustand
```

### 2. Context API vs Zustand: Confronto

#### Quando Usare Context API?

**Vantaggi Context API:**
- ✅ **Nativo**: Parte integrante di React, nessuna dipendenza esterna
- ✅ **Semplicità**: Perfetto per dati semplici e raramente cambianti
- ✅ **Leggero**: Zero overhead aggiuntivo
- ✅ **Learning Curve**: Più facile da imparare per principianti

**Limiti Context API:**
- ❌ **Re-render**: Tutti i consumer vengono ri-renderizzati quando il valore cambia
- ❌ **Boilerplate**: Serve Provider per ogni Context
- ❌ **Performance**: Richiede ottimizzazioni manuali (useMemo, split contexts)
- ❌ **Complessità**: Diventa complesso con molti Context

```tsx
// ❌ Problema: Tutti i consumer vengono ri-renderizzati
// Creiamo un Context per il tema con TypeScript
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  // State locale per gestire il tema corrente
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // PROBLEMA: Ogni volta che theme cambia, TUTTI i componenti che usano questo Context
  // vengono ri-renderizzati, anche se usano solo toggleTheme e non il valore di theme!
  // Questo può causare problemi di performance in applicazioni complesse
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(...) }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

#### Quando Usare Zustand?

**Vantaggi Zustand:**
- ✅ **Performance**: Solo i componenti che usano i dati cambiati vengono ri-renderizzati
- ✅ **Semplicità**: Nessun Provider necessario per store base
- ✅ **Selective Subscription**: Sottoscrizione selettiva ai dati
- ✅ **Developer Experience**: API pulita e intuitiva
- ✅ **Middleware**: Persistenza, devtools, immer integrati
- ✅ **Scalabilità**: Perfetto per applicazioni complesse

**Limiti Zustand:**
- ❌ **Dipendenze**: Richiede installazione di libreria esterna
- ❌ **Learning Curve**: Nuova API da imparare

```tsx
// ✅ Soluzione: Solo i componenti che usano theme vengono ri-renderizzati
// Importiamo la funzione create da Zustand per creare uno store
import { create } from 'zustand'

// Definiamo l'interfaccia TypeScript per il nostro store
// Questo ci dà type safety e autocompletamento
interface ThemeStore {
  theme: 'light' | 'dark'      // Lo stato del tema
  toggleTheme: () => void       // L'azione per cambiare il tema
}

// Creiamo lo store con Zustand usando create()
// La funzione create accetta una callback che riceve 'set' per aggiornare lo stato
const useThemeStore = create<ThemeStore>((set) => ({
  // Stato iniziale
  theme: 'light',
  
  // Azione per cambiare il tema
  // set() può ricevere una funzione che accede allo stato corrente (state)
  // e ritorna il nuovo stato (solo le proprietà che cambiano)
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))

// Componente che usa solo theme
function Header(): JSX.Element {
  // SELECTIVE SUBSCRIPTION: Sottoscriviamo solo alla proprietà 'theme'
  // Questo componente si ri-renderizza SOLO quando 'theme' cambia
  // Non si ri-renderizza quando altre proprietà dello store cambiano
  const theme = useThemeStore((state) => state.theme)
  return <header>Theme: {theme}</header>
}

// Componente che usa solo toggleTheme
function ThemeButton(): JSX.Element {
  // SELECTIVE SUBSCRIPTION: Sottoscriviamo solo alla funzione 'toggleTheme'
  // Poiché le funzioni non cambiano, questo componente NON si ri-renderizza mai!
  // Questo è il vero vantaggio di Zustand rispetto a Context API
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  return <button onClick={toggleTheme}>Toggle</button>
}
```

### 3. Creare Store con Zustand

#### Store Base

```tsx
// Importiamo create da Zustand
import { create } from 'zustand'

// Definiamo l'interfaccia TypeScript per il nostro store Counter
// Questo definisce la "forma" del nostro stato globale
interface CounterStore {
  count: number              // Lo stato: il valore del contatore
  increment: () => void      // Azione: incrementa di 1
  decrement: () => void      // Azione: decrementa di 1
  reset: () => void          // Azione: resetta a 0
}

// Creiamo lo store usando create<T>() con il tipo TypeScript
// La funzione riceve 'set' che è usata per aggiornare lo stato
const useCounterStore = create<CounterStore>((set) => ({
  // Stato iniziale
  count: 0,
  
  // Azioni: funzioni che modificano lo stato
  // set() accetta una funzione che riceve lo stato corrente
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  
  // set() può anche ricevere direttamente un oggetto per aggiornamenti semplici
  reset: () => set({ count: 0 }),
}))

// Utilizzo dello store in un componente
function Counter(): JSX.Element {
  // Possiamo destrutturare tutto lo store se ci serve tutto
  // ATTENZIONE: questo causa re-render quando qualsiasi proprietà cambia
  // In questo caso va bene perché usiamo tutto
  const { count, increment, decrement, reset } = useCounterStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

**Vedi esempio completo**: [`esempi/01-zustand-base.tsx`](esempi/01-zustand-base.tsx)

#### Store Base: Gestione della Persistenza

Zustand offre diverse opzioni per gestire dove salvare lo stato:

##### 1. Store in Memoria (Default)

```tsx
// OPZIONE 1: Store in MEMORIA (default)
// Lo stato vive solo in memoria e viene perso al refresh della pagina

import { create } from 'zustand'

interface CounterStore {
  count: number
  increment: () => void
  reset: () => void
}

// Store base senza middleware: lo stato è solo in memoria
const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))

// CARATTERISTICHE:
// ✅ Più veloce (nessuna lettura/scrittura da storage)
// ✅ Ideale per dati temporanei o sensibili
// ❌ Lo stato viene perso al refresh della pagina
// ❌ Non persiste tra sessioni
```

##### 2. Store in localStorage

```tsx
// OPZIONE 2: Store in LOCAL STORAGE
// Lo stato persiste anche dopo la chiusura del browser

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CounterStore {
  count: number
  increment: () => void
  reset: () => void
}

// Usiamo il middleware 'persist' con localStorage (default)
const useCounterStore = create<CounterStore>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'counter-storage', // Nome della chiave in localStorage
      // storage: createJSONStorage(() => localStorage), // Opzionale: localStorage è il default
    }
  )
)

// CARATTERISTICHE:
// ✅ Lo stato persiste dopo il refresh della pagina
// ✅ Lo stato persiste dopo la chiusura del browser
// ✅ Condiviso tra tutte le tab del browser
// ✅ Ideale per preferenze utente, tema, lingua, ecc.
// ❌ Limite di ~5-10MB (dipende dal browser)
// ❌ Sincronizzato (può bloccare il thread principale con dati grandi)

// QUANDO USARLO:
// - Preferenze utente (tema, lingua, layout)
// - Dati che devono persistere tra sessioni
// - Carrello e-commerce
// - Stato dell'applicazione che l'utente vuole mantenere
```

##### 3. Store in sessionStorage

```tsx
// OPZIONE 3: Store in SESSION STORAGE
// Lo stato persiste solo per la durata della sessione (tab corrente)

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CounterStore {
  count: number
  increment: () => void
  reset: () => void
}

// Usiamo il middleware 'persist' con sessionStorage
const useCounterStore = create<CounterStore>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'counter-storage', // Nome della chiave in sessionStorage
      storage: createJSONStorage(() => sessionStorage), // Specifichiamo sessionStorage
    }
  )
)

// CARATTERISTICHE:
// ✅ Lo stato persiste dopo il refresh della pagina
// ✅ Isolato per ogni tab (ogni tab ha il suo stato)
// ❌ Lo stato viene perso alla chiusura della tab
// ❌ Non condiviso tra tab diverse
// ✅ Limite più alto di localStorage (~5-10MB)
// ✅ Ideale per dati di sessione temporanei

// QUANDO USARLO:
// - Wizard multi-step (form complessi)
// - Dati di sessione temporanei
// - Stato che non deve essere condiviso tra tab
// - Dati sensibili che non devono persistere dopo la chiusura
```

##### Confronto delle Opzioni

```tsx
// CONFRONTO RAPIDO:

// 1. MEMORIA (default)
const useMemoryStore = create<Store>((set) => ({ /* ... */ }))
// ✅ Veloce, ❌ Non persiste

// 2. LOCAL STORAGE
const useLocalStore = create<Store>()(
  persist((set) => ({ /* ... */ }), { name: 'my-store' })
)
// ✅ Persiste tra sessioni, ✅ Condiviso tra tab

// 3. SESSION STORAGE
const useSessionStore = create<Store>()(
  persist(
    (set) => ({ /* ... */ }),
    { 
      name: 'my-store',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
// ✅ Persiste nel refresh, ❌ Non persiste tra sessioni, ❌ Non condiviso tra tab
```

##### Esempio Pratico: Preferenze Utente

```tsx
// Esempio completo: Gestione preferenze utente con localStorage
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserPreferencesStore {
  theme: 'light' | 'dark'
  language: 'it' | 'en'
  fontSize: 'small' | 'medium' | 'large'
  toggleTheme: () => void
  setLanguage: (lang: 'it' | 'en') => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
}

// Store con localStorage per preferenze persistenti
const usePreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set) => ({
      // Stati iniziali (usati solo la prima volta)
      theme: 'light',
      language: 'it',
      fontSize: 'medium',
      
      // Azioni
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'user-preferences', // Chiave in localStorage
      // Opzionale: personalizza cosa salvare
      // partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
)

// Utilizzo nel componente
function SettingsPanel(): JSX.Element {
  const { theme, language, fontSize, toggleTheme, setLanguage, setFontSize } = 
    usePreferencesStore()
  
  return (
    <div>
      <h2>Preferenze Utente</h2>
      
      <button onClick={toggleTheme}>
        Tema: {theme}
      </button>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value as 'it' | 'en')}>
        <option value="it">Italiano</option>
        <option value="en">English</option>
      </select>
      
      <select value={fontSize} onChange={(e) => setFontSize(e.target.value as any)}>
        <option value="small">Piccolo</option>
        <option value="medium">Medio</option>
        <option value="large">Grande</option>
      </select>
    </div>
  )
}

// Le preferenze vengono salvate automaticamente in localStorage
// e ripristinate al prossimo caricamento della pagina!
```

#### Store con Parametri

```tsx
// Interfaccia per lo store User che gestisce l'autenticazione
interface UserStore {
  user: User | null                          // Stato: utente corrente (null se non autenticato)
  setUser: (user: User) => void              // Azione: imposta l'utente (login)
  updateUser: (updates: Partial<User>) => void  // Azione: aggiorna parzialmente l'utente
  logout: () => void                         // Azione: logout (rimuove utente)
}

const useUserStore = create<UserStore>((set) => ({
  // Stato iniziale: nessun utente loggato
  user: null,
  
  // Azione con parametro: imposta l'utente
  // Sintassi breve: set({ user }) è equivalente a set({ user: user })
  setUser: (user) => set({ user }),
  
  // Azione con aggiornamento parziale usando Partial<User>
  // Partial<User> permette di passare solo alcune proprietà di User
  // Usiamo lo spread operator per mantenere le proprietà esistenti
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
  
  // Azione semplice: resetta l'utente a null
  logout: () => set({ user: null }),
}))
```

### 4. Selective Subscription - La Chiave delle Performance

#### Il Problema con Context API

```tsx
// ❌ Problema con Context API: Tutti i consumer vengono ri-renderizzati
const useTheme = () => useContext(ThemeContext)

function Header(): JSX.Element {
  // Otteniamo sia theme che toggleTheme dal Context
  // PROBLEMA: Questo componente usa solo 'theme', ma si ri-renderizza
  // anche quando 'toggleTheme' cambia (anche se le funzioni non cambiano mai!)
  const { theme, toggleTheme } = useTheme()
  return <header>Theme: {theme}</header>
}

function Button(): JSX.Element {
  // Otteniamo sia theme che toggleTheme dal Context
  // PROBLEMA: Questo componente usa solo 'toggleTheme', ma si ri-renderizza
  // ogni volta che 'theme' cambia, causando re-render inutili
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>Toggle</button>
}
```

#### La Soluzione con Zustand

```tsx
// ✅ Soluzione con Zustand: Selective subscription (sottoscrizione selettiva)
function Header(): JSX.Element {
  // SELECTIVE SUBSCRIPTION: Sottoscriviamo SOLO alla proprietà 'theme'
  // La funzione selector (state) => state.theme dice a Zustand:
  // "Ri-renderizza questo componente SOLO quando state.theme cambia"
  // Quando toggleTheme viene chiamato, questo componente NON si ri-renderizza
  const theme = useThemeStore((state) => state.theme)
  return <header>Theme: {theme}</header>
}

function Button(): JSX.Element {
  // SELECTIVE SUBSCRIPTION: Sottoscriviamo SOLO alla funzione 'toggleTheme'
  // Poiché le funzioni nello store non cambiano mai (sono sempre le stesse),
  // questo componente NON si ri-renderizza MAI dopo il primo render!
  // Questo è un enorme vantaggio per le performance
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  return <button onClick={toggleTheme}>Toggle</button>
}

// Oppure seleziona più proprietà se ne hai bisogno
function ThemeComponent(): JSX.Element {
  // Sottoscriviamo a più proprietà usando un selector che ritorna un oggetto
  // Questo componente si ri-renderizza SOLO quando theme O toggleTheme cambiano
  // (in pratica solo quando theme cambia, perché toggleTheme non cambia mai)
  const { theme, toggleTheme } = useThemeStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme
  }))
  return <div>...</div>
}
```

**Vedi esempio completo**: [`esempi/02-context-vs-zustand.tsx`](esempi/02-context-vs-zustand.tsx)

### 5. Pattern Avanzati

#### Pattern 1: Store Complesso con Slices

```tsx
// PATTERN: Store Complesso con Slices (fette)
// Questo pattern organizza uno store grande in "slices" logiche

// Slice 1: Gestione utente
interface UserSlice {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

// Slice 2: Gestione tema
interface ThemeSlice {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// Lo store completo combina tutte le slices usando extends
// Questo mantiene il codice organizzato e type-safe
interface AppStore extends UserSlice, ThemeSlice {}

// Creiamo un unico store che contiene tutte le slices
const useAppStore = create<AppStore>((set) => ({
  // ===== User slice =====
  // Stato e azioni per la gestione dell'utente
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  
  // ===== Theme slice =====
  // Stato e azioni per la gestione del tema
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))

// Utilizzo selettivo: ogni componente sottoscrive solo ciò che gli serve
function UserProfile(): JSX.Element {
  // Sottoscriviamo SOLO alla proprietà 'user' della slice User
  // Questo componente NON si ri-renderizza quando il tema cambia
  const user = useAppStore((state) => state.user)
  return <div>{user?.name}</div>
}

function ThemeToggle(): JSX.Element {
  // Sottoscriviamo SOLO alle proprietà della slice Theme
  // Questo componente NON si ri-renderizza quando l'utente cambia
  const { theme, toggleTheme } = useAppStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme
  }))
  return <button onClick={toggleTheme}>{theme}</button>
}
```

#### Pattern 2: Computed Values (Getter)

```tsx
// PATTERN: Computed Values (valori calcolati) con Getter
// Questo pattern usa 'get' per creare funzioni che calcolano valori derivati dallo stato

interface CartStore {
  items: CartItem[]                    // Stato: array di items nel carrello
  addItem: (item: CartItem) => void    // Azione: aggiungi item
  removeItem: (id: number) => void     // Azione: rimuovi item
  getTotal: () => number               // Getter: calcola il totale
  getItemCount: () => number           // Getter: calcola il numero di items
}

// La funzione create riceve due parametri: 'set' e 'get'
// - set: per aggiornare lo stato
// - get: per leggere lo stato corrente (utile per computed values)
const useCartStore = create<CartStore>((set, get) => ({
  // Stato iniziale: carrello vuoto
  items: [],
  
  // Azione: aggiungi un item al carrello
  // Usiamo spread operator per creare un nuovo array (immutabilità)
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  
  // Azione: rimuovi un item dal carrello per ID
  // filter() crea un nuovo array senza l'item con quell'ID
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id) 
  })),
  
  // Getter: calcola il totale del carrello
  // get() ritorna lo stato corrente, permettendoci di leggere items
  // reduce() somma price * quantity per ogni item
  getTotal: () => get().items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  ),
  
  // Getter: calcola il numero totale di items
  // reduce() somma le quantità di tutti gli items
  getItemCount: () => get().items.reduce(
    (sum, item) => sum + item.quantity, 
    0
  ),
}))

// Utilizzo dei getter nel componente
function CartSummary(): JSX.Element {
  // Otteniamo i getter dallo store
  // I getter sono funzioni che calcolano valori al momento della chiamata
  const { getTotal, getItemCount } = useCartStore()
  
  return (
    <div>
      {/* Chiamiamo i getter per ottenere i valori calcolati */}
      <p>Items: {getItemCount()}</p>
      <p>Total: €{getTotal().toFixed(2)}</p>
    </div>
  )
}
```

#### Pattern 3: Store con Async Actions

```tsx
// PATTERN: Store con Async Actions (azioni asincrone)
// Questo pattern gestisce chiamate API e stati di loading/error

interface UserStore {
  user: User | null                          // Stato: dati utente
  isLoading: boolean                         // Stato: indica se stiamo caricando
  error: string | null                       // Stato: messaggio di errore
  fetchUser: (id: number) => Promise<void>   // Azione asincrona: fetch utente
}

const useUserStore = create<UserStore>((set) => ({
  // Stati iniziali
  user: null,
  isLoading: false,
  error: null,
  
  // Azione asincrona per recuperare un utente dall'API
  fetchUser: async (id: number) => {
    // 1. Impostiamo loading a true e resettiamo l'errore
    set({ isLoading: true, error: null })
    
    try {
      // 2. Chiamata API asincrona
      const user = await fetchUserFromAPI(id)
      
      // 3. Successo: salviamo l'utente e impostiamo loading a false
      set({ user, isLoading: false })
    } catch (error) {
      // 4. Errore: salviamo il messaggio di errore e impostiamo loading a false
      set({ error: error.message, isLoading: false })
    }
  },
}))

// Utilizzo in un componente
function UserProfile(): JSX.Element {
  // Sottoscriviamo a tutti gli stati necessari
  const { user, isLoading, error, fetchUser } = useUserStore()
  
  // Carichiamo l'utente al mount del componente
  useEffect(() => {
    fetchUser(1)
  }, [fetchUser])
  
  // Gestiamo i diversi stati dell'applicazione
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  // Mostriamo i dati quando sono disponibili
  return <div>{user?.name}</div>
}
```

**Vedi esempio completo**: [`esempi/03-zustand-advanced.tsx`](esempi/03-zustand-advanced.tsx)

### 6. Middleware e Persistenza

#### Persistenza con Middleware

```tsx
// MIDDLEWARE: Persistenza con localStorage
// Il middleware 'persist' salva automaticamente lo stato in localStorage

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  theme: 'light' | 'dark'
  language: 'it' | 'en'
  toggleTheme: () => void
  setLanguage: (lang: 'it' | 'en') => void
}

// Nota la sintassi con doppio () per i middleware:
// create<Type>()( middleware(...) )
const useSettingsStore = create<SettingsStore>()(
  // Il middleware persist wrappa lo store
  persist(
    // Definizione dello store (come al solito)
    (set) => ({
      theme: 'light',
      language: 'it',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setLanguage: (language) => set({ language }),
    }),
    {
      // Configurazione del middleware persist
      // 'name' è la chiave usata in localStorage
      name: 'settings-storage',
      
      // FUNZIONAMENTO AUTOMATICO:
      // - Ogni volta che lo stato cambia, viene salvato in localStorage
      // - Al caricamento della pagina, lo stato viene ripristinato da localStorage
      // - Se non c'è nulla in localStorage, usa i valori iniziali
    }
  )
)

// Le impostazioni vengono salvate automaticamente in localStorage
// e ripristinate al reload della pagina - zero configurazione aggiuntiva!
```

#### DevTools Middleware

```tsx
// MIDDLEWARE: DevTools per debugging
// Il middleware 'devtools' integra lo store con Redux DevTools

import { devtools } from 'zustand/middleware'

// Sintassi con doppio () per i middleware
const useStore = create<StoreType>()(
  // Il middleware devtools wrappa lo store
  devtools(
    (set) => ({
      // ... store logic (definizione normale dello store)
    }),
    {
      // Configurazione del middleware devtools
      // 'name' è il nome che appare in Redux DevTools
      name: 'MyStore',
      
      // FUNZIONAMENTO:
      // - Ogni azione viene tracciata in Redux DevTools
      // - Puoi vedere lo storico delle modifiche allo stato
      // - Puoi fare time-travel debugging (tornare indietro nel tempo)
      // - Utile per debugging in sviluppo
    }
  )
)
```

### 7. Confronto Pratico: Context API vs Zustand

#### Esempio: Gestione Tema

**Con Context API:**

```tsx
// ❌ APPROCCIO CON CONTEXT API: Tutti i consumer vengono ri-renderizzati

// Creiamo il Context per il tema
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  // Stato locale per il tema
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // useMemo per evitare di creare un nuovo oggetto ad ogni render
  // Ma questo NON risolve il problema dei re-render dei consumer!
  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }), [theme]) // Si ricrea quando theme cambia
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

function Header(): JSX.Element {
  // PROBLEMA: Anche se usiamo solo 'theme', otteniamo tutto l'oggetto
  // Quando 'value' cambia nel Provider, questo componente si ri-renderizza
  // Non c'è modo di fare selective subscription con Context API
  const { theme } = useContext(ThemeContext)
  return <header>Theme: {theme}</header>
}
```

**Con Zustand:**

```tsx
// ✅ APPROCCIO CON ZUSTAND: Solo i componenti che usano theme vengono ri-renderizzati

import { create } from 'zustand'

// Creiamo lo store Zustand (nessun Provider necessario!)
const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))

function Header(): JSX.Element {
  // SELECTIVE SUBSCRIPTION: sottoscriviamo SOLO a 'theme'
  // Zustand confronta il valore ritornato dal selector:
  // - Se state.theme cambia → re-render
  // - Se altre proprietà cambiano → NO re-render
  const theme = useThemeStore((state) => state.theme)
  return <header>Theme: {theme}</header>
}

function Button(): JSX.Element {
  // SELECTIVE SUBSCRIPTION: sottoscriviamo SOLO a 'toggleTheme'
  // Poiché toggleTheme è sempre la stessa funzione, questo componente
  // NON si ri-renderizza MAI (dopo il primo render)
  // Questo è impossibile da ottenere con Context API!
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  return <button onClick={toggleTheme}>Toggle</button>
}
```

### 8. Quando Usare Context API vs Zustand

#### Usa Context API quando:
- ✅ Dati semplici e raramente cambianti (tema, preferenze)
- ✅ Vuoi evitare dipendenze esterne
- ✅ Stato locale all'applicazione
- ✅ Preferisci soluzioni native React

#### Usa Zustand quando:
- ✅ Stato globale complesso
- ✅ Performance critiche (molti componenti)
- ✅ Stato che cambia frequentemente
- ✅ Hai bisogno di selective subscription
- ✅ Vuoi persistenza o middleware avanzati
- ✅ Applicazioni di medie/grandi dimensioni

### 9. Migrazione da Context API a Zustand

#### Step 1: Identifica il Context da Migrare

```tsx
// MIGRAZIONE STEP 1: Identifica il Context da Migrare
// Prima: Context API (approccio tradizionale)

// Creiamo il Context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider che wrappa l'applicazione
function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  // Stato locale gestito con useState
  const [user, setUser] = useState<User | null>(null)
  
  // Forniamo user e setUser a tutti i componenti figli
  // PROBLEMA: Tutti i consumer si ri-renderizzano quando user cambia
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
```

#### Step 2: Crea lo Store Zustand

```tsx
// MIGRAZIONE STEP 2: Crea lo Store Zustand
// Dopo: Zustand (approccio moderno)

import { create } from 'zustand'

// Definiamo l'interfaccia dello store (simile al tipo del Context)
interface UserStore {
  user: User | null              // Stato
  setUser: (user: User) => void  // Azione
}

// Creiamo lo store con Zustand
// Nota: NON serve più il Provider!
const useUserStore = create<UserStore>((set) => ({
  // Stato iniziale
  user: null,
  
  // Azione per impostare l'utente
  // set({ user }) è sintassi breve per set({ user: user })
  setUser: (user) => set({ user }),
}))

// Lo store è pronto! Nessun Provider da aggiungere all'app
```

#### Step 3: Sostituisci useContext con useStore

```tsx
// MIGRAZIONE STEP 3: Sostituisci useContext con useStore

// Prima: Con Context API
function Component(): JSX.Element {
  // Usiamo useContext per accedere al Context
  // Otteniamo l'intero oggetto value del Provider
  const { user } = useContext(UserContext)
  return <div>{user?.name}</div>
}

// Dopo: Con Zustand
function Component(): JSX.Element {
  // Usiamo useUserStore con un selector
  // SELECTIVE SUBSCRIPTION: sottoscriviamo solo a 'user'
  // Il componente si ri-renderizza SOLO quando user cambia
  const user = useUserStore((state) => state.user)
  return <div>{user?.name}</div>
}
```

#### Step 4: Rimuovi Provider

```tsx
// MIGRAZIONE STEP 4: Rimuovi Provider

// Prima: Con Context API
function App(): JSX.Element {
  // Dobbiamo wrappare l'app con il Provider
  // Questo aggiunge un livello extra nell'albero dei componenti
  return (
    <UserProvider>
      <MyApp />
    </UserProvider>
  )
}

// Dopo: Con Zustand - Nessun Provider necessario!
function App(): JSX.Element {
  // Lo store è globale e accessibile da qualsiasi componente
  // Nessun wrapping, nessun Provider, codice più pulito!
  // Questo è uno dei grandi vantaggi di Zustand
  return <MyApp />
}
```

### 10. Best Practices

#### Do's

**1. Usa Selective Subscription**

```tsx
// BEST PRACTICE 1: Usa Selective Subscription

// ✅ BUONO: Seleziona solo ciò che ti serve
// Ogni chiamata a useThemeStore con un selector sottoscrive solo a quella proprietà
const theme = useThemeStore((state) => state.theme)
const toggleTheme = useThemeStore((state) => state.toggleTheme)
// Questi componenti si ri-renderizzano SOLO quando la proprietà specifica cambia

// ❌ SBAGLIATO: Seleziona tutto lo store
const store = useThemeStore() // Senza selector!
// PROBLEMA: Questo sottoscrive a TUTTO lo store
// Il componente si ri-renderizza per OGNI cambiamento nello store
// Perdi tutti i vantaggi di performance di Zustand!
```

**2. Organizza Store per Dominio**

```tsx
// BEST PRACTICE 2: Organizza Store per Dominio

// ✅ BUONO: Store separati per dominio/responsabilità
// Ogni store gestisce un'area specifica dell'applicazione
const useUserStore = create<UserStore>(...)    // Gestione utente
const useCartStore = create<CartStore>(...)    // Gestione carrello
const useThemeStore = create<ThemeStore>(...)  // Gestione tema
// VANTAGGI:
// - Codice più organizzato e manutenibile
// - Più facile da testare
// - Migliore separazione delle responsabilità
// - Ogni store può essere importato solo dove serve

// ❌ SBAGLIATO: Un unico store gigante per tutto
const useAppStore = create<AppStore>(...) // Troppo complesso!
// PROBLEMI:
// - Difficile da manutenere
// - Difficile da testare
// - Tutti i componenti importano tutto lo store
// - Codice disorganizzato e confuso
```

**3. Usa TypeScript per Type Safety**

```tsx
// BEST PRACTICE 3: Usa TypeScript per Type Safety

// ✅ BUONO: Definisci sempre interfacce TypeScript per i tuoi store
interface Store {
  count: number           // Tipo esplicito per lo stato
  increment: () => void   // Tipo esplicito per le azioni
}

// Passa l'interfaccia a create<T>
const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

// VANTAGGI:
// - Autocompletamento nell'IDE
// - Errori di tipo a compile-time invece che a runtime
// - Documentazione automatica del codice
// - Refactoring più sicuro
```

#### Don'ts

**1. Non Creare Store Troppo Granulari**

```tsx
// DON'T 1: Non Creare Store Troppo Granulari

// ❌ SBAGLIATO: Troppi store piccoli per cose correlate
const useThemeStore = create(...)      // Solo per il tema
const useLanguageStore = create(...)   // Solo per la lingua
const useFontSizeStore = create(...)   // Solo per la dimensione font
// PROBLEMI:
// - Troppi import nei componenti
// - Difficile gestire settings correlate
// - Codice frammentato

// ✅ MEGLIO: Un store per settings correlate
const useSettingsStore = create<SettingsStore>(...)
// Contiene: theme, language, fontSize, ecc.
// VANTAGGI:
// - Un solo import
// - Settings correlate insieme
// - Più facile da gestire
// - Usa selective subscription per evitare re-render inutili
```

**2. Non Mutare State Direttamente**

```tsx
// DON'T 2: Non Mutare State Direttamente

// ❌ SBAGLIATO: Mutazione diretta dello stato
const useStore = create((set, get) => ({
  items: [],
  addItem: (item) => {
    get().items.push(item) // ERRORE: Mutazione diretta!
    // PROBLEMI:
    // - React non rileva il cambiamento (stesso riferimento array)
    // - I componenti non si ri-renderizzano
    // - Comportamento imprevedibile
    // - Difficile da debuggare
  }
}))

// ✅ BUONO: Mantieni l'immutabilità
const useStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item]  // Crea un NUOVO array
  })),
  // VANTAGGI:
  // - React rileva il cambiamento (nuovo riferimento)
  // - I componenti si ri-renderizzano correttamente
  // - Comportamento prevedibile
  // - Facile da debuggare
}))
```

**3. Non Dimenticare Selective Subscription**

```tsx
// DON'T 3: Non Dimenticare Selective Subscription

// ❌ SBAGLIATO: Sottoscrizione completa allo store
function Component(): JSX.Element {
  const store = useStore() // Nessun selector!
  // PROBLEMA: Il componente si ri-renderizza per OGNI cambiamento nello store
  // anche se usiamo solo user.name
  // Perdi tutti i vantaggi di performance di Zustand!
  return <div>{store.user.name}</div>
}

// ✅ BUONO: Selective subscription con selector
function Component(): JSX.Element {
  // Sottoscriviamo SOLO a user.name
  const userName = useStore((state) => state.user?.name)
  // Il componente si ri-renderizza SOLO quando user.name cambia
  // Zustand confronta il valore ritornato dal selector:
  // - Se user.name cambia → re-render
  // - Se altre proprietà cambiano → NO re-render
  // Questo è il vero potere di Zustand!
  return <div>{userName}</div>
}
```

### 11. Esempi Pratici

#### Esempio 1: Zustand Base

Un esempio semplice che mostra l'uso base di Zustand per gestire stato globale.

**Vedi**: [`esempi/01-zustand-base.tsx`](esempi/01-zustand-base.tsx)

**Caratteristiche**:
- Store base con actions
- Selective subscription
- Nessun Provider necessario

#### Esempio 2: Confronto Context API vs Zustand

Esempio che mostra lo stesso componente implementato con Context API e Zustand per confrontare le performance.

**Vedi**: [`esempi/02-context-vs-zustand.tsx`](esempi/02-context-vs-zustand.tsx)

**Caratteristiche**:
- Implementazione parallela
- Confronto performance
- Selective subscription in azione

#### Esempio 3: Zustand Avanzato

Esempio complesso che mostra pattern avanzati con Zustand.

**Vedi**: [`esempi/03-zustand-advanced.tsx`](esempi/03-zustand-advanced.tsx)

**Caratteristiche**:
- Store complessi con slices
- Async actions
- Computed values
- Middleware (persistenza)

## Riepilogo

In questa lezione hai imparato:
- ✅ Cos'è Zustand e perché è utile
- ✅ Differenze tra Context API e Zustand
- ✅ Quando usare Context API e quando Zustand
- ✅ Come creare store Zustand con TypeScript
- ✅ Selective subscription per performance ottimali
- ✅ Pattern avanzati (slices, async actions, middleware)
- ✅ Best practices e errori comuni

## Prossimi Passi

Dopo aver compreso Context API e Zustand, nelle prossime lezioni imparerai:
- **Lezione 15 (useRef)**: Manipolazione DOM e riferimenti persistenti
- **Lezione 16 (useMemo e useCallback)**: Memoizzazione avanzata per ottimizzare calcoli e funzioni
- **Lezione 17 (Custom Hooks)**: Creare hook riutilizzabili per logica complessa

## Risorse Aggiuntive

- **[Zustand Documentation](https://zustand-demo.pmnd.rs/)**
- **[Zustand GitHub](https://github.com/pmndrs/zustand)**
- **[Zustand Middleware](https://github.com/pmndrs/zustand#middleware)**

**Ricorda**: Context API è perfetto per casi semplici, Zustand è la scelta migliore per applicazioni complesse dove le performance contano!

