# Lezione 10: Passaggio di Stato tra Componenti

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere il flusso di dati in React (unidirectional data flow)
- Implementare il pattern "lifting state up"
- Gestire la comunicazione tra componenti padre e figlio
- Utilizzare callback functions per aggiornare lo stato del padre
- Implementare pattern di comunicazione tra componenti fratelli
- Gestire stati condivisi tra più componenti
- Evitare prop drilling con pattern alternativi

## Teoria

### 1. Flusso di Dati in React

React segue un principio fondamentale: **"Data flows down, events flow up"** (I dati scorrono verso il basso, gli eventi scorrono verso l'alto).

#### Principi del Flusso di Dati:
- **Unidirectional**: I dati fluiscono in una sola direzione (dall'alto verso il basso)
- **Props Down**: I dati vengono passati dai componenti padre ai figli tramite props
- **Events Up**: Gli eventi vengono comunicati dai figli al padre tramite callback functions
- **Single Source of Truth**: Lo stato dovrebbe essere mantenuto nel componente più vicino alla radice che ne ha bisogno

```tsx
import { useState } from 'react'

// Esempio base di flusso di dati
interface ChildProps {
  count: number
  onIncrement: () => void
}

function Parent() {
  const [count, setCount] = useState<number>(0)
  
  return (
    <div>
      <h2>Parent: {count}</h2>
      <Child 
        count={count} 
        onIncrement={() => setCount(count + 1)} 
      />
    </div>
  )
}

function Child({ count, onIncrement }: ChildProps) {
  return (
    <div>
      <p>Child: {count}</p>
      <button onClick={onIncrement}>Incrementa</button>
    </div>
  )
}
```

### 2. Pattern "Lifting State Up"

Il "lifting state up" è il processo di spostare lo stato da un componente figlio a un componente padre per condividerlo con altri componenti.

#### Quando Usare il Lifting State Up:
- Quando più componenti hanno bisogno dello stesso stato
- Quando un componente figlio deve comunicare con un fratello
- Quando lo stato deve essere sincronizzato tra componenti

#### Esempio di Lifting State Up:

```tsx
import { useState } from 'react'

// ❌ Stato nel componente figlio (non condivisibile)
function TemperatureInputBad() {
  const [temperature, setTemperature] = useState<string>('')
  
  return (
    <input
      value={temperature}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemperature(e.target.value)}
      placeholder="Temperatura"
    />
  )
}

// ✅ Stato sollevato al componente padre
interface TemperatureInputProps {
  scale: 'celsius' | 'fahrenheit'
  temperature: string
  onTemperatureChange: (value: string) => void
}

function TemperatureInput({ scale, temperature, onTemperatureChange }: TemperatureInputProps) {
  return (
    <fieldset>
      <legend>Temperatura in {scale === 'celsius' ? 'Celsius' : 'Fahrenheit'}:</legend>
      <input
        value={temperature}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  )
}

function TemperatureConverter() {
  const [celsius, setCelsius] = useState<string>('')
  const [fahrenheit, setFahrenheit] = useState<string>('')
  
  const handleCelsiusChange = (value: string) => {
    setCelsius(value)
    setFahrenheit(value ? (parseFloat(value) * 9/5 + 32).toFixed(2) : '')
  }
  
  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value)
    setCelsius(value ? ((parseFloat(value) - 32) * 5/9).toFixed(2) : '')
  }
  
  return (
    <div>
      <TemperatureInput
        scale="celsius"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="fahrenheit"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
    </div>
  )
}
```

### 3. Comunicazione Padre-Figlio

#### Pattern 1: Props e Callback

```tsx
import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoFormProps {
  onAddTodo: (text: string) => void
}

function TodoForm({ onAddTodo }: TodoFormProps) {
  const [text, setText] = useState<string>('')
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (text.trim()) {
      onAddTodo(text)
      setText('')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        placeholder="Nuovo todo..."
      />
      <button type="submit">Aggiungi</button>
    </form>
  )
}

interface TodoFilterProps {
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void
}

function TodoFilter({ filter, onFilterChange }: TodoFilterProps) {
  return (
    <div>
      <button 
        onClick={() => onFilterChange('all')}
        className={filter === 'all' ? 'active' : ''}
      >
        Tutti
      </button>
      <button 
        onClick={() => onFilterChange('active')}
        className={filter === 'active' ? 'active' : ''}
      >
        Attivi
      </button>
      <button 
        onClick={() => onFilterChange('completed')}
        className={filter === 'completed' ? 'active' : ''}
      >
        Completati
      </button>
    </div>
  )
}

interface TodoListProps {
  todos: Todo[]
  onToggleTodo: (id: number) => void
}

function TodoList({ todos, onToggleTodo }: TodoListProps) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
        />
      ))}
    </ul>
  )
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
}

function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
      } as React.CSSProperties}>
        {todo.text}
      </span>
    </li>
  )
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  
  const addTodo = (text: string) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }])
  }
  
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  
  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} />
    </div>
  )
}
```

#### Pattern 2: Render Props

```tsx
import { useState } from 'react'

interface DataProviderProps {
  children: (props: {
    data: any
    loading: boolean
    error: string | null
    fetchData: () => Promise<void>
  }) => React.ReactNode
}

function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/data')
      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  return children({
    data,
    loading,
    error,
    fetchData
  }) as React.ReactElement
}

function App() {
  return (
    <DataProvider>
      {({ data, loading, error, fetchData }) => (
        <div>
          <button onClick={fetchData} disabled={loading}>
            {loading ? 'Caricamento...' : 'Carica Dati'}
          </button>
          
          {error && <div style={{color: 'red'}}>Errore: {error}</div>}
          
          {data && (
            <div>
              <h2>Dati Caricati:</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </DataProvider>
  )
}
```

### 4. Comunicazione tra Componenti Fratelli

#### Pattern 1: Stato Condiviso nel Padre

```tsx
import { useState } from 'react'

interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

interface HeaderProps {
  itemCount: number
  onCartToggle: () => void
}

function Header({ itemCount, onCartToggle }: HeaderProps) {
  return (
    <header>
      <h1>Shop</h1>
      <button onClick={onCartToggle}>
        Carrello ({itemCount})
      </button>
    </header>
  )
}

interface ProductListProps {
  onAddItem: (item: Product) => void
}

function ProductList({ onAddItem }: ProductListProps) {
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Tastiera', price: 79 }
  ]
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>€{product.price}</p>
          <button onClick={() => onAddItem(product)}>
            Aggiungi al Carrello
          </button>
        </div>
      ))}
    </div>
  )
}

interface CartSidebarProps {
  isOpen: boolean
  items: CartItem[]
  onRemoveItem: (id: number) => void
  onClearCart: () => void
  onClose: () => void
}

function CartSidebar({ isOpen, items, onRemoveItem, onClearCart, onClose }: CartSidebarProps) {
  if (!isOpen) return null
  
  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: '300px',
      height: '100vh',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      padding: '20px'
    } as React.CSSProperties}>
      <div style={{ display: 'flex', justifyContent: 'space-between' } as React.CSSProperties}>
        <h2>Carrello</h2>
        <button onClick={onClose}>✕</button>
      </div>
      
      {items.length === 0 ? (
        <p>Il carrello è vuoto</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' } as React.CSSProperties}>
              <span>{item.name}</span>
              <button onClick={() => onRemoveItem(item.id)}>Rimuovi</button>
            </div>
          ))}
          <button onClick={onClearCart}>Svuota Carrello</button>
        </>
      )}
    </div>
  )
}

function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  
  const addItem = (item: Product) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id)
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }
  
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }
  
  const clearCart = () => {
    setItems([])
  }
  
  return (
    <div>
      <Header 
        itemCount={items.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => setCartOpen(!cartOpen)}
      />
      <ProductList onAddItem={addItem} />
      <CartSidebar
        isOpen={cartOpen}
        items={items}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onClose={() => setCartOpen(false)}
      />
    </div>
  )
}
```

#### Pattern 2: Context API per Stato Globale

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
  id: number
}

interface Notification {
  id: number
  message: string
  timestamp: Date
}

interface AppContextValue {
  user: User | null
  theme: 'light' | 'dark'
  notifications: Notification[]
  login: (userData: User) => void
  logout: () => void
  toggleTheme: () => void
  addNotification: (message: string) => void
  removeNotification: (id: number) => void
}

// Creazione del Context
const AppContext = createContext<AppContextValue | undefined>(undefined)

// Provider del Context
interface AppProviderProps {
  children: ReactNode
}

function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const login = (userData: User) => {
    setUser(userData)
  }
  
  const logout = () => {
    setUser(null)
  }
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message,
      timestamp: new Date()
    }])
  }
  
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  const value: AppContextValue = {
    user,
    theme,
    notifications,
    login,
    logout,
    toggleTheme,
    addNotification,
    removeNotification
  }
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Hook personalizzato per usare il Context
function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve essere usato dentro AppProvider')
  }
  return context
}

