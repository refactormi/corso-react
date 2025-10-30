# Lezione 11: Interazione Utente e Validazione

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Gestire eventi utente in React
- Implementare form handling avanzato
- Creare sistemi di validazione robusti
- Gestire input controllati e non controllati
- Implementare feedback visivo per l'utente
- Gestire stati di loading e errori
- Creare esperienze utente fluide e responsive

## Teoria

### 1. Gestione Eventi in React

#### Eventi Sintetici (Synthetic Events)
React utilizza un sistema di eventi sintetici che normalizza le differenze tra browser:

```tsx
function EventExample(): JSX.Element {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // event è un SyntheticEvent
    event.preventDefault() // Previene comportamento default
    event.stopPropagation() // Ferma propagazione
    console.log('Evento cliccato:', event.type)
  }
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Valore input:', event.target.value)
  }
  
  return (
    <div>
      <button onClick={handleClick}>Clicca qui</button>
      <input onChange={handleInputChange} placeholder="Digita qualcosa" />
    </div>
  )
}
```

#### Pattern di Gestione Eventi

**Pattern 1: Handler Inline**
```tsx
function InlineHandlers(): JSX.Element {
  return (
    <div>
      <button onClick={() => console.log('Cliccato!')}>
        Handler Inline
      </button>
    </div>
  )
}
```

**Pattern 2: Handler Separato**
```tsx
function SeparateHandlers(): JSX.Element {
  const handleClick = () => {
    console.log('Cliccato!')
  }
  
  return (
    <div>
      <button onClick={handleClick}>
        Handler Separato
      </button>
    </div>
  )
}
```

**Pattern 3: Handler con Parametri**
```tsx
function ParameterizedHandlers(): JSX.Element {
  const handleClick = (id: number, name: string) => {
    console.log(`Cliccato item ${id}: ${name}`)
  }
  
  return (
    <div>
      <button onClick={() => handleClick(1, 'Mario')}>
        Clicca Mario
      </button>
      <button onClick={() => handleClick(2, 'Luigi')}>
        Clicca Luigi
      </button>
    </div>
  )
}
```

### 2. Form Handling

#### Input Controllati vs Non Controllati

**Input Controllati:**
```tsx
function ControlledInput(): JSX.Element {
  const [value, setValue] = useState<string>('')
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Input controllato"
    />
  )
}
```

**Input Non Controllati:**
```tsx
function UncontrolledInput(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Valore:', inputRef.current?.value)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Input non controllato"
      />
      <button type="submit">Invia</button>
    </form>
  )
}
```

#### Form Complesso con Validazione

```tsx
interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface FormErrors {
  [key: string]: string
}

interface FormTouched {
  [key: string]: boolean
}

function AdvancedForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})
  
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Nome deve essere di almeno 2 caratteri' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email non valida' : ''
      case 'password':
        return value.length < 8 ? 'Password deve essere di almeno 8 caratteri' : ''
      case 'confirmPassword':
        return value !== formData.password ? 'Le password non coincidono' : ''
      case 'terms':
        return !value ? 'Devi accettare i termini' : ''
      default:
        return ''
    }
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }))
    
    // Validazione in tempo reale
    if (touched[name]) {
      const error = validateField(name, fieldValue)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }
  
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value
    
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, fieldValue)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Valida tutti i campi
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach(name => {
      const error = validateField(name, formData[name as keyof FormData])
      if (error) newErrors[name] = error
    })
    
    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form valido:', formData)
      // Invia i dati
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Nome"
        />
        {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
      </div>
      
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
      </div>
      
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {errors.password && <span style={{color: 'red'}}>{errors.password}</span>}
      </div>
      
      <div>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Conferma Password"
        />
        {errors.confirmPassword && <span style={{color: 'red'}}>{errors.confirmPassword}</span>}
      </div>
      
      <div>
        <label>
          <input
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          Accetto i termini e condizioni
        </label>
        {errors.terms && <span style={{color: 'red'}}>{errors.terms}</span>}
      </div>
      
      <button type="submit">Registrati</button>
    </form>
  )
}
```

### 3. Validazione Avanzata

#### Hook Personalizzato per Validazione

```tsx
type ValidationRule<T = any> = (value: any, allValues?: T) => string

interface ValidationRules<T = any> {
  [key: string]: ValidationRule<T>[]
}

interface UseValidationReturn<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  setValue: (name: string, value: any) => void
  setFieldTouched: (name: string) => void
  validateAll: () => boolean
  reset: () => void
  isValid: boolean
}

function useValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
): UseValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const validateField = (name: string, value: any): string => {
    const rules = validationRules[name]
    if (!rules) return ''
    
    for (const rule of rules) {
      const error = rule(value, values)
      if (error) return error
    }
    return ''
  }
  
  const setValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }
  
  const setFieldTouched = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {}
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) newErrors[name] = error
    })
    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    return Object.keys(newErrors).length === 0
  }
  
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }
  
  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}

// Regole di validazione
interface FormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const validationRules: ValidationRules<FormValues> = {
  name: [
    (value: string) => !value ? 'Nome richiesto' : '',
    (value: string) => value.length < 2 ? 'Nome troppo corto' : '',
    (value: string) => value.length > 50 ? 'Nome troppo lungo' : ''
  ],
  email: [
    (value: string) => !value ? 'Email richiesta' : '',
    (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email non valida' : ''
  ],
  password: [
    (value: string) => !value ? 'Password richiesta' : '',
    (value: string) => value.length < 8 ? 'Password troppo corta' : '',
    (value: string) => !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ? 'Password deve contenere maiuscole, minuscole e numeri' : ''
  ],
  confirmPassword: [
    (value: string, allValues?: FormValues) => value !== allValues?.password ? 'Le password non coincidono' : ''
  ]
}
```

