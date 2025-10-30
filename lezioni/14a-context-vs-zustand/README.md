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
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // Ogni volta che theme cambia, TUTTI i consumer vengono ri-renderizzati
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
import { create } from 'zustand'

interface ThemeStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}))

// Componente che usa solo theme
function Header(): JSX.Element {
  const theme = useThemeStore((state) => state.theme) // Solo questo si ri-renderizza quando theme cambia
  return <header>Theme: {theme}</header>
}

// Componente che usa solo toggleTheme
function ThemeButton(): JSX.Element {
  const toggleTheme = useThemeStore((state) => state.toggleTheme) // Non si ri-renderizza quando theme cambia!
  return <button onClick={toggleTheme}>Toggle</button>
}
```

### 3. Creare Store con Zustand

#### Store Base

```tsx
import { create } from 'zustand'

interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// Utilizzo
function Counter(): JSX.Element {
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

#### Store con Parametri

```tsx
interface UserStore {
  user: User | null
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  logout: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
  logout: () => set({ user: null }),
}))
```

### 4. Selective Subscription - La Chiave delle Performance

#### Il Problema con Context API

```tsx
// ❌ Problema: Tutti i consumer vengono ri-renderizzati
const useTheme = () => useContext(ThemeContext)

function Header(): JSX.Element {
  const { theme, toggleTheme } = useTheme() // Ri-renderizzato anche quando toggleTheme cambia
  return <header>Theme: {theme}</header>
}

function Button(): JSX.Element {
  const { theme, toggleTheme } = useTheme() // Ri-renderizzato anche quando theme cambia
  return <button onClick={toggleTheme}>Toggle</button>
}
```

#### La Soluzione con Zustand

```tsx
// ✅ Soluzione: Selective subscription
function Header(): JSX.Element {
  // Solo questo componente si ri-renderizza quando theme cambia
  const theme = useThemeStore((state) => state.theme)
  return <header>Theme: {theme}</header>
}

function Button(): JSX.Element {
  // Questo NON si ri-renderizza quando theme cambia
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  return <button onClick={toggleTheme}>Toggle</button>
}

// Oppure seleziona tutto ciò che ti serve
function ThemeComponent(): JSX.Element {
  // Si ri-renderizza solo quando theme O toggleTheme cambiano
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
interface UserSlice {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

interface ThemeSlice {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

interface AppStore extends UserSlice, ThemeSlice {}

const useAppStore = create<AppStore>((set) => ({
  // User slice
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  
  // Theme slice
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}))

// Utilizzo selettivo
function UserProfile(): JSX.Element {
  const user = useAppStore((state) => state.user) // Solo user
  return <div>{user?.name}</div>
}

function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useAppStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme
  })) // Solo theme e toggleTheme
  return <button onClick={toggleTheme}>{theme}</button>
}
```

#### Pattern 2: Computed Values (Getter)

```tsx
interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  getTotal: () => number
  getItemCount: () => number
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}))

// Utilizzo
function CartSummary(): JSX.Element {
  const { getTotal, getItemCount } = useCartStore()
  return (
    <div>
      <p>Items: {getItemCount()}</p>
      <p>Total: €{getTotal().toFixed(2)}</p>
    </div>
  )
}
```

#### Pattern 3: Store con Async Actions

```tsx
interface UserStore {
  user: User | null
  isLoading: boolean
  error: string | null
  fetchUser: (id: number) => Promise<void>
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  fetchUser: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      const user = await fetchUserFromAPI(id)
      set({ user, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
}))

// Utilizzo
function UserProfile(): JSX.Element {
  const { user, isLoading, error, fetchUser } = useUserStore()
  
  useEffect(() => {
    fetchUser(1)
  }, [fetchUser])
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>{user?.name}</div>
}
```

**Vedi esempio completo**: [`esempi/03-zustand-advanced.tsx`](esempi/03-zustand-advanced.tsx)

### 6. Middleware e Persistenza

#### Persistenza con Middleware

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  theme: 'light' | 'dark'
  language: 'it' | 'en'
  toggleTheme: () => void
  setLanguage: (lang: 'it' | 'en') => void
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'it',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage', // Nome della chiave in localStorage
    }
  )
)

