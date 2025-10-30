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

React segue un principio fondamentale: **"Data flows down, events flow up"** (I dati scorrono verso il basso, gli eventi scorrono verso l'alto). Questo principio unidirezionale è alla base dell'architettura React e garantisce prevedibilità e facilità di debugging.

**Scopo e Importanza:**
Il flusso unidirezionale dei dati è uno dei pilastri fondamentali di React. Permette di:
- **Prevedibilità**: Il flusso dei dati è sempre chiaro e tracciabile
- **Debugging facilitato**: È più facile capire da dove arrivano i dati e come vengono modificati
- **Manutenibilità**: Codice più ordinato e facile da modificare
- **Performance**: React può ottimizzare il rendering sapendo esattamente quali componenti devono aggiornarsi

#### Principi del Flusso di Dati:
- **Unidirectional**: I dati fluiscono in una sola direzione (dall'alto verso il basso)
- **Props Down**: I dati vengono passati dai componenti padre ai figli tramite props
- **Events Up**: Gli eventi vengono comunicati dai figli al padre tramite callback functions
- **Single Source of Truth**: Lo stato dovrebbe essere mantenuto nel componente più vicino alla radice che ne ha bisogno

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ Definizione delle props del componente figlio
// Le props definiscono il "contratto" tra padre e figlio
interface ChildProps {
  count: number          // Prop: dato che viene passato dal padre
  onIncrement: () => void // Callback: funzione per comunicare con il padre
}

// ✅ Componente PADRE: mantiene lo stato e lo passa ai figli
function Parent() {
  // Lo stato è definito nel componente padre (Single Source of Truth)
  const [count, setCount] = useState<number>(0)
  
  // Funzione callback che viene passata al figlio
  // Quando il figlio chiama questa funzione, lo stato del padre viene aggiornato
  const handleIncrement = () => {
    setCount(prev => prev + 1)
  }
  
  return (
    <div>
      <h2>Parent: {count}</h2>
      
      {/* ✅ DATA FLOWS DOWN: Passiamo il valore count come prop */}
      {/* ✅ EVENTS FLOW UP: Passiamo la callback per permettere al figlio di aggiornare il padre */}
      <Child 
        count={count}                    // Prop: dato che scorre verso il basso
        onIncrement={handleIncrement}    // Callback: evento che scorre verso l'alto
      />
      
      {/* Possiamo avere più figli che condividono lo stesso stato */}
      <Child 
        count={count} 
        onIncrement={handleIncrement} 
      />
    </div>
  )
}

// ✅ Componente FIGLIO: riceve dati via props e comunica eventi via callback
function Child({ count, onIncrement }: ChildProps) {
  return (
    <div>
      {/* Mostra il valore ricevuto dal padre */}
      <p>Child: {count}</p>
      
      {/* Quando clicchiamo, chiamiamo la callback del padre */}
      {/* Questo è un "evento" che scorre verso l'alto */}
      <button onClick={onIncrement}>
        Incrementa
      </button>
    </div>
  )
}

// ✅ Esempio più complesso: comunicazione bidirezionale
interface CounterControlsProps {
  count: number
  onIncrement: () => void
  onDecrement: () => void
  onReset: () => void
}

function CounterControls({ count, onIncrement, onDecrement, onReset }: CounterControlsProps) {
  return (
    <div>
      <p>Valore corrente: {count}</p>
      
      {/* Tre callback diverse per tre azioni diverse */}
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}

function AdvancedParent() {
  const [count, setCount] = useState<number>(0)
  
  // Multiple callback functions per gestire diversi eventi
  const handleIncrement = () => setCount(prev => prev + 1)
  const handleDecrement = () => setCount(prev => prev - 1)
  const handleReset = () => setCount(0)
  
  return (
    <div>
      <h2>Controllo Avanzato</h2>
      <CounterControls
        count={count}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onReset={handleReset}
      />
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Il figlio cerca di modificare direttamente lo stato del padre
function BadChild({ count }: { count: number }) {
  // ❌ ERRORE: Non puoi modificare direttamente le props
  // count = count + 1  // Questo non funziona e causa errori!
  
  // ❌ ERRORE: Non puoi accedere direttamente allo stato del padre
  // setCount(count + 1)  // setCount non è disponibile qui
  
  // ✅ CORRETTO: Deve ricevere una callback dal padre
  return <div>{count}</div>
}

// ✅ CORRETTO: Il figlio usa una callback per comunicare con il padre
function GoodChild({ count, onIncrement }: { count: number, onIncrement: () => void }) {
  return (
    <div>
      <p>{count}</p>
      <button onClick={onIncrement}>Incrementa</button>
    </div>
  )
}
```

**Note Importanti:**
- **Props sono read-only**: I componenti figli non possono modificare direttamente le props ricevute
- **Callbacks necessarie**: Per permettere ai figli di comunicare con il padre, devi passare callback functions
- **Single Source of Truth**: Lo stato dovrebbe essere mantenuto nel componente più vicino alla radice che ne ha bisogno
- **Flusso unidirezionale**: Questo pattern garantisce che il flusso dei dati sia sempre prevedibile e tracciabile

### 2. Pattern "Lifting State Up"

Il **"lifting state up"** (sollevare lo stato) è il processo di spostare lo stato da un componente figlio a un componente padre per permettere la condivisione dello stato tra più componenti. Questo è uno dei pattern più importanti in React per gestire la comunicazione tra componenti.

**Scopo e Vantaggi:**
1. **Condivisione dello stato**: Permette a più componenti di accedere e modificare lo stesso stato
2. **Sincronizzazione**: Garantisce che i componenti fratelli siano sempre sincronizzati
3. **Single Source of Truth**: Mantiene un'unica fonte di verità per i dati
4. **Comunicazione tra fratelli**: Permette ai componenti fratelli di comunicare attraverso il padre
5. **Manutenibilità**: Centralizza la logica di gestione dello stato

**Quando Usare il Lifting State Up:**
- Quando più componenti hanno bisogno dello stesso stato
- Quando un componente figlio deve comunicare con un fratello
- Quando lo stato deve essere sincronizzato tra componenti
- Quando devi sincronizzare due input che rappresentano lo stesso dato in formati diversi

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ❌ STATO NEL COMPONENTE FIGLIO (non condivisibile)
// Problema: Ogni componente ha il proprio stato isolato
// Non possono sincronizzarsi tra loro
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

// ✅ STATO SOLLEVATO AL COMPONENTE PADRE
// Il componente diventa "controllato" (controlled component)
// Riceve il valore e la callback dal padre invece di gestire il proprio stato
interface TemperatureInputProps {
  scale: 'celsius' | 'fahrenheit'
  temperature: string                    // Valore controllato dal padre
  onTemperatureChange: (value: string) => void  // Callback per comunicare con il padre
}

function TemperatureInput({ scale, temperature, onTemperatureChange }: TemperatureInputProps) {
  return (
    <fieldset>
      <legend>Temperatura in {scale === 'celsius' ? 'Celsius' : 'Fahrenheit'}:</legend>
      <input
        type="number"
        value={temperature}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTemperatureChange(e.target.value)}
        placeholder={`Inserisci temperatura in ${scale === 'celsius' ? 'Celsius' : 'Fahrenheit'}`}
      />
    </fieldset>
  )
}

// ✅ COMPONENTE PADRE: Gestisce lo stato per entrambi i componenti figli
function TemperatureConverter() {
  // Lo stato è nel componente padre, può essere condiviso tra più figli
  const [celsius, setCelsius] = useState<string>('')
  const [fahrenheit, setFahrenheit] = useState<string>('')
  
  // ✅ Quando cambia Celsius, aggiorna anche Fahrenheit
  // La conversione è centralizzata nel padre
  const handleCelsiusChange = (value: string) => {
    setCelsius(value)
    // Converti Celsius in Fahrenheit
    if (value === '') {
      setFahrenheit('')
    } else {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        setFahrenheit((numValue * 9/5 + 32).toFixed(2))
      }
    }
  }
  
  // ✅ Quando cambia Fahrenheit, aggiorna anche Celsius
  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value)
    // Converti Fahrenheit in Celsius
    if (value === '') {
      setCelsius('')
    } else {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        setCelsius(((numValue - 32) * 5/9).toFixed(2))
      }
    }
  }
  
  return (
    <div>
      <h2>Convertitore di Temperatura</h2>
      
      {/* Due componenti figli che condividono lo stesso stato attraverso il padre */}
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
      
      {/* Mostra il risultato della conversione */}
      {celsius && fahrenheit && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <p><strong>{celsius}°C</strong> = <strong>{fahrenheit}°F</strong></p>
        </div>
      )}
    </div>
  )
}

// ✅ Esempio avanzato: Multiple inputs sincronizzati
function ColorPicker() {
  const [red, setRed] = useState<string>('0')
  const [green, setGreen] = useState<string>('0')
  const [blue, setBlue] = useState<string>('0')
  
  // Calcola il colore RGB risultante
  const rgbColor = `rgb(${red}, ${green}, ${blue})`
  
  const handleColorChange = (color: 'red' | 'green' | 'blue', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0))
    switch (color) {
      case 'red':
        setRed(String(numValue))
        break
      case 'green':
        setGreen(String(numValue))
        break
      case 'blue':
        setBlue(String(numValue))
        break
    }
  }
  
  return (
    <div>
      <h3>Color Picker</h3>
      
      {/* Tre input che condividono lo stato attraverso il padre */}
      <div>
        <label>
          Red:
          <input
            type="range"
            min="0"
            max="255"
            value={red}
            onChange={(e) => handleColorChange('red', e.target.value)}
          />
          <input
            type="number"
            min="0"
            max="255"
            value={red}
            onChange={(e) => handleColorChange('red', e.target.value)}
            style={{ width: '60px', marginLeft: '10px' }}
          />
        </label>
      </div>
      
      <div>
        <label>
          Green:
          <input
            type="range"
            min="0"
            max="255"
            value={green}
            onChange={(e) => handleColorChange('green', e.target.value)}
          />
          <input
            type="number"
            min="0"
            max="255"
            value={green}
            onChange={(e) => handleColorChange('green', e.target.value)}
            style={{ width: '60px', marginLeft: '10px' }}
          />
        </label>
      </div>
      
      <div>
        <label>
          Blue:
          <input
            type="range"
            min="0"
            max="255"
            value={blue}
            onChange={(e) => handleColorChange('blue', e.target.value)}
          />
          <input
            type="number"
            min="0"
            max="255"
            value={blue}
            onChange={(e) => handleColorChange('blue', e.target.value)}
            style={{ width: '60px', marginLeft: '10px' }}
          />
        </label>
      </div>
      
      {/* Preview del colore risultante */}
      <div
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: rgbColor,
          marginTop: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      <p>RGB: {rgbColor}</p>
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Stato duplicato in componenti separati
function BadTemperatureConverter() {
  return (
    <div>
      <TemperatureInputBad />  {/* Ha il proprio stato */}
      <TemperatureInputBad />  {/* Ha il proprio stato separato */}
      {/* ❌ PROBLEMA: I due input non possono sincronizzarsi! */}
    </div>
  )
}

// ✅ CORRETTO: Stato sollevato al padre
// Entrambi gli input condividono lo stato attraverso il padre
function GoodTemperatureConverter() {
  const [celsius, setCelsius] = useState<string>('')
  const [fahrenheit, setFahrenheit] = useState<string>('')
  
  // Logica di sincronizzazione centralizzata nel padre
  // ...
}
```

**Note Importanti:**
- **Controlled Components**: Quando sollevi lo stato, i componenti figli diventano "controllati" (controlled components) - ricevono il valore via props invece di gestire il proprio stato
- **Unidirectional Data Flow**: Il lifting state up rispetta il principio del flusso unidirezionale: dati verso il basso, eventi verso l'alto
- **Single Source of Truth**: Lo stato è mantenuto in un unico posto (il padre), evitando inconsistenze
- **Comunicazione tra fratelli**: I componenti fratelli possono comunicare solo attraverso il padre comune
- Non sollevare lo stato più in alto del necessario: mantieni lo stato il più vicino possibile ai componenti che lo usano

### 3. Comunicazione Padre-Figlio

La comunicazione tra componenti padre e figlio è il pattern più comune in React. Il padre passa dati ai figli tramite props, e i figli comunicano eventi al padre tramite callback functions.

#### Pattern 1: Props e Callback

Il pattern **Props e Callback** è il modo fondamentale per implementare la comunicazione padre-figlio in React. Il padre passa dati ai figli tramite props e riceve eventi tramite callback functions.

**Scopo e Vantaggi:**
1. **Semplicità**: Pattern diretto e facile da capire
2. **Tipizzazione**: TypeScript può verificare i tipi delle props e callback
3. **Performance**: React può ottimizzare il rendering basandosi sulle props
4. **Testabilità**: Facile da testare isolando i componenti
5. **Riutilizzabilità**: I componenti figli sono riutilizzabili con diverse callback

**Quando Usare questo Pattern:**
- Quando hai una relazione diretta padre-figlio
- Quando il figlio deve comunicare semplici eventi al padre
- Quando vuoi mantenere i componenti disaccoppiati e riutilizzabili
- Quando la comunicazione è locale e non attraversa molti livelli

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ Definizione delle interfacce per i Todo
interface Todo {
  id: number
  text: string
  completed: boolean
}

// ✅ COMPONENTE FIGLIO: Form per aggiungere nuovi todo
// Riceve una callback dal padre per comunicare quando un nuovo todo viene creato
interface TodoFormProps {
  onAddTodo: (text: string) => void  // Callback: comunica con il padre quando si aggiunge un todo
}

function TodoForm({ onAddTodo }: TodoFormProps) {
  // Stato locale per il testo dell'input (non condiviso con altri componenti)
  const [text, setText] = useState<string>('')
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (text.trim()) {
      // ✅ Chiama la callback del padre per comunicare il nuovo todo
      onAddTodo(text)
      // Reset del form dopo l'invio
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

// ✅ COMPONENTE FIGLIO: Filtro per i todo
// Riceve il valore corrente del filtro e una callback per cambiarlo
interface TodoFilterProps {
  filter: 'all' | 'active' | 'completed'  // Prop: valore corrente del filtro
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void  // Callback: comunica il cambio filtro
}

function TodoFilter({ filter, onFilterChange }: TodoFilterProps) {
  return (
    <div>
      {/* Ogni pulsante chiama la callback quando cliccato */}
      <button 
        onClick={() => onFilterChange('all')}
        style={{
          backgroundColor: filter === 'all' ? '#4CAF50' : '#f0f0f0',
          color: filter === 'all' ? 'white' : 'black',
          padding: '8px 16px',
          margin: '0 5px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Tutti
      </button>
      <button 
        onClick={() => onFilterChange('active')}
        style={{
          backgroundColor: filter === 'active' ? '#4CAF50' : '#f0f0f0',
          color: filter === 'active' ? 'white' : 'black',
          padding: '8px 16px',
          margin: '0 5px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Attivi
      </button>
      <button 
        onClick={() => onFilterChange('completed')}
        style={{
          backgroundColor: filter === 'completed' ? '#4CAF50' : '#f0f0f0',
          color: filter === 'completed' ? 'white' : 'black',
          padding: '8px 16px',
          margin: '0 5px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Completati
      </button>
    </div>
  )
}

// ✅ COMPONENTE FIGLIO: Lista dei todo
// Riceve l'array dei todo filtrati e una callback per toggleare lo stato
interface TodoListProps {
  todos: Todo[]                    // Prop: array dei todo da visualizzare
  onToggleTodo: (id: number) => void  // Callback: comunica quando un todo viene toggleato
}

function TodoList({ todos, onToggleTodo }: TodoListProps) {
  if (todos.length === 0) {
    return <p>Nessun todo disponibile</p>
  }
  
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
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

// ✅ COMPONENTE FIGLIO: Singolo item del todo
// Riceve un todo e una callback per cambiare il suo stato
interface TodoItemProps {
  todo: Todo                      // Prop: dati del todo
  onToggle: (id: number) => void  // Callback: comunica quando il checkbox viene cliccato
}

function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <li style={{
      padding: '10px',
      margin: '5px 0',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}  // ✅ Chiama la callback quando cambia
      />
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none',
        color: todo.completed ? '#999' : '#000',
        flex: 1
      }}>
        {todo.text}
      </span>
    </li>
  )
}

// ✅ COMPONENTE PADRE: Gestisce tutto lo stato e coordina i componenti figli
function TodoApp() {
  // Stato principale: lista di tutti i todo
  const [todos, setTodos] = useState<Todo[]>([])
  
  // Stato per il filtro corrente
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  
  // ✅ Callback per aggiungere un nuovo todo
  // Chiamata da TodoForm quando viene inviato il form
  const addTodo = (text: string) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }])
  }
  
  // ✅ Callback per cambiare lo stato di completamento di un todo
  // Chiamata da TodoItem quando viene cliccato il checkbox
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  // ✅ Stato derivato: filtra i todo in base al filtro corrente
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Lista Todo</h1>
      
      {/* ✅ Passa la callback per aggiungere todo */}
      <TodoForm onAddTodo={addTodo} />
      
      {/* ✅ Passa il valore del filtro e la callback per cambiarlo */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <TodoFilter filter={filter} onFilterChange={setFilter} />
      </div>
      
      {/* ✅ Passa i todo filtrati e la callback per toggleare */}
      <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} />
      
      {/* Statistiche */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <p>Totali: {todos.length} | Attivi: {todos.filter(t => !t.completed).length} | Completati: {todos.filter(t => t.completed).length}</p>
      </div>
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Il figlio cerca di modificare direttamente lo stato del padre
function BadTodoItem({ todo }: { todo: Todo }) {
  // ❌ ERRORE: Non puoi modificare direttamente le props
  const handleToggle = () => {
    todo.completed = !todo.completed  // Mutazione diretta - React non lo rileva!
  }
  
  // ✅ CORRETTO: Deve ricevere una callback dal padre
  return <div>{todo.text}</div>
}

// ✅ CORRETTO: Usa callback per comunicare con il padre
function GoodTodoItem({ todo, onToggle }: { todo: Todo, onToggle: (id: number) => void }) {
  return (
    <div onClick={() => onToggle(todo.id)}>
      {todo.text}
    </div>
  )
}
```

**Note Importanti:**
- **Props sono read-only**: I componenti figli non possono modificare direttamente le props
- **Callbacks per comunicazione**: Usa sempre callback per permettere ai figli di comunicare con il padre
- **Tipizzazione**: Tipizza sempre le props e le callback con TypeScript per sicurezza
- **Naming convention**: Usa il prefisso `on` per le callback (es. `onAddTodo`, `onToggleTodo`)
- **Propagazione degli eventi**: Le callback possono essere passate attraverso più livelli di componenti

#### Pattern 2: Render Props

Il pattern **Render Props** consiste nel passare una funzione come prop `children` (o con un nome specifico) che restituisce elementi React. Il componente padre gestisce la logica e passa i dati alla funzione render, permettendo al componente figlio di decidere come renderizzare i dati.

**Scopo e Vantaggi:**
1. **Condivisione di logica**: Un componente può condividere la sua logica con altri componenti senza duplicazione
2. **Flessibilità**: Il componente che usa il render prop ha il controllo completo su come renderizzare i dati
3. **Riutilizzabilità**: La stessa logica può essere usata con render diversi
4. **Separation of concerns**: Separa la logica dal rendering
5. **Composizione**: Permette composizione complessa di componenti

**Quando Usare Render Props:**
- Quando vuoi condividere logica complessa tra più componenti
- Quando il rendering deve essere completamente personalizzabile
- Quando vuoi evitare di creare componenti wrapper aggiuntivi
- Quando la logica deve essere riutilizzabile con diversi stili di rendering

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ Pattern Render Props: il componente riceve una funzione come children
// La funzione viene chiamata con i dati e le funzioni del componente provider
interface DataProviderProps {
  // children è una funzione che riceve props e restituisce ReactNode
  children: (props: {
    data: any              // Dati caricati
    loading: boolean       // Stato di caricamento
    error: string | null   // Eventuali errori
    fetchData: () => Promise<void>  // Funzione per caricare i dati
  }) => React.ReactNode
}

function DataProvider({ children }: DataProviderProps) {
  // ✅ Gestione dello stato interno del provider
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // ✅ Funzione per caricare i dati
  // Gestisce automaticamente loading, error e data
  const fetchData = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/data')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  // ✅ Chiama la funzione render passata come children
  // Passa tutti i dati e le funzioni necessarie
  return children({
    data,
    loading,
    error,
    fetchData
  }) as React.ReactElement
}

// ✅ Esempio di utilizzo base
function App() {
  return (
    <DataProvider>
      {/* ✅ La funzione riceve i dati e le funzioni dal provider */}
      {({ data, loading, error, fetchData }) => (
        <div>
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
          
          {error && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px'
            }}>
              Errore: {error}
            </div>
          )}
          
          {data && (
            <div style={{ marginTop: '20px' }}>
              <h2>Dati Caricati:</h2>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </DataProvider>
  )
}

// ✅ Esempio avanzato: Render Props con nome personalizzato
interface MouseTrackerProps {
  render: (props: { x: number; y: number }) => React.ReactNode
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }
  
  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh', width: '100vw' }}>
      {render(position)}
    </div>
  )
}

// Utilizzo con render prop personalizzato
function AppWithMouseTracker() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          <p>Posizione mouse: X={x}, Y={y}</p>
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}
    />
  )
}

// ✅ Esempio: Render Props per gestione form
interface FormState<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
}

interface FormProviderProps<T> {
  initialValues: T
  children: (props: FormState<T> & {
    setValue: (name: keyof T, value: any) => void
    setTouched: (name: string) => void
    reset: () => void
  }) => React.ReactNode
}

function FormProvider<T extends Record<string, any>>({ initialValues, children }: FormProviderProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }
  
  const setTouchedField = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }
  
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }
  
  const isValid = Object.keys(errors).length === 0
  
  return children({
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouched: setTouchedField,
    reset
  }) as React.ReactElement
}

// Utilizzo del FormProvider
interface UserFormData {
  name: string
  email: string
}

function UserForm() {
  return (
    <FormProvider<UserFormData>
      initialValues={{ name: '', email: '' }}
    >
      {({ values, errors, setValue, setTouched, reset, isValid }) => (
        <form onSubmit={(e) => {
          e.preventDefault()
          if (isValid) {
            console.log('Form valido:', values)
            reset()
          }
        }}>
          <div>
            <label>Nome:</label>
            <input
              value={values.name}
              onChange={(e) => setValue('name', e.target.value)}
              onBlur={() => setTouched('name')}
            />
            {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
          </div>
          
          <div>
            <label>Email:</label>
            <input
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              onBlur={() => setTouched('email')}
            />
            {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
          </div>
          
          <button type="submit" disabled={!isValid}>
            Invia
          </button>
        </form>
      )}
    </FormProvider>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Duplicare la logica in ogni componente
function BadDataFetcher1() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Logica duplicata...
  const fetchData = async () => {
    setLoading(true)
    // ... stessa logica in ogni componente
  }
  
  return <div>...</div>
}

function BadDataFetcher2() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // ❌ ERRORE: Stessa logica duplicata!
  const fetchData = async () => {
    setLoading(true)
    // ... stessa logica ripetuta
  }
  
  return <div>...</div>
}

// ✅ CORRETTO: Usa Render Props per condividere la logica
function GoodDataFetcher() {
  return (
    <DataProvider>
      {({ data, loading, error, fetchData }) => (
        <div>...</div>
      )}
    </DataProvider>
  )
}
```

**Note Importanti:**
- **children come funzione**: Nel pattern render props, `children` è una funzione, non un ReactNode
- **Flessibilità**: Il componente che usa il render prop decide come renderizzare i dati
- **Riutilizzabilità**: La stessa logica può essere usata con diversi stili di rendering
- **Alternativa ai HOC**: Render Props è un'alternativa ai Higher Order Components (HOC)
- **Performance**: Attenzione alle re-render: ogni volta che il provider si aggiorna, la funzione render viene chiamata di nuovo
- **Composizione**: Puoi comporre più render props insieme per logica complessa

### 4. Comunicazione tra Componenti Fratelli

I componenti fratelli (siblings) sono componenti che hanno lo stesso componente padre. In React, i componenti fratelli non possono comunicare direttamente tra loro - devono comunicare attraverso il padre comune usando il pattern "lifting state up" o tramite Context API.

#### Pattern 1: Stato Condiviso nel Padre

Il pattern dello **stato condiviso nel padre** consiste nel mantenere lo stato nel componente padre comune e passarlo come props ai componenti fratelli. I componenti fratelli comunicano modificando lo stato condiviso attraverso callback passate dal padre.

**Scopo e Vantaggi:**
1. **Comunicazione tra fratelli**: Permette ai componenti fratelli di comunicare attraverso il padre
2. **Sincronizzazione**: Garantisce che i componenti fratelli siano sempre sincronizzati
3. **Single Source of Truth**: Mantiene un'unica fonte di verità per i dati
4. **Semplicità**: Pattern diretto e facile da capire
5. **Type safety**: TypeScript può verificare i tipi delle props

**Quando Usare questo Pattern:**
- Quando hai componenti fratelli che devono condividere lo stesso stato
- Quando i componenti fratelli sono nello stesso livello dell'albero dei componenti
- Quando lo stato è relativamente locale e non serve stato globale
- Quando vuoi mantenere la logica di stato nel componente padre

**Esempio Pratico Completo:**

```tsx
import { useState } from 'react'

// ✅ Definizione delle interfacce
interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

// ✅ COMPONENTE FRATELLO 1: Header
// Mostra il conteggio degli item nel carrello e permette di aprire/chiudere il carrello
interface HeaderProps {
  itemCount: number           // Prop: numero totale di item nel carrello
  onCartToggle: () => void   // Callback: comunica quando il carrello deve essere aperto/chiuso
}

function Header({ itemCount, onCartToggle }: HeaderProps) {
  return (
    <header style={{
      padding: '20px',
      backgroundColor: '#333',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1>Shop</h1>
      {/* ✅ Usa la callback per comunicare con il padre */}
      <button 
        onClick={onCartToggle}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🛒 Carrello ({itemCount})
      </button>
    </header>
  )
}

// ✅ COMPONENTE FRATELLO 2: Lista Prodotti
// Permette di aggiungere prodotti al carrello
interface ProductListProps {
  onAddItem: (item: Product) => void  // Callback: comunica quando un prodotto viene aggiunto
}

function ProductList({ onAddItem }: ProductListProps) {
  // Lista statica di prodotti (in un'app reale, questi verrebbero da un'API)
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Tastiera', price: 79 },
    { id: 4, name: 'Monitor', price: 299 },
    { id: 5, name: 'Webcam', price: 89 }
  ]
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Prodotti Disponibili</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map(product => (
          <div 
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ marginTop: 0 }}>{product.name}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
              €{product.price.toFixed(2)}
            </p>
            {/* ✅ Usa la callback per comunicare con il padre */}
            <button 
              onClick={() => onAddItem(product)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              Aggiungi al Carrello
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ COMPONENTE FRATELLO 3: Sidebar del Carrello
// Mostra gli item nel carrello e permette di rimuoverli
interface CartSidebarProps {
  isOpen: boolean              // Prop: se il carrello è aperto o chiuso
  items: CartItem[]            // Prop: lista degli item nel carrello
  onRemoveItem: (id: number) => void  // Callback: comunica quando un item viene rimosso
  onClearCart: () => void      // Callback: comunica quando il carrello viene svuotato
  onClose: () => void          // Callback: comunica quando il carrello deve essere chiuso
}

function CartSidebar({ isOpen, items, onRemoveItem, onClearCart, onClose }: CartSidebarProps) {
  // Se il carrello non è aperto, non renderizzare nulla
  if (!isOpen) return null
  
  // Calcola il totale del carrello
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: 'white',
      borderLeft: '1px solid #ccc',
      padding: '20px',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      overflowY: 'auto'
    }}>
      {/* Header del carrello */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Carrello</h2>
        {/* ✅ Usa la callback per chiudere il carrello */}
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ✕
        </button>
      </div>
      
      {/* Lista degli item */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <p>Il carrello è vuoto</p>
          <p>👉 Aggiungi prodotti dalla lista!</p>
        </div>
      ) : (
        <>
          {items.map(item => (
            <div 
              key={item.id} 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              <div style={{ flex: 1 }}>
                <strong>{item.name}</strong>
                <br />
                <small>
                  €{item.price.toFixed(2)} × {item.quantity} = €{(item.price * item.quantity).toFixed(2)}
                </small>
              </div>
              {/* ✅ Usa la callback per rimuovere un item */}
              <button 
                onClick={() => onRemoveItem(item.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Rimuovi
              </button>
            </div>
          ))}
          
          {/* Totale e azioni */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #ddd'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <strong style={{ fontSize: '20px' }}>Totale:</strong>
              <strong style={{ fontSize: '20px', color: '#4CAF50' }}>
                €{total.toFixed(2)}
              </strong>
            </div>
            <button 
              onClick={onClearCart}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '10px'
              }}
            >
              Svuota Carrello
            </button>
            <button 
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Procedi al Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ✅ COMPONENTE PADRE: Gestisce lo stato condiviso tra i componenti fratelli
function ShoppingCart() {
  // ✅ STATO CONDIVISO: Gestito nel componente padre
  // Questo stato è accessibile a tutti i componenti fratelli attraverso le props
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  
  // ✅ Callback per aggiungere un item al carrello
  // Chiamata da ProductList quando un prodotto viene aggiunto
  const addItem = (item: Product) => {
    setItems(prev => {
      // Controlla se l'item esiste già nel carrello
      const existingItem = prev.find(i => i.id === item.id)
      if (existingItem) {
        // Se esiste, incrementa solo la quantità
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      // Se non esiste, aggiungi un nuovo item con quantità 1
      return [...prev, { ...item, quantity: 1 }]
    })
    // Apri automaticamente il carrello quando si aggiunge un item
    setCartOpen(true)
  }
  
  // ✅ Callback per rimuovere un item dal carrello
  // Chiamata da CartSidebar quando un item viene rimosso
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }
  
  // ✅ Callback per svuotare completamente il carrello
  // Chiamata da CartSidebar quando si clicca "Svuota Carrello"
  const clearCart = () => {
    setItems([])
  }
  
  // ✅ Calcola il numero totale di item nel carrello
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  return (
    <div>
      {/* ✅ COMPONENTE FRATELLO 1: Header */}
      {/* Passa il conteggio degli item e la callback per aprire/chiudere */}
      <Header 
        itemCount={itemCount}
        onCartToggle={() => setCartOpen(!cartOpen)}
      />
      
      {/* ✅ COMPONENTE FRATELLO 2: Lista Prodotti */}
      {/* Passa la callback per aggiungere prodotti */}
      <ProductList onAddItem={addItem} />
      
      {/* ✅ COMPONENTE FRATELLO 3: Sidebar Carrello */}
      {/* Passa lo stato del carrello e tutte le callback per gestirlo */}
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

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Stato duplicato nei componenti fratelli
function BadHeader() {
  const [itemCount, setItemCount] = useState(0)  // ❌ Stato locale isolato
  return <header>Carrello ({itemCount})</header>
}

function BadProductList() {
  const [cart, setCart] = useState([])  // ❌ Stato locale isolato
  
  // ❌ PROBLEMA: Header e ProductList non possono sincronizzarsi!
  // Ogni componente ha il proprio stato separato
  
  return <div>...</div>
}

// ✅ CORRETTO: Stato condiviso nel padre
function GoodShoppingCart() {
  const [items, setItems] = useState([])  // ✅ Stato unico nel padre
  
  // Tutti i componenti fratelli condividono lo stesso stato
  return (
    <div>
      <Header itemCount={items.length} />
      <ProductList onAddItem={...} />
    </div>
  )
}
```

**Note Importanti:**
- **Comunicazione indiretta**: I componenti fratelli comunicano solo attraverso il padre, non direttamente
- **Single Source of Truth**: Lo stato è mantenuto in un unico posto (il padre)
- **Callback multiple**: Il padre può passare callback diverse a ogni componente fratello
- **Performance**: React può ottimizzare il rendering solo aggiornando i componenti che usano lo stato modificato
- **Scalabilità**: Con molti componenti fratelli, considera Context API invece di passare molte props

#### Pattern 2: Context API per Stato Globale

Il pattern **Context API** permette di condividere stato globale tra componenti senza dover passare props attraverso ogni livello dell'albero dei componenti (prop drilling). È ideale per stato che viene usato da molti componenti distanti nell'albero.

**Scopo e Vantaggi:**
1. **Elimina prop drilling**: Evita di passare props attraverso molti livelli di componenti
2. **Stato globale**: Permette di condividere stato con componenti distanti nell'albero
3. **Centralizzazione**: Gestisce lo stato globale in un unico posto
4. **Performance**: React ottimizza automaticamente i re-render
5. **Type safety**: TypeScript può verificare i tipi del context

**Quando Usare Context API:**
- Quando devi condividere stato tra molti componenti distanti
- Quando il prop drilling diventa eccessivo (3+ livelli)
- Per stato globale come autenticazione, tema, preferenze utente
- Quando diversi componenti hanno bisogno dello stesso stato ma non sono direttamente collegati

**Esempio Pratico Completo:**

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

// ✅ Definizione delle interfacce
interface User {
  name: string
  id: number
}

interface Notification {
  id: number
  message: string
  timestamp: Date
}

// ✅ Definizione del tipo del Context Value
// Questo definisce cosa può essere accessibile tramite il Context
interface AppContextValue {
  // Stato
  user: User | null
  theme: 'light' | 'dark'
  notifications: Notification[]
  
  // Funzioni per modificare lo stato
  login: (userData: User) => void
  logout: () => void
  toggleTheme: () => void
  addNotification: (message: string) => void
  removeNotification: (id: number) => void
}

// ✅ Creazione del Context
// createContext crea un oggetto Context con un valore di default
// Il valore undefined indica che il Context deve essere usato dentro un Provider
const AppContext = createContext<AppContextValue | undefined>(undefined)

// ✅ Provider del Context
// Questo componente gestisce lo stato e lo rende disponibile a tutti i figli
interface AppProviderProps {
  children: ReactNode  // I componenti figli che possono usare il Context
}

function AppProvider({ children }: AppProviderProps) {
  // ✅ Gestione dello stato globale nel Provider
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // ✅ Funzioni per gestire lo stato globale
  const login = (userData: User) => {
    setUser(userData)
    // Aggiungi una notifica di benvenuto
    addNotification(`Benvenuto, ${userData.name}!`)
  }
  
  const logout = () => {
    setUser(null)
    addNotification('Logout effettuato con successo')
  }
  
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      addNotification(`Tema cambiato a ${newTheme}`)
      return newTheme
    })
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
  
  // ✅ Creazione del valore del Context
  // Questo oggetto viene passato a tutti i componenti che usano il Context
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
  
  // ✅ Provider component: rende il valore disponibile a tutti i figli
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// ✅ Hook personalizzato per usare il Context
// Questo hook semplifica l'uso del Context e aggiunge type safety
function useApp(): AppContextValue {
  const context = useContext(AppContext)
  
  // ✅ Verifica che il Context sia stato usato dentro un Provider
  if (!context) {
    throw new Error('useApp deve essere usato dentro AppProvider')
  }
  
  return context
}

// ✅ COMPONENTE CHE USA IL CONTEXT: Header
// Può accedere a user, theme e notifications senza prop drilling
function Header() {
  // ✅ Usa il hook personalizzato per accedere al Context
  const { user, theme, toggleTheme, notifications } = useApp()
  
  return (
    <header style={{
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#000' : '#fff',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme === 'light' ? '#ddd' : '#555'}`
    }}>
      <h1>App</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Mostra informazioni utente */}
        {user ? (
          <span>Ciao, <strong>{user.name}</strong>!</span>
        ) : (
          <span>Non loggato</span>
        )}
        
        {/* Toggle del tema */}
        <button 
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            backgroundColor: theme === 'light' ? '#333' : '#fff',
            color: theme === 'light' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {/* Badge delle notifiche */}
        {notifications.length > 0 && (
          <span style={{
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '50%',
            padding: '4px 8px',
            fontSize: '12px'
          }}>
            {notifications.length}
          </span>
        )}
      </div>
    </header>
  )
}

// ✅ COMPONENTE CHE USA IL CONTEXT: LoginForm
// Può chiamare login senza ricevere callback via props
function LoginForm() {
  const { login } = useApp()
  const [username, setUsername] = useState<string>('')
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username.trim()) {
      // ✅ Chiama la funzione login dal Context
      login({ name: username, id: Date.now() })
      setUsername('')
    }
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <input
        type="text"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        placeholder="Username"
        style={{
          padding: '10px',
          marginRight: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      />
      <button 
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Login
      </button>
    </form>
  )
}

// ✅ COMPONENTE CHE USA IL CONTEXT: UserInfo
// Mostra informazioni utente e permette logout
function UserInfo() {
  const { user, logout } = useApp()
  
  if (!user) {
    return <div style={{ padding: '20px' }}>Non sei loggato</div>
  }
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h3>Profilo Utente</h3>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>ID:</strong> {user.id}</p>
      <button 
        onClick={logout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Logout
      </button>
    </div>
  )
}

// ✅ COMPONENTE CHE USA IL CONTEXT: NotificationCenter
// Mostra e gestisce le notifiche
function NotificationCenter() {
  const { notifications, removeNotification } = useApp()
  
  if (notifications.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        Nessuna notifica
      </div>
    )
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>Notifiche ({notifications.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map(notification => (
          <li 
            key={notification.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              border: '1px solid #90caf9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <p style={{ margin: 0 }}>{notification.message}</p>
              <small style={{ color: '#666' }}>
                {notification.timestamp.toLocaleTimeString()}
              </small>
            </div>
            <button 
              onClick={() => removeNotification(notification.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ✅ COMPONENTE PRINCIPALE: App
// Wrappa tutti i componenti con il Provider
function App() {
  return (
    // ✅ AppProvider rende il Context disponibile a tutti i componenti figli
    <AppProvider>
      <div>
        <Header />
        <LoginForm />
        <UserInfo />
        <NotificationCenter />
      </div>
    </AppProvider>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Creare un Context per ogni singolo valore
const UserContext = createContext<User | null>(undefined)
const ThemeContext = createContext<'light' | 'dark'>('light')
const NotificationContext = createContext<Notification[]>([])

// ❌ ERRORE: Troppi Context creano complessità eccessiva
// È meglio raggruppare Context correlati

// ✅ CORRETTO: Raggruppa valori correlati in un unico Context
const AppContext = createContext<AppContextValue | undefined>(undefined)

// ❌ SBAGLIATO: Usare Context per stato locale
function BadComponent() {
  const [count, setCount] = useState(0)  // Stato locale
  
  return (
    <CountContext.Provider value={count}>
      {/* ❌ ERRORE: Context per stato usato solo da pochi componenti vicini */}
    </CountContext.Provider>
  )
}

// ✅ CORRETTO: Usa Context solo per stato globale
// Per stato locale, usa props normali o stato locale
```

**Note Importanti:**
- **Provider necessario**: I componenti devono essere wrappati con il Provider per usare il Context
- **Hook personalizzato**: Crea sempre un hook personalizzato per verificare che il Context sia usato correttamente
- **Performance**: Ogni componente che usa il Context si ri-renderizza quando il Context cambia. Considera di dividere Context grandi in più Context piccoli
- **Non abusare**: Non usare Context per stato che viene usato solo da pochi componenti vicini - usa props normali invece
- **Raggruppa valori correlati**: Raggruppa valori correlati in un unico Context invece di creare molti Context separati
- **Default value**: Il valore di default del Context viene usato solo se un componente usa il Context fuori dal Provider

### 5. Pattern di Comunicazione Avanzati

I pattern avanzati di comunicazione sono utili per casi specifici dove props e Context non sono sufficienti o non sono ideali.

#### Pattern 1: Event Bus (per componenti distanti)

Il pattern **Event Bus** implementa un sistema di pubblicazione/sottoscrizione (pub/sub) che permette a componenti distanti di comunicare senza conoscersi direttamente. Un componente può emettere eventi e altri componenti possono sottoscriversi per riceverli.

**Scopo e Vantaggi:**
1. **Comunicazione decoupled**: I componenti non devono conoscersi direttamente
2. **Comunicazione globale**: Permette comunicazione tra componenti molto distanti
3. **Eventi multipli**: Più componenti possono sottoscriversi allo stesso evento
4. **Flessibilità**: Facile aggiungere nuovi listener senza modificare i componenti esistenti
5. **Debugging**: Gli eventi possono essere loggati facilmente

**Quando Usare Event Bus:**
- Quando componenti molto distanti devono comunicare
- Quando vuoi comunicazione asincrona tra componenti
- Quando Context o props non sono pratici per il caso d'uso
- Per sistemi di notifiche globali o eventi applicazione-wide
- Con cautela: questo pattern può rendere il flusso dei dati meno prevedibile

**Esempio Pratico Completo:**

```tsx
import { useState, useCallback } from 'react'

// ✅ Tipo per le callback degli eventi
type EventCallback = (data: any) => void

// ✅ Classe Event Bus: gestisce pubblicazione e sottoscrizione agli eventi
class EventBus {
  // Mappa degli eventi: ogni evento ha un array di callback
  private events: Record<string, EventCallback[]> = {}
  
  // ✅ Sottoscrivi un listener a un evento specifico
  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  
  // ✅ Rimuovi un listener da un evento
  off(event: string, callback: EventCallback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
  
  // ✅ Emetti un evento: chiama tutti i listener sottoscritti
  emit(event: string, data: any): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
  
  // ✅ Rimuovi tutti i listener per un evento
  clear(event: string): void {
    if (this.events[event]) {
      delete this.events[event]
    }
  }
  
  // ✅ Ottieni il numero di listener per un evento (utile per debugging)
  listenerCount(event: string): number {
    return this.events[event]?.length || 0
  }
}

// ✅ Istanza singleton dell'Event Bus
const eventBus = new EventBus()

// ✅ Definizione degli eventi tipizzati
interface MessageEvent {
  text: string
  timestamp: number
  sender: string
}

interface UserLoginEvent {
  username: string
  timestamp: number
}

interface CartUpdateEvent {
  itemId: number
  action: 'add' | 'remove' | 'update'
}

// ✅ Hook per usare l'Event Bus in React
function useEventBus() {
  const [events, setEvents] = useState<Record<string, boolean>>({})
  
  // ✅ Funzione per sottoscriversi a un evento
  // Restituisce una funzione di cleanup per rimuovere il listener
  const subscribe = useCallback((event: string, callback: EventCallback) => {
    eventBus.on(event, callback)
    setEvents(prev => ({ ...prev, [event]: true }))
    
    // ✅ Funzione di cleanup: rimuove il listener quando il componente viene smontato
    return () => {
      eventBus.off(event, callback)
      setEvents(prev => {
        const newEvents = { ...prev }
        delete newEvents[event]
        return newEvents
      })
    }
  }, [])
  
  // ✅ Funzione per emettere un evento
  const emit = useCallback((event: string, data: any) => {
    eventBus.emit(event, data)
  }, [])
  
  return { subscribe, emit }
}

// ✅ COMPONENTE A: Emette eventi
function ComponentA() {
  const { emit } = useEventBus()
  
  const sendMessage = () => {
    // ✅ Emetti un evento 'message' con i dati
    emit('message', {
      text: 'Ciao da ComponentA!',
      timestamp: Date.now(),
      sender: 'ComponentA'
    } as MessageEvent)
  }
  
  const notifyLogin = () => {
    // ✅ Emetti un evento 'user-login'
    emit('user-login', {
      username: 'Mario',
      timestamp: Date.now()
    } as UserLoginEvent)
  }
  
  return (
    <div style={{
      padding: '20px',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      margin: '10px'
    }}>
      <h3>Componente A</h3>
      <button 
        onClick={sendMessage}
        style={{
          padding: '10px 20px',
          margin: '5px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Invia Messaggio
      </button>
      <button 
        onClick={notifyLogin}
        style={{
          padding: '10px 20px',
          margin: '5px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Simula Login
      </button>
    </div>
  )
}

// ✅ COMPONENTE B: Ascolta eventi
function ComponentB() {
  const { subscribe } = useEventBus()
  const [messages, setMessages] = useState<MessageEvent[]>([])
  
  // ⚠️ NOTA: Per sottoscriversi agli eventi serve useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, questo esempio mostra
  // solo la struttura del componente con useState.
  
  // Quando useEffect sarà disponibile, userai così:
  // useEffect(() => {
  //   const unsubscribe = subscribe('message', (data: MessageEvent) => {
  //     setMessages(prev => [...prev, data])
  //   })
  //   return unsubscribe  // Cleanup quando il componente viene smontato
  // }, [subscribe])
  
  return (
    <div style={{
      padding: '20px',
      border: '2px solid #2196F3',
      borderRadius: '8px',
      margin: '10px'
    }}>
      <h3>Componente B (Ricevitore Messaggi)</h3>
      {messages.length === 0 ? (
        <p style={{ color: '#999' }}>Nessun messaggio ricevuto</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {messages.map((msg, index) => (
            <li 
              key={index}
              style={{
                padding: '10px',
                marginBottom: '5px',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px'
              }}
            >
              <strong>{msg.sender}:</strong> {msg.text}
              <br />
              <small style={{ color: '#666' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ✅ Esempio avanzato: Sistema di notifiche con Event Bus
function NotificationButton() {
  const { emit } = useEventBus()
  
  const showSuccess = () => {
    emit('notification', {
      type: 'success',
      message: 'Operazione completata!',
      timestamp: Date.now()
    })
  }
  
  const showError = () => {
    emit('notification', {
      type: 'error',
      message: 'Si è verificato un errore!',
      timestamp: Date.now()
    })
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>Controlli Notifiche</h3>
      <button onClick={showSuccess} style={{ marginRight: '10px' }}>
        Mostra Successo
      </button>
      <button onClick={showError}>
        Mostra Errore
      </button>
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Usare Event Bus invece di props semplici
function BadParent() {
  const { emit } = useEventBus()
  
  const handleClick = () => {
    // ❌ ERRORE: Usare Event Bus per comunicazione padre-figlio diretto
    // È molto più semplice usare props e callback!
    emit('child-click', { data: 'test' })
  }
  
  return <Child onClick={handleClick} />  // ✅ CORRETTO: Usa props
}

// ✅ CORRETTO: Usa Event Bus solo quando necessario
// Per esempio, quando componenti molto distanti devono comunicare
```

**Note Importanti:**
- **Usa con cautela**: L'Event Bus può rendere il flusso dei dati meno prevedibile rispetto a props e Context
- **Cleanup necessario**: Ricorda sempre di rimuovere i listener quando il componente viene smontato (usa useEffect con cleanup)
- **Type safety**: Tipizza gli eventi per sicurezza, anche se TypeScript non può verificare tutto a compile-time
- **Alternativa**: In molti casi, Context API è preferibile all'Event Bus perché più prevedibile
- **Debugging**: Gli eventi possono essere loggati facilmente per debugging
- **Performance**: Il pattern Event Bus è leggero ma può causare molti re-render se non gestito correttamente

#### Pattern 2: Custom Hooks per Logica Condivisa

I **Custom Hooks** sono funzioni che iniziano con `use` e possono utilizzare altri hook di React. Permettono di estrarre logica riutilizzabile da componenti, rendendo il codice più pulito, testabile e riutilizzabile.

**Scopo e Vantaggi:**
1. **Riutilizzabilità**: La stessa logica può essere usata in più componenti
2. **Separazione delle responsabilità**: Separa la logica dalla presentazione
3. **Testabilità**: I custom hooks possono essere testati indipendentemente
4. **Leggibilità**: I componenti diventano più semplici e facili da capire
5. **Manutenibilità**: Modifiche alla logica richiedono modifiche in un solo posto

**Quando Usare Custom Hooks:**
- Quando la stessa logica viene usata in più componenti
- Quando un componente diventa troppo complesso
- Quando vuoi condividere logica tra componenti senza prop drilling
- Per logica comune come form handling, API calls, localStorage, ecc.

**Esempio Pratico Completo:**

```tsx
import { useState, useCallback } from 'react'

// ✅ Custom Hook per gestione form con validazione
// Questo hook gestisce valori, errori, touched state e validazione
interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
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

// ✅ Funzione helper per validare un singolo campo
function validateField(name: string, value: any, rules: ValidationRules): string {
  const rule = rules[name]
  if (!rule) return ''
  
  // Validazione: campo richiesto
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${name} è richiesto`
  }
  
  // Validazione: lunghezza minima
  if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
    return `${name} deve essere almeno ${rule.minLength} caratteri`
  }
  
  // Validazione: lunghezza massima
  if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
    return `${name} non può superare ${rule.maxLength} caratteri`
  }
  
  // Validazione: pattern (regex)
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return `${name} non è valido`
  }
  
  // Validazione: funzione custom
  if (rule.custom) {
    const customResult = rule.custom(value)
    if (typeof customResult === 'string') return customResult
    if (customResult === false) return `${name} non è valido`
  }
  
  return ''
}

// ✅ Custom Hook: useForm
// Gestisce lo stato del form, validazione e touched state
function useForm<T extends FormValues>(initialValues: T, validationRules: ValidationRules) {
  // Stato: valori del form
  const [values, setValues] = useState<T>(initialValues)
  
  // Stato: errori di validazione
  const [errors, setErrors] = useState<FormErrors>({})
  
  // Stato: campi che sono stati toccati (per mostrare errori solo dopo interazione)
  const [touched, setTouchedState] = useState<FormTouched>({})
  
  // ✅ Funzione per aggiornare un valore del form
  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Se il campo è stato toccato, valida immediatamente
    if (touched[name as string]) {
      const error = validateField(name as string, value, validationRules)
      setErrors(prev => ({ ...prev, [name as string]: error }))
    }
  }
  
  // ✅ Funzione per marcare un campo come "touched"
  const setTouched = (name: string) => {
    setTouchedState(prev => ({ ...prev, [name]: true }))
    // Valida il campo quando viene toccato
    const error = validateField(name, values[name], validationRules)
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  // ✅ Funzione per resettare il form ai valori iniziali
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouchedState({})
  }
  
  // ✅ Calcola se il form è valido (nessun errore)
  const isValid = Object.values(errors).every(error => error === '')
  
  return {
    values,       // Valori correnti del form
    errors,       // Errori di validazione
    touched,      // Campi toccati
    setValue,     // Funzione per aggiornare un valore
    setTouched,   // Funzione per marcare un campo come touched
    reset,        // Funzione per resettare il form
    isValid       // Se il form è valido
  }
}

// ✅ Custom Hook: useApi
// Gestisce chiamate API con loading, error e data states
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // ✅ Funzione per caricare i dati
  // useCallback per evitare ricreazioni della funzione ad ogni render
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result as T)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [url])
  
  // ⚠️ NOTA: Per caricare automaticamente i dati al mount serve useEffect,
  // che verrà spiegato nella Lezione 12. Per ora, chiama fetchData manualmente.
  
  return { 
    data,       // Dati caricati
    loading,    // Stato di caricamento
    error,      // Eventuali errori
    refetch: fetchData  // Funzione per ricaricare i dati
  }
}

// ✅ Esempio di utilizzo del Custom Hook useForm
interface UserFormData {
  name: string
  email: string
  password: string
}

function UserForm() {
  // ✅ Usa il custom hook per gestire il form
  const { values, errors, setValue, setTouched, reset, isValid } = useForm<UserFormData>(
    { name: '', email: '', password: '' },
    {
      name: { 
        required: true, 
        minLength: 2,
        maxLength: 50
      },
      email: { 
        required: true, 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
      },
      password: { 
        required: true, 
        minLength: 8,
        custom: (value) => {
          if (!/(?=.*[A-Z])/.test(value)) {
            return 'La password deve contenere almeno una lettera maiuscola'
          }
          if (!/(?=.*[0-9])/.test(value)) {
            return 'La password deve contenere almeno un numero'
          }
          return true
        }
      }
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label>
          Nome:
          <input
            type="text"
            value={values.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('name', e.target.value)}
            onBlur={() => setTouched('name')}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderRadius: '4px',
              border: errors.name ? '2px solid red' : '1px solid #ddd'
            }}
          />
        </label>
        {errors.name && touched.name && (
          <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Email:
          <input
            type="email"
            value={values.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('email', e.target.value)}
            onBlur={() => setTouched('email')}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderRadius: '4px',
              border: errors.email ? '2px solid red' : '1px solid #ddd'
            }}
          />
        </label>
        {errors.email && touched.email && (
          <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>
          Password:
          <input
            type="password"
            value={values.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('password', e.target.value)}
            onBlur={() => setTouched('password')}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderRadius: '4px',
              border: errors.password ? '2px solid red' : '1px solid #ddd'
            }}
          />
        </label>
        {errors.password && touched.password && (
          <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={!isValid}
        style={{
          padding: '10px 20px',
          backgroundColor: isValid ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isValid ? 'pointer' : 'not-allowed'
        }}
      >
        Invia
      </button>
    </form>
  )
}

// ✅ Esempio di utilizzo del Custom Hook useApi
interface User {
  id: number
  name: string
  email: string
}

function UserList() {
  // ✅ Usa il custom hook per gestire la chiamata API
  const { data: users, loading, error, refetch } = useApi<User[]>('/api/users')
  
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Caricamento...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          Errore: {error}
        </div>
        <button 
          onClick={refetch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Riprova
        </button>
      </div>
    )
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Lista Utenti</h2>
        <button 
          onClick={refetch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ricarica
        </button>
      </div>
      
      {users && users.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map(user => (
            <li 
              key={user.id}
              style={{
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessun utente trovato</p>
      )}
    </div>
  )
}
```

**❌ Anti-Pattern da Evitare:**

```tsx
// ❌ SBAGLIATO: Duplicare la logica in ogni componente
function BadForm1() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  // ... stessa logica ripetuta
}

function BadForm2() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  // ❌ ERRORE: Stessa logica duplicata!
}

// ✅ CORRETTO: Estrarre la logica in un custom hook
function GoodForm() {
  const { values, errors, setValue, setTouched } = useForm(...)
  // Logica riutilizzabile!
}
```

**Note Importanti:**
- **Naming convention**: I custom hooks devono iniziare con `use` per seguire le regole di React
- **Riutilizzabilità**: Estrai logica quando viene usata in più componenti
- **Testabilità**: I custom hooks possono essere testati indipendentemente dai componenti
- **Composizione**: Puoi comporre più custom hooks insieme per logica complessa
- **Separazione**: Separare logica dalla presentazione rende il codice più pulito
- **Performance**: Usa `useCallback` e `useMemo` quando necessario per ottimizzare le performance

### 6. Evitare Prop Drilling

Il **prop drilling** è il problema di dover passare props attraverso molti livelli di componenti intermedi che non usano realmente quelle props, ma le passano solo ai componenti figli. Questo rende il codice verboso, difficile da mantenere e propenso a errori.

**Scopo e Problema:**
Il prop drilling si verifica quando:
- Un componente ha bisogno di accedere a props che provengono da un componente molto più in alto nell'albero
- I componenti intermedi devono ricevere e passare props che non usano realmente
- Il codice diventa verboso e difficile da mantenere
- Modifiche alle props richiedono modifiche in molti componenti

**Soluzioni Principali:**
1. **Context API**: Per stato globale condiviso da molti componenti
2. **Component Composition**: Per evitare di passare props attraverso molti livelli
3. **Custom Hooks**: Per estrarre logica e condividerla senza prop drilling

#### Problema del Prop Drilling:

```tsx
import { useState } from 'react'

// ❌ PROP DRILLING: Passaggio di props attraverso molti livelli
// Ogni componente intermedio deve ricevere e passare le props
// anche se non le usa direttamente
interface User {
  name: string
}

// ✅ Componente App: gestisce lo stato
interface AppProps {
  user: User | null
  onUserChange: (user: User | null) => void
}

function Header({ user, onUserChange }: AppProps) {
  // ❌ Header non usa user e onUserChange, ma deve passarli a Navigation
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
  // ❌ Navigation non usa user e onUserChange, ma deve passarli a UserMenu
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
  // ✅ Solo UserMenu usa realmente user e onUserChange
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

function AppBad() {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <div>
      {/* ❌ PROBLEMA: user e onUserChange devono essere passati attraverso 
          Header -> Navigation -> UserMenu anche se Header e Navigation non li usano */}
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

// ✅ SOLUZIONE CON CONTEXT API
// Il Context elimina la necessità di passare props attraverso componenti intermedi
interface User {
  name: string
}

// ✅ Definizione del Context Value
interface UserContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

// ✅ Creazione del Context
const UserContext = createContext<UserContextValue | undefined>(undefined)

// ✅ Provider che wrappa l'applicazione
function App() {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    // ✅ Il Provider rende user e setUser disponibili a tutti i componenti figli
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        {/* ✅ Header e Navigation non devono più ricevere props! */}
        <Header />
        <Main />
      </div>
    </UserContext.Provider>
  )
}

// ✅ Hook personalizzato per usare il Context
function useUser(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser deve essere usato dentro UserContext.Provider')
  }
  return context
}

// ✅ Header: non deve più ricevere props!
function Header() {
  return (
    <header>
      {/* ✅ Navigation non deve più ricevere props! */}
      <Navigation />
    </header>
  )
}

// ✅ Navigation: non deve più ricevere props!
function Navigation() {
  return (
    <nav>
      {/* ✅ UserMenu può accedere direttamente al Context */}
      <UserMenu />
    </nav>
  )
}

// ✅ UserMenu: usa il Context invece di ricevere props
function UserMenu() {
  // ✅ Accede direttamente al Context, senza prop drilling!
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

// ✅ Main: può anche usare il Context se necessario
function Main() {
  // ✅ Può accedere al Context senza prop drilling
  const { user } = useUser()
  return <main>Main content - User: {user?.name || 'Not logged in'}</main>
}
```

**Soluzione 2: Component Composition**
```tsx
import { useState, ReactNode } from 'react'

// ✅ SOLUZIONE CON COMPONENT COMPOSITION
// Usa children per evitare di passare props attraverso componenti intermedi
interface User {
  name: string
}

// ✅ Header: riceve children invece di props specifiche
interface HeaderProps {
  children: ReactNode  // ✅ Accetta qualsiasi contenuto come children
}

function Header({ children }: HeaderProps) {
  return <header>{children}</header>
}

// ✅ Navigation: riceve children invece di props specifiche
interface NavigationProps {
  children: ReactNode
}

function Navigation({ children }: NavigationProps) {
  return <nav>{children}</nav>
}

// ✅ UserMenu: riceve solo le props che realmente usa
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

// ✅ Main: riceve solo le props che usa
function Main({ user }: { user: User | null }) {
  return <main>Main content - User: {user?.name || 'Not logged in'}</main>
}

// ✅ App: compone i componenti passando props direttamente dove servono
function App() {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <div>
      {/* ✅ Component Composition: passa UserMenu direttamente attraverso Header e Navigation
          senza che questi debbano gestire le props */}
      <Header>
        <Navigation>
          <UserMenu user={user} onUserChange={setUser} />
        </Navigation>
      </Header>
      
      {/* ✅ Main riceve user direttamente, senza prop drilling */}
      <Main user={user} />
    </div>
  )
}
```

**Confronto delle Soluzioni:**

| Soluzione | Quando Usare | Vantaggi | Svantaggi |
|-----------|--------------|----------|-----------|
| **Context API** | Stato globale condiviso da molti componenti | Elimina completamente prop drilling, accesso globale | Può causare re-render se non gestito correttamente |
| **Component Composition** | Componenti che devono essere composti in modo flessibile | Nessuna dipendenza aggiuntiva, molto flessibile | Richiede ristrutturazione del codice |
| **Custom Hooks** | Logica condivisa tra componenti | Riutilizzabile, testabile, separa logica | Non risolve direttamente il prop drilling |

**Note Importanti:**
- **Context API**: Usa quando lo stato è globale e condiviso da molti componenti distanti
- **Component Composition**: Usa quando vuoi evitare di passare props attraverso componenti wrapper
- **Custom Hooks**: Usa per estrarre logica riutilizzabile, ma non elimina completamente il prop drilling per i dati
- **Non abusare**: Non usare Context per stato locale che viene usato solo da pochi componenti vicini
- **Performance**: Context può causare re-render di tutti i componenti che lo usano quando cambia - considera di dividere Context grandi

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
