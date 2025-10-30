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

Il pattern dello **stato raggruppato** consiste nel racchiudere in un singolo oggetto di stato tutti i dati che sono logicamente correlati tra loro e che vengono spesso aggiornati insieme o rappresentano un'entità unica.

**Scopo e Vantaggi:**
1. **Coerenza logica**: Raggruppa dati che appartengono alla stessa entità concettuale (es. un utente)
2. **Sincronizzazione**: Garantisce che i dati correlati siano sempre aggiornati insieme
3. **Semplicità di aggiornamento**: Permette di aggiornare porzioni specifiche dello stato mantenendo immutabilità
4. **Riusabilità**: Facilita il passaggio dell'intero stato come prop o il salvataggio/ripristino
5. **Type safety**: TypeScript può verificare la struttura completa dell'oggetto

**Esempio Pratico:**

```tsx
import { useState } from 'react'

// ✅ Buono: stato raggruppato per dati correlati
// Definiamo le interfacce per organizzare i dati per dominio logico

// Profilo utente: informazioni personali
interface Profile {
  name: string
  email: string
  avatar: string
}

// Preferenze utente: impostazioni dell'applicazione
interface Preferences {
  theme: string        // 'light' | 'dark'
  language: string    // 'it' | 'en' | 'es'
  notifications: boolean
}

// Sessione utente: stato di autenticazione
interface Session {
  isLoggedIn: boolean
  lastLogin: Date | null
  token: string | null
}

// Interfaccia principale che raggruppa tutti i dati correlati all'utente
interface User {
  profile: Profile
  preferences: Preferences
  session: Session
}

function UserComponent() {
  // Un singolo useState contiene tutti i dati dell'utente
  // Questo è un'istanza di "stato raggruppato"
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

  // ✅ Aggiornamento parziale del profilo mantenendo immutabilità
  // Si aggiorna solo la sezione 'profile' senza toccare le altre
  const updateProfile = (updates: Partial<Profile>) => {
    setUser(prev => ({
      ...prev,                    // Mantiene tutte le altre proprietà
      profile: { 
        ...prev.profile,          // Mantiene le proprietà del profilo non modificate
        ...updates                 // Applica solo gli aggiornamenti richiesti
      }
    }))
  }

  // ✅ Aggiornamento delle preferenze
  const updatePreferences = (updates: Partial<Preferences>) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates }
    }))
  }

  // ✅ Aggiornamento della sessione (es. dopo login)
  const login = (token: string) => {
    setUser(prev => ({
      ...prev,
      session: {
        isLoggedIn: true,
        lastLogin: new Date(),
        token: token
      }
    }))
  }

  // ✅ Logout: resetta solo la sessione mantenendo profilo e preferenze
  const logout = () => {
    setUser(prev => ({
      ...prev,
      session: {
        isLoggedIn: false,
        lastLogin: prev.session.lastLogin,  // Mantiene l'ultimo login
        token: null
      }
    }))
  }

  // Esempio di utilizzo:
  // updateProfile({ name: 'Mario Rossi', email: 'mario@example.com' })
  // updatePreferences({ theme: 'dark' })
  // login('abc123token')

  return (
    <div>
      <h2>{user.profile.name || 'Utente non autenticato'}</h2>
      {user.session.isLoggedIn && (
        <p>Ultimo accesso: {user.session.lastLogin?.toLocaleString()}</p>
      )}
    </div>
  )
}
```

**Quando Usare lo Stato Raggruppato:**
- I dati rappresentano un'entità unica (utente, prodotto, ordine, ecc.)
- I dati sono spesso aggiornati insieme o visualizzati insieme
- C'è una relazione logica tra i dati (es. profilo, preferenze e sessione appartengono tutte all'utente)
- Vuoi evitare inconsistenze tra dati correlati
- Hai bisogno di passare l'intero stato come prop o salvarlo in localStorage

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

Il pattern dello **stato derivato** consiste nel calcolare valori a partire da stati esistenti invece di memorizzarli separatamente. Questo evita duplicazione dei dati e garantisce che i valori calcolati siano sempre sincronizzati con lo stato sorgente.

**Scopo e Vantaggi:**
1. **Evita duplicazione**: Non conserva dati che possono essere calcolati da altri dati
2. **Sincronizzazione automatica**: I valori derivati sono sempre aggiornati quando cambia lo stato sorgente
3. **Single Source of Truth**: Mantiene un'unica fonte di verità per i dati
4. **Semplicità**: Riduce la complessità dello stato e il numero di `useState` necessari
5. **Performance**: In React, i calcoli sono eseguiti solo durante il render, evitando aggiornamenti manuali

**Quando Usare lo Stato Derivato:**
- Quando un valore può essere calcolato da altri dati esistenti
- Quando vuoi evitare di sincronizzare manualmente più stati
- Quando il calcolo è semplice e veloce (per calcoli complessi, usa `useMemo`)
- Quando il valore cambia sempre insieme allo stato sorgente

**Esempio Pratico:**

```tsx
import { useState } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

function ShoppingCart() {
  // ✅ STATO SORGENTE: solo i dati essenziali che l'utente può modificare
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<number>(0) // percentuale di sconto (0-100)
  
  // ✅ STATI DERIVATI CALCOLATI: valori calcolati da stati esistenti
  // Si ricalcolano automaticamente ad ogni render quando cambiano items o discount
  
  // Subtotale: somma di tutti gli item (prezzo × quantità)
  const subtotal: number = items.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  )
  
  // Importo dello sconto: percentuale applicata al subtotale
  const discountAmount: number = subtotal * (discount / 100)
  
  // Totale finale: subtotale meno lo sconto
  const total: number = subtotal - discountAmount
  
  // Numero totale di articoli nel carrello (somma delle quantità)
  const itemCount: number = items.reduce((sum, item) => sum + item.quantity, 0)
  
  // ✅ STATI DERIVATI CONDIZIONALI: valori booleani per controllare la UI
  // Questi valori derivano dalla logica dello stato sorgente
  
  // Il carrello è vuoto se non ci sono item
  const isEmpty: boolean = items.length === 0
  
  // C'è uno sconto se la percentuale è maggiore di 0
  const hasDiscount: boolean = discount > 0
  
  // Si può procedere al checkout solo se il carrello non è vuoto e il totale è positivo
  const canCheckout: boolean = !isEmpty && total > 0
  
  // Funzioni per modificare lo stato sorgente
  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        // Se l'item esiste già, aumenta solo la quantità
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      // Altrimenti aggiungi il nuovo item
      return [...prev, { ...item, quantity: 1 }]
    })
  }
  
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }
  
  const updateQuantity = (id: number, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    )
  }
  
  const applyDiscount = (discountPercent: number) => {
    setDiscount(Math.max(0, Math.min(100, discountPercent)))
  }
  
  return (
    <div>
      <h2>Carrello ({itemCount} articoli)</h2>
      
      {/* Mostra un messaggio se il carrello è vuoto */}
      {isEmpty ? (
        <p>Il carrello è vuoto</p>
      ) : (
        <>
          {/* Lista degli item */}
          <ul>
            {items.map(item => (
              <li key={item.id}>
                {item.name} - €{item.price.toFixed(2)} × {item.quantity}
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
                <button onClick={() => removeItem(item.id)}>Rimuovi</button>
              </li>
            ))}
          </ul>
          
          {/* Dettagli del totale */}
          <div>
            <p>Subtotale: €{subtotal.toFixed(2)}</p>
            
            {/* Mostra lo sconto solo se presente */}
            {hasDiscount && (
              <p>
                Sconto ({discount}%): -€{discountAmount.toFixed(2)}
              </p>
            )}
            
            <p><strong>Totale: €{total.toFixed(2)}</strong></p>
            
            {/* Il pulsante è disabilitato se non si può procedere */}
            <button disabled={!canCheckout}>
              Procedi al Checkout
            </button>
          </div>
          
          {/* Input per applicare uno sconto */}
          <div>
            <label>
              Sconto (%):
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => applyDiscount(Number(e.target.value))}
              />
            </label>
          </div>
        </>
      )}
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Non memorizzare valori che possono essere calcolati
function ShoppingCartBad() {
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<number>(0)
  
  // ❌ ERRORE: Memorizzare il totale come stato separato
  // Questo crea duplicazione e rischio di inconsistenza
  const [total, setTotal] = useState<number>(0)
  const [subtotal, setSubtotal] = useState<number>(0)
  
  // Dovresti ricordarti di aggiornare questi stati ogni volta che cambiano items o discount
  // Questo è fragile e propenso a errori!
  
  // ✅ CORRETTO: Calcola i valori direttamente nello stato derivato
  const totalCorrect = items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 - discount / 100)
}
```

