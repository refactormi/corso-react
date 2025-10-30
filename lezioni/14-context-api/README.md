# Lezione 14: Context API - Condivisione Stato Globale

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere il problema del props drilling e quando usare Context API
- Creare e utilizzare Context in React con TypeScript
- Implementare Provider pattern per gestire stato globale
- Utilizzare useContext hook per accedere ai valori del Context
- Creare custom hooks per Context con type safety
- Gestire multiple Context contemporaneamente
- Ottimizzare le performance con Context API
- Applicare best practices per Context API

## Teoria

### 1. Introduzione a Context API

#### Cos'è Context API?
Context API è una funzionalità di React che permette di condividere dati tra componenti senza dover passare props attraverso ogni livello dell'albero dei componenti (props drilling).

#### Quando Usare Context API?
- **Props Drilling**: Quando devi passare props attraverso molti livelli
- **Dati Globali**: Tema, autenticazione, preferenze utente
- **Stato Condiviso**: Dati necessari in molti componenti distanti
- **Configurazione**: Impostazioni dell'applicazione

#### Quando NON Usare Context API?
- **Stato Locale**: Se solo pochi componenti vicini hanno bisogno dei dati
- **Stato Completo**: Non usare Context come sostituto di Redux per applicazioni complesse
- **Dati che Cambiano Frequentemente**: Può causare re-render inutili (vedi ottimizzazione)

```tsx
// ❌ Problema: Props drilling attraverso molti livelli
function App() {
  const user = { name: 'Mario', role: 'admin' }
  return <Level1 user={user} />
}

function Level1({ user }) {
  return <Level2 user={user} />
}

function Level2({ user }) {
  return <Level3 user={user} />
}

function Level3({ user }) {
  return <Level4 user={user} />
}

function Level4({ user }) {
  return <div>Benvenuto, {user.name}</div>
}

// ✅ Soluzione: Context API
const UserContext = createContext<User | null>(null)

function App() {
  const user = { name: 'Mario', role: 'admin' }
  return (
    <UserContext.Provider value={user}>
      <Level1 />
    </UserContext.Provider>
  )
}

function Level4() {
  const user = useContext(UserContext)
  return <div>Benvenuto, {user?.name}</div>
}
```

### 2. Creare e Usare Context

#### Step 1: Creare il Context

```tsx
import { createContext } from 'react'

// Definisci il tipo del Context
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// Crea il Context con valore default (opzionale)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
```

#### Step 2: Creare il Provider

```tsx
import { useState, ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  const value: ThemeContextType = {
    theme,
    toggleTheme
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

#### Step 3: Creare Custom Hook per Type Safety

```tsx
import { useContext } from 'react'

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

#### Step 4: Usare il Context nei Componenti

```tsx
function Header(): JSX.Element {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header style={{ 
      backgroundColor: theme === 'light' ? '#fff' : '#000',
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <h1>App</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  )
}
```

**Vedi esempio completo**: [`esempi/01-context-base-tema.tsx`](esempi/01-context-base-tema.tsx)

### 3. Pattern Comuni

#### Pattern 1: Context con State Management

Per gestire stato complesso con Context:

```tsx
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    // Simula chiamata API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setUser({ id: '1', name: email.split('@')[0], email })
    setIsLoading(false)
  }
  
  const logout = (): void => {
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Vedi esempio completo**: [`esempi/02-context-auth.tsx`](esempi/02-context-auth.tsx)

#### Pattern 2: Multiple Contexts

Puoi combinare più Context:

```tsx
// Context per Theme
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Context per User
const UserContext = createContext<UserContextType | undefined>(undefined)

// Context per Settings
const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Composizione Providers
function AppProviders({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ThemeProvider>
      <UserProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
```

**Vedi esempio completo**: [`esempi/03-multiple-contexts.tsx`](esempi/03-multiple-contexts.tsx)

#### Pattern 3: Custom Provider Components

Crea componenti Provider riutilizzabili:

```tsx
interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: 'light' | 'dark'
}

function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme)
  
  // ... logica ...
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