### 4. Feedback Visivo e Stati di Loading

#### Componente con Stati di Loading

```tsx
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

function LoadingButton({ onClick, children, loading, disabled, ...props }: LoadingButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        position: 'relative',
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer'
      } as React.CSSProperties}
      {...props}
    >
      {loading && (
        <span style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '16px',
          height: '16px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        } as React.CSSProperties} />
      )}
      {children}
    </button>
  )
}

function FormWithLoading(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (formData: Record<string, any>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
    } catch (err) {
      setError('Errore durante l\'invio')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      {success && (
        <div style={{color: 'green', padding: '10px', backgroundColor: '#d4edda'} as React.CSSProperties}>
          ✅ Form inviato con successo!
        </div>
      )}
      
      {error && (
        <div style={{color: 'red', padding: '10px', backgroundColor: '#f8d7da'} as React.CSSProperties}>
          ❌ {error}
        </div>
      )}
      
      <LoadingButton
        onClick={() => handleSubmit({})}
        loading={loading}
      >
        {loading ? 'Invio in corso...' : 'Invia Form'}
      </LoadingButton>
    </div>
  )
}
```

### 5. Gestione Input Avanzata

#### Input con Debouncing

> 💡 **Nota**: Il debouncing richiede l'uso di `useEffect` per gestire timer e cleanup. Questo pattern verrà approfondito nella Lezione 12 dopo aver imparato `useEffect`. Per ora, puoi implementare la ricerca senza debouncing, chiamando `onSearch` direttamente nell'`onChange`.

```tsx
interface SearchInputProps {
  onSearch: (query: string) => void
}

function SearchInput({ onSearch }: SearchInputProps): JSX.Element {
  const [query, setQuery] = useState<string>('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    // Chiamata diretta senza debouncing
    // Nota: Per implementare debouncing serve useEffect (Lezione 12)
    if (newQuery.trim()) {
      onSearch(newQuery)
    }
  }
  
  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Cerca..."
    />
  )
}
```

#### Input con Autocomplete

```tsx
interface AutocompleteInputProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  placeholder?: string
}

function AutocompleteInput({ suggestions, onSelect, placeholder }: AutocompleteInputProps): JSX.Element {
  const [value, setValue] = useState<string>('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  
  // Calcola i suggerimenti filtrati direttamente nel render
  // Nota: Per ottimizzare con memoizzazione serve useMemo o useEffect,
  // che verranno spiegati nelle Lezioni 12 e 14
  const filteredSuggestions = value 
    ? suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
    : []
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    setShowSuggestions(true)
  }
  
  const handleSelect = (suggestion: string) => {
    setValue(suggestion)
    setShowSuggestions(false)
    onSelect(suggestion)
  }
  
  return (
    <div style={{ position: 'relative' } as React.CSSProperties}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
      />
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderTop: 'none',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000
        } as React.CSSProperties}>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              } as React.CSSProperties}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### 6. Gestione Errori e Feedback

#### Sistema di Notifiche

```tsx
interface Notification {
  id: number
  type: 'success' | 'error'
  message: string
}

interface UseNotificationsReturn {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: number) => void
}

function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, ...notification }])
    
    // Auto-remove dopo 5 secondi
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }
  
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  return {
    notifications,
    addNotification,
    removeNotification
  }
}

function NotificationSystem(): JSX.Element {
  const { notifications, addNotification, removeNotification } = useNotifications()
  
  const showSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Operazione completata con successo!'
    })
  }
  
  const showError = () => {
    addNotification({
      type: 'error',
      message: 'Si è verificato un errore!'
    })
  }
  
  return (
    <div>
      <button onClick={showSuccess}>Mostra Successo</button>
      <button onClick={showError}>Mostra Errore</button>
      
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 } as React.CSSProperties}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
              border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              color: notification.type === 'success' ? '#155724' : '#721c24'
            } as React.CSSProperties}
          >
            {notification.message}
            <button
              onClick={() => removeNotification(notification.id)}
              style={{ marginLeft: '10px', background: 'none', border: 'none' } as React.CSSProperties}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 7. Best Practices

#### ✅ Best Practices:

1. **Usa input controllati** per la maggior parte dei casi
2. **Valida in tempo reale** per migliorare l'UX
3. **Fornisci feedback immediato** all'utente
4. **Gestisci stati di loading** per operazioni asincrone
5. **Usa debouncing** per input che richiedono chiamate API
6. **Implementa gestione errori** robusta
7. **Mantieni l'accessibilità** con label e ARIA
8. **Testa tutti gli stati** del form