**Note Importanti:**
- Gli stati derivati vengono ricalcolati ad ogni render. Se il calcolo è costoso (es. operazioni su grandi array), usa `useMemo` per ottimizzare (vedi Pattern 5).
- Non usare `useState` per valori derivati: creeresti duplicazione e rischio di inconsistenza.
- Gli stati derivati sono read-only: se serve modificarli, agisci sullo stato sorgente.

### 2. Gestione di Stati Complessi

#### Pattern 3: Reducer Pattern con useReducer

Il pattern **Reducer** è un approccio potente per gestire stati complessi con logica di aggiornamento articolata. Utilizza `useReducer`, un hook React che segue il pattern Redux, centralizzando tutta la logica di modifica dello stato in una singola funzione chiamata "reducer".

**Scopo e Vantaggi:**
1. **Centralizzazione della logica**: Tutte le modifiche dello stato sono gestite in un unico posto (il reducer)
2. **Prevedibilità**: Le azioni descrivono chiaramente cosa sta cambiando e perché
3. **Testabilità**: Il reducer è una funzione pura, facile da testare isolatamente
4. **Scalabilità**: Ideale per stati complessi con molte interazioni diverse
5. **Debugging**: Le azioni possono essere loggate facilmente per tracciare cambiamenti
6. **Type safety**: Con TypeScript, ogni azione è tipizzata e verificata a compile-time

**Quando Usare useReducer:**
- Quando hai stati complessi con logica di aggiornamento articolata
- Quando devi gestire molti casi diversi di modifica dello stato
- Quando la logica di aggiornamento coinvolge più valori correlati
- Quando vuoi separare la logica di business dalla UI
- Quando la complessità dello stato supera quella gestibile con `useState`

**Esempio Pratico Completo:**

```tsx
import { useReducer, useMemo } from 'react'

// ✅ STEP 1: Definizione delle costanti delle azioni
// Usiamo 'as const' per garantire che le stringhe siano literal types
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT'
} as const

// ✅ STEP 2: Definizione delle interfacce per lo stato
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  discount: number  // percentuale di sconto (0-100)
}

// ✅ STEP 3: Definizione delle azioni tipizzate
// Ogni tipo di azione ha una struttura specifica con 'type' e 'payload'
interface AddItemAction {
  type: typeof ACTIONS.ADD_ITEM
  payload: CartItem  // L'item da aggiungere
}

interface RemoveItemAction {
  type: typeof ACTIONS.REMOVE_ITEM
  payload: number  // L'id dell'item da rimuovere
}

interface UpdateQuantityAction {
  type: typeof ACTIONS.UPDATE_QUANTITY
  payload: { id: number; quantity: number }  // Id e nuova quantità
}

interface ClearCartAction {
  type: typeof ACTIONS.CLEAR_CART
  // Nessun payload necessario per questa azione
}

interface ApplyDiscountAction {
  type: typeof ACTIONS.APPLY_DISCOUNT
  payload: number  // Percentuale di sconto
}

// ✅ STEP 4: Union type per tutte le azioni possibili
type CartAction = 
  | AddItemAction 
  | RemoveItemAction 
  | UpdateQuantityAction 
  | ClearCartAction 
  | ApplyDiscountAction

// ✅ STEP 5: Reducer function
// Il reducer è una funzione PURA che:
// - Riceve lo stato corrente e un'azione
// - Restituisce il nuovo stato senza modificare quello esistente
// - Non deve avere side effects
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case ACTIONS.ADD_ITEM:
      // Controlla se l'item esiste già nel carrello
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        // Se esiste, incrementa solo la quantità
        return {
          ...state,  // Mantiene tutte le altre proprietà dello stato
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      
      // Se non esiste, aggiungi un nuovo item con quantità 1
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
      
    case ACTIONS.REMOVE_ITEM:
      // Rimuove l'item con l'id specificato
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
      
    case ACTIONS.UPDATE_QUANTITY:
      // Aggiorna la quantità di un item specifico
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }  // Impedisce quantità negative
            : item
        )
      }
      
    case ACTIONS.CLEAR_CART:
      // Svuota completamente il carrello e resetta lo sconto
      return {
        ...state,
        items: [],
        discount: 0
      }
      
    case ACTIONS.APPLY_DISCOUNT:
      // Applica uno sconto percentuale
      return {
        ...state,
        discount: Math.max(0, Math.min(100, action.payload))  // Limita tra 0 e 100
      }
      
    default:
      // IMPORTANTE: Restituisce sempre lo stato invariato per azioni sconosciute
      // Questo è necessario per TypeScript e per evitare errori
      return state
  }
}

// ✅ STEP 6: Componente che usa il reducer
function AdvancedCart() {
  // useReducer restituisce:
  // - state: lo stato corrente
  // - dispatch: funzione per inviare azioni al reducer
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0
  })
  
  // ✅ Funzioni helper che incapsulano la chiamata a dispatch
  // Queste funzioni rendono il codice più leggibile e facile da usare
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
  
  // ✅ Stati derivati calcolati dallo stato del reducer
  const subtotal: number = useMemo(() => 
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  )
  
  const discountAmount: number = useMemo(() => 
    subtotal * (state.discount / 100),
    [subtotal, state.discount]
  )
  
  const total: number = useMemo(() => 
    subtotal - discountAmount,
    [subtotal, discountAmount]
  )
  
  const itemCount: number = useMemo(() => 
    state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  )
  
  const isEmpty: boolean = state.items.length === 0
  
  return (
    <div>
      <h2>Carrello ({itemCount} articoli)</h2>
      
      {isEmpty ? (
        <p>Il carrello è vuoto</p>
      ) : (
        <>
          {/* Lista degli item */}
          <ul>
            {state.items.map(item => (
              <li key={item.id}>
                <strong>{item.name}</strong>
                <br />
                €{item.price.toFixed(2)} × {item.quantity} = €{(item.price * item.quantity).toFixed(2)}
                <br />
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
                <span> {item.quantity} </span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
                <button onClick={() => removeItem(item.id)}>Rimuovi</button>
              </li>
            ))}
          </ul>
          
          {/* Riepilogo totale */}
          <div>
            <p>Subtotale: €{subtotal.toFixed(2)}</p>
            {state.discount > 0 && (
              <p>
                Sconto ({state.discount}%): -€{discountAmount.toFixed(2)}
              </p>
            )}
            <p><strong>Totale: €{total.toFixed(2)}</strong></p>
          </div>
          
          {/* Controlli */}
          <div>
            <label>
              Applica sconto (%):
              <input
                type="number"
                min="0"
                max="100"
                value={state.discount}
                onChange={(e) => applyDiscount(Number(e.target.value))}
              />
            </label>
          </div>
          
          <button onClick={clearCart}>Svuota Carrello</button>
        </>
      )}
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Non usare useState per gestire logica complessa
function BadCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<number>(0)
  
  // ❌ ERRORE: Logica sparsa in più funzioni, difficile da tracciare
  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    // Cosa succede se devi anche aggiornare altri stati correlati?
    // Devi ricordarti di aggiornare ogni funzione...
  }
  
  // Con useReducer, tutta questa logica è centralizzata nel reducer!
}

// ✅ CORRETTO: Usa useReducer per logica complessa
// Tutta la logica è in un unico posto, facile da testare e mantenere
```