// Componenti che usano il Context
function Header() {
  const { user, theme, toggleTheme, notifications } = useApp()
  
  return (
    <header style={{ backgroundColor: theme === 'light' ? '#fff' : '#333' } as React.CSSProperties}>
      <h1>App</h1>
      <div>
        {user ? (
          <span>Ciao, {user.name}!</span>
        ) : (
          <span>Non loggato</span>
        )}
        <button onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <span>Notifiche: {notifications.length}</span>
      </div>
    </header>
  )
}

function LoginForm() {
  const { login } = useApp()
  const [username, setUsername] = useState<string>('')
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login({ name: username, id: Date.now() })
    setUsername('')
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button type="submit">Login</button>
    </form>
  )
}

function NotificationCenter() {
  const { notifications, removeNotification } = useApp()
  
  return (
    <div>
      <h3>Notifiche</h3>
      {notifications.map(notification => (
        <div key={notification.id}>
          <span>{notification.message}</span>
          <button onClick={() => removeNotification(notification.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <Header />
      <LoginForm />
      <NotificationCenter />
    </AppProvider>
  )
}
```

### 5. Pattern di Comunicazione Avanzati

#### Pattern 1: Event Bus (per componenti distanti)

```tsx
import { useState, useCallback } from 'react'

// Event Bus semplice
type EventCallback = (data: any) => void

class EventBus {
  private events: Record<string, EventCallback[]> = {}
  
  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  
  off(event: string, callback: EventCallback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
  
  emit(event: string, data: any): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
}

const eventBus = new EventBus()

interface Message {
  text: string
  timestamp: number
}

// Hook per usare l'Event Bus
function useEventBus() {
  const [events, setEvents] = useState<Record<string, boolean>>({})
  
  const subscribe = useCallback((event: string, callback: EventCallback) => {
    eventBus.on(event, callback)
    setEvents(prev => ({ ...prev, [event]: true }))
    
    return () => {
      eventBus.off(event, callback)
      setEvents(prev => {
        const newEvents = { ...prev }
        delete newEvents[event]
        return newEvents
      })
    }
  }, [])
  
  const emit = useCallback((event: string, data: any) => {
    eventBus.emit(event, data)
  }, [])
  
  return { subscribe, emit }
}

// Esempio di utilizzo
function ComponentA() {
  const { emit } = useEventBus()
  
  const sendMessage = () => {
    emit('message', { text: 'Ciao da ComponentA!', timestamp: Date.now() })
  }
  
  return (
    <div>
      <h3>Componente A</h3>
      <button onClick={sendMessage}>Invia Messaggio</button>
    </div>
  )
}

function ComponentB() {
  const { subscribe } = useEventBus()
  const [messages, setMessages] = useState<Message[]>([])
  
  // Nota: Per sottoscriversi agli eventi dell'event bus serve useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, questo esempio mostra
  // solo la struttura del componente con useState.
  
  return (
    <div>
      <h3>Componente B</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.text} - {new Date(msg.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### Pattern 2: Custom Hooks per Logica Condivisa

```tsx
import { useState, useCallback } from 'react'

// Custom hook per gestione form
interface ValidationRule {
  required?: boolean
  minLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | boolean
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface FormValues {
  [key: string]: any
}

interface FormErrors {
  [key: string]: string
}

interface FormTouched {
  [key: string]: boolean
}

function validateField(name: string, value: any, rules: ValidationRules): string {
  const rule = rules[name]
  if (!rule) return ''
  
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${name} è richiesto`
  }
  
  if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
    return `${name} deve essere almeno ${rule.minLength} caratteri`
  }
  
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return `${name} non è valido`
  }
  
  if (rule.custom) {
    const customResult = rule.custom(value)
    if (typeof customResult === 'string') return customResult
    if (customResult === false) return `${name} non è valido`
  }
  
  return ''
}

function useForm<T extends FormValues>(initialValues: T, validationRules: ValidationRules) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouchedState] = useState<FormTouched>({})
  
  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name as string]) {
      const error = validateField(name as string, value, validationRules)
      setErrors(prev => ({ ...prev, [name as string]: error }))
    }
  }
  
  const setTouched = (name: string) => {
    setTouchedState(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, values[name], validationRules)
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouchedState({})
  }
  
  const isValid = Object.keys(errors).length === 0
  
  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    reset,
    isValid
  }
}

