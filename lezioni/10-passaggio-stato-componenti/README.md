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

```jsx
// Esempio base di flusso di dati
function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h2>Parent: {count}</h2>
      <Child 
        count={count} 
        onIncrement={() => setCount(count + 1)} 
      />
    </div>
  );
}

function Child({ count, onIncrement }) {
  return (
    <div>
      <p>Child: {count}</p>
      <button onClick={onIncrement}>Incrementa</button>
    </div>
  );
}
```

### 2. Pattern "Lifting State Up"

Il "lifting state up" è il processo di spostare lo stato da un componente figlio a un componente padre per condividerlo con altri componenti.

#### Quando Usare il Lifting State Up:
- Quando più componenti hanno bisogno dello stesso stato
- Quando un componente figlio deve comunicare con un fratello
- Quando lo stato deve essere sincronizzato tra componenti

#### Esempio di Lifting State Up:

```jsx
// ❌ Stato nel componente figlio (non condivisibile)
function TemperatureInput() {
  const [temperature, setTemperature] = useState('');
  
  return (
    <input
      value={temperature}
      onChange={(e) => setTemperature(e.target.value)}
      placeholder="Temperatura"
    />
  );
}

// ✅ Stato sollevato al componente padre
function TemperatureConverter() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  
  const handleCelsiusChange = (value) => {
    setCelsius(value);
    setFahrenheit(value ? (value * 9/5 + 32).toFixed(2) : '');
  };
  
  const handleFahrenheitChange = (value) => {
    setFahrenheit(value);
    setCelsius(value ? ((value - 32) * 5/9).toFixed(2) : '');
  };
  
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
  );
}

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Temperatura in {scale === 'celsius' ? 'Celsius' : 'Fahrenheit'}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}
```

### 3. Comunicazione Padre-Figlio

#### Pattern 1: Props e Callback

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} />
    </div>
  );
}

function TodoForm({ onAddTodo }) {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text);
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nuovo todo..."
      />
      <button type="submit">Aggiungi</button>
    </form>
  );
}

function TodoFilter({ filter, onFilterChange }) {
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
  );
}

function TodoList({ todos, onToggleTodo }) {
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
  );
}

function TodoItem({ todo, onToggle }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
      }}>
        {todo.text}
      </span>
    </li>
  );
}
```

#### Pattern 2: Render Props

```jsx
function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return children({
    data,
    loading,
    error,
    fetchData
  });
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
  );
}
```

### 4. Comunicazione tra Componenti Fratelli

#### Pattern 1: Stato Condiviso nel Padre

```jsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  const addItem = (item) => {
    setItems(prev => [...prev, item]);
  };
  
  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <div>
      <Header 
        itemCount={items.length}
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
  );
}

function Header({ itemCount, onCartToggle }) {
  return (
    <header>
      <h1>Shop</h1>
      <button onClick={onCartToggle}>
        Carrello ({itemCount})
      </button>
    </header>
  );
}

function ProductList({ onAddItem }) {
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Tastiera', price: 79 }
  ];
  
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
  );
}

function CartSidebar({ isOpen, items, onRemoveItem, onClearCart, onClose }) {
  if (!isOpen) return null;
  
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
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Carrello</h2>
        <button onClick={onClose}>✕</button>
      </div>
      
      {items.length === 0 ? (
        <p>Il carrello è vuoto</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <button onClick={() => onRemoveItem(item.id)}>Rimuovi</button>
            </div>
          ))}
          <button onClick={onClearCart}>Svuota Carrello</button>
        </>
      )}
    </div>
  );
}
```

#### Pattern 2: Context API per Stato Globale

```jsx
import { createContext, useContext, useState } from 'react';

// Creazione del Context
const AppContext = createContext();

// Provider del Context
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  
  const login = (userData) => {
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const addNotification = (message) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message,
      timestamp: new Date()
    }]);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const value = {
    user,
    theme,
    notifications,
    login,
    logout,
    toggleTheme,
    addNotification,
    removeNotification
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizzato per usare il Context
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve essere usato dentro AppProvider');
  }
  return context;
}

// Componenti che usano il Context
function Header() {
  const { user, theme, toggleTheme, notifications } = useApp();
  
  return (
    <header style={{ backgroundColor: theme === 'light' ? '#fff' : '#333' }}>
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
  );
}