**Note Importanti:**
- Il reducer deve essere una funzione pura: nessun side effect, nessuna mutazione diretta dello stato
- Usa sempre il pattern spread (`...state`) per creare nuovi oggetti invece di modificare quelli esistenti
- Il `default` case nel switch è obbligatorio: restituisce sempre lo stato invariato
- Tipizza sempre le azioni con TypeScript per evitare errori a runtime
- Le azioni dovrebbero descrivere l'intenzione ("cosa vuoi fare"), non l'implementazione ("come farlo")
- Per stati semplici, `useState` è più appropriato. Usa `useReducer` solo quando la complessità lo giustifica

#### Pattern 4: Stato con Validazione Avanzata

Il pattern di **validazione avanzata** consiste nel creare un hook personalizzato che gestisce lo stato del form insieme alla validazione, agli errori e allo stato "touched" (toccato) dei campi. Questo pattern centralizza la logica di validazione e migliora l'esperienza utente con feedback in tempo reale.

**Scopo e Vantaggi:**
1. **Validazione centralizzata**: Tutta la logica di validazione è in un unico posto, facile da testare e mantenere
2. **Feedback immediato**: Mostra errori solo dopo che l'utente ha interagito con un campo (touched)
3. **Riutilizzabilità**: L'hook può essere usato in qualsiasi form dell'applicazione
4. **Type safety**: TypeScript garantisce che i nomi dei campi siano corretti
5. **Validazione flessibile**: Supporta regole multiple (required, pattern, custom, ecc.)
6. **UX migliorata**: Evita di mostrare errori prima che l'utente abbia iniziato a digitare

**Quando Usare questo Pattern:**
- Quando hai form complessi con più campi da validare
- Quando vuoi validazione in tempo reale senza essere invasiva
- Quando hai bisogno di riutilizzare la logica di validazione in più form
- Quando vuoi separare la logica di validazione dalla UI

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ Definizione delle interfacce per il sistema di validazione

// Regola di validazione per un singolo campo
interface ValidationRule {
  required?: string              // Messaggio di errore se il campo è richiesto ma vuoto
  minLength?: string | number   // Lunghezza minima (numero) o messaggio personalizzato
  maxLength?: number            // Lunghezza massima
  pattern?: RegExp              // Pattern regex per validare il formato
  custom?: (value: any) => string | boolean  // Funzione di validazione personalizzata
}

// Insieme di regole di validazione per tutti i campi del form
interface ValidationRules {
  [key: string]: ValidationRule
}

// Valori del form (generico per supportare qualsiasi struttura)
interface FormValues {
  [key: string]: any
}

// Errori di validazione per ogni campo
interface FormErrors {
  [key: string]: string
}

// Traccia quali campi sono stati "toccati" (interagiti dall'utente)
interface FormTouched {
  [key: string]: boolean
}

// ✅ Hook personalizzato per la validazione del form
function useFormValidation<T extends FormValues>(
  initialValues: T,
  validationRules: ValidationRules
) {
  // Stato dei valori del form
  const [values, setValues] = useState<T>(initialValues)
  
  // Stato degli errori di validazione
  const [errors, setErrors] = useState<FormErrors>({})
  
  // Stato dei campi toccati (per mostrare errori solo dopo l'interazione)
  const [touched, setTouchedState] = useState<FormTouched>({})
  
  // ✅ Funzione per validare un singolo campo
  const validateField = (name: string, value: any): string => {
    const rule = validationRules[name]
    if (!rule) return ''  // Nessuna regola = nessun errore
    
    // Validazione: campo richiesto
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.required
    }
    
    // Validazione: lunghezza minima
    if (rule.minLength) {
      const minLength = typeof rule.minLength === 'string' 
        ? parseInt(rule.minLength) 
        : rule.minLength
      if (typeof value === 'string' && value.length < minLength) {
        return typeof rule.minLength === 'string' 
          ? rule.minLength 
          : `Minimo ${minLength} caratteri`
      }
    }
    
    // Validazione: lunghezza massima
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `Massimo ${rule.maxLength} caratteri`
    }
    
    // Validazione: pattern regex
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'Formato non valido'
    }
    
    // Validazione: funzione personalizzata
    if (rule.custom) {
      const customResult = rule.custom(value)
      if (typeof customResult === 'string') return customResult
      if (customResult === false) return 'Valore non valido'
    }
    
    return ''  // Nessun errore trovato
  }
  
  // ✅ Validazione di tutti i campi (usata al submit)
  const validateAll = (): boolean => {
    const newErrors: FormErrors = {}
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) newErrors[name] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // ✅ Aggiorna il valore di un campo e valida se il campo è stato toccato
  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validazione in tempo reale solo se il campo è stato toccato
    if (touched[name as string]) {
      const error = validateField(name as string, value)
      setErrors(prev => ({ ...prev, [name as string]: error }))
    }
  }
  
  // ✅ Segna un campo come "toccato" e valida immediatamente
  const setTouched = (name: string) => {
    setTouchedState(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  // ✅ Reset completo del form
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouchedState({})
  }
  
  // ✅ Stato derivato: il form è valido se non ci sono errori e tutti i campi hanno valori
  const isValid = Object.keys(errors).length === 0 && 
                  Object.keys(validationRules).every(name => values[name])
  
  return {
    values,        // Valori correnti del form
    errors,        // Errori di validazione
    touched,       // Campi toccati dall'utente
    setValue,      // Funzione per aggiornare un valore
    setTouched,   // Funzione per segnare un campo come toccato
    validateAll,   // Funzione per validare tutti i campi
    reset,         // Funzione per resettare il form
    isValid        // Stato booleano: true se il form è valido
  }
}

// ✅ Esempio di utilizzo
interface FormData {
  name: string
  email: string
  age: string
}

