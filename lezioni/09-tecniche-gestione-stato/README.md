# Lezione 9: Tecniche Avanzate di Gestione Stato

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Utilizzare tecniche avanzate per la gestione dello stato
- Implementare pattern di stato complessi e scalabili
- Gestire stati derivati e calcolati
- Ottimizzare le performance con tecniche di memoizzazione
- Implementare pattern di stato immutabile avanzati
- Gestire stati asincroni e side effects

## Teoria

### 1. Pattern di Stato Avanzati

#### Pattern 1: Stato Raggruppato vs Separato

**Stato Raggruppato (Consigliato per dati correlati):**
```tsx
import { useState } from 'react'

// ✅ Buono: stato raggruppato per dati correlati
interface Profile {
  name: string
  email: string
  avatar: string
}

interface Preferences {
  theme: string
  language: string
  notifications: boolean
}

interface Session {
  isLoggedIn: boolean
  lastLogin: Date | null
  token: string | null
}

interface User {
  profile: Profile
  preferences: Preferences
  session: Session
}

const [user, setUser] = useState<User>({
  profile: {
    name: '',
    email: '',
    avatar: ''
  },
  preferences: {
    theme: 'light',
    language: 'it',
    notifications: true
  },
  session: {
    isLoggedIn: false,
    lastLogin: null,
    token: null
  }
})

// Aggiornamento specifico
const updateProfile = (updates: Partial<Profile>) => {
  setUser(prev => ({
    ...prev,
    profile: { ...prev.profile, ...updates }
  }))
}
```

**Stato Separato (Consigliato per dati indipendenti):**
```tsx
import { useState } from 'react'

// ✅ Buono: stato separato per dati indipendenti
const [isLoading, setIsLoading] = useState<boolean>(false)
const [error, setError] = useState<string | null>(null)
const [data, setData] = useState<any[]>([])
const [filters, setFilters] = useState<Record<string, any>>({})
```

#### Pattern 2: Stato Derivato e Calcolato

```tsx
import { useState } from 'react'

interface CartItem {
  id: number
  price: number
  quantity: number
}

function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<number>(0)
  
  // ✅ Stati derivati calcolati
  const subtotal: number = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount: number = subtotal * (discount / 100)
  const total: number = subtotal - discountAmount
  const itemCount: number = items.reduce((sum, item) => sum + item.quantity, 0)
  
  // ✅ Stati derivati condizionali
  const isEmpty: boolean = items.length === 0
  const hasDiscount: boolean = discount > 0
  const canCheckout: boolean = !isEmpty && total > 0
  
  return (
    <div>
      <h2>Carrello ({itemCount} articoli)</h2>
      {isEmpty ? (
        <p>Il carrello è vuoto</p>
      ) : (
        <>
          <p>Subtotale: €{subtotal.toFixed(2)}</p>
          {hasDiscount && (
            <p>Sconto: -€{discountAmount.toFixed(2)}</p>
          )}
          <p>Totale: €{total.toFixed(2)}</p>
          <button disabled={!canCheckout}>
            Procedi al Checkout
          </button>
        </>
      )}
    </div>
  )
}
```

### 2. Gestione di Stati Complessi

#### Pattern 3: Reducer Pattern con useReducer

```tsx
import { useReducer } from 'react'

// Definizione delle azioni
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT'
} as const

type ActionType = typeof ACTIONS[keyof typeof ACTIONS]

interface CartItem {
  id: number
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  discount: number
}

interface AddItemAction {
  type: typeof ACTIONS.ADD_ITEM
  payload: CartItem
}

interface RemoveItemAction {
  type: typeof ACTIONS.REMOVE_ITEM
  payload: number
}

interface UpdateQuantityAction {
  type: typeof ACTIONS.UPDATE_QUANTITY
  payload: { id: number; quantity: number }
}

interface ClearCartAction {
  type: typeof ACTIONS.CLEAR_CART
}

interface ApplyDiscountAction {
  type: typeof ACTIONS.APPLY_DISCOUNT
  payload: number
}

type CartAction = AddItemAction | RemoveItemAction | UpdateQuantityAction | ClearCartAction | ApplyDiscountAction

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
      
    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
      
    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
      }
      
    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        discount: 0
      }
      
    case ACTIONS.APPLY_DISCOUNT:
      return {
        ...state,
        discount: action.payload
      }
      
    default:
      return state
  }
}

function AdvancedCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0
  })
  
  const addItem = (item: CartItem) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: item })
  }
  
  const removeItem = (id: number) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id })
  }
  
  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } })
  }
  
  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART })
  }
  
  const applyDiscount = (discount: number) => {
    dispatch({ type: ACTIONS.APPLY_DISCOUNT, payload: discount })
  }
  
  // Stati derivati
  const subtotal: number = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total: number = subtotal * (1 - state.discount / 100)
  
  return (
    <div>
      {/* Implementazione del componente */}
    </div>
  )
}
```

