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
```jsx
// ✅ Buono: stato raggruppato per dati correlati
const [user, setUser] = useState({
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
});

// Aggiornamento specifico
const updateProfile = (updates) => {
  setUser(prev => ({
    ...prev,
    profile: { ...prev.profile, ...updates }
  }));
};
```

**Stato Separato (Consigliato per dati indipendenti):**
```jsx
// ✅ Buono: stato separato per dati indipendenti
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState([]);
const [filters, setFilters] = useState({});
```

#### Pattern 2: Stato Derivato e Calcolato

```jsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  
  // ✅ Stati derivati calcolati
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // ✅ Stati derivati condizionali
  const isEmpty = items.length === 0;
  const hasDiscount = discount > 0;
  const canCheckout = !isEmpty && total > 0;
  
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
  );
}
```

### 2. Gestione di Stati Complessi

#### Pattern 3: Reducer Pattern con useReducer

```jsx
import { useReducer } from 'react';

// Definizione delle azioni
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT'
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
      
    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
      
    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
      };
      
    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        discount: 0
      };
      
    case ACTIONS.APPLY_DISCOUNT:
      return {
        ...state,
        discount: action.payload
      };
      
    default:
      return state;
  }
}

function AdvancedCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0
  });
  
  const addItem = (item) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: item });
  };
  
  const removeItem = (id) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id });
  };
  
  const updateQuantity = (id, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };
  
  const applyDiscount = (discount) => {
    dispatch({ type: ACTIONS.APPLY_DISCOUNT, payload: discount });
  };
  
  // Stati derivati
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal * (1 - state.discount / 100);
  
  return (
    <div>
      {/* Implementazione del componente */}
    </div>
  );
}
```

#### Pattern 4: Stato con Validazione Avanzata

```jsx
function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';
    
    if (rule.required && (!value || value.trim() === '')) {
      return rule.required;
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      return rule.minLength;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.pattern;
    }
    
    if (rule.custom && !rule.custom(value)) {
      return rule.custom;
    }
    
    return '';
  };
  
  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validazione in tempo reale
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  
  const setTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  const isValid = Object.keys(errors).length === 0 && 
                  Object.keys(validationRules).every(name => values[name]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid
  };
}

// Utilizzo
const validationRules = {
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
    custom: (value) => value >= 18 ? '' : 'Devi essere maggiorenne'
  }
};

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
  } = useFormValidation(
    { name: '', email: '', age: '' },
    validationRules
  );
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      console.log('Form valido:', values);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Implementazione del form */}
    </form>
  );
}
```

### 3. Ottimizzazione delle Performance

#### Pattern 5: Memoizzazione con useMemo e useCallback

```jsx
import { useState, useMemo, useCallback } from 'react';

function ExpensiveComponent({ items, filter, onItemClick }) {
  // ✅ Memoizzazione di calcoli costosi
  const filteredItems = useMemo(() => {
    console.log('Filtro applicato');
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // ✅ Memoizzazione di funzioni
  const handleItemClick = useCallback((item) => {
    onItemClick(item);
  }, [onItemClick]);
  
  // ✅ Memoizzazione di oggetti complessi
  const itemStats = useMemo(() => {
    return {
      total: filteredItems.length,
      average: filteredItems.reduce((sum, item) => sum + item.value, 0) / filteredItems.length,
      max: Math.max(...filteredItems.map(item => item.value)),
      min: Math.min(...filteredItems.map(item => item.value))
    };
  }, [filteredItems]);
  
  return (
    <div>
      <h3>Statistiche: {itemStats.total} elementi</h3>
      <p>Media: {itemStats.average.toFixed(2)}</p>
      <p>Max: {itemStats.max}, Min: {itemStats.min}</p>
      
      {filteredItems.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
}
```

#### Pattern 6: Stato Ottimizzato per Liste

```jsx
function OptimizedList() {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // ✅ Ottimizzazione: Set per lookup O(1)
  const isSelected = useCallback((id) => {
    return selectedIds.has(id);
  }, [selectedIds]);
  
  // ✅ Ottimizzazione: memoizzazione del sorting
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [items, sortBy, sortOrder]);
  
  // ✅ Ottimizzazione: toggle con Set
  const toggleSelection = useCallback((id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  
  // ✅ Ottimizzazione: selezione multipla
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, [items]);
  
  const selectNone = useCallback(() => {
    setSelectedIds(new Set());
  }, []);
  
  return (
    <div>
      <div>
        <button onClick={selectAll}>Seleziona Tutti</button>
        <button onClick={selectNone}>Deseleziona Tutti</button>
        <span>Selezionati: {selectedIds.size}</span>
      </div>
      
      <div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
  );
}
```

### 4. Gestione di Stati Asincroni