function LoginForm() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: username, id: Date.now() });
    setUsername('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button type="submit">Login</button>
    </form>
  );
}

function NotificationCenter() {
  const { notifications, removeNotification } = useApp();
  
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
  );
}

function App() {
  return (
    <AppProvider>
      <Header />
      <LoginForm />
      <NotificationCenter />
    </AppProvider>
  );
}
```

### 5. Pattern di Comunicazione Avanzati

#### Pattern 1: Event Bus (per componenti distanti)

```jsx
// Event Bus semplice
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

const eventBus = new EventBus();

// Hook per usare l'Event Bus
function useEventBus() {
  const [events, setEvents] = useState({});
  
  const subscribe = useCallback((event, callback) => {
    eventBus.on(event, callback);
    setEvents(prev => ({ ...prev, [event]: true }));
    
    return () => {
      eventBus.off(event, callback);
      setEvents(prev => {
        const newEvents = { ...prev };
        delete newEvents[event];
        return newEvents;
      });
    };
  }, []);
  
  const emit = useCallback((event, data) => {
    eventBus.emit(event, data);
  }, []);
  
  return { subscribe, emit };
}

// Esempio di utilizzo
function ComponentA() {
  const { emit } = useEventBus();
  
  const sendMessage = () => {
    emit('message', { text: 'Ciao da ComponentA!', timestamp: Date.now() });
  };
  
  return (
    <div>
      <h3>Componente A</h3>
      <button onClick={sendMessage}>Invia Messaggio</button>
    </div>
  );
}

function ComponentB() {
  const { subscribe } = useEventBus();
  const [messages, setMessages] = useState([]);
  
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
  );
}
```

#### Pattern 2: Custom Hooks per Logica Condivisa

```jsx
// Custom hook per gestione form
function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value, validationRules);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  
  const setTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name], validationRules);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    reset,
    isValid
  };
}

// Custom hook per gestione API
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  // Nota: Per caricare automaticamente i dati al mount serve useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, chiama fetchData manualmente.
  
  return { data, loading, error, refetch: fetchData };
}

// Utilizzo dei custom hooks
function UserForm() {
  const { values, errors, setValue, setTouched, reset, isValid } = useForm(
    { name: '', email: '' },
    {
      name: { required: true, minLength: 2 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    }
  );
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      console.log('Form valido:', values);
      reset();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.name}
        onChange={(e) => setValue('name', e.target.value)}
        onBlur={() => setTouched('name')}
        placeholder="Nome"
      />
      {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
      
      <input
        value={values.email}
        onChange={(e) => setValue('email', e.target.value)}
        onBlur={() => setTouched('email')}
        placeholder="Email"
      />
      {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
      
      <button type="submit" disabled={!isValid}>
        Invia
      </button>
    </form>
  );
}

function UserList() {
  const { data: users, loading, error, refetch } = useApi('/api/users');
  
  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;
  
  return (
    <div>
      <button onClick={refetch}>Ricarica</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 6. Evitare Prop Drilling

#### Problema del Prop Drilling:

```jsx
// ❌ Prop drilling - passaggio di props attraverso molti livelli
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <Header user={user} onUserChange={setUser} />
      <Main user={user} onUserChange={setUser} />
    </div>
  );
}

function Header({ user, onUserChange }) {
  return (
    <header>
      <Navigation user={user} onUserChange={onUserChange} />
    </header>
  );
}

function Navigation({ user, onUserChange }) {
  return (
    <nav>
      <UserMenu user={user} onUserChange={onUserChange} />
    </nav>
  );
}

function UserMenu({ user, onUserChange }) {
  return (
    <div>
      {user ? (
        <button onClick={() => onUserChange(null)}>Logout</button>
      ) : (
        <button onClick={() => onUserChange({ name: 'User' })}>Login</button>
      )}
    </div>
  );
}
```

#### Soluzioni per Evitare Prop Drilling:

**Soluzione 1: Context API**
```jsx
// ✅ Usando Context API
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        <Header />
        <Main />
      </div>
    </UserContext.Provider>
  );
}

function UserMenu() {
  const { user, setUser } = useContext(UserContext);
  
  return (
    <div>
      {user ? (
        <button onClick={() => setUser(null)}>Logout</button>
      ) : (
        <button onClick={() => setUser({ name: 'User' })}>Login</button>
      )}
    </div>
  );
}
```

**Soluzione 2: Component Composition**
```jsx
// ✅ Usando component composition
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <Header>
        <Navigation>
          <UserMenu user={user} onUserChange={setUser} />
        </Navigation>
      </Header>
      <Main user={user} />
    </div>
  );
}

function Header({ children }) {
  return <header>{children}</header>;
}

function Navigation({ children }) {
  return <nav>{children}</nav>;
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
```jsx
function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Errore nel caricamento utenti:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };
  
  // Nota: Il caricamento iniziale dei dati richiede useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, chiama fetchUsers manualmente
  // (ad esempio con un pulsante o al click dell'utente).
  
  const handleUserUpdate = (updatedUser) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    if (selectedUser?.id === updatedUser.id) {
      setSelectedUser(updatedUser);
    }
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
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
  );
}