#### Pattern 4: Stato con Validazione Avanzata

```tsx
import { useState } from 'react'

interface ValidationRule {
  required?: string
  minLength?: string | number
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

function useFormValidation<T extends FormValues>(
  initialValues: T,
  validationRules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouchedState] = useState<FormTouched>({})
  
  const validateField = (name: string, value: any): string => {
    const rule = validationRules[name]
    if (!rule) return ''
    
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.required
    }
    
    if (rule.minLength) {
      const minLength = typeof rule.minLength === 'string' ? parseInt(rule.minLength) : rule.minLength
      if (typeof value === 'string' && value.length < minLength) {
        return typeof rule.minLength === 'string' ? rule.minLength : `Minimo ${minLength} caratteri`
      }
    }
    
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'Formato non valido'
    }
    
    if (rule.custom) {
      const customResult = rule.custom(value)
      if (typeof customResult === 'string') return customResult
      if (customResult === false) return 'Valore non valido'
    }
    
    return ''
  }
  
  const validateAll = (): boolean => {
    const newErrors: FormErrors = {}
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) newErrors[name] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validazione in tempo reale
    if (touched[name as string]) {
      const error = validateField(name as string, value)
      setErrors(prev => ({ ...prev, [name as string]: error }))
    }
  }
  
  const setTouched = (name: string) => {
    setTouchedState(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouchedState({})
  }
  
  const isValid = Object.keys(errors).length === 0 && 
                  Object.keys(validationRules).every(name => values[name])
  
  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid
  }
}

// Utilizzo
interface FormData {
  name: string
  email: string
  age: string
}

const validationRules: ValidationRules = {
  name: {
    required: 'Il nome è richiesto',
    minLength: 'Il nome deve essere di almeno 2 caratteri'
  },
  email: {
    required: 'L\'email è richiesta',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  age: {
    required: 'L\'età è richiesta',
    custom: (value) => parseInt(value) >= 18 ? true : 'Devi essere maggiorenne'
  }
}

function AdvancedForm() {
  const {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid
  } = useFormValidation<FormData>(
    { name: '', email: '', age: '' },
    validationRules
  )
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateAll()) {
      console.log('Form valido:', values)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Implementazione del form */}
    </form>
  )
}
```

### 3. Ottimizzazione delle Performance

#### Pattern 5: Memoizzazione con useMemo e useCallback

```tsx
import { useState, useMemo, useCallback } from 'react'

interface Item {
  id: number
  name: string
  value: number
}

interface ExpensiveComponentProps {
  items: Item[]
  filter: string
  onItemClick: (item: Item) => void
}

function ExpensiveComponent({ items, filter, onItemClick }: ExpensiveComponentProps) {
  // ✅ Memoizzazione di calcoli costosi
  const filteredItems = useMemo(() => {
    console.log('Filtro applicato')
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [items, filter])
  
  // ✅ Memoizzazione di funzioni
  const handleItemClick = useCallback((item: Item) => {
    onItemClick(item)
  }, [onItemClick])
  
  // ✅ Memoizzazione di oggetti complessi
  const itemStats = useMemo(() => {
    if (filteredItems.length === 0) {
      return { total: 0, average: 0, max: 0, min: 0 }
    }
    
    return {
      total: filteredItems.length,
      average: filteredItems.reduce((sum, item) => sum + item.value, 0) / filteredItems.length,
      max: Math.max(...filteredItems.map(item => item.value)),
      min: Math.min(...filteredItems.map(item => item.value))
    }
  }, [filteredItems])
  
  return (
    <div>
      <h3>Statistiche: {itemStats.total} elementi</h3>
      <p>Media: {itemStats.average.toFixed(2)}</p>
      <p>Max: {itemStats.max}, Min: {itemStats.min}</p>
      
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleItemClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

#### Pattern 6: Stato Ottimizzato per Liste

```tsx
import { useState, useMemo, useCallback } from 'react'

interface ListItem {
  id: number
  name: string
  date: string
  value: number
}

interface ListItemProps {
  item: ListItem
  isSelected: boolean
  onToggle: (id: number) => void
}

function ListItem({ item, isSelected, onToggle }: ListItemProps) {
  return (
    <div
      onClick={() => onToggle(item.id)}
      style={{ backgroundColor: isSelected ? 'lightblue' : 'white' }}
    >
      {item.name}
    </div>
  )
}