// Custom hook per gestione API
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      const result = await response.json()
      setData(result as T)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [url])
  
  // Nota: Per caricare automaticamente i dati al mount serve useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, chiama fetchData manualmente.
  
  return { data, loading, error, refetch: fetchData }
}

// Utilizzo dei custom hooks
interface UserFormData {
  name: string
  email: string
}

function UserForm() {
  const { values, errors, setValue, setTouched, reset, isValid } = useForm<UserFormData>(
    { name: '', email: '' },
    {
      name: { required: true, minLength: 2 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    }
  )
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isValid) {
      console.log('Form valido:', values)
      reset()
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('name', e.target.value)}
        onBlur={() => setTouched('name')}
        placeholder="Nome"
      />
      {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
      
      <input
        value={values.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('email', e.target.value)}
        onBlur={() => setTouched('email')}
        placeholder="Email"
      />
      {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
      
      <button type="submit" disabled={!isValid}>
        Invia
      </button>
    </form>
  )
}

interface User {
  id: number
  name: string
  email: string
}

function UserList() {
  const { data: users, loading, error, refetch } = useApi<User[]>('/api/users')
  
  if (loading) return <div>Caricamento...</div>
  if (error) return <div>Errore: {error}</div>
  
  return (
    <div>
      <button onClick={refetch}>Ricarica</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 6. Evitare Prop Drilling

#### Problema del Prop Drilling:

```tsx
import { useState } from 'react'

// ❌ Prop drilling - passaggio di props attraverso molti livelli
interface User {
  name: string
}

interface AppProps {
  user: User | null
  onUserChange: (user: User | null) => void
}

function Header({ user, onUserChange }: AppProps) {
  return (
    <header>
      <Navigation user={user} onUserChange={onUserChange} />
    </header>
  )
}

interface NavigationProps {
  user: User | null
  onUserChange: (user: User | null) => void
}

function Navigation({ user, onUserChange }: NavigationProps) {
  return (
    <nav>
      <UserMenu user={user} onUserChange={onUserChange} />
    </nav>
  )
}

interface UserMenuProps {
  user: User | null
  onUserChange: (user: User | null) => void
}

function UserMenu({ user, onUserChange }: UserMenuProps) {
  return (
    <div>
      {user ? (
        <button onClick={() => onUserChange(null)}>Logout</button>
      ) : (
        <button onClick={() => onUserChange({ name: 'User' })}>Login</button>
      )}
    </div>
  )
}

function Main({ user }: { user: User | null }) {
  return <main>Main content</main>
}

function AppBad() {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <div>
      <Header user={user} onUserChange={setUser} />
      <Main user={user} />
    </div>
  )
}
```

#### Soluzioni per Evitare Prop Drilling:

**Soluzione 1: Context API**
```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

// ✅ Usando Context API
interface User {
  name: string
}

interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

function App() {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        <Header />
        <Main />
      </div>
    </UserContext.Provider>
  )
}

function useUser(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser deve essere usato dentro UserContext.Provider')
  }
  return context
}

function UserMenu() {
  const { user, setUser } = useUser()
  
  return (
    <div>
      {user ? (
        <button onClick={() => setUser(null)}>Logout</button>
      ) : (
        <button onClick={() => setUser({ name: 'User' })}>Login</button>
      )}
    </div>
  )
}

function Header() {
  return (
    <header>
      <Navigation />
    </header>
  )
}

function Navigation() {
  return (
    <nav>
      <UserMenu />
    </nav>
  )
}

function Main() {
  return <main>Main content</main>
}
```

**Soluzione 2: Component Composition**
```tsx
import { useState, ReactNode } from 'react'

// ✅ Usando component composition
interface User {
  name: string
}

interface HeaderProps {
  children: ReactNode
}

function Header({ children }: HeaderProps) {
  return <header>{children}</header>
}

interface NavigationProps {
  children: ReactNode
}

function Navigation({ children }: NavigationProps) {
  return <nav>{children}</nav>
}

interface UserMenuProps {
  user: User | null
  onUserChange: (user: User | null) => void
}

function UserMenu({ user, onUserChange }: UserMenuProps) {
  return (
    <div>
      {user ? (
        <button onClick={() => onUserChange(null)}>Logout</button>
      ) : (
        <button onClick={() => onUserChange({ name: 'User' })}>Login</button>
      )}
    </div>
  )
}

function Main({ user }: { user: User | null }) {
  return <main>Main content - User: {user?.name || 'Not logged in'}</main>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <div>
      <Header>
        <Navigation>
          <UserMenu user={user} onUserChange={setUser} />
        </Navigation>
      </Header>
      <Main user={user} />
    </div>
  )
}
```

### 7. Best Practices e Anti-Patterns

#### ✅ Best Practices:

1. **Mantieni lo stato il più vicino possibile** ai componenti che lo utilizzano
2. **Usa lifting state up** quando più componenti hanno bisogno dello stesso stato
3. **Passa callback functions** per permettere ai figli di comunicare con il padre
4. **Usa Context API** per stato globale che viene usato in molti componenti
5. **Crea custom hooks** per logica condivisa tra componenti
6. **Evita prop drilling** usando Context o component composition
7. **Usa render props** per logica complessa che deve essere condivisa
8. **Mantieni i componenti piccoli** e focalizzati su una singola responsabilità

#### ❌ Anti-Patterns da Evitare:

1. **Non passare troppe props** attraverso molti livelli
2. **Non duplicare stato** in componenti diversi
3. **Non usare Context** per stato locale che viene usato solo da pochi componenti
4. **Non passare oggetti inline** come props (causa re-render inutili)
5. **Non usare refs** per comunicazione tra componenti
6. **Non modificare props** direttamente nei componenti figli
7. **Non usare eventi globali** quando Context o props sono sufficienti
8. **Non creare dipendenze circolari** tra componenti

## Esempi Pratici

### Esempio 1: Dashboard con Stato Condiviso
```tsx
import { useState } from 'react'

interface User {
  id: number
  name: string
  email: string
}

interface SidebarProps {
  users: User[]
  selectedUser: User | null
  onUserSelect: (user: User) => void
  loading: boolean
  onRefresh: () => void
}

function Sidebar({ users, selectedUser, onUserSelect, loading, onRefresh }: SidebarProps) {
  return (
    <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px' } as React.CSSProperties}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties}>
        <h2>Utenti</h2>
        <button onClick={onRefresh} disabled={loading}>
          {loading ? '⏳' : '🔄'}
        </button>
      </div>
      
      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 } as React.CSSProperties}>
          {users.map(user => (
            <li
              key={user.id}
              onClick={() => onUserSelect(user)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedUser?.id === user.id ? '#e3f2fd' : 'transparent',
                border: '1px solid #ddd',
                marginBottom: '5px',
                borderRadius: '4px'
              } as React.CSSProperties}
            >
              <strong>{user.name}</strong>
              <br />
              <small>{user.email}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface MainContentProps {
  selectedUser: User | null
  onUserUpdate: (user: User) => void
}

function MainContent({ selectedUser, onUserUpdate }: MainContentProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editForm, setEditForm] = useState<User | null>(null)
  
  // Nota: Per sincronizzare editForm con selectedUser quando cambia serve useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, puoi aggiornare editForm
  // direttamente quando entra in modalità editing.
  
  const handleEdit = () => {
    if (selectedUser) {
      setEditForm({ ...selectedUser })
      setIsEditing(true)
    }
  }
  
  const handleSave = () => {
    if (editForm) {
      onUserUpdate(editForm)
      setIsEditing(false)
    }
  }
  
  const handleCancel = () => {
    setEditForm(null)
    setIsEditing(false)
  }
  
  if (!selectedUser) {
    return (
      <div style={{ flex: 1, padding: '20px', textAlign: 'center' } as React.CSSProperties}>
        <h2>Seleziona un utente</h2>
        <p>Seleziona un utente dalla sidebar per visualizzare i dettagli</p>
      </div>
    )
  }
  
  return (
    <div style={{ flex: 1, padding: '20px' } as React.CSSProperties}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties}>
        <h2>Dettagli Utente</h2>
        <button onClick={isEditing ? handleCancel : handleEdit}>
          {isEditing ? 'Annulla' : 'Modifica'}
        </button>
      </div>
      
      {isEditing && editForm ? (
        <div>
          <div style={{ marginBottom: '15px' } as React.CSSProperties}>
            <label>Nome:</label>
            <input
              value={editForm.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)
              }
              style={{ width: '100%', padding: '8px', marginTop: '5px' } as React.CSSProperties}
            />
          </div>
          <div style={{ marginBottom: '15px' } as React.CSSProperties}>
            <label>Email:</label>
            <input
              value={editForm.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setEditForm(prev => prev ? { ...prev, email: e.target.value } : null)
              }
              style={{ width: '100%', padding: '8px', marginTop: '5px' } as React.CSSProperties}
            />
          </div>
          <div>
            <button onClick={handleSave} style={{ marginRight: '10px' } as React.CSSProperties}>
              Salva
            </button>
            <button onClick={handleCancel}>
              Annulla
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p><strong>Nome:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>ID:</strong> {selectedUser.id}</p>
        </div>
      )}
    </div>
  )
}

function Dashboard() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  
  const fetchUsers = async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data as User[])
    } catch (error) {
      console.error('Errore nel caricamento utenti:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }
  
  // Nota: Il caricamento iniziale dei dati richiede useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, chiama fetchUsers manualmente
  // (ad esempio con un pulsante o al click dell'utente).
  
  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ))
    if (selectedUser?.id === updatedUser.id) {
      setSelectedUser(updatedUser)
    }
  }
  
  return (
    <div style={{ display: 'flex', height: '100vh' } as React.CSSProperties}>
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        loading={loading}
        onRefresh={fetchUsers}
      />
      <MainContent
        selectedUser={selectedUser}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  )
}
```

### Esempio 2: Sistema di Notifiche con Context
```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Notification {
  id: number
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  timestamp: Date
}

interface NotificationContextValue {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => number
  removeNotification: (id: number) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])
  
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): number => {
    const id = Date.now()
    const newNotification: Notification = {
      id,
      ...notification,
      timestamp: new Date()
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto-remove dopo 5 secondi
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
    
    return id
  }, [removeNotification])
  
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])
  
  const value: NotificationContextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications deve essere usato dentro NotificationProvider')
  }
  return context
}

function NotificationButton() {
  const { addNotification } = useNotifications()
  
  const showSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Operazione completata con successo!',
      title: 'Successo'
    })
  }
  
  const showError = () => {
    addNotification({
      type: 'error',
      message: 'Si è verificato un errore durante l\'operazione.',
      title: 'Errore'
    })
  }
  
  const showWarning = () => {
    addNotification({
      type: 'warning',
      message: 'Attenzione: questa operazione non può essere annullata.',
      title: 'Attenzione'
    })
  }
  
  return (
    <div>
      <button onClick={showSuccess} style={{ marginRight: '10px' } as React.CSSProperties}>
        Mostra Successo
      </button>
      <button onClick={showError} style={{ marginRight: '10px' } as React.CSSProperties}>
        Mostra Errore
      </button>
      <button onClick={showWarning}>
        Mostra Avviso
      </button>
    </div>
  )
}

function NotificationList() {
  const { notifications, removeNotification, clearAll } = useNotifications()
  
  if (notifications.length === 0) {
    return null
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    } as React.CSSProperties}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } as React.CSSProperties}>
        <h3>Notifiche ({notifications.length})</h3>
        <button onClick={clearAll}>Pulisci Tutto</button>
      </div>
      
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: number) => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const getStyle = (type?: string): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      success: { backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' },
      error: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' },
      warning: { backgroundColor: '#fff3cd', borderColor: '#ffeaa7', color: '#856404' },
      info: { backgroundColor: '#d1ecf1', borderColor: '#bee5eb', color: '#0c5460' }
    }
    return styles[type || 'info'] || styles.info
  }
  
  const style = getStyle(notification.type)
  
  return (
    <div style={{
      ...style,
      padding: '15px',
      marginBottom: '10px',
      border: '1px solid',
      borderRadius: '4px',
      minWidth: '300px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    } as React.CSSProperties}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as React.CSSProperties}>
        <div>
          {notification.title && (
            <h4 style={{ margin: '0 0 5px 0' } as React.CSSProperties}>{notification.title}</h4>
          )}
          <p style={{ margin: 0 } as React.CSSProperties}>{notification.message}</p>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            marginLeft: '10px',
            color: style.color
          } as React.CSSProperties}
        >
          ×
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <NotificationProvider>
      <div>
        <h1>App con Sistema di Notifiche</h1>
        <NotificationButton />
        <NotificationList />
      </div>
    </NotificationProvider>
  )
}
```

## Esercizi

### Esercizio 1: Sistema di Voti
Implementa un sistema di voti dove:
- Un componente mostra una lista di opzioni
- Un altro componente mostra i risultati
- Un terzo componente permette di votare
- Tutti i componenti condividono lo stesso stato

### Esercizio 2: Chat in Tempo Reale
Crea una chat dove:
- Un componente mostra la lista dei messaggi
- Un altro componente permette di inviare messaggi
- Un terzo componente mostra gli utenti online
- Usa Context API per gestire lo stato globale

### Esercizio 3: Carrello della Spesa
Implementa un carrello dove:
- Un componente mostra i prodotti disponibili
- Un altro componente mostra il carrello
- Un terzo componente mostra il totale
- Usa custom hooks per la logica del carrello

## Riepilogo

In questa lezione abbiamo imparato:

- **Flusso di dati unidirezionale** in React
- **Pattern "lifting state up"** per condividere stato
- **Comunicazione padre-figlio** con props e callback
- **Comunicazione tra fratelli** tramite stato condiviso
- **Context API** per stato globale
- **Pattern avanzati** come render props e custom hooks
- **Come evitare prop drilling** con tecniche appropriate
- **Best practices** per la comunicazione tra componenti

La comunicazione tra componenti è fondamentale per creare applicazioni React scalabili e mantenibili. Ricorda sempre di:

- Mantenere lo stato il più vicino possibile ai componenti che lo usano
- Usare lifting state up quando necessario
- Evitare prop drilling con Context API o component composition
- Creare custom hooks per logica condivisa
- Seguire il principio del flusso unidirezionale dei dati

Nella prossima lezione esploreremo l'interazione con l'utente e la gestione degli eventi.