// Definizione delle regole di validazione
const validationRules: ValidationRules = {
  name: {
    required: 'Il nome è richiesto',
    minLength: 2  // Oppure: minLength: 'Il nome deve essere di almeno 2 caratteri'
  },
  email: {
    required: 'L\'email è richiesta',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Pattern per email valida
  },
  age: {
    required: 'L\'età è richiesta',
    custom: (value) => {
      const age = parseInt(value)
      if (isNaN(age)) return 'Devi inserire un numero'
      if (age < 18) return 'Devi essere maggiorenne'
      if (age > 120) return 'Età non valida'
      return true  // Valido
    }
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
    
    // Segna tutti i campi come toccati prima di validare
    Object.keys(validationRules).forEach(name => setTouched(name))
    
    // Valida tutti i campi
    if (validateAll()) {
      console.log('Form valido:', values)
      alert('Form inviato con successo!')
      reset()  // Reset dopo il submit
    } else {
      console.log('Form non valido:', errors)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nome:
          <input
            type="text"
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            onBlur={() => setTouched('name')}  // Valida quando l'utente lascia il campo
            placeholder="Inserisci il nome"
          />
          {touched.name && errors.name && (
            <span style={{color: 'red', display: 'block'}}>{errors.name}</span>
          )}
        </label>
      </div>
      
      <div>
        <label>
          Email:
          <input
            type="email"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            onBlur={() => setTouched('email')}
            placeholder="esempio@email.com"
          />
          {touched.email && errors.email && (
            <span style={{color: 'red', display: 'block'}}>{errors.email}</span>
          )}
        </label>
      </div>
      
      <div>
        <label>
          Età:
          <input
            type="number"
            value={values.age}
            onChange={(e) => setValue('age', e.target.value)}
            onBlur={() => setTouched('age')}
            placeholder="18"
          />
          {touched.age && errors.age && (
            <span style={{color: 'red', display: 'block'}}>{errors.age}</span>
          )}
        </label>
      </div>
      
      <button type="submit" disabled={!isValid}>
        Invia
      </button>
      
      <button type="button" onClick={reset}>
        Reset
      </button>
    </form>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Validazione manuale dispersa nel componente
function BadForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  
  // ❌ ERRORE: Logica di validazione duplicata e difficile da mantenere
  const handleNameChange = (value: string) => {
    setName(value)
    if (!value) {
      setNameError('Il nome è richiesto')
    } else if (value.length < 2) {
      setNameError('Minimo 2 caratteri')
    } else {
      setNameError('')
    }
  }
  
  // Con useFormValidation, tutta questa logica è centralizzata!
}
```

**Note Importanti:**
- La validazione avviene solo dopo che un campo è stato "toccato" (onBlur), migliorando l'UX
- Usa `validateAll()` solo al submit per forzare la validazione di tutti i campi
- Le regole di validazione possono essere composte: un campo può avere required, pattern e custom insieme
- Il hook è completamente riutilizzabile per qualsiasi form della tua applicazione
- La funzione `custom` può restituire un messaggio di errore (string) o un booleano (true = valido, false = errore generico)

### 3. Ottimizzazione delle Performance

#### Pattern 5: Memoizzazione con useMemo e useCallback

Il pattern di **memoizzazione** consiste nell'utilizzare `useMemo` e `useCallback` per ottimizzare le performance delle applicazioni React, evitando calcoli e creazioni di funzioni non necessarie ad ogni render.

**Scopo e Vantaggi:**
1. **Ottimizzazione performance**: Evita calcoli costosi ad ogni render quando le dipendenze non cambiano
2. **Stabilità delle referenze**: `useCallback` mantiene la stessa referenza di funzione tra i render
3. **Prevenzione re-render**: Evita re-render non necessari di componenti figli
4. **Caching intelligente**: React memorizza i risultati e li riutilizza finché le dipendenze non cambiano
5. **Miglioramento UX**: Riduce lag e migliora la reattività dell'applicazione

**Quando Usare useMemo:**
- Per calcoli costosi (filtri, sort, trasformazioni di grandi array)
- Per creare oggetti/array che vengono passati come props (evita re-render)
- Quando il calcolo ha dipendenze specifiche che cambiano raramente

**Quando Usare useCallback:**
- Per funzioni passate come props a componenti memoizzati (React.memo)
- Per funzioni usate come dipendenze in altri hook (useEffect, useMemo)
- Per event handlers che vengono passati a molti componenti figli

**Esempio Pratico Completo:**

```tsx
import { useState, useMemo, useCallback, memo } from 'react'

interface Item {
  id: number
  name: string
  value: number
  category: string
}

interface ExpensiveComponentProps {
  items: Item[]
  filter: string
  onItemClick: (item: Item) => void
}

// ✅ Componente memoizzato per evitare re-render non necessari
// Si ri-renderizza solo se items, filter o onItemClick cambiano
const ExpensiveComponent = memo(function ExpensiveComponent({ 
  items, 
  filter, 
  onItemClick 
}: ExpensiveComponentProps) {
  
  // ✅ useMemo: Memoizza calcoli costosi
  // Il filtro viene riapplicato SOLO quando cambiano items o filter
  const filteredItems = useMemo(() => {
    console.log('🔍 Filtro applicato - questo log appare solo quando items o filter cambiano')
    
    if (!filter.trim()) return items
    
    const lowerFilter = filter.toLowerCase()
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerFilter) ||
      item.category.toLowerCase().includes(lowerFilter)
    )
  }, [items, filter])  // Dipendenze: ri-calcola solo se questi cambiano
  
  // ✅ useMemo: Memoizza oggetti complessi (statistiche)
  // Questo oggetto viene ricreato SOLO quando filteredItems cambia
  const itemStats = useMemo(() => {
    console.log('📊 Calcolo statistiche')
    
    if (filteredItems.length === 0) {
      return { total: 0, average: 0, max: 0, min: 0 }
    }
    
    const values = filteredItems.map(item => item.value)
    return {
      total: filteredItems.length,
      average: values.reduce((sum, val) => sum + val, 0) / filteredItems.length,
      max: Math.max(...values),
      min: Math.min(...values)
    }
  }, [filteredItems])  // Dipende da filteredItems
  
  // ✅ useCallback: Memoizza la funzione handler
  // Mantiene la stessa referenza tra i render, evitando re-render dei figli
  const handleItemClick = useCallback((item: Item) => {
    console.log('Clicked:', item.name)
    onItemClick(item)
  }, [onItemClick])  // Dipende da onItemClick
  
  console.log('🎨 Render di ExpensiveComponent')
  
  return (
    <div>
      <h3>Statistiche: {itemStats.total} elementi</h3>
      <p>Media: {itemStats.average.toFixed(2)}</p>
      <p>Max: {itemStats.max}, Min: {itemStats.min}</p>
      
      <ul>
        {filteredItems.map(item => (
          <ListItem 
            key={item.id} 
            item={item} 
            onClick={handleItemClick} 
          />
        ))}
      </ul>
    </div>
  )
})

// ✅ Componente memoizzato per gli item della lista
interface ListItemProps {
  item: Item
  onClick: (item: Item) => void
}

const ListItem = memo(function ListItem({ item, onClick }: ListItemProps) {
  console.log(`📝 Render di ListItem ${item.id}`)
  
  return (
    <li onClick={() => onClick(item)} style={{ cursor: 'pointer', padding: '8px' }}>
      {item.name} - €{item.value.toFixed(2)} [{item.category}]
    </li>
  )
})