function OptimizedList() {
  const [items, setItems] = useState<ListItem[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'value'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // ✅ Ottimizzazione: Set per lookup O(1)
  const isSelected = useCallback((id: number): boolean => {
    return selectedIds.has(id)
  }, [selectedIds])
  
  // ✅ Ottimizzazione: memoizzazione del sorting
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [items, sortBy, sortOrder])
  
  // ✅ Ottimizzazione: toggle con Set
  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])
  
  // ✅ Ottimizzazione: selezione multipla
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)))
  }, [items])
  
  const selectNone = useCallback(() => {
    setSelectedIds(new Set())
  }, [])
  
  return (
    <div>
      <div>
        <button onClick={selectAll}>Seleziona Tutti</button>
        <button onClick={selectNone}>Deseleziona Tutti</button>
        <span>Selezionati: {selectedIds.size}</span>
      </div>
      
      <div>
        <select value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'name' | 'date' | 'value')}>
          <option value="name">Nome</option>
          <option value="date">Data</option>
          <option value="value">Valore</option>
        </select>
        <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      
      {sortedItems.map(item => (
        <ListItem
          key={item.id}
          item={item}
          isSelected={isSelected(item.id)}
          onToggle={toggleSelection}
        />
      ))}
    </div>
  )
}
```

### 4. Gestione di Stati Asincroni

#### Pattern 7: Stato per Operazioni Asincrone

```tsx
import { useState, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useAsyncState<T>(initialState: T | null = null) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialState,
    loading: false,
    error: null
  })
  
  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await asyncFunction()
      setState({
        data: result,
        loading: false,
        error: null
      })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
      setState({
        data: null,
        loading: false,
        error: errorMessage
      })
      throw error
    }
  }, [])
  
  const reset = useCallback(() => {
    setState({
      data: initialState,
      loading: false,
      error: null
    })
  }, [initialState])
  
  return {
    ...state,
    execute,
    reset
  }
}

// Utilizzo
interface DataItem {
  id: number
  name: string
}

function DataFetcher() {
  const { data, loading, error, execute, reset } = useAsyncState<DataItem[]>([])
  
  const fetchData = useCallback(() => {
    execute(async () => {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Errore nel caricamento')
      return response.json() as Promise<DataItem[]>
    })
  }, [execute])
  
  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Caricamento...' : 'Carica Dati'}
      </button>
      <button onClick={reset}>Reset</button>
      
      {error && <div style={{color: 'red'}}>Errore: {error}</div>}
      {loading && <div>Caricamento in corso...</div>}
      {data && (
        <ul>
          {data.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      )}
    </div>
  )
}
```

#### Pattern 8: Stato con Cache e Debouncing

> 💡 **Nota**: Pattern avanzati come debouncing e caching richiedono l'uso di `useEffect` per gestire side effects come timer e sottoscrizioni. Questi pattern verranno approfonditi nella Lezione 12 dopo aver imparato `useEffect`. Per ora, concentrati sui pattern di gestione stato con `useState`.

### 5. Pattern di Stato Immutabile

#### Pattern 9: Utility per Immutabilità

```tsx
import { useState } from 'react'

// Utility functions per aggiornamenti immutabili
const updateState = {
  // Aggiorna un campo in un oggetto
  object: <T extends Record<string, any>>(obj: T, path: string, value: any): T => {
    const keys = path.split('.')
    const result = { ...obj }
    let current: any = result
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    return result
  },
  
  // Aggiungi elemento a un array
  array: {
    add: <T>(arr: T[], item: T): T[] => [...arr, item],
    insert: <T>(arr: T[], index: number, item: T): T[] => [
      ...arr.slice(0, index),
      item,
      ...arr.slice(index)
    ],
    remove: <T>(arr: T[], index: number): T[] => [
      ...arr.slice(0, index),
      ...arr.slice(index + 1)
    ],
    update: <T>(arr: T[], index: number, item: T): T[] => [
      ...arr.slice(0, index),
      item,
      ...arr.slice(index + 1)
    ],
    move: <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
      const result = [...arr]
      const [item] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, item)
      return result
    }
  }
}

// Utilizzo
interface Item {
  id: number
  name: string
}

interface ComplexState {
  user: {
    profile: {
      name: string
      settings: {
        theme: string
        notifications: boolean
      }
    }
  }
  items: Item[]
  filters: {
    category: string
    price: { min: number; max: number }
  }
}