function Sidebar({ users, selectedUser, onUserSelect, loading, onRefresh }) {
  return (
    <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Utenti</h2>
        <button onClick={onRefresh} disabled={loading}>
          {loading ? '⏳' : '🔄'}
        </button>
      </div>
      
      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
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
              }}
            >
              <strong>{user.name}</strong>
              <br />
              <small>{user.email}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MainContent({ selectedUser, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // Nota: Per sincronizzare editForm con selectedUser quando cambia serve useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, puoi aggiornare editForm
  // direttamente quando entra in modalità editing.
  
  const handleEdit = () => {
    setEditForm(selectedUser);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    onUserUpdate(editForm);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditForm(selectedUser);
    setIsEditing(false);
  };
  
  if (!selectedUser) {
    return (
      <div style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
        <h2>Seleziona un utente</h2>
        <p>Seleziona un utente dalla sidebar per visualizzare i dettagli</p>
      </div>
    );
  }
  
  return (
    <div style={{ flex: 1, padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dettagli Utente</h2>
        <button onClick={isEditing ? handleCancel : handleEdit}>
          {isEditing ? 'Annulla' : 'Modifica'}
        </button>
      </div>
      
      {isEditing ? (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <label>Nome:</label>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <button onClick={handleSave} style={{ marginRight: '10px' }}>
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
  );
}
```

### Esempio 2: Sistema di Notifiche con Context
```jsx
const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove dopo 5 secondi
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
    
    return id;
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve essere usato dentro NotificationProvider');
  }
  return context;
}

function NotificationButton() {
  const { addNotification } = useNotifications();
  
  const showSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Operazione completata con successo!',
      title: 'Successo'
    });
  };
  
  const showError = () => {
    addNotification({
      type: 'error',
      message: 'Si è verificato un errore durante l\'operazione.',
      title: 'Errore'
    });
  };
  
  const showWarning = () => {
    addNotification({
      type: 'warning',
      message: 'Attenzione: questa operazione non può essere annullata.',
      title: 'Attenzione'
    });
  };
  
  return (
    <div>
      <button onClick={showSuccess} style={{ marginRight: '10px' }}>
        Mostra Successo
      </button>
      <button onClick={showError} style={{ marginRight: '10px' }}>
        Mostra Errore
      </button>
      <button onClick={showWarning}>
        Mostra Avviso
      </button>
    </div>
  );
}

function NotificationList() {
  const { notifications, removeNotification, clearAll } = useNotifications();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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
  );
}

function NotificationItem({ notification, onRemove }) {
  const getStyle = (type) => {
    const styles = {
      success: { backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' },
      error: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' },
      warning: { backgroundColor: '#fff3cd', borderColor: '#ffeaa7', color: '#856404' },
      info: { backgroundColor: '#d1ecf1', borderColor: '#bee5eb', color: '#0c5460' }
    };
    return styles[type] || styles.info;
  };
  
  const style = getStyle(notification.type);
  
  return (
    <div style={{
      ...style,
      padding: '15px',
      marginBottom: '10px',
      border: '1px solid',
      borderRadius: '4px',
      minWidth: '300px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {notification.title && (
            <h4 style={{ margin: '0 0 5px 0' }}>{notification.title}</h4>
          )}
          <p style={{ margin: 0 }}>{notification.message}</p>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
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
  );
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