#### Pattern 4: Protected Components

Usa Context per proteggere componenti:

```tsx
interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Accesso negato</div>
  }
  
  return <>{children}</>
}

// Utilizzo
function App(): JSX.Element {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </AuthProvider>
  )
}
```

### 4. Performance Considerations

#### Problema: Re-render Causati da Context

Quando il valore di un Context cambia, **tutti** i componenti che usano quel Context vengono ri-renderizzati, anche se non usano la parte cambiata.

```tsx
// ❌ Problema: Oggetto ricreato ad ogni render
function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const value = {
    theme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    count, // Ogni volta che count cambia, tutti i consumer vengono ri-renderizzati
    increment: () => setCount(prev => prev + 1)
  }
  
  return (
    <ThemeContext.Provider value={value}>
      <Componentes />
    </ThemeContext.Provider>
  )
}
```

#### Soluzione 1: Split Contexts

Separa Context diversi per dati che cambiano indipendentemente:

```tsx
// ✅ Theme Context separato
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ✅ Count Context separato
const CountContext = createContext<CountContextType | undefined>(undefined)

// Solo i componenti che usano ThemeContext vengono ri-renderizzati quando theme cambia
// Solo i componenti che usano CountContext vengono ri-renderizzati quando count cambia
```

#### Soluzione 2: Usare useMemo per il Value

Memoizza il valore del Context per evitare ricreazione:

```tsx
import { useMemo } from 'react'

function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  // ✅ useMemo previene ricreazione dell'oggetto
  const value = useMemo<ThemeContextType>(
    () => ({ theme, toggleTheme }),
    [theme] // Solo quando theme cambia
  )
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

#### Soluzione 3: Split Provider e State

Mantieni lo stato nel Provider ma passa solo ciò che serve:

```tsx
// ✅ Provider con state separato
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
```

### 5. Best Practices

#### 1. Creare Custom Hook per Type Safety

Sempre creare un custom hook per accedere al Context:

```tsx
// ✅ Best Practice
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// ❌ Evitare
function Component(): JSX.Element {
  const theme = useContext(ThemeContext) // Può essere undefined!
  return <div>{theme?.theme}</div>
}
```

#### 2. Definire Valore Default Appropriato

```tsx
// ✅ Con valore default
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
})

// ✅ O con undefined e controllo esplicito
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
```

#### 3. Posizionare Provider al Livello Corretto

```tsx
// ✅ Provider al livello più basso necessario
function App(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}
```

#### 4. Usare Multiple Context per Separare Concerns

```tsx
// ✅ Separazione per responsabilità
<ThemeProvider>
  <UserProvider>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </UserProvider>