function ComplexStateExample() {
  const [state, setState] = useState<ComplexState>({
    user: {
      profile: {
        name: '',
        settings: {
          theme: 'light',
          notifications: true
        }
      }
    },
    items: [],
    filters: {
      category: 'all',
      price: { min: 0, max: 1000 }
    }
  })
  
  const updateUserName = (name: string) => {
    setState(prev => updateState.object(prev, 'user.profile.name', name))
  }
  
  const updateTheme = (theme: string) => {
    setState(prev => updateState.object(prev, 'user.profile.settings.theme', theme))
  }
  
  const addItem = (item: Item) => {
    setState(prev => ({
      ...prev,
      items: updateState.array.add(prev.items, item)
    }))
  }
  
  const removeItem = (index: number) => {
    setState(prev => ({
      ...prev,
      items: updateState.array.remove(prev.items, index)
    }))
  }
  
  const updatePriceFilter = (min: number, max: number) => {
    setState(prev => updateState.object(prev, 'filters.price', { min, max }))
  }
  
  return (
    <div>
      {/* Implementazione del componente */}
    </div>
  )
}
```

### 6. Best Practices e Anti-Patterns

#### ✅ Best Practices:

1. **Raggruppa stato correlato** in un singolo oggetto
2. **Separa stato indipendente** in variabili separate
3. **Usa stati derivati** invece di duplicare dati
4. **Memoizza calcoli costosi** con useMemo
5. **Memoizza funzioni** con useCallback
6. **Gestisci stati asincroni** con pattern dedicati
7. **Usa useReducer** per logica complessa
8. **Implementa validazione** in tempo reale
9. **Ottimizza per performance** con tecniche appropriate
10. **Mantieni immutabilità** in tutti gli aggiornamenti

#### ❌ Anti-Patterns da Evitare:

1. **Non duplicare stato** che può essere calcolato
2. **Non aggiornare stato direttamente**
3. **Non creare troppi useState** per dati correlati
4. **Non dimenticare cleanup** per effetti asincroni
5. **Non ignorare stati di loading/error**
6. **Non fare calcoli costosi** nel render
7. **Non passare oggetti inline** come props
8. **Non usare useEffect** per calcoli derivati (verrà spiegato nella Lezione 12)
9. **Non gestire stato globale** con useState locale
10. **Non ignorare ottimizzazioni** per liste grandi

## Esempi Pratici

### Esempio 1: Gestione Stato Avanzata per E-commerce
```tsx
import { useReducer, useMemo } from 'react'

interface Product {
  id: number
  name: string
  price: number
  category: string
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface User {
  id: number
  name: string
}

interface StoreFilters {
  category: string
  priceRange: [number, number]
  sortBy: 'name' | 'price'
}

interface StoreUI {
  loading: boolean
  error: string | null
  sidebarOpen: boolean
}

interface StoreState {
  products: Product[]
  cart: CartItem[]
  user: User | null
  filters: StoreFilters
  ui: StoreUI
}

type StoreAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_FILTERS'; payload: StoreFilters }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'CLEAR_ERROR' }

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      }
    case 'UPDATE_FILTERS':
      return { ...state, filters: action.payload }
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] }
    case 'CLEAR_ERROR':
      return { ...state, ui: { ...state.ui, error: null } }
    default:
      return state
  }
}

interface HeaderProps {
  cartItemCount: number
  cartTotal: number
  onToggleSidebar: () => void
}

function Header({ cartItemCount, cartTotal, onToggleSidebar }: HeaderProps) {
  return <div>Header (Placeholder)</div>
}

interface SidebarProps {
  isOpen: boolean
  filters: StoreFilters
  onFilterChange: (filters: StoreFilters) => void
}

function Sidebar({ isOpen, filters, onFilterChange }: SidebarProps) {
  return <div>Sidebar (Placeholder)</div>
}

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  loading: boolean
}

function ProductGrid({ products, onAddToCart, loading }: ProductGridProps) {
  return <div>ProductGrid (Placeholder)</div>
}

interface ErrorMessageProps {
  message: string
  onDismiss: () => void
}

function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return <div>ErrorMessage (Placeholder)</div>
}