#### Pattern 7: Stato per Operazioni Asincrone

```jsx
function useAsyncState(initialState = null) {
  const [state, setState] = useState({
    data: initialState,
    loading: false,
    error: null
  });
  
  const execute = useCallback(async (asyncFunction) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({
        data: result,
        loading: false,
        error: null
      });
      return result;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error.message
      });
      throw error;
    }
  }, []);
  
  const reset = useCallback(() => {
    setState({
      data: initialState,
      loading: false,
      error: null
    });
  }, [initialState]);
  
  return {
    ...state,
    execute,
    reset
  };
}

// Utilizzo
function DataFetcher() {
  const { data, loading, error, execute, reset } = useAsyncState([]);
  
  const fetchData = useCallback(() => {
    execute(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Errore nel caricamento');
      return response.json();
    });
  }, [execute]);
  
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
  );
}
```

#### Pattern 8: Stato con Cache e Debouncing

```jsx
import { useState, useEffect, useRef, useCallback } from 'react';

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

function useSearchWithCache() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState(new Map());
  
  const debouncedQuery = useDebounce(query, 300);
  
  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    // Controlla la cache
    if (cache.has(searchQuery)) {
      setResults(cache.get(searchQuery));
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      // Salva nella cache
      setCache(prev => new Map(prev).set(searchQuery, data));
      setResults(data);
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);
  
  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);
  
  return {
    query,
    setQuery,
    results,
    loading
  };
}

function SearchComponent() {
  const { query, setQuery, results, loading } = useSearchWithCache();
  
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca..."
      />
      
      {loading && <div>Ricerca in corso...</div>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. Pattern di Stato Immutabile

#### Pattern 9: Utility per Immutabilità

```jsx
// Utility functions per aggiornamenti immutabili
const updateState = {
  // Aggiorna un campo in un oggetto
  object: (obj, path, value) => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  },
  
  // Aggiungi elemento a un array
  array: {
    add: (arr, item) => [...arr, item],
    insert: (arr, index, item) => [
      ...arr.slice(0, index),
      item,
      ...arr.slice(index)
    ],
    remove: (arr, index) => [
      ...arr.slice(0, index),
      ...arr.slice(index + 1)
    ],
    update: (arr, index, item) => [
      ...arr.slice(0, index),
      item,
      ...arr.slice(index + 1)
    ],
    move: (arr, fromIndex, toIndex) => {
      const result = [...arr];
      const [item] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, item);
      return result;
    }
  }
};

// Utilizzo
function ComplexStateExample() {
  const [state, setState] = useState({
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
  });
  
  const updateUserName = (name) => {
    setState(prev => updateState.object(prev, 'user.profile.name', name));
  };
  
  const updateTheme = (theme) => {
    setState(prev => updateState.object(prev, 'user.profile.settings.theme', theme));
  };
  
  const addItem = (item) => {
    setState(prev => ({
      ...prev,
      items: updateState.array.add(prev.items, item)
    }));
  };
  
  const removeItem = (index) => {
    setState(prev => ({
      ...prev,
      items: updateState.array.remove(prev.items, index)
    }));
  };
  
  const updatePriceFilter = (min, max) => {
    setState(prev => updateState.object(prev, 'filters.price', { min, max }));
  };
  
  return (
    <div>
      {/* Implementazione del componente */}
    </div>
  );
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
8. **Non usare useEffect** per calcoli derivati
9. **Non gestire stato globale** con useState locale
10. **Non ignorare ottimizzazioni** per liste grandi

## Esempi Pratici

### Esempio 1: Gestione Stato Avanzata per E-commerce
```jsx
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
  });
  
  // Stati derivati
  const filteredProducts = useMemo(() => {
    return state.products
      .filter(product => {
        if (state.filters.category !== 'all' && product.category !== state.filters.category) {
          return false;
        }
        if (product.price < state.filters.priceRange[0] || product.price > state.filters.priceRange[1]) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'price':
            return a.price - b.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [state.products, state.filters]);
  
  const cartTotal = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.cart]);
  
  const cartItemCount = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cart]);
  
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
  );
}
```

### Esempio 2: Form Avanzato con Validazione
```jsx
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
  } = useFormValidation(
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
        minLength: 'Minimo 2 caratteri'
      },
      'personalInfo.lastName': {
        required: 'Il cognome è richiesto',
        minLength: 'Minimo 2 caratteri'
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
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateAll()) {
      try {
        await submitUserData(values);
        reset();
        alert('Dati salvati con successo!');
      } catch (error) {
        console.error('Errore nel salvataggio:', error);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Informazioni Personali</legend>
        <div>
          <input
            type="text"
            value={values.personalInfo.firstName}
            onChange={(e) => setValue('personalInfo.firstName', e.target.value)}
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
  );
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