// ✅ Componente principale che usa la memoizzazione
function ItemList() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Prodotto A', value: 100, category: 'Elettronica' },
    { id: 2, name: 'Prodotto B', value: 200, category: 'Abbigliamento' },
    { id: 3, name: 'Prodotto C', value: 150, category: 'Elettronica' },
    { id: 4, name: 'Prodotto D', value: 300, category: 'Casa' },
  ])
  const [filter, setFilter] = useState<string>('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [counter, setCounter] = useState<number>(0)
  
  // ✅ useCallback: Memoizza la funzione per evitare re-render di ExpensiveComponent
  // Se non usassi useCallback, ogni volta che counter cambia, anche onItemClick cambierebbe
  // causando un re-render di ExpensiveComponent anche se items e filter non sono cambiati
  const handleItemClick = useCallback((item: Item) => {
    setSelectedItem(item)
    alert(`Hai selezionato: ${item.name}`)
  }, [])  // Nessuna dipendenza: la funzione è sempre la stessa
  
  // ✅ useMemo: Memoizza il valore derivato
  const filteredItemsCount = useMemo(() => {
    if (!filter.trim()) return items.length
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    ).length
  }, [items, filter])
  
  return (
    <div>
      <div>
        <h2>Lista Prodotti</h2>
        
        {/* Contatore per dimostrare che il cambio di stato non causa re-render non necessari */}
        <div>
          <p>Counter: {counter}</p>
          <button onClick={() => setCounter(c => c + 1)}>
            Incrementa Counter (non causa re-render di ExpensiveComponent grazie a useCallback)
          </button>
        </div>
        
        {/* Input per il filtro */}
        <div>
          <label>
            Filtra prodotti:
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Cerca per nome o categoria..."
            />
          </label>
          <p>Risultati trovati: {filteredItemsCount}</p>
        </div>
        
        {/* Pulsante per aggiungere un nuovo item (per testare la memoizzazione) */}
        <button onClick={() => {
          setItems(prev => [...prev, {
            id: prev.length + 1,
            name: `Prodotto ${String.fromCharCode(65 + prev.length)}`,
            value: Math.floor(Math.random() * 500),
            category: ['Elettronica', 'Abbigliamento', 'Casa'][Math.floor(Math.random() * 3)]
          }])
        }}>
          Aggiungi Prodotto
        </button>
      </div>
      
      {/* Componente memoizzato: si ri-renderizza solo se items, filter o handleItemClick cambiano */}
      <ExpensiveComponent 
        items={items}
        filter={filter}
        onItemClick={handleItemClick}
      />
      
      {selectedItem && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h3>Item Selezionato:</h3>
          <p>{selectedItem.name} - €{selectedItem.value.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Non memoizzare quando necessario
function BadComponent({ items, filter }: { items: Item[], filter: string }) {
  // ❌ ERRORE: Calcolo costoso ad ogni render, anche se items e filter non sono cambiati
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  // ❌ ERRORE: Nuova funzione creata ad ogni render
  // Se questa viene passata a un componente memoizzato, causerà re-render non necessari
  const handleClick = (item: Item) => {
    console.log(item)
  }
  
  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}

// ✅ CORRETTO: Usa useMemo e useCallback quando necessario
function GoodComponent({ items, filter }: { items: Item[], filter: string }) {
  const filteredItems = useMemo(() => 
    items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  )
  
  const handleClick = useCallback((item: Item) => {
    console.log(item)
  }, [])
  
  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

**Note Importanti:**
- **Non abusare di useMemo/useCallback**: Usali solo quando c'è un vero problema di performance
- **Dipendenze corrette**: Assicurati di includere tutte le dipendenze nell'array, altrimenti otterrai bug difficili da debuggare
- **useMemo per valori**: Usa `useMemo` per calcoli e oggetti costosi
- **useCallback per funzioni**: Usa `useCallback` per funzioni che vengono passate come props
- **Misura prima di ottimizzare**: Usa React DevTools Profiler per identificare i veri colli di bottiglia
- La memoizzazione ha un costo: React deve controllare le dipendenze ad ogni render. Usala solo quando il beneficio supera il costo

#### Pattern 6: Stato Ottimizzato per Liste

Il pattern di **stato ottimizzato per liste** consiste nell'utilizzare strutture dati efficienti (come `Set` per lookup veloci) e tecniche di memoizzazione per gestire liste grandi con operazioni frequenti come selezione multipla, ordinamento e filtraggio.

**Scopo e Vantaggi:**
1. **Performance con liste grandi**: Usa `Set` invece di array per lookup O(1) invece di O(n)
2. **Memoizzazione intelligente**: Evita ricalcoli di sorting e filtraggio quando non necessario
3. **Selezione multipla efficiente**: Gestisce migliaia di item selezionati senza problemi di performance
4. **Scalabilità**: Pattern che funziona bene anche con migliaia di elementi
5. **UX migliorata**: Interazioni fluide anche con liste molto grandi

**Quando Usare questo Pattern:**
- Quando hai liste con molti elementi (100+)
- Quando hai bisogno di selezione multipla
- Quando hai operazioni frequenti di ordinamento/filtraggio
- Quando le performance sono critiche per l'esperienza utente

**Esempio Pratico Completo:**

```tsx
import { useState, useMemo, useCallback, memo } from 'react'

interface ListItem {
  id: number
  name: string
  date: string
  value: number
  category: string
}

interface ListItemProps {
  item: ListItem
  isSelected: boolean
  onToggle: (id: number) => void
}

// ✅ Componente memoizzato per evitare re-render non necessari
const ListItemComponent = memo(function ListItem({ item, isSelected, onToggle }: ListItemProps) {
  return (
    <div
      onClick={() => onToggle(item.id)}
      style={{
        padding: '10px',
        margin: '5px',
        backgroundColor: isSelected ? '#4CAF50' : '#f0f0f0',
        color: isSelected ? 'white' : 'black',
        cursor: 'pointer',
        borderRadius: '4px',
        border: `2px solid ${isSelected ? '#45a049' : '#ddd'}`
      }}
    >
      <div><strong>{item.name}</strong></div>
      <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
        {item.date} | €{item.value.toFixed(2)} | {item.category}
      </div>
    </div>
  )
})

function OptimizedList() {
  // ✅ STATO SORGENTE: lista degli item
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, name: 'Item A', date: '2024-01-15', value: 100, category: 'Categoria 1' },
    { id: 2, name: 'Item B', date: '2024-01-20', value: 200, category: 'Categoria 2' },
    { id: 3, name: 'Item C', date: '2024-01-10', value: 150, category: 'Categoria 1' },
    { id: 4, name: 'Item D', date: '2024-01-25', value: 300, category: 'Categoria 3' },
  ])
  
  // ✅ OTTIMIZZAZIONE: Usa Set invece di array per lookup O(1)
  // Un Set permette di verificare se un elemento esiste in tempo costante O(1)
  // invece di O(n) con un array.includes()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  
  // Stato per l'ordinamento
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'value'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // Stato per il filtro
  const [filterCategory, setFilterCategory] = useState<string>('all')
  
  // ✅ OTTIMIZZAZIONE: useCallback per funzione di lookup
  // Questa funzione è memoizzata e mantiene la stessa referenza tra i render
  const isSelected = useCallback((id: number): boolean => {
    return selectedIds.has(id)  // O(1) lookup con Set
  }, [selectedIds])
  
  // ✅ OTTIMIZZAZIONE: Memoizzazione del filtro
  // Il filtro viene riapplicato SOLO quando cambiano items o filterCategory
  const filteredItems = useMemo(() => {
    if (filterCategory === 'all') return items
    
    return items.filter(item => item.category === filterCategory)
  }, [items, filterCategory])
  
  // ✅ OTTIMIZZAZIONE: Memoizzazione del sorting
  // Il sorting viene riapplicato SOLO quando cambiano filteredItems, sortBy o sortOrder
  const sortedItems = useMemo(() => {
    console.log('🔄 Sorting applicato')
    
    return [...filteredItems].sort((a, b) => {
      let aVal: any = a[sortBy]
      let bVal: any = b[sortBy]
      
      // Gestione speciale per date
      if (sortBy === 'date') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }
      
      // Confronto
      let comparison = 0
      if (aVal < bVal) comparison = -1
      else if (aVal > bVal) comparison = 1
      
      // Applica l'ordine (asc o desc)
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredItems, sortBy, sortOrder])
  
  // ✅ OTTIMIZZAZIONE: Toggle con Set immutabile
  // Crea un nuovo Set invece di modificare quello esistente (immutabilità)
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
  
  // ✅ OTTIMIZZAZIONE: Selezione multipla efficiente
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(filteredItems.map(item => item.id)))
  }, [filteredItems])
  
  const selectNone = useCallback(() => {
    setSelectedIds(new Set())
  }, [])
  
  // ✅ Funzione per aggiungere un nuovo item (per test)
  const addRandomItem = useCallback(() => {
    const newId = Math.max(...items.map(i => i.id), 0) + 1
    const categories = ['Categoria 1', 'Categoria 2', 'Categoria 3']
    const newItem: ListItem = {
      id: newId,
      name: `Item ${String.fromCharCode(64 + newId)}`,
      date: new Date().toISOString().split('T')[0],
      value: Math.floor(Math.random() * 500),
      category: categories[Math.floor(Math.random() * categories.length)]
    }
    setItems(prev => [...prev, newItem])
  }, [items])
  
  // ✅ Valori derivati
  const selectedCount = selectedIds.size
  const totalValue = useMemo(() => {
    return sortedItems
      .filter(item => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.value, 0)
  }, [sortedItems, selectedIds])
  
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category)))
  }, [items])
  
  return (
    <div>
      <h2>Lista Ottimizzata</h2>
      
      {/* Statistiche */}
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e3f2fd' }}>
        <p>Item totali: {items.length}</p>
        <p>Item selezionati: {selectedCount}</p>
        <p>Valore totale selezionato: €{totalValue.toFixed(2)}</p>
      </div>
      
      {/* Controlli */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={selectAll}>Seleziona Tutti</button>
        <button onClick={selectNone}>Deseleziona Tutti</button>
        <button onClick={addRandomItem}>Aggiungi Item</button>
      </div>
      
      {/* Filtro per categoria */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          Filtra per categoria:
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tutte</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>
      
      {/* Ordinamento */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          Ordina per:
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'value')}
          >
            <option value="name">Nome</option>
            <option value="date">Data</option>
            <option value="value">Valore</option>
          </select>
        </label>
        <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑ Crescente' : '↓ Decrescente'}
        </button>
      </div>
      
      {/* Lista degli item */}
      <div>
        {sortedItems.length === 0 ? (
          <p>Nessun item trovato</p>
        ) : (
          sortedItems.map(item => (
            <ListItemComponent
              key={item.id}
              item={item}
              isSelected={isSelected(item.id)}
              onToggle={toggleSelection}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Array per selezione multipla (lento con molti item)
function BadList() {
  const [items, setItems] = useState<ListItem[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])  // ❌ Array invece di Set
  
  // ❌ ERRORE: Lookup O(n) invece di O(1)
  const isSelected = (id: number) => selectedIds.includes(id)
  
  // ❌ ERRORE: Sorting ad ogni render senza memoizzazione
  const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name))
  
  // ❌ ERRORE: Operazioni inefficienti sull'array
  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id)  // Crea nuovo array ad ogni toggle
      } else {
        return [...prev, id]  // Crea nuovo array ad ogni toggle
      }
    })
  }
  
  return (
    <div>
      {sortedItems.map(item => (
        <div onClick={() => toggleSelection(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}

// ✅ CORRETTO: Set per selezione multipla efficiente
// Con Set, anche con 10.000 item, le operazioni sono istantanee
```

**Note Importanti:**
- **Usa Set per lookup**: Quando devi verificare se un elemento esiste, usa `Set` invece di `Array.includes()` per performance O(1) vs O(n)
- **Memoizza sorting/filtri**: Usa `useMemo` per evitare di riordinare/filtrare ad ogni render
- **Immutabilità con Set**: Crea sempre un nuovo Set invece di modificare quello esistente
- **useCallback per funzioni**: Memoizza le funzioni passate ai componenti figli per evitare re-render
- **Componenti memoizzati**: Usa `React.memo` per componenti di lista che non cambiano spesso
- Con liste piccole (< 50 item), la differenza è minima, ma con liste grandi diventa critica

### 4. Gestione di Stati Asincroni

#### Pattern 7: Stato per Operazioni Asincrone

Il pattern di **stato asincrono** consiste nel creare un hook personalizzato che gestisce lo stato di operazioni asincrone (come chiamate API), includendo gestione di loading, errori e dati. Questo pattern centralizza la logica asincrona e migliora la gestione degli stati di caricamento e errore.

**Scopo e Vantaggi:**
1. **Gestione centralizzata**: Tutto lo stato asincrono (loading, error, data) è in un unico posto
2. **Riutilizzabilità**: L'hook può essere usato per qualsiasi operazione asincrona
3. **Type safety**: TypeScript garantisce che i tipi di dati siano corretti
4. **Gestione errori**: Gestione automatica e consistente degli errori
5. **Pattern consistente**: Stesso pattern per tutte le operazioni asincrone nell'app
6. **Reset facile**: Possibilità di resettare lo stato quando necessario

**Quando Usare questo Pattern:**
- Quando hai chiamate API o operazioni asincrone
- Quando vuoi gestire loading e errori in modo consistente
- Quando vuoi riutilizzare la logica asincrona in più componenti
- Quando vuoi separare la logica asincrona dalla UI

**Esempio Pratico Completo:**

```tsx
import { useState, useCallback } from 'react'

// ✅ Interfaccia per lo stato asincrono generico
interface AsyncState<T> {
  data: T | null        // Dati risultanti dall'operazione asincrona
  loading: boolean     // True durante l'esecuzione dell'operazione
  error: string | null // Messaggio di errore se l'operazione fallisce
}

// ✅ Hook personalizzato per gestire operazioni asincrone
function useAsyncState<T>(initialState: T | null = null) {
  // Stato unificato per tutte le informazioni asincrone
  const [state, setState] = useState<AsyncState<T>>({
    data: initialState,
    loading: false,
    error: null
  })
  
  // ✅ Funzione per eseguire un'operazione asincrona
  // Gestisce automaticamente loading, successo ed errori
  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    // Imposta loading a true e pulisce eventuali errori precedenti
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Esegue la funzione asincrona
      const result = await asyncFunction()
      
      // Successo: salva i dati e imposta loading a false
      setState({
        data: result,
        loading: false,
        error: null
      })
      
      return result
    } catch (error) {
      // Errore: estrae il messaggio di errore e lo salva nello stato
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Errore sconosciuto'
      
      setState({
        data: null,
        loading: false,
        error: errorMessage
      })
      
      // Rilancia l'errore per permettere gestione aggiuntiva se necessario
      throw error
    }
  }, [])
  
  // ✅ Funzione per resettare lo stato ai valori iniziali
  const reset = useCallback(() => {
    setState({
      data: initialState,
      loading: false,
      error: null
    })
  }, [initialState])
  
  return {
    ...state,   // Spread per esporre data, loading, error direttamente
    execute,    // Funzione per eseguire operazioni asincrone
    reset       // Funzione per resettare lo stato
  }
}

// ✅ Esempio di utilizzo: Fetch di dati da API
interface DataItem {
  id: number
  name: string
  email: string
}

function DataFetcher() {
  // Usa l'hook con tipo generico per i dati
  const { data, loading, error, execute, reset } = useAsyncState<DataItem[]>([])
  
  // ✅ Funzione per recuperare i dati
  const fetchData = useCallback(() => {
    execute(async () => {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`)
      }
      return response.json() as Promise<DataItem[]>
    })
  }, [execute])
  
  // ✅ Funzione per aggiungere un nuovo utente
  const addUser = useCallback(async (name: string, email: string) => {
    execute(async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })
      if (!response.ok) {
        throw new Error('Errore nella creazione dell\'utente')
      }
      // Dopo la creazione, ricarica i dati
      const usersResponse = await fetch('/api/users')
      if (!usersResponse.ok) throw new Error('Errore nel ricaricamento')
      return usersResponse.json() as Promise<DataItem[]>
    })
  }, [execute])
  
  return (
    <div>
      <h2>Gestione Dati Utenti</h2>
      
      {/* Controlli */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={fetchData} 
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Caricamento...' : 'Carica Dati'}
        </button>
        
        <button 
          onClick={reset}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Reset
        </button>
      </div>
      
      {/* Messaggio di errore */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Errore:</strong> {error}
        </div>
      )}
      
      {/* Indicatore di caricamento */}
      {loading && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          ⏳ Caricamento in corso...
        </div>
      )}
      
      {/* Lista dei dati */}
      {data && data.length > 0 && (
        <div>
          <h3>Dati caricati ({data.length} elementi):</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.map(item => (
              <li 
                key={item.id} 
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px'
                }}
              >
                <strong>{item.name}</strong> - {item.email}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Messaggio quando non ci sono dati */}
      {data && data.length === 0 && !loading && (
        <p style={{ color: '#666' }}>Nessun dato disponibile</p>
      )}
    </div>
  )
}