function EcommerceStore() {
  const [state, dispatch] = useReducer(storeReducer, {
    products: [],
    cart: [],
    user: null,
    filters: {
      category: 'all',
      priceRange: [0, 1000],
      sortBy: 'name'
    },
    ui: {
      loading: false,
      error: null,
      sidebarOpen: false
    }
  })
  
  // Stati derivati
  const filteredProducts = useMemo(() => {
    return state.products
      .filter(product => {
        if (state.filters.category !== 'all' && product.category !== state.filters.category) {
          return false
        }
        if (product.price < state.filters.priceRange[0] || product.price > state.filters.priceRange[1]) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'price':
            return a.price - b.price
          case 'name':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
  }, [state.products, state.filters])
  
  const cartTotal = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [state.cart])
  
  const cartItemCount = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [state.cart])
  
  return (
    <div>
      <Header 
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
      />
      
      <Sidebar 
        isOpen={state.ui.sidebarOpen}
        filters={state.filters}
        onFilterChange={(filters) => dispatch({ type: 'UPDATE_FILTERS', payload: filters })}
      />
      
      <ProductGrid 
        products={filteredProducts}
        onAddToCart={(product) => dispatch({ type: 'ADD_TO_CART', payload: product })}
        loading={state.ui.loading}
      />
      
      {state.ui.error && (
        <ErrorMessage 
          message={state.ui.error}
          onDismiss={() => dispatch({ type: 'CLEAR_ERROR' })}
        />
      )}
    </div>
  )
}
```

### Esempio 2: Form Avanzato con Validazione
```tsx
interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface Address {
  street: string
  city: string
  zipCode: string
  country: string
}

interface Preferences {
  newsletter: boolean
  notifications: boolean
  theme: string
}

interface UserFormData {
  personalInfo: PersonalInfo
  address: Address
  preferences: Preferences
}

// Questo è un esempio che usa useFormValidation definito precedentemente
// Per completezza, assumiamo che submitUserData sia già definito
async function submitUserData(data: UserFormData): Promise<void> {
  // Implementazione placeholder
  console.log('Submitting:', data)
}

function AdvancedUserForm() {
  const {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid
  } = useFormValidation<UserFormData>(
    {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      address: {
        street: '',
        city: '',
        zipCode: '',
        country: 'IT'
      },
      preferences: {
        newsletter: false,
        notifications: true,
        theme: 'light'
      }
    },
    {
      'personalInfo.firstName': {
        required: 'Il nome è richiesto',
        minLength: 2
      },
      'personalInfo.lastName': {
        required: 'Il cognome è richiesto',
        minLength: 2
      },
      'personalInfo.email': {
        required: 'L\'email è richiesta',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      'address.zipCode': {
        required: 'Il CAP è richiesto',
        pattern: /^\d{5}$/
      }
    }
  )
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateAll()) {
      try {
        await submitUserData(values)
        reset()
        alert('Dati salvati con successo!')
      } catch (error) {
        console.error('Errore nel salvataggio:', error)
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Informazioni Personali</legend>
        <div>
          <input
            type="text"
            value={values.personalInfo.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('personalInfo.firstName' as keyof UserFormData, e.target.value)}
            onBlur={() => setTouched('personalInfo.firstName')}
            placeholder="Nome"
          />
          {touched['personalInfo.firstName'] && errors['personalInfo.firstName'] && (
            <span style={{color: 'red'}}>{errors['personalInfo.firstName']}</span>
          )}
        </div>
        {/* Altri campi... */}
      </fieldset>
      
      <fieldset>
        <legend>Indirizzo</legend>
        {/* Campi indirizzo... */}
      </fieldset>
      
      <fieldset>
        <legend>Preferenze</legend>
        {/* Campi preferenze... */}
      </fieldset>
      
      <button type="submit" disabled={!isValid}>
        Salva Dati
      </button>
    </form>
  )
}
```

## Esercizi

### Esercizio 1: Gestione Stato per Blog
Implementa un sistema di gestione stato per un blog con:
- Lista articoli con filtri e ordinamento
- Sistema di commenti
- Gestione utenti e autenticazione
- Stati di loading e errori

### Esercizio 2: Dashboard con Metriche
Crea una dashboard con:
- Grafici interattivi
- Filtri temporali
- Aggiornamento dati in tempo reale
- Cache per ottimizzare le performance

### Esercizio 3: Sistema di Notifiche
Implementa un sistema di notifiche con:
- Queue di notifiche
- Tipi diversi di notifiche
- Gestione stato di lettura
- Auto-dismiss e persistenza

## Riepilogo

In questa lezione abbiamo esplorato:

- **Pattern avanzati** per la gestione dello stato
- **Tecniche di ottimizzazione** con memoizzazione
- **Gestione di stati complessi** con useReducer
- **Stati asincroni** e side effects
- **Pattern immutabili** per aggiornamenti sicuri
- **Best practices** e anti-patterns da evitare

Queste tecniche ti permetteranno di gestire stati complessi in modo scalabile e performante, creando applicazioni React robuste e mantenibili.

Nella prossima lezione esploreremo il passaggio di stato tra componenti e la comunicazione tra componenti.