// Le impostazioni vengono salvate automaticamente in localStorage
// e ripristinate al reload della pagina
```

#### DevTools Middleware

```tsx
import { devtools } from 'zustand/middleware'

const useStore = create<StoreType>()(
  devtools(
    (set) => ({
      // ... store logic
    }),
    {
      name: 'MyStore', // Nome per DevTools
    }
  )
)
```

### 7. Confronto Pratico: Context API vs Zustand

#### Esempio: Gestione Tema

**Con Context API:**

```tsx
// ❌ Tutti i consumer vengono ri-renderizzati
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }), [theme])
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

function Header(): JSX.Element {
  const { theme } = useContext(ThemeContext) // Ri-renderizzato anche quando toggleTheme cambia
  return <header>Theme: {theme}</header>
}
```

**Con Zustand:**

```tsx
// ✅ Solo i componenti che usano theme vengono ri-renderizzati
import { create } from 'zustand'

const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}))

function Header(): JSX.Element {
  const theme = useThemeStore((state) => state.theme) // Solo questo si ri-renderizza quando theme cambia
  return <header>Theme: {theme}</header>
}

function Button(): JSX.Element {
  const toggleTheme = useThemeStore((state) => state.toggleTheme) // NON si ri-renderizza quando theme cambia
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
// Prima: Context API
const UserContext = createContext<UserContextType | undefined>(undefined)

function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
```

#### Step 2: Crea lo Store Zustand

```tsx
// Dopo: Zustand
import { create } from 'zustand'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

#### Step 3: Sostituisci useContext con useStore

```tsx
// Prima
function Component(): JSX.Element {
  const { user } = useContext(UserContext)
  return <div>{user?.name}</div>
}

// Dopo
function Component(): JSX.Element {
  const user = useUserStore((state) => state.user)
  return <div>{user?.name}</div>
}
```

#### Step 4: Rimuovi Provider

```tsx
// Prima
function App(): JSX.Element {
  return (
    <UserProvider>
      <MyApp />
    </UserProvider>
  )
}

// Dopo: Nessun Provider necessario!
function App(): JSX.Element {
  return <MyApp />
}
```

### 10. Best Practices

#### Do's

**1. Usa Selective Subscription**

```tsx
// ✅ Buono: Seleziona solo ciò che ti serve
const theme = useThemeStore((state) => state.theme)
const toggleTheme = useThemeStore((state) => state.toggleTheme)

// ❌ Sbagliato: Seleziona tutto lo store
const store = useThemeStore() // Ri-renderizza per ogni cambiamento
```

**2. Organizza Store per Dominio**

```tsx
// ✅ Buono: Store separati per dominio
const useUserStore = create<UserStore>(...)
const useCartStore = create<CartStore>(...)
const useThemeStore = create<ThemeStore>(...)

// ❌ Sbagliato: Un unico store gigante
const useAppStore = create<AppStore>(...) // Troppo complesso
```

**3. Usa TypeScript per Type Safety**

```tsx
// ✅ Buono: Interfacce TypeScript
interface Store {
  count: number
  increment: () => void
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

#### Don'ts

**1. Non Creare Store Troppo Granulari**

```tsx
// ❌ Sbagliato: Troppi store piccoli
const useThemeStore = create(...)
const useLanguageStore = create(...)
const useFontSizeStore = create(...)

// ✅ Meglio: Un store per settings
const useSettingsStore = create<SettingsStore>(...)
```

**2. Non Mutare State Direttamente**

```tsx
// ❌ Sbagliato: Mutazione diretta
const useStore = create((set) => ({
  items: [],
  addItem: (item) => {
    get().items.push(item) // Mutazione diretta!
  }
}))

// ✅ Buono: Immutabilità
const useStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}))
```

**3. Non Dimenticare Selective Subscription**

```tsx
// ❌ Sbagliato: Sottoscrizione completa
function Component(): JSX.Element {
  const store = useStore() // Ri-renderizza per ogni cambiamento
  return <div>{store.user.name}</div>
}

// ✅ Buono: Selective subscription
function Component(): JSX.Element {
  const userName = useStore((state) => state.user?.name) // Solo quando userName cambia
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