// ✅ Esempio avanzato: Form con salvataggio asincrono
interface UserFormData {
  name: string
  email: string
}

function UserForm() {
  const [formData, setFormData] = useState<UserFormData>({ name: '', email: '' })
  
  // Hook per il salvataggio dei dati
  const { data, loading, error, execute, reset } = useAsyncState<UserFormData | null>(null)
  
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    await execute(async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Errore nel salvataggio')
      }
      
      return formData
    })
    
    // Reset del form dopo il salvataggio riuscito
    if (!error) {
      setFormData({ name: '', email: '' })
    }
  }, [formData, execute, error])
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nome:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={loading}
          />
        </label>
      </div>
      
      <div>
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={loading}
          />
        </label>
      </div>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Salvataggio...' : 'Salva'}
      </button>
      
      {data && (
        <div style={{color: 'green', marginTop: '10px'}}>
          ✓ Dati salvati con successo!
        </div>
      )}
    </form>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Gestione manuale dispersa dello stato asincrono
function BadDataFetcher() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // ❌ ERRORE: Logica duplicata e difficile da mantenere
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/data')
      const result = await response.json()
      setData(result)
      setLoading(false)
    } catch (err) {
      setError('Errore')
      setLoading(false)
    }
  }
  
  // Con useAsyncState, tutta questa logica è centralizzata!
}
```

**Note Importanti:**
- L'hook è completamente generico: può essere usato con qualsiasi tipo di dati (`useAsyncState<User[]>`, `useAsyncState<Product>`, ecc.)
- Gestione automatica degli errori: cattura e formatta automaticamente gli errori
- Reset disponibile: puoi resettare lo stato quando necessario (es. dopo logout)
- Rilancia errori: `execute` rilancia l'errore, permettendo gestione aggiuntiva con try/catch se necessario
- Loading state: Il loading viene gestito automaticamente durante l'esecuzione
- Pattern riutilizzabile: Usa lo stesso hook per tutte le operazioni asincrone dell'app

#### Pattern 8: Stato con Cache e Debouncing

> 💡 **Nota**: Pattern avanzati come debouncing e caching richiedono l'uso di `useEffect` per gestire side effects come timer e sottoscrizioni. Questi pattern verranno approfonditi nella Lezione 12 dopo aver imparato `useEffect`. Per ora, concentrati sui pattern di gestione stato con `useState`.

### 5. Pattern di Stato Immutabile

#### Pattern 9: Utility per Immutabilità

Il pattern di **utility per immutabilità** consiste nel creare funzioni helper che semplificano gli aggiornamenti immutabili di oggetti nidificati e array complessi. Questo pattern riduce il boilerplate e previene errori comuni quando si lavora con stati profondamente nidificati.

**Scopo e Vantaggi:**
1. **Semplificazione**: Riduce il codice boilerplate per aggiornamenti immutabili complessi
2. **Prevenzione errori**: Evita errori comuni quando si lavora con oggetti nidificati
3. **Leggibilità**: Codice più chiaro e facile da comprendere
4. **Riutilizzabilità**: Funzioni utility che possono essere usate ovunque
5. **Type safety**: Con TypeScript, le utility possono essere tipizzate correttamente
6. **Manutenibilità**: Pattern consistente per tutti gli aggiornamenti immutabili

**Quando Usare questo Pattern:**
- Quando hai oggetti di stato profondamente nidificati
- Quando devi fare molti aggiornamenti immutabili
- Quando vuoi semplificare il codice di aggiornamento dello stato
- Quando vuoi evitare errori comuni con l'immutabilità

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ Utility functions per aggiornamenti immutabili
const updateState = {
  // ✅ Aggiorna un campo in un oggetto usando path in dot notation (es. 'user.profile.name')
  // Questa funzione crea una copia immutabile dell'oggetto modificando solo il campo specificato
  object: <T extends Record<string, any>>(obj: T, path: string, value: any): T => {
    const keys = path.split('.')  // Divide il path in chiavi: 'user.profile.name' -> ['user', 'profile', 'name']
    const result = { ...obj }      // Crea una copia superficiale dell'oggetto root
    let current: any = result      // Puntatore che si muove lungo il path
    
    // Crea copie immutabili di tutti gli oggetti intermedi nel path
    // Esempio: se path = 'user.profile.name', crea copie di 'user' e 'user.profile'
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }  // Copia immutabile dell'oggetto corrente
      current = current[keys[i]]                    // Sposta il puntatore al livello successivo
    }
    
    // Imposta il valore finale nel campo specificato
    current[keys[keys.length - 1]] = value
    
    return result  // Restituisce il nuovo oggetto immutabile
  },
  
  // ✅ Operazioni immutabili su array
  array: {
    // Aggiunge un elemento alla fine dell'array
    add: <T>(arr: T[], item: T): T[] => [...arr, item],
    
    // Inserisce un elemento in una posizione specifica
    insert: <T>(arr: T[], index: number, item: T): T[] => [
      ...arr.slice(0, index),  // Elementi prima dell'indice
      item,                     // Nuovo elemento
      ...arr.slice(index)       // Elementi dall'indice in poi
    ],
    
    // Rimuove un elemento all'indice specificato
    remove: <T>(arr: T[], index: number): T[] => [
      ...arr.slice(0, index),      // Elementi prima dell'indice
      ...arr.slice(index + 1)      // Elementi dopo l'indice (salta quello da rimuovere)
    ],
    
    // Aggiorna un elemento all'indice specificato
    update: <T>(arr: T[], index: number, item: T): T[] => [
      ...arr.slice(0, index),  // Elementi prima dell'indice
      item,                     // Elemento aggiornato
      ...arr.slice(index + 1)   // Elementi dopo l'indice
    ],
    
    // Sposta un elemento da un indice all'altro
    move: <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
      const result = [...arr]
      const [item] = result.splice(fromIndex, 1)  // Rimuove l'elemento dalla posizione originale
      result.splice(toIndex, 0, item)              // Lo inserisce nella nuova posizione
      return result
    },
    
    // Trova e aggiorna un elemento in base a una condizione
    updateWhere: <T>(arr: T[], predicate: (item: T) => boolean, updater: (item: T) => T): T[] => {
      return arr.map(item => predicate(item) ? updater(item) : item)
    },
    
    // Trova e rimuove un elemento in base a una condizione
    removeWhere: <T>(arr: T[], predicate: (item: T) => boolean): T[] => {
      return arr.filter(item => !predicate(item))
    }
  }
}

// ✅ Esempio di utilizzo con stato complesso
interface Item {
  id: number
  name: string
  price: number
}

interface ComplexState {
  user: {
    profile: {
      name: string
      email: string
      settings: {
        theme: string
        notifications: boolean
        language: string
      }
    }
  }
  items: Item[]
  filters: {
    category: string
    price: { min: number; max: number }
    search: string
  }
  metadata: {
    lastUpdated: Date | null
    version: number
  }
}

function ComplexStateExample() {
  const [state, setState] = useState<ComplexState>({
    user: {
      profile: {
        name: '',
        email: '',
        settings: {
          theme: 'light',
          notifications: true,
          language: 'it'
        }
      }
    },
    items: [],
    filters: {
      category: 'all',
      price: { min: 0, max: 1000 },
      search: ''
    },
    metadata: {
      lastUpdated: null,
      version: 1
    }
  })
  
  // ✅ Aggiorna campo profondamente nidificato usando dot notation
  const updateUserName = (name: string) => {
    setState(prev => updateState.object(prev, 'user.profile.name', name))
  }
  
  const updateEmail = (email: string) => {
    setState(prev => updateState.object(prev, 'user.profile.email', email))
  }
  
  // ✅ Aggiorna campo molto annidato
  const updateTheme = (theme: string) => {
    setState(prev => updateState.object(prev, 'user.profile.settings.theme', theme))
  }
  
  const toggleNotifications = () => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        profile: {
          ...prev.user.profile,
          settings: {
            ...prev.user.profile.settings,
            notifications: !prev.user.profile.settings.notifications
          }
        }
      }
    }))
    // Oppure, più semplice con updateState:
    // setState(prev => updateState.object(prev, 'user.profile.settings.notifications', !prev.user.profile.settings.notifications))
  }
  
  // ✅ Operazioni su array
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
  
  // ✅ Rimuove item per ID (più utile della rimozione per indice)
  const removeItemById = (id: number) => {
    setState(prev => ({
      ...prev,
      items: updateState.array.removeWhere(prev.items, item => item.id === id)
    }))
  }
  
  // ✅ Aggiorna un item specifico
  const updateItem = (id: number, updates: Partial<Item>) => {
    setState(prev => ({
      ...prev,
      items: updateState.array.updateWhere(
        prev.items,
        item => item.id === id,
        item => ({ ...item, ...updates })
      )
    }))
  }
  
  // ✅ Sposta un item nella lista
  const moveItem = (fromIndex: number, toIndex: number) => {
    setState(prev => ({
      ...prev,
      items: updateState.array.move(prev.items, fromIndex, toIndex)
    }))
  }
  
  // ✅ Aggiorna oggetto annidato (non solo primitivi)
  const updatePriceFilter = (min: number, max: number) => {
    setState(prev => updateState.object(prev, 'filters.price', { min, max }))
  }
  
  // ✅ Aggiorna più campi contemporaneamente
  const updateFilters = (category: string, search: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        category,
        search
      }
    }))
  }
  
  // ✅ Aggiorna metadata
  const updateMetadata = () => {
    setState(prev => ({
      ...prev,
      metadata: {
        lastUpdated: new Date(),
        version: prev.metadata.version + 1
      }
    }))
  }
  
  return (
    <div>
      <h2>Gestione Stato Complesso</h2>
      
      <div>
        <h3>Profilo Utente</h3>
        <input
          type="text"
          value={state.user.profile.name}
          onChange={(e) => updateUserName(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="email"
          value={state.user.profile.email}
          onChange={(e) => updateEmail(e.target.value)}
          placeholder="Email"
        />
        <select
          value={state.user.profile.settings.theme}
          onChange={(e) => updateTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={state.user.profile.settings.notifications}
            onChange={toggleNotifications}
          />
          Notifiche
        </label>
      </div>
      
      <div>
        <h3>Items ({state.items.length})</h3>
        <button onClick={() => addItem({ id: Date.now(), name: 'Nuovo Item', price: 100 })}>
          Aggiungi Item
        </button>
        <ul>
          {state.items.map((item, index) => (
            <li key={item.id}>
              {item.name} - €{item.price.toFixed(2)}
              <button onClick={() => removeItemById(item.id)}>Rimuovi</button>
              <button onClick={() => moveItem(index, index - 1)} disabled={index === 0}>
                ↑
              </button>
              <button onClick={() => moveItem(index, index + 1)} disabled={index === state.items.length - 1}>
                ↓
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3>Filtri</h3>
        <input
          type="text"
          value={state.filters.search}
          onChange={(e) => updateFilters(state.filters.category, e.target.value)}
          placeholder="Cerca..."
        />
        <input
          type="number"
          value={state.filters.price.min}
          onChange={(e) => updatePriceFilter(Number(e.target.value), state.filters.price.max)}
          placeholder="Prezzo min"
        />
        <input
          type="number"
          value={state.filters.price.max}
          onChange={(e) => updatePriceFilter(state.filters.price.min, Number(e.target.value))}
          placeholder="Prezzo max"
        />
      </div>
      
      <div>
        <p>Ultimo aggiornamento: {state.metadata.lastUpdated?.toLocaleString() || 'Mai'}</p>
        <p>Versione: {state.metadata.version}</p>
        <button onClick={updateMetadata}>Aggiorna Metadata</button>
      </div>
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Mutazione diretta dello stato
function BadExample() {
  const [state, setState] = useState({ user: { profile: { name: '' } } })
  
  const updateName = (name: string) => {
    // ❌ ERRORE: Modifica direttamente lo stato (mutazione)
    state.user.profile.name = name
    setState(state)  // React non rileva il cambiamento!
    
    // ❌ ERRORE: Spread incompleto - perde altri campi
    setState({ user: { profile: { name } } })
    
    // ✅ CORRETTO: Copia immutabile completa
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        profile: {
          ...prev.user.profile,
          name
        }
      }
    }))
    
    // ✅ ANCORA MEGLIO: Usa updateState.object
    setState(prev => updateState.object(prev, 'user.profile.name', name))
  }
}
```

**Note Importanti:**
- **Immutabilità obbligatoria**: React richiede immutabilità per rilevare i cambiamenti. Le utility garantiscono che crei sempre nuovi oggetti
- **Dot notation**: Usa path come `'user.profile.name'` per aggiornare campi annidati senza dover fare spread manuali
- **Performance**: Le utility creano solo le copie necessarie lungo il path, non copiano tutto l'oggetto
- **Type safety**: Le utility possono essere tipizzate con TypeScript per sicurezza addizionale
- **Pattern consistente**: Usa le stesse utility in tutta l'applicazione per codice più manutenibile
- Per oggetti semplici senza nidificazione profonda, lo spread manuale va bene. Le utility sono utili per strutture complesse

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