#### ❌ Anti-Patterns da Evitare:

1. **Non validare solo al submit** - valida in tempo reale
2. **Non dimenticare stati di loading** per operazioni asincrone
3. **Non ignorare la gestione errori** di rete
4. **Non usare input non controllati** senza necessità
5. **Non dimenticare l'accessibilità** (label, ARIA)
6. **Non validare solo lato client** - sempre anche lato server
7. **Non mostrare errori generici** - sii specifico
8. **Non dimenticare il cleanup** per timeout e interval

## Esempi Pratici

### Esempio 1: Form di Registrazione Completo
```tsx
interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dateOfBirth: string
  gender: string
  newsletter: boolean
  terms: boolean
}

function RegistrationForm(): JSX.Element {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    newsletter: false,
    terms: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  
  const validateField = (name: string, value: any): string => {
    const validations: Record<string, string> = {
      firstName: value.length < 2 ? 'Nome deve essere di almeno 2 caratteri' : '',
      lastName: value.length < 2 ? 'Cognome deve essere di almeno 2 caratteri' : '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email non valida' : '',
      password: value.length < 8 ? 'Password deve essere di almeno 8 caratteri' : '',
      confirmPassword: value !== formData.password ? 'Le password non coincidono' : '',
      dateOfBirth: !value ? 'Data di nascita richiesta' : '',
      gender: !value ? 'Genere richiesto' : '',
      terms: !value ? 'Devi accettare i termini' : ''
    }
    return validations[name] || ''
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    const checked = (event.target as HTMLInputElement).checked
    const fieldValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }))
    
    if (touched[name]) {
      const error = validateField(name, fieldValue)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }
  
  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    const checked = (event.target as HTMLInputElement).checked
    const fieldValue = type === 'checkbox' ? checked : value
    
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, fieldValue)
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Valida tutti i campi
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(name => {
      const error = validateField(name, formData[name as keyof RegistrationFormData])
      if (error) newErrors[name] = error
    })
    
    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        // Simula chiamata API
        await new Promise(resolve => setTimeout(resolve, 2000))
        setSuccess(true)
      } catch (error) {
        console.error('Errore registrazione:', error)
      } finally {
        setLoading(false)
      }
    }
  }
  
  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>✅ Registrazione Completata!</h2>
        <p>Benvenuto! La tua registrazione è stata completata con successo.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Registrazione</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Nome"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.firstName && <span style={{color: 'red', fontSize: '14px'}}>{errors.firstName}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Cognome"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.lastName && <span style={{color: 'red', fontSize: '14px'}}>{errors.lastName}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.email && <span style={{color: 'red', fontSize: '14px'}}>{errors.email}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.password && <span style={{color: 'red', fontSize: '14px'}}>{errors.password}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Conferma Password"
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.confirmPassword && <span style={{color: 'red', fontSize: '14px'}}>{errors.confirmPassword}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        />
        {errors.dateOfBirth && <span style={{color: 'red', fontSize: '14px'}}>{errors.dateOfBirth}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
        >
          <option value="">Seleziona genere</option>
          <option value="male">Maschio</option>
          <option value="female">Femmina</option>
          <option value="other">Altro</option>
        </select>
        {errors.gender && <span style={{color: 'red', fontSize: '14px'}}>{errors.gender}</span>}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            name="newsletter"
            type="checkbox"
            checked={formData.newsletter}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          Iscrivimi alla newsletter
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ marginRight: '8px' }}
          />
          Accetto i termini e condizioni
        </label>
        {errors.terms && <span style={{color: 'red', fontSize: '14px', display: 'block'}}>{errors.terms}</span>}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registrazione in corso...' : 'Registrati'}
      </button>
    </form>
  );
}
```

## Esercizi

### Esercizio 1: Form di Contatto
Crea un form di contatto con:
- Validazione in tempo reale
- Stati di loading
- Gestione errori
- Feedback visivo

### Esercizio 2: Sistema di Login
Implementa un sistema di login con:
- Validazione email/password
- Gestione errori di autenticazione
- Stati di loading
- Redirect dopo login

### Esercizio 3: Form Multi-Step
Crea un form multi-step con:
- Navigazione tra step
- Validazione per step
- Salvataggio progresso
- Riepilogo finale

## Riepilogo

In questa lezione abbiamo imparato:

- **Gestione eventi** in React con Synthetic Events
- **Form handling** con input controllati e non controllati
- **Validazione avanzata** con hook personalizzati
- **Feedback visivo** e stati di loading
- **Gestione errori** e notifiche
- **Input avanzati** con debouncing e autocomplete
- **Best practices** per l'interazione utente

L'interazione utente è fondamentale per creare applicazioni React user-friendly e robuste. Ricorda sempre di:

- Validare in tempo reale per migliorare l'UX
- Fornire feedback immediato all'utente
- Gestire stati di loading e errori
- Mantenere l'accessibilità
- Testare tutti gli stati del form

Nella prossima lezione esploreremo useEffect e il ciclo di vita dei componenti.