</ThemeProvider>
```

#### 5. Documentare il Context

```tsx
/**
 * ThemeContext fornisce funzionalità per gestire il tema dell'applicazione
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const { theme, toggleTheme } = useTheme()
 *   return <button onClick={toggleTheme}>Tema: {theme}</button>
 * }
 * ```
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
```

### 6. Esempi Pratici

#### Esempio 1: Context Base per Tema

Un esempio semplice che mostra l'uso base di Context API per gestire un tema light/dark.

**Vedi**: [`esempi/01-context-base-tema.tsx`](esempi/01-context-base-tema.tsx)

**Caratteristiche**:
- Context semplice con createContext
- Provider con state management
- Custom hook useTheme per type safety
- Componenti consumer che accedono al Context

#### Esempio 2: Context per Autenticazione

Esempio avanzato che mostra come gestire autenticazione con Context API.

**Vedi**: [`esempi/02-context-auth.tsx`](esempi/02-context-auth.tsx)

**Caratteristiche**:
- Context con state management complesso
- Async operations (login)
- Persistenza con localStorage
- Protected components pattern
- Custom hook useAuth

#### Esempio 3: Multiple Contexts

Esempio che mostra come combinare più Context contemporaneamente.

**Vedi**: [`esempi/03-multiple-contexts.tsx`](esempi/03-multiple-contexts.tsx)

**Caratteristiche**:
- Tre Context separati (Theme, User, Settings)
- Pattern composizione providers
- Ottimizzazione con useMemo
- Componenti che usano più Context

#### Esempio 4: Composizione Avanzata

Esempio complesso che mostra composizione avanzata con Context API.

**Vedi**: [`esempi/04-composizione-con-context.tsx`](esempi/04-composizione-con-context.tsx)

**Caratteristiche**:
- Layout composizionale
- Context per evitare props drilling
- Pattern avanzati di composizione

### 7. Confronto: Props vs Context

#### Quando Usare Props

```tsx
// ✅ Usa Props quando:
// - Solo pochi componenti hanno bisogno dei dati
// - I componenti sono vicini nell'albero
// - I dati cambiano frequentemente

function Parent(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  return <Child count={count} onIncrement={() => setCount(count + 1)} />
}
```

#### Quando Usare Context

```tsx
// ✅ Usa Context quando:
// - Molti componenti hanno bisogno dei dati
// - I componenti sono distanti nell'albero
// - I dati cambiano raramente (tema, auth, settings)

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </ThemeProvider>
  )
}
```

### 8. Errori Comuni da Evitare

#### Errore 1: Context per Stato Locale

```tsx
// ❌ Non usare Context per stato locale
const CountContext = createContext<number>(0)

function Parent(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  return (
    <CountContext.Provider value={count}>
      <Child />
    </CountContext.Provider>
  )
}

// ✅ Usa props invece
function Parent(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  return <Child count={count} />
}
```

#### Errore 2: Oggetto Value Ricreato

```tsx
// ❌ Oggetto ricreato ad ogni render
function Provider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(...) }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ✅ Usa useMemo
function Provider({ children }: { children: ReactNode }): JSX.Element {
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
```

#### Errore 3: Non Usare Custom Hook

```tsx
// ❌ Accesso diretto senza controllo
function Component(): JSX.Element {
  const theme = useContext(ThemeContext) // Può essere undefined!
  return <div>{theme?.theme}</div>
}

// ✅ Usa custom hook
function Component(): JSX.Element {
  const { theme } = useTheme() // Type safe e con controllo errore
  return <div>{theme}</div>
}
```

## Riepilogo

In questa lezione hai imparato:
- ✅ Cos'è Context API e quando usarla
- ✅ Come creare Context con createContext
- ✅ Come creare Provider per fornire valori
- ✅ Come usare useContext per accedere ai valori
- ✅ Pattern comuni (state management, multiple contexts, protected routes)
- ✅ Ottimizzazione performance (split contexts, useMemo)
- ✅ Best practices e type safety con TypeScript
- ✅ Errori comuni da evitare

## Prossimi Passi

Dopo aver compreso Context API, nelle prossime lezioni imparerai:
- **Lezione 15 (useRef)**: Manipolazione DOM e riferimenti persistenti
- **Lezione 16 (useMemo e useCallback)**: Memoizzazione avanzata per ottimizzare calcoli e funzioni
- **Lezione 17 (Custom Hooks)**: Creare hook riutilizzabili per logica complessa

## Esercizi Pratici

1. **Crea un Context per Notifiche**: Implementa un sistema di notifiche con Context API
2. **Context per Shopping Cart**: Gestisci un carrello con Context API
3. **Ottimizza Multiple Contexts**: Applica useMemo per ottimizzare i tuoi Context
4. **Protected Routes**: Implementa un sistema di routing protetto con Context API

**Ricorda**: Context API è potente ma non è la soluzione a tutti i problemi. Usala quando necessario e consider sempre le performance!

